'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useToast } from '@/components/toast'
import type { Machine } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

function WarrantyPill({ underWarranty }: { underWarranty: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap',
        underWarranty ? 'border-done text-done' : 'border-muted-foreground/40 text-muted-foreground',
      )}
    >
      <span
        aria-hidden
        className={cn('size-1.5 rounded-full', underWarranty ? 'bg-done' : 'bg-muted-foreground/60')}
      />
      {underWarranty ? 'Under warranty' : 'Out of warranty'}
    </span>
  )
}

export function MachineDetails({ machine }: { machine: Machine | undefined }) {
  const toast = useToast()

  return (
    <AnimatePresence initial={false}>
      {machine && (
        <motion.div
          key="details"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="overflow-hidden"
        >
          <dl className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-4 text-[13px]">
            <div className="flex items-baseline gap-2">
              <dt className="text-muted-foreground">Site</dt>
              <dd>{machine.site}</dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="text-muted-foreground">Last serviced</dt>
              <dd className="font-mono">{machine.lastServiced}</dd>
            </div>
            <div>
              <dt className="sr-only">Warranty</dt>
              <dd>
                <WarrantyPill underWarranty={machine.underWarranty} />
              </dd>
            </div>
          </dl>
          {machine.openRequestId && (
            <p role="alert" className="pt-4 text-[13px] text-accent">
              This machine already has an open request, {machine.openRequestId}.{' '}
              <button
                type="button"
                onClick={() => toast(`${machine.openRequestId} details are not built yet`)}
                className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                View
              </button>
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
