import { Reveal } from './reveal'
import { Section, SectionHeading } from './section'
import { StepList } from './step-list'

export function HowSection() {
  return (
    <Section id="how">
      <Reveal>
        <SectionHeading className="max-w-[560px]">From request to verified, in five steps.</SectionHeading>
      </Reveal>
      <div className="mt-14 md:mt-16">
        <StepList />
      </div>
    </Section>
  )
}
