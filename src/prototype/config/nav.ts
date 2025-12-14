// Custom navigation and home page configuration
//
// Available icons: import from 'lucide-react'
// Example: import { ShoppingCart, Users, Settings } from 'lucide-react'

import type { LucideIcon } from 'lucide-react'
import type { ComponentType } from 'react'

export interface NavLink {
  path: string
  label: string
  icon: LucideIcon
}

// Custom navigation links (appear BEFORE default links: Prototype, Interview, Docs, Schema)
export const customNavLinks: NavLink[] = [
  // Example:
  // { path: '/prototype/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  // { path: '/prototype/orders', label: 'Orders', icon: ShoppingCart },
]

// Custom home page component
// Replace the default LLM Boilerplate landing with your own project page
//
// Example:
//   import { MyProjectHome } from '@prototype/pages/Home'
//   export const CustomHomePage: ComponentType | null = MyProjectHome
//
export const CustomHomePage: ComponentType | null = null
