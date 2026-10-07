'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { DayHeading } from '@/components/notifications/day-heading'
import { NotificationRow, type RowSummary } from '@/components/notifications/notification-row'
import { groupByDay, type DayKey } from '@/lib/notifications'

interface FeedItem {
  id: string
  day: DayKey
}

interface NotificationFeedProps<T extends FeedItem> {
  items: T[]
  viewKey: string
  matches: (item: T) => boolean
  summarize: (item: T) => RowSummary
  renderDetail: (item: T) => React.ReactNode
  onOpen: (item: T) => void
  onAction: (item: T) => void
  onDismiss: (item: T) => void
  empty: React.ReactNode
}

export function NotificationFeed<T extends FeedItem>({
  items,
  viewKey,
  matches,
  summarize,
  renderDetail,
  onOpen,
  onAction,
  onDismiss,
  empty,
}: NotificationFeedProps<T>) {
  const [previousViewKey, setPreviousViewKey] = useState(viewKey)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  // Rows opened in this view stay put even if opening them removes them from the active filter (Unread).
  const [retained, setRetained] = useState<Set<string>>(new Set())

  if (viewKey !== previousViewKey) {
    setPreviousViewKey(viewKey)
    setExpandedId(null)
    setRetained(new Set())
  }

  const visible = items.filter((item) => matches(item) || retained.has(item.id))
  const groups = groupByDay(visible)

  const handleToggle = (item: T) => {
    if (expandedId === item.id) {
      setExpandedId(null)
      return
    }
    setExpandedId(item.id)
    setRetained((current) => new Set(current).add(item.id))
    onOpen(item)
  }

  let rowIndex = 0

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={viewKey}
        exit={{ opacity: 0, transition: { duration: 0.12, ease: 'easeOut' } }}
        className="overflow-hidden rounded-md border"
      >
        {visible.length === 0 ? (
          empty
        ) : (
          <AnimatePresence>
            {groups.map((group) => (
              <motion.section
                key={group.key}
                aria-label={group.label}
                exit={{
                  height: 0,
                  opacity: 0,
                  transition: { duration: 0.25, delay: 0.1, ease: 'easeOut' },
                }}
                className="overflow-hidden border-b last:border-b-0"
              >
                <DayHeading label={group.label} />
                <ul className="divide-y">
                  <AnimatePresence>
                    {group.items.map((item) => (
                      <NotificationRow
                        key={item.id}
                        row={summarize(item)}
                        index={rowIndex++}
                        expanded={expandedId === item.id}
                        onToggle={() => handleToggle(item)}
                        onAction={() => onAction(item)}
                        onDismiss={() => onDismiss(item)}
                      >
                        {renderDetail(item)}
                      </NotificationRow>
                    ))}
                  </AnimatePresence>
                </ul>
              </motion.section>
            ))}
          </AnimatePresence>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
