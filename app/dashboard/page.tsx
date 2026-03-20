import Link from 'next/link'
import { PlusCircle, LayoutDashboard, Settings, FileText, Layers, Box } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-white rounded-[2.5rem] p-12 border border-slate-200 shadow-2xl shadow-slate-200/50 text-center space-y-8">
        <div className="inline-flex p-4 bg-blue-50 rounded-3xl mb-4">
          <LayoutDashboard className="w-12 h-12 text-blue-600 animate-pulse" />
        </div>
        
        <h1 className="text-5xl font-black tracking-tighter text-slate-900">
          DASHBOARD <span className="text-blue-600">TEST</span>
        </h1>
        
        <p className="text-xl text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
          If you are seeing this page, your <span className="text-slate-900 font-bold">Authentication is Working</span> and the routing is healthy.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 text-left">
          <Link href="/dashboard/projects/new" className="group p-6 bg-slate-50 rounded-3xl border border-slate-200 hover:border-blue-500 hover:bg-white transition-all">
            <PlusCircle className="w-6 h-6 text-blue-600 mb-3 group-hover:rotate-90 transition-transform" />
            <h3 className="font-bold text-slate-900 mb-1">Create Project</h3>
            <p className="text-sm text-slate-500">Test navigation to project creation.</p>
          </Link>
          
          <Link href="/dashboard/settings" className="group p-6 bg-slate-50 rounded-3xl border border-slate-200 hover:border-blue-500 hover:bg-white transition-all">
            <Settings className="w-6 h-6 text-slate-400 mb-3 group-hover:rotate-12 transition-transform" />
            <h3 className="font-bold text-slate-900 mb-1">Settings</h3>
            <p className="text-sm text-slate-500">Verify user and org settings.</p>
          </Link>

          <Link href="/dashboard/drawings" className="group p-6 bg-slate-50 rounded-3xl border border-slate-200 hover:border-blue-500 hover:bg-white transition-all">
            <FileText className="w-6 h-6 text-slate-400 mb-3" />
            <h3 className="font-bold text-slate-900 mb-1">Drawings</h3>
            <p className="text-sm text-slate-500">Test static route access.</p>
          </Link>

          <Link href="/dashboard/assemblies" className="group p-6 bg-slate-50 rounded-3xl border border-slate-200 hover:border-blue-500 hover:bg-white transition-all">
            <Layers className="w-6 h-6 text-slate-400 mb-3" />
            <h3 className="font-bold text-slate-900 mb-1">Assemblies</h3>
            <p className="text-sm text-slate-500">Test layout persistence.</p>
          </Link>
        </div>

        <div className="pt-8 border-t border-slate-100 italic text-slate-400 text-sm">
          Diagnostic ID: SYNC_TEST_PAGE_V3
        </div>
      </div>
    </div>
  )
}
