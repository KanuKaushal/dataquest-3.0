import type {
  DayKey,
  NotificationAction,
  NotificationKind,
  Site,
  TimelineEvent,
} from '@/lib/notifications'

export type TechnicianKind = 'assignment' | 'alert' | 'update' | 'completion'
export type TechnicianTabKey = 'all' | 'unread' | 'assignments' | 'alerts'

export interface JobDetails {
  address: string
  slaDue: string
  skills: string[]
  parts: string[]
}

export interface TechnicianNotification {
  id: string
  kind: TechnicianKind
  day: DayKey
  title: string
  summary: string
  detail: string
  site: Site
  requestId?: string
  machine?: string
  age: string
  action?: NotificationAction
  job?: JobDetails
  events: TimelineEvent[]
  read: boolean
  fresh?: boolean
  offer?: {
    notificationId: string
    requestId: string
    machine: string
    site: Site
    respondWithinMinutes: number
    offerSeconds: number
    createdAt?: number
    expiresAt?: number
    status?: 'pending' | 'accepted' | 'declined' | 'expired'
    declineReason?: string
  }
}

export interface PendingAssignment {
  notificationId: string
  requestId: string
  machine: string
  site: Site
  respondWithinMinutes: number
  offerSeconds: number
}

export const TABS: { key: TechnicianTabKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'assignments', label: 'Assignments' },
  { key: 'alerts', label: 'Alerts' },
]

export const DECLINE_REASONS = [
  'Unavailable',
  'Too far from site',
  'Missing skill or tools',
  'Other',
]

export const PENDING_ASSIGNMENT: PendingAssignment = {
  notificationId: 't1',
  requestId: 'REQ-2049',
  machine: 'M-132 Boiler',
  site: 'Site A',
  respondWithinMinutes: 10,
  offerSeconds: 8 * 60 + 42,
}

export const URGENT_COUNTDOWN_SECONDS = 5 * 60
export const LIVE_ALERT_DELAY_MS = 10000

export const LIVE_NOTIFICATION: TechnicianNotification = {
  id: 't13',
  kind: 'assignment',
  day: 'today',
  title: 'Job reassigned to you',
  summary: 'REQ-2050 reassigned from Tomas Reyes.',
  detail:
    'REQ-2050 on M-211 Compressor was reassigned from Tomas Reyes after his schedule filled up. The visit window has not changed.',
  site: 'Site B',
  requestId: 'REQ-2050',
  machine: 'M-211 Compressor',
  age: 'just now',
  action: { label: 'Open job', confirmation: 'Opening REQ-2050' },
  job: {
    address: 'Site B, 2 Dock Lane, Compressor room',
    slaDue: 'Today 16:30',
    skills: ['Compressors', 'Pneumatics'],
    parts: ['Air filter AF-40 x2'],
  },
  events: [
    { time: '11:30', label: 'Assigned to Tomas Reyes' },
    { time: '11:58', label: 'Tomas Reyes released the job' },
    { time: '12:02', label: 'Reassigned to Maya Okafor' },
  ],
  read: false,
  fresh: true,
}

