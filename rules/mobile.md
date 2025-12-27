# Mobile Development

**⚠️ MANDATORY: Read this ENTIRE file before writing mobile code.**

## Pre-Flight Checklist for Mobile

```
□ Read this file completely (rules/mobile.md)
□ Read rules/prototype.md for general rules
□ Browsed /ui-kit page — use UIKit components, NOT native HTML
□ Understand the app flow: Splash → Onboarding → Auth → Profile → Permissions → Home
□ Every screen (except Home) will have back navigation
```

### Quick Rules

| Rule | Requirement |
|------|-------------|
| **UIKit** | `<Button>` not `<button>`, `<Input>` not `<input>` |
| **Back button** | Every screen except Home |
| **App flow** | Splash → Onboarding → Auth → Profile → Permissions → Home |
| **Onboarding** | 2-4 slides, Skip button visible |
| **Auth** | Email/Phone → OTP (not password) |
| **Permissions** | One at a time, explain why |

**Skipping these rules = rejected prototype.**

---

## CRITICAL: Standard Mobile App Flow

Every mobile app MUST follow this launch sequence:

```
┌─────────────────────────────────────────────────────────────┐
│  1. SPLASH SCREEN (1-2 sec)                                 │
│     └─ App logo, loading indicator                          │
├─────────────────────────────────────────────────────────────┤
│  2. ONBOARDING (skippable, 2-4 slides)                      │
│     └─ First launch only, explain value proposition         │
│     └─ "Skip" button always visible                         │
│     └─ Store completion in localStorage/AsyncStorage        │
├─────────────────────────────────────────────────────────────┤
│  3. AUTH (if required)                                      │
│     ├─ Email/Phone input → OTP verification                 │
│     ├─ Social auth buttons (Google, Apple, etc.)            │
│     └─ Guest mode if applicable                             │
├─────────────────────────────────────────────────────────────┤
│  4. PROFILE SETUP (first-time after auth)                   │
│     └─ Name, avatar, preferences                            │
│     └─ Can be minimal, more fields later                    │
├─────────────────────────────────────────────────────────────┤
│  5. PERMISSIONS (request one-by-one, explain why)           │
│     ├─ Push Notifications                                   │
│     ├─ Location (if needed)                                 │
│     ├─ Contacts (if needed)                                 │
│     └─ Camera/Photos (if needed)                            │
├─────────────────────────────────────────────────────────────┤
│  6. HOME SCREEN                                             │
│     └─ Main app content, bottom navigation                  │
└─────────────────────────────────────────────────────────────┘
```

### Flow Decision Tree

```
App Launch
    │
    ├─ First launch? ──YES──→ Show Onboarding → Mark as seen
    │       │
    │      NO
    │       │
    ├─ Auth required? ──YES──→ Is logged in? ──NO──→ Auth Screen
    │       │                        │
    │      NO                       YES
    │       │                        │
    │       ├─ Profile complete? ──NO──→ Profile Setup
    │       │         │
    │       │        YES
    │       │         │
    │       └─ Permissions granted? ──NO──→ Permission Requests
    │                 │
    │                YES
    │                 │
    └────────────────→ HOME SCREEN
```

### Implementation Pattern

```tsx
// src/prototype/apps/[appname]/App.tsx
function App() {
  const [step, setStep] = useState<
    'splash' | 'onboarding' | 'auth' | 'profile' | 'permissions' | 'home'
  >('splash')

  const { isAuthenticated, user } = useAuth()
  const hasSeenOnboarding = localStorage.getItem('onboarding_complete')
  const hasGrantedPermissions = localStorage.getItem('permissions_granted')

  useEffect(() => {
    // Splash timeout
    const timer = setTimeout(() => {
      if (!hasSeenOnboarding) {
        setStep('onboarding')
      } else if (!isAuthenticated) {
        setStep('auth')
      } else if (!user?.profileComplete) {
        setStep('profile')
      } else if (!hasGrantedPermissions) {
        setStep('permissions')
      } else {
        setStep('home')
      }
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Screen>
      {step === 'splash' && <SplashScreen />}
      {step === 'onboarding' && <OnboardingSlider onComplete={() => setStep('auth')} onSkip={() => setStep('auth')} />}
      {step === 'auth' && <AuthScreen onSuccess={() => setStep('profile')} />}
      {step === 'profile' && <ProfileSetup onComplete={() => setStep('permissions')} />}
      {step === 'permissions' && <PermissionsScreen onComplete={() => setStep('home')} />}
      {step === 'home' && <HomeScreen />}
    </Screen>
  )
}
```

