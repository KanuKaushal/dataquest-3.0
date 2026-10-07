'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { INITIAL_NOTIFICATIONS, type Notification } from '@/lib/notifications'

const MARK_ALL_STAGGER_MS = 30

interface NotificationsStore {
  items: Notification[]
  unreadCount: number
  markRead: (id: string) => void
  toggleRead: (id: string) => void
  markAllRead: (onDone?: () => void) => void
  dismiss: (id: string) => void
  receive: (notification: Notification) => void
}

const NotificationsContext = createContext<NotificationsStore | null>(null)

export function useNotifications() {
  const store = useContext(NotificationsContext)
  if (!store) throw new Error('useNotifications must be used inside NotificationsProvider')
  return store
}

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState(INITIAL_NOTIFICATIONS)

  const unreadCount = useMemo(() => items.filter((n) => !n.read).length, [items])

  const markRead = useCallback((id: string) => {
    setItems((current) => current.map((n) => (n.id === id && !n.read ? { ...n, read: true } : n)))
  }, [])

  const toggleRead = useCallback((id: string) => {
    setItems((current) => current.map((n) => (n.id === id ? { ...n, read: !n.read } : n)))
  }, [])

  const markAllRead = useCallback(
    (onDone?: () => void) => {
      const unreadIds = items.filter((n) => !n.read).map((n) => n.id)
      unreadIds.forEach((id, index) => setTimeout(() => markRead(id), index * MARK_ALL_STAGGER_MS))
      setTimeout(() => onDone?.(), unreadIds.length * MARK_ALL_STAGGER_MS + 150)
    },
    [items, markRead],
  )

  const dismiss = useCallback((id: string) => {
    setItems((current) => current.filter((n) => n.id !== id))
  }, [])

  const receive = useCallback((notification: Notification) => {
    setItems((current) =>
      current.some((n) => n.id === notification.id) ? current : [notification, ...current],
    )
  }, [])

  const value = useMemo(
    () => ({ items, unreadCount, markRead, toggleRead, markAllRead, dismiss, receive }),
    [items, unreadCount, markRead, toggleRead, markAllRead, dismiss, receive],
  )

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
}
