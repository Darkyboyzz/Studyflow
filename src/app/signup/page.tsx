'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { Label } from '@/components/ui/label'
import { Loader2, Mail, Lock, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { user } = useAuth()
  
  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!supabase) {
      toast.error('Supabase configuration is missing.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          onboarding_completed: false,
        },
      },
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    toast.success('Registration successful! Let\'s set up your profile.')
    router.push('/onboarding')
  }

  const handleGoogleSignUp = async () => {
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
    <div className="min-h-screen bg-surface dark:bg-[var(--color-surface)] font-body-md text-on-surface antialiased flex selection:bg-primary-container selection:text-on-primary-container">
      <main className="flex w-full min-h-screen">
        {/* Left Side: Branding Panel */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary to-primary-container overflow-hidden items-end justify-center p-12">
          <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-50 blur-3xl rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-white/10 blur-3xl rounded-full" />
          
          <div className="relative z-10 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-10 max-w-lg shadow-[0_12px_40px_rgba(79,55,138,0.15)] mb-12 text-white">
            <div className="flex items-center mb-6 overflow-hidden h-10 w-40 bg-white rounded-lg p-0.5">
              <Image src="/logo-wide.png" alt="StudyFlow Logo" width={200} height={50} className="object-cover scale-125" />
            </div>
            <h2 className="text-3xl font-bold mb-4 leading-tight">Start organizing your academics.</h2>
            <p className="text-lg text-white/80 leading-relaxed">A simple workspace to manage your subjects, tasks, notes, and study plans.</p>
            
            <div className="mt-8 space-y-3">
              {['Track assignments & deadlines', 'Create study plans for exams', 'Organize notes by subject', 'Share plans with classmates'].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-white/80" />
                  <span className="text-sm font-bold text-white/90">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Signup Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12 py-12 bg-surface dark:bg-[var(--color-surface)]">
          <div className="w-full max-w-[440px]">
            {/* Mobile Logo */}
            <div className="flex lg:hidden items-center mb-10 overflow-hidden h-9 w-36 bg-white rounded-md border border-gray-100 shadow-sm">
              <Image src="/logo-wide.png" alt="StudyFlow Logo" width={180} height={45} className="object-cover scale-125" />
            </div>

            {/* Header */}
            <div className="mb-8 text-center lg:text-left">
              <h1 className="text-3xl font-bold text-on-surface mb-3 tracking-tight text-[#3b82f6] dark:text-[#60a5fa]">Create your account</h1>
              <p className="font-medium text-on-surface-variant">Start organizing your classes and deadlines today.</p>
            </div>

            {/* Google Sign Up */}
            <button 
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="w-full bg-white dark:bg-surface-container border-2 border-outline-variant dark:border-outline-variant text-on-surface font-bold py-4 rounded-2xl shadow-sm hover:bg-surface-container-lowest dark:hover:bg-surface-container-high hover:border-primary/20 hover:shadow-md transition-all active:scale-95 flex justify-center items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed mb-8" 
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

            {/* Form */}
            <form onSubmit={handleSignUp} className="space-y-5">
              <div className="space-y-2">
                <Label className="block text-sm font-bold text-on-surface ml-1" htmlFor="email">Email Address</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="text-outline-variant h-5 w-5" />
                  </div>
                  <input 
                    className="block w-full pl-11 pr-4 py-4 bg-surface-container dark:bg-surface-container rounded-2xl border border-transparent font-medium text-on-surface placeholder:text-outline-variant focus:bg-white dark:focus:bg-surface-container-high focus:border-primary focus:ring-2 focus:ring-primary-container/50 transition-all duration-200 outline-none shadow-sm" 
                    id="email" 
                    placeholder="alex@university.edu" 
                    required 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="block text-sm font-bold text-on-surface ml-1" htmlFor="password">Password</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="text-outline-variant h-5 w-5" />
                  </div>
                  <input 
                    className="block w-full pl-11 pr-4 py-4 bg-surface-container dark:bg-surface-container rounded-2xl border border-transparent font-medium text-on-surface placeholder:text-outline-variant focus:bg-white dark:focus:bg-surface-container-high focus:border-primary focus:ring-2 focus:ring-primary-container/50 transition-all duration-200 outline-none shadow-sm" 
                    id="password" 
                    placeholder="••••••••" 
                    required 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 pt-1">
                <div className="flex items-center h-5 mt-0.5">
                  <input 
                    className="w-5 h-5 rounded-lg border-outline-variant text-primary focus:ring-primary focus:ring-2 focus:ring-offset-1 focus:ring-offset-surface bg-surface-container transition-colors cursor-pointer" 
                    id="terms" 
                    required 
                    type="checkbox"
                  />
                </div>
                <label className="text-sm font-medium text-on-surface-variant cursor-pointer leading-relaxed" htmlFor="terms">
                  By signing up, you agree to our 
                  <Link className="text-primary font-bold hover:underline ml-1" href="#">Terms</Link> 
                  and 
                  <Link className="text-primary font-bold hover:underline ml-1" href="#">Privacy</Link>.
                </label>
              </div>

              <div className="pt-2">
                <button 
                  className="w-full flex justify-center items-center py-4 px-6 rounded-2xl bg-gradient-to-r from-primary to-surface-tint text-white font-bold shadow-[0_4px_12px_rgba(79,55,138,0.25)] hover:shadow-[0_8px_24px_rgba(79,55,138,0.35)] hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed" 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="font-medium text-on-surface-variant">
                Already have an account? 
                <Link className="font-bold text-primary hover:underline ml-2" href="/login">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
