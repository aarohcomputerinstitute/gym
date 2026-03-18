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
import { Edit, Mail, Phone, Eye, Calendar } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export interface Trainer {
  id: string
  name: string
  phone: string
  email: string
  specializations: string[]
  experienceYears: number
  activeClients: number
  maxClients: number
  isActive: boolean
  joinedDate: string
}

interface TrainerCardProps {
  trainer: Trainer
}

export function TrainerCard({ trainer }: TrainerCardProps) {
  const atCapacity = trainer.activeClients >= trainer.maxClients;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
        <Avatar className="h-14 w-14 border">
          <AvatarImage src={`/avatars/${trainer.id}.png`} alt={trainer.name} />
          <AvatarFallback className="text-lg bg-primary/10 text-primary">
            {trainer.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{trainer.name}</CardTitle>
            {!trainer.isActive && (
              <Badge variant="secondary" className="bg-gray-200 text-gray-700">Offline</Badge>
            )}
          </div>
          <CardDescription className="text-xs">
            {trainer.experienceYears} Years Experience
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5" />
            <span>{trainer.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5" />
            <span className="truncate">{trainer.email}</span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Specializations</h4>
          <div className="flex flex-wrap gap-1.5">
            {trainer.specializations.map((spec, i) => (
              <Badge key={i} variant="secondary" className="font-normal text-xs bg-muted">
                {spec}
              </Badge>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex justify-between items-center text-sm mb-1">
            <span className="text-muted-foreground">Client Load</span>
            <span className={atCapacity ? "text-red-500 font-medium" : "font-medium"}>
              {trainer.activeClients} / {trainer.maxClients}
            </span>
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div 
              className={`h-full ${atCapacity ? 'bg-red-500' : 'bg-primary'}`} 
              style={{ width: `${(trainer.activeClients / trainer.maxClients) * 100}%` }}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t border-muted/50 pt-4 bg-muted/20">
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          <Eye className="mr-2 h-4 w-4" />
          View
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          <Calendar className="mr-2 h-4 w-4" />
          Schedule
        </Button>
      </CardFooter>
    </Card>
  )
}
