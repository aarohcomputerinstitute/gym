"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  Users,
  CreditCard,
  CalendarCheck,
  Dumbbell,
  Activity,
  FileBarChart,
  Settings,
  Ticket,
  UserCircle,
  Building2,
  LogOut,
  ChevronRight
} from "lucide-react"
import { signOut } from "@/app/(auth)/actions/index"

// Defines our navigation structure
export const sidebarNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Members", href: "/members", icon: Users },
  { name: "Membership Plans", href: "/plans", icon: Ticket },
  { name: "Payments", href: "/payments", icon: CreditCard },
  { name: "Attendance", href: "/attendance", icon: CalendarCheck },
  { name: "Trainers", href: "/trainers", icon: UserCircle },
  { name: "Workout Plans", href: "/workouts", icon: Dumbbell },
  { name: "Progress", href: "/progress", icon: Activity },
  { name: "Reports", href: "/reports", icon: FileBarChart },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "--- Platform Admin ---", href: "#", icon: null, disabled: true },
  { name: "Super Admin Dashboard", href: "/super-admin/dashboard", icon: LayoutDashboard },
  { name: "Gym Management", href: "/super-admin/gyms", icon: Building2 },
  { name: "User Management", href: "/super-admin/users", icon: Users },
]

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  role?: string
}

export function Sidebar({ className, role }: SidebarProps) {
  const pathname = usePathname()

  // Filter navigation based on role
  const filteredNav = sidebarNavigation.filter(item => {
    if (role === 'super_admin') return true;
    if (item.href.startsWith('/super-admin')) return false;
    if (item.name.includes('Platform Admin')) return false;
    return true;
  });

  return (
    <div className={cn("flex flex-col h-screen sticky top-0 border-r bg-slate-950 text-slate-300 w-64 hidden md:flex shrink-0 z-40 relative", className)}>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Dumbbell className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Gym<span className="text-blue-500">OS</span>
          </h2>
        </div>
        
        <div className="space-y-1">
          <ScrollArea className="h-[calc(100vh-12rem)] pr-3 -mr-3">
            {filteredNav.map((item) => {
              if (item.disabled) {
                return (
                  <div key={item.name} className="px-4 py-2 mt-6 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {item.name}
                  </div>
                )
              }
              
              const Icon = item.icon
              const isActive = pathname.startsWith(item.href) && item.href !== "#"
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between group px-4 py-2.5 rounded-xl transition-all duration-200 mb-1",
                    isActive 
                      ? "bg-blue-600/10 text-blue-400 font-medium" 
                      : "hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {Icon && <Icon className={cn("h-4 w-4", isActive ? "text-blue-400" : "text-slate-500 group-hover:text-blue-400")} />}
                    <span className="text-sm">{item.name}</span>
                  </div>
                  {isActive && <div className="h-1 w-1 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />}
                </Link>
              )
            })}
          </ScrollArea>
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-white/5 space-y-4">
        <div className="px-4 py-2">
           <form action={signOut}>
            <button 
              type="submit"
              className="flex items-center gap-3 text-sm text-slate-400 hover:text-red-400 transition-colors w-full group"
            >
              <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-red-400/10 transition-colors">
                <LogOut className="h-4 w-4" />
              </div>
              Sign Out
            </button>
           </form>
        </div>
      </div>
    </div>
  )
}
