import { createClient } from '@/lib/supabase/server'
import RedirectToLogin from '@/components/RedirectToLogin'
import DashboardShell from '@/components/dashboard/DashboardShell'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  
  try {
    // 1. Core Auth Check ONLY
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.log('[DashboardLayout] Auth check failed, redirecting.')
      return <RedirectToLogin />
    }

    // 2. Static Shell for Test Mode
    return (
      <DashboardShell 
        user={user} 
        organizations={[]} 
        currentOrgId=""
      >
        {children}
      </DashboardShell>
    )
  } catch (err: any) {
    console.error('[DashboardLayout] CRITICAL CRASH:', err)
    return (
      <div className="p-20 text-center bg-red-50 text-red-600 rounded-3xl">
        <h1 className="text-3xl font-black">SYSTEM_HALT</h1>
        <p className="mt-2 font-mono text-sm">{err?.message}</p>
      </div>
    )
  }
}


