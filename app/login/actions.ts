'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: authData, error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  if (authData?.user) {
    // Organizations are securely provisioned natively via PostgreSQL Trigger on signup.
    // Redirection falls natively directly to the dashboard.
    revalidatePath('/', 'layout')
    redirect('/dashboard')
  }

  redirect('/login')
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: authData, error } = await supabase.auth.signUp(data)

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  // If email confirmations are disabled or auto-confirmed, route instantly to Dashboard.
  if (authData?.session) {
    revalidatePath('/', 'layout')
    redirect('/dashboard')
  }

  redirect(`/login?success=${encodeURIComponent('Account created successfully! Please check your email inbox to verify.')}`)
}
