import { CountUp } from '@/components/count-up'
import { cn } from '@/lib/utils'

export interface Stat {
  label: string
  value: number
  urgent?: boolean
}

export function StatRow({ stats }: { stats: Stat[] }) {
  return (
    <dl className="grid grid-cols-2 gap-y-8 sm:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={cn(
            'flex flex-col-reverse gap-3',
            index % 2 === 1 && 'border-l pl-6 sm:pl-8',
            index > 0 && index % 2 === 0 && 'sm:border-l sm:pl-8',
          )}
        >
          <dt className="text-[13px] text-muted-foreground">{stat.label}</dt>
          <dd
            className={cn(
              'font-mono text-[44px] leading-none tracking-tight tabular-nums',
              stat.urgent && stat.value > 0 && 'text-accent',
            )}
          >
            <CountUp value={stat.value} />
          </dd>
        </div>
      ))}
    </dl>
  )
}
