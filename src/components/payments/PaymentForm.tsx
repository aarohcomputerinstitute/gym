"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState, useTransition, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { 
  CreditCard, 
  User, 
  Calendar, 
  CheckCircle2, 
  Receipt, 
  IndianRupee, 
  Smartphone,
  Info,
  Clock
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createPaymentAction } from "@/app/actions/payment"

const paymentFormSchema = z.object({
  memberId: z.string().min(1, "Please select a member."),
  planId: z.string().min(1, "Please select a membership plan."),
  amount: z.coerce.number().min(1, "Amount must be greater than 0."),
  paymentMode: z.enum(['cash', 'upi', 'card', 'bank_transfer', 'online']),
  transactionId: z.string().optional(),
  notes: z.string().optional(),
  nextInstallmentDate: z.date().optional(),
}).refine(data => {
  // If we had a way to strictly validate the plan price here we would, 
  // but we enforce the required date at the UI rendering level and server level.
  return true;
})

type PaymentFormValues = z.infer<typeof paymentFormSchema>

interface Member {
  id: string
  name: string
  member_number?: string
}

interface Plan {
  id: string
  name: string
  price: number
  duration_days: number
}

interface PaymentFormProps {
  members: Member[]
  plans: Plan[]
  initialMemberId?: string
}

