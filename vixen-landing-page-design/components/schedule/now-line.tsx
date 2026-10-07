'use client'

import { motion } from 'framer-motion'
import { useMotionPrefs } from '@/lib/motion'
import { formatClock } from '@/lib/schedule/time'

export function NowLine({ minutes }: { minutes: number }) {
  const { reduced, transition } = useMotionPrefs()
  const clock = formatClock(minutes)

  return (
    <motion.li
      key={clock}
      aria-label={`Current time ${clock}`}
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={transition(0.3)}
      className="grid grid-cols-[var(--time-col)_minmax(0,1fr)] items-center gap-x-3 px-3 py-1.5"
    >
      <span className="font-mono text-[10px] leading-none whitespace-nowrap text-primary">now {clock}</span>
      <span aria-hidden className="h-px bg-primary" />
    </motion.li>
  )
}
