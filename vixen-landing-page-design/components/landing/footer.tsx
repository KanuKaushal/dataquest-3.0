import Link from 'next/link'

import { navLinks } from '@/lib/landing-content'
import { Container } from './section'

export function Footer() {
  return (
    <footer>
      <Container>
        <div className="flex flex-col gap-8 border-t border-border py-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-serif text-[22px] leading-none">ServiceSync</p>
            <p className="mt-3 font-mono text-xs text-muted-foreground">mock data, built for DataQuest 3.0</p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="transition-colors hover:text-foreground">
                {link.label}
              </a>
            ))}
            <Link href="/sign-in" className="transition-colors hover:text-foreground">
              Log in
            </Link>
          </nav>
        </div>
      </Container>
    </footer>
  )
}
