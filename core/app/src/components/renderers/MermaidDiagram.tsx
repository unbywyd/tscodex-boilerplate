import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

interface MermaidDiagramProps {
  code: string
  title?: string
  height?: number
}

// Initialize mermaid with default config
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: 'basis',
  },
  securityLevel: 'loose',
})

let diagramId = 0

export default function MermaidDiagram({ code, title, height = 400 }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [svg, setSvg] = useState<string>('')

  useEffect(() => {
    const renderDiagram = async () => {
      if (!code.trim()) {
        setError('No mermaid code provided')
        return
      }

      try {
        // Generate unique ID for this diagram
        const id = `mermaid-diagram-${diagramId++}`

        // Render mermaid to SVG
        const { svg: renderedSvg } = await mermaid.render(id, code.trim())
        setSvg(renderedSvg)
        setError(null)
      } catch (err) {
        console.error('Mermaid render error:', err)
        setError(err instanceof Error ? err.message : 'Failed to render diagram')
      }
    }

    renderDiagram()
  }, [code])

  if (error) {
    return (
      <div className="text-sm text-red-500 p-4 border border-red-200 rounded-lg bg-red-50">
        <div className="font-medium mb-2">Diagram Error</div>
        <div className="text-xs text-red-400">{error}</div>
        <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto">
          {code}
        </pre>
      </div>
    )
  }

  return (
    <div className="mermaid-diagram space-y-3">
      {title && (
        <h4 className="font-semibold text-sm text-muted-foreground">{title}</h4>
      )}

      <div
        ref={containerRef}
        className="border rounded-lg overflow-auto bg-white dark:bg-slate-900/50 p-4"
        style={{ minHeight: height / 2, maxHeight: height }}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  )
}
