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
import { Search, MoreHorizontal, ExternalLink, Users } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function GymsManagementPage() {
  const supabase = await createClient()
  
  // Fetch gyms with subscription plan and member counts (via subquery or separate joins)
  // For simplicity and performance, we'll fetch the core data first.
  const { data: gyms, error } = await supabase
    .from('gyms')
    .select(`
      *,
      saas_subscriptions (
        status,
        saas_plans (
          name
        )
      )
    `)
    .order('created_at', { ascending: false })

  // Enhancement: Get member counts for each gym
  const { data: memberCounts } = await supabase
    .from('members')
    .select('gym_id')

  const gymCountsMap = (memberCounts || []).reduce((acc: any, curr) => {
    acc[curr.gym_id] = (acc[curr.gym_id] || 0) + 1
    return acc
  }, {})

  if (error) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-white text-xl font-bold">Error loading gyms</h2>
        <p className="text-slate-400">{error.message}</p>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Gym Management</h2>
          <p className="text-slate-400">
            Manage all onboarded gyms and their platform subscriptions
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white">
          Onboard New Gym
        </Button>
      </div>

      <div className="flex items-center space-x-2 mt-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            type="search"
            placeholder="Search by gym name, email or owner..."
            className="pl-8 bg-slate-900/50 border-white/10 text-white"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl overflow-hidden shadow-xl">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Gym Name</TableHead>
              <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Owner</TableHead>
              <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Location</TableHead>
              <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">SaaS Plan</TableHead>
              <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Members</TableHead>
              <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Status</TableHead>
              <TableHead className="text-right text-slate-400 font-bold uppercase text-[10px] tracking-wider px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gyms?.map((gym: any) => {
              const sub = gym.saas_subscriptions?.[0]
              const planName = sub?.saas_plans?.name || (gym.status === 'trial' ? 'Trial' : 'No Plan')
              const memberCount = gymCountsMap[gym.id] || 0

              return (
                <TableRow key={gym.id} className="border-white/5 hover:bg-white/5 transition-colors">
                  <TableCell className="font-bold text-white py-4">{gym.name}</TableCell>
                  <TableCell className="text-slate-300">{gym.owner_name}</TableCell>
                  <TableCell className="text-slate-400">{gym.city || 'Not Set'}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20 font-bold text-[10px]">
                      {planName}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                       <Users className="h-3.5 w-3.5 text-slate-500" />
                       {memberCount}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={
                        gym.status === "active" 
                          ? "bg-green-500/20 text-green-400 border-green-500/30 uppercase text-[10px]" 
                          : gym.status === "trial"
                          ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 uppercase text-[10px]"
                          : "bg-red-500/20 text-red-400 border-red-500/30 uppercase text-[10px]"
                      }
                    >
                      {gym.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8 bg-white/5 border-white/10 text-white" title="View Dashboard">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 bg-white/5 border-white/10 text-white">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
            {(!gyms || gyms.length === 0) && (
              <TableRow>
                <TableCell colSpan={7} className="h-48 text-center text-slate-500 italic">
                  No gyms have been onboarded to the platform yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
