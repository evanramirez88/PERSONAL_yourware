import { useState } from 'react';
import Editor from '@monaco-editor/react';
import './CodeEditor.css';

interface CodeEditorProps {
  value: string;
  language?: string;
  onChange: (value: string) => void;
  onRun?: (code: string) => void;
  height?: string;
}

export function CodeEditor({ value, language = 'typescript', onChange, onRun, height = '400px' }: CodeEditorProps) {
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async () => {
    if (!onRun) return;
    setIsRunning(true);
    await Promise.resolve(onRun(value));
    setIsRunning(false);
  };

  return (
    <div className="code-editor" style={{ height }}>
      <div className="code-editor__toolbar">
        <span className="code-editor__label">{language.toUpperCase()}</span>
        {onRun && (
          <button className="code-editor__run" onClick={handleRun} disabled={isRunning}>
            {isRunning ? 'Running…' : 'Run'}
          </button>
        )}
      </div>
      <Editor
        height="100%"
        defaultLanguage={language}
        value={value}
        onChange={(next) => onChange(next ?? '')}
        theme="vs-light"
        options={{ fontSize: 14, minimap: { enabled: false }, scrollBeyondLastLine: false }}
      />
    </div>
  );
}

export default CodeEditor;
