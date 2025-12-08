// Simplified form hook wrapper for consistent usage
import { useForm as useHookForm, UseFormProps, FieldValues, Path } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ZodSchema } from 'zod'

// Wrapper that always uses zod resolver
export function useForm<T extends FieldValues>(
  schema: ZodSchema<T>,
  options?: Omit<UseFormProps<T>, 'resolver'>
) {
  return useHookForm<T>({
    resolver: zodResolver(schema),
    mode: 'onBlur', // Validate on blur for better UX
    ...options,
  })
}

// Helper type for form field props
export type FormFieldProps<T extends FieldValues> = {
  name: Path<T>
  label: string
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel'
}
