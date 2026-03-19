"use client"

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

export default function SettingsBillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white">Platform Billing</h3>
        <p className="text-sm text-slate-300">
          Manage your GymOS subscription and billing details.
        </p>
      </div>
      <Separator />

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl text-white">Pro Plan</CardTitle>
              <CardDescription>Billed Monthly</CardDescription>
            </div>
            <Badge variant="default" className="bg-green-600">Active</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-3xl font-bold text-white">₹1,999<span className="text-sm text-slate-400 font-normal">/month</span></div>

          <div className="space-y-2 text-sm pt-4 border-t border-white/10">
            <div className="flex items-center text-slate-300">
              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Up to 1,000 Members
            </div>
            <div className="flex items-center text-slate-300">
              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> 10 Staff Accounts
            </div>
            <div className="flex items-center text-slate-300">
              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Advanced Reports & Analytics
            </div>
            <div className="flex items-center text-slate-300">
              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> SMS Notifications Integration
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t border-white/10 pt-4 bg-background/50">
          <div className="text-sm text-slate-300">
            Next billing date: <strong>April 15, 2024</strong>
          </div>
          <Button variant="outline" className="text-dark border-white/20">Manage Subscription</Button>
        </CardFooter>
      </Card>

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
