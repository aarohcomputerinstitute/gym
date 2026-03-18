import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const mockWorkouts = [
  {
    id: "w1",
    title: "Beginner Full Body",
    goal: "General Fitness",
    level: "Beginner",
    daysPerWeek: 3,
    membersAssigned: 45,
  },
  {
    id: "w2",
    title: "Hypertrophy Push/Pull/Legs",
    goal: "Muscle Gain",
    level: "Intermediate",
    daysPerWeek: 6,
    membersAssigned: 28,
  },
  {
    id: "w3",
    title: "Fat Loss Circuit",
    goal: "Weight Loss",
    level: "All Levels",
    daysPerWeek: 4,
    membersAssigned: 62,
  },
]

export default function WorkoutsPage() {
  return (
    <div className="flex-1 space-y-4 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Workout Plans</h2>
          <p className="text-muted-foreground">
            Manage exercise routines and assign them to members
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Plan
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
        {mockWorkouts.map((workout) => (
          <Card key={workout.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{workout.title}</CardTitle>
                <Badge variant="outline">{workout.level}</Badge>
              </div>
              <CardDescription>{workout.goal}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Frequency</span>
                  <span className="font-medium">{workout.daysPerWeek} Days/Week</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Assigned Members</span>
                  <span className="font-medium">{workout.membersAssigned} Active</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" className="w-[48%]">View Details</Button>
              <Button variant="default" className="w-[48%]">Assign</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
