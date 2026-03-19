import { PaymentTable } from "@/components/payments/PaymentTable"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function PaymentsPage() {
  return (
    <div className="flex-1 space-y-4 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Payments</h2>
          <p className="text-slate-300">
            Manage transactions, invoices, and refunds
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Record Payment
          </Button>
        </div>
      </div>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <PaymentTable />
      </div>
    </div>
  )
}
