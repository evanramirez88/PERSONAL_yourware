import { useCallback, useMemo, useState } from 'react';
import CodeEditor from '../CodeEditor';
import aiService from '@/services/aiService';
import apiKeyManager from '@/services/apiKeyManager';
import usageTracker from '@/services/usageTracker';
import { executeCodeSafely } from '@/services/codeExecutor';
import type { GenerationResult, ProviderName } from '@/types';

const EditorView = () => {
  const [provider, setProvider] = useState<ProviderName>('openai');
  const [language, setLanguage] = useState('typescript');
  const [prompt, setPrompt] = useState('Create a React component that renders a button.');
  const [output, setOutput] = useState<GenerationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [executionResult, setExecutionResult] = useState<{ stdout: string; stderr: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const providerOptions = useMemo(
    () => [
      { value: 'openai', label: 'OpenAI' },
      { value: 'anthropic', label: 'Anthropic' },
      { value: 'google', label: 'Google Gemini' },
      { value: 'openrouter', label: 'OpenRouter' },
      { value: 'deepseek', label: 'DeepSeek' }
    ],
    []
  );

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const stored = apiKeyManager.loadKeys().find((item) => item.provider === provider);
      if (!stored) {
        throw new Error('No API key saved for this provider. Add one in Settings.');
      }
      const result = await aiService.generateCode({ prompt, provider, language }, stored.apiKey);
      setOutput(result);
      usageTracker.trackCall(provider, 1024);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error');
    } finally {
      setIsLoading(false);
    }
  }, [language, prompt, provider]);

  const handleRun = useCallback(async () => {
    if (!output?.content) return;
    const result = await executeCodeSafely(output.content);
    setExecutionResult(result);
  }, [output]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-medium">Code Generation Studio</h1>
          <p className="text-sm text-black/60">
            Connect your AI provider, craft prompts, and iterate with real-time code execution.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <label className="text-sm font-medium flex flex-col gap-2">
            Provider
            <select
              value={provider}
              onChange={(event) => setProvider(event.target.value as ProviderName)}
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
            >
              {providerOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium flex flex-col gap-2 md:col-span-2">
            Prompt
            <input
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Describe what you want to build"
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-medium flex flex-col gap-2">
            Language
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
            >
              <option value="typescript">TypeScript</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
            </select>
          </label>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleGenerate}
            className="inline-flex items-center gap-2 rounded-xl bg-youware-primary text-white px-4 py-2 text-sm font-medium shadow-subtle disabled:opacity-60"
            disabled={isLoading}
          >
            {isLoading ? 'Generating…' : 'Generate Code'}
          </button>
          <button
            onClick={handleRun}
            disabled={!output?.content}
            className="inline-flex items-center gap-2 rounded-xl border border-black/10 px-4 py-2 text-sm font-medium disabled:opacity-60"
          >
            Run Output
          </button>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </header>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Generated Code</h2>
        <CodeEditor value={output?.content ?? ''} language={language} onChange={(value) => setOutput((prev) => (prev ? { ...prev, content: value } : prev))} />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-subtle">
          <h3 className="text-base font-semibold mb-3">Last Generation</h3>
          {output ? (
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <dt className="text-black/60">Provider</dt>
              <dd>{output.provider}</dd>
              <dt className="text-black/60">Model</dt>
              <dd>{output.model}</dd>
              <dt className="text-black/60">Created</dt>
              <dd>{new Date(output.createdAt).toLocaleString()}</dd>
            </dl>
          ) : (
            <p className="text-sm text-black/50">No generations yet.</p>
          )}
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-subtle">
          <h3 className="text-base font-semibold mb-3">Execution Output</h3>
          {executionResult ? (
            <div className="space-y-3 text-sm">
              {executionResult.stdout && (
                <div>
                  <p className="font-medium text-black/70 mb-1">Stdout</p>
                  <pre className="rounded-lg bg-black/5 p-3 overflow-x-auto whitespace-pre-wrap">{executionResult.stdout}</pre>
                </div>
              )}
              {executionResult.stderr && (
                <div>
                  <p className="font-medium text-black/70 mb-1">Stderr</p>
                  <pre className="rounded-lg bg-red-50 text-red-500 p-3 overflow-x-auto whitespace-pre-wrap">{executionResult.stderr}</pre>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-black/50">Run generated code to see output.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default EditorView;
