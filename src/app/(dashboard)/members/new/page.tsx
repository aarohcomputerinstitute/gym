import { MemberForm } from "@/components/members/MemberForm"

export default function AddMemberPage() {
  return (
    <div className="flex-1 space-y-4 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Add New Member</h2>
          <p className="text-muted-foreground">
            Register a new member to your gym
          </p>
        </div>
      </div>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 w-full max-w-3xl">
        <MemberForm />
      </div>
    </div>
  )
}
