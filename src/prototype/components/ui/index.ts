// UI Components Registry
export { Button } from './Button'
export { Card } from './Card'
export { Input } from './Input'
export { Badge } from './Badge'
export { FormField } from './FormField'

// Component registry for dynamic rendering in previews
import { Button } from './Button'
import { Card } from './Card'
import { Input } from './Input'
import { Badge } from './Badge'
import { ComponentType } from 'react'

export const componentRegistry: Record<string, ComponentType<any>> = {
  button: Button,
  card: Card,
  input: Input,
  badge: Badge,
}
