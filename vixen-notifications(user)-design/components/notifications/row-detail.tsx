'use client'

import { Button } from '@/components/ui/button'
import type { Notification } from '@/lib/notifications'
import { cn } from '@/lib/utils'

interface RowDetailProps {
  notification: Notification
  onAction: () => void
  onToggleRead: () => void
}

export function RowDetail({ notification, onAction, onToggleRead }: RowDetailProps) {
  const { detail, events, action, read } = notification

  return (
    <div className="flex flex-col gap-5 pr-4 pb-5 pl-10 sm:pr-5 sm:pl-11">
      <p className="max-w-[62ch] text-[13px] leading-relaxed">{detail}</p>

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
