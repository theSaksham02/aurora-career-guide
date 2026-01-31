# API Setup Guide

## Get Your Free AI API Key (2 minutes)

### OpenRouter (Recommended)
1. Go to: https://openrouter.ai/keys
2. Sign up (no credit card needed)
3. Create a new key
4. Copy your key (starts with `sk-or-v1-...`)

### Add to `.env.local`

```env
VITE_OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

### Test Locally

```bash
npm run dev
```

Open http://localhost:8080, click chat bubble, and ask AURORA a question!

---

## Alternative Providers

### Groq (Fast & Free)
- https://console.groq.com/keys
- No credit card needed
- Very fast inference

```env
VITE_AI_PROVIDER=groq
VITE_GROQ_API_KEY=gsk_your-key-here
```

### OpenAI (Paid)
- https://platform.openai.com/api-keys

```env
VITE_AI_PROVIDER=openai
VITE_OPENAI_API_KEY=sk_your-key-here
```

---

## For Vercel Deployment

1. Push to GitHub
2. Import on Vercel
3. Add same API key in Settings → Environment Variables
4. Redeploy

Done! 🚀
