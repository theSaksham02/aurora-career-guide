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
      return this.getFallbackResponse();
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

        // Generate stage-specific response
        return this.generateStageResponse(stage);
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
    // Build context
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
   * Fallback response when AI fails
   */
  private getFallbackResponse(): AgentMessage {
    return {
      id: this.generateId(),
      role: 'aurora',
      content: `I'm having trouble connecting right now. Let me give you some general guidance:

If you're **exploring careers** — start by listing your top skills and interests. What problems do you enjoy solving?

If you're **interviewing** — research the company, practice your STAR stories, and prepare thoughtful questions.

If you're **starting a new role** — focus on listening, learning, and building relationships in your first 30 days.

Feel free to ask me something specific and I'll try again!`,
      timestamp: new Date(),
      quickActions: [
        { label: '🔄 Try again', value: 'retry' },
        { label: '🔍 Explore Careers', value: 'stage_exploring' },
        { label: '🎤 Interview Prep', value: 'stage_interviewing' },
      ],
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
