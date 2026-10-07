'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { useMotionPrefs } from '@/lib/motion'
import { describeLocation, formatAge, isUrgent } from '@/lib/notifications/helpers'
import type { AppNotification, NotificationAction } from '@/lib/notifications/types'
import { cn } from '@/lib/utils'
import { NotificationActions } from './notification-actions'

export type RowEntrance = { kind: 'stagger'; delay: number } | { kind: 'slide' } | null

interface NotificationRowProps {
  item: AppNotification
  now: number
  expanded: boolean
  entrance: RowEntrance
  onToggle: () => void
  onAction: (item: AppNotification, action: NotificationAction) => void
}

const INK = '#1A1A18'
const MUTED = '#77756E'

export function NotificationRow({ item, now, expanded, entrance, onToggle, onAction }: NotificationRowProps) {
  const { reduced, transition } = useMotionPrefs()

  const urgent = isUrgent(item)
  const unread = !item.read
  const age = formatAge(item.createdAt, now)
  const detailsId = `notification-details-${item.id}`
  const location = describeLocation(item)

  const initial = reduced || !entrance ? false : entrance.kind === 'slide' ? { height: 0, opacity: 0 } : { opacity: 0, y: 8 }
  const animate = entrance?.kind === 'slide' ? { height: 'auto', opacity: 1 } : { opacity: 1, y: 0 }
  const enterTransition =
    entrance?.kind === 'stagger' ? { ...transition(0.28), delay: entrance.delay } : transition(0.28)

  return (
    <motion.li
      initial={initial}
      animate={animate}
      exit={reduced ? undefined : { height: 0, opacity: 0 }}
      transition={enterTransition}
      className="overflow-hidden"
    >
      <div className="row-hover group/row" data-conflict={urgent}>
        <button
          type="button"
          id={`notification-${item.id}`}
          data-notification-id={item.id}
          onClick={onToggle}
          aria-expanded={expanded}
          aria-controls={detailsId}
          className="grid w-full grid-cols-[8px_minmax(0,1fr)_auto] items-start gap-x-4 px-4 py-4 text-left outline-offset-[-2px]"
        >
          <motion.span
            aria-hidden
            initial={false}
            animate={{ scale: unread ? 1 : 0, opacity: unread ? 1 : 0 }}
            transition={transition(0.2)}
            className="mt-1.5 size-2 rounded-full bg-primary"
          />

          <span className="flex min-w-0 flex-col gap-1">
            <motion.span
              initial={false}
              animate={{ color: unread ? INK : MUTED, fontWeight: unread ? 600 : 400 }}
              transition={transition(0.2)}
              className="text-[14px] leading-5 md:truncate"
            >
              {unread && <span className="sr-only">Unread. </span>}
              {item.title}
            </motion.span>
            <span className="text-[14px] leading-5 text-muted-foreground md:truncate">{item.body}</span>
            <span className="mt-0.5 flex flex-wrap items-center gap-x-2 font-mono text-[12px] text-muted-foreground">
              <span className={cn(urgent && 'text-primary')}>{item.type}</span>
              {item.requestId && <span>· {item.requestId}</span>}
              {location && <span>· {location}</span>}
              {item.responseTag && <span>· {item.responseTag}</span>}
            </span>
            <span className="font-mono text-[12px] text-muted-foreground md:hidden">{age}</span>
          </span>

          <span className="flex items-center gap-3 pt-0.5">
            <span className="hidden font-mono text-[12px] text-muted-foreground md:inline">{age}</span>
            <ChevronRight
              aria-hidden
              strokeWidth={1.5}
              className={cn(
                'size-4 text-muted-foreground transition-transform duration-200',
                expanded ? 'rotate-90' : 'group-hover/row:translate-x-[3px]',
              )}
            />
          </span>
        </button>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              id={detailsId}
              initial={reduced ? false : { height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={transition(0.22)}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-5 pr-4 pb-5 pl-10">
                <p className="max-w-[60ch] text-[14px] leading-6">{item.detail}</p>
                <NotificationActions item={item} onAction={onAction} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.li>
  )
}
