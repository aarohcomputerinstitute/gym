import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { PlanCard, type Plan } from "@/components/plans/PlanCard"

const mockPlans: Plan[] = [
  {
    id: "p1",
    name: "Starter",
    durationDays: 30,
    price: 999,
    registrationFee: 500,
    description: "Perfect for beginners getting into fitness.",
    features: ["Access to gym floor", "Locker facility", "1 Diet consultation"],
    maxFreezeDays: 0,
    isActive: true,
  },
  {
    id: "p2",
    name: "Pro - 3 Months",
    durationDays: 90,
    price: 2499,
    registrationFee: 0,
    description: "Our most popular short-term package.",
    features: ["Access to gym floor", "Locker facility", "2 Diet consultations", "Group classes"],
    maxFreezeDays: 7,
    isActive: true,
  },
  {
    id: "p3",
    name: "Pro - 6 Months",
    durationDays: 180,
    price: 4499,
    registrationFee: 0,
    description: "Great value for committed members.",
    features: ["Access to gym floor", "Locker facility", "Monthly diet review", "Group classes"],
    maxFreezeDays: 15,
    isActive: true,
  },
  {
    id: "p4",
    name: "Enterprise - Annual",
    durationDays: 365,
    price: 7999,
    registrationFee: 0,
    description: "The ultimate fitness commitment with max benefits.",
    features: ["24/7 Access", "Premium Locker", "Weekly diet review", "Unlimited classes", "Guest pass (2/mo)"],
    maxFreezeDays: 30,
    isActive: true,
  },
]

export default function PlansPage() {
  return (
    <div className="flex-1 space-y-4 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Membership Plans</h2>
          <p className="text-slate-300">
            Manage your pricing tiers and subscription packages
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/plans/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Plan
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
        {mockPlans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  )
}
