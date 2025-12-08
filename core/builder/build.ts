import fs from 'fs/promises'
import { parse } from '@iarna/toml'
import path from 'path'
import { fileURLToPath } from 'url'

// ESM-compatible way to get directory paths
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../..')
const specDir = path.join(rootDir, 'src/spec')
const mocksDir = path.join(rootDir, 'src/prototype/mocks')
const outputDir = path.join(rootDir, 'core/app/public/generated')

async function readTomlFile(filePath: string): Promise<any> {
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    return parse(content)
  } catch (error) {
    console.error(`Error reading TOML file ${filePath}:`, error)
    return null
  }
}

async function readTomlFiles(dirPath: string): Promise<any[]> {
  try {
    const files = await fs.readdir(dirPath)
    const tomlFiles = files.filter(f => f.endsWith('.toml'))
    const results = await Promise.all(
      tomlFiles.map(file => readTomlFile(path.join(dirPath, file)))
    )
    return results.filter(Boolean)
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error)
    return []
  }
}

// Scan directory structure recursively
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
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error)
    return { path: basePath, name: path.basename(dirPath), files: [], folders: [] }
  }
}

// Read file content for production
async function readFileContent(filePath: string): Promise<any> {
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    const ext = path.extname(filePath).toLowerCase()

    if (ext === '.toml') {
      return parse(content)
    } else {
      return content // Markdown as string
    }
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error)
    return null
  }
}

