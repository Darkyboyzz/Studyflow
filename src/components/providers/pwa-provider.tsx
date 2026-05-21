'use client'

import { useEffect } from 'react'

export function PwaProvider() {
  useEffect(() => {
    if (!('serviceWorker' in navigator) || process.env.NODE_ENV !== 'production') {
      return
    }

    navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    }).catch((error) => {
      console.error('StudyFlow service worker registration failed', error)
    })
  }, [])

  return null
}
