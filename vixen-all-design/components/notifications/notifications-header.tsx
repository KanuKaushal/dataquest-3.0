'use client'

import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FlipNumber } from '@/components/notifications/flip-number'

interface NotificationsHeaderProps {
  unread: number
  total: number
  onMarkAllRead: () => void
  onOpenSettings: () => void
}

export function NotificationsHeader({
  unread,
  total,
  onMarkAllRead,
  onOpenSettings,
}: NotificationsHeaderProps) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <div>
        <h2 className="font-serif text-[30px] leading-tight">Notifications</h2>
        <p className="mt-2 font-mono text-[13px] text-muted-foreground">
          <FlipNumber value={unread} /> unread, <FlipNumber value={total} /> total
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMarkAllRead}
          disabled={unread === 0}
          className="border-transparent"
        >
          <Check aria-hidden strokeWidth={1.5} className="size-3.5" />
          Mark all as read
        </Button>
        <button
          type="button"
          onClick={onOpenSettings}
          className="text-[13px] text-muted-foreground underline decoration-border underline-offset-4 transition-colors duration-150 hover:text-foreground hover:decoration-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          Settings
        </button>
      </div>
    </header>
  )
}
