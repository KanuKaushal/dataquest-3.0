'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { TextLink } from '@/components/technician-shell/text-link'
import { useToast } from '@/components/technician-shell/toast'
import { useMotionPrefs } from '@/lib/motion'
import type { AttentionItem } from '@/lib/schedule/agenda'
import { FREE_SLOTS_THIS_WEEK, TIME_OFF, WEEKLY_HOURS } from '@/lib/schedule/data'
import { dayName } from '@/lib/schedule/time'

interface SideColumnProps {
  attention: AttentionItem[]
  onAction: (item: AttentionItem) => void
}

export function SideColumn({ attention, onAction }: SideColumnProps) {
  const toast = useToast()
  const { reduced, transition } = useMotionPrefs()

  return (
    <aside className="flex flex-col gap-12 lg:sticky lg:top-8 lg:self-start">
      <section aria-labelledby="attention-heading">
        <h2 id="attention-heading" className="font-serif text-[20px]">
          Needs attention
        </h2>
        {attention.length === 0 ? (
          <p className="mt-4 text-[14px] text-muted-foreground">All clear this week.</p>
        ) : (
          <ul className="mt-4 flex flex-col">
            <AnimatePresence initial={false}>
              {attention.map((item) => (
                <motion.li
                  key={item.id}
                  exit={reduced ? undefined : { opacity: 0, height: 0 }}
                  transition={transition(0.2)}
                  className="overflow-hidden border-t py-4 first:border-t-0 first:pt-0"
                >
                  <p className="text-[14px] leading-6">{item.text}</p>
                  <TextLink className="mt-1.5" onClick={() => onAction(item)}>
                    {item.action}
                  </TextLink>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </section>

      <section aria-labelledby="hours-heading">
        <h2 id="hours-heading" className="font-serif text-[20px]">
          Hours and time off
        </h2>
        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 font-mono text-[12px]">
          {WEEKLY_HOURS.map((entry) => (
            <div key={entry.day} className="contents">
              <dt className="text-muted-foreground">{entry.day}</dt>
              <dd>{entry.hours}</dd>
            </div>
          ))}
        </dl>

        <ul className="mt-5 flex flex-col gap-1 text-[13px]">
          {TIME_OFF.map((entry) => (
            <li key={entry.day}>
              <span className="font-mono">{dayName(entry.day).slice(0, 3)}</span>{' '}
              <span className="text-muted-foreground">{entry.label}</span>
            </li>
          ))}
        </ul>

        <p className="mt-5 text-[13px] text-muted-foreground">
          <span className="font-mono text-foreground">{FREE_SLOTS_THIS_WEEK}</span> free slots this week
        </p>
        <TextLink className="mt-3" onClick={() => toast('Requesting time off is not part of this mock')}>
          Request time off
        </TextLink>
      </section>
    </aside>
  )
}
