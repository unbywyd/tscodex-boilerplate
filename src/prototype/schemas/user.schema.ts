// Example Zod schema - validation for forms and API
import { z } from 'zod'

// 1. Define schema
export const userSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),

  email: z.string()
    .email('Invalid email address'),

  role: z.enum(['admin', 'user'], {
    errorMap: () => ({ message: 'Select a valid role' })
  }),

  phone: z.string()
    .regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number')
    .optional(),
})

// 2. Create form schema (for new users - all required)
export const createUserSchema = userSchema

// 3. Update schema (partial - all optional)
export const updateUserSchema = userSchema.partial()

// 4. Infer types from schema
export type UserFormData = z.infer<typeof userSchema>
export type CreateUserData = z.infer<typeof createUserSchema>
export type UpdateUserData = z.infer<typeof updateUserSchema>

// 5. Example: login schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>
