# Prototype Mode

Build interactive mobile app prototypes using **protomobilekit** framework.

---

## Quick Start

1. User wants a prototype → work in `src/prototype/`
2. Define entities in `src/prototype/entities/index.ts`
3. Define users/roles in `src/prototype/users.ts`
4. Create app screens in `src/prototype/apps/{app-id}/index.tsx`
5. Register apps in `src/prototype/index.tsx`
6. View at `/prototype` route

---

## File Structure

```
src/prototype/
├── index.tsx              # Entry point - Canvas with apps
├── entities/
│   └── index.ts           # Entity definitions + seedData()
├── users.ts               # defineUsers, defineRoles
└── apps/
    └── {app-id}/
        └── index.tsx      # App component with Navigator
```

---

## Entity Definition

```typescript
// src/prototype/entities/index.ts
import { entity, useStore } from 'protomobilekit'
import type { InferEntity } from 'protomobilekit'

export const Product = entity({
  name: 'Product',
  fields: {
    name: 'string',
    price: 'number',
    image: 'image',
    category: { type: 'enum', values: ['Electronics', 'Clothing', 'Food'] as const },
    inStock: 'boolean',
  }
})
export type Product = InferEntity<typeof Product>

// Seed data
export function seedData() {
  const store = useStore.getState()
  if (store.getAll('Product').length > 0) return

  store.create('Product', {
    id: 'p1',
    name: 'iPhone 15',
    price: 999,
    image: 'https://picsum.photos/seed/iphone/200',
    category: 'Electronics',
    inStock: true
  }, { silent: true })
}
```

### Field Types

| Type | Description |
|------|-------------|
| `'string'` | Text field |
| `'number'` | Numeric field |
| `'boolean'` | True/false |
| `'email'` | Email with validation |
| `'phone'` | Phone number |
| `'image'` | Image URL |
| `'date'` | Date field |
| `{ type: 'enum', values: [...] }` | Enum with options |
| `{ type: 'relation', collection: 'Entity' }` | Foreign key |

---

## Users & Roles

```typescript
// src/prototype/users.ts
import { defineUsers, defineRoles } from 'protomobilekit'

defineRoles({
  appId: 'customer',
  roles: [
    { value: 'user', label: 'User', description: 'Regular user' },
    { value: 'vip', label: 'VIP', description: 'Premium member', color: '#f59e0b' },
  ],
})

defineUsers({
  appId: 'customer',
  users: [
    {
      id: 'john',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'vip',
      avatar: 'https://i.pravatar.cc/150?u=john',
    },
  ],
})
```

---

## App Screen

```typescript
// src/prototype/apps/customer/index.tsx
import {
  Navigator,
  Screen,
  Header,
  ScrollView,
  Card,
  List,
  ListItem,
  Text,
  useQuery,
} from 'protomobilekit'
import { Home, User } from 'lucide-react'
import type { Product } from '../../entities'

function HomeScreen() {
  const { items: products } = useQuery<Product>('Product')

  return (
    <Screen header={<Header title="Shop" />}>
      <ScrollView padding="md">
        <List
          items={products}
          keyExtractor={(p) => p.id}
          renderItem={(product) => (
            <ListItem subtitle={`$${product.price}`}>
              {product.name}
            </ListItem>
          )}
        />
      </ScrollView>
    </Screen>
  )
}

export function CustomerApp() {
  return (
    <Navigator initial="home" type="tabs">
      <Navigator.Screen
        name="home"
        component={HomeScreen}
        icon={<Home size={24} />}
        label="Home"
      />
    </Navigator>
  )
}
```

---

## Entry Point (Canvas)

```typescript
// src/prototype/index.tsx
import { Canvas, defineApp, ThemeProvider, DevTools, resetStore } from 'protomobilekit'
import { seedData } from './entities'
import { CustomerApp } from './apps/customer'
import './users'

resetStore()
seedData()

export default function Prototype() {
  return (
    <ThemeProvider defaultPlatform="ios">
      <Canvas
        apps={[
          defineApp({
            id: 'customer',
            name: 'Customer App',
            device: 'iphone-14',
            component: () => <CustomerApp />,
          }),
        ]}
        layout="row"
        gap={24}
        showLabels
      />
      <DevTools position="right" devOnly={false} />
    </ThemeProvider>
  )
}
```

---

## Key Components

### Layout
- `Screen` - Full screen wrapper
- `Header` - App bar with title
- `ScrollView` - Scrollable content
- `Card` - Card container
- `Section` - Section with title

### Data Display
- `List` / `ListItem` - Lists
- `Text` - Typography
- `Avatar` - User avatars
- `Badge` - Status badges
- `StatusBadge` - Order/user status

### Input
- `Button` - Buttons
- `Input` - Text input
- `SearchBar` - Search field
- `Select` - Dropdown
- `Switch` / `Checkbox` - Toggles

### Overlays
- `Modal` - Modal dialog
- `BottomSheet` - Bottom sheet
- `Alert` / `Confirm` - Dialogs

### Navigation
- `Navigator` - Stack/tab navigation
- `useNavigate()` - Navigate between screens
- `useRoute()` - Get route params

---

## Device Options

```typescript
defineApp({
  device: 'iphone-14',      // or: 'iphone-14-pro', 'iphone-se',
                            // 'pixel-7', 'galaxy-s23', 'ipad-mini'
})
```

---

## Hooks

| Hook | Purpose |
|------|---------|
| `useQuery<T>(collection)` | Get entities with reactive updates |
| `useRepo(collection)` | CRUD operations (create, update, delete) |
| `useAuth()` | Current user, login, logout |
| `useNavigate()` | Navigation actions |
| `useTheme()` | Theme colors |

---

## Workflow

1. **Understand requirements** - what screens, what data
2. **Define entities** - create entity schemas in `entities/index.ts`
3. **Seed data** - add sample data in `seedData()`
4. **Define users** - create test users in `users.ts`
5. **Build screens** - create app screens in `apps/{id}/index.tsx`
6. **Register in Canvas** - add app to `index.tsx`

---

## Tips

- Use `useQuery` for reactive data fetching
- Use `{ silent: true }` when seeding to avoid event spam
- DevTools panel allows quick user switching
- Hot reload works - changes appear instantly
- Keep screens simple - this is for prototyping, not production
