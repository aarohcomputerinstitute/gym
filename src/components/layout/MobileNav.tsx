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
import { LogOut, Dumbbell } from "lucide-react"
import { signOut } from "@/app/(auth)/actions/index"

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden h-10 w-10 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl border border-white/5 transition-all"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex flex-col h-full bg-slate-950 text-slate-300">
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
              <ScrollArea className="h-[calc(100vh-8rem)]">
                {sidebarNavigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Button
                      key={item.name}
                      variant={pathname.startsWith(item.href) ? "secondary" : "ghost"}
                      className="w-full justify-start gap-2 mb-1"
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

          <div className="mt-auto p-4 border-t border-white/5">
             <form action={signOut}>
              <button 
                type="submit"
                className="flex items-center gap-3 text-sm text-slate-400 hover:text-red-400 transition-colors w-full group px-4 py-2"
              >
                <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-red-400/10 transition-colors">
                  <LogOut className="h-4 w-4" />
                </div>
                Sign Out
              </button>
             </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
