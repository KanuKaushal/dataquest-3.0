'use client'

import { useEffect, useState } from 'react'
import { FadeUp } from '@/components/fade-up'
import { NotificationTabs } from '@/components/notifications/notification-tabs'
import { NotificationsHeader } from '@/components/notifications/notifications-header'
import { ActionStrip } from '@/components/technician-notifications/action-strip'
import { TechnicianNotificationList } from '@/components/technician-notifications/technician-notification-list'
import {
  TechnicianNotificationsProvider,
  useTechnicianNotifications,
} from '@/components/technician-notifications/technician-notifications-provider'
import { useToast } from '@/components/toast'
import {
  LIVE_ALERT_DELAY_MS,
  LIVE_NOTIFICATION,
  TABS,
  tabCounts,
  type TechnicianTabKey,
} from '@/lib/technician-notifications'

function NotificationsContent() {
  const { items, unreadCount, markAllRead, receive } = useTechnicianNotifications()
  const toast = useToast()
  const [tab, setTab] = useState<TechnicianTabKey>('all')

  useEffect(() => {
    const timer = setTimeout(() => receive(LIVE_NOTIFICATION), LIVE_ALERT_DELAY_MS)
    return () => clearTimeout(timer)
  }, [receive])

  return (
    <div className="flex flex-col">
      <FadeUp className="pb-8">
        <NotificationsHeader
          unread={unreadCount}
          total={items.length}
          onMarkAllRead={() => markAllRead(() => toast('All caught up'))}
          onOpenSettings={() => toast("Notification settings aren't available yet")}
        />
      </FadeUp>

      <ActionStrip />

      <FadeUp delay={0.12} className="pb-8">
        <div className="flex items-center gap-4 border-b">
          <NotificationTabs tabs={TABS} value={tab} counts={tabCounts(items)} onChange={setTab} />
        </div>
      </FadeUp>

      <TechnicianNotificationList tab={tab} />
    </div>
  )
}

export function TechnicianNotificationsPage() {
  return (
    <TechnicianNotificationsProvider>
      <NotificationsContent />
    </TechnicianNotificationsProvider>
  )
}
