import { decrypt, encrypt } from '@/utils/encryption';
import type { ProviderKey } from '@/types';

const STORAGE_KEY = 'youware.keys';

class ApiKeyManager {
  loadKeys(): ProviderKey[] {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw) as Array<{ provider: string; value: string; createdAt: string }>;
      return parsed.map((entry) => ({
        provider: entry.provider as ProviderKey['provider'],
        apiKey: decrypt(entry.value),
        createdAt: entry.createdAt
      }));
    } catch (error) {
      console.error('Failed to load keys', error);
      return [];
    }
  }

  saveKey(provider: ProviderKey['provider'], apiKey: string) {
    const existing = this.loadKeys();
    const filtered = existing.filter((item) => item.provider !== provider);
    const encrypted = encrypt(apiKey);
    const updated = [
      ...filtered,
      {
        provider,
        apiKey,
        createdAt: new Date().toISOString()
      }
    ];
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated.map((item) => ({ provider: item.provider, value: encrypt(item.apiKey), createdAt: item.createdAt })))
    );
    return encrypted;
  }

  deleteKey(provider: ProviderKey['provider']) {
    const existing = this.loadKeys();
    const updated = existing.filter((item) => item.provider !== provider);
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated.map((item) => ({ provider: item.provider, value: encrypt(item.apiKey), createdAt: item.createdAt })))
    );
  }
}

const apiKeyManager = new ApiKeyManager();
export default apiKeyManager;
