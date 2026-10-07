'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useId } from 'react'
import { cn } from '@/lib/utils'

export function Underline({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('group relative', className)}>
      {children}
      <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-border" />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-center scale-x-0 bg-accent transition-transform duration-300 ease-out group-focus-within:scale-x-100 group-has-[[data-state=open]]:scale-x-100"
      />
    </div>
  )
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.p
          id={id}
          key="error"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="overflow-hidden text-xs text-accent"
        >
          <span className="block pt-1.5">{message}</span>
        </motion.p>
      )}
    </AnimatePresence>
  )
}

const inputClass =
  'w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70'

interface TextFieldProps extends React.ComponentProps<'input'> {
  label: string
  error?: string
}

export function TextField({ label, error, className, ...props }: TextFieldProps) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs text-muted-foreground">
        {label}
      </label>
      <Underline>
        <input
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(inputClass, 'h-10', className)}
          {...props}
        />
      </Underline>
      <FieldError id={errorId} message={error} />
    </div>
  )
}

interface TextAreaFieldProps extends Omit<React.ComponentProps<'textarea'>, 'value'> {
  label: string
  value: string
  maxLength: number
}

export function TextAreaField({ label, value, maxLength, className, ...props }: TextAreaFieldProps) {
  const id = useId()

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs text-muted-foreground">
        {label}
      </label>
      <Underline>
        <textarea
          id={id}
          rows={4}
          value={value}
          maxLength={maxLength}
          className={cn(inputClass, 'resize-none py-2.5 leading-relaxed', className)}
          {...props}
        />
      </Underline>
      <p className="mt-1.5 text-right font-mono text-xs text-muted-foreground/80">
        {value.length}/{maxLength}
      </p>
    </div>
  )
}
