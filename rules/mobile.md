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
