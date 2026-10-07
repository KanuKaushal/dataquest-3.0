'use client'

import { AnimatePresence, motion } from 'framer-motion'
import type { Status } from '@/lib/mock-data'

const STATUS: Record<Status, { label: string; color: string; dot: string }> = {
  pending: { label: 'Pending', color: '#77756e', dot: '#a8a59b' },
  in_progress: { label: 'In progress', color: '#b7791f', dot: '#b7791f' },
  done: { label: 'Done', color: '#3f7d58', dot: '#3f7d58' },
  overdue: { label: 'Overdue', color: '#e8590c', dot: '#e8590c' },
}

export function StatusPill({ status }: { status: Status }) {
  const { label, color, dot } = STATUS[status]

  return (
    <motion.span
      initial={false}
      animate={{ color, borderColor: dot }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap"
    >
      <motion.span
        aria-hidden
        initial={false}
        animate={{ backgroundColor: dot }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="size-1.5 rounded-full"
      />
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={label}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {label}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  )
}