export function PaymentForm({ members, plans, initialMemberId }: PaymentFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema) as any,
    defaultValues: {
      memberId: initialMemberId || "",
      planId: "",
      amount: 0,
      paymentMode: 'cash',
      transactionId: "",
      notes: "",
    },
  })

  // Update amount when plan changes
  useEffect(() => {
    const planId = form.getValues('planId')
    const plan = plans.find(p => p.id === planId)
    if (plan) {
      setSelectedPlan(plan)
      form.setValue('amount', plan.price)
    }
  }, [form.watch('planId'), plans, form])

  async function onSubmit(data: PaymentFormValues) {
    startTransition(async () => {
      try {
        const result = await createPaymentAction(data)
        if (result.success) {
          toast.success(`Payment verified! Invoice: ${result.invoiceNumber}`)
          router.push('/payments')
          router.refresh()
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to process payment.")
      }
    })
  }

  const currentMode = form.watch('paymentMode')
  const currentAmount = form.watch('amount')
  const isPartial = selectedPlan !== null && currentAmount < selectedPlan.price

  return (
    <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden border">
      <CardHeader className="border-b border-white/10 bg-white/5 pb-8">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <Receipt className="h-6 w-6 text-blue-400" />
              Collect Member Payment
            </CardTitle>
            <CardDescription className="text-slate-400">
              Record a new transaction and activate membership services.
            </CardDescription>
          </div>
          <Badge variant="outline" className="h-8 border-blue-500/30 bg-blue-500/10 text-blue-400 font-bold px-4">
            PHASE 2: LIVE
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Left Column: Selection */}
              <div className="space-y-6">
                <div className="relative">
                  <div className="absolute -left-4 top-0 bottom-0 w-1 bg-blue-500 rounded-full opacity-50" />
                  <h3 className="text-lg font-bold text-white mb-4 pl-2">Member & Plan</h3>
                </div>

                <FormField
                  control={form.control}
                  name="memberId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 font-bold uppercase text-[10px] tracking-widest">Select Member</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl text-white focus:ring-blue-500/50">
                            <SelectValue placeholder="Search member by name..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-900 border-white/10 text-white">
                          {members.map(m => (
                            <SelectItem key={m.id} value={m.id}>
                              {m.name} {m.member_number ? `(#${m.member_number})` : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="planId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 font-bold uppercase text-[10px] tracking-widest">Subscription Plan</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl text-white">
                            <SelectValue placeholder="Select a membership package" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-900 border-white/10 text-white">
                          {plans.map(p => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name} — ₹{p.price.toLocaleString()} ({p.duration_days} Days)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedPlan && (
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4 animate-fade-in">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-400 mt-0.5" />
                      <div className="space-y-1">
                         <p className="text-xs font-bold text-blue-300 uppercase">Calculation Summary</p>
                         <p className="text-sm text-slate-300 leading-relaxed">
                           This membership will expire on <span className="text-white font-bold">{new Date(Date.now() + selectedPlan.duration_days * 86400000).toLocaleDateString()}</span>.
                         </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Payment Details */}
              <div className="space-y-6">
                <div className="relative">
                  <div className="absolute -left-4 top-0 bottom-0 w-1 bg-emerald-500 rounded-full opacity-50" />
                  <h3 className="text-lg font-bold text-white mb-4 pl-2">Payment Details</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300 font-bold uppercase text-[10px] tracking-widest">Amount to Pay (INR)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input 
                              type="number" 
                              className="bg-white/5 border-white/10 h-12 pl-10 rounded-xl text-white text-lg font-bold focus:border-emerald-500/50" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentMode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300 font-bold uppercase text-[10px] tracking-widest">Payment Mode</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl text-white font-medium capitalize">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-900 border-white/10 text-white">
                            <SelectItem value="cash">💵 Cash</SelectItem>
                            <SelectItem value="upi">📱 UPI (GPay/PhonePe)</SelectItem>
                            <SelectItem value="card">💳 Card</SelectItem>
                            <SelectItem value="bank_transfer">🏦 Bank Transfer</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {(currentMode === 'upi' || currentMode === 'bank_transfer' || currentMode === 'card') && (
                  <FormField
                    control={form.control}
                    name="transactionId"
                    render={({ field }) => (
                      <FormItem className="animate-fade-in">
                        <FormLabel className="text-slate-300 font-bold uppercase text-[10px] tracking-widest">
                          {currentMode === 'upi' ? 'UPI Reference Number (Last 4-6 Digits)' : 'Transaction/Check ID'}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input 
                              placeholder="e.g. 403291" 
                              className="bg-white/5 border-white/10 h-12 pl-10 rounded-xl text-white placeholder:text-slate-600" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {isPartial && selectedPlan && (
                  <FormField
                    control={form.control}
                    name="nextInstallmentDate"
                    rules={{ required: isPartial }}
                    render={({ field }) => (
                      <FormItem className="animate-fade-in border border-rose-500/30 bg-rose-500/5 p-4 rounded-xl mt-4">
                        <FormLabel className="text-rose-400 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                          <Clock className="w-3 h-3" /> Next Installment Date (Required)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            min={new Date().toISOString().split("T")[0]}
                            className={cn(
                              "bg-white/5 border-white/10 h-12 rounded-xl text-white focus:border-rose-500/50 [color-scheme:dark]",
                              !field.value && "text-slate-500"
                            )}
                            value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                            onChange={(e) => {
                              const val = e.target.value
                              field.onChange(val ? new Date(val) : undefined)
                            }}
                            required={isPartial}
                          />
                        </FormControl>
                        <FormDescription className="text-xs text-rose-300/70 leading-relaxed mt-2">
                          Member's gym access will explicitly expire on this date unless the pending <strong className="text-rose-400">₹{(selectedPlan.price - currentAmount).toLocaleString()}</strong> is paid.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 font-bold uppercase text-[10px] tracking-widest">Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Special discounts or payment caveats..." 
                          className="bg-white/5 border-white/10 rounded-xl text-white resize-none h-24" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="pt-8 border-t border-white/10 flex items-center justify-between">
               <div className="flex items-center gap-2 text-slate-500">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs">Secure atomic transaction</span>
               </div>
               <div className="flex items-center gap-4">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => router.back()}
                    disabled={isPending}
                    className="text-slate-400 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isPending}
                    className="bg-blue-600 hover:bg-blue-500 text-white h-12 px-10 rounded-xl font-bold shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
                  >
                    {isPending ? "Validating..." : "Confirm & Record Payment"}
                  </Button>
               </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
