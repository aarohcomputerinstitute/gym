"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { sidebarNavigation } from "./Sidebar"
import { useState } from "react"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="py-4">
          <div className="px-3 py-2">
            <h2 className="mb-6 px-4 text-lg font-semibold tracking-tight">
              GymOS
            </h2>
            <div className="space-y-1">
              <ScrollArea className="h-[calc(100vh-8rem)]">
                {sidebarNavigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Button
                      key={item.name}
                      variant={pathname.startsWith(item.href) ? "secondary" : "ghost"}
                      className="w-full justify-start gap-2 mb-1"
                      onClick={() => setOpen(false)}
                      asChild
                    >
                      <Link href={item.href}>
                        {Icon && <Icon className="h-4 w-4" />}
                        {item.name}
                      </Link>
                    </Button>
                  )
                })}
              </ScrollArea>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
