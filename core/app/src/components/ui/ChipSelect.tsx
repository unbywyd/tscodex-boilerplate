// ChipSelect - Tag/Chip based selection (works as radio or checkbox group)
import * as React from 'react'
import { Check, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

type ChipOption = string | { value: string; label: string; icon?: React.ReactNode }

interface ChipSelectProps {
  options: ChipOption[]
  value?: string | string[]
  onChange?: (value: string | string[]) => void
  multiple?: boolean // false = radio mode, true = checkbox mode
  label?: string
  error?: string
  disabled?: boolean
  required?: boolean
  // Visual variants
  variant?: 'outline' | 'solid' | 'soft'
  size?: 'sm' | 'md' | 'lg'
  // Show indicator icon (check/circle)
  showIndicator?: boolean
  // Layout
  wrap?: boolean // true = flex-wrap, false = horizontal scroll
  className?: string
}

const sizeClasses = {
  sm: 'px-2.5 py-1 text-xs gap-1',
  md: 'px-3 py-1.5 text-sm gap-1.5',
  lg: 'px-4 py-2 text-base gap-2',
}

const iconSizes = {
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5',
  lg: 'h-4 w-4',
}

const ChipSelect = React.forwardRef<HTMLDivElement, ChipSelectProps>(
  (
    {
      options,
      value,
      onChange,
      multiple = false,
      label,
      error,
      disabled = false,
      required,
      variant = 'outline',
      size = 'md',
      showIndicator = true,
      wrap = true,
      className,
    },
    ref
  ) => {
    // Normalize value to array for easier handling
    const selectedValues: string[] = React.useMemo(() => {
      if (!value) return []
      return Array.isArray(value) ? value : [value]
    }, [value])

    // Normalize options
    const normalizedOptions = React.useMemo(() => {
      return options.map((opt) =>
        typeof opt === 'string' ? { value: opt, label: opt } : opt
      )
    }, [options])

    const handleSelect = (optionValue: string) => {
      if (disabled) return

      if (multiple) {
        // Checkbox mode - toggle selection
        const newValues = selectedValues.includes(optionValue)
          ? selectedValues.filter((v) => v !== optionValue)
          : [...selectedValues, optionValue]
        onChange?.(newValues)
      } else {
        // Radio mode - single selection
        onChange?.(optionValue)
      }
    }

    const isSelected = (optionValue: string) => selectedValues.includes(optionValue)

    const getChipClasses = (selected: boolean) => {
      const base = cn(
        'inline-flex items-center justify-center rounded-full font-medium transition-all',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'cursor-pointer select-none',
        sizeClasses[size],
        disabled && 'opacity-50 cursor-not-allowed'
      )

      if (variant === 'outline') {
        return cn(
          base,
          'border',
          selected
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-input bg-background hover:bg-muted hover:border-muted-foreground/50'
        )
      }

      if (variant === 'solid') {
        return cn(
          base,
          selected
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
        )
      }

      // soft variant
      return cn(
        base,
        selected
          ? 'bg-primary/20 text-primary border border-primary/30'
          : 'bg-muted/50 text-muted-foreground hover:bg-muted border border-transparent'
      )
    }

    const renderIndicator = (selected: boolean) => {
      if (!showIndicator) return null

      if (multiple) {
        // Checkbox indicator
        return selected ? (
          <Check className={cn(iconSizes[size], 'shrink-0')} />
        ) : (
          <div
            className={cn(
              iconSizes[size],
              'shrink-0 rounded border border-current opacity-40'
            )}
          />
        )
      } else {
        // Radio indicator
        return selected ? (
          <Circle className={cn(iconSizes[size], 'shrink-0 fill-current')} />
        ) : (
          <Circle className={cn(iconSizes[size], 'shrink-0 opacity-40')} />
        )
      }
    }

    return (
      <div ref={ref} className={cn('space-y-2', className)}>
        {label && (
          <label className="text-sm font-medium">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        <div
          className={cn(
            'flex gap-2',
            wrap ? 'flex-wrap' : 'overflow-x-auto pb-1 scrollbar-thin'
          )}
          role={multiple ? 'group' : 'radiogroup'}
          aria-label={label}
        >
          {normalizedOptions.map((option) => {
            const selected = isSelected(option.value)
            return (
              <button
                key={option.value}
                type="button"
                role={multiple ? 'checkbox' : 'radio'}
                aria-checked={selected}
                disabled={disabled}
                onClick={() => handleSelect(option.value)}
                className={getChipClasses(selected)}
              >
                {renderIndicator(selected)}
                {option.icon}
                <span>{option.label}</span>
              </button>
            )
          })}
        </div>

        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    )
  }
)

ChipSelect.displayName = 'ChipSelect'

export { ChipSelect, type ChipOption }
