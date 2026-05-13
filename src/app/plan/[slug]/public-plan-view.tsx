'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, CalendarDays, ArrowRight } from 'lucide-react'
import { format, parseISO, differenceInDays } from 'date-fns'
import type { StudyPlan, StudyPlanItem } from '@/lib/types/database'

interface Props {
  plan: StudyPlan
  items: StudyPlanItem[]
}

export function PublicPlanView({ plan, items }: Props) {
  const daysLeft = differenceInDays(parseISO(plan.exam_date), new Date())
  const completed = items.filter((i) => i.is_completed).length
  const progress = items.length > 0 ? Math.round((completed / items.length) * 100) : 0

  // Group items by date
  const groupedItems: Record<string, StudyPlanItem[]> = {}
  items.forEach((item) => {
    if (!groupedItems[item.scheduled_date]) {
      groupedItems[item.scheduled_date] = []
    }
    groupedItems[item.scheduled_date].push(item)
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookOpen className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold gradient-text">StudyFlow</span>
          </Link>
          <Button asChild size="sm">
            <Link href="/signup">
              Create Your Own
              <ArrowRight className="ml-2 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Plan Header */}
        <div className="mb-8">
          <Badge variant="outline" className="mb-3 text-primary border-primary/30">
            <CalendarDays className="mr-1 h-3 w-3" />
            Shared Study Plan
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">{plan.title}</h1>
          <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground">
            <span>Exam: {format(parseISO(plan.exam_date), 'MMMM d, yyyy')}</span>
            <span>•</span>
            <Badge variant={daysLeft <= 3 ? 'destructive' : 'secondary'}>
              {daysLeft <= 0 ? 'Exam passed' : `${daysLeft} days left`}
            </Badge>
          </div>

          {/* Progress */}
          <div className="mt-4 max-w-md">
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-muted-foreground">{completed}/{items.length} topics completed</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="space-y-6">
          {Object.entries(groupedItems).map(([date, dateItems]) => (
            <div key={date}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                {format(parseISO(date), 'EEEE, MMMM d')}
              </h3>
              <div className="space-y-2">
                {dateItems.map((item) => (
                  <Card key={item.id} className={`border-border/50 ${item.is_completed ? 'opacity-60' : ''}`}>
                    <CardContent className="py-3 flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${item.is_completed ? 'bg-green-500' : 'bg-muted-foreground/30'}`} />
                      <span className={`text-sm ${item.is_completed ? 'line-through text-muted-foreground' : ''}`}>
                        {item.topic}
                      </span>
                      {item.is_completed && (
                        <Badge variant="secondary" className="text-xs ml-auto">Done</Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Card className="mt-12 border-primary/20 bg-primary/5">
          <CardContent className="py-8 text-center">
            <h2 className="text-xl font-bold mb-2">Create your own study plan</h2>
            <p className="text-muted-foreground mb-4">
              Join StudyFlow for free and start organizing your studies today.
            </p>
            <Button asChild size="lg">
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
