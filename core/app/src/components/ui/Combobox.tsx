// Combobox - Autocomplete/searchable dropdown using cmdk + Popover
import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from './Popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './Command'

export type ComboboxOption = {
  value: string
  label: string
  disabled?: boolean
}

interface ComboboxProps {
  options: ComboboxOption[] | string[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  label?: string
  error?: string
  disabled?: boolean
  required?: boolean
  className?: string
}

const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = 'Select...',
      searchPlaceholder = 'Search...',
      emptyText = 'No results found.',
      label,
      error,
      disabled,
      required,
      className,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false)

    // Normalize options to { value, label } format
    const normalizedOptions: ComboboxOption[] = React.useMemo(() => {
      return options.map((opt) =>
        typeof opt === 'string' ? { value: opt, label: opt } : opt
      )
    }, [options])

    // Find selected option label
    const selectedLabel = React.useMemo(() => {
      const selected = normalizedOptions.find((opt) => opt.value === value)
      return selected?.label
    }, [normalizedOptions, value])

    const handleSelect = (selectedValue: string) => {
      // Toggle if same value selected
      const newValue = selectedValue === value ? '' : selectedValue
      onChange?.(newValue)
      setOpen(false)
    }

    return (
      <div className={cn('space-y-1.5', className)}>
        {label && (
          <label className="text-sm font-medium">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              ref={ref}
              type="button"
              role="combobox"
              aria-expanded={open}
              disabled={disabled}
              className={cn(
                'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm',
                'ring-offset-background',
                'placeholder:text-muted-foreground',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50',
                error && 'border-destructive focus:ring-destructive'
              )}
            >
              <span className={cn(!selectedLabel && 'text-muted-foreground')}>
                {selectedLabel || placeholder}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
            <Command>
              <CommandInput placeholder={searchPlaceholder} />
              <CommandList>
                <CommandEmpty>{emptyText}</CommandEmpty>
                <CommandGroup>
                  {normalizedOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                      onSelect={handleSelect}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          value === option.value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    )
  }
)

Combobox.displayName = 'Combobox'

export { Combobox }
