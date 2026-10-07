export type Status = 'done' | 'progress' | 'urgent' | 'pending'

export type PreviewRequest = {
  id: string
  machine: string
  machineId: string
  site: string
  priority: 'urgent' | 'high' | 'normal'
  status: Status
  age: string
}

export const previewRequests: PreviewRequest[] = [
  {
    id: 'REQ-2041',
    machine: 'Hydraulic press',
    machineId: 'M-104',
    site: 'Site A',
    priority: 'urgent',
    status: 'progress',
    age: '2h ago',
  },
  {
    id: 'REQ-2039',
    machine: 'Compressor',
    machineId: 'K-210',
    site: 'Site B',
    priority: 'normal',
    status: 'done',
    age: '5h ago',
  },
  {
    id: 'REQ-2036',
    machine: 'Conveyor',
    machineId: 'C-045',
    site: 'Site C',
    priority: 'high',
    status: 'pending',
    age: '1d ago',
  },
  {
    id: 'REQ-2034',
    machine: 'Boiler',
    machineId: 'B-017',
    site: 'Site B',
    priority: 'normal',
    status: 'progress',
    age: '1d ago',
  },
]

export const stats = [
  { value: 1, suffix: '', label: 'place for every request' },
  { value: 0, suffix: '', label: 'spreadsheets to chase' },
  { value: 3, suffix: '', label: 'exception types caught automatically' },
  { value: 100, suffix: '%', label: 'of jobs with a service log' },
]

export const problemItems = [
  { tag: 'chat', line: 'the request starts here' },
  { tag: 'sheet', line: 'the schedule lives here' },
  { tag: 'phone', line: 'the photos are here' },
  { tag: 'inbox', line: 'the approval is here' },
  { tag: 'memory', line: 'the history is here' },
]

export const steps = [
  {
    number: '01',
    title: 'Raise the request',
    description: 'Pick the machine, site and priority. Attach photos if you have them.',
    tag: 'customer',
  },
  {
    number: '02',
    title: 'Check and approve',
    description:
      'The system validates machine eligibility, required skills and spare part availability before it goes for approval.',
    tag: 'auto',
  },
  {
    number: '03',
    title: 'Assign and reserve',
    description:
      'A qualified, available technician near the site is assigned and the parts are reserved. The timeline updates for everyone.',
    tag: 'ops',
  },
  {
    number: '04',
    title: 'Do the work, log it',
    description:
      'The technician starts the job, logs progress and uploads the service report and photos.',
    tag: 'technician',
  },
  {
    number: '05',
    title: 'Verify and close',
    description: "Completion is verified and the record is added to the machine's history.",
    tag: 'system',
  },
]

export const customerPoints = [
  'track every request',
  'see who is assigned',
  'spot delays early',
  'full machine history',
]

export const technicianPoints = [
  "today's jobs in order",
  'SLA countdown on every job',
  'start and complete in one tap',
  'task log and photos per job',
]

export const extensions = [
  'mobile',
  'IoT',
  'AI and ML',
  'real-time',
  'maps',
  'analytics',
  'blockchain',
  'cloud',
]

export const navLinks = [
  { label: 'How it works', href: '#how' },
  { label: 'Exceptions', href: '#exceptions' },
  { label: 'Roles', href: '#roles' },
]
