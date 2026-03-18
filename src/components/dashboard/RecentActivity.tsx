import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentActivity() {
  const activities = [
    {
      name: "Olivia Martin",
      action: "Checked in (Manual)",
      time: "Just now",
      initials: "OM",
      amount: null,
      color: "bg-blue-500/10 text-blue-400"
    },
    {
      name: "Jackson Lee",
      action: "Renewed Pro Plan for 6 months",
      time: "12 mins ago",
      initials: "JL",
      amount: "+₹12,000",
      color: "bg-green-500/10 text-green-400"
    },
    {
      name: "Isabella Nguyen",
      action: "New Registration (Starter Plan)",
      time: "1 hr ago",
      initials: "IN",
      amount: "+₹1,999",
      color: "bg-purple-500/10 text-purple-400"
    },
    {
      name: "William Kim",
      action: "Checked out",
      time: "2 hrs ago",
      initials: "WK",
      amount: null,
      color: "bg-slate-500/10 text-slate-400"
    },
    {
      name: "Sofia Davis",
      action: "Membership Expiring soon",
      time: "3 hrs ago",
      initials: "SD",
      amount: "Alert Sent",
      color: "bg-orange-500/10 text-orange-400"
    }
  ]

  return (
    <div className="space-y-6">
      {activities.map((item, i) => (
        <div key={i} className="flex items-center group">
          <Avatar className="h-10 w-10 rounded-xl border border-white/5 shadow-sm">
            <AvatarImage src="" />
            <AvatarFallback className="bg-slate-800 text-slate-300 font-bold text-xs">{item.initials}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-0.5">
            <p className="text-sm font-semibold text-white leading-none transition-colors group-hover:text-blue-400">
              {item.name}
            </p>
            <p className="text-xs text-slate-500 font-medium">
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

import { cn } from "@/lib/utils"
