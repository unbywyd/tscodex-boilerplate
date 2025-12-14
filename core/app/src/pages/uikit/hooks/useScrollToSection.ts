import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Scrolls to element with id matching the last segment of the URL path.
 * Used in demo pages to scroll to specific component demos.
 */
export function useScrollToSection() {
  const location = useLocation()

  useEffect(() => {
    const sectionId = location.pathname.split('/').pop()
    if (sectionId) {
      // Small delay to ensure DOM is ready
      requestAnimationFrame(() => {
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      })
    }
  }, [location.pathname])
}
