import { StatsCards, StatData } from "@/components/dashboard/StatsCards"
import { RevenueChart } from "@/components/dashboard/RevenueChart"
import { MemberGrowthChart } from "@/components/dashboard/MemberGrowthChart"
import { RecentActivity, ActivityItem } from "@/components/dashboard/RecentActivity"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Download, Users, UserCheck, DollarSign, CalendarClock, Settings, UserCircle, CreditCard } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const adminClient = createAdminClient()
  
  // Get gym_id for scoped queries
  const { data: profile } = await adminClient
    .from('users')
    .select('gym_id')
    .eq('id', user.id)
    .single()
  
  const gymId = profile?.gym_id
  
  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? "Good Morning" : currentHour < 18 ? "Good Afternoon" : "Good Evening"

  // 1. Fetch Dynamic Stats (scoped by gym_id)
  const { count: totalMembers } = await adminClient.from('members').select('*', { count: 'exact', head: true }).eq('gym_id', gymId)
  const { count: activeMembers } = await adminClient.from('members').select('*', { count: 'exact', head: true }).eq('gym_id', gymId).eq('status', 'active')
  const { count: todayAttendance } = await adminClient.from('attendance').select('*', { count: 'exact', head: true }).eq('gym_id', gymId).eq('date', new Date().toISOString().split('T')[0])
  
  // Fetch Monthly Revenue
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  const { data: paymentsSum } = await adminClient.from('payments').select('total_amount').eq('gym_id', gymId).filter('payment_date', 'gte', firstDayOfMonth)
  const monthlyRevenue = (paymentsSum || []).reduce((acc, curr) => acc + Number(curr.total_amount), 0)

  // 2. Fetch Recent Activities (Combined)
  const { data: recentPayments } = await adminClient
    .from('payments')
    .select('total_amount, created_at, members(name)')
    .eq('gym_id', gymId)
    .order('created_at', { ascending: false })
    .limit(3)

  const { data: recentCheckins } = await adminClient
    .from('attendance')
    .select('checkin_time, created_at, members(name)')
    .eq('gym_id', gymId)
    .order('created_at', { ascending: false })
    .limit(3)

  // Merge and sort activities
  const actItems: ActivityItem[] = [
    ...(recentPayments || []).map(p => ({
      name: (p.members as any)?.name || "Unknown Member",
      action: "Payment Received",
      time: new Date(p.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      initials: (p.members as any)?.name?.split(' ').map((n: string) => n[0]).join('') || "??",
      amount: `+₹${p.total_amount}`,
      color: "bg-green-500/10 text-green-400"
    })),
    ...(recentCheckins || []).map(a => ({
      name: (a.members as any)?.name || "Unknown Member",
      action: "Checked in",
      time: new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      initials: (a.members as any)?.name?.split(' ').map((n: string) => n[0]).join('') || "??",
      amount: null,
      color: "bg-blue-500/10 text-blue-400"
    }))
  ].sort((a, b) => b.time.localeCompare(a.time)).slice(0, 5)

  const stats: StatData[] = [
    {
      title: "Total Members",
      value: (totalMembers || 0).toString(),
      change: "+0%",
      isPositive: true,
      icon: Users,
      color: "bg-blue-500"
    },
    {
      title: "Active Members",
      value: (activeMembers || 0).toString(),
      change: "+0%",
      isPositive: true,
      icon: UserCheck,
      color: "bg-indigo-500"
    },
    {
      title: "Monthly Revenue",
      value: `₹${monthlyRevenue.toLocaleString()}`,
      change: "+0%",
      isPositive: true,
      icon: DollarSign,
      color: "bg-emerald-500"
    },
    {
      title: "Today's Check-ins",
      value: (todayAttendance || 0).toString(),
      change: "0%",
      isPositive: true,
      icon: CalendarClock,
      color: "bg-amber-500"
    }
  ]

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in-up">
        <div className="space-y-1">
          <p className="text-sm font-medium text-blue-500 uppercase tracking-wider">{greeting}</p>
          <div className="flex items-center gap-3">
            <h2 className="text-4xl font-bold tracking-tight text-white italic font-sans">
              Dashboard
            </h2>
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse mt-3" />
          </div>
          <p className="text-slate-400">Your gym's performance is optimized and looking great today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="hidden md:flex bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10 h-11 rounded-xl transition-all">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-500 text-white h-11 px-6 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95">
            <Link href="/members/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </Link>
          </Button>
        </div>
      </div>

      <StatsCards stats={stats} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-slate-800/50 border-white/20 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 animate-fade-in relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between pb-8 border-b border-white/10 mb-4">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                Revenue Insights
                <div className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-bold shadow-sm">LIVE</div>
              </CardTitle>
              <CardDescription className="text-slate-300">
                Monthly revenue distribution across all plans.
              </CardDescription>
            </div>
            <div className="text-3xl font-bold text-white italic tracking-tight drop-shadow-md">₹{monthlyRevenue.toLocaleString()}</div>
          </CardHeader>
          <CardContent className="h-[350px]">
            <RevenueChart />
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-slate-800/50 border-white/20 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 animate-fade-in delay-100 relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <CardHeader className="pb-8 border-b border-white/10 mb-4">
            <CardTitle className="text-xl font-bold text-white">Member Dynamics</CardTitle>
            <CardDescription className="text-slate-300">
              Retention rate vs new signups.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <MemberGrowthChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-slate-800/50 border-white/20 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 animate-fade-in delay-200 relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between border-b border-white/10 mb-6">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold text-white">Recent Activity</CardTitle>
              <CardDescription className="text-slate-300">
                Real-time stream from your facility.
              </CardDescription>
            </div>
            <Button variant="ghost" className="text-blue-300 hover:text-blue-200 hover:bg-blue-500/20 rounded-xl px-4 border border-white/10">See All</Button>
          </CardHeader>
          <CardContent>
            <RecentActivity activities={actItems} />
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-slate-800/50 border-white/20 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 animate-fade-in delay-300 relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <CardHeader className="border-b border-white/10 mb-6">
            <CardTitle className="text-xl font-bold text-white">Quick Actions</CardTitle>
            <CardDescription className="text-slate-300">
              Rapid management tools.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
             <Button asChild className="w-full justify-start h-12 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 rounded-xl transition-all group/btn">
               <Link href="/members/new">
                 <Plus className="mr-3 h-5 w-5" />
                 Add New Member
               </Link>
             </Button>
             <Button asChild variant="outline" className="w-full justify-start h-12 bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all">
               <Link href="/payments/new">
                 <CreditCard className="mr-3 h-5 w-5 text-emerald-400" />
                 Collect Payment
               </Link>
             </Button>
             <Button asChild variant="outline" className="w-full justify-start h-12 bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all">
               <Link href="/settings">
                 <UserCircle className="mr-3 h-5 w-5 text-indigo-400" />
                 Update Profile
               </Link>
             </Button>
             <Button asChild variant="outline" className="w-full justify-start h-12 bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all">
               <Link href="/settings">
                 <Settings className="mr-3 h-5 w-5 text-amber-400" />
                 Gym Settings
               </Link>
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
