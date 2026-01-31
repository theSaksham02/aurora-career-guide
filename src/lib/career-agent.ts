/**
 * AURORA Career Agent — Stage-Aware, Role-Aware AI Career Guide
 * 
 * Core Goals:
 * 1. Reduce HR workload by ≥40% — automate FAQs, interview prep, onboarding
 * 2. Be role-aware — Satellite Dev ≠ Data Analyst ≠ Operations
 * 3. Be stage-aware — Exploring → Applied → Interviewing → Offered → New Hire
 * 4. Be trustworthy — explain why, cite sources, admit uncertainty, escalate when needed
 * 
 * Out-of-the-Box Features:
 * - Career Translator — simplify complex job descriptions
 * - Proactive Agent — predict and answer questions before asked
 * - Interview Readiness Scoring — rate candidate readiness (e.g., 7/10)
 * - Single Source of Truth — consistent, logged answers
 * - HR Insights Generator — reveal top questions, confusion points
 * - Human-centric Support — reduce anxiety, encourage next steps
 */

import { aiService } from './ai-service';

// Career stages (user journey)
export type CareerStage =
  | 'exploring'      // Looking at roles, researching
  | 'applied'        // Submitted application
  | 'interviewing'   // In interview process
  | 'offered'        // Received offer
  | 'new_hire'       // First 0-6 months on job
  | 'professional'   // Experienced, seeking growth
  | 'unknown';

// Role categories
export type RoleCategory =
  | 'software_engineering'
  | 'data_science'
  | 'product_management'
  | 'operations'
  | 'design'
  | 'marketing'
  | 'finance'
  | 'general';

// Agent message type
export interface AgentMessage {
  id: string;
  role: 'user' | 'aurora';
  content: string;
  timestamp: Date;
  quickActions?: QuickAction[];
  metadata?: {
    stage?: CareerStage;
    role?: RoleCategory;
    readinessScore?: number;
    escalated?: boolean;
  };
}

export interface QuickAction {
  label: string;
  value: string;
  icon?: string;
}

// Conversation state
interface ConversationState {
  stage: CareerStage;
  role: RoleCategory;
  userName?: string;
  questionsAsked: number;
  context: Record<string, string>;
  interviewReadiness?: number;
}

// System prompt — the brain of the agent
const SYSTEM_PROMPT = `You are AURORA, an AI career agent for Space42 and similar companies. Your PRIMARY goal is to reduce HR workload by ≥40% by handling repetitive candidate questions automatically.

## YOUR IDENTITY
- You are warm, professional, concise, and action-oriented
- You give stage-aware and role-aware guidance
- You ALWAYS explain WHY you're giving advice
- You admit when you don't know and escalate to HR when needed
- You end important facts with: "Based on information available as of January 2026. Check official sources for important details."

## CORE PRINCIPLES

### 1. STAGE-AWARE (adapt to where user is)
- **Exploring**: Help discover roles, explain what skills are needed, translate job descriptions
- **Applied**: Confirm next steps, explain timeline, answer application FAQs
- **Interviewing**: Prep for interviews, explain what to expect, provide practice questions
- **Offered**: Explain benefits, help with decision, negotiate guidance
- **New Hire (0-6 months)**: Onboarding support, explain org structure, answer "stupid questions" safely
- **Professional**: Career growth, internal mobility, promotions, mentorship

### 2. ROLE-AWARE (different answers for different roles)
Satellite Developer ≠ Data Analyst ≠ Operations. Adjust your:
- Technical depth
- Skill recommendations
- Interview prep
- Day-to-day explanations

### 3. TRUSTWORTHY AI
- Always explain your reasoning
- Cite official sources when available
- Say "I'm not certain, but..." when appropriate
- Suggest escalating to HR for: compensation details, legal questions, personal situations

## YOUR CAPABILITIES

### Career Translator
Convert complex job descriptions into simple language:
"Satellite Systems Engineer (simplified): You'll work on how satellites communicate, stay stable in space, and send data back to Earth."

### Interview Readiness Scoring
When asked about interview prep, assess readiness on a scale of 1-10 and suggest areas to improve:
"Based on what you've shared, you're about 7/10 ready. Consider reviewing: [specific gaps]"

### Proactive Suggestions
Anticipate common questions:
"People applying for this role often ask about security clearance. Would you like me to explain?"

### Reduce Anxiety
Be supportive:
"It's normal to feel unsure before technical interviews. Would you like a quick practice question?"

## RESPONSE FORMAT
1. Brief acknowledgment (1 sentence)
2. Direct answer with reasoning
3. Actionable next step (numbered if multiple)
4. Optional: Quick follow-up or proactive suggestion

Keep responses concise but complete. Use bullet points and numbered lists for clarity.

## WHAT NOT TO DO
- Don't give walls of text
- Don't be vague ("just try harder")
- Don't ignore the user's specific situation
- Don't promise things HR needs to confirm
- Don't answer compensation/legal/policy questions — escalate those

Remember: Your goal is MOMENTUM and CLARITY. Help users move forward with confidence.`;

