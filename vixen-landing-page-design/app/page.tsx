import { ClosingCta } from '@/components/landing/closing-cta'
import { ExceptionColumns } from '@/components/landing/exception-columns'
import { ExtendStrip } from '@/components/landing/extend-strip'
import { Footer } from '@/components/landing/footer'
import { Hero } from '@/components/landing/hero'
import { HowSection } from '@/components/landing/how-section'
import { ProblemSection } from '@/components/landing/problem-section'
import { RolesSplit } from '@/components/landing/roles-split'
import { StatRow } from '@/components/landing/stat-row'
import { TopBar } from '@/components/landing/top-bar'
import { stats } from '@/lib/landing-content'

export default function Page() {
  return (
    <>
      <TopBar />
      <main>
        <Hero />
        <StatRow stats={stats} />
        <ProblemSection />
        <HowSection />
        <ExceptionColumns />
        <RolesSplit />
        <ExtendStrip />
        <ClosingCta />
      </main>
      <Footer />
    </>
  )
}
