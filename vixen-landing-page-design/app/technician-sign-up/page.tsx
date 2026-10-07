import type { Metadata } from 'next'
import { SignupForm } from '@/components/technician-signup/signup-form'

export const metadata: Metadata = {
  title: 'Technician sign up — ServiceSync',
  description: 'Register as a ServiceSync field technician.',
}

export default function TechnicianSignUpPage() {
  return (
    <main className="flex min-h-screen items-start justify-center px-4 py-10 sm:items-center sm:py-16">
      <SignupForm />
    </main>
  )
}
