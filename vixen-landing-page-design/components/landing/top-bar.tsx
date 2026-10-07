'use client'

import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { cn } from '@/lib/utils'
import { navLinks } from '@/lib/landing-content'
import { ActionButton } from './action-button'
import { Container } from './section'

export function TopBar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const reduceMotion = useReducedMotion()
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 4))

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b bg-background transition-colors duration-200',
        scrolled ? 'border-border' : 'border-transparent',
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="font-serif text-[22px] leading-none tracking-[-0.01em]">
            ServiceSync
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative py-1 text-sm text-muted-foreground transition-colors hover:text-foreground after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-foreground after:transition-transform after:duration-200 after:ease-out hover:after:scale-x-100 motion-reduce:after:transition-none"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ActionButton href="/sign-in" variant="ghost" size="sm">
              Log in
            </ActionButton>
            <ActionButton href="/sign-up" variant="primary" size="sm">
              <span aria-hidden="true" className="sm:hidden">
                Sign up
              </span>
              <span className="sr-only sm:not-sr-only">Get started</span>
            </ActionButton>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="-mr-1.5 flex size-9 items-center justify-center rounded-md transition-colors hover:bg-muted md:hidden"
            >
              {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </Container>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            className="overflow-hidden md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.25, ease: 'easeOut' }}
          >
            <Container>
              <nav aria-label="Mobile" className="flex flex-col border-t border-border pb-3">
                {navLinks.map((link) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    whileHover={reduceMotion ? undefined : { x: 2 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="border-b border-border py-3.5 text-[15px] last:border-b-0"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
