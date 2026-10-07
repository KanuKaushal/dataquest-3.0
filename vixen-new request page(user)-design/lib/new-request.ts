import {
  machines,
  parts,
  technicians,
  type Machine,
  type Part,
  type Priority,
  type Skill,
} from '@/lib/mock-data'

export const SKILLS: Skill[] = ['Mechanical', 'Electrical', 'Hydraulic', 'HVAC', 'Welding', 'PLC/Controls']

export const FAULT_CATEGORIES = [
  'Mechanical',
  'Electrical',
  'Hydraulic',
  'Pneumatic',
  'Software/Control',
  'Other',
] as const

export type FaultCategory = (typeof FAULT_CATEGORIES)[number]

export const SUGGESTED_SKILLS: Record<FaultCategory, Skill[]> = {
  Mechanical: ['Mechanical'],
  Electrical: ['Electrical'],
  Hydraulic: ['Hydraulic', 'Mechanical'],
  Pneumatic: ['Mechanical'],
  'Software/Control': ['PLC/Controls', 'Electrical'],
  Other: [],
}

export const PRIORITIES: { value: Priority; label: string; target: string; eta: string; accent?: boolean }[] = [
  { value: 'low', label: 'Low', target: 'within 5 days', eta: 'Mon 13 Oct, 9:00 AM' },
  { value: 'medium', label: 'Medium', target: 'within 48h', eta: 'Thu 9 Oct, 2:30 PM' },
  { value: 'high', label: 'High', target: 'within 8h', eta: 'tomorrow, 8:30 AM' },
  { value: 'urgent', label: 'Urgent', target: 'within 2h', eta: 'today, 4:30 PM', accent: true },
]

export const TODAY_ISO = '2025-10-07'

export const TIME_SLOTS = Array.from({ length: 20 }, (_, i) => {
  const minutes = 8 * 60 + i * 30
  const h = String(Math.floor(minutes / 60)).padStart(2, '0')
  const m = String(minutes % 60).padStart(2, '0')
  return `${h}:${m}`
})

export interface PartLine {
  key: string
  partId: string | null
  qty: number
}

export interface UploadedFile {
  id: string
  name: string
  size: number
}

export interface FormState {
  machineId: string | null
  priority: Priority | null
  title: string
  description: string
  category: FaultCategory | null
  skills: Skill[]
  skillsTouched: boolean
  parts: PartLine[]
  notSure: boolean
  timing: 'asap' | 'scheduled'
  date: string
  time: string | null
  contactName: string
  contactPhone: string
  files: UploadedFile[]
}

export const INITIAL_FORM: FormState = {
  machineId: null,
  priority: null,
  title: '',
  description: '',
  category: null,
  skills: [],
  skillsTouched: false,
  parts: [],
  notSure: false,
  timing: 'asap',
  date: '',
  time: null,
  contactName: '',
  contactPhone: '',
  files: [],
}

export const NEXT_REQUEST_ID = 'REQ-2048'

export function findMachine(id: string | null): Machine | undefined {
  return machines.find((machine) => machine.id === id)
}

export function findPart(id: string | null): Part | undefined {
  return parts.find((part) => part.id === id)
}

export function isValidPhone(value: string) {
  return /^\+?[\d\s()-]+$/.test(value) && value.replace(/\D/g, '').length >= 7
}

export type StockTone = 'ok' | 'low' | 'out'

export function stockTone(part: Part): StockTone {
  if (part.stock === 0) return 'out'
  return part.stock <= 2 ? 'low' : 'ok'
}