### Auth Screen Pattern (OTP-based)

```tsx
function AuthScreen({ onSuccess }) {
  const [stage, setStage] = useState<'input' | 'otp'>('input')
  const [contact, setContact] = useState('')

  return (
    <Screen>
      <ScreenHeader>
        <TopBar title={stage === 'input' ? 'Sign In' : 'Verify'} />
      </ScreenHeader>
      <ScreenBody padding="lg">
        {stage === 'input' && (
          <>
            <Input
              placeholder="Email or Phone"
              value={contact}
              onChange={e => setContact(e.target.value)}
            />
            <Button onClick={() => setStage('otp')}>Continue</Button>
          </>
        )}
        {stage === 'otp' && (
          <>
            <p>Enter code sent to {contact}</p>
            <OTPInput length={6} onComplete={onSuccess} />
            <Button variant="ghost" onClick={() => setStage('input')}>
              Change number
            </Button>
          </>
        )}
      </ScreenBody>
    </Screen>
  )
}
```

---

## CRITICAL: Back Navigation

**EVERY screen (except Home) MUST have back navigation.**

### Rules

1. **TopBar `back` prop** — always provide on non-root screens
2. **Hardware back button** — handle on Android (React Native)
3. **Swipe gesture** — iOS edge swipe should work
4. **Modal dismiss** — swipe down or X button

### Pattern

```tsx
// ✅ CORRECT - back navigation present
function ProductScreen({ onBack }) {
  return (
    <Screen>
      <ScreenHeader>
        <TopBar title="Product" back={onBack} />
      </ScreenHeader>
      <ScreenBody>...</ScreenBody>
    </Screen>
  )
}

// ❌ WRONG - no back navigation
function ProductScreen() {
  return (
    <Screen>
      <ScreenHeader>
        <TopBar title="Product" />  {/* Missing back! */}
      </ScreenHeader>
      ...
    </Screen>
  )
}
```

### Navigation State Pattern

```tsx
function App() {
  const [history, setHistory] = useState<string[]>(['home'])
  const currentScreen = history[history.length - 1]

  const navigate = (screen: string) => {
    setHistory([...history, screen])
  }

  const goBack = () => {
    if (history.length > 1) {
      setHistory(history.slice(0, -1))
    }
  }

  const canGoBack = history.length > 1

  return (
    <Screen>
      <ScreenHeader>
        <TopBar
          title={titles[currentScreen]}
          back={canGoBack ? goBack : undefined}
        />
      </ScreenHeader>
      <ScreenBody>
        {currentScreen === 'home' && <Home onNavigate={navigate} />}
        {currentScreen === 'product' && <Product onBack={goBack} />}
        {currentScreen === 'cart' && <Cart onBack={goBack} />}
      </ScreenBody>
    </Screen>
  )
}
```

---

## CRITICAL: Onboarding Slides

### Requirements

- **2-4 slides maximum** — don't overwhelm users
- **Skip button always visible** — respect user's time
- **Progress indicator** — dots or progress bar
- **Last slide has CTA** — "Get Started" button

### Pattern

```tsx
interface OnboardingSlide {
  image: string
  title: string
  description: string
}

function OnboardingSlider({ onComplete, onSkip }: { onComplete: () => void; onSkip: () => void }) {
  const [current, setCurrent] = useState(0)

  const slides: OnboardingSlide[] = [
    { image: '/onboarding-1.svg', title: 'Welcome', description: 'Discover amazing features' },
    { image: '/onboarding-2.svg', title: 'Easy to Use', description: 'Simple and intuitive interface' },
    { image: '/onboarding-3.svg', title: 'Get Started', description: 'Create your account now' },
  ]

  const isLast = current === slides.length - 1

  const handleNext = () => {
    if (isLast) {
      localStorage.setItem('onboarding_complete', 'true')
      onComplete()
    } else {
      setCurrent(current + 1)
    }
  }

  return (
    <Screen>
      <ScreenHeader>
        <TopBar rightAction={<Button variant="ghost" onClick={onSkip}>Skip</Button>} />
      </ScreenHeader>
      <ScreenBody className="flex flex-col items-center justify-center text-center p-8">
        <img src={slides[current].image} className="w-64 h-64 mb-8" />
        <h2 className="text-2xl font-bold mb-2">{slides[current].title}</h2>
        <p className="text-muted-foreground mb-8">{slides[current].description}</p>

        {/* Progress dots */}
        <div className="flex gap-2 mb-8">
          {slides.map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                i === current ? 'bg-primary' : 'bg-muted'
              )}
            />
          ))}
        </div>

        <Button onClick={handleNext} className="w-full">
          {isLast ? 'Get Started' : 'Next'}
        </Button>
      </ScreenBody>
    </Screen>
  )
}
```

