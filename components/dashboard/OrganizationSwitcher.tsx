'use client'

import React, { useState } from 'react'
import { Check, ChevronsUpDown, Building2, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Organization {
  id: string
  name: string
}

export default function OrganizationSwitcher({ 
  organizations, 
  currentOrgId 
}: { 
  organizations: Organization[], 
  currentOrgId: string 
}) {
  const [open, setOpen] = useState(false)
  
  const currentOrg = organizations.find(org => org.id === currentOrgId) || organizations[0]

  return (
    <div className="relative">
      <button 
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-sm group"
      >
        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
          <Building2 className="w-4 h-4 text-blue-600" />
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Workspace</p>
          <p className="text-sm font-black text-slate-900 leading-none">{currentOrg?.name || 'Loading...'}</p>
        </div>
        <ChevronsUpDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 ml-2" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl z-20 overflow-hidden py-1 transform origin-top-left transition-all">
            <div className="px-4 py-2 border-b border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Switch Workspace</p>
            </div>
            
            <div className="max-h-60 overflow-y-auto py-1">
              {organizations.map((org) => (
                <button
                  key={org.id}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 text-sm font-bold transition-colors",
                    org.id === currentOrgId ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"
                  )}
                  onClick={() => {
                    // Organization switching logic would go here
                    setOpen(false)
                  }}
                >
                  <span className="truncate">{org.name}</span>
                  {org.id === currentOrgId && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>

            <div className="p-2 border-t border-slate-100">
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                <Plus className="w-4 h-4" />
                Create New Org
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
