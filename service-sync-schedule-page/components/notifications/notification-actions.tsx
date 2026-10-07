import { TextLink } from '@/components/technician/text-link'
import type { AppNotification, NotificationAction } from '@/lib/notifications/types'
import { cn } from '@/lib/utils'

interface NotificationActionsProps {
  item: AppNotification
  onAction: (item: AppNotification, action: NotificationAction) => void
}

const BUTTON_BASE =
  'inline-flex h-9 items-center justify-center rounded-md px-4 text-[13px] font-medium transition-[background-color,translate,scale] duration-150 active:scale-[0.97] max-sm:w-full'

export function NotificationActions({ item, onAction }: NotificationActionsProps) {
  if (item.response || item.actions.length === 0) return null

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3">
      {item.actions.map((action) => {
        if (action.style === 'link') {
          return (
            <TextLink
              key={action.id}
              onClick={() => onAction(item, action)}
              className="max-sm:w-full max-sm:py-2 max-sm:text-left sm:ml-1"
            >
              {action.label}
            </TextLink>
          )
        }
        return (
          <button
            key={action.id}
            type="button"
            onClick={() => onAction(item, action)}
            className={cn(
              BUTTON_BASE,
              action.style === 'primary'
                ? 'bg-primary text-primary-foreground hover:-translate-y-px hover:bg-[color-mix(in_srgb,var(--primary)_88%,black)]'
                : 'text-foreground hover:bg-border',
            )}
          >
            {action.label}
          </button>
        )
      })}
    </div>
  )
}
