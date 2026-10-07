export type NotificationKind = 'exception' | 'update' | 'completion'
export type DayKey = 'today' | 'yesterday' | 'week'
export type TabKey = 'all' | 'unread' | 'exceptions' | 'updates'
export type Site = 'Site A' | 'Site B' | 'Site C'
export type SiteFilterValue = 'all' | Site

export interface TimelineEvent {
  time: string
  label: string
}

export interface NotificationAction {
  label: string
  confirmation: string
}

export interface Notification {
  id: string
  kind: NotificationKind
  day: DayKey
  title: string
  summary: string
  detail: string
  requestId: string
  machine: string
  site: Site
  age: string
  action?: NotificationAction
  events: TimelineEvent[]
  read: boolean
  fresh?: boolean
}

export const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'exceptions', label: 'Exceptions' },
  { key: 'updates', label: 'Updates' },
]

export const SITE_OPTIONS: { value: SiteFilterValue; label: string }[] = [
  { value: 'all', label: 'All sites' },
  { value: 'Site A', label: 'Site A' },
  { value: 'Site B', label: 'Site B' },
  { value: 'Site C', label: 'Site C' },
]

export const DAY_GROUPS: { key: DayKey; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: 'week', label: 'Earlier this week' },
]

export const LIVE_ALERT_DELAY_MS = 8000

