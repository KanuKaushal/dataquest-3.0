'use client'

import { MotionConfig, motion } from 'framer-motion'
import Link from 'next/link'
import { useCallback, useState, type FormEvent } from 'react'
import { GoogleButton } from './google-button'
import { TextField } from './text-field'
import { Toast } from './toast'

type FieldName = 'name' | 'company' | 'email' | 'password'
type Values = Record<FieldName, string>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const validators: Record<FieldName, (value: string) => string | undefined> = {
  name: (value) => (value.trim() ? undefined : 'enter your full name'),
  company: (value) => (value.trim() ? undefined : 'enter a company or site name'),
  email: (value) =>
    EMAIL_PATTERN.test(value.trim()) ? undefined : 'enter a valid work email',
  password: (value) =>
    value.length >= 8 ? undefined : 'use at least 8 characters',
}

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
} as const

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
} as const

export function SignUpScreen() {
  const [values, setValues] = useState<Values>({
    name: '',
    company: '',
    email: '',
    password: '',
  })
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({})
  const [toast, setToast] = useState<string | null>(null)
  const dismissToast = useCallback(() => setToast(null), [])

  const errorFor = (field: FieldName) =>
    touched[field] ? validators[field](values[field]) : undefined

  const bind = (field: FieldName) => ({
    value: values[field],
    onValueChange: (value: string) =>
      setValues((current) => ({ ...current, [field]: value })),
    onBlur: () => setTouched((current) => ({ ...current, [field]: true })),
    error: errorFor(field),
    valid: Boolean(touched[field]) && !validators[field](values[field]),
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setTouched({ name: true, company: true, email: true, password: true })
    const hasErrors = (Object.keys(validators) as FieldName[]).some((field) =>
      validators[field](values[field]),
    )
    if (!hasErrors) setToast('Account created successfully')
  }

  return (
    <MotionConfig reducedMotion="user">
      <main className="flex min-h-svh justify-center px-5 py-10 sm:items-center sm:py-16">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="w-full max-w-[480px]"
        >
          <motion.p
            variants={fadeUp}
            className="font-serif text-2xl text-foreground"
          >
            ServiceSync
          </motion.p>

          <motion.header variants={fadeUp} className="mt-12 flex flex-col gap-3">
            <h1 className="font-serif text-4xl leading-[1.1] text-foreground sm:text-5xl">
              Create a user account.
            </h1>
            <p className="text-[15px] text-muted-foreground">
              Access multi-site service requests and real-time tracking.
            </p>
          </motion.header>

          <motion.div variants={fadeUp} className="mt-10">
            <GoogleButton
              onClick={() => setToast('Continuing with Google')}
            />
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="my-8 flex items-center gap-4"
            role="separator"
          >
            <span aria-hidden="true" className="h-px flex-1 bg-border" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              or continue with email
            </span>
            <span aria-hidden="true" className="h-px flex-1 bg-border" />
          </motion.div>

          <motion.form
            variants={fadeUp}
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-5"
          >
            <TextField
              label="Full name"
              autoComplete="name"
              placeholder="Jordan Alvarez"
              {...bind('name')}
            />
            <TextField
              label="Company / site name"
              autoComplete="organization"
              placeholder="Site A"
              {...bind('company')}
            />
            <TextField
              label="Work email"
              type="email"
              autoComplete="email"
              placeholder="jordan@company.com"
              {...bind('email')}
            />
            <TextField
              label="Password"
              type="password"
              autoComplete="new-password"
              placeholder="8 characters or more"
              {...bind('password')}
            />

            <motion.button
              type="submit"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97, y: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="mt-3 h-11 w-full rounded-md bg-primary text-[15px] font-medium text-primary-foreground outline-none transition-colors duration-200 hover:bg-[#CF4E08] focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Create account
            </motion.button>
          </motion.form>

          <motion.p
            variants={fadeUp}
            className="mt-8 text-sm text-muted-foreground"
          >
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-foreground underline underline-offset-4 outline-none transition-colors hover:text-primary focus-visible:text-primary"
            >
              Sign in.
            </Link>
          </motion.p>
        </motion.div>
      </main>
      <Toast message={toast} onDismiss={dismissToast} />
    </MotionConfig>
  )
}
