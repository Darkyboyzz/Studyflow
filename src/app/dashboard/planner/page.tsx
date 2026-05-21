'use client'

import { useEffect, useMemo, useState } from 'react'
import { differenceInDays, format, isToday, parseISO } from 'date-fns'
import {
  BookOpen,
  CalendarDays,
  Check,
  Clock,
  Edit2,
  FileText,
  ListOrdered,
  Plus,
  Save,
  Share2,
  Target,
  Timer,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { cn } from '@/lib/utils'
import type { StudyPlan, StudyPlanItem, Subject } from '@/lib/types/database'

type PlanWithDetails = StudyPlan & {
  subject?: Subject | null
  items?: StudyPlanItem[]
}

function defaultExamDate() {
  const date = new Date()
  date.setDate(date.getDate() + 7)
  return date.toISOString().slice(0, 10)
}

export default function PlannerPage() {
  const { user } = useAuth()
  const [plans, setPlans] = useState<PlanWithDetails[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(() => ({
    title: '',
    subject_id: '',
    exam_date: defaultExamDate(),
    topics: 'Review syllabus\nPractice problems\nMock test',
  }))
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    if (!user) {
      const id = window.setTimeout(() => setLoading(false), 0)
      return () => window.clearTimeout(id)
    }

    let ignore = false
    async function fetchPlans() {
      setLoading(true)
      const [planRes, subjectRes] = await Promise.all([
        supabase
          .from('study_plans')
          .select('*, subject:subjects(*), items:study_plan_items(*)')
          .eq('user_id', user!.id)
          .order('exam_date', { ascending: true }),
        supabase.from('subjects').select('*').eq('user_id', user!.id).order('name', { ascending: true }),
      ])

      if (ignore) return
      setPlans((planRes.data ?? []) as PlanWithDetails[])
      setSubjects((subjectRes.data ?? []) as Subject[])
      setLoading(false)
    }

    fetchPlans().catch((error) => {
      console.error('Failed to load plans', error)
      setLoading(false)
    })

    return () => {
      ignore = true
    }
  }, [supabase, user])

  const activePlan = plans[0] ?? null
  const items = activePlan?.items ?? []
  const completedItems = items.filter((item) => item.is_completed).length
  const progress = items.length > 0 ? Math.round((completedItems / items.length) * 100) : 0
  const daysLeft = activePlan ? Math.max(0, differenceInDays(parseISO(activePlan.exam_date), new Date())) : 0

  const createPlan = async () => {
    if (!user) return toast.error('Sign in to create plans')
    if (!form.title.trim()) return toast.error('Plan title is required')
    const topics = form.topics.split('\n').map((topic) => topic.trim()).filter(Boolean)
    if (topics.length === 0) return toast.error('Add at least one topic')

    setSaving(true)
    const { data: plan, error } = await supabase
      .from('study_plans')
      .insert({
        user_id: user.id,
        subject_id: form.subject_id || null,
        title: form.title.trim(),
        exam_date: form.exam_date,
      })
      .select('*, subject:subjects(*)')
      .single()

    if (error || !plan) {
      toast.error(error?.message || 'Failed to create plan')
      setSaving(false)
      return
    }

    const start = new Date()
    const end = new Date(form.exam_date)
    const totalDays = Math.max(1, differenceInDays(end, start))
    const rows = topics.map((topic, index) => {
      const date = new Date()
      date.setDate(date.getDate() + Math.min(totalDays, index + 1))
      return {
        plan_id: plan.id,
        topic,
        scheduled_date: date.toISOString().slice(0, 10),
      }
    })

    const { data: items, error: itemError } = await supabase.from('study_plan_items').insert(rows).select('*')
    if (itemError) {
      toast.error(itemError.message)
    } else {
      setPlans((current) => [{ ...(plan as PlanWithDetails), items: (items ?? []) as StudyPlanItem[] }, ...current].sort((a, b) => a.exam_date.localeCompare(b.exam_date)))
      setCreateOpen(false)
      setForm({ title: '', subject_id: '', exam_date: defaultExamDate(), topics: 'Review syllabus\nPractice problems\nMock test' })
      toast.success('Study plan created')
    }
    setSaving(false)
  }

  return (
    <div className="space-y-6 text-slate-950 dark:text-white">
      <section className="relative overflow-hidden rounded-[32px] border border-white/12 bg-[#081411] p-5 text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-7">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(245,158,11,0.22),transparent_30%),radial-gradient(circle_at_86%_8%,rgba(52,211,153,0.18),transparent_30%)]" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-xs font-bold text-white/70">
              <Target className="h-3.5 w-3.5 text-amber-200" />
              Exam-ready schedule
            </div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Study planner</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/62">
              Turn exam dates into a realistic review path with progress, pacing, and daily study blocks.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setCreateOpen(true)} className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-white/12 bg-white/10 px-4 text-sm font-black text-white transition hover:bg-white/16">
              <Edit2 className="h-4 w-4" />
              New
            </button>
            <button className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-white/12 bg-white/10 px-4 text-sm font-black text-white transition hover:bg-white/16">
              <Share2 className="h-4 w-4" />
              Share
            </button>
            <button className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-black text-emerald-950">
              <Save className="h-4 w-4" />
              Save
            </button>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="rounded-[32px] border border-white/70 bg-white/82 p-10 text-center text-sm font-semibold text-slate-400 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-white/8">Loading planner...</div>
      ) : !activePlan ? (
        <div className="rounded-[32px] border border-dashed border-white/70 bg-white/82 p-12 text-center shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-white/8">
          <CalendarDays className="mx-auto mb-4 h-10 w-10 text-slate-300" />
          <h2 className="text-2xl font-black">No study plan yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-white/45">Create a plan to see exam countdowns, topic progress, and a daily schedule here.</p>
          <button onClick={() => setCreateOpen(true)} className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white dark:bg-white dark:text-slate-950">
            <Plus className="h-4 w-4" />
            Create plan
          </button>
        </div>
      ) : (
        <>
          <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
            <div className="rounded-[32px] border border-white/70 bg-white/82 p-5 shadow-xl shadow-emerald-950/5 backdrop-blur-2xl dark:border-white/10 dark:bg-white/8 sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Active plan</p>
                  <h2 className="mt-2 text-3xl font-black tracking-tight">{activePlan.title}</h2>
                  <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-white/45">{activePlan.subject?.name || 'General study'} - {format(parseISO(activePlan.exam_date), 'MMM d, yyyy')}</p>
                </div>
                <div className="rounded-3xl bg-emerald-50 p-5 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-200">
                  <p className="text-4xl font-black">{daysLeft}</p>
                  <p className="text-xs font-black uppercase tracking-wide">days left</p>
                </div>
              </div>

              <div className="mt-8">
                <div className="mb-3 flex items-end justify-between">
                  <div>
                    <p className="font-black">Overall progress</p>
                    <p className="text-sm text-slate-500 dark:text-white/45">{completedItems} of {items.length} topics completed</p>
                  </div>
                  <span className="text-3xl font-black text-emerald-500">{progress}%</span>
                </div>
                <div className="h-4 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-300 transition-all duration-700" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {[
                { label: 'Subject', value: activePlan.subject?.name || 'General', icon: BookOpen },
                { label: 'Topics', value: items.length.toString(), icon: ListOrdered },
                { label: 'Completed', value: completedItems.toString(), icon: Check },
                { label: 'Pace', value: daysLeft > 0 ? `${Math.ceil((items.length - completedItems) / Math.max(1, daysLeft))}/day` : 'Final', icon: Timer },
              ].map((stat) => (
                <div key={stat.label} className="rounded-[28px] border border-white/70 bg-white/82 p-5 shadow-xl shadow-emerald-950/5 backdrop-blur-2xl dark:border-white/10 dark:bg-white/8">
                  <stat.icon className="mb-4 h-5 w-5 text-emerald-500" />
                  <p className="text-2xl font-black">{stat.value}</p>
                  <p className="text-xs font-bold text-slate-500 dark:text-white/45">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[32px] border border-white/70 bg-white/82 p-5 shadow-xl shadow-emerald-950/5 backdrop-blur-2xl dark:border-white/10 dark:bg-white/8 sm:p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Schedule timeline</h2>
                <p className="text-sm text-slate-500 dark:text-white/45">Topic blocks ordered by scheduled date.</p>
              </div>
              <CalendarDays className="h-5 w-5 text-emerald-500" />
            </div>

            <div className="relative space-y-4">
              {items.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-200 p-10 text-center text-sm font-semibold text-slate-400 dark:border-white/10">No scheduled topics yet.</div>
              ) : (
                items.map((item) => {
                  const today = isToday(parseISO(item.scheduled_date))
                  return (
                    <div key={item.id} className="grid gap-3 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-black/18 sm:grid-cols-[92px_1fr] sm:p-5">
                      <div className={cn('flex h-16 items-center justify-center rounded-2xl text-center text-sm font-black', today ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-white/55')}>
                        <div>
                          <p>{format(parseISO(item.scheduled_date), 'EEE')}</p>
                          <p className="text-xs opacity-75">{format(parseISO(item.scheduled_date), 'MMM d')}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className={cn('mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-xl border-2', item.is_completed ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-200 dark:border-white/20')}>
                          {item.is_completed && <Check className="h-4 w-4" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-black">{item.topic}</p>
                          <div className="mt-2 flex flex-wrap gap-3 text-xs font-semibold text-slate-500 dark:text-white/45">
                            <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> 1.5 hrs</span>
                            <span className="inline-flex items-center gap-1"><FileText className="h-3.5 w-3.5" /> Review + Quiz</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </section>
        </>
      )}

      {createOpen && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-black/60 p-4 text-white backdrop-blur-xl">
          <div className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-[#081411] p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-white/40">Study plan</p>
                <h2 className="text-xl font-black">Create study plan</h2>
              </div>
              <button onClick={() => setCreateOpen(false)} className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-4">
              <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Plan title" className="h-12 rounded-2xl border border-white/10 bg-white/10 px-4 font-semibold outline-none placeholder:text-white/35" />
              <div className="grid gap-3 sm:grid-cols-2">
                <select value={form.subject_id} onChange={(event) => setForm({ ...form, subject_id: event.target.value })} className="h-12 rounded-2xl border border-white/10 bg-white/10 px-4 font-semibold outline-none">
                  <option className="text-slate-950" value="">No subject</option>
                  {subjects.map((subject) => <option className="text-slate-950" key={subject.id} value={subject.id}>{subject.name}</option>)}
                </select>
                <input type="date" value={form.exam_date} onChange={(event) => setForm({ ...form, exam_date: event.target.value })} className="h-12 rounded-2xl border border-white/10 bg-white/10 px-4 font-semibold outline-none" />
              </div>
              <textarea value={form.topics} onChange={(event) => setForm({ ...form, topics: event.target.value })} placeholder="One topic per line" className="min-h-40 rounded-2xl border border-white/10 bg-white/10 p-4 font-semibold outline-none placeholder:text-white/35" />
              <button onClick={createPlan} disabled={saving} className="mt-2 min-h-12 rounded-2xl bg-white text-sm font-black text-emerald-950 disabled:opacity-50">
                {saving ? 'Creating...' : 'Create plan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
