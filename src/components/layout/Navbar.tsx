"use client"

import { MobileNav } from "./MobileNav"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Bell,
  UserCircle,
  Settings,
  CreditCard,
  LogOut,
  Building2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { signOut } from "@/app/(auth)/actions/index"
import { User } from "@supabase/supabase-js"

export function Navbar({ user, role }: { user: User; role: string }) {
  const userInitial = user.email?.charAt(0).toUpperCase() || "U"
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  return (
    <header className="sticky top-0 z-[100] flex h-16 items-center gap-4 bg-slate-950/20 backdrop-blur-md px-6 sm:h-20 lg:px-8 border-b border-white/5">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="md:hidden">
          <MobileNav role={role} />
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {/* Notification Bell */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all relative"
          >
            <Bell className="h-5 w-5" />
            <span className="sr-only">Toggle notifications</span>
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-slate-950" />
          </Button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="relative h-10 w-10 p-0 hover:bg-white/5 rounded-xl border-2 border-white/10 hover:border-blue-500/40 transition-all duration-200 group focus:outline-none"
            >
              <Avatar className="h-full w-full rounded-xl">
                <AvatarImage src="" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold rounded-xl text-sm">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
              {/* Online indicator */}
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-950 shadow-sm pointer-events-none" />
            </button>

            {open && (
              <div
                className="absolute right-0 top-[calc(100%+10px)] w-72 bg-slate-900/95 backdrop-blur-xl border border-white/10 text-slate-300 rounded-2xl p-0 shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in slide-in-from-top-2 zoom-in-95 duration-200 z-[100]"
              >
                {/* ── Profile Header ── */}
                <div className="relative px-4 pt-5 pb-4 bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-transparent border-b border-white/5">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
                  <div className="flex items-center gap-3 relative">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <Avatar className="h-12 w-12 rounded-xl border-2 border-blue-500/30 shadow-lg shadow-blue-500/20">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-lg rounded-xl">
                          {userInitial}
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-900 shadow" />
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {user.email?.split("@")[0]}
                      </p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      <Badge
                        variant="outline"
                        className="mt-1.5 h-5 px-2 text-[10px] font-semibold uppercase tracking-wide bg-blue-500/10 text-blue-400 border-blue-500/25 rounded-md"
                      >
                        {role.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* ── Navigation Items ── */}
                <div className="p-2 space-y-0.5">
                  <Link
                    href="/settings"
                    onClick={() => setOpen(false)}
                    className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-all duration-150 hover:bg-white/5 focus:bg-white/5 outline-none"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                      <UserCircle className="h-4 w-4" />
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-200 leading-none mb-0.5">
                        My Profile
                      </span>
                      <span className="text-[11px] text-slate-500">View & edit your profile</span>
                    </div>
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setOpen(false)}
                    className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-all duration-150 hover:bg-white/5 focus:bg-white/5 outline-none"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400 group-hover:bg-violet-500/20 transition-colors">
                      <Building2 className="h-4 w-4" />
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-200 leading-none mb-0.5">
                        Gym Settings
                      </span>
                      <span className="text-[11px] text-slate-500">Manage gym details</span>
                    </div>
                  </Link>

                  <Link
                    href="/settings/billing"
                    onClick={() => setOpen(false)}
                    className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-all duration-150 hover:bg-white/5 focus:bg-white/5 outline-none"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                      <CreditCard className="h-4 w-4" />
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-200 leading-none mb-0.5">
                        Billing
                      </span>
                      <span className="text-[11px] text-slate-500">Plans & payment history</span>
                    </div>
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setOpen(false)}
                    className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-all duration-150 hover:bg-white/5 focus:bg-white/5 outline-none"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition-colors">
                      <Settings className="h-4 w-4" />
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-200 leading-none mb-0.5">
                        Settings
                      </span>
                      <span className="text-[11px] text-slate-500">App preferences</span>
                    </div>
                  </Link>
                </div>

                {/* ── Log Out ── */}
                <div className="px-2 pb-2 border-t border-white/5 pt-2">
                  <form action={signOut} className="w-full">
                    <button
                      type="submit"
                      className="group w-full flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-all duration-150 hover:bg-red-500/10 focus:bg-red-500/10 outline-none"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-400 group-hover:bg-red-500/20 transition-colors">
                        <LogOut className="h-4 w-4" />
                      </span>
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-medium text-red-400 leading-none mb-0.5">
                          Log out
                        </span>
                        <span className="text-[11px] text-slate-500">Sign out of your account</span>
                      </div>
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
