import type { Metadata } from 'next'
import { NewRequestPage } from '@/components/new-request/new-request-page'

export const metadata: Metadata = {
  title: 'New service request',
}

export default function Page() {
  return <NewRequestPage />
}
