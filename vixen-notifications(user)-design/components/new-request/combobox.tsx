'use client'

import { Check, ChevronDown } from 'lucide-react'
import { useId, useState } from 'react'
import { Underline } from '@/components/new-request/field'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export interface ComboboxOption {
  value: string
  label: string
  meta?: string
  disabled?: boolean
}

interface ComboboxProps {
  label: string
  hideLabel?: boolean
  options: ComboboxOption[]
  value: string | null
  onChange: (value: string) => void
  placeholder: string
  searchPlaceholder?: string
  searchable?: boolean
  monoLabel?: boolean
  emptyText?: string
}

export function Combobox({
  label,
  hideLabel,
  options,
  value,
  onChange,
  placeholder,
  searchPlaceholder = 'Search',
  searchable = true,
  monoLabel,
  emptyText = 'No matches.',
}: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const selected = options.find((option) => option.value === value)

  return (
    <div>
      <label htmlFor={id} className={cn('mb-1 block text-xs text-muted-foreground', hideLabel && 'sr-only')}>
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <Underline>
          <PopoverTrigger asChild>
            <button
              id={id}
              type="button"
              role="combobox"
              aria-expanded={open}
              aria-haspopup="listbox"
              className="group/trigger flex h-10 w-full items-center justify-between gap-3 text-left text-sm outline-none"
            >
              {selected ? (
                <span className="flex items-baseline gap-2 truncate">
                  <span className={cn(monoLabel && 'font-mono')}>{selected.label}</span>
                  {selected.meta && <span className="text-muted-foreground">{selected.meta}</span>}
                </span>
              ) : (
                <span className="truncate text-muted-foreground/70">{placeholder}</span>
              )}
              <ChevronDown
                aria-hidden
                strokeWidth={1.5}
                className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-data-[state=open]/trigger:rotate-180"
              />
            </button>
          </PopoverTrigger>
        </Underline>
        <PopoverContent className="w-(--radix-popover-trigger-width) min-w-56 p-0">
          <Command>
            {searchable && <CommandInput placeholder={searchPlaceholder} aria-label={searchPlaceholder} />}
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={`${option.label} ${option.meta ?? ''}`}
                    disabled={option.disabled}
                    onSelect={() => {
                      onChange(option.value)
                      setOpen(false)
                    }}
                  >
                    <span className={cn(monoLabel && 'font-mono')}>{option.label}</span>
                    {option.meta && <span className="text-muted-foreground">{option.meta}</span>}
                    <Check
                      aria-hidden
                      strokeWidth={1.5}
                      className={cn(
                        'ml-auto size-3.5 transition-opacity duration-150',
                        option.value === value ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
