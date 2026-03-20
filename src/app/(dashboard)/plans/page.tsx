import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { PlanCard, type Plan } from "@/components/plans/PlanCard"
import { createClient } from "@/lib/supabase/server"

export default async function PlansPage() {
  const supabase = await createClient()

  // Fetch plans from database
  const { data: plans } = await supabase
    .from('membership_plans')
    .select('*')
    .order('sort_order', { ascending: true })

  // Map to the format expected by our PlanCard
  const formattedPlans: Plan[] = (plans || []).map(p => ({
    id: p.id,
    name: p.name,
    durationDays: p.duration_days,
    price: Number(p.price),
    registrationFee: Number(p.registration_fee),
    description: p.description || "",
    features: p.features || [],
    maxFreezeDays: p.max_freeze_days || 0,
    isActive: p.is_active
  }))

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
      
      {formattedPlans.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
          {formattedPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-700 rounded-2xl bg-slate-800/20 text-center mt-6">
          <div className="p-4 rounded-full bg-blue-500/10 mb-4">
            <PlusCircle className="h-10 w-10 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-1">No Membership Plans Found</h3>
          <p className="text-slate-400 max-w-xs mb-6">Create your first membership plan to start registering members.</p>
          <Button asChild>
             <Link href="/plans/new">Create First Plan</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
