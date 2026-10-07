import type { Metadata } from 'next'
import { TechnicianNotificationsPage } from '@/components/technician-notifications/technician-notifications-page'

export const metadata: Metadata = {
  title: 'Notifications',
}

export default function Page() {
  return <TechnicianNotificationsPage />
}
