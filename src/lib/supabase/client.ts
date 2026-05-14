import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key || url.includes('your_supabase_url') || !url.startsWith('http')) {
    // Return a mock client that won't crash during build/SSR without env vars
    return null as unknown as ReturnType<typeof createBrowserClient>
  }

  return createBrowserClient(url, key)
}
