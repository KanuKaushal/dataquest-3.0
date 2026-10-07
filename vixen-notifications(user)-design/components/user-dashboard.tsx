'use client'

import { AttentionList } from '@/components/attention-list'
import { FadeUp } from '@/components/fade-up'
import { RequestTable } from '@/components/request-table'
import { StatRow } from '@/components/stat-row'
import { attentionItems, initialRequests, userStats } from '@/lib/mock-data'

export function UserDashboard() {
  return (
    <>
      <FadeUp>
        <StatRow
          stats={[
            { label: 'Open', value: userStats.open },
            { label: 'In progress', value: userStats.inProgress },
            { label: 'Completed', value: userStats.completed },
            { label: 'Overdue', value: userStats.overdue, urgent: true },
          ]}
        />
      </FadeUp>

      <div className="grid gap-12 xl:grid-cols-[minmax(0,1fr)_280px] xl:gap-10">
        <RequestTable requests={initialRequests} />
        <FadeUp delay={0.12}>
          <AttentionList items={attentionItems} />
        </FadeUp>
      </div>
    </>
  )
}
