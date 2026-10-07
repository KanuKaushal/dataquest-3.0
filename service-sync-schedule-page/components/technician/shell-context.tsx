'use client'

import { createContext, useContext } from 'react'

interface ShellValue {
  query: string
  setQuery: (query: string) => void
  /** Lets a page replace the default greeting, for example when the week changes */
  setGreeting: (greeting: string | null) => void
}

export const ShellContext = createContext<ShellValue | null>(null)

export function useShell() {
  const shell = useContext(ShellContext)
  if (!shell) throw new Error('useShell must be used inside TechnicianShell')
  return shell
}
