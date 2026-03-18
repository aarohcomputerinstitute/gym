import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/login")
  }

  // Fetch role
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = userData?.role || 'receptionist'

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 md:flex-row">
      <Sidebar role={role} />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-4 md:w-full">
        <Navbar user={user} role={role} />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  )
}
