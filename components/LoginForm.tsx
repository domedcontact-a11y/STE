'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function LoginForm({ 
  initialError, 
  initialSuccess 
}: { 
  initialError?: string, 
  initialSuccess?: string 
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(initialError || '')
  const [success, setSuccess] = useState(initialSuccess || '')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    console.log('[LoginForm] Attempting client-side login for:', email)
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      console.error('[LoginForm] Auth Error:', authError.message)
      setError(authError.message)
      setLoading(false)
      return
    }

    if (data.session) {
      console.log('[LoginForm] Login success! Session established. Redirecting...')
      router.refresh() // Force Next.js to re-evaluate server components with new cookie
      router.push('/dashboard')
    }
  }

  const handleSignup = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Email and password required for signup.')
      return
    }

    setError('')
    setSuccess('')
    setLoading(true)

    console.log('[LoginForm] Attempting client-side signup for:', email)
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (data.session) {
      router.refresh()
      router.push('/dashboard')
    } else {
      setSuccess('Account created! Please check your email to verify.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      {error && (
        <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-md text-sm text-center">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 bg-green-100 border border-green-200 text-green-700 rounded-md text-sm text-center">
          {success}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="email">Email</label>
        <input 
          className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black" 
          id="email" 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
          disabled={loading}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="password">Password</label>
        <input 
          className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black" 
          id="password" 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
          disabled={loading}
        />
      </div>

      <div className="flex gap-4 mt-4">
        <button 
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition flex items-center justify-center disabled:opacity-70"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
        </button>
        <button 
          type="button"
          onClick={handleSignup}
          disabled={loading}
          className="flex-1 bg-white text-blue-600 border border-blue-600 rounded-md px-4 py-2 hover:bg-blue-50 transition flex items-center justify-center disabled:opacity-70"
        >
          Sign Up
        </button>
      </div>
    </form>
  )
}
