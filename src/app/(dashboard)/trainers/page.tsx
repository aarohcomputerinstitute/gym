import { Button } from "@/components/ui/button"
import { PlusCircle, Search } from "lucide-react"
import Link from "next/link"
import { TrainerCard, type Trainer } from "@/components/trainers/TrainerCard"
import { Input } from "@/components/ui/input"

const mockTrainers: Trainer[] = [
  {
    id: "t1",
    name: "Alex Cross",
    phone: "+91 9876543220",
    email: "alex@gymerp.com",
    specializations: ["Strength & Conditioning", "HIIT", "Nutrition"],
    experienceYears: 6,
    activeClients: 18,
    maxClients: 20,
    isActive: true,
    joinedDate: "2023-01-10"
  },
  {
    id: "t2",
    name: "Samantha Reed",
    phone: "+91 9876543221",
    email: "sam@gymerp.com",
    specializations: ["Yoga", "Pilates", "Flexibility"],
    experienceYears: 8,
    activeClients: 12,
    maxClients: 15,
    isActive: true,
    joinedDate: "2022-05-15"
  },
  {
    id: "t3",
    name: "David Chen",
    phone: "+91 9876543222",
    email: "david@gymerp.com",
    specializations: ["Powerlifting", "Bodybuilding"],
    experienceYears: 4,
    activeClients: 20,
    maxClients: 20,
    isActive: true,
    joinedDate: "2023-11-01"
  },
  {
    id: "t4",
    name: "Maya Patel",
    phone: "+91 9876543223",
    email: "maya@gymerp.com",
    specializations: ["CrossFit", "Weight Loss", "Rehabilitation"],
    experienceYears: 5,
    activeClients: 8,
    maxClients: 25,
    isActive: true,
    joinedDate: "2024-02-20"
  },
]

export default function TrainersPage() {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 flex-1 space-y-4 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Trainers</h2>
          <p className="text-slate-300">
            Manage your coaching staff and their client assignments
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Trainer
          </Button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 mt-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search trainers..."
            className="pl-8"
          />
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
        {mockTrainers.map((trainer) => (
          <TrainerCard key={trainer.id} trainer={trainer} />
        ))}
      </div>
    </div>
  )
}
