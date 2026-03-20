import { createClient } from "@/lib/supabase/server"
import { AlertCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export async function TrialBanner() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Get user's gym
  const { data: userData } = await supabase
    .from('users')
    .select('gym_id, role')
    .eq('id', user.id)
    .single()

  if (!userData?.gym_id || userData.role === 'super_admin') return null

  // Get gym's trial status
  const { data: gymData } = await supabase
    .from('gyms')
    .select('status, trial_ends_at')
    .eq('id', userData.gym_id)
    .single()

  if (gymData?.status !== 'trial' || !gymData?.trial_ends_at) return null

  const endsAt = new Date(gymData.trial_ends_at)
  const now = new Date()
  
  // If expired, proxy.ts handles the redirect so we don't strictly need to handle it here, 
  // but just in case, don't show the banner if < 0 days.
  const diffTime = endsAt.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return null

  return (
    <div className="bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-blue-600/20 border-b border-blue-500/20 px-4 py-3 flex items-center justify-center relative overflow-hidden group">
      <div className="absolute inset-0 bg-blue-500/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
      <div className="relative z-10 flex items-center gap-3 text-sm md:text-base">
        <AlertCircle className="w-5 h-5 text-blue-400 animate-pulse" />
        <span className="text-slate-200">
          You have <strong className="text-white font-bold">{diffDays} days left</strong> in your Free Trial.
        </span>
        <Link 
          href="/settings/billing" 
          className="ml-2 flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold transition-colors border border-white/10"
        >
          Upgrade Now
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )
}
