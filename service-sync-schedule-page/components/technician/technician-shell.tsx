'use client'

import { useMemo, useState } from 'react'
import { BottomTabs } from './bottom-tabs'
import { NotificationsProvider } from './notifications-provider'
import { ShellContext } from './shell-context'
import { Sidebar } from './sidebar'
import { ToastProvider } from './toast'
import { TopBar } from './top-bar'

export function TechnicianShell({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState('')
  const [greeting, setGreeting] = useState<string | null>(null)

  const value = useMemo(() => ({ query, setQuery, setGreeting }), [query])

  return (
    <ShellContext.Provider value={value}>
      <ToastProvider>
        <NotificationsProvider>
          <Sidebar />
          <div className="md:pl-[220px]">
            <div className="mx-auto max-w-[1100px] px-5 pb-28 md:px-10 md:pb-20">
              <TopBar greetingOverride={greeting} />
              <main>{children}</main>
            </div>
          </div>
          <BottomTabs />
        </NotificationsProvider>
      </ToastProvider>
    </ShellContext.Provider>
  )
}
