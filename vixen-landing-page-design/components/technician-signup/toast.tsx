'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type ToastProps = {
  message: string | null
  onDismiss: () => void
}

export function Toast({ message, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(onDismiss, 4000)
    return () => clearTimeout(timer)
  }, [message, onDismiss])

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 flex justify-end sm:inset-x-auto sm:right-6 sm:bottom-6">
      <AnimatePresence>
        {message && (
          <motion.div
            role="status"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="pointer-events-auto w-full rounded-md border border-l-[3px] border-border border-l-primary bg-background px-4 py-3 text-sm text-foreground sm:w-auto"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