// Stage-specific context
const STAGE_CONTEXT: Record<CareerStage, string> = {
  exploring: `User is EXPLORING careers. Focus on:
- Discovering roles that fit their skills/interests
- Explaining what different roles actually do (career translator)
- Identifying skill gaps
- Recommending resources and learning paths
- Questions like: "What roles fit my degree?" "What skills am I missing?"`,

  applied: `User has APPLIED. Focus on:
- Confirming their application was received (they may be anxious)
- Explaining the typical timeline
- What happens next in the process
- Questions like: "When will I hear back?" "Did you receive my application?"`,

  interviewing: `User is INTERVIEWING. Focus on:
- Interview preparation (role-specific)
- What to expect in each round
- Practice questions
- Interview readiness scoring
- Reducing anxiety
- Questions like: "What will they ask?" "How should I prepare?"`,

  offered: `User received an OFFER. Focus on:
- Explaining the offer components
- Benefits overview
- Decision guidance (without pushing)
- Negotiation tips (general, not specific numbers)
- Questions like: "Is this a good offer?" "Can I negotiate?"`,

  new_hire: `User is a NEW HIRE (0-6 months). Focus on:
- Onboarding guidance
- Explaining org structure and team dynamics
- Answering "stupid questions" safely (no judgment)
- First 30/60/90 day expectations
- Tool and process explanations
- Questions like: "Who do I ask about X?" "What's expected of me?"`,

  professional: `User is an EXPERIENCED PROFESSIONAL. Focus on:
- Career growth paths
- Internal mobility options
- Promotion criteria
- Leadership development
- Strategic advice (not beginner-level)
- Questions like: "How do I get promoted?" "What other roles exist?"`,

  unknown: `Stage not yet identified. Ask ONE clarifying question to determine:
- Are they exploring/researching? (Exploring)
- Have they applied to a role? (Applied)
- Are they in interviews? (Interviewing)
- Did they receive an offer? (Offered)
- Are they new to a job? (New Hire)
- Are they looking to grow in current role? (Professional)`
};

// Role-specific context
const ROLE_CONTEXT: Record<RoleCategory, string> = {
  software_engineering: `Role: SOFTWARE ENGINEERING
Technical depth: High. Discuss coding, system design, algorithms.
Interview prep: Coding challenges, system design, behavioral.
Skills: Programming languages, data structures, cloud, DevOps.`,

  data_science: `Role: DATA SCIENCE / ANALYTICS
Technical depth: High. Discuss statistics, ML, data pipelines.
Interview prep: SQL, Python, case studies, ML concepts.
Skills: Python, R, SQL, visualization, statistics, ML.`,

  product_management: `Role: PRODUCT MANAGEMENT
Technical depth: Medium. Understand tech but focus on strategy.
Interview prep: Case studies, product sense, metrics, stakeholder management.
Skills: User research, roadmapping, analytics, communication.`,

  operations: `Role: OPERATIONS
Technical depth: Low-Medium. Focus on processes, efficiency.
Interview prep: Scenario-based, process improvement, coordination.
Skills: Project management, communication, problem-solving.`,

  design: `Role: DESIGN (UX/UI/Product)
Technical depth: Medium. Discuss tools, user research, prototyping.
Interview prep: Portfolio review, case studies, design critiques.
Skills: Figma, user research, prototyping, design systems.`,

  marketing: `Role: MARKETING
Technical depth: Low-Medium. Focus on campaigns, metrics, brand.
Interview prep: Campaign case studies, analytics, creativity.
Skills: Content, SEO/SEM, analytics, social media, brand.`,

  finance: `Role: FINANCE
Technical depth: Medium. Discuss modeling, analysis, forecasting.
Interview prep: Technical finance questions, case studies.
Skills: Excel, financial modeling, analysis, reporting.`,

  general: `Role: GENERAL / NOT SPECIFIED
Keep advice role-agnostic but ask about their target role to give better guidance.`
};

class CareerAgent {
  private conversationHistory: AgentMessage[] = [];
  private state: ConversationState = {
    stage: 'unknown',
    role: 'general',
    questionsAsked: 0,
    context: {},
  };

