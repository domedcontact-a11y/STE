-- 1. Create the Auth trigger function to provision a Default Organization
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  new_org_id uuid;
BEGIN
  -- Insert a new default organization for the user
  INSERT INTO public.organizations (name)
  VALUES (COALESCE(NEW.raw_user_meta_data->>'organization_name', 'My Workspace'))
  RETURNING id INTO new_org_id;

  -- Insert the user into organization_members seamlessly as Owner
  INSERT INTO public.organization_members (user_id, organization_id, role)
  VALUES (NEW.id, new_org_id, 'owner');

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- If organization creation fails, the transaction aborts and user signup rolls back
    RAISE EXCEPTION 'Failed to provision default organization for user %: %', NEW.email, SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Bind the trigger to Supabase Auth table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
