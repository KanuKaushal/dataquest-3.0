'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  type TechnicianNotification,
} from '@/lib/technician-notifications'
import {
  getStoredNotifications,
  saveStoredNotifications,
  updateOfferStatus,
} from '@/lib/technician-job-storage'

const MARK_ALL_STAGGER_MS = 30

interface TechnicianNotificationsStore {
  items: TechnicianNotification[]
  unreadCount: number
  markRead: (id: string) => void
  toggleRead: (id: string) => void
  markAllRead: (onDone?: () => void) => void
  dismiss: (id: string) => void
  receive: (notification: TechnicianNotification) => void
  respondOffer: (
    notificationId: string,
    status: 'accepted' | 'declined' | 'expired',
    reason?: string,
  ) => void
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
  const [items, setItems] = useState<TechnicianNotification[]>([])

  useEffect(() => {
    // Initial sync from stored storage
    setItems(getStoredNotifications())

    const handleStorageUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<TechnicianNotification[]>
      if (customEvent.detail) {
        setItems(customEvent.detail)
      } else {
        setItems(getStoredNotifications())
      }
    }

    window.addEventListener('vixen_notifications_changed', handleStorageUpdate)
    window.addEventListener('storage', handleStorageUpdate)
    return () => {
      window.removeEventListener('vixen_notifications_changed', handleStorageUpdate)
      window.removeEventListener('storage', handleStorageUpdate)
    }
  }, [])

  const unreadCount = useMemo(() => items.filter((n) => !n.read).length, [items])

  const markRead = useCallback((id: string) => {
    setItems((current) => {
      const updated = current.map((n) => (n.id === id && !n.read ? { ...n, read: true } : n))
      saveStoredNotifications(updated)
      return updated
    })
  }, [])

  const toggleRead = useCallback((id: string) => {
    setItems((current) => {
      const updated = current.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
      saveStoredNotifications(updated)
      return updated
    })
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
    setItems((current) => {
      const updated = current.filter((n) => n.id !== id)
      saveStoredNotifications(updated)
      return updated
    })
  }, [])

  const receive = useCallback((notification: TechnicianNotification) => {
    setItems((current) => {
      if (current.some((n) => n.id === notification.id)) return current
      const updated = [notification, ...current]
      saveStoredNotifications(updated)
      return updated
    })
  }, [])

  const respondOffer = useCallback(
    (notificationId: string, status: 'accepted' | 'declined' | 'expired', reason?: string) => {
      updateOfferStatus(notificationId, status, reason)
      setItems(getStoredNotifications())
    },
    [],
  )

  const value = useMemo(
    () => ({
      items,
      unreadCount,
      markRead,
      toggleRead,
      markAllRead,
      dismiss,
      receive,
      respondOffer,
    }),
    [items, unreadCount, markRead, toggleRead, markAllRead, dismiss, receive, respondOffer],
  )

  return (
    <TechnicianNotificationsContext.Provider value={value}>
      {children}
    </TechnicianNotificationsContext.Provider>
  )
}
