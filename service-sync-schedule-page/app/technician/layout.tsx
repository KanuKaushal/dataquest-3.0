import { TechnicianShell } from '@/components/technician/technician-shell'

export default function TechnicianLayout({ children }: { children: React.ReactNode }) {
  return <TechnicianShell>{children}</TechnicianShell>
}
