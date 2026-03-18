import { Sidebar } from "@/components/layout/Sidebar"
import { Navbar } from "@/components/layout/Navbar"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/login")
  }

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (userData?.role !== 'super_admin') {
    redirect("/dashboard")
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role="super_admin" />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar user={user} role="super_admin" />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50">
          <div className="max-w-7xl mx-auto">
            <Badge variant="destructive" className="mb-4">SUPER ADMIN PANEL</Badge>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

function Badge({ children, className, variant }: { children: React.ReactNode, className?: string, variant?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variant === 'destructive' ? 'bg-destructive text-destructive-foreground' : ''} ${className}`}>
      {children}
    </span>
  )
}
