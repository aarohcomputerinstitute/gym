'use client'

import { useState } from "react"
import { PlusCircle, Sparkles, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { InquiryForm } from "./InquiryForm"

export function LeadCaptureButton() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="h-12 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black shadow-xl shadow-blue-500/20 transition-all flex items-center gap-2 group">
          <UserPlus className="h-4 w-4 transition-transform group-hover:scale-110" />
          Capture New Lead
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-[540px] p-0 bg-slate-950 border-l border-white/10 overflow-y-auto">
        <div className="p-8 space-y-8">
          <SheetHeader className="p-0 space-y-4">
             <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                   <Sparkles className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                   <SheetTitle className="text-2xl font-black text-white tracking-tight">Lead <span className="text-blue-400 italic">Capture</span></SheetTitle>
                   <SheetDescription className="text-slate-400 font-medium">Capture prospect data into your secure growth pipeline.</SheetDescription>
                </div>
             </div>
          </SheetHeader>
          
          <div className="relative">
             <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none rounded-[2.5rem]" />
             <InquiryForm onSuccess={() => setOpen(false)} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