  constructor() {
    this.reset();
  }

  reset(): void {
    this.conversationHistory = [];
    this.state = {
      stage: 'unknown',
      role: 'general',
      questionsAsked: 0,
      context: {},
    };
  }

  /**
   * Initial greeting message
   */
  getGreeting(userName?: string): AgentMessage {
    this.state.userName = userName;

    const greeting = userName
      ? `Hi ${userName}! 👋`
      : `Hi there! 👋`;

    const message: AgentMessage = {
      id: this.generateId(),
      role: 'aurora',
      content: `${greeting} I'm AURORA, your AI career agent.

I'm here to help you navigate your career journey — whether you're exploring roles, preparing for interviews, or starting a new job.

**What brings you here today?**`,
      timestamp: new Date(),
      quickActions: [
        { label: '🔍 Exploring Careers', value: 'stage_exploring' },
        { label: '📋 Applied to a Role', value: 'stage_applied' },
        { label: '🎤 Preparing for Interview', value: 'stage_interviewing' },
        { label: '🎉 Got an Offer', value: 'stage_offered' },
        { label: '🚀 Starting New Job', value: 'stage_new_hire' },
        { label: '📈 Want to Grow', value: 'stage_professional' },
      ],
    };

    this.conversationHistory.push(message);
    return message;
  }

  /**
   * Process user message
   */
  async processMessage(userInput: string): Promise<AgentMessage> {
    // Add user message
    const userMessage: AgentMessage = {
      id: this.generateId(),
      role: 'user',
      content: userInput,
      timestamp: new Date(),
    };
    this.conversationHistory.push(userMessage);

    // Detect stage and role from input if not set
    this.detectStageAndRole(userInput);
    this.state.questionsAsked++;

    // Generate response
    try {
      const response = await this.generateAIResponse(userInput);
      this.conversationHistory.push(response);
      return response;
    } catch (error) {
      console.error('AI Error:', error);
      // CRITICAL: Push fallback to history so UI displays it
      const fallback = this.getFallbackResponse();
      this.conversationHistory.push(fallback);
      return fallback;
    }
  }

  /**
   * Handle quick action selection
   */
  async handleQuickAction(actionValue: string): Promise<AgentMessage> {
    // Map action to stage
    if (actionValue.startsWith('stage_')) {
      const stageMap: Record<string, CareerStage> = {
        'stage_exploring': 'exploring',
        'stage_applied': 'applied',
        'stage_interviewing': 'interviewing',
        'stage_offered': 'offered',
        'stage_new_hire': 'new_hire',
        'stage_professional': 'professional',
      };

      const stage = stageMap[actionValue];
      if (stage) {
        this.state.stage = stage;

        // Create user message for the selection
        const stageLabels: Record<string, string> = {
          'stage_exploring': "I'm exploring career options",
          'stage_applied': "I've applied to a role",
          'stage_interviewing': "I'm preparing for an interview",
          'stage_offered': "I received a job offer",
          'stage_new_hire': "I'm starting a new job",
          'stage_professional': "I want to grow in my career",
        };

        const userMessage: AgentMessage = {
          id: this.generateId(),
          role: 'user',
          content: stageLabels[actionValue],
          timestamp: new Date(),
        };
        this.conversationHistory.push(userMessage);
        this.state.questionsAsked++;

        // Generate stage-specific response (no API call needed - instant response)
        const response = await this.generateStageResponse(stage);
        return response;
      }
    }

    // Handle role selection
    if (actionValue.startsWith('role_')) {
      const roleMap: Record<string, RoleCategory> = {
        'role_software': 'software_engineering',
        'role_data': 'data_science',
        'role_product': 'product_management',
        'role_ops': 'operations',
        'role_design': 'design',
        'role_marketing': 'marketing',
        'role_finance': 'finance',
      };

      const role = roleMap[actionValue];
      if (role) {
        this.state.role = role;
      }
    }

    // Default to processing as regular message
    return this.processMessage(actionValue);
  }

