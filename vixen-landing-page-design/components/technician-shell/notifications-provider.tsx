'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { INCOMING_NOTIFICATION, MOCK_NOW_MS, SEED_NOTIFICATIONS } from '@/lib/notifications/data'
import { toLocalIso } from '@/lib/notifications/helpers'
import type { AppNotification, NotificationResponse } from '@/lib/notifications/types'
import { useMotionPrefs } from '@/lib/motion'

const CLOCK_TICK_MS = 15_000
const MARK_ALL_STAGGER_MS = 40

interface NotificationsValue {
  /** Notifications the technician has not declined, newest first */
  items: AppNotification[]
  /** Mock clock in epoch milliseconds, starting at 09:12 on the mock day */
  now: number
  unreadCount: number
  markRead: (id: string) => void
  markAllRead: () => void
  respond: (id: string, response: NotificationResponse, tag: string) => void
  undoDecline: (id: string) => void
  /** Adds the demo notification once. Returns it, or null if it was already delivered. */
  deliverIncoming: () => AppNotification | null
}

const NotificationsContext = createContext<NotificationsValue | null>(null)

export function useNotifications() {
  const value = useContext(NotificationsContext)
  if (!value) throw new Error('useNotifications must be used inside NotificationsProvider')
  return value
}

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { reduced } = useMotionPrefs()
  const [all, setAll] = useState<AppNotification[]>(SEED_NOTIFICATIONS)
  const [now, setNow] = useState(MOCK_NOW_MS)
  const nowRef = useRef(MOCK_NOW_MS)
  const incomingDelivered = useRef(false)
  const timers = useRef<number[]>([])

  useEffect(() => {
    const startedAt = Date.now()
    const tick = window.setInterval(() => {
      nowRef.current = MOCK_NOW_MS + (Date.now() - startedAt)
      setNow(nowRef.current)
    }, CLOCK_TICK_MS)
    const pending = timers.current
    return () => {
      window.clearInterval(tick)
      pending.forEach((id) => window.clearTimeout(id))
    }
  }, [])

  const [extraUnread, setExtraUnread] = useState(0)

  useEffect(() => {
    const sync = () => {
      try {
        const raw = localStorage.getItem('vixen_technician_notifications_v2')
        if (raw) {
          const notifs = JSON.parse(raw)
          setExtraUnread(notifs.filter((n: any) => !n.read).length)
        }
      } catch {}
    }
    sync()
    window.addEventListener('vixen_notifications_changed', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('vixen_notifications_changed', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const items = useMemo(
    () =>
      all
        .filter((item) => item.response !== 'declined')
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [all],
  )
  const unreadCount = useMemo(
    () => Math.max(items.filter((item) => !item.read).length, extraUnread),
    [items, extraUnread],
  )

  const markRead = useCallback((id: string) => {
    setAll((current) => current.map((item) => (item.id === id && !item.read ? { ...item, read: true } : item)))
  }, [])

  const markAllRead = useCallback(() => {
    if (reduced) {
      setAll((current) => current.map((item) => ({ ...item, read: true })))
      return
    }
    items
      .filter((item) => !item.read)
      .forEach((item, index) => {
        timers.current.push(window.setTimeout(() => markRead(item.id), index * MARK_ALL_STAGGER_MS))
      })
  }, [items, markRead, reduced])

  const respond = useCallback((id: string, response: NotificationResponse, tag: string) => {
    setAll((current) =>
      current.map((item) => (item.id === id ? { ...item, read: true, response, responseTag: tag } : item)),
    )
  }, [])

  const undoDecline = useCallback((id: string) => {
    setAll((current) =>
      current.map((item) =>
        item.id === id ? { ...item, response: undefined, responseTag: undefined } : item,
      ),
    )
  }, [])

  const deliverIncoming = useCallback(() => {
    if (incomingDelivered.current) return null
    incomingDelivered.current = true
    const incoming: AppNotification = { ...INCOMING_NOTIFICATION, createdAt: toLocalIso(nowRef.current) }
    setAll((current) => [incoming, ...current])
    return incoming
  }, [])

  const value = useMemo(
    () => ({ items, now, unreadCount, markRead, markAllRead, respond, undoDecline, deliverIncoming }),
    [items, now, unreadCount, markRead, markAllRead, respond, undoDecline, deliverIncoming],
  )

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
}
