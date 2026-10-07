'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { StatusPill, type PillStatus } from '@/components/technician-shell/status-pill'
import { TextLink } from '@/components/technician-shell/text-link'
import { useToast } from '@/components/technician-shell/toast'
import { useMotionPrefs } from '@/lib/motion'
import { ACCENT_EDGE, jobAccent } from '@/lib/schedule/accent'
import { describeSla } from '@/lib/schedule/time'
import type { Job, Overlap } from '@/lib/schedule/types'
import { cn } from '@/lib/utils'

interface AgendaRowProps {
  job: Job
  overlap: Overlap | null
  nowMinutes: number
  expanded: boolean
  onToggle: () => void
  onReassign: () => void
}

export function AgendaRow({ job, overlap, nowMinutes, expanded, onToggle, onReassign }: AgendaRowProps) {
  const { reduced, transition } = useMotionPrefs()
  const toast = useToast()

  const accent = jobAccent(job, overlap !== null)
  const pill: PillStatus = job.status === 'done' ? 'done' : accent === 'urgent' ? 'urgent' : job.status
  const sla = job.sla && job.status !== 'done' ? describeSla(job.sla, nowMinutes) : null
  const detailsId = `job-details-${job.id}`

  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={detailsId}
        className={cn(
          'grid w-full grid-cols-[var(--time-col)_minmax(0,1fr)] items-start gap-x-3 border-l-2 px-3 py-3.5 text-left transition-colors duration-150 hover:bg-muted/60',
          ACCENT_EDGE[accent],
          job.status === 'done' && 'opacity-60',
        )}
      >
        <span className="pt-0.5 font-mono text-[12px] leading-5 text-muted-foreground">
          {job.start}
          <br />
          {job.end}
        </span>
        <span className="flex min-w-0 flex-col gap-1.5">
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-[14px] font-medium">
              <span className="font-mono">{job.machine}</span> · {job.machineType} · Site {job.site}
            </span>
            <StatusPill status={pill} />
          </span>
          <span className="flex flex-wrap items-center gap-x-3 gap-y-0.5 font-mono text-[12px] text-muted-foreground">
            <span>{job.requestId}</span>
            {sla && (
              <span className={cn(sla.urgent && 'text-primary')}>
                {sla.urgent ? '! ' : ''}
                {sla.label}
              </span>
            )}
            {overlap && (
              <span className="text-primary">
                overlaps {overlap.withRequestId} by {overlap.minutes} min
              </span>
            )}
          </span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id={detailsId}
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={transition(0.22)}
            className="overflow-hidden"
          >
            <div className="grid gap-x-8 gap-y-5 border-l-2 border-l-transparent py-5 pr-3 pl-3 md:grid-cols-[var(--time-col)_minmax(0,1fr)] md:gap-x-3 md:pl-3">
              <div className="hidden md:block" aria-hidden />
              <div className="flex flex-col gap-5">
                <p className="text-[14px] leading-6">
                  <span className="font-serif text-[16px]">Fault.</span> {capitalize(job.fault)}.
                </p>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <h3 className="text-[12px] text-muted-foreground">Parts</h3>
                    <ul className="mt-1.5 flex flex-col gap-1">
                      {job.parts.map((part) => (
                        <li key={part.code} className="flex items-center justify-between gap-4 font-mono text-[12px]">
                          <span>
                            {part.code} × {part.qty}
                          </span>
                          <span className={part.confirmed ? 'text-done' : 'text-primary'}>
                            {part.confirmed ? 'confirmed' : 'not confirmed'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-[12px] text-muted-foreground">Site contact</h3>
                    <p className="mt-1.5 text-[14px]">{job.contact.name}</p>
                    <p className="font-mono text-[12px] text-muted-foreground">{job.contact.phone}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <TextLink onClick={() => toast(`Job details for ${job.requestId} are not part of this mock`)}>
                    View job
                  </TextLink>
                  <TextLink onClick={() => toast(`Call ${job.contact.name} at ${job.contact.phone}`)}>
                    Call site
                  </TextLink>
                  {job.status !== 'done' && (
                    <TextLink onClick={onReassign}>Reassign</TextLink>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
