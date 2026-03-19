"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signup } from "@/app/(auth)/actions/index"
import { useState } from "react"

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  async function handleSubmit(formData: FormData) {
    setPending(true)
    setError(null)
    
    const result = await signup(formData)
    if (result?.error) {
      setError(result.error)
      setPending(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl p-6 md:p-8 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">Scale your Gym</h1>
          <p className="text-slate-400 mt-2 text-sm">
            Join the most advanced gym management platform
          </p>
        </div>

        <form action={handleSubmit}>
          <div className="space-y-6">
            {error && (
              <div className="text-red-400 text-sm text-center bg-red-400/10 p-3 rounded-lg border border-red-400/20 animate-shake">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gymName" className="text-slate-300 text-sm font-medium ml-1">Gym Name</Label>
                <Input
                  id="gymName"
                  name="gymName"
                  type="text"
                  placeholder="Iron Paradise"
                  required
                  className="bg-slate-950/50 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-blue-500/20 h-11 rounded-xl transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300 text-sm font-medium ml-1">Work Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@gym.com"
                  required
                  className="bg-slate-950/50 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-blue-500/20 h-11 rounded-xl transition-all"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300 text-sm font-medium ml-1">Password</Label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required 
                  className="bg-slate-950/50 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-blue-500/20 h-11 rounded-xl transition-all"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold h-11 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-70" 
              disabled={pending}
            >
              {pending ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Setting up...
                </div>
              ) : "Create Account"}
            </Button>
            
            <div className="text-center">
              <p className="text-slate-400 text-sm">
                Already have an account?{" "}
                <a href="/login" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </form>
      </div>
      
      <p className="text-center text-[10px] text-slate-500 leading-relaxed max-w-xs mx-auto">
        By creating an account, you agree to GymOS's 
        <a href="#" className="text-slate-400 hover:text-blue-400 mx-1 underline underline-offset-4">Terms of Service</a> 
        and 
        <a href="#" className="text-slate-400 hover:text-blue-400 mx-1 underline underline-offset-4">Privacy Policy</a>.
      </p>
    </div>
  )
}
