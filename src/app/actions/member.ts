"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export async function createMemberAction(data: any) {
  const supabase = await createClient()
  
  // 1. Authenticate user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error("You must be logged in to add members.")
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
    console.error("Profile fetch error:", profileError)
    throw new Error("Could not find your associated Gym profile.")
  }

  // 4. Insert the new member into the database
  const { data: member, error: insertError } = await adminClient
    .from('members')
    .insert({
      gym_id: profile.gym_id,
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      gender: data.gender,
      date_of_birth: data.dob ? new Date(data.dob).toISOString().split('T')[0] : null,
      join_date: data.joinDate ? new Date(data.joinDate).toISOString().split('T')[0] : null,
      blood_group: data.bloodGroup || null,
      emergency_contact: data.emergencyContact || null,
      address: data.address || null,
      status: 'active'
    })
    .select()
    .single()
    
  if (insertError || !member) {
    console.error("Supabase Insert Error (members):", insertError)
    throw new Error(insertError?.message || "Failed to insert member into database.")
  }

  // 5. If a plan is selected, create a subscription
  if (data.planId) {
    // Fetch plan details for duration and price
    const { data: plan, error: planError } = await adminClient
      .from('membership_plans')
      .select('duration_days, price')
      .eq('id', data.planId)
      .single()

    if (!planError && plan) {
      const startDate = new Date(data.joinDate)
      const endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + plan.duration_days)

      const { error: subError } = await adminClient
        .from('member_subscriptions')
        .insert({
          gym_id: profile.gym_id,
          member_id: member.id,
          plan_id: data.planId,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          amount_paid: plan.price,
          status: 'active'
        })
      
      if (subError) {
        console.error("Subscription Auto-Creation Error:", subError)
      }
    }
  }

  // 6. Update inquiry status if this member was converted from an inquiry
  if (data.inquiryId) {
    const { error: inquiryUpdateError } = await adminClient
      .from('inquiries')
      .update({ status: 'joined' })
      .eq('id', data.inquiryId)
      
    if (inquiryUpdateError) {
      console.error("Failed to update inquiry status:", inquiryUpdateError)
    } else {
      revalidatePath('/inquiries')
    }
  }
  
  // 7. Revalidate
  revalidatePath('/members')
  revalidatePath('/dashboard')
  
  return { success: true, id: member.id }
}
