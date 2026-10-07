'use client'

import { motion } from 'framer-motion'
import {
  Bell,
  CalendarDays,
  ClipboardList,
  LayoutGrid,
  ListChecks,
  LogOut,
  Plus,
  Sun,
  type LucideIcon,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export type Role = 'user' | 'technician'

interface NavEntry {
  key: string
  label: string
  icon: LucideIcon
  unread?: boolean
}

export const NAV: Record<Role, NavEntry[]> = {
  user: [
    { key: 'overview', label: 'Overview', icon: LayoutGrid },
    { key: 'requests', label: 'My requests', icon: ClipboardList },
    { key: 'new', label: 'New request', icon: Plus },
    { key: 'notifications', label: 'Notifications', icon: Bell, unread: true },
  ],
  technician: [
    { key: 'today', label: 'Today', icon: Sun },
    { key: 'tasks', label: 'My tasks', icon: ListChecks },
    { key: 'schedule', label: 'Schedule', icon: CalendarDays },
    { key: 'notifications', label: 'Notifications', icon: Bell, unread: true },
  ],
}

interface NavProps {
  role: Role
  active: string
  onSelect: (key: string) => void
  onLogout: () => void
}

function UnreadDot() {
  return <span aria-label="unread" className="size-1.5 rounded-full bg-accent" />
}

export function Sidebar({ role, active, onSelect, onLogout }: NavProps) {
  const otherRole = role === 'user' ? 'technician' : 'user'

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-[220px] flex-col border-r bg-background py-8 lg:flex">
      <Link href="/" className="px-6 font-serif text-[26px] leading-none hover:opacity-80 transition-opacity">
        ServiceSync
      </Link>

      <nav aria-label="Main" className="mt-12 flex flex-col gap-1">
        {NAV[role].map(({ key, label, icon: Icon, unread }) => {
          const isActive = active === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(key)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'relative flex h-9 items-center px-6 text-left text-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent',
                isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="nav-indicator-desktop"
                  className="absolute inset-y-1 left-0 w-0.5 bg-accent"
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                />
              )}
              <motion.span
                whileHover={{ x: 2 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="flex items-center gap-3"
              >
                <Icon className="size-4" strokeWidth={1.5} aria-hidden />
                {label}
                {unread && <UnreadDot />}
              </motion.span>
            </button>
          )
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-2 px-6">
        <Link
          href={`/${otherRole}/dashboard`}
          className="text-[13px] text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
        >
          Switch to {otherRole} view
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-3 py-1 text-left text-[13px] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <LogOut className="size-4" strokeWidth={1.5} aria-hidden />
          Log out
        </button>
      </div>
    </aside>
  )
}

export function MobileTabs({ role, active, onSelect, onLogout }: NavProps) {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t bg-background lg:hidden"
    >
      {NAV[role].map(({ key, label, icon: Icon, unread }) => {
        const isActive = active === key
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'relative flex flex-col items-center gap-1 pt-3 pb-2.5 text-[11px] transition-colors',
              isActive ? 'text-foreground' : 'text-muted-foreground',
            )}
          >
            {isActive && (
              <motion.span
                layoutId="nav-indicator-mobile"
                className="absolute inset-x-3 top-0 h-0.5 bg-accent"
                transition={{ duration: 0.25, ease: 'easeOut' }}
              />
            )}
            <span className="relative">
              <Icon className="size-[18px]" strokeWidth={1.5} aria-hidden />
              {unread && (
                <span
                  aria-label="unread"
                  className="absolute -top-0.5 -right-1.5 size-1.5 rounded-full bg-accent"
                />
              )}
            </span>
            <span className="max-w-full truncate px-1">{label}</span>
          </button>
        )
      })}
      <button
        type="button"
        onClick={onLogout}
        className="flex flex-col items-center gap-1 pt-3 pb-2.5 text-[11px] text-muted-foreground"
      >
        <LogOut className="size-[18px]" strokeWidth={1.5} aria-hidden />
        Log out
      </button>
    </nav>
  )
}
