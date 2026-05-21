'use client'

import { useEffect, useMemo, useState } from 'react'
import { format, parseISO } from 'date-fns'
import {
  Bold,
  FileText,
  Italic,
  List,
  ListOrdered,
  MoreVertical,
  Plus,
  Search,
  Share2,
  Sparkles,
  StickyNote,
  Underline,
} from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { cn } from '@/lib/utils'
import type { Note, Subject } from '@/lib/types/database'

type NoteWithSubject = Note & {
  subject?: Subject | null
}

export default function NotesPage() {
  const { user } = useAuth()
  const [notes, setNotes] = useState<NoteWithSubject[]>([])
  const [activeNote, setActiveNote] = useState<NoteWithSubject | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    if (!user) {
      const id = window.setTimeout(() => setLoading(false), 0)
      return () => window.clearTimeout(id)
    }

    let ignore = false
    async function fetchNotes() {
      setLoading(true)
      const { data } = await supabase
        .from('notes')
        .select('*, subject:subjects(*)')
        .eq('user_id', user!.id)
        .order('updated_at', { ascending: false })

      if (ignore) return
      const nextNotes = (data ?? []) as NoteWithSubject[]
      setNotes(nextNotes)
      setActiveNote(nextNotes[0] ?? null)
      setLoading(false)
    }

    fetchNotes().catch((error) => {
      console.error('Failed to load notes', error)
      setLoading(false)
    })

    return () => {
      ignore = true
    }
  }, [supabase, user])

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase()) ||
    note.content?.toLowerCase().includes(search.toLowerCase())
  )

  const createNote = async () => {
    if (!user) return toast.error('Sign in to create notes')
    setSaving(true)
    const { data, error } = await supabase
      .from('notes')
      .insert({
        user_id: user.id,
        title: 'Untitled note',
        content: '',
      })
      .select('*, subject:subjects(*)')
      .single()

    if (error) {
      toast.error(error.message)
    } else {
      const note = data as NoteWithSubject
      setNotes((current) => [note, ...current])
      setActiveNote(note)
      toast.success('Note created')
    }
    setSaving(false)
  }

  const saveActiveNote = async () => {
    if (!activeNote) return
    setSaving(true)
    const updatedAt = new Date().toISOString()
    const { error } = await supabase
      .from('notes')
      .update({
        title: activeNote.title || 'Untitled note',
        content: activeNote.content,
        updated_at: updatedAt,
      })
      .eq('id', activeNote.id)

    if (error) {
      toast.error(error.message)
    } else {
      const nextNote = { ...activeNote, updated_at: updatedAt }
      setActiveNote(nextNote)
      setNotes((current) => current.map((note) => note.id === nextNote.id ? nextNote : note))
      toast.success('Note saved')
    }
    setSaving(false)
  }

  return (
    <div className="space-y-6 text-slate-950 dark:text-white">
      <section className="relative overflow-hidden rounded-[32px] border border-white/12 bg-[#081411] p-5 text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-7">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_0%,rgba(14,165,233,0.2),transparent_32%),radial-gradient(circle_at_86%_4%,rgba(167,139,250,0.22),transparent_30%)]" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-xs font-bold text-white/70">
              <Sparkles className="h-3.5 w-3.5 text-cyan-200" />
              Focused note studio
            </div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Notes</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/62">
              Capture, search, and refine study notes in a dense editor that still feels clean on Android.
            </p>
          </div>
          <button onClick={createNote} disabled={saving} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-black text-emerald-950 shadow-xl transition hover:-translate-y-0.5 disabled:opacity-60">
            <Plus className="h-4 w-4" />
            {saving ? 'Working...' : 'New note'}
          </button>
        </div>
      </section>

      <section className="grid min-h-[720px] overflow-hidden rounded-[32px] border border-white/70 bg-white/82 shadow-xl shadow-emerald-950/5 backdrop-blur-2xl dark:border-white/10 dark:bg-white/8 lg:grid-cols-[360px_1fr]">
        <aside className="border-b border-slate-100 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-black/18 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-black">Library</p>
              <p className="text-xs font-semibold text-slate-500 dark:text-white/45">{notes.length} notes saved</p>
            </div>
            <StickyNote className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-semibold outline-none ring-cyan-300/20 transition focus:ring-4 dark:border-white/10 dark:bg-white/8"
              placeholder="Search notes..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="mt-4 flex max-h-[420px] flex-col gap-2 overflow-y-auto pr-1 lg:max-h-[610px]">
            {loading ? (
              <div className="rounded-3xl border border-dashed border-slate-200 p-8 text-center text-sm font-semibold text-slate-400 dark:border-white/10">Loading notes...</div>
            ) : filteredNotes.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 p-8 text-center dark:border-white/10">
                <FileText className="mx-auto mb-3 h-7 w-7 text-slate-300" />
                <p className="text-sm font-bold text-slate-500 dark:text-white/45">No notes found.</p>
              </div>
            ) : (
              filteredNotes.map((note) => (
                <button
                  key={note.id}
                  onClick={() => setActiveNote(note)}
                  className={cn(
                    'rounded-3xl border p-4 text-left transition hover:-translate-y-0.5',
                    activeNote?.id === note.id
                      ? 'border-emerald-200 bg-white shadow-lg shadow-emerald-950/5 dark:border-emerald-400/30 dark:bg-white/12'
                      : 'border-transparent bg-white/55 hover:bg-white dark:bg-white/5 dark:hover:bg-white/8'
                  )}
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide" style={{ backgroundColor: `${note.subject?.color || '#10b981'}20`, color: note.subject?.color || '#10b981' }}>
                      {note.subject?.name || 'General'}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">{format(parseISO(note.updated_at), 'MMM d')}</span>
                  </div>
                  <p className="truncate text-sm font-black">{note.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-white/45">{note.content || 'Empty note...'}</p>
                </button>
              ))
            )}
          </div>
        </aside>

        <main className="flex min-h-[560px] flex-col bg-white/58 dark:bg-black/10">
          {!activeNote ? (
            <div className="grid flex-1 place-items-center p-8 text-center">
              <div>
                <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-slate-100 text-slate-300 dark:bg-white/10">
                  <FileText className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-black">No note selected</h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-white/45">Select a note from the library to open the editor.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-3 border-b border-slate-100 p-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  {[Bold, Italic, Underline, List, ListOrdered].map((Icon, index) => (
                    <button key={index} className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 dark:bg-white/8 dark:text-white/55 dark:hover:bg-white/12">
                      <Icon className="h-4 w-4" />
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={saveActiveNote} disabled={saving} className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-60 dark:bg-emerald-400/10 dark:text-emerald-200">
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button className="inline-flex h-10 items-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-black text-white dark:bg-white dark:text-slate-950">
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                  <button className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-white/8">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 sm:p-8 lg:p-10">
                <input
                  className="w-full border-none bg-transparent text-3xl font-black tracking-tight outline-none placeholder:text-slate-300 sm:text-5xl"
                  placeholder="Note title"
                  value={activeNote.title}
                  onChange={(event) => setActiveNote({ ...activeNote, title: event.target.value })}
                />
                <textarea
                  className="mt-8 min-h-[420px] w-full resize-none border-none bg-transparent text-base font-medium leading-8 text-slate-700 outline-none placeholder:text-slate-300 dark:text-white/72"
                  placeholder="Start typing your notes here..."
                  value={activeNote.content || ''}
                  onChange={(event) => setActiveNote({ ...activeNote, content: event.target.value })}
                />
              </div>
            </>
          )}
        </main>
      </section>
    </div>
  )
}
