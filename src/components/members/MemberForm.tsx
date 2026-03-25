"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createMemberAction } from "@/app/actions/member"
import { User, CreditCard, HeartPulse, MapPin, Calendar, Info, ShieldCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const memberFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  email: z.string().email().optional().or(z.literal('')),
  gender: z.enum(["male", "female", "other"]),
  dob: z.date().optional(),
  joinDate: z.date({
    message: "A join date is required.",
  }),
  bloodGroup: z.string().optional(),
  emergencyContact: z.string().optional(),
  address: z.string().optional(),
  planId: z.string({
    message: "Please select a membership plan.",
  }),
})

type MemberFormValues = z.infer<typeof memberFormSchema>

export interface PlanOption {
  id: string
  name: string
  price: number
}

const defaultValues: Partial<MemberFormValues> = {
  joinDate: new Date(),
}

export function MemberForm({ plans = [] }: { plans?: PlanOption[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues,
  })

  function onSubmit(data: MemberFormValues) {
    startTransition(async () => {
      try {
        await createMemberAction(data)
        toast.success("Member dynamically created inside Supabase!")
        router.push("/members")
        router.refresh()
      } catch (error: any) {
        toast.error(error.message || "An unexpected error occurred.")
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 animate-fade-in">
        <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden">
          <CardContent className="p-8 space-y-10">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
              {/* Personal Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6 pb-2 border-b border-white/5">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <User className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-white italic tracking-tight">Personal Profile</h3>
                </div>
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 font-bold uppercase text-[10px] tracking-widest pl-1">Full Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" className="bg-white/5 border-white/10 h-12 rounded-xl text-white focus:border-blue-500/50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300 font-bold uppercase text-[10px] tracking-widest pl-1">Phone Number*</FormLabel>
                        <FormControl>
                          <Input placeholder="+91 9876543210" className="bg-white/5 border-white/10 h-12 rounded-xl text-white focus:border-blue-500/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300 font-bold uppercase text-[10px] tracking-widest pl-1">Email (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="john@example.com" className="bg-white/5 border-white/10 h-12 rounded-xl text-white focus:border-blue-500/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300 font-bold uppercase text-[10px] tracking-widest pl-1">Gender*</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl text-white">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-900 border-white/10 text-white">
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-slate-300 font-bold uppercase text-[10px] tracking-widest pl-1 mb-2">Date of Birth</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            max={new Date().toISOString().split("T")[0]}
                            className={cn(
                              "w-full bg-white/5 border-white/10 text-white focus:border-blue-500/50 h-12 rounded-xl transition-all [color-scheme:dark]",
                              !field.value && "text-slate-500"
                            )}
                            value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                            onChange={(e) => {
                              const val = e.target.value
                              field.onChange(val ? new Date(val) : undefined)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Membership Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6 pb-2 border-b border-white/5">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-white italic tracking-tight">Membership Plan</h3>
                </div>
                
                <FormField
                  control={form.control}
                  name="planId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 font-bold uppercase text-[10px] tracking-widest pl-1">Select Active Plan*</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl text-white">
                            <SelectValue placeholder="Select a membership plan">
                              {plans.find(p => p.id === field.value)?.name}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-900 border-white/10 text-white">
                          {plans.length > 0 ? (
                            plans.map((plan) => (
                              <SelectItem key={plan.id} value={plan.id}>
                                {plan.name} (₹{plan.price})
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>No active plans available</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="joinDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-slate-300 font-bold uppercase text-[10px] tracking-widest pl-1 mb-2">Join Date*</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left h-12 rounded-xl bg-white/5 border-white/10 text-white hover:bg-white/10 transition-colors",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-slate-900 border-white/10" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className="bg-slate-900 text-white"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription className="text-[10px] text-slate-500 italic">
                        The official start date of the membership contract.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-6 pt-10 border-t border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-white italic tracking-tight">Safety & Additional Details</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="emergencyContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 font-bold uppercase text-[10px] tracking-widest pl-1 flex items-center gap-2">
                        <HeartPulse className="h-3 w-3" /> Emergency Contact
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Name - Phone" className="bg-white/5 border-white/10 h-12 rounded-xl text-white" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bloodGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 font-bold uppercase text-[10px] tracking-widest pl-1">Blood Group</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl text-white">
                            <SelectValue placeholder="Select blood group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-900 border-white/10 text-white">
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-1">
                      <FormLabel className="text-slate-300 font-bold uppercase text-[10px] tracking-widest pl-1 flex items-center gap-2">
                        <MapPin className="h-3 w-3" /> Address
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Residential address"
                          className="bg-white/5 border-white/10 rounded-xl text-white resize-none h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-8 border-t border-white/10">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => router.back()} 
                disabled={isPending}
                className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl h-12 px-8"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isPending}
                className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl h-12 px-10 font-bold shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
              >
                {isPending ? "Connecting to Real DB..." : "Save & Create Profile"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
