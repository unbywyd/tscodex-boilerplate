import fs from 'fs/promises'
import { parse } from '@iarna/toml'
import path from 'path'
import { fileURLToPath } from 'url'

// ESM-compatible way to get directory paths
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../..')
const specDir = path.join(rootDir, 'src/spec')
const prismaSchemaPath = path.join(rootDir, 'src/prisma/schema.prisma')
const outputDir = path.join(rootDir, 'public/generated')

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
// Files and folders to exclude from documentation tree
const excludedFiles = ['status.toml', 'interview.toml']
const excludedFolders = ['platforms'] // Platforms have their own page at /platforms

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
        // Skip excluded folders (platforms has its own page)
        if (excludedFolders.includes(entry.name)) continue
        const subFolder = await scanDirectory(fullPath, relativePath)
        result.folders.push(subFolder)
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase()
        // Skip excluded files (status.toml, interview.toml)
        if (excludedFiles.includes(entry.name)) continue
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

        // For TOML files, also save raw content
        let rawContent: string | undefined
        if (file.type === 'toml') {
          try {
            rawContent = await fs.readFile(filePath, 'utf-8')
          } catch (error) {
            console.error(`Error reading raw TOML ${filePath}:`, error)
          }
        }

        await fs.writeFile(
          outputPath,
          JSON.stringify({
            path: file.path,
            name: file.name,
            type: file.type,
            content,
            rawContent, // Include raw TOML content for syntax highlighting
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

// Generate Prisma schema
async function generatePrismaSchema() {
  console.log('🗄️  Generating Prisma schema...')

  try {
    const content = await fs.readFile(prismaSchemaPath, 'utf-8')
    const stats = await fs.stat(prismaSchemaPath)

    await fs.writeFile(
      path.join(outputDir, 'prisma-schema.json'),
      JSON.stringify({
        schema: content,
        metadata: {
          path: 'src/prisma/schema.prisma',
          size: stats.size,
          modified: stats.mtime.toISOString(),
        },
      }, null, 2)
    )
    console.log('  ✓ prisma-schema.json')
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.log('  ⚠ No Prisma schema found (src/prisma/schema.prisma)')
      // Write empty placeholder
      await fs.writeFile(
        path.join(outputDir, 'prisma-schema.json'),
        JSON.stringify({ schema: null, metadata: null }, null, 2)
      )
    } else {
      console.error('Error generating Prisma schema:', error)
    }
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
  if (content.topic?.id) return content.topic.id
  if (content.project?.id) return content.project.id
  if (content.entity?.id) return content.entity.id
  if (content.status?.id) return content.status.id
  if (content.module?.id) return content.module.id
  if (content.platform?.id) return content.platform.id

  // Fallback to filename without extension
  return fileName.replace(/\.toml$/, '')
}

// Extract title/name from TOML content
function extractTitle(content: any): string | undefined {
  if (content.name) return content.name
  if (content.useCase?.name) return content.useCase.name
  if (content.guard?.name) return content.guard.name
  if (content.role?.name) return content.role.name
  if (content.topic?.name) return content.topic.name
  if (content.project?.name) return content.project.name
  if (content.entity?.name) return content.entity.name
  if (content.status?.name) return content.status.name
  if (content.module?.name) return content.module.name
  if (content.platform?.name) return content.platform.name
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
  for (const key of ['useCase', 'guard', 'role', 'topic', 'project', 'entity', 'status', 'module', 'platform']) {
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

// Generate unified manifest for LLM/RAG
async function generateManifest(relationsMap: RelationsMap) {
  console.log('📋 Generating manifest...')

  const manifest: any = {
    version: '1.0.0',
    generated: new Date().toISOString(),
    project: null,
    layers: {
      entities: [],
      useCases: [],
      roles: [],
      guards: [],
      knowledge: [],
      modules: [],
    },
    platforms: [],  // Loaded separately from src/spec/platforms/
    docs: [],
    relations: {
      byId: relationsMap.byId,
      graph: relationsMap.relations,
    },
  }

  const layersDir = path.join(specDir, 'layers')

  // Recursively find all TOML files in a directory
  async function findTomlFiles(dir: string, basePath: string = ''): Promise<{ filePath: string; relativePath: string }[]> {
    const results: { filePath: string; relativePath: string }[] = []
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true })
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        const relPath = basePath ? `${basePath}/${entry.name}` : entry.name
        if (entry.isDirectory()) {
          results.push(...await findTomlFiles(fullPath, relPath))
        } else if (entry.isFile() && entry.name.endsWith('.toml')) {
          results.push({ filePath: fullPath, relativePath: relPath })
        }
      }
    } catch (error: any) {
      if (error.code !== 'ENOENT') throw error
    }
    return results
  }

  // Load project info first (special case - not in layers array)
  const projectAboutPath = path.join(layersDir, 'project/about.toml')
  try {
    const projectContent = await readTomlFile(projectAboutPath)
    if (projectContent?.project) {
      manifest.project = {
        ...projectContent.project,
        _meta: { path: 'layers/project/about.toml' },
      }
    }
  } catch (error: any) {
    if (error.code !== 'ENOENT') {
      console.error('Error loading project about.toml:', error)
    }
  }

  // Process each layer folder
  for (const [layerName, layerArray] of Object.entries(manifest.layers) as [string, any[]][]) {
    const folderName = layerName === 'useCases' ? 'use-cases' : layerName
    const folderPath = path.join(layersDir, folderName)

    try {
      const tomlFiles = await findTomlFiles(folderPath)

      for (const { filePath, relativePath } of tomlFiles) {
        const content = await readTomlFile(filePath)
        if (!content) continue

        // Flatten the content - extract from wrapper (entity., useCase., etc.)
        const wrapperKey = Object.keys(content).find(k =>
          ['entity', 'useCase', 'role', 'guard', 'platform', 'topic', 'module', 'project'].includes(k)
        )

        let item: any
        if (wrapperKey) {
          item = { ...content[wrapperKey] }
          // Include additional sections (fields, relations, etc.)
          for (const [key, value] of Object.entries(content)) {
            if (key !== wrapperKey && key !== 'relations') {
              item[key] = value
            }
          }
        } else {
          item = { ...content }
          delete item.relations
        }

        // Ensure id exists
        if (!item.id) {
          const fileName = relativePath.split('/').pop() || relativePath
          item.id = fileName.replace('.toml', '')
        }

        // Add metadata with full relative path
        item._meta = {
          path: `layers/${folderName}/${relativePath}`,
        }

        // Special handling for project layer
        const fileName = relativePath.split('/').pop()
        if (folderName === 'project' && fileName === 'about.toml') {
          manifest.project = item
        } else {
          layerArray.push(item)
        }
      }
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        console.error(`Error processing ${folderName}:`, error)
      }
    }
  }

  // Process markdown docs
  const docsDir = path.join(specDir, 'docs')
  async function processDocsFolder(dirPath: string, basePath: string = '') {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name)
        const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name

        if (entry.isDirectory()) {
          await processDocsFolder(fullPath, relativePath)
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          const content = await fs.readFile(fullPath, 'utf-8')
          const id = relativePath.replace(/\.md$/, '').replace(/\//g, '-')

          // Extract title from first heading
          const titleMatch = content.match(/^#\s+(.+)$/m)
          const title = titleMatch ? titleMatch[1] : entry.name.replace('.md', '')

          manifest.docs.push({
            id,
            title,
            content,
            _meta: {
              path: `docs/${relativePath}`,
            },
          })
        }
      }
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        console.error(`Error processing docs:`, error)
      }
    }
  }

  await processDocsFolder(docsDir)

  // Load platforms from src/spec/platforms/
  const platformsDir = path.join(specDir, 'platforms')
  try {
    const platformDirs = await fs.readdir(platformsDir, { withFileTypes: true })
    for (const dir of platformDirs) {
      if (!dir.isDirectory()) continue
      const platformTomlPath = path.join(platformsDir, dir.name, 'platform.toml')
      try {
        const content = await readTomlFile(platformTomlPath)
        if (content?.platform) {
          manifest.platforms.push({
            ...content.platform,
            relations: content.relations || {},
            _meta: { path: `platforms/${dir.name}/platform.toml` }
          })
        }
      } catch {
        // Skip platforms without platform.toml
      }
    }
  } catch {
    // No platforms directory
  }

  // Write manifest
  await fs.writeFile(
    path.join(outputDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  )

  // Stats
  const layerCounts = Object.entries(manifest.layers)
    .filter(([_, arr]) => (arr as any[]).length > 0)
    .map(([name, arr]) => `${name}: ${(arr as any[]).length}`)
    .join(', ')

  console.log(`  ✓ manifest.json (${layerCounts}, platforms: ${manifest.platforms.length}, docs: ${manifest.docs.length})`)
}

