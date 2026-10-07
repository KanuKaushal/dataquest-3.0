'use client'

import { motion } from 'framer-motion'
import { EASE_OUT, useMotionPrefs } from '@/lib/motion'

const STAGGER_SECONDS = 0.06

interface RevealProps {
  index?: number
  className?: string
  children: React.ReactNode
}

export function Reveal({ index = 0, className, children }: RevealProps) {
  const { reduced } = useMotionPrefs()

  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * STAGGER_SECONDS, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  )
}
