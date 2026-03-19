import 'server-only'
import { createClient } from '@/lib/supabase/server'

/**
 * Service: getProjects
 * Fetches all projects belonging to the authenticated user's organization.
 * Organization scoping is automatically enforced by PostgreSQL RLS policies.
 */
export async function getProjects() {
  const supabase = createClient()

  // RLS guarantees that only projects linked to the user's active membership(s) are returned.
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch projects: ${error.message}`)
  }

  return data
}

/**
 * Service: getProjectById
 * Fetches a single project by its UUID.
 * RLS ensures it will only return if the user has access to that project's organization.
 */
export async function getProjectById(projectId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single()

  if (error) {
    throw new Error(`Failed to fetch project ${projectId}: ${error.message}`)
  }

  return data
}

/**
 * Service: createProject
 * Creates a new project tightly scoped to the user's organization.
 */
export async function createProject(name: string) {
  const supabase = createClient()

  // 1. Get the current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Unauthorized: Authentication required.')
  }

  // 2. Fetch the user's primary organization from organization_members
  const { data: membership, error: memberError } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .limit(1)
    .single()

  if (memberError || !membership) {
    throw new Error('Forbidden: User is not linked to an organization.')
  }

  // 3. Create the project strictly associated with the resolved organization
  const { data, error } = await supabase
    .from('projects')
    .insert([{
      organization_id: membership.organization_id,
      name,
      // Since schema design didn't explicitly mention 'description' in Step 483, 
      // but it's a common field, we will only include it if it exists in the schema.
      // However, assuming standard project fields or just 'name' based on generic multi-tenancy.
      // E.g., just passing name for guaranteed schema compatibility.
    }])
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create project: ${error.message}`)
  }

  return data
}
