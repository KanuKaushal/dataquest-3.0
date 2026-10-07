'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type StepState = 'done' | 'current' | 'pending'

const STEPS: { label: string; note: string; state: StepState }[] = [
  { label: 'Submitted', note: 'Just now', state: 'done' },
  { label: 'Approval', note: 'In progress', state: 'current' },
  { label: 'Technician assigned', note: 'After approval', state: 'pending' },
]

function StepMarker({ state }: { state: StepState }) {
  if (state === 'done') {
    return <span aria-hidden className="size-3.5 rounded-full bg-done" />
  }
  if (state === 'current') {
    return (
      <span aria-hidden className="flex size-3.5 items-center justify-center rounded-full border border-progress">
        <span className="size-1.5 animate-pulse rounded-full bg-progress" />
      </span>
    )
  }
  return <span aria-hidden className="size-3.5 rounded-full border border-muted-foreground/50" />
}

interface SuccessViewProps {
  requestId: string
  onView: () => void
  onCreateAnother: () => void
}

export function SuccessView({ requestId, onView, onCreateAnother }: SuccessViewProps) {
  return (
    <motion.section
      aria-labelledby="success-title"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="mx-auto flex w-full max-w-xl flex-col items-center py-12 text-center"
    >
      <svg viewBox="0 0 48 48" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.5" className="size-12 text-done">
        <motion.circle
          cx="24"
          cy="24"
          r="21"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        <motion.path
          d="M15 25 L21.5 31.5 L33 18"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut', delay: 0.4 }}
        />
      </svg>

      <motion.h2
        id="success-title"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: 'easeOut', delay: 0.3 }}
        className="mt-6 font-serif text-[34px] leading-tight"
      >
        Request submitted
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.28, ease: 'easeOut', delay: 0.4 }}
        className="mt-2 font-mono text-sm"
      >
        {requestId}
      </motion.p>

      <ol className="mt-12 flex w-full items-start">
        {STEPS.map((step, index) => (
          <motion.li
            key={step.label}
            aria-current={step.state === 'current' ? 'step' : undefined}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut', delay: 0.6 + index * 0.18 }}
            className="relative flex flex-1 flex-col items-center gap-2 px-1"
          >
            {index < STEPS.length - 1 && (
              <span aria-hidden className="absolute top-[7px] left-1/2 h-px w-full bg-border" />
            )}
            <span className="relative z-10 bg-background px-1">
              <StepMarker state={step.state} />
            </span>
            <span className={cn('text-[13px]', step.state === 'pending' && 'text-muted-foreground')}>
              {step.label}
            </span>
            <span className="font-mono text-xs text-muted-foreground">{step.note}</span>
          </motion.li>
        ))}
      </ol>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: 'easeOut', delay: 1.2 }}
        className="mt-12 flex items-center gap-3"
      >
        <Button variant="solid" onClick={onView}>
          View request
        </Button>
        <Button variant="ghost" onClick={onCreateAnother}>
          Create another
        </Button>
      </motion.div>
    </motion.section>
  )
}
