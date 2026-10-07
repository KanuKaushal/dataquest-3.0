'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { useMotionPrefs } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { NAV_ITEMS } from './nav-items'
import { useNotifications } from './notifications-provider'

export function BottomTabs() {
  const pathname = usePathname()
  const { transition } = useMotionPrefs()
  const { unreadCount } = useNotifications()

  return (
    <nav
      aria-label="Technician"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t bg-background md:hidden"
    >
      {NAV_ITEMS.map(({ href, label, icon: Icon, tracksUnread }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'relative flex flex-col items-center gap-1 pt-3 pb-2.5 text-[11px]',
              active ? 'text-foreground' : 'text-muted-foreground',
            )}
          >
            {active && (
              <motion.span
                layoutId="tab-active"
                transition={transition(0.25)}
                className="absolute inset-x-4 top-0 h-[2px] bg-primary"
              />
            )}
            <span className="relative">
              <Icon className="size-[18px]" strokeWidth={1.5} aria-hidden />
              <AnimatePresence>
                {tracksUnread && unreadCount > 0 && (
                  <motion.span
                    initial={false}
                    exit={{ scale: 0 }}
                    transition={transition(0.15)}
                    className="absolute -top-0.5 -right-1 size-1.5 rounded-full bg-primary"
                  >
                    <span className="sr-only">{unreadCount} unread</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
