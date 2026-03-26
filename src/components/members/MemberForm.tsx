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
import { User, CreditCard, HeartPulse, MapPin, Info, ShieldCheck } from "lucide-react"

const memberFormSchema = z.object({
  inquiryId: z.string().optional(),
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

export function MemberForm({ plans = [], initialData }: { plans?: PlanOption[], initialData?: Partial<MemberFormValues> }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      ...defaultValues,
      ...initialData
    },
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 animate-fade-in max-w-5xl mx-auto">
        <div className="grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
          {/* Personal Information */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-200">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <User className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Personal Information</h3>
            </div>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold mb-1.5 block">Full Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" className="bg-white border-slate-200 h-11 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" {...field} />
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
                    <FormLabel className="text-slate-700 font-semibold mb-1.5 block">Phone Number*</FormLabel>
                    <FormControl>
                      <Input placeholder="+91 9876543210" className="bg-white border-slate-200 h-11 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" {...field} />
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
                    <FormLabel className="text-slate-700 font-semibold mb-1.5 block">Email (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" className="bg-white border-slate-200 h-11 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" {...field} />
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
                    <FormLabel className="text-slate-700 font-semibold mb-1.5 block">Gender*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white border-slate-200 h-11 rounded-lg text-slate-900">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white border-slate-200 text-slate-900">
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
                    <FormLabel className="text-slate-700 font-semibold mb-2 mt-0.5">Date of Birth</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        max={new Date().toISOString().split("T")[0]}
                        className={cn(
                          "w-full bg-white border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 h-11 rounded-lg transition-all",
                          !field.value && "text-slate-400"
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
            <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-200">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <CreditCard className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Membership Setup</h3>
            </div>
            
            <FormField
              control={form.control}
              name="planId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold mb-1.5 block">Membership Plan*</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white border-slate-200 h-11 rounded-lg text-slate-900">
                        <SelectValue placeholder="Select a membership plan">
                          {plans.find(p => p.id === field.value)?.name}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border-slate-200 text-slate-900">
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
                  <FormLabel className="text-slate-700 font-semibold mb-2 mt-0.5">Registration Date*</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left h-11 rounded-lg bg-white border-slate-200 text-slate-900 hover:bg-slate-50 transition-colors",
                            !field.value && "text-slate-400"
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
                    <PopoverContent className="w-auto p-0 bg-white border-slate-200" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className="bg-white text-slate-900"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription className="text-xs text-slate-500 mt-2">
                    Effective date for the new membership.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-6 pt-10 border-t border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Emergency & Vital Info</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <FormField
              control={form.control}
              name="emergencyContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold mb-1.5 block">Emergency Contact</FormLabel>
                  <FormControl>
                    <Input placeholder="Name - Phone" className="bg-white border-slate-200 h-11 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" {...field} />
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
                  <FormLabel className="text-slate-700 font-semibold mb-1.5 block">Blood Group</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white border-slate-200 h-11 rounded-lg text-slate-900">
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border-slate-200 text-slate-900">
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
                  <FormLabel className="text-slate-700 font-semibold mb-1.5 block">Resident Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter full address"
                      className="bg-white border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none h-11 min-h-[44px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end items-center gap-6 pt-10 border-t border-slate-200 mt-10">
          <Button 
            variant="ghost" 
            type="button" 
            onClick={() => router.back()} 
            disabled={isPending}
            className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg h-11 px-8 transition-colors"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-11 px-12 font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
          >
            {isPending ? "Connecting to Real DB..." : "Create Member Profile"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