export const LIVE_NOTIFICATION: Notification = {
  id: 'n11',
  kind: 'update',
  day: 'today',
  title: 'New request submitted',
  summary: 'REQ-2048 submitted and waiting for approval.',
  detail:
    'REQ-2048 for M-156 Press was submitted and passed all pre-checks. Approval is the only step left before it is routed to a technician.',
  requestId: 'REQ-2048',
  machine: 'M-156 Press',
  site: 'Site B',
  age: 'just now',
  events: [
    { time: '12:00', label: 'Request submitted' },
    { time: '12:00', label: 'Pre-checks passed' },
    { time: '12:00', label: 'Waiting for approval' },
  ],
  read: false,
  fresh: true,
}

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    kind: 'exception',
    day: 'today',
    title: 'Technician dropped out',
    summary: "Maya Okafor is no longer available for M-104. We're finding a replacement.",
    detail:
      "Maya Okafor is no longer available for M-104. We're finding a replacement, and REQ-2047 keeps its place in the queue. You can pick a technician yourself with Reassign.",
    requestId: 'REQ-2047',
    machine: 'M-104 Pump',
    site: 'Site A',
    age: '12m ago',
    action: { label: 'Reassign', confirmation: 'Replacement requested for REQ-2047' },
    events: [
      { time: 'Yesterday 15:30', label: 'Bearing 6205 x2 reserved' },
      { time: '09:15', label: 'Maya Okafor assigned' },
      { time: '11:48', label: 'Maya Okafor dropped out' },
    ],
    read: false,
  },
  {
    id: 'n2',
    kind: 'exception',
    day: 'today',
    title: 'Part unavailable',
    summary: 'Seal kit SK-14 is out of stock at Site B. REQ-2046 may be delayed.',
    detail:
      'Seal kit SK-14 is out of stock at Site B. A compatible kit, SK-14B, is available at Site A and can arrive tomorrow morning. Approve it to keep REQ-2046 on schedule.',
    requestId: 'REQ-2046',
    machine: 'M-211 Compressor',
    site: 'Site B',
    age: '40m ago',
    action: { label: 'Approve alternative', confirmation: 'Alternative approved for REQ-2046' },
    events: [
      { time: '10:00', label: 'Tomas Reyes assigned' },
      { time: '11:20', label: 'Seal kit SK-14 out of stock' },
      { time: '11:21', label: 'Alternative SK-14B found' },
    ],
    read: false,
  },
  {
    id: 'n3',
    kind: 'exception',
    day: 'today',
    title: 'SLA at risk',
    summary: 'REQ-2044 on M-132 Boiler has passed its 8h response target.',
    detail:
      'REQ-2044 on M-132 Boiler has passed its 8h response target and work has not started. Review the request to escalate or change the technician.',
    requestId: 'REQ-2044',
    machine: 'M-132 Boiler',
    site: 'Site C',
    age: '1h ago',
    action: { label: 'View request', confirmation: 'Opening REQ-2044' },
    events: [
      { time: 'Yesterday 15:00', label: 'Request approved' },
      { time: 'Yesterday 15:40', label: 'Technician assigned' },
      { time: '11:00', label: 'Response target missed' },
    ],
    read: false,
  },
  {
    id: 'n4',
    kind: 'update',
    day: 'today',
    title: 'Technician assigned',
    summary: 'Tomas Reyes will handle REQ-2046 on M-211 Compressor.',
    detail:
      'Tomas Reyes will handle REQ-2046 on M-211 Compressor. He is scheduled for the next available slot at Site B.',
    requestId: 'REQ-2046',
    machine: 'M-211 Compressor',
    site: 'Site B',
    age: '2h ago',
    events: [
      { time: 'Yesterday 17:20', label: 'Request submitted' },
      { time: '09:30', label: 'Request approved' },
      { time: '10:00', label: 'Tomas Reyes assigned' },
    ],
    read: true,
  },
  {
    id: 'n5',
    kind: 'update',
    day: 'today',
    title: 'Request approved',
    summary: 'REQ-2045 for M-087 Conveyor was approved and is being routed.',
    detail:
      'REQ-2045 for M-087 Conveyor was approved and is being routed to available technicians at Site A. You will be notified when someone is assigned.',
    requestId: 'REQ-2045',
    machine: 'M-087 Conveyor',
    site: 'Site A',
    age: '2h ago',
    events: [
      { time: 'Yesterday 16:45', label: 'Request submitted' },
      { time: '09:55', label: 'Request approved' },
      { time: '09:58', label: 'Routed to technicians' },
    ],
    read: true,
  },
  {
    id: 'n6',
    kind: 'completion',
    day: 'today',
    title: 'Work completed, please verify',
    summary: 'Ravi Menon finished REQ-2043 on M-309 Generator. 4 photos attached.',
    detail:
      'Ravi Menon finished REQ-2043 on M-309 Generator and attached 4 photos. Check the work on site, then verify it to close the request.',
    requestId: 'REQ-2043',
    machine: 'M-309 Generator',
    site: 'Site C',
    age: '5h ago',
    action: { label: 'Verify completion', confirmation: 'REQ-2043 verified' },
    events: [
      { time: 'Yesterday 08:30', label: 'Ravi Menon assigned' },
      { time: '06:10', label: 'Work started' },
      { time: '07:00', label: 'Work completed, 4 photos' },
    ],
    read: true,
  },
  {
    id: 'n7',
    kind: 'update',
    day: 'yesterday',
    title: 'Reassigned',
    summary: 'REQ-2041 moved to Lena Fischer after a schedule conflict.',
    detail:
      'REQ-2041 moved to Lena Fischer after the original technician reported a schedule conflict. The visit date has not changed.',
    requestId: 'REQ-2041',
    machine: 'M-156 Press',
    site: 'Site B',
    age: '1d ago',
    events: [
      { time: 'Mon 14:20', label: 'Omar Haddad assigned' },
      { time: 'Tue 13:05', label: 'Schedule conflict reported' },
      { time: 'Tue 13:12', label: 'Reassigned to Lena Fischer' },
    ],
    read: true,
  },
  {
    id: 'n8',
    kind: 'update',
    day: 'yesterday',
    title: 'Parts reserved',
    summary: 'Bearing 6205 x2 reserved for REQ-2047.',
    detail:
      'Bearing 6205 x2 are reserved at Site A for REQ-2047 and will be ready when the technician arrives.',
    requestId: 'REQ-2047',
    machine: 'M-104 Pump',
    site: 'Site A',
    age: '1d ago',
    events: [
      { time: 'Yesterday 09:50', label: 'Request submitted' },
      { time: 'Yesterday 11:05', label: 'Request approved' },
      { time: 'Yesterday 15:30', label: 'Bearing 6205 x2 reserved' },
    ],
    read: true,
  },
  {
    id: 'n9',
    kind: 'completion',
    day: 'week',
    title: 'Request closed',
    summary: 'REQ-2038 on M-087 Conveyor was verified and closed.',
    detail:
      'REQ-2038 on M-087 Conveyor was verified and closed. The service report is available in your request history.',
    requestId: 'REQ-2038',
    machine: 'M-087 Conveyor',
    site: 'Site A',
    age: '2d ago',
    events: [
      { time: 'Mon 08:10', label: 'Work completed' },
      { time: 'Mon 10:30', label: 'Completion verified' },
      { time: 'Mon 10:31', label: 'Request closed' },
    ],
    read: true,
  },
  {
    id: 'n10',
    kind: 'update',
    day: 'week',
    title: 'Request submitted',
    summary: 'REQ-2037 is waiting for approval.',
    detail:
      'REQ-2037 for M-174 Lathe is waiting for approval. Once approved, it is routed to a technician at Site C.',
    requestId: 'REQ-2037',
    machine: 'M-174 Lathe',
    site: 'Site C',
    age: '2d ago',
    events: [
      { time: 'Mon 15:40', label: 'Request submitted' },
      { time: 'Mon 15:41', label: 'Pre-checks passed' },
      { time: 'Mon 15:42', label: 'Waiting for approval' },
    ],
    read: true,
  },
]

export function matchesSite(notification: Notification, site: SiteFilterValue) {
  return site === 'all' || notification.site === site
}

export function matchesTab(notification: Notification, tab: TabKey) {
  switch (tab) {
    case 'unread':
      return !notification.read
    case 'exceptions':
      return notification.kind === 'exception'
    case 'updates':
      return notification.kind !== 'exception'
    default:
      return true
  }
}

export function tabCounts(notifications: Notification[], site: SiteFilterValue): Record<TabKey, number> {
  const scoped = notifications.filter((n) => matchesSite(n, site))
  return {
    all: scoped.length,
    unread: scoped.filter((n) => matchesTab(n, 'unread')).length,
    exceptions: scoped.filter((n) => matchesTab(n, 'exceptions')).length,
    updates: scoped.filter((n) => matchesTab(n, 'updates')).length,
  }
}

export function groupByDay(notifications: Notification[]) {
  return DAY_GROUPS.map((group) => ({
    ...group,
    items: notifications.filter((n) => n.day === group.key),
  })).filter((group) => group.items.length > 0)
}
