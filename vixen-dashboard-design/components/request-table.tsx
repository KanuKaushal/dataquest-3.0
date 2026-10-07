'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Plus } from 'lucide-react'
import { StatusPill } from '@/components/status-pill'
import { useToast } from '@/components/toast'
import { Button } from '@/components/ui/button'
import type { Priority, ServiceRequest } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const COLUMNS = 'lg:grid-cols-[80px_148px_52px_64px_108px_minmax(0,1fr)_72px_14px]'

const PRIORITY: Record<Priority, { label: string; className: string }> = {
  urgent: { label: 'Urgent', className: 'font-medium text-accent' },
  high: { label: 'High', className: 'text-foreground' },
  medium: { label: 'Medium', className: 'text-muted-foreground' },
  low: { label: 'Low', className: 'text-muted-foreground' },
}

const HEADINGS = ['Request', 'Machine', 'Site', 'Priority', 'Status', 'Technician', 'Updated']

function RequestRow({ request, index }: { request: ServiceRequest; index: number }) {
  const toast = useToast()
  const priority = PRIORITY[request.priority]
  const technician = request.technician ?? 'Unassigned'

  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut', delay: 0.18 + index * 0.06 }}
      className="group relative transition-colors duration-150 hover:bg-hover"
    >
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-0.5 origin-center scale-y-0 bg-accent transition-transform duration-200 ease-out group-hover:scale-y-100"
      />
      <button
        type="button"
        onClick={() => toast(`${request.id} details are not built yet`)}
        className={cn(
          'grid w-full grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1.5 px-4 py-3.5 text-left text-[13px] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent',
          COLUMNS,
        )}
      >
        <span className="order-1 font-mono lg:order-none">{request.id}</span>
        <span className="order-3 col-span-2 whitespace-nowrap lg:order-none lg:col-span-1">
          <span className="font-mono">{request.machine}</span>{' '}
          <span className="text-muted-foreground">{request.equipment}</span>
        </span>
        <span className="hidden lg:block">{request.site}</span>
        <span className={cn('hidden lg:block', priority.className)}>{priority.label}</span>
        <span className="order-2 justify-self-end lg:order-none lg:justify-self-start">
          <StatusPill status={request.status} />
        </span>
        <span
          className={cn(
            'hidden truncate lg:block',
            !request.technician && 'text-muted-foreground',
          )}
        >
          {technician}
        </span>
        <span className="hidden font-mono text-xs text-muted-foreground lg:block">
          {request.updated}
        </span>
        <span className="order-4 col-span-2 text-muted-foreground lg:hidden">
          {request.site} · {priority.label} · {technician} · {request.updated}
        </span>
        <ArrowRight
          aria-hidden
          strokeWidth={1.5}
          className="hidden size-3.5 text-muted-foreground transition-transform duration-200 ease-out group-hover:translate-x-[3px] group-hover:text-foreground lg:block"
        />
      </button>
    </motion.li>
  )
}

export function RequestTable({
  requests,
  onNewRequest,
}: {
  requests: ServiceRequest[]
  onNewRequest: () => void
}) {
  return (
    <section aria-labelledby="recent-requests">
      <div className="mb-4 flex items-center justify-between">
        <h2 id="recent-requests" className="text-sm font-medium">
          Recent requests
        </h2>
        <Button variant="primary" onClick={onNewRequest}>
          <Plus className="size-3.5" strokeWidth={2} aria-hidden />
          New request
        </Button>
      </div>

      <div className="overflow-hidden rounded-md border">
        <div
          aria-hidden
          className={cn(
            'hidden gap-x-3 border-b px-4 py-2.5 text-xs text-muted-foreground lg:grid',
            COLUMNS,
          )}
        >
          {HEADINGS.map((heading) => (
            <span key={heading}>{heading}</span>
          ))}
        </div>
        <ul className="divide-y">
          {requests.map((request, index) => (
            <RequestRow key={request.id} request={request} index={index} />
          ))}
        </ul>
      </div>
    </section>
  )
}
