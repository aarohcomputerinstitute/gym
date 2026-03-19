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
        router.push("/plans")
        router.refresh()
      } catch (error: any) {
        toast.error(error.message || "Failed to save plan.")
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Pro - 6 Months" {...field} />
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
                  <FormLabel>Duration (Days)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="180" {...field} />
                  </FormControl>
                  <FormDescription>
                    Number of days this membership is valid
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Benefits and features of this plan"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Pricing & Rules</h3>
            
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="4500" {...field} />
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
                  <FormLabel>Registration Fee (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="500" {...field} />
                  </FormControl>
                  <FormDescription>
                    One-time fee charged on first signup
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Features (Comma separated)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g. Yoga Classes, Steam Room, Personal Trainer"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Separate features with commas to display them as a list
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
                  <FormLabel>Max Freeze Days</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="15" {...field} />
                  </FormControl>
                  <FormDescription>
                    Maximum days members can pause this plan
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Plan Active Status
                    </FormLabel>
                    <FormDescription>
                      Is this plan currently available for sale?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 border-t pt-4">
          <Button variant="outline" type="button" onClick={() => router.back()} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving Plan..." : "Save Plan"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