---

## CRITICAL: Permissions Screen

### Rules

1. **Request one at a time** — don't ask all at once
2. **Explain why** — show benefit before system dialog
3. **Allow skip** — "Maybe Later" option
4. **Remember choice** — don't ask again if denied

### Pattern

```tsx
interface Permission {
  id: string
  title: string
  description: string
  icon: LucideIcon
}

function PermissionsScreen({ onComplete }: { onComplete: () => void }) {
  const [current, setCurrent] = useState(0)

  const permissions: Permission[] = [
    {
      id: 'notifications',
      title: 'Stay Updated',
      description: 'Get notified about orders, messages, and special offers',
      icon: Bell,
    },
    {
      id: 'location',
      title: 'Find Nearby',
      description: 'Discover stores and services near you',
      icon: MapPin,
    },
  ]

  const handleAllow = async () => {
    // In real app: request actual permission
    // await Permissions.request(permissions[current].id)
    if (current < permissions.length - 1) {
      setCurrent(current + 1)
    } else {
      localStorage.setItem('permissions_granted', 'true')
      onComplete()
    }
  }

  const handleSkip = () => {
    if (current < permissions.length - 1) {
      setCurrent(current + 1)
    } else {
      localStorage.setItem('permissions_granted', 'true')
      onComplete()
    }
  }

  const perm = permissions[current]
  const Icon = perm.icon

  return (
    <Screen>
      <ScreenBody className="flex flex-col items-center justify-center text-center p-8">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Icon className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">{perm.title}</h2>
        <p className="text-muted-foreground mb-8">{perm.description}</p>

        <div className="w-full space-y-3">
          <Button onClick={handleAllow} className="w-full">Allow</Button>
          <Button variant="ghost" onClick={handleSkip} className="w-full">Maybe Later</Button>
        </div>
      </ScreenBody>
    </Screen>
  )
}
```

---

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

## Multi-App Architecture (2+ Apps)

For projects with multiple user-facing apps sharing the same data (driver/passenger, customer/courier/admin, patient/doctor/clinic).

### Common Configurations

| Config | Apps | Example |
|--------|------|---------|
| **Dual** | 2 mobile | Taxi: passenger + driver |
| **Triple** | 2 mobile + admin | Delivery: customer + courier + admin panel |
| **Quad** | 2 mobile + 2 web | Marketplace: buyer app + seller app + buyer web + admin |

### When to Use
When `interview.toml` has:
```toml
appSides = "multi"                           # "single" | "dual" | "multi"
appSidesList = ["customer", "courier", "admin"]
```

### Directory Structure
```
src/prototype/
├── apps/
│   ├── customer/                 # Mobile app
│   │   ├── CustomerApp.tsx
│   │   └── screens/
│   ├── courier/                  # Mobile app
│   │   ├── CourierApp.tsx
│   │   └── screens/
│   └── admin/                    # Web panel (no MobileFrame)
│       ├── AdminApp.tsx
│       └── pages/
├── pages/
│   ├── MultiAppPreview.tsx       # Desktop: all apps side-by-side
│   ├── customer/
│   │   └── index.tsx             # Mobile: fullscreen
│   ├── courier/
│   │   └── index.tsx             # Mobile: fullscreen
│   └── admin/
│       └── index.tsx             # Web: fullscreen
├── shared/
│   └── types/
│       └── order.types.ts        # Shared TypeScript types
└── factories/
    └── index.ts                  # Shared entity factories + useRepo
```

