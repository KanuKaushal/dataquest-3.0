'use client'

import { animate, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

export function CountUp({ value }: { value: number }) {
  const reduceMotion = useReducedMotion()
  const [display, setDisplay] = useState(0)
  const current = useRef(0)

  useEffect(() => {
    if (reduceMotion) {
      current.current = value
      setDisplay(value)
      return
    }
    const controls = animate(current.current, value, {
      duration: 0.8,
      ease: 'easeOut',
      onUpdate: (latest) => {
        current.current = latest
        setDisplay(Math.round(latest))
      },
    })
    return () => controls.stop()
  }, [value, reduceMotion])

  return <span>{display}</span>
}
