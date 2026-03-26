"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export async function createTrainerAction(data: {
  name: string
  phone: string
  email?: string
  specializations?: string[]
  experienceYears?: number
  certification?: string
  salary?: number
  commissionPct?: number
  maxClients?: number
}) {
  const supabase = await createClient()
  
  // 1. Authenticate user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: "You must be logged in to add trainers." }
  }
  
  // 2. Use admin client (bypasses RLS)
  const adminClient = createAdminClient()
  
  // 3. Fetch the user's gym_id
  const { data: profile, error: profileError } = await adminClient
    .from('users')
    .select('gym_id')
    .eq('id', user.id)
    .single()
    
  if (profileError || !profile?.gym_id) {
    return { success: false, error: "Could not find your associated Gym profile." }
  }

  // 4. Insert the new trainer
  const { error: insertError } = await adminClient
    .from('trainers')
    .insert({
      gym_id: profile.gym_id,
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      specializations: data.specializations || [],
      experience_years: data.experienceYears || 0,
      certification: data.certification || null,
      salary: data.salary || 0,
      commission_pct: data.commissionPct || 0,
      max_clients: data.maxClients || 20,
      is_active: true,
      joined_date: new Date().toISOString().split('T')[0]
    })
    
  if (insertError) {
    console.error("Supabase Insert Error (trainers):", insertError)
    return { success: false, error: insertError.message || "Failed to add trainer." }
  }

  revalidatePath('/trainers')
  return { success: true }
}

export async function getTrainersAction() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const adminClient = createAdminClient()
  const { data: profile } = await adminClient
    .from('users')
    .select('gym_id')
    .eq('id', user.id)
    .single()

  if (!profile?.gym_id) return []

  const { data: trainers } = await adminClient
    .from('trainers')
    .select('*')
    .eq('gym_id', profile.gym_id)
    .order('created_at', { ascending: false })

  return trainers || []
}
