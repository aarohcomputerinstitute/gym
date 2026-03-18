"use client"

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts"

const data = [
  { name: "Jan", total: 125000 },
  { name: "Feb", total: 142000 },
  { name: "Mar", total: 158000 },
  { name: "Apr", total: 185000 },
  { name: "May", total: 162000 },
  { name: "Jun", total: 210000 },
  { name: "Jul", total: 245000 },
]

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
            <stop offset="100%" stopColor="#2563eb" stopOpacity={0.6} />
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
          tickFormatter={(value) => `₹${value / 1000}k`}
        />
        <Tooltip 
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-2xl">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{payload[0].payload.name}</p>
                  <p className="text-lg font-bold text-white italic">₹{payload[0].value?.toLocaleString()}</p>
                </div>
              )
            }
            return null
          }}
          cursor={{ fill: 'rgba(255,255,255,0.03)' }} 
        />
        <Bar
          dataKey="total"
          fill="url(#barGradient)"
          radius={[6, 6, 0, 0]}
          barSize={45}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
