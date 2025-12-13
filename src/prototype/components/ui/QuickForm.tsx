// QuickForm - declarative form builder using SmartField
import { useState, FormEvent } from 'react'
import { SmartField, FieldConfig } from './SmartField'
import { Button } from './Button'
import { cn } from '@/lib/utils'

type ValidationRule = {
  validate: (value: any, formData: Record<string, any>) => boolean
  message: string
}

export interface QuickFieldConfig extends FieldConfig {
  validation?: ValidationRule[]
  colSpan?: 1 | 2 // For grid layout
}

interface QuickFormProps<T = Record<string, any>> {
  fields: QuickFieldConfig[]
  onSubmit: (data: T) => void | Promise<void>
  onChange?: (data: Partial<T>) => void
  defaultValues?: Partial<T>
  submitLabel?: string
  resetLabel?: string
  showReset?: boolean
  loading?: boolean
  disabled?: boolean
  className?: string
  columns?: 1 | 2 // Grid columns
  gap?: 'sm' | 'md' | 'lg'
  // Layout options
  layout?: 'vertical' | 'horizontal'
  submitPosition?: 'left' | 'right' | 'center' | 'full'
}

// Built-in validators
export const validators = {
  required: (message = 'This field is required'): ValidationRule => ({
    validate: (v) => v !== undefined && v !== null && v !== '',
    message,
  }),
  email: (message = 'Invalid email'): ValidationRule => ({
    validate: (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    message,
  }),
  minLength: (len: number, message?: string): ValidationRule => ({
    validate: (v) => !v || v.length >= len,
    message: message || `Minimum ${len} characters`,
  }),
  maxLength: (len: number, message?: string): ValidationRule => ({
    validate: (v) => !v || v.length <= len,
    message: message || `Maximum ${len} characters`,
  }),
  min: (num: number, message?: string): ValidationRule => ({
    validate: (v) => v === undefined || v >= num,
    message: message || `Minimum value is ${num}`,
  }),
  max: (num: number, message?: string): ValidationRule => ({
    validate: (v) => v === undefined || v <= num,
    message: message || `Maximum value is ${num}`,
  }),
  pattern: (regex: RegExp, message: string): ValidationRule => ({
    validate: (v) => !v || regex.test(v),
    message,
  }),
  match: (fieldName: string, message = 'Values do not match'): ValidationRule => ({
    validate: (v, data) => v === data[fieldName],
    message,
  }),
}

export function QuickForm<T = Record<string, any>>({
  fields,
  onSubmit,
  onChange,
  defaultValues = {},
  submitLabel = 'Submit',
  resetLabel = 'Reset',
  showReset = false,
  loading = false,
  disabled = false,
  className,
  columns = 1,
  gap = 'md',
  layout: _layout = 'vertical', // Reserved for future horizontal layout
  submitPosition = 'right',
}: QuickFormProps<T>) {
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {}
    fields.forEach((field) => {
      initial[field.name] = defaultValues[field.name as keyof typeof defaultValues] ?? field.defaultValue ?? undefined
    })
    return initial
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())

  const gapClass = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  }[gap]

  const validateField = (field: QuickFieldConfig, value: any): string | null => {
    // Required validation
    if (field.required && (value === undefined || value === null || value === '')) {
      return `${field.label || field.name} is required`
    }

    // Custom validation rules
    if (field.validation) {
      for (const rule of field.validation) {
        if (!rule.validate(value, formData)) {
          return rule.message
        }
      }
    }

    return null
  }

  const validateAll = (): boolean => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    fields.forEach((field) => {
      const error = validateField(field, formData[field.name])
      if (error) {
        newErrors[field.name] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleFieldChange = (name: string, value: any) => {
    const newData = { ...formData, [name]: value }
    setFormData(newData)
    onChange?.(newData as Partial<T>)

    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  // Reserved for onBlur validation - can be wired to SmartField in future
  const _handleFieldBlur = (field: QuickFieldConfig) => {
    setTouched((prev) => new Set(prev).add(field.name))

    // Validate on blur
    const error = validateField(field, formData[field.name])
    if (error) {
      setErrors((prev) => ({ ...prev, [field.name]: error }))
    }
  }
  void _handleFieldBlur // Suppress unused warning

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Mark all as touched
    setTouched(new Set(fields.map((f) => f.name)))

    if (!validateAll()) return

    await onSubmit(formData as T)
  }

  const handleReset = () => {
    const initial: Record<string, any> = {}
    fields.forEach((field) => {
      initial[field.name] = defaultValues[field.name as keyof typeof defaultValues] ?? field.defaultValue ?? undefined
    })
    setFormData(initial)
    setErrors({})
    setTouched(new Set())
  }

  const submitAlignClass = {
    left: 'justify-start',
    right: 'justify-end',
    center: 'justify-center',
    full: '',
  }[submitPosition]

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-4', className)}>
      <div
        className={cn(
          'grid',
          columns === 2 && 'grid-cols-1 md:grid-cols-2',
          gapClass
        )}
      >
        {fields.map((field) => (
          <div
            key={field.name}
            className={cn(field.colSpan === 2 && columns === 2 && 'md:col-span-2')}
          >
            <SmartField
              {...field}
              value={formData[field.name]}
              onChange={(value) => handleFieldChange(field.name, value)}
              error={touched.has(field.name) ? errors[field.name] : undefined}
              disabled={disabled || field.disabled}
            />
          </div>
        ))}
      </div>

      {/* Submit buttons */}
      <div className={cn('flex gap-2 pt-2', submitAlignClass)}>
        {showReset && (
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={disabled || loading}
          >
            {resetLabel}
          </Button>
        )}
        <Button
          type="submit"
          loading={loading}
          disabled={disabled}
          className={submitPosition === 'full' ? 'w-full' : ''}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

// Re-export for convenience
export { SmartField, type FieldConfig, type FieldType } from './SmartField'
