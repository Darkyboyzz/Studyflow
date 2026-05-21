export type StudyEnvironment = {
  id: string
  name: string
  description: string
  accent: string
  accent2: string
  panel: string
  image: string
  tint: string
}

export type FocusHistoryEntry = {
  date: string
  minutes: number
  sessions: number
  xp: number
}

export type FocusProfile = {
  xp: number
  streak: number
  bestStreak: number
  lastStudyDate: string | null
  sessions: number
  minutes: number
  history: FocusHistoryEntry[]
  unlockedThemeIds: string[]
  badges: string[]
  activeEnvironmentId: string
}

export const STUDY_ENVIRONMENTS: StudyEnvironment[] = [
  {
    id: 'lofi-study',
    name: 'Lofi Study Oasis',
    description: 'Warm amber glow for cozy midnight focus.',
    accent: '#fbbf24',
    accent2: '#f59e0b',
    panel: 'rgba(20, 15, 10, 0.7)',
    image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1800&q=80',
    tint: 'rgba(12, 8, 4, 0.62)',
  },
  {
    id: 'misty-forest',
    name: 'Misty Forest Canopy',
    description: 'Refreshing pine greens for deep reading blocks.',
    accent: '#10b981',
    accent2: '#059669',
    panel: 'rgba(10, 24, 20, 0.72)',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1800&q=80',
    tint: 'rgba(4, 12, 10, 0.66)',
  },
  {
    id: 'deep-ocean',
    name: 'Abyssal Calm',
    description: 'Cool contrast and peace for difficult coding.',
    accent: '#06b6d4',
    accent2: '#3b82f6',
    panel: 'rgba(6, 18, 30, 0.74)',
    image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1800&q=80',
    tint: 'rgba(3, 10, 20, 0.68)',
  },
  {
    id: 'rainy-cafe',
    name: 'Cozy Rain Cafe',
    description: 'Soft coffee shop vibes with raindrops on window glass.',
    accent: '#fb923c',
    accent2: '#db2777',
    panel: 'rgba(24, 16, 12, 0.72)',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1800&q=80',
    tint: 'rgba(14, 8, 6, 0.65)',
  },
  {
    id: 'stellar-nebula',
    name: 'Cosmic Drift',
    description: 'Vast galactic clouds for creative brainstorming.',
    accent: '#a855f7',
    accent2: '#ec4899',
    panel: 'rgba(18, 10, 28, 0.75)',
    image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1800&q=80',
    tint: 'rgba(8, 4, 16, 0.72)',
  },
  {
    id: 'zen-bonsai',
    name: 'Zen Stone Garden',
    description: 'Soothe the mind with Japanese tea house energy.',
    accent: '#34d399',
    accent2: '#22d3ee',
    panel: 'rgba(12, 28, 22, 0.72)',
    image: 'https://images.unsplash.com/photo-1504618223053-559bdef9dd5a?auto=format&fit=crop&w=1800&q=80',
    tint: 'rgba(6, 16, 12, 0.64)',
  },
  {
    id: 'autumn-wood',
    name: 'Golden Autumn Path',
    description: 'Warm glowing sunlight falling on fallen leaves.',
    accent: '#f97316',
    accent2: '#eab308',
    panel: 'rgba(28, 18, 10, 0.72)',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1800&q=80',
    tint: 'rgba(16, 10, 4, 0.63)',
  },
  {
    id: 'snow-cabin',
    name: 'Alpine Winter Hearth',
    description: 'Snow covered pines outside, fireside warmth inside.',
    accent: '#93c5fd',
    accent2: '#cbd5e1',
    panel: 'rgba(15, 20, 28, 0.75)',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1800&q=80',
    tint: 'rgba(8, 10, 16, 0.68)',
  },
  {
    id: 'midnight-beach',
    name: 'Midnight Surf Tide',
    description: 'Gentle waves washing ashore under brilliant starlight.',
    accent: '#60a5fa',
    accent2: '#2563eb',
    panel: 'rgba(10, 16, 28, 0.74)',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80',
    tint: 'rgba(4, 8, 16, 0.68)',
  },
  {
    id: 'aurora',
    name: 'Northern Sky Radiance',
    description: 'Brilliant green aurora dancing over silent peaks.',
    accent: '#22c55e',
    accent2: '#10b981',
    panel: 'rgba(8, 22, 16, 0.74)',
    image: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=1800&q=80',
    tint: 'rgba(4, 12, 8, 0.7)',
  },
  {
    id: 'desert',
    name: 'Sahara Twilight Dunes',
    description: 'Sweeping desert sand under a fading sunset glow.',
    accent: '#f59e0b',
    accent2: '#b45309',
    panel: 'rgba(32, 20, 10, 0.72)',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1800&q=80',
    tint: 'rgba(18, 10, 4, 0.64)',
  },
  {
    id: 'sakura',
    name: 'Cherry Blossom Shrine',
    description: 'Soft pink sakura petals falling in quiet spring.',
    accent: '#f472b6',
    accent2: '#f43f5e',
    panel: 'rgba(34, 16, 24, 0.72)',
    image: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=1800&q=80',
    tint: 'rgba(18, 8, 12, 0.64)',
  },
  {
    id: 'retro-arcade',
    name: 'Neon Retro Arcade',
    description: 'Pixelated nostalgia under vintage CRT game screens.',
    accent: '#f43f5e',
    accent2: '#8b5cf6',
    panel: 'rgba(20, 10, 26, 0.75)',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1800&q=80',
    tint: 'rgba(10, 4, 14, 0.7)',
  },
  {
    id: 'synthwave',
    name: 'Outrun Horizon',
    description: '80s synth wave landscape with glowing wireframes.',
    accent: '#d946ef',
    accent2: '#3b82f6',
    panel: 'rgba(22, 10, 28, 0.75)',
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1800&q=80',
    tint: 'rgba(12, 4, 16, 0.7)',
  },
  {
    id: 'underwater',
    name: 'Deepwater Sanctuary',
    description: 'Light beams filtering down through crystal clear sea.',
    accent: '#06b6d4',
    accent2: '#0891b2',
    panel: 'rgba(8, 20, 28, 0.74)',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1800&q=80',
    tint: 'rgba(4, 10, 16, 0.68)',
  },
  {
    id: 'greenhouse',
    name: 'Orchid Sanctuary',
    description: 'Sunlight washing over lush misted indoor plants.',
    accent: '#22c55e',
    accent2: '#15803d',
    panel: 'rgba(10, 26, 16, 0.72)',
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1800&q=80',
    tint: 'rgba(4, 14, 8, 0.66)',
  },
  {
    id: 'balcony',
    name: 'Morning Hills Veranda',
    description: 'Warm tea cup looking out onto sweeping green ridges.',
    accent: '#fcd34d',
    accent2: '#6ee7b7',
    panel: 'rgba(22, 20, 16, 0.72)',
    image: 'https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?auto=format&fit=crop&w=1800&q=80',
    tint: 'rgba(12, 10, 8, 0.62)',
  },
  {
    id: 'lavender',
    name: 'Lavender Sunset',
    description: 'Gentle rows of purple flowers beneath a French twilight.',
    accent: '#c084fc',
    accent2: '#f472b6',
    panel: 'rgba(22, 14, 28, 0.72)',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=80',
    tint: 'rgba(12, 6, 16, 0.63)',
  },
  {
    id: 'pastel-clouds',
    name: 'Cotton Candy Sky',
    description: 'Fluffy pastel clouds dyed in pink and orange glow.',
    accent: '#fda4af',
    accent2: '#c084fc',
    panel: 'rgba(24, 16, 22, 0.72)',
    image: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=1800&q=80',
    tint: 'rgba(14, 8, 12, 0.64)',
  },
  {
    id: 'train-window',
    name: 'Trans-Siberian Drift',
    description: 'Watch the countryside roll by through a wooden cabin window.',
    accent: '#a78bfa',
    accent2: '#60a5fa',
    panel: 'rgba(18, 16, 24, 0.72)',
    image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1800&q=80',
    tint: 'rgba(8, 8, 14, 0.65)',
  },
  {
    id: 'space-station',
    name: 'Earth Rise Orbit',
    description: 'Vast blackness of space and glowing blue home planet.',
    accent: '#38bdf8',
    accent2: '#818cf8',
    panel: 'rgba(10, 14, 28, 0.75)',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1800&q=80',
    tint: 'rgba(4, 6, 16, 0.7)',
  },
  {
    id: 'cyber-tokyo',
    name: 'Rainy Cyber Shinjuku',
    description: 'Glowing high-tech billboard reflections on wet asphalt.',
    accent: '#06b6d4',
    accent2: '#ec4899',
    panel: 'rgba(12, 10, 24, 0.75)',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1800&q=80',
    tint: 'rgba(6, 4, 14, 0.7)',
  },
]

