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
import { Separator } from '@/components/ui/separator'
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
import {
  Plus,
  CalendarDays,
  Loader2,
  Trash2,
  Share2,
  Copy,
  Eye,
} from 'lucide-react'
import { format, parseISO, addDays, differenceInDays, isBefore } from 'date-fns'
import type { Subject, StudyPlan, StudyPlanItem } from '@/lib/types/database'
import { toast } from 'sonner'

function generateSlug() {
  return Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 6)
}

function distributeTopic(topics: string[], startDate: Date, endDate: Date, studyDays: number[]): { topic: string; date: Date }[] {
  const schedule: { topic: string; date: Date }[] = []
  const availableDates: Date[] = []

  // Collect all available study dates between start and end
  let current = new Date(startDate)
  while (isBefore(current, endDate) || current.getTime() === endDate.getTime()) {
    const dayOfWeek = current.getDay()
    if (studyDays.includes(dayOfWeek)) {
      availableDates.push(new Date(current))
    }
    current = addDays(current, 1)
  }

  if (availableDates.length === 0) return []

  // Distribute topics across available dates
  const topicsPerDay = Math.ceil(topics.length / availableDates.length)
  let topicIndex = 0

  for (const date of availableDates) {
    for (let i = 0; i < topicsPerDay && topicIndex < topics.length; i++) {
      schedule.push({ topic: topics[topicIndex], date })
      topicIndex++
    }
  }

  return schedule
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
]

