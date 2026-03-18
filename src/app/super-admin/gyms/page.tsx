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
import { Input } from "@/components/ui/input"
import { Search, MoreHorizontal, ExternalLink } from "lucide-react"

import { createClient } from "@/lib/supabase/server"

export default async function GymsManagementPage() {
  const supabase = await createClient()
  
  const { data: gyms, error } = await supabase
    .from('gyms')
    .select('*, users(name)')
    .order('created_at', { ascending: false })

  if (error) {
    return <div>Error loading gyms: {error.message}</div>
  }
  return (
    <div className="flex-1 space-y-4 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gym Management</h2>
          <p className="text-muted-foreground">
            Manage all onboarded gyms and their subscriptions
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 mt-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search gyms..."
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Gym Name</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gyms?.map((gym) => (
              <TableRow key={gym.id}>
                <TableCell className="font-medium">{gym.name}</TableCell>
                <TableCell>{gym.owner_name || 'N/A'}</TableCell>
                <TableCell>{gym.location || 'N/A'}</TableCell>
                <TableCell>
                  <Badge variant="outline">Trial</Badge>
                </TableCell>
                <TableCell>0</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={
                      gym.status === "active" 
                        ? "bg-green-50 text-green-700 border-green-200 uppercase" 
                        : "bg-red-50 text-red-700 border-red-200 uppercase"
                    }
                  >
                    {gym.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" title="View Dashboard">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
