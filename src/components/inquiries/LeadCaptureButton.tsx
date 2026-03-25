'use client'

import { useState, useEffect } from "react"
import { UserPlus } from "lucide-react"
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

  // Debugging log
  useEffect(() => {
    console.log("LeadCaptureButton state:", { open })
  }, [open])

  return (
    <div className="relative z-[200]">
      <Sheet open={open} onOpenChange={(val) => {
        console.log("Sheet onOpenChange:", val)
        setOpen(val)
      }}>
        <SheetTrigger asChild>
          <Button 
            onClick={() => console.log("Capture Lead Button Clicked")}
            className="h-12 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black shadow-xl shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Capture New Lead
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[350px] sm:w-[540px] p-0 bg-slate-950 border-white/10 overflow-y-auto">
          <div className="p-8 space-y-8">
            <SheetHeader className="p-0">
               <SheetTitle className="text-2xl font-black text-white">Capture Lead</SheetTitle>
               <SheetDescription className="text-slate-400 font-medium">Capture prospect data into your secure growth pipeline.</SheetDescription>
            </SheetHeader>
            <InquiryForm onSuccess={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
