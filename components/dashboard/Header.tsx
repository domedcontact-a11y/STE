'use client'

import React, { useState } from 'react'
import { 
  Search, 
  Bell, 
  Menu, 
  LogOut, 
  User as UserIcon, 
  Settings 
} from 'lucide-react'
import OrganizationSwitcher from './OrganizationSwitcher'
import { cn } from '@/lib/utils'

interface Organization {
  id: string
  name: string
}

export default function Header({ 
  user, 
  organizations, 
  currentOrgId,
  onMenuClick 
}: { 
  user: any, 
  organizations: Organization[], 
  currentOrgId: string,
  onMenuClick: () => void
}) {
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left Section: Mobile Menu & Switcher */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-xl lg:hidden transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <OrganizationSwitcher 
            organizations={organizations} 
            currentOrgId={currentOrgId} 
          />
        </div>

        {/* Center Section: Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold text-slate-400 border border-slate-200 rounded-md bg-white">
                ⌘
              </kbd>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold text-slate-400 border border-slate-200 rounded-md bg-white">
                K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right Section: Notifications & Profile */}
        <div className="flex items-center gap-3">
          <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>

          <div className="relative">
            <button 
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1 pl-2 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-slate-900 leading-none mb-0.5">
                  {user.email?.split('@')[0]}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-none italic">
                  Member
                </p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xs">
                {user.email?.[0].toUpperCase()}
              </div>
            </button>

            {profileOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl z-20 overflow-hidden py-1">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-black text-slate-900 truncate">{user.email}</p>
                    <p className="text-xs text-slate-500 font-medium truncate italic underline underline-offset-4 decoration-blue-500/30 font-mono">
                      User ID: {user.id.slice(0, 8)}...
                    </p>
                  </div>
                  
                  <div className="p-1">
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      View Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                      <Settings className="w-4 h-4 text-slate-400" />
                      Account Settings
                    </button>
                  </div>

                  <div className="p-1 border-t border-slate-100">
                    <form action="/auth/signout" method="post">
                      <button 
                        type="submit"
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </form>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
