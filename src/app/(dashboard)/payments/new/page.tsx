import { createClient } from "@/lib/supabase/server"
import { PaymentForm } from "@/components/payments/PaymentForm"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function RecordPaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ memberId?: string }>
}) {
  const { memberId } = await searchParams
  const supabase = await createClient()

  // 1. Fetch Members for selection
  const { data: members } = await supabase
    .from('members')
    .select('id, name, member_code')
    .eq('status', 'active')
    .order('name', { ascending: true })

  // 2. Fetch Active Plans for selection
  const { data: plans } = await supabase
    .from('membership_plans')
    .select('id, name, price, duration_days')
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
    <div className="flex-1 space-y-6 pt-6">
      <div className="flex items-center gap-4 px-2">
        <Button variant="outline" size="icon" asChild className="bg-white/5 border-white/10 text-white rounded-xl">
          <Link href="/payments">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white italic">
            Financial Records
          </h2>
          <p className="text-slate-400 font-medium">
            Systematic processing of gym revenue and member subscriptions.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
        <PaymentForm 
          members={formattedMembers} 
          plans={formattedPlans} 
          initialMemberId={memberId}
        />
        
        <div className="grid md:grid-cols-3 gap-6 opacity-60">
           <div className="p-6 rounded-2xl border border-white/5 bg-white/5">
              <h4 className="text-white font-bold text-sm mb-2">GST Compliant</h4>
              <p className="text-xs text-slate-500">All transactions are ready for GST invoice generation in Phase 3.</p>
           </div>
           <div className="p-6 rounded-2xl border border-white/5 bg-white/5">
              <h4 className="text-white font-bold text-sm mb-2">Auto-Activation</h4>
              <p className="text-xs text-slate-500">Subscriptions are automatically activated upon payment confirmation.</p>
           </div>
           <div className="p-6 rounded-2xl border border-white/5 bg-white/5">
              <h4 className="text-white font-bold text-sm mb-2">Audit Trial</h4>
              <p className="text-xs text-slate-500">Every payment is timestamped and linked to the staff member who received it.</p>
           </div>
        </div>
      </div>
    </div>
  )
}
