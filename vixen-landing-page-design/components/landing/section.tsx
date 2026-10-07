import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-full max-w-[1100px] px-5 md:px-8', className)}>{children}</div>
}

export function Section({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <section id={id}>
      <Container>
        <div className="border-t border-border py-20 md:py-[120px]">{children}</div>
      </Container>
    </section>
  )
}

export function SectionHeading({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={cn(
        'font-serif text-[34px] leading-[1.1] tracking-[-0.01em] text-balance md:text-[44px]',
        className,
      )}
    >
      {children}
    </h2>
  )
}

export function MonoLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('font-mono text-xs text-muted-foreground', className)}>{children}</p>
}
