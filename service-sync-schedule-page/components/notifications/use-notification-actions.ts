'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useNotifications } from '@/components/technician/notifications-provider'
import { useToast } from '@/components/technician/toast'
import { UNDO_WINDOW_MS } from '@/lib/notifications/data'
import type { AppNotification, NotificationAction } from '@/lib/notifications/types'

/** Runs a notification action: respond with an undo window, navigate, or show a mock toast */
export function useNotificationActions(onResolved: (id: string) => void) {
  const router = useRouter()
  const toast = useToast()
  const { respond, undoDecline } = useNotifications()

  return useCallback(
    (item: AppNotification, action: NotificationAction) => {
      const { effect } = action

      if (effect.type === 'navigate') {
        router.push(effect.href)
        return
      }

      if (effect.type === 'toast') {
        toast(effect.message)
        return
      }

      respond(item.id, effect.response, effect.tag)
      onResolved(item.id)

      if (effect.response === 'declined') {
        toast(effect.toast, {
          duration: UNDO_WINDOW_MS,
          action: { label: 'Undo', onSelect: () => undoDecline(item.id) },
        })
      } else {
        toast(effect.toast)
      }
    },
    [onResolved, respond, router, toast, undoDecline],
  )
}
