'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Beaker,
  BookOpen,
  Calculator,
  CheckCircle2,
  FileText,
  Loader2,
  MoreVertical,
  Plus,
  Sparkles,
  Terminal,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

type SubjectQueryRow = SubjectCard & {
  tasks?: { count: number }[]
  notes?: { count: number }[]
}

type SubjectCard = {
  id: string
  name: string
  description: string | null
  color: string
  created_at: string
  task_count?: number
  note_count?: number
}

const COLORS = [
  { name: 'Emerald', value: '#10b981' },
  { name: 'Sky', value: '#0ea5e9' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Slate', value: '#334155' },
]

function getIcon(name: string) {
  const value = name.toLowerCase()
  if (value.includes('math')) return Calculator
  if (value.includes('bio') || value.includes('science') || value.includes('chem')) return Beaker
  if (value.includes('comp') || value.includes('code')) return Terminal
  return BookOpen
}

export default function SubjectsPage() {
  const { user } = useAuth()
  const [subjects, setSubjects] = useState<SubjectCard[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', color: COLORS[0].value })
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    if (!user) {
      const id = window.setTimeout(() => setLoading(false), 0)
      return () => window.clearTimeout(id)
    }

    let ignore = false
    async function fetchSubjects() {
      setLoading(true)
      const { data, error } = await supabase
        .from('subjects')
        .select('*, tasks:tasks(count), notes:notes(count)')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })

      if (ignore) return
      if (error) {
        toast.error('Failed to load subjects')
        setSubjects([])
      } else {
        setSubjects(((data ?? []) as SubjectQueryRow[]).map((subject) => ({
          ...subject,
          task_count: subject.tasks?.[0]?.count ?? 0,
          note_count: subject.notes?.[0]?.count ?? 0,
        })))
      }
      setLoading(false)
    }

    fetchSubjects().catch((error) => {
      console.error('Failed to load subjects', error)
      setLoading(false)
    })

    return () => {
      ignore = true
    }
  }, [supabase, user])

  const handleCreate = async () => {
    if (!form.name.trim()) return toast.error('Subject name is required')
    if (!user) return

    setSaving(true)
    const { data, error } = await supabase
      .from('subjects')
      .insert({
        user_id: user.id,
        name: form.name,
        description: form.description,
        color: form.color,
      })
      .select()
      .single()

    if (error) {
      toast.error('Failed to create subject')
    } else {
      toast.success('Subject created')
      setSubjects((current) => [{ ...data, task_count: 0, note_count: 0 }, ...current])
      setCreateOpen(false)
      setForm({ name: '', description: '', color: COLORS[0].value })
    }
    setSaving(false)
  }

  const deleteSubject = async (id: string) => {
    if (!confirm('Delete this subject?')) return
    const { error } = await supabase.from('subjects').delete().eq('id', id)
    if (!error) setSubjects((current) => current.filter((subject) => subject.id !== id))
  }

  return (
    <div className="space-y-6 text-slate-950 dark:text-white">
      <section className="relative overflow-hidden rounded-[32px] border border-white/12 bg-[#081411] p-5 text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-7">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_0%,rgba(52,211,153,0.23),transparent_30%),radial-gradient(circle_at_88%_12%,rgba(139,92,246,0.2),transparent_28%)]" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-xs font-bold text-white/70">
              <Sparkles className="h-3.5 w-3.5 text-emerald-200" />
              Organized study tracks
            </div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Subjects</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/62">
              Keep every class, task, and note visually organized with clear subject accents.
            </p>
          </div>
          <button onClick={() => setCreateOpen(true)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-black text-emerald-950 shadow-xl transition hover:-translate-y-0.5">
            <Plus className="h-4 w-4" />
            Add subject
          </button>
        </div>
      </section>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md rounded-[32px] border border-white/10 bg-[#081411] p-6 text-white shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black">Add subject</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-[0.16em] text-white/45">Name</Label>
              <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Mathematics" className="h-12 rounded-2xl border-white/10 bg-white/10 text-white placeholder:text-white/30" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-[0.16em] text-white/45">Description</Label>
              <Textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Brief details..." className="min-h-28 rounded-2xl border-white/10 bg-white/10 text-white placeholder:text-white/30" />
            </div>
            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-[0.16em] text-white/45">Accent</Label>
              <div className="flex flex-wrap gap-3">
                {COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setForm({ ...form, color: color.value })}
                    className={cn('h-10 w-10 rounded-2xl border-2 transition hover:scale-105', form.color === color.value ? 'border-white scale-105' : 'border-white/10')}
                    style={{ backgroundColor: color.value }}
                    aria-label={color.name}
                  />
                ))}
              </div>
            </div>
            <button onClick={handleCreate} disabled={saving} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-sm font-black text-emerald-950 disabled:opacity-50">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Save subject
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="rounded-[32px] border border-white/70 bg-white/82 p-10 text-center text-sm font-semibold text-slate-400 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-white/8">Loading subjects...</div>
      ) : subjects.length === 0 ? (
        <div className="rounded-[32px] border border-dashed border-white/70 bg-white/82 p-12 text-center shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-white/8">
          <BookOpen className="mx-auto mb-4 h-10 w-10 text-slate-300" />
          <h2 className="text-2xl font-black">No subjects yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-white/45">Add your first subject to organize notes, tasks, and plans.</p>
        </div>
      ) : (
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {subjects.map((subject, index) => {
            const Icon = getIcon(subject.name)
            const completion = Math.min(100, (subject.task_count ?? 0) * 12 + (subject.note_count ?? 0) * 7)
            return (
              <div key={subject.id} className="group relative overflow-hidden rounded-[32px] border border-white/70 bg-white/82 p-5 shadow-xl shadow-emerald-950/5 backdrop-blur-2xl transition hover:-translate-y-1 dark:border-white/10 dark:bg-white/8">
                <div className="absolute inset-x-0 top-0 h-1.5" style={{ backgroundColor: subject.color }} />
                <div className="flex items-start justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl" style={{ backgroundColor: `${subject.color}20`, color: subject.color }}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <button onClick={() => deleteSubject(subject.id)} className="grid h-10 w-10 place-items-center rounded-2xl text-slate-400 transition hover:bg-red-50 hover:text-red-500">
                    {index % 2 === 0 ? <MoreVertical className="h-5 w-5" /> : <Trash2 className="h-4 w-4" />}
                  </button>
                </div>
                <h3 className="mt-5 truncate text-lg font-black">{subject.name}</h3>
                <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500 dark:text-white/45">{subject.description || 'No description added yet.'}</p>
                <div className="mt-6 grid grid-cols-2 gap-2">
                  <div className="rounded-2xl bg-slate-100 p-3 dark:bg-black/18">
                    <CheckCircle2 className="mb-2 h-4 w-4 text-emerald-500" />
                    <p className="text-lg font-black">{subject.task_count ?? 0}</p>
                    <p className="text-[10px] font-bold uppercase text-slate-500 dark:text-white/45">Tasks</p>
                  </div>
                  <div className="rounded-2xl bg-slate-100 p-3 dark:bg-black/18">
                    <FileText className="mb-2 h-4 w-4 text-cyan-500" />
                    <p className="text-lg font-black">{subject.note_count ?? 0}</p>
                    <p className="text-[10px] font-bold uppercase text-slate-500 dark:text-white/45">Notes</p>
                  </div>
                </div>
                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-[11px] font-black uppercase text-slate-400">
                    <span>Track</span>
                    <span>{completion}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                    <div className="h-full rounded-full transition-all" style={{ width: `${completion}%`, backgroundColor: subject.color }} />
                  </div>
                </div>
              </div>
            )
          })}
        </section>
      )}
    </div>
  )
}
