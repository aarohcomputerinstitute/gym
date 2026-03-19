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

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-indigo-500/30 selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)]">
              <Dumbbell className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">GymOS</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" asChild className="text-slate-300 hover:text-white hover:bg-white/10">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="bg-white text-black hover:bg-slate-200 shadow-[0_0_20px_rgba(255,255,255,0.2)] rounded-full px-6">
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
            <Button asChild className="w-full bg-indigo-600 text-white hover:bg-indigo-700">
              <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>Get Started Free</Link>
            </Button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
        {/* Animated Background Mesh */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/30 rounded-full blur-[120px] animate-pulse pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-fuchsia-600/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-sm font-medium text-indigo-300 mb-8 animate-fade-in shadow-[0_0_15px_rgba(79,70,229,0.2)]">
              <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
              The #1 Rated Gym Management Software of 2026
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
              The OS for Modern <br className="hidden md:block" /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400">
                Fitness Enterprises.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Streamline member management, automate billing, and absolutely dominate your local market with an all-in-one platform built for supreme performance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="h-14 px-8 text-lg bg-white text-black hover:bg-slate-200 group rounded-full w-full sm:w-auto shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                <Link href="/register">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-14 px-8 text-lg border-white/20 hover:bg-white/10 text-white bg-transparent rounded-full w-full sm:w-auto backdrop-blur-sm">
                <Link href="#features">See How It Works</Link>
              </Button>
            </div>
          </div>

          {/* Floating UI Mockups Area */}
          <div className="mt-24 relative px-4 max-w-5xl mx-auto lg:h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-20" />
            
            {/* Main Center Dashboard */}
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
                  { value: "$45,200", label: "Monthly Revenue" },
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

            {/* Floating Side Cards (Visible on Desktop) */}
            <div className="hidden lg:block absolute top-12 -left-12 w-64 p-4 rounded-xl border border-indigo-500/30 bg-black/60 backdrop-blur-2xl shadow-[0_0_30px_rgba(79,70,229,0.2)] animate-pulse" style={{ animationDuration: '4s' }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Payment Received</div>
                  <div className="text-xs text-slate-400">Sarah Jenkins • $99.00</div>
                </div>
              </div>
            </div>

            <div className="hidden lg:block absolute top-32 -right-8 w-64 p-4 rounded-xl border border-fuchsia-500/30 bg-black/60 backdrop-blur-2xl shadow-[0_0_30px_rgba(192,38,211,0.2)] animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-fuchsia-500/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-fuchsia-400" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">New Sign Up</div>
                  <div className="text-xs text-slate-400">Mike Ross • Pro Plan</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Social Proof / Trusted By */}
      <section className="py-10 border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-6">Trusted by 500+ Fitness Centers Worldwide</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholder logo names using typography for a clean look */}
            {['IRONFORGE', 'TITAN FIT', 'APEX ATHLETICS', 'OXYGEN GYM', 'PULSE STUDIOS'].map((logo, i) => (
              <div key={i} className="text-xl md:text-2xl font-black tracking-tighter text-white">
                {logo}.
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Engineered for Success</h2>
            <p className="text-lg text-slate-400">Replace 5 different software subscriptions with one incredibly powerful, unified system designed strictly for gym owners.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Users className="h-6 w-6" />}
              title="Member Management"
              description="Complete lifecycle tracking from onboarding to retention with automated reminders and deep CRM tools."
            />
            <FeatureCard 
              icon={<CreditCard className="h-6 w-6" />}
              title="Automated Payments"
              description="Hassle-free recurring billing with robust integrated payment gateways, auto-retry, and instant invoice generation."
            />
            <FeatureCard 
              icon={<LayoutDashboard className="h-6 w-6" />}
              title="Advanced Analytics"
              description="Real-time, actionable insights into MRR revenue, member attendance heatmaps, and precise churn rates."
            />
            <FeatureCard 
              icon={<Activity className="h-6 w-6" />}
              title="Trainer & Class Scheduling"
              description="Track PT sessions, manage trainer commissions effortlessly, and let members book classes directly."
            />
            <FeatureCard 
              icon={<MessageSquare className="h-6 w-6" />}
              title="Client Communication"
              description="Engage members instantly with automated mass announcements, personalized SMS alerts, and in-app pushes."
            />
            <FeatureCard 
              icon={<ShieldCheck className="h-6 w-6" />}
              title="Enterprise Security"
              description="Strict role-based access control, secure data encryption at rest, and full GDPR compliance at every layer."
            />
          </div>
        </div>
        <div className="absolute top-1/2 -right-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="py-24 relative overflow-hidden bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Simple, scalable pricing</h2>
          <p className="text-lg text-slate-400 mb-16 max-w-2xl mx-auto">Choose the perfect tier for your growth. No hidden fees, ever.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-center">
             <PricingCard tier="Starter" price="$49" features={["Up to 200 Members", "Basic Analytics", "Email Support", "Standard Billing"]} />
             <PricingCard tier="Professional" price="$99" popular features={["Unlimited Members", "Advanced Dashboard", "Priority Support", "Custom Branding", "Staff Management"]} />
             <PricingCard tier="Enterprise" price="Custom" features={["Multi-location Support", "Dedicated Account Manager", "Full API Access", "White-label Option", "Custom Integrations"]} />
          </div>
        </div>
        <div className="absolute bottom-0 -left-1/4 w-[600px] h-[600px] bg-fuchsia-500/10 rounded-full blur-[120px] pointer-events-none" />
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600/10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6">Ready to transform your gym?</h2>
          <p className="text-xl text-slate-300 mb-10">Join 500+ successful fitness centers completely automating their operations with GymOS today.</p>
          <Button size="lg" asChild className="h-14 px-10 text-lg bg-indigo-600 text-white hover:bg-indigo-700 rounded-full shadow-[0_0_30px_rgba(79,70,229,0.5)] transform transition hover:scale-105">
            <Link href="/register">Start Your 14-Day Free Trial</Link>
          </Button>
          <p className="mt-4 text-sm text-slate-400">No credit card required. Cancel anytime.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-black">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Dumbbell className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">GymOS</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 GymOS Enterprises. Built for supreme performance.</p>
          <div className="flex gap-6 text-slate-400 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 hover:-translate-y-2 hover:border-indigo-500/30 group">
      <div className="h-14 w-14 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-white transition-colors group-hover:text-indigo-300">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}

function PricingCard({ tier, price, features, popular }: { tier: string, price: string, features: string[], popular?: boolean }) {
  return (
    <div className={`p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-2 ${
      popular 
        ? 'border-indigo-500/50 bg-indigo-500/10 shadow-[0_0_40px_rgba(79,70,229,0.15)] md:-mt-4 md:mb-4 relative z-10' 
        : 'border-white/10 bg-white/[0.02] hover:border-white/20'
    } relative flex flex-col h-full`}>
      {popular && (
        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold uppercase tracking-widest shadow-lg">
          Most Popular
        </span>
      )}
      <h3 className="text-xl font-bold mb-2 text-white">{tier}</h3>
      <div className="text-4xl md:text-5xl font-extrabold mb-8 text-white">{price}<span className="text-lg text-slate-500 font-medium">/mo</span></div>
      
      <ul className="space-y-4 mb-8 text-sm text-slate-300 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-3">
            <CheckCircle2 className={`h-5 w-5 ${popular ? 'text-indigo-400' : 'text-slate-500'}`} />
            {f}
          </li>
        ))}
      </ul>
      <Button 
        variant={popular ? 'default' : 'outline'} 
        className={`w-full py-6 text-base rounded-xl transition-all duration-300 ${
          popular 
            ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25' 
            : 'border-white/10 hover:bg-white/10 text-white bg-transparent'
        }`}
      >
        Select {tier}
      </Button>
    </div>
  );
}
