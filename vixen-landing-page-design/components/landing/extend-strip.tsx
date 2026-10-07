import { extensions } from '@/lib/landing-content'
import { Reveal } from './reveal'
import { MonoLabel, Section, SectionHeading } from './section'

export function ExtendStrip() {
  return (
    <Section>
      <Reveal>
        <MonoLabel>under the hood</MonoLabel>
        <SectionHeading className="mt-4">Built so it can grow with you.</SectionHeading>
        <p className="mt-6 max-w-[620px] text-pretty text-[17px] leading-relaxed text-muted-foreground">
          The core is a plain full-stack build: authentication, role-based access, APIs, a workflow engine,
          notifications and an audit history. It is designed so mobile apps, IoT sensors, AI and ML, real-time
          messaging, maps, analytics, blockchain records and cloud services can plug in later without a rewrite.
        </p>
        <ul className="mt-10 flex flex-wrap items-center gap-y-2 font-mono text-sm">
          {extensions.map((item, index) => (
            <li key={item} className="flex items-center">
              <span className="inline-block cursor-default transition-transform duration-150 ease-out hover:-translate-y-0.5 motion-reduce:transition-none">
                {item}
              </span>
              {index < extensions.length - 1 && (
                <span aria-hidden="true" className="mx-3 text-border">
                  /
                </span>
              )}
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  )
}
