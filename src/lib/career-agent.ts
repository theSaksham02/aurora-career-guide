/**
 * AURORA Career Agent - Stage-Aware AI Career Guide
 * 
 * Core Function: Act as a stage-aware career guide that:
 * - Meets users where they are (student → job seeker → professional)
 * - Asks minimal, high-impact questions (2–3 max before guidance)
 * - Provides structured, actionable next steps
 * - Avoids generic advice
 */

import { aiService } from './ai-service';

// Career stages
export type CareerStage = 'student' | 'intern_jobseeker' | 'professional' | 'unknown';

// Conversation intents
export type ConversationIntent = 
  | 'career_exploration' 
  | 'application_management' 
  | 'onboarding' 
  | 'not_sure'
  | 'general';

// Conversation state tracking
export interface ConversationState {
  stage: CareerStage;
  intent: ConversationIntent;
  questionsAsked: number;
  context: Record<string, string>;
  currentPhase: 'intro' | 'stage_identification' | 'intent_clarification' | 'guidance' | 'followup';
}

// Message type
export interface AgentMessage {
  id: string;
  role: 'user' | 'aurora';
  content: string;
  timestamp: Date;
  quickActions?: QuickAction[];
}

export interface QuickAction {
  label: string;
  value: string;
  icon?: string;
}

// System prompt for the AI agent
const SYSTEM_PROMPT = `You are AURORA, an intelligent AI career agent. Your role is to provide stage-aware career guidance.

## YOUR PERSONALITY
- Warm but professional
- Concise and structured
- Action-oriented
- Empathetic but efficient

## CORE PRINCIPLES
1. **Stage-Aware**: Adapt your advice based on whether the user is a Student, Intern/Job Seeker, or Professional
2. **Minimal Questions**: Ask only 2-3 high-impact questions before providing guidance
3. **Structured Output**: Use bullet points, numbered lists, and clear sections
4. **Actionable**: Every response should include specific next steps
5. **No Fluff**: Avoid generic advice like "network more" without specifics

## RESPONSE FORMAT
Always structure your responses with:
- **Brief acknowledgment** (1 sentence)
- **Key insight or assessment** (2-3 sentences)
- **Actionable steps** (numbered list, 3-5 items max)
- **Quick follow-up question** (only if needed, to clarify or go deeper)

## STAGE-SPECIFIC GUIDANCE

### For Students:
- Focus on: skill building, internship prep, portfolio development
- Tone: Encouraging, educational
- Priorities: Learning paths, project ideas, entry-level opportunities

### For Intern/Job Seekers:
- Focus on: resume optimization, interview prep, application strategy
- Tone: Supportive, tactical
- Priorities: Job search efficiency, standing out, negotiation basics

### For Professionals:
- Focus on: career transitions, leadership, advancement, work-life balance
- Tone: Peer-level, strategic
- Priorities: Long-term growth, skill gaps, industry trends

## WHAT NOT TO DO
- Don't ask more than 3 questions in a row
- Don't give walls of text
- Don't be vague ("just try harder")
- Don't ignore the user's specific situation
- Don't overwhelm with too many options

Remember: Your goal is MOMENTUM and CLARITY. Help users move forward with confidence.`;

// Intent-specific prompts
const INTENT_PROMPTS: Record<ConversationIntent, string> = {
  career_exploration: `
The user wants to explore career options. Focus on:
- Understanding their interests, skills, and values
- Suggesting relevant career paths based on their stage
- Providing resources for exploration
- Identifying skill gaps and how to fill them

For students: internships, entry-level roles, skill-building
For job seekers: pivot strategies, transferable skills, market demands
For professionals: adjacent roles, leadership paths, industry shifts`,

  application_management: `
The user needs help with job applications. Focus on:
- Optimizing their application materials
- Tracking and organizing applications
- Interview preparation
- Follow-up strategies

For students: first resume, cover letters, internship apps
For job seekers: ATS optimization, tailoring applications, volume vs quality
For professionals: executive presence, accomplishment framing, negotiation`,

  onboarding: `
The user is preparing for or starting a new role. Focus on:
- Pre-start preparation
- First 90 days strategy
- Building relationships
- Setting up for success

For students: internship readiness, professionalism basics
For job seekers: new job transition, proving value early
For professionals: leadership transitions, team dynamics, quick wins`,

  not_sure: `
The user isn't sure what they need. Your job is to:
- Gently probe with 1-2 clarifying questions
- Identify their biggest pain point or goal
- Guide them toward the right path
- Keep it light and exploratory`,

  general: `
The user has a general career question. Be helpful and:
- Answer directly and concisely
- Provide actionable advice
- Offer to go deeper if relevant
- Connect to one of the main areas if appropriate`
};

