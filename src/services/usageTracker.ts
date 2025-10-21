import type { ProviderName, UsageMetric } from '@/types';

const STORAGE_KEY = 'youware.usage';

interface UsageRecord {
  provider: ProviderName;
  totalCalls: number;
  totalTokens: number;
  lastUsed: string;
}

class UsageTracker {
  private load(): UsageRecord[] {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as UsageRecord[];
    } catch (error) {
      console.error('Failed to parse usage data', error);
      return [];
    }
  }

  private save(records: UsageRecord[]) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }

  trackCall(provider: ProviderName, tokens: number) {
    const records = this.load();
    const now = new Date().toISOString();
    const existing = records.find((record) => record.provider === provider);
    if (existing) {
      existing.totalCalls += 1;
      existing.totalTokens += tokens;
      existing.lastUsed = now;
    } else {
      records.push({ provider, totalCalls: 1, totalTokens: tokens, lastUsed: now });
    }
    this.save(records);
  }

  list(): UsageMetric[] {
    return this.load();
  }
}

const usageTracker = new UsageTracker();
export default usageTracker;
