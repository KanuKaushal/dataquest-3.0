export type JobStatus = 'done' | 'in-progress' | 'pending'
export type Priority = 'urgent' | 'high' | 'normal'
export type SiteId = 'A' | 'B' | 'C'
export type MachineType = 'Pump' | 'Compressor' | 'Conveyor' | 'Boiler' | 'Generator'
export type ViewMode = 'day' | 'week'

export interface Part {
  code: string
  qty: number
  confirmed: boolean
}

export interface SiteContact {
  name: string
  phone: string
}

export interface SlaDue {
  day: number
  time: string
}

export interface Job {
  id: string
  requestId: string
  machine: string
  machineType: MachineType
  site: SiteId
  /** 0 = Monday ... 6 = Sunday */
  day: number
  /** "HH:MM", 24h */
  start: string
  end: string
  priority: Priority
  status: JobStatus
  sla: SlaDue | null
  fault: string
  parts: Part[]
  contact: SiteContact
}

export interface TimeOff {
  day: number
  label: string
}

export interface Overlap {
  withRequestId: string
  minutes: number
}

export interface WeekDay {
  index: number
  short: string
  long: string
  date: number
  month: number
}

export type AgendaEntry =
  | { kind: 'job'; job: Job; overlap: Overlap | null }
  | { kind: 'travel'; from: SiteId; to: SiteId; at: number; minutes: number }
  | { kind: 'free'; at: number; minutes: number }
  | { kind: 'now'; minutes: number }
