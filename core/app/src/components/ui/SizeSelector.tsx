// SizeSelector - Size/variant selection component (e-commerce)
import * as React from 'react'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

// ============================================
// Types
// ============================================

interface SizeOption {
  value: string
  label: string
  available?: boolean
  description?: string
}

interface SizeSelectorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  // Options
  options: SizeOption[]
  // Selected value
  value?: string
  // On change
  onChange?: (value: string) => void
  // Size of buttons
  size?: 'sm' | 'md' | 'lg'
  // Variant
  variant?: 'default' | 'outline' | 'pill'
  // Allow deselect
  allowDeselect?: boolean
  // Disabled
  disabled?: boolean
}

// ============================================
// Size Selector
// ============================================

const sizeConfig = {
  sm: 'h-8 min-w-[2rem] px-2 text-xs',
  md: 'h-10 min-w-[2.5rem] px-3 text-sm',
  lg: 'h-12 min-w-[3rem] px-4 text-base',
}

const SizeSelector = React.forwardRef<HTMLDivElement, SizeSelectorProps>(
  (
    {
      options,
      value,
      onChange,
      size = 'md',
      variant = 'default',
      allowDeselect = false,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const handleSelect = (optionValue: string, available: boolean) => {
      if (disabled || !available) return

      if (allowDeselect && value === optionValue) {
        onChange?.('')
      } else {
        onChange?.(optionValue)
      }
    }

    return (
      <div
        ref={ref}
        className={cn('flex flex-wrap gap-2', className)}
        role="radiogroup"
        {...props}
      >
        {options.map((option) => {
          const isSelected = value === option.value
          const isAvailable = option.available !== false

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled || !isAvailable}
              onClick={() => handleSelect(option.value, isAvailable)}
              className={cn(
                'inline-flex items-center justify-center font-medium rounded-md border transition-all',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                sizeConfig[size],
                // Variant styles
                variant === 'default' && [
                  isSelected
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background hover:bg-muted border-input',
                ],
                variant === 'outline' && [
                  isSelected
                    ? 'border-primary text-primary border-2'
                    : 'border-input hover:border-primary/50',
                ],
                variant === 'pill' && [
                  'rounded-full',
                  isSelected
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted hover:bg-muted/80 border-transparent',
                ],
                // Disabled/unavailable styles
                !isAvailable && 'opacity-40 cursor-not-allowed line-through',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    )
  }
)
SizeSelector.displayName = 'SizeSelector'

// ============================================
// Size Guide Button
// ============================================

interface SizeGuideProps {
  onClick?: () => void
  className?: string
}

const SizeGuide = ({ onClick, className }: SizeGuideProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'text-sm text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors',
      className
    )}
  >
    Size Guide
  </button>
)

// ============================================
// Size Pills - Compact horizontal list
// ============================================

interface SizePillsProps extends Omit<SizeSelectorProps, 'variant'> {}

const SizePills = React.forwardRef<HTMLDivElement, SizePillsProps>((props, ref) => (
  <SizeSelector ref={ref} variant="pill" {...props} />
))
SizePills.displayName = 'SizePills'

// ============================================
// Size Grid - For shoe sizes etc.
// ============================================

interface SizeGridProps extends Omit<SizeSelectorProps, 'variant'> {
  columns?: number
}

const SizeGrid = React.forwardRef<HTMLDivElement, SizeGridProps>(
  ({ columns = 5, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('grid gap-2', className)}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      <SizeSelector {...props} className="contents" />
    </div>
  )
)
SizeGrid.displayName = 'SizeGrid'

// ============================================
// Variant Selector - With images
// ============================================

interface VariantOption {
  value: string
  label: string
  image?: string
  available?: boolean
}

interface VariantSelectorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: VariantOption[]
  value?: string
  onChange?: (value: string) => void
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

const variantSizeConfig = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-20 h-20',
}

const VariantSelector = React.forwardRef<HTMLDivElement, VariantSelectorProps>(
  (
    {
      options,
      value,
      onChange,
      size = 'md',
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn('flex flex-wrap gap-2', className)} {...props}>
        {options.map((option) => {
          const isSelected = value === option.value
          const isAvailable = option.available !== false

          return (
            <button
              key={option.value}
              type="button"
              disabled={disabled || !isAvailable}
              onClick={() => isAvailable && onChange?.(option.value)}
              className={cn(
                'relative rounded-lg border-2 overflow-hidden transition-all',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                variantSizeConfig[size],
                isSelected ? 'border-primary' : 'border-transparent hover:border-muted-foreground/50',
                !isAvailable && 'opacity-40 cursor-not-allowed',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {option.image ? (
                <img
                  src={option.image}
                  alt={option.label}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">{option.label}</span>
                </div>
              )}

              {isSelected && (
                <div className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
              )}

              {!isAvailable && (
                <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">Sold out</span>
                </div>
              )}
            </button>
          )
        })}
      </div>
    )
  }
)
VariantSelector.displayName = 'VariantSelector'

export { SizeSelector, SizeGuide, SizePills, SizeGrid, VariantSelector }
