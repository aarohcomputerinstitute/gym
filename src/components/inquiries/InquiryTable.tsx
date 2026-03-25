'use client'

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, UserCheck, PhoneOutgoing, Mail, Calendar, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { updateInquiryStatusAction, convertToMemberAction, type InquiryStatus } from "@/app/actions/inquiry"
import { toast } from "sonner"

interface Inquiry {
  id: string
  name: string
  phone: string
  email: string | null
  source: string
  status: InquiryStatus
  created_at: string
  notes: string | null
}

interface InquiryTableProps {
  inquiries: Inquiry[]
}

export function InquiryTable({ inquiries }: InquiryTableProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleStatusUpdate = async (id: string, status: InquiryStatus) => {
    try {
      setLoading(id)
      await updateInquiryStatusAction(id, status)
      toast.success(`Status updated to ${status}`)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(null)
    }
  }

  const handleConvert = async (id: string) => {
    try {
      setLoading(id)
      const member = await convertToMemberAction(id)
      toast.success(`${member.name} is now a gym member!`)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(null)
    }
  }

  const getStatusColor = (status: InquiryStatus) => {
    switch (status) {
      case 'pending': return 'bg-slate-100 text-slate-700 border-slate-200'
      case 'visiting': return 'bg-blue-50 text-blue-700 border-blue-100'
      case 'follow_up': return 'bg-amber-50 text-amber-700 border-amber-100'
      case 'hot': return 'bg-orange-50 text-orange-700 border-orange-100 animate-pulse'
      case 'joined': return 'bg-green-50 text-green-700 border-green-100'
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-100'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow className="hover:bg-transparent border-slate-100">
            <TableHead className="py-4 font-bold text-slate-900">Lead Name</TableHead>
            <TableHead className="font-bold text-slate-900">Contact</TableHead>
            <TableHead className="font-bold text-slate-900">Source</TableHead>
            <TableHead className="font-bold text-slate-900">Status</TableHead>
            <TableHead className="font-bold text-slate-900">Registered</TableHead>
            <TableHead className="text-right font-bold text-slate-900 pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inquiries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center text-slate-400 font-medium">
                No inquiries found matching your criteria.
              </TableCell>
            </TableRow>
          ) : (
            inquiries.map((inquiry) => (
              <TableRow key={inquiry.id} className="hover:bg-slate-50/50 transition-colors border-slate-100">
                <TableCell className="py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900">{inquiry.name}</span>
                    {inquiry.notes && <span className="text-[11px] text-slate-400 italic truncate max-w-[200px]">{inquiry.notes}</span>}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <PhoneOutgoing className="h-3 w-3 text-slate-400" />
                      <span className="text-xs">{inquiry.phone}</span>
                    </div>
                    {inquiry.email && (
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Mail className="h-3 w-3" />
                        <span className="text-[10px]">{inquiry.email}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-bold text-[10px] uppercase tracking-wider bg-slate-50 border-slate-200 text-slate-600">
                    {inquiry.source}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={`font-black text-[10px] uppercase tracking-[0.1em] border ${getStatusColor(inquiry.status)}`}>
                    {inquiry.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-500 font-medium text-xs">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3 text-slate-300" />
                    {format(new Date(inquiry.created_at), 'MMM dd, yyyy')}
                  </div>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none disabled:opacity-50" disabled={loading === inquiry.id}>
                      <MoreHorizontal className="h-4 w-4 text-slate-400" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-xl border-slate-200 p-2 shadow-xl">
                      <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1.5">Lead Pipeline</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleStatusUpdate(inquiry.id, 'visiting')} className="rounded-lg focus:bg-blue-50 focus:text-blue-700">
                        Mark as Visiting
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusUpdate(inquiry.id, 'follow_up')} className="rounded-lg focus:bg-amber-50 focus:text-amber-700">
                        Needs Follow-up
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusUpdate(inquiry.id, 'hot')} className="rounded-lg font-bold focus:bg-orange-50 focus:text-orange-700">
                        Mark as Hot Lead 🔥
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-slate-100" />
                      <DropdownMenuItem 
                        onClick={() => handleConvert(inquiry.id)} 
                        className="rounded-lg font-black text-green-600 focus:bg-green-50 focus:text-green-700 flex items-center gap-2"
                        disabled={inquiry.status === 'joined'}
                      >
                        <UserCheck className="h-4 w-4" />
                        Convert to Member
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-slate-100" />
                      <DropdownMenuItem onClick={() => handleStatusUpdate(inquiry.id, 'cancelled')} className="rounded-lg text-red-600 focus:bg-red-50 focus:text-red-700">
                        Mark as Abandoned
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
