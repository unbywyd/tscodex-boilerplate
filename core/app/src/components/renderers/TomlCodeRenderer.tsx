import { useEffect, useRef } from 'react'
import Prism from 'prismjs'
import 'prismjs/themes/prism.css'

// Define TOML language for Prism.js
if (!Prism.languages.toml) {
  Prism.languages.toml = {
    comment: {
      pattern: /#.*/,
      greedy: true
    },
    string: {
      pattern: /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|'''.*?'''|""".*?"""/s,
      greedy: true
    },
    boolean: /\b(?:true|false|yes|no|on|off)\b/i,
    number: {
      pattern: /[+-]?(?:\d+(?:_\d+)*(?:\.\d+(?:_\d+)*)?|\.\d+(?:_\d+)*)(?:[eE][+-]?\d+(?:_\d+)*)?|0x[0-9A-Fa-f](?:_[0-9A-Fa-f])*|0o[0-7](?:_[0-7])*|0b[01](?:_[01])*/,
      greedy: true
    },
    'class-name': {
      pattern: /\[\[[\w\s-]+\]\]|\[[\w\s-]+\]/,
      alias: 'section'
    },
    datetime: {
      pattern: /\d{4}-\d{2}-\d{2}[Tt]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:[Zz]|[+-]\d{2}:\d{2})?/,
      alias: 'number'
    },
    operator: /[=<>!]+/,
    punctuation: /[{}[\],.:]/,
    property: {
      pattern: /^\s*[\w-]+\s*=/m,
      greedy: true
    }
  }
}

interface TomlCodeRendererProps {
  code: string
  fileName?: string
}

export default function TomlCodeRenderer({ code, fileName }: TomlCodeRendererProps) {
  const codeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current)
    }
  }, [code])

  if (!code.trim()) {
    return (
      <div className="text-sm text-muted-foreground p-4 border border-dashed rounded-lg">
        No TOML content available
      </div>
    )
  }

  return (
    <div className="toml-code-renderer space-y-3">
      {fileName && (
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-primary/10 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="w-3 h-3 sm:w-4 sm:h-4 text-primary" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h4 className="font-semibold text-xs sm:text-sm break-words">{fileName}</h4>
        </div>
      )}

      <div className="relative">
        <pre className="!rounded-lg !bg-muted !p-3 sm:!p-4 overflow-x-auto max-h-[600px] sm:max-h-[800px] text-xs sm:text-sm border">
          <code ref={codeRef} className="language-toml whitespace-pre-wrap break-words">
            {code}
          </code>
        </pre>

        {/* Copy button */}
        <button
          onClick={() => navigator.clipboard.writeText(code)}
          className="absolute top-2 right-2 p-2 sm:p-2.5 rounded bg-background hover:bg-accent text-foreground border transition-colors shadow-sm min-w-[44px] min-h-[44px] flex items-center justify-center"
          title="Copy TOML"
          aria-label="Copy TOML to clipboard"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      {/* Code stats */}
      <div className="flex flex-wrap gap-3 sm:gap-4 text-xs text-muted-foreground">
        <span>{code.split('\n').length} lines</span>
        <span>{code.length} characters</span>
      </div>
    </div>
  )
}

