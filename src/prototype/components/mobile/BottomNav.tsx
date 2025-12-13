// BottomNav - Mobile bottom tab navigation
import * as React from 'react'
import { cn } from '@/lib/utils'

interface BottomNavItem {
  icon: React.ReactNode
  label: string
  value: string
  badge?: number | string
}

interface BottomNavProps extends React.HTMLAttributes<HTMLDivElement> {
  items: BottomNavItem[]
  value?: string
  onValueChange?: (value: string) => void
}

const BottomNav = React.forwardRef<HTMLDivElement, BottomNavProps>(
  ({ className, items, value, onValueChange, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50',
          'bg-background border-t',
          'pb-safe', // for iOS safe area
          className
        )}
        {...props}
      >
        <div className="flex items-stretch h-14">
          {items.map((item) => {
            const isActive = value === item.value
            return (
              <button
                key={item.value}
                onClick={() => onValueChange?.(item.value)}
                className={cn(
                  'flex-1 flex flex-col items-center justify-center gap-0.5',
                  'transition-colors relative',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <span className="relative [&>svg]:h-5 [&>svg]:w-5">
                  {item.icon}
                  {item.badge !== undefined && (
                    <span
                      className={cn(
                        'absolute -top-1 -right-1 min-w-[16px] h-4 px-1',
                        'text-[10px] font-medium leading-4 text-center',
                        'bg-destructive text-destructive-foreground rounded-full'
                      )}
                    >
                      {typeof item.badge === 'number' && item.badge > 99
                        ? '99+'
                        : item.badge}
                    </span>
                  )}
                </span>
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    )
  }
)
BottomNav.displayName = 'BottomNav'

export { BottomNav, type BottomNavItem }
