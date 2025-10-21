import { decrypt, encrypt } from '@/utils/encryption';
import type { ProviderName, StoredApiKey } from '@/types';

const STORAGE_KEY = 'yourware::api-keys';

function readAll(): StoredApiKey[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredApiKey[];
    return parsed;
  } catch (error) {
    console.error('Failed to read stored API keys', error);
    return [];
  }
}

function persist(keys: StoredApiKey[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
}

export function saveApiKey(provider: ProviderName, key: string) {
  const encryptedKey = encrypt(key);
  const stored = readAll();
  const existingIndex = stored.findIndex((item) => item.provider === provider);
  const record: StoredApiKey = {
    provider,
    encryptedKey,
    createdAt: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    stored.splice(existingIndex, 1, record);
  } else {
    stored.push(record);
  }
  persist(stored);
}

export function getApiKey(provider: ProviderName): string | null {
  const stored = readAll();
  const record = stored.find((item) => item.provider === provider);
  if (!record) return null;
  const decrypted = decrypt(record.encryptedKey);
  return decrypted || null;
}

export function clearApiKey(provider: ProviderName) {
  const stored = readAll().filter((item) => item.provider !== provider);
  persist(stored);
}

export function listStoredKeys(): StoredApiKey[] {
  return readAll();
}
