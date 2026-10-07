'use client'

import { motion } from 'framer-motion'
import { useToast } from '@/components/technician-shell/toast'
import { useMotionPrefs } from '@/lib/motion'
import { buildAgenda, jobsForDay } from '@/lib/schedule/agenda'
import { TODAY_INDEX } from '@/lib/schedule/data'
import type { Job, TimeOff, WeekDay } from '@/lib/schedule/types'
import { AgendaRow } from './agenda-row'
import { GapRow } from './gap-row'
import { NowLine } from './now-line'

interface DayAgendaProps {
  day: WeekDay
  weekOffset: number
  jobs: Job[]
  timeOff: TimeOff | null
  filtering: boolean
  nowMinutes: number
  expandedId: string | null
  onExpandedChange: (id: string | null) => void
  onReassign: (job: Job) => void
}

export function DayAgenda({
  day,
  weekOffset,
  jobs,
  timeOff,
  filtering,
  nowMinutes,
  expandedId,
  onExpandedChange,
  onReassign,
}: DayAgendaProps) {
  const { reduced, transition } = useMotionPrefs()
  const toast = useToast()

  const dayJobs = jobsForDay(jobs, day.index)
  const isToday = weekOffset === 0 && day.index === TODAY_INDEX
  const entries = buildAgenda(dayJobs, isToday && !filtering ? nowMinutes : null)

  if (timeOff) {
    return (
      <Empty title="Off duty all day." detail="Nothing is booked. Enjoy the day." />
    )
  }

  if (dayJobs.length === 0) {
    return filtering ? (
      <Empty title="No jobs match that search." detail="Try a machine ID, a type or a site." />
    ) : (
      <Empty title="Nothing booked." detail="This day is open for new jobs." />
    )
  }

  return (
    <motion.ul
      key={`${weekOffset}-${day.index}`}
      aria-labelledby={`day-tab-${day.index}`}
      initial={reduced ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition(0.24)}
      className="divide-y [--time-col:52px]"
    >
      {entries.map((entry) => {
        switch (entry.kind) {
          case 'job':
            return (
              <AgendaRow
                key={entry.job.id}
                job={entry.job}
                overlap={entry.overlap}
                nowMinutes={nowMinutes}
                expanded={expandedId === entry.job.id}
                onToggle={() => onExpandedChange(expandedId === entry.job.id ? null : entry.job.id)}
                onReassign={() => onReassign(entry.job)}
              />
            )
          case 'now':
            return <NowLine key="now" minutes={entry.minutes} />
          default:
            return (
              <GapRow
                key={`${entry.kind}-${entry.at}`}
                entry={entry}
                onAddJob={() => toast('Adding jobs is not part of this mock')}
              />
            )
        }
      })}
    </motion.ul>
  )
}

function Empty({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="border-t py-14">
      <p className="font-serif text-[22px]">{title}</p>
      <p className="mt-1 text-[14px] text-muted-foreground">{detail}</p>
    </div>
  )
}
