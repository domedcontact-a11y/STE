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
    <div className="max-w-4xl mx-auto space-y-12 py-10">
      {/* Welcome Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-3xl mb-4">
          <LayoutDashboard className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900">
          Hello, {user.email?.split('@')[0]}
        </h1>
        <p className="text-slate-500 font-medium text-lg">
          Workspace: <span className="text-slate-900 font-bold">{orgName}</span>
        </p>
      </div>

      {/* Primary Action */}
      <div className="flex justify-center">
        <Link 
          href="/dashboard/projects/new"
          className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-blue-600 text-white text-lg font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/25 group"
        >
          <PlusCircle className="w-6 h-6 group-hover:rotate-90 transition-transform" />
          Create New Project
        </Link>
      </div>

      {/* Quick Actions Grid */}
      <div className="pt-8 border-t border-slate-100">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 text-center">Quick Actions</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          <QuickLink href="/dashboard/drawings/upload" title="Upload Drawings" desc="CAD & PDF files" />
          <QuickLink href="/dashboard/assemblies/new" title="New Assembly" desc="Group elements" />
          <QuickLink href="/dashboard/elements/upload" title="Import Elements" desc="Bulk CSV upload" />
        </div>
      </div>
    </div>
  )
}

function QuickLink({ href, title, desc }: { href: string, title: string, desc: string }) {
  return (
    <Link href={href} className="group p-6 bg-white border border-slate-200 rounded-3xl hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/5 transition-all text-center flex flex-col items-center">
      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">
        <PlusCircle className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
      </div>
      <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">{title}</h4>
      <p className="text-xs text-slate-500 font-medium">{desc}</p>
    </Link>
  )
}


