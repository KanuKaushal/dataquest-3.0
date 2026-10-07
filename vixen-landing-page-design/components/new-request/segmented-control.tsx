'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface SegmentOption<T extends string> {
  value: T
  label: string
  accent?: boolean
}

interface SegmentedControlProps<T extends string> {
  label: string
  options: SegmentOption<T>[]
  value: T | null
  onChange: (value: T) => void
  layoutId: string
}

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  layoutId,
}: SegmentedControlProps<T>) {
  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>, index: number) {
    const forward = event.key === 'ArrowRight' || event.key === 'ArrowDown'
    const backward = event.key === 'ArrowLeft' || event.key === 'ArrowUp'
    if (!forward && !backward) return
    event.preventDefault()
    const next = (index + (forward ? 1 : -1) + options.length) % options.length
    onChange(options[next].value)
    const radios = event.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]')
    radios[next]?.focus()
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="grid w-full grid-cols-4 gap-1 rounded-md border p-1 sm:w-fit"
    >
      {options.map((option, index) => {
        const isSelected = value === option.value
        const isTabStop = isSelected || (value === null && index === 0)
        return (
          <motion.button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={isTabStop ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => handleKeyDown(event as unknown as React.KeyboardEvent<HTMLDivElement>, index)}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={cn(
              'relative h-8 px-4 text-[13px] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:min-w-[84px]',
              option.accent ? 'text-accent' : isSelected ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
              isSelected && 'font-medium',
            )}
          >
            {isSelected && (
              <motion.span
                layoutId={layoutId}
                aria-hidden
                initial={false}
                animate={{ borderColor: option.accent ? '#e8590c' : '#1a1a18' }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="absolute inset-0 rounded-[4px] border bg-hover"
              />
            )}
            <span className="relative">{option.label}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
