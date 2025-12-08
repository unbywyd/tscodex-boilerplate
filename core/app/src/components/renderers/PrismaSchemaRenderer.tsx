import { useEffect, useRef } from 'react'
import Prism from 'prismjs'
import 'prismjs/themes/prism.css'

// Define Prisma language for Prism.js
Prism.languages.prisma = {
  comment: {
    pattern: /\/\/.*|\/\*[\s\S]*?\*\//,
    greedy: true
  },
  string: {
    pattern: /"(?:\\.|[^"\\])*"/,
    greedy: true
  },
  keyword: /\b(?:model|enum|type|datasource|generator|provider|output|url|env|previewFeatures)\b/,
  'class-name': {
    pattern: /\b(?:String|Int|Float|Boolean|DateTime|Json|Bytes|Decimal|BigInt)\b/,
    alias: 'builtin'
  },
  attribute: {
    pattern: /@+[\w.]+/,
    alias: 'annotation'
  },
  function: /\b(?:default|unique|id|relation|map|ignore|updatedAt|now|cuid|uuid|autoincrement|dbgenerated)\b/,
  operator: /[=?!]/,
  punctuation: /[{}()\[\],]/,
  'model-name': {
    pattern: /(?<=\b(?:model|enum|type)\s+)\w+/,
    lookbehind: true,
    alias: 'class-name'
  }
}

interface PrismaSchemaRendererProps {
  schema: string
  title?: string
}

export default function PrismaSchemaRenderer({ schema, title = 'Prisma Schema' }: PrismaSchemaRendererProps) {
  const codeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current)
    }
  }, [schema])

  if (!schema.trim()) {
    return (
      <div className="text-sm text-muted-foreground p-4 border border-dashed rounded-lg">
        No Prisma schema available
      </div>
    )
  }

  return (
    <div className="prisma-schema space-y-3">
      {title && (
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-primary/10 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="w-3 h-3 sm:w-4 sm:h-4 text-primary" fill="none">
              <path d="M21.807 18.285L13.553.756a1.324 1.324 0 00-1.129-.754 1.31 1.31 0 00-1.206.626l-8.952 14.5a1.356 1.356 0 00.016 1.455l4.376 6.778a1.408 1.408 0 001.58.581l12.703-3.757c.389-.115.707-.39.873-.755s.164-.783-.007-1.145zm-1.848.752L9.18 22.224a.452.452 0 01-.575-.52l3.85-18.438c.072-.345.549-.4.699-.08l7.129 15.138a.515.515 0 01-.324.713z" fill="currentColor"/>
            </svg>
          </div>
          <h4 className="font-semibold text-xs sm:text-sm break-words">{title}</h4>
        </div>
      )}

      <div className="relative">
        <pre className="!rounded-lg !bg-muted !p-3 sm:!p-4 overflow-x-auto max-h-[400px] sm:max-h-[600px] text-xs sm:text-sm border">
          <code ref={codeRef} className="language-prisma whitespace-pre-wrap break-words">
            {schema}
          </code>
        </pre>

        {/* Copy button */}
        <button
          onClick={() => navigator.clipboard.writeText(schema)}
          className="absolute top-2 right-2 p-2 sm:p-2.5 rounded bg-background hover:bg-accent text-foreground border transition-colors shadow-sm min-w-[44px] min-h-[44px] flex items-center justify-center"
          title="Copy schema"
          aria-label="Copy schema to clipboard"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      {/* Schema stats */}
      <div className="flex flex-wrap gap-3 sm:gap-4 text-xs text-muted-foreground">
        <span>{(schema.match(/^model\s+/gm) || []).length} models</span>
        <span>{(schema.match(/^enum\s+/gm) || []).length} enums</span>
        <span>{schema.split('\n').length} lines</span>
      </div>
    </div>
  )
}
