// Event Toast - displays dispatched events as non-intrusive notifications
// Shows event name, truncated description, and link to documentation

import { useEvents, useDismissEvent, type DispatchedEvent } from '@/lib/events'
import { X, ExternalLink, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

// Truncate text to max length
function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + '...'
}

// Convert event ID to docs route
function getDocsRoute(eventId: string): string {
  // event.id like "cart.add" -> filename like "cart-add"
  const fileName = eventId.replace(/\./g, '-')
  return `/docs/layers/events/${fileName}`
}

// Category colors
const categoryColors: Record<string, string> = {
  auth: 'bg-blue-500',
  commerce: 'bg-green-500',
  form: 'bg-purple-500',
  navigation: 'bg-orange-500',
  default: 'bg-slate-500',
}

function EventToastItem({ event }: { event: DispatchedEvent }) {
  const dismiss = useDismissEvent()

  // Extract category from eventId (first part before dot)
  const category = event.eventId.split('.')[0] || 'default'
  const dotColor = categoryColors[category] || categoryColors.default

  return (
    <div className="bg-background border rounded-lg shadow-lg p-3 min-w-[280px] max-w-[360px] animate-in slide-in-from-left-5 fade-in duration-300">
      <div className="flex items-start gap-2">
        {/* Category indicator */}
        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${dotColor}`} />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="font-medium text-sm truncate">{event.name}</span>
          </div>

          {event.description && (
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {truncate(event.description, 80)}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 mt-2">
            <Link
              to={getDocsRoute(event.eventId)}
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              Details
            </Link>
            <span className="text-xs text-muted-foreground">
              {event.eventId}
            </span>
          </div>
        </div>

        {/* Dismiss button */}
        <button
          onClick={() => dismiss(event.id)}
          className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default function EventToast() {
  const events = useEvents()

  if (events.length === 0) return null

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
      {events.map(event => (
        <EventToastItem key={event.id} event={event} />
      ))}
    </div>
  )
}
