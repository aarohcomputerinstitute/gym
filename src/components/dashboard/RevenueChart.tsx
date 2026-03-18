"use client"

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

const data = [
  { name: "Jan", total: Math.floor(Math.random() * 50000) + 100000 },
  { name: "Feb", total: Math.floor(Math.random() * 50000) + 120000 },
  { name: "Mar", total: Math.floor(Math.random() * 50000) + 150000 },
  { name: "Apr", total: Math.floor(Math.random() * 50000) + 170000 },
  { name: "May", total: Math.floor(Math.random() * 50000) + 140000 },
  { name: "Jun", total: Math.floor(Math.random() * 50000) + 190000 },
  { name: "Jul", total: Math.floor(Math.random() * 50000) + 210000 },
  { name: "Aug", total: Math.floor(Math.random() * 50000) + 240000 },
  { name: "Sep", total: Math.floor(Math.random() * 50000) + 200000 },
  { name: "Oct", total: Math.floor(Math.random() * 50000) + 220000 },
  { name: "Nov", total: Math.floor(Math.random() * 50000) + 250000 },
  { name: "Dec", total: Math.floor(Math.random() * 50000) + 280000 },
]

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
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
          tickFormatter={(value) => `₹${value}`}
        />
        <Tooltip cursor={{fill: 'transparent'}} />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
