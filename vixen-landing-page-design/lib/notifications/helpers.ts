import type { AppNotification, DayGroup, NotificationFilter } from './types'

export const FILTERS: { id: NotificationFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'urgent', label: 'Urgent' },
  { id: 'assignments', label: 'Assignments' },
  { id: 'parts', label: 'Parts' },
  { id: 'sla', label: 'SLA' },
]

export const DAY_GROUPS: { id: DayGroup; label: string }[] = [
  { id: 'today', label: 'today' },
  { id: 'yesterday', label: 'yesterday' },
  { id: 'earlier', label: 'earlier this week' },
]

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

/** An exception stops being urgent once the technician has answered it */
export function isUrgent(item: AppNotification) {
  return item.urgent && !item.response
}

export function isAwaitingReply(item: AppNotification) {
  return !item.response && item.actions.some((action) => action.effect.type === 'respond')
}

export function matchesFilter(item: AppNotification, filter: NotificationFilter) {
  switch (filter) {
    case 'unread':
      return !item.read
    case 'urgent':
      return isUrgent(item)
    case 'assignments':
      return item.type === 'assignment'
    case 'parts':
      return item.type === 'parts'
    case 'sla':
      return item.sla === true
    default:
      return true
  }
}

export function countByFilter(items: AppNotification[]): Record<NotificationFilter, number> {
  return Object.fromEntries(
    FILTERS.map(({ id }) => [id, items.filter((item) => matchesFilter(item, id)).length]),
  ) as Record<NotificationFilter, number>
}

export function matchesQuery(item: AppNotification, query: string) {
  const needle = query.trim().toLowerCase()
  if (!needle) return true
  return [item.title, item.requestId, item.machine].some((field) => field?.toLowerCase().includes(needle))
}

function dateKey(ms: number) {
  const date = new Date(ms)
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

export function dayGroup(createdAt: string, now: number): DayGroup {
  const key = dateKey(new Date(createdAt).getTime())
  if (key === dateKey(now)) return 'today'
  if (key === dateKey(now - DAY)) return 'yesterday'
  return 'earlier'
}

export function formatAge(createdAt: string, now: number) {
  const created = new Date(createdAt).getTime()
  const age = Math.max(0, now - created)
  if (age < MINUTE) return 'now'
  if (age < HOUR) return `${Math.floor(age / MINUTE)}m ago`
  if (age < DAY) return `${Math.floor(age / HOUR)}h ago`
  return WEEKDAYS[new Date(created).getDay()]
}

export function toLocalIso(ms: number) {
  const date = new Date(ms)
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

export function describeLocation(item: AppNotification) {
  if (item.machine && item.site) return `${item.machine}, Site ${item.site}`
  if (item.site) return `Site ${item.site}`
  return item.machine
}
