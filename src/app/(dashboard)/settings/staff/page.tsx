import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PlusCircle, MoreHorizontal } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function SettingsStaffPage() {
  const supabase = await createClient()

  // Fetch staff dynamically (RLS will automatically restrict this to the active gym)
  const { data: staffMembers } = await supabase
    .from('users')
    .select('id, name, email, role, is_active, last_login_at')
    .order('created_at', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-white">Staff Management</h3>
          <p className="text-sm text-slate-300">
            Manage your team members and their access roles.
          </p>
        </div>
        <Button size="sm">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Staff
        </Button>
      </div>
      <Separator />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staffMembers && staffMembers.length > 0 ? (
              staffMembers.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell>
                    <div className="font-medium text-white">{staff.name}</div>
                    <div className="text-xs text-slate-400">{staff.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-white capitalize">{staff.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className={staff.is_active ? "text-green-500 text-sm font-medium" : "text-slate-500 text-sm font-medium"}>
                      {staff.is_active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-300 text-sm">
                    {staff.last_login_at ? new Date(staff.last_login_at).toLocaleDateString() : "Never"}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-slate-400">
                    No staff members found. Add your first team member!
                  </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