  /**
   * Generate stage-specific welcome response
   */
  private async generateStageResponse(stage: CareerStage): Promise<AgentMessage> {
    const stagePrompts: Record<CareerStage, { message: string; actions: QuickAction[] }> = {
      exploring: {
        message: `Great! You're exploring career options — that's an exciting place to be! 🌟

I can help you:
- **Discover roles** that match your skills and interests
- **Understand job requirements** in plain language
- **Identify skill gaps** and how to fill them
- **Find resources** to build the skills you need

To give you the best guidance, what type of role interests you most?`,
        actions: [
          { label: '💻 Software / Engineering', value: 'role_software' },
          { label: '📊 Data / Analytics', value: 'role_data' },
          { label: '🎯 Product Management', value: 'role_product' },
          { label: '🎨 Design', value: 'role_design' },
          { label: '🔧 Operations', value: 'role_ops' },
          { label: '📝 Something else', value: 'role_other' },
        ],
      },
      applied: {
        message: `You've submitted an application — that takes courage! 💪

While you wait to hear back, I can help you:
- **Understand the timeline** (what to expect)
- **Prepare for potential interviews** (get ahead)
- **Track your applications** effectively
- **Stay productive** during the waiting period

What would you like to know?`,
        actions: [
          { label: '⏰ What happens next?', value: 'ask_timeline' },
          { label: '🎤 How do I prepare for interviews?', value: 'ask_interview_prep' },
          { label: '📧 Should I follow up?', value: 'ask_followup' },
        ],
      },
      interviewing: {
        message: `Interview time — let's get you ready! 🎯

I can help you:
- **Understand what to expect** in each round
- **Practice common questions** (role-specific)
- **Assess your readiness** and find gaps
- **Reduce interview anxiety**

What type of interview are you preparing for?`,
        actions: [
          { label: '💻 Technical Interview', value: 'interview_technical' },
          { label: '🧠 Behavioral Interview', value: 'interview_behavioral' },
          { label: '📊 Case Study', value: 'interview_case' },
          { label: '👥 HR / Culture Fit', value: 'interview_hr' },
          { label: '🔢 Rate my readiness', value: 'readiness_score' },
        ],
      },
      offered: {
        message: `Congratulations on receiving an offer! 🎉

This is a big decision. I can help you:
- **Understand the offer components**
- **Evaluate if it's right for you**
- **Navigate negotiation** (general tips)
- **Prepare for the decision**

What would you like to discuss?`,
        actions: [
          { label: '📋 Explain the offer', value: 'explain_offer' },
          { label: '🤔 Is this a good offer?', value: 'evaluate_offer' },
          { label: '💬 Can I negotiate?', value: 'negotiate_offer' },
        ],
      },
      new_hire: {
        message: `Welcome to your new role! 🚀

The first few months are crucial. I'm here to help you:
- **Navigate your first 30/60/90 days**
- **Understand your team and organization**
- **Answer any questions** (there are no stupid questions here)
- **Build the right relationships**

What's on your mind?`,
        actions: [
          { label: '📅 First week tips', value: 'first_week' },
          { label: '👥 Understanding my team', value: 'team_structure' },
          { label: "🎯 What's expected of me?", value: 'expectations' },
          { label: '🛠️ Tools I should learn', value: 'tools_learn' },
        ],
      },
      professional: {
        message: `You're ready to level up your career! 📈

I can help you think through:
- **Internal mobility** options
- **Promotion criteria** and readiness
- **Skill gaps** for your next role
- **Leadership development**

What aspect of career growth are you focused on?`,
        actions: [
          { label: '⬆️ How do I get promoted?', value: 'promotion_path' },
          { label: '🔄 Explore other roles', value: 'internal_mobility' },
          { label: '🧭 Build a career roadmap', value: 'career_roadmap' },
        ],
      },
      unknown: {
        message: `I'm here to help! To give you the best guidance, could you tell me where you are in your career journey?`,
        actions: [
          { label: '🔍 Exploring Careers', value: 'stage_exploring' },
          { label: '📋 Applied to a Role', value: 'stage_applied' },
          { label: '🎤 Preparing for Interview', value: 'stage_interviewing' },
        ],
      },
    };

    const { message, actions } = stagePrompts[stage];

    const response: AgentMessage = {
      id: this.generateId(),
      role: 'aurora',
      content: message,
      timestamp: new Date(),
      quickActions: actions,
      metadata: { stage },
    };

    this.conversationHistory.push(response);
    return response;
  }

