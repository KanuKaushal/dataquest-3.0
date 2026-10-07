export type Status = 'pending' | 'in_progress' | 'done' | 'overdue'
export type Priority = 'low' | 'medium' | 'high' | 'urgent'

export interface ServiceRequest {
  id: string
  machine: string
  equipment: string
  site: string
  priority: Priority
  status: Status
  technician: string | null
  updated: string
}

export interface AttentionItem {
  id: string
  text: string
  action: 'Reassign' | 'View'
  urgent?: boolean
}

export interface Job {
  id: string
  requestId: string
  machine: string
  equipment: string
  site: string
  fault: string
  priority: Priority
  status: Status
  minutesLeft: number
  completedAt?: string
}

export const userStats = { open: 9, inProgress: 6, completed: 143, overdue: 2 }

export const initialRequests: ServiceRequest[] = [
  { id: 'REQ-2047', machine: 'M-104', equipment: 'Pump', site: 'Site A', priority: 'urgent', status: 'in_progress', technician: 'Maya Okafor', updated: '12m ago' },
  { id: 'REQ-2046', machine: 'M-211', equipment: 'Compressor', site: 'Site B', priority: 'high', status: 'in_progress', technician: 'Tomas Reyes', updated: '40m ago' },
  { id: 'REQ-2045', machine: 'M-087', equipment: 'Conveyor', site: 'Site C', priority: 'medium', status: 'pending', technician: null, updated: '2h ago' },
  { id: 'REQ-2044', machine: 'M-132', equipment: 'Boiler', site: 'Site A', priority: 'urgent', status: 'overdue', technician: 'Lena Fischer', updated: '3h ago' },
  { id: 'REQ-2043', machine: 'M-309', equipment: 'Generator', site: 'Site B', priority: 'low', status: 'done', technician: 'Ravi Menon', updated: '5h ago' },
  { id: 'REQ-2042', machine: 'M-156', equipment: 'Pump', site: 'Site C', priority: 'medium', status: 'done', technician: 'Maya Okafor', updated: 'Yesterday' },
  { id: 'REQ-2041', machine: 'M-220', equipment: 'Compressor', site: 'Site A', priority: 'high', status: 'pending', technician: 'Tomas Reyes', updated: 'Yesterday' },
  { id: 'REQ-2040', machine: 'M-091', equipment: 'Conveyor', site: 'Site B', priority: 'medium', status: 'overdue', technician: null, updated: '2d ago' },
]

export const newRequestTemplates = [
  { machine: 'M-178', equipment: 'Generator', site: 'Site C', priority: 'high' as Priority },
  { machine: 'M-063', equipment: 'Boiler', site: 'Site B', priority: 'medium' as Priority },
  { machine: 'M-245', equipment: 'Pump', site: 'Site A', priority: 'low' as Priority },
]

export const attentionItems: AttentionItem[] = [
  { id: 'a1', text: 'M-104 pump runs out of SLA in 50 minutes.', action: 'View', urgent: true },
  { id: 'a2', text: 'Ravi dropped off the M-091 conveyor job. Nobody is on it.', action: 'Reassign' },
  { id: 'a3', text: 'Seal kit for the M-132 boiler is backordered until Friday.', action: 'View' },
]

