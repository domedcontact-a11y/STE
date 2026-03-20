'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  console.log('[LoginAction] Attempting login for:', email)

  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('[LoginAction] Auth error:', error.message)
      return redirect(`/login?error=${encodeURIComponent(error.message)}`)
    }

    if (authData?.user) {
      console.log('[LoginAction] Success, redirecting to /dashboard')
      // Organizations are securely provisioned natively via PostgreSQL Trigger on signup.
      // Redirection falls natively directly to the dashboard.
      revalidatePath('/', 'layout')
      return redirect('/dashboard')
    }
  } catch (err: any) {
    if (err?.message === 'NEXT_REDIRECT') throw err
    console.error('[LoginAction] CRITICAL ERROR:', err)
    return redirect(`/login?error=${encodeURIComponent('A server-side error occurred. Please check logs.')}`)
  }

  return redirect('/login')
}

export async function signup(formData: FormData) {
  const supabase = createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  console.log('[SignupAction] Attempting signup for:', email)

  try {
    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      console.error('[SignupAction] Auth error:', error.message)
      return redirect(`/login?error=${encodeURIComponent(error.message)}`)
    }

    // If email confirmations are disabled or auto-confirmed, route instantly to Dashboard.
    if (authData?.session) {
      console.log('[SignupAction] Success, redirecting to /dashboard')
      revalidatePath('/', 'layout')
      return redirect('/dashboard')
    }
  } catch (err: any) {
    if (err?.message === 'NEXT_REDIRECT') throw err
    console.error('[SignupAction] CRITICAL ERROR:', err)
    return redirect(`/login?error=${encodeURIComponent('A server-side error occurred during signup.')}`)
  }

  return redirect(`/login?success=${encodeURIComponent('Account created successfully! Please check your email inbox to verify.')}`)
}
