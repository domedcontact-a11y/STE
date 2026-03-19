import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  PlusCircle, 
  BarChart3, 
  Clock, 
  LayoutDashboard,
  ArrowUpRight,
  Activity
} from 'lucide-react'

export const metadata = {
  title: 'Dashboard | STE App'
}

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch membership and auto-provision if missing
  let { data: membership } = await supabase
    .from('organization_members')
    .select('role, organization_id, organizations(name)')
    .eq('user_id', user.id)
    .single()

  if (!membership) {
    const orgName = user.email?.split('@')[0] || 'My Organization'
    const { data: orgId, error: provisionError } = await supabase.rpc('create_new_organization', {
      org_name: `${orgName}'s Org`
    })

    if (!provisionError && orgId) {
      const { data: newMembership } = await supabase
        .from('organization_members')
        .select('role, organization_id, organizations(name)')
        .eq('user_id', user.id)
        .single()
      membership = newMembership
    }
  }

  if (!membership) {
    redirect('/dashboard/setup-organization')
  }

  const orgName = (membership.organizations as any)?.name || 'Your Workspace'

  // Fetch Project Metrics
  const { data: projects } = await supabase
    .from('projects')
    .select('status')
    .eq('organization_id', (membership as any).organization_id)

  const stats = {
    total: projects?.length || 0,
    active: projects?.filter(p => p.status === 'active').length || 0,
    completed: projects?.filter(p => p.status === 'completed').length || 0
  }

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
    .limit(5)

  return (
    <div className="space-y-10 py-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <LayoutDashboard className="w-8 h-8 text-blue-600" />
            Hello, {user.email?.split('@')[0]}
          </h1>
          <p className="text-slate-500 font-medium">
            Managing <span className="text-slate-900 font-bold">{orgName}</span> as <span className="text-blue-600 uppercase text-xs tracking-widest">{membership.role}</span>
          </p>
        </div>
        
        <Link 
          href="/dashboard/projects/new"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 group"
        >
          <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          Create New Project
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Total Projects" value={stats.total} icon={<BarChart3 className="w-5 h-5" />} color="text-blue-600" />
        <StatCard title="Active Work" value={stats.active} icon={<Clock className="w-5 h-5" />} color="text-amber-500" />
        <StatCard title="Completed" value={stats.completed} icon={<Activity className="w-5 h-5" />} color="text-emerald-500" />
      </div>

      {/* Main Grid: Activities & Shortcuts */}
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Recent Activities</h2>
            <Link href="/dashboard/activities" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View All <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            {!recentActivities || recentActivities.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-slate-400">No recent activities in this workspace.</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {recentActivities.map((activity) => (
                  <li key={activity.id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                          <Activity className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{activity.name}</h4>
                          <p className="text-xs text-slate-500 font-medium uppercase tracking-tighter">
                            {activity.type} • Element: { (activity.elements as any)?.mark || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-lg uppercase">
                        {activity.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
          <div className="grid gap-4">
            <QuickLink href="/dashboard/drawings/upload" title="Upload Drawings" desc="CAD & PDF files" />
            <QuickLink href="/dashboard/assemblies/new" title="New Assembly" desc="Group elements" />
            <QuickLink href="/dashboard/elements/upload" title="Import Elements" desc="Bulk CSV upload" />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: string }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 bg-slate-50 rounded-lg ${color}`}>
          {icon}
        </div>
        <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">{title}</span>
      </div>
      <div className="text-4xl font-black text-slate-900">{value}</div>
    </div>
  )
}

function QuickLink({ href, title, desc }: { href: string, title: string, desc: string }) {
  return (
    <Link href={href} className="group p-5 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/5 transition-all flex items-center justify-between">
      <div>
        <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{title}</h4>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
      <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
    </Link>
  )
}

