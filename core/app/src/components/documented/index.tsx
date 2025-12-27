import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { HelpCircle, ExternalLink, Copy, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useDocRegistry } from './DocContext'

export { DocProvider } from './DocContext'

// ============================================
// Helpers
// ============================================

// Parse doc string like "routes.users" or "components.user-card"
function parseDocString(doc: string): { layer: string; id: string } | null {
  const parts = doc.split('.')
  if (parts.length !== 2) return null
  return { layer: parts[0], id: parts[1] }
}

// Build doc path from layer and id
function buildDocPath(layer: string, id: string): string {
  return `/docs/layers/${layer}/${id}`
}

// Determine data attribute based on layer type
function getDataAttribute(layer: string): 'data-screen' | 'data-component' {
  if (['routes', 'pages', 'screens'].includes(layer)) {
    return 'data-screen'
  }
  return 'data-component'
}

// ============================================
// DocLinkPopover (fixed position with JS coordinates)
// ============================================

interface DocLinkPopoverProps {
  docPath: string
  title?: string
  description?: string
  /** Reference to the parent element for positioning */
  parentRef: React.RefObject<HTMLElement | null>
}

function DocLinkPopover({ docPath, title, description, parentRef }: DocLinkPopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, right: 0 })
  const [copied, setCopied] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Update position based on parent element
  const updatePosition = useCallback(() => {
    if (!parentRef.current) return
    const rect = parentRef.current.getBoundingClientRect()
    setPosition({
      top: rect.top + 4, // 4px from top
      right: window.innerWidth - rect.right + 4, // 4px from right
    })
  }, [parentRef])

  // Handle hover state from parent
  useEffect(() => {
    const parent = parentRef.current
    if (!parent) return

    const handleMouseEnter = () => {
      updatePosition()
      setIsVisible(true)
    }
    const handleMouseLeave = (e: MouseEvent) => {
      // Don't hide if mouse is over the popover
      const relatedTarget = e.relatedTarget as Node | null
      if (popoverRef.current?.contains(relatedTarget) || buttonRef.current?.contains(relatedTarget)) {
        return
      }
      if (!isOpen) {
        setIsVisible(false)
      }
    }

    parent.addEventListener('mouseenter', handleMouseEnter)
    parent.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      parent.removeEventListener('mouseenter', handleMouseEnter)
      parent.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [parentRef, updatePosition, isOpen])

  // Update position on scroll/resize
  useEffect(() => {
    if (!isVisible && !isOpen) return

    const handleUpdate = () => updatePosition()
    window.addEventListener('scroll', handleUpdate, true)
    window.addEventListener('resize', handleUpdate)

    return () => {
      window.removeEventListener('scroll', handleUpdate, true)
      window.removeEventListener('resize', handleUpdate)
    }
  }, [isVisible, isOpen, updatePosition])

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(docPath)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Close popover on outside click
  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setIsVisible(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Handle mouse leave from popover
  const handlePopoverMouseLeave = () => {
    if (!isOpen) {
      setIsVisible(false)
    }
  }

  if (!isVisible && !isOpen) return null

  return createPortal(
    <div
      ref={popoverRef}
      className="fixed z-[9999]"
      style={{ top: position.top, right: position.right }}
      onMouseLeave={handlePopoverMouseLeave}
    >
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="p-1 rounded-full bg-black text-white border-2 border-white shadow-md
          hover:bg-black/80 transition-all"
        title={title || 'View documentation'}
      >
        <HelpCircle className="h-4 w-4" />
      </button>

      {isOpen && (
        <div
          className="absolute top-full right-0 mt-1 min-w-[300px] max-w-[400px] p-3 rounded-lg
            bg-popover border border-border shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Title and description */}
          {title && (
            <div className="font-medium text-sm mb-1">{title}</div>
          )}
          {description && (
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{description}</p>
          )}

          {/* Path */}
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs bg-muted px-2 py-1.5 rounded truncate">
              {docPath}
            </code>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded hover:bg-muted transition-colors shrink-0"
              title="Copy path"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>

          {/* Open button */}
          <div className="flex gap-2 mt-3">
            <Link
              to={docPath}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs px-3 py-1.5
                rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              onClick={() => {
                setIsOpen(false)
                setIsVisible(false)
              }}
            >
              <ExternalLink className="h-3 w-3" />
              Open documentation
            </Link>
          </div>
        </div>
      )}
    </div>,
    document.body
  )
}

// ============================================
// FloatingDocButton (absolute position within parent)
// ============================================

type Position = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'

interface FloatingDocButtonProps {
  docPath: string
  title?: string
  description?: string
  position: Position
}

