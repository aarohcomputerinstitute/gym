import { MemberForm } from "@/components/members/MemberForm"
import { createClient } from "@/lib/supabase/server"

export default async function AddMemberPage() {
  const supabase = await createClient()

  // Fetch real membership plans from the DB
  const { data: plans } = await supabase
    .from('membership_plans')
    .select('id, name, price')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  return (
    <div className="flex-1 space-y-4 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Add New Member</h2>
          <p className="text-slate-300">
            Register a new member to your gym
          </p>
        </div>
      </div>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 w-full max-w-3xl">
        <MemberForm plans={plans || []} />
      </div>
    </div>
  )
}
