'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { useAuth } from '@/components/providers/auth-provider'
import { cn } from '@/lib/utils'
import { Suspense } from 'react'

function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const { loading } = useAuth()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isDeepFocus = pathname === '/dashboard/timer' && searchParams.get('focus') === 'deep'

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07120f] text-white">
        <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-300" />
        </div>
      </div>
    )
  }

  return (
    <div className={cn('min-h-screen overflow-x-hidden bg-[#07120f] text-slate-950 dark:text-white', isDeepFocus && 'bg-black')}>
      {!isDeepFocus && (
        <>
          <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_12%_10%,rgba(52,211,153,0.18),transparent_30%),radial-gradient(circle_at_88%_0%,rgba(14,165,233,0.14),transparent_32%),linear-gradient(180deg,#07120f_0%,#10201c_48%,#eef7f2_48%,#f7fbf8_100%)] dark:bg-[radial-gradient(circle_at_12%_10%,rgba(52,211,153,0.16),transparent_30%),radial-gradient(circle_at_88%_0%,rgba(14,165,233,0.12),transparent_32%),linear-gradient(180deg,#050806_0%,#0a1713_100%)]" />
          <div className="fixed inset-x-0 top-0 -z-10 h-80 bg-[linear-gradient(110deg,rgba(255,255,255,0.08),transparent_45%)]" />
        </>
      )}

      <DashboardSidebar isDeepFocus={isDeepFocus} />

      <main
        className={cn(
          'relative min-h-screen transition-all duration-300',
          isDeepFocus
            ? 'p-0'
            : 'px-4 pb-28 pt-5 sm:px-6 lg:ml-[316px] lg:px-8 lg:pb-10 lg:pt-4 xl:px-10'
        )}
      >
        <div className={cn(!isDeepFocus && 'mx-auto w-full max-w-[1500px]')}>
          {children}
        </div>
      </main>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#07120f] text-white">
        <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-300" />
        </div>
      </div>
    }>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  )
}
