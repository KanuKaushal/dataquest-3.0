import type { Metadata } from 'next'
import { SignInCard } from '@/components/sign-in/sign-in-card'

export const metadata: Metadata = {
  title: 'Sign in — ServiceSync',
  description: 'Access multi-site service requests and operational tracking for industrial equipment.',
}

export default function SignInPage() {
  return <SignInCard />
}
