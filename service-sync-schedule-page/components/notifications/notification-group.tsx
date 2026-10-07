'use client'

import { AnimatePresence } from 'framer-motion'
import type { AppNotification, NotificationAction } from '@/lib/notifications/types'
import { NotificationRow, type RowEntrance } from './notification-row'

interface NotificationGroupProps {
  label: string
  items: AppNotification[]
  now: number
  expandedId: string | null
  entranceFor: (id: string) => RowEntrance
  onToggle: (id: string) => void
  onAction: (item: AppNotification, action: NotificationAction) => void
}

export function NotificationGroup({
  label,
  items,
  now,
  expandedId,
  entranceFor,
  onToggle,
  onAction,
}: NotificationGroupProps) {
  return (
    <section aria-label={label}>
      <h2 className="flex items-center gap-4 px-4 pt-6 pb-2 font-mono text-[11px] text-muted-foreground">
        {label}
        <span aria-hidden className="h-px flex-1 bg-border" />
      </h2>
      <ul className="divide-y">
        <AnimatePresence>
          {items.map((item) => (
            <NotificationRow
              key={item.id}
              item={item}
              now={now}
              expanded={expandedId === item.id}
              entrance={entranceFor(item.id)}
              onToggle={() => onToggle(item.id)}
              onAction={onAction}
            />
          ))}
        </AnimatePresence>
      </ul>
    </section>
  )
}
