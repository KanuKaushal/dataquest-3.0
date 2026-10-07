'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'

interface ToastProps {
  message: string | null
  onDismiss: () => void
}

export function Toast({ message, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!message) return
    const timeout = window.setTimeout(onDismiss, 4000)
    return () => window.clearTimeout(timeout)
  }, [message, onDismiss])

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 flex justify-end sm:inset-x-auto sm:right-6 sm:bottom-6"
    >
      <AnimatePresence>
        {message && (
          <motion.p
            key={message}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full rounded-md border border-l-2 border-border border-l-primary bg-background px-4 py-3 text-sm text-foreground sm:w-auto"
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
