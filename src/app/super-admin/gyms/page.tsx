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

const gyms = [
  {
    id: "g1",
    name: "Power Fitness",
    owner: "Amit Kumar",
    city: "Mumbai",
    plan: "Pro",
    status: "Active",
    members: 450,
    mrr: "₹1,999"
  },
  {
    id: "g2",
    name: "Iron Temple",
    owner: "Rajesh Singh",
    city: "Delhi",
    plan: "Starter",
    status: "Active",
    members: 120,
    mrr: "₹999"
  },
  {
    id: "g3",
    name: "Elite Gym",
    owner: "Sanjay Gupta",
    city: "Bangalore",
    plan: "Enterprise",
    status: "Active",
    members: 1200,
    mrr: "₹4,999"
  },
  {
    id: "g4",
    name: "Fit Zone",
    owner: "Vikram Shah",
    city: "Pune",
    plan: "Trial",
    status: "Active",
    members: 50,
    mrr: "₹0"
  },
  {
    id: "g5",
    name: "Muscle Mania",
    owner: "Prakash Jha",
    city: "Patna",
    plan: "Pro",
    status: "Suspended",
    members: 200,
    mrr: "₹1,999"
  }
]

export default function GymsManagementPage() {
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
            {gyms.map((gym) => (
              <TableRow key={gym.id}>
                <TableCell className="font-medium">{gym.name}</TableCell>
                <TableCell>{gym.owner}</TableCell>
                <TableCell>{gym.city}</TableCell>
                <TableCell>
                  <Badge variant="outline">{gym.plan}</Badge>
                </TableCell>
                <TableCell>{gym.members}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={
                      gym.status === "Active" 
                        ? "bg-green-50 text-green-700 border-green-200" 
                        : "bg-red-50 text-red-700 border-red-200"
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
