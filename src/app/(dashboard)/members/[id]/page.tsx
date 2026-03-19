import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, MoreHorizontal, User, CalendarDays, CreditCard, Activity } from "lucide-react"
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
import { createClient } from "@/lib/supabase/server"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // 1. Fetch Member Core Profile
  const { data: member, error: memberError } = await supabase
    .from('members')
    .select('*')
    .eq('id', id)
    .single()

  if (memberError || !member) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Member Not Found</h2>
        <p className="text-slate-400 mb-6">The member record you are looking for does not exist or has been removed.</p>
        <Button asChild><Link href="/members">Back to Members</Link></Button>
      </div>
    )
  }

  // 2. Fetch Active Subscription & Plan
  const { data: subscription } = await supabase
    .from('member_subscriptions')
    .select('*, membership_plans(*)')
    .eq('member_id', id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  // 3. Fetch Payment History
  const { data: payments } = await supabase
    .from('payments')
    .select('*')
    .eq('member_id', id)
    .order('payment_date', { ascending: false })

  // 4. Fetch Attendance History
  const { data: attendance } = await supabase
    .from('attendance')
    .select('*')
    .eq('member_id', id)
    .order('checkin_time', { ascending: false })
    .limit(10)

  const plan = subscription?.membership_plans as any

  return (
    <div className="flex-1 space-y-4 pt-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild className="bg-white/5 border-white/10">
          <Link href="/members">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-white">{member.name}</h2>
            <Badge variant="default" className={member.status === 'active' ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}>
              {member.status || "Unknown"}
            </Badge>
          </div>
          <p className="text-sm text-slate-400 font-medium">
            Member ID: {member.member_number || "N/A"} • Registered on {format(new Date(member.created_at), "PPP")}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild className="bg-white/5 border-white/10 text-white cursor-pointer">
            <Link href={`/members/new?edit=${id}`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="bg-white/5 border-white/10">
                <MoreHorizontal className="h-4 w-4 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-900 border-white/10 text-white">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={`/payments/new?memberId=${id}`}>
                  Renew Membership
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Freeze Membership</DropdownMenuItem>
              <DropdownMenuItem>Log Check-in</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="text-red-500">Delete Member</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[280px_1fr]">
        {/* Left Column: Brief Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl shadow-xl p-6 text-center">
            <Avatar className="h-32 w-32 mx-auto mb-4 border-2 border-primary/20 p-1">
              <AvatarImage src="" alt={member.name} />
              <AvatarFallback className="bg-slate-800 text-white text-4xl"><User className="h-12 w-12" /></AvatarFallback>
            </Avatar>
            <h3 className="font-bold text-xl text-white">{member.name}</h3>
            <p className="text-slate-400 text-sm mb-4">{member.phone}</p>
            <div className="pt-4 border-t border-white/10 text-left space-y-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Email</span>
                <span className="text-sm text-white break-all">{member.email || "No email provided"}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Gender</span>
                  <span className="text-sm text-white capitalize">{member.gender || "N/A"}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Blood Group</span>
                  <span className="text-sm text-white">{member.blood_group || "N/A"}</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Emergency Contact</span>
                <span className="text-sm text-white">{member.emergency_contact || "N/A"}</span>
              </div>
              <div>
                 <span className="text-[10px] uppercase font-bold text-slate-500 block">Address</span>
                 <p className="text-sm text-white leading-relaxed line-clamp-3">{member.address || "No address recorded"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Tabs */}
        <div className="space-y-6">
          <Tabs defaultValue="membership" className="w-full">
            <TabsList className="w-full justify-start h-14 rounded-2xl bg-slate-900/50 border border-white/10 p-1 backdrop-blur-xl">
              <TabsTrigger value="membership" className="px-6 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">Membership</TabsTrigger>
              <TabsTrigger value="payments" className="px-6 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">Payments</TabsTrigger>
              <TabsTrigger value="attendance" className="px-6 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">Attendance</TabsTrigger>
              <TabsTrigger value="workouts" className="px-6 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">Workouts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="membership" className="space-y-6 mt-6 animate-fade-in">
              <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-2 rounded-xl bg-blue-500/10"><CalendarDays className="h-5 w-5 text-blue-400" /></div>
                   <h3 className="font-bold text-xl text-white">Subscription Status</h3>
                </div>
                {subscription ? (
                  <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500">Plan Name</span>
                      <p className="font-bold text-white text-lg">{plan?.name || "Standard"}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500">Start Date</span>
                      <p className="font-bold text-white text-lg">{format(new Date(subscription.start_date), "MMM dd, yyyy")}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500">Expiry Date</span>
                      <p className={cn("font-bold text-lg", new Date(subscription.end_date) < new Date() ? "text-red-500" : "text-green-500")}>
                        {format(new Date(subscription.end_date), "MMM dd, yyyy")}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500">Status</span>
                      <div className="flex">
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 capitalize">{subscription.status}</Badge>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10">
                     <p className="text-slate-400 italic">No active subscription found for this member.</p>
                     <Button className="mt-4">Activate Plan</Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="payments" className="mt-6 animate-fade-in">
              <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-2 rounded-xl bg-emerald-500/10"><CreditCard className="h-5 w-5 text-emerald-400" /></div>
                   <h3 className="font-bold text-xl text-white">Payment History</h3>
                </div>
                {payments && payments.length > 0 ? (
                  <div className="space-y-4">
                    {payments.map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                        <div>
                          <p className="font-bold text-white">₹{p.total_amount.toLocaleString()}</p>
                          <p className="text-xs text-slate-400">{format(new Date(p.payment_date), "PPP")} • {p.payment_method}</p>
                        </div>
                        <Badge className={p.status === 'paid' ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-[10px]"}>
                          {p.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 border-2 border-dashed border-slate-700 rounded-2xl">
                    <p className="text-slate-500 text-sm">No payment records found.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="attendance" className="mt-6 animate-fade-in">
              <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-2 rounded-xl bg-blue-500/10"><Activity className="h-5 w-5 text-blue-400" /></div>
                   <h3 className="font-bold text-xl text-white">Recent Attendance Logs</h3>
                </div>
                {attendance && attendance.length > 0 ? (
                   <div className="space-y-4">
                     {attendance.map((a) => (
                       <div key={a.id} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5">
                         <div className="flex items-center gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                            <div>
                               <p className="font-bold text-white">{format(new Date(a.date), "EEEE, MMM dd")}</p>
                               <p className="text-xs text-slate-400">
                                 Check-in: {new Date(a.checkin_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                                 {a.checkout_time && ` • Check-out: ${new Date(a.checkout_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                               </p>
                            </div>
                         </div>
                         <Badge variant="outline" className="text-[10px] text-slate-500 border-white/10 capitalize">{a.checkin_method}</Badge>
                       </div>
                     ))}
                   </div>
                ) : (
                  <div className="text-center py-10 border-2 border-dashed border-slate-700 rounded-2xl">
                    <p className="text-slate-500 text-sm">No attendance records found.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="workouts" className="mt-6 animate-fade-in">
               <div className="text-center py-20 border-2 border-dashed border-slate-700 rounded-2xl bg-slate-900/50">
                   <p className="text-slate-500 text-sm">Workout management coming soon in Phase 4.</p>
               </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
