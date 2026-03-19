"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createPaymentAction(data: {
  memberId: string;
  planId: string;
  amount: number;
  paymentMode: 'cash' | 'upi' | 'card' | 'bank_transfer' | 'online';
  transactionId?: string;
  notes?: string;
}) {
  const supabase = await createClient()
  
  // 1. Authenticate user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error("You must be logged in to record payments.")
  }
  
  // 2. Fetch the user's gym_id
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('gym_id')
    .eq('id', user.id)
    .single()
    
  if (profileError || !profile?.gym_id) {
    throw new Error("Could not find your associated Gym profile.")
  }

  // 3. Create/Update Subscription record (Simplified for now)
  // In a real app, you'd calculate end_date based on plan's duration_days
  const { data: plan } = await supabase
    .from('membership_plans')
    .select('duration_days')
    .eq('id', data.planId)
    .single()

  if (!plan) throw new Error("Selected plan not found.")

  const startDate = new Date()
  const endDate = new Date()
  endDate.setDate(startDate.getDate() + (plan.duration_days || 30))

  const { data: sub, error: subError } = await supabase
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

  if (subError) {
    console.error("Subscription Error:", subError)
    throw new Error("Failed to create member subscription record.")
  }

  // 4. Insert the payment record
  const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`
  
  const { error: paymentError } = await supabase
    .from('payments')
    .insert({
      gym_id: profile.gym_id,
      member_id: data.memberId,
      subscription_id: sub.id,
      amount: data.amount,
      total_amount: data.amount,
      payment_mode: data.paymentMode,
      transaction_id: data.transactionId || null,
      invoice_number: invoiceNumber,
      payment_date: new Date().toISOString().split('T')[0],
      status: 'paid',
      received_by: user.id,
      notes: data.notes || null
    })
    
  if (paymentError) {
    console.error("Payment Error:", paymentError)
    throw new Error("Failed to record payment in database.")
  }
  
  // 5. Revalidate paths
  revalidatePath('/payments')
  revalidatePath(`/members/${data.memberId}`)
  revalidatePath('/dashboard')
  
  return { success: true, invoiceNumber }
}
