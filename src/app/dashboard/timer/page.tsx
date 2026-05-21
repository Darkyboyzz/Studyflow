'use client'

import { useCallback, useEffect, useMemo, useRef, useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ArrowLeft,
  Brain,
  Check,
  ChevronDown,
  Coffee,
  Headphones,
  Image as ImageIcon,
  Lock,
  Maximize2,
  Minimize2,
  Music2,
  Pause,
  Play,
  RotateCcw,
  Settings2,
  Sparkles,
  Trophy,
  Volume2,
  VolumeX,
  X,
  Zap,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  STUDY_ENVIRONMENTS,
  getLevelInfo,
  getRecentHistory,
  getStudyEnvironment,
  loadFocusProfile,
  recordFocusCompletion,
  saveFocusProfile,
  type FocusProfile,
} from '@/lib/studyflow'

type Phase = 'focus' | 'shortBreak' | 'longBreak'

type Settings = {
  focus: number
  shortBreak: number
  longBreak: number
  longBreakInterval: number
  autoStart: boolean
}

type Track = {
  id: string
  name: string
  label: string
  url: string
}

type WindowWithWebkitAudio = Window & typeof globalThis & {
  webkitAudioContext?: typeof AudioContext
}

const DEFAULT_SETTINGS: Settings = {
  focus: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
  autoStart: true,
}

const TRACKS: Track[] = [
  { id: 'none', name: 'Silent Space', label: 'Pure silent concentration', url: '' },
  { id: 'piano', name: 'Ivory Flow', label: 'Melancholic lofi piano loops', url: 'https://raw.githubusercontent.com/riccardobertolini/lofi-music/main/public/audio/piano.mp3' },
  { id: 'rain-roof', name: 'Attic Rain', label: 'Steady rain against metal roof', url: 'https://raw.githubusercontent.com/riccardobertolini/lofi-music/main/public/audio/rain-on-roof.mp3' },
  { id: 'rain', name: 'Downpour Flow', label: 'Refreshing summer shower stream', url: 'https://raw.githubusercontent.com/riccardobertolini/lofi-music/main/public/audio/rain.mp3' },
  { id: 'thunderstorm', name: 'Thunderstorm Focus', label: 'Safe storms and heavy rain sounds', url: 'https://raw.githubusercontent.com/riccardobertolini/lofi-music/main/public/audio/thunderstorm.mp3' },
  { id: 'thunder', name: 'Distant Rumbles', label: 'Rolling thunder in a misty distance', url: 'https://raw.githubusercontent.com/riccardobertolini/lofi-music/main/public/audio/thunder.mp3' },
  { id: 'campfire', name: 'Campfire Spark', label: 'Cozy snapping wood embers warmth', url: 'https://raw.githubusercontent.com/riccardobertolini/lofi-music/main/public/audio/campfire-crackling.mp3' },
  { id: 'fire', name: 'Hearthside Hearth', label: 'Warm crackling fireplace hum', url: 'https://raw.githubusercontent.com/riccardobertolini/lofi-music/main/public/audio/fire.mp3' },
  { id: 'forest', name: 'Forest Canopy', label: 'Chirping birds and morning leaves', url: 'https://raw.githubusercontent.com/riccardobertolini/lofi-music/main/public/audio/forest_sounds.mp3' },
  { id: 'wind-foliage', name: 'Autumn Wind', label: 'Breezy leaves rustling in park', url: 'https://raw.githubusercontent.com/riccardobertolini/lofi-music/main/public/audio/wind-foliage.mp3' },
  { id: 'sea', name: 'Ocean Tides', label: 'Rhythmic crashing shoreline waves', url: 'https://raw.githubusercontent.com/riccardobertolini/lofi-music/main/public/audio/sea.mp3' },
  { id: 'mountain', name: 'Summit Breeze', label: 'Cold winds sweeping snow caps', url: 'https://raw.githubusercontent.com/riccardobertolini/lofi-music/main/public/audio/mountain.mp3' },
  { id: 'desert', name: 'Sahara Whispers', label: 'Sweeping desert sand dune draft', url: 'https://raw.githubusercontent.com/riccardobertolini/lofi-music/main/public/audio/desert.mp3' },
  { id: 'relaxed-city', name: 'Lofi Streets', label: 'Urban hum and smooth jazz breeze', url: 'https://raw.githubusercontent.com/riccardobertolini/lofi-music/main/public/audio/relaxed-city.mp3' },
  { id: 'relaxing', name: 'Zen Temple', label: 'Mellow calming ambient drone pads', url: 'https://raw.githubusercontent.com/riccardobertolini/lofi-music/main/public/audio/relaxing.mp3' },
  { id: 'zen-bells', name: 'Tibetan Bowls', label: 'Resonating singing bells for focus', url: 'https://raw.githubusercontent.com/riccardobertolini/lofi-music/main/public/audio/zen_bells.mp3' },
  { id: 'caves', name: 'Crystal Chamber', label: 'Deep echoing rock cavern pads', url: 'https://raw.githubusercontent.com/riccardobertolini/lofi-music/main/public/audio/caves.mp3' },
  { id: 'harp', name: 'Angelic Strings', label: 'Beautiful soothing harp loop', url: 'https://raw.githubusercontent.com/riccardobertolini/lofi-music/main/public/audio/harp.mp3' },
  { id: 'cat', name: 'Purr Therapy', label: 'Rhythmic cat purring for stress relief', url: 'https://raw.githubusercontent.com/riccardobertolini/lofi-music/main/public/audio/cat.mp3' },
  { id: 'sorrow', name: 'Melancholy Drift', label: 'Mellow instrumental guitar ambient', url: 'https://raw.githubusercontent.com/riccardobertolini/lofi-music/main/public/audio/sorrow.mp3' },
  { id: 'empty-mind', name: 'Void Horizon', label: 'Minimalist brown space wave', url: 'https://raw.githubusercontent.com/riccardobertolini/lofi-music/main/public/audio/empty-mind-118973.mp3' }
]

