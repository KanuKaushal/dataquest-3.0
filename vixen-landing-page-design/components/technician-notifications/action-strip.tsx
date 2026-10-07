'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { DeclinePanel } from '@/components/technician-notifications/decline-panel'
import { useTechnicianNotifications } from '@/components/technician-notifications/technician-notifications-provider'
import { useToast } from '@/components/toast'
import { Button } from '@/components/ui/button'
import { URGENT_COUNTDOWN_SECONDS } from '@/lib/technician-notifications'
import { cn } from '@/lib/utils'
import {
  getStoredOffers,
  type PendingOffer,
} from '@/lib/technician-job-storage'

function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function ActionStrip() {
  const { respondOffer } = useTechnicianNotifications()
  const toast = useToast()
  const [activeOffer, setActiveOffer] = useState<PendingOffer | null>(null)
  const [declining, setDeclining] = useState(false)
  const [remaining, setRemaining] = useState<number>(0)

  // Listen for offer changes and initialize
  useEffect(() => {
    const updateActiveOffer = () => {
      const offers = getStoredOffers()
      const pending = offers.find((o) => o.status === 'pending')
      if (pending) {
        setActiveOffer(pending)
        const secondsLeft = Math.max(0, Math.floor((pending.expiresAt - Date.now()) / 1000))
        setRemaining(secondsLeft)
      } else {
        setActiveOffer(null)
      }
    }

    updateActiveOffer()

    const handleOffersChanged = () => updateActiveOffer()
    window.addEventListener('vixen_offers_changed', handleOffersChanged)
    window.addEventListener('storage', handleOffersChanged)

    return () => {
      window.removeEventListener('vixen_offers_changed', handleOffersChanged)
      window.removeEventListener('storage', handleOffersChanged)
    }
  }, [])

  // Timer tick
  useEffect(() => {
    if (!activeOffer) return

    const interval = setInterval(() => {
      const secondsLeft = Math.max(0, Math.floor((activeOffer.expiresAt - Date.now()) / 1000))
      setRemaining(secondsLeft)

      if (secondsLeft === 0) {
        respondOffer(activeOffer.notificationId, 'expired')
        toast("Response time limit ended. Job reassigned to next technician.")
        setActiveOffer(null)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [activeOffer, respondOffer, toast])

  const handleAccept = () => {
    if (!activeOffer) return
    respondOffer(activeOffer.notificationId, 'accepted')
    toast("Job accepted! Added to today's jobs.")
    setActiveOffer(null)
  }

  const handleDeclineConfirm = (reason?: string) => {
    if (!activeOffer) return
    respondOffer(activeOffer.notificationId, 'declined', reason)
    toast("Job declined. Reassigned to next technician.")
    setActiveOffer(null)
    setDeclining(false)
  }

  if (!activeOffer) {
    return null
  }

  const { requestId, machine, site, respondWithinMinutes } = activeOffer

  return (
    <AnimatePresence initial>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ height: 0, opacity: 0, transition: { duration: 0.25, ease: 'easeOut' } }}
        transition={{ duration: 0.28, ease: 'easeOut', delay: 0.06 }}
        className="overflow-hidden"
      >
        <section aria-label="Action needed" className="relative mb-8 rounded-md border border-accent/40 bg-accent/5">
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 w-1 rounded-l-md bg-accent"
          />
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-4 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:gap-x-6 sm:px-5">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex size-2 animate-ping rounded-full bg-accent opacity-75" />
                <p className="text-sm font-semibold text-foreground">1 job is waiting for your response</p>
              </div>
              <p className="mt-0.5 text-[13px] text-muted-foreground">
                {`${requestId}, ${machine}, ${site}. Time limit: respond within ${respondWithinMinutes} min`}
              </p>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">Time left</span>
              <span
                role="timer"
                aria-label={`${formatCountdown(remaining)} left to respond`}
                className={cn(
                  'font-mono text-[22px] font-bold tabular-nums transition-colors duration-300',
                  remaining < URGENT_COUNTDOWN_SECONDS ? 'text-accent animate-pulse' : 'text-foreground',
                )}
              >
                {formatCountdown(remaining)}
              </span>
            </div>

            <div className="col-span-2 grid grid-cols-2 gap-2 sm:col-span-1 sm:flex">
              <Button
                variant="primary"
                onClick={handleAccept}
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
              <DeclinePanel onConfirm={handleDeclineConfirm} />
            )}
          </AnimatePresence>
        </section>
      </motion.div>
    </AnimatePresence>
  )
}
