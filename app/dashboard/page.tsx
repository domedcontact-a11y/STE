import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Dashboard | CM App'
}

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  let { data: membership } = await supabase
    .from('organization_members')
    .select('role, organization_id, organizations(name)')
    .eq('user_id', user.id)
    .single()

  // Fallback: If no membership exists, try to auto-provision one (to avoid "Setup" screen)
  if (!membership) {
    const orgName = user.email?.split('@')[0] || 'My Organization'
    const { data: orgId, error: provisionError } = await supabase.rpc('create_new_organization', {
      org_name: `${orgName}'s Org`
    })

    if (!provisionError && orgId) {
      // Re-fetch membership since it's now created
      const { data: newMembership } = await supabase
        .from('organization_members')
        .select('role, organization_id, organizations(name)')
        .eq('user_id', user.id)
        .single()
      membership = newMembership
    }
  }

  if (!membership) {
    redirect('/setup-organization')
  }


  const orgName = Array.isArray(membership.organizations)
    ? membership.organizations[0]?.name
    : (membership.organizations as any)?.name

  // Fetch Project Metrics
  const { data: projects } = await supabase
    .from('projects')
    .select('status')
    // Automatically enforces RLS, but explicit filtering ensures strict active context targeting
    .eq('organization_id', (membership as any).organization_id || null)

  const totalProjects = projects?.length || 0
  const activeProjects = projects?.filter(p => p.status === 'active').length || 0
  const completedProjects = projects?.filter(p => p.status === 'completed').length || 0

  // Fetch Recent Activities
  const { data: recentActivities } = await supabase
    .from('activities')
    .select(`
      id,
      name,
      type,
      status,
      updated_at,
      elements(mark)
    `)
    .order('updated_at', { ascending: false })
    .limit(10)

  return (
    <div className="py-8 space-y-8">
      {/* Header */}
      <div id="dashboard-debug-marker" className="hidden">LOADED_DASHBOARD_PAGE</div>
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Welcome back to {orgName || 'your workspace'}!
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Role: <span className="uppercase font-semibold tracking-wider text-blue-600">{membership.role}</span>
        </p>
      </div>

      {/* Project Metrics Grid */}
      <div>
        <h2 className="text-lg font-semibold leading-6 text-gray-900 mb-4">Project Metrics</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border border-gray-100">
            <dt className="truncate text-sm font-medium text-gray-500">Total Projects</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{totalProjects}</dd>
          </div>
          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border border-gray-100 ring-1 ring-blue-50">
            <dt className="truncate text-sm font-medium text-blue-600">Active Projects</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-blue-700">{activeProjects}</dd>
          </div>
          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border border-gray-100 ring-1 ring-green-50">
            <dt className="truncate text-sm font-medium text-green-600">Completed Projects</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-green-700">{completedProjects}</dd>
          </div>
        </div>
      </div>

      {/* Recent Activities Feed */}
      <div>
        <h2 className="text-lg font-semibold leading-6 text-gray-900 mb-4">Recent Activities</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
          <ul role="list" className="divide-y divide-gray-200">
            {!recentActivities || recentActivities.length === 0 ? (
              <li className="px-4 py-8 text-center text-sm text-gray-500">
                No recent activities found in your workspace.
              </li>
            ) : (
              recentActivities.map((activity) => (
                <li key={activity.id}>
                  <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600 truncate">
                        {activity.name}
                      </p>
                      <div className="ml-2 flex flex-shrink-0">
                        <p className="inline-flex rounded-full bg-blue-50 px-2 text-xs font-semibold leading-5 text-blue-700 uppercase tracking-wide">
                          {activity.type}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          Element Focus:{' '}
                          <span className="font-semibold text-gray-700 ml-1">
                            {Array.isArray(activity.elements) ? activity.elements[0]?.mark : (activity.elements as any)?.mark || 'N/A'}
                          </span>
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          Status: <span className="font-semibold text-gray-800 capitalize">{activity.status}</span> • Updated{' '}
                          {new Date(activity.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
