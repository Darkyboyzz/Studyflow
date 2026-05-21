import type { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/providers/auth-provider'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { PwaProvider } from '@/components/providers/pwa-provider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://studyflow.app'),
  title: {
    default: 'StudyFlow - Premium Focus Workspace',
    template: '%s | StudyFlow',
  },
  description:
    'StudyFlow is an installable study workspace with Pomodoro focus sessions, tasks, notes, analytics, and streak-based motivation.',
  applicationName: 'StudyFlow',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'StudyFlow',
  },
  formatDetection: {
    telephone: false,
  },
  keywords: ['pomodoro app', 'study planner', 'student productivity', 'assignment tracker', 'focus timer'],
  openGraph: {
    title: 'StudyFlow - Premium Focus Workspace',
    description: 'Plan your week, protect focus time, and track study momentum in one polished workspace.',
    type: 'website',
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  manifest: '/manifest.webmanifest',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7fbf8' },
    { media: '(prefers-color-scheme: dark)', color: '#07120f' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${plusJakartaSans.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <PwaProvider />
            {children}
            <Toaster richColors position="top-right" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
