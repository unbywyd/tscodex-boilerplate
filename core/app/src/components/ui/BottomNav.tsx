// BottomNav - Mobile bottom tab navigation
import * as React from 'react'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface BottomNavItem {
  /** Icon - can be JSX element or Lucide component */
  icon: React.ReactNode | LucideIcon
  label: string
  value: string
  /** @deprecated Use 'value' instead */
  id?: string
  badge?: number | string
}

interface BottomNavProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: BottomNavItem[]
  value?: string
  /** @deprecated Use 'value' instead */
  activeId?: string
  onValueChange?: (value: string) => void
  /** @deprecated Use 'onValueChange' instead */
  onChange?: (value: string) => void
  fixed?: boolean
}

// Helper to check if icon is a component (function) vs JSX element
const isIconComponent = (icon: React.ReactNode | LucideIcon): icon is LucideIcon => {
  return typeof icon === 'function'
}

const BottomNav = React.forwardRef<HTMLDivElement, BottomNavProps>(
  ({ className, items, value, activeId, onValueChange, onChange, fixed = false, ...props }, ref) => {
    // Support deprecated props
    const activeValue = value ?? activeId
    const handleChange = onValueChange ?? onChange

    return (
      <nav
        ref={ref}
        className={cn(
          fixed ? 'fixed bottom-0 left-0 right-0 z-50' : 'relative',
          'bg-background border-t',
          'pb-safe', // for iOS safe area
          className
        )}
        {...props}
      >
        <div className="flex items-stretch h-14">
          {items.map((item) => {
            // Support deprecated 'id' prop
            const itemValue = item.value ?? item.id ?? ''
            const isActive = activeValue === itemValue

            // Render icon - support both Component and JSX
            const IconElement = isIconComponent(item.icon)
              ? <item.icon className="h-5 w-5" />
              : item.icon

            return (
              <button
                key={itemValue}
                onClick={() => handleChange?.(itemValue)}
                className={cn(
                  'flex-1 flex flex-col items-center justify-center gap-0.5',
                  'transition-colors relative',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <span className="relative [&>svg]:h-5 [&>svg]:w-5">
                  {IconElement}
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
