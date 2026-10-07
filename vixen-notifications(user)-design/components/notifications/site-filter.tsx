'use client'

import { Check, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { SITE_OPTIONS, type SiteFilterValue } from '@/lib/notifications'
import { cn } from '@/lib/utils'

interface SiteFilterProps {
  value: SiteFilterValue
  onChange: (value: SiteFilterValue) => void
}

export function SiteFilter({ value, onChange }: SiteFilterProps) {
  const [open, setOpen] = useState(false)
  const current = SITE_OPTIONS.find((option) => option.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Filter by site"
          className="flex h-8 shrink-0 items-center gap-1.5 rounded-md px-2 text-[13px] text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent data-[state=open]:text-foreground"
        >
          {current?.label}
          <ChevronDown
            aria-hidden
            strokeWidth={1.5}
            className={cn('size-3.5 transition-transform duration-200 ease-out', open && 'rotate-180')}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" role="listbox" aria-label="Site" className="w-36 p-1">
        {SITE_OPTIONS.map((option) => {
          const isSelected = option.value === value
          return (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={isSelected}
              onClick={() => {
                onChange(option.value)
                setOpen(false)
              }}
              className="flex h-8 w-full items-center justify-between rounded-md px-2.5 text-[13px] transition-colors duration-150 hover:bg-hover focus-visible:bg-hover focus-visible:outline-none"
            >
              {option.label}
              {isSelected && <Check aria-hidden strokeWidth={1.5} className="size-3.5" />}
            </button>
          )
        })}
      </PopoverContent>
    </Popover>
  )
}
