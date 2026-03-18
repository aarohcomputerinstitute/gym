import { StatsCards } from "@/components/dashboard/StatsCards"
import { RevenueChart } from "@/components/dashboard/RevenueChart"
import { MemberGrowthChart } from "@/components/dashboard/MemberGrowthChart"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"

export default function DashboardPage() {
  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? "Good Morning" : currentHour < 18 ? "Good Afternoon" : "Good Evening"

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
          <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white h-11 px-6 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95">
            <Plus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </div>
      </div>

      <StatsCards />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-slate-900/60 border-white/10 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between pb-8 border-b border-white/5 mb-4">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                Revenue Insights
                <div className="px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold shadow-sm">LIVE</div>
              </CardTitle>
              <CardDescription className="text-slate-400">
                Monthly revenue distribution across all plans.
              </CardDescription>
            </div>
            <div className="text-3xl font-bold text-white italic tracking-tight">₹2,45,000</div>
          </CardHeader>
          <CardContent className="h-[350px]">
            <RevenueChart />
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-slate-900/60 border-white/10 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 animate-fade-in delay-100">
          <CardHeader className="pb-8 border-b border-white/5 mb-4">
            <CardTitle className="text-xl font-bold text-white">Member Dynamics</CardTitle>
            <CardDescription className="text-slate-400">
              Retention rate vs new signups.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <MemberGrowthChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-slate-900/60 border-white/10 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 animate-fade-in delay-200">
          <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 mb-6">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold text-white">Recent Activity</CardTitle>
              <CardDescription className="text-slate-400">
                Real-time stream from your facility.
              </CardDescription>
            </div>
            <Button variant="ghost" className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-xl px-4 border border-white/5">See All</Button>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
