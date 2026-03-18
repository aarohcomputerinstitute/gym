import { MemberTable } from "@/components/members/MemberTable"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function MembersPage() {
  return (
    <div className="flex-1 space-y-4 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Members</h2>
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
        <MemberTable />
      </div>
    </div>
  )
}
