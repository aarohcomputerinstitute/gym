"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, UserCheck } from "lucide-react"

export function ManualCheckIn() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manual Check-in</CardTitle>
        <CardDescription>
          Search by member name, phone, or ID to quickly log attendance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search member..."
              className="pl-8"
            />
          </div>
          <Button>
            <UserCheck className="mr-2 h-4 w-4" />
            Check In
          </Button>
        </div>
        
        {/* Placeholder for search results */}
        <div className="mt-4 border rounded-md p-4 hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-slate-100 rounded-full"></div>
              <div>
                <p className="font-medium text-sm">John Doe</p>
                <p className="text-xs text-muted-foreground">Active • Pro Plan</p>
              </div>
            </div>
            <Button size="sm" variant="secondary">Select</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
