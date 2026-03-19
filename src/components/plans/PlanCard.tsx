import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Edit, Trash2 } from "lucide-react"

export interface Plan {
  id: string
  name: string
  durationDays: number
  price: number
  registrationFee: number
  description: string
  features: string[]
  maxFreezeDays: number
  isActive: boolean
}

interface PlanCardProps {
  plan: Plan
}

export function PlanCard({ plan }: PlanCardProps) {
  return (
    <Card className="flex flex-col h-full bg-slate-900/50 border-white/10 backdrop-blur-xl shadow-xl rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 group relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <CardHeader className="pb-4 border-b border-white/5 relative z-10">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-xl font-bold text-white tracking-tight">{plan.name}</CardTitle>
          {!plan.isActive ? (
            <Badge variant="secondary" className="bg-red-500/10 text-red-400 border-red-500/20 text-[10px] font-bold uppercase">Inactive</Badge>
          ) : (
            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px] font-bold uppercase tracking-tighter shadow-sm shadow-blue-500/20">Active Plan</Badge>
          )}
        </div>
        <CardDescription className="text-slate-400 font-medium flex items-center gap-1.5 text-xs uppercase tracking-widest">
          <Check className="h-3 w-3 text-blue-500" />
          {plan.durationDays} Days Validity
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pt-6 space-y-6 relative z-10">
        <div className="space-y-1">
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold text-slate-500">₹</span>
            <span className="text-4xl font-extrabold text-white tracking-tighter">{plan.price.toLocaleString()}</span>
          </div>
          {plan.registrationFee > 0 && (
            <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1 uppercase tracking-tight">
              + ₹{plan.registrationFee} Registration Fee
            </div>
          )}
        </div>
        
        {plan.description && (
          <p className="text-sm text-slate-300 leading-relaxed font-medium bg-white/5 p-3 rounded-xl border border-white/5 italic">
            "{plan.description}"
          </p>
        )}

        <div className="space-y-3">
          {plan.features.map((feature, i) => (
            <div key={i} className="flex items-start text-sm group/feat">
              <div className="p-0.5 rounded-full bg-blue-500/10 mr-3 mt-0.5 group-hover/feat:bg-blue-500/20 transition-colors">
                 <Check className="h-3 w-3 text-blue-400" />
              </div>
              <span className="text-slate-400 group-hover/feat:text-white transition-colors">{feature}</span>
            </div>
          ))}
          {plan.maxFreezeDays > 0 && (
            <div className="flex items-start text-sm">
               <div className="p-0.5 rounded-full bg-blue-500/10 mr-3 mt-0.5">
                 <Check className="h-3 w-3 text-blue-400" />
               </div>
               <span className="text-slate-400 italic">Up to {plan.maxFreezeDays} freeze days included</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-3 border-t border-white/5 pt-6 bg-white/5">
        <Button variant="outline" size="sm" className="flex-1 bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl h-10 transition-all font-bold text-xs uppercase tracking-tight">
          <Edit className="mr-2 h-3.5 w-3.5" />
          Edit Plan
        </Button>
        <Button variant="outline" size="sm" className="bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-xl h-10 transition-all px-3">
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    </Card>
  )
}
