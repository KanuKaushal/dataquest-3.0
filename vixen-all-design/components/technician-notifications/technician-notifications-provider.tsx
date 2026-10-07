'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import {
  INITIAL_NOTIFICATIONS,
  type TechnicianNotification,
} from '@/lib/technician-notifications'

const MARK_ALL_STAGGER_MS = 30

interface TechnicianNotificationsStore {
  items: TechnicianNotification[]
  unreadCount: number
  markRead: (id: string) => void
  toggleRead: (id: string) => void
  markAllRead: (onDone?: () => void) => void
  dismiss: (id: string) => void
  receive: (notification: TechnicianNotification) => void
}

const TechnicianNotificationsContext = createContext<TechnicianNotificationsStore | null>(null)

export function useTechnicianNotifications() {
  const store = useContext(TechnicianNotificationsContext)
  if (!store) {
    throw new Error('useTechnicianNotifications must be used inside TechnicianNotificationsProvider')
  }
  return store
}

export function TechnicianNotificationsProvider({ children }: { children: React.ReactNode }) {
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

  const receive = useCallback((notification: TechnicianNotification) => {
    setItems((current) =>
      current.some((n) => n.id === notification.id) ? current : [notification, ...current],
    )
  }, [])

  const value = useMemo(
    () => ({ items, unreadCount, markRead, toggleRead, markAllRead, dismiss, receive }),
    [items, unreadCount, markRead, toggleRead, markAllRead, dismiss, receive],
  )

  return (
    <TechnicianNotificationsContext.Provider value={value}>
      {children}
    </TechnicianNotificationsContext.Provider>
  )
}
