// PriceTag - Price display with discount, original price, and badges
import * as React from 'react'
import { cn } from '@/lib/utils'

interface PriceTagProps extends React.HTMLAttributes<HTMLDivElement> {
  // Current price
  price: number
  // Original price (for showing discount)
  originalPrice?: number
  // Currency symbol or code
  currency?: string
  // Locale for formatting
  locale?: string
  // Size variant
  size?: 'sm' | 'md' | 'lg' | 'xl'
  // Show discount badge
  showDiscount?: boolean
  // Custom discount text
  discountText?: string
  // Price suffix (e.g., "/month", "/kg")
  suffix?: string
  // Price prefix (e.g., "From")
  prefix?: string
  // Layout
  layout?: 'inline' | 'stacked'
  // Free text (shown when price is 0)
  freeText?: string
}

const PriceTag = React.forwardRef<HTMLDivElement, PriceTagProps>(
  (
    {
      className,
      price,
      originalPrice,
      currency = '$',
      locale = 'en-US',
      size = 'md',
      showDiscount = true,
      discountText,
      suffix,
      prefix,
      layout = 'inline',
      freeText = 'Free',
      ...props
    },
    ref
  ) => {
    // Format price
    const formatPrice = (value: number) => {
      if (currency.length <= 1) {
        // Symbol like $, €, £
        return `${currency}${value.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      }
      // Code like USD, EUR
      return `${value.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`
    }

    // Calculate discount percentage
    const discountPercent = originalPrice
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0

    const sizeClasses = {
      sm: {
        price: 'text-base',
        original: 'text-xs',
        badge: 'text-[10px] px-1 py-0.5',
        suffix: 'text-xs',
      },
      md: {
        price: 'text-xl',
        original: 'text-sm',
        badge: 'text-xs px-1.5 py-0.5',
        suffix: 'text-sm',
      },
      lg: {
        price: 'text-2xl',
        original: 'text-base',
        badge: 'text-xs px-2 py-1',
        suffix: 'text-base',
      },
      xl: {
        price: 'text-4xl',
        original: 'text-lg',
        badge: 'text-sm px-2 py-1',
        suffix: 'text-lg',
      },
    }

    const sizes = sizeClasses[size]

    // Free price
    if (price === 0) {
      return (
        <div ref={ref} className={cn('inline-flex items-center', className)} {...props}>
          {prefix && (
            <span className={cn('text-muted-foreground mr-1', sizes.suffix)}>{prefix}</span>
          )}
          <span className={cn('font-bold text-green-600', sizes.price)}>{freeText}</span>
        </div>
      )
    }

    if (layout === 'stacked') {
      return (
        <div ref={ref} className={cn('flex flex-col', className)} {...props}>
          {/* Discount badge */}
          {showDiscount && discountPercent > 0 && (
            <span
              className={cn(
                'self-start rounded font-semibold bg-red-500 text-white mb-1',
                sizes.badge
              )}
            >
              {discountText || `-${discountPercent}%`}
            </span>
          )}

          {/* Main price */}
          <div className="flex items-baseline gap-1">
            {prefix && (
              <span className={cn('text-muted-foreground', sizes.suffix)}>{prefix}</span>
            )}
            <span className={cn('font-bold', sizes.price)}>{formatPrice(price)}</span>
            {suffix && (
              <span className={cn('text-muted-foreground', sizes.suffix)}>{suffix}</span>
            )}
          </div>

          {/* Original price */}
          {originalPrice && originalPrice > price && (
            <span className={cn('text-muted-foreground line-through', sizes.original)}>
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
      )
    }

    // Inline layout (default)
    return (
      <div ref={ref} className={cn('inline-flex items-center gap-2 flex-wrap', className)} {...props}>
        {prefix && (
          <span className={cn('text-muted-foreground', sizes.suffix)}>{prefix}</span>
        )}

        {/* Main price */}
        <span className={cn('font-bold', sizes.price)}>{formatPrice(price)}</span>

        {/* Original price */}
        {originalPrice && originalPrice > price && (
          <span className={cn('text-muted-foreground line-through', sizes.original)}>
            {formatPrice(originalPrice)}
          </span>
        )}

        {/* Discount badge */}
        {showDiscount && discountPercent > 0 && (
          <span
            className={cn(
              'rounded font-semibold bg-red-500 text-white',
              sizes.badge
            )}
          >
            {discountText || `-${discountPercent}%`}
          </span>
        )}

        {suffix && (
          <span className={cn('text-muted-foreground', sizes.suffix)}>{suffix}</span>
        )}
      </div>
    )
  }
)
PriceTag.displayName = 'PriceTag'

// ============================================
// PriceRange - For filters
// ============================================

interface PriceRangeDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  min: number
  max: number
  currency?: string
}

const PriceRangeDisplay = React.forwardRef<HTMLDivElement, PriceRangeDisplayProps>(
  ({ className, min, max, currency = '$', ...props }, ref) => (
    <div ref={ref} className={cn('text-sm', className)} {...props}>
      <span className="font-medium">
        {currency}{min.toLocaleString()} — {currency}{max.toLocaleString()}
      </span>
    </div>
  )
)
PriceRangeDisplay.displayName = 'PriceRangeDisplay'

export { PriceTag, PriceRangeDisplay }
