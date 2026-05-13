import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ClipboardCheck,
  Timer,
  CalendarDays,
  StickyNote,
  Share2,
  GraduationCap,
} from 'lucide-react'

const features = [
  {
    icon: ClipboardCheck,
    title: 'Assignment Tracker',
    description:
      'Track all your assignments with priorities, due dates, and completion status. Never forget a deadline again.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Timer,
    title: 'Exam Countdown',
    description:
      'See countdown timers for upcoming exams right on your dashboard. Stay motivated and prepared.',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
  },
  {
    icon: CalendarDays,
    title: 'Study Planner',
    description:
      'Create study schedules that distribute your topics across available days. Smart planning, no AI needed.',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  {
    icon: StickyNote,
    title: 'Subject Notes',
    description:
      'Take and organize notes by subject. Simple markdown support helps you format your study materials.',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    icon: Share2,
    title: 'Shareable Study Plans',
    description:
      'Make your study plans public and share them with classmates via a simple link.',
    color: 'text-pink-500',
    bg: 'bg-pink-500/10',
  },
  {
    icon: GraduationCap,
    title: 'Subject Management',
    description:
      'Organize everything by subjects with custom colors. Keep your academic life structured and clear.',
    color: 'text-teal-500',
    bg: 'bg-teal-500/10',
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to{' '}
            <span className="gradient-text">ace your semester</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Simple, focused tools that help you stay organized and productive.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
            >
              <CardHeader>
                <div className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg} transition-transform group-hover:scale-110`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
              {/* Hover gradient line */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary to-primary/0 opacity-0 transition-opacity group-hover:opacity-100" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
