import { MailCheck } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function VerifyEmailPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden bg-[#020617]">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: 'url("/hero-bg.png")' }}
      >
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        <Card className="border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
              <MailCheck className="h-6 w-6 text-blue-400" />
            </div>
            <CardTitle className="text-2xl text-white">Check your email</CardTitle>
            <CardDescription className="text-slate-400">
              We've sent a confirmation link to your inbox. Please verify your email to activate your gym.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pb-8">
            <p className="text-sm text-slate-500">
              Didn't receive the email? Check your spam folder or try signing up again.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
