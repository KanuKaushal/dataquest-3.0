'use client'

import { motion } from 'framer-motion'

interface FadeUpProps {
  delay?: number
  className?: string
  children: React.ReactNode
}

export function FadeUp({ delay = 0, className, children }: FadeUpProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  )
}
