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
import { MoreHorizontal, UserCheck, PhoneOutgoing, Mail, Calendar, Sparkles, MessageSquare } from "lucide-react"
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
      toast.success(`Pipeline updated to ${status}`)
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
      toast.success(`${member.name} converted successfully!`)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(null)
    }
  }

  const getStatusStyle = (status: InquiryStatus) => {
    switch (status) {
      case 'pending': return 'bg-slate-800/50 text-slate-400 border-slate-700/50'
      case 'visiting': return 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]'
      case 'follow_up': return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      case 'hot': return 'bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.15)] animate-pulse'
      case 'joined': return 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]'
      case 'cancelled': return 'bg-rose-500/10 text-rose-400 border-rose-500/20'
      default: return 'bg-slate-800 text-slate-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Desktop Table View */}
      <div className="hidden md:block rounded-[2rem] border border-white/5 bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="hover:bg-transparent border-white/5">
              <TableHead className="py-6 font-black text-xs uppercase tracking-widest text-slate-500 pl-8">Prospect Identity</TableHead>
              <TableHead className="font-black text-xs uppercase tracking-widest text-slate-500">Intelligence Details</TableHead>
              <TableHead className="font-black text-xs uppercase tracking-widest text-slate-500">Marketing Source</TableHead>
              <TableHead className="font-black text-xs uppercase tracking-widest text-slate-500">Pipeline Status</TableHead>
              <TableHead className="text-right font-black text-xs uppercase tracking-widest text-slate-500 pr-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                   <div className="flex flex-col items-center gap-3">
                      <Sparkles className="h-8 w-8 text-slate-800" />
                      <p className="text-slate-500 font-bold text-sm tracking-tight italic">Your growth pipeline is currently empty.</p>
                   </div>
                </TableCell>
              </TableRow>
            ) : (
              inquiries.map((inquiry) => (
                <TableRow key={inquiry.id} className="hover:bg-white/5 transition-all border-white/5 group">
                  <TableCell className="py-6 pl-8">
                    <div className="flex flex-col">
                      <span className="font-black text-lg text-white tracking-tight group-hover:text-blue-400 transition-colors">{inquiry.name}</span>
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1">Ref: {inquiry.id.slice(0,8)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                       <div className="flex items-center gap-2 text-slate-300 font-bold">
                          <PhoneOutgoing className="h-3 w-3 text-blue-500" />
                          <span className="text-xs">{inquiry.phone}</span>
                       </div>
                       {inquiry.notes && (
                        <div className="flex items-center gap-2 text-slate-500 group-hover:text-slate-400 transition-colors">
                           <MessageSquare className="h-3 w-3" />
                           <span className="text-[10px] font-medium max-w-[180px] truncate">{inquiry.notes}</span>
                        </div>
                       )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-black text-[9px] uppercase tracking-[0.2em] bg-slate-950 border-white/10 text-slate-500 py-1 px-3 rounded-xl">
                      {inquiry.source}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`font-black text-[9px] uppercase tracking-[0.2em] border py-1 px-3 rounded-xl ${getStatusStyle(inquiry.status)}`}>
                      {inquiry.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                     <ActionMenu inquiry={inquiry} loading={loading} onStatusUpdate={handleStatusUpdate} onConvert={handleConvert} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="flex flex-col gap-6 md:hidden">
         {inquiries.length === 0 ? (
           <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-12 text-center text-slate-600 font-black uppercase text-[10px] tracking-widest italic">
              Terminal Data Empty
           </div>
         ) : (
           inquiries.map((inquiry) => (
             <div key={inquiry.id} className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 space-y-6 backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Badge className={`${getStatusStyle(inquiry.status)} border-0 scale-150 origin-top-right`}>{inquiry.status}</Badge>
                </div>

                <div className="flex items-center justify-between">
                   <div className="space-y-1">
                      <h3 className="text-2xl font-black text-white tracking-tighter">{inquiry.name}</h3>
                      <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
                         <PhoneOutgoing className="h-3 w-3" />
                         {inquiry.phone}
                      </div>
                   </div>
                   <ActionMenu inquiry={inquiry} loading={loading} onStatusUpdate={handleStatusUpdate} onConvert={handleConvert} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Marketing</span>
                      <div className="text-xs font-bold text-slate-300">{inquiry.source}</div>
                   </div>
                   <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Pipeline</span>
                      <Badge className={`font-black text-[9px] uppercase tracking-widest border py-0.5 px-2 rounded-lg leading-none ${getStatusStyle(inquiry.status)}`}>
                        {inquiry.status}
                      </Badge>
                   </div>
                </div>

                {inquiry.notes && (
                  <div className="p-4 rounded-2xl bg-slate-950/50 border border-white/5 text-[11px] font-medium text-slate-500 leading-relaxed italic">
                     {inquiry.notes}
                  </div>
                )}
             </div>
           ))
         )}
      </div>
    </div>
  )
}

function ActionMenu({ inquiry, loading, onStatusUpdate, onConvert }: any) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-slate-950 border border-white/5 text-slate-400 hover:text-white hover:border-blue-500/50 transition-all focus:outline-none disabled:opacity-50" disabled={loading === inquiry.id}>
        <MoreHorizontal className="h-5 w-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 rounded-2xl border-white/10 bg-slate-950 text-slate-200 p-2 shadow-2xl backdrop-blur-xl">
        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-600 px-3 py-2">Sales Protocol</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onStatusUpdate(inquiry.id, 'visiting')} className="rounded-xl focus:bg-blue-600 focus:text-white py-3 px-3 font-bold transition-all">
          Mark as Visiting
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusUpdate(inquiry.id, 'follow_up')} className="rounded-xl focus:bg-amber-600 focus:text-white py-3 px-3 font-bold transition-all">
          Schedule Follow-up
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusUpdate(inquiry.id, 'hot')} className="rounded-xl font-black text-orange-400 focus:bg-orange-600 focus:text-white py-3 px-3 transition-all flex items-center justify-between">
          Mark as HOT LEAD 🔥
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem 
          onClick={() => onConvert(inquiry.id)} 
          className="rounded-xl font-black text-green-400 focus:bg-green-600 focus:text-white py-4 px-3 flex items-center gap-3 transition-all"
          disabled={inquiry.status === 'joined'}
        >
          <UserCheck className="h-4 w-4" />
          Convert to Member
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem onClick={() => onStatusUpdate(inquiry.id, 'cancelled')} className="rounded-xl text-slate-500 focus:bg-rose-600 focus:text-white py-3 px-3 font-bold transition-all">
          Abort Pipeline
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
