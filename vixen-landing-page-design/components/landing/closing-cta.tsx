import { ActionButton } from './action-button'
import { Reveal } from './reveal'
import { Section } from './section'

export function ClosingCta() {
  return (
    <Section>
      <Reveal>
        <h2 className="max-w-[760px] font-serif text-[40px] leading-[1.05] tracking-[-0.015em] text-balance md:text-[68px]">
          See what is stuck before it is late.
        </h2>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <ActionButton href="/sign-up" variant="primary">
            Get started
          </ActionButton>
          <ActionButton href="/sign-in" variant="ghost">
            Log in
          </ActionButton>
        </div>
      </Reveal>
    </Section>
  )
}
