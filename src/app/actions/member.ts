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
  // NOTE: plan_id is NOT a column in the members table - removed it
  const { error: insertError } = await adminClient
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
    
  if (insertError) {
    console.error("Supabase Insert Error (members):", {
      code: insertError.code,
      message: insertError.message,
      details: insertError.details,
      hint: insertError.hint
    })
    throw new Error(insertError.message || "Failed to insert member into database.")
  }
  
  // 5. Revalidate
  revalidatePath('/members')
  revalidatePath('/dashboard')
  
  return { success: true }
}
