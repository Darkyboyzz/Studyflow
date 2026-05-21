'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Flame,
  Focus,
  Layers3,
  LineChart,
  ListChecks,
  Lock,
  Medal,
  Music2,
  Plus,
  Sparkles,
  Target,
  Timer,
  Trophy,
  Zap,
} from 'lucide-react'
import { differenceInDays, format, isToday, parseISO } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { cn } from '@/lib/utils'
import type { StudyPlan, Subject, Task } from '@/lib/types/database'
import {
  getLevelInfo,
  getRecentHistory,
  getStudyEnvironment,
  loadFocusProfile,
} from '@/lib/studyflow'

type TaskWithSubject = Task & { subject?: Subject | null }
type PlanWithSubject = StudyPlan & { subject?: Subject | null }

const matrix = [
  { key: 'do', label: 'Do Now', help: 'Urgent + important', color: 'bg-rose-500', ring: 'ring-rose-200' },
  { key: 'plan', label: 'Schedule', help: 'Important, less urgent', color: 'bg-amber-500', ring: 'ring-amber-200' },
  { key: 'delegate', label: 'Review', help: 'Urgent, lighter lift', color: 'bg-sky-500', ring: 'ring-sky-200' },
  { key: 'later', label: 'Backlog', help: 'Low urgency', color: 'bg-emerald-500', ring: 'ring-emerald-200' },
] as const

function taskBucket(task: Task) {
  const days = differenceInDays(parseISO(task.due_date), new Date())
  if (task.priority === 'high' && days <= 2) return 'do'
  if (task.priority === 'high' || task.priority === 'medium') return 'plan'
  if (days <= 1) return 'delegate'
  return 'later'
}

