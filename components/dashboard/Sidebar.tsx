'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Layers, 
  Box, 
  Activity, 
  Users, 
  BarChart, 
  Settings,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/dashboard/projects', icon: Briefcase },
  { name: 'Drawings', href: '/dashboard/drawings', icon: FileText },
  { name: 'Assemblies', href: '/dashboard/assemblies', icon: Layers },
  { name: 'Elements', href: '/dashboard/elements', icon: Box },
  { name: 'Activities', href: '/dashboard/activities', icon: Activity },
  { name: 'Resources', href: '/dashboard/resources', icon: Users },
  { name: 'Reports', href: '/dashboard/reports', icon: BarChart },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function Sidebar({ mobileOpen, setMobileOpen }: { mobileOpen: boolean, setMobileOpen: (open: boolean) => void }) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar Container */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo Section */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900">STE App</span>
            </Link>
            <button 
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg"
              onClick={() => setMobileOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 group",
                    isActive 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600"
                  )} />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Footer/Help section */}
          <div className="p-4 mt-auto border-t border-slate-100">
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-xs font-bold text-slate-900 mb-1">Need help?</p>
              <p className="text-xs text-slate-500 mb-3">Check our documentation or contact support.</p>
              <button className="w-full py-2 bg-white border border-slate-200 text-xs font-bold text-slate-900 rounded-xl hover:bg-white shadow-sm transition-colors">
                Support Center
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
