import React from 'react'
import { cn } from '@/lib/utils'

export default function StatCard({ 
  title, 
  value, 
  icon, 
  color 
}: { 
  title: string, 
  value: number, 
  icon: React.ReactNode, 
  color: 'blue' | 'amber' | 'emerald' 
}) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100 ring-blue-500/10',
    amber: 'bg-amber-50 text-amber-600 border-amber-100 ring-amber-500/10',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 ring-emerald-500/10'
  }

  return (
    <div className={cn(
      "p-8 rounded-[2.5rem] bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group",
      "relative overflow-hidden"
    )}>
      <div className={cn(
        "absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-5 group-hover:scale-150 group-hover:opacity-10 transition-all duration-500",
        color === 'blue' ? 'bg-blue-600' : color === 'amber' ? 'bg-amber-600' : 'bg-emerald-600'
      )} />
      
      <div className="flex items-center gap-4 mb-6">
        <div className={cn("p-3 rounded-2xl", colorMap[color])}>
          {icon}
        </div>
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{title}</span>
      </div>
      <div className="text-5xl font-black text-slate-900 tracking-tighter">
        {value}
      </div>
    </div>
  )
}
