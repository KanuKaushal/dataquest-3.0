import type { ReactNode } from 'react'

export const inputClass =
  'h-10 w-full rounded-md border border-border bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors duration-200 ease-out hover:border-foreground/40 focus:border-primary focus:outline-none aria-invalid:border-destructive'

type FieldProps = {
  id: string
  label: string
  error?: string
  hint?: string
  children: ReactNode
}

export function Field({ id, label, error, hint, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-medium text-foreground">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p className="font-mono text-[11px] text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}
