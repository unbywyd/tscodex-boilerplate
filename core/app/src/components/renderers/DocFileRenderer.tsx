import MarkdownRenderer from './MarkdownRenderer';
import TomlRenderer from './TomlRenderer';
import type { DocFile } from '../../lib/docs-loader';

interface DocFileRendererProps {
  file: DocFile;
  folderPath?: string;
}

export default function DocFileRenderer({ file, folderPath }: DocFileRendererProps) {
  if (file.type === 'markdown') {
    return <MarkdownRenderer content={file.content as string} folderPath={folderPath} />;
  } else if (file.type === 'toml') {
    return <TomlRenderer content={file.content} folderPath={folderPath} filePath={file.path} />;
  }
  
  return <div>Unsupported file type</div>;
}

