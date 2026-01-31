import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ChevronDown, ChevronRight, Play, Pause,
  CheckCircle2, Target, Sparkles, Loader2,
  GraduationCap, Laptop, FileText, Users, Award, 
  Timer, MessageSquare, Send, Calendar, BookOpen,
  TrendingUp, Briefcase, Clock
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { mockUser, mockApplications } from "@/data/mockData";
import { careerAgent, AgentMessage, CareerStage } from "@/lib/career-agent";
import { useToast } from "@/hooks/use-toast";

// Map user stage to agent stage
const mapUserStage = (stage: string): CareerStage => {
  const stageMap: Record<string, CareerStage> = {
    'Student': 'student',
    'Intern/Job Seeker': 'intern_jobseeker',
    'Professional': 'professional',
  };
  return stageMap[stage] || 'unknown';
};

// Progress bar chart data
const progressData = [
  { day: 'S', value: 30 },
  { day: 'M', value: 65 },
  { day: 'T', value: 45 },
  { day: 'W', value: 80 },
  { day: 'T', value: 55 },
  { day: 'F', value: 70 },
  { day: 'S', value: 40 },
];

// Career tasks
const careerTasks = [
  { id: 1, icon: MessageSquare, title: "Complete Profile", date: "Jan 25", completed: true },
  { id: 2, icon: Sparkles, title: "Skills Assessment", date: "Jan 25", completed: true },
  { id: 3, icon: Target, title: "Set Career Goals", date: "Jan 26", completed: false },
  { id: 4, icon: FileText, title: "Upload Resume", date: "Jan 26", completed: false },
  { id: 5, icon: Users, title: "Connect LinkedIn", date: "Jan 27", completed: false },
  { id: 6, icon: BookOpen, title: "Complete Tutorial", date: "Jan 28", completed: false },
];

