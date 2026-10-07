'use client'

import { useToast } from '@/components/toast'
import type { AttentionItem } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export function AttentionList({ items }: { items: AttentionItem[] }) {
  const toast = useToast()

  return (
    <section aria-labelledby="needs-attention">
      <h2 id="needs-attention" className="mb-4 text-sm font-medium">
        Needs attention
      </h2>
      <ul className="divide-y border-y">
        {items.map((item) => (
          <li key={item.id} className="flex flex-col items-start gap-2 py-4">
            <p className="flex gap-2.5 text-[13px] leading-relaxed">
              <span
                aria-hidden
                className={cn(
                  'mt-[7px] size-1.5 shrink-0 rounded-full',
                  item.urgent ? 'bg-accent' : 'bg-border',
                )}
              />
              {item.text}
            </p>
            <button
              type="button"
              onClick={() => toast(`${item.action} opened`)}
              className={cn(
                'ml-4 text-[13px] underline decoration-border underline-offset-4 transition-colors hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                item.urgent ? 'text-accent' : 'text-foreground',
              )}
            >
              {item.action}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
