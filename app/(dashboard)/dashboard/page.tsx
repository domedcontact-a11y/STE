import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = createClient()

  // Verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch the user's organization and role directly via RLS and DB
  const { data: membership } = await supabase
    .from('memberships')
    .select('role, organizations(name)')
    .eq('user_id', user.id)
    .single()

  if (!membership) {
    redirect('/setup-organization')
  }

  const orgs = membership.organizations as any
  const orgName = Array.isArray(orgs) 
      ? orgs[0]?.name 
      : orgs?.name

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome back. You are authenticated and correctly configured.</p>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Organization Context</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">Active Organization</span>
            <span className="text-sm font-medium text-gray-900">{orgName || 'Unknown'}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">Your Role</span>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
              {membership.role.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">Email</span>
            <span className="text-sm text-gray-900">{user.email}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
