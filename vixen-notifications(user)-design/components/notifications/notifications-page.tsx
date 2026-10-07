'use client'

import { useEffect, useState } from 'react'
import { FadeUp } from '@/components/fade-up'
import { NotificationList } from '@/components/notifications/notification-list'
import { NotificationTabs } from '@/components/notifications/notification-tabs'
import { NotificationsHeader } from '@/components/notifications/notifications-header'
import {
  NotificationsProvider,
  useNotifications,
} from '@/components/notifications/notifications-provider'
import { SiteFilter } from '@/components/notifications/site-filter'
import { useToast } from '@/components/toast'
import {
  LIVE_ALERT_DELAY_MS,
  LIVE_NOTIFICATION,
  tabCounts,
  type SiteFilterValue,
  type TabKey,
} from '@/lib/notifications'

function NotificationsContent() {
  const { items, unreadCount, markAllRead, receive } = useNotifications()
  const toast = useToast()
  const [tab, setTab] = useState<TabKey>('all')
  const [site, setSite] = useState<SiteFilterValue>('all')

  useEffect(() => {
    const timer = setTimeout(() => receive(LIVE_NOTIFICATION), LIVE_ALERT_DELAY_MS)
    return () => clearTimeout(timer)
  }, [receive])

  return (
    <div className="flex flex-col gap-8">
      <FadeUp>
        <NotificationsHeader
          unread={unreadCount}
          total={items.length}
          onMarkAllRead={() => markAllRead(() => toast('All caught up'))}
          onOpenSettings={() => toast("Notification settings aren't available yet")}
        />
      </FadeUp>

      <FadeUp delay={0.06}>
        <div className="flex items-center gap-4 border-b">
          <NotificationTabs value={tab} counts={tabCounts(items, site)} onChange={setTab} />
          <SiteFilter value={site} onChange={setSite} />
        </div>
      </FadeUp>

      <NotificationList tab={tab} site={site} />
    </div>
  )
}

export function NotificationsPage() {
  return (
    <NotificationsProvider>
      <NotificationsContent />
    </NotificationsProvider>
  )
}
