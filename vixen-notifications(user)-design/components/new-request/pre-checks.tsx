'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { CheckLine } from '@/components/new-request/check-line'
import type { Checks } from '@/lib/new-request'

export function PreChecks({ checks }: { checks: Checks }) {
  return (
    <aside aria-labelledby="pre-checks-title" className="rounded-md border p-6 lg:sticky lg:top-8">
      <h2 id="pre-checks-title" className="font-serif text-[22px] leading-tight">
        Pre-checks
      </h2>
      <ul className="mt-3 divide-y">
        <CheckLine label="Machine" check={checks.machine} />
        <CheckLine label="Site" check={checks.site} />
        <CheckLine label="Skills" check={checks.skills} />
        <CheckLine label="Parts" check={checks.parts} />
        <CheckLine label="Routing" check={checks.routing} />
      </ul>
      <div className="border-t pt-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={checks.estimate}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="font-mono text-xs text-muted-foreground"
          >
            {checks.estimate}
          </motion.p>
        </AnimatePresence>
      </div>
    </aside>
  )
}
