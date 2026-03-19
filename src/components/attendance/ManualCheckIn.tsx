"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, UserCheck, Loader2, X } from "lucide-react"
import { searchMembersAction, checkInMemberAction } from "@/app/actions/attendance"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

export function ManualCheckIn() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSearch = async (val: string) => {
    setQuery(val)
    if (val.length < 2) {
      setResults([])
      return
    }

    setIsSearching(true)
    try {
      const data = await searchMembersAction(val)
      setResults(data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleCheckIn = (memberId: string, memberName: string) => {
    startTransition(async () => {
      try {
        await checkInMemberAction(memberId)
        toast.success(`${memberName} checked in successfully!`)
        setQuery("")
        setResults([])
      } catch (error: any) {
        toast.error(error.message || "Failed to check in")
      }
    })
  }

  return (
    <Card className="border-white/10 bg-slate-900/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
           <UserCheck className="h-5 w-5 text-primary" />
           Manual Check-in
        </CardTitle>
        <CardDescription className="text-slate-400">
          Search by name, phone, or ID
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
          <Input
            type="search"
            placeholder="Start typing..."
            className="pl-10 bg-white/5 border-white/10 text-white"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {isSearching && <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-primary" />}
        </div>
        
        {results.length > 0 && (
          <div className="mt-4 border border-white/10 rounded-xl overflow-hidden bg-slate-950/50">
            {results.map((member) => (
              <div 
                key={member.id} 
                className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
              >
                <div className="flex flex-col">
                  <p className="font-bold text-sm text-white">{member.name}</p>
                  <p className="text-[10px] text-slate-500">{member.member_number} • {member.phone}</p>
                </div>
                <Button 
                  size="sm" 
                  disabled={isPending}
                  onClick={() => handleCheckIn(member.id, member.name)}
                  className="bg-primary hover:bg-primary/90 text-white h-8 px-3 text-xs"
                >
                  {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Check In"}
                </Button>
              </div>
            ))}
          </div>
        )}

        {query.length >= 2 && results.length === 0 && !isSearching && (
          <div className="text-center py-4 text-slate-500 text-xs italic">
            No matching members found.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
