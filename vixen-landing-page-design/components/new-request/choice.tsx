'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChoiceProps {
  type: 'radio' | 'checkbox'
  name?: string
  checked: boolean
  onChange: () => void
  children: React.ReactNode
}

export function Choice({ type, name, checked, onChange, children }: ChoiceProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-[13px]">
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={cn(
          'flex size-4 shrink-0 items-center justify-center border transition-colors duration-150 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent',
          type === 'radio' ? 'rounded-full' : 'rounded-[4px]',
          checked ? 'border-foreground' : 'border-muted-foreground/60',
        )}
      >
        <motion.span
          initial={false}
          animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="flex"
        >
          {type === 'radio' ? (
            <span className="size-2 rounded-full bg-foreground" />
          ) : (
            <Check className="size-3" strokeWidth={2.5} />
          )}
        </motion.span>
      </span>
      {children}
    </label>
  )
}
