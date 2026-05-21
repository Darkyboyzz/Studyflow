'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  CheckCircle2, 
  Calendar,
  ClipboardCheck,
  FileText,
  Share2,
  Moon,
  Sun,
  Monitor
} from 'lucide-react'
import Image from 'next/image'
import { useAuth } from '@/components/providers/auth-provider'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function LandingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [showThemeMenu, setShowThemeMenu] = useState(false)

  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), 0)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  if (user) return null

  const themes = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor },
  ]

  return (
    <div className="min-h-screen bg-surface dark:bg-[var(--color-surface)] selection:bg-primary-container selection:text-on-primary-container">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-16 lg:px-20 h-20 bg-white/70 dark:bg-[#121014]/80 backdrop-blur-xl border-b border-surface-variant/10 dark:border-white/5">
        <Link href="/" className="flex items-center overflow-hidden h-10 w-40 bg-white rounded-lg shadow-sm border border-gray-200">
          <Image src="/logo-wide.png" alt="StudyFlow Logo" width={200} height={50} className="object-cover scale-125" priority />
        </Link>
        
        <div className="hidden md:flex items-center gap-10">
          {[
            { label: 'Features', href: '#features' },
            { label: 'How It Works', href: '#how-it-works' },
          ].map((item) => (
            <a key={item.label} href={item.href} className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Switcher */}
          {mounted && (
            <div className="relative">
              <button 
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="p-2.5 rounded-xl bg-surface-container dark:bg-surface-container-high hover:bg-surface-container-high dark:hover:bg-surface-container-highest transition-all"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Moon className="h-4 w-4 text-on-surface-variant" /> : theme === 'light' ? <Sun className="h-4 w-4 text-on-surface-variant" /> : <Monitor className="h-4 w-4 text-on-surface-variant" />}
              </button>
              {showThemeMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowThemeMenu(false)} />
                  <div className="absolute right-0 top-12 z-50 bg-white dark:bg-[#2b2930] rounded-2xl shadow-2xl border border-surface-variant/20 dark:border-white/10 p-2 min-w-[160px]">
                    {themes.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => { setTheme(t.id); setShowThemeMenu(false) }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                          theme === t.id 
                            ? 'bg-primary/10 text-primary' 
                            : 'text-on-surface-variant hover:bg-surface-container dark:hover:bg-white/5'
                        }`}
                      >
                        <t.icon className="h-4 w-4" />
                        {t.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          <Link href="/login" className="hidden sm:block text-sm font-black text-on-surface-variant hover:text-primary transition-colors px-4">
            Login
          </Link>
          <Link 
            href="/signup" 
            className="bg-primary text-on-primary font-black text-sm px-7 py-3 rounded-[20px] shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-95 transition-all"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="pt-36 pb-20 px-6 md:px-16 lg:px-20 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 dark:bg-primary/10 rounded-full border border-primary/10 dark:border-primary/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Free & Open Source</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-on-surface leading-[0.9] tracking-tighter">
                Plan your <br />
                <span className="text-primary italic">study week</span> <br />
                with ease.
              </h1>
              
              <p className="text-lg md:text-xl text-on-surface-variant font-medium leading-relaxed max-w-xl">
                A simple productivity suite for students. Organize subjects, track tasks, take notes, and create study plans — all in one place.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link 
                  href="/signup" 
                  className="bg-primary text-on-primary px-10 py-5 rounded-[24px] font-black text-lg shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  Start Planning
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link 
                  href="/login" 
                  className="px-10 py-5 rounded-[24px] font-black text-lg text-on-surface bg-surface-container-high dark:bg-surface-container hover:bg-surface-variant dark:hover:bg-surface-container-high transition-all active:scale-95 text-center"
                >
                  Sign In
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 text-sm font-bold text-on-surface-variant">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  100% Free
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  No credit card
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Works on any device
                </span>
              </div>
            </div>

            {/* Hero Visual — Interactive Dashboard Preview */}
            <div className="relative group hidden lg:block">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-[60px] blur-3xl opacity-40 group-hover:opacity-70 transition-opacity duration-1000" />
              <div className="relative bg-white dark:bg-[#1d1b20] rounded-[40px] p-6 shadow-2xl border border-surface-variant/10 dark:border-white/5 overflow-hidden">
                {/* Mini Dashboard Mock */}
                <div className="space-y-4">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-8 flex items-center justify-start p-1">
                        <Image src="/logo-wide.png" alt="Logo" width={80} height={20} className="object-contain" />
                      </div>
                      <div className="h-3 w-24 bg-surface-container-high dark:bg-surface-container-highest rounded-full" />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-3 w-16 bg-surface-container dark:bg-surface-container-high rounded-full" />
                      <div className="h-3 w-16 bg-surface-container dark:bg-surface-container-high rounded-full" />
                    </div>
                  </div>
                  
                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Tasks Done', value: '12', color: 'bg-primary/10 dark:bg-primary/20 text-primary' },
                      { label: 'Subjects', value: '5', color: 'bg-tertiary-container/50 dark:bg-tertiary-container/30 text-tertiary' },
                      { label: 'Notes', value: '23', color: 'bg-secondary-container/50 dark:bg-secondary-container/30 text-secondary' },
                    ].map((stat) => (
                      <div key={stat.label} className={`${stat.color} rounded-2xl p-4 text-center`}>
                        <p className="text-2xl font-black">{stat.value}</p>
                        <p className="text-[10px] font-bold opacity-70 mt-1">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Task List */}
                  <div className="bg-surface-container-low dark:bg-surface-container rounded-2xl p-4 space-y-3">
                    <p className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Today&apos;s Tasks</p>
                    {[
                      { task: 'Review Chapter 5 — Physics', done: true },
                      { task: 'Complete Math Problem Set', done: false },
                      { task: 'Read Biology Notes', done: false },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 py-2">
                        <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center ${item.done ? 'bg-primary border-primary' : 'border-outline-variant dark:border-outline'}`}>
                          {item.done && <CheckCircle2 className="h-3 w-3 text-white" />}
                        </div>
                        <span className={`text-sm font-medium ${item.done ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>{item.task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento */}
        <section id="features" className="py-20 px-6 md:px-16 lg:px-20 bg-white dark:bg-[#1a1720]">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-on-surface tracking-tighter">Everything you need<br />to stay organized.</h2>
              <p className="text-on-surface-variant font-medium text-lg max-w-xl mx-auto">Simple, focused tools that help you keep track of your academic life.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-surface-container-low dark:bg-[#211f26] rounded-[40px] p-10 space-y-6 group hover:bg-primary transition-all duration-700 border border-transparent hover:border-primary/20">
                <div className="w-14 h-14 rounded-[20px] bg-primary text-on-primary flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-all duration-500">
                  <Calendar className="h-7 w-7" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-on-surface group-hover:text-white transition-colors">Study Planner</h3>
                  <p className="text-lg text-on-surface-variant group-hover:text-white/80 transition-colors leading-relaxed">
                    Create study plans with exam dates and topics. The planner distributes your workload across available days so you can study consistently.
                  </p>
                </div>
              </div>

              <div className="bg-surface-container-low dark:bg-[#211f26] rounded-[40px] p-10 space-y-6 border border-surface-variant/10 dark:border-white/5">
                <div className="w-14 h-14 rounded-[20px] bg-secondary-container text-on-secondary-container flex items-center justify-center">
                  <ClipboardCheck className="h-7 w-7" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-on-surface">Task Tracking</h3>
                  <p className="text-lg text-on-surface-variant font-medium leading-relaxed">Set due dates and priorities for your assignments. Mark tasks as complete and see what you need to focus on next.</p>
                </div>
              </div>

              <div className="bg-surface-container-low dark:bg-[#211f26] rounded-[40px] p-10 space-y-6 border border-surface-variant/10 dark:border-white/5">
                <div className="w-14 h-14 rounded-[20px] bg-tertiary-container text-on-tertiary-container flex items-center justify-center">
                  <FileText className="h-7 w-7" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-on-surface">Quick Notes</h3>
                  <p className="text-lg text-on-surface-variant font-medium leading-relaxed">Write and organize notes by subject. Keep all your study material in one accessible place.</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary to-primary-container rounded-[40px] p-10 text-white space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-24 -mt-24" />
                <div className="relative z-10 space-y-6">
                  <div className="w-14 h-14 rounded-[20px] bg-white/20 backdrop-blur flex items-center justify-center">
                    <Share2 className="h-7 w-7" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black">Share Study Plans</h3>
                    <p className="text-lg text-white/80 font-medium leading-relaxed">Generate a public link for any study plan and share it with classmates. Simple collaboration without extra tools.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 px-6 md:px-16 lg:px-20 bg-surface dark:bg-[var(--color-surface)]">
          <div className="max-w-5xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-on-surface tracking-tighter">Get started in minutes.</h2>
              <p className="text-on-surface-variant font-medium text-lg">No complicated setup. Just sign up and start organizing.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: '01', title: 'Create an account', desc: 'Sign up with your email or Google account. It takes less than 30 seconds.' },
                { step: '02', title: 'Add your subjects', desc: 'Set up the courses you are taking this semester with custom colors.' },
                { step: '03', title: 'Start planning', desc: 'Add tasks, write notes, and create study plans for your upcoming exams.' },
              ].map((item) => (
                <div key={item.step} className="text-center space-y-4 p-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center mx-auto">
                    <span className="text-2xl font-black">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-black text-on-surface">{item.title}</h3>
                  <p className="text-on-surface-variant font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 md:px-16 lg:px-20">
          <div className="max-w-5xl mx-auto bg-primary rounded-[48px] p-12 md:p-20 text-center space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -ml-32 -mb-32" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">Ready to get organized?</h2>
              <p className="text-lg md:text-xl text-white/80 font-medium leading-relaxed">
                Start planning your study week today. Free to use, no strings attached.
              </p>
              <div className="pt-4">
                <Link 
                  href="/signup" 
                  className="bg-white text-primary px-10 py-5 rounded-[28px] font-black text-xl shadow-2xl hover:scale-105 transition-all inline-flex items-center gap-3"
                >
                  Create Free Account
                  <ArrowRight className="h-6 w-6" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-16 px-6 md:px-16 lg:px-20 bg-white dark:bg-[#1a1720] border-t border-surface-variant/10 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="space-y-4 max-w-sm">
              <div className="flex items-center overflow-hidden h-9 w-36 bg-white rounded-md border border-gray-100">
                <Image src="/logo-wide.png" alt="StudyFlow Logo" width={180} height={45} className="object-cover scale-125" />
              </div>
              <p className="text-on-surface-variant font-medium text-sm leading-relaxed">A free productivity suite to help students organize their academic work. Built with care.</p>
            </div>

            <div className="flex flex-wrap gap-12 md:gap-16">
              <div className="space-y-4">
                <h4 className="text-xs font-black text-on-surface uppercase tracking-[0.2em]">Product</h4>
                <ul className="space-y-3">
                  <li><a href="#features" className="text-sm text-on-surface-variant font-bold hover:text-primary transition-colors">Features</a></li>
                  <li><a href="#how-it-works" className="text-sm text-on-surface-variant font-bold hover:text-primary transition-colors">How It Works</a></li>
                  <li><Link href="/signup" className="text-sm text-on-surface-variant font-bold hover:text-primary transition-colors">Sign Up</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-black text-on-surface uppercase tracking-[0.2em]">Account</h4>
                <ul className="space-y-3">
                  <li><Link href="/login" className="text-sm text-on-surface-variant font-bold hover:text-primary transition-colors">Login</Link></li>
                  <li><Link href="/signup" className="text-sm text-on-surface-variant font-bold hover:text-primary transition-colors">Create Account</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-surface-variant/10 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm font-bold text-on-surface-variant">© {new Date().getFullYear()} StudyFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
