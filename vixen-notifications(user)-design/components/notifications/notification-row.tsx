'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, X } from 'lucide-react'
import { RowDetail } from '@/components/notifications/row-detail'
import { StatusDot } from '@/components/notifications/status-dot'
import type { Notification } from '@/lib/notifications'

const ROW_BASE_DELAY = 0.12
const ROW_STAGGER = 0.06
const MAX_STAGGERED_ROWS = 8

interface NotificationRowProps {
  notification: Notification
  index: number
  expanded: boolean
  onToggle: () => void
  onAction: () => void
  onToggleRead: () => void
  onDismiss: () => void
}

function RowAction({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="pointer-events-auto relative z-10 inline-block text-[13px] font-medium underline decoration-border underline-offset-4 transition-[text-decoration-color,transform] duration-150 hover:decoration-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent active:scale-[0.97]"
    >
      {label}
    </button>
  )
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="rounded-md border px-1.5 py-0.5">{children}</span>
}

export function NotificationRow({
  notification,
  index,
  expanded,
  onToggle,
  onAction,
  onToggleRead,
  onDismiss,
}: NotificationRowProps) {
  const { kind, title, summary, requestId, machine, site, age, action, read, fresh } = notification
  const unread = !read
  const staggerDelay = ROW_BASE_DELAY + Math.min(index, MAX_STAGGERED_ROWS) * ROW_STAGGER

  return (
    <motion.li
      initial={fresh ? { height: 0, opacity: 0 } : false}
      animate={fresh ? { height: 'auto', opacity: 1 } : undefined}
      exit={{
        height: 0,
        opacity: 0,
        transition: {
          height: { duration: 0.25, delay: 0.15, ease: 'easeOut' },
          opacity: { duration: 0.2, delay: 0.15 },
        },
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="overflow-hidden"
    >
      <motion.div
        initial={fresh ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ x: 64, opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } }}
        transition={{ duration: 0.28, ease: 'easeOut', delay: fresh ? 0 : staggerDelay }}
      >
        <div className="group relative flex items-start gap-4 px-4 py-4 transition-colors duration-150 hover:bg-hover sm:px-5">
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 w-0.5 origin-top scale-y-0 bg-accent transition-transform duration-200 ease-out group-hover:scale-y-100"
          />
          {fresh && (
            <motion.span
              aria-hidden
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
              className="absolute inset-y-0 left-0 w-0.5 bg-accent"
            />
          )}

          <StatusDot kind={kind} unread={unread} className="mt-[5px]" />

          <div className="min-w-0 flex-1">
            <h4 className="text-sm">
              <button
                type="button"
                onClick={onToggle}
                aria-expanded={expanded}
                className="text-left after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-accent"
              >
                {unread && <span className="sr-only">Unread: </span>}
                <motion.span
                  initial={false}
                  animate={{ fontWeight: unread ? 600 : 400 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  {title}
                </motion.span>
              </button>
            </h4>
            <time className="mt-0.5 block font-mono text-[11px] text-muted-foreground sm:hidden">
              {age}
            </time>
            <p className="mt-0.5 text-[13px] text-muted-foreground">{summary}</p>
            <div className="mt-2.5 flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted-foreground">
              <Tag>{requestId}</Tag>
              <Tag>{`${machine}, ${site}`}</Tag>
            </div>
            {action && (
              <div className="mt-3 sm:hidden">
                <RowAction label={action.label} onClick={onAction} />
              </div>
            )}
          </div>

          <div className="pointer-events-none hidden shrink-0 items-center gap-4 self-center sm:flex">
            <div className="w-36 text-right">
              {action && <RowAction label={action.label} onClick={onAction} />}
            </div>
            <time className="w-[4.5rem] text-right font-mono text-[12px] whitespace-nowrap text-muted-foreground">{age}</time>
          </div>

          <div className="pointer-events-none flex shrink-0 items-center gap-1 self-start sm:self-center">
            <button
              type="button"
              onClick={onDismiss}
              aria-label={`Dismiss: ${title}`}
              className="pointer-events-auto relative z-10 grid size-7 place-items-center rounded-md text-muted-foreground transition-[opacity,color] duration-150 hover:text-foreground focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-accent sm:opacity-0 sm:group-hover:opacity-100 [@media(hover:none)]:opacity-100"
            >
              <X aria-hidden strokeWidth={1.5} className="size-3.5" />
            </button>
            <motion.span
              aria-hidden
              animate={{ rotate: expanded ? 90 : 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="grid size-7 place-items-center text-muted-foreground"
            >
              <ChevronRight
                strokeWidth={1.5}
                className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-[3px]"
              />
            </motion.span>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <RowDetail
                notification={notification}
                onAction={onAction}
                onToggleRead={onToggleRead}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.li>
  )
}