export const initialJobs: Job[] = [
  { id: 'j1', requestId: 'REQ-2047', machine: 'M-104', equipment: 'Pump', site: 'Site A', fault: 'Bearing noise and vibration above limit on the discharge side.', priority: 'urgent', status: 'in_progress', minutesLeft: 45 },
  { id: 'j2', requestId: 'REQ-2046', machine: 'M-211', equipment: 'Compressor', site: 'Site B', fault: 'Will not hold pressure past 6 bar. Suspect the intake valve.', priority: 'high', status: 'pending', minutesLeft: 200 },
  { id: 'j3', requestId: 'REQ-2045', machine: 'M-087', equipment: 'Conveyor', site: 'Site C', fault: 'Belt drifts left after every restart.', priority: 'medium', status: 'pending', minutesLeft: 340 },
  { id: 'j4', requestId: 'REQ-2044', machine: 'M-132', equipment: 'Boiler', site: 'Site A', fault: 'Pilot light cuts out on cold starts.', priority: 'urgent', status: 'pending', minutesLeft: 25 },
  { id: 'j5', requestId: 'REQ-2041', machine: 'M-309', equipment: 'Generator', site: 'Site B', fault: 'Scheduled load test and oil check.', priority: 'low', status: 'pending', minutesLeft: 520 },
  { id: 'j6', requestId: 'REQ-2042', machine: 'M-156', equipment: 'Pump', site: 'Site C', fault: 'Mechanical seal replaced, leak test passed.', priority: 'medium', status: 'done', minutesLeft: 0, completedAt: '08:15' },
  { id: 'j7', requestId: 'REQ-2039', machine: 'M-220', equipment: 'Compressor', site: 'Site A', fault: 'Condensate trap drained, alarm cleared.', priority: 'low', status: 'done', minutesLeft: 0, completedAt: '09:40' },
]

export type Skill = 'Mechanical' | 'Electrical' | 'Hydraulic' | 'HVAC' | 'Welding' | 'PLC/Controls'

export interface Machine {
  id: string
  type: string
  site: string
  lastServiced: string
  underWarranty: boolean
  openRequestId?: string
}

export interface Part {
  id: string
  name: string
  stock: number
}

export interface Technician {
  name: string
  site: string
  skills: Skill[]
  available: boolean
}

export const machines: Machine[] = [
  { id: 'M-104', type: 'Pump', site: 'Site A', lastServiced: '14 Sep', underWarranty: true },
  { id: 'M-211', type: 'Compressor', site: 'Site B', lastServiced: '02 Aug', underWarranty: false },
  { id: 'M-087', type: 'Conveyor', site: 'Site C', lastServiced: '21 Jul', underWarranty: true, openRequestId: 'REQ-2045' },
  { id: 'M-132', type: 'Boiler', site: 'Site A', lastServiced: '30 Aug', underWarranty: false },
  { id: 'M-309', type: 'Generator', site: 'Site B', lastServiced: '09 Sep', underWarranty: true },
]

export const parts: Part[] = [
  { id: 'bearing-6205', name: 'Bearing 6205', stock: 4 },
  { id: 'seal-kit-sk14', name: 'Seal kit SK-14', stock: 1 },
  { id: 'intake-valve-iv22', name: 'Intake valve IV-22', stock: 0 },
  { id: 'drive-belt-b48', name: 'Drive belt B-48', stock: 12 },
  { id: 'contactor-c32', name: 'Contactor C-32', stock: 7 },
]

export const technicians: Technician[] = [
  { name: 'Maya Okafor', site: 'Site A', skills: ['Mechanical', 'Hydraulic'], available: true },
  { name: 'Lena Fischer', site: 'Site A', skills: ['Mechanical', 'Hydraulic', 'Welding'], available: true },
  { name: 'Priya Nair', site: 'Site A', skills: ['Electrical', 'PLC/Controls'], available: false },
  { name: 'Tomas Reyes', site: 'Site B', skills: ['Electrical', 'PLC/Controls', 'HVAC'], available: true },
  { name: 'Ravi Menon', site: 'Site B', skills: ['Mechanical', 'Hydraulic', 'Welding'], available: true },
  { name: 'Omar Haddad', site: 'Site B', skills: ['Mechanical', 'Hydraulic', 'HVAC'], available: false },
  { name: 'Sofia Lindqvist', site: 'Site C', skills: ['Electrical', 'HVAC'], available: true },
  { name: 'Jonas Weber', site: 'Site C', skills: ['Mechanical', 'PLC/Controls'], available: false },
]
