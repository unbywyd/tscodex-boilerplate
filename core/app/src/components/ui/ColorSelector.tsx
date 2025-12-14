// ColorSelector - Color/swatch selection for e-commerce
import * as React from 'react'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

// ============================================
// Types
// ============================================

interface ColorOption {
  value: string
  label: string
  color: string // hex or CSS color
  available?: boolean
  image?: string // optional swatch image
}

interface ColorSelectorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  // Options
  options: ColorOption[]
  // Selected value
  value?: string
  // On change
  onChange?: (value: string) => void
  // Size of swatches
  size?: 'sm' | 'md' | 'lg'
  // Show labels
  showLabel?: boolean
  // Show selected label
  showSelectedLabel?: boolean
  // Variant
  variant?: 'circle' | 'square' | 'rounded'
  // Disabled
  disabled?: boolean
}

// ============================================
// Color Selector
// ============================================

const sizeConfig = {
  sm: { swatch: 'w-6 h-6', check: 'h-3 w-3' },
  md: { swatch: 'w-8 h-8', check: 'h-4 w-4' },
  lg: { swatch: 'w-10 h-10', check: 'h-5 w-5' },
}

const variantConfig = {
  circle: 'rounded-full',
  square: 'rounded-none',
  rounded: 'rounded-md',
}

// Determine if color is light for check mark contrast
const isLightColor = (color: string): boolean => {
  // Handle hex colors
  if (color.startsWith('#')) {
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5
  }
  // Default to dark check for non-hex colors
  return false
}

const ColorSelector = React.forwardRef<HTMLDivElement, ColorSelectorProps>(
  (
    {
      options,
      value,
      onChange,
      size = 'md',
      showLabel = false,
      showSelectedLabel = true,
      variant = 'circle',
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const config = sizeConfig[size]
    const selectedOption = options.find((o) => o.value === value)

    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        {/* Selected label */}
        {showSelectedLabel && selectedOption && (
          <p className="text-sm">
            <span className="text-muted-foreground">Color: </span>
            <span className="font-medium">{selectedOption.label}</span>
          </p>
        )}

        {/* Swatches */}
        <div className="flex flex-wrap gap-2" role="radiogroup">
          {options.map((option) => {
            const isSelected = value === option.value
            const isAvailable = option.available !== false
            const isLight = isLightColor(option.color)

            return (
              <div key={option.value} className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={option.label}
                  disabled={disabled || !isAvailable}
                  onClick={() => isAvailable && onChange?.(option.value)}
                  className={cn(
                    'relative border-2 transition-all overflow-hidden',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    config.swatch,
                    variantConfig[variant],
                    isSelected
                      ? 'border-primary ring-2 ring-primary/30'
                      : 'border-transparent hover:border-muted-foreground/50',
                    !isAvailable && 'opacity-40 cursor-not-allowed',
                    disabled && 'opacity-50 cursor-not-allowed'
                  )}
                  style={{ backgroundColor: option.image ? undefined : option.color }}
                >
                  {/* Image swatch */}
                  {option.image && (
                    <img
                      src={option.image}
                      alt={option.label}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Check mark */}
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check
                        className={cn(
                          config.check,
                          isLight || option.image ? 'text-black' : 'text-white'
                        )}
                      />
                    </div>
                  )}

                  {/* Unavailable indicator */}
                  {!isAvailable && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-0.5 bg-red-500 rotate-45 transform" />
                    </div>
                  )}
                </button>

                {/* Label below swatch */}
                {showLabel && (
                  <span className="text-xs text-muted-foreground">{option.label}</span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ColorSelector.displayName = 'ColorSelector'

// ============================================
// Color Dot - Single color indicator
// ============================================

interface ColorDotProps extends React.HTMLAttributes<HTMLDivElement> {
  color: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  showBorder?: boolean
}

const dotSizes = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
}

const ColorDot = React.forwardRef<HTMLDivElement, ColorDotProps>(
  ({ color, size = 'sm', showBorder = true, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-full flex-shrink-0',
        dotSizes[size],
        showBorder && 'border border-border',
        className
      )}
      style={{ backgroundColor: color }}
      {...props}
    />
  )
)
ColorDot.displayName = 'ColorDot'

// ============================================
// Color Stack - Multiple colors stacked
// ============================================

interface ColorStackProps extends React.HTMLAttributes<HTMLDivElement> {
  colors: string[]
  max?: number
  size?: 'sm' | 'md' | 'lg'
}

const stackSizes = {
  sm: { dot: 'w-4 h-4', offset: '-ml-1' },
  md: { dot: 'w-5 h-5', offset: '-ml-1.5' },
  lg: { dot: 'w-6 h-6', offset: '-ml-2' },
}

const ColorStack = React.forwardRef<HTMLDivElement, ColorStackProps>(
  ({ colors, max = 4, size = 'sm', className, ...props }, ref) => {
    const displayColors = colors.slice(0, max)
    const remaining = colors.length - max
    const config = stackSizes[size]

    return (
      <div ref={ref} className={cn('flex items-center', className)} {...props}>
        {displayColors.map((color, i) => (
          <div
            key={i}
            className={cn(
              'rounded-full border-2 border-background',
              config.dot,
              i > 0 && config.offset
            )}
            style={{ backgroundColor: color, zIndex: displayColors.length - i }}
          />
        ))}
        {remaining > 0 && (
          <span className={cn('text-xs text-muted-foreground', config.offset, 'pl-2')}>
            +{remaining}
          </span>
        )}
      </div>
    )
  }
)
ColorStack.displayName = 'ColorStack'

// ============================================
// Preset Color Options
// ============================================

const commonColors: ColorOption[] = [
  { value: 'black', label: 'Black', color: '#000000' },
  { value: 'white', label: 'White', color: '#FFFFFF' },
  { value: 'gray', label: 'Gray', color: '#6B7280' },
  { value: 'red', label: 'Red', color: '#EF4444' },
  { value: 'orange', label: 'Orange', color: '#F97316' },
  { value: 'yellow', label: 'Yellow', color: '#EAB308' },
  { value: 'green', label: 'Green', color: '#22C55E' },
  { value: 'blue', label: 'Blue', color: '#3B82F6' },
  { value: 'purple', label: 'Purple', color: '#A855F7' },
  { value: 'pink', label: 'Pink', color: '#EC4899' },
]

export { ColorSelector, ColorDot, ColorStack, commonColors }
