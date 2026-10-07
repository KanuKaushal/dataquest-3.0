'use client'

import { EventTimeline } from '@/components/notifications/event-timeline'
import { Button } from '@/components/ui/button'
import type { Notification } from '@/lib/notifications'

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

      <EventTimeline events={events} />

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
