// SwipeActions - Swipeable list item with actions (iOS style)
import * as React from 'react'
import { cn } from '@/lib/utils'
import { Trash2, Archive, Star, MoreHorizontal, Pin, Bell, BellOff } from 'lucide-react'

// ============================================
// Types
// ============================================

interface SwipeAction {
  id: string
  label: string
  icon?: React.ReactNode
  color?: 'default' | 'destructive' | 'warning' | 'success' | 'primary'
  onClick: () => void
}

interface SwipeActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  // Left swipe actions
  leftActions?: SwipeAction[]
  // Right swipe actions
  rightActions?: SwipeAction[]
  // Threshold to trigger action (in px)
  threshold?: number
  // Disable swipe
  disabled?: boolean
  // On swipe complete (full swipe)
  onSwipeComplete?: (direction: 'left' | 'right') => void
}

// ============================================
// Color config
// ============================================

const actionColors = {
  default: 'bg-muted-foreground',
  destructive: 'bg-red-500',
  warning: 'bg-yellow-500',
  success: 'bg-green-500',
  primary: 'bg-primary',
}

// ============================================
// SwipeActions Component
// ============================================

const SwipeActions = React.forwardRef<HTMLDivElement, SwipeActionsProps>(
  (
    {
      leftActions = [],
      rightActions = [],
      threshold = 80,
      disabled = false,
      onSwipeComplete,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null)
    const [translateX, setTranslateX] = React.useState(0)
    const [isDragging, setIsDragging] = React.useState(false)
    const startX = React.useRef(0)
    const currentX = React.useRef(0)

    const leftWidth = leftActions.length * 80
    const rightWidth = rightActions.length * 80

    const handleTouchStart = (e: React.TouchEvent) => {
      if (disabled) return
      startX.current = e.touches[0].clientX
      currentX.current = translateX
      setIsDragging(true)
    }

    const handleTouchMove = (e: React.TouchEvent) => {
      if (!isDragging || disabled) return

      const diff = e.touches[0].clientX - startX.current
      let newTranslate = currentX.current + diff

      // Limit swipe distance
      if (leftActions.length === 0 && newTranslate > 0) newTranslate = 0
      if (rightActions.length === 0 && newTranslate < 0) newTranslate = 0

      // Add resistance at edges
      const maxLeft = leftWidth + 20
      const maxRight = -(rightWidth + 20)

      if (newTranslate > maxLeft) {
        newTranslate = maxLeft + (newTranslate - maxLeft) * 0.2
      }
      if (newTranslate < maxRight) {
        newTranslate = maxRight + (newTranslate - maxRight) * 0.2
      }

      setTranslateX(newTranslate)
    }

    const handleTouchEnd = () => {
      if (!isDragging) return
      setIsDragging(false)

      // Determine final position
      if (translateX > threshold && leftActions.length > 0) {
        // Show left actions or trigger full swipe
        if (translateX > leftWidth * 1.5) {
          onSwipeComplete?.('left')
          setTranslateX(0)
        } else {
          setTranslateX(leftWidth)
        }
      } else if (translateX < -threshold && rightActions.length > 0) {
        // Show right actions or trigger full swipe
        if (translateX < -rightWidth * 1.5) {
          onSwipeComplete?.('right')
          setTranslateX(0)
        } else {
          setTranslateX(-rightWidth)
        }
      } else {
        // Reset
        setTranslateX(0)
      }
    }

    const handleActionClick = (action: SwipeAction) => {
      action.onClick()
      setTranslateX(0)
    }

    // Reset function could be exposed via ref if needed
    void function reset() { setTranslateX(0) }

    // Close when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setTranslateX(0)
        }
      }

      if (translateX !== 0) {
        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
      }
    }, [translateX])

    return (
      <div
        ref={ref}
        className={cn('relative overflow-hidden', className)}
        {...props}
      >
        {/* Left actions (revealed when swiping right) */}
        {leftActions.length > 0 && (
          <div className="absolute inset-y-0 left-0 flex">
            {leftActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleActionClick(action)}
                className={cn(
                  'w-20 flex flex-col items-center justify-center text-white text-xs font-medium',
                  actionColors[action.color || 'default']
                )}
              >
                {action.icon}
                <span className="mt-1">{action.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Right actions (revealed when swiping left) */}
        {rightActions.length > 0 && (
          <div className="absolute inset-y-0 right-0 flex">
            {rightActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleActionClick(action)}
                className={cn(
                  'w-20 flex flex-col items-center justify-center text-white text-xs font-medium',
                  actionColors[action.color || 'default']
                )}
              >
                {action.icon}
                <span className="mt-1">{action.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div
          ref={containerRef}
          className={cn(
            'relative bg-background',
            !isDragging && 'transition-transform duration-200'
          )}
          style={{ transform: `translateX(${translateX}px)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {children}
        </div>
      </div>
    )
  }
)
SwipeActions.displayName = 'SwipeActions'

// ============================================
// Common Action Presets
// ============================================

const createDeleteAction = (onDelete: () => void): SwipeAction => ({
  id: 'delete',
  label: 'Delete',
  icon: <Trash2 className="h-5 w-5" />,
  color: 'destructive',
  onClick: onDelete,
})

const createArchiveAction = (onArchive: () => void): SwipeAction => ({
  id: 'archive',
  label: 'Archive',
  icon: <Archive className="h-5 w-5" />,
  color: 'warning',
  onClick: onArchive,
})

const createStarAction = (onStar: () => void, isStarred = false): SwipeAction => ({
  id: 'star',
  label: isStarred ? 'Unstar' : 'Star',
  icon: <Star className={cn('h-5 w-5', isStarred && 'fill-current')} />,
  color: 'primary',
  onClick: onStar,
})

const createPinAction = (onPin: () => void, isPinned = false): SwipeAction => ({
  id: 'pin',
  label: isPinned ? 'Unpin' : 'Pin',
  icon: <Pin className={cn('h-5 w-5', isPinned && 'fill-current')} />,
  color: 'primary',
  onClick: onPin,
})

const createMuteAction = (onMute: () => void, isMuted = false): SwipeAction => ({
  id: 'mute',
  label: isMuted ? 'Unmute' : 'Mute',
  icon: isMuted ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />,
  color: 'default',
  onClick: onMute,
})

const createMoreAction = (onMore: () => void): SwipeAction => ({
  id: 'more',
  label: 'More',
  icon: <MoreHorizontal className="h-5 w-5" />,
  color: 'default',
  onClick: onMore,
})

// ============================================
// Swipeable List Item
// ============================================

interface SwipeableListItemProps extends SwipeActionsProps {
  // Simplified props for common use case
  onDelete?: () => void
  onArchive?: () => void
  onStar?: () => void
  isStarred?: boolean
}

const SwipeableListItem = React.forwardRef<HTMLDivElement, SwipeableListItemProps>(
  ({ onDelete, onArchive, onStar, isStarred, leftActions, rightActions, children, ...props }, ref) => {
    // Build actions from simplified props
    const computedRightActions: SwipeAction[] = rightActions ?? []
    const computedLeftActions: SwipeAction[] = leftActions ?? []

    if (!rightActions) {
      if (onDelete) computedRightActions.push(createDeleteAction(onDelete))
      if (onArchive) computedRightActions.unshift(createArchiveAction(onArchive))
    }

    if (!leftActions && onStar) {
      computedLeftActions.push(createStarAction(onStar, isStarred))
    }

    return (
      <SwipeActions
        ref={ref}
        leftActions={computedLeftActions}
        rightActions={computedRightActions}
        {...props}
      >
        {children}
      </SwipeActions>
    )
  }
)
SwipeableListItem.displayName = 'SwipeableListItem'

export {
  SwipeActions,
  SwipeableListItem,
  createDeleteAction,
  createArchiveAction,
  createStarAction,
  createPinAction,
  createMuteAction,
  createMoreAction,
}
