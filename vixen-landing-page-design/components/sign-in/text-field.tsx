import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

interface TextFieldProps extends ComponentProps<'input'> {
  label: string
  mono?: boolean
}

export function TextField({ label, mono, id, className, ...props }: TextFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm text-[#1A1A18]">
        {label}
      </label>
      <input
        id={id}
        className={cn(
          'h-11 w-full rounded-[6px] border border-[#E4E0D6] bg-transparent px-3 text-sm text-[#1A1A18] outline-none transition-colors duration-200 placeholder:text-[#77756E]/70 hover:border-[#1A1A18]/40 focus:border-[#E8590C]',
          mono && 'font-mono uppercase tracking-wide placeholder:normal-case',
          className,
        )}
        {...props}
      />
    </div>
  )
}
