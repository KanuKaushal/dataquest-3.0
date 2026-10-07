'use client'

import { motion } from 'framer-motion'

export const SKILLS = [
  'pumps',
  'compressors',
  'conveyors',
  'boilers',
  'generators',
  'valves',
  'motors',
  'gearboxes',
] as const

type SkillPickerProps = {
  selected: string[]
  error?: string
  onToggle: (skill: string) => void
}

export function SkillPicker({ selected, error, onToggle }: SkillPickerProps) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="mb-1.5 text-[13px] font-medium text-foreground">
        Skills / specializations
      </legend>
      <div className="flex flex-wrap gap-2">
        {SKILLS.map((skill) => {
          const active = selected.includes(skill)
          return (
            <motion.button
              key={skill}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(skill)}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className={`h-8 rounded-md border px-3 text-[13px] transition-colors duration-200 ease-out focus-visible:border-primary focus-visible:outline-none ${
                active
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-transparent text-foreground hover:border-foreground/40'
              }`}
            >
              {skill}
            </motion.button>
          )
        })}
      </div>
      {error ? (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : (
        <p className="font-mono text-[11px] text-muted-foreground">
          {selected.length} selected
        </p>
      )}
    </fieldset>
  )
}
