'use client'

import { useState } from "react"
import { UserPlus, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { InquiryForm } from "./InquiryForm"

export function LeadCaptureButton() {
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    console.log("Button clicked, setting open to true")
    setOpen(true)
  }

  return (
    <>
      <Button 
        type="button"
        onMouseDown={handleOpen} // Try MouseDown for faster response
        onClick={handleOpen}
        className="h-12 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black shadow-xl shadow-blue-500/20 transition-all flex items-center gap-2 group relative z-[150] cursor-pointer pointer-events-auto active:scale-95"
      >
        <UserPlus className="h-4 w-4 transition-transform group-hover:scale-110" />
        Capture New Lead
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent 
          side="full" 
          className="p-0 bg-slate-950 overflow-y-auto"
        >
          <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12">
            <div className="w-full max-w-2xl space-y-10 animate-in fade-in zoom-in-95 duration-500">
              <SheetHeader className="p-0 space-y-6 text-center flex flex-col items-center">
                 <div className="h-20 w-20 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-2xl shadow-blue-500/10">
                    <Sparkles className="h-10 w-10 text-blue-400" />
                 </div>
                 <div className="space-y-2">
                    <SheetTitle className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none">
                       Lead <span className="text-blue-400 italic">Capture</span>
                    </SheetTitle>
                    <SheetDescription className="text-slate-400 font-medium text-lg">
                       Capture prospect data into your secure growth pipeline.
                    </SheetDescription>
                 </div>
              </SheetHeader>
              
              <div className="relative bg-slate-900/40 border border-white/5 p-8 md:p-10 rounded-[2.5rem] backdrop-blur-xl shadow-2xl">
                 <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none rounded-[2.5rem]" />
                 <InquiryForm onSuccess={() => setOpen(false)} />
              </div>

              <div className="flex justify-center">
                <Button 
                  variant="ghost" 
                  onClick={() => setOpen(false)}
                  className="text-slate-500 hover:text-white font-bold uppercase tracking-widest text-[10px]"
                >
                  Cancel and Return to Terminal
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
