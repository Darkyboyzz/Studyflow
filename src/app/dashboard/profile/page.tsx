'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Cropper from 'react-easy-crop'
import { useTheme } from 'next-themes'
import {
  AlertTriangle,
  BookOpen,
  Camera,
  Check,
  ClipboardCheck,
  FileText,
  Loader2,
  Lock,
  LogOut,
  Mail,
  Moon,
  Shield,
  Sparkles,
  Sun,
  Trash2,
  User,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

type PixelCrop = {
  x: number
  y: number
  width: number
  height: number
}

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const { resolvedTheme, setTheme } = useTheme()
  const [loading, setLoading] = useState(false)
  const [counts, setCounts] = useState({ subjects: 0, tasks: 0, notes: 0 })
  const [profile, setProfile] = useState({ full_name: '', email: '' })
  const [image, setImage] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(null)
  const [showCropper, setShowCropper] = useState(false)
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    if (!user) return
    const id = window.setTimeout(() => {
      setProfile({
        full_name: user.user_metadata?.display_name || user.user_metadata?.full_name || '',
        email: user.email || '',
      })
    }, 0)

    let ignore = false
    async function fetchCounts() {
      const [subRes, taskRes, noteRes] = await Promise.all([
        supabase.from('subjects').select('*', { count: 'exact', head: true }).eq('user_id', user!.id),
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('user_id', user!.id),
        supabase.from('notes').select('*', { count: 'exact', head: true }).eq('user_id', user!.id),
      ])
      if (!ignore) {
        setCounts({
          subjects: subRes.count || 0,
          tasks: taskRes.count || 0,
          notes: noteRes.count || 0,
        })
      }
    }
    fetchCounts()

    return () => {
      ignore = true
      window.clearTimeout(id)
    }
  }, [supabase, user])

  const handleUpdateProfile = async () => {
    if (!user) return
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ data: { full_name: profile.full_name, display_name: profile.full_name } })
    toast[error ? 'error' : 'success'](error ? error.message : 'Profile updated')
    setLoading(false)
  }

  const handlePasswordChange = async () => {
    if (newPassword.length < 6) return toast.error('Password must be at least 6 characters long')
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Password updated')
      setIsChangingPassword(false)
      setNewPassword('')
    }
    setLoading(false)
  }

  const onCropComplete = (_croppedArea: PixelCrop, nextPixels: PixelCrop) => {
    setCroppedAreaPixels(nextPixels)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener('load', () => setImage(reader.result as string))
      reader.readAsDataURL(event.target.files[0])
      setShowCropper(true)
    }
  }

  const getCroppedImg = async (imageSrc: string, pixelCrop: PixelCrop): Promise<Blob | null> => {
    const imageElement = new window.Image()
    imageElement.src = imageSrc
    await new Promise((resolve) => {
      imageElement.onload = resolve
    })

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height
    ctx.drawImage(imageElement, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height)

    return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), 'image/jpeg'))
  }

  const handleSaveCrop = async () => {
    if (!image || !croppedAreaPixels || !user) return
    setLoading(true)
    try {
      const croppedBlob = await getCroppedImg(image, croppedAreaPixels)
      if (!croppedBlob) throw new Error('Failed to crop image')

      const fileName = `${user.id}-${Math.random()}.jpg`
      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, croppedBlob, { upsert: true })
      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName)
      const { error: updateError } = await supabase.auth.updateUser({ data: { avatar_url: publicUrl } })
      if (updateError) throw updateError

      await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id)
      toast.success('Profile photo updated')
      setShowCropper(false)
      window.location.reload()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload photo')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Delete your account and all StudyFlow data? This cannot be undone.')) return
    if (!user) return
    setLoading(true)
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', user.id)
      if (error) throw error
      toast.success('Account deleted')
      await signOut()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete account')
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="grid min-h-[70vh] place-items-center text-slate-950 dark:text-white">
        <div className="w-full max-w-lg rounded-[32px] border border-white/70 bg-white/82 p-8 text-center shadow-xl shadow-emerald-950/5 backdrop-blur-2xl dark:border-white/10 dark:bg-white/8">
          <User className="mx-auto h-10 w-10 text-emerald-500" />
          <h1 className="mt-4 text-2xl font-black">Settings need an active session</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-white/45">
            Sign in to manage profile, appearance, security, and workspace preferences.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 text-slate-950 dark:text-white">
      <section className="relative overflow-hidden rounded-[32px] border border-white/12 bg-[#081411] p-5 text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-7">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_0%,rgba(52,211,153,0.22),transparent_30%),radial-gradient(circle_at_86%_8%,rgba(14,165,233,0.18),transparent_30%)]" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-xs font-bold text-white/70">
              <Sparkles className="h-3.5 w-3.5 text-emerald-200" />
              Account command center
            </div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Settings</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/62">Manage identity, appearance, security, and workspace activity in one place.</p>
          </div>
          <button onClick={() => signOut()} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-black text-emerald-950 shadow-xl transition hover:-translate-y-0.5">
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_390px]">
        <div className="space-y-5">
          <div className="rounded-[32px] border border-white/70 bg-white/82 p-5 shadow-xl shadow-emerald-950/5 backdrop-blur-2xl dark:border-white/10 dark:bg-white/8 sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <User className="h-5 w-5 text-emerald-500" />
              <h2 className="text-xl font-black">Profile information</h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-[160px_1fr]">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="grid h-32 w-32 place-items-center overflow-hidden rounded-[36px] bg-emerald-100 text-emerald-700 ring-4 ring-white dark:bg-emerald-400/10 dark:ring-white/10">
                    {user.user_metadata?.avatar_url ? (
                      <Image src={user.user_metadata.avatar_url} alt="Profile" width={128} height={128} className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-12 w-12" />
                    )}
                  </div>
                  <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
                  <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 grid h-12 w-12 cursor-pointer place-items-center rounded-2xl bg-slate-950 text-white shadow-xl transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950">
                    <Camera className="h-5 w-5" />
                  </label>
                </div>
              </div>
              <div className="grid gap-4">
                <label className="grid gap-2">
                  <Label className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Full name</Label>
                  <Input value={profile.full_name} onChange={(event) => setProfile({ ...profile, full_name: event.target.value })} className="h-12 rounded-2xl border-slate-200 bg-white font-semibold dark:border-white/10 dark:bg-black/18" />
                </label>
                <label className="grid gap-2">
                  <Label className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input value={profile.email} disabled className="h-12 rounded-2xl border-slate-200 bg-slate-50 pl-11 font-semibold dark:border-white/10 dark:bg-white/5" />
                  </div>
                </label>
                <div className="flex justify-end">
                  <button onClick={handleUpdateProfile} disabled={loading} className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white transition hover:-translate-y-0.5 disabled:opacity-50 dark:bg-white dark:text-slate-950">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/70 bg-white/82 p-5 shadow-xl shadow-emerald-950/5 backdrop-blur-2xl dark:border-white/10 dark:bg-white/8 sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <Shield className="h-5 w-5 text-cyan-500" />
              <h2 className="text-xl font-black">Preferences and security</h2>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col gap-4 rounded-3xl bg-slate-50 p-4 dark:bg-black/18 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-black">Appearance</p>
                  <p className="text-sm text-slate-500 dark:text-white/45">Switch between light and dark workspace modes.</p>
                </div>
                <div className="flex rounded-2xl bg-white p-1 dark:bg-white/8">
                  <button onClick={() => setTheme('light')} className={cn('inline-flex min-h-10 items-center gap-2 rounded-xl px-4 text-sm font-black transition', resolvedTheme === 'light' ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'text-slate-500 dark:text-white/45')}>
                    <Sun className="h-4 w-4" />
                    Light
                  </button>
                  <button onClick={() => setTheme('dark')} className={cn('inline-flex min-h-10 items-center gap-2 rounded-xl px-4 text-sm font-black transition', resolvedTheme === 'dark' ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'text-slate-500 dark:text-white/45')}>
                    <Moon className="h-4 w-4" />
                    Dark
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-3xl bg-slate-50 p-4 dark:bg-black/18">
                <div>
                  <p className="font-black">Smart notifications</p>
                  <p className="text-sm text-slate-500 dark:text-white/45">
                    {notificationsEnabled ? 'Upcoming exams and daily goals are enabled.' : 'Notifications are muted for this browser.'}
                  </p>
                </div>
                <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
              </div>

              <button onClick={() => setIsChangingPassword((value) => !value)} className="flex w-full items-center justify-between rounded-3xl bg-slate-50 p-4 text-left transition hover:bg-slate-100 dark:bg-black/18 dark:hover:bg-white/10">
                <span>
                  <span className="block font-black">Change password</span>
                  <span className="text-sm text-slate-500 dark:text-white/45">Update account credentials.</span>
                </span>
                <Lock className="h-5 w-5 text-slate-400" />
              </button>

              {isChangingPassword && (
                <div className="rounded-3xl border border-slate-100 bg-white p-4 dark:border-white/10 dark:bg-black/18">
                  <Label className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">New password</Label>
                  <Input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="mt-2 h-12 rounded-2xl border-slate-200 font-semibold dark:border-white/10 dark:bg-white/8" />
                  <button onClick={handlePasswordChange} disabled={loading || !newPassword} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 text-sm font-black text-white disabled:opacity-50">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    Update password
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-[32px] border border-white/12 bg-[#081411] p-5 text-white shadow-2xl shadow-black/20">
            <h2 className="text-xl font-black">Workspace activity</h2>
            <div className="mt-5 grid gap-3">
              {[
                { label: 'Subjects', value: counts.subjects, icon: BookOpen },
                { label: 'Tasks', value: counts.tasks, icon: ClipboardCheck },
                { label: 'Notes', value: counts.notes, icon: FileText },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between rounded-3xl bg-white/8 p-4">
                  <div>
                    <p className="text-3xl font-black">{stat.value}</p>
                    <p className="text-xs font-bold text-white/45">{stat.label}</p>
                  </div>
                  <stat.icon className="h-6 w-6 text-emerald-200" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-red-200/70 bg-red-50/80 p-5 text-red-700 shadow-xl backdrop-blur-2xl dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5" />
              <h2 className="text-xl font-black">Danger zone</h2>
            </div>
            <p className="mt-3 text-sm leading-6 opacity-75">Permanently delete your account and all associated StudyFlow data.</p>
            <button onClick={handleDeleteAccount} disabled={loading} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-red-600 text-sm font-black text-white transition hover:-translate-y-0.5 disabled:opacity-50">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete account
            </button>
          </div>
        </aside>
      </section>

      {showCropper && image && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/80 p-4 text-white backdrop-blur-xl">
          <div className="w-full max-w-lg overflow-hidden rounded-[32px] border border-white/10 bg-[#081411] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <h3 className="text-xl font-black">Crop profile photo</h3>
              <button onClick={() => setShowCropper(false)} className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative h-[380px] bg-black/40">
              <Cropper image={image} crop={crop} zoom={zoom} aspect={1} cropShape="round" showGrid={false} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} />
            </div>
            <div className="space-y-5 p-5">
              <div>
                <div className="mb-2 flex justify-between text-sm font-black">
                  <span>Zoom</span>
                  <span>{Math.round(zoom * 100)}%</span>
                </div>
                <input type="range" value={zoom} min={1} max={3} step={0.1} onChange={(event) => setZoom(Number(event.target.value))} className="w-full accent-emerald-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setShowCropper(false)} className="min-h-12 rounded-2xl border border-white/10 font-black">Cancel</button>
                <button onClick={handleSaveCrop} disabled={loading} className="min-h-12 rounded-2xl bg-white font-black text-emerald-950 disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save photo'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
