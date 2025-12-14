// QuantitySelector - Quantity input with +/- buttons
import * as React from 'react'
import { cn } from '@/lib/utils'
import { Minus, Plus, Trash2 } from 'lucide-react'

// ============================================
// QuantitySelector
// ============================================

interface QuantitySelectorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  // Value
  value: number
  // On change
  onChange: (value: number) => void
  // Min value
  min?: number
  // Max value
  max?: number
  // Step
  step?: number
  // Size
  size?: 'sm' | 'md' | 'lg'
  // Disabled
  disabled?: boolean
  // Show delete button at 0
  showDelete?: boolean
  // On delete
  onDelete?: () => void
}

const sizeConfig = {
  sm: { button: 'h-7 w-7', input: 'h-7 w-10 text-sm', icon: 'h-3 w-3' },
  md: { button: 'h-9 w-9', input: 'h-9 w-12 text-base', icon: 'h-4 w-4' },
  lg: { button: 'h-11 w-11', input: 'h-11 w-14 text-lg', icon: 'h-5 w-5' },
}

const QuantitySelector = React.forwardRef<HTMLDivElement, QuantitySelectorProps>(
  (
    {
      value,
      onChange,
      min = 0,
      max = 99,
      step = 1,
      size = 'md',
      disabled = false,
      showDelete = false,
      onDelete,
      className,
      ...props
    },
    ref
  ) => {
    const config = sizeConfig[size]

    const handleDecrement = () => {
      if (value <= min) {
        if (showDelete && onDelete) {
          onDelete()
        }
        return
      }
      onChange(Math.max(min, value - step))
    }

    const handleIncrement = () => {
      onChange(Math.min(max, value + step))
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(e.target.value, 10)
      if (!isNaN(newValue)) {
        onChange(Math.min(max, Math.max(min, newValue)))
      }
    }

    const showDeleteButton = showDelete && value <= min

    return (
      <div
        ref={ref}
        className={cn('inline-flex items-center gap-1', className)}
        {...props}
      >
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || (!showDelete && value <= min)}
          className={cn(
            'inline-flex items-center justify-center rounded-md border border-input bg-background transition-colors',
            'hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed',
            config.button
          )}
        >
          {showDeleteButton ? (
            <Trash2 className={cn(config.icon, 'text-destructive')} />
          ) : (
            <Minus className={config.icon} />
          )}
        </button>

        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={handleInputChange}
          disabled={disabled}
          className={cn(
            'text-center rounded-md border border-input bg-background font-medium',
            'focus:outline-none focus:ring-2 focus:ring-ring',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            config.input
          )}
        />

        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || value >= max}
          className={cn(
            'inline-flex items-center justify-center rounded-md border border-input bg-background transition-colors',
            'hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed',
            config.button
          )}
        >
          <Plus className={config.icon} />
        </button>
      </div>
    )
  }
)
QuantitySelector.displayName = 'QuantitySelector'

// ============================================
// Compact Quantity - Smaller inline version
// ============================================

interface CompactQuantityProps extends Omit<QuantitySelectorProps, 'size'> {}

const CompactQuantity = React.forwardRef<HTMLDivElement, CompactQuantityProps>(
  ({ value, onChange, min = 1, max = 99, disabled, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('inline-flex items-center rounded-full border', className)}
      {...props}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={disabled || value <= min}
        className="h-8 w-8 inline-flex items-center justify-center hover:bg-muted rounded-l-full disabled:opacity-50"
      >
        <Minus className="h-3 w-3" />
      </button>
      <span className="w-8 text-center text-sm font-medium">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={disabled || value >= max}
        className="h-8 w-8 inline-flex items-center justify-center hover:bg-muted rounded-r-full disabled:opacity-50"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  )
)
CompactQuantity.displayName = 'CompactQuantity'

// ============================================
// Stepper - Vertical +/- stepper
// ============================================

interface StepperProps extends Omit<QuantitySelectorProps, 'size'> {
  label?: string
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ value, onChange, min = 0, max = 99, step = 1, label, disabled, className, ...props }, ref) => (
    <div ref={ref} className={cn('inline-flex flex-col items-center', className)} {...props}>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + step))}
        disabled={disabled || value >= max}
        className="h-8 w-12 inline-flex items-center justify-center border rounded-t-md hover:bg-muted disabled:opacity-50"
      >
        <Plus className="h-4 w-4" />
      </button>
      <div className="h-10 w-12 flex items-center justify-center border-x bg-muted/50">
        <span className="text-lg font-semibold">{value}</span>
      </div>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - step))}
        disabled={disabled || value <= min}
        className="h-8 w-12 inline-flex items-center justify-center border rounded-b-md hover:bg-muted disabled:opacity-50"
      >
        <Minus className="h-4 w-4" />
      </button>
      {label && <span className="mt-1 text-xs text-muted-foreground">{label}</span>}
    </div>
  )
)
Stepper.displayName = 'Stepper'

export { QuantitySelector, CompactQuantity, Stepper }
