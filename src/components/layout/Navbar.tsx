"use client"

import { MobileNav } from "./MobileNav"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Bell,
  UserCircle,
  Settings,
  CreditCard,
  LogOut,
  Building2
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { signOut } from "@/app/(auth)/actions/index"
import { User } from "@supabase/supabase-js"

export function Navbar({ user, role }: { user: User, role: string }) {
  const userInitial = user.email?.charAt(0).toUpperCase() || 'U'

  return (
    <header className="sticky top-0 z-[100] flex h-16 items-center gap-4 bg-slate-950/20 backdrop-blur-md px-6 sm:h-20 lg:px-8 border-b border-white/5">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="md:hidden">
          <MobileNav />
        </div>
        <div className="flex items-center gap-4 ml-auto">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all relative"
        >
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
          <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-white/10 text-slate-300 rounded-xl mt-2 animate-in fade-in zoom-in duration-200">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1 p-1">
                <p className="text-sm font-medium leading-none text-white">{user.email?.split('@')[0]}</p>
                <p className="text-xs leading-none text-slate-500">{user.email}</p>
                <Badge variant="outline" className="w-fit mt-2 bg-blue-500/10 text-blue-400 border-blue-500/20 uppercase text-[10px]">
                  {role.replace('_', ' ')}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="hover:bg-white/5 focus:bg-white/5 focus:text-white rounded-lg cursor-pointer transition-colors">
                <UserCircle className="mr-2 h-4 w-4 text-slate-500" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-white/5 focus:bg-white/5 focus:text-white rounded-lg cursor-pointer transition-colors">
                <Building2 className="mr-2 h-4 w-4 text-slate-500" />
                <span>Gym Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-white/5 focus:bg-white/5 focus:text-white rounded-lg cursor-pointer transition-colors">
                 <CreditCard className="mr-2 h-4 w-4 text-slate-500" />
                <span>Billing</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-white/5" />
            <form action={signOut}>
              <DropdownMenuItem asChild>
                <button type="submit" className="w-full text-red-400 hover:bg-red-400/10 focus:bg-red-400/10 focus:text-red-400 rounded-lg cursor-pointer flex items-center gap-2 px-2 py-1.5 transition-colors">
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </header>
  )
}
