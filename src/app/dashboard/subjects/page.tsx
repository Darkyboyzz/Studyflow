'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Plus, Pencil, Trash2, FolderOpen, Loader2 } from 'lucide-react'
import type { Subject } from '@/lib/types/database'
import { toast } from 'sonner'

const SUBJECT_COLORS = [
  '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#ef4444', '#f97316',
  '#eab308', '#22c55e', '#14b8a6', '#06b6d4',
  '#3b82f6', '#2563eb',
]

export default function SubjectsPage() {
  const { user } = useAuth()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [form, setForm] = useState({ name: '', color: '#6366f1', description: '' })
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (!user) return
    fetchSubjects()
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchSubjects = async () => {
    const { data } = await supabase
      .from('subjects')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false })

    if (data) setSubjects(data)
    setLoading(false)
  }

  const openCreateDialog = () => {
    setEditingSubject(null)
    setForm({ name: '', color: '#6366f1', description: '' })
    setDialogOpen(true)
  }

  const openEditDialog = (subject: Subject) => {
    setEditingSubject(subject)
    setForm({ name: subject.name, color: subject.color, description: subject.description || '' })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Subject name is required')
      return
    }
    setSaving(true)

    if (editingSubject) {
      const { error } = await supabase
        .from('subjects')
        .update({ name: form.name, color: form.color, description: form.description || null })
        .eq('id', editingSubject.id)

      if (error) {
        toast.error('Failed to update subject')
        setSaving(false)
        return
      }
      toast.success('Subject updated')
    } else {
      // Check limits for free plan
      if (subjects.length >= 3) {
        toast.error('Free plan is limited to 3 subjects. Upgrade to Pro for unlimited!')
        setSaving(false)
        return
      }

      const { error } = await supabase
        .from('subjects')
        .insert({ user_id: user!.id, name: form.name, color: form.color, description: form.description || null })

      if (error) {
        toast.error('Failed to create subject')
        setSaving(false)
        return
      }
      toast.success('Subject created')
    }

    setSaving(false)
    setDialogOpen(false)
    fetchSubjects()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this subject? Tasks and notes linked to it will be unlinked.')) return

    const { error } = await supabase.from('subjects').delete().eq('id', id)
    if (error) {
      toast.error('Failed to delete subject')
      return
    }
    toast.success('Subject deleted')
    setSubjects(subjects.filter((s) => s.id !== id))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Subjects</h1>
          <p className="text-muted-foreground">Organize your courses and subjects</p>
        </div>
        <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Subject
            </Button>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSubject ? 'Edit Subject' : 'Create Subject'}</DialogTitle>
              <DialogDescription>
                {editingSubject ? 'Update your subject details' : 'Add a new subject to organize your work'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="subjectName">Name</Label>
                <Input
                  id="subjectName"
                  placeholder="e.g., Mathematics"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2">
                  {SUBJECT_COLORS.map((color) => (
                    <button
                      key={color}
                      className={`h-8 w-8 rounded-full transition-all ${
                        form.color === color
                          ? 'ring-2 ring-offset-2 ring-primary scale-110'
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setForm({ ...form, color })}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subjectDesc">Description (optional)</Label>
                <Textarea
                  id="subjectDesc"
                  placeholder="Brief description of the subject..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingSubject ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {subjects.length === 0 ? (
        <Card className="border-dashed border-2 border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FolderOpen className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No subjects yet</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
              Create your first subject to organize your tasks, notes, and study plans.
            </p>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Create Subject
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject) => (
            <Card
              key={subject.id}
              className="group relative overflow-hidden border-border/50 transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: subject.color }}
              />
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${subject.color}20` }}
                    >
                      <FolderOpen className="h-5 w-5" style={{ color: subject.color }} />
                    </div>
                    <CardTitle className="text-base">{subject.name}</CardTitle>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(subject)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(subject.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {subject.description && (
                <CardContent className="pt-0">
                  <CardDescription className="line-clamp-2">{subject.description}</CardDescription>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Limit indicator */}
      <p className="text-xs text-muted-foreground text-center">
        {subjects.length} / 3 subjects used (Free plan)
      </p>
    </div>
  )
}
