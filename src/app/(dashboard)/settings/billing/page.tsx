import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2 } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function SettingsBillingPage() {
  const supabase = await createClient()

  // 1. Get the current user's gym_id
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('users')
    .select('gym_id')
    .eq('id', user?.id)
    .single()

  // 2. Fetch the SaaS subscription and plan details
  const { data: subscription } = await supabase
    .from('saas_subscriptions')
    .select(`
      *,
      saas_plans (
        name,
        price_monthly,
        features,
        max_members,
        max_staff
      )
    `)
    .eq('gym_id', profile?.gym_id)
    .single()

  const plan = subscription?.saas_plans as any

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white">Platform Billing</h3>
        <p className="text-sm text-slate-300">
          Manage your GymOS subscription and billing details.
        </p>
      </div>
      <Separator />

      {subscription ? (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl text-white">{plan?.name || "Active Plan"}</CardTitle>
                <CardDescription>Billed {subscription.billing_cycle}</CardDescription>
              </div>
              <Badge variant="default" className={subscription.status === 'active' ? "bg-green-600" : "bg-yellow-600"}>
                {subscription.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold text-white">
              ₹{subscription.amount}<span className="text-sm text-slate-400 font-normal">/{subscription.billing_cycle === 'yearly' ? 'year' : 'month'}</span>
            </div>

            <div className="space-y-2 text-sm pt-4 border-t border-white/10">
              <div className="flex items-center text-slate-300">
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Up to {plan?.max_members || '0'} Members
              </div>
              <div className="flex items-center text-slate-300">
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> {plan?.max_staff || '0'} Staff Accounts
              </div>
              {plan?.features?.reports && (
                <div className="flex items-center text-slate-300">
                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Advanced Reports & Analytics
                </div>
              )}
              {plan?.features?.sms && (
                <div className="flex items-center text-slate-300">
                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> SMS Notifications Integration
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-white/10 pt-4 bg-background/50">
            <div className="text-sm text-slate-300">
              Next billing date: <strong>{new Date(subscription.end_date).toLocaleDateString()}</strong>
            </div>
            <Button variant="outline" className="text-dark border-white/20">Manage Subscription</Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-white">No Active Subscription</CardTitle>
            <CardDescription className="text-slate-400">You are currently on a limited trial or haven't selected a plan yet.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full">Upgrade Now</Button>
          </CardFooter>
        </Card>
      )}

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-white">Invoices</CardTitle>
          <CardDescription className="text-slate-400">View and download your past platform invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-slate-400 text-center py-6">
            No past invoices available yet.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
