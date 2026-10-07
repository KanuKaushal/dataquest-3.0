'use client'

import { EmptyState } from '@/components/notifications/empty-state'
import { NotificationFeed } from '@/components/notifications/notification-feed'
import type { RowSummary } from '@/components/notifications/notification-row'
import { useNotifications } from '@/components/notifications/notifications-provider'
import { RowDetail } from '@/components/notifications/row-detail'
import { useToast } from '@/components/toast'
import {
  EMPTY_COPY,
  matchesSite,
  matchesTab,
  type Notification,
  type SiteFilterValue,
  type TabKey,
} from '@/lib/notifications'

interface NotificationListProps {
  tab: TabKey
  site: SiteFilterValue
}

function summarize(n: Notification): RowSummary {
  return {
    kind: n.kind,
    title: n.title,
    summary: n.summary,
    tags: [n.requestId, `${n.machine}, ${n.site}`],
    age: n.age,
    actionLabel: n.action?.label,
    read: n.read,
    fresh: n.fresh,
  }
}

export function NotificationList({ tab, site }: NotificationListProps) {
  const { items, markRead, toggleRead, dismiss } = useNotifications()
  const toast = useToast()

  const handleAction = (n: Notification) => {
    if (!n.action) return
    markRead(n.id)
    toast(n.action.confirmation)
  }

  return (
    <NotificationFeed
      items={items}
      viewKey={`${tab}:${site}`}
      matches={(n) => matchesSite(n, site) && matchesTab(n, tab)}
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
      empty={<EmptyState {...EMPTY_COPY[tab]} />}
    />
  )
}
