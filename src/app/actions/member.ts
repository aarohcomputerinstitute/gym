"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createMemberAction(data: any) {
  const supabase = await createClient()
  
  // 1. Authenticate user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error("You must be logged in to add members.")
  }
  
  // 2. Fetch the user's gym_id so we know where to assign the member
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('gym_id')
    .eq('id', user.id)
    .single()
    
  if (profileError || !profile?.gym_id) {
    throw new Error("Could not find your associated Gym profile.")
  }
  
  // 3. Insert the new member into the database
  const { error: insertError } = await supabase
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
    throw new Error(insertError.message || "Failed to insert member into database.")
  }
  
  // 4. Force Next.js to re-fetch the members list so the new member appears
  revalidatePath('/members')
  
  return { success: true }
}