### MultiAppPreview Component (Desktop)

```tsx
// src/prototype/pages/MultiAppPreview.tsx
import { MobileFrame } from '@/components/ui'
import { CustomerApp } from '@prototype/apps/customer/CustomerApp'
import { CourierApp } from '@prototype/apps/courier/CourierApp'
import { AdminApp } from '@prototype/apps/admin/AdminApp'

export function MultiAppPreview() {
  const apps = [
    { id: 'customer', title: 'Customer App', component: CustomerApp, type: 'mobile' },
    { id: 'courier', title: 'Courier App', component: CourierApp, type: 'mobile' },
    { id: 'admin', title: 'Admin Panel', component: AdminApp, type: 'web' },
  ]

  return (
    <div className="flex gap-8 justify-center p-8 min-h-screen bg-muted/30 flex-wrap">
      {apps.map(app => (
        <div key={app.id} className="flex flex-col items-center gap-4">
          <h2 className="font-semibold text-lg">{app.title}</h2>

          {/* Mobile apps in MobileFrame, web apps in BrowserFrame */}
          {app.type === 'mobile' ? (
            <MobileFrame device="iphone" size="md">
              <app.component />
            </MobileFrame>
          ) : (
            <BrowserFrame width={400} height={600}>
              <app.component />
            </BrowserFrame>
          )}

          {/* Deep link for standalone testing */}
          <a
            href={`/prototype/${app.id}`}
            className="text-sm text-primary hover:underline"
            target="_blank"
          >
            Open fullscreen →
          </a>
        </div>
      ))}
    </div>
  )
}
```

### App Types

| Type | Frame | Use For |
|------|-------|---------|
| `mobile` | MobileFrame (iPhone/Android) | Customer apps, driver apps |
| `web` | BrowserFrame | Admin panels, dashboards |

### Namespaced Auth (CRITICAL)

**Each app MUST use its own auth namespace** to avoid conflicts:

```tsx
// Customer app - stored as 'auth-customer'
function CustomerApp() {
  const { user, login, logout } = useAuth<Customer>({ namespace: 'customer' })
}

// Courier app - stored as 'auth-courier'
function CourierApp() {
  const { user, login, logout } = useAuth<Courier>({ namespace: 'courier' })
}

// Admin app - stored as 'auth-admin'
function AdminApp() {
  const { user, login, logout } = useAuth<Admin>({ namespace: 'admin' })
}
```

**Why namespace?** Without it, all apps share one auth state — logging in as courier would also log in as customer.

| Without namespace | With namespace |
|-------------------|----------------|
| Single `auth` key | `auth-customer` + `auth-courier` + `auth-admin` |
| Login affects all apps | Independent auth per app |
| Can't test simultaneously | Each app has own session |

---

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

### Key Rules Summary

| Rule | Requirement |
|------|-------------|
| **Auth** | `useAuth({ namespace: 'appname' })` — separate auth per app |
| **Data** | `useRepo('collection')` — shared repo for cross-app interaction |
| **Architecture** | App component works in Frame AND standalone fullscreen |
| **Links** | Each framed app shows direct link for testing |
| **Mobile apps** | Use `MobileFrame` (iPhone/Android frame) |
| **Web apps** | Use `BrowserFrame` (admin panels, dashboards) |

---

### CRITICAL: Shared useRepo for Cross-App Data

**Use `useRepo` (not separate Zustand stores) for shared data** — this demonstrates real-world interaction where both apps work with the same database.

```tsx
// Both apps use the SAME repository — changes sync automatically
// Driver app
function DriverApp() {
  const orders = useRepo<Order>('orders')
  const pendingOrders = orders.data.filter(o => o.status === 'pending')

  const acceptOrder = (order: Order) => {
    orders.update(order.id, {
      status: 'accepted',
      driverId: currentDriver.id
    })
    dispatchEvent('order.accepted', { orderId: order.id })
  }
}

// Passenger app — sees the SAME data
function PassengerApp() {
  const orders = useRepo<Order>('orders')
  const myOrder = orders.data.find(o => o.passengerId === currentUser.id)

  // When driver accepts, myOrder.status changes automatically
  // No need for separate Zustand sync — useRepo handles it
}
```

