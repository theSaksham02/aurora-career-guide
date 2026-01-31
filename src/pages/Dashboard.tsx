import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Edit3, Check, X, Plus, Trash2,
  Target, Sparkles, Loader2,
  FileText,
  MessageSquare, Send,
  TrendingUp, Briefcase, Clock, Settings,
  Calendar, ChevronRight, Play, Pause, RotateCcw,
  GraduationCap, Rocket, Users, BarChart3, BookOpen,
  Zap, Award, ArrowRight, Star, Layers
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { careerAgent, AgentMessage, CareerStage } from "@/lib/career-agent";
import { toast } from "sonner";

// Template types
type TemplateId = 'explorer' | 'jobseeker' | 'professional' | 'onboarding' | 'pivot';

interface DashboardTemplate {
  id: TemplateId;
  name: string;
  description: string;
  icon: any;
  color: string;
  widgets: string[];
  aiPrompts: string[];
}

const templates: DashboardTemplate[] = [
  {
    id: 'explorer',
    name: 'Career Explorer',
    description: 'Discover roles, understand requirements, build roadmap',
    icon: GraduationCap,
    color: 'from-blue-500 to-indigo-600',
    widgets: ['interests', 'skills', 'resources', 'trends', 'ai'],
    aiPrompts: ['What skills do I need?', 'Suggest career paths', 'Industry insights'],
  },
  {
    id: 'jobseeker',
    name: 'Job Seeker',
    description: 'Track applications, prep for interviews, optimize profile',
    icon: Briefcase,
    color: 'from-emerald-500 to-teal-600',
    widgets: ['pipeline', 'interview', 'resume', 'recommendations', 'ai'],
    aiPrompts: ['Interview prep', 'Improve my resume', 'Cover letter help'],
  },
  {
    id: 'professional',
    name: 'Professional Growth',
    description: 'Advance career, identify next moves, negotiate better',
    icon: Rocket,
    color: 'from-purple-500 to-pink-600',
    widgets: ['progression', 'salary', 'promotion', 'metrics', 'ai'],
    aiPrompts: ['Promotion readiness', 'Salary negotiation', 'Leadership skills'],
  },
  {
    id: 'onboarding',
    name: 'New Role Success',
    description: 'Excel in first 90 days, build relationships, hit milestones',
    icon: Star,
    color: 'from-amber-500 to-orange-600',
    widgets: ['plan90', 'team', 'checklist', 'quickwins', 'ai'],
    aiPrompts: ['Week 1 focus', 'Build credibility', 'Quick wins'],
  },
  {
    id: 'pivot',
    name: 'Career Pivot',
    description: 'Explore new directions, identify transferable skills',
    icon: Layers,
    color: 'from-rose-500 to-red-600',
    widgets: ['options', 'transferable', 'roadmap', 'stories', 'ai'],
    aiPrompts: ['Transition options', 'Transferable skills', 'Pivot timeline'],
  },
];

// Map user stage to agent stage
const mapUserStage = (stage: string): CareerStage => {
  const stageMap: Record<string, CareerStage> = {
    'Student': 'student',
    'Intern': 'intern_jobseeker',
    'Professional': 'professional',
  };
  return stageMap[stage] || 'unknown';
};

// Glassmorphism style
const glassCard = "bg-white/60 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(11,43,61,0.08)]";

// Task type
interface Task {
  id: string;
  title: string;
  completed: boolean;
  date: string;
}

