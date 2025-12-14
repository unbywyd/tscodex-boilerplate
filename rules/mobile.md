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

### Namespaced Auth (CRITICAL for Dual-App)

**Each app MUST use its own auth namespace** to avoid conflicts:

```tsx
// Driver app - stored in localStorage as 'auth-driver'
function DriverApp() {
  const { user, login, logout } = useAuth<Driver>({ namespace: 'driver' })
  // ...
}

// Passenger app - stored in localStorage as 'auth-passenger'
function PassengerApp() {
  const { user, login, logout } = useAuth<Passenger>({ namespace: 'passenger' })
  // ...
}
```

**Why namespace?** Without it, both apps share one auth state — logging in as driver would also log in as passenger.

| Without namespace | With namespace |
|-------------------|----------------|
| Single `auth` key in localStorage | `auth-driver` + `auth-passenger` separate keys |
| Login in one app affects other | Independent auth states |
| Can't test both apps simultaneously | Each app has own session |

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

### Key Points
- **Single React app** - no iframes, shared bundle, shared state
- **Zustand for sync** - changes in driver app reflect instantly in passenger app
- **State-based navigation** - simpler than react-router for prototypes
- **Side-by-side view** - DualAppLayout renders both MobileFrames
- **Shared types** - common interfaces in `shared/types/`
- **Independent screens** - each app has own screen flow
