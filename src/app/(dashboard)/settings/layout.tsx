import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your gym settings and configurations.",
}

const sidebarNavItems = [
  {
    title: "Gym Profile",
    href: "/settings",
  },
  {
    title: "Staff Management",
    href: "/settings/staff",
  },
  {
    title: "Billing & Plans",
    href: "/settings/billing",
  },
  {
    title: "Integrations",
    href: "/settings/integrations",
  },
]

import { SidebarNav } from "@/components/settings/sidebar-nav"
import { Separator } from "@/components/ui/separator"

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="space-y-6 pt-6 pb-16 block">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your gym account settings, staff, and billing preferences.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-3xl">{children}</div>
      </div>
    </div>
  )
}
