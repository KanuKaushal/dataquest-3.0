export type NotificationType =
  | 'assignment'
  | 'exception'
  | 'parts'
  | 'schedule'
  | 'approval'
  | 'verification'
  | 'system'

export type NotificationFilter = 'all' | 'unread' | 'urgent' | 'assignments' | 'parts' | 'sla'

export type NotificationResponse = 'accepted' | 'declined'

export type NotificationActionEffect =
  | { type: 'respond'; response: NotificationResponse; tag: string; toast: string }
  | { type: 'navigate'; href: string }
  | { type: 'toast'; message: string }

export interface NotificationAction {
  id: string
  label: string
  style: 'primary' | 'ghost' | 'link'
  effect: NotificationActionEffect
}

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  body: string
  /** Longer context shown when the row is expanded */
  detail: string
  requestId: string | null
  machine: string | null
  site: string | null
  /** Local ISO timestamp without an offset, for example 2025-10-07T09:00:00 */
  createdAt: string
  read: boolean
  urgent: boolean
  sla?: boolean
  /** One-line prompt for the "Needs a reply" list */
  replyPrompt?: string
  response?: NotificationResponse
  responseTag?: string
  actions: NotificationAction[]
}

export type DayGroup = 'today' | 'yesterday' | 'earlier'
