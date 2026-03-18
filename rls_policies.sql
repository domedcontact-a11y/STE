-- Advanced Row Level Security (RLS) & Role-Based Access Control (RBAC)

-- 1. Setup Enums and Missing Columns
DO $$ BEGIN
    CREATE TYPE activity_category AS ENUM ('fabrication', 'delivery', 'erection', 'inspection');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='activities' AND column_name='category') THEN
        ALTER TABLE activities ADD COLUMN category activity_category DEFAULT 'fabrication' NOT NULL;
    END IF;
END $$;

-- Ensure all tables have organization_id
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='organization_id') THEN ALTER TABLE projects ADD COLUMN organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='drawings' AND column_name='organization_id') THEN ALTER TABLE drawings ADD COLUMN organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='assemblies' AND column_name='organization_id') THEN ALTER TABLE assemblies ADD COLUMN organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='elements' AND column_name='organization_id') THEN ALTER TABLE elements ADD COLUMN organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='activities' AND column_name='organization_id') THEN ALTER TABLE activities ADD COLUMN organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='resources' AND column_name='organization_id') THEN ALTER TABLE resources ADD COLUMN organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE; END IF;
END $$;

-- 2. Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE drawings ENABLE ROW LEVEL SECURITY;
ALTER TABLE assemblies ENABLE ROW LEVEL SECURITY;
ALTER TABLE elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- 3. Core Helper Functions
CREATE OR REPLACE FUNCTION get_my_orgs()
RETURNS SETOF UUID AS $$
BEGIN
  RETURN QUERY SELECT organization_id FROM memberships WHERE user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_my_role(org_id UUID)
RETURNS TEXT AS $$
DECLARE
  role_name TEXT;
BEGIN
  SELECT role INTO role_name FROM memberships WHERE user_id = auth.uid() AND organization_id = org_id;
  RETURN COALESCE(role_name, 'viewer');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Clean up existing policies & triggers
DO $$ 
DECLARE 
  t text; 
BEGIN 
  FOR t IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('projects', 'drawings', 'assemblies', 'elements', 'activities', 'resources')
  LOOP 
    EXECUTE format('DROP POLICY IF EXISTS "Tenant Select" ON %I;', t);
    EXECUTE format('DROP POLICY IF EXISTS "Tenant Insert" ON %I;', t);
    EXECUTE format('DROP POLICY IF EXISTS "Tenant Update" ON %I;', t);
    EXECUTE format('DROP POLICY IF EXISTS "Tenant Delete" ON %I;', t);
  END LOOP; 
END $$;

DROP POLICY IF EXISTS "Users can see their organizations" ON organizations;
DROP POLICY IF EXISTS "Users can see their own memberships" ON memberships;
DROP POLICY IF EXISTS "Owners/Admins can see all members" ON memberships;
DROP POLICY IF EXISTS "Owners/Admins/Managers can manage members" ON memberships;

-- 5. Organization & Membership Policies
CREATE POLICY "Users can see their organizations" ON organizations FOR SELECT USING (id IN (SELECT get_my_orgs()));

CREATE POLICY "Users can see their own memberships" ON memberships FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Owners/Admins can see all members" ON memberships FOR SELECT USING (organization_id IN (SELECT get_my_orgs()));

-- Managers, Admins, Owners can manage memberships
CREATE POLICY "Owners/Admins/Managers can manage members" ON memberships FOR ALL USING (
  get_my_role(organization_id) IN ('owner', 'admin', 'manager')
);

-- 6. Generic Construction Data Policies (Projects, Drawings, Assemblies, Elements, Resources)
DO $$
DECLARE
  table_name_var TEXT;
  tables_list TEXT[] := ARRAY['projects', 'drawings', 'assemblies', 'elements', 'resources'];
BEGIN
  FOREACH table_name_var IN ARRAY tables_list LOOP
    -- SELECT: All members can read (Viewer and up)
    EXECUTE format('CREATE POLICY "Tenant Select" ON %I FOR SELECT USING (organization_id IN (SELECT get_my_orgs()));', table_name_var);
    
    -- INSERT/UPDATE/DELETE: Owner, Admin, Manager only
    EXECUTE format('CREATE POLICY "Tenant Insert" ON %I FOR INSERT WITH CHECK (get_my_role(organization_id) IN (''owner'', ''admin'', ''manager''));', table_name_var);
    EXECUTE format('CREATE POLICY "Tenant Update" ON %I FOR UPDATE USING (get_my_role(organization_id) IN (''owner'', ''admin'', ''manager''));', table_name_var);
    EXECUTE format('CREATE POLICY "Tenant Delete" ON %I FOR DELETE USING (get_my_role(organization_id) IN (''owner'', ''admin'', ''manager''));', table_name_var);
  END LOOP;
