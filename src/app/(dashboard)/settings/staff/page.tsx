"use client"

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

const staffMembers = [
  {
    id: "u1",
    name: "Admin User",
    email: "admin@goldsfit.com",
    role: "Owner",
    status: "Active",
    lastActive: "Just now"
  },
  {
    id: "u2",
    name: "Sarah Manager",
    email: "sarah@goldsfit.com",
    role: "Manager",
    status: "Active",
    lastActive: "2 hours ago"
  },
  {
    id: "u3",
    name: "Front Desk 1",
    email: "desk1@goldsfit.com",
    role: "Receptionist",
    status: "Active",
    lastActive: "Today, 06:00 AM"
  }
]

export default function SettingsStaffPage() {
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
            {staffMembers.map((staff) => (
              <TableRow key={staff.id}>
                <TableCell>
                  <div className="font-medium text-white">{staff.name}</div>
                  <div className="text-xs text-slate-400">{staff.email}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{staff.role}</Badge>
                </TableCell>
                <TableCell>
                  <span className="text-green-500 text-sm font-medium">{staff.status}</span>
                </TableCell>
                <TableCell className="text-slate-300 text-sm">
                  {staff.lastActive}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
