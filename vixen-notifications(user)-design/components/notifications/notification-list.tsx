'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { DayHeading } from '@/components/notifications/day-heading'
import { EmptyState } from '@/components/notifications/empty-state'
import { NotificationRow } from '@/components/notifications/notification-row'
import { useNotifications } from '@/components/notifications/notifications-provider'
import { useToast } from '@/components/toast'
import {
  groupByDay,
  matchesSite,
  matchesTab,
  type SiteFilterValue,
  type TabKey,
} from '@/lib/notifications'

interface NotificationListProps {
  tab: TabKey
  site: SiteFilterValue
}

export function NotificationList({ tab, site }: NotificationListProps) {
  const { items, markRead, toggleRead, dismiss } = useNotifications()
  const toast = useToast()
  const viewKey = `${tab}:${site}`

  const [previousViewKey, setPreviousViewKey] = useState(viewKey)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  // Rows opened in this view stay put even if opening them removes them from the active filter (Unread).
  const [retained, setRetained] = useState<Set<string>>(new Set())

  if (viewKey !== previousViewKey) {
    setPreviousViewKey(viewKey)
    setExpandedId(null)
    setRetained(new Set())
  }

  const visible = items.filter(
    (n) => matchesSite(n, site) && (matchesTab(n, tab) || retained.has(n.id)),
  )
  const groups = groupByDay(visible)

  const handleToggle = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null)
      return
    }
    setExpandedId(id)
    setRetained((current) => new Set(current).add(id))
    markRead(id)
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
          <EmptyState tab={tab} />
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
                    {group.items.map((notification) => (
                      <NotificationRow
                        key={notification.id}
                        notification={notification}
                        index={rowIndex++}
                        expanded={expandedId === notification.id}
                        onToggle={() => handleToggle(notification.id)}
                        onAction={() => {
                          if (!notification.action) return
                          markRead(notification.id)
                          toast(notification.action.confirmation)
                        }}
                        onToggleRead={() => toggleRead(notification.id)}
                        onDismiss={() => {
                          dismiss(notification.id)
                          toast('Notification dismissed')
                        }}
                      />
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
