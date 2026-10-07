'use client'

import { EmptyState } from '@/components/notifications/empty-state'
import { NotificationFeed } from '@/components/notifications/notification-feed'
import type { RowSummary } from '@/components/notifications/notification-row'
import { RowDetail } from '@/components/technician-notifications/row-detail'
import { useTechnicianNotifications } from '@/components/technician-notifications/technician-notifications-provider'
import { useToast } from '@/components/toast'
import {
  dotKind,
  matchesTab,
  type TechnicianNotification,
  type TechnicianTabKey,
} from '@/lib/technician-notifications'

function summarize(n: TechnicianNotification): RowSummary {
  const offerTag = n.offer
    ? n.offer.status === 'pending'
      ? `⏱️ ${n.offer.respondWithinMinutes}m limit`
      : n.offer.status === 'accepted'
        ? '✓ Accepted'
        : n.offer.status === 'declined'
          ? '✗ Declined'
          : '⏱ Expired'
    : null

  return {
    kind: dotKind(n.kind),
    title: n.title,
    summary: n.summary,
    tags: [
      ...(n.requestId ? [n.requestId] : []),
      n.machine ? `${n.machine}, ${n.site}` : n.site,
      ...(offerTag ? [offerTag] : []),
    ],
    age: n.age,
    actionLabel: n.offer?.status === 'pending' ? 'Review & Respond' : n.action?.label,
    read: n.read,
    fresh: n.fresh,
  }
}

export function TechnicianNotificationList({ tab }: { tab: TechnicianTabKey }) {
  const { items, markRead, toggleRead, dismiss } = useTechnicianNotifications()
  const toast = useToast()

  const handleAction = (n: TechnicianNotification) => {
    if (!n.action) return
    markRead(n.id)
    toast(n.action.confirmation)
  }

  return (
    <NotificationFeed
      items={items}
      viewKey={tab}
      matches={(n) => matchesTab(n, tab)}
      summarize={summarize}
      renderDetail={(n) => (
        <RowDetail
          notification={n}
          onAction={() => handleAction(n)}
          onToggleRead={() => toggleRead(n.id)}
        />
      )}
      onOpen={(n) => markRead(n.id)}
      onAction={handleAction}
      onDismiss={(n) => {
        dismiss(n.id)
        toast('Notification dismissed')
      }}
      empty={
        <EmptyState title="Nothing new" message="New jobs and alerts will show up here." />
      }
    />
  )
}
