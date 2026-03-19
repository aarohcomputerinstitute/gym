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

export function MobileNav({ role }: { role?: string }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Filter navigation based on role
  const filteredNav = sidebarNavigation.filter(item => {
    if (role === 'super_admin') return true;
    if (item.href.startsWith('/super-admin')) return false;
    if (item.name.includes('Platform Admin')) return false;
    return true;
  });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button 
          className="md:hidden h-10 w-10 flex items-center justify-center text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0 border-white/10">
        <div className="flex flex-col h-full bg-slate-950 text-slate-300">
          <div className="p-6 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Dumbbell className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                Gym<span className="text-blue-500">OS</span>
              </h2>
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden px-4 pb-6">
            <ScrollArea className="h-full pr-2">
              <div className="space-y-1">
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
                    <Button
                      key={item.name}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-3 mb-1 h-11 px-4 rounded-xl transition-all duration-200",
                        isActive 
                          ? "bg-blue-600/10 text-blue-400 font-medium" 
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                      )}
                      onClick={() => setOpen(false)}
                      asChild
                    >
                      <Link href={item.href}>
                        {Icon && <Icon className={cn("h-4 w-4", isActive ? "text-blue-400" : "text-slate-500")} />}
                        <span className="text-sm">{item.name}</span>
                        {isActive && <div className="ml-auto h-1 w-1 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />}
                      </Link>
                    </Button>
                  )
                })}
              </div>
            </ScrollArea>
          </div>

          <div className="flex-shrink-0 p-4 border-t border-white/5 bg-slate-950/50">
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
