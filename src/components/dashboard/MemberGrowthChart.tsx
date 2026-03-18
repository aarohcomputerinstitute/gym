"use client"

import {
  Line,
  LineChart,
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
      <LineChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="active"
          strokeWidth={2}
          activeDot={{
            r: 6,
          }}
          className="stroke-primary"
        />
        <Line
          type="monotone"
          dataKey="new"
          strokeWidth={2}
          className="stroke-muted-foreground"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
