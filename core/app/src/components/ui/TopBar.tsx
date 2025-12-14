// TopBar - Mobile navigation bar with back button, title, actions
import * as React from 'react'
import { cn } from '@/lib/utils'
import { ChevronLeft, X } from 'lucide-react'

interface TopBarProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  back?: boolean | (() => void)
  close?: boolean | (() => void)
  leftAction?: React.ReactNode
  rightAction?: React.ReactNode
  /** @deprecated Use 'rightAction' instead */
  action?: React.ReactNode
  transparent?: boolean
  border?: boolean
}

const TopBar = React.forwardRef<HTMLDivElement, TopBarProps>(
  (
    {
      className,
      title,
      subtitle,
      back,
      close,
      leftAction,
      rightAction,
      action,
      transparent = false,
      border = true,
      ...props
    },
    ref
  ) => {
    // Support deprecated 'action' prop
    const resolvedRightAction = rightAction ?? action
    const handleBack = () => {
      if (typeof back === 'function') {
        back()
      } else if (back && typeof window !== 'undefined') {
        window.history.back()
      }
    }

    const handleClose = () => {
      if (typeof close === 'function') {
        close()
      }
    }

    return (
      <header
        ref={ref}
        className={cn(
          'sticky top-0 z-40 flex items-center h-14 px-2 gap-1',
          !transparent && 'bg-background',
          border && 'border-b',
          className
        )}
        {...props}
      >
        {/* Left side */}
        <div className="flex items-center min-w-[60px]">
          {back && (
            <button
              onClick={handleBack}
              className="p-2 -ml-1 rounded-full hover:bg-muted transition-colors"
              aria-label="Back"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}
          {close && (
            <button
              onClick={handleClose}
              className="p-2 -ml-1 rounded-full hover:bg-muted transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          {leftAction}
        </div>

        {/* Center - Title */}
        <div className="flex-1 text-center min-w-0">
          {title && (
            <h1 className="text-base font-semibold truncate">{title}</h1>
          )}
          {subtitle && (
            <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center justify-end min-w-[60px] gap-1">
          {resolvedRightAction}
        </div>
      </header>
    )
  }
)
TopBar.displayName = 'TopBar'

// Action button for TopBar
interface TopBarActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode
  label?: string
}

const TopBarAction = React.forwardRef<HTMLButtonElement, TopBarActionProps>(
  ({ className, icon, label, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'p-2 rounded-full hover:bg-muted transition-colors text-sm font-medium',
        'flex items-center gap-1',
        className
      )}
      {...props}
    >
      {icon && <span className="[&>svg]:h-5 [&>svg]:w-5">{icon}</span>}
      {label || children}
    </button>
  )
)
TopBarAction.displayName = 'TopBarAction'

export { TopBar, TopBarAction }
