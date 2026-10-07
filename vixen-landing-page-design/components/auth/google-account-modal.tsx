'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, UserPlus, ArrowRight, ShieldCheck, Check } from 'lucide-react'
import { useAuth, DEMO_GOOGLE_ACCOUNTS } from '@/lib/auth-context'

function GoogleGIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  )
}

export function GoogleAccountModal() {
  const {
    isModalOpen,
    closeModal,
    selectAccount,
    modalRole,
    modalMode,
    isGoogleConfigured,
    isSupabaseConfigured,
  } = useAuth()

  const [showCustomForm, setShowCustomForm] = useState(false)
  const [customName, setCustomName] = useState('')
  const [customEmail, setCustomEmail] = useState('')

  if (!isModalOpen) return null

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customName.trim() || !customEmail.trim()) return

    const parts = customName.trim().split(' ')
    const firstName = parts[0]
    const lastName = parts.slice(1).join(' ')

    selectAccount({
      name: customName.trim(),
      firstName,
      lastName,
      email: customEmail.trim(),
      role: modalRole,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(customName.trim())}&backgroundColor=E8590C`,
    })
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
          className="fixed inset-0 bg-[#1A1A18]/40 backdrop-blur-[2px]"
          aria-hidden="true"
        />

        {/* Dialog Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="google-dialog-title"
          className="relative z-10 w-full max-w-[440px] rounded-[10px] border border-[#E4E0D6] bg-[#F7F5F0] p-6 shadow-xl sm:p-7"
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-[#E4E0D6]">
                <GoogleGIcon />
              </div>
              <div>
                <h2
                  id="google-dialog-title"
                  className="font-sans text-base font-semibold text-[#1A1A18]"
                >
                  Choose a Google account
                </h2>
                <p className="text-xs text-[#77756E]">
                  to {modalMode === 'signup' ? 'create an account on' : 'continue to'}{' '}
                  <span className="font-medium text-[#1A1A18]">ServiceSync</span>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={closeModal}
              className="rounded-full p-1 text-[#77756E] hover:bg-[#EFECE4] hover:text-[#1A1A18] transition-colors"
              aria-label="Close dialog"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="my-5 h-px bg-[#E4E0D6]" />

          {/* Account List */}
          {!showCustomForm ? (
            <div className="flex flex-col gap-1.5">
              <p className="px-1 font-mono text-[11px] uppercase tracking-wider text-[#77756E]">
                Select an account
              </p>
              {DEMO_GOOGLE_ACCOUNTS.map((account) => {
                const isSelectedRole = account.role === modalRole
                return (
                  <button
                    key={account.email}
                    type="button"
                    onClick={() =>
                      selectAccount({
                        ...account,
                        role: modalRole,
                      })
                    }
                    className="group flex w-full items-center justify-between rounded-[8px] p-2.5 text-left transition-colors duration-150 hover:bg-[#EFECE4]"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      {account.avatar ? (
                        <img
                          src={account.avatar}
                          alt={account.name}
                          className="size-9 shrink-0 rounded-full object-cover ring-1 ring-[#E4E0D6]"
                        />
                      ) : (
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#E8590C]/10 text-xs font-semibold text-[#E8590C]">
                          {account.firstName[0]}
                          {account.lastName[0]}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-[#1A1A18] group-hover:text-[#E8590C] transition-colors">
                          {account.name}
                        </p>
                        <p className="truncate text-xs text-[#77756E]">
                          {account.email}
                        </p>
                      </div>
                    </div>
                    <span className="ml-2 shrink-0 rounded border border-[#E4E0D6] bg-white px-1.5 py-0.5 font-mono text-[10px] text-[#77756E]">
                      {modalRole}
                    </span>
                  </button>
                )
              })}

              {/* Use custom account option */}
              <button
                type="button"
                onClick={() => setShowCustomForm(true)}
                className="mt-2 flex w-full items-center gap-3 rounded-[8px] border border-dashed border-[#D5D0C5] p-2.5 text-left text-sm text-[#1A1A18] transition-colors hover:border-[#1A1A18] hover:bg-[#EFECE4]"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-[#77756E] ring-1 ring-[#E4E0D6]">
                  <UserPlus className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1A1A18]">Use another Google account</p>
                  <p className="text-xs text-[#77756E]">Enter your own name and Gmail</p>
                </div>
              </button>
            </div>
          ) : (
            /* Custom account entry form */
            <form onSubmit={handleCustomSubmit} className="flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[11px] uppercase tracking-wider text-[#77756E]">
                  Enter Google credentials
                </p>
                <button
                  type="button"
                  onClick={() => setShowCustomForm(false)}
                  className="text-xs text-[#E8590C] hover:underline"
                >
                  Back to list
                </button>
              </div>

              <div>
                <label
                  htmlFor="custom-google-name"
                  className="block text-xs font-medium text-[#77756E]"
                >
                  Full Name
                </label>
                <input
                  id="custom-google-name"
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="mt-1 h-9 w-full rounded-[6px] border border-[#E4E0D6] bg-white px-3 text-sm text-[#1A1A18] outline-none transition-colors focus:border-[#E8590C]"
                />
              </div>

              <div>
                <label
                  htmlFor="custom-google-email"
                  className="block text-xs font-medium text-[#77756E]"
                >
                  Google Email
                </label>
                <input
                  id="custom-google-email"
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="mt-1 h-9 w-full rounded-[6px] border border-[#E4E0D6] bg-white px-3 text-sm text-[#1A1A18] outline-none transition-colors focus:border-[#E8590C]"
                />
              </div>

              <button
                type="submit"
                className="mt-2 flex h-9 w-full items-center justify-center gap-2 rounded-[6px] bg-[#E8590C] text-sm font-medium text-white transition-colors hover:bg-[#D14F08]"
              >
                Continue as {modalRole} <ArrowRight className="size-3.5" />
              </button>
            </form>
          )}

          {/* Dev info footer */}
          <div className="mt-5 rounded-[6px] border border-[#E4E0D6] bg-[#ECE8DE]/60 p-3 text-[11px] leading-relaxed text-[#77756E]">
            <div className="flex items-center gap-1.5 font-medium text-[#1A1A18]">
              <ShieldCheck className="size-3.5 text-[#E8590C]" />
              {isSupabaseConfigured
                ? 'Supabase Backend Connected'
                : isGoogleConfigured
                  ? 'Live Google OAuth is configured'
                  : 'Local Preview / Test Mode'}
            </div>
            <p className="mt-1">
              {isSupabaseConfigured
                ? 'Sign-ups and accounts are synchronized directly with your Supabase Postgres database.'
                : isGoogleConfigured
                  ? 'Your Google OAuth Client ID is active. Real accounts authenticate via Google Cloud.'
                  : 'To persist sign-ups to Supabase, set NEXT_PUBLIC_SUPABASE_URL and ANON_KEY in .env.local.'}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
