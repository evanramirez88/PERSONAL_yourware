export type ProviderName = 'openai' | 'anthropic' | 'google' | 'openrouter' | 'deepseek';

export interface AIProvider {
  name: ProviderName;
  label: string;
  model: string;
  endpoint: string;
}

export interface ProviderKey {
  provider: ProviderName;
  apiKey: string;
  createdAt: string;
}

export interface GenerationRequest {
  prompt: string;
  language: string;
  provider: ProviderName;
}

export interface GenerationResult {
  provider: ProviderName;
  model: string;
  content: string;
  createdAt: string;
}

export interface UsageMetric {
  provider: ProviderName;
  totalCalls: number;
  totalTokens: number;
  lastUsed: string;
}

export interface GitStatusEntry {
  path: string;
  status: 'added' | 'modified' | 'deleted' | 'untracked';
}

export interface SourceFileDescriptor {
  path: string;
  content: string;
}
