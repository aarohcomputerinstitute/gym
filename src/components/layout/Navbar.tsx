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
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <MobileNav />
      <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <Button variant="outline" size="icon" className="ml-auto h-8 w-8 relative">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Toggle notifications</span>
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600"></span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt="User admin" />
                <AvatarFallback>{userInitial}</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
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