function FloatingDocButton({ docPath, title, description, position }: FloatingDocButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(docPath)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Position classes for button (absolute to nearest positioned ancestor)
  const positionClasses: Record<Position, string> = {
    'bottom-right': 'absolute bottom-2 right-2',
    'bottom-left': 'absolute bottom-2 left-2',
    'top-right': 'absolute top-2 right-2',
    'top-left': 'absolute top-2 left-2',
  }

  // Position classes for popover (opens in opposite direction)
  const popoverPositionClasses: Record<Position, string> = {
    'bottom-right': 'absolute bottom-full right-0 mb-2',
    'bottom-left': 'absolute bottom-full left-0 mb-2',
    'top-right': 'absolute top-full right-0 mt-2',
    'top-left': 'absolute top-full left-0 mt-2',
  }

  return (
    <div ref={popoverRef} className={`${positionClasses[position]} z-50`} data-doc-url={docPath}>
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="p-2 rounded-full bg-black text-white border-2 border-white shadow-lg
          hover:bg-black/80 transition-all hover:scale-105"
        title={title || 'View documentation'}
      >
        <HelpCircle className="h-5 w-5" />
      </button>

      {isOpen && (
        <div
          className={`${popoverPositionClasses[position]} min-w-[300px] max-w-[400px] p-3 rounded-lg
            bg-popover border border-border shadow-lg`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Title and description */}
          {title && (
            <div className="font-medium text-sm mb-1">{title}</div>
          )}
          {description && (
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{description}</p>
          )}

          {/* Path */}
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs bg-muted px-2 py-1.5 rounded truncate">
              {docPath}
            </code>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded hover:bg-muted transition-colors shrink-0"
              title="Copy path"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>

          {/* Open button */}
          <div className="flex gap-2 mt-3">
            <Link
              to={docPath}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs px-3 py-1.5
                rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <ExternalLink className="h-3 w-3" />
              Open documentation
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// Doc Component
// ============================================

interface DocPropsBase {
  /**
   * Doc reference in format "layer.id"
   * @example "routes.users", "components.user-card"
   */
  of: string
  /** Optional entity instance ID */
  entityId?: string | number
}

interface DocPropsWrapper extends DocPropsBase {
  /** When false or undefined, Doc wraps children */
  floating?: false
  /** Content to wrap - must be a single React element */
  children: React.ReactElement
  position?: never
}

interface DocPropsFloating extends DocPropsBase {
  /** When true, renders absolute-positioned button without wrapping children */
  floating: true
  /** Position of the button within parent */
  position?: Position
  children?: never
}

type DocProps = DocPropsWrapper | DocPropsFloating

/**
 * Universal documentation link component.
 *
 * Renders as Fragment - no wrapper div! Adds data-attributes to child element
 * and shows doc button on hover via portal.
 *
 * **Wrapper mode** (default): clones child with data-attributes, shows doc button on hover
 * @example
 * <Doc of="components.user-card" entityId={user.id}>
 *   <Card>...</Card>
 * </Doc>
 *
 * **Floating mode**: renders absolute-positioned button at specified position
 * @example
 * <Doc of="pages.users" floating position="bottom-right" />
 */
export function Doc(props: DocProps) {
  const { hasDoc, getDoc } = useDocRegistry()
  const parsed = parseDocString(props.of)
  const elementRef = useRef<HTMLElement>(null)

  if (!parsed) {
    return props.floating ? null : <>{props.children}</>
  }

  const docPath = buildDocPath(parsed.layer, parsed.id)
  const showDocLink = hasDoc(parsed.layer, parsed.id)
  const docMeta = getDoc(parsed.layer, parsed.id)

  // Floating mode - render fixed button
  if (props.floating) {
    if (!showDocLink) return null
    return (
      <FloatingDocButton
        docPath={docPath}
        title={docMeta?.title}
        description={docMeta?.description}
        position={props.position || 'bottom-right'}
      />
    )
  }

  // Wrapper mode - clone child with data-attributes, no wrapper div
  const dataAttr = getDataAttribute(parsed.layer)

  const dataProps: Record<string, string | number | undefined> = {
    [dataAttr]: parsed.id,
    'data-doc-url': docPath,
  }
  if (props.entityId !== undefined) {
    dataProps['data-entity-id'] = props.entityId
  }

  // Clone the child element with ref and data attributes
  const child = props.children
  const clonedChild = React.cloneElement(child as React.ReactElement<{ ref?: React.Ref<HTMLElement> }>, {
    ...dataProps,
    ref: elementRef,
  })

  return (
    <>
      {clonedChild}
      {showDocLink && (
        <DocLinkPopover
          docPath={docPath}
          title={docMeta?.title}
          description={docMeta?.description}
          parentRef={elementRef}
        />
      )}
    </>
  )
}