export default function Dashboard() {
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [input, setInput] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    skills: true,
    resources: false,
    goals: false,
  });
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(155); // 2:35

  // Calculate stats
  const pendingApps = mockApplications.filter(a => a.status === 'pending').length;
  const acceptedApps = mockApplications.filter(a => a.status === 'accepted').length;
  const completedTasks = careerTasks.filter(t => t.completed).length;
  const totalTasks = careerTasks.length;
  const onboardingPercent = Math.round((completedTasks / totalTasks) * 100);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(s => s - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Initialize with greeting
  useEffect(() => {
    if (!isInitialized) {
      const userStage = mapUserStage(mockUser.stage);
      careerAgent.setStage(userStage);
      const greeting = careerAgent.getGreeting(mockUser.name);
      setMessages([greeting]);
      setIsInitialized(true);
    }
  }, [isInitialized]);

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
    } catch (error) {
      toast({ title: "Error", description: "Failed to get response.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (action: string) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await careerAgent.processMessage(action);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      toast({ title: "Error", description: "Failed to get response.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Glass card styles
  const glassCard = "bg-white/60 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(11,43,61,0.08)]";
  const glassCardDark = "bg-gradient-to-br from-[#0B2B3D]/90 to-[#074C6B]/90 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(11,43,61,0.3)]";

  return (
    <div className="min-h-screen">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 pb-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <p className="text-[#5D93A9] text-sm font-medium mb-1">Welcome back</p>
              <h1 className="text-3xl lg:text-4xl font-bold text-[#0B2B3D]">
                {mockUser.name} 👋
              </h1>
              <p className="text-[#5D93A9] mt-2">Let's continue building your career path</p>
            </div>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap items-center gap-3">
              <div className={`${glassCard} px-5 py-3 rounded-2xl flex items-center gap-3`}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A1D1E5] to-[#5D93A9] flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#0B2B3D]">{mockUser.careerReadinessScore}%</p>
                  <p className="text-xs text-[#5D93A9]">Career Ready</p>
                </div>
              </div>
              <div className={`${glassCard} px-5 py-3 rounded-2xl flex items-center gap-3`}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#074C6B] to-[#0B2B3D] flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#0B2B3D]">{mockApplications.length}</p>
                  <p className="text-xs text-[#5D93A9]">Applications</p>
                </div>
              </div>
              <div className={`${glassCard} px-5 py-3 rounded-2xl flex items-center gap-3`}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#0B2B3D]">{acceptedApps}</p>
                  <p className="text-xs text-[#5D93A9]">Accepted</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left Column - Profile & Navigation */}
          <div className="lg:col-span-3 space-y-5">
            {/* Profile Card */}
            <div className={`${glassCardDark} rounded-3xl overflow-hidden`}>
              <div className="p-6 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#A1D1E5] to-[#5D93A9] flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg">
                  {mockUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="font-bold text-white text-lg">{mockUser.name}</h3>
                <p className="text-[#A1D1E5] text-sm">{mockUser.stage}</p>
                
                <div className="w-full mt-5 pt-5 border-t border-white/10">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/60">Profile Completion</span>
                    <span className="text-[#A1D1E5] font-semibold">{onboardingPercent}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#A1D1E5] to-[#5D93A9] rounded-full transition-all duration-500"
                      style={{ width: `${onboardingPercent}%` }}
                    />
                  </div>
                </div>
                
                <Link to="/profile" className="w-full mt-4">
                  <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl">
                    View Profile
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className={`${glassCard} rounded-3xl p-5`}>
              <h3 className="font-semibold text-[#0B2B3D] mb-4">Quick Links</h3>
              
              {/* Skills */}
              <button 
                onClick={() => toggleSection('skills')}
                className="w-full flex items-center justify-between p-3 hover:bg-[#0B2B3D]/5 rounded-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#A1D1E5]/30 to-[#5D93A9]/30 flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-[#074C6B]" />
                  </div>
                  <span className="font-medium text-[#0B2B3D]">Skills</span>
                </div>
                {expandedSections.skills ? <ChevronDown className="w-4 h-4 text-[#5D93A9]" /> : <ChevronRight className="w-4 h-4 text-[#5D93A9]" />}
              </button>
              {expandedSections.skills && (
                <div className="ml-12 mb-2 p-3 bg-[#0B2B3D]/5 rounded-xl">
                  <p className="text-sm text-[#5D93A9]">Technical Skills: 75%</p>
                  <div className="h-1.5 bg-[#0B2B3D]/10 rounded-full mt-2 overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-[#074C6B] to-[#5D93A9] rounded-full" />
                  </div>
                </div>
              )}

              {/* Resources */}
              <button 
                onClick={() => toggleSection('resources')}
                className="w-full flex items-center justify-between p-3 hover:bg-[#0B2B3D]/5 rounded-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#A1D1E5]/30 to-[#5D93A9]/30 flex items-center justify-center">
                    <Laptop className="w-4 h-4 text-[#074C6B]" />
                  </div>
                  <span className="font-medium text-[#0B2B3D]">Resources</span>
                </div>
                {expandedSections.resources ? <ChevronDown className="w-4 h-4 text-[#5D93A9]" /> : <ChevronRight className="w-4 h-4 text-[#5D93A9]" />}
              </button>
              {expandedSections.resources && (
                <Link to="/onboarding" className="block ml-12 mb-2 p-3 bg-[#0B2B3D]/5 rounded-xl hover:bg-[#0B2B3D]/10 transition-colors">
                  <p className="text-sm font-medium text-[#0B2B3D]">Resume Builder →</p>
                </Link>
              )}

              {/* Goals */}
              <button 
                onClick={() => toggleSection('goals')}
                className="w-full flex items-center justify-between p-3 hover:bg-[#0B2B3D]/5 rounded-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#A1D1E5]/30 to-[#5D93A9]/30 flex items-center justify-center">
                    <Target className="w-4 h-4 text-[#074C6B]" />
                  </div>
                  <span className="font-medium text-[#0B2B3D]">Goals</span>
                </div>
                {expandedSections.goals ? <ChevronDown className="w-4 h-4 text-[#5D93A9]" /> : <ChevronRight className="w-4 h-4 text-[#5D93A9]" />}
              </button>
              {expandedSections.goals && (
                <Link to="/career-exploration" className="block ml-12 mb-2 p-3 bg-[#0B2B3D]/5 rounded-xl hover:bg-[#0B2B3D]/10 transition-colors">
                  <p className="text-sm font-medium text-[#0B2B3D]">Set Career Goals →</p>
                </Link>
              )}
            </div>
          </div>

          {/* Middle Column - Main Content */}
          <div className="lg:col-span-6 space-y-5">
            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Progress Card */}
              <div className={`${glassCard} rounded-3xl p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#0B2B3D]">Weekly Progress</h3>
                  <Link to="/applications" className="text-xs text-[#5D93A9] hover:text-[#074C6B] font-medium">
                    View All →
                  </Link>
                </div>
                <div className="flex items-baseline gap-2 mb-5">
                  <span className="text-4xl font-bold text-[#0B2B3D]">{mockUser.careerReadinessScore}</span>
                  <span className="text-sm text-[#5D93A9]">% this week</span>
                  <span className="ml-auto text-xs text-emerald-500 font-medium bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
                </div>
                {/* Bar Chart */}
                <div className="flex items-end justify-between h-20 gap-2">
                  {progressData.map((item, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div 
                        className={`w-full rounded-lg transition-all duration-500 ${
                          i === 3 
                            ? 'bg-gradient-to-t from-[#0B2B3D] to-[#074C6B]' 
                            : 'bg-gradient-to-t from-[#A1D1E5]/60 to-[#A1D1E5]'
                        }`}
                        style={{ height: `${item.value}%` }}
                      />
                      <span className="text-xs text-[#5D93A9]">{item.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Focus Time Card */}
              <div className={`${glassCard} rounded-3xl p-6`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-[#0B2B3D]">Focus Timer</h3>
                  <Clock className="w-4 h-4 text-[#5D93A9]" />
                </div>
                {/* Circular Progress */}
                <div className="relative w-32 h-32 mx-auto my-3">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
                    <circle cx="64" cy="64" r="54" stroke="rgba(161,209,229,0.3)" strokeWidth="10" fill="none" />
                    <circle 
                      cx="64" cy="64" r="54" 
                      stroke="url(#timerGradient)" strokeWidth="10" fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 54 * (timerSeconds / 300)} ${2 * Math.PI * 54}`}
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#074C6B" />
                        <stop offset="100%" stopColor="#A1D1E5" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-[#0B2B3D]">{formatTime(timerSeconds)}</span>
                    <span className="text-xs text-[#5D93A9]">{timerActive ? 'Focus Mode' : 'Paused'}</span>
                  </div>
                </div>
                {/* Controls */}
                <div className="flex items-center justify-center gap-3 mt-2">
                  <button 
                    onClick={() => setTimerActive(true)}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      timerActive 
                        ? 'bg-[#0B2B3D]/10 text-[#5D93A9]' 
                        : 'bg-gradient-to-br from-[#074C6B] to-[#0B2B3D] text-white shadow-lg hover:scale-105'
                    }`}
                  >
                    <Play className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setTimerActive(false)}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      !timerActive 
                        ? 'bg-[#0B2B3D]/10 text-[#5D93A9]' 
                        : 'bg-gradient-to-br from-[#074C6B] to-[#0B2B3D] text-white shadow-lg hover:scale-105'
                    }`}
                  >
                    <Pause className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setTimerSeconds(1500)}
                    className="w-11 h-11 rounded-xl bg-[#A1D1E5]/30 flex items-center justify-center hover:bg-[#A1D1E5]/50 transition-all duration-300"
                  >
                    <Timer className="w-5 h-5 text-[#074C6B]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Calendar Card */}
            <div className={`${glassCard} rounded-3xl p-6`}>
              <div className="flex items-center gap-3 mb-5">
                <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#0B2B3D] to-[#074C6B] text-white text-sm font-medium shadow-lg">
                  This Week
                </button>
                <span className="text-[#0B2B3D] font-semibold">January 2026</span>
                <button className="px-4 py-2 rounded-xl bg-[#0B2B3D]/5 text-[#5D93A9] text-sm font-medium hover:bg-[#0B2B3D]/10 transition-colors">
                  Next Week
                </button>
              </div>
              
              {/* Week Days */}
              <div className="grid grid-cols-5 gap-3 mb-5">
                {[
                  { day: 'Mon', date: 27 },
                  { day: 'Tue', date: 28 },
                  { day: 'Wed', date: 29 },
                  { day: 'Thu', date: 30 },
                  { day: 'Fri', date: 31, active: true },
                ].map((item) => (
                  <div key={item.day} className="text-center">
                    <p className="text-xs text-[#5D93A9] mb-2">{item.day}</p>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto font-semibold transition-all duration-300 ${
                      item.active 
                        ? 'bg-gradient-to-br from-[#0B2B3D] to-[#074C6B] text-white shadow-lg' 
                        : 'text-[#0B2B3D] hover:bg-[#0B2B3D]/5'
                    }`}>
                      {item.date}
                    </div>
                  </div>
                ))}
              </div>

              {/* Events */}
              <div className="space-y-3">
                <div className="flex items-start gap-4">
                  <span className="text-xs text-[#5D93A9] w-16 pt-3 font-medium">9:00 AM</span>
                  <div className="flex-1 p-4 rounded-2xl bg-gradient-to-r from-[#A1D1E5]/40 to-[#A1D1E5]/20 border border-[#A1D1E5]/30">
                    <p className="font-semibold text-[#0B2B3D]">Resume Review Session</p>
                    <p className="text-sm text-[#5D93A9]">With Career Advisor • 45 min</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-xs text-[#5D93A9] w-16 pt-3 font-medium">2:00 PM</span>
                  <div className="flex-1 p-4 rounded-2xl bg-gradient-to-r from-[#074C6B]/10 to-[#074C6B]/5 border border-[#074C6B]/10">
                    <p className="font-semibold text-[#0B2B3D]">Mock Interview</p>
                    <p className="text-sm text-[#5D93A9]">Technical Practice • 1 hour</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Tasks & AI */}
          <div className="lg:col-span-3 space-y-5">
            {/* Tasks Card */}
            <div className={`${glassCardDark} rounded-3xl p-5 text-white`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Career Tasks</h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{completedTasks}</span>
                  <span className="text-white/60">/ {totalTasks}</span>
                </div>
              </div>
              
              <ScrollArea className="h-[260px]">
                <div className="space-y-2 pr-2">
                  {careerTasks.map((task) => (
                    <div 
                      key={task.id} 
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                        task.completed 
                          ? 'bg-white/10' 
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        task.completed 
                          ? 'bg-gradient-to-br from-[#A1D1E5] to-[#5D93A9]' 
                          : 'bg-white/10'
                      }`}>
                        <task.icon className={`w-4 h-4 ${task.completed ? 'text-[#0B2B3D]' : 'text-white/70'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${task.completed ? 'line-through opacity-60' : ''}`}>
                          {task.title}
                        </p>
                        <p className="text-xs text-white/50">{task.date}</p>
                      </div>
                      {task.completed && (
                        <CheckCircle2 className="w-5 h-5 text-[#A1D1E5] flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <Link to="/onboarding" className="block mt-4">
                <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl">
                  View All Tasks
                </Button>
              </Link>
            </div>

            {/* AI Chat Card */}
            <div className={`${glassCard} rounded-3xl p-5 border-2 border-[#A1D1E5]/30`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#074C6B] to-[#0B2B3D] flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-[#A1D1E5]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0B2B3D]">AURORA AI</h3>
                  <p className="text-xs text-[#5D93A9]">Your Career Assistant</p>
                </div>
              </div>
              
              <ScrollArea className="h-28 mb-4 px-1">
                <div className="space-y-2">
                  {messages.slice(-3).map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`text-sm p-3 rounded-xl ${
                        msg.role === 'user' 
                          ? 'bg-gradient-to-r from-[#0B2B3D] to-[#074C6B] text-white ml-4' 
                          : 'bg-[#0B2B3D]/5 text-[#0B2B3D]'
                      }`}
                    >
                      {msg.content.length > 80 ? msg.content.slice(0, 80) + '...' : msg.content}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-center gap-2 text-sm text-[#5D93A9] p-2">
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
                  placeholder="Ask AURORA..."
                  className="flex-1 bg-[#0B2B3D]/5 border-[#0B2B3D]/10 rounded-xl h-10 text-sm placeholder:text-[#5D93A9]/60"
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSend} 
                  disabled={isLoading}
                  className="bg-gradient-to-r from-[#0B2B3D] to-[#074C6B] hover:opacity-90 text-white h-10 w-10 p-0 rounded-xl"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 mt-3">
                {['Resume Tips', 'Interview Prep', 'Career Paths'].map((action) => (
                  <button
                    key={action}
                    onClick={() => handleQuickAction(action.toLowerCase())}
                    disabled={isLoading}
                    className="px-3 py-1.5 rounded-xl bg-[#0B2B3D]/5 text-xs text-[#074C6B] font-medium hover:bg-[#0B2B3D]/10 transition-colors disabled:opacity-50"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
