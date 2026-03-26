import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Bypass RLS

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in .env.local")
  process.exit(1)
}

const adminClient = createClient(supabaseUrl, supabaseServiceKey)

async function testPayment() {
  console.log("Fetching first available Member...")
  const { data: member, error: memberError } = await adminClient
    .from('members')
    .select('id, gym_id')
    .limit(1)
    .single()
    
  if (memberError || !member) {
    console.error("Failed to find a member:", memberError)
    return
  }
  console.log("Found Member:", member.id, "Gym ID:", member.gym_id)

  const gymId = member.gym_id;

  console.log("Fetching first available Plan for this Gym...")
  const { data: plan, error: planError } = await adminClient
    .from('membership_plans')
    .select('id, price')
    .eq('gym_id', gymId)
    .limit(1)
    .single()

  if (planError || !plan) {
    console.error("Failed to find a plan for this gym:", planError)
    // Create a dummy plan if none exists? Or just fail
    return
  }
  console.log("Found Plan:", plan.id, "| Price:", plan.price)

  console.log("\n--- TEST 1: INSERT SUBSCRIPTION ---")
  const startDate = new Date()
  const endDate = new Date()
  endDate.setDate(startDate.getDate() + 30)

  const { data: sub, error: subError } = await adminClient
    .from('member_subscriptions')
    .insert({
      gym_id: gymId,
      member_id: member.id,
      plan_id: plan.id,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      amount_paid: plan.price,
      status: 'active'
    })
    .select()
    .single()

  if (subError) {
    console.error("❌ Subscription Insert Failed:", JSON.stringify(subError, null, 2))
    return
  }
  console.log("✅ Subscription Insert Succeeded! ID:", sub.id)

  console.log("\n--- TEST 2: INSERT PAYMENT ---")
  const invoiceNumber = `TEST-${Date.now().toString().slice(-8)}`
  
  const paymentRecord = {
    gym_id: gymId,
    member_id: member.id,
    subscription_id: sub.id,
    amount: plan.price,
    total_amount: plan.price,
    payment_mode: 'cash',
    invoice_number: invoiceNumber,
    payment_date: new Date().toISOString().split('T')[0],
    status: 'paid'
  }

  const { data: payment, error: paymentError } = await adminClient
    .from('payments')
    .insert(paymentRecord)
    .select()
    .single()

  if (paymentError) {
    console.error("❌ Payment Insert Failed:", JSON.stringify(paymentError, null, 2))
    return
  }
  console.log("✅ Payment Insert Succeeded! ID:", payment.id)

  console.log("\n--- ALL TESTS PASSED SUCCESSFULLY! ---")
}

testPayment()