  /**
   * Generate AI response using the LLM
   */
  private async generateAIResponse(userInput: string): Promise<AgentMessage> {
    // Check if AI provider is set to 'none' - use built-in responses
    const provider = import.meta.env.VITE_AI_PROVIDER;
    if (provider === 'none' || !provider) {
      // Use built-in intelligent responses - no external API needed
      return this.generateBuiltInResponse(userInput);
    }

    // Build context for external AI
    const stageContext = STAGE_CONTEXT[this.state.stage];
    const roleContext = ROLE_CONTEXT[this.state.role];

    // Recent conversation history
    const recentHistory = this.conversationHistory
      .slice(-8)
      .map(m => `${m.role === 'user' ? 'User' : 'AURORA'}: ${m.content}`)
      .join('\n');

    const prompt = `${SYSTEM_PROMPT}

## CURRENT CONTEXT
Stage: ${this.state.stage}
${stageContext}

Role: ${this.state.role}
${roleContext}

## CONVERSATION
${recentHistory}

## USER'S MESSAGE
${userInput}

## YOUR TASK
Respond as AURORA. Be concise, stage-aware, and role-aware. Provide clear, actionable guidance.
${this.state.stage === 'unknown' ? 'First, identify their career stage with ONE question.' : ''}
${this.state.questionsAsked >= 3 && this.state.stage === 'unknown' ? 'IMPORTANT: Stop asking clarifying questions. Provide helpful general guidance now.' : ''}`;

    const aiResponse = await aiService.chat([
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt }
    ], { maxTokens: 800, timeout: 25000 });

    // Determine if we should show quick actions
    const quickActions = this.getContextualActions();

