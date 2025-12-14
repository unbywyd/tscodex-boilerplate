// MobileCard - Card variants optimized for mobile
import * as React from 'react'
import { cn } from '@/lib/utils'
import { MoreVertical } from 'lucide-react'

// Basic mobile card
interface MobileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  onPress?: () => void
}

const MobileCard = React.forwardRef<HTMLDivElement, MobileCardProps>(
  ({ className, variant = 'default', padding = 'md', onPress, children, ...props }, ref) => {
    const variantClasses = {
      default: 'bg-card',
      elevated: 'bg-card shadow-md',
      outlined: 'bg-card border',
    }

    const paddingClasses = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    }

    const Component = onPress ? 'button' : 'div'

    return (
      <Component
        ref={ref as any}
        onClick={onPress}
        className={cn(
          'rounded-xl text-left w-full',
          variantClasses[variant],
          paddingClasses[padding],
          onPress && 'hover:bg-accent/50 active:bg-accent transition-colors cursor-pointer',
          className
        )}
        {...(props as any)}
      >
        {children}
      </Component>
    )
  }
)
MobileCard.displayName = 'MobileCard'

// Product card with image
interface ProductCardProps {
  image: string
  title: string
  subtitle?: string
  price?: string
  originalPrice?: string
  badge?: string
  rating?: number
  onPress?: () => void
  onMenuPress?: () => void
  className?: string
}

const ProductCard = ({
  image,
  title,
  subtitle,
  price,
  originalPrice,
  badge,
  rating,
  onPress,
  onMenuPress,
  className,
}: ProductCardProps) => {
  // If we have onMenuPress, we can't use button wrapper (nested buttons not allowed)
  // Use div with onClick instead
  return (
    <div
      onClick={onPress}
      className={cn(
        'rounded-xl text-left w-full bg-card shadow-md overflow-hidden',
        onPress && 'hover:bg-accent/50 active:bg-accent transition-colors cursor-pointer',
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-square bg-muted">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        {badge && (
          <span className="absolute top-2 left-2 px-2 py-0.5 text-xs font-medium bg-destructive text-destructive-foreground rounded">
            {badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-sm truncate">{title}</h3>
            {subtitle && (
              <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
            )}
          </div>
          {onMenuPress && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onMenuPress()
              }}
              className="p-1 -mr-1 rounded hover:bg-muted"
            >
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between mt-2">
          {price && (
            <div className="flex items-baseline gap-1.5">
              <span className="font-semibold">{price}</span>
              {originalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  {originalPrice}
                </span>
              )}
            </div>
          )}
          {rating !== undefined && (
            <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
              <span className="text-yellow-500">★</span>
              {rating.toFixed(1)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Horizontal card (list item style)
interface HorizontalCardProps {
  image?: string
  title: string
  subtitle?: string
  meta?: string
  badge?: React.ReactNode
  action?: React.ReactNode
  onPress?: () => void
  className?: string
}

const HorizontalCard = ({
  image,
  title,
  subtitle,
  meta,
  badge,
  action,
  onPress,
  className,
}: HorizontalCardProps) => {
  return (
    <MobileCard
      variant="outlined"
      padding="sm"
      className={cn('flex items-center gap-3', className)}
      onPress={onPress}
    >
      {image && (
        <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
          <img src={image} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-sm truncate">{title}</h3>
          {badge}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
        )}
        {meta && (
          <p className="text-xs text-muted-foreground mt-1">{meta}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </MobileCard>
  )
}

// Story card (Instagram-like)
interface StoryCardProps {
  image: string
  title: string
  isNew?: boolean
  onPress?: () => void
  className?: string
}

const StoryCard = ({ image, title, isNew, onPress, className }: StoryCardProps) => {
  return (
    <button
      onClick={onPress}
      className={cn('flex flex-col items-center gap-1 w-16', className)}
    >
      <div
        className={cn(
          'w-16 h-16 rounded-full p-0.5',
          isNew
            ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500'
            : 'bg-muted'
        )}
      >
        <div className="w-full h-full rounded-full overflow-hidden bg-background p-0.5">
          <img src={image} alt={title} className="w-full h-full rounded-full object-cover" />
        </div>
      </div>
      <span className="text-xs truncate w-full text-center">{title}</span>
    </button>
  )
}

export { MobileCard, ProductCard, HorizontalCard, StoryCard }