**Why useRepo over Zustand for shared data:**
- Single source of truth (localStorage)
- Automatic sync between apps
- Built-in CRUD operations
- Matches real backend behavior (shared DB)

**When to use Zustand:**
- App-specific UI state (current screen, modals)
- Ephemeral state that shouldn't persist

---

### CRITICAL: Standalone Mode Architecture

**Every app MUST work both in MobileFrame AND as fullscreen page.**

This allows:
1. Side-by-side preview on desktop (in frames)
2. Direct testing on real mobile device (fullscreen, no frame)

#### App Component Pattern

```tsx
// src/prototype/apps/driver/DriverApp.tsx
// This component renders ONLY the app content — no frame!

export function DriverApp() {
  const { user, login, logout } = useAuth<Driver>({ namespace: 'driver' })
  const [screen, setScreen] = useState<'home' | 'order' | 'ride'>('home')

  // App flow logic here...

  return (
    <Screen>
      <ScreenHeader>
        <TopBar title={titles[screen]} back={...} />
      </ScreenHeader>
      <ScreenBody>
        {/* screens */}
      </ScreenBody>
      <ScreenFooter>
        <BottomNav items={navItems} />
      </ScreenFooter>
    </Screen>
  )
}
```

#### Dual Preview Page (Desktop — with frames)

```tsx
// src/prototype/pages/DualPreview.tsx
import { DriverApp } from '@prototype/apps/driver/DriverApp'
import { PassengerApp } from '@prototype/apps/passenger/PassengerApp'

export function DualPreview() {
  return (
    <div className="flex gap-8 justify-center p-8 min-h-screen bg-muted/30">
      {/* Passenger App */}
      <div className="flex flex-col items-center gap-4">
        <h2 className="font-semibold text-lg">Passenger</h2>
        <MobileFrame device="iphone" size="md">
          <PassengerApp />
        </MobileFrame>
        <a
          href="/prototype/passenger"
          className="text-sm text-primary hover:underline"
          target="_blank"
        >
          Open fullscreen →
        </a>
      </div>

      {/* Driver App */}
      <div className="flex flex-col items-center gap-4">
        <h2 className="font-semibold text-lg">Driver</h2>
        <MobileFrame device="iphone" size="md">
          <DriverApp />
        </MobileFrame>
        <a
          href="/prototype/driver"
          className="text-sm text-primary hover:underline"
          target="_blank"
        >
          Open fullscreen →
        </a>
      </div>
    </div>
  )
}
```

#### Standalone Pages (Mobile — fullscreen)

```tsx
// src/prototype/pages/driver/index.tsx
// Route: /prototype/driver
import { DriverApp } from '@prototype/apps/driver/DriverApp'

export default function DriverStandalone() {
  return (
    <div className="h-screen w-screen">
      <DriverApp />
    </div>
  )
}
```

```tsx
// src/prototype/pages/passenger/index.tsx
// Route: /prototype/passenger
import { PassengerApp } from '@prototype/apps/passenger/PassengerApp'

export default function PassengerStandalone() {
  return (
    <div className="h-screen w-screen">
      <PassengerApp />
    </div>
  )
}
```

#### Route Configuration

```tsx
// In App.tsx or routes config
<Route path="/prototype" element={<DualPreview />} />
<Route path="/prototype/driver/*" element={<DriverStandalone />} />
<Route path="/prototype/passenger/*" element={<PassengerStandalone />} />
```

---

### Testing Flow

1. **Desktop Preview:** Open `/prototype` — see all apps side by side in frames
2. **Mobile Testing:**
   - Scan QR code or type URL on phone
   - Open `/prototype/customer` — fullscreen customer app
   - Open `/prototype/courier` — fullscreen courier app
3. **Admin Testing:** Open `/prototype/admin` — fullscreen admin panel (web)
4. **Cross-App Sync:** Actions in one app reflect in others (shared useRepo)

---

### Directory Structure (Complete - Triple App Example)

