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
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Gym name must be at least 2 characters.",
  }),
  email: z.string().email(),
  phone: z.string().min(10, {
    message: "Phone number required",
  }),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  gstNumber: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

const defaultValues: Partial<ProfileFormValues> = {
  name: "Golds Fit",
  email: "admin@goldsfit.com",
  phone: "9876543210",
  address: "123 Fitness Street",
  city: "Mumbai",
  state: "Maharashtra",
}

export default function SettingsProfilePage() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  })

  function onSubmit(data: ProfileFormValues) {
    toast.success("Profile updated seamlessly!")
    console.log(data)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Gym Profile</h3>
        <p className="text-sm text-light">
          This information will be displayed on member receipts and emails.
        </p>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Gym Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Golds Fit" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input placeholder="admin@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="phone"
            render={({ field }: { field: any }) => (
              <FormItem className="max-w-[50%]">
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="9876543210" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Physical location of your gym"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Mumbai" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="Maharashtra" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="gstNumber"
            render={({ field }: { field: any }) => (
              <FormItem className="max-w-[50%]">
                <FormLabel>GST Number (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="22AAAAA0000A1Z5" {...field} />
                </FormControl>
                <FormDescription>
                  For tax invoicing and receipts.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Update profile</Button>
        </form>
      </Form>
    </div>
  )
}
