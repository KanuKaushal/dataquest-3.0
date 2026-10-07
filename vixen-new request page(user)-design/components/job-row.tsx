'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { useId, useState } from 'react'
import { StatusPill } from '@/components/status-pill'
import { Button } from '@/components/ui/button'
import type { Job, Priority } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const PRIORITY_LABEL: Record<Priority, string> = {
  urgent: 'Urgent',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

function formatDue(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return hours > 0 ? `due in ${hours}h ${rest}m` : `due in ${rest}m`
}

function DrawnCheck() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" fill="none" aria-hidden>
      <motion.path
        d="M3 8.5 6.5 12 13 4.5"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      />
    </svg>
  )
}

interface JobRowProps {
  job: Job
  index: number
  completing: boolean
  onStart: () => void
  onComplete: () => void
}

export function JobRow({ job, index, completing, onStart, onComplete }: JobRowProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const isDone = job.status === 'done'
  const isFinished = isDone || completing
  const urgentSla = !isFinished && job.minutesLeft < 60

  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: isDone ? 0.5 : 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut', delay: isDone ? 0 : index * 0.06 }}
      className="border-b"
    >
      <div
        onClick={() => setOpen((value) => !value)}
        className="group relative flex cursor-pointer flex-col gap-4 px-4 py-5 transition-colors duration-150 hover:bg-hover xl:flex-row xl:items-center xl:gap-6"
      >
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-0.5 origin-center scale-y-0 bg-accent transition-transform duration-200 ease-out group-hover:scale-y-100"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <p className="text-sm font-semibold">
              {job.machine} {job.equipment}, {job.site}
            </p>
            <span className="font-mono text-xs text-muted-foreground">{job.requestId}</span>
            <StatusPill status={isFinished ? 'done' : job.status} />
          </div>
          <p className="mt-1.5 text-[13px] text-muted-foreground">{job.fault}</p>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 xl:flex-nowrap">
          <span
            className={cn(
              'rounded-md border px-2 py-0.5 text-xs',
              job.priority === 'urgent' && !isFinished
                ? 'border-accent text-accent'
                : 'text-muted-foreground',
            )}
          >
            {PRIORITY_LABEL[job.priority]}
          </span>

          <span
            className={cn(
              'font-mono text-[13px] whitespace-nowrap xl:w-32 xl:text-right',
              urgentSla ? 'text-accent' : 'text-muted-foreground',
            )}
          >
            {isFinished ? `done ${job.completedAt ?? 'just now'}` : formatDue(job.minutesLeft)}
          </span>

          <div className="ml-auto flex items-center gap-2 xl:ml-0">
            {!isDone && (
              <>
                <Button
                  size="sm"
                  disabled={job.status !== 'pending' || completing}
                  onClick={(event) => {
                    event.stopPropagation()
                    onStart()
                  }}
                >
                  Start
                </Button>
                <Button
                  variant="solid"
                  size="sm"
                  disabled={completing}
                  onClick={(event) => {
                    event.stopPropagation()
                    onComplete()
                  }}
                >
                  {completing && <DrawnCheck />}
                  Mark complete
                </Button>
              </>
            )}
          </div>

          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={`${open ? 'Hide' : 'Show'} task log for ${job.machine}`}
            className="hidden text-muted-foreground transition-transform duration-200 ease-out group-hover:translate-x-[3px] group-hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:block"
          >
            <motion.span animate={{ rotate: open ? 90 : 0 }} className="block">
              <ChevronRight className="size-4" strokeWidth={1.5} aria-hidden />
            </motion.span>
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pt-1 pb-5">
              <div className="rounded-md border border-dashed px-4 py-8 text-center text-[13px] text-muted-foreground">
                Task log goes here
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  )
}
