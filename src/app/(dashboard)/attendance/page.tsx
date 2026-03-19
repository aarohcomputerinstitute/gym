import { AttendanceTable, type AttendanceRecord } from "@/components/attendance/AttendanceTable"
import { ManualCheckIn } from "@/components/attendance/ManualCheckIn"
import { createClient } from "@/lib/supabase/server"

export default async function AttendancePage() {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  // 1. Fetch attendance records for today (with member names)
  const { data: rawAttendance } = await supabase
    .from('attendance')
    .select(`
      id,
      member_id,
      date,
      checkin_time,
      checkout_time,
      checkin_method,
      members (
        name,
        member_number
      )
    `)
    .eq('date', today)
    .order('checkin_time', { ascending: false })

  // 2. Calculate Stats
  const totalToday = rawAttendance?.length || 0
  const currentlyInGym = rawAttendance?.filter(a => !a.checkout_time).length || 0

  const formattedAttendance: AttendanceRecord[] = (rawAttendance || []).map((a: any) => ({
    id: a.id,
    memberName: a.members?.name || "Unknown Member",
    memberId: a.members?.member_number || "N/A",
    date: a.date === today ? "Today" : a.date,
    checkInTime: new Date(a.checkin_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    checkOutTime: a.checkout_time ? new Date(a.checkout_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
    method: a.checkin_method as any,
    duration: a.checkout_time ? "Calculating..." : null, // Future: interval calc
  }))

  return (
    <div className="flex-1 space-y-4 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Attendance</h2>
          <p className="text-slate-300">
            Monitor gym traffic and member check-ins
          </p>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-1">
          <ManualCheckIn />
        </div>
        <div className="md:col-span-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="text-sm font-medium text-muted-foreground">Currently in Gym</div>
              <div className="text-2xl font-bold mt-2 text-white">{currentlyInGym}</div>
            </div>
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="text-sm font-medium text-muted-foreground">Total Today</div>
              <div className="text-2xl font-bold mt-2 text-white">{totalToday}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 mt-6">
        <h3 className="font-semibold text-lg mb-2 text-white">Today's Log</h3>
        <AttendanceTable data={formattedAttendance} />
      </div>
    </div>
  )
}