const STORAGE_KEY = 'studyflow_focus_profile'
const LEGACY_STATS_KEY = 'studyflow_stats'

const DEFAULT_PROFILE: FocusProfile = {
  xp: 0,
  streak: 0,
  bestStreak: 0,
  lastStudyDate: null,
  sessions: 0,
  minutes: 0,
  history: [],
  unlockedThemeIds: ['lofi-study', 'misty-forest', 'deep-ocean', 'rainy-cafe'],
  badges: [],
  activeEnvironmentId: 'lofi-study',
}

export function getTodayKey(date = new Date()) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getOffsetDateKey(offset: number) {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  return getTodayKey(date)
}

function dayDifference(from: string, to: string) {
  const [fromYear, fromMonth, fromDay] = from.split('-').map(Number)
  const [toYear, toMonth, toDay] = to.split('-').map(Number)
  const fromDate = new Date(fromYear, fromMonth - 1, fromDay)
  const toDate = new Date(toYear, toMonth - 1, toDay)
  return Math.round((toDate.getTime() - fromDate.getTime()) / 86400000)
}

function unique(values: string[]) {
  return Array.from(new Set(values))
}

export function getStudyEnvironment(id?: string | null) {
  return STUDY_ENVIRONMENTS.find((environment) => environment.id === id) ?? STUDY_ENVIRONMENTS[0]
}

