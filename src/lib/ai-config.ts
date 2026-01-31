// AI Service Configuration
export const AI_CONFIG = {
  provider: import.meta.env.VITE_AI_PROVIDER || 'openrouter',
  openrouterApiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
  groqApiKey: import.meta.env.VITE_GROQ_API_KEY,
  openaiApiKey: import.meta.env.VITE_OPENAI_API_KEY,
  model: import.meta.env.VITE_AI_MODEL || 'google/gemini-2.0-flash-exp:free',
  endpoint: import.meta.env.VITE_AI_ENDPOINT,
};

// Provider-specific configurations
export const PROVIDER_ENDPOINTS = {
  openrouter: 'https://openrouter.ai/api/v1',
  groq: 'https://api.groq.com/openai/v1',
  openai: 'https://api.openai.com/v1',
};

// Free models available on OpenRouter (January 2026)
export const FREE_MODELS = {
  openrouter: [
    'google/gemini-2.0-flash-exp:free',
    'google/gemini-exp-1206:free',
    'mistralai/mistral-small-3.1-24b-instruct:free',
    'meta-llama/llama-4-scout:free',
    'nvidia/llama-3.1-nemotron-70b-instruct:free',
  ],
  groq: [
    'llama-3.3-70b-versatile',
    'mixtral-8x7b-32768',
    'gemma2-9b-it',
  ],
};