function heatColor(minutes: number) {
  if (minutes >= 120) return 'bg-emerald-400'
  if (minutes >= 75) return 'bg-emerald-500/80'
  if (minutes >= 35) return 'bg-emerald-300/80'
  if (minutes > 0) return 'bg-emerald-200'
  return 'bg-white/12 dark:bg-white/10'
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const profile = loadFocusProfile()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [tasks, setTasks] = useState<TaskWithSubject[]>([])
  const [plans, setPlans] = useState<PlanWithSubject[]>([])
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    if (!user) {
      const id = window.setTimeout(() => setLoading(false), 0)
      return () => window.clearTimeout(id)
    }

    let ignore = false
    async function fetchData() {
      setLoading(true)
      const [subjectRes, taskRes, planRes] = await Promise.all([
        supabase.from('subjects').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(6),
        supabase
          .from('tasks')
          .select('*, subject:subjects(*)')
          .eq('user_id', user!.id)
          .order('due_date', { ascending: true })
          .limit(40),
        supabase
          .from('study_plans')
          .select('*, subject:subjects(*)')
          .eq('user_id', user!.id)
          .order('exam_date', { ascending: true })
          .limit(3),
      ])

      if (ignore) return
      setSubjects((subjectRes.data ?? []) as Subject[])
      setTasks((taskRes.data ?? []) as TaskWithSubject[])
      setPlans((planRes.data ?? []) as PlanWithSubject[])
      setLoading(false)
    }

    fetchData().catch((error) => {
      console.error('Dashboard data failed to load', error)
      setLoading(false)
    })

    return () => {
      ignore = true
    }
  }, [supabase, user])

  const firstName = user?.user_metadata?.display_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Student'
  const activeEnvironment = getStudyEnvironment(profile.activeEnvironmentId)
  const level = getLevelInfo(profile.xp)
  const history = getRecentHistory(profile, 35)
  const week = history.slice(-7)
  const weeklyMinutes = week.reduce((sum, day) => sum + day.minutes, 0)
  const completedTasks = tasks.filter((task) => task.status === 'completed').length
  const todayTasks = tasks.filter((task) => isToday(parseISO(task.due_date)))
  const openTasks = tasks.filter((task) => task.status !== 'completed')
  const nextPlan = plans[0]
  const nextExamDays = nextPlan ? Math.max(0, differenceInDays(parseISO(nextPlan.exam_date), new Date())) : null
  const maxDayMinutes = Math.max(60, ...week.map((day) => day.minutes))

  const matrixTasks = useMemo(() => {
    return openTasks.reduce<Record<string, TaskWithSubject[]>>(
      (acc, task) => {
        acc[taskBucket(task)].push(task)
        return acc
      },
      { do: [], plan: [], delegate: [], later: [] }
    )
  }, [openTasks])

  if (loading) {
    return (
      <div className="grid min-h-[70vh] place-items-center text-white">
        <div className="rounded-3xl border border-white/10 bg-white/10 px-5 py-4 text-sm font-semibold backdrop-blur-xl">
          Loading workspace
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 text-slate-950 dark:text-white">
      <section className="relative overflow-hidden rounded-[32px] border border-white/12 bg-[#07120f] p-5 text-white shadow-[0_28px_90px_rgba(0,0,0,0.28)] sm:p-7 lg:p-8">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: `url(${activeEnvironment.image})` }}
        />
        <div className="absolute inset-0" style={{ background: activeEnvironment.tint }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.22),transparent_28%),linear-gradient(90deg,rgba(0,0,0,0.34),transparent)]" />

        <div className="relative grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-white/80 backdrop-blur-xl">
              <Sparkles className="h-3.5 w-3.5 text-emerald-200" />
              {activeEnvironment.name} workspace
            </div>
            <h1 className="max-w-3xl text-3xl font-black leading-tight tracking-tight sm:text-5xl">
              Good focus window, {firstName}.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
              Your timer, tasks, notes, analytics, and streaks now share one premium command center optimized for desktop and Android.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard/timer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-black text-emerald-950 shadow-xl transition hover:-translate-y-0.5">
                <Timer className="h-4 w-4" />
                Start focus session
              </Link>
              <Link href="/dashboard/timer?focus=deep" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 text-sm font-black text-white backdrop-blur-xl transition hover:bg-white/16">
                <Focus className="h-4 w-4" />
                Deep focus mode
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Level', value: level.level, icon: Trophy, sub: `${level.progress}% to next` },
              { label: 'Streak', value: profile.streak, icon: Flame, sub: `${profile.bestStreak} best` },
              { label: 'This week', value: `${Math.round(weeklyMinutes / 60)}h`, icon: BarChart3, sub: `${profile.sessions} sessions total` },
              { label: 'Tasks', value: `${completedTasks}/${tasks.length}`, icon: CheckCircle2, sub: `${openTasks.length} open` },
            ].map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-white/12 bg-white/10 p-4 backdrop-blur-2xl">
                <stat.icon className="mb-4 h-5 w-5 text-emerald-200" />
                <p className="text-2xl font-black">{stat.value}</p>
                <p className="mt-1 text-xs font-semibold text-white/55">{stat.label} - {stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="rounded-[28px] border border-white/70 bg-white/82 p-5 shadow-xl shadow-emerald-950/5 backdrop-blur-2xl dark:border-white/10 dark:bg-white/8">
              <div className="flex items-center justify-between">
                <p className="text-sm font-black">Weekly focus trend</p>
                <LineChart className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="mt-6 flex h-36 items-end gap-2">
                {week.map((day) => (
                  <div key={day.date} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex h-28 w-full items-end rounded-full bg-slate-100 p-1 dark:bg-white/10">
                      <div
                        className="w-full rounded-full bg-gradient-to-t from-emerald-500 to-cyan-300 transition-all duration-700"
                        style={{ height: `${Math.max(6, (day.minutes / maxDayMinutes) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">{format(parseISO(day.date), 'EEE')}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/70 bg-white/82 p-5 shadow-xl shadow-emerald-950/5 backdrop-blur-2xl dark:border-white/10 dark:bg-white/8">
              <div className="flex items-center justify-between">
                <p className="text-sm font-black">Productivity heatmap</p>
                <Layers3 className="h-5 w-5 text-cyan-500" />
              </div>
              <div className="mt-6 grid grid-cols-7 gap-1.5">
                {history.map((day) => (
                  <div
                    key={day.date}
                    title={`${day.date}: ${day.minutes} minutes`}
                    className={cn('aspect-square rounded-md ring-1 ring-black/5 transition hover:scale-110', heatColor(day.minutes))}
                  />
                ))}
              </div>
              <p className="mt-5 text-xs font-semibold text-slate-500 dark:text-white/50">Last 35 days - darker means more focused time.</p>
            </div>

            <div className="rounded-[28px] border border-white/70 bg-white/82 p-5 shadow-xl shadow-emerald-950/5 backdrop-blur-2xl dark:border-white/10 dark:bg-white/8">
              <div className="flex items-center justify-between">
                <p className="text-sm font-black">XP and unlocks</p>
                <Medal className="h-5 w-5 text-amber-500" />
              </div>
              <p className="mt-5 text-4xl font-black">{profile.xp}<span className="text-base text-slate-400"> XP</span></p>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400" style={{ width: `${level.progress}%` }} />
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {(profile.badges.length ? profile.badges : ['Starter focus']).slice(0, 4).map((badge) => (
                  <span key={badge} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-white/10 dark:text-white/70">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/70 bg-white/82 p-5 shadow-xl shadow-emerald-950/5 backdrop-blur-2xl dark:border-white/10 dark:bg-white/8">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black">Smart task prioritization</h2>
                <p className="text-sm text-slate-500 dark:text-white/50">Eisenhower buckets generated from priority and deadline proximity.</p>
              </div>
              <Link href="/dashboard/tasks" className="hidden items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-bold text-white sm:inline-flex dark:bg-white dark:text-slate-950">
                Manage <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {matrix.map((item) => (
                <div key={item.key} className={cn('min-h-40 rounded-3xl bg-slate-50 p-4 ring-1 dark:bg-black/18', item.ring)}>
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="font-black">{item.label}</p>
                      <p className="text-xs font-semibold text-slate-500 dark:text-white/45">{item.help}</p>
                    </div>
                    <span className={cn('h-3 w-3 rounded-full', item.color)} />
                  </div>
                  <div className="space-y-2">
                    {(matrixTasks[item.key] ?? []).slice(0, 3).map((task) => (
                      <div key={task.id} className="rounded-2xl bg-white p-3 text-sm shadow-sm dark:bg-white/8">
                        <p className="truncate font-bold">{task.title}</p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-white/45">{format(parseISO(task.due_date), 'MMM d')} - {task.priority}</p>
                      </div>
                    ))}
                    {(matrixTasks[item.key] ?? []).length === 0 && (
                      <p className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm font-semibold text-slate-400 dark:border-white/10">No tasks here.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-[28px] border border-white/12 bg-[#081411] p-5 text-white shadow-2xl shadow-black/20">
            <div className="flex items-center justify-between">
              <h2 className="font-black">Today</h2>
              <Clock3 className="h-5 w-5 text-emerald-300" />
            </div>
            <div className="mt-5 space-y-3">
              {todayTasks.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-white/12 p-5 text-center text-sm font-semibold text-white/45">No due tasks today.</div>
              ) : todayTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center gap-3 rounded-3xl bg-white/8 p-3">
                  <div className={cn('flex h-9 w-9 items-center justify-center rounded-2xl', task.status === 'completed' ? 'bg-emerald-300 text-emerald-950' : 'bg-white/10 text-white/50')}>
                    <ListChecks className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{task.title}</p>
                    <p className="text-xs text-white/45">{task.subject?.name || 'General'} - {task.priority}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/70 bg-white/82 p-5 shadow-xl shadow-emerald-950/5 backdrop-blur-2xl dark:border-white/10 dark:bg-white/8">
            <h2 className="font-black">Next exam</h2>
            {nextPlan ? (
              <div className="mt-5">
                <p className="text-2xl font-black">{nextPlan.title}</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-white/50">
                  {nextPlan.subject?.name || 'Study plan'} - {nextExamDays === 0 ? 'Today' : `${nextExamDays} days left`}
                </p>
                <Link href="/dashboard/planner" className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-black text-white">
                  Open planner <CalendarDays className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="mt-5 rounded-3xl border border-dashed border-slate-200 p-5 text-sm font-semibold text-slate-500 dark:border-white/10 dark:text-white/45">
                Create a plan to see exam countdowns here.
              </div>
            )}
          </div>

          <div className="rounded-[28px] border border-white/70 bg-white/82 p-5 shadow-xl shadow-emerald-950/5 backdrop-blur-2xl dark:border-white/10 dark:bg-white/8">
            <div className="flex items-center justify-between">
              <h2 className="font-black">Quick actions</h2>
              <Zap className="h-5 w-5 text-amber-500" />
            </div>
            <div className="mt-5 grid gap-3">
              {[
                { href: '/dashboard/tasks', label: 'Add task', icon: Plus },
                { href: '/dashboard/notes', label: 'Capture notes', icon: BookOpen },
                { href: '/dashboard/timer', label: 'Ambient focus', icon: Music2 },
                { href: '/dashboard/timer?focus=deep', label: 'Lock deep mode', icon: Lock },
              ].map((action) => (
                <Link key={action.href} href={action.href} className="flex min-h-12 items-center justify-between rounded-2xl bg-slate-100 px-4 text-sm font-black transition hover:-translate-y-0.5 dark:bg-white/10">
                  <span className="flex items-center gap-2"><action.icon className="h-4 w-4 text-emerald-500" /> {action.label}</span>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {subjects.slice(0, 4).map((subject) => (
              <div key={subject.id} className="rounded-3xl border border-white/70 bg-white/75 p-4 dark:border-white/10 dark:bg-white/8">
                <Target className="mb-4 h-5 w-5" style={{ color: subject.color }} />
                <p className="truncate text-sm font-black">{subject.name}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-white/45">Active track</p>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </div>
  )
}
