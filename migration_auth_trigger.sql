-- ============================================================
-- Auth Provisioning Trigger: handle_new_user
-- Fires AFTER a new user is inserted into auth.users.
-- Automatically creates a default Organization + Owner membership.
-- SECURITY DEFINER: runs as the function definer (postgres/service role)
-- which bypasses RLS policies entirely for this atomic transaction.
-- SET search_path = public: prevents search path hijacking attacks.
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_org_id uuid;
  org_name   text;
BEGIN
  -- Derive organization name from metadata, fall back to email prefix
  org_name := COALESCE(
    NEW.raw_user_meta_data->>'organization_name',
    split_part(NEW.email, '@', 1) || '''s Workspace'
  );

  -- Step 1: Create the default Organization
  INSERT INTO public.organizations (name)
  VALUES (org_name)
  RETURNING id INTO new_org_id;

  -- Step 2: Map the user as the Owner of that organization
  INSERT INTO public.organization_members (user_id, organization_id, role)
  VALUES (NEW.id, new_org_id, 'owner');

  RETURN NEW;

EXCEPTION
  WHEN OTHERS THEN
    -- Raising here aborts the entire auth.users INSERT transaction.
    -- This is the correct rollback behaviour: no user without an org.
    RAISE EXCEPTION 'Provisioning failed for user [%]: % (SQLSTATE: %)',
      NEW.email, SQLERRM, SQLSTATE;
END;
$$;

-- Bind trigger to Supabase Auth
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

