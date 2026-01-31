import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ChevronDown, ChevronRight, Play, Pause,
  CheckCircle2, Target, Sparkles, Loader2,
  GraduationCap, Laptop, FileText, Users, Award, 
  Timer, MessageSquare, Send, BookOpen,
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
  const [timerSeconds, setTimerSeconds] = useState(155);

  // Calculate stats
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

  // Glass card styles - LIGHT BG = DARK TEXT
  const glassCard = "bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(11,43,61,0.1)]";
  // DARK BG = LIGHT TEXT
  const glassCardDark = "bg-gradient-to-br from-[#0B2B3D] to-[#074C6B] backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(11,43,61,0.3)]";

  return (
    <div className="min-h-screen font-sf">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-10 pb-10">
        {/* Welcome Header */}
        <div className="mb-10">
          <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6">
            <div>
              <p className="text-[#5D93A9] text-base font-medium mb-2 tracking-wide">Welcome back</p>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-[#0B2B3D] tracking-tight">
                {mockUser.name} 👋
              </h1>
              <p className="text-[#5D93A9] text-lg mt-3">Let's continue building your career path</p>
            </div>
            
            {/* Quick Stats - LIGHT BG with DARK TEXT */}
            <div className="flex flex-wrap items-center gap-4">
              <div className={`${glassCard} px-6 py-4 rounded-2xl flex items-center gap-4`}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#A1D1E5] to-[#5D93A9] flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#0B2B3D]">{mockUser.careerReadinessScore}%</p>
                  <p className="text-sm text-[#5D93A9] font-medium">Career Ready</p>
                </div>
              </div>
              <div className={`${glassCard} px-6 py-4 rounded-2xl flex items-center gap-4`}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#074C6B] to-[#0B2B3D] flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#0B2B3D]">{mockApplications.length}</p>
                  <p className="text-sm text-[#5D93A9] font-medium">Applications</p>
                </div>
              </div>
              <div className={`${glassCard} px-6 py-4 rounded-2xl flex items-center gap-4`}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#0B2B3D]">{acceptedApps}</p>
                  <p className="text-sm text-[#5D93A9] font-medium">Accepted</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* Left Column - Profile & Navigation */}
          <div className="xl:col-span-3 space-y-6">
            {/* Profile Card - DARK BG with LIGHT TEXT */}
            <div className={`${glassCardDark} rounded-3xl overflow-hidden`}>
              <div className="p-8 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#A1D1E5] to-[#5D93A9] flex items-center justify-center text-white text-3xl font-bold mb-5 shadow-xl">
                  {mockUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="font-bold text-white text-xl">{mockUser.name}</h3>
                <p className="text-[#A1D1E5] text-base mt-1">{mockUser.stage}</p>
                
                <div className="w-full mt-6 pt-6 border-t border-white/20">
                  <div className="flex justify-between text-base mb-3">
                    <span className="text-white/70">Profile Completion</span>
                    <span className="text-[#A1D1E5] font-bold">{onboardingPercent}%</span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#A1D1E5] to-[#5D93A9] rounded-full transition-all duration-500"
                      style={{ width: `${onboardingPercent}%` }}
                    />
                  </div>
                </div>
                
                <Link to="/profile" className="w-full mt-5">
                  <Button className="w-full bg-white/10 hover:bg-white/20 text-white text-base font-semibold border border-white/20 rounded-xl py-3 h-auto">
                    View Profile
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Links - LIGHT BG with DARK TEXT */}
            <div className={`${glassCard} rounded-3xl p-6`}>
              <h3 className="font-bold text-[#0B2B3D] text-lg mb-5">Quick Links</h3>
              
              {/* Skills */}
              <button 
                onClick={() => toggleSection('skills')}
                className="w-full flex items-center justify-between p-4 hover:bg-[#0B2B3D]/5 rounded-xl transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#A1D1E5]/40 to-[#5D93A9]/40 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-[#074C6B]" />
                  </div>
                  <span className="font-semibold text-[#0B2B3D] text-base">Skills</span>
                </div>
                {expandedSections.skills ? <ChevronDown className="w-5 h-5 text-[#5D93A9]" /> : <ChevronRight className="w-5 h-5 text-[#5D93A9]" />}
              </button>
              {expandedSections.skills && (
                <div className="ml-14 mb-3 p-4 bg-[#0B2B3D]/5 rounded-xl">
                  <p className="text-base text-[#0B2B3D] font-medium">Technical Skills: 75%</p>
                  <div className="h-2 bg-[#0B2B3D]/10 rounded-full mt-3 overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-[#074C6B] to-[#5D93A9] rounded-full" />
                  </div>
                </div>
              )}

              {/* Resources */}
              <button 
                onClick={() => toggleSection('resources')}
                className="w-full flex items-center justify-between p-4 hover:bg-[#0B2B3D]/5 rounded-xl transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#A1D1E5]/40 to-[#5D93A9]/40 flex items-center justify-center">
                    <Laptop className="w-5 h-5 text-[#074C6B]" />
                  </div>
                  <span className="font-semibold text-[#0B2B3D] text-base">Resources</span>
                </div>
                {expandedSections.resources ? <ChevronDown className="w-5 h-5 text-[#5D93A9]" /> : <ChevronRight className="w-5 h-5 text-[#5D93A9]" />}
              </button>
              {expandedSections.resources && (
                <Link to="/onboarding" className="block ml-14 mb-3 p-4 bg-[#0B2B3D]/5 rounded-xl hover:bg-[#0B2B3D]/10 transition-colors">
                  <p className="text-base font-semibold text-[#0B2B3D]">Resume Builder →</p>
                </Link>
              )}

              {/* Goals */}
              <button 
                onClick={() => toggleSection('goals')}
                className="w-full flex items-center justify-between p-4 hover:bg-[#0B2B3D]/5 rounded-xl transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#A1D1E5]/40 to-[#5D93A9]/40 flex items-center justify-center">
                    <Target className="w-5 h-5 text-[#074C6B]" />
                  </div>
                  <span className="font-semibold text-[#0B2B3D] text-base">Goals</span>
                </div>
                {expandedSections.goals ? <ChevronDown className="w-5 h-5 text-[#5D93A9]" /> : <ChevronRight className="w-5 h-5 text-[#5D93A9]" />}
              </button>
              {expandedSections.goals && (
                <Link to="/career-exploration" className="block ml-14 mb-3 p-4 bg-[#0B2B3D]/5 rounded-xl hover:bg-[#0B2B3D]/10 transition-colors">
                  <p className="text-base font-semibold text-[#0B2B3D]">Set Career Goals →</p>
                </Link>
              )}
            </div>
          </div>

          {/* Middle Column - Main Content */}
          <div className="xl:col-span-6 space-y-6">
            {/* Stats Row - LIGHT BG with DARK TEXT */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Progress Card */}
              <div className={`${glassCard} rounded-3xl p-7`}>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-[#0B2B3D] text-lg">Weekly Progress</h3>
                  <Link to="/applications" className="text-sm text-[#074C6B] hover:text-[#0B2B3D] font-semibold">
                    View All →
                  </Link>
                </div>
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-5xl font-bold text-[#0B2B3D]">{mockUser.careerReadinessScore}</span>
                  <span className="text-base text-[#5D93A9] font-medium">% this week</span>
                  <span className="ml-auto text-sm text-emerald-600 font-bold bg-emerald-100 px-3 py-1.5 rounded-full">+12%</span>
                </div>
                {/* Bar Chart */}
                <div className="flex items-end justify-between h-24 gap-3">
                  {progressData.map((item, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-3">
                      <div 
                        className={`w-full rounded-lg transition-all duration-500 ${
                          i === 3 
                            ? 'bg-gradient-to-t from-[#0B2B3D] to-[#074C6B]' 
                            : 'bg-gradient-to-t from-[#A1D1E5]/70 to-[#A1D1E5]'
                        }`}
                        style={{ height: `${item.value}%` }}
                      />
                      <span className="text-sm font-medium text-[#5D93A9]">{item.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Focus Time Card - LIGHT BG with DARK TEXT */}
              <div className={`${glassCard} rounded-3xl p-7`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-[#0B2B3D] text-lg">Focus Timer</h3>
                  <Clock className="w-5 h-5 text-[#5D93A9]" />
                </div>
                {/* Circular Progress */}
                <div className="relative w-36 h-36 mx-auto my-4">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
                    <circle cx="64" cy="64" r="54" stroke="rgba(161,209,229,0.4)" strokeWidth="10" fill="none" />
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
                    <span className="text-4xl font-bold text-[#0B2B3D]">{formatTime(timerSeconds)}</span>
                    <span className="text-sm font-medium text-[#5D93A9]">{timerActive ? 'Focus Mode' : 'Paused'}</span>
                  </div>
                </div>
                {/* Controls */}
                <div className="flex items-center justify-center gap-4 mt-4">
                  <button 
                    onClick={() => setTimerActive(true)}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      timerActive 
                        ? 'bg-[#0B2B3D]/10 text-[#5D93A9]' 
                        : 'bg-gradient-to-br from-[#074C6B] to-[#0B2B3D] text-white shadow-lg hover:scale-105'
                    }`}
                  >
                    <Play className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setTimerActive(false)}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      !timerActive 
                        ? 'bg-[#0B2B3D]/10 text-[#5D93A9]' 
                        : 'bg-gradient-to-br from-[#074C6B] to-[#0B2B3D] text-white shadow-lg hover:scale-105'
                    }`}
                  >
                    <Pause className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setTimerSeconds(1500)}
                    className="w-12 h-12 rounded-xl bg-[#A1D1E5]/40 flex items-center justify-center hover:bg-[#A1D1E5]/60 transition-all duration-300"
                  >
                    <Timer className="w-5 h-5 text-[#074C6B]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Calendar Card - LIGHT BG with DARK TEXT */}
            <div className={`${glassCard} rounded-3xl p-7`}>
              <div className="flex items-center gap-4 mb-6">
                <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0B2B3D] to-[#074C6B] text-white text-base font-semibold shadow-lg">
                  This Week
                </button>
                <span className="text-[#0B2B3D] text-lg font-bold">January 2026</span>
                <button className="px-5 py-2.5 rounded-xl bg-[#0B2B3D]/5 text-[#5D93A9] text-base font-semibold hover:bg-[#0B2B3D]/10 transition-colors">
                  Next Week
                </button>
              </div>
              
              {/* Week Days */}
              <div className="grid grid-cols-5 gap-4 mb-6">
                {[
                  { day: 'Mon', date: 27 },
                  { day: 'Tue', date: 28 },
                  { day: 'Wed', date: 29 },
                  { day: 'Thu', date: 30 },
                  { day: 'Fri', date: 31, active: true },
                ].map((item) => (
                  <div key={item.day} className="text-center">
                    <p className="text-sm font-medium text-[#5D93A9] mb-3">{item.day}</p>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto text-lg font-bold transition-all duration-300 ${
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
              <div className="space-y-4">
                <div className="flex items-start gap-5">
                  <span className="text-sm font-semibold text-[#5D93A9] w-20 pt-4">9:00 AM</span>
                  <div className="flex-1 p-5 rounded-2xl bg-gradient-to-r from-[#A1D1E5]/50 to-[#A1D1E5]/30 border border-[#A1D1E5]/40">
                    <p className="font-bold text-[#0B2B3D] text-lg">Resume Review Session</p>
                    <p className="text-base text-[#074C6B] mt-1">With Career Advisor • 45 min</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <span className="text-sm font-semibold text-[#5D93A9] w-20 pt-4">2:00 PM</span>
                  <div className="flex-1 p-5 rounded-2xl bg-gradient-to-r from-[#074C6B]/15 to-[#074C6B]/5 border border-[#074C6B]/15">
                    <p className="font-bold text-[#0B2B3D] text-lg">Mock Interview</p>
                    <p className="text-base text-[#074C6B] mt-1">Technical Practice • 1 hour</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Tasks & AI */}
          <div className="xl:col-span-3 space-y-6">
            {/* Tasks Card - DARK BG with LIGHT TEXT */}
            <div className={`${glassCardDark} rounded-3xl p-6`}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-white text-lg">Career Tasks</h3>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-white">{completedTasks}</span>
                  <span className="text-white/60 text-lg">/ {totalTasks}</span>
                </div>
              </div>
              
              <ScrollArea className="h-[280px]">
                <div className="space-y-3 pr-2">
                  {careerTasks.map((task) => (
                    <div 
                      key={task.id} 
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                        task.completed 
                          ? 'bg-white/15' 
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        task.completed 
                          ? 'bg-gradient-to-br from-[#A1D1E5] to-[#5D93A9]' 
                          : 'bg-white/10'
                      }`}>
                        <task.icon className={`w-5 h-5 ${task.completed ? 'text-[#0B2B3D]' : 'text-white/80'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-base font-medium truncate text-white ${task.completed ? 'line-through opacity-60' : ''}`}>
                          {task.title}
                        </p>
                        <p className="text-sm text-white/50">{task.date}</p>
                      </div>
                      {task.completed && (
                        <CheckCircle2 className="w-6 h-6 text-[#A1D1E5] flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <Link to="/onboarding" className="block mt-5">
                <Button className="w-full bg-white/10 hover:bg-white/20 text-white text-base font-semibold border border-white/20 rounded-xl py-3 h-auto">
                  View All Tasks
                </Button>
              </Link>
            </div>

            {/* AI Chat Card - LIGHT BG with DARK TEXT */}
            <div className={`${glassCard} rounded-3xl p-6 border-2 border-[#A1D1E5]/40`}>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#074C6B] to-[#0B2B3D] flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-[#A1D1E5]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0B2B3D] text-lg">AURORA AI</h3>
                  <p className="text-sm text-[#5D93A9] font-medium">Your Career Assistant</p>
                </div>
              </div>
              
              <ScrollArea className="h-32 mb-5 px-1">
                <div className="space-y-3">
                  {messages.slice(-3).map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`text-base p-4 rounded-xl ${
                        msg.role === 'user' 
                          ? 'bg-gradient-to-r from-[#0B2B3D] to-[#074C6B] text-white ml-4' 
                          : 'bg-[#0B2B3D]/5 text-[#0B2B3D]'
                      }`}
                    >
                      {msg.content.length > 80 ? msg.content.slice(0, 80) + '...' : msg.content}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-center gap-3 text-base text-[#5D93A9] p-3">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Thinking...
                    </div>
                  )}
                  <div ref={scrollRef} />
                </div>
              </ScrollArea>
              
              <div className="flex gap-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask AURORA..."
                  className="flex-1 bg-[#0B2B3D]/5 border-[#0B2B3D]/10 rounded-xl h-12 text-base placeholder:text-[#5D93A9]/60"
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSend} 
                  disabled={isLoading}
                  className="bg-gradient-to-r from-[#0B2B3D] to-[#074C6B] hover:opacity-90 text-white h-12 w-12 p-0 rounded-xl"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 mt-4">
                {['Resume Tips', 'Interview Prep', 'Career Paths'].map((action) => (
                  <button
                    key={action}
                    onClick={() => handleQuickAction(action.toLowerCase())}
                    disabled={isLoading}
                    className="px-4 py-2 rounded-xl bg-[#0B2B3D]/5 text-sm text-[#074C6B] font-semibold hover:bg-[#0B2B3D]/10 transition-colors disabled:opacity-50"
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
