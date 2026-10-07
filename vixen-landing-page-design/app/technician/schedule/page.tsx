import type { Metadata } from 'next'
import { ScheduleProvider } from '@/components/schedule/schedule-provider'
import { ScheduleView } from '@/components/schedule/schedule-view'

export const metadata: Metadata = {
  title: 'Schedule — ServiceSync',
  description: 'Your week of jobs, travel gaps, conflicts and time off.',
}

export default function SchedulePage() {
  return (
    <ScheduleProvider>
      <ScheduleView />
    </ScheduleProvider>
  )
}
