'use client'

import { useEffect, useState } from 'react'
import { EventTimeline } from '@/components/notifications/event-timeline'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/toast'
import { useTechnicianNotifications } from '@/components/technician-notifications/technician-notifications-provider'
import { DECLINE_REASONS, type JobDetails, type TechnicianNotification } from '@/lib/technician-notifications'
import { cn } from '@/lib/utils'

interface RowDetailProps {
  notification: TechnicianNotification
  onAction: () => void
  onToggleRead: () => void
}

function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function OfferTimerBlock({ notification }: { notification: TechnicianNotification }) {
  const { respondOffer } = useTechnicianNotifications()
  const toast = useToast()
  const offer = notification.offer
  const [declining, setDeclining] = useState(false)
  const [selectedReason, setSelectedReason] = useState<string>(DECLINE_REASONS[0])

  const expiresAt = offer?.expiresAt ?? (Date.now() + (offer?.offerSeconds ?? 600) * 1000)
  const [remaining, setRemaining] = useState<number>(() =>
    Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)),
  )

  useEffect(() => {
    if (offer?.status !== 'pending') return

    const interval = setInterval(() => {
      const left = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000))
      setRemaining(left)

      if (left === 0) {
        respondOffer(notification.id, 'expired')
        toast('Response time limit expired. Job reassigned.')
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [offer?.status, expiresAt, notification.id, respondOffer, toast])

  if (!offer) return null

  if (offer.status === 'accepted') {
    return (
      <div className="max-w-xl rounded-md border border-done/40 bg-done/5 p-4 text-xs font-mono">
        <span className="font-semibold text-done">✓ Accepted</span> — This job has been added to your active schedule.
      </div>
    )
  }

  if (offer.status === 'declined') {
    return (
      <div className="max-w-xl rounded-md border border-muted p-4 text-xs font-mono text-muted-foreground">
        <span className="font-semibold text-foreground">✗ Declined</span> — {offer.declineReason || 'Unavailable'}. Reassigned to another technician.
      </div>
    )
  }

  if (offer.status === 'expired' || remaining === 0) {
    return (
      <div className="max-w-xl rounded-md border border-pending/40 bg-pending/5 p-4 text-xs font-mono text-muted-foreground">
        <span className="font-semibold text-pending">⏱ Time Limit Expired</span> — The {offer.respondWithinMinutes}-minute response window ended. Job was automatically reassigned.
      </div>
    )
  }

  const isUrgent = remaining < 300 // under 5 min

  return (
    <div className="max-w-xl rounded-md border border-accent/40 bg-accent/5 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-accent/20 pb-3">
        <div className="flex items-center gap-2">
          <span className="inline-block size-2 animate-ping rounded-full bg-accent" />
          <span className="text-xs font-semibold tracking-wide uppercase text-accent">
            Action Required: Time Limit to Respond
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span className="text-muted-foreground">Expires in:</span>
          <span
            className={cn(
              'rounded px-2 py-0.5 text-sm font-bold tabular-nums',
              isUrgent ? 'bg-accent text-accent-foreground animate-pulse' : 'bg-muted text-foreground',
            )}
          >
            {formatCountdown(remaining)}
          </span>
        </div>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        You have a <strong>{offer.respondWithinMinutes}-minute time limit</strong> to accept or reject this assignment. If you do not respond before the timer expires, the job will automatically be offered to the next available technician.
      </p>

      {!declining ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              respondOffer(notification.id, 'accepted')
              toast("Job accepted! Added to today's jobs.")
            }}
          >
            Accept Job ({formatCountdown(remaining)})
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeclining(true)}
          >
            Decline
          </Button>
        </div>
      ) : (
        <div className="mt-3 rounded border bg-background/80 p-3">
          <p className="text-xs font-medium text-foreground">Select reason for declining:</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {DECLINE_REASONS.map((reason) => (
              <button
                key={reason}
                type="button"
                onClick={() => setSelectedReason(reason)}
                className={cn(
                  'rounded-md border px-2 py-1 text-xs transition-colors',
                  selectedReason === reason
                    ? 'border-primary bg-primary text-primary-foreground font-medium'
                    : 'border-border bg-background text-muted-foreground hover:text-foreground',
                )}
              >
                {reason}
              </button>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <Button
              variant="solid"
              size="sm"
              onClick={() => {
                respondOffer(notification.id, 'declined', selectedReason)
                toast("Job declined. Reassigned to next technician.")
                setDeclining(false)
              }}
            >
              Confirm Decline
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeclining(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function JobDetailsBlock({ job }: { job: JobDetails }) {
  return (
    <section aria-label="Job details" className="max-w-xl rounded-md border">
      <h5 className="border-b px-3.5 py-2 font-mono text-[11px] text-muted-foreground">
        Job details
      </h5>
      <dl className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-4 gap-y-2.5 px-3.5 py-3 font-mono text-[12px]">
        <dt className="text-muted-foreground">Address</dt>
        <dd>{job.address}</dd>
        <dt className="text-muted-foreground">SLA due</dt>
        <dd>{job.slaDue}</dd>
        <dt className="text-muted-foreground">Skills</dt>
        <dd className="flex flex-wrap gap-1.5">
          {job.skills.map((skill) => (
            <span key={skill} className="rounded-md border px-1.5 py-0.5 text-[11px]">
              {skill}
            </span>
          ))}
        </dd>
        <dt className="text-muted-foreground">Parts</dt>
        <dd>
          {job.parts.length === 0 ? (
            'None'
          ) : (
            <ul className="flex flex-col gap-1">
              {job.parts.map((part) => (
                <li key={part}>{part}</li>
              ))}
            </ul>
          )}
        </dd>
      </dl>
    </section>
  )
}

export function RowDetail({ notification, onAction, onToggleRead }: RowDetailProps) {
  const { detail, job, events, action, read } = notification

  return (
    <div className="flex flex-col gap-5 pr-4 pb-5 pl-10 sm:pr-5 sm:pl-11">
      <p className="max-w-[62ch] text-[13px] leading-relaxed">{detail}</p>

      {/* Offer Timer & Response Block */}
      {notification.offer && <OfferTimerBlock notification={notification} />}

      {job && <JobDetailsBlock job={job} />}

      {events.length > 0 && <EventTimeline events={events} />}

      <div className="flex flex-wrap gap-2">
        {action && (
          <Button variant="solid" size="sm" onClick={onAction}>
            {action.label}
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={onToggleRead}>
          {read ? 'Mark as unread' : 'Mark as read'}
        </Button>
      </div>
    </div>
  )
}
