// Switch - Shadcn-style toggle switch using Radix UI
import * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cn } from '@/lib/utils'

interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  label?: string
  description?: string
  error?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: {
    root: 'h-4 w-7',
    thumb: 'h-3 w-3 data-[state=checked]:translate-x-3',
  },
  md: {
    root: 'h-5 w-9',
    thumb: 'h-4 w-4 data-[state=checked]:translate-x-4',
  },
  lg: {
    root: 'h-6 w-11',
    thumb: 'h-5 w-5 data-[state=checked]:translate-x-5',
  },
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, label, description, error, size = 'md', id, ...props }, ref) => {
  const switchId = id || label?.toLowerCase().replace(/\s+/g, '-')
  const sizes = sizeClasses[size]

  const toggle = (
    <SwitchPrimitive.Root
      ref={ref}
      id={switchId}
      className={cn(
        'peer inline-flex shrink-0 cursor-pointer items-center rounded-full',
        'border-2 border-transparent',
        'transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=unchecked]:bg-input',
        'data-[state=checked]:bg-primary',
        sizes.root,
        error && 'ring-2 ring-destructive',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          'pointer-events-none block rounded-full bg-background shadow-lg',
          'ring-0 transition-transform',
          'data-[state=unchecked]:translate-x-0',
          sizes.thumb
        )}
      />
    </SwitchPrimitive.Root>
  )

  if (!label && !description) {
    return toggle
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-3">
        <div className="grid gap-0.5">
          {label && (
            <label
              htmlFor={switchId}
              className="text-sm font-medium cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {label}
              {props.required && <span className="text-destructive ml-1">*</span>}
            </label>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {toggle}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
})
Switch.displayName = 'Switch'

export { Switch }
