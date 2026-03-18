"use client"

import { MobileNav } from "./MobileNav"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, LogOut } from "lucide-react"
import { signOut } from "@/app/(auth)/actions/index"
import { User } from "@supabase/supabase-js"

export function Navbar({ user, role }: { user: User, role: string }) {
  const userInitial = user.email?.charAt(0).toUpperCase() || 'U'

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 bg-transparent px-6 sm:h-20 lg:px-8 pointer-events-none">
      <div className="pointer-events-auto flex w-full items-center justify-end gap-4">
        <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all relative">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Toggle notifications</span>
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-600 ring-2 ring-slate-950"></span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10 p-0 hover:bg-white/5 rounded-xl transition-all">
              <Avatar className="h-10 w-10 rounded-xl border-2 border-white/5">
                <AvatarImage src="" />
                <AvatarFallback className="bg-blue-600 text-white font-bold">{userInitial}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <form action={signOut}>
              <DropdownMenuItem asChild>
                <button type="submit" className="w-full text-red-500 cursor-pointer flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
