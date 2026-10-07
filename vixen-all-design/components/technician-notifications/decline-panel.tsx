'use client'

import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useId, useState } from 'react'
import { Button } from '@/components/ui/button'
import { DECLINE_REASONS } from '@/lib/technician-notifications'

export function DeclinePanel({ onConfirm }: { onConfirm: () => void }) {
  const selectId = useId()
  const [reason, setReason] = useState('')

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="overflow-hidden"
    >
      <div className="flex flex-col gap-3 border-t px-4 py-4 sm:flex-row sm:items-end sm:px-5">
        <div className="flex flex-1 flex-col gap-1.5 sm:max-w-xs">
          <label htmlFor={selectId} className="text-[12px] text-muted-foreground">
            Reason for declining
          </label>
          <div className="relative">
            <select
              id={selectId}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="h-9 w-full appearance-none rounded-md border bg-background pr-9 pl-3 text-[13px] transition-colors duration-150 hover:bg-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <option value="" disabled>
                Select a reason
              </option>
              {DECLINE_REASONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden
              strokeWidth={1.5}
              className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
          </div>
        </div>
        <Button
          variant="solid"
          disabled={!reason}
          onClick={onConfirm}
          className="w-full sm:w-auto"
        >
          Confirm decline
        </Button>
      </div>
    </motion.div>
  )
}
