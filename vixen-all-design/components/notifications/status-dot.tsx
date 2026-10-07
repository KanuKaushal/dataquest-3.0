'use client'

import { motion } from 'framer-motion'
import type { NotificationKind } from '@/lib/notifications'
import { cn } from '@/lib/utils'

const KIND_COLOR: Record<NotificationKind, string> = {
  exception: 'text-accent',
  update: 'text-[#5c5a54]',
  completion: 'text-done',
}

interface StatusDotProps {
  kind: NotificationKind
  unread: boolean
  className?: string
}

export function StatusDot({ kind, unread, className }: StatusDotProps) {
  return (
    <span aria-hidden className={cn('relative block size-2.5 shrink-0', KIND_COLOR[kind], className)}>
      <span className="absolute inset-0 rounded-full border-[1.5px] border-current" />
      <motion.span
        initial={false}
        animate={unread ? { opacity: 1, scale: 1 } : { opacity: 0, scale: [1, 1.5, 0.5] }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="absolute inset-0 rounded-full bg-current"
      />
    </span>
  )
}
