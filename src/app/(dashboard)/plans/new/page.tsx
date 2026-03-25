import { PlanForm } from "@/components/plans/PlanForm"

export default function AddPlanPage() {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 flex-1 space-y-4 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Create Plan</h2>
          <p className="text-slate-300">
            Define a new membership tier for your gym
          </p>
        </div>
      </div>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 w-full max-w-3xl">
        <PlanForm />
      </div>
    </div>
  )
}
