// CartBadge - Shopping cart icon with item count
import * as React from 'react'
import { cn } from '@/lib/utils'
import { ShoppingCart, ShoppingBag, Heart, Bell, Mail, MessageCircle } from 'lucide-react'

// ============================================
// Types
// ============================================

interface CartBadgeProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // Count
  count?: number
  // Max count to display (e.g., 99+)
  maxCount?: number
  // Icon type
  icon?: 'cart' | 'bag' | 'heart' | 'bell' | 'mail' | 'message'
  // Custom icon
  customIcon?: React.ReactNode
  // Size
  size?: 'sm' | 'md' | 'lg'
  // Badge color
  badgeColor?: 'default' | 'primary' | 'destructive'
  // Show badge even when count is 0
  showEmpty?: boolean
  // Animate on change
  animate?: boolean
}

// ============================================
// Config
// ============================================

const iconMap = {
  cart: ShoppingCart,
  bag: ShoppingBag,
  heart: Heart,
  bell: Bell,
  mail: Mail,
  message: MessageCircle,
}

const sizeConfig = {
  sm: { button: 'w-8 h-8', icon: 'h-4 w-4', badge: 'h-4 min-w-4 text-[10px] -top-1 -right-1' },
  md: { button: 'w-10 h-10', icon: 'h-5 w-5', badge: 'h-5 min-w-5 text-xs -top-1 -right-1' },
  lg: { button: 'w-12 h-12', icon: 'h-6 w-6', badge: 'h-6 min-w-6 text-sm -top-1.5 -right-1.5' },
}

const badgeColorConfig = {
  default: 'bg-foreground text-background',
  primary: 'bg-primary text-primary-foreground',
  destructive: 'bg-destructive text-destructive-foreground',
}

// ============================================
// CartBadge Component
// ============================================

const CartBadge = React.forwardRef<HTMLButtonElement, CartBadgeProps>(
  (
    {
      count = 0,
      maxCount = 99,
      icon = 'cart',
      customIcon,
      size = 'md',
      badgeColor = 'primary',
      showEmpty = false,
      animate = true,
      className,
      ...props
    },
    ref
  ) => {
    const [isAnimating, setIsAnimating] = React.useState(false)
    const prevCount = React.useRef(count)
    const config = sizeConfig[size]
    const Icon = iconMap[icon]

    // Trigger animation on count change
    React.useEffect(() => {
      if (animate && count !== prevCount.current && count > 0) {
        setIsAnimating(true)
        const timer = setTimeout(() => setIsAnimating(false), 300)
        prevCount.current = count
        return () => clearTimeout(timer)
      }
      prevCount.current = count
    }, [count, animate])

    const displayCount = count > maxCount ? `${maxCount}+` : count
    const showBadge = count > 0 || showEmpty

    return (
      <button
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center rounded-full',
          'hover:bg-muted transition-colors',
          config.button,
          className
        )}
        {...props}
      >
        {customIcon || <Icon className={config.icon} />}

        {showBadge && (
          <span
            className={cn(
              'absolute flex items-center justify-center rounded-full px-1 font-medium',
              config.badge,
              badgeColorConfig[badgeColor],
              isAnimating && 'animate-bounce'
            )}
          >
            {displayCount}
          </span>
        )}
      </button>
    )
  }
)
CartBadge.displayName = 'CartBadge'

// ============================================
// NotificationBadge - Just a dot
// ============================================

interface NotificationBadgeProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  hasNotification?: boolean
  icon?: 'bell' | 'mail' | 'message'
  size?: 'sm' | 'md' | 'lg'
}

const NotificationBadge = React.forwardRef<HTMLButtonElement, NotificationBadgeProps>(
  ({ hasNotification = false, icon = 'bell', size = 'md', className, ...props }, ref) => {
    const config = sizeConfig[size]
    const Icon = iconMap[icon]

    return (
      <button
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center rounded-full',
          'hover:bg-muted transition-colors',
          config.button,
          className
        )}
        {...props}
      >
        <Icon className={config.icon} />

        {hasNotification && (
          <span
            className={cn(
              'absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-destructive',
              'ring-2 ring-background'
            )}
          />
        )}
      </button>
    )
  }
)
NotificationBadge.displayName = 'NotificationBadge'

// ============================================
// WishlistBadge - Heart with count
// ============================================

interface WishlistBadgeProps extends Omit<CartBadgeProps, 'icon'> {
  filled?: boolean
}

const WishlistBadge = React.forwardRef<HTMLButtonElement, WishlistBadgeProps>(
  ({ filled = false, count, className, ...props }, ref) => (
    <CartBadge
      ref={ref}
      icon="heart"
      count={count}
      badgeColor="destructive"
      customIcon={
        <Heart
          className={cn(
            sizeConfig[props.size || 'md'].icon,
            filled && 'fill-destructive text-destructive'
          )}
        />
      }
      className={className}
      {...props}
    />
  )
)
WishlistBadge.displayName = 'WishlistBadge'

// ============================================
// Mini Cart Preview
// ============================================

interface MiniCartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface MiniCartProps {
  items: MiniCartItem[]
  total: number
  currency?: string
  onViewCart?: () => void
  onCheckout?: () => void
  className?: string
}

const MiniCart = ({
  items,
  total,
  currency = '$',
  onViewCart,
  onCheckout,
  className,
}: MiniCartProps) => {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className={cn('w-72 bg-background rounded-lg shadow-lg border p-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Shopping Cart</h3>
        <span className="text-sm text-muted-foreground">{itemCount} items</span>
      </div>

      {/* Items */}
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">Your cart is empty</p>
      ) : (
        <div className="space-y-3 max-h-48 overflow-auto">
          {items.slice(0, 3).map((item) => (
            <div key={item.id} className="flex gap-3">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.quantity} × {currency}{item.price.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
          {items.length > 3 && (
            <p className="text-xs text-muted-foreground text-center">
              +{items.length - 3} more items
            </p>
          )}
        </div>
      )}

      {/* Footer */}
      {items.length > 0 && (
        <div className="mt-4 pt-3 border-t space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">Total:</span>
            <span className="font-bold">{currency}{total.toFixed(2)}</span>
          </div>
          <div className="flex gap-2">
            {onViewCart && (
              <button
                onClick={onViewCart}
                className="flex-1 py-2 px-3 text-sm border rounded-lg hover:bg-muted"
              >
                View Cart
              </button>
            )}
            {onCheckout && (
              <button
                onClick={onCheckout}
                className="flex-1 py-2 px-3 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Checkout
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export { CartBadge, NotificationBadge, WishlistBadge, MiniCart }
