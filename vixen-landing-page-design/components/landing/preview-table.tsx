import { previewRequests, type PreviewRequest } from '@/lib/landing-content'
import { StatusPill } from './status-pill'

function PriorityCell({ priority, pulse }: { priority: PreviewRequest['priority']; pulse: boolean }) {
  if (priority === 'urgent') {
    return <StatusPill status="urgent" pulse={pulse} />
  }
  return <span className="text-xs text-muted-foreground md:px-2">{priority}</span>
}

export function PreviewTable() {
  return (
    <figure
      className="overflow-hidden rounded-md border border-border"
      aria-label="Preview of the recent requests table, with sample data"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <p className="text-sm font-medium">Recent requests</p>
        <p className="font-mono text-xs text-muted-foreground">sample data</p>
      </div>
      <ul>
        {previewRequests.map((request, index) => (
          <li
            key={request.id}
            className="row grid grid-cols-[1fr_auto] gap-y-2 border-b border-border px-4 py-3.5 last:border-b-0 md:grid-cols-[76px_1fr_76px_104px_48px] md:items-center md:gap-x-3 md:gap-y-0"
          >
            <span className="font-mono text-xs md:order-1">{request.id}</span>
            <span className="order-3 col-span-2 text-sm md:order-2 md:col-span-1">
              <span className="block">
                {request.machine} <span className="font-mono text-xs">{request.machineId}</span>
              </span>
              <span className="block text-xs text-muted-foreground">{request.site}</span>
            </span>
            <span className="order-4 col-span-2 flex flex-wrap items-center gap-2 md:contents">
              <span className="md:order-3">
                <PriorityCell priority={request.priority} pulse={index === 0} />
              </span>
              <span className="md:order-4">
                <StatusPill status={request.status} />
              </span>
            </span>
            <span className="order-2 text-right font-mono text-xs text-muted-foreground md:order-5">
              {request.age}
            </span>
          </li>
        ))}
      </ul>
    </figure>
  )
}
