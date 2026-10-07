'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useMotionPrefs } from '@/lib/motion'
import { ACCENT_DOT, jobAccent } from '@/lib/schedule/accent'
import { findOverlaps, jobsForDay } from '@/lib/schedule/agenda'
import { TODAY_INDEX } from '@/lib/schedule/data'
import type { Job, TimeOff, WeekDay } from '@/lib/schedule/types'
import { cn } from '@/lib/utils'

interface WeekStripProps {
  days: WeekDay[]
  weekOffset: number
  selectedDay: number
  jobs: Job[]
  timeOff: TimeOff[]
  onSelect: (day: number) => void
}

export function WeekStrip({ days, weekOffset, selectedDay, jobs, timeOff, onSelect }: WeekStripProps) {
  const { transition } = useMotionPrefs()
  const tabs = useRef<(HTMLButtonElement | null)[]>([])

  function handleKeyDown(event: React.KeyboardEvent) {
    const lastDay = days.length - 1
    const next = {
      ArrowRight: Math.min(selectedDay + 1, lastDay),
      ArrowLeft: Math.max(selectedDay - 1, 0),
      Home: 0,
      End: lastDay,
    }[event.key]

    if (next === undefined) return
    event.preventDefault()
    onSelect(next)
    tabs.current[next]?.focus()
  }

  return (
    <div
      role="tablist"
      aria-label="Days of the week"
      onKeyDown={handleKeyDown}
      className="flex overflow-x-auto border-b md:grid md:grid-cols-7 md:overflow-visible"
    >
      {days.map((day) => {
        const selected = day.index === selectedDay
        const isToday = weekOffset === 0 && day.index === TODAY_INDEX
        const dayJobs = jobsForDay(jobs, day.index)
        const conflicted = findOverlaps(dayJobs)
        const off = timeOff.some((entry) => entry.day === day.index)

        return (
          <button
            key={day.index}
            ref={(node) => {
              tabs.current[day.index] = node
            }}
            type="button"
            role="tab"
            id={`day-tab-${day.index}`}
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onSelect(day.index)}
            className="relative flex min-w-[76px] flex-1 flex-col items-start gap-1 border-l px-4 pt-1 pb-5 text-left first:border-l-0 first:pl-0 md:min-w-0"
          >
            <span
              className={cn(
                'text-[12px] transition-colors duration-150',
                selected ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {day.short}
              {isToday && <span className="sr-only"> (today)</span>}
            </span>
            <span className="font-mono text-[22px] leading-none">{day.date}</span>
            <span className="mt-1.5 flex h-1.5 items-center gap-1" aria-hidden>
              {off ? (
                <span className="font-mono text-[10px] leading-none text-muted-foreground">off</span>
              ) : (
                dayJobs.map((job) => (
                  <span
                    key={job.id}
                    className={cn('size-1.5 rounded-full', ACCENT_DOT[jobAccent(job, conflicted.has(job.id))])}
                  />
                ))
              )}
            </span>
            {isToday && <span aria-hidden className="absolute inset-x-0 bottom-[5px] h-[2px] bg-primary" />}
            {selected && (
              <motion.span
                aria-hidden
                layoutId="day-underline"
                transition={transition(0.25)}
                className="absolute inset-x-0 bottom-0 h-px bg-foreground"
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
