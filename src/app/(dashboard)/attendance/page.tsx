import { AttendanceTable } from "@/components/attendance/AttendanceTable"
import { ManualCheckIn } from "@/components/attendance/ManualCheckIn"

export default function AttendancePage() {
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
          {/* We could put quick stats here */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="text-sm font-medium text-muted-foreground">Currently in Gym</div>
              <div className="text-2xl font-bold mt-2">42</div>
            </div>
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="text-sm font-medium text-muted-foreground">Total Today</div>
              <div className="text-2xl font-bold mt-2">156</div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 mt-6">
        <h3 className="font-semibold text-lg mb-2">Today's Log</h3>
        <AttendanceTable />
      </div>
    </div>
  )
}
