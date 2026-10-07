import { ActionButton } from './action-button'
import { HeroUnderline } from './hero-underline'
import { PreviewTable } from './preview-table'
import { Reveal } from './reveal'
import { Container, MonoLabel } from './section'

export function Hero() {
  return (
    <section aria-labelledby="hero-title">
      <Container>
        <div className="grid grid-cols-12 items-center gap-y-14 py-16 md:py-24 lg:gap-x-8">
          <div className="col-span-12 lg:col-span-5">
            <Reveal onLoad>
              <MonoLabel>equipment service, one place</MonoLabel>
            </Reveal>
            <Reveal onLoad delay={0.06}>
              <h1
                id="hero-title"
                className="mt-5 font-serif text-[44px] leading-[1.04] tracking-[-0.015em] sm:text-[56px]"
              >
                <span className="block">Every machine.</span>
                <span className="block">Every technician.</span>
                <span className="block">
                  One clear <HeroUnderline>status.</HeroUnderline>
                </span>
              </h1>
            </Reveal>
            <Reveal onLoad delay={0.12}>
              <p className="mt-6 max-w-[420px] text-pretty text-[17px] leading-relaxed text-muted-foreground">
                Raise a request, get the right person on site, and see what is stuck before it becomes late.
              </p>
            </Reveal>
            <Reveal onLoad delay={0.18}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <ActionButton href="/sign-up" variant="primary">
                  Get started
                </ActionButton>
                <ActionButton href="#how" variant="ghost">
                  See how it works
                </ActionButton>
              </div>
            </Reveal>
            <Reveal onLoad delay={0.24}>
              <MonoLabel className="mt-6">built for multi-site service teams</MonoLabel>
            </Reveal>
          </div>

          <div className="col-span-12 lg:col-span-7">
            <Reveal onLoad delay={0.3}>
              <PreviewTable />
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}
