import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MessageSquare, HelpCircle, Check, Target, Sparkles, ChevronLeft, ChevronRight, CheckCircle, Circle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUser, OnboardingStep } from "@/contexts/UserContext";
import { toast } from "sonner";

// Onboarding steps for stepper
const steps = [
  { id: 1 as OnboardingStep, label: "Knowledge", description: "Learn the basics" },
  { id: 2 as OnboardingStep, label: "Instructions", description: "(optional)" },
  { id: 3 as OnboardingStep, label: "Training & Evaluation", description: "Practice scenarios" },
  { id: 4 as OnboardingStep, label: "Deploy", description: "Go live" },
];

// Knowledge content for step 1
const knowledgeTopics = [
  { id: 'k1', title: "Company Culture", content: "Understanding workplace values, communication styles, and team dynamics." },
  { id: 'k2', title: "Role Expectations", content: "What's expected in your first 30, 60, and 90 days." },
  { id: 'k3', title: "Tools & Processes", content: "Key software, workflows, and standard procedures you'll use." },
  { id: 'k4', title: "Team Structure", content: "Who's who, reporting lines, and key stakeholders to know." },
];

// Training questions for step 3
const trainingQuestions = [
  {
    id: 0,
    question: "How should you approach your first week at a new job?",
    optionA: "Focus on building relationships, ask questions, and observe how things work before making suggestions.",
    optionB: "Jump right in and start suggesting improvements to show your value.",
    correctAnswer: 'A' as const,
  },
  {
    id: 1,
    question: "What's the best way to handle unclear expectations?",
    optionA: "Schedule a 1-on-1 with your manager to clarify priorities and success metrics.",
    optionB: "Figure it out on your own to avoid seeming incompetent.",
    correctAnswer: 'A' as const,
  },
  {
    id: 2,
    question: "How do you build rapport with new teammates?",
    optionA: "Be genuinely curious about their work, offer help, and find common interests.",
    optionB: "Keep to yourself and focus only on your tasks.",
    correctAnswer: 'A' as const,
  },
  {
    id: 3,
    question: "When you make a mistake in your first month, you should:",
    optionA: "Own it quickly, learn from it, and communicate what you'll do differently.",
    optionB: "Try to fix it quietly without drawing attention to avoid looking bad.",
    correctAnswer: 'A' as const,
  },
  {
    id: 4,
    question: "The best time to ask for feedback is:",
    optionA: "Regularly throughout your first weeks, not just at formal reviews.",
    optionB: "Only during scheduled performance reviews to avoid being annoying.",
    correctAnswer: 'A' as const,
  },
];

// Glass card styles
const glassCard = "bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(11,43,61,0.1)]";