// Generate docs structure and individual files
async function generateDocs() {
  console.log('📚 Generating documentation...')

  const docsOutputDir = path.join(outputDir, 'docs')
  await fs.mkdir(docsOutputDir, { recursive: true })

  // Generate tree structure
  const structure = await scanDirectory(specDir)
  await fs.writeFile(
    path.join(outputDir, 'docs-tree.json'),
    JSON.stringify(structure, null, 2)
  )
  console.log('  ✓ docs-tree.json')

  // Generate individual doc files
  async function processFolder(folder: any) {
    for (const file of folder.files) {
      const filePath = path.join(specDir, file.path)
      const content = await readFileContent(filePath)

      if (content !== null) {
        const outputPath = path.join(
          docsOutputDir,
          file.path.replace(/\.(md|toml)$/, '.json')
        )
        const outputDirPath = path.dirname(outputPath)
        await fs.mkdir(outputDirPath, { recursive: true })

        await fs.writeFile(
          outputPath,
          JSON.stringify({
            path: file.path,
            name: file.name,
            type: file.type,
            content,
            metadata: file.metadata,
          }, null, 2)
        )
      }
    }

    for (const subFolder of folder.folders) {
      await processFolder(subFolder)
    }
  }

  await processFolder(structure)
  console.log('  ✓ Individual doc files')

  // Generate route-docs map (TOML files with route.path)
  const routeDocsMap: Record<string, string> = {}

  async function extractRoutePaths(folder: any) {
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

  await fs.writeFile(
    path.join(outputDir, 'route-docs-map.json'),
    JSON.stringify(routeDocsMap, null, 2)
  )
  console.log(`  ✓ route-docs-map.json (${Object.keys(routeDocsMap).length} routes)`)
}

// Generate mocks
async function generateMocks() {
  console.log('🎭 Generating mocks...')

  const mocksOutputDir = path.join(outputDir, 'mocks')
  await fs.mkdir(mocksOutputDir, { recursive: true })

  try {
    const files = await fs.readdir(mocksDir)
    const jsonFiles = files.filter(f => f.endsWith('.json'))

    for (const file of jsonFiles) {
      const content = await fs.readFile(path.join(mocksDir, file), 'utf-8')
      await fs.writeFile(
        path.join(mocksOutputDir, file),
        content
      )
      console.log(`  ✓ ${file}`)
    }

    // Generate mocks index
    const mockNames = jsonFiles.map(f => f.replace('.json', ''))
    await fs.writeFile(
      path.join(outputDir, 'mocks-index.json'),
      JSON.stringify(mockNames, null, 2)
    )
    console.log('  ✓ mocks-index.json')
  } catch (error) {
    console.error('Error generating mocks:', error)
  }
}

// Types for relations system
interface IdEntry {
  id: string
  filePath: string
  folder: string  // e.g., "use-cases", "roles", "guards"
  title?: string
}

interface RelationsMap {
  // id -> file path mapping
  byId: Record<string, { path: string; folder: string; title?: string }>
  // folder -> list of ids
  byFolder: Record<string, string[]>
  // id -> list of ids that reference it (backlinks)
  referencedBy: Record<string, string[]>
  // id -> relations from the file
  relations: Record<string, Record<string, string[]>>
}

// Extract id from TOML content
function extractId(content: any, fileName: string): string | null {
  // Try common id locations
  if (content.id) return content.id
  if (content.useCase?.id) return content.useCase.id
  if (content.guard?.id) return content.guard.id
  if (content.role?.id) return content.role.id
  if (content.route?.id) return content.route.id
  if (content.topic?.id) return content.topic.id
  if (content.project?.id) return content.project.id
  if (content.entity?.id) return content.entity.id
  if (content.status?.id) return content.status.id
  if (content.component?.id) return content.component.id
  if (content.module?.id) return content.module.id

  // Fallback to filename without extension
  return fileName.replace(/\.toml$/, '')
}

// Extract title/name from TOML content
function extractTitle(content: any): string | undefined {
  if (content.name) return content.name
  if (content.useCase?.name) return content.useCase.name
  if (content.guard?.name) return content.guard.name
  if (content.role?.name) return content.role.name
  if (content.route?.title) return content.route.title
  if (content.topic?.name) return content.topic.name
  if (content.project?.name) return content.project.name
  if (content.entity?.name) return content.entity.name
  if (content.status?.name) return content.status.name
  if (content.component?.name) return content.component.name
  if (content.module?.name) return content.module.name
  return undefined
}

// Extract relations from TOML content
function extractRelations(content: any): Record<string, string[]> | null {
  // Check for [relations] section
  if (content.relations) {
    const relations: Record<string, string[]> = {}
    for (const [key, value] of Object.entries(content.relations)) {
      if (Array.isArray(value)) {
        relations[key] = value as string[]
      }
    }
    return Object.keys(relations).length > 0 ? relations : null
  }

  // Also check nested relations (e.g., useCase.relations)
  for (const key of ['useCase', 'guard', 'role', 'route', 'topic', 'project', 'entity', 'status', 'component', 'module']) {
    if (content[key]?.relations) {
      const relations: Record<string, string[]> = {}
      for (const [k, v] of Object.entries(content[key].relations)) {
        if (Array.isArray(v)) {
          relations[k] = v as string[]
        }
      }
      return Object.keys(relations).length > 0 ? relations : null
    }
  }

  return null
}

// Generate relations map
async function generateRelationsMap(): Promise<RelationsMap> {
  console.log('🔗 Generating relations map...')

  const relationsMap: RelationsMap = {
    byId: {},
    byFolder: {},
    referencedBy: {},
    relations: {},
  }

  const layersDir = path.join(specDir, 'layers')

  try {
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

        // Store id -> file mapping
        relationsMap.byId[id] = {
          path: relativePath,
          folder: folderName,
          title
        }
        relationsMap.byFolder[folderName].push(id)

        // Extract and store relations
        const relations = extractRelations(content)
        if (relations) {
          relationsMap.relations[id] = relations
        }
      }
    }

    // Build backlinks (referencedBy)
    for (const [sourceId, relations] of Object.entries(relationsMap.relations)) {
      for (const [_folder, targetIds] of Object.entries(relations)) {
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

    // Log stats
    const totalIds = Object.keys(relationsMap.byId).length
    const totalRelations = Object.values(relationsMap.relations)
      .reduce((sum, r) => sum + Object.values(r).flat().length, 0)
    const totalBacklinks = Object.values(relationsMap.referencedBy)
      .reduce((sum, refs) => sum + refs.length, 0)

    console.log(`  ✓ Found ${totalIds} entities across ${Object.keys(relationsMap.byFolder).length} folders`)
    console.log(`  ✓ Found ${totalRelations} relations, ${totalBacklinks} backlinks`)

    // Validate relations (warn about missing targets)
    let warnings = 0
    for (const [sourceId, relations] of Object.entries(relationsMap.relations)) {
      for (const [folder, targetIds] of Object.entries(relations)) {
        for (const targetId of targetIds) {
          if (!relationsMap.byId[targetId]) {
            console.warn(`  ⚠ ${sourceId} references unknown id "${targetId}" in ${folder}`)
            warnings++
          }
        }
      }
    }
    if (warnings > 0) {
      console.log(`  ⚠ ${warnings} relation warnings`)
    }

  } catch (error) {
    console.error('Error generating relations map:', error)
  }

  return relationsMap
}

// Main build function
async function build() {
  console.log('\n🚀 MVP Generator Build\n')
  console.log(`Root: ${rootDir}`)
  console.log(`Spec: ${specDir}`)
  console.log(`Mocks: ${mocksDir}`)
  console.log(`Output: ${outputDir}\n`)

  // Clean output directory
  try {
    await fs.rm(outputDir, { recursive: true, force: true })
  } catch {
    // Ignore if doesn't exist
  }
  await fs.mkdir(outputDir, { recursive: true })

  // Generate all data
  await generateDocs()
  await generateMocks()

  // Generate relations map
  const relationsMap = await generateRelationsMap()
  await fs.writeFile(
    path.join(outputDir, 'relations-map.json'),
    JSON.stringify(relationsMap, null, 2)
  )
  console.log('  ✓ relations-map.json')

  console.log('\n✅ Build complete!\n')
}

build().catch(console.error)
