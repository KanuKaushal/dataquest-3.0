'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MotionConfig, motion } from 'framer-motion'
import { GoogleButton } from './google-button'
import { RoleSwitcher } from './role-switcher'
import { ROLES, type Role } from './roles'
import { TextField } from './text-field'
import { Toast } from './toast'

const REDIRECT_DELAY_MS = 900

const fadeUp = (index: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: 'easeOut' as const, delay: index * 0.06 },
})

export function SignInCard() {
  const router = useRouter()
  const [role, setRole] = useState<Role>('user')
  const [toast, setToast] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const current = ROLES.find((r) => r.value === role) ?? ROLES[0]

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  function signIn() {
    if (timer.current) return
    setToast('Signed in successfully')
    timer.current = setTimeout(() => router.push(current.destination), REDIRECT_DELAY_MS)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    signIn()
  }

  return (
    <MotionConfig reducedMotion="user">
      <main className="flex min-h-dvh items-center justify-center px-4 py-10">
        <div className="w-full max-w-[480px] rounded-[6px] border border-[#E4E0D6] p-6 sm:p-10">
          <motion.header {...fadeUp(0)} className="flex flex-col gap-6">
            <span className="font-serif text-xl">ServiceSync</span>
            <div className="flex flex-col gap-2">
              <h1 className="font-serif text-5xl leading-none tracking-tight">Sign in.</h1>
              <p className="text-sm text-[#77756E]">
                Access multi-site service requests and operational tracking.
              </p>
            </div>
          </motion.header>

          <motion.div {...fadeUp(1)} className="mt-8 flex flex-col gap-3">
            <RoleSwitcher value={role} onChange={setRole} />
            <GoogleButton onClick={signIn} />
          </motion.div>

          <motion.div {...fadeUp(2)} className="my-6 flex items-center gap-3" aria-hidden="true">
            <span className="h-px flex-1 bg-[#E4E0D6]" />
            <span className="font-mono text-xs text-[#77756E]">or continue with email</span>
            <span className="h-px flex-1 bg-[#E4E0D6]" />
          </motion.div>

          <motion.form {...fadeUp(3)} onSubmit={handleSubmit} className="flex flex-col gap-4">
            <TextField
              key={role}
              id="identifier"
              name="identifier"
              label={current.identifierLabel}
              type={current.identifierType}
              placeholder={current.identifierPlaceholder}
              mono={role === 'technician'}
              autoComplete={role === 'user' ? 'email' : 'username'}
              required
            />
            <TextField
              id="password"
              name="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              required
            />
            <motion.button
              type="submit"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="mt-2 h-11 w-full rounded-[6px] bg-[#E8590C] text-sm font-medium text-[#F7F5F0] outline-none transition-colors duration-200 hover:bg-[#D14F08] focus-visible:ring-2 focus-visible:ring-[#E8590C]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F5F0]"
            >
              Sign in
            </motion.button>
          </motion.form>

          <motion.footer
            {...fadeUp(4)}
            className="mt-6 flex items-center justify-between gap-4 text-sm text-[#77756E]"
          >
            <Link href="#" className="underline-offset-4 transition-colors hover:text-[#1A1A18] hover:underline">
              Forgot password?
            </Link>
            <span>
              Need an account?{' '}
              <Link href="#" className="text-[#1A1A18] underline-offset-4 hover:underline">
                Sign up.
              </Link>
            </span>
          </motion.footer>
        </div>
        <Toast message={toast} />
      </main>
    </MotionConfig>
  )
}