// Generate interview data per platform
async function generateInterview() {
  console.log('📋 Generating interview data...')

  const platformsDir = path.join(specDir, 'platforms')
  const interviewsOutputDir = path.join(outputDir, 'interviews')
  await fs.mkdir(interviewsOutputDir, { recursive: true })

  const platformInterviews: any[] = []

  try {
    const platformDirs = await fs.readdir(platformsDir, { withFileTypes: true })

    for (const dir of platformDirs) {
      if (!dir.isDirectory()) continue

      const platformId = dir.name
      const platformPath = path.join(platformsDir, platformId)
      const statusPath = path.join(platformPath, 'status.toml')
      const interviewPath = path.join(platformPath, 'interview.toml')

      try {
        const [status, interview] = await Promise.all([
          readTomlFile(statusPath).catch(() => null),
          readTomlFile(interviewPath).catch(() => null)
        ])

        if (status || interview) {
          const platformInterview = {
            platformId,
            status: status || null,
            interview: interview || null,
            metadata: {
              statusPath: `platforms/${platformId}/status.toml`,
              interviewPath: `platforms/${platformId}/interview.toml`,
              generated: new Date().toISOString()
            }
          }

          // Write individual platform interview file
          await fs.writeFile(
            path.join(interviewsOutputDir, `${platformId}.json`),
            JSON.stringify(platformInterview, null, 2)
          )

          platformInterviews.push({
            platformId,
            currentPhase: status?.status?.currentPhase || 'unknown',
            profile: status?.status?.profile || 'unknown',
            lastUpdated: status?.status?.lastUpdated || null
          })
        }
      } catch (error) {
        // Skip platforms without interview files
      }
    }

    // Write interviews index
    await fs.writeFile(
      path.join(interviewsOutputDir, 'index.json'),
      JSON.stringify({
        platforms: platformInterviews,
        generated: new Date().toISOString()
      }, null, 2)
    )

    console.log(`  ✓ interviews/index.json (${platformInterviews.length} platforms)`)
    for (const pi of platformInterviews) {
      console.log(`    - ${pi.platformId}: ${pi.currentPhase} (${pi.profile})`)
    }

  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.log('  ⚠ No platforms directory found')
    } else {
      console.error('Error generating interview data:', error)
    }
    // Write empty placeholder
    await fs.writeFile(
      path.join(interviewsOutputDir, 'index.json'),
      JSON.stringify({
        platforms: [],
        generated: new Date().toISOString()
      }, null, 2)
    )
  }
}

