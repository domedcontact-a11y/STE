'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createOrganization(formData: FormData) {
  const supabase = createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login?error=Authentication+required')
  }

  const name = formData.get('name') as string
  if (!name || name.trim().length === 0) {
    redirect('/setup-organization?error=Organization+name+is+required')
  }

  // Use the RPC to atomically create org and assign membership, bypassing initial RLS limits
  const { data: orgId, error: rpcError } = await supabase.rpc('create_new_organization', {
    org_name: name
  })

  if (rpcError) {
    redirect(`/setup-organization?error=${encodeURIComponent(rpcError.message)}`)
  }

  revalidatePath('/dashboard', 'layout')
  redirect('/dashboard')
}
