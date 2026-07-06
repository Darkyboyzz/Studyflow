'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { createClient } from '@/lib/supabase/client'
import { 
  ArrowRight, 
  User, 
  GraduationCap, 
  Target, 
  Check,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import Image from 'next/image'

const STEPS = [
  {
    id: 'name',
    title: "What's your name?",
    subtitle: "We'll use this to personalize your academic space.",
    icon: User
  },
  {
    id: 'goal',
    title: "What's your main goal?",
    subtitle: "Tell us what you're focusing on this semester.",
    icon: Target,
    options: [
      "Exam Preparation",
      "Better Organization",
      "Time Management",
      "Project Completion"
    ]
  },
  {
    id: 'level',
    title: "Academic Level",
    subtitle: "Customize your flow based on your current studies.",
    icon: GraduationCap,
    options: [
      "High School",
      "Undergraduate",
      "Graduate",
      "Other"
    ]
  }
]

export default function OnboardingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.display_name || '',
    goal: '',
    level: ''
  })

  const handleNext = async () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      await handleComplete()
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    const { error } = await supabase.auth.updateUser({
      data: {
        display_name: formData.name,
        onboarding_completed: true,
        goal: formData.goal,
        academic_level: formData.level
      }
    })

    if (error) {
      toast.error('Failed to save your preferences')
      setLoading(false)
      return
    }

    // Also update the profiles table
    await supabase
      .from('profiles')
      .update({ display_name: formData.name })
      .eq('id', user!.id)

    toast.success('Welcome to StudyFlow!')
    router.push('/dashboard')
  }

  const step = STEPS[currentStep]
  const Icon = step.icon

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 font-sans antialiased">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-12">
          {STEPS.map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all duration-500",
                i <= currentStep ? "bg-primary" : "bg-surface-container-highest"
              )} 
            />
          ))}
        </div>

        <div className="bg-white rounded-[40px] p-8 md:p-16 shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-gray-100 transition-all duration-500 transform">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-8">
              <Icon className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              {step.title}
            </h1>
            <p className="text-lg text-gray-500 font-medium mb-12 max-w-md">
              {step.subtitle}
            </p>

            <div className="w-full max-w-md">
              {step.id === 'name' && (
                <div className="relative group">
                  <input 
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent rounded-2xl text-xl font-semibold text-gray-900 focus:bg-white focus:border-primary transition-all outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && formData.name && handleNext()}
                    autoFocus
                  />
                </div>
              )}

              {step.options && (
                <div className="grid grid-cols-1 gap-3">
                  {step.options.map((option) => {
                    const isSelected = formData[step.id as keyof typeof formData] === option
                    return (
                      <button
                        key={option}
                        onClick={() => {
                          setFormData({ ...formData, [step.id]: option })
                          setTimeout(handleNext, 300)
                        }}
                        className={cn(
                          "flex items-center justify-between px-6 py-5 rounded-2xl border-2 transition-all text-left group",
                          isSelected 
                            ? "bg-primary/5 border-primary text-primary" 
                            : "bg-gray-50 border-transparent hover:bg-gray-100 text-gray-700"
                        )}
                      >
                        <span className="font-semibold text-lg">{option}</span>
                        {isSelected ? (
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white">
                            <Check className="h-4 w-4" strokeWidth={3} />
                          </div>
                        ) : (
                          <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-gray-400 group-hover:translate-x-1 transition-all" />
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="mt-16 w-full flex items-center justify-between">
              <button 
                onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                disabled={currentStep === 0}
                className={cn(
                  "text-gray-400 font-bold hover:text-gray-600 transition-colors disabled:opacity-0",
                )}
              >
                Back
              </button>
              
              {step.id === 'name' && (
                <button 
                  onClick={handleNext}
                  disabled={!formData.name || loading}
                  className="bg-primary text-white px-10 py-5 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-1 transition-all flex items-center gap-3 disabled:opacity-50 disabled:translate-y-0"
                >
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Branding Footer */}
        <div className="mt-12 flex items-center justify-center gap-3 opacity-30">
          <Image src="/logo-wide.png" alt="StudyFlow Logo" width={120} height={30} className="object-contain grayscale" />
        </div>
      </div>
    </div>
  )
}
