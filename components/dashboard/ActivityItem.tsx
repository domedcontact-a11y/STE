import React from 'react'
import { Activity } from 'lucide-react'

export default function ActivityItem({ activity }: { activity: any }) {
  return (
    <li className="p-6 hover:bg-slate-50 transition-colors group">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:rotate-6 transition-all duration-300">
            <Activity className="w-6 h-6 text-blue-600 group-hover:text-white" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-0.5">{activity.name}</h4>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md uppercase tracking-wider">
                {activity.type}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Element: <span className="text-slate-600 font-bold">{(activity.elements as any)?.mark || 'N/A'}</span>
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-slate-900 block mb-1">
            {activity.status.toUpperCase()}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
             {new Date(activity.updated_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </li>
  )
}
