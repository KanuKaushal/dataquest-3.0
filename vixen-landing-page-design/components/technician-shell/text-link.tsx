import { cn } from '@/lib/utils'

export function TextLink({ className, type = 'button', ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      type={type}
      className={cn(
        'text-[13px] text-foreground underline decoration-border underline-offset-4 transition-[color,text-decoration-color,transform] duration-150 hover:decoration-foreground active:scale-[0.97]',
        className,
      )}
      {...props}
    />
  )
}
