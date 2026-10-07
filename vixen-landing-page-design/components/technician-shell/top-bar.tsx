'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { useMotionPrefs } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { PAGE_META } from './nav-items'
import { useShell } from './shell-context'

const AVAILABILITY = [
  { id: 'available', label: 'Available', dot: 'bg-done' },
  { id: 'on-a-job', label: 'On a job', dot: 'bg-progress' },
  { id: 'off-duty', label: 'Off duty', dot: 'bg-pending' },
] as const

type AvailabilityId = (typeof AVAILABILITY)[number]['id']

export function TopBar({ greetingOverride }: { greetingOverride: string | null }) {
  const pathname = usePathname()
  const meta = PAGE_META[pathname] ?? PAGE_META['/technician/dashboard']

  return (
    <header className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6 pt-8 pb-10 md:pt-10">
      <h1 className="font-serif text-[32px] leading-[1.1] md:text-[38px]">
        {greetingOverride ?? meta.greeting}
      </h1>
      <div className="flex w-full items-end gap-6 md:w-auto">
        <AvailabilityToggle />
        <SearchField placeholder={meta.searchPlaceholder} />
        <div
          aria-label="Maya, technician"
          className="ml-auto flex size-9 shrink-0 items-center justify-center rounded-full border bg-muted font-mono text-[12px] md:ml-0"
        >
          MO
        </div>
      </div>
    </header>
  )
}

function AvailabilityToggle() {
  const [current, setCurrent] = useState<AvailabilityId>('on-a-job')
  const { transition } = useMotionPrefs()

  return (
    <div role="radiogroup" aria-label="Availability" className="flex items-center gap-5">
      {AVAILABILITY.map((option) => {
        const active = option.id === current
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setCurrent(option.id)}
            className={cn(
              'relative flex items-center gap-1.5 pb-2 text-[13px] whitespace-nowrap transition-colors duration-150',
              active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <span aria-hidden className={cn('size-1.5 rounded-full', option.dot)} />
            {option.label}
            {active && (
              <motion.span
                layoutId="status-underline"
                transition={transition(0.25)}
                className="absolute inset-x-0 bottom-0 h-px bg-foreground"
              />
            )}
          </button>
        )
      })}
    </div>
  )
}

function SearchField({ placeholder }: { placeholder: string }) {
  const { query, setQuery } = useShell()

  return (
    <label className="group relative flex min-w-0 flex-1 items-center gap-2 pb-2 md:w-[190px] md:flex-none">
      <Search className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.5} aria-hidden />
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full min-w-0 bg-transparent text-[13px] outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
      />
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-border" />
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[2px] origin-center scale-x-0 bg-primary transition-transform duration-300 ease-out group-focus-within:scale-x-100"
      />
    </label>
  )
}
