'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { 
  BookOpen, 
  CalendarDays, 
  ListTodo, 
  Timer, 
  ChevronLeft,
  Share2,
  Save,
  Pencil,
  CheckCircle2,
  Clock,
  PlayCircle,
  FileText
} from 'lucide-react'
import { format, differenceInDays, parseISO } from 'date-fns'
import type { StudyPlan } from '@/lib/types/database'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function StudyPlanResultPage() {
  const { user } = useAuth()
  const [plan, setPlan] = useState<StudyPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = useMemo(() => createClient(), [])

  const fetchLatestPlan = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('study_plans')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (data) setPlan(data)
    setLoading(false)
  }, [supabase, user])

  useEffect(() => {
    if (!user) {
      const id = window.setTimeout(() => setLoading(false), 0)
      return () => window.clearTimeout(id)
    }

    fetchLatestPlan()
  }, [fetchLatestPlan, user])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin text-primary border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-on-surface mb-4">No study plan found</h2>
        <Link href="/dashboard/planner" className="text-primary font-bold hover:underline">
          Create one now
        </Link>
      </div>
    )
  }

  const daysRemaining = differenceInDays(parseISO(plan.exam_date), new Date())

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-8 md:py-12">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <Link href="/dashboard/planner" className="flex items-center gap-2 text-primary font-bold mb-4 hover:underline">
            <ChevronLeft className="h-4 w-4" />
            Back to Planner
          </Link>
          <h2 className="text-3xl md:text-4xl font-bold text-on-surface tracking-tight">Your Study Plan</h2>
          <p className="text-lg text-on-surface-variant mt-2 max-w-xl">
            A specialized schedule created to help you excel in {plan.title}.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-highest text-on-surface font-bold hover:bg-surface-variant transition-colors shadow-sm">
            <Pencil className="h-4 w-4" /> Edit Plan
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-highest text-on-surface font-bold hover:bg-surface-variant transition-colors shadow-sm">
            <Share2 className="h-4 w-4" /> Share
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold hover:opacity-90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
            <Save className="h-4 w-4" /> Save Plan
          </button>
        </div>
      </header>

      {/* Progress Section */}
      <section className="mb-12 bg-white rounded-3xl p-8 shadow-[0_12px_40px_rgba(79,55,138,0.04)] border border-surface-variant/20">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="font-bold text-on-surface mb-1 uppercase tracking-widest text-xs">Overall Progress</h3>
            <p className="text-on-surface-variant text-sm font-medium">0 of 12 topics completed</p>
          </div>
          <span className="text-3xl font-bold text-primary">0%</span>
        </div>
        <div className="h-3 w-full bg-surface-variant rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-surface-tint rounded-full w-[2%] transition-all duration-1000 ease-out" />
        </div>
      </section>

      {/* Summary Cards Bento Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
        <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-surface-variant/20 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 duration-500" />
          <div className="w-12 h-12 rounded-2xl bg-primary-container/30 text-primary flex items-center justify-center mb-6">
            <BookOpen className="h-6 w-6" />
          </div>
          <p className="text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-widest">Subject</p>
          <p className="text-xl font-bold text-on-surface truncate">{plan.title}</p>
        </div>

        <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-surface-variant/20 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary-container/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 duration-500" />
          <div className="w-12 h-12 rounded-2xl bg-tertiary-container/20 text-on-tertiary-container flex items-center justify-center mb-6">
            <CalendarDays className="h-6 w-6" />
          </div>
          <p className="text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-widest">Exam Date</p>
          <p className="text-xl font-bold text-on-surface">{format(parseISO(plan.exam_date), 'MMM d')}</p>
        </div>

        <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-surface-variant/20 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-secondary-container/30 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 duration-500" />
          <div className="w-12 h-12 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center mb-6">
            <ListTodo className="h-6 w-6" />
          </div>
          <p className="text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-widest">Total Topics</p>
          <p className="text-xl font-bold text-on-surface">12</p>
        </div>

        <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-surface-variant/20 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 duration-500" />
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6">
            <Timer className="h-6 w-6" />
          </div>
          <p className="text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-widest">Days Left</p>
          <p className={cn(
            "text-xl font-bold",
            daysRemaining <= 3 ? "text-red-600" : "text-on-surface"
          )}>
            {daysRemaining < 0 ? 'Passed' : daysRemaining}
          </p>
        </div>
      </section>

      {/* Timeline Schedule */}
      <section>
        <h3 className="text-2xl font-bold text-on-surface mb-8 flex items-center gap-3">
          <CalendarDays className="text-primary h-7 w-7" /> Weekly Schedule
        </h3>
        
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-surface-variant before:via-surface-variant before:to-transparent">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, idx) => (
            <div key={day} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold text-xs",
                idx === 0 ? "bg-primary text-on-primary" : "bg-surface-container-highest text-on-surface"
              )}>
                {day}
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-surface-variant/30 hover:shadow-md transition-all ml-4 md:ml-0 group-hover:-translate-y-1 duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    {idx === 0 && (
                      <span className="inline-block px-2.5 py-1 rounded-full bg-primary-container/30 text-on-primary-fixed-variant font-black text-[10px] uppercase tracking-widest mb-2">Today</span>
                    )}
                    <h4 className="text-xl font-bold text-on-surface">Phase {idx + 1}: Core Concepts</h4>
                  </div>
                  <div className="w-6 h-6 rounded-lg border-2 border-surface-variant flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                    <CheckCircle2 className="h-4 w-4 text-transparent group-hover:text-surface-variant/50" />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-on-surface-variant font-bold text-xs uppercase tracking-tighter">
                  <span className="flex items-center gap-1.5 bg-surface-container px-2 py-1 rounded-lg">
                    <Clock className="h-3.5 w-3.5" /> 2.5 hrs
                  </span>
                  <span className="flex items-center gap-1.5 bg-surface-container px-2 py-1 rounded-lg">
                    <FileText className="h-3.5 w-3.5" /> Review Notes
                  </span>
                  <span className="flex items-center gap-1.5 bg-surface-container px-2 py-1 rounded-lg">
                    <PlayCircle className="h-3.5 w-3.5" /> Watch Modules
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
