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
export async function loadDocFile(filePath: string): Promise<DocFile> {
  if (isDev) {
    const response = await fetch(`/api/docs/file?path=${encodeURIComponent(filePath)}`)
    if (!response.ok) {
      throw new Error(`Failed to load file: ${filePath}`)
    }
    return response.json()
  } else {
    // In production, load from generated static JSON via fetch
    const jsonPath = filePath.replace(/\.(md|toml)$/, '.json')
    const response = await fetch(`/generated/docs/${jsonPath}`)
    if (!response.ok) {
      throw new Error(`Failed to load file: ${filePath}`)
    }
    return response.json()
  }
}

// Get route path from file path
export function getRouteFromPath(filePath: string): string {
  // Remove file extension
  const route = filePath.replace(/\.(md|toml)$/, '')
  return `/docs/${route}`
}

// Get file path from route (without extension - need to detect type)
export function getPathFromRoute(route: string): string {
  // Remove /docs/ prefix
  return route.replace(/^\/docs\//, '')
}

// Backward compatibility alias
export const loadDocsStructure = loadDocsTree
