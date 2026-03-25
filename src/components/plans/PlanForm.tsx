"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
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
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { createPlanAction } from "@/app/actions/plan"
import { useState, useTransition } from "react"
import { Package, ShieldCheck, ListChecks, Banknote, UserPlus } from "lucide-react"

const planFormSchema = z.object({
  name: z.string().min(2, {
    message: "Plan name must be at least 2 characters.",
  }),
  durationDays: z.coerce.number().min(1, {
    message: "Duration must be at least 1 day.",
  }),
  price: z.coerce.number().min(0, {
    message: "Price cannot be negative.",
  }),
  registrationFee: z.coerce.number().min(0).default(0),
  description: z.string().optional(),
  maxFreezeDays: z.coerce.number().min(0).default(0),
  isActive: z.boolean().default(true),
  features: z.string().optional(),
})

type PlanFormValues = z.infer<typeof planFormSchema>

const defaultValues: Partial<PlanFormValues> = {
  isActive: true,
  registrationFee: 0,
  maxFreezeDays: 0,
}

export function PlanForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planFormSchema) as any,
    defaultValues,
  })

  function onSubmit(data: PlanFormValues) {
    startTransition(async () => {
      try {
        const payload = {
          ...data,
          features: data.features ? data.features.split(',').map(f => f.trim()).filter(Boolean) : []
        }
        await createPlanAction(payload)
        toast.success("Membership plan saved correctly in database!")
        
        // Expert Refresh Strategy: Redirect + Refresh + Hard Fallback
        router.push("/plans")
        router.refresh()
        
        // Hard fallback to ensure the list is updated even if Next.js caching is stubborn
        setTimeout(() => {
          if (window.location.pathname !== "/plans") {
            window.location.href = "/plans"
          } else {
            router.refresh()
          }
        }, 1500)
      } catch (error: any) {
        toast.error(error.message || "Failed to save plan.")
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 animate-fade-in max-w-5xl mx-auto">
        <div className="grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
          {/* Basic Information */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-200">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <Package className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Plan Definition</h3>
            </div>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold mb-1.5 block">Plan Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Pro - 6 Months" className="bg-white border-slate-200 h-11 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="durationDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold mb-1.5 block">Duration (Days)*</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="180" className="bg-white border-slate-200 h-11 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs text-slate-500 mt-1.5">
                    How long the membership remains active.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold mb-1.5 block">Plan Overview</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="High-level benefits of this membership"
                      className="bg-white border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Pricing & Rules */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-200">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <Banknote className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Financial & Rules</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-semibold mb-1.5 block">Base Price (₹)*</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="4500" className="bg-white border-slate-200 h-11 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="registrationFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-semibold mb-1.5 block">Entry Fee (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="500" className="bg-white border-slate-200 h-11 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold mb-1.5 block flex items-center gap-2">
                    <ListChecks className="h-4 w-4" /> Feature Highlights
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g. Free Trainer, 24/7 Access, Yoga Included"
                      className="bg-white border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none min-h-[44px] h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-slate-500 mt-1.5">
                    Separate items with commas to list them professionally.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxFreezeDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold mb-1.5 block">Freeze Allowance (Days)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="15" className="bg-white border-slate-200 h-11 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Global Settings */}
        <div className="space-y-6 pt-10 border-t border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Plan Governance</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-6 shadow-sm">
                  <div className="space-y-1">
                    <FormLabel className="text-base font-bold text-slate-900">
                      Market Availability
                    </FormLabel>
                    <FormDescription className="text-xs text-slate-500">
                      Is this plan currently available for gym members to purchase?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </FormControl>
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
            {isPending ? "Syncing Expert Details..." : "Save Membership Plan"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
