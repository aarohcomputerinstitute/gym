import { Card, CardContent } from "@/components/ui/card"
import { Users, UserCheck, DollarSign, CalendarClock, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatItemProps {
  title: string
  value: string
  change: string
  isPositive: boolean
  icon: React.ElementType
  color: string
}

function StatItem({ title, value, change, isPositive, icon: Icon, color }: StatItemProps) {
  return (
    <Card className="bg-slate-900/80 border-white/10 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden group hover:border-blue-500/30 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("p-2 rounded-xl bg-opacity-20 transition-colors group-hover:bg-opacity-30", color)}>
            <Icon className={cn("h-5 w-5", color.replace('bg-', 'text-'))} />
          </div>
          <div className={cn(
            "flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full",
            isPositive ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"
          )}>
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {change}
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{title}</h3>
          <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
        </div>
      </CardContent>
      <div className={cn("h-1 w-full opacity-30", color)} />
    </Card>
  )
}

export interface StatData {
  title: string
  value: string
  change: string
  isPositive: boolean
  icon: any
  color: string
}

export function StatsCards({ stats }: { stats: StatData[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
      {stats.map((stat, i) => (
        <StatItem key={i} {...stat} />
      ))}
    </div>
  )
}
