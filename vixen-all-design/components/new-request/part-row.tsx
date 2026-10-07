'use client'

import { Minus, Plus, X } from 'lucide-react'
import { Combobox, type ComboboxOption } from '@/components/new-request/combobox'
import { findPart, stockText, stockTone, type PartLine, type StockTone } from '@/lib/new-request'
import { cn } from '@/lib/utils'

const TONE: Record<StockTone, { text: string; dot: string }> = {
  ok: { text: 'text-done', dot: 'bg-done' },
  low: { text: 'text-progress', dot: 'bg-progress' },
  out: { text: 'text-accent', dot: 'bg-accent' },
}

const stepperButton =
  'flex size-8 items-center justify-center rounded-md border text-foreground transition-colors duration-150 hover:bg-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-40'

interface PartRowProps {
  line: PartLine
  options: ComboboxOption[]
  onChange: (patch: Partial<PartLine>) => void
  onRemove: () => void
}

export function PartRow({ line, options, onChange, onRemove }: PartRowProps) {
  const part = findPart(line.partId)
  const tone = part ? TONE[stockTone(part)] : null

  return (
    <div className="flex flex-wrap items-end gap-x-4 gap-y-3 py-3">
      <div className="min-w-0 basis-full sm:flex-1 sm:basis-0">
        <Combobox
          label="Part"
          hideLabel
          options={options}
          value={line.partId}
          onChange={(partId) => onChange({ partId })}
          placeholder="Search parts"
          searchPlaceholder="Search parts"
          emptyText="No parts match."
        />
      </div>

      <div role="group" aria-label="Quantity" className="flex items-center gap-2 pb-1">
        <button
          type="button"
          aria-label="Decrease quantity"
          disabled={line.qty <= 1}
          onClick={() => onChange({ qty: line.qty - 1 })}
          className={stepperButton}
        >
          <Minus className="size-3.5" strokeWidth={1.5} aria-hidden />
        </button>
        <span aria-live="polite" className="w-6 text-center font-mono text-[13px]">
          {line.qty}
        </span>
        <button
          type="button"
          aria-label="Increase quantity"
          disabled={line.qty >= 9}
          onClick={() => onChange({ qty: line.qty + 1 })}
          className={stepperButton}
        >
          <Plus className="size-3.5" strokeWidth={1.5} aria-hidden />
        </button>
      </div>

      <p className="flex w-28 items-center gap-1.5 pb-2.5 font-mono text-xs">
        {part && tone ? (
          <>
            <span aria-hidden className={cn('size-1.5 shrink-0 rounded-full', tone.dot)} />
            <span className={tone.text}>{stockText(part)}</span>
          </>
        ) : (
          <span className="text-muted-foreground/70">No part yet</span>
        )}
      </p>

      <button
        type="button"
        aria-label="Remove part"
        onClick={onRemove}
        className="mb-1 flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-hover hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <X className="size-4" strokeWidth={1.5} aria-hidden />
      </button>
    </div>
  )
}
