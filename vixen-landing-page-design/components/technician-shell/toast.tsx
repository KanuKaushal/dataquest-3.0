'use client'

import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useMotionPrefs } from '@/lib/motion'

interface ToastAction {
  label: string
  onSelect: () => void
}

interface ToastOptions {
  action?: ToastAction
  /** How long the toast stays on screen, in milliseconds */
  duration?: number
}

interface ToastItem {
  id: number
  message: string
  action?: ToastAction
}

const DEFAULT_LIFETIME_MS = 2400

type ShowToast = (message: string, options?: ToastOptions) => void

interface ToastContextValue {
  show: ShowToast
  dismiss: (id: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used inside ToastProvider')
  return context.show
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const nextId = useRef(0)

  const dismiss = useCallback((id: number) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }, [])

  const show = useCallback<ShowToast>(
    (message, options) => {
      const id = nextId.current++
      setItems((current) => [...current, { id, message, action: options?.action }])
      window.setTimeout(() => dismiss(id), options?.duration ?? DEFAULT_LIFETIME_MS)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={{ show, dismiss }}>
      {children}
      <ToastViewport items={items} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

function ToastViewport({ items, onDismiss }: { items: ToastItem[]; onDismiss: (id: number) => void }) {
  const { reduced, transition } = useMotionPrefs()

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed right-4 bottom-20 z-50 flex flex-col items-end gap-2 md:right-8 md:bottom-8"
    >
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={transition(0.2)}
            className="flex items-center gap-4 rounded-lg border border-l-2 border-l-foreground bg-background px-3.5 py-2.5 text-[13px]"
          >
            <p>{item.message}</p>
            {item.action && (
              <button
                type="button"
                onClick={() => {
                  item.action?.onSelect()
                  onDismiss(item.id)
                }}
                className="pointer-events-auto font-mono text-[12px] underline decoration-border underline-offset-4 transition-colors duration-150 hover:decoration-foreground"
              >
                {item.action.label}
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
