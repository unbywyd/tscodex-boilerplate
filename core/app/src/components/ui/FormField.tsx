// Reusable form field component - reduces boilerplate
import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const fieldId = id || props.name

    return (
      <div className="space-y-1">
        <label htmlFor={fieldId} className="text-sm font-medium">
          {label}
          {!props.required && (
            <span className="text-muted-foreground ml-1">(optional)</span>
          )}
        </label>
        <input
          ref={ref}
          id={fieldId}
          className={cn(
            'w-full px-3 py-2 border rounded-md',
            'focus:outline-none focus:ring-2 focus:ring-primary',
            'disabled:bg-muted disabled:cursor-not-allowed',
            error && 'border-destructive focus:ring-destructive',
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        {hint && !error && (
          <p className="text-sm text-muted-foreground">{hint}</p>
        )}
      </div>
    )
  }
)

FormField.displayName = 'FormField'
