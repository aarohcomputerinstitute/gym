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
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{plan.name}</CardTitle>
          {!plan.isActive && (
            <Badge variant="secondary" className="bg-gray-200 text-gray-700">Inactive</Badge>
          )}
        </div>
        <CardDescription>{plan.durationDays} Days</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-4">
          <span className="text-3xl font-bold">₹{plan.price}</span>
          {plan.registrationFee > 0 && (
            <div className="text-sm text-muted-foreground mt-1">
              + ₹{plan.registrationFee} config fee
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
        <div className="space-y-2">
          {plan.features.map((feature, i) => (
            <div key={i} className="flex items-center text-sm">
              <Check className="mr-2 h-4 w-4 text-green-500" />
              <span>{feature}</span>
            </div>
          ))}
          {plan.maxFreezeDays > 0 && (
            <div className="flex items-center text-sm">
              <Check className="mr-2 h-4 w-4 text-green-500" />
              <span>Up to {plan.maxFreezeDays} freeze days</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline" size="sm" className="w-1/2 mr-2">
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button variant="outline" size="sm" className="w-1/2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}
