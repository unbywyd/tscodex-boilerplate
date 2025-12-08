import ReactMarkdown from 'react-markdown';
import { getRenderer } from '../../lib/render-config';

interface MarkdownRendererProps {
  content: string;
  folderPath?: string;
}

export default function MarkdownRenderer({ content, folderPath = '*' }: MarkdownRendererProps) {
  // Check if there's a custom renderer for this folder
  const renderer = getRenderer(folderPath, 'markdown');
  
  // If it's the default renderer, use react-markdown for better rendering
  if (renderer.toString().includes('dangerouslySetInnerHTML')) {
    return (
      <div className="markdown-content">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    );
  }
  
  // Otherwise use custom renderer
  return <>{renderer(content)}</>;
}

