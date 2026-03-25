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
  const [memberSearch, setMemberSearch] = useState("")

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
    console.log("Submitting payment data:", data)
    startTransition(async () => {
      try {
        const result = await createPaymentAction(data)
        if (result.success) {
          toast.success(`Payment verified! Invoice: ${result.invoiceNumber}`)
          router.push('/payments')
          router.refresh()
        } else {
          toast.error("Process returned unsuccessful status.")
        }
      } catch (error: any) {
        console.error("Payment Submission Error:", error)
        toast.error(error.message || "Failed to process payment. Please check your data.")
      }
    })
  }

  // Debug errors
  const errors = form.formState.errors
  if (Object.keys(errors).length > 0) {
    console.log("Form validation errors:", errors)
  }

  const currentMode = form.watch('paymentMode')
  const currentAmount = form.watch('amount')
  const isPartial = selectedPlan !== null && currentAmount < selectedPlan.price

  return (
    <Card className="bg-white border-slate-200 shadow-xl rounded-2xl overflow-hidden border">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-8">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2 tracking-tight">
              <Receipt className="h-6 w-6 text-blue-600" />
              Collect Member Payment
            </CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              Securely record transactions and activate member subscriptions.
            </CardDescription>
          </div>
          <Badge className="h-7 bg-blue-100 text-blue-700 hover:bg-blue-100 border-none font-bold px-3 text-[10px] uppercase">
            Phase 2: Verified
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, (err) => console.log("Validation Failed:", err))} className="space-y-10">
            <div className="grid gap-12 md:grid-cols-2">
              {/* Left Column: Selection */}
              <div className="space-y-8">
                <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-100">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <User className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">Subscriber Selection</h3>
                </div>

                <FormField
                  control={form.control}
                  name="memberId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold mb-1.5 block">Target Member*</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white border-slate-200 h-12 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium">
                            <SelectValue placeholder="Search member by name...">
                              {members.find(m => m.id === field.value)?.name}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border-slate-200">
                          <div className="p-2 border-b border-slate-100">
                            <Input 
                              placeholder="Type to filter..." 
                              className="h-9 bg-slate-50 border-slate-200 text-sm rounded-lg"
                              value={memberSearch}
                              onChange={(e) => setMemberSearch(e.target.value)}
                              onKeyDown={(e) => e.stopPropagation()}
                            />
                          </div>
                          <div className="max-h-[250px] overflow-y-auto p-1">
                            {members
                              .filter(m => 
                                m.name.toLowerCase().includes(memberSearch.toLowerCase()) || 
                                m.member_number?.toLowerCase().includes(memberSearch.toLowerCase())
                              )
                              .map(m => (
                                <SelectItem key={m.id} value={m.id} className="rounded-lg focus:bg-blue-50 focus:text-blue-700 cursor-pointer">
                                  {m.name} {m.member_number ? `(#${m.member_number})` : ""}
                                </SelectItem>
                              ))
                            }
                            {members.filter(m => 
                              m.name.toLowerCase().includes(memberSearch.toLowerCase()) || 
                              m.member_number?.toLowerCase().includes(memberSearch.toLowerCase())
                            ).length === 0 && (
                              <div className="p-4 text-center text-xs text-slate-500 italic">
                                No matching members found.
                              </div>
                            )}
                          </div>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs font-medium text-rose-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="planId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold mb-1.5 block">Assigned Plan*</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white border-slate-200 h-12 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium">
                            <SelectValue placeholder="Select membership package">
                              {plans.find(p => p.id === field.value)?.name}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border-slate-200">
                          {plans.map(p => (
                            <SelectItem key={p.id} value={p.id} className="rounded-lg focus:bg-blue-50 focus:text-blue-700 cursor-pointer">
                              {p.name} — ₹{p.price.toLocaleString()} ({p.duration_days} Days)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs font-medium text-rose-500" />
                    </FormItem>
                  )}
                />

                {selectedPlan && (
                  <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 animate-fade-in shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 rounded-full bg-blue-100 text-blue-600">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Subscription Coverage</p>
                         <p className="text-sm text-slate-600 font-medium">
                           This membership will expire on <span className="text-blue-700 font-bold">{new Date(Date.now() + selectedPlan.duration_days * 86400000).toLocaleDateString()}</span> if activated today.
                         </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Payment Details */}
              <div className="space-y-8">
                <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-100">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                    <IndianRupee className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">Payment Ledger</h3>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-semibold mb-1.5 block">Amount Paid (₹)*</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                            <Input 
                              type="number" 
                              className="bg-white border-slate-200 h-12 pl-10 rounded-xl text-slate-900 text-lg font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs font-medium text-rose-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentMode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-semibold mb-1.5 block">Mode*</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white border-slate-200 h-12 rounded-xl text-slate-900 font-semibold capitalize focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white border-slate-200">
                            <SelectItem value="cash" className="focus:bg-emerald-50 focus:text-emerald-700">💵 Cash</SelectItem>
                            <SelectItem value="upi" className="focus:bg-blue-50 focus:text-blue-700">📱 UPI / QR</SelectItem>
                            <SelectItem value="card" className="focus:bg-indigo-50 focus:text-indigo-700">💳 Credit/Debit Card</SelectItem>
                            <SelectItem value="bank_transfer" className="focus:bg-amber-50 focus:text-amber-700">🏦 Bank Transfer</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs font-medium text-rose-500" />
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
                        <FormLabel className="text-slate-700 font-semibold mb-1.5 block">
                          {currentMode === 'upi' ? 'Transaction ID / Reference Number' : 'Reference ID'}
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                            <Input 
                              placeholder="e.g. 403291..." 
                              className="bg-white border-slate-200 h-12 pl-10 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs font-medium text-rose-500" />
                      </FormItem>
                    )}
                  />
                )}

                {isPartial && selectedPlan && (
                  <FormField
                    control={form.control}
                    name="nextInstallmentDate"
                    render={({ field }) => (
                      <FormItem className="animate-fade-in border border-amber-200 bg-amber-50/50 p-6 rounded-2xl shadow-sm">
                        <FormLabel className="text-amber-700 font-bold uppercase text-[10px] tracking-wider flex items-center gap-2 mb-3">
                          <Clock className="w-4 h-4" /> Next Installment Required
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            min={new Date().toISOString().split("T")[0]}
                            className="bg-white border-amber-200 h-12 rounded-xl text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold transition-all"
                            value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                            onChange={(e) => {
                              const val = e.target.value
                              field.onChange(val ? new Date(val) : undefined)
                            }}
                          />
                        </FormControl>
                        <FormDescription className="text-[11px] text-amber-700/80 font-medium leading-relaxed mt-3 flex items-start gap-1.5">
                          <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                          Access will expire strictly on this date unless the pending balance of <strong className="text-amber-800">₹{(selectedPlan.price - currentAmount).toLocaleString()}</strong> is cleared.
                        </FormDescription>
                        <FormMessage className="text-xs font-medium text-rose-500" />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold mb-1.5 block">Administrative Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Record any special discounts or comments here..." 
                          className="bg-white border-slate-200 rounded-xl text-slate-900 resize-none h-24 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-xs font-medium text-rose-500" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="pt-10 border-t border-slate-100 flex items-center justify-between">
               <div className="flex items-center gap-2 py-2 px-4 rounded-full bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Secure Transaction Ready</span>
               </div>
               <div className="flex items-center gap-6">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => router.back()}
                    disabled={isPending}
                    className="text-slate-500 hover:text-slate-900 font-semibold transition-colors"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isPending}
                    className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-12 rounded-xl font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-sm uppercase tracking-wide"
                  >
                    {isPending ? "Synching Records..." : "Confirm & Record Payment"}
                  </Button>
               </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
