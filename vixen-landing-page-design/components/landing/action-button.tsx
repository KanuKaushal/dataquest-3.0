'use client'

import { motion, MotionConfig } from 'framer-motion'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

const MotionLink = motion.create(Link)
const MotionAnchor = motion.a

type ActionButtonProps = {
  href: string
  variant: 'primary' | 'ghost'
  size?: 'md' | 'sm'
  className?: string
  children: ReactNode
}

const baseClasses = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

const variantClasses = {
  primary: 'bg-accent text-[#f7f5f0] hover:bg-[#cf4e08]',
  ghost: 'border border-border text-foreground hover:bg-hover',
}

const sizeClasses = {
  md: 'h-10 px-4 text-[15px]',
  sm: 'h-8 px-3 text-[13px]',
}

export function ActionButton({ href, variant, size = 'md', className, children }: ActionButtonProps) {
  const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className)

  const motionProps = {
    whileTap: { scale: 0.97 },
    whileHover: variant === 'primary' ? { y: -1 } : undefined,
    transition: { duration: 0.15, ease: 'easeOut' as const },
  }

  return (
    <MotionConfig reducedMotion="user">
      {href.startsWith('#') ? (
        <MotionAnchor href={href} className={classes} {...motionProps}>
          {children}
        </MotionAnchor>
      ) : (
        <MotionLink href={href} className={classes} {...motionProps}>
          {children}
        </MotionLink>
      )}
    </MotionConfig>
  )
}
