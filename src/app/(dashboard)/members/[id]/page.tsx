import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, MoreHorizontal, User } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  // In a real app we'd fetch the member details here
  const member = {
    id,
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 9876543210",
    joinDate: "Jan 15, 2023",
    status: "active",
    plan: "Pro (6 Months)",
    expiryDate: "Jul 15, 2024",
  }

  return (
    <div className="flex-1 space-y-4 pt-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/members">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight">{member.name}</h2>
            <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Member since {member.joinDate}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>Renew Membership</DropdownMenuItem>
              <DropdownMenuItem>Freeze Membership</DropdownMenuItem>
              <DropdownMenuItem>Log Check-in</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">Delete Member</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[250px_1fr]">
        <div className="space-y-4">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 text-center">
            <Avatar className="h-32 w-32 mx-auto mb-4 border">
              <AvatarImage src="" alt={member.name} />
              <AvatarFallback className="text-4xl"><User className="h-12 w-12" /></AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-xl">{member.name}</h3>
            <p className="text-muted-foreground">{member.phone}</p>
            <div className="mt-4 pt-4 border-t text-left space-y-2">
              <div>
                <span className="text-xs text-muted-foreground block">Email</span>
                <span className="text-sm">{member.email}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Blood Group</span>
                <span className="text-sm font-medium">O+</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Emergency Contact</span>
                <span className="text-sm">Jane Doe - 9876543211</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Tabs defaultValue="membership" className="w-full">
            <TabsList className="w-full justify-start h-12 rounded-lg bg-muted border">
              <TabsTrigger value="membership" className="data-[state=active]:bg-background">Membership</TabsTrigger>
              <TabsTrigger value="payments" className="data-[state=active]:bg-background">Payments</TabsTrigger>
              <TabsTrigger value="attendance" className="data-[state=active]:bg-background">Attendance</TabsTrigger>
              <TabsTrigger value="workouts" className="data-[state=active]:bg-background">Workouts</TabsTrigger>
              <TabsTrigger value="progress" className="data-[state=active]:bg-background">Progress</TabsTrigger>
            </TabsList>
            
            <TabsContent value="membership" className="space-y-4 mt-4">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <h3 className="font-semibold text-lg mb-4">Current Subscription</h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-xs text-muted-foreground block">Plan</span>
                    <span className="font-medium">{member.plan}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Start Date</span>
                    <span className="font-medium">Jan 15, 2024</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Expiry Date</span>
                    <span className="font-medium text-red-600">{member.expiryDate}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Status</span>
                    <span className="font-medium text-green-600">Active</span>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <h3 className="font-semibold text-lg mb-4">Subscription History</h3>
                <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-md">
                  History will be displayed here
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="payments" className="mt-4">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <h3 className="font-semibold text-lg mb-4">Payment History</h3>
                <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-md">
                  Payment records will be displayed here
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="attendance" className="mt-4">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <h3 className="font-semibold text-lg mb-4">Recent Attendance</h3>
                <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-md">
                  Attendance logs will be displayed here
                </div>
              </div>
            </TabsContent>

            <TabsContent value="workouts" className="mt-4">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <h3 className="font-semibold text-lg mb-4">Assigned Workouts</h3>
                <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-md">
                  Workout plans will be displayed here
                </div>
              </div>
            </TabsContent>

            <TabsContent value="progress" className="mt-4">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <h3 className="font-semibold text-lg mb-4">Body Measurements</h3>
                <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-md">
                  Progress tracking charts will be displayed here
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
