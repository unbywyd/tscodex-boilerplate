// EmptyState - Placeholder for empty content with icon, message and action
import * as React from 'react'
import { cn } from '@/lib/utils'
import { Inbox, Search, FileX, Users, ShoppingCart, Bell, FolderOpen, Image, FileText } from 'lucide-react'
import { Button } from './Button'

type EmptyStatePreset = 'default' | 'search' | 'no-data' | 'no-users' | 'empty-cart' | 'no-notifications' | 'no-files' | 'no-images' | 'no-documents'

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  // Preset icons
  preset?: EmptyStatePreset
  // Custom icon
  icon?: React.ReactNode
  // Title
  title?: string
  // Description
  description?: string
  // Action button
  action?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'outline' | 'secondary'
  }
  // Secondary action
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  // Size variant
  size?: 'sm' | 'md' | 'lg'
  // Compact mode (horizontal layout)
  compact?: boolean
}

const presetConfig: Record<EmptyStatePreset, { icon: React.ElementType; title: string; description: string }> = {
  default: {
    icon: Inbox,
    title: 'No data',
    description: 'There is nothing here yet.',
  },
  search: {
    icon: Search,
    title: 'No results found',
    description: 'Try adjusting your search or filters.',
  },
  'no-data': {
    icon: FileX,
    title: 'No data available',
    description: 'Data will appear here once available.',
  },
  'no-users': {
    icon: Users,
    title: 'No users',
    description: 'No users have been added yet.',
  },
  'empty-cart': {
    icon: ShoppingCart,
    title: 'Your cart is empty',
    description: 'Add items to your cart to continue.',
  },
  'no-notifications': {
    icon: Bell,
    title: 'No notifications',
    description: "You're all caught up!",
  },
  'no-files': {
    icon: FolderOpen,
    title: 'No files',
    description: 'Upload files to get started.',
  },
  'no-images': {
    icon: Image,
    title: 'No images',
    description: 'Upload images to see them here.',
  },
  'no-documents': {
    icon: FileText,
    title: 'No documents',
    description: 'Create or upload documents.',
  },
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      className,
      preset = 'default',
      icon,
      title,
      description,
      action,
      secondaryAction,
      size = 'md',
      compact = false,
      ...props
    },
    ref
  ) => {
    const config = presetConfig[preset]
    const IconComponent = config.icon

    const sizeClasses = {
      sm: {
        container: 'py-6',
        icon: 'h-8 w-8',
        iconBg: 'p-2',
        title: 'text-sm',
        description: 'text-xs',
      },
      md: {
        container: 'py-10',
        icon: 'h-10 w-10',
        iconBg: 'p-3',
        title: 'text-base',
        description: 'text-sm',
      },
      lg: {
        container: 'py-16',
        icon: 'h-14 w-14',
        iconBg: 'p-4',
        title: 'text-lg',
        description: 'text-base',
      },
    }

    const sizes = sizeClasses[size]

    if (compact) {
      return (
        <div
          ref={ref}
          className={cn(
            'flex items-center gap-4 p-4 rounded-lg bg-muted/30',
            className
          )}
          {...props}
        >
          <div className={cn('rounded-full bg-muted', sizes.iconBg)}>
            {icon || <IconComponent className={cn(sizes.icon, 'text-muted-foreground')} />}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={cn('font-medium', sizes.title)}>{title || config.title}</h3>
            <p className={cn('text-muted-foreground truncate', sizes.description)}>
              {description || config.description}
            </p>
          </div>
          {action && (
            <Button
              variant={action.variant || 'outline'}
              size="sm"
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center text-center',
          sizes.container,
          className
        )}
        {...props}
      >
        <div className={cn('rounded-full bg-muted mb-4', sizes.iconBg)}>
          {icon || <IconComponent className={cn(sizes.icon, 'text-muted-foreground')} />}
        </div>
        <h3 className={cn('font-medium mb-1', sizes.title)}>{title || config.title}</h3>
        <p className={cn('text-muted-foreground max-w-sm mb-4', sizes.description)}>
          {description || config.description}
        </p>
        {(action || secondaryAction) && (
          <div className="flex items-center gap-2">
            {action && (
              <Button variant={action.variant || 'default'} onClick={action.onClick}>
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button variant="ghost" onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    )
  }
)
EmptyState.displayName = 'EmptyState'

export { EmptyState, type EmptyStatePreset }
