// Mermaid flowchart parser - converts mermaid syntax to ReactFlow nodes/edges

export interface MermaidNode {
  id: string
  label: string
  type: 'default' | 'start' | 'end' | 'decision' | 'subprocess'
}

export interface MermaidEdge {
  id: string
  source: string
  target: string
  label?: string
}

export interface ParsedMermaid {
  direction: 'TB' | 'LR' | 'BT' | 'RL'
  nodes: MermaidNode[]
  edges: MermaidEdge[]
}

// Node shape patterns and their types
const nodePatterns: { regex: RegExp; type: MermaidNode['type'] }[] = [
  { regex: /^(\w+)\(\((.*?)\)\)$/, type: 'start' },      // A((label)) - circle
  { regex: /^(\w+)\(\[(.*?)\]\)$/, type: 'end' },        // A([label]) - stadium
  { regex: /^(\w+)\{(.*?)\}$/, type: 'decision' },       // A{label} - diamond
  { regex: /^(\w+)\[\[(.*?)\]\]$/, type: 'subprocess' }, // A[[label]] - subroutine
  { regex: /^(\w+)\[(.*?)\]$/, type: 'default' },        // A[label] - rectangle
  { regex: /^(\w+)\((.*?)\)$/, type: 'default' },        // A(label) - rounded
  { regex: /^(\w+)>(.*?)\]$/, type: 'default' },         // A>label] - asymmetric
]

// Parse a node definition like "A((Start))" or "B[Label]" or just "A"
function parseNodeDef(nodeDef: string): { id: string; label: string; type: MermaidNode['type'] } | null {
  const trimmed = nodeDef.trim()
  if (!trimmed) return null

  // Try each pattern
  for (const { regex, type } of nodePatterns) {
    const match = trimmed.match(regex)
    if (match) {
      return { id: match[1], label: match[2], type }
    }
  }

  // Just an ID without shape
  if (/^\w+$/.test(trimmed)) {
    return { id: trimmed, label: trimmed, type: 'default' }
  }

  return null
}

// Split a line into node definitions connected by arrows
function splitByArrows(line: string): { parts: string[]; arrows: { label?: string }[] } {
  const parts: string[] = []
  const arrows: { label?: string }[] = []

  // Match arrows with optional labels: -->, --->, -.->. -->|label|, --label-->
  const arrowRegex = /(-->|---+>|-\.->|==>)\|([^|]+)\||--([^-]+)--+>|(-->|---+>|-\.->|==>)/g

  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = arrowRegex.exec(line)) !== null) {
    // Get the part before this arrow
    const part = line.slice(lastIndex, match.index).trim()
    if (part) parts.push(part)

    // Get arrow label if any
    const label = match[2] || match[3] || undefined
    arrows.push({ label })

    lastIndex = match.index + match[0].length
  }

  // Get the last part after the last arrow
  const lastPart = line.slice(lastIndex).trim()
  if (lastPart) parts.push(lastPart)

  return { parts, arrows }
}

export function parseMermaid(mermaidCode: string): ParsedMermaid {
  const lines = mermaidCode.split('\n')
  const nodesMap = new Map<string, MermaidNode>()
  const edges: MermaidEdge[] = []
  let direction: ParsedMermaid['direction'] = 'TB'
  let edgeIndex = 0

  for (const rawLine of lines) {
    const line = rawLine.trim()

    // Skip empty lines and comments
    if (!line || line.startsWith('%%')) continue

    // Parse direction
    const dirMatch = line.match(/^(graph|flowchart)\s+(TD|TB|LR|RL|BT)/i)
    if (dirMatch) {
      const dir = dirMatch[2].toUpperCase()
      direction = dir === 'TD' ? 'TB' : dir as ParsedMermaid['direction']
      continue
    }

    // Skip subgraph keywords
    if (line.startsWith('subgraph') || line === 'end') continue

    // Split line by arrows
    const { parts, arrows } = splitByArrows(line)

    if (parts.length === 0) continue

    // Parse each part as a node
    const nodeIds: string[] = []
    for (const part of parts) {
      const nodeDef = parseNodeDef(part)
      if (nodeDef) {
        // Only add if not already defined, or update label if it was just an ID before
        const existing = nodesMap.get(nodeDef.id)
        if (!existing || (existing.label === existing.id && nodeDef.label !== nodeDef.id)) {
          nodesMap.set(nodeDef.id, nodeDef)
        }
        nodeIds.push(nodeDef.id)
      }
    }

    // Create edges between consecutive nodes
    for (let i = 0; i < nodeIds.length - 1; i++) {
      edges.push({
        id: `e${edgeIndex++}`,
        source: nodeIds[i],
        target: nodeIds[i + 1],
        label: arrows[i]?.label,
      })
    }
  }

  return {
    direction,
    nodes: Array.from(nodesMap.values()),
    edges,
  }
}
