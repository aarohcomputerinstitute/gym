"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, Search, Loader2 } from "lucide-react"
import { TrainerCard, type Trainer } from "@/components/trainers/TrainerCard"
import { Input } from "@/components/ui/input"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { createTrainerAction, getTrainersAction } from "@/app/actions/trainer"
import { toast } from "sonner"

export default function TrainersPage() {
  const [trainers, setTrainers] = React.useState<Trainer[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const fetchTrainers = React.useCallback(async () => {
    try {
      const data = await getTrainersAction()
      // Map DB field names to component interface names if different
      const formatted: Trainer[] = (data as any[]).map(t => ({
        id: t.id,
        name: t.name,
        phone: t.phone,
        email: t.email || "",
        specializations: t.specializations || [],
        experienceYears: t.experience_years || 0,
        activeClients: t.active_clients || 0,
        maxClients: t.max_clients || 20,
        isActive: t.is_active,
        joinedDate: t.joined_date
      }))
      setTrainers(formatted)
    } catch (error) {
      console.error("Failed to fetch trainers:", error)
      toast.error("Failed to load trainers")
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchTrainers()
  }, [fetchTrainers])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const data = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      experienceYears: parseInt(formData.get("experience") as string) || 0,
      specializations: (formData.get("specializations") as string)?.split(",").map(s => s.trim()).filter(Boolean) || [],
    }

    try {
      const result = await createTrainerAction(data)
      if (result.success) {
        toast.success("Trainer added successfully!")
        setIsDialogOpen(false)
        fetchTrainers()
      } else {
        toast.error(result.error || "Failed to add trainer")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredTrainers = trainers.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.specializations.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  )

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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Trainer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-800 text-white">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Add New Trainer</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Enter the details of the new coaching staff member.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name*</Label>
                    <Input id="name" name="name" required className="col-span-3 bg-slate-800 border-slate-700" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">Phone*</Label>
                    <Input id="phone" name="phone" required className="col-span-3 bg-slate-800 border-slate-700" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">Email</Label>
                    <Input id="email" name="email" type="email" className="col-span-3 bg-slate-800 border-slate-700" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="experience" className="text-right">Exp (Yrs)</Label>
                    <Input id="experience" name="experience" type="number" className="col-span-3 bg-slate-800 border-slate-700" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="specializations" className="text-right">Specialties</Label>
                    <Input id="specializations" name="specializations" placeholder="Separated by commas" className="col-span-3 bg-slate-800 border-slate-700" title="e.g. Yoga, Strength, HIIT" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Trainer
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 mt-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search trainers..."
            className="pl-8 bg-slate-800 border-slate-700 text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : filteredTrainers.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
          {filteredTrainers.map((trainer) => (
            <TrainerCard key={trainer.id} trainer={trainer} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
          <p className="text-slate-400">No trainers found. Add your first trainer to get started!</p>
        </div>
      )}
    </div>
  )
}
