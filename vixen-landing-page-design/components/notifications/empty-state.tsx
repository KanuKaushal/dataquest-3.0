'use client'

import { motion } from 'framer-motion'
import { Bell } from 'lucide-react'

interface EmptyStateProps {
  title: string
  message: string
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut', delay: 0.15 }}
      className="flex flex-col items-center px-6 py-20 text-center"
    >
      <Bell aria-hidden strokeWidth={1} className="size-10 text-muted-foreground" />
      <h3 className="mt-5 font-serif text-[26px] leading-tight">{title}</h3>
      <p className="mt-1.5 max-w-xs text-[13px] text-muted-foreground">{message}</p>
    </motion.div>
  )
}
