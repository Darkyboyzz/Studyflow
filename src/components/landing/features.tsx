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
    <section id="features" className="py-24 sm:py-32 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-20">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">
            Everything you need to{' '}
            <span className="gradient-text">ace your semester</span>
          </h2>
          <p className="mt-4 text-xl text-muted-foreground font-medium">
            Simple, focused tools that help you stay organized and productive without the clutter.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group relative overflow-hidden glass border-white/10 dark:border-white/5 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 bg-gradient-to-b from-background/80 to-background/40 backdrop-blur-xl"
            >
              <CardHeader className="pb-4">
                <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${feature.bg} shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                  <feature.icon className={`h-7 w-7 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl font-bold tracking-tight">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed text-muted-foreground/80 group-hover:text-muted-foreground transition-colors">
                  {feature.description}
                </CardDescription>
              </CardContent>
              {/* Hover gradient sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[150%] skew-x-[-20deg] group-hover:animate-[shineEffect_1.5s_ease-out_forwards]" />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
