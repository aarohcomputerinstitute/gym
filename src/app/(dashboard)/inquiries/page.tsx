import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { InquiryTable } from "@/components/inquiries/InquiryTable"
import { InquiryForm } from "@/components/inquiries/InquiryForm"
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
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-8 lg:py-12 space-y-10">
        
        {/* Pro Header Section */}
        <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center gap-2">
                  <Sparkles className="h-3 w-3 text-blue-400" />
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Growth Engine v2.0</span>
               </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-none">
              Inquiry <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 italic">Terminal</span>
            </h1>
            <p className="text-slate-400 font-medium text-sm sm:text-base max-w-xl leading-relaxed">
              Elevate your conversion rate with our professional lead orchestration suite. 
              Track, nurture, and automate your sales pipeline.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
             <div className="relative group flex-1 sm:flex-none">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <Input 
                  placeholder="Search prospects..." 
                  className="bg-slate-900/50 border-slate-800 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 w-full sm:w-[300px] h-12 pl-12 rounded-2xl text-sm font-medium transition-all" 
                />
             </div>
             <Button className="h-12 px-6 bg-white hover:bg-slate-100 text-slate-950 rounded-2xl font-black shadow-xl shadow-white/5 transition-all flex items-center gap-2 group">
                <Filter className="h-4 w-4 transition-transform group-hover:rotate-180" />
                Filter Engine
             </Button>
          </div>
        </header>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
           {[
             { label: 'Total Leads', val: counts.all, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400' },
             { label: 'Hot Pipeline', val: counts.hot, icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-400' },
             { label: 'Active Pending', val: counts.pending, icon: Target, color: 'text-indigo-400', bg: 'bg-indigo-400' },
             { label: 'Conversions', val: counts.joined, icon: Sparkles, color: 'text-green-400', bg: 'bg-green-400' },
           ].map((stat, i) => (
             <div key={i} className="bg-slate-900/40 border border-slate-800/50 p-5 rounded-3xl backdrop-blur-sm group hover:border-slate-700/50 transition-all">
                <div className="flex items-center justify-between mb-3">
                   <div className={`p-2 rounded-xl ${stat.bg}/10`}>
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                   </div>
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Live</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">{stat.val}</div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">{stat.label}</div>
             </div>
           ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Main Pipeline Content */}
          <div className="lg:col-span-8 space-y-8 order-2 lg:order-1">
             <Tabs defaultValue="all" className="w-full">
                <TabsList className="bg-slate-900/50 p-1.5 rounded-2xl h-14 border border-slate-800 mb-8 backdrop-blur-md sticky top-4 z-20">
                  <TabsTrigger value="all" className="flex-1 rounded-xl font-black text-[11px] uppercase tracking-tighter sm:tracking-widest data-[state=active]:bg-white data-[state=active]:text-slate-950 transition-all">
                    Global Stream
                  </TabsTrigger>
                  <TabsTrigger value="hot" className="flex-1 rounded-xl font-black text-[11px] uppercase tracking-tighter sm:tracking-widest data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all">
                    Hot Leads
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="flex-1 rounded-xl font-black text-[11px] uppercase tracking-tighter sm:tracking-widest data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all">
                    Pending
                  </TabsTrigger>
                   <TabsTrigger value="joined" className="flex-1 rounded-xl font-black text-[11px] uppercase tracking-tighter sm:tracking-widest data-[state=active]:bg-green-500 data-[state=active]:text-white transition-all">
                    Converted
                  </TabsTrigger>
                </TabsList>

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

          {/* Side Panels */}
          <div className="lg:col-span-4 space-y-8 order-1 lg:order-2">
             <InquiryForm />

             {/* Pro Conversion Dashboard */}
             <div className="relative group outline-none overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 p-8 shadow-2xl shadow-blue-500/10">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 h-48 w-48 bg-white/10 rounded-full blur-3xl" />
                <div className="relative z-10 space-y-6">
                   <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-inner">
                      <Target className="h-6 w-6 text-white" />
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-2xl font-black text-white leading-tight">Elite Conversion <br/>Optimization</h3>
                      <p className="text-white/70 text-sm font-medium leading-relaxed">
                        Data-driven techniques to scale your gym membership base.
                      </p>
                   </div>
                   <div className="space-y-4 pt-4 border-t border-white/10">
                      {[
                        'Response time < 10 mins',
                        'Highlight transformation results',
                        'Offer limited-time trial perks'
                      ].map((tip, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                           <div className="h-5 w-5 rounded-full bg-white/10 flex items-center justify-center">
                              <Sparkles className="h-2.5 w-2.5 text-white/80" />
                           </div>
                           <span className="text-xs font-bold text-white/90">{tip}</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
