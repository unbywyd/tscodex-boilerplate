// Vite plugin that adds API endpoints for dev mode
// Replaces the separate Express server

import type { Plugin } from 'vite'
import fs from 'fs/promises'
import path from 'path'
import { parse } from '@iarna/toml'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../..')
const specDir = path.join(rootDir, 'src/spec')
const mocksDir = path.join(rootDir, 'src/prototype/mocks')
const prismaSchemaPath = path.join(rootDir, 'src/prisma/schema.prisma')

// Helper: read and parse TOML file
async function readTomlFile(filePath: string): Promise<any> {
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    return parse(content)
  } catch {
    return null
  }
}

// Helper: scan directory recursively
async function scanDirectory(dirPath: string, basePath: string = ''): Promise<any> {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true })
    const result: any = {
      path: basePath || 'docs',
      name: path.basename(dirPath),
      files: [],
      folders: [],
    }

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name)
      const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name

      if (entry.isDirectory()) {
        const subFolder = await scanDirectory(fullPath, relativePath)
        result.folders.push(subFolder)
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase()
        if (ext === '.md' || ext === '.toml') {
          const stats = await fs.stat(fullPath)
          result.files.push({
            path: relativePath,
            name: entry.name,
            type: ext === '.md' ? 'markdown' : 'toml',
            metadata: {
              size: stats.size,
              modified: stats.mtime.toISOString(),
            },
          })
        }
      }
    }
    return result
  } catch {
    return { path: basePath, name: path.basename(dirPath), files: [], folders: [] }
  }
}

// Helper: read file content
async function readFileContent(filePath: string): Promise<any> {
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    const ext = path.extname(filePath).toLowerCase()
    return ext === '.toml' ? parse(content) : content
  } catch {
    return null
  }
}

// Helper: extract ID from TOML content
function extractId(content: any, fileName: string): string | null {
  if (content.id) return content.id
  for (const key of ['useCase', 'guard', 'role', 'route', 'topic', 'project', 'entity', 'status', 'component', 'module']) {
    if (content[key]?.id) return content[key].id
  }
  return fileName.replace(/\.toml$/, '')
}

// Helper: extract title from TOML content
function extractTitle(content: any): string | undefined {
  if (content.name) return content.name
  for (const key of ['useCase', 'guard', 'role', 'route', 'topic', 'project', 'entity', 'status', 'component', 'module']) {
    if (content[key]?.name) return content[key].name
    if (content[key]?.title) return content[key].title
  }
  return undefined
}

// Helper: extract relations from TOML content
function extractRelations(content: any): Record<string, string[]> | null {
  if (content.relations) {
    const relations: Record<string, string[]> = {}
    for (const [key, value] of Object.entries(content.relations)) {
      if (Array.isArray(value)) relations[key] = value as string[]
    }
    return Object.keys(relations).length > 0 ? relations : null
  }
  for (const key of ['useCase', 'guard', 'role', 'route', 'topic', 'project', 'entity', 'status', 'component', 'module']) {
    if (content[key]?.relations) {
      const relations: Record<string, string[]> = {}
      for (const [k, v] of Object.entries(content[key].relations)) {
        if (Array.isArray(v)) relations[k] = v as string[]
      }
      return Object.keys(relations).length > 0 ? relations : null
    }
  }
  return null
}

// Send JSON response
function sendJson(res: any, data: any, status = 200) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(data))
}

