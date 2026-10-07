'use client'

import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { useState } from 'react'
import type { Role } from '@/components/sidebar'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

interface Profile {
  firstName: string
  initials: string
  searchLabel: string
}

export const PROFILES: Record<Role, Profile> = {
  user: { firstName: 'Arjun', initials: 'AK', searchLabel: 'Search requests' },
  technician: { firstName: 'Maya', initials: 'MO', searchLabel: 'Search jobs' },
}

const AVAILABILITY = [
  { key: 'available', label: 'Available', dot: 'bg-done' },
  { key: 'on_a_job', label: 'On a job', dot: 'bg-progress' },
  { key: 'off_duty', label: 'Off duty', dot: 'bg-muted-foreground' },
] as const

function AvailabilityToggle() {
  const [current, setCurrent] = useState<string>('on_a_job')

  return (
    <div role="radiogroup" aria-label="Your status" className="flex items-center gap-4">
      {AVAILABILITY.map(({ key, label, dot }) => {
        const isActive = current === key
        return (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => setCurrent(key)}
            className={cn(
              'relative flex items-center gap-1.5 py-1 text-[13px] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
              isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <span aria-hidden className={cn('size-1.5 rounded-full', dot)} />
            {label}
            {isActive && (
              <motion.span
                layoutId="availability-underline"
                className="absolute inset-x-0 -bottom-px h-px bg-foreground"
                transition={{ duration: 0.25, ease: 'easeOut' }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}

function SearchField({ label }: { label: string }) {
  return (
    <label className="group relative flex w-full items-center gap-2 pb-1.5 sm:w-52">
      <Search className="size-3.5 text-muted-foreground" strokeWidth={1.5} aria-hidden />
      <input
        type="search"
        placeholder={label}
        aria-label={label}
        className="w-full bg-transparent text-[13px] outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
      />
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-border" />
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px origin-center scale-x-0 bg-foreground transition-transform duration-300 ease-out group-focus-within:scale-x-100"
      />
    </label>
  )
}

export function Topbar({ role }: { role: Role }) {
  const { user } = useAuth()
  const defaultProfile = PROFILES[role]

  // Use authenticated user profile if role matches or present
  const isCurrentUser = user && user.role === role
  const firstName = isCurrentUser ? user.firstName : defaultProfile.firstName
  const searchLabel = defaultProfile.searchLabel
  const avatar = isCurrentUser ? user.avatar : undefined
  const initials = isCurrentUser
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || user.name.slice(0, 2).toUpperCase()
    : defaultProfile.initials

  return (
    <header className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
      <h1 className="font-serif text-[30px] leading-tight sm:text-[36px]">
        Tuesday, 7 October. Hi {firstName}.
      </h1>
      <div className="flex w-full flex-wrap items-center justify-between gap-x-8 gap-y-4 sm:w-auto sm:justify-end">
        {role === 'technician' && <AvailabilityToggle />}
        <div className="flex w-full items-center gap-5 sm:w-auto">
          <SearchField label={searchLabel} />
          {avatar ? (
            <img
              src={avatar}
              alt={firstName}
              title={user?.email ? `${user.name} (${user.email})` : firstName}
              className="size-8 shrink-0 rounded-full border border-border object-cover ring-1 ring-border"
            />
          ) : (
            <span
              aria-label={`Signed in as ${firstName}`}
              title={user?.email ? `${user.name} (${user.email})` : firstName}
              className="flex size-8 shrink-0 items-center justify-center rounded-full border bg-hover text-[11px] font-medium"
            >
              {initials}
            </span>
          )}
        </div>
      </div>
    </header>
  )
}
