'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

const ALERTS = [
  { id: 'assignments', label: 'New assignments' },
  { id: 'sla', label: 'SLA warnings' },
  { id: 'parts', label: 'Part updates' },
  { id: 'schedule', label: 'Schedule changes' },
] as const

type AlertId = (typeof ALERTS)[number]['id']

export function AlertSettings() {
  const [enabled, setEnabled] = useState<Record<AlertId, boolean>>({
    assignments: true,
    sla: true,
    parts: true,
    schedule: true,
  })

  return (
    <section aria-labelledby="alerts-heading">
      <h2 id="alerts-heading" className="text-[13px] font-medium">
        Alert me about
      </h2>
      <ul className="mt-4 flex flex-col">
        {ALERTS.map(({ id, label }) => (
          <li key={id} className="flex items-center justify-between gap-4 border-t py-3 first:border-t-0 first:pt-0">
            <span id={`alert-${id}`} className="text-[14px]">
              {label}
            </span>
            <Toggle
              labelledBy={`alert-${id}`}
              checked={enabled[id]}
              onChange={(next) => setEnabled((current) => ({ ...current, [id]: next }))}
            />
          </li>
        ))}
      </ul>
      <p className="mt-4 font-mono text-[12px] text-muted-foreground">Alerts also go to your phone.</p>
    </section>
  )
}

function Toggle({
  checked,
  labelledBy,
  onChange,
}: {
  checked: boolean
  labelledBy: string
  onChange: (next: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-[18px] w-8 shrink-0 rounded-full border transition-colors duration-150 motion-reduce:transition-none',
        checked ? 'border-foreground bg-foreground' : 'bg-transparent',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'absolute top-px left-px size-3 rounded-full transition-[translate,background-color] duration-150 motion-reduce:transition-none',
          checked ? 'translate-x-[14px] bg-background' : 'translate-x-0 bg-muted-foreground',
        )}
      />
    </button>
  )
}
