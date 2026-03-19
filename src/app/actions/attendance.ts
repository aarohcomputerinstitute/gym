"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function searchMembersAction(query: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('members')
    .select('id, name, member_number, status, phone')
    .or(`name.ilike.%${query}%,phone.ilike.%${query}%,member_number.ilike.%${query}%`)
    .limit(5)

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function checkInMemberAction(memberId: string) {
  const supabase = await createClient()

  // Get gym_id (assuming first gym for now or from session)
  const { data: userData } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('users')
    .select('gym_id')
    .eq('id', userData.user?.id)
    .single()

  if (!profile) throw new Error("Gym access denied")

  const today = new Date().toISOString().split('T')[0]

  // Check if already checked in
  const { data: existing } = await supabase
    .from('attendance')
    .select('id')
    .eq('member_id', memberId)
    .eq('date', today)
    .is('checkout_time', null)
    .single()

  if (existing) {
    throw new Error("Member is already checked in!")
  }

  const { error } = await supabase.from('attendance').insert({
    member_id: memberId,
    gym_id: profile.gym_id,
    date: today,
    checkin_time: new Date().toISOString(),
    checkin_method: 'manual'
  })

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard')
  revalidatePath('/attendance')
  return { success: true }
}