// Generate platform documentation with index
async function generatePlatforms() {
  console.log('📱 Generating platform documentation...')

  const platformsDir = path.join(specDir, 'platforms')
  const platformsOutputDir = path.join(outputDir, 'platforms')
  await fs.mkdir(platformsOutputDir, { recursive: true })

  try {
    const platformDirs = await fs.readdir(platformsDir, { withFileTypes: true })
    const platforms: any[] = []

    for (const dir of platformDirs) {
      if (!dir.isDirectory()) continue

      const platformId = dir.name
      const platformPath = path.join(platformsDir, platformId)
      const platformOutputPath = path.join(platformsOutputDir, platformId)
      await fs.mkdir(platformOutputPath, { recursive: true })

      // Read platform.toml
      const platformTomlPath = path.join(platformPath, 'platform.toml')
      let platformConfig: any = null
      try {
        platformConfig = await readTomlFile(platformTomlPath)
      } catch {
        console.warn(`  ⚠ No platform.toml for ${platformId}`)
      }

      // Read docs folder
      const docsPath = path.join(platformPath, 'docs')
      const docs: any[] = []

      try {
        const docFiles = await fs.readdir(docsPath)
        const mdFiles = docFiles.filter(f => f.endsWith('.md')).sort()

        for (const fileName of mdFiles) {
          const filePath = path.join(docsPath, fileName)
          const content = await fs.readFile(filePath, 'utf-8')
          const stats = await fs.stat(filePath)

          // Extract title from first heading
          const titleMatch = content.match(/^#\s+(.+)$/m)
          const title = titleMatch ? titleMatch[1] : fileName.replace('.md', '')

          // Extract order from filename (01-overview.md -> 1)
          const orderMatch = fileName.match(/^(\d+)-/)
          const order = orderMatch ? parseInt(orderMatch[1]) : 999

          docs.push({
            id: fileName.replace('.md', ''),
            fileName,
            title,
            order,
            content,
            metadata: {
              path: `platforms/${platformId}/docs/${fileName}`,
              size: stats.size,
              modified: stats.mtime.toISOString(),
            }
          })

          // Write individual doc file
          await fs.writeFile(
            path.join(platformOutputPath, `${fileName.replace('.md', '')}.json`),
            JSON.stringify({
              id: fileName.replace('.md', ''),
              title,
              content,
              metadata: {
                path: `platforms/${platformId}/docs/${fileName}`,
                size: stats.size,
                modified: stats.mtime.toISOString(),
              }
            }, null, 2)
          )
        }
      } catch (error: any) {
        if (error.code !== 'ENOENT') {
          console.error(`  Error reading docs for ${platformId}:`, error)
        }
      }

      // Sort docs by order
      docs.sort((a, b) => a.order - b.order)

      // Create platform index (table of contents)
      const platformIndex = {
        id: platformId,
        name: platformConfig?.platform?.name || platformId,
        description: platformConfig?.platform?.description || '',
        type: platformConfig?.platform?.type || 'web',
        config: platformConfig?.platform?.config || {},
        relations: platformConfig?.relations || {},
        docs: docs.map(d => ({
          id: d.id,
          title: d.title,
          order: d.order,
          path: d.metadata.path,
        })),
        metadata: {
          path: `platforms/${platformId}/platform.toml`,
          docsCount: docs.length,
          generated: new Date().toISOString(),
        }
      }

      // Write platform index
      await fs.writeFile(
        path.join(platformOutputPath, 'index.json'),
        JSON.stringify(platformIndex, null, 2)
      )

      platforms.push(platformIndex)
      console.log(`  ✓ ${platformId} (${docs.length} docs)`)
    }

    // Write global platforms index
    await fs.writeFile(
      path.join(platformsOutputDir, 'index.json'),
      JSON.stringify({
        platforms: platforms.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          type: p.type,
          docsCount: p.docs.length,
        })),
        generated: new Date().toISOString(),
      }, null, 2)
    )
    console.log(`  ✓ platforms/index.json (${platforms.length} platforms)`)

  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.log('  ⚠ No platforms directory found')
    } else {
      console.error('Error generating platforms:', error)
    }
  }
}

// Main build function
async function build() {
  console.log('\n🚀 tscodex-boilerplate Build\n')
  console.log(`Root: ${rootDir}`)
  console.log(`Spec: ${specDir}`)
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
  await generatePlatforms()
  await generatePrismaSchema()
  await generateInterview()

  // Generate relations map
  const relationsMap = await generateRelationsMap()
  await fs.writeFile(
    path.join(outputDir, 'relations-map.json'),
    JSON.stringify(relationsMap, null, 2)
  )
  console.log('  ✓ relations-map.json')

  // Generate manifest for LLM/RAG
  await generateManifest(relationsMap)

  console.log('\n✅ Build complete!\n')
}

build().catch(console.error)
