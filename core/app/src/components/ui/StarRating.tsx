// StarRating - Rating input with stars
import * as React from 'react'
import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'

interface StarRatingProps {
  value?: number
  onChange?: (value: number) => void
  max?: number
  size?: 'sm' | 'md' | 'lg'
  readOnly?: boolean
  allowHalf?: boolean
  showValue?: boolean
  label?: string
  disabled?: boolean
  className?: string
}

const StarRating = React.forwardRef<HTMLDivElement, StarRatingProps>(
  (
    {
      value = 0,
      onChange,
      max = 5,
      size = 'md',
      readOnly = false,
      allowHalf = false,
      showValue = false,
      label,
      disabled = false,
      className,
    },
    ref
  ) => {
    const [hoverValue, setHoverValue] = React.useState<number | null>(null)

    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-7 w-7',
    }

    const gapClasses = {
      sm: 'gap-0.5',
      md: 'gap-1',
      lg: 'gap-1.5',
    }

    const displayValue = hoverValue ?? value

    const handleClick = (starIndex: number, isHalf: boolean) => {
      if (readOnly || disabled) return
      const newValue = isHalf && allowHalf ? starIndex + 0.5 : starIndex + 1
      onChange?.(newValue)
    }

    const handleMouseMove = (e: React.MouseEvent, starIndex: number) => {
      if (readOnly || disabled) return
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const isHalf = allowHalf && x < rect.width / 2
      setHoverValue(isHalf ? starIndex + 0.5 : starIndex + 1)
    }

    const handleMouseLeave = () => {
      if (readOnly || disabled) return
      setHoverValue(null)
    }

    return (
      <div ref={ref} className={cn('inline-flex flex-col gap-1', className)}>
        {label && <span className="text-sm font-medium">{label}</span>}
        <div className={cn('inline-flex items-center', gapClasses[size])}>
          <div
            className={cn('inline-flex', gapClasses[size])}
            onMouseLeave={handleMouseLeave}
          >
            {Array.from({ length: max }).map((_, index) => {
              const isFilled = displayValue >= index + 1
              const isHalf = allowHalf && displayValue === index + 0.5

              return (
                <button
                  key={index}
                  type="button"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const clickedHalf = allowHalf && x < rect.width / 2
                    handleClick(index, clickedHalf)
                  }}
                  onMouseMove={(e) => handleMouseMove(e, index)}
                  disabled={disabled || readOnly}
                  className={cn(
                    'relative transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded',
                    !readOnly && !disabled && 'hover:scale-110 cursor-pointer',
                    disabled && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {/* Background star (empty) */}
                  <Star
                    className={cn(
                      sizeClasses[size],
                      'text-muted-foreground/30'
                    )}
                  />
                  {/* Filled star overlay */}
                  {(isFilled || isHalf) && (
                    <div
                      className="absolute inset-0 overflow-hidden"
                      style={{ width: isHalf ? '50%' : '100%' }}
                    >
                      <Star
                        className={cn(
                          sizeClasses[size],
                          'fill-yellow-400 text-yellow-400'
                        )}
                      />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
          {showValue && (
            <span className="text-sm text-muted-foreground ml-2">
              {value.toFixed(allowHalf ? 1 : 0)}/{max}
            </span>
          )}
        </div>
      </div>
    )
  }
)
StarRating.displayName = 'StarRating'

export { StarRating }
