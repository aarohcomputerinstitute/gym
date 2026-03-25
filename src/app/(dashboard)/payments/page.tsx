import { PaymentTable, type Payment } from "@/components/payments/PaymentTable"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export default async function PaymentsPage() {
  const supabase = await createClient()

  // Fetch payments with member names
  const { data: rawPayments } = await supabase
    .from('payments')
    .select(`
      id,
      invoice_number,
      total_amount,
      payment_date,
      payment_mode,
      transaction_id,
      status,
      members (
        name
      )
    `)
    .order('payment_date', { ascending: false })

  const formattedPayments: Payment[] = (rawPayments || []).map((p: any) => ({
    id: p.id,
    invoiceNumber: p.invoice_number || `INV-${p.id.substring(0, 8)}`,
    memberName: p.members?.name || "Unknown Member",
    amount: Number(p.total_amount),
    date: p.payment_date,
    method: p.payment_mode,
    transactionId: p.transaction_id,
    status: p.status as any,
  }))

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 flex-1 space-y-4 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Payments</h2>
          <p className="text-slate-300">
            Manage transactions, invoices, and refunds
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/payments/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Record Payment
            </Link>
          </Button>
        </div>
      </div>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <PaymentTable data={formattedPayments} />
      </div>
    </div>
  )
}
