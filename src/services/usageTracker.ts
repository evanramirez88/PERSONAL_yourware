import type { ProviderName, UsageRecord, UsageSummary } from '@/types';

const USAGE_STORAGE_KEY = 'yourware::usage-log';

function readUsage(): UsageRecord[] {
  try {
    const raw = localStorage.getItem(USAGE_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as UsageRecord[];
  } catch (error) {
    console.error('Failed to parse usage log', error);
    return [];
  }
}

function persistUsage(records: UsageRecord[]) {
  localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(records));
}

export function recordUsage(provider: ProviderName, promptTokens: number, completionTokens: number, costUSD: number) {
  const record: UsageRecord = {
    id: crypto.randomUUID(),
    provider,
    timestamp: new Date().toISOString(),
    promptTokens,
    completionTokens,
    costUSD
  };

  const records = readUsage();
  records.unshift(record);
  persistUsage(records.slice(0, 250));
}

export function listUsage(): UsageRecord[] {
  return readUsage();
}

export function summarizeUsage(): UsageSummary {
  const records = readUsage();
  const summary: UsageSummary = {
    totalCalls: records.length,
    totalPromptTokens: 0,
    totalCompletionTokens: 0,
    totalCostUSD: 0,
    breakdown: {
      openai: 0,
      anthropic: 0,
      google: 0,
      openrouter: 0,
      deepseek: 0
    }
  };

  for (const record of records) {
    summary.totalPromptTokens += record.promptTokens;
    summary.totalCompletionTokens += record.completionTokens;
    summary.totalCostUSD += record.costUSD;
    summary.breakdown[record.provider] += 1;
  }

  return summary;
}
