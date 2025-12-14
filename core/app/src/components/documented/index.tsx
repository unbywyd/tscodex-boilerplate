import React, { useState, useRef, useEffect } from 'react'
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
// DocLinkPopover (for components - relative position)
// ============================================

interface DocLinkPopoverProps {
  docPath: string
  title?: string
  description?: string
}

function DocLinkPopover({ docPath, title, description }: DocLinkPopoverProps) {
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

  return (
    <div ref={popoverRef} className="absolute top-1 right-1 z-50">
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="p-1 rounded-full bg-black text-white border-2 border-white shadow-md
          hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
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
  /** Content to wrap */
  children: React.ReactNode
  /** Additional className for wrapper */
  className?: string
  position?: never
}

interface DocPropsFloating extends DocPropsBase {
  /** When true, renders absolute-positioned button without wrapping children */
  floating: true
  /** Position of the button within parent */
  position?: Position
  children?: never
  className?: never
}

type DocProps = DocPropsWrapper | DocPropsFloating

/**
 * Universal documentation link component.
 *
 * **Wrapper mode** (default): wraps children with doc link on hover
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

  // Wrapper mode - wrap children
  const dataAttr = getDataAttribute(parsed.layer)

  const dataProps: Record<string, string | number | undefined> = {
    [dataAttr]: parsed.id,
    'data-doc-url': docPath,
  }
  if (props.entityId !== undefined) {
    dataProps['data-entity-id'] = props.entityId
  }

  return (
    <div {...dataProps} className={`group relative ${props.className || ''}`}>
      {showDocLink && (
        <DocLinkPopover
          docPath={docPath}
          title={docMeta?.title}
          description={docMeta?.description}
        />
      )}
      {props.children}
    </div>
  )
}
