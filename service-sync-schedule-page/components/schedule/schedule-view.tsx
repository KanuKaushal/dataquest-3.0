'use client'

import { useEffect, useMemo, useState } from 'react'
import { Reveal } from '@/components/technician/reveal'
import { StatRow } from '@/components/technician/stat-row'
import { useShell } from '@/components/technician/shell-context'
import { useToast } from '@/components/technician/toast'
import {
  computeWeekStats,
  getAttentionItems,
  matchesQuery,
  type AttentionItem,
} from '@/lib/schedule/agenda'
import {
  FREE_SLOTS_THIS_WEEK,
  SCHEDULE_JOBS,
  TECHNICIAN_FIRST_NAME,
  TIME_OFF,
  TODAY_INDEX,
} from '@/lib/schedule/data'
import { formatDayMonth, formatWeekGreeting, formatWeekRange, getWeekDays } from '@/lib/schedule/time'
import type { Job, ViewMode } from '@/lib/schedule/types'
import { DayAgenda } from './day-agenda'
import { SideColumn } from './side-column'
import { useNow } from './use-now'
import { WeekGrid } from './week-grid'
import { WeekHeader } from './week-header'
import { WeekStrip } from './week-strip'

export function ScheduleView() {
  const { query, setGreeting } = useShell()
  const toast = useToast()
  const nowMinutes = useNow()

  const [weekOffset, setWeekOffset] = useState(0)
  const [selectedDay, setSelectedDay] = useState(TODAY_INDEX)
  const [view, setView] = useState<ViewMode>('day')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [reassignedIds, setReassignedIds] = useState<ReadonlySet<string>>(new Set())

  const days = useMemo(() => getWeekDays(weekOffset), [weekOffset])
  const isCurrentWeek = weekOffset === 0
  const filtering = query.trim().length > 0

  // Only the mock week has jobs; other weeks are open
  const weekJobs = useMemo(
    () => (isCurrentWeek ? SCHEDULE_JOBS.filter((job) => !reassignedIds.has(job.id)) : []),
    [isCurrentWeek, reassignedIds],
  )
  const visibleJobs = useMemo(() => weekJobs.filter((job) => matchesQuery(job, query)), [weekJobs, query])
  const timeOff = isCurrentWeek ? TIME_OFF : []

  const weekStats = useMemo(() => computeWeekStats(weekJobs), [weekJobs])
  const attention = useMemo(() => getAttentionItems(weekJobs), [weekJobs])

  useEffect(() => {
    setGreeting(isCurrentWeek ? null : formatWeekGreeting(days, TECHNICIAN_FIRST_NAME))
    return () => setGreeting(null)
  }, [days, isCurrentWeek, setGreeting])

  const selected = days[selectedDay]

  function shiftWeek(delta: number) {
    setWeekOffset((current) => current + delta)
    setExpandedId(null)
  }

  function goToThisWeek() {
    setWeekOffset(0)
    setSelectedDay(TODAY_INDEX)
    setExpandedId(null)
  }

  function selectDay(day: number) {
    setSelectedDay(day)
    setExpandedId(null)
  }

  function openJob(job: Job) {
    setView('day')
    setSelectedDay(job.day)
    setExpandedId(job.id)
  }

  function reassign(job: Job) {
    setReassignedIds((current) => new Set(current).add(job.id))
    setExpandedId(null)
    toast(`${job.requestId} sent back to the dispatcher for reassignment`)
  }

  function handleAttention(item: AttentionItem) {
    const job = weekJobs.find((candidate) => candidate.id === item.jobId)
    if (!job) return
    if (item.kind === 'overlap') reassign(job)
    else openJob(job)
  }

  return (
    <div className="flex flex-col gap-12">
      <Reveal index={0}>
        <StatRow
          stats={[
            { label: 'Jobs this week', value: weekStats.jobs },
            { label: 'Hours booked', value: weekStats.hours },
            { label: 'Conflicts', value: weekStats.conflicts, flagWhenPositive: true },
            { label: 'Free slots', value: isCurrentWeek ? FREE_SLOTS_THIS_WEEK : 0 },
          ]}
        />
      </Reveal>

      <div className="grid gap-x-16 gap-y-14 lg:grid-cols-[minmax(0,1fr)_280px]">
        <Reveal index={1} className="flex min-w-0 flex-col gap-8">
          <WeekHeader
            rangeLabel={formatWeekRange(days)}
            isCurrentWeek={isCurrentWeek}
            view={view}
            onShiftWeek={shiftWeek}
            onThisWeek={goToThisWeek}
            onViewChange={setView}
          />

          {view === 'day' ? (
            <>
              <WeekStrip
                days={days}
                weekOffset={weekOffset}
                selectedDay={selectedDay}
                jobs={visibleJobs}
                timeOff={timeOff}
                onSelect={selectDay}
              />
              <section role="tabpanel" aria-labelledby={`day-tab-${selectedDay}`} className="-mt-2">
                <h2 className="mb-4 font-serif text-[22px]">
                  {selected.long}, {formatDayMonth(selected)}
                </h2>
                <DayAgenda
                  day={selected}
                  weekOffset={weekOffset}
                  jobs={visibleJobs}
                  timeOff={timeOff.find((entry) => entry.day === selectedDay) ?? null}
                  filtering={filtering}
                  nowMinutes={nowMinutes}
                  expandedId={expandedId}
                  onExpandedChange={setExpandedId}
                  onReassign={reassign}
                />
              </section>
            </>
          ) : (
            <WeekGrid
              days={days}
              weekOffset={weekOffset}
              jobs={visibleJobs}
              timeOff={timeOff}
              nowMinutes={nowMinutes}
              onOpenDay={(day) => {
                setSelectedDay(day)
                setView('day')
              }}
            />
          )}
        </Reveal>

        <Reveal index={2}>
          <SideColumn attention={attention} onAction={handleAttention} />
        </Reveal>
      </div>
    </div>
  )
}
