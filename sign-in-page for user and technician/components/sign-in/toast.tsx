'use client'

import { AnimatePresence, motion } from 'framer-motion'

interface ToastProps {
  message: string | null
}

export function Toast({ message }: ToastProps) {
  return (
    <div className="pointer-events-none fixed right-4 bottom-4 sm:right-6 sm:bottom-6">
      <AnimatePresence>
        {message && (
          <motion.div
            role="status"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="rounded-[6px] border border-[#E4E0D6] border-l-2 border-l-[#E8590C] bg-[#F7F5F0] px-4 py-3 text-sm text-[#1A1A18]"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
