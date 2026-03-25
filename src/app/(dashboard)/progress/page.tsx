"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

const mockMeasurementData = [
  { date: "Jan", weight: 82, bodyFat: 22 },
  { date: "Feb", weight: 80.5, bodyFat: 21.2 },
  { date: "Mar", weight: 79, bodyFat: 20.5 },
  { date: "Apr", weight: 78, bodyFat: 19.8 },
  { date: "May", weight: 77.2, bodyFat: 19.1 },
  { date: "Jun", weight: 76.5, bodyFat: 18.5 },
]

export default function ProgressPage() {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 flex-1 space-y-4 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Progress Tracking</h2>
          <p className="text-slate-300">
            Log and visualize member body measurements over time
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Log Measurement
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3 mt-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Member Search</CardTitle>
              <CardDescription>Select a member to view their progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search member..."
                  className="pl-8"
                  defaultValue="John Doe"
                />
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-sm py-2 border-b">
                  <span className="text-muted-foreground">Current Weight</span>
                  <span className="font-bold">76.5 kg</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b">
                  <span className="text-muted-foreground">Body Fat %</span>
                  <span className="font-bold">18.5%</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b">
                  <span className="text-muted-foreground">Latest Update</span>
                  <span className="font-bold">June 15, 2024</span>
                </div>
              </div>
              <Button className="w-full mt-6" variant="outline">View Full Measurement Log</Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weight Progression (kg)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockMeasurementData}>
                    <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                    <Tooltip />
                    <Line type="monotone" dataKey="weight" strokeWidth={2} className="stroke-primary" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Body Fat Percentage (%)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockMeasurementData}>
                    <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                    <Tooltip />
                    <Line type="monotone" dataKey="bodyFat" strokeWidth={2} stroke="#f97316" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
