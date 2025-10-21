import { useState } from 'react';
import CodeEditor from '@/components/CodeEditor';
import { aiService, PROVIDER_LIST } from '@/services/aiService';
import { recordUsage } from '@/services/usageTracker';
import { executeCode } from '@/services/codeExecutor';
import type { ProviderName } from '@/types';
import './EditorView.css';

interface ExecutionLog {
  output: string[];
  error?: string;
  durationMs: number;
}

const DEFAULT_PROMPT = `Create a TypeScript function named greet that takes a string name and returns "Hello, <name>!".`;
const DEFAULT_CODE = `function greet(name: string): string {
  return \`Hello, ${name}!\`;
}

console.log(greet('YouWare'));
`;

export function EditorView() {
  const [provider, setProvider] = useState<ProviderName>('openai');
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [code, setCode] = useState(DEFAULT_CODE);
  const [isGenerating, setIsGenerating] = useState(false);
  const [execution, setExecution] = useState<ExecutionLog | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMessage(null);
    try {
      const result = await aiService.generateCode({ prompt, provider });
      setCode(result);
      const promptTokens = Math.ceil(prompt.length / 4);
      const completionTokens = Math.ceil(result.length / 4);
      recordUsage(provider, promptTokens, completionTokens, 0);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error generating code.';
      setErrorMessage(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExecute = (source: string) => {
    const result = executeCode(source);
    setExecution(result);
  };

  return (
    <div className="editor-view">
      <div className="editor-view__controls">
        <div className="editor-view__field">
          <label htmlFor="provider">Model Provider</label>
          <select id="provider" value={provider} onChange={(event) => setProvider(event.target.value as ProviderName)}>
            {PROVIDER_LIST.map((item) => (
              <option key={item.name} value={item.name}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div className="editor-view__field editor-view__field--wide">
          <label htmlFor="prompt">Prompt</label>
          <textarea id="prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={3} />
        </div>
        <button className="editor-view__generate" onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? 'Generating…' : 'Generate Code'}
        </button>
      </div>

      {errorMessage && <div className="editor-view__error">{errorMessage}</div>}

      <CodeEditor value={code} onChange={setCode} onRun={handleExecute} />

      <div className="editor-view__result">
        <h2>Execution Console</h2>
        {execution ? (
          <div className="editor-view__console">
            <p className="editor-view__runtime">Execution time: {execution.durationMs.toFixed(2)}ms</p>
            {execution.output.map((line, index) => (
              <pre key={index}>{line}</pre>
            ))}
            {execution.error && <pre className="editor-view__error">{execution.error}</pre>}
          </div>
        ) : (
          <p className="editor-view__placeholder">Run the code to view output logs.</p>
        )}
      </div>
    </div>
  );
}

export default EditorView;
