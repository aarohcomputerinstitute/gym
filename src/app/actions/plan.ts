"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createPlanAction(data: any) {
  console.log("Creating membership plan with data:", data)
  const supabase = await createClient()
  
  // 1. Authenticate user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error("You must be logged in to create plans.")
  }
  
  // 2. Fetch the user's gym_id
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('gym_id')
    .eq('id', user.id)
    .single()
    
  if (profileError || !profile?.gym_id) {
    console.error("Profile fetch error or missing gym_id:", profileError)
    throw new Error("Could not find your associated Gym profile.")
  }

  console.log("Saving plan for Gym ID:", profile.gym_id)

  // 3. Insert the new plan into the database
  const { error: insertError } = await supabase
    .from('membership_plans')
    .insert({
      gym_id: profile.gym_id,
      name: data.name,
      duration_days: data.durationDays,
      price: data.price,
      registration_fee: data.registrationFee || 0,
      description: data.description || null,
      max_freeze_days: data.maxFreezeDays || 0,
      is_active: data.isActive ?? true,
      features: data.features || [],
      sort_order: 0 // Default sort order
    })
    
  if (insertError) {
    console.error("Supabase Insert Error (membership_plans):", insertError)
    throw new Error(insertError.message || "Failed to save membership plan.")
  }
  
  console.log("Membership plan saved successfully!")
  
  // 4. Force Next.js to re-fetch the plans list
  revalidatePath('/plans')
  
  return { success: true }
}
