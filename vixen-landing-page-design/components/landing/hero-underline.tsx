'use client'

import { motion } from 'framer-motion'

export function HeroUnderline({ children }: { children: string }) {
  return (
    <span className="relative inline-block">
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 200 14"
        preserveAspectRatio="none"
        className="absolute -bottom-1 left-0 h-[0.2em] w-full overflow-visible"
        fill="none"
      >
        <motion.path
          data-draw
          d="M3 9.5C28 4.5 52 11 86 6.8C118 3 150 9.8 197 5.2"
          stroke="var(--accent)"
          strokeWidth="3.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, delay: 0.55, ease: 'easeOut' }}
        />
      </svg>
    </span>
  )
}
