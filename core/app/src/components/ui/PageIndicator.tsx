// PageIndicator - Dots for swipe pages / onboarding
import * as React from 'react'
import { cn } from '@/lib/utils'

// ============================================
// PageIndicator (Dots)
// ============================================

interface PageIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  // Total pages
  total: number
  // Current page (0-indexed)
  current: number
  // On page change (for clickable dots)
  onPageChange?: (page: number) => void
  // Size
  size?: 'sm' | 'md' | 'lg'
  // Variant
  variant?: 'dots' | 'lines' | 'pills'
  // Color
  color?: 'default' | 'primary' | 'white'
  // Max visible dots (for many pages)
  maxVisible?: number
}

const sizeConfig = {
  sm: { dot: 'w-1.5 h-1.5', line: 'w-4 h-1', pill: 'w-4 h-1.5', gap: 'gap-1.5', active: 'w-4' },
  md: { dot: 'w-2 h-2', line: 'w-6 h-1.5', pill: 'w-6 h-2', gap: 'gap-2', active: 'w-6' },
  lg: { dot: 'w-2.5 h-2.5', line: 'w-8 h-2', pill: 'w-8 h-2.5', gap: 'gap-2.5', active: 'w-8' },
}

const colorConfig = {
  default: { active: 'bg-foreground', inactive: 'bg-muted-foreground/30' },
  primary: { active: 'bg-primary', inactive: 'bg-primary/30' },
  white: { active: 'bg-white', inactive: 'bg-white/30' },
}

const PageIndicator = React.forwardRef<HTMLDivElement, PageIndicatorProps>(
  (
    {
      total,
      current,
      onPageChange,
      size = 'md',
      variant = 'dots',
      color = 'default',
      maxVisible = 5,
      className,
      ...props
    },
    ref
  ) => {
    const config = sizeConfig[size]
    const colors = colorConfig[color]

    // Calculate visible range for many pages
    const getVisibleRange = () => {
      if (total <= maxVisible) {
        return Array.from({ length: total }, (_, i) => i)
      }

      const half = Math.floor(maxVisible / 2)
      let start = current - half
      let end = current + half

      if (start < 0) {
        start = 0
        end = maxVisible - 1
      } else if (end >= total) {
        end = total - 1
        start = total - maxVisible
      }

      return Array.from({ length: end - start + 1 }, (_, i) => start + i)
    }

    const visiblePages = getVisibleRange()
    const showStartEllipsis = total > maxVisible && visiblePages[0] > 0
    const showEndEllipsis = total > maxVisible && visiblePages[visiblePages.length - 1] < total - 1

    const handleClick = (page: number) => {
      if (onPageChange) {
        onPageChange(page)
      }
    }

    const renderIndicator = (index: number, isActive: boolean) => {
      const isClickable = !!onPageChange

      const baseClasses = cn(
        'rounded-full transition-all duration-200',
        isActive ? colors.active : colors.inactive,
        isClickable && 'cursor-pointer hover:opacity-80'
      )

      if (variant === 'dots') {
        return (
          <button
            key={index}
            onClick={() => handleClick(index)}
            disabled={!isClickable}
            className={cn(
              baseClasses,
              config.dot,
              isActive && config.active
            )}
            aria-label={`Go to page ${index + 1}`}
            aria-current={isActive ? 'true' : undefined}
          />
        )
      }

      if (variant === 'lines') {
        return (
          <button
            key={index}
            onClick={() => handleClick(index)}
            disabled={!isClickable}
            className={cn(baseClasses, config.line)}
            aria-label={`Go to page ${index + 1}`}
          />
        )
      }

      // Pills
      return (
        <button
          key={index}
          onClick={() => handleClick(index)}
          disabled={!isClickable}
          className={cn(
            baseClasses,
            isActive ? config.pill : config.dot
          )}
          aria-label={`Go to page ${index + 1}`}
        />
      )
    }

    return (
      <div
        ref={ref}
        role="tablist"
        aria-label="Page indicators"
        className={cn('flex items-center', config.gap, className)}
        {...props}
      >
        {showStartEllipsis && (
          <span className={cn('text-xs', colors.inactive)}>...</span>
        )}

        {visiblePages.map((index) => renderIndicator(index, index === current))}

        {showEndEllipsis && (
          <span className={cn('text-xs', colors.inactive)}>...</span>
        )}
      </div>
    )
  }
)
PageIndicator.displayName = 'PageIndicator'

// ============================================
// Progress Dots - With fill animation
// ============================================

interface ProgressDotsProps extends React.HTMLAttributes<HTMLDivElement> {
  total: number
  current: number
  size?: 'sm' | 'md' | 'lg'
  color?: 'default' | 'primary' | 'white'
}

const ProgressDots = React.forwardRef<HTMLDivElement, ProgressDotsProps>(
  ({ total, current, size = 'md', color = 'default', className, ...props }, ref) => {
    const config = sizeConfig[size]
    const colors = colorConfig[color]

    return (
      <div ref={ref} className={cn('flex items-center', config.gap, className)} {...props}>
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={cn(
              'rounded-full transition-all duration-300',
              config.dot,
              i <= current ? colors.active : colors.inactive
            )}
          />
        ))}
      </div>
    )
  }
)
ProgressDots.displayName = 'ProgressDots'

// ============================================
// Numbered Indicator
// ============================================

interface NumberedIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  current: number
  total: number
  size?: 'sm' | 'md' | 'lg'
}

const NumberedIndicator = React.forwardRef<HTMLDivElement, NumberedIndicatorProps>(
  ({ current, total, size = 'md', className, ...props }, ref) => {
    const textSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'

    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-1 text-muted-foreground', textSize, className)}
        {...props}
      >
        <span className="font-medium text-foreground">{current + 1}</span>
        <span>/</span>
        <span>{total}</span>
      </div>
    )
  }
)
NumberedIndicator.displayName = 'NumberedIndicator'

export { PageIndicator, ProgressDots, NumberedIndicator }
