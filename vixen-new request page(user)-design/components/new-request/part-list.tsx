'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Choice } from '@/components/new-request/choice'
import type { ComboboxOption } from '@/components/new-request/combobox'
import { PartRow } from '@/components/new-request/part-row'
import { parts } from '@/lib/mock-data'
import type { PartLine } from '@/lib/new-request'

interface PartListProps {
  lines: PartLine[]
  notSure: boolean
  onAdd: () => void
  onChange: (key: string, patch: Partial<PartLine>) => void
  onRemove: (key: string) => void
  onNotSure: () => void
}

export function PartList({ lines, notSure, onAdd, onChange, onRemove, onNotSure }: PartListProps) {
  function optionsFor(line: PartLine): ComboboxOption[] {
    const taken = new Set(lines.filter((other) => other.key !== line.key).map((other) => other.partId))
    return parts.map((part) => ({
      value: part.id,
      label: part.name,
      disabled: taken.has(part.id),
    }))
  }

  return (
    <div>
      <ul className="divide-y">
        <AnimatePresence initial={false}>
          {lines.map((line) => (
            <motion.li
              key={line.key}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <PartRow
                line={line}
                options={optionsFor(line)}
                onChange={(patch) => onChange(line.key, patch)}
                onRemove={() => onRemove(line.key)}
              />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 pt-2">
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 py-1 text-[13px] underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <Plus className="size-3.5" strokeWidth={1.5} aria-hidden />
          Add part
        </button>
        <Choice type="checkbox" checked={notSure} onChange={onNotSure}>
          Not sure what&apos;s needed
        </Choice>
      </div>
    </div>
  )
}
