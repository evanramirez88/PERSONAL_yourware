import axios from 'axios';
import type { AIProvider, GenerationRequest, GenerationResult, ProviderName } from '@/types';

const PROVIDERS: Record<ProviderName, AIProvider> = {
  openai: {
    name: 'openai',
    label: 'OpenAI',
    model: 'gpt-4o-mini',
    endpoint: 'https://api.openai.com/v1/chat/completions'
  },
  anthropic: {
    name: 'anthropic',
    label: 'Anthropic',
    model: 'claude-3-sonnet-20240229',
    endpoint: 'https://api.anthropic.com/v1/messages'
  },
  google: {
    name: 'google',
    label: 'Google Gemini',
    model: 'gemini-1.5-pro-latest',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent'
  },
  openrouter: {
    name: 'openrouter',
    label: 'OpenRouter',
    model: 'anthropic/claude-3-sonnet',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions'
  },
  deepseek: {
    name: 'deepseek',
    label: 'DeepSeek',
    model: 'deepseek-coder',
    endpoint: 'https://api.deepseek.com/v1/chat/completions'
  }
};

const PROVIDER_HEADERS: Partial<Record<ProviderName, Record<string, string>>> = {
  anthropic: {
    'x-api-key': '',
    'anthropic-version': '2023-06-01'
  },
  google: {
    'content-type': 'application/json'
  }
};

export class AIService {
  getProvider(provider: ProviderName): AIProvider {
    return PROVIDERS[provider];
  }

  async generateCode({ prompt, provider, language }: GenerationRequest, apiKey: string): Promise<GenerationResult> {
    const selected = this.getProvider(provider);
    const headers: Record<string, string> = {
      'content-type': 'application/json'
    };

    const providerHeaders = PROVIDER_HEADERS[provider];
    if (providerHeaders) {
      Object.assign(headers, providerHeaders);
    }

    if (provider === 'anthropic') {
      headers['x-api-key'] = apiKey;
    } else if (provider === 'google') {
      // google uses key as query param, handled below
    } else {
      headers.authorization = `Bearer ${apiKey}`;
    }

    const payload = this.buildPayload(prompt, selected.model, language, provider);

    const endpoint =
      provider === 'google'
        ? selected.endpoint.replace('{model}', selected.model) + `?key=${apiKey}`
        : selected.endpoint;

    const response = await axios.post(endpoint, payload, { headers });
    const content = this.parseResponseContent(response.data, provider);

    return {
      provider,
      model: selected.model,
      content,
      createdAt: new Date().toISOString()
    };
  }

  async *streamResponse(_prompt: string): AsyncGenerator<string, void, unknown> {
    yield 'Streaming is not yet implemented in this demo build.';
  }

  async validateApiKey(provider: ProviderName, key: string): Promise<boolean> {
    if (!key) return false;
    if (provider === 'openai') {
      return key.startsWith('sk-');
    }
    return key.length > 10;
  }

  private buildPayload(prompt: string, model: string, language: string, provider: ProviderName) {
    if (provider === 'anthropic') {
      return {
        model,
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `You are a code generation assistant. Return ${language} code.\n${prompt}`
          }
        ]
      };
    }

    if (provider === 'google') {
      return {
        contents: [
          {
            parts: [
              {
                text: `You are a code generation assistant. Return ${language} code.\n${prompt}`
              }
            ]
          }
        ]
      };
    }

    return {
      model,
      messages: [
        {
          role: 'system',
          content: 'You are a code generation assistant focused on building complete answers.'
        },
        {
          role: 'user',
          content: `Return ${language} code.\n${prompt}`
        }
      ],
      temperature: 0.2
    };
  }

  private parseResponseContent(data: unknown, provider: ProviderName): string {
    if (!data) return '';
    if (provider === 'anthropic') {
      const cast = data as { content?: Array<{ text?: string }>; }; // simplified typing
      return cast.content?.map((item) => item.text).join('\n') ?? '';
    }
    if (provider === 'google') {
      const cast = data as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }>; } }>; };
      return cast.candidates?.[0]?.content?.parts?.map((part) => part.text).join('\n') ?? '';
    }
    const cast = data as { choices?: Array<{ message?: { content?: string } }>; };
    return cast.choices?.[0]?.message?.content ?? '';
  }
}

const aiService = new AIService();
export default aiService;
