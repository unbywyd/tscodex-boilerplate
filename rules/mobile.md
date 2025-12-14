# Mobile Development

## Stack Options
- React Native + Expo
- Flutter
- Native (Swift/Kotlin)

## Considerations
- Touch-first interactions
- Bottom navigation preferred
- Pull-to-refresh patterns
- Offline support

## Layout Patterns
- Stack navigation
- Tab navigation
- Drawer navigation

## Screen Types
- List screens (scrollable)
- Detail screens
- Form screens
- Modal screens

## Entities Adaptation
Same entities from `layers/entities/` apply. Consider:
- Offline sync fields (syncedAt, localId)
- Optimistic updates
- Pagination for lists

## Auth
- Secure token storage (Keychain/Keystore)
- Biometric authentication
- Session management

## Prototype Notes
For mobile prototype:
1. Define screens in `layers/routes/` with `platform = "mobile"`
2. Use mobile-specific guards if needed
3. Consider reduced feature set for MVP

## UIKit for Mobile

All mobile components are available in the UIKit.

**Documentation:**
- Live demo & code examples: `/ui-kit` page in browser
- Component source: `src/prototype/components/mobile/`
- Exports: `src/prototype/components/ui/index.ts`

### Key Components

```tsx
import {
  // Device frames
  MobileFrame, SimpleFrame, BrowserFrame,
  // Screen structure
  Screen, ScreenHeader, ScreenBody, ScreenFooter,
  // Navigation
  TopBar, TopBarAction, BottomNav,
  // Lists
  MobileList, MobileListItem,
  // Cards
  MobileCard, ProductCard, HorizontalCard, StoryCard,
  CardSlider, ProductSlider, StorySlider,
  // Other
  ActionSheet, HorizontalScroll,
  // Status
  Timeline, DeliveryTracker, Progress, CircularProgress,
} from '@prototype/components/ui'
```

### Mobile Screen Pattern

```tsx
<MobileFrame device="iphone" size="md">
  <Screen bg="muted">
    <ScreenHeader>
      <TopBar title="Profile" back />
    </ScreenHeader>
    <ScreenBody padding="md">
      {/* scrollable content */}
    </ScreenBody>
    <ScreenFooter>
      <BottomNav items={navItems} />
    </ScreenFooter>
  </Screen>
</MobileFrame>
```

### Key Points

- **Touch targets**: Minimum 44×44px for tappable elements
- **Bottom nav**: Primary navigation at bottom, within thumb reach
- **Safe areas**: MobileFrame handles status bar and home indicator
- **Scrolling**: ScreenBody auto-scrolls, header/footer stay fixed

## From Spec to Mobile
```
entities/*.toml → Models
routes/*.toml → Screens
use-cases/*.toml → User flows
guards/*.toml → Auth gates
```

## Dual-App Architecture (Multi-Side Mobile)

For apps with multiple user roles viewing same flow (driver/passenger, customer/courier, buyer/seller).

### When to Use
When `interview.toml` has:
```toml
appSides = "dual"
appSidesList = ["passenger", "driver"]
```

### Directory Structure
```
src/prototype/
├── apps/
│   ├── driver/
│   │   ├── screens/
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── OrderScreen.tsx
│   │   │   └── RideScreen.tsx
│   │   └── DriverApp.tsx
│   └── passenger/
│       ├── screens/
│       │   ├── HomeScreen.tsx
│       │   ├── BookingScreen.tsx
│       │   └── RideScreen.tsx
│       └── PassengerApp.tsx
├── shared/
│   ├── state/           # Shared Zustand stores
│   │   └── useOrderState.ts
│   ├── types/           # Shared TypeScript types
│   │   └── order.types.ts
│   └── components/      # Shared UI components
└── layouts/
    └── DualAppLayout.tsx
```

### DualAppLayout Component
```tsx
// src/prototype/layouts/DualAppLayout.tsx
import { MobileFrame } from '@/components/ui/MobileFrame'

interface DualAppLayoutProps {
  apps: Array<{
    id: string
    title: string
    component: React.ComponentType
  }>
}

export function DualAppLayout({ apps }: DualAppLayoutProps) {
  return (
    <div className="flex gap-8 justify-center p-8 min-h-screen bg-muted/30">
      {apps.map(app => (
        <div key={app.id} className="flex flex-col items-center gap-4">
          <h2 className="font-semibold text-lg">{app.title}</h2>
          <MobileFrame device="iphone" size="md">
            <app.component />
          </MobileFrame>
        </div>
      ))}
    </div>
  )
}
```

