'use client'

import { motion } from 'framer-motion'
import { TABS, type TabKey } from '@/lib/notifications'
import { cn } from '@/lib/utils'

interface NotificationTabsProps {
  value: TabKey
  counts: Record<TabKey, number>
  onChange: (tab: TabKey) => void
}

export function NotificationTabs({ value, counts, onChange }: NotificationTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Filter notifications"
      className="-mb-px flex min-w-0 flex-1 gap-6 overflow-x-auto pb-px [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {TABS.map(({ key, label }) => {
        const isActive = value === key
        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(key)}
            className={cn(
              'relative flex h-10 shrink-0 items-center gap-2 text-[13px] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
              isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {label}
            <span className="font-mono text-[11px] text-muted-foreground">{counts[key]}</span>
            {isActive && (
              <motion.span
                layoutId="notification-tab-underline"
                className="absolute inset-x-0 -bottom-px h-px bg-foreground"
                transition={{ duration: 0.25, ease: 'easeOut' }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
