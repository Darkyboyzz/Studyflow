'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  ClipboardCheck,
  CalendarDays,
  AlertTriangle,
  Flame,
  Timer,
  BookOpen,
} from 'lucide-react'
import { format, differenceInDays, isPast, isToday, isFuture, parseISO } from 'date-fns'
import type { Task, StudyPlan } from '@/lib/types/database'
import { toast } from 'sonner'

export default function DashboardPage() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [plans, setPlans] = useState<StudyPlan[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!user) return
    fetchData()
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchData = async () => {
    const [tasksRes, plansRes] = await Promise.all([
      supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user!.id)
        .order('due_date', { ascending: true }),
      supabase
        .from('study_plans')
        .select('*')
        .eq('user_id', user!.id)
        .order('exam_date', { ascending: true }),
    ])

    if (tasksRes.data) setTasks(tasksRes.data)
    if (plansRes.data) setPlans(plansRes.data)
    setLoading(false)
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
    if (newStatus === 'completed') {
      toast.success('Task completed! 🎉')
    }
  }

  const todayTasks = tasks.filter(
    (t) => t.status === 'pending' && isToday(parseISO(t.due_date))
  )
  const overdueTasks = tasks.filter(
    (t) => t.status === 'pending' && isPast(parseISO(t.due_date)) && !isToday(parseISO(t.due_date))
  )
  const upcomingTasks = tasks.filter(
    (t) => t.status === 'pending' && isFuture(parseISO(t.due_date)) && !isToday(parseISO(t.due_date))
  ).slice(0, 5)

  const upcomingExams = plans.filter((p) => isFuture(parseISO(p.exam_date)) || isToday(parseISO(p.exam_date)))

  const priorityColor = (p: string) => {
    switch (p) {
      case 'high': return 'text-red-500 bg-red-500/10'
      case 'medium': return 'text-yellow-500 bg-yellow-500/10'
      default: return 'text-green-500 bg-green-500/10'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {user?.user_metadata?.display_name?.split(' ')[0] || 'Student'} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s your study overview for {format(new Date(), 'EEEE, MMMM d')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                <ClipboardCheck className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{todayTasks.length}</p>
                <p className="text-sm text-muted-foreground">Due Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10">
                <CalendarDays className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{upcomingTasks.length}</p>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{overdueTasks.length}</p>
                <p className="text-sm text-muted-foreground">Overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
                <Flame className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-primary" />
              Today&apos;s Tasks
            </CardTitle>
            <CardDescription>Tasks due today</CardDescription>
          </CardHeader>
          <CardContent>
            {todayTasks.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No tasks due today. Enjoy your day! 🌟</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      checked={task.status === 'completed'}
                      onCheckedChange={() => toggleTask(task)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{task.title}</p>
                    </div>
                    <Badge variant="secondary" className={`text-xs ${priorityColor(task.priority)}`}>
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Overdue Tasks */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Overdue Tasks
            </CardTitle>
            <CardDescription>Tasks past their due date</CardDescription>
          </CardHeader>
          <CardContent>
            {overdueTasks.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No overdue tasks. Great job! ✅</p>
              </div>
            ) : (
              <div className="space-y-3">
                {overdueTasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-destructive/20 bg-destructive/5 hover:bg-destructive/10 transition-colors"
                  >
                    <Checkbox
                      checked={task.status === 'completed'}
                      onCheckedChange={() => toggleTask(task)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{task.title}</p>
                      <p className="text-xs text-destructive">
                        {differenceInDays(new Date(), parseISO(task.due_date))} days overdue
                      </p>
                    </div>
                    <Badge variant="secondary" className={`text-xs ${priorityColor(task.priority)}`}>
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-orange-500" />
              Upcoming Deadlines
            </CardTitle>
            <CardDescription>Tasks due in the next few days</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingTasks.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No upcoming deadlines. All clear! 🎉</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      checked={task.status === 'completed'}
                      onCheckedChange={() => toggleTask(task)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Due {format(parseISO(task.due_date), 'MMM d')}
                      </p>
                    </div>
                    <Badge variant="secondary" className={`text-xs ${priorityColor(task.priority)}`}>
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Exam Countdown */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Timer className="h-5 w-5 text-purple-500" />
              Exam Countdown
            </CardTitle>
            <CardDescription>Your upcoming exams</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingExams.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No upcoming exams. Create a study plan! 📚</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingExams.slice(0, 4).map((plan) => {
                  const daysLeft = differenceInDays(parseISO(plan.exam_date), new Date())
                  return (
                    <div
                      key={plan.id}
                      className="p-3 rounded-lg border border-border/50 bg-gradient-to-r from-primary/5 to-transparent"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{plan.title}</p>
                        <Badge
                          variant={daysLeft <= 3 ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {daysLeft === 0
                            ? 'Today!'
                            : daysLeft === 1
                            ? '1 day left'
                            : `${daysLeft} days left`}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(parseISO(plan.exam_date), 'EEEE, MMMM d, yyyy')}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
