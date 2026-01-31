# 🚀 Quick Start - Add AI to AURORA

## What I Need From You (2 minutes):

### Get a FREE API Key:

**Go to: https://openrouter.ai/keys**
- Click "Sign Up" (no credit card needed)
- Click "Create Key"
- Copy your key (starts with `sk-or-v1-...`)

---

## Setup (30 seconds):

1. **Open the file:** `.env.local`

2. **Add your API key:**
   ```env
   VITE_OPENROUTER_API_KEY=sk-or-v1-paste-your-key-here
   ```

3. **Save the file**

4. **Restart the server:**
   - Stop: Press `Ctrl+C` in terminal
   - Start: `npm run dev`

5. **Test it:**
   - Open http://localhost:8080
   - Click the chat bubble (bottom right)
   - Ask AURORA: "Help me find a career path"
   - Get AI response! ✨

---

## That's It!

✅ AI is already integrated in the code
✅ Just needs your API key
✅ 100% free tier available
✅ No credit card required

---

## For Vercel Deployment:

After testing locally:

1. Push to GitHub: `git push`
2. Import to Vercel: https://vercel.com/new
3. Add same API key in Vercel Settings → Environment Variables
4. Done! 🎉

---

## Free Models Available:
- `meta-llama/llama-3.1-8b-instruct:free` (default, best)
- `google/gemma-2-9b-it:free`
- `mistralai/mistral-7b-instruct:free`

No rate limits. No costs. Just add your key and chat!
