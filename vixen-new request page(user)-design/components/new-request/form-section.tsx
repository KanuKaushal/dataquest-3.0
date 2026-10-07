'use client'

import { useId } from 'react'
import { FadeUp } from '@/components/fade-up'
import { cn } from '@/lib/utils'

interface FormSectionProps {
  step: string
  title: string
  index: number
  children: React.ReactNode
}

export function FormSection({ step, title, index, children }: FormSectionProps) {
  const headingId = useId()

  return (
    <FadeUp delay={index * 0.06}>
      <section aria-labelledby={headingId} className={cn('py-8', index === 0 ? 'pt-0' : 'border-t')}>
        <h3 id={headingId} className="mb-5 flex items-baseline gap-3 text-[13px] text-muted-foreground">
          <span className="font-mono text-xs">{step}</span>
          {title}
        </h3>
        {children}
      </section>
    </FadeUp>
  )
}
