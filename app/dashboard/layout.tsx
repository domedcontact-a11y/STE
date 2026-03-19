import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import QuickActions from '@/components/QuickActions'
import RedirectToLogin from '@/components/RedirectToLogin'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  
  // Basic layout level auth verification
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return <RedirectToLogin />
  }


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/dashboard" className="text-xl font-bold text-blue-600">
                  CM App
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <QuickActions />
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
