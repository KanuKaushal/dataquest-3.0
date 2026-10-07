'use client'

import { animate, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'
import { Container } from './section'

type Stat = { value: number; suffix?: string; label: string }

function CountUp({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' })
  const reduceMotion = useReducedMotion()
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(value)
      return
    }
    if (!inView) return
    const controls = animate(0, value, {
      duration: 1.1,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    })
    return () => controls.stop()
  }, [inView, reduceMotion, value])

  return (
    <span ref={ref} aria-label={`${value}${suffix}`}>
      <span aria-hidden="true">
        {display}
        {suffix}
      </span>
    </span>
  )
}

export function StatRow({ stats }: { stats: Stat[] }) {
  return (
    <section aria-label="In numbers">
      <Container>
        <dl className="grid grid-cols-2 border-t border-border md:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={cn(
                'flex flex-col-reverse justify-end gap-2 border-border px-0 py-9 md:px-8 md:py-12',
                index % 2 === 1 && 'border-l pl-6',
                index > 0 ? 'md:border-l' : 'md:pl-0',
                index >= 2 && 'border-t md:border-t-0',
              )}
            >
              <dt className="max-w-[18ch] text-sm leading-snug text-muted-foreground">{stat.label}</dt>
              <dd className="font-mono text-[44px] leading-none tracking-[-0.02em] tabular-nums md:text-[56px]">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
