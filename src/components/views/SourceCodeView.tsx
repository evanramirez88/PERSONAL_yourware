import { useMemo, useState } from 'react';
import CodeEditor from '@/components/CodeEditor';
import type { SourceFile } from '@/types';
import { exportSourceAsZip } from '@/utils/sourceCodeExporter';
import './SourceCodeView.css';

interface SourceCodeViewProps {
  files: SourceFile[];
  onUpdateFile: (path: string, content: string) => void;
}

const LANGUAGE_MAPPINGS: Record<string, string> = {
  '.tsx': 'typescript',
  '.ts': 'typescript',
  '.css': 'css',
  '.json': 'json'
};

export function SourceCodeView({ files, onUpdateFile }: SourceCodeViewProps) {
  const [selectedPath, setSelectedPath] = useState(() => files[0]?.path ?? '');

  const activeFile = useMemo(() => files.find((file) => file.path === selectedPath) ?? files[0], [files, selectedPath]);

  const language = useMemo(() => {
    if (!activeFile) return 'typescript';
    const ext = Object.keys(LANGUAGE_MAPPINGS).find((key) => activeFile.path.endsWith(key));
    return (ext && LANGUAGE_MAPPINGS[ext]) || 'typescript';
  }, [activeFile]);

  const handleExport = () => {
    exportSourceAsZip(files);
  };

  const handleCopy = () => {
    if (!activeFile) return;
    navigator.clipboard.writeText(activeFile.content).catch((error) => {
      console.error('Failed to copy code', error);
    });
  };

  if (!activeFile) {
    return <p>No source files to display.</p>;
  }

  return (
    <div className="source-view">
      <aside className="source-view__sidebar">
        <header>
          <h3>Files</h3>
          <button onClick={handleExport}>Export ZIP</button>
        </header>
        <ul>
          {files.map((file) => (
            <li key={file.path}>
              <button className={file.path === activeFile.path ? 'active' : ''} onClick={() => setSelectedPath(file.path)}>
                {file.path}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <section className="source-view__editor">
        <div className="source-view__toolbar">
          <span>{activeFile.path}</span>
          <div className="source-view__actions">
            <button onClick={handleCopy}>Copy</button>
          </div>
        </div>
        <CodeEditor
          value={activeFile.content}
          language={language}
          onChange={(value) => onUpdateFile(activeFile.path, value)}
          height="100%"
        />
      </section>
    </div>
  );
}

export default SourceCodeView;
