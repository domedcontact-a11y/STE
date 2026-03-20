import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import RedirectToLogin from '@/components/RedirectToLogin'
import DashboardShell from '@/components/dashboard/DashboardShell'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  
  try {
    // Component Fallback Authentication (Master Prompt Step 6)
    const { data: { session } } = await supabase.auth.getSession()
    const { data: { user } } = await supabase.auth.getUser()

    if (!session || !user) {
      redirect('/login')
    }

    // --- Organization Context Resolution ---
    const { data: memberships } = await supabase
      .from('organization_members')
      .select('organization:organizations(id, name, slug)')
      .eq('user_id', user.id)

    // Map through the foreign-key joined data safely
    const organizations = (memberships || [])
      .map(m => m.organization)
      .flat()
      .filter(Boolean) as any[]
    
    // Select the first organization as the active context (defaulting to empty if none exist)
    const currentOrgId = organizations.length > 0 ? organizations[0].id : ""

    // 2. Interactive Shell
    return (
      <DashboardShell 
        user={user} 
        organizations={organizations} 
        currentOrgId={currentOrgId}
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


