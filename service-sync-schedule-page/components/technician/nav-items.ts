import { Bell, CalendarDays, ListChecks, Sun, type LucideIcon } from 'lucide-react'

export interface NavItem {
  href: string
  label: string
  icon: LucideIcon
  /** Shows the orange dot while there are unread notifications */
  tracksUnread?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/technician/dashboard', label: 'Today', icon: Sun },
  { href: '/technician/tasks', label: 'My tasks', icon: ListChecks },
  { href: '/technician/schedule', label: 'Schedule', icon: CalendarDays },
  { href: '/technician/notifications', label: 'Notifications', icon: Bell, tracksUnread: true },
]

export const PAGE_META: Record<string, { greeting: string; searchPlaceholder: string }> = {
  '/technician/dashboard': { greeting: 'Good morning, Maya.', searchPlaceholder: 'Search today' },
  '/technician/tasks': { greeting: 'Your tasks, Maya.', searchPlaceholder: 'Search tasks' },
  '/technician/schedule': { greeting: 'Week of 6 October. Hi Maya.', searchPlaceholder: 'Search schedule' },
  '/technician/notifications': { greeting: 'Tuesday, 7 October. Hi Maya.', searchPlaceholder: 'Search notifications' },
}
