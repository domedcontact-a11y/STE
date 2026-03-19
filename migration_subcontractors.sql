-- Migration: Insert Subcontractors & Rename Activity Category
-- 1. Safely wipe existing volatile data at the drawing level to allow strict NOT NULL reparenting 
DELETE FROM drawings;

-- 2. Create the missing Subcontractors tier
CREATE TABLE IF NOT EXISTS subcontractors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_subcontractors_project ON subcontractors(project_id);

-- 3. Reroute Drawings to point to Subcontractors instead of Projects
ALTER TABLE drawings DROP COLUMN IF EXISTS project_id CASCADE;
ALTER TABLE drawings ADD COLUMN subcontractor_id UUID NOT NULL REFERENCES subcontractors(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_drawings_subcontractor ON drawings(subcontractor_id);

-- 4. Rename Activity enum and column to match rigid 'type' requirement
ALTER TYPE activity_category RENAME TO activity_type;
ALTER TABLE activities RENAME COLUMN category TO type;

-- 5. Enable RLS on Subcontractors
ALTER TABLE subcontractors ENABLE ROW LEVEL SECURITY;
