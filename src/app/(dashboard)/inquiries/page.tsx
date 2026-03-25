import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { InquiryTable } from "@/components/inquiries/InquiryTable"
import { InquiryForm } from "@/components/inquiries/InquiryForm"
import { Button } from "@/components/ui/button"
import { PlusCircle, Search, Filter, Layers } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function InquiriesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const adminClient = createAdminClient()
  
  // 1. Fetch user's gym_id
  const { data: profile } = await adminClient
    .from('users')
    .select('gym_id')
    .eq('id', user.id)
    .single()

  if (!profile?.gym_id) return <div>Auth mismatch.</div>

  // 2. Fetch inquiries for this gym
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
    <div className="flex-1 space-y-8 pt-6 pb-10 max-w-[1600px] mx-auto px-4 lg:px-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-12 bg-blue-600 rounded-full" />
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Sales Pipeline</span>
          </div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 leading-none">Inquiry <span className="text-blue-600">Lounge</span></h2>
          <p className="text-slate-500 font-medium mt-2 text-base max-w-lg leading-relaxed">
            Professional lead management and conversion tracking terminal.
          </p>
        </div>

        <div className="flex items-center gap-3">
           <div className="bg-white border border-slate-100 rounded-2xl p-2 shadow-sm flex items-center gap-1 group">
              <Search className="h-4 w-4 text-slate-300 ml-2 group-focus-within:text-blue-500 transition-colors" />
              <Input placeholder="Search prospects..." className="border-0 focus-visible:ring-0 w-[200px] h-9 text-sm font-medium" />
           </div>
           <Button className="h-11 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold shadow-lg shadow-slate-100 transition-all flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Scan
           </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Left: Pipeline Dashboard */}
        <div className="lg:col-span-8 space-y-8">
           <Tabs defaultValue="all" className="w-full">
              <div className="flex items-center justify-between mb-6">
                <TabsList className="bg-slate-100/50 p-1 rounded-2xl h-11 border border-slate-100">
                  <TabsTrigger value="all" className="rounded-xl px-6 font-bold data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all text-xs">
                    All Leads ({counts.all})
                  </TabsTrigger>
                  <TabsTrigger value="hot" className="rounded-xl px-6 font-bold data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm transition-all text-xs">
                    Hot Leads ({counts.hot})
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="rounded-xl px-6 font-bold data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all text-xs">
                    Pending ({counts.pending})
                  </TabsTrigger>
                   <TabsTrigger value="joined" className="rounded-xl px-6 font-bold data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm transition-all text-xs">
                    Joined ({counts.joined})
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all" className="mt-0 focus-visible:outline-none">
                <InquiryTable inquiries={typedInquiries} />
              </TabsContent>
              <TabsContent value="hot" className="mt-0 focus-visible:outline-none">
                <InquiryTable inquiries={typedInquiries.filter(i => i.status === 'hot')} />
              </TabsContent>
              <TabsContent value="pending" className="mt-0 focus-visible:outline-none">
                <InquiryTable inquiries={typedInquiries.filter(i => i.status === 'pending' || i.status === 'visiting')} />
              </TabsContent>
              <TabsContent value="joined" className="mt-0 focus-visible:outline-none">
                <InquiryTable inquiries={typedInquiries.filter(i => i.status === 'joined')} />
              </TabsContent>
           </Tabs>
        </div>

        {/* Right: Capture Terminal */}
        <div className="lg:col-span-4 space-y-6">
          <InquiryForm />

          {/* Tips Section */}
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 h-24 w-24 bg-blue-600/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10">
               <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-xl bg-blue-600 flex items-center justify-center">
                    <Layers className="h-4 w-4" />
                  </div>
                  <h4 className="font-black text-sm uppercase tracking-widest">Conversion Tips</h4>
               </div>
               <ul className="space-y-4">
                  <li className="flex gap-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">Follow up within <span className="text-white font-bold">24 hours</span> to increase conversion probability by 80%.</p>
                  </li>
                  <li className="flex gap-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">Mark as <span className="text-amber-400 font-bold underline decoration-amber-400/30 underline-offset-4 tracking-tighter">HOT LEAD</span> for prospects with immediate joining intent.</p>
                  </li>
                  <li className="flex gap-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">Record the <span className="text-white font-bold">Marketing Source</span> to optimize your future gym advertisements.</p>
                  </li>
               </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
