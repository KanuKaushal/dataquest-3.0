import { cn } from '@/lib/utils'
import type { Status } from '@/lib/landing-content'

const statusStyles: Record<Status, { label: string; dot: string; text: string }> = {
  done: { label: 'done', dot: 'bg-done', text: 'text-foreground' },
  progress: { label: 'in progress', dot: 'bg-progress', text: 'text-foreground' },
  urgent: { label: 'urgent', dot: 'bg-accent', text: 'text-accent-text' },
  pending: { label: 'pending', dot: 'bg-pending', text: 'text-muted-foreground' },
}

export function StatusPill({ status, pulse = false }: { status: Status; pulse?: boolean }) {
  const { label, dot, text } = statusStyles[status]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border px-2 py-0.5 text-xs font-medium',
        text,
      )}
    >
      <span className="relative flex size-1.5" aria-hidden="true">
        {pulse && (
          <span className={cn('absolute inset-0 animate-ping rounded-full opacity-60 motion-reduce:hidden', dot)} />
        )}
        <span className={cn('relative size-1.5 rounded-full', dot)} />
      </span>
      {label}
    </span>
  )
}
