import { customerPoints, technicianPoints } from '@/lib/landing-content'
import { cn } from '@/lib/utils'
import { Reveal } from './reveal'
import { Section, SectionHeading } from './section'
import { TextLink } from './text-link'

type RoleColumnProps = {
  title: string
  points: string[]
  href: string
  linkLabel: string
  className?: string
}

function RoleColumn({ title, points, href, linkLabel, className }: RoleColumnProps) {
  return (
    <div className={cn('py-8 md:py-10', className)}>
      <h3 className="text-base font-semibold">{title}</h3>
      <ul className="mt-5 space-y-3">
        {points.map((point) => (
          <li key={point} className="flex items-center gap-3 text-[15px]">
            <span aria-hidden="true" className="h-px w-3 shrink-0 bg-foreground" />
            {point}
          </li>
        ))}
      </ul>
      <TextLink href={href} arrow className="mt-8">
        {linkLabel}
      </TextLink>
    </div>
  )
}

export function RolesSplit() {
  return (
    <Section id="roles">
      <Reveal>
        <SectionHeading>Two views, one source of truth.</SectionHeading>
      </Reveal>
      <Reveal delay={0.06}>
        <div className="mt-14 grid grid-cols-1 divide-y divide-border border-t border-border md:mt-16 md:grid-cols-2 md:divide-x md:divide-y-0">
          <RoleColumn
            title="For customers and ops"
            points={customerPoints}
            href="/user/dashboard"
            linkLabel="Go to user dashboard"
            className="md:pr-10"
          />
          <RoleColumn
            title="For technicians"
            points={technicianPoints}
            href="/technician/dashboard"
            linkLabel="Go to technician dashboard"
            className="md:pl-10"
          />
        </div>
      </Reveal>
    </Section>
  )
}
