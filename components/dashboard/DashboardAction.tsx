import React from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export default function DashboardAction({ 
  href, 
  icon, 
  title, 
  desc 
}: { 
  href: string, 
  icon: React.ReactNode, 
  title: string, 
  desc: string 
}) {
  return (
    <Link 
      href={href} 
      className="group flex items-center justify-between p-5 bg-white border border-slate-200 rounded-[1.5rem] hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/5 transition-all outline-none focus:ring-2 focus:ring-blue-500/20"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
          {icon}
        </div>
        <div>
          <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-none mb-1">{title}</h4>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{desc}</p>
        </div>
      </div>
      <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
    </Link>
  )
}
