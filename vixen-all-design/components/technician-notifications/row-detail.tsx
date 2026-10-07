'use client'

import { EventTimeline } from '@/components/notifications/event-timeline'
import { Button } from '@/components/ui/button'
import type { JobDetails, TechnicianNotification } from '@/lib/technician-notifications'

interface RowDetailProps {
  notification: TechnicianNotification
  onAction: () => void
  onToggleRead: () => void
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
