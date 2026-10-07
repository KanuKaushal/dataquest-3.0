'use client'

import { useEffect, useState } from 'react'
import { MOCK_NOW_MINUTES } from '@/lib/schedule/data'

const TICK_MS = 15_000

/** Mock clock: starts at 09:12 and advances one minute per real minute. */
export function useNow() {
  const [minutes, setMinutes] = useState(MOCK_NOW_MINUTES)

  useEffect(() => {
    const startedAt = Date.now()
    const id = window.setInterval(() => {
      setMinutes(MOCK_NOW_MINUTES + Math.floor((Date.now() - startedAt) / 60_000))
    }, TICK_MS)
    return () => window.clearInterval(id)
  }, [])

  return minutes
}
