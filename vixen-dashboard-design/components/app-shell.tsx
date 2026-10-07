'use client'

import { MotionConfig } from 'framer-motion'
import { useState } from 'react'
import { MobileTabs, NAV, Sidebar, type Role } from '@/components/sidebar'
import { ToastProvider, useToast } from '@/components/toast'
import { Topbar } from '@/components/topbar'

function Shell({ role, children }: { role: Role; children: React.ReactNode }) {
  const [active, setActive] = useState(NAV[role][0].key)
  const toast = useToast()
  const navProps = {
    role,
    active,
    onSelect: setActive,
    onLogout: () => toast('Logged out'),
  }

  return (
    <div className="min-h-dvh">
      <Sidebar {...navProps} />
      <MobileTabs {...navProps} />
      <main className="px-5 pt-8 pb-28 sm:px-10 lg:ml-[220px] lg:pt-12 lg:pb-20">
        <div className="mx-auto flex max-w-[1100px] flex-col gap-12">
          <Topbar role={role} />
          {children}
        </div>
      </main>
    </div>
  )
}

export function AppShell({ role, children }: { role: Role; children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        <Shell role={role}>{children}</Shell>
      </ToastProvider>
    </MotionConfig>
  )
}
