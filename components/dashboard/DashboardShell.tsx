'use client'

import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

interface Organization {
  id: string
  name: string
}

export default function DashboardShell({ 
  children, 
  user, 
  organizations, 
  currentOrgId 
}: { 
  children: React.ReactNode, 
  user: any, 
  organizations: Organization[], 
  currentOrgId: string 
}) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans antialiased text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          user={user} 
          organizations={organizations} 
          currentOrgId={currentOrgId}
          onMenuClick={() => setMobileOpen(true)} 
        />
        
        <main className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
          <div className="mx-auto max-w-7xl h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
