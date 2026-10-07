import { TextLink } from '@/components/technician-shell/text-link'
import { formatClock, formatDuration } from '@/lib/schedule/time'
import type { AgendaEntry } from '@/lib/schedule/types'

type GapEntry = Extract<AgendaEntry, { kind: 'travel' | 'free' }>

export function GapRow({ entry, onAddJob }: { entry: GapEntry; onAddJob: () => void }) {
  return (
    <li className="group grid grid-cols-[var(--time-col)_minmax(0,1fr)] items-center gap-x-3 px-3 py-2.5 font-mono text-[12px] text-muted-foreground">
      <span>{formatClock(entry.at)}</span>
      {entry.kind === 'travel' ? (
        <span>
          travel, Site {entry.from} to Site {entry.to} · {entry.minutes} min
        </span>
      ) : (
        <span className="flex items-center gap-4">
          <span>free · {formatDuration(entry.minutes)}</span>
          <TextLink
            onClick={onAddJob}
            className="font-sans text-[12px] opacity-0 transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:opacity-100 max-md:opacity-100"
          >
            Add a job
          </TextLink>
        </span>
      )}
    </li>
  )
}
