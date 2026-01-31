# Aurora Career Guide 🚀

An AI-powered career guidance platform featuring **AURORA** - your intelligent career companion that helps with career exploration, application management, and onboarding support.

## ✨ Features

- 🤖 **AI-Powered Career Agent** - AURORA uses advanced AI models to provide personalized career guidance
- 🎯 **Career Exploration** - Tailored pathways for Students, Interns, and Professionals
- 📝 **Application Tracking** - Manage job applications with intelligent insights
- 🚀 **Onboarding Support** - Get ready for your new role with guided preparation
- 💬 **Real-time Chat** - Interactive conversations with AURORA
- 🎨 **Modern UI** - Built with React, TypeScript, and Shadcn/UI
- 🔒 **Secure** - API keys stored as environment variables
- 📱 **Responsive** - Works seamlessly on all devices

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Shadcn/UI
- **Routing**: React Router v6
- **Build Tool**: Vite
- **AI Integration**: OpenRouter / Groq / OpenAI
- **State Management**: React Hooks + TanStack Query
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Free API key from [OpenRouter](https://openrouter.ai/keys) (recommended)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd aurora-career-guide

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Add your API key to .env.local
# VITE_OPENROUTER_API_KEY=sk-or-v1-your-key-here

# Start development server
npm run dev
```

Visit `http://localhost:8080` to see the app!

## 🔑 AI Configuration

### Option 1: OpenRouter (Recommended - Free)

**Why OpenRouter?**
- ✅ Free tier with no credit card required
- ✅ Access to 100+ AI models (Llama, Gemma, Mistral, etc.)
- ✅ No rate limits on free models
- ✅ Simple setup

**Setup:**
1. Get free API key: https://openrouter.ai/keys
2. Add to `.env.local`:
   ```env
   VITE_AI_PROVIDER=openrouter
   VITE_OPENROUTER_API_KEY=sk-or-v1-your-key-here
   VITE_AI_MODEL=meta-llama/llama-3.1-8b-instruct:free
   ```

### Option 2: Groq (Alternative - Free & Fast)

**Setup:**
1. Get free API key: https://console.groq.com/keys
2. Add to `.env.local`:
   ```env
   VITE_AI_PROVIDER=groq
   VITE_GROQ_API_KEY=gsk_your-key-here
   VITE_AI_MODEL=llama-3.1-8b-instant
   ```

### Option 3: OpenAI (Paid)

**Setup:**
1. Get API key: https://platform.openai.com/api-keys
2. Add to `.env.local`:
   ```env
   VITE_AI_PROVIDER=openai
   VITE_OPENAI_API_KEY=sk-your-key-here
   VITE_AI_MODEL=gpt-3.5-turbo
   ```

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
```

## 🌐 Deployment to Vercel

### Quick Deploy

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Deploy"

3. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add your API keys:
     - `VITE_AI_PROVIDER` = `openrouter`
     - `VITE_OPENROUTER_API_KEY` = `your-key`
     - `VITE_AI_MODEL` = `meta-llama/llama-3.1-8b-instruct:free`
   - Click "Redeploy"

### Detailed Guide

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment instructions.

## 🏗️ Project Structure

```
aurora-career-guide/
├── src/
│   ├── components/
│   │   ├── aurora/          # AURORA AI chat component
│   │   ├── layout/          # Layout components
│   │   └── ui/              # Shadcn UI components
│   ├── pages/               # Route pages
│   ├── lib/
│   │   ├── ai-config.ts     # AI provider configuration
│   │   ├── ai-service.ts    # AI service integration
│   │   └── utils.ts         # Utility functions
│   ├── data/                # Mock data
│   └── hooks/               # Custom React hooks
├── public/                  # Static assets
├── .env.example             # Environment template
├── .env.local               # Your local environment (git-ignored)
├── vercel.json              # Vercel configuration
└── DEPLOYMENT.md            # Deployment guide
```

## 🎯 Key Features Explained

### AURORA AI Agent

AURORA is powered by open-source LLMs and provides:
- Career exploration guidance
- Application tracking insights
- Interview preparation tips
- Onboarding support
- Personalized career advice

### Career Pathways

- **Student Path**: Focus on learning and skill development
- **Intern/Job Seeker Path**: Application strategies and interview prep
- **Professional Path**: Career advancement and skill growth

### Application Management

Track your applications with:
- Status tracking (Pending, Accepted, Rejected)
- Timeline visualization
- Next steps recommendations
- Progress monitoring

## 🔒 Security

- API keys stored as environment variables
- No sensitive data in client code
- HTTPS-only API communication
- Secure headers configured in Vercel

## 🐛 Troubleshooting

### "API key not configured" error
- Ensure `.env.local` exists with valid API keys
- Restart dev server after adding environment variables
- Check variable names match exactly (case-sensitive)

### Build errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### TypeScript errors
```bash
# Regenerate types
npm run build
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- UI components from [Shadcn/UI](https://ui.shadcn.com/)
- AI powered by [OpenRouter](https://openrouter.ai/)
- Deployed on [Vercel](https://vercel.com/)

## 📞 Support

For issues or questions:
1. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
2. Review error messages in browser console
3. Verify environment variables are set correctly
4. Check API provider status pages

---

**Made with ❤️ for career seekers everywhere**
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
