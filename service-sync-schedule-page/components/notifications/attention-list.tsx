'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { TextLink } from '@/components/technician/text-link'
import { useMotionPrefs } from '@/lib/motion'
import type { AppNotification } from '@/lib/notifications/types'

interface AttentionListProps {
  items: AppNotification[]
  onReply: (id: string) => void
}

export function AttentionList({ items, onReply }: AttentionListProps) {
  const { reduced, transition } = useMotionPrefs()

  return (
    <section aria-labelledby="needs-reply-heading">
      <h2 id="needs-reply-heading" className="text-[13px] font-medium">
        Needs a reply
      </h2>
      {items.length === 0 ? (
        <p className="mt-4 text-[14px] text-muted-foreground">Nothing is waiting on you.</p>
      ) : (
        <ul className="mt-4 flex flex-col">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.li
                key={item.id}
                exit={reduced ? undefined : { opacity: 0, height: 0 }}
                transition={transition(0.2)}
                className="overflow-hidden border-t py-4 first:border-t-0 first:pt-0"
              >
                <p className="text-[14px] leading-6">{item.replyPrompt ?? item.title}</p>
                <p className="font-mono text-[12px] text-muted-foreground">{item.requestId}</p>
                <TextLink className="mt-1.5" onClick={() => onReply(item.id)}>
                  Reply
                </TextLink>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </section>
  )
}
