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
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { Plus, Pencil, Trash2, ClipboardCheck, Loader2 } from 'lucide-react'
import { format, isPast, isToday, isFuture, parseISO } from 'date-fns'
import type { Task, Subject } from '@/lib/types/database'
import { toast } from 'sonner'

const defaultForm = {
  title: '',
  description: '',
  subject_id: '',
  due_date: '',
  priority: 'medium' as 'low' | 'medium' | 'high',
}

export default function TasksPage() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [form, setForm] = useState(defaultForm)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (!user) return
    fetchData()
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchData = async () => {
    const [tasksRes, subjectsRes] = await Promise.all([
      supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user!.id)
        .order('due_date', { ascending: true }),
      supabase
        .from('subjects')
        .select('*')
        .eq('user_id', user!.id),
    ])

    if (tasksRes.data) setTasks(tasksRes.data)
    if (subjectsRes.data) setSubjects(subjectsRes.data)
    setLoading(false)
  }

  const openCreateDialog = () => {
    setEditingTask(null)
    setForm(defaultForm)
    setDialogOpen(true)
  }

  const openEditDialog = (task: Task) => {
    setEditingTask(task)
    setForm({
      title: task.title,
      description: task.description || '',
      subject_id: task.subject_id || '',
      due_date: task.due_date,
      priority: task.priority,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.title.trim() || !form.due_date) {
      toast.error('Title and due date are required')
      return
    }
    setSaving(true)

    const payload = {
      title: form.title,
      description: form.description || null,
      subject_id: form.subject_id || null,
      due_date: form.due_date,
      priority: form.priority,
    }

    if (editingTask) {
      const { error } = await supabase
        .from('tasks')
        .update(payload)
        .eq('id', editingTask.id)

      if (error) {
        toast.error('Failed to update task')
        setSaving(false)
        return
      }
      toast.success('Task updated')
    } else {
      const activeTasks = tasks.filter((t) => t.status === 'pending')
      if (activeTasks.length >= 20) {
        toast.error('Free plan is limited to 20 active tasks. Complete some tasks or upgrade!')
        setSaving(false)
        return
      }

      const { error } = await supabase
        .from('tasks')
        .insert({ ...payload, user_id: user!.id })

      if (error) {
        toast.error('Failed to create task')
        setSaving(false)
        return
      }
      toast.success('Task created')
    }

    setSaving(false)
    setDialogOpen(false)
    fetchData()
  }

  const toggleTask = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed'
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', task.id)

    if (error) {
      toast.error('Failed to update task')
      return
    }

    setTasks(tasks.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)))
    if (newStatus === 'completed') toast.success('Task completed! 🎉')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this task?')) return
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (error) {
      toast.error('Failed to delete task')
      return
    }
    toast.success('Task deleted')
    setTasks(tasks.filter((t) => t.id !== id))
  }

  const getSubjectName = (subjectId: string | null) => {
    if (!subjectId) return null
    return subjects.find((s) => s.id === subjectId)
  }

  const todayTasks = tasks.filter((t) => t.status === 'pending' && isToday(parseISO(t.due_date)))
  const overdueTasks = tasks.filter((t) => t.status === 'pending' && isPast(parseISO(t.due_date)) && !isToday(parseISO(t.due_date)))
  const upcomingTasks = tasks.filter((t) => t.status === 'pending' && isFuture(parseISO(t.due_date)) && !isToday(parseISO(t.due_date)))
  const completedTasks = tasks.filter((t) => t.status === 'completed')

  const priorityColor = (p: string) => {
    switch (p) {
      case 'high': return 'text-red-500 bg-red-500/10 border-red-500/20'
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
      default: return 'text-green-500 bg-green-500/10 border-green-500/20'
    }
  }

  const TaskItem = ({ task }: { task: Task }) => {
    const subject = getSubjectName(task.subject_id)
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-card hover:bg-muted/50 transition-colors group">
        <Checkbox
          checked={task.status === 'completed'}
          onCheckedChange={() => toggleTask(task)}
        />
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
            {task.title}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground">
              {format(parseISO(task.due_date), 'MMM d, yyyy')}
            </span>
            {subject && (
              <Badge variant="outline" className="text-xs py-0 h-5" style={{ borderColor: subject.color, color: subject.color }}>
                {subject.name}
              </Badge>
            )}
          </div>
        </div>
        <Badge variant="secondary" className={`text-xs ${priorityColor(task.priority)}`}>
          {task.priority}
        </Badge>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditDialog(task)}>
            <Pencil className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(task.id)}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    )
  }

  const EmptyState = ({ message }: { message: string }) => (
    <div className="text-center py-12">
      <ClipboardCheck className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks & Deadlines</h1>
          <p className="text-muted-foreground">Track your assignments and deadlines</p>
        </div>
        <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTask ? 'Edit Task' : 'Create Task'}</DialogTitle>
              <DialogDescription>
                {editingTask ? 'Update your task details' : 'Add a new task or assignment'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="taskTitle">Title</Label>
                <Input
                  id="taskTitle"
                  placeholder="e.g., Complete Chapter 5 exercises"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taskDesc">Description (optional)</Label>
                <Textarea
                  id="taskDesc"
                  placeholder="Add details..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taskDate">Due Date</Label>
                  <Input
                    id="taskDate"
                    type="date"
                    value={form.due_date}
                    onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={form.priority} onValueChange={(v: string | null) => { if (v) setForm({ ...form, priority: v as Task['priority'] }) }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingTask ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="today" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="today" className="text-xs sm:text-sm">
            Today ({todayTasks.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="text-xs sm:text-sm">
            Upcoming ({upcomingTasks.length})
          </TabsTrigger>
          <TabsTrigger value="overdue" className="text-xs sm:text-sm">
            Overdue ({overdueTasks.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-xs sm:text-sm">
            Done ({completedTasks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="mt-4">
          {todayTasks.length === 0 ? (
            <EmptyState message="No tasks due today. Enjoy your day! 🌟" />
          ) : (
            <div className="space-y-2">
              {todayTasks.map((task) => <TaskItem key={task.id} task={task} />)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="mt-4">
          {upcomingTasks.length === 0 ? (
            <EmptyState message="No upcoming tasks. You're all caught up! 🎉" />
          ) : (
            <div className="space-y-2">
              {upcomingTasks.map((task) => <TaskItem key={task.id} task={task} />)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="overdue" className="mt-4">
          {overdueTasks.length === 0 ? (
            <EmptyState message="No overdue tasks. Great job staying on track! ✅" />
          ) : (
            <div className="space-y-2">
              {overdueTasks.map((task) => <TaskItem key={task.id} task={task} />)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          {completedTasks.length === 0 ? (
            <EmptyState message="No completed tasks yet. Get started!" />
          ) : (
            <div className="space-y-2">
              {completedTasks.map((task) => <TaskItem key={task.id} task={task} />)}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <p className="text-xs text-muted-foreground text-center">
        {tasks.filter((t) => t.status === 'pending').length} / 20 active tasks (Free plan)
      </p>
    </div>
  )
}
