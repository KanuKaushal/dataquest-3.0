'use client'

import { useCountUp } from '@/lib/motion'
import { cn } from '@/lib/utils'

export interface Stat {
  label: string
  value: number
  /** Turns the number orange while it is above zero */
  flagWhenPositive?: boolean
}

export function StatRow({ stats }: { stats: Stat[] }) {
  return (
    <dl className="grid grid-cols-2 gap-y-8 md:grid-cols-4">
      {stats.map((stat) => (
        <StatCell key={stat.label} stat={stat} />
      ))}
    </dl>
  )
}

function StatCell({ stat }: { stat: Stat }) {
  const value = useCountUp(stat.value)
  const flagged = stat.flagWhenPositive && stat.value > 0

  return (
    <div className="border-l pl-5 first:border-l-0 first:pl-0 max-md:odd:border-l-0 max-md:odd:pl-0">
      <dd
        className={cn(
          'font-mono text-[32px] leading-none tabular-nums',
          flagged ? 'text-primary' : 'text-foreground',
        )}
      >
        {value}
      </dd>
      <dt className="mt-2 text-[13px] text-muted-foreground">{stat.label}</dt>
    </div>
  )
}
