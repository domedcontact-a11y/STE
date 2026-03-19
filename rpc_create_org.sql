-- Supabase RPC function for securely creating an organization and assigning the owner role.
-- This runs with SECURITY DEFINER to bypass the strict RLS on organizations and memberships
-- during the onboarding transaction.

CREATE OR REPLACE FUNCTION create_new_organization(org_name TEXT)
RETURNS UUID AS $$
DECLARE
  new_org_id UUID;
  current_user_id UUID;
BEGIN
  -- Get the authenticated user
  current_user_id := auth.uid();
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- 1. Insert the new organization
  INSERT INTO organizations (name)
  VALUES (org_name)
  RETURNING id INTO new_org_id;

  -- 2. Insert the owner membership
  INSERT INTO organization_members (user_id, organization_id, role)
  VALUES (current_user_id, new_org_id, 'owner');

  RETURN new_org_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
