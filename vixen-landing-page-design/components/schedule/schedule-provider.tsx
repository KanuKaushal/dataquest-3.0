'use client'

import { useMemo, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import { ShellContext } from '@/components/technician-shell/shell-context'
import { NotificationsProvider } from '@/components/technician-shell/notifications-provider'
import { ToastProvider as TechToastProvider } from '@/components/technician-shell/toast'

/**
 * Provides the context that ScheduleView needs (ShellContext, NotificationsProvider)
 * without duplicating the sidebar/topbar – those come from AppShell via the technician layout.
 */
export function ScheduleProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState('')
  const [greeting, setGreeting] = useState<string | null>(null)
  const value = useMemo(() => ({ query, setQuery, setGreeting }), [query])

  return (
    <MotionConfig reducedMotion="user">
      <ShellContext.Provider value={value}>
        <TechToastProvider>
          <NotificationsProvider>{children}</NotificationsProvider>
        </TechToastProvider>
      </ShellContext.Provider>
    </MotionConfig>
  )
}
