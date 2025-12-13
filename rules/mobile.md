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

## Mobile Frame for Desktop Testing

When generating mobile prototypes, wrap the entire app in a mobile device frame so it can be tested on desktop browsers with correct proportions.

### MobileFrame Component

Create `src/prototype/components/MobileFrame.tsx`:

```tsx
interface MobileFrameProps {
  children: React.ReactNode
  device?: 'iphone' | 'android'  // default: 'iphone'
}

const deviceSizes = {
  iphone: { width: 390, height: 844 },    // iPhone 14
  android: { width: 360, height: 800 },   // Standard Android
}

export function MobileFrame({ children, device = 'iphone' }: MobileFrameProps) {
  const size = deviceSizes[device]

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div
        className="bg-black rounded-[3rem] p-3 shadow-2xl"
        style={{ width: size.width + 24, height: size.height + 24 }}
      >
        {/* Notch */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full z-10" />

        {/* Screen */}
        <div
          className="bg-white rounded-[2.5rem] overflow-hidden relative"
          style={{ width: size.width, height: size.height }}
        >
          <div className="h-full overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
```

### Usage in App

Wrap main app or router:

```tsx
// src/prototype/App.tsx
import { MobileFrame } from './components/MobileFrame'

function App() {
  return (
    <MobileFrame device="iphone">
      <Routes>
        {/* mobile screens */}
      </Routes>
    </MobileFrame>
  )
}
```

### Responsive Check

For testing both mobile and desktop views, add a toggle:

```tsx
const [showFrame, setShowFrame] = useState(true)

// In dev mode, allow toggling frame on/off
if (!showFrame) return <>{children}</>
```

### Key Points

- **Fixed dimensions**: Use 390x844 (iPhone) or 360x800 (Android)
- **Safe areas**: Account for notch/status bar (top ~44px) and home indicator (bottom ~34px)
- **Touch targets**: Minimum 44x44px for tappable elements
- **Bottom nav**: Place primary navigation at bottom, within thumb reach

## From Spec to Mobile
```
entities/*.toml → Models
routes/*.toml → Screens
use-cases/*.toml → User flows
guards/*.toml → Auth gates
```
