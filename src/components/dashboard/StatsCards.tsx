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
    <Card className="bg-slate-900/40 border-white/5 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden group hover:border-white/10 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("p-2 rounded-xl bg-opacity-10 transition-colors group-hover:bg-opacity-20", color)}>
            <Icon className={cn("h-5 w-5", color.replace('bg-', 'text-'))} />
          </div>
          <div className={cn(
            "flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full",
            isPositive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
          )}>
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {change}
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-slate-200">{title}</h3>
          <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
        </div>
      </CardContent>
      <div className={cn("h-1 w-full opacity-20", color)} />
    </Card>
  )
}

export function StatsCards() {
  const stats = [
    {
      title: "Total Members",
      value: "1,248",
      change: "+12.5%",
      isPositive: true,
      icon: Users,
      color: "bg-blue-500"
    },
    {
      title: "Active Members",
      value: "983",
      change: "+5.2%",
      isPositive: true,
      icon: UserCheck,
      color: "bg-indigo-500"
    },
    {
      title: "Monthly Revenue",
      value: "₹2,45,000",
      change: "+18.3%",
      isPositive: true,
      icon: DollarSign,
      color: "bg-emerald-500"
    },
    {
      title: "Today's Check-ins",
      value: "142",
      change: "-2.4%",
      isPositive: false,
      icon: CalendarClock,
      color: "bg-amber-500"
    }
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <StatItem key={i} {...stat} />
      ))}
    </div>
  )
}
