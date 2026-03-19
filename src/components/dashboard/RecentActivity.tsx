import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export interface ActivityItem {
  name: string
  action: string
  time: string
  initials: string
  amount?: string | null
  color: string
}

export function RecentActivity({ activities = [] }: { activities?: ActivityItem[] }) {
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-slate-500">
        <p className="text-sm italic">No recent activity found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {activities.map((item, i) => (
        <div key={i} className="flex items-center group">
          <Avatar className="h-10 w-10 rounded-xl border border-white/5 shadow-sm">
            <AvatarImage src="" />
            <AvatarFallback className="bg-slate-800 text-white font-bold text-xs">{item.initials}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-0.5">
            <p className="text-sm font-semibold text-slate-300 leading-none transition-colors group-hover:text-blue-400">
              {item.name}
            </p>
            <p className="text-xs text-slate-400 font-medium">
              {item.action}
            </p>
          </div>
          <div className="ml-auto flex flex-col items-end gap-1">
             {item.amount && (
               <div className={cn(
                 "text-xs font-bold px-2 py-0.5 rounded-full",
                 item.amount.startsWith('+') ? "bg-green-500/10 text-green-400" : "bg-orange-500/10 text-orange-400"
               )}>
                 {item.amount}
               </div>
             )}
            <div className="text-[10px] text-slate-600 font-medium uppercase tracking-tighter">{item.time}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

