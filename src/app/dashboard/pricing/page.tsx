'use client'

import { CheckCircle2, Sparkles, Zap, HelpCircle } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="space-y-16 pb-20">
      <header className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black text-on-surface tracking-tighter">
          Simple Pricing for <br />
          <span className="text-primary italic">Academic Success</span>
        </h1>
        <p className="text-lg text-on-surface-variant font-medium">
          Start for free and scale as your academic goals grow. No hidden fees, just pure productivity.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto relative">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />

        {/* Free Tier */}
        <div className="bg-surface-container-lowest rounded-[48px] p-10 border border-surface-variant/20 shadow-sm flex flex-col transition-all hover:shadow-xl group">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-on-surface mb-2">Free Plan</h2>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black text-on-surface">$0</span>
              <span className="text-on-surface-variant font-bold">/mo</span>
            </div>
            <p className="text-sm text-on-surface-variant mt-4 font-medium italic">Perfect for getting started with your studies.</p>
          </div>

          <ul className="space-y-5 mb-10 flex-1">
            <li className="flex items-center gap-3 text-on-surface-variant font-bold text-sm">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Up to 3 active subjects
            </li>
            <li className="flex items-center gap-3 text-on-surface-variant font-bold text-sm">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              20 tasks per month
            </li>
            <li className="flex items-center gap-3 text-on-surface-variant font-bold text-sm">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Standard study planner
            </li>
            <li className="flex items-center gap-3 text-on-surface-variant font-bold text-sm">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Cloud synchronization
            </li>
          </ul>

          <button className="w-full py-4 rounded-2xl border-2 border-surface-variant text-on-surface font-black hover:bg-surface-container-high transition-all active:scale-95">
            Current Plan
          </button>
        </div>

        {/* Pro Tier */}
        <div className="bg-primary rounded-[48px] p-10 shadow-2xl shadow-primary/20 flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8">
            <Zap className="h-10 w-10 text-white/20 fill-current" />
          </div>
          
          <div className="mb-10 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full mb-4">
              <Sparkles className="h-3 w-3 text-white" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Recommended</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Pro Suite</h2>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black text-white">$5</span>
              <span className="text-white/60 font-bold">/one-time</span>
            </div>
            <p className="text-sm text-white/80 mt-4 font-medium italic">Unleash your full academic potential.</p>
          </div>

          <ul className="space-y-5 mb-10 flex-1 relative z-10">
            <li className="flex items-center gap-3 text-white font-bold text-sm">
              <CheckCircle2 className="h-5 w-5 text-white/40 fill-white/20" />
              Unlimited subjects & tasks
            </li>
            <li className="flex items-center gap-3 text-white font-bold text-sm">
              <CheckCircle2 className="h-5 w-5 text-white/40 fill-white/20" />
              Advanced AI study distribution
            </li>
            <li className="flex items-center gap-3 text-white font-bold text-sm">
              <CheckCircle2 className="h-5 w-5 text-white/40 fill-white/20" />
              Premium glassmorphism themes
            </li>
            <li className="flex items-center gap-3 text-white font-bold text-sm">
              <CheckCircle2 className="h-5 w-5 text-white/40 fill-white/20" />
              Collaborative share pages
            </li>
            <li className="flex items-center gap-3 text-white font-bold text-sm">
              <CheckCircle2 className="h-5 w-5 text-white/40 fill-white/20" />
              Export notes to PDF/Markdown
            </li>
          </ul>

          <button className="w-full py-4 rounded-2xl bg-white text-primary font-black shadow-xl hover:shadow-white/20 hover:-translate-y-1 transition-all active:scale-95 relative z-10">
            Upgrade to Pro
          </button>
        </div>
      </div>

      <section className="max-w-4xl mx-auto space-y-10">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-on-surface flex items-center justify-center gap-3">
            <HelpCircle className="h-6 w-6 text-primary" />
            Frequently Asked Questions
          </h3>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {[
            { q: "Is the $5 fee really one-time?", a: "Yes! We believe in simple tools for students. No recurring subscriptions, just a single payment for lifetime access." },
            { q: "Can I share my plan with others?", a: "With the Pro plan, you get beautiful public share links that anyone can view, perfect for study groups." },
            { q: "Is there a limit on notes?", a: "The free plan allows basic notes. Pro gives you unlimited notes with advanced formatting and export options." },
            { q: "What happens if I cancel?", a: "Since it's a one-time payment, there's nothing to cancel! You keep your Pro features forever." }
          ].map((item, i) => (
            <div key={i} className="bg-surface-container/30 p-8 rounded-[32px] border border-surface-variant/10 space-y-3">
              <h4 className="font-bold text-on-surface">{item.q}</h4>
              <p className="text-sm text-on-surface-variant font-medium leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
