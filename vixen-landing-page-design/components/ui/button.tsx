'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { motion, type HTMLMotionProps } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-[13px] font-medium transition-colors duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      variant: {
        primary: 'bg-accent text-foreground hover:bg-[#cf4e08]',
        solid: 'bg-foreground text-background hover:bg-[#3a3a36]',
        ghost: 'border border-border text-foreground hover:bg-hover',
      },
      size: {
        default: 'h-9 px-4',
        sm: 'h-8 px-3',
        icon: 'size-9 p-0',
        'icon-sm': 'size-8 p-0',
      },
    },
    defaultVariants: { variant: 'ghost', size: 'default' },
  },
)

const MotionLink = motion.create(Link)

type ButtonLinkProps = React.ComponentProps<typeof MotionLink> & VariantProps<typeof buttonVariants>

export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return (
    <MotionLink
      whileTap={{ scale: 0.97 }}
      whileHover={variant === 'primary' ? { y: -1 } : undefined}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

type ButtonProps = HTMLMotionProps<'button'> & VariantProps<typeof buttonVariants>

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      whileHover={variant === 'primary' ? { y: -1 } : undefined}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
