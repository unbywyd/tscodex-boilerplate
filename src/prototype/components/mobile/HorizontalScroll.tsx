// HorizontalScroll - Scrollable horizontal menu/tabs for mobile
import * as React from 'react'
import { cn } from '@/lib/utils'

interface HorizontalScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: 'sm' | 'md' | 'lg'
  padding?: 'none' | 'sm' | 'md'
  snap?: boolean
  fadeEdges?: boolean
}

const HorizontalScroll = React.forwardRef<HTMLDivElement, HorizontalScrollProps>(
  ({ className, gap = 'md', padding = 'md', snap = false, fadeEdges = true, children, ...props }, ref) => {
    const gapClass = { sm: 'gap-2', md: 'gap-3', lg: 'gap-4' }
    const paddingClass = { none: '', sm: 'px-2', md: 'px-4' }

    return (
      <div className={cn('relative', className)} {...props}>
        <div
          ref={ref}
          className={cn(
            'flex overflow-x-auto scrollbar-hide',
            gapClass[gap],
            paddingClass[padding],
            snap && 'snap-x snap-mandatory',
            // Hide scrollbar
            '[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
          )}
        >
          {children}
        </div>
        {fadeEdges && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-background to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-background to-transparent pointer-events-none" />
          </>
        )}
      </div>
    )
  }
)
HorizontalScroll.displayName = 'HorizontalScroll'

// Scroll item with optional snap
interface HorizontalScrollItemProps extends React.HTMLAttributes<HTMLDivElement> {
  snap?: boolean
}

const HorizontalScrollItem = React.forwardRef<HTMLDivElement, HorizontalScrollItemProps>(
  ({ className, snap = true, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex-shrink-0', snap && 'snap-start', className)}
      {...props}
    />
  )
)
HorizontalScrollItem.displayName = 'HorizontalScrollItem'

// Chip-style scrollable tabs
interface ScrollTabsProps {
  items: { value: string; label: string; icon?: React.ReactNode }[]
  value?: string
  onValueChange?: (value: string) => void
  variant?: 'filled' | 'outline' | 'pill'
}

const ScrollTabs = ({ items, value, onValueChange, variant = 'filled' }: ScrollTabsProps) => {
  const baseClass = 'flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap'

  const variantClasses = {
    filled: {
      active: 'bg-primary text-primary-foreground',
      inactive: 'bg-muted text-muted-foreground hover:bg-muted/80',
    },
    outline: {
      active: 'border-2 border-primary text-primary',
      inactive: 'border border-border text-muted-foreground hover:border-foreground hover:text-foreground',
    },
    pill: {
      active: 'bg-primary/10 text-primary border border-primary',
      inactive: 'text-muted-foreground hover:text-foreground',
    },
  }

  return (
    <HorizontalScroll fadeEdges={false}>
      {items.map((item) => {
        const isActive = value === item.value
        return (
          <button
            key={item.value}
            onClick={() => onValueChange?.(item.value)}
            className={cn(
              baseClass,
              isActive ? variantClasses[variant].active : variantClasses[variant].inactive
            )}
          >
            {item.icon && <span className="mr-1.5 [&>svg]:h-4 [&>svg]:w-4 inline-flex">{item.icon}</span>}
            {item.label}
          </button>
        )
      })}
    </HorizontalScroll>
  )
}

export { HorizontalScroll, HorizontalScrollItem, ScrollTabs }
