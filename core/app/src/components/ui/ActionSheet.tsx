// ActionSheet - iOS-style bottom action sheet
import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cn } from '@/lib/utils'

interface ActionSheetAction {
  label: string
  onPress: () => void
  destructive?: boolean
  disabled?: boolean
  icon?: React.ReactNode
}

interface ActionSheetProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title?: string
  description?: string
  actions: ActionSheetAction[]
  cancelLabel?: string
  children?: React.ReactNode // trigger
}

const ActionSheet = ({
  open,
  onOpenChange,
  title,
  description,
  actions,
  cancelLabel = 'Cancel',
  children,
}: ActionSheetProps) => {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {children && (
        <DialogPrimitive.Trigger asChild>{children}</DialogPrimitive.Trigger>
      )}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-black/50',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            'fixed bottom-0 left-0 right-0 z-50',
            'p-2 pb-safe',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom'
          )}
        >
          {/* Main actions group */}
          <div className="bg-card rounded-xl overflow-hidden mb-2">
            {(title || description) && (
              <div className="px-4 py-3 text-center border-b">
                {title && (
                  <div className="text-sm font-semibold">{title}</div>
                )}
                {description && (
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {description}
                  </div>
                )}
              </div>
            )}
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!action.disabled) {
                    action.onPress()
                    onOpenChange?.(false)
                  }
                }}
                disabled={action.disabled}
                className={cn(
                  'w-full px-4 py-3 text-center text-base font-medium',
                  'border-t first:border-t-0 transition-colors',
                  'hover:bg-muted/50 active:bg-muted',
                  action.destructive
                    ? 'text-destructive'
                    : 'text-primary',
                  action.disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                <span className="flex items-center justify-center gap-2">
                  {action.icon && (
                    <span className="[&>svg]:h-5 [&>svg]:w-5">{action.icon}</span>
                  )}
                  {action.label}
                </span>
              </button>
            ))}
          </div>

          {/* Cancel button */}
          <DialogPrimitive.Close asChild>
            <button
              className={cn(
                'w-full px-4 py-3 text-center text-base font-semibold',
                'bg-card rounded-xl',
                'hover:bg-muted/50 active:bg-muted transition-colors'
              )}
            >
              {cancelLabel}
            </button>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export { ActionSheet, type ActionSheetAction }
