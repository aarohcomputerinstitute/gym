import { StatsCards, StatData } from "@/components/dashboard/StatsCards"
import { RevenueChart, RevenueDataPoint } from "@/components/dashboard/RevenueChart"
import { MemberGrowthChart, MemberGrowthDataPoint } from "@/components/dashboard/MemberGrowthChart"
import { RecentActivity, ActivityItem } from "@/components/dashboard/RecentActivity"
import { UpcomingRenewals, RenewalItem } from "@/components/dashboard/UpcomingRenewals"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Plus, Download, Users, UserCheck, DollarSign, CalendarClock,
  CreditCard, ClipboardCheck, MessageSquarePlus, AlertTriangle
} from "lucide-react"
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

  const now = new Date()
  const currentHour = now.getHours()
  const greeting = currentHour < 12 ? "Good Morning" : currentHour < 18 ? "Good Afternoon" : "Good Evening"

  // ────────────────────────────────────────────────
  // 1. CORE STATS
  // ────────────────────────────────────────────────
  const { count: totalMembers } = await adminClient.from('members').select('*', { count: 'exact', head: true }).eq('gym_id', gymId)
  const { count: activeMembers } = await adminClient.from('members').select('*', { count: 'exact', head: true }).eq('gym_id', gymId).eq('status', 'active')
  const { count: todayAttendance } = await adminClient.from('attendance').select('*', { count: 'exact', head: true }).eq('gym_id', gymId).eq('date', now.toISOString().split('T')[0])

  // ────────────────────────────────────────────────
  // 2. REVENUE: This month + Last month for MoM comparison
  // ────────────────────────────────────────────────
  const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
  const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0]

  const { data: allPayments } = await adminClient
    .from('payments')
    .select('amount, total_amount, payment_date')
    .eq('gym_id', gymId)
  
  const thisMonthRevenue = (allPayments || [])
    .filter(p => p.payment_date >= firstDayThisMonth)
    .reduce((acc, p) => acc + (Number(p.amount) || 0), 0)

  const lastMonthRevenue = (allPayments || [])
    .filter(p => p.payment_date >= firstDayLastMonth && p.payment_date < firstDayThisMonth)
    .reduce((acc, p) => acc + (Number(p.amount) || 0), 0)
  
  const revenueChange = lastMonthRevenue > 0
    ? Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
    : thisMonthRevenue > 0 ? 100 : 0

  // Pending Dues
  const pendingDues = (allPayments || []).reduce((acc, curr) => {
    const total = Number(curr.total_amount) || 0
    const paid = Number(curr.amount) || 0
    return acc + Math.max(0, total - paid)
  }, 0)

  // ────────────────────────────────────────────────
  // 3. MONTH-OVER-MONTH MEMBER COMPARISON
  // ────────────────────────────────────────────────
  const { count: lastMonthMembers } = await adminClient
    .from('members')
    .select('*', { count: 'exact', head: true })
    .eq('gym_id', gymId)
    .lt('created_at', firstDayThisMonth)

  const memberChange = (lastMonthMembers || 0) > 0
    ? Math.round((((totalMembers || 0) - (lastMonthMembers || 0)) / (lastMonthMembers || 1)) * 100)
    : (totalMembers || 0) > 0 ? 100 : 0

  // ────────────────────────────────────────────────
  // 4. REVENUE CHART DATA (last 6 months)
  // ────────────────────────────────────────────────
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const revenueChartData: RevenueDataPoint[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthStart = d.toISOString().split('T')[0]
    const nextMonth = new Date(d.getFullYear(), d.getMonth() + 1, 1).toISOString().split('T')[0]
    const monthTotal = (allPayments || [])
      .filter(p => p.payment_date >= monthStart && p.payment_date < nextMonth)
      .reduce((acc, p) => acc + (Number(p.amount) || 0), 0)
    revenueChartData.push({ name: monthNames[d.getMonth()], total: monthTotal })
  }

  // ────────────────────────────────────────────────
  // 5. MEMBER GROWTH CHART DATA (last 6 months)
  // ────────────────────────────────────────────────
  const { data: allMembers } = await adminClient
    .from('members')
    .select('join_date, created_at')
    .eq('gym_id', gymId)

  const memberChartData: MemberGrowthDataPoint[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0) // last day of that month
    const monthStart = d.toISOString().split('T')[0]
    const monthEndStr = monthEnd.toISOString().split('T')[0]
    const nextMonthStr = new Date(d.getFullYear(), d.getMonth() + 1, 1).toISOString().split('T')[0]

    // Total members that existed by end of that month
    const totalByMonth = (allMembers || []).filter(m => {
      const joinDate = m.join_date || (m.created_at ? m.created_at.split('T')[0] : null)
      return joinDate && joinDate <= monthEndStr
    }).length

    // New members that joined in that specific month
    const newInMonth = (allMembers || []).filter(m => {
      const joinDate = m.join_date || (m.created_at ? m.created_at.split('T')[0] : null)
      return joinDate && joinDate >= monthStart && joinDate < nextMonthStr
    }).length

    memberChartData.push({ name: monthNames[d.getMonth()], total: totalByMonth, newMembers: newInMonth })
  }

  // ────────────────────────────────────────────────
  // 6. UPCOMING RENEWALS (expiring in next 7 days)
  // ────────────────────────────────────────────────
  const todayStr = now.toISOString().split('T')[0]
  const sevenDaysLater = new Date(now.getTime() + 7 * 86400000).toISOString().split('T')[0]

  const { data: expiringSubscriptions } = await adminClient
    .from('member_subscriptions')
    .select('member_id, end_date, status, membership_plans(name), members(id, name)')
    .eq('gym_id', gymId)
    .eq('status', 'active')
    .gte('end_date', todayStr)
    .lte('end_date', sevenDaysLater)
    .order('end_date', { ascending: true })
    .limit(10)

  const renewalItems: RenewalItem[] = (expiringSubscriptions || []).map(s => {
    const endDate = new Date(s.end_date)
    const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / 86400000))
    return {
      memberId: (s.members as any)?.id || s.member_id,
      memberName: (s.members as any)?.name || "Unknown",
      planName: (s.membership_plans as any)?.name || "Plan",
      expiryDate: endDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      daysLeft,
    }
  })

  // ────────────────────────────────────────────────
  // 7. RECENT ACTIVITIES
  // ────────────────────────────────────────────────
  const { data: recentPayments } = await adminClient
    .from('payments')
    .select('amount, created_at, members(name)')
    .eq('gym_id', gymId)
    .order('created_at', { ascending: false })
    .limit(3)

  const { data: recentCheckins } = await adminClient
    .from('attendance')
    .select('checkin_time, created_at, members(name)')
    .eq('gym_id', gymId)
    .order('created_at', { ascending: false })
    .limit(3)

  const actItems: ActivityItem[] = [
    ...(recentPayments || []).map(p => ({
      name: (p.members as any)?.name || "Unknown Member",
      action: "Payment Received",
      time: new Date(p.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      initials: (p.members as any)?.name?.split(' ').map((n: string) => n[0]).join('') || "??",
      amount: `+₹${Number(p.amount).toLocaleString()}`,
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

  // ────────────────────────────────────────────────
  // STAT CARDS
  // ────────────────────────────────────────────────
  const stats: StatData[] = [
    {
      title: "Total Members",
      value: (totalMembers || 0).toString(),
      change: `${memberChange >= 0 ? '+' : ''}${memberChange}%`,
      isPositive: memberChange >= 0,
      icon: Users,
      color: "bg-blue-500"
    },
    {
      title: "Active Members",
      value: (activeMembers || 0).toString(),
      change: `${Math.round(((activeMembers || 0) / Math.max(totalMembers || 1, 1)) * 100)}% of total`,
      isPositive: true,
      icon: UserCheck,
      color: "bg-indigo-500"
    },
    {
      title: "Monthly Revenue",
      value: `₹${thisMonthRevenue.toLocaleString()}`,
      change: `${revenueChange >= 0 ? '+' : ''}${revenueChange}%`,
      isPositive: revenueChange >= 0,
      icon: DollarSign,
      color: "bg-emerald-500"
    },
    {
      title: "Today's Check-ins",
      value: (todayAttendance || 0).toString(),
      change: "Today",
      isPositive: true,
      icon: CalendarClock,
      color: "bg-amber-500"
    },
    {
      title: "Pending Dues",
      value: `₹${pendingDues.toLocaleString()}`,
      change: pendingDues > 0 ? "Action Needed" : "All Clear!",
      isPositive: pendingDues === 0,
      icon: DollarSign,
      color: "bg-rose-500"
    }
  ]

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 flex-1 space-y-8 pt-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in-up">
        <div className="space-y-1">
          <p className="text-sm font-medium text-blue-500 uppercase tracking-wider">{greeting}</p>
          <div className="flex items-center gap-3">
            <h2 className="text-4xl font-bold tracking-tight text-white italic font-sans">
              Dashboard
            </h2>
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse mt-3" />
          </div>
          <p className="text-slate-400">Your gym&apos;s real-time performance overview.</p>
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

      {/* Charts Row */}
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
                Monthly revenue distribution (last 6 months).
              </CardDescription>
            </div>
            <div className="text-3xl font-bold text-white italic tracking-tight drop-shadow-md">₹{thisMonthRevenue.toLocaleString()}</div>
          </CardHeader>
          <CardContent className="h-[350px]">
            <RevenueChart data={revenueChartData} />
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-slate-800/50 border-white/20 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 animate-fade-in delay-100 relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <CardHeader className="pb-8 border-b border-white/10 mb-4">
            <CardTitle className="text-xl font-bold text-white">Member Dynamics</CardTitle>
            <CardDescription className="text-slate-300">
              Total members vs new signups (last 6 months).
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <MemberGrowthChart data={memberChartData} />
          </CardContent>
        </Card>
      </div>

      {/* Activity + Renewals Row */}
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

        <Card className="col-span-3 bg-slate-800/50 border-white/20 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 animate-fade-in delay-300 relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <CardHeader className="border-b border-white/10 mb-4">
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              Expiring Soon
              {renewalItems.length > 0 && (
                <span className="ml-auto px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                  {renewalItems.length}
                </span>
              )}
            </CardTitle>
            <CardDescription className="text-slate-300">
              Members whose plans expire in the next 7 days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UpcomingRenewals renewals={renewalItems} />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Button asChild className="h-14 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 rounded-xl transition-all justify-start px-6">
          <Link href="/members/new">
            <Plus className="mr-3 h-5 w-5" />
            Add New Member
          </Link>
        </Button>
        <Button asChild className="h-14 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/20 rounded-xl transition-all justify-start px-6">
          <Link href="/payments/new">
            <CreditCard className="mr-3 h-5 w-5" />
            Collect Payment
          </Link>
        </Button>
        <Button asChild className="h-14 bg-amber-600/10 hover:bg-amber-600 text-amber-400 hover:text-white border border-amber-500/20 rounded-xl transition-all justify-start px-6">
          <Link href="/attendance">
            <ClipboardCheck className="mr-3 h-5 w-5" />
            Mark Attendance
          </Link>
        </Button>
        <Button asChild className="h-14 bg-violet-600/10 hover:bg-violet-600 text-violet-400 hover:text-white border border-violet-500/20 rounded-xl transition-all justify-start px-6">
          <Link href="/inquiries/new">
            <MessageSquarePlus className="mr-3 h-5 w-5" />
            New Inquiry
          </Link>
        </Button>
      </div>
    </div>
  )
}
