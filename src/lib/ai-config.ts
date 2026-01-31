// AI Service Configuration
export const AI_CONFIG = {
  provider: import.meta.env.VITE_AI_PROVIDER || 'groq',
  openrouterApiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
  groqApiKey: import.meta.env.VITE_GROQ_API_KEY,
  openaiApiKey: import.meta.env.VITE_OPENAI_API_KEY,
  model: import.meta.env.VITE_AI_MODEL || 'llama-3.3-70b-versatile',
  endpoint: import.meta.env.VITE_AI_ENDPOINT,
};

// Provider-specific configurations
export const PROVIDER_ENDPOINTS = {
  openrouter: 'https://openrouter.ai/api/v1',
  groq: 'https://api.groq.com/openai/v1',
  openai: 'https://api.openai.com/v1',
};

// Available models by provider
export const AVAILABLE_MODELS = {
  groq: [
    'llama-3.3-70b-versatile',    // Best quality
    'llama-3.1-8b-instant',        // Fastest
    'mixtral-8x7b-32768',          // Good balance
    'gemma2-9b-it',                // Google's model
  ],
  openrouter: [
    'google/gemini-2.0-flash-exp:free',
    'mistralai/mistral-small-3.1-24b-instruct:free',
    'meta-llama/llama-4-scout:free',
  ],
};
