import { MemberTable, Member } from "@/components/members/MemberTable"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export default async function MembersPage() {
  const supabase = await createClient()

  // Fetch members from database. RLS restricts to the user's gym_id.
  const { data: members, error } = await supabase
    .from('members')
    .select('id, name, phone, status, join_date')
    .order('created_at', { ascending: false })

  // Fetch pending dues using Admin Client
  const adminClient = createAdminClient()
  const memberIds = (members || []).map(m => m.id)
  
  const { data: payments } = memberIds.length > 0 ? await adminClient
    .from('payments')
    .select('member_id, amount, total_amount')
    .in('member_id', memberIds) : { data: [] }
    
  const duesMap: Record<string, number> = {}
  ;(payments || []).forEach(p => {
    const total = Number(p.total_amount) || 0
    const paid = Number(p.amount) || 0
    const due = Math.max(0, total - paid)
    if (due > 0) {
       duesMap[p.member_id] = (duesMap[p.member_id] || 0) + due
    }
  })

  // Map to the format expected by our data table
  const formattedMembers: Member[] = (members || []).map(m => ({
    id: m.id,
    name: m.name,
    phone: m.phone,
    plan: "Standard Options", // TODO: join with member_subscriptions table
    status: (m.status as "active" | "inactive" | "expired" | "frozen") || "inactive",
    joinDate: m.join_date ? new Date(m.join_date).toISOString().split('T')[0] : "N/A",
    expiryDate: "N/A",
    pendingDues: duesMap[m.id] || 0
  }))

  return (
    <div className="flex-1 space-y-4 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-white">Members</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/members/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Member
            </Link>
          </Button>
        </div>
      </div>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <MemberTable data={formattedMembers} />
      </div>
    </div>
  )
}
