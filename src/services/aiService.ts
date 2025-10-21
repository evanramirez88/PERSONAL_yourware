import axios from 'axios';
import type { GenerationOptions, ProviderName } from '@/types';
import { getApiKey } from './apiKeyManager';

interface ProviderConfig {
  name: ProviderName;
  label: string;
  endpoint: string;
  defaultModel: string;
  apiKeyHeader: string;
  stream?: boolean;
}

const PROVIDERS: Record<ProviderName, ProviderConfig> = {
  openai: {
    name: 'openai',
    label: 'OpenAI',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    defaultModel: 'gpt-4o-mini',
    apiKeyHeader: 'Authorization'
  },
  anthropic: {
    name: 'anthropic',
    label: 'Anthropic',
    endpoint: 'https://api.anthropic.com/v1/messages',
    defaultModel: 'claude-3-haiku-20240307',
    apiKeyHeader: 'x-api-key'
  },
  google: {
    name: 'google',
    label: 'Google Gemini',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    defaultModel: 'gemini-pro',
    apiKeyHeader: 'x-goog-api-key'
  },
  openrouter: {
    name: 'openrouter',
    label: 'OpenRouter',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    defaultModel: 'anthropic/claude-3-haiku',
    apiKeyHeader: 'Authorization'
  },
  deepseek: {
    name: 'deepseek',
    label: 'DeepSeek',
    endpoint: 'https://api.deepseek.com/chat/completions',
    defaultModel: 'deepseek-coder',
    apiKeyHeader: 'Authorization'
  }
};

export class AIService {
  private resolveProvider(provider: ProviderName): ProviderConfig {
    return PROVIDERS[provider];
  }

  async generateCode(options: GenerationOptions): Promise<string> {
    const provider = this.resolveProvider(options.provider);
    const apiKey = getApiKey(provider.name);

    if (!apiKey) {
      throw new Error(`No API key configured for ${provider.label}`);
    }

    try {
      switch (provider.name) {
        case 'openai':
        case 'openrouter':
        case 'deepseek': {
          const response = await axios.post(
            provider.endpoint,
            {
              model: provider.defaultModel,
              messages: [
                {
                  role: 'system',
                  content: 'You are a helpful coding assistant.'
                },
                {
                  role: 'user',
                  content: options.prompt
                }
              ],
              temperature: options.temperature ?? 0.2,
              max_tokens: options.maxTokens ?? 1024
            },
            {
              headers: {
                'Content-Type': 'application/json',
                [provider.apiKeyHeader]: provider.apiKeyHeader === 'Authorization' ? `Bearer ${apiKey}` : apiKey
              }
            }
          );

          const completion = response.data?.choices?.[0]?.message?.content;
          if (typeof completion === 'string') {
            return completion;
          }
          if (Array.isArray(completion)) {
            return completion.map((part: { text?: string }) => part.text ?? '').join('\n');
          }
          return JSON.stringify(completion, null, 2);
        }
        case 'anthropic': {
          const response = await axios.post(
            provider.endpoint,
            {
              model: provider.defaultModel,
              max_tokens: options.maxTokens ?? 1024,
              temperature: options.temperature ?? 0.2,
              messages: [
                {
                  role: 'user',
                  content: options.prompt
                }
              ]
            },
            {
              headers: {
                'Content-Type': 'application/json',
                [provider.apiKeyHeader]: apiKey,
                'anthropic-version': '2023-06-01'
              }
            }
          );
          return response.data?.content?.[0]?.text ?? 'No content returned.';
        }
        case 'google': {
          const response = await axios.post(
            `${provider.endpoint}?key=${apiKey}`,
            {
              contents: [
                {
                  role: 'user',
                  parts: [{ text: options.prompt }]
                }
              ]
            }
          );
          return response.data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? '').join('\n') ?? 'No content returned.';
        }
        default:
          return 'Provider not yet implemented.';
      }
    } catch (error) {
      console.warn('Failed to generate code from provider, returning fallback message.', error);
      return 'Unable to reach provider. Please verify your API key and network connectivity.';
    }
  }

  async *streamResponse(options: GenerationOptions): AsyncGenerator<string, void, unknown> {
    const fallback = await this.generateCode(options);
    const chunks = fallback.match(/.{1,120}/g) ?? [fallback];
    for (const chunk of chunks) {
      yield chunk;
    }
  }

  async validateApiKey(providerName: ProviderName, key: string): Promise<boolean> {
    const provider = this.resolveProvider(providerName);
    if (!key) return false;

    try {
      if (provider.name === 'google') {
        const response = await axios.post(
          `${provider.endpoint}?key=${key}`,
          {
            contents: [
              {
                role: 'user',
                parts: [{ text: 'ping' }]
              }
            ]
          }
        );
        return Boolean(response.data);
      }

      const response = await axios.post(
        provider.endpoint,
        {
          model: provider.defaultModel,
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: 'ping' }
          ],
          max_tokens: 1
        },
        {
          headers: {
            'Content-Type': 'application/json',
            [provider.apiKeyHeader]: provider.apiKeyHeader === 'Authorization' ? `Bearer ${key}` : key,
            ...(provider.name === 'anthropic' ? { 'anthropic-version': '2023-06-01' } : {})
          }
        }
      );

      return response.status === 200;
    } catch (error) {
      console.warn('Key validation failed', error);
      return false;
    }
  }
}

export const aiService = new AIService();
export const PROVIDER_LIST = Object.values(PROVIDERS);
