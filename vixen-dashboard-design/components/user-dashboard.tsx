'use client'

import { useState } from 'react'
import { AttentionList } from '@/components/attention-list'
import { FadeUp } from '@/components/fade-up'
import { RequestTable } from '@/components/request-table'
import { StatRow } from '@/components/stat-row'
import { useToast } from '@/components/toast'
import {
  attentionItems,
  initialRequests,
  newRequestTemplates,
  userStats,
  type ServiceRequest,
} from '@/lib/mock-data'

export function UserDashboard() {
  const toast = useToast()
  const [requests, setRequests] = useState<ServiceRequest[]>(initialRequests)
  const created = requests.length - initialRequests.length

  function createRequest() {
    const template = newRequestTemplates[created % newRequestTemplates.length]
    const request: ServiceRequest = {
      ...template,
      id: `REQ-${2048 + created}`,
      status: 'pending',
      technician: null,
      updated: 'Just now',
    }
    setRequests((current) => [request, ...current])
    toast('Request created')
  }

  return (
    <>
      <FadeUp>
        <StatRow
          stats={[
            { label: 'Open', value: userStats.open + created },
            { label: 'In progress', value: userStats.inProgress },
            { label: 'Completed', value: userStats.completed },
            { label: 'Overdue', value: userStats.overdue, urgent: true },
          ]}
        />
      </FadeUp>

      <div className="grid gap-12 xl:grid-cols-[minmax(0,1fr)_280px] xl:gap-10">
        <RequestTable requests={requests} onNewRequest={createRequest} />
        <FadeUp delay={0.12}>
          <AttentionList items={attentionItems} />
        </FadeUp>
      </div>
    </>
  )
}
