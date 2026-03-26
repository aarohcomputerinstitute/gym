"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export async function createPaymentAction(data: {
  memberId: string;
  planId: string;
  amount: number;
  paymentMode: 'cash' | 'upi' | 'card' | 'bank_transfer' | 'online';
  transactionId?: string;
  notes?: string;
  nextInstallmentDate?: Date;
}) {
  console.log("createPaymentAction started with data:", {
    memberId: data.memberId,
    planId: data.planId,
    amount: data.amount,
    paymentMode: data.paymentMode,
    isPartial: !!data.nextInstallmentDate
  })

  const supabase = await createClient()
  
  // 1. Authenticate user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    console.error("Auth error in payment action:", authError)
    throw new Error("You must be logged in to record payments.")
  }
  
  // 2. Use admin client (bypasses RLS) for all DB operations
  const adminClient = createAdminClient()
  
  // 3. Fetch the user's gym_id
  const { data: profile, error: profileError } = await adminClient
    .from('users')
    .select('gym_id')
    .eq('id', user.id)
    .single()
    
  if (profileError || !profile?.gym_id) {
    console.error("Profile fetch error in payment action:", profileError)
    throw new Error("Could not find your associated Gym profile.")
  }

  console.log("Logged in Gym ID:", profile.gym_id)

  // 4. Get plan details to calculate subscription end date and price
  const { data: plan } = await adminClient
    .from('membership_plans')
    .select('duration_days, price')
    .eq('id', data.planId)
    .single()

  if (!plan) throw new Error("Selected plan not found.")

  const startDate = new Date()
  let endDate = new Date()
  
  const isPartial = data.amount < plan.price;
  if (isPartial) {
    if (!data.nextInstallmentDate) throw new Error("Next Installment Date is required for partial payments.");
    // TEMPORARILY LOCK ACCESS: Gym access expires strictly on the installment date
    endDate = new Date(data.nextInstallmentDate);
  } else {
    // FULL PAYMENT: standard duration applies
    endDate.setDate(startDate.getDate() + (plan.duration_days || 30))
  }

  // 5. Create subscription record
  const { data: sub, error: subError } = await adminClient
    .from('member_subscriptions')
    .insert({
      gym_id: profile.gym_id,
      member_id: data.memberId,
      plan_id: data.planId,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      amount_paid: data.amount,
      status: 'active'
    })
    .select()
    .single()

  if (subError || !sub) {
    console.error("Subscription Error (Detailed):", {
      code: subError?.code,
      message: subError?.message,
      details: subError?.details,
      hint: subError?.hint
    })
    throw new Error(subError?.message || "Failed to create member subscription record.")
  }

  // 6. Insert the payment record
  const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`
  
  // Total amount = plan price, amount = what was paid today
  const paymentRecord: Record<string, any> = {
    gym_id: profile.gym_id,
    member_id: data.memberId,
    subscription_id: sub.id,
    amount: data.amount,
    total_amount: plan.price,
    payment_mode: data.paymentMode,
    transaction_id: data.transactionId || null,
    invoice_number: invoiceNumber,
    payment_date: new Date().toISOString().split('T')[0],
    status: isPartial ? 'partial' : 'paid',
    received_by: user.id,
    notes: data.notes || null
  }

  // Only add next_installment_date if partial (avoids error if column doesn't exist yet)
  if (isPartial && data.nextInstallmentDate) {
    paymentRecord.next_installment_date = new Date(data.nextInstallmentDate).toISOString().split('T')[0]
  }

  const { error: paymentError } = await adminClient
    .from('payments')
    .insert(paymentRecord)
    
  if (paymentError) {
    console.error("Payment Error (Detailed):", {
      code: paymentError.code,
      message: paymentError.message,
      details: paymentError.details,
      hint: paymentError.hint
    })
    throw new Error(paymentError.message || "Failed to record payment in database.")
  }

  // 7. Update member status to 'active' if they were expired, etc.
  const { error: memberUpdateError } = await adminClient
    .from('members')
    .update({ status: 'active' })
    .eq('id', data.memberId)

  if (memberUpdateError) {
    console.error("Member Status Update Error (Non-critical):", memberUpdateError)
  }
  
  // 7. Revalidate paths
  revalidatePath('/payments')
  revalidatePath(`/members/${data.memberId}`)
  revalidatePath('/dashboard')
  
  return { success: true, invoiceNumber }
}
