"use client"

import { useState } from "react";
import Link from "next/link";
import { 
  Dumbbell, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight,
  LayoutDashboard,
  CreditCard,
  MessageSquare,
  Menu,
  X,
  CheckCircle2,
  CalendarDays,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("annually");

  const plans = [
    {
      tier: "Silver",
      monthlyPrice: "2,499",
      annualPrice: "1,999",
      members: "200 Members",
      features: ["Up to 200 Members", "Basic Analytics", "Email Support", "Professional Auto-Logout", "Standard Billing"],
    },
    {
      tier: "Gold",
      monthlyPrice: "5,499",
      annualPrice: "4,499",
      members: "1,000 Members",
      popular: true,
      features: ["Up to 1,000 Members", "Advanced Dashboard", "Priority Support", "Custom Branding", "Staff Management", "Real-time Platform MRR"],
    },
    {
      tier: "Diamond",
      monthlyPrice: "12,499",
      annualPrice: "9,999",
      members: "Unlimited Members",
      features: ["Unlimited Members", "Multi-location Support", "Dedicated Account Manager", "Full API Access", "White-label Option", "Premium Security Suite"],
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-indigo-500/30 selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-orange-600 flex items-center justify-center shadow-[0_0_20px_rgba(234,88,12,0.4)]">
              <Dumbbell className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">GymOS</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors uppercase tracking-widest text-xs">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors uppercase tracking-widest text-xs">Pricing</a>
            <a href="#about" className="hover:text-white transition-colors uppercase tracking-widest text-xs">About</a>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" asChild className="text-slate-300 hover:text-white hover:bg-white/10">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="bg-white text-black hover:bg-slate-200 shadow-[0_0_20px_rgba(255,255,255,0.2)] rounded-full px-6 transition-all active:scale-95">
              <Link href="/register">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-slate-300 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-black/95 backdrop-blur-3xl border-b border-white/10 p-6 flex flex-col gap-6 shadow-2xl animate-in slide-in-from-top-2">
            <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-slate-300 hover:text-white">Features</a>
            <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-slate-300 hover:text-white">Pricing</a>
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-slate-300 hover:text-white">About</a>
            <div className="h-px w-full bg-white/10 my-2" />
            <Button variant="outline" asChild className="w-full border-white/20 text-white bg-transparent">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
            </Button>
            <Button asChild className="w-full bg-orange-600 text-white hover:bg-orange-700">
              <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>Get Started Free</Link>
            </Button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-600/20 rounded-full blur-[120px] animate-pulse pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-sm font-medium text-orange-300 mb-8 animate-fade-in shadow-[0_0_15px_rgba(234,88,12,0.2)]">
              <span className="flex h-2 w-2 rounded-full bg-orange-400 animate-ping" />
              The #1 Choice for Indian Fitness Centers in 2026
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
              The OS for Bharat's <br className="hidden md:block" /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500">
                Gym Empires.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Automate your billing, track members, and grow your fitness business with the most powerful management platform built for speed and security.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="h-14 px-8 text-lg bg-white text-black hover:bg-slate-200 group rounded-full w-full sm:w-auto shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                <Link href="/register">
                  Start Your 14-Day Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-14 px-8 text-lg border-white/20 hover:bg-white/10 text-white bg-transparent rounded-full w-full sm:w-auto backdrop-blur-sm">
                <Link href="#features">See How It Works</Link>
              </Button>
            </div>
          </div>

          <div className="mt-24 relative px-4 max-w-5xl mx-auto lg:h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-20" />
            <div className="relative z-10 mx-auto w-full md:w-3/4 rounded-2xl overflow-hidden border border-white/10 bg-slate-950/80 backdrop-blur-xl shadow-2xl transition-transform duration-700 hover:scale-[1.02]">
              <div className="h-12 border-b border-white/10 flex items-center px-4 bg-white/[0.02]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
              </div>
              <div className="p-6 md:p-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="col-span-2 lg:col-span-4 flex items-center justify-between mb-4">
                  <div className="text-xl font-bold text-white">Live Dashboard</div>
                  <div className="text-sm text-green-400 flex items-center gap-1">+24% This Month <TrendingUp className="w-4 h-4" /></div>
                </div>
                {[
                  { value: "₹4.5L", label: "Monthly Revenue" },
                  { value: "1,240", label: "Active Members" },
                  { value: "342", label: "Check-ins Today" },
                  { value: "4.9/5", label: "Satisfaction Score" }
                ].map((stat, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 relative overflow-hidden bg-slate-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center justify-center gap-2 mb-4 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-bold text-orange-400 uppercase tracking-widest">
            Pricing Plans (INR)
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">Simple, scalable pricing</h2>
          <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">Choose the perfect tier for your growth. Billed in Indian Rupees (₹).</p>
          
          {/* Billing Switcher */}
          <div className="flex items-center justify-center gap-4 mb-16">
            <span className={cn("text-sm font-medium transition-colors font-bold", billingCycle === "monthly" ? "text-white" : "text-slate-500")}>Monthly</span>
            <button 
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "annually" : "monthly")}
              className="relative w-14 h-7 rounded-full bg-slate-800 p-1 transition-all duration-300 hover:bg-slate-700"
            >
              <div className={cn(
                "w-5 h-5 rounded-full bg-orange-500 shadow-lg transition-transform duration-300",
                billingCycle === "annually" ? "translate-x-7" : "translate-x-0"
              )} />
            </button>
            <span className={cn("text-sm font-medium transition-colors flex items-center gap-2 font-bold", billingCycle === "annually" ? "text-white" : "text-slate-500")}>
              Annually
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 py-0.5 px-2 rounded-full text-[10px] font-bold uppercase tracking-tighter">Save 20%</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
             {plans.map((plan) => (
                <PricingCard 
                  key={plan.tier}
                  tier={plan.tier}
                  price={billingCycle === "monthly" ? `₹${plan.monthlyPrice}` : `₹${plan.annualPrice}`}
                  features={plan.features}
                  popular={plan.popular}
                  billingCycle={billingCycle}
                />
             ))}
          </div>

          <p className="mt-12 text-slate-500 text-sm">
            All plans include a 14-day free trial. No credit card required. Taxes applicable as per Indian laws.
          </p>
        </div>
        <div className="absolute bottom-0 -left-1/4 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-black">
        <div className="absolute inset-0 bg-orange-600/5" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">Ready to transform your gym?</h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">Join Bharat's fastest growing gyms automating their operations with GymOS today.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="h-14 px-10 text-lg bg-orange-600 text-white hover:bg-orange-700 rounded-full shadow-[0_0_30px_rgba(234,88,12,0.5)] transform transition hover:scale-105 active:scale-95">
              <Link href="/register">Start Your 14-Day Free Trial</Link>
            </Button>
            <Button size="lg" variant="ghost" asChild className="h-14 px-10 text-lg text-slate-300 hover:text-white hover:bg-white/5 rounded-full border border-white/5">
              <Link href="/login">Explore Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
           <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-orange-600 flex items-center justify-center">
              <Dumbbell className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">GymOS</span>
          </div>
          <p className="text-slate-600 text-sm">© 2026 GymOS Bharat. Built for Indian Entrepreneurs.</p>
          <div className="flex gap-6 text-slate-500 text-sm">
            <a href="#" className="hover:text-orange-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-orange-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-orange-400 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PricingCard({ 
  tier, 
  price, 
  features, 
  popular, 
  billingCycle 
}: { 
  tier: string, 
  price: string, 
  features: string[], 
  popular?: boolean,
  billingCycle: string
}) {
  return (
    <div className={cn(
      "p-8 rounded-[2rem] border transition-all duration-500 hover:-translate-y-2 flex flex-col group relative",
      popular 
        ? 'bg-gradient-to-br from-orange-600/20 via-slate-900/40 to-black border-orange-500/40 shadow-[0_0_50px_rgba(234,88,12,0.2)] scale-[1.02] z-10' 
        : 'bg-white/[0.02] border-white/10 hover:border-white/20'
    )}>
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
          Recommended
        </div>
      )}
      
      <div className="mb-8">
        <h3 className="text-xl font-bold text-white mb-1">{tier}</h3>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">{features[0]}</p>
      </div>

      <div className="flex items-baseline gap-1 mb-10">
        <span className="text-4xl lg:text-5xl font-black text-white">{price}</span>
        <span className="text-slate-500 font-medium whitespace-nowrap">/{billingCycle === "monthly" ? "mo" : "mo"}</span>
      </div>
      
      <ul className="space-y-4 mb-10 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-3 group/item text-left">
            <div className={cn(
              "mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-colors",
              popular ? "bg-orange-500/20 text-orange-400" : "bg-slate-800 text-slate-500 group-hover/item:bg-orange-500/20 group-hover/item:text-orange-400"
            )}>
              <CheckCircle2 className="h-2.5 w-2.5" />
            </div>
            <span className="text-sm text-slate-400 group-hover/item:text-white transition-colors leading-tight">{f}</span>
          </li>
        ))}
      </ul>

      <Button 
        variant={popular ? 'default' : 'outline'} 
        asChild
        className={cn(
          "w-full h-14 text-sm font-bold uppercase tracking-widest rounded-2xl transition-all duration-300 active:scale-95",
          popular 
            ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
            : 'border-white/10 hover:bg-white/10 text-white bg-transparent'
        )}
      >
        <Link href="/register">Choose {tier}</Link>
      </Button>
    </div>
  );
}
