import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { PaymentForm } from "@/components/payments/PaymentForm"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Wallet } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function RecordPaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ memberId?: string }>
}) {
  const { memberId } = await searchParams
  const supabase = await createClient()
  
  // 1. Authenticate user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  // 2. Use admin client (bypasses RLS) for reliable gym-scoped fetching
  const adminClient = createAdminClient()
  
  // 3. Fetch the user's gym_id from their profile
  const { data: profile } = await adminClient
    .from('users')
    .select('gym_id')
    .eq('id', user.id)
    .single()
    
  if (!profile?.gym_id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-white rounded-2xl border border-slate-200 shadow-sm mt-10 mx-auto max-w-lg">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Gym Profile Not Found</h2>
        <p className="text-slate-500 mb-6 text-sm">We couldn't link your account to a gym. Please try logging out and in again to refresh your session.</p>
        <Button asChild variant="outline">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    )
  }

  const gymId = profile.gym_id

  // 4. Fetch Members for this specific gym
  const { data: members } = await adminClient
    .from('members')
    .select('id, name, member_code')
    .eq('gym_id', gymId)
    .order('name', { ascending: true })

  // 5. Fetch Active Plans for this specific gym
  const { data: plans } = await adminClient
    .from('membership_plans')
    .select('id, name, price, duration_days')
    .eq('gym_id', gymId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  // Format data for the form
  const formattedMembers = (members || []).map(m => ({
    id: m.id,
    name: m.name,
    member_number: m.member_code
  }))

  const formattedPlans = (plans || []).map(p => ({
    id: p.id,
    name: p.name,
    price: Number(p.price),
    duration_days: p.duration_days
  }))

  return (
    <div className="flex-1 space-y-8 pt-6 pb-20 max-w-[1400px] mx-auto px-4 lg:px-8">
      <div className="flex items-center gap-6">
        <Button variant="outline" size="icon" asChild className="bg-white border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 shadow-sm h-11 w-11 transition-all">
          <Link href="/payments">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2 w-10 bg-blue-600 rounded-full" />
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em]">Financial Core</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            Record <span className="text-blue-600">Payment</span>
          </h2>
          <p className="text-slate-500 font-medium text-sm max-w-md mt-1">
            Official ledger entry for gym revenue and membership activations.
          </p>
        </div>
      </div>

      <div className="max-w-6xl space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <PaymentForm 
          members={formattedMembers} 
          plans={formattedPlans} 
          initialMemberId={memberId}
        />
        
        <div className="grid md:grid-cols-3 gap-8">
           <div className="p-8 rounded-3xl border border-slate-100 bg-white shadow-sm flex flex-col gap-4">
              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-slate-900 font-bold text-base mb-1">Audit-Ready</h4>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">Permanent ledger entries for every transaction, fully traceable and linked to member IDs.</p>
              </div>
           </div>
           
           <div className="p-8 rounded-3xl border border-slate-100 bg-white shadow-sm flex flex-col gap-4">
              <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div>
                <h4 className="text-slate-900 font-bold text-base mb-1">Instant Activation</h4>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">Member status automatically flips to "Active" the moment the payment is recorded.</p>
              </div>
           </div>

           <div className="p-8 rounded-3xl border border-slate-100 bg-white shadow-sm flex flex-col gap-4">
              <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div>
                <h4 className="text-slate-900 font-bold text-base mb-1">GST Ready</h4>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">Capture reference IDs and notes now to enable seamless tax invoice generation.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
