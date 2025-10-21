import { FormEvent, useMemo, useState } from 'react';
import aiService from '@/services/aiService';
import apiKeyManager from '@/services/apiKeyManager';
import type { ProviderKey, ProviderName } from '@/types';

const SettingsView = () => {
  const [provider, setProvider] = useState<ProviderName>('openai');
  const [apiKey, setApiKey] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [keys, setKeys] = useState<ProviderKey[]>(() => apiKeyManager.loadKeys());

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValid = await aiService.validateApiKey(provider, apiKey);
    if (!isValid) {
      setMessage('The provided API key does not appear to be valid for this provider.');
      return;
    }
    apiKeyManager.saveKey(provider, apiKey);
    setKeys(apiKeyManager.loadKeys());
    setApiKey('');
    setMessage('API key saved successfully.');
  };

  const handleDelete = (target: ProviderName) => {
    apiKeyManager.deleteKey(target);
    setKeys(apiKeyManager.loadKeys());
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-medium">Settings</h1>
        <p className="text-sm text-black/60">Manage API credentials for each provider.</p>
      </header>

      <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-subtle">
        <h2 className="text-lg font-semibold mb-4">Add API Key</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            API Key
            <input
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              placeholder="Paste your API key"
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
            />
          </label>
          <div className="flex items-end">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-xl bg-youware-primary text-white px-4 py-2 text-sm font-medium shadow-subtle"
            >
              Save Key
            </button>
          </div>
        </form>
        {message && <p className="text-sm text-black/60 mt-4">{message}</p>}
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-subtle">
        <h2 className="text-lg font-semibold mb-4">Stored Keys</h2>
        <div className="space-y-3">
          {keys.map((key) => (
            <div key={key.provider} className="flex items-center justify-between rounded-xl border border-black/10 px-4 py-3">
              <div>
                <p className="text-sm font-medium">{key.provider}</p>
                <p className="text-xs text-black/50">Saved {new Date(key.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => handleDelete(key.provider)} className="text-sm text-red-500">
                Remove
              </button>
            </div>
          ))}
          {keys.length === 0 && <p className="text-sm text-black/50">No API keys saved yet.</p>}
        </div>
      </section>
    </div>
  );
};

export default SettingsView;
