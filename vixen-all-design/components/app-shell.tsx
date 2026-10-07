'use client'

import { MotionConfig } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { MobileTabs, NAV, Sidebar, type Role } from '@/components/sidebar'
import { ToastProvider, useToast } from '@/components/toast'
import { Topbar } from '@/components/topbar'

const ROUTES: Partial<Record<Role, Record<string, string>>> = {
  user: {
    overview: '/user/dashboard',
    new: '/user/new-request',
    notifications: '/user/notifications',
  },
  technician: {
    today: '/technician/dashboard',
    notifications: '/technician/notifications',
  },
}

function keyForPath(role: Role, pathname: string) {
  const routes = ROUTES[role]
  return routes ? Object.keys(routes).find((key) => routes[key] === pathname) : undefined
}

function Shell({ role, children }: { role: Role; children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const routeKey = keyForPath(role, pathname)
  const [active, setActive] = useState(routeKey ?? NAV[role][0].key)
  const [previousPath, setPreviousPath] = useState(pathname)
  const toast = useToast()

  if (pathname !== previousPath) {
    setPreviousPath(pathname)
    if (routeKey) setActive(routeKey)
  }

  const navProps = {
    role,
    active,
    onSelect: (key: string) => {
      setActive(key)
      const href = ROUTES[role]?.[key]
      if (href && href !== pathname) router.push(href)
    },
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
