// MobileList - iOS/Android style list for settings, menus, profiles
import * as React from 'react'
import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'

// List container with optional title
interface MobileListProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  footer?: string
}

const MobileList = React.forwardRef<HTMLDivElement, MobileListProps>(
  ({ className, title, footer, children, ...props }, ref) => (
    <div ref={ref} className={cn('mb-6', className)} {...props}>
      {title && (
        <div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </div>
      )}
      <div className="bg-card rounded-xl border divide-y divide-border overflow-hidden">
        {children}
      </div>
      {footer && (
        <div className="px-4 py-2 text-xs text-muted-foreground">
          {footer}
        </div>
      )}
    </div>
  )
)
MobileList.displayName = 'MobileList'

// List item - flexible row with icon, text, value, chevron
interface MobileListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  iconBg?: string // tailwind bg color like "bg-blue-500"
  title: string
  subtitle?: string
  value?: React.ReactNode
  chevron?: boolean
  destructive?: boolean
  disabled?: boolean
  onPress?: () => void
}

const MobileListItem = React.forwardRef<HTMLDivElement, MobileListItemProps>(
  (
    {
      className,
      icon,
      iconBg,
      title,
      subtitle,
      value,
      chevron = false,
      destructive = false,
      disabled = false,
      onPress,
      ...props
    },
    ref
  ) => {
    const Component = onPress ? 'button' : 'div'

    return (
      <Component
        ref={ref as any}
        onClick={disabled ? undefined : onPress}
        disabled={disabled}
        className={cn(
          'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
          onPress && !disabled && 'hover:bg-muted/50 active:bg-muted cursor-pointer',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...(props as any)}
      >
        {/* Icon */}
        {icon && (
          <div
            className={cn(
              'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
              iconBg || 'bg-muted',
              !iconBg && 'text-muted-foreground'
            )}
          >
            <span className={cn(iconBg && 'text-white', '[&>svg]:h-4 [&>svg]:w-4')}>
              {icon}
            </span>
          </div>
        )}

        {/* Text content */}
        <div className="flex-1 min-w-0">
          <div
            className={cn(
              'text-sm font-medium truncate',
              destructive && 'text-destructive'
            )}
          >
            {title}
          </div>
          {subtitle && (
            <div className="text-xs text-muted-foreground truncate">{subtitle}</div>
          )}
        </div>

        {/* Value */}
        {value && (
          <div className="flex-shrink-0 text-sm text-muted-foreground">{value}</div>
        )}

        {/* Chevron */}
        {chevron && (
          <ChevronRight className="flex-shrink-0 h-4 w-4 text-muted-foreground" />
        )}
      </Component>
    )
  }
)
MobileListItem.displayName = 'MobileListItem'

// Separator for visual grouping within a list
const MobileListSeparator = ({ className }: { className?: string }) => (
  <div className={cn('h-px bg-border mx-4', className)} />
)

export { MobileList, MobileListItem, MobileListSeparator }
