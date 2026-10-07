'use client'

import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMotionPrefs } from '@/lib/motion'
import type { ViewMode } from '@/lib/schedule/types'
import { cn } from '@/lib/utils'

const VIEWS: { id: ViewMode; label: string }[] = [
  { id: 'day', label: 'Day' },
  { id: 'week', label: 'Week' },
]

const quietButton = 'transition-[background-color,transform] active:translate-y-0 active:scale-[0.97]'

interface WeekHeaderProps {
  rangeLabel: string
  isCurrentWeek: boolean
  view: ViewMode
  onShiftWeek: (delta: number) => void
  onThisWeek: () => void
  onViewChange: (view: ViewMode) => void
}

export function WeekHeader({
  rangeLabel,
  isCurrentWeek,
  view,
  onShiftWeek,
  onThisWeek,
  onViewChange,
}: WeekHeaderProps) {
  const { transition } = useMotionPrefs()

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
      <div className="flex items-center gap-1">
        <span className="mr-3 font-mono text-[13px]" aria-live="polite">
          {rangeLabel}
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Previous week"
          className={quietButton}
          onClick={() => onShiftWeek(-1)}
        >
          <ChevronLeft strokeWidth={1.5} />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Next week"
          className={quietButton}
          onClick={() => onShiftWeek(1)}
        >
          <ChevronRight strokeWidth={1.5} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled={isCurrentWeek}
          className={cn(quietButton, 'ml-1 text-[13px]')}
          onClick={onThisWeek}
        >
          This week
        </Button>
      </div>

      <div role="tablist" aria-label="Schedule view" className="flex items-center gap-5">
        {VIEWS.map((option) => {
          const active = option.id === view
          return (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onViewChange(option.id)}
              className={cn(
                'relative pb-1.5 text-[13px] transition-colors duration-150',
                active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {option.label}
              {active && (
                <motion.span
                  layoutId="view-underline"
                  transition={transition(0.25)}
                  className="absolute inset-x-0 bottom-0 h-px bg-foreground"
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
