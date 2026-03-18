import { GalleryVerticalEnd } from "lucide-react"
import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden bg-[#020617]">
      {/* Cinematic Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105 animate-slow-zoom"
        style={{ backgroundImage: 'url("/hero-bg.png")' }}
      >
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]"></div>
      </div>

      {/* Decorative Orbs */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-[120px] animate-pulse delay-700"></div>

      <div className="relative z-10 w-full max-w-lg flex flex-col gap-8 animate-fade-in-up">
        <div className="flex flex-col items-center gap-2 group">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-110 duration-300">
            <GalleryVerticalEnd className="size-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white mt-2">
            Gym<span className="text-blue-500">OS</span>
          </span>
        </div>
        
        <RegisterForm />

        <div className="text-center text-xs text-slate-400">
          Empowering fitness entrepreneurs worldwide.
          <div className="mt-1 flex items-center justify-center gap-4">
            <a href="#" className="hover:text-blue-400 transition-colors">Support</a>
            <span className="text-slate-700">•</span>
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
            <span className="text-slate-700">•</span>
            <a href="#" className="hover:text-blue-400 transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </div>
  )
}
