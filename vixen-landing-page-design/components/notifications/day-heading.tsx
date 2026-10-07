export function DayHeading({ label }: { label: string }) {
  return (
    <h3 className="border-b px-4 py-2.5 font-mono text-[11px] tracking-wide text-muted-foreground sm:px-5">
      {label}
    </h3>
  )
}
