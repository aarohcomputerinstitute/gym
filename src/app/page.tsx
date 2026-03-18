import Link from "next/link";
import { 
  Dumbbell, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight,
  LayoutDashboard,
  CreditCard,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-primary-foreground">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Dumbbell className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">GymOS</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild className="hidden sm:inline-flex border-white/10 hover:bg-white/5">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/80 mb-8 animate-fade-in">
              <span className="flex h-2 w-2 rounded-full bg-primary" />
              Revolutionizing Gym Management
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 leading-tight">
              The OS for Modern <br className="hidden md:block" /> Fitness Enterprises.
            </h1>
            <p className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
              Streamline member management, automate billing, and scale your gym with the most powerful all-in-one platform built for performance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="h-14 px-8 text-lg bg-white text-black hover:bg-white/90 group">
                <Link href="/register">
                  Start Your Trial
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-14 px-8 text-lg border-white/10 hover:bg-white/5 bg-transparent">
                <Link href="#features">Explore Features</Link>
              </Button>
            </div>
          </div>

          {/* Hero Image Mockup Area */}
          <div className="mt-20 relative px-4">
              <div className="relative rounded-xl overflow-hidden aspect-video bg-zinc-900 border border-white/5 shadow-2xl group">
                {/* Real Hero Image Background */}
                <img 
                  src="/hero-bg.png" 
                  alt="Gym Dashboard Preview" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="grid grid-cols-3 gap-8 w-full max-w-4xl p-8">
                      {[1,2,3].map(i => (
                        <div key={i} className="h-40 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg animate-pulse" />
                      ))}
                   </div>
                </div>
              </div>
            {/* Glossy Overlay Decor */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Engineered for Success</h2>
            <p className="text-white/60">Everything you need to run a world-class fitness facility.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Users className="h-6 w-6" />}
              title="Member Management"
              description="Complete lifecycle tracking from onboarding to retention with automated reminders."
            />
            <FeatureCard 
              icon={<CreditCard className="h-6 w-6" />}
              title="Automated Payments"
              description="Hassle-free billing with integrated payment gateways and invoice generation."
            />
            <FeatureCard 
              icon={<LayoutDashboard className="h-6 w-6" />}
              title="Advanced Analytics"
              description="Real-time insights into revenue, member attendance, and churn rates."
            />
            <FeatureCard 
              icon={<TrendingUp className="h-6 w-6" />}
              title="Trainer Performance"
              description="Track sessions, manage commissions, and monitor client success metrics."
            />
            <FeatureCard 
              icon={<MessageSquare className="h-6 w-6" />}
              title="Client Communication"
              description="Engage members with automated announcements, SMS, and in-app notifications."
            />
            <FeatureCard 
              icon={<ShieldCheck className="h-6 w-6" />}
              title="Enterprise Security"
              description="Role-based access control and secure data encryption at every layer."
            />
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Scalable Plans</h2>
          <p className="text-white/60 mb-16">Choose the perfect tier for your growth.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
             <PricingCard tier="Starter" price="$49" features={["Up to 200 Members", "Basic Analytics", "Email Support"]} />
             <PricingCard tier="Professional" price="$99" popular features={["Unlimited Members", "Advanced Dashboard", "Priority Support", "custom Domain"]} />
             <PricingCard tier="Enterprise" price="Custom" features={["Multi-location Support", "Dedicated Manager", "Full API Access", "White-label Option"]} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-black">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold tracking-tight">GymOS</span>
          </div>
          <p className="text-white/40 text-sm">© 2026 GymOS Enterprises. Built for performance.</p>
          <div className="flex gap-6 text-white/40 text-sm">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors group">
      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 transition-colors group-hover:text-primary">{title}</h3>
      <p className="text-white/50 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function PricingCard({ tier, price, features, popular }: { tier: string, price: string, features: string[], popular?: boolean }) {
  return (
    <div className={`p-8 rounded-2xl border ${popular ? 'border-primary bg-primary/5 ring-1 ring-primary/50' : 'border-white/10 bg-white/[0.02]'} relative`}>
      {popular && (
        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 rounded-full bg-primary text-[10px] font-bold uppercase tracking-widest">
          Most Popular
        </span>
      )}
      <h3 className="text-xl font-bold mb-2">{tier}</h3>
      <div className="text-4xl font-bold mb-6">{price}<span className="text-lg text-white/40 font-normal">/mo</span></div>
      <ul className="space-y-4 mb-8 text-sm text-white/60">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            {f}
          </li>
        ))}
      </ul>
      <Button variant={popular ? 'default' : 'outline'} className={`w-full ${popular ? 'bg-primary text-primary-foreground' : 'border-white/10 hover:bg-white/5'}`}>
        Select Plan
      </Button>
    </div>
  );
}
