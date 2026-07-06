'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, ArrowRight, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

export default function LoginPage() {
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  
  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  if (user) return null

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!supabase) {
      toast.error('Supabase configuration is missing.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    toast.success('Welcome back!')
    router.push('/dashboard')
    router.refresh()
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      toast.error(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-[var(--color-surface)] text-on-surface flex font-body-md">
      <div className="flex-1 flex flex-col md:flex-row w-full min-h-screen">
        {/* Left Side: Branding Panel */}
        <div className="hidden md:flex flex-1 relative bg-gradient-to-br from-primary to-primary-container p-12 overflow-hidden items-end rounded-r-[40px] shadow-[0_12px_40px_rgba(79,55,138,0.15)] z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-50 blur-3xl rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-white/10 blur-3xl rounded-full" />
          
          <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.1)] mb-12">
            <div className="mb-6 flex items-center overflow-hidden h-10 w-40 bg-white rounded-lg p-0.5">
              <Image src="/logo-wide.png" alt="StudyFlow Logo" width={200} height={50} className="object-cover scale-125" />
            </div>
            <h2 className="font-display text-3xl font-bold text-white mb-4 leading-tight">Your study week, organized.</h2>
            <p className="text-lg text-white/80 leading-relaxed">Track tasks, take notes, and plan for exams — all in one simple workspace.</p>
            
            <div className="mt-8 space-y-3">
              {['Subjects & task tracking', 'Study plan generator', 'Notes by subject'].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-white/80" />
                  <span className="text-sm font-bold text-white/90">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-12 bg-surface dark:bg-[var(--color-surface)]">
          <div className="w-full max-w-md">
            <div className="mb-12 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="mb-8 overflow-hidden h-12 w-48 bg-white rounded-xl border border-gray-100 flex items-center">
                <Image src="/logo-wide.png" alt="StudyFlow Logo" width={240} height={60} className="object-cover scale-125" />
              </div>
              <h1 className="text-3xl font-bold text-on-surface mb-2 tracking-tight text-[#3b82f6] dark:text-[#60a5fa]">Welcome back</h1>
              <p className="text-on-surface-variant font-medium">Log in to continue planning your study week.</p>
            </div>

            {/* Google Sign In */}
            <button 
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white dark:bg-surface-container border-2 border-outline-variant dark:border-outline-variant text-on-surface font-bold py-4 rounded-xl shadow-sm hover:bg-surface-container-lowest dark:hover:bg-surface-container-high hover:border-primary/20 hover:shadow-md transition-all active:scale-95 flex justify-center items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed mb-8" 
              type="button"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path></svg>
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Continue with Google'}
            </button>

            <div className="mb-8 flex items-center justify-center gap-4 w-full">
              <div className="flex-1 h-px bg-outline-variant dark:bg-outline" />
              <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">or use email</span>
              <div className="flex-1 h-px bg-outline-variant dark:bg-outline" />
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-5 w-full">
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-bold text-on-surface ml-1" htmlFor="email">Email</Label>
                <Input 
                  className="w-full bg-surface-container-highest dark:bg-surface-container border-transparent rounded-xl px-4 py-6 text-on-surface focus:bg-white dark:focus:bg-surface-container-high focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all shadow-sm" 
                  id="email" 
                  type="email"
                  placeholder="name@university.edu" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center px-1">
                  <Label className="text-sm font-bold text-on-surface" htmlFor="password">Password</Label>
                </div>
                <Input 
                  className="w-full bg-surface-container-highest dark:bg-surface-container border-transparent rounded-xl px-4 py-6 text-on-surface focus:bg-white dark:focus:bg-surface-container-high focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all shadow-sm" 
                  id="password" 
                  type="password"
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <button 
                className="mt-2 w-full bg-gradient-to-r from-primary to-surface-tint text-white font-bold py-4 rounded-xl shadow-[0_4px_12px_rgba(79,55,138,0.2)] hover:shadow-[0_8px_24px_rgba(79,55,138,0.3)] hover:-translate-y-0.5 transition-all active:scale-95 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed" 
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <span>Login</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-10 text-center font-medium text-on-surface-variant">
              Don&apos;t have an account? 
              <Link className="font-bold text-primary hover:text-primary-fixed transition-colors underline decoration-2 underline-offset-4 ml-2" href="/signup">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
