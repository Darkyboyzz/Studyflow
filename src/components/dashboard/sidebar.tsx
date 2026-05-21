'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  Flame,
  LayoutDashboard,
  Moon,
  Settings,
  Sparkles,
  StickyNote,
  Sun,
  Timer,
  User,
} from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import { cn } from '@/lib/utils'

const primaryNav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/timer', label: 'Focus', icon: Timer },
  { href: '/dashboard/tasks', label: 'Tasks', icon: ClipboardCheck },
  { href: '/dashboard/notes', label: 'Notes', icon: StickyNote },
  { href: '/dashboard/planner', label: 'Planner', icon: CalendarDays },
  { href: '/dashboard/subjects', label: 'Subjects', icon: BookOpen },
]

const mobileNav = [
  primaryNav[0],
  primaryNav[1],
  primaryNav[2],
  primaryNav[3],
  { href: '/dashboard/profile', label: 'Profile', icon: User },
]

function isActivePath(pathname: string, href: string) {
  return href === '/dashboard' ? pathname === href : pathname.startsWith(href)
}

export function DashboardSidebar({ isDeepFocus = false }: { isDeepFocus?: boolean }) {
  const pathname = usePathname()
  const { user } = useAuth()
  const { resolvedTheme, setTheme } = useTheme()

  if (isDeepFocus) {
    return null
  }

  const firstName = user?.user_metadata?.display_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Student'
  const initials = firstName.slice(0, 2).toUpperCase()

  return (
    <>
      <aside className="hidden lg:fixed lg:inset-y-4 lg:left-4 lg:z-40 lg:flex lg:w-[284px] lg:flex-col lg:rounded-[28px] lg:border lg:border-white/10 lg:bg-[#081411]/88 lg:p-4 lg:text-white lg:shadow-[0_24px_80px_rgba(0,0,0,0.32)] lg:backdrop-blur-2xl">
        <div className="absolute inset-0 -z-10 rounded-[28px] bg-[radial-gradient(circle_at_30%_0%,rgba(52,211,153,0.22),transparent_34%),radial-gradient(circle_at_90%_20%,rgba(14,165,233,0.18),transparent_28%)]" />

        <div className="mb-7 flex items-center justify-between px-2 pt-1">
          <Link href="/dashboard" className="flex items-center gap-3 transition hover:opacity-90">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 p-1.5 backdrop-blur-md border border-white/10 shadow-inner">
              <Image src="/logo.png" alt="StudyFlow" width={28} height={28} className="object-contain" priority />
            </div>
            <span className="font-display text-xl font-black tracking-tight bg-gradient-to-r from-emerald-100 to-emerald-300 bg-clip-text text-transparent">
              StudyFlow
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-white/75 transition hover:bg-white/14 hover:text-white"
            aria-label="Toggle theme"
          >
            {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>

        <div className="mb-5 rounded-3xl border border-white/10 bg-white/[0.07] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-300 text-sm font-black text-emerald-950">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{firstName}</p>
              <p className="truncate text-xs text-white/50">Premium focus workspace</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-black/20 p-3">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-white/55">
                <Flame className="h-3.5 w-3.5 text-amber-300" />
                Streak
              </div>
              <p className="mt-1 text-lg font-black">Live</p>
            </div>
            <div className="rounded-2xl bg-black/20 p-3">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-white/55">
                <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
                XP
              </div>
              <p className="mt-1 text-lg font-black">Sync</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto pr-1">
          {primaryNav.map((item) => {
            const active = isActivePath(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition',
                  active
                    ? 'bg-white text-emerald-950 shadow-lg shadow-black/20'
                    : 'text-white/62 hover:bg-white/9 hover:text-white'
                )}
              >
                <item.icon className={cn('h-5 w-5', active ? 'text-emerald-600' : 'text-white/42 group-hover:text-emerald-200')} />
                <span>{item.label}</span>
                {item.href === '/dashboard/timer' && (
                  <span className={cn('ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold', active ? 'bg-emerald-100 text-emerald-700' : 'bg-white/10 text-white/50')}>
                    PWA
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="mt-5 space-y-2 border-t border-white/10 pt-4">
          <Link
            href="/dashboard/profile"
            className={cn(
              'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition',
              pathname === '/dashboard/profile' ? 'bg-white text-emerald-950' : 'text-white/62 hover:bg-white/9 hover:text-white'
            )}
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
          <Link href="/dashboard?panel=analytics" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-white/62 transition hover:bg-white/9 hover:text-white">
            <BarChart3 className="h-5 w-5" />
            Analytics
          </Link>
        </div>
      </aside>

      <nav className="fixed inset-x-3 bottom-[calc(12px+env(safe-area-inset-bottom))] z-40 flex items-center justify-between rounded-[24px] border border-white/12 bg-[#07120f]/92 p-2 pb-[calc(8px+env(safe-area-inset-bottom))] shadow-[0_-18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl lg:hidden">
        {mobileNav.map((item) => {
          const active = isActivePath(pathname, item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex min-h-14 flex-1 flex-col items-center justify-center gap-1 rounded-[18px] text-[10px] font-bold transition active:scale-95 duration-100',
                active ? 'bg-white text-emerald-950 shadow-md' : 'text-white/50 hover:text-white'
              )}
            >
              <item.icon className={cn('h-5 w-5', active ? 'text-emerald-600' : 'text-white/48')} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
