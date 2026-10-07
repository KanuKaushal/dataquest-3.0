import type { Metadata } from 'next'
import { NotificationsView } from '@/components/notifications/notifications-view'

export const metadata: Metadata = {
  title: 'Notifications',
  description: 'Assignments, SLA warnings, part updates and schedule changes in one place.',
}

export default function NotificationsPage() {
  return <NotificationsView />
}
