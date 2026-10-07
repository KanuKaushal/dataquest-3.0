import { Clock, PackageX, UserX } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'
import { Reveal } from './reveal'
import { Section, SectionHeading } from './section'
import { TextLink } from './text-link'

type ExceptionItem = {
  icon: typeof UserX
  title: string
  description: string
  action: ReactNode
  automatic: string
}

const exceptions: ExceptionItem[] = [
  {
    icon: UserX,
    title: 'Technician drops out',
    description: 'Someone calls in sick or gets pulled to another site.',
    action: <TextLink href="/user/dashboard">Reassign</TextLink>,
    automatic: 'The job is flagged, the ops lead is alerted, and a qualified replacement is one click away.',
  },
  {
    icon: PackageX,
    title: 'Part not available',
    description: 'The part you reserved is not on the shelf.',
    action: <TextLink href="/user/dashboard">View</TextLink>,
    automatic: 'The request is held, stores gets a heads-up, and the job moves as soon as stock lands.',
  },
  {
    icon: Clock,
    title: 'SLA at risk',
    description: 'A job is close to its deadline and nobody has started.',
    action: <span className="font-mono text-sm text-accent-text">due in 0h 45m</span>,
    automatic: 'It jumps to the top of the list and the technician and ops lead are alerted.',
  },
]

export function ExceptionColumns() {
  return (
    <Section id="exceptions">
      <Reveal>
        <SectionHeading className="max-w-[680px]">When something goes wrong, you hear about it first.</SectionHeading>
      </Reveal>
      <div className="mt-14 grid grid-cols-1 divide-y divide-border border-t border-border md:mt-16 md:grid-cols-3 md:divide-x md:divide-y-0">
        {exceptions.map((item, index) => (
          <Reveal key={item.title} delay={index * 0.06}>
            <article className={cn('flex h-full flex-col py-8 md:py-10', index > 0 && 'md:pl-8', index < 2 && 'md:pr-8')}>
              <item.icon className="size-5" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="mt-6 text-base font-semibold">{item.title}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed">{item.description}</p>
              <div className="mt-4">{item.action}</div>
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{item.automatic}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
