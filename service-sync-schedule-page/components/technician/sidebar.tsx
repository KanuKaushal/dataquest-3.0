'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { useMotionPrefs } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { NAV_ITEMS } from './nav-items'
import { useNotifications } from './notifications-provider'
import { useToast } from './toast'

export function Sidebar() {
  const pathname = usePathname()
  const toast = useToast()
  const { unreadCount } = useNotifications()
  const { transition } = useMotionPrefs()

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-[220px] flex-col justify-between border-r px-6 py-8 md:flex">
      <div>
        <Link href="/technician/dashboard" className="font-serif text-[26px] leading-none">
          ServiceSync
        </Link>

        <nav aria-label="Technician" className="mt-12 flex flex-col">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'group relative flex items-center py-2.5 pl-4 text-[14px] transition-colors duration-150',
                  active ? 'font-medium text-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    transition={transition(0.25)}
                    className="absolute inset-y-1.5 left-0 w-[2px] bg-primary"
                  />
                )}
                <span className="transition-transform duration-150 group-hover:translate-x-[2px]">
                  {item.label}
                </span>
                <AnimatePresence>
                  {item.tracksUnread && unreadCount > 0 && (
                    <motion.span
                      initial={false}
                      exit={{ scale: 0 }}
                      transition={transition(0.15)}
                      className="ml-2 size-1.5 rounded-full bg-primary"
                    >
                      <span className="sr-only">{unreadCount} unread</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="flex flex-col items-start gap-2 pl-4 text-[13px] text-muted-foreground">
        <button
          type="button"
          onClick={() => toast("User view isn't part of this mock")}
          className="transition-colors duration-150 hover:text-foreground"
        >
          Switch to user view
        </button>
        <button
          type="button"
          onClick={() => toast("Logging out isn't part of this mock")}
          className="transition-colors duration-150 hover:text-foreground"
        >
          Log out
        </button>
      </div>
    </aside>
  )
}
