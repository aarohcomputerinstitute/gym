"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export async function createPlanAction(data: any) {
  const supabase = await createClient()
  
  // 1. Authenticate user (uses anon client with cookies)
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error("You must be logged in to create plans.")
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

  // 4. Insert the new plan into the database
  const { error: insertError } = await adminClient
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
      sort_order: 0
    })
    
  if (insertError) {
    console.error("Supabase Insert Error (membership_plans):", {
      code: insertError.code,
      message: insertError.message,
      details: insertError.details,
      hint: insertError.hint
    })
    throw new Error(insertError.message || "Failed to save membership plan.")
  }
  
  // 5. Revalidate
  revalidatePath('/plans')
  revalidatePath('/plans', 'page')
  revalidatePath('/dashboard', 'layout')
  
  return { success: true }
}