// Stage identification helpers
const STAGE_KEYWORDS: Record<CareerStage, string[]> = {
  student: ['student', 'university', 'college', 'degree', 'graduating', 'freshman', 'sophomore', 'junior', 'senior', 'study', 'major', 'school', 'class', 'professor', 'campus'],
  intern_jobseeker: ['looking for', 'job search', 'applying', 'interview', 'internship', 'entry-level', 'junior', 'unemployed', 'laid off', 'career change', 'pivot', 'resume', 'job hunt', 'offer'],
  professional: ['years experience', 'manager', 'senior', 'lead', 'director', 'currently work', 'my team', 'promotion', 'leadership', 'executive', 'career growth', 'advancement'],
  unknown: []
};

// Intent detection helpers
const INTENT_KEYWORDS: Record<ConversationIntent, string[]> = {
  career_exploration: ['explore', 'career path', 'what should i do', 'options', 'direction', 'confused', 'interests', 'passion', 'field', 'industry', 'switch careers'],
  application_management: ['apply', 'application', 'resume', 'cv', 'cover letter', 'interview', 'job posting', 'tracking', 'rejected', 'ghosted', 'offer', 'negotiate'],
  onboarding: ['new job', 'starting', 'first day', 'first week', 'onboarding', 'new role', 'just joined', 'new team', 'orientation'],
  not_sure: ['not sure', 'don\'t know', 'help me', 'confused', 'lost', 'stuck'],
  general: []
};

class CareerAgent {
  private conversationHistory: AgentMessage[] = [];
  private state: ConversationState = {
    stage: 'unknown',
    intent: 'general',
    questionsAsked: 0,
    context: {},
    currentPhase: 'intro'
  };

  constructor() {
    this.reset();
  }

  /**
   * Reset the conversation state
   */
  reset(): void {
    this.conversationHistory = [];
    this.state = {
      stage: 'unknown',
      intent: 'general',
      questionsAsked: 0,
      context: {},
      currentPhase: 'intro'
    };
  }

  /**
   * Get the initial greeting message
   */
  getGreeting(userName?: string): AgentMessage {
    const greeting = userName 
      ? `Hi ${userName}! 👋 I'm AURORA, your AI career agent.`
      : `Hi there! 👋 I'm AURORA, your AI career agent.`;

    const message: AgentMessage = {
      id: this.generateId(),
      role: 'aurora',
      content: `${greeting}

I'm here to help you navigate your career journey with personalized, actionable guidance.

**What would you like help with today?**`,
      timestamp: new Date(),
      quickActions: [
        { label: '🧭 Career Exploration', value: 'career_exploration' },
        { label: '📋 Application Help', value: 'application_management' },
        { label: '🚀 New Role Onboarding', value: 'onboarding' },
        { label: '🤔 Not Sure Yet', value: 'not_sure' }
      ]
    };

    this.conversationHistory.push(message);
    return message;
  }

  /**
   * Process user input and generate a response
   */
  async processMessage(userInput: string, userStage?: CareerStage): Promise<AgentMessage> {
    // Add user message to history
    const userMessage: AgentMessage = {
      id: this.generateId(),
      role: 'user',
      content: userInput,
      timestamp: new Date()
    };
    this.conversationHistory.push(userMessage);

    // Update state based on input
    this.updateState(userInput, userStage);

    // Generate response
    const response = await this.generateResponse(userInput);
    
    // Add response to history
    this.conversationHistory.push(response);
    
    return response;
  }

  /**
   * Handle quick action selection
   */
  async handleQuickAction(actionValue: string, userStage?: CareerStage): Promise<AgentMessage> {
    // Map action to intent
    const intentMap: Record<string, ConversationIntent> = {
      'career_exploration': 'career_exploration',
      'application_management': 'application_management',
      'onboarding': 'onboarding',
      'not_sure': 'not_sure'
    };

    this.state.intent = intentMap[actionValue] || 'general';
    this.state.currentPhase = 'stage_identification';

    // If we already know the stage, skip to guidance
    if (userStage && userStage !== 'unknown') {
      this.state.stage = userStage;
      this.state.currentPhase = 'intent_clarification';
    }

    // Generate contextual response
    return this.generateIntentResponse(actionValue, userStage);
  }