export default function Dashboard() {
  const { profile, applications, onboarding } = useUser();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Template selection
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>(() => {
    const saved = localStorage.getItem('aurora_template');
    return (saved as TemplateId) || 'jobseeker';
  });
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  // Edit mode
  const [isEditMode, setIsEditMode] = useState(false);

  // Tasks
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('aurora_tasks');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Complete Profile', completed: true, date: 'Jan 25' },
      { id: '2', title: 'Skills Assessment', completed: true, date: 'Jan 25' },
      { id: '3', title: 'Set Career Goals', completed: false, date: 'Jan 26' },
      { id: '4', title: 'Upload Resume', completed: false, date: 'Jan 26' },
    ];
  });
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Timer
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(1500);

  // AI Chat
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [input, setInput] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  // Stats
  const acceptedApps = applications.filter(a => a.status === 'accepted').length;
  const pendingApps = applications.filter(a => a.status === 'pending').length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const currentTemplate = templates.find(t => t.id === selectedTemplate)!;

  // Save template
  useEffect(() => {
    localStorage.setItem('aurora_template', selectedTemplate);
  }, [selectedTemplate]);

  // Save tasks
  useEffect(() => {
    localStorage.setItem('aurora_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds(s => s - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Initialize AI
  useEffect(() => {
    if (!isInitialized) {
      const userStage = mapUserStage(profile.stage);
      careerAgent.setStage(userStage);
      const greeting = careerAgent.getGreeting(profile.name);
      setMessages([greeting]);
      setIsInitialized(true);
    }
  }, [isInitialized, profile]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage: AgentMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    try {
      const response = await careerAgent.processMessage(input);
      setMessages(prev => [...prev, response]);
    } catch {
      toast.error("Failed to get response");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (action: string) => {
    if (isLoading) return;
    setInput(action);
    setIsLoading(true);
    const userMessage: AgentMessage = {
      id: Date.now().toString(),
      role: "user",
      content: action,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    try {
      const response = await careerAgent.processMessage(action);
      setMessages(prev => [...prev, response]);
    } catch {
      toast.error("Failed to get response");
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  // Task controls
  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    setTasks(prev => [...prev, {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }]);
    setNewTaskTitle('');
    toast.success('Task added!');
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const selectTemplate = (id: TemplateId) => {
    setSelectedTemplate(id);
    setShowTemplateSelector(false);
    toast.success(`Switched to ${templates.find(t => t.id === id)?.name} template`);
  };

  // Template-specific widgets
  const renderTemplateWidgets = () => {
    switch (selectedTemplate) {
      case 'explorer':
        return (
          <>
            {/* Career Interests */}
            <div className={`${glassCard} rounded-3xl p-6`}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-[#0B2B3D] text-lg">Career Interests</h3>
              </div>
              <div className="space-y-3">
                {profile.interests.length > 0 ? profile.interests.map((interest, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-blue-50/50 rounded-xl">
                    <span className="text-[#0B2B3D] font-medium">{interest}</span>
                    <Badge className="bg-blue-100 text-blue-700">Match: {85 - i * 10}%</Badge>
                  </div>
                )) : (
                  <p className="text-[#5D93A9]">Set your interests in Profile</p>
                )}
              </div>
              <Link to="/profile" className="block mt-4">
                <Button variant="outline" className="w-full">Update Interests</Button>
              </Link>
            </div>

            {/* Skill Gap Analysis */}
            <div className={`${glassCard} rounded-3xl p-6`}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-[#0B2B3D] text-lg">Skill Progress</h3>
              </div>
              {[
                { skill: 'Technical Skills', progress: 75 },
                { skill: 'Communication', progress: 85 },
                { skill: 'Leadership', progress: 60 },
                { skill: 'Problem Solving', progress: 90 },
              ].map(item => (
                <div key={item.skill} className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#0B2B3D] font-medium">{item.skill}</span>
                    <span className="text-[#5D93A9]">{item.progress}%</span>
                  </div>
                  <div className="h-2 bg-[#0B2B3D]/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Learning Resources */}
            <div className={`${glassCard} rounded-3xl p-6`}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-[#0B2B3D] text-lg">Learning Resources</h3>
              </div>
              <div className="space-y-3">
                {[
                  { title: 'Introduction to Product Management', type: 'Course', time: '4 hrs' },
                  { title: 'System Design Interview', type: 'Book', time: '8 hrs' },
                  { title: 'Career Growth Strategies', type: 'Video', time: '1 hr' },
                ].map((resource, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-xl hover:bg-emerald-100/50 cursor-pointer transition-colors">
                    <div className="flex-1">
                      <p className="text-[#0B2B3D] font-medium text-sm">{resource.title}</p>
                      <p className="text-xs text-[#5D93A9]">{resource.type} • {resource.time}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#5D93A9]" />
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      case 'jobseeker':
        return (
          <>
            {/* Application Pipeline */}
            <div className={`${glassCard} rounded-3xl p-6`}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-[#0B2B3D] text-lg">Application Pipeline</h3>
                </div>
                <Link to="/applications">
                  <Button size="sm" variant="outline">View All</Button>
                </Link>
              </div>
              <div className="grid grid-cols-4 gap-3 text-center">
                {[
                  { label: 'Applied', count: applications.length, color: 'bg-blue-100 text-blue-700' },
                  { label: 'Screening', count: pendingApps, color: 'bg-amber-100 text-amber-700' },
                  { label: 'Interview', count: 2, color: 'bg-purple-100 text-purple-700' },
                  { label: 'Offer', count: acceptedApps, color: 'bg-emerald-100 text-emerald-700' },
                ].map(stage => (
                  <div key={stage.label} className={`p-3 rounded-xl ${stage.color.split(' ')[0]}`}>
                    <p className={`text-2xl font-bold ${stage.color.split(' ')[1]}`}>{stage.count}</p>
                    <p className="text-xs text-[#5D93A9]">{stage.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Interview Prep */}
            <div className={`${glassCard} rounded-3xl p-6`}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-[#0B2B3D] text-lg">Interview Prep</h3>
              </div>
              <div className="space-y-3">
                {[
                  { q: 'Tell me about yourself', difficulty: 'Easy' },
                  { q: 'Biggest challenge you faced?', difficulty: 'Medium' },
                  { q: 'Why should we hire you?', difficulty: 'Hard' },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickAction(`Help me answer: ${item.q}`)}
                    className="w-full flex items-center justify-between p-3 bg-purple-50/50 rounded-xl hover:bg-purple-100/50 transition-colors text-left"
                  >
                    <span className="text-[#0B2B3D] text-sm font-medium">{item.q}</span>
                    <Badge className={item.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' : item.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}>
                      {item.difficulty}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>

            {/* Resume Score */}
            <div className={`${glassCard} rounded-3xl p-6`}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-[#0B2B3D] text-lg">Resume Optimizer</h3>
              </div>
              <div className="text-center py-4">
                <div className="text-5xl font-bold text-[#0B2B3D] mb-2">78%</div>
                <p className="text-sm text-[#5D93A9] mb-4">Resume Match Score</p>
                <Button onClick={() => handleQuickAction("Analyze my resume and suggest improvements")} className="bg-gradient-to-r from-amber-500 to-orange-600">
                  <Zap className="w-4 h-4 mr-2" />
                  Optimize Resume
                </Button>
              </div>
            </div>
          </>
        );

      case 'professional':
        return (
          <>
            {/* Career Progression */}
            <div className={`${glassCard} rounded-3xl p-6`}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-[#0B2B3D] text-lg">Career Progression</h3>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-pink-500" />
                {[
                  { role: 'Junior Developer', status: 'completed', year: '2022' },
                  { role: 'Mid-Level Developer', status: 'current', year: '2024' },
                  { role: 'Senior Developer', status: 'next', year: '2026' },
                  { role: 'Tech Lead', status: 'future', year: '2028' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 mb-4 relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${item.status === 'completed' ? 'bg-emerald-500 text-white' :
                        item.status === 'current' ? 'bg-purple-500 text-white ring-4 ring-purple-200' :
                          'bg-gray-200 text-gray-500'
                      }`}>
                      {item.status === 'completed' ? <Check className="w-4 h-4" /> : i + 1}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${item.status === 'current' ? 'text-purple-700' : 'text-[#0B2B3D]'}`}>{item.role}</p>
                      <p className="text-xs text-[#5D93A9]">{item.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Salary Intelligence */}
            <div className={`${glassCard} rounded-3xl p-6`}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-[#0B2B3D] text-lg">Salary Intelligence</h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50/50 rounded-xl">
                  <p className="text-sm text-[#5D93A9]">Your estimated market rate</p>
                  <p className="text-3xl font-bold text-[#0B2B3D]">$95,000 - $125,000</p>
                </div>
                <Button onClick={() => handleQuickAction("Help me negotiate my salary")} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600">
                  Negotiation Assistant
                </Button>
              </div>
            </div>

            {/* Promotion Readiness */}
            <div className={`${glassCard} rounded-3xl p-6`}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-[#0B2B3D] text-lg">Promotion Readiness</h3>
              </div>
              <div className="text-center py-4">
                <div className="text-5xl font-bold text-amber-600 mb-2">72%</div>
                <p className="text-sm text-[#5D93A9] mb-4">Ready for Senior Role</p>
                <Button onClick={() => handleQuickAction("What skills do I need for promotion?")} variant="outline">
                  View Gap Analysis
                </Button>
              </div>
            </div>
          </>
        );

      case 'onboarding':
        return (
          <>
            {/* 30-60-90 Day Plan */}
            <div className={`${glassCard} rounded-3xl p-6`}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-[#0B2B3D] text-lg">30-60-90 Day Plan</h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { days: '30', focus: 'Learn & Listen', progress: 80 },
                  { days: '60', focus: 'Contribute', progress: 40 },
                  { days: '90', focus: 'Lead', progress: 10 },
                ].map(phase => (
                  <div key={phase.days} className="p-4 bg-amber-50/50 rounded-xl text-center">
                    <p className="text-2xl font-bold text-amber-600">{phase.days}</p>
                    <p className="text-xs text-[#5D93A9] mb-2">Days</p>
                    <p className="text-sm font-medium text-[#0B2B3D]">{phase.focus}</p>
                    <div className="h-1 bg-amber-200 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${phase.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Directory */}
            <div className={`${glassCard} rounded-3xl p-6`}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-[#0B2B3D] text-lg">Key Stakeholders</h3>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Sarah Chen', role: 'Manager', status: 'Schedule 1:1' },
                  { name: 'Mike Rodriguez', role: 'Mentor', status: 'Connected' },
                  { name: 'Lisa Park', role: 'Team Lead', status: 'Intro pending' },
                ].map((person, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                      {person.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[#0B2B3D]">{person.name}</p>
                      <p className="text-xs text-[#5D93A9]">{person.role}</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700">{person.status}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Wins */}
            <div className={`${glassCard} rounded-3xl p-6`}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-[#0B2B3D] text-lg">Quick Wins</h3>
              </div>
              <div className="space-y-3">
                {[
                  'Fix a small bug in the codebase',
                  'Document an undocumented process',
                  'Improve an existing test coverage',
                ].map((win, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-xl">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                      <span className="text-sm font-bold text-emerald-600">{i + 1}</span>
                    </div>
                    <span className="text-sm text-[#0B2B3D]">{win}</span>
                  </div>
                ))}
                <Button onClick={() => handleQuickAction("What quick wins can I achieve in my first week?")} variant="outline" className="w-full">
                  Get More Ideas
                </Button>
              </div>
            </div>
          </>
        );

      case 'pivot':
        return (
          <>
            {/* Pivot Options */}
            <div className={`${glassCard} rounded-3xl p-6`}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-[#0B2B3D] text-lg">Pivot Options</h3>
              </div>
              <div className="space-y-3">
                {[
                  { path: 'Product Management', match: 85, difficulty: 'Medium' },
                  { path: 'UX Design', match: 72, difficulty: 'Hard' },
                  { path: 'Data Analytics', match: 68, difficulty: 'Medium' },
                ].map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickAction(`Tell me about transitioning to ${option.path}`)}
                    className="w-full flex items-center justify-between p-4 bg-rose-50/50 rounded-xl hover:bg-rose-100/50 transition-colors text-left"
                  >
                    <div>
                      <p className="font-medium text-[#0B2B3D]">{option.path}</p>
                      <p className="text-xs text-[#5D93A9]">Difficulty: {option.difficulty}</p>
                    </div>
                    <Badge className="bg-rose-100 text-rose-700">{option.match}% Match</Badge>
                  </button>
                ))}
              </div>
            </div>

            {/* Transferable Skills */}
            <div className={`${glassCard} rounded-3xl p-6`}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-[#0B2B3D] text-lg">Transferable Skills</h3>
              </div>
              {[
                { skill: 'Problem Solving', value: 95 },
                { skill: 'Communication', value: 88 },
                { skill: 'Project Management', value: 75 },
                { skill: 'Technical Knowledge', value: 82 },
              ].map(item => (
                <div key={item.skill} className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#0B2B3D] font-medium">{item.skill}</span>
                    <span className="text-[#5D93A9]">{item.value}%</span>
                  </div>
                  <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Transition Timeline */}
            <div className={`${glassCard} rounded-3xl p-6`}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-[#0B2B3D] text-lg">Transition Timeline</h3>
              </div>
              <div className="text-center py-4">
                <p className="text-sm text-[#5D93A9] mb-2">Estimated time to transition</p>
                <p className="text-4xl font-bold text-[#0B2B3D]">6-12 months</p>
                <Button onClick={() => handleQuickAction("Create a detailed transition plan for my career pivot")} className="mt-4 bg-gradient-to-r from-amber-500 to-orange-600">
                  Create Roadmap
                </Button>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen font-sf">
      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${glassCard} rounded-3xl p-8 w-full max-w-3xl max-h-[80vh] overflow-y-auto`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#0B2B3D]">Choose Your Dashboard Template</h2>
              <button onClick={() => setShowTemplateSelector(false)} className="p-2 hover:bg-[#0B2B3D]/10 rounded-xl">
                <X className="w-6 h-6 text-[#5D93A9]" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map(template => (
                <button
                  key={template.id}
                  onClick={() => selectTemplate(template.id)}
                  className={`p-5 rounded-2xl text-left transition-all ${selectedTemplate === template.id
                      ? `bg-gradient-to-br ${template.color} text-white shadow-lg`
                      : 'bg-white hover:shadow-md border border-gray-100'
                    }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <template.icon className={`w-8 h-8 ${selectedTemplate === template.id ? 'text-white' : 'text-[#074C6B]'}`} />
                    <h3 className={`font-bold text-lg ${selectedTemplate === template.id ? 'text-white' : 'text-[#0B2B3D]'}`}>
                      {template.name}
                    </h3>
                  </div>
                  <p className={`text-sm ${selectedTemplate === template.id ? 'text-white/80' : 'text-[#5D93A9]'}`}>
                    {template.description}
                  </p>
                  {selectedTemplate === template.id && (
                    <div className="mt-3 flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-medium">Currently Active</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <section className={`relative py-12 lg:py-20 bg-gradient-to-br ${currentTemplate.color} overflow-hidden`}>
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-[80px]" />
        </div>

        <div className="container mx-auto px-6 lg:px-10 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <button
                onClick={() => setShowTemplateSelector(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-semibold mb-4 hover:bg-white/30 transition-colors"
              >
                <currentTemplate.icon className="w-4 h-4" />
                {currentTemplate.name}
                <ChevronRight className="w-4 h-4" />
              </button>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                Welcome, {profile.name} 👋
              </h1>
              <p className="text-xl text-white/70 max-w-lg">
                {currentTemplate.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => setShowTemplateSelector(true)}
                className="rounded-xl px-6 py-6 font-semibold bg-white/20 backdrop-blur-sm text-white border border-white/20 hover:bg-white/30 transition-all"
              >
                <Layers className="w-5 h-5 mr-2" />
                Change Template
              </Button>
              <Link to="/profile">
                <Button className="rounded-xl px-6 py-6 font-semibold bg-white text-[#0B2B3D] hover:bg-white/90 transition-all">
                  <Settings className="w-5 h-5 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-10 lg:py-16 bg-gradient-to-b from-[#E8F4F8] via-[#F0F7FA] to-[#E8F4F8]">
        <div className="container mx-auto px-6 lg:px-10">
          {/* Template Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
            {renderTemplateWidgets()}
          </div>

          {/* AI Assistant - Always visible */}
          <div className={`${glassCard} rounded-3xl p-6 border-2 border-[#A1D1E5]/40`}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${currentTemplate.color} flex items-center justify-center shadow-lg`}>
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0B2B3D] text-lg">AURORA AI</h3>
                  <p className="text-xs text-[#5D93A9]">{currentTemplate.name} Assistant</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chat */}
              <div>
                <ScrollArea className="h-48 mb-4 p-3 bg-[#0B2B3D]/5 rounded-2xl">
                  <div className="space-y-3">
                    {messages.slice(-6).map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-3 rounded-xl text-sm ${msg.role === 'user'
                            ? `bg-gradient-to-r ${currentTemplate.color} text-white ml-8`
                            : 'bg-white text-[#0B2B3D] shadow-sm'
                          }`}
                      >
                        {msg.content.length > 200 ? msg.content.slice(0, 200) + '...' : msg.content}
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex items-center gap-2 text-sm text-[#5D93A9] p-3">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Thinking...
                      </div>
                    )}
                    <div ref={scrollRef} />
                  </div>
                </ScrollArea>

                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Ask AURORA anything..."
                    className="text-sm border-[#A1D1E5]/50 focus:border-[#074C6B]"
                    disabled={isLoading}
                  />
                  <Button onClick={handleSend} disabled={isLoading} className={`bg-gradient-to-r ${currentTemplate.color} text-white`}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <p className="text-sm font-medium text-[#5D93A9] mb-3">Suggested for {currentTemplate.name}</p>
                <div className="space-y-2">
                  {currentTemplate.aiPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuickAction(prompt)}
                      disabled={isLoading}
                      className="w-full flex items-center gap-3 p-3 bg-[#0B2B3D]/5 hover:bg-[#0B2B3D]/10 rounded-xl transition-colors text-left disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4 text-[#074C6B]" />
                      <span className="text-sm text-[#0B2B3D] font-medium">{prompt}</span>
                      <ArrowRight className="w-4 h-4 text-[#5D93A9] ml-auto" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/applications" className={`${glassCard} flex items-center gap-4 p-6 rounded-2xl hover:shadow-lg transition-all group`}>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#A1D1E5] to-[#5D93A9] flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-[#0B2B3D] text-lg">Applications</p>
                <p className="text-sm text-[#5D93A9]">{applications.length} total</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#5D93A9] group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link to="/onboarding" className={`${glassCard} flex items-center gap-4 p-6 rounded-2xl hover:shadow-lg transition-all group`}>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-[#0B2B3D] text-lg">Onboarding</p>
                <p className="text-sm text-[#5D93A9]">Continue setup</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#5D93A9] group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link to="/career-exploration" className={`${glassCard} flex items-center gap-4 p-6 rounded-2xl hover:shadow-lg transition-all group`}>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-[#0B2B3D] text-lg">Explore Careers</p>
                <p className="text-sm text-[#5D93A9]">Find your path</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#5D93A9] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
