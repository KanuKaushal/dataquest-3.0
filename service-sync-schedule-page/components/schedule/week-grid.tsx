'use client'

import { motion } from 'framer-motion'
import { useMotionPrefs } from '@/lib/motion'
import { ACCENT_EDGE, jobAccent } from '@/lib/schedule/accent'
import { findOverlaps, jobsForDay, laneLayout } from '@/lib/schedule/agenda'
import { TODAY_INDEX } from '@/lib/schedule/data'
import { toMinutes } from '@/lib/schedule/time'
import type { Job, TimeOff, WeekDay } from '@/lib/schedule/types'
import { cn } from '@/lib/utils'

const GRID_START = 8 * 60
const GRID_END = 18 * 60
const HOUR_HEIGHT = 48
const HOURS = Array.from({ length: (GRID_END - GRID_START) / 60 + 1 }, (_, i) => GRID_START / 60 + i)
const GRID_HEIGHT = ((GRID_END - GRID_START) / 60) * HOUR_HEIGHT

const toY = (minutes: number) => ((minutes - GRID_START) / 60) * HOUR_HEIGHT

interface WeekGridProps {
  days: WeekDay[]
  weekOffset: number
  jobs: Job[]
  timeOff: TimeOff[]
  nowMinutes: number
  onOpenDay: (day: number) => void
}

export function WeekGrid({ days, weekOffset, jobs, timeOff, nowMinutes, onOpenDay }: WeekGridProps) {
  const { reduced, transition } = useMotionPrefs()

  return (
    <motion.div
      key={weekOffset}
      initial={reduced ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition(0.24)}
      className="overflow-x-auto"
    >
      <div className="grid min-w-[640px] grid-cols-[40px_repeat(7,minmax(0,1fr))]">
        <div aria-hidden />
        {days.map((day) => (
          <div key={day.index} className="px-2 pb-3 text-[12px] text-muted-foreground">
            {day.short} <span className="font-mono text-foreground">{day.date}</span>
          </div>
        ))}

        <div className="relative" style={{ height: GRID_HEIGHT }} aria-hidden>
          {HOURS.slice(0, -1).map((hour) => (
            <span
              key={hour}
              className="absolute font-mono text-[10px] text-muted-foreground"
              style={{ top: (hour - GRID_START / 60) * HOUR_HEIGHT - 6 }}
            >
              {String(hour).padStart(2, '0')}
            </span>
          ))}
        </div>

        {days.map((day) => {
          const dayJobs = jobsForDay(jobs, day.index)
          const conflicted = findOverlaps(dayJobs)
          const lanes = laneLayout(dayJobs)
          const off = timeOff.some((entry) => entry.day === day.index)
          const showNow = weekOffset === 0 && day.index === TODAY_INDEX

          return (
            <div
              key={day.index}
              className={cn('relative border-l', off && 'bg-muted/50')}
              style={{ height: GRID_HEIGHT }}
            >
              {HOURS.slice(1, -1).map((hour) => (
                <span
                  key={hour}
                  aria-hidden
                  className="absolute inset-x-0 border-t border-dashed border-border/70"
                  style={{ top: (hour - GRID_START / 60) * HOUR_HEIGHT }}
                />
              ))}

              {off && (
                <span className="absolute inset-x-2 top-3 font-mono text-[10px] text-muted-foreground">off duty</span>
              )}

              {dayJobs.map((job) => {
                const { lane, count } = lanes.get(job.id) ?? { lane: 0, count: 1 }
                const accent = jobAccent(job, conflicted.has(job.id))
                const top = toY(toMinutes(job.start))
                const height = toY(toMinutes(job.end)) - top

                return (
                  <button
                    key={job.id}
                    type="button"
                    onClick={() => onOpenDay(day.index)}
                    aria-label={`${job.machine} ${job.machineType}, Site ${job.site}, ${job.start} to ${job.end}. Open ${day.long}`}
                    className={cn(
                      'absolute overflow-hidden border-l-2 bg-card px-1.5 py-1 text-left shadow-[inset_0_0_0_1px_var(--border)] transition-colors duration-150 hover:bg-muted',
                      ACCENT_EDGE[accent],
                      job.status === 'done' && 'opacity-60',
                    )}
                    style={{
                      top,
                      height: height - 2,
                      left: `calc(${(lane / count) * 100}% + 2px)`,
                      width: `calc(${100 / count}% - 4px)`,
                    }}
                  >
                    <span className="block truncate font-mono text-[10px] leading-4">{job.machine}</span>
                    <span className="block truncate text-[10px] leading-4 text-muted-foreground">
                      {job.machineType} · {job.site}
                    </span>
                  </button>
                )
              })}

              {showNow && nowMinutes >= GRID_START && nowMinutes <= GRID_END && (
                <span
                  aria-hidden
                  className="absolute inset-x-0 h-px bg-primary"
                  style={{ top: toY(nowMinutes) }}
                />
              )}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
