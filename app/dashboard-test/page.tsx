import Link from 'next/link'
import { LayoutDashboard, PlusCircle, Settings, FileText, Layers, Box, CheckCircle } from 'lucide-react'

export default function DashboardTestPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-[3rem] p-12 border border-slate-200 shadow-2xl space-y-10 text-center">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mb-6 border border-emerald-100">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">
            Dashboard <span className="text-blue-600">Test</span>
          </h1>
          <p className="mt-4 text-slate-500 font-medium text-lg italic">
            "Diagnostic Isolate V3" - Accessible without session requirements for testing.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 text-left">
          <div className="p-8 bg-blue-50/50 rounded-3xl border border-blue-100 flex flex-col justify-between group">
            <div>
              <PlusCircle className="w-8 h-8 text-blue-600 mb-4 group-hover:rotate-90 transition-transform" />
              <h2 className="text-xl font-bold text-slate-900 mb-2">Create New Project</h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Test the transition to project creation forms.
              </p>
            </div>
            <Link href="/dashboard/projects/new" className="mt-6 text-blue-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Open Form →
            </Link>
          </div>

          <div className="p-8 bg-slate-50 rounded-3xl border border-slate-200 flex flex-col justify-between group">
            <div>
              <Settings className="w-8 h-8 text-slate-400 mb-4 group-hover:rotate-12 transition-transform" />
              <h2 className="text-xl font-bold text-slate-900 mb-2">Workspace Settings</h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Verify organization and profile management views.
              </p>
            </div>
            <Link href="/dashboard/settings" className="mt-6 text-slate-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Manage Org →
            </Link>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-100 flex flex-wrap justify-center gap-6">
          <Link href="/login" className="text-sm font-black text-slate-400 hover:text-blue-600 transition-colors">LOGIN PAGE</Link>
          <Link href="/dashboard" className="text-sm font-black text-slate-400 hover:text-blue-600 transition-colors underline decoration-2 underline-offset-4">REAL DASHBOARD</Link>
          <Link href="/dashboard/drawings" className="text-sm font-black text-slate-400 hover:text-blue-600 transition-colors">DRAWINGS</Link>
        </div>
      </div>
    </div>
  )
}