export default function Onboarding() {
  const navigate = useNavigate();
  const {
    onboarding,
    setOnboardingStep,
    completeOnboardingStep,
    setOnboardingAnswer,
    setOnboardingComment,
    togglePreTask,
    toggleWeekTask
  } = useUser();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [localComments, setLocalComments] = useState<Record<number, string>>(onboarding.comments || {});
  const [knowledgeRead, setKnowledgeRead] = useState<Set<string>>(new Set());

  const { currentStep, completedSteps, answers, preTasks, weekTasks } = onboarding;
  const allTasks = [...preTasks, ...weekTasks];
  const completedTaskCount = allTasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedTaskCount / allTasks.length) * 100);

  const selectAnswer = (option: 'A' | 'B') => {
    setOnboardingAnswer(currentQuestion, option);
    // Check if correct
    if (option === trainingQuestions[currentQuestion].correctAnswer) {
      toast.success("Great choice! That's the recommended approach.");
    } else {
      toast.info("Interesting perspective. Consider the alternative approach too.");
    }
  };

  const saveComment = () => {
    if (localComments[currentQuestion]) {
      setOnboardingComment(currentQuestion, localComments[currentQuestion]);
      toast.success("Comment saved!");
    }
  };

  const nextQuestion = () => {
    saveComment();
    if (currentQuestion < trainingQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Complete step 3 and move to step 4
      completeOnboardingStep(3);
      setOnboardingStep(4);
      toast.success("Training completed! You're ready to deploy.");
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const goToStep = (step: OnboardingStep) => {
    // Can only go to previous steps or next step if current is complete
    if (step <= currentStep || completedSteps.includes(currentStep)) {
      setOnboardingStep(step);
    }
  };

  const completeCurrentStep = () => {
    completeOnboardingStep(currentStep);
    if (currentStep < 4) {
      setOnboardingStep((currentStep + 1) as OnboardingStep);
      toast.success(`Step ${currentStep} completed!`);
    } else {
      toast.success("🎉 Onboarding complete! You're ready to start your journey.");
      navigate('/dashboard');
    }
  };

  const markKnowledgeRead = (id: string) => {
    setKnowledgeRead(prev => new Set([...prev, id]));
  };

  // Render content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className={`${glassCard} rounded-2xl p-6`}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0B2B3D] to-[#074C6B] flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-[#A1D1E5]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0B2B3D] text-lg mb-1">Welcome! Let's build your foundation</h3>
                  <p className="text-[#5D93A9]">
                    Review these key areas to prepare for your new role. Click each topic to learn more.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {knowledgeTopics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => markKnowledgeRead(topic.id)}
                  className={`${glassCard} rounded-xl p-5 text-left transition-all hover:shadow-lg ${knowledgeRead.has(topic.id) ? 'ring-2 ring-emerald-500 bg-emerald-50/50' : ''
                    }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-[#0B2B3D] mb-1">{topic.title}</h4>
                      <p className="text-sm text-[#5D93A9]">{topic.content}</p>
                    </div>
                    {knowledgeRead.has(topic.id) ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-[#5D93A9]/30 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-end">
              <Button
                onClick={completeCurrentStep}
                disabled={knowledgeRead.size < knowledgeTopics.length}
                className="bg-gradient-to-r from-[#0B2B3D] to-[#074C6B] text-white hover:opacity-90"
              >
                Continue to Instructions
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className={`${glassCard} rounded-2xl p-6`}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0B2B3D] to-[#074C6B] flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-[#A1D1E5]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0B2B3D] text-lg mb-1">Optional: Additional Instructions</h3>
                  <p className="text-[#5D93A9]">
                    These are supplementary materials. You can skip this step or review the checklists below.
                  </p>
                </div>
              </div>
            </div>

            {/* Checklist Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`${glassCard} rounded-2xl p-6`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#A1D1E5] to-[#5D93A9] flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-bold text-[#0B2B3D]">Pre-Onboarding</h3>
                </div>

                <div className="space-y-2">
                  {preTasks.map((task) => (
                    <label
                      key={task.id}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${task.completed ? 'bg-[#A1D1E5]/20' : 'hover:bg-[#0B2B3D]/5'
                        }`}
                    >
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => togglePreTask(task.id)}
                        className="data-[state=checked]:bg-[#074C6B] border-[#5D93A9]"
                      />
                      <span className={task.completed ? "line-through text-[#5D93A9]" : "text-[#0B2B3D]"}>
                        {task.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className={`${glassCard} rounded-2xl p-6`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#074C6B] to-[#0B2B3D] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[#A1D1E5]" />
                  </div>
                  <h3 className="font-bold text-[#0B2B3D]">First Week</h3>
                </div>

                <div className="space-y-2">
                  {weekTasks.map((task) => (
                    <label
                      key={task.id}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${task.completed ? 'bg-[#A1D1E5]/20' : 'hover:bg-[#0B2B3D]/5'
                        }`}
                    >
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleWeekTask(task.id)}
                        className="data-[state=checked]:bg-[#074C6B] border-[#5D93A9]"
                      />
                      <span className={task.completed ? "line-through text-[#5D93A9]" : "text-[#0B2B3D]"}>
                        {task.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setOnboardingStep(1)}
                className="text-[#0B2B3D]"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={completeCurrentStep}
                className="bg-gradient-to-r from-[#0B2B3D] to-[#074C6B] text-white hover:opacity-90"
              >
                Continue to Training
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className={`${glassCard} rounded-2xl p-6`}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0B2B3D] to-[#074C6B] flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-[#A1D1E5]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0B2B3D] text-lg mb-1">Alright, I've prepared your onboarding scenarios</h3>
                  <p className="text-[#5D93A9]">
                    Now it's your turn to review how to handle these {trainingQuestions.length} real situations.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#0B2B3D]/5 flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-6 h-6 text-[#5D93A9]" />
              </div>
              <div>
                <h3 className="font-bold text-[#0B2B3D] text-lg mb-1">Choose the response that feels more accurate</h3>
                <p className="text-[#5D93A9]">
                  One approach is recommended by career experts. Your choices help AURORA understand your style.
                </p>
              </div>
            </div>

            <div className={`${glassCard} rounded-2xl p-8 border-2 border-[#A1D1E5]/30`}>
              <p className="text-sm text-[#5D93A9] mb-4">
                {currentQuestion + 1} of {trainingQuestions.length}
              </p>

              <h4 className="text-xl font-bold text-[#0B2B3D] mb-6">
                {trainingQuestions[currentQuestion].question}
              </h4>

              <div className="space-y-4 mb-6">
                <button
                  onClick={() => selectAnswer('A')}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all ${answers[currentQuestion] === 'A'
                    ? 'border-[#0B2B3D] bg-[#0B2B3D]/5'
                    : 'border-[#0B2B3D]/10 hover:border-[#5D93A9]/50 bg-white/50'
                    }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <p className="text-[#0B2B3D]">{trainingQuestions[currentQuestion].optionA}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${answers[currentQuestion] === 'A'
                      ? 'border-[#0B2B3D] bg-[#0B2B3D]'
                      : 'border-[#5D93A9]/50'
                      }`}>
                      {answers[currentQuestion] === 'A' && <Check className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => selectAnswer('B')}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all ${answers[currentQuestion] === 'B'
                    ? 'border-[#0B2B3D] bg-[#0B2B3D]/5'
                    : 'border-[#0B2B3D]/10 hover:border-[#5D93A9]/50 bg-white/50'
                    }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <p className="text-[#0B2B3D]">{trainingQuestions[currentQuestion].optionB}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${answers[currentQuestion] === 'B'
                      ? 'border-[#0B2B3D] bg-[#0B2B3D]'
                      : 'border-[#5D93A9]/50'
                      }`}>
                      {answers[currentQuestion] === 'B' && <Check className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                </button>
              </div>

              <div className="mb-6">
                <label className="text-sm text-[#5D93A9] mb-2 block">Comments (optional)</label>
                <textarea
                  className="w-full p-4 rounded-xl border border-[#0B2B3D]/10 bg-white/50 resize-none h-24 focus:outline-none focus:border-[#5D93A9] text-[#0B2B3D]"
                  placeholder="Share your thoughts..."
                  value={localComments[currentQuestion] || ''}
                  onChange={(e) => setLocalComments(prev => ({ ...prev, [currentQuestion]: e.target.value }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={prevQuestion}
                  disabled={currentQuestion === 0}
                  className="text-[#0B2B3D] border-[#0B2B3D]/20 hover:bg-[#0B2B3D]/5"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <div className="flex gap-2">
                  {trainingQuestions.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestion(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${idx === currentQuestion
                        ? 'bg-[#0B2B3D] w-6'
                        : answers[idx]
                          ? 'bg-[#5D93A9]'
                          : 'bg-[#0B2B3D]/20'
                        }`}
                    />
                  ))}
                </div>

                <Button
                  onClick={nextQuestion}
                  disabled={!answers[currentQuestion]}
                  className="bg-gradient-to-r from-[#0B2B3D] to-[#074C6B] text-white hover:opacity-90"
                >
                  {currentQuestion === trainingQuestions.length - 1 ? 'Complete Training' : 'Next'}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className={`${glassCard} rounded-2xl p-8 text-center`}>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[#0B2B3D] mb-2">You're Ready to Deploy!</h2>
              <p className="text-[#5D93A9] mb-6 max-w-md mx-auto">
                Congratulations! You've completed all the onboarding steps. Your progress has been saved and you're ready to start your journey.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-[#0B2B3D] to-[#074C6B] text-white hover:opacity-90"
                >
                  Go to Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setOnboardingStep(1)}
                  className="text-[#0B2B3D]"
                >
                  Review Steps
                </Button>
              </div>
            </div>

            {/* Summary */}
            <div className={`${glassCard} rounded-2xl p-6`}>
              <h3 className="font-bold text-[#0B2B3D] mb-4">Your Onboarding Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-[#0B2B3D]/5 rounded-xl">
                  <p className="text-2xl font-bold text-[#074C6B]">{Object.keys(answers).length}</p>
                  <p className="text-sm text-[#5D93A9]">Scenarios Completed</p>
                </div>
                <div className="text-center p-4 bg-[#0B2B3D]/5 rounded-xl">
                  <p className="text-2xl font-bold text-[#074C6B]">{completedTaskCount}</p>
                  <p className="text-sm text-[#5D93A9]">Tasks Done</p>
                </div>
                <div className="text-center p-4 bg-[#0B2B3D]/5 rounded-xl">
                  <p className="text-2xl font-bold text-[#074C6B]">{completedSteps.length}</p>
                  <p className="text-sm text-[#5D93A9]">Steps Completed</p>
                </div>
                <div className="text-center p-4 bg-[#0B2B3D]/5 rounded-xl">
                  <p className="text-2xl font-bold text-emerald-500">100%</p>
                  <p className="text-sm text-[#5D93A9]">Ready</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen font-sf">
      {/* Hero Section */}
      <section className="relative pt-32 pb-12 lg:pt-40 lg:pb-16 bg-gradient-to-br from-[#0B2B3D] via-[#074C6B] to-[#0B2B3D] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#A1D1E5]/10 rounded-full blur-[100px]" />
        </div>
        <div className="container mx-auto px-6 lg:px-10 relative z-10">
          <h1 className="text-3xl lg:text-5xl font-bold text-white mb-2">Onboarding</h1>
          <p className="text-lg text-white/60">Complete your setup to get started with AURORA</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-gradient-to-b from-[#E8F4F8] via-[#F0F7FA] to-[#E8F4F8] py-10">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="max-w-4xl mx-auto">
            {/* Step Indicator */}
            <div className="flex items-center justify-between mb-12 overflow-x-auto pb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => goToStep(step.id)}
                    className="flex flex-col items-center group"
                    disabled={step.id > currentStep && !completedSteps.includes(currentStep)}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${completedSteps.includes(step.id)
                      ? 'bg-[#0B2B3D] text-white cursor-pointer'
                      : step.id === currentStep
                        ? 'bg-emerald-500 text-white ring-4 ring-emerald-100'
                        : 'bg-[#0B2B3D]/30 text-white cursor-not-allowed'
                      }`}>
                      {completedSteps.includes(step.id) ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-bold">{step.id}</span>
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <p className={`text-sm font-medium whitespace-nowrap ${step.id === currentStep ? 'text-[#0B2B3D]' : 'text-[#5D93A9]'
                        }`}>
                        {step.label}
                      </p>
                      <p className="text-xs text-[#5D93A9] hidden sm:block">{step.description}</p>
                    </div>
                  </button>

                  {index < steps.length - 1 && (
                    <div className={`w-16 lg:w-24 h-0.5 mx-2 ${completedSteps.includes(step.id) ? 'bg-[#0B2B3D]' : 'bg-[#0B2B3D]/20'
                      }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className={`${glassCard} rounded-xl p-4 mb-8`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#5D93A9]">Overall Progress</span>
                <span className="text-sm font-bold text-[#074C6B]">{Math.round((completedSteps.length / 4) * 100)}%</span>
              </div>
              <div className="h-2 bg-[#0B2B3D]/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#074C6B] to-[#5D93A9] rounded-full transition-all duration-500"
                  style={{ width: `${(completedSteps.length / 4) * 100}%` }}
                />
              </div>
            </div>

            {/* Step Content */}
            {renderStepContent()}
          </div>
        </div>
      </section>
    </div>
  );
}
