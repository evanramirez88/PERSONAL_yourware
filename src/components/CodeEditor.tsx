import { useCallback } from 'react';
import Editor from '@monaco-editor/react';

export interface CodeEditorProps {
  value: string;
  language?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}

const CodeEditor = ({ value, language = 'typescript', onChange, readOnly = false }: CodeEditorProps) => {
  const handleChange = useCallback(
    (nextValue: string | undefined) => {
      if (onChange) {
        onChange(nextValue ?? '');
      }
    },
    [onChange]
  );

  return (
    <div className="border border-black/10 rounded-2xl overflow-hidden shadow-subtle bg-white">
      <Editor
        height="480px"
        theme="vs"
        language={language}
        value={value}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
          readOnly,
          scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 }
        }}
        onChange={handleChange}
      />
    </div>
  );
};

export default CodeEditor;
