import { AI_CONFIG, PROVIDER_ENDPOINTS } from './ai-config';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIServiceOptions {
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  timeout?: number; // Timeout in milliseconds
}

class AIService {
  private getApiKey(): string {
    const { provider, openrouterApiKey, groqApiKey, openaiApiKey } = AI_CONFIG;

    switch (provider) {
      case 'openrouter':
        return openrouterApiKey || '';
      case 'groq':
        return groqApiKey || '';
      case 'openai':
        return openaiApiKey || '';
      default:
        return '';
    }
  }

  private getEndpoint(): string {
    return AI_CONFIG.endpoint || PROVIDER_ENDPOINTS[AI_CONFIG.provider as keyof typeof PROVIDER_ENDPOINTS];
  }

  private getHeaders(): HeadersInit {
    const apiKey = this.getApiKey();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (AI_CONFIG.provider === 'openrouter') {
      headers['Authorization'] = `Bearer ${apiKey}`;
      headers['HTTP-Referer'] = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8081';
      headers['X-Title'] = 'Aurora Career Guide';
    } else {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    return headers;
  }

  /**
   * Fetch with timeout
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number = 30000
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async chat(
    messages: ChatMessage[],
    options: AIServiceOptions = {}
  ): Promise<string> {
    const apiKey = this.getApiKey();

    if (!apiKey) {
      console.error('No API key found. Provider:', AI_CONFIG.provider);
      throw new Error(`API key not configured. Please add your API key to .env.local`);
    }

    const endpoint = this.getEndpoint();
    const { temperature = 0.7, maxTokens = 1000, timeout = 30000 } = options;

    console.log('AI Service: Starting request to', endpoint);
    console.log('AI Service: Using model', AI_CONFIG.model);

    try {
      const response = await this.fetchWithTimeout(
        `${endpoint}/chat/completions`,
        {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify({
            model: AI_CONFIG.model,
            messages,
            temperature,
            max_tokens: maxTokens,
            stream: false,
          }),
        },
        timeout
      );

      console.log('AI Service: Response status', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('AI Service: Error response', errorData);

        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your .env.local file.');
        }
        if (response.status === 429) {
          throw new Error('Rate limited. Please wait a moment and try again.');
        }
        if (response.status === 503) {
          throw new Error('AI service is temporarily unavailable. Please try again.');
        }

        throw new Error(
          `AI API Error: ${response.status} - ${errorData.error?.message || response.statusText}`
        );
      }

      const data = await response.json();
      console.log('AI Service: Response received successfully');

      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        console.warn('AI Service: No content in response', data);
        return 'I apologize, but I could not generate a response. Please try again.';
      }

      return content;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error('AI Service: Request timed out after', timeout, 'ms');
        throw new Error('Request timed out. The AI service is taking too long to respond.');
      }

      console.error('AI Service Error:', error);
      throw error;
    }
  }

  async *chatStream(
    messages: ChatMessage[],
    options: AIServiceOptions = {}
  ): AsyncGenerator<string, void, unknown> {
    const apiKey = this.getApiKey();

    if (!apiKey) {
      throw new Error(`API key not configured for provider: ${AI_CONFIG.provider}`);
    }

    const endpoint = this.getEndpoint();
    const { temperature = 0.7, maxTokens = 1000 } = options;

    try {
      const response = await fetch(`${endpoint}/chat/completions`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          model: AI_CONFIG.model,
          messages,
          temperature,
          max_tokens: maxTokens,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `AI API Error: ${response.status} - ${errorData.error?.message || response.statusText}`
        );
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content;
              if (content) {
                yield content;
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('AI Stream Error:', error);
      throw error;
    }
  }

  // Career-specific helper
  async getCareerAdvice(
    userMessage: string,
    context: {
      stage?: string;
      careerGoals?: string;
      currentSituation?: string;
    } = {}
  ): Promise<string> {
    const systemMessage: ChatMessage = {
      role: 'system',
      content: `You are AURORA, an AI career guide assistant. You help users with:
- Career exploration and planning
- Job application strategies
- Interview preparation
- Professional development
- Onboarding support

User context:
- Stage: ${context.stage || 'Unknown'}
- Career Goals: ${context.careerGoals || 'Not specified'}
- Current Situation: ${context.currentSituation || 'Not specified'}

Provide helpful, actionable advice in a friendly and professional tone. Keep responses concise but informative.`,
    };

    const userMsg: ChatMessage = {
      role: 'user',
      content: userMessage,
    };

    return this.chat([systemMessage, userMsg], {
      temperature: 0.7,
      maxTokens: 500,
    });
  }

  /**
   * Test the API connection
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.chat(
        [{ role: 'user', content: 'Say "Hello, I am working!" in exactly those words.' }],
        { maxTokens: 50, timeout: 10000 }
      );
      return { success: true, message: response };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }
}

export const aiService = new AIService();
