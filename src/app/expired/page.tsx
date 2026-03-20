import { LockKeyhole, ArrowRight, CreditCard, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function ExpiredPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Fetch gym data
  const { data: userData } = await supabase
    .from('users')
    .select('gym_id, role')
    .eq('id', user.id)
    .single()

  // If superadmin or no gym, they shouldn't be here
  if (!userData?.gym_id || userData.role === 'super_admin') redirect("/dashboard")

  const { data: gymData } = await supabase
    .from('gyms')
    .select('status, trial_ends_at, selected_plan')
    .eq('id', userData.gym_id)
    .single()

  // If they are active, let them back in
  if (gymData?.status === 'active') {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20 filter grayscale" style={{ backgroundImage: 'url("/hero-bg.png")' }}></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/80 to-transparent z-0"></div>
      
      {/* Decorative Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>

      <div className="relative z-10 max-w-2xl w-full text-center space-y-8 animate-fade-in-up">
        
        <div className="mx-auto w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 mb-8 shadow-[0_0_50px_rgba(239,68,68,0.2)] text-red-400">
          <LockKeyhole className="w-10 h-10" />
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Your 14-Day Free Trial Has <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Expired</span>
        </h1>
        
        <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
          We hope you loved using GymOS to manage your fitness center. To regain access to your dashboard, members, and data, please choose a plan and upgrade your account.
        </p>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-md mx-auto text-left space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-400" />
            Ready to scale?
          </h3>
          
          <ul className="space-y-4 text-slate-300">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
              <span>Unlimited Members & Billing</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
              <span>Advanced Analytics Dashboard</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
              <span>Automated WhatsApp Reminders</span>
            </li>
          </ul>

          <Link 
            href="/settings/billing" 
            className="group flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold h-12 rounded-xl shadow-[0_0_40px_rgba(37,99,235,0.3)] transition-all active:scale-[0.98]"
          >
            Upgrade Now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-xs text-center text-slate-500">Your data is safe and will be instantly restored upon payment.</p>
        </div>
        
        <div className="pt-8">
          <form action={async () => {
             "use server"
             const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
             const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
             const { createServerClient } = await import("@supabase/ssr")
             const { cookies } = await import("next/headers")
             const cookieStore = await cookies()
             const supabase = createServerClient(supabaseUrl, supabaseKey, {
               cookies: {
                 get(name) { return cookieStore.get(name)?.value },
                 set(name, value, options) { cookieStore.set(name, value, options) },
                 remove(name, options) { cookieStore.set(name, "", { ...options, maxAge: 0 }) },
               }
             })
             await supabase.auth.signOut()
             redirect("/login")
          }}>
            <button type="submit" className="text-sm text-slate-500 hover:text-white transition-colors underline underline-offset-4">
              Logout
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
