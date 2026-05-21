'use client'

import { useEffect, useMemo, useState } from 'react'
import { format, differenceInDays, parseISO } from 'date-fns'
import {
  Calendar,
  Check,
  X,
  Clock3,
  Filter,
  Grid2X2,
  Plus,
  Search,
  Trash2,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { cn } from '@/lib/utils'
import type { Subject, Task } from '@/lib/types/database'
import { toast } from 'sonner'

type TaskWithSubject = Task & {
  subject?: Subject | null
  is_completed: boolean
}

type TaskFilter = 'all' | 'pending' | 'completed'

const buckets = [
  { key: 'do', title: 'Do Now', subtitle: 'Urgent + important', tone: 'from-rose-500 to-orange-400' },
  { key: 'schedule', title: 'Schedule', subtitle: 'Important work', tone: 'from-amber-400 to-yellow-300' },
  { key: 'review', title: 'Review', subtitle: 'Urgent, lighter lift', tone: 'from-sky-400 to-cyan-300' },
  { key: 'later', title: 'Later', subtitle: 'Low urgency', tone: 'from-emerald-400 to-teal-300' },
] as const

function getBucket(task: TaskWithSubject) {
  const days = differenceInDays(parseISO(task.due_date), new Date())
  if (task.priority === 'high' && days <= 2) return 'do'
  if (task.priority === 'high' || task.priority === 'medium') return 'schedule'
  if (days <= 1) return 'review'
  return 'later'
}

export default function TasksPage() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<TaskFilter>('all')
  const [tasks, setTasks] = useState<TaskWithSubject[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    due_date: new Date().toISOString().slice(0, 10),
    priority: 'medium' as Task['priority'],
    subject_id: '',
  })
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    if (!user) {
      const id = window.setTimeout(() => setLoading(false), 0)
      return () => window.clearTimeout(id)
    }

    let ignore = false
    async function fetchTasks() {
      setLoading(true)
      const [taskRes, subjectRes] = await Promise.all([
        supabase
          .from('tasks')
          .select('*, subject:subjects(*)')
          .eq('user_id', user!.id)
          .order('due_date', { ascending: true }),
        supabase.from('subjects').select('*').eq('user_id', user!.id).order('name', { ascending: true }),
      ])

      if (ignore) return
      setTasks(((taskRes.data ?? []) as (Task & { subject?: Subject | null })[]).map((task) => ({
        ...task,
        is_completed: task.status === 'completed',
      })))
      setSubjects((subjectRes.data ?? []) as Subject[])
      setLoading(false)
    }

    fetchTasks().catch((error) => {
      console.error('Failed to load tasks', error)
      setLoading(false)
    })

    return () => {
      ignore = true
    }
  }, [supabase, user])

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase())
    if (!matchesSearch) return false
    if (filter === 'completed') return task.is_completed
    if (filter === 'pending') return !task.is_completed
    return true
  })

  const openTasks = tasks.filter((task) => !task.is_completed)
  const matrixTasks = openTasks.reduce<Record<string, TaskWithSubject[]>>(
    (acc, task) => {
      acc[getBucket(task)].push(task)
      return acc
    },
    { do: [], schedule: [], review: [], later: [] }
  )

  const toggleTask = async (task: TaskWithSubject) => {
    const newStatus = task.is_completed ? 'pending' : 'completed'
    const { error } = await supabase.from('tasks').update({ status: newStatus }).eq('id', task.id)
    if (!error) {
      setTasks((current) => current.map((item) => item.id === task.id ? { ...item, is_completed: !item.is_completed, status: newStatus } : item))
    }
  }

  const deleteTask = async (id: string) => {
    if (!confirm('Delete this task?')) return
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (!error) setTasks((current) => current.filter((task) => task.id !== id))
  }

  const createTask = async () => {
    if (!user) return toast.error('Sign in to create tasks')
    if (!form.title.trim()) return toast.error('Task title is required')
    setSaving(true)
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: user.id,
        subject_id: form.subject_id || null,
        title: form.title.trim(),
        description: form.description.trim() || null,
        due_date: form.due_date,
        priority: form.priority,
        status: 'pending',
      })
      .select('*, subject:subjects(*)')
      .single()

    if (error) {
      toast.error(error.message)
    } else {
      setTasks((current) => [...current, { ...(data as Task & { subject?: Subject | null }), is_completed: false }].sort((a, b) => a.due_date.localeCompare(b.due_date)))
      setCreateOpen(false)
      setForm({ title: '', description: '', due_date: new Date().toISOString().slice(0, 10), priority: 'medium', subject_id: '' })
      toast.success('Task created')
    }
    setSaving(false)
  }

  return (
    <div className="space-y-6 text-slate-950 dark:text-white">
      <section className="relative overflow-hidden rounded-[32px] border border-white/12 bg-[#081411] p-5 text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-7">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_0%,rgba(52,211,153,0.24),transparent_30%),radial-gradient(circle_at_86%_12%,rgba(14,165,233,0.18),transparent_28%)]" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-xs font-bold text-white/70">
              <Grid2X2 className="h-3.5 w-3.5 text-emerald-200" />
              Eisenhower priority board
            </div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Tasks and deadlines</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/62">
              Sort assignments by urgency, deadline, and priority without losing the clean list view.
            </p>
          </div>
          <button onClick={() => setCreateOpen(true)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-black text-emerald-950 shadow-xl transition hover:-translate-y-0.5">
            <Plus className="h-4 w-4" />
            New task
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {buckets.map((bucket) => (
          <div key={bucket.key} className="rounded-[28px] border border-white/70 bg-white/82 p-4 shadow-xl shadow-emerald-950/5 backdrop-blur-2xl dark:border-white/10 dark:bg-white/8">
            <div className={cn('mb-4 h-2 rounded-full bg-gradient-to-r', bucket.tone)} />
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-black">{bucket.title}</p>
                <p className="text-xs font-semibold text-slate-500 dark:text-white/45">{bucket.subtitle}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black dark:bg-white/10">
                {matrixTasks[bucket.key].length}
              </span>
            </div>
            <div className="mt-4 space-y-2">
              {matrixTasks[bucket.key].slice(0, 2).map((task) => (
                <div key={task.id} className="rounded-2xl bg-slate-50 p-3 text-sm dark:bg-black/18">
                  <p className="truncate font-bold">{task.title}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-white/45">{format(parseISO(task.due_date), 'MMM d')} - {task.priority}</p>
                </div>
              ))}
              {matrixTasks[bucket.key].length === 0 && (
                <p className="rounded-2xl border border-dashed border-slate-200 p-3 text-sm font-semibold text-slate-400 dark:border-white/10">Clear</p>
              )}
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-[32px] border border-white/70 bg-white/82 p-4 shadow-xl shadow-emerald-950/5 backdrop-blur-2xl dark:border-white/10 dark:bg-white/8 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-semibold outline-none ring-emerald-300/20 transition focus:ring-4 dark:border-white/10 dark:bg-black/18"
              placeholder="Search tasks..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="flex rounded-2xl bg-slate-100 p-1 dark:bg-black/18">
            {(['all', 'pending', 'completed'] as const).map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={cn(
                  'min-h-10 flex-1 rounded-xl px-4 text-sm font-black capitalize transition sm:flex-none',
                  filter === item ? 'bg-white text-emerald-700 shadow-sm dark:bg-white dark:text-emerald-950' : 'text-slate-500 dark:text-white/45'
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {loading ? (
            <div className="rounded-3xl border border-dashed border-slate-200 p-10 text-center text-sm font-semibold text-slate-400 dark:border-white/10">Loading tasks...</div>
          ) : filteredTasks.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 p-10 text-center dark:border-white/10">
              <Filter className="mx-auto mb-3 h-7 w-7 text-slate-300" />
              <p className="font-bold text-slate-500 dark:text-white/45">No tasks found.</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={cn(
                  'group flex items-center gap-4 rounded-3xl border p-4 transition hover:-translate-y-0.5 hover:shadow-lg',
                  task.is_completed
                    ? 'border-transparent bg-slate-50 opacity-70 dark:bg-white/5'
                    : 'border-slate-100 bg-white dark:border-white/10 dark:bg-black/18'
                )}
              >
                <button
                  onClick={() => toggleTask(task)}
                  className={cn(
                    'grid h-7 w-7 shrink-0 place-items-center rounded-xl border-2 transition',
                    task.is_completed ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-200 bg-white dark:border-white/20 dark:bg-white/5'
                  )}
                >
                  {task.is_completed && <Check className="h-4 w-4" />}
                </button>
                <div className="min-w-0 flex-1">
                  <p className={cn('truncate text-sm font-black sm:text-base', task.is_completed && 'line-through text-slate-400')}>
                    {task.title}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 dark:text-white/45">
                    {task.subject && (
                      <span className="rounded-full px-2.5 py-1" style={{ backgroundColor: `${task.subject.color}1f`, color: task.subject.color }}>
                        {task.subject.name}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {format(parseISO(task.due_date), 'MMM d, yyyy')}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-3.5 w-3.5" />
                      {task.priority}
                    </span>
                  </div>
                </div>
                <button onClick={() => deleteTask(task.id)} className="grid h-10 w-10 place-items-center rounded-2xl text-slate-400 opacity-100 transition hover:bg-red-50 hover:text-red-500 sm:opacity-0 sm:group-hover:opacity-100">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {createOpen && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-black/60 p-4 text-white backdrop-blur-xl">
          <div className="w-full max-w-lg rounded-[32px] border border-white/10 bg-[#081411] p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-white/40">Task</p>
                <h2 className="text-xl font-black">Create task</h2>
              </div>
              <button onClick={() => setCreateOpen(false)} className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-4">
              <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Task title" className="h-12 rounded-2xl border border-white/10 bg-white/10 px-4 font-semibold outline-none placeholder:text-white/35" />
              <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Description" className="min-h-24 rounded-2xl border border-white/10 bg-white/10 p-4 font-semibold outline-none placeholder:text-white/35" />
              <div className="grid gap-3 sm:grid-cols-3">
                <input type="date" value={form.due_date} onChange={(event) => setForm({ ...form, due_date: event.target.value })} className="h-12 rounded-2xl border border-white/10 bg-white/10 px-4 font-semibold outline-none" />
                <select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value as Task['priority'] })} className="h-12 rounded-2xl border border-white/10 bg-white/10 px-4 font-semibold outline-none">
                  <option className="text-slate-950" value="low">Low</option>
                  <option className="text-slate-950" value="medium">Medium</option>
                  <option className="text-slate-950" value="high">High</option>
                </select>
                <select value={form.subject_id} onChange={(event) => setForm({ ...form, subject_id: event.target.value })} className="h-12 rounded-2xl border border-white/10 bg-white/10 px-4 font-semibold outline-none">
                  <option className="text-slate-950" value="">No subject</option>
                  {subjects.map((subject) => <option className="text-slate-950" key={subject.id} value={subject.id}>{subject.name}</option>)}
                </select>
              </div>
              <button onClick={createTask} disabled={saving} className="mt-2 min-h-12 rounded-2xl bg-white text-sm font-black text-emerald-950 disabled:opacity-50">
                {saving ? 'Creating...' : 'Create task'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
