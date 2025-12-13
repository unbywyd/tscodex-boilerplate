// RadioGroup - Shadcn-style radio group using Radix UI
import * as React from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RadioGroupProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  label?: string
  error?: string
  options?: Array<{ value: string; label: string; description?: string }>
  orientation?: 'horizontal' | 'vertical'
}

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ className, label, error, options, orientation = 'vertical', children, ...props }, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium">
          {label}
          {props.required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <RadioGroupPrimitive.Root
        ref={ref}
        className={cn(
          'grid gap-2',
          orientation === 'horizontal' && 'flex flex-wrap gap-4',
          className
        )}
        {...props}
      >
        {options
          ? options.map((option) => (
              <RadioGroupItem
                key={option.value}
                value={option.value}
                label={option.label}
                description={option.description}
              />
            ))
          : children}
      </RadioGroupPrimitive.Root>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
})
RadioGroup.displayName = 'RadioGroup'

interface RadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  label?: string
  description?: string
}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, label, description, id, ...props }, ref) => {
  const itemId = id || `radio-${props.value}`

  const radio = (
    <RadioGroupPrimitive.Item
      ref={ref}
      id={itemId}
      className={cn(
        'aspect-square h-5 w-5 rounded-full border border-input',
        'ring-offset-background',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:border-primary',
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-primary text-primary" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )

  if (!label) {
    return radio
  }

  return (
    <div className="flex items-start gap-3">
      {radio}
      <div className="grid gap-0.5 leading-none">
        <label
          htmlFor={itemId}
          className="text-sm font-medium cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  )
})
RadioGroupItem.displayName = 'RadioGroupItem'

export { RadioGroup, RadioGroupItem }
