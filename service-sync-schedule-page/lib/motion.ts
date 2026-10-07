'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion, type Transition } from 'framer-motion'

export const EASE_OUT = [0.22, 1, 0.36, 1] as const

export function useMotionPrefs() {
  const reduced = useReducedMotion() ?? false

  const transition = (duration = 0.22, delay = 0): Transition => ({
    duration: reduced ? 0 : duration,
    delay: reduced ? 0 : delay,
    ease: EASE_OUT,
  })

  return { reduced, transition }
}

export function useCountUp(target: number, duration = 700) {
  const { reduced } = useMotionPrefs()
  const [value, setValue] = useState(reduced ? target : 0)
  const shown = useRef(reduced ? target : 0)

  useEffect(() => {
    if (reduced) {
      shown.current = target
      setValue(target)
      return
    }

    const from = shown.current
    const startedAt = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const next = Math.round(from + (target - from) * eased)
      shown.current = next
      setValue(next)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, reduced, duration])

  return value
}
