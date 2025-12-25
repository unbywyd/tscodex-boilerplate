import { createContext, useContext, type ReactNode } from 'react'
import { DocProvider } from './documented'
import EventToast from './EventToast'

// ============================================
// Types
// ============================================

interface AppSettings {
  /** Show doc link buttons (?) on components */
  showDocLinks: boolean
  /** Show event toast notifications */
  showEventToasts: boolean
}

interface AppProviderProps {
  children: ReactNode
  /** Show doc link buttons (?) on components. Default: true */
  showDocLinks?: boolean
  /** Show event toast notifications. Default: true */
  showEventToasts?: boolean
}

// ============================================
// Context
// ============================================

const AppSettingsContext = createContext<AppSettings>({
  showDocLinks: true,
  showEventToasts: true,
})

// ============================================
// Provider
// ============================================

export function AppProvider({
  children,
  showDocLinks = true,
  showEventToasts = true,
}: AppProviderProps) {
  return (
    <AppSettingsContext.Provider value={{ showDocLinks, showEventToasts }}>
      <DocProvider showDocLinks={showDocLinks}>
        {showEventToasts && <EventToast />}
        {children}
      </DocProvider>
    </AppSettingsContext.Provider>
  )
}

// ============================================
// Hook
// ============================================

export function useAppSettings(): AppSettings {
  return useContext(AppSettingsContext)
}
