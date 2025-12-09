// Event Dispatcher - triggers documented events with visual feedback
//
// CORE MODULE - dispatches events and shows toast notifications
// Events are defined in src/spec/layers/events/*.toml

import { create } from 'zustand'

// Event payload type
export interface EventPayload {
  [key: string]: unknown
}

// Dispatched event info
export interface DispatchedEvent {
  id: string
  eventId: string
  name: string
  description: string
  payload?: EventPayload
  timestamp: number
}

// Event metadata from documentation
export interface EventMeta {
  id: string
  name: string
  description: string
  category?: string
}

// Event store for managing toast queue
interface EventStore {
  events: DispatchedEvent[]
  registry: Map<string, EventMeta>

  // Register event metadata (loaded from docs)
  register: (eventId: string, meta: EventMeta) => void
  registerMany: (events: EventMeta[]) => void

  // Dispatch an event
  dispatch: (eventId: string, payload?: EventPayload) => void

  // Remove event from queue
  dismiss: (id: string) => void

  // Clear all events
  clearAll: () => void
}

// Generate unique ID
function generateId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
}

// Event store
export const useEventStore = create<EventStore>((set, get) => ({
  events: [],
  registry: new Map(),

  register: (eventId, meta) => {
    const registry = new Map(get().registry)
    registry.set(eventId, meta)
    set({ registry })
  },

  registerMany: (events) => {
    const registry = new Map(get().registry)
    events.forEach(e => registry.set(e.id, e))
    set({ registry })
  },

  dispatch: (eventId, payload) => {
    const meta = get().registry.get(eventId)

    const event: DispatchedEvent = {
      id: generateId(),
      eventId,
      name: meta?.name || eventId,
      description: meta?.description || '',
      payload,
      timestamp: Date.now(),
    }

    set(state => ({
      events: [...state.events, event],
    }))

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      get().dismiss(event.id)
    }, 5000)
  },

  dismiss: (id) => {
    set(state => ({
      events: state.events.filter(e => e.id !== id),
    }))
  },

  clearAll: () => {
    set({ events: [] })
  },
}))

/**
 * Dispatch a documented event
 *
 * @example
 * // Simple event
 * dispatchEvent('auth.login')
 *
 * // Event with payload
 * dispatchEvent('cart.add', { productId: '123', quantity: 1 })
 */
export function dispatchEvent(eventId: string, payload?: EventPayload): void {
  useEventStore.getState().dispatch(eventId, payload)
}

/**
 * Register event metadata from documentation
 * Called during app initialization
 */
export function registerEvent(eventId: string, meta: EventMeta): void {
  useEventStore.getState().register(eventId, meta)
}

/**
 * Register multiple events at once
 */
export function registerEvents(events: EventMeta[]): void {
  useEventStore.getState().registerMany(events)
}

/**
 * Hook to get current events (for EventToast component)
 */
export function useEvents() {
  return useEventStore(state => state.events)
}

/**
 * Hook to dismiss an event
 */
export function useDismissEvent() {
  return useEventStore(state => state.dismiss)
}
