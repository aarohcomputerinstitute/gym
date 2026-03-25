import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { InquiryTable } from "@/components/inquiries/InquiryTable"
import { LeadCaptureButton } from "@/components/inquiries/LeadCaptureButton"
import { Button } from "@/components/ui/button"
import { Search, Filter, Sparkles, TrendingUp, Users, Target } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function InquiriesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const adminClient = createAdminClient()
  
  const { data: profile } = await adminClient
    .from('users')
    .select('gym_id')
    .eq('id', user.id)
    .single()

  if (!profile?.gym_id) return <div>Auth mismatch.</div>

  const { data: inquiries } = await adminClient
    .from('inquiries')
    .select('*')
    .eq('gym_id', profile.gym_id)
    .order('created_at', { ascending: false })

  const typedInquiries = (inquiries || []).map(i => ({
    ...i,
    status: i.status as any
  }))

  const counts = {
    all: typedInquiries.length,
    hot: typedInquiries.filter(i => i.status === 'hot').length,
    pending: typedInquiries.filter(i => i.status === 'pending' || i.status === 'visiting').length,
    joined: typedInquiries.filter(i => i.status === 'joined').length
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30 p-4 md:p-8">
      <div className="max-w-[1700px] mx-auto py-8 lg:py-12 space-y-12">
        
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-white leading-none">
              Inquiry <span className="text-blue-400 italic">Dashboard</span>
            </h1>
            <p className="text-slate-400 font-medium text-sm sm:text-base max-w-xl">
              Track and convert your gym's interest pipeline in real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
             <div className="relative group flex-1 sm:flex-none">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <Input 
                  placeholder="Search prospects..." 
                  className="bg-slate-900/50 border-slate-800 focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/5 w-full sm:w-[320px] h-14 pl-14 rounded-2xl text-base font-medium transition-all" 
                />
             </div>
             
             {/* Integrated Lead Capture Button */}
             <LeadCaptureButton />
             
             <Button variant="outline" className="h-12 px-6 bg-transparent border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 rounded-2xl font-black transition-all flex items-center gap-2 group">
                <Filter className="h-4 w-4 transition-transform group-hover:rotate-180" />
                Advanced Filters
             </Button>
          </div>
        </header>

        {/* Growth Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
           {[
             { label: 'Total Leads', val: counts.all, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400' },
             { label: 'Hot Leads', val: counts.hot, icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-400' },
             { label: 'In-Process', val: counts.pending, icon: Target, color: 'text-indigo-400', bg: 'bg-indigo-400' },
             { label: 'Converted', val: counts.joined, icon: Sparkles, color: 'text-green-400', bg: 'bg-green-400' },
           ].map((stat, i) => (
             <div key={i} className="bg-slate-900/30 border border-slate-800/50 p-6 rounded-2xl backdrop-blur-sm group transition-all hover:bg-slate-900/50">
                <div className="flex items-center gap-3 mb-4">
                   <div className={`p-2 rounded-lg ${stat.bg}/10`}>
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                   </div>
                   <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</div>
                </div>
                <div className="text-3xl font-black text-white">{stat.val}</div>
             </div>
           ))}
        </div>

        {/* Immersive Full-Width Table Workspace */}
        <div className="w-full space-y-8">
           <Tabs defaultValue="all" className="w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                <TabsList className="bg-slate-900/50 p-1 rounded-xl h-12 border border-slate-800 backdrop-blur-md">
                  <TabsTrigger value="all" className="px-6 rounded-lg font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-slate-950 transition-all">
                    All Leads
                  </TabsTrigger>
                  <TabsTrigger value="hot" className="px-6 rounded-lg font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all">
                    Hot
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="px-6 rounded-lg font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all">
                    Needs Attention
                  </TabsTrigger>
                   <TabsTrigger value="joined" className="px-6 rounded-lg font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-green-500 data-[state=active]:text-white transition-all">
                    Converted
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-900/40 rounded-2xl border border-white/5">
                   <Users className="h-4 w-4 text-slate-500" />
                   <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Active Stakeholders: {counts.all}</span>
                </div>
              </div>

              <TabsContent value="all" className="mt-0 focus-visible:outline-none outline-none ring-0">
                <InquiryTable inquiries={typedInquiries} />
              </TabsContent>
              <TabsContent value="hot" className="mt-0 focus-visible:outline-none outline-none ring-0">
                <InquiryTable inquiries={typedInquiries.filter(i => i.status === 'hot')} />
              </TabsContent>
              <TabsContent value="pending" className="mt-0 focus-visible:outline-none outline-none ring-0">
                <InquiryTable inquiries={typedInquiries.filter(i => i.status === 'pending' || i.status === 'visiting')} />
              </TabsContent>
              <TabsContent value="joined" className="mt-0 focus-visible:outline-none outline-none ring-0">
                <InquiryTable inquiries={typedInquiries.filter(i => i.status === 'joined')} />
              </TabsContent>
           </Tabs>
        </div>

      </div>
    </div>
  )
}
