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
        
        {/* Pro Header Section */}
        <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center gap-2">
                  <Sparkles className="h-3 w-3 text-blue-400" />
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Growth Engine v3.0</span>
               </div>
            </div>
            <h1 className="text-5xl sm:text-6xl font-black tracking-tighter text-white leading-none">
              Inquiry <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 italic">Terminal</span>
            </h1>
            <p className="text-slate-400 font-medium text-base sm:text-lg max-w-2xl leading-relaxed">
              Elevate your conversion rate with our professional lead orchestration suite. 
              Track, nurture, and automate your sales pipeline in an immersive, full-width workspace.
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

        {/* Extended Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
           <div className="col-span-2 lg:col-span-1 hidden lg:block">
              <div className="h-full bg-gradient-to-br from-blue-600/20 to-indigo-700/10 border border-blue-500/20 p-6 rounded-3xl flex flex-col justify-center gap-3">
                 <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none">System Status</div>
                 <div className="text-lg font-black text-white leading-none uppercase tracking-tighter">Operational</div>
                 <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-500/80 uppercase">Pipeline Secure</span>
                 </div>
              </div>
           </div>
           {[
             { label: 'Total Leads', val: counts.all, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400' },
             { label: 'Hot Pipeline', val: counts.hot, icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-400' },
             { label: 'Active Pending', val: counts.pending, icon: Target, color: 'text-indigo-400', bg: 'bg-indigo-400' },
             { label: 'Conversions', val: counts.joined, icon: Sparkles, color: 'text-green-400', bg: 'bg-green-400' },
           ].map((stat, i) => (
             <div key={i} className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-3xl backdrop-blur-sm group hover:border-slate-700/50 transition-all">
                <div className="flex items-center justify-between mb-4">
                   <div className={`p-3 rounded-2xl ${stat.bg}/10`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                   </div>
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Live</span>
                </div>
                <div className="text-3xl font-black text-white">{stat.val}</div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-2">{stat.label}</div>
             </div>
           ))}
        </div>

        {/* Immersive Full-Width Table Workspace */}
        <div className="w-full space-y-8">
           <Tabs defaultValue="all" className="w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                <TabsList className="bg-slate-900/50 p-1.5 rounded-2xl h-14 border border-slate-800 backdrop-blur-md">
                  <TabsTrigger value="all" className="px-8 rounded-xl font-black text-[11px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-slate-950 transition-all">
                    Global Stream
                  </TabsTrigger>
                  <TabsTrigger value="hot" className="px-8 rounded-xl font-black text-[11px] uppercase tracking-widest data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all">
                    Hot Leads
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="px-8 rounded-xl font-black text-[11px] uppercase tracking-widest data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all">
                    Pending
                  </TabsTrigger>
                   <TabsTrigger value="joined" className="px-8 rounded-xl font-black text-[11px] uppercase tracking-widest data-[state=active]:bg-green-500 data-[state=active]:text-white transition-all">
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

        {/* Pro Conversion Dashboard (Now Full Width Footer) */}
        <div className="relative group outline-none overflow-hidden rounded-[3rem] bg-gradient-to-r from-blue-600 to-indigo-700 p-12 shadow-2xl shadow-blue-500/10">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-80 w-80 bg-white/5 rounded-full blur-3xl p-10" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
             <div className="space-y-6 max-w-2xl">
                <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-inner">
                   <Target className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-3">
                   <h3 className="text-4xl font-black text-white leading-tight tracking-tighter">Elite Conversion <span className="text-white/60 italic">Optimization</span></h3>
                   <p className="text-white/80 text-lg font-medium leading-relaxed">
                     Utilize our data-driven sales terminal to scale your member base with unmatched efficiency.
                   </p>
                </div>
             </div>
             <div className="grid sm:grid-cols-2 gap-6 lg:w-[500px]">
                {[
                  'Response time < 10 mins',
                  'Personalized transformation',
                  'Exclusive limited-time perks',
                  'Social proof & testimonials'
                ].map((tip, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-white/10 p-5 rounded-2xl backdrop-blur-sm border border-white/5">
                     <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
                        <Sparkles className="h-3 w-3 text-white" />
                     </div>
                     <span className="text-sm font-black text-white uppercase tracking-tight">{tip}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