  /**
   * Update conversation state based on user input
   */
  private updateState(input: string, providedStage?: CareerStage): void {
    const lowerInput = input.toLowerCase();

    // Detect stage if not provided
    if (providedStage && providedStage !== 'unknown') {
      this.state.stage = providedStage;
    } else if (this.state.stage === 'unknown') {
      this.state.stage = this.detectStage(lowerInput);
    }

    // Detect intent if not set
    if (this.state.intent === 'general') {
      this.state.intent = this.detectIntent(lowerInput);
    }

    // Track questions asked
    if (this.state.currentPhase !== 'guidance') {
      this.state.questionsAsked++;
    }

    // Progress phase based on questions asked
    if (this.state.questionsAsked >= 3) {
      this.state.currentPhase = 'guidance';
    }
  }

  /**
   * Detect career stage from text
   */
  private detectStage(text: string): CareerStage {
    for (const [stage, keywords] of Object.entries(STAGE_KEYWORDS)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return stage as CareerStage;
      }
    }
    return 'unknown';
  }

  /**
   * Detect intent from text
   */
  private detectIntent(text: string): ConversationIntent {
    for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return intent as ConversationIntent;
      }
    }
    return 'general';
  }

  /**
   * Generate response using AI
   */
  private async generateResponse(userInput: string): Promise<AgentMessage> {
    // Build context for AI
    const contextPrompt = this.buildContextPrompt();
    
    // Get conversation history for context
    const historyContext = this.conversationHistory
      .slice(-6) // Last 6 messages for context
      .map(m => `${m.role === 'user' ? 'User' : 'AURORA'}: ${m.content}`)
      .join('\n');

    const fullPrompt = `${SYSTEM_PROMPT}

${contextPrompt}

## CONVERSATION HISTORY
${historyContext}

## USER'S CURRENT MESSAGE
${userInput}

## YOUR TASK
Respond as AURORA. Be concise, structured, and actionable. Remember the 2-3 question rule - if you've already asked questions, provide guidance now.

Current phase: ${this.state.currentPhase}
Questions asked so far: ${this.state.questionsAsked}
${this.state.questionsAsked >= 2 ? '⚠️ You have asked enough questions. Provide actionable guidance now.' : ''}`;

    try {
      const aiResponse = await aiService.chat([
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: fullPrompt }
      ]);

      // Determine if we should show quick actions
      const quickActions = this.getContextualQuickActions();

      return {
        id: this.generateId(),
        role: 'aurora',
        content: aiResponse,
        timestamp: new Date(),
        quickActions: quickActions.length > 0 ? quickActions : undefined
      };
    } catch (error) {
      console.error('AI response error:', error);
      return this.getFallbackResponse();
    }
  }

  /**
   * Generate response for quick action selection
   */
  private async generateIntentResponse(actionValue: string, userStage?: CareerStage): Promise<AgentMessage> {
    const intentPrompt = INTENT_PROMPTS[this.state.intent] || INTENT_PROMPTS.general;
    
    // Create user message for the action
    const actionLabels: Record<string, string> = {
      'career_exploration': 'I want to explore career options',
      'application_management': 'I need help with job applications',
      'onboarding': 'I\'m preparing for a new role',
      'not_sure': 'I\'m not sure what I need help with'
    };

    const userMessage: AgentMessage = {
      id: this.generateId(),
      role: 'user',
      content: actionLabels[actionValue] || actionValue,
      timestamp: new Date()
    };
    this.conversationHistory.push(userMessage);

    // Build the prompt
    let prompt = `${SYSTEM_PROMPT}

${intentPrompt}

The user has selected: ${actionLabels[actionValue]}
Their career stage: ${userStage || this.state.stage || 'Not yet identified'}

## YOUR TASK`;

    if (this.state.stage === 'unknown' && !userStage) {
      prompt += `
First, warmly acknowledge their choice. Then ask ONE question to identify their career stage:
- Are they a Student?
- An Intern or Job Seeker?
- A Working Professional?

Keep it conversational and brief. Offer quick response options.`;
    } else {
      prompt += `
Acknowledge their choice and their stage (${userStage || this.state.stage}). Then:
1. Ask ONE clarifying question about their specific situation
2. This should be high-impact and help you give better advice

Keep it brief and focused.`;
    }

    try {
      const aiResponse = await aiService.chat([
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ]);

      // Add stage selection quick actions if stage unknown
      let quickActions: QuickAction[] = [];
      if (this.state.stage === 'unknown' && !userStage) {
        quickActions = [
          { label: '🎓 Student', value: 'stage_student' },
          { label: '🔍 Job Seeker', value: 'stage_jobseeker' },
          { label: '💼 Professional', value: 'stage_professional' }
        ];
      }

      const response: AgentMessage = {
        id: this.generateId(),
        role: 'aurora',
        content: aiResponse,
        timestamp: new Date(),
        quickActions: quickActions.length > 0 ? quickActions : undefined
      };

      this.conversationHistory.push(response);
      this.state.questionsAsked++;
      
      return response;
    } catch (error) {
      console.error('AI response error:', error);
      return this.getFallbackResponse();
    }
  }

  /**
   * Build context prompt based on current state
   */
  private buildContextPrompt(): string {
    let context = '## CURRENT CONTEXT\n';
    
    if (this.state.stage !== 'unknown') {
      context += `- User's career stage: ${this.formatStage(this.state.stage)}\n`;
    }
    
    if (this.state.intent !== 'general') {
      context += `- User's intent: ${this.formatIntent(this.state.intent)}\n`;
    }

    context += `- Conversation phase: ${this.state.currentPhase}\n`;
    context += `- Questions asked: ${this.state.questionsAsked}/3\n`;

    if (Object.keys(this.state.context).length > 0) {
      context += '\n### Additional Context:\n';
      for (const [key, value] of Object.entries(this.state.context)) {
        context += `- ${key}: ${value}\n`;
      }
    }

    return context;
  }

  /**
   * Get contextual quick actions based on conversation state
   */
  private getContextualQuickActions(): QuickAction[] {
    // Don't show quick actions if we're deep in conversation
    if (this.state.questionsAsked > 3) {
      return [];
    }

    // Stage selection
    if (this.state.stage === 'unknown' && this.state.currentPhase === 'stage_identification') {
      return [
        { label: '🎓 Student', value: 'stage_student' },
        { label: '🔍 Job Seeker', value: 'stage_jobseeker' },
        { label: '💼 Professional', value: 'stage_professional' }
      ];
    }

    return [];
  }

  /**
   * Get fallback response when AI fails
   */
  private getFallbackResponse(): AgentMessage {
    const fallbackMessages = [
      "I'd love to help you with that! Could you tell me a bit more about your current situation?",
      "Great question! To give you the best advice, could you share where you are in your career journey?",
      "I'm here to help! Let me understand your situation better - are you a student, job seeker, or working professional?"
    ];

    return {
      id: this.generateId(),
      role: 'aurora',
      content: fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)],
      timestamp: new Date(),
      quickActions: [
        { label: '🎓 Student', value: 'stage_student' },
        { label: '🔍 Job Seeker', value: 'stage_jobseeker' },
        { label: '💼 Professional', value: 'stage_professional' }
      ]
    };
  }

  /**
   * Format stage for display
   */
  private formatStage(stage: CareerStage): string {
    const stageNames: Record<CareerStage, string> = {
      student: 'Student',
      intern_jobseeker: 'Intern/Job Seeker',
      professional: 'Working Professional',
      unknown: 'Not identified'
    };
    return stageNames[stage];
  }

  /**
   * Format intent for display
   */
  private formatIntent(intent: ConversationIntent): string {
    const intentNames: Record<ConversationIntent, string> = {
      career_exploration: 'Career Exploration',
      application_management: 'Application Management',
      onboarding: 'Onboarding Support',
      not_sure: 'General Help',
      general: 'General Question'
    };
    return intentNames[intent];
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
   * Set user stage manually
   */
  setStage(stage: CareerStage): void {
    this.state.stage = stage;
    if (this.state.currentPhase === 'stage_identification') {
      this.state.currentPhase = 'intent_clarification';
    }
  }

  /**
   * Set intent manually
   */
  setIntent(intent: ConversationIntent): void {
    this.state.intent = intent;
  }
}

// Export singleton instance
export const careerAgent = new CareerAgent();

// Export class for testing/multiple instances
export { CareerAgent };
