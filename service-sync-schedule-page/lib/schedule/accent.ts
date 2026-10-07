import type { Job } from './types'

export type Accent = 'urgent' | 'done' | 'in-progress' | 'pending'

export function jobAccent(job: Job, conflicted: boolean): Accent {
  if (job.status !== 'done' && (job.priority === 'urgent' || conflicted)) return 'urgent'
  return job.status
}

export const ACCENT_DOT: Record<Accent, string> = {
  urgent: 'bg-primary',
  done: 'bg-done',
  'in-progress': 'bg-progress',
  pending: 'bg-pending',
}

export const ACCENT_EDGE: Record<Accent, string> = {
  urgent: 'border-l-primary',
  done: 'border-l-done',
  'in-progress': 'border-l-progress',
  pending: 'border-l-pending',
}
