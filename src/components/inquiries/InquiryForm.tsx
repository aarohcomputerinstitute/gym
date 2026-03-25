'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, Phone, Mail, MessageSquare, Target, Loader2, Sparkles } from "lucide-react"
import { createInquiryAction } from "@/app/actions/inquiry"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const inquiryFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  phone: z.string().min(10, "Phone number must be at least 10 digits."),
  email: z.string().email("Invalid email address.").optional().or(z.literal("")),
  source: z.string().min(1, "Please select a source."),
  notes: z.string().optional(),
})

type InquiryFormValues = z.infer<typeof inquiryFormSchema>

export function InquiryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      source: "Walk-in",
      notes: "",
    },
  })

  async function onSubmit(data: InquiryFormValues) {
    try {
      setIsSubmitting(true)
      await createInquiryAction(data)
      toast.success("Inquiry successfully recorded.")
      form.reset()
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-slate-100 bg-white shadow-xl rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <UserPlus className="h-5 w-5" />
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-100 font-black text-[10px] uppercase tracking-widest px-2">
            Lead Capture
          </Badge>
        </div>
        <CardTitle className="text-3xl font-black tracking-tight text-slate-900">Capture New <span className="text-blue-600 italic">Inquiry</span></CardTitle>
        <CardDescription className="text-slate-500 font-medium text-base">Record walk-ins and digital leads for your sales pipeline.</CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column: Personal Info */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 mb-4">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Prospect Identity</h4>
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-bold text-sm tracking-tight flex items-center gap-2">Full Name <span className="text-blue-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" className="h-12 bg-slate-50 border-slate-100 focus:bg-white focus:ring-blue-500/10 rounded-xl transition-all font-medium" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-bold text-sm tracking-tight flex items-center gap-2">
                          <Phone className="h-3 w-3 text-slate-400" />
                          Phone Number <span className="text-blue-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="+91 98765 43210" className="h-12 bg-slate-50 border-slate-100 focus:bg-white rounded-xl font-medium" {...field} />
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
                        <FormLabel className="text-slate-700 font-bold text-sm tracking-tight flex items-center gap-2">
                          <Mail className="h-3 w-3 text-slate-400" />
                          Email (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="prospect@example.com" className="h-12 bg-slate-50 border-slate-100 focus:bg-white rounded-xl font-medium" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Right Column: Source & Notes */}
              <div className="space-y-6">
                 <div className="flex items-center gap-2 pb-2 border-b border-slate-100 mb-4">
                  <Target className="h-4 w-4 text-blue-500" />
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Marketing Source</h4>
                </div>

                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-bold text-sm tracking-tight flex items-center gap-2">Inquiry Source</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 bg-slate-50 border-slate-100 focus:bg-white rounded-xl font-medium">
                            <SelectValue placeholder="Select how they found you" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl border-slate-200">
                          <SelectItem value="Walk-in">Physical Walk-in</SelectItem>
                          <SelectItem value="Website">Official Website</SelectItem>
                          <SelectItem value="Social Media">Social Media (Instagram/FB)</SelectItem>
                          <SelectItem value="Referral">Member Referral</SelectItem>
                          <SelectItem value="Google Maps">Google Maps / SEO</SelectItem>
                          <SelectItem value="Advertisement">Newspaper / Banner</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-bold text-sm tracking-tight flex items-center gap-2">
                        <MessageSquare className="h-3 w-3 text-slate-400" />
                        Initial Requirements / Budget
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Interested in weight gain, budget is around 2k/month..." 
                          className="min-h-[110px] bg-slate-50 border-slate-100 focus:bg-white rounded-xl resize-none font-medium leading-relaxed" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
               <Button type="button" variant="ghost" className="h-12 px-8 rounded-xl font-bold text-slate-500 hover:bg-slate-50" onClick={() => form.reset()}>
                  Clear Form
               </Button>
               <Button type="submit" className="h-12 px-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black shadow-lg shadow-blue-100 transition-all flex items-center gap-2" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Recording...
                  </>
                ) : (
                  <>
                    Save Lead & Track
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

function Badge({ children, variant, className }: any) {
  return (
    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </div>
  )
}
