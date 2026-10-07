import type { Metadata } from 'next'
import { SignUpScreen } from '@/components/signup/signup-screen'

export const metadata: Metadata = {
  title: 'Sign up — ServiceSync',
  description: 'Create your ServiceSync account to raise and track equipment service requests.',
}

export default function SignUpPage() {
  return <SignUpScreen />
}
