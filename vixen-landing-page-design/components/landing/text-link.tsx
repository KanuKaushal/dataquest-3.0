import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type TextLinkProps = {
  href: string
  children: ReactNode
  arrow?: boolean
  className?: string
}

export function TextLink({ href, children, arrow = false, className }: TextLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group/link inline-flex items-center gap-1.5 text-sm font-medium underline decoration-border decoration-1 underline-offset-4 transition-colors hover:decoration-accent',
        className,
      )}
    >
      {children}
      {arrow && (
        <ArrowRight
          className="size-4 transition-transform duration-200 ease-out group-hover/link:translate-x-[3px] motion-reduce:transition-none"
          aria-hidden="true"
        />
      )}
    </Link>
  )
}
