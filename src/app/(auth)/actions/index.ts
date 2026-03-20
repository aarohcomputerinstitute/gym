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

import { createAdminClient } from "@/lib/supabase/admin"

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const adminClient = createAdminClient()

  const authData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }
  const gymName = formData.get("gymName") as string
  const selectedPlan = (formData.get("selectedPlan") as string) || "basic"

  // 1. Sign up the user in Supabase Auth
  const { data: { user, session }, error: authError } = await supabase.auth.signUp({
    email: authData.email,
    password: authData.password,
    options: {
      data: {
        gym_name: gymName
      }
    }
  })

  if (authError) {
    return { error: authError.message }
  }

  if (!user) {
    return { error: "User creation failed." }
  }

  // Calculate 14 days from now
  const trialEndsAt = new Date()
  trialEndsAt.setDate(trialEndsAt.getDate() + 14)

  // 2. Create the Gym record using Admin Client (bypasses RLS)
  const { data: gymData, error: gymError } = await adminClient
    .from('gyms')
    .insert({
      name: gymName,
      slug: gymName.toLowerCase().replace(/\s+/g, '-'),
      owner_name: 'Owner', // Initial placeholder
      email: authData.email,
      status: 'trial',
      selected_plan: selectedPlan,
      trial_ends_at: trialEndsAt.toISOString()
    })
    .select()
    .single()

  if (gymError) {
    // Cleanup: We should ideally delete the user if possible, but for simplicity we'll just error
    console.error("Gym Error:", gymError)
    return { error: "Gym registration failed: " + gymError.message }
  }

  // 3. Create the User record in our public table using Admin Client
  const { error: userError } = await adminClient
    .from('users')
    .insert({
      id: user.id,
      gym_id: gymData.id,
      name: 'Gym Owner',
      email: authData.email,
      role: 'owner'
    })

  if (userError) {
    console.error("User Error:", userError)
    return { error: "User profile creation failed: " + userError.message }
  }

  // 4. Handle Redirection
  // If email confirmation is required, session will be null
  if (!session) {
    redirect("/verify-email")
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
