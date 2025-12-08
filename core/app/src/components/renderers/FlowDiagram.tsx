import { useCallback, useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  MarkerType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

interface FlowNode {
  id: string
  type: 'start' | 'end' | 'action' | 'decision' | 'subprocess'
  label: string
}

interface FlowEdge {
  from: string
  to: string
  label?: string
}

interface FlowData {
  id: string
  title: string
  useCaseId?: string
  direction?: 'vertical' | 'horizontal'
  nodes: FlowNode[]
  edges: FlowEdge[]
}

interface FlowDiagramProps {
  content: FlowData
}

const nodeColors: Record<string, { bg: string; border: string }> = {
  start: { bg: '#22c55e', border: '#16a34a' },
  end: { bg: '#ef4444', border: '#dc2626' },
  action: { bg: '#3b82f6', border: '#2563eb' },
  decision: { bg: '#f59e0b', border: '#d97706' },
  subprocess: { bg: '#8b5cf6', border: '#7c3aed' },
}

function convertToReactFlowNodes(
  flowNodes: FlowNode[],
  direction: 'vertical' | 'horizontal'
): Node[] {
  const spacing = direction === 'vertical' ? { x: 0, y: 120 } : { x: 250, y: 0 }

  return flowNodes.map((node, index) => {
    const colors = nodeColors[node.type] || nodeColors.action

    return {
      id: node.id,
      type: 'default',
      position: {
        x: direction === 'vertical' ? 200 : index * spacing.x,
        y: direction === 'vertical' ? index * spacing.y : 100,
      },
      data: { label: node.label },
      style: {
        background: colors.bg,
        color: 'white',
        border: `2px solid ${colors.border}`,
        borderRadius: node.type === 'start' || node.type === 'end' ? '50%' : '8px',
        padding: '10px 20px',
        fontSize: '14px',
        fontWeight: 500,
        minWidth: node.type === 'start' || node.type === 'end' ? '120px' : '180px',
        textAlign: 'center' as const,
      },
    }
  })
}

function convertToReactFlowEdges(flowEdges: FlowEdge[]): Edge[] {
  return flowEdges.map((edge, index) => ({
    id: `e${index}-${edge.from}-${edge.to}`,
    source: edge.from,
    target: edge.to,
    label: edge.label || undefined,
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#64748b', strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#64748b',
    },
  }))
}

export default function FlowDiagram({ content }: FlowDiagramProps) {
  const direction = content.direction || 'vertical'

  const initialNodes = useMemo(
    () => convertToReactFlowNodes(content.nodes || [], direction),
    [content.nodes, direction]
  )

  const initialEdges = useMemo(
    () => convertToReactFlowEdges(content.edges || []),
    [content.edges]
  )

  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  const onInit = useCallback(() => {
    // Flow initialized
  }, [])

  return (
    <div className="flow-diagram">
      <div className="flow-header mb-4">
        <h2 className="text-2xl font-bold">{content.title}</h2>
        {content.useCaseId && (
          <p className="text-muted-foreground">Use Case: {content.useCaseId}</p>
        )}
      </div>

      <div className="flow-legend flex gap-4 mb-4 flex-wrap">
        {Object.entries(nodeColors).map(([type, colors]) => (
          <div key={type} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{
                background: colors.bg,
                borderRadius: type === 'start' || type === 'end' ? '50%' : '4px',
              }}
            />
            <span className="text-sm capitalize">{type}</span>
          </div>
        ))}
      </div>

      <div className="flow-canvas" style={{ height: '500px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onInit={onInit}
          fitView
          attributionPosition="bottom-left"
        >
          <Background color="#94a3b8" gap={16} />
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              const type = content.nodes?.find((n) => n.id === node.id)?.type || 'action'
              return nodeColors[type]?.bg || '#3b82f6'
            }}
          />
        </ReactFlow>
      </div>
    </div>
  )
}
