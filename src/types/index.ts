export type ProviderName = 'openai' | 'anthropic' | 'google' | 'openrouter' | 'deepseek';

export interface AIProvider {
  name: ProviderName;
  label: string;
  endpoint: string;
  model: string;
  apiKey?: string;
}

export interface GenerationOptions {
  prompt: string;
  provider: ProviderName;
  temperature?: number;
  maxTokens?: number;
}

export interface StreamChunk {
  id: string;
  value: string;
  done?: boolean;
}

export interface UsageRecord {
  id: string;
  provider: ProviderName;
  timestamp: string;
  promptTokens: number;
  completionTokens: number;
  costUSD: number;
}

export interface UsageSummary {
  totalCalls: number;
  totalPromptTokens: number;
  totalCompletionTokens: number;
  totalCostUSD: number;
  breakdown: Record<ProviderName, number>;
}

export interface VersionStatusEntry {
  path: string;
  status: 'modified' | 'added' | 'deleted' | 'untracked';
}

export interface CommitPayload {
  message: string;
  files: VersionStatusEntry[];
}

export interface SourceFile {
  path: string;
  content: string;
  language?: string;
}

export interface StoredApiKey {
  provider: ProviderName;
  encryptedKey: string;
  createdAt: string;
}
