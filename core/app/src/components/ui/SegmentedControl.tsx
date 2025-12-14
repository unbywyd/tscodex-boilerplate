// SegmentedControl - iOS-style segmented control
import * as React from 'react'
import { cn } from '@/lib/utils'

// ============================================
// Types
// ============================================

interface SegmentOption {
  value: string
  label: string
  icon?: React.ReactNode
  disabled?: boolean
}

interface SegmentedControlProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: SegmentOption[]
  value: string
  onChange: (value: string) => void
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'pill'
  fullWidth?: boolean
  disabled?: boolean
}

// ============================================
// Size Config
// ============================================

const sizeConfig = {
  sm: { container: 'h-8 p-0.5', segment: 'px-3 text-xs', icon: 'h-3 w-3' },
  md: { container: 'h-10 p-1', segment: 'px-4 text-sm', icon: 'h-4 w-4' },
  lg: { container: 'h-12 p-1', segment: 'px-5 text-base', icon: 'h-5 w-5' },
}

// ============================================
// SegmentedControl Component
// ============================================

const SegmentedControl = React.forwardRef<HTMLDivElement, SegmentedControlProps>(
  (
    {
      options,
      value,
      onChange,
      size = 'md',
      variant = 'default',
      fullWidth = false,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const config = sizeConfig[size]
    const activeIndex = options.findIndex((o) => o.value === value)

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-center bg-muted rounded-lg',
          variant === 'pill' && 'rounded-full',
          config.container,
          fullWidth && 'w-full',
          disabled && 'opacity-50 pointer-events-none',
          className
        )}
        role="tablist"
        {...props}
      >
        {/* Sliding background indicator */}
        <div
          className={cn(
            'absolute bg-background shadow-sm transition-all duration-200 ease-out',
            variant === 'default' && 'rounded-md',
            variant === 'pill' && 'rounded-full',
            'top-1 bottom-1'
          )}
          style={{
            left: `calc(${(activeIndex / options.length) * 100}% + 4px)`,
            width: `calc(${100 / options.length}% - 8px)`,
          }}
        />

        {/* Segments */}
        {options.map((option) => {
          const isActive = value === option.value
          const isDisabled = disabled || option.disabled

          return (
            <button
              key={option.value}
              role="tab"
              aria-selected={isActive}
              disabled={isDisabled}
              onClick={() => !isDisabled && onChange(option.value)}
              className={cn(
                'relative z-10 flex items-center justify-center gap-1.5 font-medium transition-colors',
                config.segment,
                fullWidth ? 'flex-1' : '',
                isActive
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground/80',
                isDisabled && 'cursor-not-allowed opacity-50'
              )}
            >
              {option.icon && (
                <span className={config.icon}>{option.icon}</span>
              )}
              {option.label}
            </button>
          )
        })}
      </div>
    )
  }
)
SegmentedControl.displayName = 'SegmentedControl'

// ============================================
// Simple Segment - Two options only
// ============================================

interface SimpleSegmentProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  leftLabel: string
  rightLabel: string
  value: 'left' | 'right'
  onChange: (value: 'left' | 'right') => void
  size?: 'sm' | 'md' | 'lg'
}

const SimpleSegment = React.forwardRef<HTMLDivElement, SimpleSegmentProps>(
  ({ leftLabel, rightLabel, value, onChange, size = 'md', ...props }, ref) => (
    <SegmentedControl
      ref={ref}
      options={[
        { value: 'left', label: leftLabel },
        { value: 'right', label: rightLabel },
      ]}
      value={value}
      onChange={(v) => onChange(v as 'left' | 'right')}
      size={size}
      {...props}
    />
  )
)
SimpleSegment.displayName = 'SimpleSegment'

// ============================================
// Icon Segment - Icons only
// ============================================

interface IconSegmentProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: { value: string; icon: React.ReactNode; label?: string }[]
  value: string
  onChange: (value: string) => void
  size?: 'sm' | 'md' | 'lg'
}

const iconSizeConfig = {
  sm: { container: 'h-8 p-0.5', button: 'w-8 h-7', icon: 'h-4 w-4' },
  md: { container: 'h-10 p-1', button: 'w-10 h-8', icon: 'h-5 w-5' },
  lg: { container: 'h-12 p-1', button: 'w-12 h-10', icon: 'h-6 w-6' },
}

const IconSegment = React.forwardRef<HTMLDivElement, IconSegmentProps>(
  ({ options, value, onChange, size = 'md', className, ...props }, ref) => {
    const config = iconSizeConfig[size]
    const activeIndex = options.findIndex((o) => o.value === value)

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-center bg-muted rounded-lg',
          config.container,
          className
        )}
        {...props}
      >
        {/* Sliding indicator */}
        <div
          className="absolute bg-background shadow-sm rounded-md transition-all duration-200 ease-out top-1 bottom-1"
          style={{
            left: `calc(${(activeIndex / options.length) * 100}% + 4px)`,
            width: `calc(${100 / options.length}% - 8px)`,
          }}
        />

        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            aria-label={option.label}
            className={cn(
              'relative z-10 flex items-center justify-center transition-colors',
              config.button,
              value === option.value
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground/80'
            )}
          >
            <span className={config.icon}>{option.icon}</span>
          </button>
        ))}
      </div>
    )
  }
)
IconSegment.displayName = 'IconSegment'

export { SegmentedControl, SimpleSegment, IconSegment }
