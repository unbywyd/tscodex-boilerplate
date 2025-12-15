// Relations Section Component
// Displays relations and backlinks for any entity

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getRouteFromPath } from '@/lib/docs-loader'

interface RelationEntry {
  path: string
  folder: string
  title?: string
}

interface RelationsMap {
  byId: Record<string, RelationEntry>
  byFolder: Record<string, string[]>
  referencedBy: Record<string, string[]>
  relations: Record<string, Record<string, string[]>>
}

interface RelationsSectionProps {
  entityId: string
  relations?: Record<string, string[]>
}

// Folder colors for visual distinction
const folderColors: Record<string, { bg: string; text: string }> = {
  'use-cases': { bg: 'bg-green-100', text: 'text-green-800' },
  'roles': { bg: 'bg-blue-100', text: 'text-blue-800' },
  'guards': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  'routes': { bg: 'bg-purple-100', text: 'text-purple-800' },
  'project': { bg: 'bg-slate-100', text: 'text-slate-800' },
  'knowledge': { bg: 'bg-orange-100', text: 'text-orange-800' },
}

function getColorClasses(folder: string) {
  return folderColors[folder] || { bg: 'bg-gray-100', text: 'text-gray-800' }
}

export default function RelationsSection({ entityId, relations }: RelationsSectionProps) {
  const [relationsMap, setRelationsMap] = useState<RelationsMap | null>(null)

  useEffect(() => {
    // Fetch relations map
    const fetchRelationsMap = async () => {
      try {
        // Try production path first
        let response = await fetch('/generated/relations-map.json')
        if (!response.ok) {
          // Try dev API
          response = await fetch('/api/relations-map')
        }
        if (response.ok) {
          const data = await response.json()
          setRelationsMap(data)
        }
      } catch (error) {
        console.error('Failed to load relations map:', error)
      }
    }
    fetchRelationsMap()
  }, [])

  if (!relationsMap) {
    return null
  }

  // Get backlinks for this entity
  const referencedBy = relationsMap.referencedBy[entityId] || []

  // Get entity relations (either from props or from the map)
  const entityRelations = relations || relationsMap.relations[entityId] || {}

  // Check if there's anything to show
  const hasRelations = Object.keys(entityRelations).length > 0
  const hasBacklinks = referencedBy.length > 0

  if (!hasRelations && !hasBacklinks) {
    return null
  }

  // Helper to render a relation link
  const renderLink = (id: string) => {
    const entry = relationsMap.byId[id]
    if (!entry) {
      return (
        <span key={id} className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded text-sm opacity-50">
          {id} (not defined)
        </span>
      )
    }
    const colors = getColorClasses(entry.folder)
    return (
      <Link
        key={id}
        to={getRouteFromPath(entry.path)}
        className={`inline-block ${colors.bg} ${colors.text} px-2 py-1 rounded text-sm hover:opacity-80 transition-opacity`}
      >
        {entry.title || id}
      </Link>
    )
  }

  return (
    <div className="relations-section mt-8 pt-6 border-t border-border">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
        Relations
      </h3>

      {hasRelations && (
        <div className="space-y-3">
          {Object.entries(entityRelations).map(([folder, ids]) => (
            <div key={folder}>
              <span className="text-sm text-muted-foreground capitalize">{folder.replace(/-/g, ' ')}:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {ids.map(id => renderLink(id))}
              </div>
            </div>
          ))}
        </div>
      )}

      {hasBacklinks && (
        <div className={hasRelations ? 'mt-6' : ''}>
          <span className="text-sm text-muted-foreground">Referenced by:</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {referencedBy.map(id => renderLink(id))}
          </div>
        </div>
      )}
    </div>
  )
}
