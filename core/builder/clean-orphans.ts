/**
 * Clean orphaned generated files
 * Removes files from public/generated/ that no longer have corresponding source in src/spec/platforms/
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../..')
const specPlatformsDir = path.join(rootDir, 'src/spec/platforms')
const generatedDir = path.join(rootDir, 'public/generated')
const generatedPlatformsDir = path.join(generatedDir, 'platforms')
const generatedInterviewsDir = path.join(generatedDir, 'interviews')

async function getDirectories(dir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    return entries.filter(e => e.isDirectory()).map(e => e.name)
  } catch {
    return []
  }
}

async function getFiles(dir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    return entries.filter(e => e.isFile()).map(e => e.name)
  } catch {
    return []
  }
}

async function cleanOrphans() {
  console.log('\n🧹 Cleaning orphaned generated files...\n')

  // Get existing platforms from source
  const sourcePlatforms = await getDirectories(specPlatformsDir)
  console.log(`Source platforms: ${sourcePlatforms.length > 0 ? sourcePlatforms.join(', ') : '(none)'}`)

  let removedCount = 0

  // Clean orphaned platform directories
  const generatedPlatforms = await getDirectories(generatedPlatformsDir)
  for (const platform of generatedPlatforms) {
    if (!sourcePlatforms.includes(platform)) {
      const platformPath = path.join(generatedPlatformsDir, platform)
      await fs.rm(platformPath, { recursive: true, force: true })
      console.log(`  ✗ Removed platforms/${platform}/`)
      removedCount++
    }
  }

  // Clean orphaned interview files
  const interviewFiles = await getFiles(generatedInterviewsDir)
  for (const file of interviewFiles) {
    if (file === 'index.json') continue // Skip index file
    const platformId = file.replace('.json', '')
    if (!sourcePlatforms.includes(platformId)) {
      const filePath = path.join(generatedInterviewsDir, file)
      await fs.rm(filePath, { force: true })
      console.log(`  ✗ Removed interviews/${file}`)
      removedCount++
    }
  }

  // Update platforms/index.json if it exists
  const platformsIndexPath = path.join(generatedPlatformsDir, 'index.json')
  try {
    const indexContent = await fs.readFile(platformsIndexPath, 'utf-8')
    const index = JSON.parse(indexContent)
    if (Array.isArray(index)) {
      const filteredIndex = index.filter((p: any) => sourcePlatforms.includes(p.id))
      if (filteredIndex.length !== index.length) {
        await fs.writeFile(platformsIndexPath, JSON.stringify(filteredIndex, null, 2))
        console.log(`  ✓ Updated platforms/index.json`)
      }
    }
  } catch {
    // Index doesn't exist or is invalid, skip
  }

  // Update interviews/index.json if it exists
  const interviewsIndexPath = path.join(generatedInterviewsDir, 'index.json')
  try {
    const indexContent = await fs.readFile(interviewsIndexPath, 'utf-8')
    const index = JSON.parse(indexContent)
    if (index && typeof index === 'object') {
      let changed = false
      for (const key of Object.keys(index)) {
        if (!sourcePlatforms.includes(key)) {
          delete index[key]
          changed = true
        }
      }
      if (changed) {
        await fs.writeFile(interviewsIndexPath, JSON.stringify(index, null, 2))
        console.log(`  ✓ Updated interviews/index.json`)
      }
    }
  } catch {
    // Index doesn't exist or is invalid, skip
  }

  if (removedCount === 0) {
    console.log('  No orphaned files found.')
  }

  console.log('\n✅ Cleanup complete!\n')
}

cleanOrphans().catch(console.error)
