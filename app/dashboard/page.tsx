import { createClient } from '@/lib/supabase/server'
import { FolderGit2, Users, FileText, CheckCircle2 } from 'lucide-react'
import StatCard from '@/components/dashboard/StatCard'
import DashboardAction from '@/components/dashboard/DashboardAction'
import ActivityItem from '@/components/dashboard/ActivityItem'

export default async function DashboardPage() {
  const supabase = createClient()

  // Execute concurrent, high-performance edge fetches
  const [
    { count: totalProjects },
    { count: activeProjects },
    { data: recentActivity }
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'ACTIVE'),
    supabase.from('projects').select('id, name, created_at, status').order('created_at', { ascending: false }).limit(5)
  ])

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Welcome back. Here is the latest from your construction workspaces.</p>
        </div>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Projects" value={totalProjects || 0} icon={<FolderGit2 className="w-6 h-6" />} color="blue" />
        <StatCard title="Active Projects" value={activeProjects || 0} icon={<CheckCircle2 className="w-6 h-6" />} color="emerald" />
        <StatCard title="Recent Drawings" value={14} icon={<FileText className="w-6 h-6" />} color="amber" />
        <StatCard title="Team Members" value={28} icon={<Users className="w-6 h-6" />} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* QUICK ACTIONS */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <DashboardAction title="Create Project" desc="Initialize a new workspace." href="/dashboard/projects/new" icon={<FolderGit2 className="w-6 h-6" />} />
            <DashboardAction title="Upload Drawing" desc="Add technical blueprints." href="/dashboard/drawings" icon={<FileText className="w-6 h-6" />} />
            <DashboardAction title="Manage Team" desc="Add subcontractors." href="/dashboard/settings" icon={<Users className="w-6 h-6" />} />
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
          </div>
          <div className="space-y-6">
            {recentActivity && recentActivity.length > 0 ? (
              <ul className="divide-y divide-slate-100">
                {recentActivity.map((activity) => (
                  <ActivityItem 
                    key={activity.id} 
                    activity={{
                      name: activity.name,
                      type: 'PROJECT',
                      status: activity.status,
                      updated_at: activity.created_at,
                      elements: null
                    }}
                  />
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 text-sm italic">No recent activity detected.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