### Usage in Prototype
```tsx
// src/prototype/pages/DualPreview.tsx
import { DualAppLayout } from '@/layouts/DualAppLayout'
import { DriverApp } from '@/apps/driver/DriverApp'
import { PassengerApp } from '@/apps/passenger/PassengerApp'

export function DualPreview() {
  return (
    <DualAppLayout
      apps={[
        { id: 'passenger', title: 'Passenger', component: PassengerApp },
        { id: 'driver', title: 'Driver', component: DriverApp },
      ]}
    />
  )
}
```

### Shared State Pattern (Zustand)
```tsx
// src/prototype/shared/state/useOrderState.ts
import { create } from 'zustand'

interface Order {
  id: string
  status: 'pending' | 'accepted' | 'in_progress' | 'completed'
  passenger: { name: string; pickup: string; dropoff: string }
  driver?: { name: string; car: string }
}

interface OrderState {
  orders: Order[]
  currentOrder: Order | null
  // Actions
  createOrder: (data: Omit<Order, 'id' | 'status'>) => void
  acceptOrder: (orderId: string, driver: Order['driver']) => void
  updateStatus: (orderId: string, status: Order['status']) => void
}

export const useOrderState = create<OrderState>((set) => ({
  orders: [],
  currentOrder: null,

  createOrder: (data) =>
    set((state) => {
      const order = { ...data, id: crypto.randomUUID(), status: 'pending' as const }
      return { orders: [...state.orders, order], currentOrder: order }
    }),

  acceptOrder: (orderId, driver) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, status: 'accepted' as const, driver } : o
      ),
      currentOrder: state.currentOrder?.id === orderId
        ? { ...state.currentOrder, status: 'accepted' as const, driver }
        : state.currentOrder,
    })),

  updateStatus: (orderId, status) =>
    set((state) => ({
      orders: state.orders.map((o) => o.id === orderId ? { ...o, status } : o),
      currentOrder: state.currentOrder?.id === orderId
        ? { ...state.currentOrder, status }
        : state.currentOrder,
    })),
}))
```

### State-Based Navigation (No Router)
```tsx
// Each app manages its own screen state - simpler than react-router for prototypes
function DriverApp() {
  const [screen, setScreen] = useState<'home' | 'order' | 'ride'>('home')
  const navigate = (to: typeof screen) => setScreen(to)

  const titles = { home: 'Available Orders', order: 'Order Details', ride: 'Active Ride' }

  return (
    <Screen>
      <ScreenHeader>
        <TopBar
          title={titles[screen]}
          back={screen !== 'home' ? () => navigate('home') : undefined}
        />
      </ScreenHeader>
      <ScreenBody>
        {screen === 'home' && <DriverHome onSelectOrder={() => navigate('order')} />}
        {screen === 'order' && <OrderDetails onAccept={() => navigate('ride')} />}
        {screen === 'ride' && <ActiveRide onComplete={() => navigate('home')} />}
      </ScreenBody>
    </Screen>
  )
}
```

### Synchronized Events Between Apps
```tsx
// Passenger app - reactive to driver actions
function PassengerApp() {
  const { currentOrder } = useOrderState()
  const [screen, setScreen] = useState<'home' | 'booking' | 'waiting' | 'ride'>('home')

  // Auto-navigate when driver accepts
  useEffect(() => {
    if (currentOrder?.status === 'accepted' && screen === 'waiting') {
      // Driver accepted - could show notification, update UI
    }
  }, [currentOrder?.status])

  return (
    <Screen>
      <ScreenBody>
        {screen === 'home' && <PassengerHome onBook={() => setScreen('booking')} />}
        {screen === 'booking' && <BookingForm onSubmit={() => setScreen('waiting')} />}
        {screen === 'waiting' && <WaitingForDriver order={currentOrder} />}
        {screen === 'ride' && <RideInProgress order={currentOrder} />}
      </ScreenBody>
    </Screen>
  )
}
```

### Key Points
- **Single React app** - no iframes, shared bundle, shared state
- **Zustand for sync** - changes in driver app reflect instantly in passenger app
- **State-based navigation** - simpler than react-router for prototypes
- **Side-by-side view** - DualAppLayout renders both MobileFrames
- **Shared types** - common interfaces in `shared/types/`
- **Independent screens** - each app has own screen flow
