import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Star } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center justify-center">
      {/* Background decoration */}
      <div className="absolute inset-0 animated-gradient opacity-40 dark:opacity-60" />
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-float" />
      <div className="absolute bottom-20 right-10 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-[120px] animate-float-delayed" />

      {/* Floating abstract elements */}
      <div className="absolute hidden lg:block top-40 left-20 w-24 h-24 rounded-2xl glass animate-float transform rotate-12 flex items-center justify-center shadow-xl">
        <Star className="w-10 h-10 text-primary/50" />
      </div>
      <div className="absolute hidden lg:block bottom-40 right-20 w-32 h-32 rounded-full glass animate-float-delayed flex items-center justify-center shadow-xl">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-purple-400 opacity-50 blur-sm" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/50 backdrop-blur-md px-5 py-2 text-sm font-semibold text-primary shadow-[0_0_20px_rgba(var(--primary),0.2)] hover:shadow-[0_0_30px_rgba(var(--primary),0.4)] transition-all cursor-default shine">
            <Sparkles className="h-4 w-4" />
            Free forever for students
          </div>

          {/* Headline */}
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl mb-6">
            Master your study week and{' '}
            <br className="hidden sm:block" />
            <span className="gradient-text drop-shadow-sm">never miss a deadline</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-8 text-xl leading-relaxed text-muted-foreground max-w-2xl mx-auto font-medium">
            StudyFlow helps you track assignments, organize subjects, take rich notes,
            and create intelligent study plans. All in one beautiful, frictionless app.
          </p>

          {/* CTAs */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button size="lg" asChild className="w-full sm:w-auto text-lg px-10 h-14 glow-pulse rounded-2xl shadow-primary/25 shadow-2xl transition-transform hover:scale-105">
              <Link href="/signup">
                Start for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto text-lg px-10 h-14 rounded-2xl glass hover:bg-white/10 dark:hover:bg-black/10 transition-transform hover:scale-105 border-primary/20">
              <Link href="#features">Explore Features</Link>
            </Button>
          </div>

          {/* Social proof */}
          <p className="mt-10 text-sm font-medium text-muted-foreground flex items-center justify-center gap-4">
            <span>✓ No credit card required</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">✓ Works on all devices</span>
          </p>
        </div>
      </div>
    </section>
  )
}
