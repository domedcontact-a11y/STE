'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RedirectToLogin() {
  const router = useRouter()
  
  useEffect(() => {
    router.push('/login')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Refining Session...</h2>
        <p className="text-gray-500">Redirecting you to login...</p>
      </div>
    </div>
  )
}
