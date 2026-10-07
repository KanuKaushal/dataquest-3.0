'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Reveal } from '@/components/technician/reveal'
import { StatRow } from '@/components/technician/stat-row'
import { useShell } from '@/components/technician/shell-context'
import { useNotifications } from '@/components/technician/notifications-provider'
import { useToast } from '@/components/technician/toast'
import { useMotionPrefs } from '@/lib/motion'
import {
  DAY_GROUPS,
  countByFilter,
  dayGroup,
  isAwaitingReply,
  isUrgent,
  matchesFilter,
  matchesQuery,
} from '@/lib/notifications/helpers'
import type { NotificationFilter } from '@/lib/notifications/types'
import { AlertSettings } from './alert-settings'
import { AttentionList } from './attention-list'
import { NotificationGroup } from './notification-group'
import type { RowEntrance } from './notification-row'
import { NotificationToolbar } from './notification-toolbar'
import { useNotificationActions } from './use-notification-actions'

const INCOMING_DELAY_MS = 6000
const INTRO_STAGGER_S = 0.06
const INTRO_BASE_DELAY_S = 0.24
const INTRO_MAX_DELAY_S = 0.8
const INTRO_DURATION_MS = 1400

export function NotificationsView() {
  const { query } = useShell()
  const toast = useToast()
  const { reduced, transition } = useMotionPrefs()
  const { items, now, unreadCount, markRead, markAllRead, deliverIncoming } = useNotifications()

  const [filter, setFilter] = useState<NotificationFilter>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [incomingId, setIncomingId] = useState<string | null>(null)
  const [introDone, setIntroDone] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  const introDelays = useRef<Map<string, number> | null>(null)
  if (introDelays.current === null) {
    introDelays.current = new Map(
      items.map((item, index) => [
        item.id,
        Math.min(INTRO_BASE_DELAY_S + index * INTRO_STAGGER_S, INTRO_MAX_DELAY_S),
      ]),
    )
  }

  useEffect(() => {
    const introTimer = window.setTimeout(() => setIntroDone(true), INTRO_DURATION_MS)
    const incomingTimer = window.setTimeout(() => {
      const incoming = deliverIncoming()
      if (!incoming) return
      setIncomingId(incoming.id)
      toast('New notification')
    }, INCOMING_DELAY_MS)
    return () => {
      window.clearTimeout(introTimer)
      window.clearTimeout(incomingTimer)
    }
  }, [deliverIncoming, toast])

  const counts = useMemo(() => countByFilter(items), [items])
  const stats = useMemo(
    () => [
      { label: 'Unread', value: unreadCount, flagWhenPositive: true },
      { label: 'Urgent', value: items.filter(isUrgent).length, flagWhenPositive: true },
      { label: 'Assignments', value: items.filter((item) => item.type === 'assignment').length },
      { label: 'Today', value: items.filter((item) => dayGroup(item.createdAt, now) === 'today').length },
    ],
    [items, now, unreadCount],
  )

  const visible = useMemo(
    () => items.filter((item) => matchesFilter(item, filter) && matchesQuery(item, query)),
    [items, filter, query],
  )
  const groups = useMemo(
    () =>
      DAY_GROUPS.map(({ id, label }) => ({
        label,
        items: visible.filter((item) => dayGroup(item.createdAt, now) === id),
      })).filter((group) => group.items.length > 0),
    [visible, now],
  )
  const awaitingReply = useMemo(() => items.filter(isAwaitingReply), [items])

  const entranceFor = useCallback(
    (id: string): RowEntrance => {
      if (id === incomingId) return { kind: 'slide' }
      if (introDone) return null
      const delay = introDelays.current?.get(id)
      return delay === undefined ? null : { kind: 'stagger', delay }
    },
    [incomingId, introDone],
  )

  const collapseIfOpen = useCallback((id: string) => {
    setExpandedId((current) => (current === id ? null : current))
  }, [])
  const handleAction = useNotificationActions(collapseIfOpen)

  function toggleRow(id: string) {
    setExpandedId((current) => (current === id ? null : id))
    markRead(id)
  }

  function replyTo(id: string) {
    setFilter('all')
    setExpandedId(id)
    markRead(id)
    window.requestAnimationFrame(() => {
      const row = document.getElementById(`notification-${id}`)
      row?.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' })
      row?.focus({ preventScroll: true })
    })
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement
    const row = target.closest<HTMLElement>('[data-notification-id]')
    if (!row || target !== row) return

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      const rows = Array.from(listRef.current?.querySelectorAll<HTMLElement>('[data-notification-id]') ?? [])
      const next = rows[rows.indexOf(row) + (event.key === 'ArrowDown' ? 1 : -1)]
      if (!next) return
      event.preventDefault()
      next.focus()
    } else if (event.key === 'm' && !event.metaKey && !event.ctrlKey && !event.altKey) {
      const id = row.dataset.notificationId
      if (id) markRead(id)
    }
  }

  return (
    <div className="flex flex-col gap-12">
      <Reveal index={0}>
        <StatRow stats={stats} />
      </Reveal>

      <div className="grid gap-x-16 gap-y-14 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="flex min-w-0 flex-col gap-4">
          <Reveal index={1}>
            <NotificationToolbar
              filter={filter}
              counts={counts}
              unreadCount={unreadCount}
              onFilterChange={(next) => {
                setFilter(next)
                setExpandedId(null)
              }}
              onMarkAllRead={markAllRead}
            />
          </Reveal>

          <div ref={listRef} onKeyDown={handleKeyDown}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={filter}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -8 }}
                transition={transition(0.2)}
              >
                {groups.length === 0 ? (
                  <motion.p
                    initial={reduced ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={transition(0.25)}
                    className="border-t py-8 text-[14px] text-muted-foreground"
                  >
                    Nothing here. You are all caught up.
                  </motion.p>
                ) : (
                  <div className="border-y pb-2">
                    {groups.map((group) => (
                      <NotificationGroup
                        key={group.label}
                        label={group.label}
                        items={group.items}
                        now={now}
                        expandedId={expandedId}
                        entranceFor={entranceFor}
                        onToggle={toggleRow}
                        onAction={handleAction}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <Reveal index={2} className="flex flex-col gap-12">
          <AttentionList items={awaitingReply} onReply={replyTo} />
          <AlertSettings />
        </Reveal>
      </div>
    </div>
  )
}
