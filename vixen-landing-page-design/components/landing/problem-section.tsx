import { problemItems } from '@/lib/landing-content'
import { Reveal } from './reveal'
import { Section, SectionHeading } from './section'

function ProblemList() {
  return (
    <ul className="border-t border-border">
      {problemItems.map((item, index) => (
        <li key={item.tag}>
          <Reveal delay={index * 0.06}>
            <div className="row flex items-baseline gap-6 border-b border-border px-0 py-4 md:px-3">
              <span className="w-14 shrink-0 font-mono text-xs text-muted-foreground">{item.tag}</span>
              <span className="text-[15px]">{item.line}</span>
            </div>
          </Reveal>
        </li>
      ))}
    </ul>
  )
}

export function ProblemSection() {
  return (
    <Section id="problem">
      <div className="grid grid-cols-12 gap-y-12 lg:gap-x-8">
        <div className="col-span-12 lg:col-span-5">
          <Reveal>
            <SectionHeading>Right now it lives in five places.</SectionHeading>
            <p className="mt-6 max-w-[440px] text-pretty text-[17px] leading-relaxed text-muted-foreground">
              The request comes in over chat. The schedule sits in a spreadsheet. Someone counts spare parts by hand
              and the completion photos end up on a phone. When a machine fails again, nobody can say what was done
              last time.
            </p>
          </Reveal>
        </div>
        <div className="col-span-12 lg:col-span-6 lg:col-start-7">
          <ProblemList />
        </div>
      </div>
    </Section>
  )
}
