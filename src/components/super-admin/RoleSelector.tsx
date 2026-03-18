"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { updateRole } from "@/app/(auth)/actions/index"

interface RoleSelectorProps {
  userId: string
  initialRole: string
}

export function RoleSelector({ userId, initialRole }: RoleSelectorProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)

  const handleChange = async (newRole: string | null) => {
    if (!newRole || isLoading) return
    setIsLoading(true)
    try {
      await updateRole(userId, newRole)
      router.refresh()
    } catch (err) {
      alert("Failed to update role")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Select 
      defaultValue={initialRole} 
      onValueChange={handleChange}
      disabled={isLoading}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Select role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="super_admin">Super Admin</SelectItem>
        <SelectItem value="owner">Gym Owner</SelectItem>
        <SelectItem value="manager">Manager</SelectItem>
        <SelectItem value="receptionist">Receptionist</SelectItem>
        <SelectItem value="trainer">Trainer</SelectItem>
      </SelectContent>
    </Select>
  )
}
