'use client'

import { Check, Eye, EyeOff } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useId, useState, type ComponentProps } from 'react'

interface TextFieldProps
  extends Omit<ComponentProps<'input'>, 'onChange' | 'value'> {
  label: string
  value: string
  onValueChange: (value: string) => void
  error?: string
  valid?: boolean
}

export function TextField({
  label,
  value,
  onValueChange,
  error,
  valid,
  type = 'text',
  ...props
}: TextFieldProps) {
  const id = useId()
  const errorId = `${id}-error`
  const [revealed, setRevealed] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground"
        >
          {label}
        </label>
        <AnimatePresence>
          {valid && !error && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="text-primary"
            >
              <Check className="size-3.5" aria-hidden="true" />
              <span className="sr-only">looks good</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="relative">
        <input
          id={id}
          type={isPassword && revealed ? 'text' : type}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`h-11 w-full rounded-md border bg-transparent px-3 text-[15px] text-foreground outline-none transition-[border-color,box-shadow] duration-200 ease-out placeholder:text-muted-foreground/70 hover:border-foreground/40 focus:border-foreground focus:ring-2 focus:ring-primary/30 ${
            error ? 'border-primary' : 'border-border'
          } ${isPassword ? 'pr-11' : ''}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((current) => !current)}
            aria-label={revealed ? 'Hide password' : 'Show password'}
            aria-pressed={revealed}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-md text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:text-foreground"
          >
            {revealed ? (
              <EyeOff className="size-4" aria-hidden="true" />
            ) : (
              <Eye className="size-4" aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={errorId}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="flex items-center gap-2 font-mono text-xs text-foreground"
          >
            <span
              aria-hidden="true"
              className="size-1.5 shrink-0 rounded-full bg-primary"
            />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
