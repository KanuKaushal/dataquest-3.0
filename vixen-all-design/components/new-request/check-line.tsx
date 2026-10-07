'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { Check, CheckStatus } from '@/lib/new-request'
import { cn } from '@/lib/utils'

const MARK_COLOR: Record<CheckStatus, string> = {
  idle: 'text-muted-foreground/60',
  ok: 'text-done',
  caution: 'text-progress',
  warn: 'text-accent',
}

const draw = { duration: 0.3, ease: 'easeOut' as const }

function StatusMark({ status }: { status: CheckStatus }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('size-4', MARK_COLOR[status])}
    >
      {status === 'idle' && <circle cx="8" cy="8" r="4.5" />}
      {status === 'ok' && (
        <motion.path
          d="M3 8.5 L6.5 12 L13 4.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={draw}
        />
      )}
      {(status === 'caution' || status === 'warn') && (
        <>
          <circle cx="8" cy="8" r="6" />
          <motion.path
            d="M8 4.8 V8.6"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={draw}
          />
          <motion.path
            d="M8 11.2 V11.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ ...draw, delay: 0.2 }}
          />
        </>
      )}
    </svg>
  )
}

interface CheckLineProps {
  label: string
  check: Check
}

export function CheckLine({ label, check }: CheckLineProps) {
  const [settledSignature, setSettledSignature] = useState(check.signature)
  const resolving = settledSignature !== check.signature

  useEffect(() => {
    if (!resolving) return
    const timer = setTimeout(() => setSettledSignature(check.signature), 400)
    return () => clearTimeout(timer)
  }, [resolving, check.signature])

  const markKey = resolving ? 'pending' : check.status
  const messageKey = resolving ? 'checking' : check.message
  const quiet = resolving || check.status === 'idle'

  return (
    <li className="flex items-start gap-3 py-3.5">
      <span className="flex size-4 shrink-0 items-center justify-center pt-px">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={markKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="flex"
          >
            {resolving ? (
              <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-muted-foreground" />
            ) : (
              <StatusMark status={check.status} />
            )}
          </motion.span>
        </AnimatePresence>
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={messageKey}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={cn('mt-0.5 text-[13px] leading-snug', quiet ? 'text-muted-foreground' : 'text-foreground')}
          >
            {resolving ? 'Checking' : check.message}
          </motion.p>
        </AnimatePresence>
      </div>
    </li>
  )
}
