"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, CreditCard } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

export default function RecordPaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const memberId = searchParams.get('memberId')

  return (
    <div className="flex-1 space-y-4 pt-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="bg-white/5 border-white/10">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Record Payment</h2>
          <p className="text-slate-300">
            {memberId ? `Enter payment details for member ${memberId.substring(0, 8)}...` : "Choose a member and record their payment manually."}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-12 text-center mt-12 overflow-hidden relative">
         <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
         <div className="relative z-10 max-w-md mx-auto">
            <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
               <CreditCard className="h-10 w-10 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 italic">Payment Workflow (Work in Progress)</h3>
            <p className="text-slate-400 mb-8 leading-relaxed">
              We are currently optimizing the automated invoice generation and Indian tax (GST) calculation system. 🇮🇳
            </p>
            <div className="flex flex-col gap-3">
               <Button className="bg-blue-600 hover:bg-blue-500 text-white h-12 rounded-xl text-lg font-bold" onClick={() => router.push('/payments')}>
                 View Existing Payments
               </Button>
               <Button variant="outline" className="h-12 border-white/10 text-slate-300 hover:text-white rounded-xl" onClick={() => router.back()}>
                 Go Back
               </Button>
            </div>
         </div>
      </div>
    </div>
  )
}