END $$;

-- 7. Specialized Policies for Activities (Category-based)
CREATE POLICY "Tenant Select" ON activities FOR SELECT USING (organization_id IN (SELECT get_my_orgs()));
CREATE POLICY "Tenant Insert" ON activities FOR INSERT WITH CHECK (get_my_role(organization_id) IN ('owner', 'admin', 'manager'));
CREATE POLICY "Tenant Delete" ON activities FOR DELETE USING (get_my_role(organization_id) IN ('owner', 'admin', 'manager'));

CREATE POLICY "Tenant Update" ON activities FOR UPDATE USING (
  get_my_role(organization_id) IN ('owner', 'admin', 'manager')
  OR (get_my_role(organization_id) = 'supervisor_shop' AND category = 'fabrication')
  OR (get_my_role(organization_id) = 'supervisor_construction' AND category IN ('delivery', 'erection'))
  OR (get_my_role(organization_id) = 'inspector_quality' AND category = 'inspection')
);

-- 8. Column-Level Protection Trigger for Activities
-- Ensures supervisors/inspectors can ONLY update status, progress, actual_start, actual_end
CREATE OR REPLACE FUNCTION protect_activity_columns()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
BEGIN
  user_role := get_my_role(NEW.organization_id);

  IF user_role IN ('supervisor_shop', 'supervisor_construction', 'inspector_quality') THEN
    -- Prevent modification of restricted columns
    IF NEW.id != OLD.id OR 
       NEW.element_id != OLD.element_id OR 
       NEW.organization_id != OLD.organization_id OR 
       NEW.name != OLD.name OR 
       NEW.category != OLD.category OR 
       NEW.planned_start IS DISTINCT FROM OLD.planned_start OR 
       NEW.planned_end IS DISTINCT FROM OLD.planned_end 
    THEN
      RAISE EXCEPTION 'Role % is not authorized to modify core activity metadata.', user_role;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_activity_columns ON activities;
CREATE TRIGGER enforce_activity_columns
  BEFORE UPDATE ON activities
  FOR EACH ROW
  EXECUTE FUNCTION protect_activity_columns();
  
-- 9. Tenant Integrity Triggers
-- Ensures that children cannot be created in a different organization than their parent
CREATE OR REPLACE FUNCTION validate_tenant_integrity()
RETURNS TRIGGER AS $$
DECLARE
  parent_org_id UUID;
BEGIN
  IF TG_TABLE_NAME = 'drawings' THEN
    SELECT organization_id INTO parent_org_id FROM projects WHERE id = NEW.project_id;
  ELSIF TG_TABLE_NAME = 'assemblies' THEN
    SELECT organization_id INTO parent_org_id FROM drawings WHERE id = NEW.drawing_id;
  ELSIF TG_TABLE_NAME = 'elements' THEN
    SELECT organization_id INTO parent_org_id FROM assemblies WHERE id = NEW.assembly_id;
  ELSIF TG_TABLE_NAME = 'activities' THEN
    SELECT organization_id INTO parent_org_id FROM elements WHERE id = NEW.element_id;
  ELSIF TG_TABLE_NAME = 'resources' THEN
    SELECT organization_id INTO parent_org_id FROM activities WHERE id = NEW.activity_id;
  END IF;

  IF parent_org_id IS NULL THEN
    RAISE EXCEPTION 'Security Exception: Parent record not found or access denied across tenant boundary.';
  ELSIF NEW.organization_id != parent_org_id THEN
    RAISE EXCEPTION 'Tenant mismatch: child organization % does not match parent organization %', NEW.organization_id, parent_org_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply validation triggers
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' 
    AND table_name IN ('drawings', 'assemblies', 'elements', 'activities', 'resources')
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trigger_validate_tenant ON %I', t);
    EXECUTE format('CREATE TRIGGER trigger_validate_tenant BEFORE INSERT OR UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION validate_tenant_integrity();', t);
  END LOOP;
END $$;
