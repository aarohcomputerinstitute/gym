"use client"

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const data = [
  { name: "Jan", active: 200, new: 40 },
  { name: "Feb", active: 230, new: 50 },
  { name: "Mar", active: 250, new: 35 },
  { name: "Apr", active: 290, new: 60 },
  { name: "May", active: 310, new: 45 },
  { name: "Jun", active: 340, new: 55 },
  { name: "Jul", active: 380, new: 70 },
]

export function MemberGrowthChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="name"
          stroke="#475569"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          dy={10}
        />
        <YAxis
          stroke="#475569"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip 
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-2xl space-y-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{payload[0].payload.name}</p>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-blue-400">Active: {payload[0].value}</p>
                    <p className="text-sm font-bold text-slate-400">New: {payload[1].value}</p>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Area
          type="monotone"
          dataKey="active"
          stroke="#3b82f6"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorActive)"
        />
        <Area
          type="monotone"
          dataKey="new"
          stroke="#94a3b8"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorNew)"
          strokeDasharray="5 5"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
