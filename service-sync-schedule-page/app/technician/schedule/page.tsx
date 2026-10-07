import type { Metadata } from 'next'
import { ScheduleView } from '@/components/schedule/schedule-view'

export const metadata: Metadata = {
  title: 'Schedule',
  description: 'Your week of jobs, travel gaps, conflicts and time off.',
}

export default function SchedulePage() {
  return <ScheduleView />
}
