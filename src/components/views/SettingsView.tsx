import { useEffect, useState } from 'react';
import { PROVIDER_LIST, aiService } from '@/services/aiService';
import { clearApiKey, getApiKey, listStoredKeys, saveApiKey } from '@/services/apiKeyManager';
import type { ProviderName } from '@/types';
import './SettingsView.css';

interface ProviderState {
  key: string;
  isValid?: boolean;
  lastChecked?: string;
  isSaving: boolean;
}

export function SettingsView() {
  const [states, setStates] = useState<Record<ProviderName, ProviderState>>(() => {
    const initial: Record<ProviderName, ProviderState> = {
      openai: { key: '', isSaving: false },
      anthropic: { key: '', isSaving: false },
      google: { key: '', isSaving: false },
      openrouter: { key: '', isSaving: false },
      deepseek: { key: '', isSaving: false }
    };
    const stored = listStoredKeys();
    stored.forEach((record) => {
      initial[record.provider].key = getApiKey(record.provider) ?? '';
      initial[record.provider].lastChecked = record.createdAt;
    });
    return initial;
  });

  const handleChange = (provider: ProviderName, value: string) => {
    setStates((prev) => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        key: value,
        isValid: undefined
      }
    }));
  };

  const handleSave = async (provider: ProviderName) => {
    setStates((prev) => ({
      ...prev,
      [provider]: { ...prev[provider], isSaving: true }
    }));

    try {
      const value = states[provider].key;
      saveApiKey(provider, value);
      const valid = await aiService.validateApiKey(provider, value);
      setStates((prev) => ({
        ...prev,
        [provider]: {
          ...prev[provider],
          isValid: valid,
          isSaving: false,
          lastChecked: new Date().toISOString()
        }
      }));
    } catch (error) {
      console.error('Failed to validate API key', error);
      setStates((prev) => ({
        ...prev,
        [provider]: {
          ...prev[provider],
          isValid: false,
          isSaving: false,
          lastChecked: new Date().toISOString()
        }
      }));
    }
  };

  const handleClear = (provider: ProviderName) => {
    clearApiKey(provider);
    setStates((prev) => ({
      ...prev,
      [provider]: { key: '', isSaving: false, isValid: undefined }
    }));
  };

  useEffect(() => {
    // Ensure local state is synced with stored keys on initial mount
    const stored = listStoredKeys();
    setStates((prev) => {
      const updated = { ...prev };
      stored.forEach((record) => {
        updated[record.provider] = {
          ...updated[record.provider],
          key: getApiKey(record.provider) ?? '',
          lastChecked: record.createdAt
        };
      });
      return updated;
    });
  }, []);

  return (
    <div className="settings">
      <h2>API Keys</h2>
      <p>Provide your own API keys to unlock each provider. Keys are encrypted locally before storage.</p>
      <div className="settings__grid">
        {PROVIDER_LIST.map((provider) => {
          const state = states[provider.name];
          return (
            <div key={provider.name} className="settings__card">
              <header>
                <h3>{provider.label}</h3>
                <span className={`settings__badge ${state.isValid ? 'settings__badge--ok' : state.isValid === false ? 'settings__badge--error' : ''}`}>
                  {state.isValid === undefined ? 'Not validated' : state.isValid ? 'Valid' : 'Invalid'}
                </span>
              </header>
              <label htmlFor={`${provider.name}-key`}>API Key</label>
              <input
                id={`${provider.name}-key`}
                type="password"
                value={state.key}
                onChange={(event) => handleChange(provider.name, event.target.value)}
              />
              <footer>
                <button onClick={() => handleSave(provider.name)} disabled={state.isSaving || !state.key}>
                  {state.isSaving ? 'Saving…' : 'Save & Validate'}
                </button>
                <button className="settings__clear" onClick={() => handleClear(provider.name)} disabled={!state.key}>
                  Clear
                </button>
              </footer>
              {state.lastChecked && <p className="settings__meta">Last checked: {new Date(state.lastChecked).toLocaleString()}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SettingsView;
