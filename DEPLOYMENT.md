# Aurora Career Guide - Vercel Deployment Guide

## Quick Start

1. **Install Vercel CLI** (optional)
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel**
   - Push your code to GitHub
   - Go to [vercel.com](https://vercel.com) and import your repository
   - Or use CLI: `vercel --prod`

## Environment Variables Setup

After deployment, add these environment variables in Vercel Dashboard:

### Required Variables

1. **VITE_AI_PROVIDER** 
   - Value: `openrouter` (recommended) or `groq` or `openai`

2. **VITE_OPENROUTER_API_KEY** (Recommended - Free tier available)
   - Get your free key: https://openrouter.ai/keys
   - Free models available with no credit card required
   - Value: `sk-or-v1-...`

3. **VITE_AI_MODEL**
   - For OpenRouter free tier: `meta-llama/llama-3.1-8b-instruct:free`
   - Other free options:
     - `google/gemma-2-9b-it:free`
     - `mistralai/mistral-7b-instruct:free`
     - `microsoft/phi-3-mini-128k-instruct:free`

### Optional Variables

4. **VITE_GROQ_API_KEY** (Alternative - Free tier available)
   - Get your free key: https://console.groq.com/keys
   - Fast inference with free tier
   - Value: `gsk_...`

5. **VITE_OPENAI_API_KEY** (Alternative - Paid)
   - Get your key: https://platform.openai.com/api-keys
   - Requires payment setup
   - Value: `sk-...`

6. **VITE_APP_NAME**
   - Value: `Aurora Career Guide`

7. **VITE_APP_URL**
   - Value: Your Vercel URL (e.g., `https://your-app.vercel.app`)

## How to Add Environment Variables in Vercel

1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable:
   - **Key**: Variable name (e.g., `VITE_AI_PROVIDER`)
   - **Value**: Your actual value
   - **Environments**: Select Production, Preview, and Development
4. Click **Save**
5. **Redeploy** your application for changes to take effect

## Recommended: OpenRouter (Free & Open Source)

OpenRouter is the easiest option for deployment:

✅ **Free tier with no credit card**
✅ **Access to 100+ models including Llama, Gemma, Mistral**
✅ **Simple API compatible with OpenAI format**
✅ **No rate limits on free models**

### Steps to use OpenRouter:

1. Go to https://openrouter.ai/keys
2. Sign up (free, no credit card needed)
3. Generate an API key
4. Add to Vercel:
   - `VITE_AI_PROVIDER` = `openrouter`
   - `VITE_OPENROUTER_API_KEY` = `sk-or-v1-...`
   - `VITE_AI_MODEL` = `meta-llama/llama-3.1-8b-instruct:free`

## Alternative: Groq (Free & Fast)

Groq offers extremely fast inference:

1. Go to https://console.groq.com/keys
2. Sign up and generate API key
3. Add to Vercel:
   - `VITE_AI_PROVIDER` = `groq`
   - `VITE_GROQ_API_KEY` = `gsk_...`
   - `VITE_AI_MODEL` = `llama-3.1-8b-instant`

## Testing Locally Before Deployment

```bash
# Copy environment template
cp .env.example .env.local

# Add your API keys to .env.local
# Then test locally
npm run dev
```

## Troubleshooting

### "API key not configured" error
- Make sure you've added the environment variables in Vercel
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)

### "Failed to fetch" error
- Verify your API key is valid
- Check the API provider's status page
- Ensure CORS is not blocking requests

### Build fails
- Check build logs in Vercel Dashboard
- Ensure all dependencies are in package.json
- Try building locally: `npm run build`

## Build & Deploy Commands

```bash
# Local build
npm run build

# Preview build locally
npm run preview

# Deploy with Vercel CLI
vercel --prod
```

## Performance Tips

1. **Use free models for testing**, upgrade if needed
2. **Monitor API usage** in your provider dashboard
3. **Cache responses** for common queries (future improvement)
4. **Set appropriate rate limits** to avoid abuse

## Security Notes

- ✅ API keys are stored as environment variables (secure)
- ✅ Keys are not exposed in client code
- ✅ All API calls go through secure HTTPS
- ⚠️ Consider adding rate limiting for production
- ⚠️ Monitor API usage to prevent abuse

## Support

For issues:
- Check Vercel deployment logs
- Verify environment variables are set correctly
- Test API keys directly using curl or Postman
- Check your provider's documentation

## Free Tier Limits

### OpenRouter Free Models
- No rate limits
- Community-supported
- Best for development and testing

### Groq Free Tier
- 14,400 requests/day per model
- 30 requests/minute per model
- Excellent for production

Choose based on your needs!
