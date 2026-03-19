import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button-variants"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { 
  Building2, 
  Users, 
  CreditCard, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { formatDistanceToNow } from "date-fns"

export default async function SuperAdminDashboard() {
  const supabase = await createClient()

  // 1. Fetch Total Gyms
  const { count: totalGyms } = await supabase
    .from('gyms')
    .select('*', { count: 'exact', head: true })

  // 2. Fetch Total Members (Global)
  const { count: totalMembers } = await supabase
    .from('members')
    .select('*', { count: 'exact', head: true })

  // 3. Fetch Platform MRR (Monthly Recurring Revenue)
  const { data: activeSubs } = await supabase
    .from('saas_subscriptions')
    .select('amount')
    .eq('status', 'active')
  
  const mrr = activeSubs?.reduce((sum, sub) => sum + Number(sub.amount), 0) || 0

  // 4. Fetch Active Trials
  const { count: activeTrials } = await supabase
    .from('gyms')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'trial')

  // 5. Fetch Recent Gym Signups
  const { data: recentGyms } = await supabase
    .from('gyms')
    .select(`
      id,
      name,
      owner_name,
      created_at,
      status
    `)
    .order('created_at', { ascending: false })
    .limit(4)

  const stats = [
    {
      title: "Total Gyms",
      value: totalGyms?.toString() || "0",
      description: "Onboarded facilities",
      icon: Building2,
      trend: "up"
    },
    {
      title: "Global Members",
      value: totalMembers?.toLocaleString() || "0",
      description: "Across all tenants",
      icon: Users,
      trend: "up"
    },
    {
      title: "Platform MRR",
      value: `₹${mrr.toLocaleString()}`,
      description: "Active SaaS revenue",
      icon: CreditCard,
      trend: "up"
    },
    {
      title: "Active Trials",
      value: activeTrials?.toString() || "0",
      description: "Converting leads",
      icon: TrendingUp,
      trend: "up"
    }
  ]

  return (
    <div className="flex-1 space-y-6 pt-6 bg-transparent text-white">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-white">Platform Overview</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <p className="text-xs text-slate-400 flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <Card className="col-span-4 bg-slate-900/50 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Recent Gym Signups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentGyms?.map((gym, i) => (
                <div key={i} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-bold leading-none text-white">{gym.name}</p>
                    <p className="text-sm text-slate-400">
                      {gym.owner_name} • <span className="capitalize">{gym.status}</span>
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-xs text-slate-500">
                    {formatDistanceToNow(new Date(gym.created_at), { addSuffix: true })}
                  </div>
                </div>
              ))}
              {(!recentGyms || recentGyms.length === 0) && (
                <p className="text-center py-4 text-slate-500 italic text-sm">No recent signups yet.</p>
              )}
            </div>
            <Link 
              href="/super-admin/gyms"
              className={cn(buttonVariants({ variant: "outline" }), "w-full mt-6 bg-white/5 border-white/10 text-white hover:bg-white/10")}
            >
              View All Gyms
            </Link>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 bg-slate-900/50 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">System Health</CardTitle>
            <CardDescription className="text-slate-400">Real-time platform status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <span className="text-sm text-slate-300">Auth Engine</span>
              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">Operational</Badge>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <span className="text-sm text-slate-300">Database Cluster</span>
              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">Operational</Badge>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <span className="text-sm text-slate-300">Storage API</span>
              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">Operational</Badge>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <span className="text-sm text-slate-300">Notification Bridge</span>
              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">Operational</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Badge({ children, className, variant }: { children: React.ReactNode, className?: string, variant?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors focus:outline-none",
      className
    )}>
      {children}
    </span>
  )
}
