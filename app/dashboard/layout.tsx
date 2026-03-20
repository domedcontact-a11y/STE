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
    
    let activeUser = user

    // --- PHASE 3 HARDENING: getSession Fallback ---
    if (authError || !activeUser) {
      console.warn('[Layout] [/dashboard] getUser() failed. Attempting getSession() fallback...')
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionData?.session?.user) {
        console.log('[Layout] [/dashboard] getSession() rescued the user context:', sessionData.session.user.email)
        activeUser = sessionData.session.user
      } else {
        console.error('[Layout] [/dashboard] Both getUser() and getSession() failed. Redirecting.', sessionError?.message || 'No Session')
        return <RedirectToLogin />
      }
    }

    // 2. Static Shell for Test Mode
    return (
      <DashboardShell 
        user={activeUser} 
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


