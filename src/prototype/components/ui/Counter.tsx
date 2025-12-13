// Counter - Numeric input with increment/decrement buttons
import * as React from 'react'
import { cn } from '@/lib/utils'
import { Minus, Plus } from 'lucide-react'

interface CounterProps {
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'ghost'
  className?: string
}

const Counter = React.forwardRef<HTMLDivElement, CounterProps>(
  (
    {
      value: controlledValue,
      defaultValue = 0,
      onChange,
      min = 0,
      max = Infinity,
      step = 1,
      disabled = false,
      size = 'md',
      variant = 'default',
      className,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue)
    const isControlled = controlledValue !== undefined
    const value = isControlled ? controlledValue : internalValue

    const updateValue = (newValue: number) => {
      const clampedValue = Math.min(Math.max(newValue, min), max)
      if (!isControlled) {
        setInternalValue(clampedValue)
      }
      onChange?.(clampedValue)
    }

    const increment = () => updateValue(value + step)
    const decrement = () => updateValue(value - step)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(e.target.value, 10)
      if (!isNaN(newValue)) {
        updateValue(newValue)
      }
    }

    const sizeClasses = {
      sm: {
        container: 'h-8',
        button: 'w-8 h-8',
        input: 'w-10 text-sm',
        icon: 'h-3 w-3',
      },
      md: {
        container: 'h-10',
        button: 'w-10 h-10',
        input: 'w-14 text-base',
        icon: 'h-4 w-4',
      },
      lg: {
        container: 'h-12',
        button: 'w-12 h-12',
        input: 'w-16 text-lg',
        icon: 'h-5 w-5',
      },
    }

    const variantClasses = {
      default: {
        container: 'bg-muted rounded-lg',
        button: 'hover:bg-muted-foreground/10 active:bg-muted-foreground/20',
      },
      outline: {
        container: 'border rounded-lg',
        button: 'hover:bg-accent active:bg-accent/80',
      },
      ghost: {
        container: '',
        button: 'hover:bg-accent active:bg-accent/80 rounded-lg',
      },
    }

    const sizes = sizeClasses[size]
    const variants = variantClasses[variant]

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center',
          variants.container,
          sizes.container,
          disabled && 'opacity-50 pointer-events-none',
          className
        )}
      >
        <button
          type="button"
          onClick={decrement}
          disabled={disabled || value <= min}
          className={cn(
            'flex items-center justify-center transition-colors',
            'disabled:opacity-30 disabled:cursor-not-allowed',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
            variant === 'ghost' ? '' : 'rounded-l-lg',
            sizes.button,
            variants.button
          )}
          aria-label="Decrease"
        >
          <Minus className={sizes.icon} />
        </button>

        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          onChange={handleInputChange}
          disabled={disabled}
          className={cn(
            'text-center bg-transparent border-none focus:outline-none font-medium',
            'appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
            sizes.input
          )}
          aria-label="Count"
        />

        <button
          type="button"
          onClick={increment}
          disabled={disabled || value >= max}
          className={cn(
            'flex items-center justify-center transition-colors',
            'disabled:opacity-30 disabled:cursor-not-allowed',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
            variant === 'ghost' ? '' : 'rounded-r-lg',
            sizes.button,
            variants.button
          )}
          aria-label="Increase"
        >
          <Plus className={sizes.icon} />
        </button>
      </div>
    )
  }
)
Counter.displayName = 'Counter'

// Compact counter for inline use (e.g., cart quantity)
interface CompactCounterProps extends Omit<CounterProps, 'size' | 'variant'> {}

const CompactCounter = (props: CompactCounterProps) => (
  <Counter size="sm" variant="outline" {...props} />
)

export { Counter, CompactCounter }