export default function PlannerPage() {
  const { user } = useAuth()
  const [plans, setPlans] = useState<StudyPlan[]>([])
  const [planItems, setPlanItems] = useState<Record<string, StudyPlanItem[]>>({})
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [viewPlanId, setViewPlanId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Form state
  const [form, setForm] = useState({
    title: '',
    subject_id: '',
    exam_date: '',
    topics: '',
    study_days: [1, 2, 3, 4, 5] as number[],
  })

  // Preview state
  const [preview, setPreview] = useState<{ topic: string; date: Date }[] | null>(null)

  const supabase = createClient()

  useEffect(() => {
    if (!user) return
    fetchData()
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchData = async () => {
    const [plansRes, subjectsRes] = await Promise.all([
      supabase
        .from('study_plans')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('subjects')
        .select('*')
        .eq('user_id', user!.id),
    ])

    if (plansRes.data) {
      setPlans(plansRes.data)
      // Fetch items for each plan
      for (const plan of plansRes.data) {
        const { data: items } = await supabase
          .from('study_plan_items')
          .select('*')
          .eq('plan_id', plan.id)
          .order('scheduled_date', { ascending: true })

        if (items) {
          setPlanItems((prev) => ({ ...prev, [plan.id]: items }))
        }
      }
    }
    if (subjectsRes.data) setSubjects(subjectsRes.data)
    setLoading(false)
  }

  const handleGenerate = () => {
    const topics = form.topics.split('\n').map((t) => t.trim()).filter(Boolean)
    if (!form.title || !form.exam_date || topics.length === 0) {
      toast.error('Please fill in title, exam date, and at least one topic')
      return
    }
    if (form.study_days.length === 0) {
      toast.error('Please select at least one study day')
      return
    }

    const startDate = new Date()
    const endDate = parseISO(form.exam_date)

    if (isBefore(endDate, startDate)) {
      toast.error('Exam date must be in the future')
      return
    }

    const schedule = distributeTopic(topics, startDate, endDate, form.study_days)
    if (schedule.length === 0) {
      toast.error('No available study days before the exam. Try adding more days.')
      return
    }

    setPreview(schedule)
    toast.success(`Generated schedule with ${schedule.length} study sessions!`)
  }

  const handleSave = async () => {
    if (!preview) return
    setSaving(true)

    // Check plan limits
    if (plans.length >= 5) {
      toast.error('Free plan is limited to 5 study plans. Upgrade for unlimited!')
      setSaving(false)
      return
    }

    const slug = generateSlug()
    const { data: plan, error: planError } = await supabase
      .from('study_plans')
      .insert({
        user_id: user!.id,
        title: form.title,
        subject_id: form.subject_id || null,
        exam_date: form.exam_date,
        share_slug: slug,
      })
      .select()
      .single()

    if (planError || !plan) {
      toast.error('Failed to create study plan')
      setSaving(false)
      return
    }

    const items = preview.map((item) => ({
      plan_id: plan.id,
      topic: item.topic,
      scheduled_date: format(item.date, 'yyyy-MM-dd'),
    }))

    const { error: itemsError } = await supabase
      .from('study_plan_items')
      .insert(items)

    if (itemsError) {
      toast.error('Failed to save plan items')
      setSaving(false)
      return
    }

    toast.success('Study plan saved!')
    setSaving(false)
    setCreateOpen(false)
    setPreview(null)
    setForm({ title: '', subject_id: '', exam_date: '', topics: '', study_days: [1, 2, 3, 4, 5] })
    fetchData()
  }

  const togglePublic = async (plan: StudyPlan) => {
    const { error } = await supabase
      .from('study_plans')
      .update({ is_public: !plan.is_public })
      .eq('id', plan.id)

    if (error) {
      toast.error('Failed to update plan')
      return
    }

    setPlans(plans.map((p) => (p.id === plan.id ? { ...p, is_public: !p.is_public } : p)))
    toast.success(plan.is_public ? 'Plan is now private' : 'Plan is now public!')
  }

  const copyShareLink = (slug: string) => {
    const url = `${window.location.origin}/plan/${slug}`
    navigator.clipboard.writeText(url)
    toast.success('Share link copied!')
  }

  const toggleItem = async (item: StudyPlanItem) => {
    const { error } = await supabase
      .from('study_plan_items')
      .update({ is_completed: !item.is_completed })
      .eq('id', item.id)

    if (error) {
      toast.error('Failed to update')
      return
    }

    setPlanItems((prev) => ({
      ...prev,
      [item.plan_id]: prev[item.plan_id].map((i) =>
        i.id === item.id ? { ...i, is_completed: !i.is_completed } : i
      ),
    }))
  }

  const deletePlan = async (id: string) => {
    if (!confirm('Delete this study plan?')) return
    const { error } = await supabase.from('study_plans').delete().eq('id', id)
    if (error) {
      toast.error('Failed to delete plan')
      return
    }
    toast.success('Plan deleted')
    setPlans(plans.filter((p) => p.id !== id))
    if (viewPlanId === id) setViewPlanId(null)
  }

  const toggleStudyDay = (day: number) => {
    setForm((prev) => ({
      ...prev,
      study_days: prev.study_days.includes(day)
        ? prev.study_days.filter((d) => d !== day)
        : [...prev.study_days, day].sort(),
    }))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
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
          <h1 className="text-2xl font-bold tracking-tight">Study Planner</h1>
          <p className="text-muted-foreground">Create study schedules for your exams</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Plan
            </Button>
        <Dialog open={createOpen} onOpenChange={(o) => { setCreateOpen(o); if (!o) setPreview(null) }}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Study Plan</DialogTitle>
              <DialogDescription>
                Enter your topics and study days, and we&apos;ll distribute them evenly before your exam.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Plan Title</Label>
                  <Input
                    placeholder="e.g., Math Final Prep"
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
                <Label>Exam Date</Label>
                <Input
                  type="date"
                  value={form.exam_date}
                  onChange={(e) => setForm({ ...form, exam_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Available Study Days</Label>
                <div className="flex flex-wrap gap-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <Button
                      key={day.value}
                      variant={form.study_days.includes(day.value) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleStudyDay(day.value)}
                      className="h-9 w-12"
                    >
                      {day.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Topics / Chapters (one per line)</Label>
                <Textarea
                  placeholder={"Chapter 1: Introduction\nChapter 2: Linear Algebra\nChapter 3: Calculus\nChapter 4: Statistics"}
                  value={form.topics}
                  onChange={(e) => setForm({ ...form, topics: e.target.value })}
                  rows={6}
                />
              </div>

              <Button onClick={handleGenerate} variant="secondary" className="w-full">
                Generate Schedule
              </Button>

              {preview && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Generated Schedule</h4>
                    <div className="space-y-1.5 max-h-60 overflow-y-auto">
                      {preview.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded bg-muted/50 text-sm">
                          <Badge variant="outline" className="text-xs shrink-0">
                            {format(item.date, 'MMM d')}
                          </Badge>
                          <span>{item.topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setCreateOpen(false); setPreview(null) }}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!preview || saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Plan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {plans.length === 0 ? (
        <Card className="border-dashed border-2 border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CalendarDays className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No study plans yet</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
              Create a study plan by entering your topics and exam date. We&apos;ll distribute them evenly across your study days.
            </p>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Plan
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Plan List */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Your Plans</h3>
            {plans.map((plan) => {
              const daysLeft = differenceInDays(parseISO(plan.exam_date), new Date())
              const items = planItems[plan.id] || []
              const completed = items.filter((i) => i.is_completed).length
              const progress = items.length > 0 ? Math.round((completed / items.length) * 100) : 0

              return (
                <Card
                  key={plan.id}
                  className={`cursor-pointer transition-all border-border/50 hover:shadow-md ${
                    viewPlanId === plan.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setViewPlanId(plan.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{plan.title}</CardTitle>
                      <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => togglePublic(plan)}
                          title={plan.is_public ? 'Make private' : 'Make public'}
                        >
                          <Share2 className={`h-3.5 w-3.5 ${plan.is_public ? 'text-primary' : ''}`} />
                        </Button>
                        {plan.is_public && plan.share_slug && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => copyShareLink(plan.share_slug!)}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() => deletePlan(plan.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Exam: {format(parseISO(plan.exam_date), 'MMM d, yyyy')}</span>
                      <span>•</span>
                      <Badge variant={daysLeft <= 3 ? 'destructive' : 'secondary'} className="text-xs">
                        {daysLeft <= 0 ? 'Exam passed' : `${daysLeft}d left`}
                      </Badge>
                      {plan.is_public && (
                        <Badge variant="outline" className="text-xs text-primary border-primary/30">
                          Public
                        </Badge>
                      )}
                    </div>
                    {/* Progress bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">{completed}/{items.length} topics</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Plan Detail */}
          <div>
            {viewPlanId ? (
              <Card className="border-border/50 sticky top-20">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {plans.find((p) => p.id === viewPlanId)?.title}
                  </CardTitle>
                  <CardDescription>Check off topics as you study</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                    {(planItems[viewPlanId] || []).map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center gap-3 p-2.5 rounded-lg border transition-colors ${
                          item.is_completed
                            ? 'bg-primary/5 border-primary/10'
                            : 'border-border/50 hover:bg-muted/50'
                        }`}
                      >
                        <Checkbox
                          checked={item.is_completed}
                          onCheckedChange={() => toggleItem(item)}
                        />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${item.is_completed ? 'line-through text-muted-foreground' : ''}`}>
                            {item.topic}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs shrink-0">
                          {format(parseISO(item.scheduled_date), 'MMM d')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-dashed border-2 border-border/50">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Eye className="h-12 w-12 text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">Select a plan to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center">
        {plans.length} / 5 study plans (Free plan)
      </p>
    </div>
  )
}
