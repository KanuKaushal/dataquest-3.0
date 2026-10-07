export type Role = 'user' | 'technician'

export const ROLES: {
  value: Role
  label: string
  destination: string
  identifierLabel: string
  identifierPlaceholder: string
  identifierType: 'email' | 'text'
}[] = [
  {
    value: 'user',
    label: 'User',
    destination: '/user/dashboard',
    identifierLabel: 'Work email',
    identifierPlaceholder: 'name@company.com',
    identifierType: 'email',
  },
  {
    value: 'technician',
    label: 'Technician',
    destination: '/technician/dashboard',
    identifierLabel: 'Technician ID',
    identifierPlaceholder: 'TECH-0000',
    identifierType: 'text',
  },
]
