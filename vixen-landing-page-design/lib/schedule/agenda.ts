import { TODAY_INDEX, travelMinutes } from './data'
import { dayName, toMinutes } from './time'
import type { AgendaEntry, Job, Overlap } from './types'

const MIN_FREE_GAP = 15

export function sortByStart(jobs: Job[]) {
  return [...jobs].sort((a, b) => toMinutes(a.start) - toMinutes(b.start))
}

export function jobsForDay(jobs: Job[], day: number) {
  return sortByStart(jobs.filter((job) => job.day === day))
}

export function matchesQuery(job: Job, query: string) {
  const needle = query.trim().toLowerCase()
  if (!needle) return true
  return [job.machine, job.machineType, `site ${job.site}`, job.requestId]
    .join(' ')
    .toLowerCase()
    .includes(needle)
}

/** Maps a job id to its clash with the previous job in start order. */
export function findOverlaps(sortedJobs: Job[]) {
  const overlaps = new Map<string, Overlap>()
  sortedJobs.forEach((job, index) => {
    const previous = sortedJobs[index - 1]
    if (!previous) return
    const minutes = toMinutes(previous.end) - toMinutes(job.start)
    if (minutes > 0) overlaps.set(job.id, { withRequestId: previous.requestId, minutes })
  })
  return overlaps
}

export function bookedMinutes(jobs: Job[]) {
  let total = 0
  let runEnd = -1
  let runStart = -1
  for (const job of sortByStart(jobs)) {
    const start = toMinutes(job.start)
    const end = toMinutes(job.end)
    if (start > runEnd) {
      if (runEnd > runStart) total += runEnd - runStart
      runStart = start
      runEnd = end
    } else {
      runEnd = Math.max(runEnd, end)
    }
  }
  if (runEnd > runStart) total += runEnd - runStart
  return total
}

function entryStart(entry: AgendaEntry) {
  if (entry.kind === 'job') return toMinutes(entry.job.start)
  if (entry.kind === 'now') return entry.minutes
  return entry.at
}

export function buildAgenda(dayJobs: Job[], nowMinutes: number | null): AgendaEntry[] {
  const sorted = sortByStart(dayJobs)
  const overlaps = findOverlaps(sorted)
  const entries: AgendaEntry[] = []

  sorted.forEach((job, index) => {
    const previous = sorted[index - 1]
    if (previous) {
      const previousEnd = toMinutes(previous.end)
      const gap = toMinutes(job.start) - previousEnd
      if (gap > 0) {
        const travel = Math.min(travelMinutes(previous.site, job.site), gap)
        if (travel > 0) {
          entries.push({ kind: 'travel', from: previous.site, to: job.site, at: previousEnd, minutes: travel })
        }
        if (gap - travel >= MIN_FREE_GAP) {
          entries.push({ kind: 'free', at: previousEnd + travel, minutes: gap - travel })
        }
      }
    }
    entries.push({ kind: 'job', job, overlap: overlaps.get(job.id) ?? null })
  })

  if (nowMinutes !== null) {
    const index = entries.findIndex((entry) => entryStart(entry) > nowMinutes)
    const marker: AgendaEntry = { kind: 'now', minutes: nowMinutes }
    entries.splice(index === -1 ? entries.length : index, 0, marker)
  }

  return entries
}

export function computeWeekStats(jobs: Job[]) {
  let booked = 0
  let conflicts = 0
  for (let day = 0; day < 7; day++) {
    const dayJobs = jobsForDay(jobs, day)
    booked += bookedMinutes(dayJobs)
    conflicts += findOverlaps(dayJobs).size
  }
  return { jobs: jobs.length, hours: Math.round(booked / 60), conflicts }
}

export interface AttentionItem {
  id: string
  jobId: string
  kind: 'overlap' | 'part'
  text: string
  action: string
}

export function getAttentionItems(jobs: Job[]): AttentionItem[] {
  const items: AttentionItem[] = []

  for (let day = 0; day < 7; day++) {
    const dayJobs = jobsForDay(jobs, day)
    findOverlaps(dayJobs).forEach((overlap, jobId) => {
      const job = dayJobs.find((candidate) => candidate.id === jobId)
      if (!job) return
      items.push({
        id: `overlap-${jobId}`,
        jobId,
        kind: 'overlap',
        text: `${job.requestId} overlaps ${overlap.withRequestId} by ${overlap.minutes} min.`,
        action: 'Reassign',
      })
    })
  }

  for (const job of sortByStart(jobs).sort((a, b) => a.day - b.day)) {
    const unconfirmed = job.parts.find((part) => !part.confirmed)
    if (!unconfirmed) continue
    items.push({
      id: `part-${job.id}`,
      jobId: job.id,
      kind: 'part',
      text: `Part ${unconfirmed.code} for ${dayName(job.day)}'s ${job.machineType.toLowerCase()} job is not confirmed.`,
      action: 'View',
    })
  }

  return items
}

export function getUpNext(jobs: Job[], nowMinutes: number) {
  return (
    jobsForDay(jobs, TODAY_INDEX).find(
      (job) => job.status === 'pending' && toMinutes(job.start) > nowMinutes,
    ) ?? null
  )
}

/** Splits the column width between jobs that overlap in time. */
export function laneLayout(dayJobs: Job[]) {
  const sorted = sortByStart(dayJobs)
  const overlaps = findOverlaps(sorted)
  const lanes = new Map<string, { lane: number; count: number }>()

  sorted.forEach((job, index) => {
    lanes.set(job.id, { lane: 0, count: 1 })
    if (overlaps.has(job.id)) {
      lanes.set(job.id, { lane: 1, count: 2 })
      const previous = sorted[index - 1]
      lanes.set(previous.id, { lane: 0, count: 2 })
    }
  })

  return lanes
}
