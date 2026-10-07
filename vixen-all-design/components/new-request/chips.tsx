'use client'

import { AnimatePresence, motion, type HTMLMotionProps } from 'framer-motion'
import { Check } from 'lucide-react'
import { FAULT_CATEGORIES, SKILLS, type FaultCategory } from '@/lib/new-request'
import type { Skill } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface ChipButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  selected: boolean
  withCheck?: boolean
  children: React.ReactNode
}

export function ChipButton({ selected, withCheck, children, className, ...props }: ChipButtonProps) {
  return (
    <motion.button
      type="button"
      aria-pressed={selected}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={cn(
        'inline-flex h-8 items-center rounded-md border px-3 text-[13px] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        selected
          ? 'border-foreground bg-hover text-foreground'
          : 'text-muted-foreground hover:bg-hover hover:text-foreground',
        className,
      )}
      {...props}
    >
      {withCheck && (
        <AnimatePresence initial={false}>
          {selected && (
            <motion.span
              aria-hidden
              initial={{ opacity: 0, width: 0, marginRight: 0 }}
              animate={{ opacity: 1, width: 14, marginRight: 6 }}
              exit={{ opacity: 0, width: 0, marginRight: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="flex overflow-hidden"
            >
              <Check className="size-3.5 shrink-0" strokeWidth={2} />
            </motion.span>
          )}
        </AnimatePresence>
      )}
      {children}
    </motion.button>
  )
}

interface SkillChipsProps {
  value: Skill[]
  onToggle: (skill: Skill) => void
  suggestedFrom: FaultCategory | null
}

export function SkillChips({ value, onToggle, suggestedFrom }: SkillChipsProps) {
  return (
    <div>
      <div role="group" aria-label="Skills needed" className="flex flex-wrap gap-2">
        {SKILLS.map((skill) => (
          <ChipButton
            key={skill}
            withCheck
            selected={value.includes(skill)}
            onClick={() => onToggle(skill)}
          >
            {skill}
          </ChipButton>
        ))}
      </div>
      <div className="mt-3 h-4">
        <AnimatePresence initial={false}>
          {suggestedFrom && (
            <motion.p
              key={suggestedFrom}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="font-mono text-xs text-muted-foreground"
            >
              Suggested from {suggestedFrom}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

interface CategoryTagsProps {
  value: FaultCategory | null
  onChange: (category: FaultCategory | null) => void
}

export function CategoryTags({ value, onChange }: CategoryTagsProps) {
  return (
    <div role="group" aria-label="Fault category" className="flex flex-wrap gap-2">
      {FAULT_CATEGORIES.map((category) => (
        <ChipButton
          key={category}
          selected={value === category}
          onClick={() => onChange(value === category ? null : category)}
        >
          {category}
        </ChipButton>
      ))}
    </div>
  )
}
