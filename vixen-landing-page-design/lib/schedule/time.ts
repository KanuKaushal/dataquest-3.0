import { TODAY_INDEX } from './data'
import type { SlaDue, WeekDay } from './types'

const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const DAYS_LONG = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const MONTHS_SHORT = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
const MONTHS_LONG = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const MINUTES_PER_DAY = 24 * 60
// Monday 6 October is week 0 of the mock calendar
const FIRST_MONDAY = { year: 2025, month: 9, date: 6 }

export function toMinutes(time: string) {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export function formatClock(totalMinutes: number) {
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, '0')
  const minutes = String(totalMinutes % 60).padStart(2, '0')
  return `${hours}:${minutes}`
}

export function formatDuration(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours === 0) return `${minutes}m`
  if (minutes === 0) return `${hours}h`
  return `${hours}h ${minutes}m`
}

export function getWeekDays(weekOffset: number): WeekDay[] {
  return DAYS_SHORT.map((short, index) => {
    const date = new Date(
      Date.UTC(FIRST_MONDAY.year, FIRST_MONDAY.month, FIRST_MONDAY.date + weekOffset * 7 + index),
    )
    return {
      index,
      short,
      long: DAYS_LONG[index],
      date: date.getUTCDate(),
      month: date.getUTCMonth(),
    }
  })
}

export function formatDayMonth(day: WeekDay) {
  return `${day.date} ${MONTHS_SHORT[day.month]}`
}

export function formatWeekRange(days: WeekDay[]) {
  const first = days[0]
  const last = days[days.length - 1]
  if (first.month === last.month) {
    return `${first.date} – ${last.date} ${MONTHS_SHORT[last.month]}`
  }
  return `${first.date} ${MONTHS_SHORT[first.month]} – ${last.date} ${MONTHS_SHORT[last.month]}`
}

export function formatWeekGreeting(days: WeekDay[], name: string) {
  const first = days[0]
  return `Week of ${first.date} ${MONTHS_LONG[first.month]}. Hi ${name}.`
}

export function dayName(index: number) {
  return DAYS_LONG[index]
}

export interface SlaLabel {
  label: string
  urgent: boolean
}

export function describeSla(sla: SlaDue, nowMinutes: number): SlaLabel {
  const remaining = sla.day * MINUTES_PER_DAY + toMinutes(sla.time) - (TODAY_INDEX * MINUTES_PER_DAY + nowMinutes)

  if (remaining < 0) return { label: `overdue ${formatDuration(-remaining)}`, urgent: true }
  if (remaining < 60) return { label: `due in ${formatDuration(remaining)}`, urgent: true }
  if (remaining < MINUTES_PER_DAY) return { label: `due in ${formatDuration(remaining)}`, urgent: false }
  return { label: `due ${DAYS_SHORT[sla.day]} ${sla.time}`, urgent: false }
}
