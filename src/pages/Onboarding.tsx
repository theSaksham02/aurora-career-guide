import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { BookOpen, Users, GraduationCap, Rocket, CheckCircle2, Target, Sparkles, ChevronRight, MessageSquare, HelpCircle, Check } from "lucide-react";
import { preOnboardingTasks, firstWeekTasks } from "@/data/mockData";
import { Link } from "react-router-dom";

interface Task {
  id: string;
  label: string;
  completed: boolean;
}

// Onboarding steps for stepper
const steps = [
  { id: 1, label: "Knowledge", description: "Learn the basics" },
  { id: 2, label: "Instructions", description: "(optional)" },
  { id: 3, label: "Training & Evaluation", description: "Practice scenarios" },
  { id: 4, label: "Deploy", description: "Go live" },
];

// Training questions
const trainingQuestions = [
  {
    id: 1,
    question: "How should you approach your first week at a new job?",
    optionA: "Focus on building relationships, ask questions, and observe how things work before making suggestions.",
    optionB: "Jump right in and start suggesting improvements to show your value.",
  },
  {
    id: 2,
    question: "What's the best way to handle unclear expectations?",
    optionA: "Schedule a 1-on-1 with your manager to clarify priorities and success metrics.",
    optionB: "Figure it out on your own to avoid seeming incompetent.",
  },
  {
    id: 3,
    question: "How do you build rapport with new teammates?",
    optionA: "Be genuinely curious about their work, offer help, and find common interests.",
    optionB: "Keep to yourself and focus only on your tasks.",
  },
];

// Glass card styles
const glassCard = "bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(11,43,61,0.1)]";
const glassCardDark = "bg-gradient-to-br from-[#0B2B3D] to-[#074C6B] backdrop-blur-xl border border-white/10";

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(3); // Training & Evaluation step
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B'>>({});
  const [preTasks, setPreTasks] = useState<Task[]>(preOnboardingTasks);
  const [weekTasks, setWeekTasks] = useState<Task[]>(firstWeekTasks);

  const allTasks = [...preTasks, ...weekTasks];
  const completedCount = allTasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / allTasks.length) * 100);

  const toggleTask = (id: string, isPre: boolean) => {
    if (isPre) {
      setPreTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
    } else {
      setWeekTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
    }
  };

  const selectAnswer = (option: 'A' | 'B') => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: option }));
  };

  const nextQuestion = () => {
    if (currentQuestion < trainingQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen font-sf bg-gradient-to-b from-[#F5F8FA] via-[#F0F7FA] to-[#E8F4F8]">
      {/* Header */}
      <div className="border-b border-[#0B2B3D]/10 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 lg:px-10 py-4">
          <h1 className="text-xl font-bold text-[#0B2B3D]">Onboarding</h1>
        </div>
      </div>

      {/* Stepper */}
      <div className="container mx-auto px-6 lg:px-10 py-10">
        <div className="max-w-4xl mx-auto">
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-12">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${index + 1 < currentStep
                      ? 'bg-[#0B2B3D] text-white'
                      : index + 1 === currentStep
                        ? 'bg-emerald-500 text-white ring-4 ring-emerald-100'
                        : 'bg-[#0B2B3D]/60 text-white'
                    }`}>
                    {index + 1 < currentStep ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span className="w-2 h-2 bg-current rounded-full"></span>
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={`text-sm font-medium ${index + 1 === currentStep ? 'text-[#0B2B3D]' : 'text-[#5D93A9]'}`}>
                      {step.label}
                    </p>
                    <p className="text-xs text-[#5D93A9]">{step.description}</p>
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className={`w-20 lg:w-32 h-0.5 mx-2 ${index + 1 < currentStep ? 'bg-[#0B2B3D]' : 'bg-[#0B2B3D]/20'
                    }`} />
                )}
              </div>
            ))}
          </div>

          {/* AI Message */}
          <div className={`${glassCard} rounded-2xl p-6 mb-8`}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0B2B3D] to-[#074C6B] flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-6 h-6 text-[#A1D1E5]" />
              </div>
              <div>
                <h3 className="font-bold text-[#0B2B3D] text-lg mb-1">Alright, I've prepared your onboarding scenarios</h3>
                <p className="text-[#5D93A9]">
                  Now it's your turn to review how to handle these {trainingQuestions.length} real situations and help improve your approach.
                </p>
              </div>
            </div>
          </div>

          {/* Question Instructions */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#0B2B3D]/5 flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-6 h-6 text-[#5D93A9]" />
            </div>
            <div>
              <h3 className="font-bold text-[#0B2B3D] text-lg mb-1">Choose the response that feels more accurate and helpful</h3>
              <p className="text-[#5D93A9]">
                One approach is recommended by career experts — but we'll keep it anonymous to avoid bias.
                Your choices help AURORA understand your style.
              </p>
            </div>
          </div>

          {/* Question Card */}
          <div className={`${glassCard} rounded-2xl p-8 border-2 border-[#A1D1E5]/30`}>
            {/* Progress */}
            <p className="text-sm text-[#5D93A9] mb-4">
              {currentQuestion + 1} of {trainingQuestions.length}
            </p>

            {/* Question */}
            <h4 className="text-xl font-bold text-[#0B2B3D] mb-6">
              {trainingQuestions[currentQuestion].question}
            </h4>

            {/* Options */}
            <div className="space-y-4 mb-6">
              {/* Option A */}
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

              {/* Option B */}
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

            {/* Comments */}
            <div className="mb-6">
              <label className="text-sm text-[#5D93A9] mb-2 block">Comments (optional)</label>
              <textarea
                className="w-full p-4 rounded-xl border border-[#0B2B3D]/10 bg-white/50 resize-none h-24 focus:outline-none focus:border-[#5D93A9] text-[#0B2B3D]"
                placeholder="Share your thoughts..."
              />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                className="text-[#0B2B3D] border-[#0B2B3D]/20 hover:bg-[#0B2B3D]/5"
              >
                Previous
              </Button>

              <div className="flex gap-2">
                {trainingQuestions.map((_, idx) => (
                  <div
                    key={idx}
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
                {currentQuestion === trainingQuestions.length - 1 ? 'Complete' : 'Next'}
              </Button>
            </div>
          </div>

          {/* Checklist Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-[#0B2B3D] mb-6">Your Onboarding Checklist</h2>

            {/* Progress Bar */}
            <div className={`${glassCard} rounded-2xl p-6 mb-6`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[#0B2B3D] font-medium">Progress</span>
                <span className="text-[#074C6B] font-bold">{progressPercent}%</span>
              </div>
              <div className="h-3 bg-[#0B2B3D]/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#074C6B] to-[#5D93A9] rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Checklist Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pre-Onboarding */}
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
                        onCheckedChange={() => toggleTask(task.id, true)}
                        className="data-[state=checked]:bg-[#074C6B] border-[#5D93A9]"
                      />
                      <span className={task.completed ? "line-through text-[#5D93A9]" : "text-[#0B2B3D]"}>
                        {task.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* First Week */}
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
                        onCheckedChange={() => toggleTask(task.id, false)}
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
          </div>
        </div>
      </div>
    </div>
  );
}
