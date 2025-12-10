import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { loadDocsTree, loadDocFile, type DocFolder } from '@/lib/docs-loader'

// ============================================
// Types
// ============================================

interface DocMeta {
  path: string
  title?: string
  description?: string
  type: 'toml' | 'markdown'
}

interface DocRegistryState {
  /** Map of doc paths to metadata */
  docs: Map<string, DocMeta>
  /** Loading state */
  loading: boolean
  /** Error if loading failed */
  error: Error | null
  /** Get doc metadata (returns null if not found) */
  getDoc: (layer: string, id: string) => DocMeta | null
  /** Check if doc exists */
  hasDoc: (layer: string, id: string) => boolean
}

// ============================================
// Context
// ============================================

const DocContext = createContext<DocRegistryState | null>(null)

// ============================================
// Extract metadata from TOML content
// ============================================

function extractMeta(content: any, type: 'toml' | 'markdown'): { title?: string; description?: string } {
  if (type === 'markdown') {
    return {}
  }

  // Try to extract from common TOML structures
  // Routes: [route] → title, description
  if (content?.route) {
    return {
      title: content.route.title,
      description: content.route.description,
    }
  }

  // Pages: [page] → name, description
  if (content?.page) {
    return {
      title: content.page.name,
      description: content.page.description,
    }
  }

  // Components: [component] → name, description
  if (content?.component) {
    return {
      title: content.component.name,
      description: content.component.description,
    }
  }

  // Entities: [entity] → name, description
  if (content?.entity) {
    return {
      title: content.entity.name,
      description: content.entity.description,
    }
  }

  // Use cases: [useCase] → name, description
  if (content?.useCase) {
    return {
      title: content.useCase.name,
      description: `As ${content.useCase.asRole}, ${content.useCase.iWant}`,
    }
  }

  // Roles: [role] → name, description
  if (content?.role) {
    return {
      title: content.role.name,
      description: content.role.description,
    }
  }

  // Guards: [guard] → name, description
  if (content?.guard) {
    return {
      title: content.guard.name,
      description: content.guard.description,
    }
  }

  // Events: [event] → name, description
  if (content?.event) {
    return {
      title: content.event.name,
      description: content.event.description,
    }
  }

  return {}
}

// ============================================
// Provider
// ============================================

interface DocProviderProps {
  children: ReactNode
}

export function DocProvider({ children }: DocProviderProps) {
  const [docs, setDocs] = useState<Map<string, DocMeta>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let mounted = true

    async function loadDocs() {
      try {
        const tree = await loadDocsTree()
        const docMap = new Map<string, DocMeta>()

        // Collect all doc file paths
        interface FileInfo {
          key: string
          filePath: string
          type: 'toml' | 'markdown'
        }
        const files: FileInfo[] = []

        function collectPaths(folder: DocFolder, prefix: string) {
          for (const file of folder.files) {
            const name = file.name.replace(/\.(md|toml)$/, '')
            const type = file.type === 'toml' ? 'toml' : 'markdown'
            files.push({
              key: `${prefix}${name}`,
              filePath: `${prefix}${file.name}`,
              type,
            })
          }
          for (const subfolder of folder.folders) {
            collectPaths(subfolder, `${prefix}${subfolder.name}/`)
          }
        }

        collectPaths(tree, '')

        // Load metadata for layer files (routes, components, entities, etc.)
        const layerFiles = files.filter(f => f.key.startsWith('layers/'))

        // Load in batches to avoid too many parallel requests
        const batchSize = 10
        for (let i = 0; i < layerFiles.length; i += batchSize) {
          const batch = layerFiles.slice(i, i + batchSize)
          const results = await Promise.allSettled(
            batch.map(async (f) => {
              try {
                const doc = await loadDocFile(f.filePath)
                const meta = extractMeta(doc.content, f.type)
                return { key: f.key, type: f.type, ...meta }
              } catch {
                return { key: f.key, type: f.type }
              }
            })
          )

          if (!mounted) return

          for (const result of results) {
            if (result.status === 'fulfilled') {
              const { key, type, title, description } = result.value
              docMap.set(key, {
                path: `/docs/${key}`,
                type,
                title,
                description,
              })
            }
          }
        }

        // Add non-layer files with just path info
        for (const f of files) {
          if (!f.key.startsWith('layers/') && !docMap.has(f.key)) {
            docMap.set(f.key, {
              path: `/docs/${f.key}`,
              type: f.type,
            })
          }
        }

        if (mounted) {
          setDocs(docMap)
          setError(null)
        }
      } catch (e) {
        if (mounted) {
          setError(e instanceof Error ? e : new Error('Failed to load docs'))
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadDocs()

    return () => {
      mounted = false
    }
  }, [])

  const getDoc = (layer: string, id: string): DocMeta | null => {
    const key = `layers/${layer}/${id}`
    return docs.get(key) || null
  }

  const hasDoc = (layer: string, id: string): boolean => {
    // During loading or on error, show "?" as fallback
    if (loading || error) return true
    return docs.has(`layers/${layer}/${id}`)
  }

  return (
    <DocContext.Provider value={{ docs, loading, error, getDoc, hasDoc }}>
      {children}
    </DocContext.Provider>
  )
}

// ============================================
// Hook
// ============================================

export function useDocRegistry(): DocRegistryState {
  const context = useContext(DocContext)
  if (!context) {
    return {
      docs: new Map(),
      loading: false,
      error: null,
      getDoc: () => null,
      hasDoc: () => true,
    }
  }
  return context
}