```
src/prototype/
├── apps/
│   ├── customer/                   # Mobile app
│   │   ├── CustomerApp.tsx         # Main component (no frame!)
│   │   └── screens/
│   │       ├── HomeScreen.tsx
│   │       ├── OrderScreen.tsx
│   │       └── TrackingScreen.tsx
│   ├── courier/                    # Mobile app
│   │   ├── CourierApp.tsx
│   │   └── screens/
│   │       ├── HomeScreen.tsx
│   │       ├── DeliveryScreen.tsx
│   │       └── EarningsScreen.tsx
│   └── admin/                      # Web panel
│       ├── AdminApp.tsx
│       └── pages/
│           ├── Dashboard.tsx
│           ├── Orders.tsx
│           └── Users.tsx
├── pages/
│   ├── MultiAppPreview.tsx         # Desktop: all apps in frames
│   ├── customer/
│   │   └── index.tsx               # Mobile: fullscreen
│   ├── courier/
│   │   └── index.tsx               # Mobile: fullscreen
│   └── admin/
│       └── index.tsx               # Web: fullscreen
├── shared/
│   └── types/
│       └── order.types.ts          # Shared TypeScript types
└── factories/
    └── index.ts                    # Shared entity factories
```

### Key Points
- **Single React app** - no iframes, shared bundle
- **useRepo for data** - shared state syncs between apps automatically
- **useAuth with namespace** - separate auth per app
- **Standalone architecture** - app works in frame AND fullscreen
- **Deep links** - each app has direct URL for testing
- **Frame types** - MobileFrame for mobile apps, BrowserFrame for web panels

---

## CRITICAL: Frame-Scoped Components

When rendering inside `MobileFrame`, overlay components (dialogs, sheets, toasts) MUST render **inside the frame**, not globally in body.

### The Problem

```tsx
// ❌ WRONG - Dialog appears outside MobileFrame (in body)
<MobileFrame>
  <Dialog>
    <DialogContent>  {/* Uses fixed positioning + portal to body */}
      ...
    </DialogContent>
  </Dialog>
</MobileFrame>
```

### The Solution: `inline` prop

All overlay components support `inline` prop for frame-scoped rendering:

```tsx
// ✅ CORRECT - Dialog renders inside MobileFrame
<MobileFrame>
  <Screen className="relative">  {/* MUST have relative or position container */}
    <Dialog>
      <DialogContent inline>  {/* Uses absolute positioning, no portal */}
        ...
      </DialogContent>
    </Dialog>
  </Screen>
</MobileFrame>
```

### Components with `inline` support

| Component | Prop | Effect |
|-----------|------|--------|
| `DialogContent` | `inline` | Renders absolute, no portal |
| `AlertDialogContent` | `inline` | Renders absolute, no portal |
| `SheetContent` | `inline` | Renders absolute, no portal |
| `DrawerContent` | `inline` | Renders absolute, no portal |

### How it works

- **Default (no inline):** `position: fixed` + renders via portal to `<body>` — for fullscreen apps
- **With inline:** `position: absolute` + renders in place — for MobileFrame

### Requirements for `inline` mode

1. **Parent must have `position: relative`** — Screen component already has this
2. **Parent must have defined dimensions** — MobileFrame provides this

### Toast/Snackbar in Frame

Use `MobileToastProvider` instead of Sonner:

```tsx
<MobileFrame>
  <MobileToastProvider position="bottom">
    <Screen>
      <MyApp />
    </Screen>
  </MobileToastProvider>
</MobileFrame>

// Inside MyApp:
function MyApp() {
  const { show } = useToast()

  return (
    <Button onClick={() => show({ message: 'Saved!', type: 'success' })}>
      Save
    </Button>
  )
}
```

### Full Example with Frame-Scoped Dialog

```tsx
function MyMobileApp() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <MobileFrame device="iphone" size="md">
      <Screen className="relative">
        <ScreenHeader>
          <TopBar title="Settings" />
        </ScreenHeader>
        <ScreenBody>
          <Button onClick={() => setDialogOpen(true)}>
            Delete Account
          </Button>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent inline>  {/* KEY: inline prop */}
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive">Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </ScreenBody>
      </Screen>
    </MobileFrame>
  )
}
```

### Common Mistakes

```tsx
// ❌ Missing inline - dialog escapes frame
<DialogContent>...</DialogContent>

// ❌ Missing relative parent - absolute won't work
<div>  {/* no position: relative */}
  <DialogContent inline>...</DialogContent>
</div>

// ✅ Correct
<div className="relative h-full">
  <DialogContent inline>...</DialogContent>
</div>
```

