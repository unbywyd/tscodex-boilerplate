// Dynamic documentation loader
// Scans src/docs/ directory structure and loads files dynamically

const isDev = import.meta.env.DEV

export interface DocFile {
  path: string
  name: string
  type: 'markdown' | 'toml'
  content?: any
  metadata?: {
    size?: number
    modified?: string
  }
}

export interface DocFolder {
  path: string
  name: string
  files: DocFile[]
  folders: DocFolder[]
}

// Load documentation structure (tree)
export async function loadDocsTree(): Promise<DocFolder> {
  if (isDev) {
    const response = await fetch('/api/docs/tree')
    if (!response.ok) {
      throw new Error('Failed to load docs tree')
    }
    return response.json()
  } else {
    // In production, load from generated static JSON
    const response = await fetch('/generated/docs-tree.json')
    if (!response.ok) {
      throw new Error('Failed to load docs tree')
    }
    return response.json()
  }
}

// Load specific file content
export async function loadDocFile(filePath: string, raw: boolean = false): Promise<DocFile> {
  if (isDev) {
    const url = `/api/docs/file?path=${encodeURIComponent(filePath)}${raw ? '&raw=true' : ''}`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to load file: ${filePath}`)
    }
    return response.json()
  } else {
    // In production, load from generated static JSON
    // File path may or may not have extension
    let jsonPath = filePath
    if (filePath.endsWith('.md') || filePath.endsWith('.toml')) {
      jsonPath = filePath.replace(/\.(md|toml)$/, '.json')
    } else {
      // No extension - add .json directly
      jsonPath = filePath + '.json'
    }
    const response = await fetch(`/generated/docs/${jsonPath}`)
    if (!response.ok) {
      throw new Error(`Failed to load file: ${filePath}`)
    }
    const data = await response.json()
    // If raw is requested and rawContent is available, return it
    if (raw && data.rawContent && typeof data.rawContent === 'string') {
      return {
        ...data,
        content: data.rawContent
      }
    }
    return data
  }
}

// Get route path from file path
export function getRouteFromPath(filePath: string): string {
  // Remove file extension
  let route = filePath.replace(/\.(md|toml)$/, '')
  // Avoid double /docs/ - if path starts with docs/, don't add another
  if (route.startsWith('docs/')) {
    return `/${route}`
  }
  return `/docs/${route}`
}

// Get file path from route (without extension - need to detect type)
export function getPathFromRoute(route: string): string {
  // Remove /docs/ prefix
  return route.replace(/^\/docs\//, '')
}

// Backward compatibility alias
export const loadDocsStructure = loadDocsTree

// Load Prisma schema
export interface PrismaSchemaData {
  schema: string | null
  metadata: {
    path: string
    size: number
    modified: string
  } | null
}

export async function loadPrismaSchema(): Promise<PrismaSchemaData> {
  if (isDev) {
    const response = await fetch('/api/prisma/schema')
    if (!response.ok) {
      if (response.status === 404) {
        return { schema: null, metadata: null }
      }
      throw new Error('Failed to load Prisma schema')
    }
    return response.json()
  } else {
    const response = await fetch('/generated/prisma-schema.json')
    if (!response.ok) {
      return { schema: null, metadata: null }
    }
    return response.json()
  }
}

// Load mocks list
export async function loadMocksList(): Promise<string[]> {
  if (isDev) {
    const response = await fetch('/api/mocks')
    if (!response.ok) {
      throw new Error('Failed to load mocks list')
    }
    return response.json()
  } else {
    const response = await fetch('/generated/mocks-index.json')
    if (!response.ok) {
      return []
    }
    return response.json()
  }
}

// Load specific mock data
export async function loadMock(name: string): Promise<any> {
  if (isDev) {
    const response = await fetch(`/api/mocks/${name}`)
    if (!response.ok) {
      throw new Error(`Failed to load mock: ${name}`)
    }
    return response.json()
  } else {
    const response = await fetch(`/generated/mocks/${name}.json`)
    if (!response.ok) {
      throw new Error(`Failed to load mock: ${name}`)
    }
    return response.json()
  }
}

// Load relations map
export async function loadRelationsMap(): Promise<any> {
  if (isDev) {
    const response = await fetch('/api/relations-map')
    if (!response.ok) {
      throw new Error('Failed to load relations map')
    }
    return response.json()
  } else {
    const response = await fetch('/generated/relations-map.json')
    if (!response.ok) {
      throw new Error('Failed to load relations map')
    }
    return response.json()
  }
}

// Event metadata for registration
export interface EventDocMeta {
  id: string
  name: string
  description: string
  category?: string
}

// Load events from docs tree and register them
export async function loadEvents(): Promise<EventDocMeta[]> {
  try {
    const tree = await loadDocsTree()
    const events: EventDocMeta[] = []

    // Find events folder in layers
    const layersFolder = tree.folders.find(f => f.name === 'layers')
    if (!layersFolder) return events

    const eventsFolder = layersFolder.folders.find(f => f.name === 'events')
    if (!eventsFolder) return events

    // Load each event file
    for (const file of eventsFolder.files) {
      if (file.type === 'toml') {
        try {
          const doc = await loadDocFile(`layers/events/${file.name}`)
          if (doc.content?.event) {
            events.push({
              id: doc.content.event.id,
              name: doc.content.event.name,
              description: doc.content.event.description || '',
              category: doc.content.event.category,
            })
          }
        } catch {
          // Skip files that fail to load
        }
      }
    }

    return events
  } catch {
    return []
  }
}

// Manifest types for LLM/RAG integration
export interface ManifestLayer {
  id: string
  name?: string
  description?: string
  _meta: { path: string }
  [key: string]: any
}

export interface ManifestDoc {
  id: string
  title: string
  content: string
  _meta: { path: string }
}

export interface Manifest {
  version: string
  generated: string
  project: ManifestLayer | null
  layers: {
    entities: ManifestLayer[]
    components: ManifestLayer[]
    routes: ManifestLayer[]
    pages: ManifestLayer[]
    useCases: ManifestLayer[]
    roles: ManifestLayer[]
    guards: ManifestLayer[]
    events: ManifestLayer[]
    platforms: ManifestLayer[]
    knowledge: ManifestLayer[]
    modules: ManifestLayer[]
  }
  docs: ManifestDoc[]
  relations: {
    byId: Record<string, { path: string; folder: string; title?: string }>
    graph: Record<string, Record<string, string[]>>
  }
}

// Load unified manifest for LLM/RAG
export async function loadManifest(): Promise<Manifest> {
  if (isDev) {
    const response = await fetch('/api/manifest')
    if (!response.ok) {
      throw new Error('Failed to load manifest')
    }
    return response.json()
  } else {
    const response = await fetch('/generated/manifest.json')
    if (!response.ok) {
      throw new Error('Failed to load manifest')
    }
    return response.json()
  }
}
