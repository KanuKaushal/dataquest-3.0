'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useMotionPrefs } from '@/lib/motion'

export type PillStatus = 'done' | 'in-progress' | 'urgent' | 'pending'

const PILLS: Record<PillStatus, { label: string; color: string }> = {
  done: { label: 'Done', color: '#3F7D58' },
  'in-progress': { label: 'In progress', color: '#B7791F' },
  urgent: { label: 'Urgent', color: '#E8590C' },
  pending: { label: 'Pending', color: '#77756E' },
}

export function StatusPill({ status }: { status: PillStatus }) {
  const { transition } = useMotionPrefs()
  const { label, color } = PILLS[status]

  return (
    <motion.span
      initial={false}
      animate={{ color }}
      transition={transition(0.25)}
      className="inline-flex items-center gap-1.5 rounded-full border px-2 py-px text-[12px] leading-5"
    >
      <motion.span
        aria-hidden
        initial={false}
        animate={{ backgroundColor: color }}
        transition={transition(0.25)}
        className="size-1.5 rounded-full"
      />
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition(0.12)}
        >
          {label}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  )
}