export function getLevelInfo(xp: number) {
  const level = Math.max(1, Math.floor(xp / 250) + 1)
  const currentLevelXp = (level - 1) * 250
  const nextLevelXp = level * 250
  const progress = Math.min(100, Math.round(((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100))

  return {
    level,
    currentLevelXp,
    nextLevelXp,
    progress,
  }
}

export function loadFocusProfile(): FocusProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<FocusProfile>
      return {
        ...DEFAULT_PROFILE,
        ...parsed,
        history: Array.isArray(parsed.history) ? parsed.history : [],
        unlockedThemeIds: Array.isArray(parsed.unlockedThemeIds) ? parsed.unlockedThemeIds : DEFAULT_PROFILE.unlockedThemeIds,
        badges: Array.isArray(parsed.badges) ? parsed.badges : [],
      }
    }

    const legacy = window.localStorage.getItem(LEGACY_STATS_KEY)
    if (legacy) {
      const parsed = JSON.parse(legacy) as { date?: string; sessions?: number; minutes?: number }
      const date = parsed.date ? getTodayKey(new Date(parsed.date)) : getTodayKey()
      const sessions = parsed.sessions ?? 0
      const minutes = parsed.minutes ?? 0
      return {
        ...DEFAULT_PROFILE,
        xp: sessions * 50,
        streak: sessions > 0 ? 1 : 0,
        bestStreak: sessions > 0 ? 1 : 0,
        lastStudyDate: sessions > 0 ? date : null,
        sessions,
        minutes,
        history: sessions > 0 ? [{ date, sessions, minutes, xp: sessions * 50 }] : [],
      }
    }
  } catch (error) {
    console.error('Failed to load StudyFlow focus profile', error)
  }

  return DEFAULT_PROFILE
}

export function saveFocusProfile(profile: FocusProfile) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
}

export function recordFocusCompletion(profile: FocusProfile, minutes: number) {
  const today = getTodayKey()
  const xpEarned = Math.max(35, Math.round(minutes * 2))
  const lastDate = profile.lastStudyDate
  const nextStreak = lastDate === today
    ? Math.max(1, profile.streak)
    : lastDate && dayDifference(lastDate, today) === 1
      ? profile.streak + 1
      : 1

  const history = [...profile.history]
  const existingIndex = history.findIndex((entry) => entry.date === today)
  if (existingIndex >= 0) {
    history[existingIndex] = {
      ...history[existingIndex],
      minutes: history[existingIndex].minutes + minutes,
      sessions: history[existingIndex].sessions + 1,
      xp: history[existingIndex].xp + xpEarned,
    }
  } else {
    history.push({ date: today, minutes, sessions: 1, xp: xpEarned })
  }

  const xp = profile.xp + xpEarned
  const level = getLevelInfo(xp).level
  const unlockedThemeIds = unique([
    ...profile.unlockedThemeIds,
    ...(level >= 1 ? ['lofi-study', 'misty-forest', 'deep-ocean', 'rainy-cafe'] : []),
    ...(level >= 2 ? ['stellar-nebula', 'zen-bonsai', 'autumn-wood'] : []),
    ...(level >= 3 ? ['snow-cabin', 'midnight-beach', 'aurora'] : []),
    ...(level >= 4 ? ['desert', 'sakura', 'retro-arcade'] : []),
    ...(level >= 5 ? ['synthwave', 'underwater', 'greenhouse'] : []),
    ...(level >= 6 ? ['balcony', 'lavender', 'pastel-clouds'] : []),
    ...(level >= 7 ? ['train-window', 'space-station', 'cyber-tokyo'] : []),
  ])

  const badges = unique([
    ...profile.badges,
    ...(nextStreak >= 3 ? ['3-day streak'] : []),
    ...(nextStreak >= 7 ? ['7-day streak'] : []),
    ...(profile.sessions + 1 >= 10 ? ['10 sessions'] : []),
    ...(profile.minutes + minutes >= 600 ? ['10 focus hours'] : []),
  ])

  const nextProfile: FocusProfile = {
    ...profile,
    xp,
    streak: nextStreak,
    bestStreak: Math.max(profile.bestStreak, nextStreak),
    lastStudyDate: today,
    sessions: profile.sessions + 1,
    minutes: profile.minutes + minutes,
    history: history.slice(-120),
    unlockedThemeIds,
    badges,
  }

  saveFocusProfile(nextProfile)
  return {
    profile: nextProfile,
    xpEarned,
  }
}

export function getRecentHistory(profile: FocusProfile, days: number) {
  return Array.from({ length: days }, (_, index) => {
    const date = getOffsetDateKey(index - days + 1)
    const entry = profile.history.find((item) => item.date === date)
    return {
      date,
      minutes: entry?.minutes ?? 0,
      sessions: entry?.sessions ?? 0,
      xp: entry?.xp ?? 0,
    }
  })
}
