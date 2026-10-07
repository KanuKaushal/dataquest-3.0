'use client'

import { motion } from 'framer-motion'
import { useMotionPrefs } from '@/lib/motion'
import { FILTERS } from '@/lib/notifications/helpers'
import type { NotificationFilter } from '@/lib/notifications/types'
import { cn } from '@/lib/utils'

interface NotificationToolbarProps {
  filter: NotificationFilter
  counts: Record<NotificationFilter, number>
  unreadCount: number
  onFilterChange: (filter: NotificationFilter) => void
  onMarkAllRead: () => void
}

export function NotificationToolbar({
  filter,
  counts,
  unreadCount,
  onFilterChange,
  onMarkAllRead,
}: NotificationToolbarProps) {
  const { transition } = useMotionPrefs()

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div
        role="group"
        aria-label="Filter notifications"
        className="-mx-5 flex gap-6 overflow-x-auto px-5 md:mx-0 md:px-0"
      >
        {FILTERS.map(({ id, label }) => {
          const active = id === filter
          return (
            <button
              key={id}
              type="button"
              aria-pressed={active}
              onClick={() => onFilterChange(id)}
              className={cn(
                'relative flex shrink-0 items-baseline gap-1.5 pb-2 text-[13px] whitespace-nowrap transition-colors duration-150',
                active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {label}
              <span className="font-mono text-[11px] text-muted-foreground">{counts[id]}</span>
              {active && (
                <motion.span
                  layoutId="notification-filter"
                  transition={transition(0.25)}
                  className="absolute inset-x-0 bottom-0 h-px bg-foreground"
                />
              )}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={onMarkAllRead}
        disabled={unreadCount === 0}
        className="self-start pb-2 text-[13px] text-foreground underline decoration-border underline-offset-4 transition-[color,text-decoration-color] duration-150 hover:decoration-foreground disabled:pointer-events-none disabled:text-muted-foreground disabled:no-underline md:self-auto"
      >
        Mark all as read
      </button>
    </div>
  )
}