    return {
      id: this.generateId(),
      role: 'aurora',
      content: aiResponse,
      timestamp: new Date(),
      quickActions: quickActions.length > 0 ? quickActions : undefined,
      metadata: {
        stage: this.state.stage,
        role: this.state.role,
      },
    };
  }

  /**
   * Detect stage and role from user input
   */
  private detectStageAndRole(input: string): void {
    const lower = input.toLowerCase();

    // Stage detection
    if (this.state.stage === 'unknown') {
      if (lower.includes('exploring') || lower.includes('looking for') || lower.includes('what roles') || lower.includes('career options')) {
        this.state.stage = 'exploring';
      } else if (lower.includes('applied') || lower.includes('submitted') || lower.includes('application')) {
        this.state.stage = 'applied';
      } else if (lower.includes('interview') || lower.includes('prepare') || lower.includes('questions they ask')) {
        this.state.stage = 'interviewing';
      } else if (lower.includes('offer') || lower.includes('negotiate') || lower.includes('accepted')) {
        this.state.stage = 'offered';
      } else if (lower.includes('new job') || lower.includes('started') || lower.includes('first day') || lower.includes('onboarding')) {
        this.state.stage = 'new_hire';
      } else if (lower.includes('promotion') || lower.includes('grow') || lower.includes('advance') || lower.includes('next level')) {
        this.state.stage = 'professional';
      }
    }

    // Role detection
    if (this.state.role === 'general') {
      if (lower.includes('software') || lower.includes('engineer') || lower.includes('developer') || lower.includes('coding')) {
        this.state.role = 'software_engineering';
      } else if (lower.includes('data') || lower.includes('analyst') || lower.includes('machine learning')) {
        this.state.role = 'data_science';
      } else if (lower.includes('product') || lower.includes('pm ')) {
        this.state.role = 'product_management';
      } else if (lower.includes('design') || lower.includes('ux') || lower.includes('ui')) {
        this.state.role = 'design';
      } else if (lower.includes('operations') || lower.includes('ops')) {
        this.state.role = 'operations';
      }
    }
  }

  /**
   * Get contextual quick actions
   */
  private getContextualActions(): QuickAction[] {
    // Only show initial stage selection if stage is unknown
    if (this.state.stage === 'unknown' && this.state.questionsAsked <= 2) {
      return [
        { label: '🔍 Exploring Careers', value: 'stage_exploring' },
        { label: '📋 Applied to a Role', value: 'stage_applied' },
        { label: '🎤 Interview Prep', value: 'stage_interviewing' },
      ];
    }

    return [];
  }

  /**
   * Generate intelligent built-in response based on user input and context
   * This works WITHOUT any external API - all responses are pre-built
   */
  private generateBuiltInResponse(userInput: string): AgentMessage {
    const lower = userInput.toLowerCase();
    let content = '';
    let quickActions: QuickAction[] = [];

    // Interview-related queries
    if (lower.includes('interview') || lower.includes('prepare') || lower.includes('questions')) {
      this.state.stage = 'interviewing';
      content = `Great question! Let me help you prepare for your interview. 🎯

**Interview Preparation Framework:**

**1. Before the Interview**
- Research the company thoroughly (mission, values, recent news)
- Review the job description and match your experience to requirements
- Prepare 5+ STAR stories (Situation, Task, Action, Result)
- Test your tech setup if it's a virtual interview

**2. Common Questions to Master**
- "Tell me about yourself" — Keep it 2-3 minutes, focus on relevant experience
- "Why this company/role?" — Show you've done research
- "Tell me about a challenging project" — Use the STAR method
- "Where do you see yourself in 5 years?" — Show ambition aligned with company

**3. Day of the Interview**
- Arrive/log in 10 minutes early
- Have questions ready for them
- Take notes if appropriate
- Send a thank-you email within 24 hours

**Your Interview Readiness: 6/10** (general estimate)

Would you like me to help you with specific interview questions, or do a practice session?`;
      quickActions = [
        { label: '💻 Technical Interview Tips', value: 'technical_interview' },
        { label: '🧠 Behavioral Questions', value: 'behavioral_questions' },
        { label: '❓ Questions to Ask Them', value: 'questions_to_ask' },
      ];
    }
    // Exploring careers
    else if (lower.includes('explor') || lower.includes('career') || lower.includes('role') || lower.includes('job')) {
      this.state.stage = 'exploring';
      content = `I'd love to help you explore your career options! 🌟

**Here's my recommended approach:**

**1. Self-Assessment First**
- What are your top 5 skills?
- What problems do you enjoy solving?
- What's your preferred work environment?

**2. Research Roles That Interest You**
- Software Engineering → Building apps, systems, solving technical problems
- Data Science → Analyzing data, building ML models, finding insights
- Product Management → Defining what to build, working with teams
- Design → Creating user experiences, visual design
- Operations → Running processes, improving efficiency

**3. Building Skills**
- Take online courses (Coursera, Udemy, LinkedIn Learning)
- Work on personal projects to build a portfolio
- Network with people in roles you're interested in

What type of role interests you most? I can give you specific guidance!`;
      quickActions = [
        { label: '💻 Software / Engineering', value: 'role_software' },
        { label: '📊 Data / Analytics', value: 'role_data' },
        { label: '🎯 Product Management', value: 'role_product' },
        { label: '🎨 Design', value: 'role_design' },
      ];
    }
    // Applied / waiting
    else if (lower.includes('applied') || lower.includes('application') || lower.includes('waiting') || lower.includes('hear back')) {
      this.state.stage = 'applied';
      content = `You've applied — that's great! Here's what to do while waiting: 💪

**1. Track Your Applications**
- Use a spreadsheet or tool like Notion
- Note: company, role, date applied, status

**2. Prepare for Next Steps**
- Research the company deeply
- Prepare your "tell me about yourself" story
- Have 3-5 questions ready for them

**3. Keep Applying**
- Don't put all eggs in one basket
- Aim for 5-10 quality applications per week

**Typical Timeline:**
- Initial response: 1-2 weeks
- Phone screen: within 3 weeks
- Full interview process: 2-6 weeks

**Should you follow up?** If no response after 2 weeks, a polite follow-up email is appropriate.`;
      quickActions = [
        { label: '📧 Write Follow-up Email', value: 'followup_email' },
        { label: '🎤 Prepare for Interview', value: 'stage_interviewing' },
      ];
    }
    // New job / onboarding
    else if (lower.includes('new job') || lower.includes('started') || lower.includes('first') || lower.includes('onboard')) {
      this.state.stage = 'new_hire';
      content = `Welcome to your new role! 🚀 Here's your success framework:

**First Week**
- Focus on learning, not impressing
- Meet your team members 1-on-1
- Understand the tools and processes
- Ask questions freely — there are no stupid questions!

**First 30 Days**
- Understand team goals and how you contribute
- Complete any onboarding training
- Find a "buddy" or mentor
- Start on small, meaningful tasks

**First 90 Days**
- Aim for your first small win
- Build relationships across teams
- Seek feedback proactively
- Document what you learn

**Key tip:** The best new hires listen before they suggest changes. Learn the "why" behind current processes first.`;
      quickActions = [
        { label: '👥 Understanding My Team', value: 'team_structure' },
        { label: '🎯 First Week Checklist', value: 'first_week' },
      ];
    }
    // Promotion / growth
    else if (lower.includes('promot') || lower.includes('grow') || lower.includes('advance') || lower.includes('next level')) {
      this.state.stage = 'professional';
      content = `Ready to level up your career! 📈 Here's your growth framework:

**1. Understand the Path**
- Ask your manager about promotion criteria
- Look at job descriptions for the next level
- Identify skill gaps honestly

**2. Visibility Matters**
- Document your wins and impact
- Share learnings with the team
- Take on cross-functional projects

**3. Build Your Network**
- Find mentors in roles you want
- Help others (it comes back)
- Stay current in your field

**4. Have the Conversation**
- Schedule a career discussion with your manager
- Ask: "What does success at the next level look like?"
- Create a development plan together

**Next step:** Schedule that career conversation this week!`;
      quickActions = [
        { label: '🔄 Explore Other Roles', value: 'internal_mobility' },
        { label: '🧭 Build Career Roadmap', value: 'career_roadmap' },
      ];
    }
    // CV / resume related
    else if (lower.includes('cv') || lower.includes('resume') || lower.includes('compatibility') || lower.includes('score')) {
      content = `I can help you with your CV/resume! 📄

**CV Best Practices:**

**1. Format**
- Keep it to 1-2 pages max
- Use a clean, readable format
- Include relevant keywords from job descriptions

**2. Key Sections**
- **Summary**: 2-3 sentences about who you are
- **Experience**: Focus on achievements, not duties (use numbers!)
- **Skills**: Technical skills, tools, languages
- **Education**: Degrees, certifications, relevant coursework

**3. Tailor for Each Role**
- Match your experience to the job requirements
- Use similar language to the job description
- Highlight the most relevant achievements

**CV Compatibility Tips:**
- Read the job description carefully
- Identify 5-7 key requirements
- Ensure your CV addresses each one specifically

Would you like tips for a specific role or industry?`;
      quickActions = [
        { label: '💻 Tech CV Tips', value: 'tech_cv' },
        { label: '📊 Data Role CV', value: 'data_cv' },
      ];
    }
    // Skills / learning
    else if (lower.includes('skill') || lower.includes('learn') || lower.includes('course') || lower.includes('certif')) {
      content = `Let's build your skills! 📚

**Free Learning Resources:**
- **Coursera** — University courses (audit for free)
- **freeCodeCamp** — Full-stack development
- **Khan Academy** — Computer science fundamentals
- **YouTube** — Tutorials for almost anything

**Paid Platforms Worth It:**
- **Udemy** — Wait for sales ($10-15 courses)
- **LinkedIn Learning** — Often free through employers
- **Pluralsight** — Great for tech skills

**High-Value Certifications:**
- **AWS/GCP/Azure** — Cloud computing
- **Google Analytics** — Marketing/Data
- **PMP/Scrum** — Project management
- **Salesforce** — CRM/Sales

**My Recommendation:**
1. Pick ONE area to focus on
2. Dedicate 1-2 hours daily
3. Build projects as you learn
4. Share your work publicly

What specific skills are you looking to build?`;
      quickActions = [
        { label: '💻 Coding Skills', value: 'coding_skills' },
        { label: '📊 Data Skills', value: 'data_skills' },
      ];
    }
    // Default / greeting
    else {
      content = `Hi! I'm AURORA, your AI career guide. 👋

I can help you with:

🔍 **Career Exploration** — Discover roles that match your skills
📋 **Job Applications** — Tips for resume, cover letter, applications
🎤 **Interview Prep** — Practice questions, preparation strategies  
🚀 **New Job Success** — Onboarding, first 90 days guidance
📈 **Career Growth** — Promotions, skill development, next steps

What would you like help with today?`;
      quickActions = [
        { label: '🔍 Exploring Careers', value: 'stage_exploring' },
        { label: '🎤 Preparing for Interview', value: 'stage_interviewing' },
        { label: '📋 Applied to a Role', value: 'stage_applied' },
        { label: '🚀 Starting New Job', value: 'stage_new_hire' },
      ];
    }

    return {
      id: this.generateId(),
      role: 'aurora',
      content,
      timestamp: new Date(),
      quickActions: quickActions.length > 0 ? quickActions : undefined,
      metadata: {
        stage: this.state.stage,
        role: this.state.role,
      },
    };
  }

  /**
   * Fallback response when AI fails - still provides intelligent stage-aware guidance
   */
  private getFallbackResponse(): AgentMessage {
    // Stage-specific fallback responses
    const fallbacks: Record<CareerStage, string> = {
      exploring: `Great question! Since you're exploring careers, here's what I recommend:

**1. Self-Assessment First**
- List your top 5 skills and interests
- Identify problems you enjoy solving
- Consider your work style preferences (remote, collaborative, independent)

**2. Research Roles**
- Look at job descriptions on LinkedIn/Indeed
- Read "day in the life" articles
- Talk to people in roles that interest you

**3. Build Skills**
- Take online courses (Coursera, Udemy)
- Work on personal projects
- Contribute to open source if in tech

**Next step**: Pick ONE role that interests you and research what skills it requires. Would you like help with that?`,

      applied: `You've applied — that's great! Here's what to do while waiting:

**1. Track Your Applications**
- Use a spreadsheet or tool like Notion
- Note company, role, date applied, status

**2. Prepare for Next Steps**
- Research the company deeply
- Prepare your "tell me about yourself" story
- Have 3-5 questions ready

**3. Keep Applying**
- Don't wait on one application
- Aim for 5-10 quality applications per week

**Timeline**: Most companies respond within 1-2 weeks. If no response after 2 weeks, a polite follow-up email is appropriate.`,

      interviewing: `Interview prep is crucial! Here's my guidance:

**Before the Interview**
1. Research the company (mission, recent news, culture)
2. Review the job description thoroughly
3. Prepare 5+ STAR stories (Situation, Task, Action, Result)
4. Test your tech setup if virtual

**Common Questions to Prepare**
- "Tell me about yourself" (2-3 minutes)
- "Why this company/role?"
- "Tell me about a challenging project"
- "Where do you see yourself in 5 years?"

**Day of Interview**
- Arrive 10 min early (or log in early if virtual)
- Have questions ready for them
- Send thank you email within 24 hours

**Your readiness score**: Based on typical preparation, I'd estimate 6/10. Want me to help you practice specific areas?`,

      offered: `Congratulations on your offer! 🎉 Here's how to evaluate it:

**1. Beyond the Salary**
- Benefits (health, 401k, PTO)
- Growth opportunities
- Team and manager quality
- Work-life balance
- Remote/hybrid options

**2. Negotiation Tips**
- It's normal and expected to negotiate
- Focus on total compensation, not just base
- Be professional and positive
- Have a number in mind before you negotiate

**3. Making the Decision**
- Consider career growth, not just immediate pay
- Trust your gut about the team/culture
- It's okay to ask for more time to decide (24-48 hours is normal)

**Important**: For specific compensation questions, please speak with the HR team directly.`,

      new_hire: `Welcome to your new role! 🚀 Here's your game plan:

**First Week**
- Focus on learning, not impressing
- Meet your team members 1-on-1
- Understand the tools and processes
- Ask questions freely (there are no stupid questions!)

**First 30 Days**
- Understand team goals and how you contribute
- Complete any onboarding training
- Find a "buddy" or mentor
- Start on small, meaningful tasks

**First 90 Days**
- Aim for your first small win
- Build relationships across teams
- Seek feedback proactively
- Document what you learn

**Key tip**: The best new hires listen before they suggest changes. Learn the "why" behind current processes first.`,

      professional: `Ready to level up! Here's your growth framework:

**1. Understand the Path**
- Ask your manager about promotion criteria
- Look at job descriptions for the next level
- Identify skill gaps honestly

**2. Visibility Matters**
- Document your wins and impact
- Share learnings with the team
- Take on cross-functional projects

**3. Build Your Network**
- Find mentors in roles you want
- Help others (it comes back)
- Stay current in your field

**4. Internal Mobility**
- Explore other teams/roles internally
- Express interest to your manager
- Many companies prefer internal candidates

**Next step**: Schedule a career conversation with your manager to understand what success looks like at the next level.`,

      unknown: `I'd love to help you! To give you the best guidance, let me know where you are:

🔍 **Exploring** — Looking at career options
📋 **Applied** — Submitted applications, waiting to hear back
🎤 **Interviewing** — Preparing for or going through interviews
🎉 **Offered** — Received an offer, evaluating
🚀 **New hire** — Just started a new job
📈 **Growing** — Looking to advance in current career

Which stage resonates with you?`
    };

    const content = fallbacks[this.state.stage] || fallbacks.unknown;

    return {
      id: this.generateId(),
      role: 'aurora',
      content,
      timestamp: new Date(),
      quickActions: this.state.stage === 'unknown' ? [
        { label: '🔍 Exploring Careers', value: 'stage_exploring' },
        { label: '📋 Applied to a Role', value: 'stage_applied' },
        { label: '🎤 Interview Prep', value: 'stage_interviewing' },
        { label: '🚀 Starting New Job', value: 'stage_new_hire' },
      ] : undefined,
    };
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get conversation history
   */
  getHistory(): AgentMessage[] {
    return [...this.conversationHistory];
  }

  /**
   * Get current state
   */
  getState(): ConversationState {
    return { ...this.state };
  }

  /**
   * Set stage manually
   */
  setStage(stage: CareerStage): void {
    this.state.stage = stage;
  }

  /**
   * Set role manually
   */
  setRole(role: RoleCategory): void {
    this.state.role = role;
  }
}

// Export singleton instance
export const careerAgent = new CareerAgent();

// Export class for testing
export { CareerAgent };
