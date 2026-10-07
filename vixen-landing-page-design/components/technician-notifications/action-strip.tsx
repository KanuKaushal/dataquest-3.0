'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { DeclinePanel } from '@/components/technician-notifications/decline-panel'
import { useTechnicianNotifications } from '@/components/technician-notifications/technician-notifications-provider'
import { useToast } from '@/components/toast'
import { Button } from '@/components/ui/button'
import {
  PENDING_ASSIGNMENT,
  URGENT_COUNTDOWN_SECONDS,
} from '@/lib/technician-notifications'
import { cn } from '@/lib/utils'

const { notificationId, requestId, machine, site, respondWithinMinutes, offerSeconds } =
  PENDING_ASSIGNMENT

function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function ActionStrip() {
  const { markRead } = useTechnicianNotifications()
  const toast = useToast()
  const [open, setOpen] = useState(true)
  const [declining, setDeclining] = useState(false)
  const [remaining, setRemaining] = useState(offerSeconds)

  const resolve = (message: string) => {
    markRead(notificationId)
    setOpen(false)
    toast(message)
  }

  useEffect(() => {
    if (!open) return
    const timer = setInterval(() => setRemaining((seconds) => Math.max(seconds - 1, 0)), 1000)
    return () => clearInterval(timer)
  }, [open])

  useEffect(() => {
    if (open && remaining === 0) {
      markRead(notificationId)
      setOpen(false)
      toast("Response time ended. We'll reassign it.")
    }
  }, [open, remaining, markRead, toast])

  return (
    <AnimatePresence initial>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ height: 0, opacity: 0, transition: { duration: 0.25, ease: 'easeOut' } }}
          transition={{ duration: 0.28, ease: 'easeOut', delay: 0.06 }}
          className="overflow-hidden"
        >
          <section aria-label="Action needed" className="relative mb-8 rounded-md border">
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 w-0.5 rounded-l-md bg-accent"
            />
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-4 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:gap-x-6 sm:px-5">
              <div className="min-w-0">
                <p className="text-sm font-semibold">1 job is waiting for your response</p>
                <p className="mt-0.5 text-[13px] text-muted-foreground">
                  {`${requestId}, ${machine}, ${site}. Respond within ${respondWithinMinutes} min`}
                </p>
              </div>

              <span
                role="timer"
                aria-label={`${formatCountdown(remaining)} left to respond`}
                className={cn(
                  'font-mono text-[20px] tabular-nums transition-colors duration-300',
                  remaining < URGENT_COUNTDOWN_SECONDS ? 'text-accent' : 'text-foreground',
                )}
              >
                {formatCountdown(remaining)}
              </span>

              <div className="col-span-2 grid grid-cols-2 gap-2 sm:col-span-1 sm:flex">
                <Button
                  variant="primary"
                  onClick={() => resolve("Job accepted. Added to today's jobs.")}
                >
                  Accept
                </Button>
                <Button
                  variant="ghost"
                  aria-expanded={declining}
                  onClick={() => setDeclining((value) => !value)}
                >
                  Decline
                </Button>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {declining && (
                <DeclinePanel onConfirm={() => resolve("Declined. We'll reassign it.")} />
              )}
            </AnimatePresence>
          </section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
