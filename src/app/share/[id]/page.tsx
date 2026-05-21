'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { 
  BookOpen, 
  CalendarDays, 
  Beaker,
  HelpCircle,
  ArrowRight
} from 'lucide-react'
import Image from 'next/image'
import { format, differenceInDays, parseISO } from 'date-fns'
import type { StudyPlan } from '@/lib/types/database'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function PublicStudyPlanPage() {
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id
  const [plan, setPlan] = useState<StudyPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = useMemo(() => createClient(), [])

  const fetchPlan = useCallback(async () => {
    if (!id) return
    const { data } = await supabase
      .from('study_plans')
      .select('*')
      .eq('id', id)
      .single()

    if (data) setPlan(data)
    setLoading(false)
  }, [id, supabase])

  useEffect(() => {
    if (!id) {
      const timeoutId = window.setTimeout(() => setLoading(false), 0)
      return () => window.clearTimeout(timeoutId)
    }

    fetchPlan()
  }, [fetchPlan, id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <div className="h-8 w-8 animate-spin text-primary border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-4xl font-bold text-on-surface mb-4">Study plan not found</h1>
        <p className="text-on-surface-variant mb-8">This study plan might have been removed or the link is invalid.</p>
        <Link href="/" className="bg-primary text-on-primary px-8 py-3 rounded-2xl font-bold">
          Go to Home
        </Link>
      </div>
    )
  }

  const daysRemaining = differenceInDays(parseISO(plan.exam_date), new Date())

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body-md flex flex-col">
      {/* Minimal Header */}
      <header className="w-full px-6 md:px-12 py-8 flex items-center justify-between z-10 relative">
        <div className="flex items-center">
          <Image src="/logo-wide.png" alt="StudyFlow Logo" width={140} height={35} className="object-contain" />
        </div>
        <div>
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-container text-on-primary-container font-bold text-xs uppercase tracking-widest">
            Shared Study Plan
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 md:px-12 py-12 flex flex-col gap-16">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto flex flex-col items-center gap-6">
          <h1 className="text-5xl md:text-6xl font-bold text-on-surface tracking-tighter leading-tight">
            {plan.title} Exam Plan
          </h1>
          <p className="text-xl text-on-surface-variant font-medium leading-relaxed">
            A comprehensive study schedule created with StudyFlow. Follow the steps below to prepare for the upcoming exam.
          </p>
        </section>

        {/* Details & Timeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Summary Sidebar */}
          <aside className="lg:col-span-4 flex flex-col gap-8">
            <div className="bg-white/70 backdrop-blur-2xl border border-white/50 rounded-3xl p-8 shadow-[0_12px_40px_-12px_rgba(103,80,164,0.04)]">
              <div className="flex items-center gap-3 text-primary mb-8">
                <CalendarDays className="h-6 w-6" />
                <h2 className="text-2xl font-bold">Exam Details</h2>
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center border-b border-surface-variant pb-4">
                  <span className="font-bold text-on-surface-variant">Subject</span>
                  <span className="font-bold text-on-surface">{plan.title}</span>
                </div>
                <div className="flex justify-between items-center border-b border-surface-variant pb-4">
                  <span className="font-bold text-on-surface-variant">Exam Date</span>
                  <span className="font-bold text-on-surface">{format(parseISO(plan.exam_date), 'MMMM d, yyyy')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-on-surface-variant">Days Left</span>
                  <span className={cn(
                    "px-3 py-1 rounded-lg font-black text-xs uppercase tracking-widest",
                    daysRemaining <= 3 ? "bg-red-100 text-red-600" : "bg-primary-container text-on-primary-container"
                  )}>
                    {daysRemaining < 0 ? 'Exam Passed' : `${daysRemaining} Days`}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Component */}
            <div className="bg-primary text-on-primary rounded-3xl p-8 flex flex-col gap-8 shadow-xl shadow-primary/20 relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />
              <div className="z-10 flex flex-col gap-3">
                <h3 className="text-2xl font-bold leading-tight">Create your own study plan for free</h3>
                <p className="text-on-primary/80 font-medium">Organize tasks, track progress, and ace exams with StudyFlow.</p>
              </div>
              <Link href="/signup" className="bg-white text-primary font-bold py-4 px-8 rounded-2xl hover:bg-surface-variant transition-all self-start z-10 shadow-sm flex items-center gap-2 group/btn">
                Start Free <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </aside>

          {/* Timeline */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <h2 className="text-2xl font-bold text-on-surface px-4 border-l-4 border-primary">Study Timeline</h2>
            <div className="flex flex-col gap-6 relative">
              {/* Timeline Line */}
              <div className="absolute left-7 top-8 bottom-8 w-0.5 bg-surface-variant hidden sm:block"></div>
              
              {/* Dummy Timeline Items based on professional design */}
              {[
                { title: 'Foundations & Concepts', icon: BookOpen, week: 'Week 1', desc: 'Focus on core principles, definitions, and key frameworks.' },
                { title: 'Advanced Analysis', icon: Beaker, week: 'Week 2', desc: 'Deep dive into complex problems, applications, and detailed studies.' },
                { title: 'Review & Practice', icon: HelpCircle, week: 'Final Prep', desc: 'Full-length practice exams and intensive revision of difficult topics.', priority: true },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-6 relative group">
                  <div className={cn(
                    "hidden sm:flex w-14 h-14 rounded-2xl items-center justify-center z-10 shrink-0 border-4 border-surface shadow-sm transition-transform group-hover:scale-110",
                    idx === 0 ? "bg-primary-container text-primary" : "bg-surface-variant text-on-surface-variant"
                  )}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-surface-variant w-full shadow-sm hover:shadow-md transition-all group-hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-on-surface">{item.title}</h3>
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                        item.priority ? "bg-red-100 text-red-600" : "bg-tertiary-container/20 text-on-tertiary-container"
                      )}>
                        {item.week}
                      </span>
                    </div>
                    <p className="text-on-surface-variant font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full py-12 border-t border-surface-variant mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-on-surface-variant font-bold text-sm">© 2024 StudyFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
