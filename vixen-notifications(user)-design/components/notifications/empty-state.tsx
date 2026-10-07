'use client'

import { motion } from 'framer-motion'
import { Bell } from 'lucide-react'
import type { TabKey } from '@/lib/notifications'

const COPY: Record<TabKey, { title: string; message: string }> = {
  unread: { title: "You're all caught up", message: 'New alerts will show up here.' },
  all: { title: 'No notifications', message: 'New alerts will show up here.' },
  exceptions: {
    title: 'No exceptions',
    message: 'Technician dropouts, part shortages and SLA breaches will show up here.',
  },
  updates: {
    title: 'No updates',
    message: 'Approvals, assignments and completions will show up here.',
  },
}

export function EmptyState({ tab }: { tab: TabKey }) {
  const { title, message } = COPY[tab]

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
