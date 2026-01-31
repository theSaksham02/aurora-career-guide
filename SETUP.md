# Quick Setup Guide 🚀

## For Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
```bash
# Copy the template
cp .env.example .env.local
```

### 3. Get Your Free API Key

**Option A: OpenRouter (Recommended)**
1. Visit: https://openrouter.ai/keys
2. Sign up (no credit card needed)
3. Click "Create Key"
4. Copy your key (starts with `sk-or-v1-...`)

**Option B: Groq (Alternative)**
1. Visit: https://console.groq.com/keys
2. Sign up
3. Create API key
4. Copy your key (starts with `gsk_...`)

### 4. Add API Key to .env.local

Open `.env.local` and add your key:

```env
# For OpenRouter
VITE_AI_PROVIDER=openrouter
VITE_OPENROUTER_API_KEY=sk-or-v1-paste-your-key-here
VITE_AI_MODEL=meta-llama/llama-3.1-8b-instruct:free

# OR for Groq
VITE_AI_PROVIDER=groq
VITE_GROQ_API_KEY=gsk_paste-your-key-here
VITE_AI_MODEL=llama-3.1-8b-instant
```

### 5. Start Development Server
```bash
npm run dev
```

### 6. Test AURORA
- Open http://localhost:8080
- Click the chat bubble in bottom right
- Try asking: "Help me explore career options"

## For Vercel Deployment

### Method 1: Vercel Dashboard (Easiest)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Click "Deploy"

3. **Add Environment Variables**
   - After deployment, go to: Settings → Environment Variables
   - Add these variables:

   | Key | Value |
   |-----|-------|
   | `VITE_AI_PROVIDER` | `openrouter` |
   | `VITE_OPENROUTER_API_KEY` | `sk-or-v1-your-key` |
   | `VITE_AI_MODEL` | `meta-llama/llama-3.1-8b-instruct:free` |
   | `VITE_APP_NAME` | `Aurora Career Guide` |

4. **Redeploy**
   - Go to Deployments tab
   - Click ⋯ menu on latest deployment
   - Click "Redeploy"

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Add environment variables via CLI
vercel env add VITE_AI_PROVIDER
# Enter: openrouter

vercel env add VITE_OPENROUTER_API_KEY
# Enter: your-api-key

vercel env add VITE_AI_MODEL
# Enter: meta-llama/llama-3.1-8b-instruct:free

# Redeploy with env vars
vercel --prod
```

## Free AI Models

### OpenRouter Free Models
- `meta-llama/llama-3.1-8b-instruct:free` ⭐ (Recommended)
- `google/gemma-2-9b-it:free`
- `mistralai/mistral-7b-instruct:free`
- `microsoft/phi-3-mini-128k-instruct:free`

### Groq Free Models
- `llama-3.1-8b-instant` ⭐ (Very fast)
- `llama-3.1-70b-versatile`
- `mixtral-8x7b-32768`

## Verify Everything Works

### Local Testing
1. Start dev server: `npm run dev`
2. Open chat widget
3. Send a message
4. Should get AI response

### Production Testing
1. Visit your Vercel URL
2. Open chat widget
3. Test with a question
4. Check browser console for errors

## Common Issues & Fixes

### Issue: "API key not configured"
**Fix:** 
- Check `.env.local` has correct variable names
- Restart dev server: `npm run dev`
- For Vercel: Add env vars and redeploy

### Issue: "Failed to fetch"
**Fix:**
- Verify API key is valid
- Check provider status page
- Try a different provider

### Issue: Build fails
**Fix:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: TypeScript errors
**Fix:**
- TypeScript config already fixed
- Run: `npm run lint`

## What's Been Fixed

✅ TypeScript configuration (removed deprecated baseUrl)
✅ Environment variable setup
✅ AI service integration with OpenRouter/Groq/OpenAI
✅ AURORA chat component with real AI
✅ Vercel deployment configuration
✅ Project metadata and naming
✅ Security headers
✅ Error handling and loading states

## Next Steps

1. ✅ Get API key (5 minutes)
2. ✅ Test locally (2 minutes)
3. ✅ Deploy to Vercel (5 minutes)
4. 🎉 Share your Aurora Career Guide!

## Need Help?

- 📖 Read [README.md](./README.md) for full documentation
- 🚀 Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment guide
- 🔍 Review browser console for error messages
- ✉️ Check environment variables are set correctly

---

**You're all set! 🎉 Time to help people with their careers!**
