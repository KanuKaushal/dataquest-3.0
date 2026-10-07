'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  delay?: number
  onLoad?: boolean
  className?: string
}

// Reduced motion is handled in globals.css via [data-reveal], so SSR output stays identical.
export function Reveal({ children, delay = 0, onLoad = false, className }: RevealProps) {
  const target = { opacity: 1, y: 0 }

  return (
    <motion.div
      data-reveal
      className={className}
      initial={{ opacity: 0, y: 8 }}
      {...(onLoad
        ? { animate: target }
        : { whileInView: target, viewport: { once: true, margin: '0px 0px -48px 0px' } })}
      transition={{ duration: 0.3, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  )
}