export function viteApiPlugin(): Plugin {
  return {
    name: 'vite-api-plugin',
    configureServer(server) {
      // API: Get docs tree
      server.middlewares.use('/api/docs/tree', async (req, res) => {
        try {
          const structure = await scanDirectory(specDir)
          sendJson(res, structure)
        } catch (error) {
          sendJson(res, { error: 'Internal server error' }, 500)
        }
      })

      // API: Get route-docs mapping
      server.middlewares.use('/api/docs/route-map', async (req, res) => {
        try {
          const structure = await scanDirectory(specDir)
          const routeDocsMap: Record<string, string> = {}

          const extractRoutePaths = async (folder: any): Promise<void> => {
            for (const file of folder.files) {
              if (file.type === 'toml') {
                const filePath = path.join(specDir, file.path)
                const content = await readTomlFile(filePath)
                if (content?.route?.path) {
                  routeDocsMap[content.route.path] = file.path
                }
              }
            }
            for (const subFolder of folder.folders) {
              await extractRoutePaths(subFolder)
            }
          }

          await extractRoutePaths(structure)
          sendJson(res, routeDocsMap)
        } catch (error) {
          sendJson(res, { error: 'Internal server error' }, 500)
        }
      })

      // API: Get specific doc file
      server.middlewares.use('/api/docs/file', async (req, res) => {
        try {
          const url = new URL(req.url!, `http://${req.headers.host}`)
          let filePath = url.searchParams.get('path')

          if (!filePath) {
            return sendJson(res, { error: 'Path parameter required' }, 400)
          }

          // Auto-detect extension if not provided
          const ext = path.extname(filePath).toLowerCase()
          let fullPath = path.join(specDir, filePath)

          if (!fullPath.startsWith(specDir)) {
            return sendJson(res, { error: 'Access denied' }, 403)
          }

          // If no extension, try .toml first, then .md
          if (!ext) {
            const tomlPath = fullPath + '.toml'
            const mdPath = fullPath + '.md'

            try {
              await fs.stat(tomlPath)
              fullPath = tomlPath
              filePath = filePath + '.toml'
            } catch {
              try {
                await fs.stat(mdPath)
                fullPath = mdPath
                filePath = filePath + '.md'
              } catch {
                return sendJson(res, { error: 'File not found' }, 404)
              }
            }
          }

          const finalExt = path.extname(filePath).toLowerCase()
          if (finalExt !== '.md' && finalExt !== '.toml') {
            return sendJson(res, { error: 'Only .md and .toml supported' }, 400)
          }

          const stats = await fs.stat(fullPath)
          if (!stats.isFile()) {
            return sendJson(res, { error: 'File not found' }, 404)
          }

          const content = await readFileContent(fullPath)
          sendJson(res, {
            path: filePath,
            name: path.basename(filePath),
            type: finalExt === '.md' ? 'markdown' : 'toml',
            content,
            metadata: {
              size: stats.size,
              modified: stats.mtime.toISOString(),
            },
          })
        } catch (error: any) {
          if (error.code === 'ENOENT') {
            return sendJson(res, { error: 'File not found' }, 404)
          }
          sendJson(res, { error: 'Internal server error' }, 500)
        }
      })

      // API: Get relations map
      server.middlewares.use('/api/relations-map', async (req, res) => {
        try {
          const relationsMap = {
            byId: {} as Record<string, { path: string; folder: string; title?: string }>,
            byFolder: {} as Record<string, string[]>,
            referencedBy: {} as Record<string, string[]>,
            relations: {} as Record<string, Record<string, string[]>>,
          }

          const layersDir = path.join(specDir, 'layers')
          const folders = await fs.readdir(layersDir, { withFileTypes: true })

          for (const folder of folders) {
            if (!folder.isDirectory()) continue

            const folderName = folder.name
            const folderPath = path.join(layersDir, folderName)
            relationsMap.byFolder[folderName] = []

            const files = await fs.readdir(folderPath)
            const tomlFiles = files.filter(f => f.endsWith('.toml'))

            for (const fileName of tomlFiles) {
              const filePath = path.join(folderPath, fileName)
              const content = await readTomlFile(filePath)
              if (!content) continue

              const id = extractId(content, fileName)
              if (!id) continue

              const relativePath = `layers/${folderName}/${fileName}`
              const title = extractTitle(content)

              relationsMap.byId[id] = { path: relativePath, folder: folderName, title }
              relationsMap.byFolder[folderName].push(id)

              const relations = extractRelations(content)
              if (relations) relationsMap.relations[id] = relations
            }
          }

          // Build backlinks
          for (const [sourceId, relations] of Object.entries(relationsMap.relations)) {
            for (const targetIds of Object.values(relations)) {
              for (const targetId of targetIds) {
                if (!relationsMap.referencedBy[targetId]) {
                  relationsMap.referencedBy[targetId] = []
                }
                if (!relationsMap.referencedBy[targetId].includes(sourceId)) {
                  relationsMap.referencedBy[targetId].push(sourceId)
                }
              }
            }
          }

          sendJson(res, relationsMap)
        } catch (error) {
          sendJson(res, { error: 'Internal server error' }, 500)
        }
      })

      // API: List mocks
      server.middlewares.use('/api/mocks', async (req, res, next) => {
        // Only handle exact path
        if (req.url !== '/api/mocks' && !req.url?.startsWith('/api/mocks?')) {
          return next()
        }
        try {
          const files = await fs.readdir(mocksDir)
          const mocks = files.filter(f => f.endsWith('.json')).map(f => f.replace('.json', ''))
          sendJson(res, mocks)
        } catch (error) {
          sendJson(res, { error: 'Internal server error' }, 500)
        }
      })

      // API: Get specific mock (must be after /api/mocks list endpoint)
      server.middlewares.use('/api/mocks/', async (req, res) => {
        try {
          const mockName = req.url?.replace('/api/mocks/', '').split('?')[0]
          if (!mockName) {
            return sendJson(res, { error: 'Mock name required' }, 400)
          }

          const mockPath = path.join(mocksDir, `${mockName}.json`)
          if (!mockPath.startsWith(mocksDir)) {
            return sendJson(res, { error: 'Access denied' }, 403)
          }

          const content = await fs.readFile(mockPath, 'utf-8')
          sendJson(res, JSON.parse(content))
        } catch (error: any) {
          if (error.code === 'ENOENT') {
            return sendJson(res, { error: 'Mock not found' }, 404)
          }
          sendJson(res, { error: 'Internal server error' }, 500)
        }
      })

      // API: Get Prisma schema
      server.middlewares.use('/api/prisma/schema', async (_req, res) => {
        try {
          const content = await fs.readFile(prismaSchemaPath, 'utf-8')
          const stats = await fs.stat(prismaSchemaPath)
          sendJson(res, {
            schema: content,
            metadata: {
              path: 'src/prisma/schema.prisma',
              size: stats.size,
              modified: stats.mtime.toISOString(),
            },
          })
        } catch (error: any) {
          if (error.code === 'ENOENT') {
            return sendJson(res, { error: 'Prisma schema not found', schema: null }, 404)
          }
          sendJson(res, { error: 'Internal server error' }, 500)
        }
      })

      console.log('\n📚 API endpoints available:')
      console.log('  GET /api/docs/tree       - Documentation structure')
      console.log('  GET /api/docs/file?path= - Specific doc file')
      console.log('  GET /api/docs/route-map  - Route to docs mapping')
      console.log('  GET /api/relations-map   - Relations graph')
      console.log('  GET /api/prisma/schema   - Prisma schema file')
      console.log('  GET /api/mocks           - List all mocks')
      console.log('  GET /api/mocks/:name     - Specific mock data\n')
    },
  }
}
