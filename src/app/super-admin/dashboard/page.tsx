import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button-variants"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { 
  Building2, 
  Users, 
  CreditCard, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"

const stats = [
  {
    title: "Total Gyms",
    value: "124",
    description: "+12 from last month",
    icon: Building2,
    trend: "up"
  },
  {
    title: "Total Members",
    value: "12,450",
    description: "+15% from last month",
    icon: Users,
    trend: "up"
  },
  {
    title: "MRR",
    value: "₹2,45,000",
    description: "+₹42,000 increase",
    icon: CreditCard,
    trend: "up"
  },
  {
    title: "Active Trials",
    value: "18",
    description: "-4 from last week",
    icon: TrendingUp,
    trend: "down"
  }
]

export default function SuperAdminDashboard() {
  return (
    <div className="flex-1 space-y-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Platform Overview</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                )}
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Gym Signups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[
                { name: "Power Fitness", owner: "Amit Kumar", date: "2 hours ago", plan: "Pro" },
                { name: "Iron Temple", owner: "Rajesh Singh", date: "1 day ago", plan: "Starter" },
                { name: "Elite Gym", owner: "Sanjay Gupta", date: "2 days ago", plan: "Enterprise" },
                { name: "Fit Zone", owner: "Vikram Shah", date: "3 days ago", plan: "Trial" },
              ].map((gym, i) => (
                <div key={i} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{gym.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {gym.owner} • {gym.plan}
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-sm text-muted-foreground">{gym.date}</div>
                </div>
              ))}
            </div>
            <Link 
              href="/super-admin/gyms"
              className={cn(buttonVariants({ variant: "outline" }), "w-full mt-6")}
            >
              View All Gyms
            </Link>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Real-time platform status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm">Database</span>
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Operational</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm">Auth Service</span>
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Operational</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm">Storage (S3)</span>
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Operational</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm">Email Service</span>
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Operational</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Badge({ children, className, variant }: { children: React.ReactNode, className?: string, variant?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      className
    )}>
      {children}
    </span>
  )
}
