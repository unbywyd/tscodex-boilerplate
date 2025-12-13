// IconButton - Round button variants for icons
import * as React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

type IconButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary'
type IconButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type IconButtonShape = 'circle' | 'rounded' | 'square'

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant
  size?: IconButtonSize
  shape?: IconButtonShape
  loading?: boolean
  badge?: number | string
  badgeVariant?: 'default' | 'destructive'
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      shape = 'circle',
      loading,
      badge,
      badgeVariant = 'destructive',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const variantClasses: Record<IconButtonVariant, string> = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    }

    const sizeClasses: Record<IconButtonSize, string> = {
      xs: 'h-7 w-7 [&>svg]:h-3.5 [&>svg]:w-3.5',
      sm: 'h-8 w-8 [&>svg]:h-4 [&>svg]:w-4',
      md: 'h-10 w-10 [&>svg]:h-5 [&>svg]:w-5',
      lg: 'h-12 w-12 [&>svg]:h-6 [&>svg]:w-6',
      xl: 'h-14 w-14 [&>svg]:h-7 [&>svg]:w-7',
    }

    const shapeClasses: Record<IconButtonShape, string> = {
      circle: 'rounded-full',
      rounded: 'rounded-lg',
      square: 'rounded-none',
    }

    const badgeSizeClasses: Record<IconButtonSize, string> = {
      xs: 'min-w-[14px] h-[14px] text-[9px] -top-0.5 -right-0.5',
      sm: 'min-w-[16px] h-[16px] text-[10px] -top-0.5 -right-0.5',
      md: 'min-w-[18px] h-[18px] text-[10px] -top-1 -right-1',
      lg: 'min-w-[20px] h-[20px] text-xs -top-1 -right-1',
      xl: 'min-w-[22px] h-[22px] text-xs -top-1.5 -right-1.5',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'relative inline-flex items-center justify-center',
          'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'disabled:pointer-events-none disabled:opacity-50',
          variantClasses[variant],
          sizeClasses[size],
          shapeClasses[shape],
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="animate-spin" />
        ) : (
          children
        )}
        {badge !== undefined && !loading && (
          <span
            className={cn(
              'absolute px-1 rounded-full font-medium leading-none flex items-center justify-center',
              badgeSizeClasses[size],
              badgeVariant === 'destructive'
                ? 'bg-destructive text-destructive-foreground'
                : 'bg-primary text-primary-foreground'
            )}
          >
            {typeof badge === 'number' && badge > 99 ? '99+' : badge}
          </span>
        )}
      </button>
    )
  }
)
IconButton.displayName = 'IconButton'

// FAB - Floating Action Button
interface FABProps extends Omit<IconButtonProps, 'size' | 'shape'> {
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center'
  extended?: boolean
  label?: string
}

const FAB = React.forwardRef<HTMLButtonElement, FABProps>(
  ({ className, position = 'bottom-right', extended, label, children, ...props }, ref) => {
    const positionClasses: Record<string, string> = {
      'bottom-right': 'fixed bottom-6 right-6',
      'bottom-left': 'fixed bottom-6 left-6',
      'bottom-center': 'fixed bottom-6 left-1/2 -translate-x-1/2',
    }

    if (extended && label) {
      return (
        <button
          ref={ref}
          className={cn(
            'inline-flex items-center gap-2 px-5 h-14 rounded-full shadow-lg',
            'bg-primary text-primary-foreground hover:bg-primary/90',
            'transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            'disabled:pointer-events-none disabled:opacity-50',
            '[&>svg]:h-6 [&>svg]:w-6',
            positionClasses[position],
            className
          )}
          {...props}
        >
          {children}
          <span className="font-medium">{label}</span>
        </button>
      )
    }

    return (
      <IconButton
        ref={ref}
        size="lg"
        shape="circle"
        className={cn('shadow-lg', positionClasses[position], className)}
        {...props}
      >
        {children}
      </IconButton>
    )
  }
)
FAB.displayName = 'FAB'

export { IconButton, FAB }
