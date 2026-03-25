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
import { UserPlus, Phone, Mail, MessageSquare, Target, Loader2, Sparkles, Wand2 } from "lucide-react"
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

interface InquiryFormProps {
  onSuccess?: () => void
}

export function InquiryForm({ onSuccess }: InquiryFormProps) {
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
      toast.success("Lead captured in pipeline!")
      form.reset()
      router.refresh()
      onSuccess?.()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-slate-800 bg-slate-900/40 backdrop-blur-xl shadow-2xl rounded-[2.5rem] overflow-hidden group">
      <CardHeader className="bg-slate-900/50 border-b border-white/5 p-8 relative">
        <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
           <Wand2 className="h-20 w-20 text-blue-500 absolute -right-4 -top-4 blur-3xl" />
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
            <UserPlus className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
             <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Entry Terminal</span>
             <CardTitle className="text-2xl font-black text-white tracking-tight">Capture <span className="text-blue-400 italic">Lead</span></CardTitle>
          </div>
        </div>
        <CardDescription className="text-slate-400 font-medium text-sm leading-relaxed">
          Initialize new prospect records with multi-channel source tracking.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5 mb-6">
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Identity Protocol</h4>
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 font-bold text-xs uppercase tracking-wider">Prospect Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" className="h-14 bg-slate-950/50 border-white/5 focus:border-blue-500/40 focus:bg-slate-950 rounded-2xl transition-all font-bold text-white placeholder:text-slate-700" {...field} />
                      </FormControl>
                      <FormMessage className="text-rose-500 text-[10px] font-black uppercase tracking-widest mt-2" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                         <FormLabel className="text-slate-300 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                          <Phone className="h-3 w-3 text-blue-500" />
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="+91..." className="h-14 bg-slate-950/50 border-white/5 focus:bg-slate-950 rounded-2xl font-bold text-white placeholder:text-slate-700" {...field} />
                        </FormControl>
                        <FormMessage className="text-rose-500 text-[10px] font-black uppercase tracking-widest mt-2" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="source"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                           <Target className="h-3 w-3 text-blue-500" />
                           Marketing Source
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-14 bg-slate-950/50 border-white/5 focus:bg-slate-950 rounded-2xl font-bold text-white">
                              <SelectValue placeholder="Source" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-2xl border-slate-800 bg-slate-900 text-slate-200">
                            <SelectItem value="Walk-in">Physical Walk-in</SelectItem>
                            <SelectItem value="Website">Official Website</SelectItem>
                            <SelectItem value="Social Media">Social Media (Insta/FB)</SelectItem>
                            <SelectItem value="Referral">Member Referral</SelectItem>
                            <SelectItem value="Google Maps">Google Maps / SEO</SelectItem>
                            <SelectItem value="Advertisement">Other Ads</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-rose-500 text-[10px] font-black uppercase tracking-widest mt-2" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                        <MessageSquare className="h-3 w-3 text-blue-500" />
                        Intelligence Notes
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Record intent, budget, and requirements..." 
                          className="min-h-[100px] bg-slate-950/50 border-white/5 focus:bg-slate-950 rounded-2xl resize-none font-medium leading-relaxed text-white placeholder:text-slate-700 p-4" 
                          {...field} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
            </div>

            <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row gap-4">
               <Button type="button" variant="ghost" className="h-14 flex-1 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-all order-2 sm:order-1" onClick={() => form.reset()}>
                  Reset Terminal
               </Button>
               <Button type="submit" className="h-14 flex-[2] bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2 order-1 sm:order-2" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white/50" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Record & Push Lead
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
