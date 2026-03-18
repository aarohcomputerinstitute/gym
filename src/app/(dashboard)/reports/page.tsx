import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FileDown, CalendarDays, TrendingUp, Users, AlertCircle } from "lucide-react"

export default function ReportsPage() {
  return (
    <div className="flex-1 space-y-4 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">
            Generate and export insights about your gym's performance
          </p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-start gap-4">
            <div className="mt-1 bg-primary/10 p-2 rounded-md">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Revenue & Financials</CardTitle>
              <CardDescription>
                Detailed breakdown of payments, taxes, and outstanding dues.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm py-2 border-b">
              <span>Monthly Revenue Collection</span>
              <Button variant="ghost" size="sm" className="h-8">
                <FileDown className="mr-2 h-4 w-4" /> Download PDF
              </Button>
            </div>
            <div className="flex items-center justify-between text-sm py-2 border-b">
              <span>Failed / Pending Payments</span>
              <Button variant="ghost" size="sm" className="h-8">
                <FileDown className="mr-2 h-4 w-4" /> Download CSV
              </Button>
            </div>
            <div className="flex items-center justify-between text-sm py-2 border-b">
              <span>GST / Tax Summary</span>
              <Button variant="ghost" size="sm" className="h-8">
                <FileDown className="mr-2 h-4 w-4" /> Download Excel
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-start gap-4">
            <div className="mt-1 bg-primary/10 p-2 rounded-md">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Member Analytics</CardTitle>
              <CardDescription>
                Growth metrics, retention rates, and demographic breakdowns.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm py-2 border-b">
              <span>New Joiners (Last 30 Days)</span>
              <Button variant="ghost" size="sm" className="h-8">
                <FileDown className="mr-2 h-4 w-4" /> Download PDF
              </Button>
            </div>
            <div className="flex items-center justify-between text-sm py-2 border-b">
              <span>Active vs Inactive Members</span>
              <Button variant="ghost" size="sm" className="h-8">
                <FileDown className="mr-2 h-4 w-4" /> Download CSV
              </Button>
            </div>
            <div className="flex items-center justify-between text-sm py-2 border-b">
              <span>Plan Distribution Chart</span>
              <Button variant="ghost" size="sm" className="h-8">
                <FileDown className="mr-2 h-4 w-4" /> Export Image
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start gap-4">
            <div className="mt-1 bg-red-100 p-2 rounded-md">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <CardTitle>Expiring Memberships</CardTitle>
              <CardDescription>
                Track upcoming renewals and lost members.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm py-2 border-b">
              <span>Expiring in 7 Days</span>
              <Button variant="ghost" size="sm" className="h-8">
                <FileDown className="mr-2 h-4 w-4" /> Download CSV
              </Button>
            </div>
            <div className="flex items-center justify-between text-sm py-2 border-b">
              <span>Expiring in 30 Days</span>
              <Button variant="ghost" size="sm" className="h-8">
                <FileDown className="mr-2 h-4 w-4" /> Download Excel
              </Button>
            </div>
            <div className="flex items-center justify-between text-sm py-2 border-b">
              <span>Recently Expired (Follow-up List)</span>
              <Button variant="ghost" size="sm" className="h-8">
                <FileDown className="mr-2 h-4 w-4" /> Download PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start gap-4">
            <div className="mt-1 bg-primary/10 p-2 rounded-md">
              <CalendarDays className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Attendance & Operations</CardTitle>
              <CardDescription>
                Facility usage patterns and staff performance.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm py-2 border-b">
              <span>Peak Hours Heatmap</span>
              <Button variant="ghost" size="sm" className="h-8">
                <FileDown className="mr-2 h-4 w-4" /> Download PDF
              </Button>
            </div>
            <div className="flex items-center justify-between text-sm py-2 border-b">
              <span>Trainer Performance & Client Load</span>
              <Button variant="ghost" size="sm" className="h-8">
                <FileDown className="mr-2 h-4 w-4" /> Download Excel
              </Button>
            </div>
            <div className="flex items-center justify-between text-sm py-2 border-b">
              <span>System Audit Log</span>
              <Button variant="ghost" size="sm" className="h-8">
                <FileDown className="mr-2 h-4 w-4" /> Download CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
