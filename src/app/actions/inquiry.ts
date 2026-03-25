'use server'

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export type InquiryStatus = 'pending' | 'visiting' | 'follow_up' | 'hot' | 'joined' | 'cancelled';

export async function createInquiryAction(formData: {
  name: string;
  phone: string;
  email?: string;
  source?: string;
  notes?: string;
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const adminClient = createAdminClient()
  
  // 1. Get user's gym_id
  const { data: profile } = await adminClient
    .from('users')
    .select('gym_id')
    .eq('id', user.id)
    .single()

  if (!profile?.gym_id) throw new Error("Gym profile not found")

  // 2. Insert inquiry
  const { data, error } = await adminClient
    .from('inquiries')
    .insert({
      gym_id: profile.gym_id,
      ...formData,
      status: 'pending'
    })
    .select()
    .single()

  if (error) {
    console.error("Inquiry creation error:", error)
    throw new Error(error.message)
  }

  revalidatePath('/inquiries')
  return data
}

export async function updateInquiryStatusAction(id: string, status: InquiryStatus) {
  const adminClient = createAdminClient()
  const { error } = await adminClient
    .from('inquiries')
    .update({ status })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/inquiries')
}

export async function convertToMemberAction(inquiryId: string) {
  const adminClient = createAdminClient()
  
  // 1. Fetch inquiry data
  const { data: inquiry, error: fetchErr } = await adminClient
    .from('inquiries')
    .select('*')
    .eq('id', inquiryId)
    .single()

  if (fetchErr || !inquiry) throw new Error("Inquiry not found")

  // 2. Create member record
  const { data: member, error: memberErr } = await adminClient
    .from('members')
    .insert({
      gym_id: inquiry.gym_id,
      name: inquiry.name,
      phone: inquiry.phone,
      email: inquiry.email,
      status: 'active',
      joining_date: new Date().toISOString().split('T')[0]
    })
    .select()
    .single()

  if (memberErr) throw new Error(memberErr.message)

  // 3. Update inquiry status to 'joined'
  await adminClient
    .from('inquiries')
    .update({ status: 'joined' })
    .eq('id', inquiryId)

  revalidatePath('/inquiries')
  revalidatePath('/members')
  
  return member
}
