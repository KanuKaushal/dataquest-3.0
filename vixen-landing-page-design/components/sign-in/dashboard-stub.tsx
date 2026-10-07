import Link from 'next/link'

export function DashboardStub({ title, path }: { title: string; path: string }) {
  return (
    <main className="flex min-h-dvh flex-col items-start justify-center gap-3 px-6 sm:px-16">
      <span className="font-mono text-xs text-[#77756E]">{path}</span>
      <h1 className="font-serif text-5xl leading-none tracking-tight">{title}</h1>
      <Link href="/" className="text-sm text-[#77756E] underline-offset-4 hover:text-[#1A1A18] hover:underline">
        Back to sign in
      </Link>
    </main>
  )
}
