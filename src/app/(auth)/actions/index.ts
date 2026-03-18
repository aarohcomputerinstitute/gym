"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }
  const gymName = formData.get("gymName") as string

  // 1. Sign up the user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp(data)

  if (authError) {
    return { error: authError.message }
  }

  if (!authData.user) {
    return { error: "User creation failed." }
  }

  // 2. Create the Gym record
  const { data: gymData, error: gymError } = await supabase
    .from('gyms')
    .insert({
      name: gymName,
      slug: gymName.toLowerCase().replace(/\s+/g, '-'),
      owner_name: 'Owner', // Initial placeholder
      email: data.email,
      status: 'active'
    })
    .select()
    .single()

  if (gymError) {
    // We should ideally delete the auth user here if it was just created, 
    // but Suapbase Auth might require manual cleanup or we just return error
    return { error: "Gym registration failed: " + gymError.message }
  }

  // 3. Create the User record in our public table
  const { error: userError } = await supabase
    .from('users')
    .insert({
      id: authData.user.id,
      gym_id: gymData.id,
      name: 'Gym Owner',
      email: data.email,
      role: 'owner'
    })

  if (userError) {
    return { error: "User profile creation failed: " + userError.message }
  }

  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get("email") as string

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/auth/reset-password`,
  })

  if (error) {
    console.error(error)
    throw new Error(error.message)
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/login")
}

export async function updateRole(userId: string, newRole: string) {
  const supabase = await createClient()
  
  // Verify requester is super_admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")
  
  const { data: requester } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()
    
  if (requester?.role !== 'super_admin') {
    throw new Error("Unauthorized: Only super admins can update roles")
  }

  const { error } = await supabase
    .from('users')
    .update({ role: newRole })
    .eq('id', userId)

  if (error) throw new Error(error.message)
  
  revalidatePath("/super-admin/users")
}