const phaseMeta = {
  focus: {
    title: 'Focus Block',
    subtitle: 'Protect this time',
    icon: Brain,
  },
  shortBreak: {
    title: 'Short Break',
    subtitle: 'Reset and relax',
    icon: Coffee,
  },
  longBreak: {
    title: 'Long Break',
    subtitle: 'Fully recover energy',
    icon: Zap,
  },
}

function loadSettings(): Settings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS
  try {
    const saved = window.localStorage.getItem('studyflow_timer_settings')
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS
  } catch {
    return DEFAULT_SETTINGS
  }
}

function saveSettings(settings: Settings) {
  window.localStorage.setItem('studyflow_timer_settings', JSON.stringify(settings))
}

function formatSeconds(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function phaseDuration(settings: Settings, phase: Phase) {
  return settings[phase] * 60
}

function nextPhase(settings: Settings, phase: Phase, completedFocusSessions: number): Phase {
  if (phase !== 'focus') return 'focus'
  return completedFocusSessions % settings.longBreakInterval === 0 ? 'longBreak' : 'shortBreak'
}

function TimerPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const deepFocus = searchParams.get('focus') === 'deep'
  const [settings, setSettings] = useState<Settings>(() => loadSettings())
  const [profile, setProfile] = useState<FocusProfile>(() => loadFocusProfile())
  const [phase, setPhase] = useState<Phase>('focus')
  const [secondsLeft, setSecondsLeft] = useState(() => loadSettings().focus * 60)
  const [running, setRunning] = useState(false)
  const [completedFocusSessions, setCompletedFocusSessions] = useState(0)
  const [activeTrack, setActiveTrack] = useState('none')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [environmentOpen, setEnvironmentOpen] = useState(false)
  const [trackOpen, setTrackOpen] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)

  const audioContextRef = useRef<AudioContext | null>(null)
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null)
  const notificationAudioUnlockedRef = useRef(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const environment = getStudyEnvironment(profile.activeEnvironmentId)
  const track = TRACKS.find((item) => item.id === activeTrack) ?? TRACKS[0]
  const totalSeconds = phaseDuration(settings, phase)
  const progress = Math.min(100, Math.max(0, ((totalSeconds - secondsLeft) / totalSeconds) * 100))
  const meta = phaseMeta[phase]
  const PhaseIcon = meta.icon
  const level = getLevelInfo(profile.xp)
  const recent = getRecentHistory(profile, 7)
  const weekMinutes = recent.reduce((sum, day) => sum + day.minutes, 0)

  const getAudioContext = useCallback(() => {
    if (typeof window === 'undefined') return null

    const windowWithAudio = window as WindowWithWebkitAudio
    const AudioContextConstructor = windowWithAudio.AudioContext ?? windowWithAudio.webkitAudioContext
    if (!AudioContextConstructor) return null

    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new AudioContextConstructor()
      notificationAudioUnlockedRef.current = false
    }

    return audioContextRef.current
  }, [])

  const resumeNotificationAudio = useCallback(async () => {
    try {
      const context = getAudioContext()
      if (!context || context.state === 'closed') return null

      if (context.state === 'suspended') {
        await context.resume()
      }

      if (!notificationAudioUnlockedRef.current && context.state === 'running') {
        const oscillator = context.createOscillator()
        const gain = context.createGain()
        oscillator.connect(gain)
        gain.connect(context.destination)
        gain.gain.setValueAtTime(0.0001, context.currentTime)
        oscillator.start()
        oscillator.stop(context.currentTime + 0.01)
        notificationAudioUnlockedRef.current = true
      }

      return context
    } catch {
      return null
    }
  }, [getAudioContext])

  const playPhaseChime = useCallback((completedPhase: Phase) => {
    if (!soundEnabled) return

    const context = getAudioContext()
    if (!context || context.state === 'closed') return

    const play = () => {
      const start = context.currentTime
      const tones = completedPhase === 'focus' ? [880, 1175] : [520, 660]

      tones.forEach((frequency, index) => {
        const toneStart = start + index * 0.14
        const oscillator = context.createOscillator()
        const gain = context.createGain()
        oscillator.connect(gain)
        gain.connect(context.destination)
        oscillator.frequency.setValueAtTime(frequency, toneStart)
        gain.gain.setValueAtTime(0.001, toneStart)
        gain.gain.exponentialRampToValueAtTime(0.16, toneStart + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.001, toneStart + 0.18)
        oscillator.start(toneStart)
        oscillator.stop(toneStart + 0.2)
      })
    }

    if (context.state === 'suspended') {
      void context.resume().then(play).catch(() => {})
      return
    }

    play()
  }, [getAudioContext, soundEnabled])

  const playControlChime = useCallback((type: 'start' | 'stop') => {
    if (!soundEnabled) return

    const context = getAudioContext()
    if (!context || context.state === 'closed') return

    const play = () => {
      const start = context.currentTime
      const tones = type === 'start' ? [660, 990] : [440, 330]

      tones.forEach((frequency, index) => {
        const toneStart = start + index * 0.08
        const oscillator = context.createOscillator()
        const gain = context.createGain()
        oscillator.connect(gain)
        gain.connect(context.destination)
        oscillator.frequency.setValueAtTime(frequency, toneStart)
        gain.gain.setValueAtTime(0.001, toneStart)
        gain.gain.exponentialRampToValueAtTime(0.14, toneStart + 0.015)
        gain.gain.exponentialRampToValueAtTime(0.001, toneStart + 0.13)
        oscillator.start(toneStart)
        oscillator.stop(toneStart + 0.15)
      })
    }

    if (context.state === 'suspended') {
      void context.resume().then(play).catch(() => {})
      return
    }

    play()
  }, [getAudioContext, soundEnabled])

  // HTML5 audio stream player handlers
  const playAudioStream = useCallback((url: string) => {
    if (typeof window === 'undefined') return
    
    if (!audioPlayerRef.current) {
      audioPlayerRef.current = new Audio()
      audioPlayerRef.current.loop = true
      
      const onPlay = () => setIsPlayingAudio(true)
      const onPause = () => setIsPlayingAudio(false)
      
      audioPlayerRef.current.addEventListener('play', onPlay)
      audioPlayerRef.current.addEventListener('pause', onPause)
    }

    const player = audioPlayerRef.current
    player.volume = soundEnabled ? 0.68 : 0
    
    if (player.src !== url) {
      player.src = url
    }
    
    player.play().catch(() => {
      toast.info('Tap Play/Resume to activate the ambient stream.')
    })
  }, [soundEnabled])

  const pauseAudioStream = useCallback(() => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause()
    }
  }, [])

  // Audio lifecycle hook
  useEffect(() => {
    if (running && track.url) {
      playAudioStream(track.url)
    } else {
      pauseAudioStream()
    }
  }, [running, track.url, playAudioStream, pauseAudioStream])

  // Volume adjuster hook
  useEffect(() => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.volume = soundEnabled ? 0.68 : 0
    }
  }, [soundEnabled])

  // Main countdown timer
  const completePhase = useCallback(() => {
    setRunning(false)
    pauseAudioStream()
    playPhaseChime(phase)

    if (phase === 'focus') {
      const nextCount = completedFocusSessions + 1
      const result = recordFocusCompletion(profile, settings.focus)
      setProfile(result.profile)
      setCompletedFocusSessions(nextCount)
      const upcoming = nextPhase(settings, phase, nextCount)
      setPhase(upcoming)
      setSecondsLeft(phaseDuration(settings, upcoming))
      toast.success(`Focus Complete! +${result.xpEarned} XP`)
      if (settings.autoStart) setRunning(true)
      return
    }

    setPhase('focus')
    setSecondsLeft(settings.focus * 60)
    toast.success('Break complete. Get ready to focus!')
    if (settings.autoStart) setRunning(true)
  }, [completedFocusSessions, phase, playPhaseChime, profile, settings, pauseAudioStream])

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.setTimeout(completePhase, 0)
          return 0
        }
        return current - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [completePhase, running])

  // Clean deep focus styles
  useEffect(() => {
    if (!deepFocus || typeof document === 'undefined') return
    document.documentElement.classList.add('studyflow-deep-focus')
    return () => document.documentElement.classList.remove('studyflow-deep-focus')
  }, [deepFocus])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      pauseAudioStream()
      if (audioPlayerRef.current) {
        audioPlayerRef.current = null
      }
      const context = audioContextRef.current
      if (context && context.state !== 'closed') {
        void context.close()
      }
    }
  }, [pauseAudioStream])

  const timeline = useMemo(() => {
    const items: Array<{
      phase: Phase
      label: string
      done: boolean
      active: boolean
      targetCompletedSessions: number
    }> = []
    for (let index = 1; index <= settings.longBreakInterval; index++) {
      items.push({
        phase: 'focus',
        label: `F${index}`,
        done: completedFocusSessions >= index,
        active: phase === 'focus' && completedFocusSessions + 1 === index,
        targetCompletedSessions: index - 1,
      })
      items.push({
        phase: index === settings.longBreakInterval ? 'longBreak' : 'shortBreak',
        label: index === settings.longBreakInterval ? 'LB' : 'SB',
        done: completedFocusSessions > index,
        active: phase !== 'focus' && completedFocusSessions === index,
        targetCompletedSessions: index,
      })
    }
    return items
  }, [completedFocusSessions, phase, settings.longBreakInterval])

  function handleTimelineClick(targetCompletedSessions: number, targetPhase: Phase) {
    setRunning(false)
    pauseAudioStream()
    setCompletedFocusSessions(targetCompletedSessions)
    setPhase(targetPhase)
    setSecondsLeft(phaseDuration(settings, targetPhase))
    
    const phaseLabel = targetPhase === 'focus' ? 'Focus Block' : targetPhase === 'shortBreak' ? 'Short Break' : 'Long Break'
    toast.success(`Jumped directly to ${phaseLabel}!`)
  }

  function updateSettings(next: Settings) {
    setSettings(next)
    saveSettings(next)
    setRunning(false)
    pauseAudioStream()
    setPhase('focus')
    setSecondsLeft(next.focus * 60)
    setSettingsOpen(false)
  }

  function selectEnvironment(id: string) {
    const nextProfile = { ...profile, activeEnvironmentId: id }
    setProfile(nextProfile)
    saveFocusProfile(nextProfile)
    setEnvironmentOpen(false)
  }

  function selectTrack(item: Track) {
    setActiveTrack(item.id)
    setTrackOpen(false)
    
    if (running && item.url) {
      playAudioStream(item.url)
    } else {
      pauseAudioStream()
    }
  }

  function toggleNotificationSound() {
    const nextSoundEnabled = !soundEnabled
    setSoundEnabled(nextSoundEnabled)

    if (nextSoundEnabled) {
      void resumeNotificationAudio()
    }
  }

  function toggleTimer() {
    if (running) {
      setRunning(false)
      pauseAudioStream()
      playControlChime('stop')
      return
    }

    void resumeNotificationAudio()
    playControlChime('start')
    setRunning(true)
  }

  function resetTimer() {
    setRunning(false)
    pauseAudioStream()
    setPhase('focus')
    setSecondsLeft(settings.focus * 60)
  }

  async function enterFullscreen() {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen?.()
    }
    router.push('/dashboard/timer?focus=deep')
  }

  async function exitDeepFocus() {
    if (document.fullscreenElement) {
      await document.exitFullscreen?.()
    }
    router.push('/dashboard/timer')
  }

  return (
    <div className={cn('relative min-h-screen overflow-hidden rounded-[32px] text-white select-none transition-all duration-700', deepFocus && 'rounded-none')}>
      {/* Background wallpaper with smooth transit scale overlay */}
      <div className="absolute inset-0 bg-cover bg-center scale-105 transition-all duration-1000 ease-in-out" style={{ backgroundImage: `url(${environment.image})` }} />
      <div className="absolute inset-0 transition-colors duration-1000" style={{ background: environment.tint }} />
      
      {/* Breathing background ambient glow */}
      <div className="absolute -left-[10%] -top-[10%] w-[50%] h-[50%] rounded-full blur-[160px] pointer-events-none transition-all duration-1000 opacity-30 animate-pulse-glow" style={{ background: `radial-gradient(circle, ${environment.accent}, transparent 70%)` }} />
      <div className="absolute -right-[10%] -bottom-[10%] w-[50%] h-[50%] rounded-full blur-[160px] pointer-events-none transition-all duration-1000 opacity-24 animate-pulse-glow" style={{ background: `radial-gradient(circle, ${environment.accent2}, transparent 70%)` }} />

      {/* Dark premium overlay grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.18),transparent_32%),radial-gradient(circle_at_86%_16%,rgba(255,255,255,0.1),transparent_28%),linear-gradient(180deg,rgba(0,0,0,0.22),rgba(0,0,0,0.52))]" />

      <div className={cn('relative z-10 mx-auto grid min-h-screen w-full max-w-[1420px] gap-5 p-4 sm:p-6 lg:grid-cols-[1fr_380px] lg:p-8', deepFocus && 'max-w-none place-items-center lg:grid-cols-1')}>
        
        {/* Timer Box */}
        <section className={cn('flex min-h-[calc(100vh-64px)] flex-col rounded-[32px] border border-white/12 bg-black/32 p-4 shadow-[0_26px_90px_rgba(0,0,0,0.38)] backdrop-blur-3xl sm:p-6 lg:p-8 transition-all duration-500', deepFocus && 'min-h-[100svh] w-full max-w-5xl justify-center border-0 bg-transparent shadow-none backdrop-blur-none')}>
          
          <header className={cn('mb-8 flex flex-wrap items-center justify-between gap-3', deepFocus && 'absolute left-4 right-4 top-4')}>
            <div className="flex items-center gap-3">
              {!deepFocus ? (
                <Link href="/dashboard" className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 transition hover:bg-white/16 active:scale-92 duration-150">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              ) : (
                <button onClick={exitDeepFocus} className="flex h-11 items-center gap-2 rounded-2xl bg-white/10 px-4 text-sm font-black transition hover:bg-white/16 active:scale-95 duration-150">
                  <Minimize2 className="h-4 w-4" />
                  Exit Focus
                </button>
              )}
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/45">{environment.name}</p>
                <h1 className="text-xl font-black sm:text-2xl">{deepFocus ? 'Deep Focus Mode' : 'Study Timer'}</h1>
              </div>
            </div>

            {!deepFocus && (
              <div className="flex items-center gap-2">
                <button onClick={toggleNotificationSound} className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 transition hover:bg-white/16 active:scale-92 duration-150" aria-label="Toggle sound">
                  {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                </button>
                <button onClick={() => setSettingsOpen(true)} className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 transition hover:bg-white/16 active:scale-92 duration-150" aria-label="Open settings">
                  <Settings2 className="h-5 w-5" />
                </button>
                <button onClick={enterFullscreen} className="flex h-11 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-black text-emerald-950 transition hover:-translate-y-0.5 active:scale-95 duration-150">
                  <Maximize2 className="h-4 w-4" />
                  Deep focus
                </button>
              </div>
            )}
          </header>

          <div className="flex flex-1 flex-col items-center justify-center">
            
            {/* Timer badge */}
            <div className="mb-5 flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-4 py-2 text-xs font-black backdrop-blur-2xl">
              <PhaseIcon className="h-4 w-4" style={{ color: environment.accent }} />
              <span className="uppercase tracking-[0.16em]">{meta.title}</span>
              <span className="text-white/45">•</span>
              <span className="text-white/70">{meta.subtitle}</span>
            </div>

            {/* Circular Ring Timer */}
            <div className="relative grid aspect-square w-full max-w-[320px] place-items-center sm:max-w-[420px]">
              <div className="absolute inset-0 rounded-full border border-white/10 bg-white/6 shadow-[inset_0_0_80px_rgba(255,255,255,0.06)] backdrop-blur-2xl" />
              
              <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 320 320">
                <circle cx="160" cy="160" r="144" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="10" />
                <circle
                  cx="160"
                  cy="160"
                  r="144"
                  fill="none"
                  stroke={environment.accent}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 144}
                  strokeDashoffset={(2 * Math.PI * 144) - (progress / 100) * (2 * Math.PI * 144)}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              {/* Central counter */}
              <div className="relative z-10 text-center">
                <p className="text-[68px] font-black leading-none tracking-tight tabular-nums sm:text-[88px] drop-shadow-md">{formatSeconds(secondsLeft)}</p>
                
                {/* Playing audio equalizer display */}
                <div className="mt-3 flex items-center justify-center gap-2.5">
                  {isPlayingAudio && track.id !== 'none' ? (
                    <div className="flex items-center gap-0.5 h-4 w-5">
                      <span className="w-1 rounded-full bg-emerald-300 animate-eq" style={{ height: '100%', animationDelay: '0.1s' }} />
                      <span className="w-1 rounded-full bg-emerald-300 animate-eq" style={{ height: '70%', animationDelay: '0.3s' }} />
                      <span className="w-1 rounded-full bg-emerald-300 animate-eq" style={{ height: '100%', animationDelay: '0s' }} />
                      <span className="w-1 rounded-full bg-emerald-300 animate-eq" style={{ height: '60%', animationDelay: '0.4s' }} />
                    </div>
                  ) : null}
                  
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/45">
                    {running ? 'Running' : secondsLeft === totalSeconds ? 'Ready' : 'Paused'}
                  </p>
                </div>
              </div>
            </div>

            {/* Main Action buttons */}
            <div className="mt-8 flex items-center gap-3">
              <button onClick={resetTimer} className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 transition hover:bg-white/16 active:scale-90 duration-150 shadow-md">
                <RotateCcw className="h-5 w-5" />
              </button>
              
              <button
                onClick={toggleTimer}
                className="flex min-h-16 items-center gap-3 rounded-[24px] px-10 text-lg font-black text-emerald-950 shadow-2xl transition hover:-translate-y-0.5 active:scale-95 duration-150"
                style={{ background: `linear-gradient(135deg, #fff, ${environment.accent})` }}
              >
                {running ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 fill-emerald-950" />}
                {running ? 'Pause' : secondsLeft === totalSeconds ? 'Start Session' : 'Resume'}
              </button>
            </div>
          </div>

          {/* Timeline bar */}
          {!deepFocus && (
            <div className="mt-8 rounded-[28px] border border-white/12 bg-white/6 p-3 backdrop-blur-2xl shadow-inner">
              <div className="flex items-center justify-between gap-2 overflow-x-auto">
                {timeline.map((item, index) => {
                  const Icon = item.phase === 'focus' ? Brain : item.phase === 'longBreak' ? Zap : Coffee
                  return (
                    <button
                      key={`${item.label}-${index}`}
                      onClick={() => handleTimelineClick(item.targetCompletedSessions, item.phase)}
                      className="flex min-w-12 flex-1 flex-col items-center gap-2 group outline-none"
                    >
                      <div
                        className={cn(
                          'grid h-11 w-11 place-items-center rounded-2xl border text-white/50 transition-all duration-300 cursor-pointer shadow-sm',
                          item.active 
                            ? 'scale-110 border-white bg-white text-emerald-950 shadow-lg' 
                            : item.done 
                              ? 'border-emerald-300/40 bg-emerald-400/20 text-emerald-300 hover:bg-emerald-400/30 hover:border-emerald-300/60' 
                              : 'border-white/10 bg-black/16 hover:border-white/30 hover:bg-white/10 hover:scale-105 active:scale-95'
                        )}
                      >
                        {item.done ? <Check className="h-4 w-4 stroke-[3]" /> : <Icon className="h-4 w-4" />}
                      </div>
                      <span className="text-[9px] font-black tracking-wider text-white/45 group-hover:text-white/80 transition duration-150">{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </section>

        {/* Sidebar panels */}
        {!deepFocus && (
          <aside className="space-y-5">
            
            {/* Wallpaper Selector Panel */}
            <div className="rounded-[32px] border border-white/12 bg-black/24 p-5 shadow-2xl backdrop-blur-3xl">
              <div className="flex items-center justify-between">
                <h2 className="font-black text-sm tracking-wide uppercase text-white/70">Study Space</h2>
                <ImageIcon className="h-5 w-5 text-white/55" />
              </div>
              <button onClick={() => setEnvironmentOpen((value) => !value)} className="mt-4 flex w-full items-center justify-between rounded-3xl bg-white/10 p-4 text-left transition hover:bg-white/14 active:scale-[0.98] duration-150">
                <span className="min-w-0 pr-2">
                  <span className="block font-black text-sm text-white">{environment.name}</span>
                  <span className="block truncate text-xs text-white/45 font-medium mt-0.5">{environment.description}</span>
                </span>
                <ChevronDown className="h-4 w-4 text-white/45 flex-shrink-0" />
              </button>
              
              {/* Desktop dropdown fallback - will be styled beautifully in the modal sheet */}
              {environmentOpen && (
                <div className="hidden lg:grid mt-3 gap-2 max-h-[320px] overflow-y-auto pr-1">
                  {STUDY_ENVIRONMENTS.map((item) => {
                    const unlocked = profile.unlockedThemeIds.includes(item.id)
                    return (
                      <button
                        key={item.id}
                        onClick={() => unlocked && selectEnvironment(item.id)}
                        className={cn('flex items-center gap-3 rounded-2xl p-2.5 text-left transition active:scale-95 duration-100', unlocked ? 'bg-white/8 hover:bg-white/14' : 'bg-black/20 opacity-45 cursor-not-allowed')}
                      >
                        <span className="h-9 w-9 rounded-xl bg-cover bg-center flex-shrink-0" style={{ backgroundImage: `url(${item.image})` }} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-bold text-white">{item.name}</span>
                          <span className="block text-[10px] text-white/40 mt-0.5">{unlocked ? 'Available' : 'Locked'}</span>
                        </span>
                        {!unlocked && <Lock className="h-3.5 w-3.5 text-white/30 flex-shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Soundscape Selector Panel */}
            <div className="rounded-[32px] border border-white/12 bg-black/24 p-5 shadow-2xl backdrop-blur-3xl">
              <div className="flex items-center justify-between">
                <h2 className="font-black text-sm tracking-wide uppercase text-white/70">Ambient Audio</h2>
                <Headphones className="h-5 w-5 text-white/55" />
              </div>
              <button onClick={() => setTrackOpen((value) => !value)} className="mt-4 flex w-full items-center justify-between rounded-3xl bg-white/10 p-4 text-left transition hover:bg-white/14 active:scale-[0.98] duration-150">
                <span className="min-w-0 pr-2">
                  <span className="block font-black text-sm text-white">{track.name}</span>
                  <span className="block truncate text-xs text-white/45 font-medium mt-0.5">{track.label}</span>
                </span>
                <Music2 className="h-4 w-4 text-white/45 flex-shrink-0" />
              </button>

              {/* Desktop list */}
              {trackOpen && (
                <div className="hidden lg:grid mt-3 gap-2 max-h-[320px] overflow-y-auto pr-1">
                  {TRACKS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => selectTrack(item)}
                      className={cn('rounded-2xl p-2.5 text-left transition active:scale-95 duration-100', activeTrack === item.id ? 'bg-white text-emerald-950 font-black' : 'bg-white/8 hover:bg-white/12')}
                    >
                      <div className="flex items-center justify-between">
                        <span className="block text-xs font-black truncate">{item.name}</span>
                        {activeTrack === item.id && isPlayingAudio && (
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-ping" />
                        )}
                      </div>
                      <span className={cn('block text-[10px] truncate mt-0.5 font-medium', activeTrack === item.id ? 'text-emerald-800' : 'text-white/42')}>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Level & Streaks Progress */}
            <div className="rounded-[32px] border border-white/12 bg-black/24 p-5 shadow-2xl backdrop-blur-3xl">
              <div className="flex items-center justify-between">
                <h2 className="font-black text-sm tracking-wide uppercase text-white/70">Gamified Progress</h2>
                <Trophy className="h-5 w-5 text-amber-300 animate-bounce" style={{ animationDuration: '3s' }} />
              </div>
              <p className="mt-5 text-4xl font-black tracking-tight">Level {level.level}</p>
              
              <div className="mt-4 h-3.5 overflow-hidden rounded-full bg-white/10 p-0.5 border border-white/5">
                <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${level.progress}%`, background: `linear-gradient(90deg, ${environment.accent}, ${environment.accent2})` }} />
              </div>
              
              <div className="mt-2 flex justify-between text-[10px] font-black text-white/45 tracking-wider uppercase">
                <span>{profile.xp % 250} XP</span>
                <span>{level.progress}% to Level {level.level + 1}</span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <div className="rounded-2xl bg-white/8 p-3 text-center border border-white/5 hover:bg-white/12 transition duration-200">
                  <p className="text-xl font-black text-amber-300">{profile.streak}d</p>
                  <p className="text-[9px] font-black tracking-wider uppercase text-white/45 mt-0.5">Streak</p>
                </div>
                <div className="rounded-2xl bg-white/8 p-3 text-center border border-white/5 hover:bg-white/12 transition duration-200">
                  <p className="text-xl font-black text-cyan-300">{profile.xp}</p>
                  <p className="text-[9px] font-black tracking-wider uppercase text-white/45 mt-0.5">Total XP</p>
                </div>
                <div className="rounded-2xl bg-white/8 p-3 text-center border border-white/5 hover:bg-white/12 transition duration-200">
                  <p className="text-xl font-black text-emerald-300">{Math.round(weekMinutes / 60)}h</p>
                  <p className="text-[9px] font-black tracking-wider uppercase text-white/45 mt-0.5">This Wk</p>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* ================================================================ */}
      {/* MOBILE RESPONSIVE BOTTOM SHEETS & BACKDROP OVERLAYS (ANDROID) */}
      {/* ================================================================ */}

      {/* 1. Timer Settings Sheet */}
      {settingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-0 sm:p-4 animate-fade-in">
          <div onClick={() => setSettingsOpen(false)} className="absolute inset-0 bg-black/65 backdrop-blur-md" />
          <SettingsDialog settings={settings} onSave={updateSettings} onClose={() => setSettingsOpen(false)} />
        </div>
      )}

      {/* 2. Mobile Environment Bottom Sheet */}
      {environmentOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center lg:hidden p-0 animate-fade-in">
          <div onClick={() => setEnvironmentOpen(false)} className="absolute inset-0 bg-black/65 backdrop-blur-md" />
          
          <div className="relative w-full max-h-[80vh] flex flex-col bg-[#071310]/96 border-t border-white/12 rounded-t-[36px] p-6 shadow-2xl z-10 animate-slide-up">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/20" />
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Personalize</p>
                <h3 className="text-xl font-black text-white">Study Spaces</h3>
              </div>
              <button onClick={() => setEnvironmentOpen(false)} className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-white active:scale-90 duration-150">
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="grid gap-3 overflow-y-auto pb-4 pr-1 flex-1">
              {STUDY_ENVIRONMENTS.map((item) => {
                const unlocked = profile.unlockedThemeIds.includes(item.id)
                return (
                  <button
                    key={item.id}
                    onClick={() => unlocked && selectEnvironment(item.id)}
                    className={cn(
                      'flex items-center gap-4 rounded-2xl p-3 text-left transition border duration-150 active:scale-[0.98]',
                      unlocked 
                        ? profile.activeEnvironmentId === item.id 
                          ? 'bg-white border-white text-emerald-950 shadow-lg' 
                          : 'bg-white/6 border-white/10 text-white hover:bg-white/10'
                        : 'bg-black/20 border-white/5 opacity-45 cursor-not-allowed text-white/50'
                    )}
                  >
                    <span className="h-12 w-12 rounded-xl bg-cover bg-center flex-shrink-0 shadow-md" style={{ backgroundImage: `url(${item.image})` }} />
                    <span className="min-w-0 flex-1">
                      <span className="block font-black text-sm leading-tight">{item.name}</span>
                      <span className={cn('block text-xs truncate mt-0.5 font-medium', profile.activeEnvironmentId === item.id ? 'text-emerald-800' : 'text-white/45')}>{item.description}</span>
                    </span>
                    {!unlocked ? (
                      <Lock className="h-4 w-4 text-white/40 flex-shrink-0 ml-2" />
                    ) : (
                      profile.activeEnvironmentId === item.id && <Check className="h-4 w-4 text-emerald-700 stroke-[3] ml-2" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. Mobile Audio Bottom Sheet */}
      {trackOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center lg:hidden p-0 animate-fade-in">
          <div onClick={() => setTrackOpen(false)} className="absolute inset-0 bg-black/65 backdrop-blur-md" />
          
          <div className="relative w-full max-h-[80vh] flex flex-col bg-[#071310]/96 border-t border-white/12 rounded-t-[36px] p-6 shadow-2xl z-10 animate-slide-up">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/20" />
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Stream ambient</p>
                <h3 className="text-xl font-black text-white">Audio & Music</h3>
              </div>
              <button onClick={() => setTrackOpen(false)} className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-white active:scale-90 duration-150">
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="grid gap-3 overflow-y-auto pb-4 pr-1 flex-1">
              {TRACKS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => selectTrack(item)}
                  className={cn(
                    'flex items-center justify-between rounded-2xl p-4 text-left border transition duration-150 active:scale-[0.98]',
                    activeTrack === item.id 
                      ? 'bg-white border-white text-emerald-950 font-black shadow-lg' 
                      : 'bg-white/6 border-white/10 text-white hover:bg-white/10'
                  )}
                >
                  <span className="min-w-0 pr-2">
                    <span className="block font-black text-sm leading-none">{item.name}</span>
                    <span className={cn('block text-xs truncate mt-1.5 font-medium', activeTrack === item.id ? 'text-emerald-800' : 'text-white/45')}>{item.label}</span>
                  </span>
                  
                  {activeTrack === item.id ? (
                    isPlayingAudio ? (
                      <div className="flex items-center gap-0.5 h-3.5 w-4 flex-shrink-0">
                        <span className="w-0.5 rounded-full bg-emerald-600 animate-eq" style={{ height: '100%', animationDelay: '0.1s' }} />
                        <span className="w-0.5 rounded-full bg-emerald-600 animate-eq" style={{ height: '70%', animationDelay: '0.3s' }} />
                        <span className="w-0.5 rounded-full bg-emerald-600 animate-eq" style={{ height: '100%', animationDelay: '0s' }} />
                      </div>
                    ) : (
                      <Check className="h-4 w-4 text-emerald-700 stroke-[3] flex-shrink-0" />
                    )
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Global CSS animations styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); opacity: 0.18; }
          50% { transform: scale(1.08); opacity: 0.28; }
        }
        @keyframes eqWave {
          0%, 100% { transform: scaleY(0.35); }
          50% { transform: scaleY(1); }
        }
        .animate-slide-up {
          animation: slideUp 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.24s ease-out forwards;
        }
        .animate-pulse-glow {
          animation: pulseGlow 5s ease-in-out infinite;
        }
        .animate-eq {
          animation: eqWave 0.6s ease-in-out infinite alternate;
          transform-origin: bottom;
        }
        .active\\:scale-95:active {
          transform: scale(0.95);
        }
        .active\\:scale-92:active {
          transform: scale(0.92);
        }
        .active\\:scale-90:active {
          transform: scale(0.90);
        }
      `}} />
    </div>
  )
}

function SettingsDialog({ settings, onSave, onClose }: { settings: Settings; onSave: (settings: Settings) => void; onClose: () => void }) {
  const [local, setLocal] = useState(settings)

  return (
    <div className="relative w-full max-h-[85vh] overflow-y-auto bg-[#071310]/96 border-t border-white/12 rounded-t-[36px] p-6 shadow-2xl z-10 transition-all duration-300 ease-out translate-y-0 sm:rounded-[32px] sm:max-w-md sm:border sm:translate-y-0 animate-slide-up text-white">
      {/* Android drag pill */}
      <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/20 sm:hidden" />
      
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Settings</p>
          <h2 className="text-xl font-black">Focus Timer</h2>
        </div>
        <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 active:scale-90 duration-150">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="grid gap-4">
        {[
          ['focus', 'Focus Duration (min)', 1, 120],
          ['shortBreak', 'Short Break (min)', 1, 30],
          ['longBreak', 'Long Break (min)', 1, 60],
          ['longBreakInterval', 'Long Break Interval', 2, 8],
        ].map(([key, label, min, max]) => (
          <label key={key as string} className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-white/45">{label as string}</span>
            <input
              type="number"
              min={min as number}
              max={max as number}
              value={local[key as keyof Settings] as number}
              onChange={(event) => setLocal({ ...local, [key as string]: Number(event.target.value) || min })}
              className="h-12 rounded-2xl border border-white/10 bg-white/10 px-4 font-black outline-none ring-emerald-400/20 focus:ring-4 text-white"
            />
          </label>
        ))}

        <button
          onClick={() => setLocal({ ...local, autoStart: !local.autoStart })}
          className={cn('flex min-h-12 items-center justify-between rounded-2xl px-4 text-sm font-black transition border duration-150 active:scale-[0.98]', local.autoStart ? 'bg-white text-emerald-950 border-white shadow-lg' : 'bg-white/10 border-white/5')}
        >
          Auto-start next phase
          <span className="rounded-full bg-black/10 px-2 py-1 text-xs">{local.autoStart ? 'On' : 'Off'}</span>
        </button>
      </div>

      <button onClick={() => onSave(local)} className="mt-6 flex min-h-14 w-full items-center justify-center gap-2 rounded-[20px] bg-white text-sm font-black text-emerald-950 transition active:scale-95 duration-150 shadow-xl">
        <Sparkles className="h-4 w-4" />
        Save Settings
      </button>
    </div>
  )
}

export default function TimerPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#07120f] text-white">
        <div className="flex flex-col items-center rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-300" />
          <p className="text-xs font-black tracking-wider uppercase text-white/70 mt-3">Loading focus timer...</p>
        </div>
      </div>
    }>
      <TimerPageContent />
    </Suspense>
  )
}
