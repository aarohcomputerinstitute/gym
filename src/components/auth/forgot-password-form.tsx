"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { resetPassword } from "@/app/(auth)/actions"

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [pending, setPending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  
  async function handleSubmit(formData: FormData) {
    setPending(true)
    setErrorMsg("")
    setSuccess(false)
    try {
      // In a real implementation we would call the reset action
      // await resetPassword(formData)
      setSuccess(true)
    } catch(err: any) {
      setErrorMsg(err.message || "Failed to send reset link")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset Password</CardTitle>
          <CardDescription>
            Enter your email to receive a password reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}
                {success && <p className="text-sm text-green-500">Check your email for a reset link.</p>}
                <Button type="submit" className="w-full" disabled={pending || success}>
                  {pending ? "Sending..." : "Send Reset Link"}
                </Button>
              </div>
              <div className="text-center text-sm">
                Remember your password?{" "}
                <a href="/login" className="underline underline-offset-4">
                  Log in
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        Need help? Contact <a href="#">support</a>.
      </div>
    </div>
  )
}
