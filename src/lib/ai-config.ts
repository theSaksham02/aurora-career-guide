// AI Service Configuration
export const AI_CONFIG = {
  provider: import.meta.env.VITE_AI_PROVIDER || 'openrouter',
  openrouterApiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
  groqApiKey: import.meta.env.VITE_GROQ_API_KEY,
  openaiApiKey: import.meta.env.VITE_OPENAI_API_KEY,
  model: import.meta.env.VITE_AI_MODEL || 'meta-llama/llama-3.1-8b-instruct:free',
  endpoint: import.meta.env.VITE_AI_ENDPOINT,
};

// Provider-specific configurations
export const PROVIDER_ENDPOINTS = {
  openrouter: 'https://openrouter.ai/api/v1',
  groq: 'https://api.groq.com/openai/v1',
  openai: 'https://api.openai.com/v1',
};

// Free models available on OpenRouter
export const FREE_MODELS = {
  openrouter: [
    'meta-llama/llama-3.1-8b-instruct:free',
    'google/gemma-2-9b-it:free',
    'mistralai/mistral-7b-instruct:free',
    'microsoft/phi-3-mini-128k-instruct:free',
  ],
  groq: [
    'llama-3.1-8b-instant',
    'llama-3.1-70b-versatile',
    'mixtral-8x7b-32768',
  ],
};
