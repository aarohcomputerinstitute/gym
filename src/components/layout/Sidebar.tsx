"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
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
  Building2
} from "lucide-react"

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
]

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("pb-12 border-r bg-muted/40 h-screen hidden md:block w-64", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            GymOS
          </h2>
          <div className="space-y-1">
            <ScrollArea className="h-[calc(100vh-8rem)]">
              {sidebarNavigation.map((item) => {
                if (item.disabled) {
                  return (
                    <div key={item.name} className="px-4 py-2 mt-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-t pt-4">
                      {item.name}
                    </div>
                  )
                }
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      buttonVariants({ 
                        variant: pathname.startsWith(item.href) ? "secondary" : "ghost" 
                      }),
                      "w-full justify-start gap-2 mb-1"
                    )}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.name}
                  </Link>
                )
              })}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}