### Rule Summary

| Context | Use |
|---------|-----|
| **Fullscreen app** (no frame) | Default (no inline) |
| **Inside MobileFrame** | `inline` prop on all overlays |
| **Multi-app preview** | Each app uses `inline` |

---

## CRITICAL: Toast/Notification Usage

**Use toasts for errors, NOT for success.**

### Why?
- Success toasts interrupt user flow and feel patronizing
- Users expect actions to succeed — confirming obvious success is noise
- Error toasts are essential — users need to know when something fails

### Rules

| Action Result | Feedback Type |
|---------------|---------------|
| **Success** | Visual change in UI (checkmark, state update, navigation) |
| **Error** | Toast with error message |
| **Warning** | Toast (optional, for non-blocking issues) |
| **Loading** | Spinner/skeleton, NOT toast |

### Examples

```tsx
// ❌ WRONG - Success toast is annoying
const handleSave = async () => {
  await saveData()
  toast.show({ message: 'Saved successfully!', type: 'success' })  // DON'T
}

// ✅ CORRECT - Show error only
const handleSave = async () => {
  try {
    await saveData()
    // Success: navigate away, update UI, show checkmark — no toast
    navigate('/list')
  } catch (error) {
    toast.show({ message: 'Failed to save. Try again.', type: 'error' })
  }
}
```

```tsx
// ❌ WRONG - Toast for every action
<Button onClick={() => {
  addToCart(item)
  toast.show({ message: 'Added to cart!', type: 'success' })
}}>
  Add to Cart
</Button>

// ✅ CORRECT - Visual feedback without toast
<Button onClick={() => {
  addToCart(item)
  // Cart badge updates, button shows checkmark briefly
}}>
  {added ? <Check /> : 'Add to Cart'}
</Button>
```

### When to Use Toasts

| Use Toast | Don't Use Toast |
|-----------|-----------------|
| API/network errors | Successful saves |
| Validation failures | Item added to cart |
| Permission denied | Form submitted |
| Timeout/connection issues | Profile updated |
| Destructive action confirmation | Navigation success |

### Good Error Toast Patterns

```tsx
// Actionable error
toast.show({
  message: 'Connection lost',
  type: 'error',
  action: { label: 'Retry', onClick: retry }
})

// Brief, clear error
toast.show({ message: 'Payment failed. Check your card.', type: 'error' })

// With duration for important errors
toast.show({
  message: 'Session expired. Please log in again.',
  type: 'error',
  duration: 5000
})
```

### Success Feedback Alternatives

Instead of success toasts, use:
- **Navigation** — go to next screen after success
- **UI state change** — button turns to checkmark, item appears in list
- **Inline message** — "Changes saved" text near the action
- **Animation** — brief success animation (SuccessAnimation component)
- **Badge update** — cart count increases, notification dot appears

---

## Reference: Mobile Test Page

For a working example of mobile components inside `MobileFrame`, see:

**`src/prototype/pages/MobileTest.tsx`**

This file demonstrates:
- `MobileFrame` with iPhone device frame
- `TopBar` with `DropdownMenu` in rightAction
- `Dialog` with `inline` prop for proper containment
- `Sheet` with `inline` prop and `side="bottom"`
- `Drawer` with `inline` prop (Vaul library)
- `SimpleBottomSheet` and `BottomSheet` (custom components)
- `AppProvider` usage for disabling doc links and event toasts

**Key pattern for overlays inside MobileFrame:**

```tsx
// Always use inline prop for Radix-based components inside MobileFrame
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent inline>  {/* ← inline prevents portal to body */}
    ...
  </DialogContent>
</Dialog>

<Sheet>
  <SheetTrigger asChild>
    <Button>Open</Button>
  </SheetTrigger>
  <SheetContent side="bottom" inline>  {/* ← inline for MobileFrame */}
    ...
  </SheetContent>
</Sheet>

<Drawer>
  <DrawerTrigger asChild>
    <Button>Open</Button>
  </DrawerTrigger>
  <DrawerContent inline>  {/* ← inline for MobileFrame */}
    ...
  </DrawerContent>
</Drawer>
```

Run `/prototype/mobile-test` to see these components in action.