export function stockText(part: Part) {
  const tone = stockTone(part)
  if (tone === 'out') return 'Out of stock'
  if (tone === 'low') return `Low, ${part.stock} left`
  return `In stock ${part.stock}`
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function formatDate(iso: string) {
  const [, month, day] = iso.split('-').map(Number)
  return `${day} ${MONTHS[month - 1]}`
}

export function missingFields(form: FormState): string[] {
  const machine = findMachine(form.machineId)
  const missing: string[] = []
  if (!machine) missing.push('machine')
  else if (machine.openRequestId) missing.push('an eligible machine')
  if (!form.priority) missing.push('priority')
  if (!form.title.trim()) missing.push('title')
  if (form.skills.length === 0) missing.push('one skill')
  if (form.timing === 'scheduled' && (!form.date || !form.time)) missing.push('date and time')
  if (form.contactPhone && !isValidPhone(form.contactPhone)) missing.push('a valid phone')
  return missing
}

export type CheckStatus = 'idle' | 'ok' | 'caution' | 'warn'

export interface Check {
  status: CheckStatus
  message: string
  signature: string
}

export interface Checks {
  machine: Check
  site: Check
  skills: Check
  parts: Check
  routing: Check
  estimate: string
}

export function computeChecks(form: FormState): Checks {
  const machine = findMachine(form.machineId)

  const machineCheck: Check = !machine
    ? { status: 'idle', message: 'Select a machine', signature: 'none' }
    : machine.openRequestId
      ? { status: 'warn', message: `${machine.id} already has ${machine.openRequestId} open`, signature: machine.id }
      : { status: 'ok', message: `${machine.id} is eligible for service`, signature: machine.id }

  let siteCheck: Check = { status: 'idle', message: 'Select a machine first', signature: 'none' }
  if (machine) {
    const nearby = technicians.filter((t) => t.site === machine.site && t.available).length
    siteCheck =
      nearby === 0
        ? { status: 'caution', message: `${machine.site}, nobody nearby right now`, signature: machine.site }
        : {
            status: 'ok',
            message: `${machine.site}, ${nearby} technician${nearby === 1 ? '' : 's'} nearby`,
            signature: machine.site,
          }
  }

  let skillsCheck: Check = { status: 'idle', message: 'Pick the skills needed', signature: 'none' }
  if (form.skills.length > 0) {
    const label = form.skills.join(' + ')
    const matching = technicians.filter(
      (t) => t.available && form.skills.every((skill) => t.skills.includes(skill)),
    ).length
    skillsCheck =
      matching > 0
        ? {
            status: 'ok',
            message: `${matching} technician${matching === 1 ? ' has' : 's have'} ${label}`,
            signature: form.skills.join('|'),
          }
        : { status: 'warn', message: `Nobody free has ${label}`, signature: form.skills.join('|') }
  }

  const filled = form.parts.filter((line) => line.partId)
  const partsSignature = `${form.notSure}|${filled.map((line) => `${line.partId}:${line.qty}`).join('|')}`
  let partsCheck: Check
  if (form.notSure) {
    partsCheck = { status: 'ok', message: 'Technician will confirm parts on site', signature: partsSignature }
  } else if (filled.length === 0) {
    partsCheck = { status: 'idle', message: 'No parts requested', signature: partsSignature }
  } else {
    const issues = filled
      .map((line) => ({ part: findPart(line.partId)!, qty: line.qty }))
      .filter(({ part, qty }) => stockTone(part) !== 'ok' || qty > part.stock)
    if (issues.length === 0) {
      partsCheck = { status: 'ok', message: 'All parts in stock', signature: partsSignature }
    } else {
      const worst = issues.find(({ part }) => part.stock === 0) ?? issues[0]
      const more = issues.length > 1 ? ` (+${issues.length - 1} more)` : ''
      const message =
        worst.part.stock === 0
          ? `${worst.part.name} is out of stock, we'll flag it for approval${more}`
          : `${worst.part.name} low, we'll flag it for approval${more}`
      partsCheck = {
        status: worst.part.stock === 0 ? 'warn' : 'caution',
        message,
        signature: partsSignature,
      }
    }
  }

  const routingReady = Boolean(machine && !machine.openRequestId && form.priority)
  const routingCheck: Check = routingReady
    ? { status: 'ok', message: 'Goes to approval, then auto-assigns', signature: 'ready' }
    : { status: 'idle', message: 'Waiting on machine and priority', signature: 'waiting' }

  let estimate: string
  if (form.timing === 'scheduled') {
    estimate =
      form.date && form.time
        ? `Est. start: ${formatDate(form.date)}, ${form.time}`
        : 'Est. start: pick a date and time'
  } else {
    const priority = PRIORITIES.find((p) => p.value === form.priority)
    estimate = priority ? `Est. start: ${priority.eta}` : 'Est. start: pick a priority'
  }

  return {
    machine: machineCheck,
    site: siteCheck,
    skills: skillsCheck,
    parts: partsCheck,
    routing: routingCheck,
    estimate,
  }
}
