// FloatingButton - FAB with optional speed dial menu
import * as React from 'react'
import { cn } from '@/lib/utils'
import { Plus, X } from 'lucide-react'

// ============================================
// Types
// ============================================

interface FABAction {
  id: string
  icon: React.ReactNode
  label: string
  onClick: () => void
  color?: 'default' | 'primary' | 'secondary' | 'destructive'
}

interface FloatingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // Icon when closed
  icon?: React.ReactNode
  // Icon when open (for speed dial)
  openIcon?: React.ReactNode
  // Actions for speed dial
  actions?: FABAction[]
  // Position
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center'
  // Size
  size?: 'sm' | 'md' | 'lg'
  // Color
  color?: 'default' | 'primary' | 'secondary' | 'destructive'
  // Extended (with label)
  extended?: boolean
  // Label for extended
  label?: string
  // Show backdrop when open
  showBackdrop?: boolean
}

// ============================================
// Config
// ============================================

const sizeConfig = {
  sm: { button: 'w-12 h-12', icon: 'h-5 w-5', action: 'w-10 h-10', actionIcon: 'h-4 w-4' },
  md: { button: 'w-14 h-14', icon: 'h-6 w-6', action: 'w-12 h-12', actionIcon: 'h-5 w-5' },
  lg: { button: 'w-16 h-16', icon: 'h-7 w-7', action: 'w-14 h-14', actionIcon: 'h-6 w-6' },
}

const colorConfig = {
  default: 'bg-foreground text-background hover:bg-foreground/90',
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
}

const positionConfig = {
  'bottom-right': 'bottom-6 right-6',
  'bottom-left': 'bottom-6 left-6',
  'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
}

// ============================================
// FloatingButton Component
// ============================================

const FloatingButton = React.forwardRef<HTMLButtonElement, FloatingButtonProps>(
  (
    {
      icon = <Plus />,
      openIcon = <X />,
      actions,
      position = 'bottom-right',
      size = 'md',
      color = 'primary',
      extended = false,
      label,
      showBackdrop = true,
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const config = sizeConfig[size]
    const hasActions = actions && actions.length > 0

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (hasActions) {
        setIsOpen(!isOpen)
      }
      onClick?.(e)
    }

    const handleActionClick = (action: FABAction) => {
      action.onClick()
      setIsOpen(false)
    }

    const handleBackdropClick = () => {
      setIsOpen(false)
    }

    return (
      <>
        {/* Backdrop */}
        {showBackdrop && isOpen && (
          <div
            className="absolute inset-0 bg-black/20 z-40 transition-opacity"
            onClick={handleBackdropClick}
          />
        )}

        {/* FAB Container */}
        <div className={cn('absolute z-50', positionConfig[position])}>
          {/* Speed Dial Actions */}
          {hasActions && (
            <div
              className={cn(
                'absolute bottom-full mb-3 flex flex-col-reverse items-center gap-3 transition-all duration-200',
                isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
              )}
            >
              {actions.map((action, index) => (
                <div
                  key={action.id}
                  className="flex items-center gap-3"
                  style={{
                    transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
                  }}
                >
                  {/* Label */}
                  <span
                    className={cn(
                      'px-3 py-1.5 bg-background rounded-lg shadow-lg text-sm font-medium whitespace-nowrap',
                      'transition-all duration-200',
                      isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
                    )}
                  >
                    {action.label}
                  </span>

                  {/* Action button */}
                  <button
                    onClick={() => handleActionClick(action)}
                    className={cn(
                      'rounded-full shadow-lg flex items-center justify-center transition-all duration-200',
                      config.action,
                      colorConfig[action.color || 'default'],
                      isOpen ? 'scale-100' : 'scale-0'
                    )}
                  >
                    <span className={config.actionIcon}>{action.icon}</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Main FAB */}
          <button
            ref={ref}
            onClick={handleClick}
            className={cn(
              'rounded-full shadow-lg flex items-center justify-center transition-all duration-200',
              extended ? 'px-6 gap-2' : config.button,
              colorConfig[color],
              hasActions && isOpen && 'rotate-45',
              className
            )}
            {...props}
          >
            <span className={cn(config.icon, 'transition-transform duration-200')}>
              {hasActions && isOpen ? openIcon : icon}
            </span>
            {extended && label && (
              <span className="font-medium">{label}</span>
            )}
          </button>
        </div>
      </>
    )
  }
)
FloatingButton.displayName = 'FloatingButton'

// ============================================
// Simple FAB - No speed dial
// ============================================

interface SimpleFABProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center'
  size?: 'sm' | 'md' | 'lg'
  color?: 'default' | 'primary' | 'secondary' | 'destructive'
}

const SimpleFAB = React.forwardRef<HTMLButtonElement, SimpleFABProps>(
  ({ icon, position = 'bottom-right', size = 'md', color = 'primary', className, ...props }, ref) => {
    const config = sizeConfig[size]

    return (
      <button
        ref={ref}
        className={cn(
          'absolute z-50 rounded-full shadow-lg flex items-center justify-center',
          positionConfig[position],
          config.button,
          colorConfig[color],
          className
        )}
        {...props}
      >
        <span className={config.icon}>{icon}</span>
      </button>
    )
  }
)
SimpleFAB.displayName = 'SimpleFAB'

// ============================================
// Extended FAB - With label
// ============================================

interface ExtendedFABProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
  label: string
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center'
  color?: 'default' | 'primary' | 'secondary' | 'destructive'
}

const ExtendedFAB = React.forwardRef<HTMLButtonElement, ExtendedFABProps>(
  ({ icon, label, position = 'bottom-right', color = 'primary', className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'absolute z-50 h-14 px-6 rounded-full shadow-lg flex items-center gap-2',
        positionConfig[position],
        colorConfig[color],
        className
      )}
      {...props}
    >
      <span className="h-6 w-6">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  )
)
ExtendedFAB.displayName = 'ExtendedFAB'

export { FloatingButton, SimpleFAB, ExtendedFAB }
