import type { TimelineEvent } from '@/lib/notifications'
import { cn } from '@/lib/utils'

export function EventTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol aria-label="Recent events" className="flex flex-col">
      {events.map((event, index) => {
        const isLatest = index === events.length - 1
        return (
          <li
            key={`${event.time}-${event.label}`}
            className={cn(
              'relative flex items-baseline gap-3 pb-3 last:pb-0',
              !isLatest &&
                'before:absolute before:top-3.5 before:bottom-[-3px] before:left-[2.5px] before:w-px before:bg-border',
            )}
          >
            <span
              aria-hidden
              className={cn(
                'size-1.5 shrink-0 -translate-y-px rounded-full border',
                isLatest ? 'border-foreground bg-foreground' : 'bg-background',
              )}
            />
            <span className="w-32 shrink-0 font-mono text-[11px] text-muted-foreground">
              {event.time}
            </span>
            <span className="text-[13px]">{event.label}</span>
          </li>
        )
      })}
    </ol>
  )
}
