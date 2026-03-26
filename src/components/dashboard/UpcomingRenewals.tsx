import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CreditCard } from "lucide-react"
import Link from "next/link"

export interface RenewalItem {
  memberId: string
  memberName: string
  planName: string
  expiryDate: string
  daysLeft: number
}

export function UpcomingRenewals({ renewals = [] }: { renewals?: RenewalItem[] }) {
  if (renewals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-slate-500">
        <p className="text-sm italic">All members are up to date! No renewals due in the next 7 days.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {renewals.map((item, i) => {
        const initials = item.memberName.split(' ').map(n => n[0]).join('').toUpperCase()
        const isUrgent = item.daysLeft <= 2

        return (
          <div
            key={i}
            className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${
              isUrgent
                ? "bg-rose-500/5 border-rose-500/20 hover:border-rose-500/40"
                : "bg-white/[0.02] border-white/5 hover:border-white/15"
            }`}
          >
            <Avatar className="h-10 w-10 rounded-xl border border-white/5 shadow-sm shrink-0">
              <AvatarFallback className="bg-slate-800 text-white font-bold text-xs rounded-xl">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{item.memberName}</p>
              <p className="text-xs text-slate-500">{item.planName}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <div className={`text-xs font-bold flex items-center gap-1 ${
                  isUrgent ? "text-rose-400" : "text-amber-400"
                }`}>
                  {isUrgent && <AlertTriangle className="h-3 w-3" />}
                  {item.daysLeft === 0 ? "Today!" : item.daysLeft === 1 ? "Tomorrow" : `${item.daysLeft} days`}
                </div>
                <p className="text-[10px] text-slate-600">{item.expiryDate}</p>
              </div>
              <Button
                asChild
                size="sm"
                className="bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 rounded-lg h-8 px-3 text-xs transition-all"
              >
                <Link href={`/payments/new?memberId=${item.memberId}`}>
                  <CreditCard className="h-3 w-3 mr-1" />
                  Renew
                </Link>
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
