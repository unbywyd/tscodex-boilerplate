import { useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  MarkerType,
  Position,
} from '@xyflow/react'
import dagre from 'dagre'
import '@xyflow/react/dist/style.css'
import { parseMermaid, type MermaidNode } from '@/lib/mermaid-parser'

interface MermaidDiagramProps {
  code: string
  title?: string
  height?: number
}

const nodeColors: Record<MermaidNode['type'], { bg: string; border: string }> = {
  start: { bg: '#22c55e', border: '#16a34a' },
  end: { bg: '#ef4444', border: '#dc2626' },
  default: { bg: '#3b82f6', border: '#2563eb' },
  decision: { bg: '#f59e0b', border: '#d97706' },
  subprocess: { bg: '#8b5cf6', border: '#7c3aed' },
}

const NODE_WIDTH = 160
const NODE_HEIGHT = 50

// Use dagre for automatic graph layout
function getLayoutedElements(
  nodes: Node[],
  edges: Edge[],
  direction: 'TB' | 'LR' | 'BT' | 'RL'
): { nodes: Node[]; edges: Edge[] } {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))

  const isHorizontal = direction === 'LR' || direction === 'RL'
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 50,
    ranksep: 80,
    marginx: 20,
    marginy: 20,
  })

  // Add nodes to dagre
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT })
  })

  // Add edges to dagre
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  // Calculate layout
  dagre.layout(dagreGraph)

  // Apply positions to nodes
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
    }
  })

  return { nodes: layoutedNodes, edges }
}

function convertToReactFlowNodes(mermaidNodes: MermaidNode[]): Node[] {
  return mermaidNodes.map((node) => {
    const colors = nodeColors[node.type]
    const isTerminal = node.type === 'start' || node.type === 'end'
    const isDecision = node.type === 'decision'

    return {
      id: node.id,
      type: 'default',
      position: { x: 0, y: 0 }, // Will be set by dagre
      data: {
        label: (
          <div
            style={{
              transform: isDecision ? 'rotate(-45deg)' : undefined,
              fontSize: '12px',
              fontWeight: 500,
            }}
          >
            {node.label}
          </div>
        ),
      },
      style: {
        background: colors.bg,
        color: 'white',
        border: `2px solid ${colors.border}`,
        borderRadius: isTerminal ? '50%' : isDecision ? '4px' : '8px',
        transform: isDecision ? 'rotate(45deg)' : undefined,
        padding: isTerminal ? '8px' : '10px 16px',
        fontSize: '12px',
        fontWeight: 500,
        width: isTerminal ? NODE_HEIGHT : NODE_WIDTH,
        height: NODE_HEIGHT,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center' as const,
      },
    }
  })
}

function convertToReactFlowEdges(
  edges: { id: string; source: string; target: string; label?: string }[]
): Edge[] {
  return edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: edge.label,
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#64748b', strokeWidth: 2 },
    labelStyle: { fontSize: '11px', fontWeight: 500, fill: '#475569' },
    labelBgStyle: { fill: 'white', fillOpacity: 0.9 },
    labelBgPadding: [4, 2] as [number, number],
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#64748b',
    },
  }))
}

export default function MermaidDiagram({ code, title, height = 400 }: MermaidDiagramProps) {
  const { nodes, edges } = useMemo(() => {
    const parsed = parseMermaid(code)
    const initialNodes = convertToReactFlowNodes(parsed.nodes)
    const initialEdges = convertToReactFlowEdges(parsed.edges)

    // Apply dagre layout
    return getLayoutedElements(initialNodes, initialEdges, parsed.direction)
  }, [code])

  if (nodes.length === 0) {
    return (
      <div className="text-sm text-muted-foreground p-4 border rounded-lg bg-muted/30">
        No diagram nodes found in mermaid code
      </div>
    )
  }

  return (
    <div className="mermaid-diagram space-y-3">
      {title && (
        <h4 className="font-semibold text-sm text-muted-foreground">{title}</h4>
      )}

      <div className="flex gap-4 flex-wrap text-xs">
        {Object.entries(nodeColors).map(([type, colors]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3"
              style={{
                background: colors.bg,
                borderRadius:
                  type === 'start' || type === 'end'
                    ? '50%'
                    : type === 'decision'
                      ? '2px'
                      : '3px',
                transform: type === 'decision' ? 'rotate(45deg)' : undefined,
              }}
            />
            <span className="text-muted-foreground capitalize">{type}</span>
          </div>
        ))}
      </div>

      <div
        className="border rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-900/50"
        style={{ height }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          nodesDraggable={true}
          nodesConnectable={false}
          elementsSelectable={true}
          panOnDrag={true}
          zoomOnScroll={true}
          zoomOnPinch={true}
          zoomOnDoubleClick={false}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#e2e8f0" gap={16} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
    </div>
  )
}
