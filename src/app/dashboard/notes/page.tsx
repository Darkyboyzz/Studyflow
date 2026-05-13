'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Pencil, Trash2, StickyNote, Loader2, Eye } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import type { Note, Subject } from '@/lib/types/database'
import { toast } from 'sonner'

// Simple markdown-like rendering
function renderContent(content: string) {
  return content
    .split('\n')
    .map((line, i) => {
      // Headers
      if (line.startsWith('### ')) return <h3 key={i} className="text-base font-semibold mt-3 mb-1">{line.slice(4)}</h3>
      if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-semibold mt-4 mb-1">{line.slice(3)}</h2>
      if (line.startsWith('# ')) return <h1 key={i} className="text-xl font-bold mt-4 mb-2">{line.slice(2)}</h1>
      // Bold
      let processed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Code
      processed = processed.replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
      // List items
      if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc text-sm" dangerouslySetInnerHTML={{ __html: processed.slice(2) }} />
      // Empty lines
      if (line.trim() === '') return <br key={i} />
      return <p key={i} className="text-sm" dangerouslySetInnerHTML={{ __html: processed }} />
    })
}

export default function NotesPage() {
  const { user } = useAuth()
  const [notes, setNotes] = useState<Note[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [viewingNote, setViewingNote] = useState<Note | null>(null)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [form, setForm] = useState({ title: '', content: '', subject_id: '' })
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (!user) return
    fetchData()
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchData = async () => {
    const [notesRes, subjectsRes] = await Promise.all([
      supabase
        .from('notes')
        .select('*')
        .eq('user_id', user!.id)
        .order('updated_at', { ascending: false }),
      supabase
        .from('subjects')
        .select('*')
        .eq('user_id', user!.id),
    ])

    if (notesRes.data) setNotes(notesRes.data)
    if (subjectsRes.data) setSubjects(subjectsRes.data)
    setLoading(false)
  }

  const openCreateDialog = () => {
    setEditingNote(null)
    setForm({ title: '', content: '', subject_id: '' })
    setDialogOpen(true)
  }

  const openEditDialog = (note: Note) => {
    setEditingNote(note)
    setForm({ title: note.title, content: note.content || '', subject_id: note.subject_id || '' })
    setDialogOpen(true)
  }

  const openViewDialog = (note: Note) => {
    setViewingNote(note)
    setViewDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error('Note title is required')
      return
    }
    setSaving(true)

    const payload = {
      title: form.title,
      content: form.content || null,
      subject_id: form.subject_id || null,
      updated_at: new Date().toISOString(),
    }

    if (editingNote) {
      const { error } = await supabase
        .from('notes')
        .update(payload)
        .eq('id', editingNote.id)

      if (error) {
        toast.error('Failed to update note')
        setSaving(false)
        return
      }
      toast.success('Note updated')
    } else {
      const { error } = await supabase
        .from('notes')
        .insert({ ...payload, user_id: user!.id })

      if (error) {
        toast.error('Failed to create note')
        setSaving(false)
        return
      }
      toast.success('Note created')
    }

    setSaving(false)
    setDialogOpen(false)
    fetchData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this note?')) return
    const { error } = await supabase.from('notes').delete().eq('id', id)
    if (error) {
      toast.error('Failed to delete note')
      return
    }
    toast.success('Note deleted')
    setNotes(notes.filter((n) => n.id !== id))
  }

  const getSubject = (subjectId: string | null) => {
    if (!subjectId) return null
    return subjects.find((s) => s.id === subjectId)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notes</h1>
          <p className="text-muted-foreground">Take and organize your study notes</p>
        </div>
        <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              New Note
            </Button>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingNote ? 'Edit Note' : 'Create Note'}</DialogTitle>
              <DialogDescription>
                {editingNote ? 'Update your note' : 'Write a new note. You can use basic markdown formatting.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="noteTitle">Title</Label>
                  <Input
                    id="noteTitle"
                    placeholder="e.g., Chapter 5 Summary"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subject (optional)</Label>
                  <Select value={form.subject_id || 'none'} onValueChange={(v: string | null) => setForm({ ...form, subject_id: !v || v === 'none' ? '' : v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No subject</SelectItem>
                      {subjects.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="noteContent">Content</Label>
                <Textarea
                  id="noteContent"
                  placeholder="Write your notes here... Use **bold**, *italic*, # headings, - lists"
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingNote ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {notes.length === 0 ? (
        <Card className="border-dashed border-2 border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <StickyNote className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No notes yet</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
              Start taking notes for your subjects. Use markdown formatting for better organization.
            </p>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Create Note
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => {
            const subject = getSubject(note.subject_id)
            return (
              <Card
                key={note.id}
                className="group relative overflow-hidden border-border/50 transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                onClick={() => openViewDialog(note)}
              >
                {subject && (
                  <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: subject.color }} />
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base line-clamp-1">{note.title}</CardTitle>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openViewDialog(note)}>
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditDialog(note)}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(note.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  {subject && (
                    <Badge variant="outline" className="text-xs w-fit" style={{ borderColor: subject.color, color: subject.color }}>
                      {subject.name}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {note.content || 'No content'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-3">
                    Updated {format(parseISO(note.updated_at), 'MMM d, yyyy')}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {viewingNote && (
            <>
              <DialogHeader>
                <DialogTitle>{viewingNote.title}</DialogTitle>
                <DialogDescription>
                  {viewingNote.subject_id && getSubject(viewingNote.subject_id) && (
                    <Badge variant="outline" className="mr-2" style={{ borderColor: getSubject(viewingNote.subject_id)!.color, color: getSubject(viewingNote.subject_id)!.color }}>
                      {getSubject(viewingNote.subject_id)!.name}
                    </Badge>
                  )}
                  Updated {format(parseISO(viewingNote.updated_at), 'MMM d, yyyy h:mm a')}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 prose prose-sm dark:prose-invert max-w-none">
                {viewingNote.content ? renderContent(viewingNote.content) : (
                  <p className="text-muted-foreground italic">No content</p>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