export const INITIAL_NOTIFICATIONS: TechnicianNotification[] = [
  {
    id: 't1',
    kind: 'assignment',
    day: 'today',
    title: 'New job assigned',
    summary: 'REQ-2049, M-132 Boiler at Site A. Pressure relief valve leaking. Urgent.',
    detail:
      'REQ-2049 on M-132 Boiler at Site A needs a technician now. The pressure relief valve is leaking and the boiler is isolated until it is fixed. Respond within 10 minutes or the job is offered to the next technician.',
    site: 'Site A',
    requestId: 'REQ-2049',
    machine: 'M-132 Boiler',
    age: '4m ago',
    action: { label: 'Open job', confirmation: 'Opening REQ-2049' },
    job: {
      address: 'Site A, 14 Harbour Road, Plant room 2',
      slaDue: 'Today 14:00',
      skills: ['Boilers', 'Pressure systems'],
      parts: ['Relief valve RV-22 x1'],
    },
    events: [
      { time: '11:44', label: 'Request submitted' },
      { time: '11:46', label: 'Approved as urgent' },
      { time: '11:48', label: 'Assigned to Maya Okafor' },
    ],
    read: false,
  },
  {
    id: 't2',
    kind: 'alert',
    day: 'today',
    title: 'SLA countdown',
    summary: 'REQ-2047 on M-104 Pump is due in 45 minutes.',
    detail:
      'REQ-2047 on M-104 Pump is due at 12:37 and has not been marked complete. Finish the job or ask operations for more time before the SLA is missed.',
    site: 'Site A',
    requestId: 'REQ-2047',
    machine: 'M-104 Pump',
    age: '15m ago',
    action: { label: 'Open job', confirmation: 'Opening REQ-2047' },
    job: {
      address: 'Site A, 14 Harbour Road, Pump house',
      slaDue: 'Today 12:37',
      skills: ['Pumps', 'Mechanical'],
      parts: ['Bearing 6205 x2'],
    },
    events: [
      { time: '09:15', label: 'Assigned to Maya Okafor' },
      { time: '10:20', label: 'Work started' },
      { time: '11:37', label: 'SLA warning raised' },
    ],
    read: false,
  },
  {
    id: 't3',
    kind: 'alert',
    day: 'today',
    title: 'Priority raised',
    summary: 'REQ-2046 on M-211 Compressor moved from High to Urgent.',
    detail:
      'Operations moved REQ-2046 on M-211 Compressor from High to Urgent. The visit now has to finish before 15:00 today.',
    site: 'Site B',
    requestId: 'REQ-2046',
    machine: 'M-211 Compressor',
    age: '35m ago',
    action: { label: 'Open job', confirmation: 'Opening REQ-2046' },
    job: {
      address: 'Site B, 2 Dock Lane, Compressor room',
      slaDue: 'Today 15:00',
      skills: ['Compressors', 'Pneumatics'],
      parts: ['Seal kit SK-14 x1 (out of stock)'],
    },
    events: [
      { time: '08:30', label: 'Request approved' },
      { time: '09:40', label: 'Assigned to Maya Okafor' },
      { time: '11:17', label: 'Priority raised to Urgent' },
    ],
    read: false,
  },
  {
    id: 't4',
    kind: 'update',
    day: 'today',
    title: 'Parts ready for pickup',
    summary: 'Bearing 6205 x2 are reserved for REQ-2047. Collect from Site A store, shelf B3.',
    detail:
      'Bearing 6205 x2 are reserved for REQ-2047. Collect them from the Site A store, shelf B3, and bring your site pass.',
    site: 'Site A',
    requestId: 'REQ-2047',
    machine: 'M-104 Pump',
    age: '1h ago',
    action: { label: 'View parts', confirmation: 'Showing parts for REQ-2047' },
    job: {
      address: 'Site A, 14 Harbour Road, Pump house',
      slaDue: 'Today 12:37',
      skills: ['Pumps', 'Mechanical'],
      parts: ['Bearing 6205 x2, Site A store, shelf B3'],
    },
    events: [
      { time: '09:15', label: 'Assigned to Maya Okafor' },
      { time: '10:45', label: 'Parts reserved' },
      { time: '10:52', label: 'Ready for pickup' },
    ],
    read: false,
  },
  {
    id: 't5',
    kind: 'assignment',
    day: 'today',
    title: 'Schedule changed',
    summary: 'REQ-2045 on M-087 Conveyor moved to 3:30 PM tomorrow.',
    detail:
      'The customer asked to move REQ-2045 on M-087 Conveyor to 3:30 PM tomorrow. Your schedule for today is now clear of this visit.',
    site: 'Site A',
    requestId: 'REQ-2045',
    machine: 'M-087 Conveyor',
    age: '2h ago',
    action: { label: 'View schedule', confirmation: 'Showing tomorrow’s schedule' },
    job: {
      address: 'Site A, 14 Harbour Road, Packing line',
      slaDue: 'Tomorrow 15:30',
      skills: ['Conveyors', 'Electrical'],
      parts: ['Drive belt B68 x1'],
    },
    events: [
      { time: 'Yesterday 17:00', label: 'Assigned to Maya Okafor' },
      { time: '09:50', label: 'Customer asked to reschedule' },
      { time: '09:55', label: 'Moved to tomorrow 15:30' },
    ],
    read: true,
  },
  {
    id: 't6',
    kind: 'alert',
    day: 'today',
    title: 'Part unavailable',
    summary: 'Seal kit SK-14 is out of stock. An alternative is being approved for REQ-2046.',
    detail:
      'Seal kit SK-14 is out of stock at Site B. Operations is approving SK-14B from Site A. You will be told when the replacement is reserved.',
    site: 'Site B',
    requestId: 'REQ-2046',
    machine: 'M-211 Compressor',
    age: '3h ago',
    job: {
      address: 'Site B, 2 Dock Lane, Compressor room',
      slaDue: 'Today 15:00',
      skills: ['Compressors', 'Pneumatics'],
      parts: ['Seal kit SK-14 x1 (out of stock)', 'Seal kit SK-14B x1 (pending approval)'],
    },
    events: [
      { time: '08:30', label: 'Seal kit SK-14 out of stock' },
      { time: '08:35', label: 'Alternative SK-14B found' },
      { time: '08:52', label: 'Approval requested' },
    ],
    read: true,
  },
  {
    id: 't7',
    kind: 'update',
    day: 'today',
    title: 'Message from operations',
    summary: 'Site B gate access changes to Gate 2 after 4 PM.',
    detail:
      'Site B gate access changes to Gate 2 after 4 PM. Gate 1 will be closed to vehicles from then, so carry your site pass for the Gate 2 check.',
    site: 'Site B',
    age: '4h ago',
    events: [],
    read: true,
  },
  {
    id: 't8',
    kind: 'completion',
    day: 'yesterday',
    title: 'Completion verified',
    summary: 'REQ-2043 on M-309 Generator was verified and closed.',
    detail:
      'REQ-2043 on M-309 Generator was verified and closed. The service report is in your job history.',
    site: 'Site C',
    requestId: 'REQ-2043',
    machine: 'M-309 Generator',
    age: '1d ago',
    job: {
      address: 'Site C, 7 Quarry Road, Generator hall',
      slaDue: 'Yesterday 17:00',
      skills: ['Generators', 'Electrical'],
      parts: ['Fuel filter FF-3 x1'],
    },
    events: [
      { time: 'Yesterday 08:30', label: 'Work started' },
      { time: 'Yesterday 10:20', label: 'Work completed, 4 photos' },
      { time: 'Yesterday 14:05', label: 'Verified and closed' },
    ],
    read: true,
  },
  {
    id: 't9',
    kind: 'alert',
    day: 'yesterday',
    title: 'Verification needs more info',
    summary: 'REQ-2041 needs a clearer photo of the replaced gasket.',
    detail:
      'The verifier could not read the part number on the replaced gasket in REQ-2041. Upload a photo with the part number in focus so the request can be closed.',
    site: 'Site B',
    requestId: 'REQ-2041',
    machine: 'M-156 Press',
    age: '1d ago',
    action: { label: 'Re-upload photos', confirmation: 'Photo upload opened for REQ-2041' },
    job: {
      address: 'Site B, 2 Dock Lane, Press hall',
      slaDue: 'Yesterday 17:00',
      skills: ['Hydraulics', 'Presses'],
      parts: ['Gasket G-210 x1'],
    },
    events: [
      { time: 'Yesterday 11:00', label: 'Work completed' },
      { time: 'Yesterday 15:10', label: 'Verification started' },
      { time: 'Yesterday 15:40', label: 'More information requested' },
    ],
    read: true,
  },
  {
    id: 't10',
    kind: 'assignment',
    day: 'yesterday',
    title: 'Reassigned to you',
    summary: 'REQ-2041 moved to you after Lena Fischer’s schedule conflict.',
    detail:
      'REQ-2041 moved to you after Lena Fischer reported a schedule conflict. The visit date has not changed.',
    site: 'Site B',
    requestId: 'REQ-2041',
    machine: 'M-156 Press',
    age: '1d ago',
    job: {
      address: 'Site B, 2 Dock Lane, Press hall',
      slaDue: 'Yesterday 17:00',
      skills: ['Hydraulics', 'Presses'],
      parts: ['Gasket G-210 x1'],
    },
    events: [
      { time: 'Yesterday 07:20', label: 'Assigned to Lena Fischer' },
      { time: 'Yesterday 08:05', label: 'Schedule conflict reported' },
      { time: 'Yesterday 08:12', label: 'Reassigned to Maya Okafor' },
    ],
    read: true,
  },
  {
    id: 't11',
    kind: 'alert',
    day: 'week',
    title: 'Job cancelled',
    summary: 'REQ-2039 on M-087 Conveyor was cancelled by the customer.',
    detail:
      'REQ-2039 on M-087 Conveyor was cancelled by the customer. No further work is needed and the visit has been removed from your schedule.',
    site: 'Site A',
    requestId: 'REQ-2039',
    machine: 'M-087 Conveyor',
    age: '2d ago',
    job: {
      address: 'Site A, 14 Harbour Road, Packing line',
      slaDue: 'Cancelled',
      skills: ['Conveyors', 'Electrical'],
      parts: [],
    },
    events: [
      { time: 'Mon 14:00', label: 'Assigned to Maya Okafor' },
      { time: 'Tue 08:15', label: 'Cancelled by the customer' },
      { time: 'Tue 08:16', label: 'Removed from schedule' },
    ],
    read: true,
  },
  {
    id: 't12',
    kind: 'completion',
    day: 'week',
    title: 'Completion verified',
    summary: 'REQ-2038 on M-087 Conveyor was verified and closed.',
    detail:
      'REQ-2038 on M-087 Conveyor was verified and closed. The service report is in your job history.',
    site: 'Site A',
    requestId: 'REQ-2038',
    machine: 'M-087 Conveyor',
    age: '3d ago',
    job: {
      address: 'Site A, 14 Harbour Road, Packing line',
      slaDue: 'Mon 16:00',
      skills: ['Conveyors', 'Electrical'],
      parts: ['Roller bearing RB-9 x4'],
    },
    events: [
      { time: 'Mon 08:10', label: 'Work completed' },
      { time: 'Mon 10:30', label: 'Completion verified' },
      { time: 'Mon 10:31', label: 'Request closed' },
    ],
    read: true,
  },
]

export function dotKind(kind: TechnicianKind): NotificationKind {
  if (kind === 'alert') return 'exception'
  return kind === 'completion' ? 'completion' : 'update'
}

export function matchesTab(notification: TechnicianNotification, tab: TechnicianTabKey) {
  switch (tab) {
    case 'unread':
      return !notification.read
    case 'assignments':
      return notification.kind === 'assignment'
    case 'alerts':
      return notification.kind === 'alert'
    default:
      return true
  }
}

export function tabCounts(
  notifications: TechnicianNotification[],
): Record<TechnicianTabKey, number> {
  return {
    all: notifications.length,
    unread: notifications.filter((n) => matchesTab(n, 'unread')).length,
    assignments: notifications.filter((n) => matchesTab(n, 'assignments')).length,
    alerts: notifications.filter((n) => matchesTab(n, 'alerts')).length,
  }
}
