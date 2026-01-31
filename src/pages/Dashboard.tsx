import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  User, Compass, Briefcase, Rocket, MessageSquare, Send, 
  ChevronDown, ChevronRight, Play, Pause, Settings,
  Calendar, CheckCircle2, Clock, Target, TrendingUp,
  Laptop, FileText, Users, Award, Sparkles, Loader2,
  GraduationCap, Building2, Timer, BarChart3
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { mockUser, mockApplications, weeklyProgressData, preOnboardingTasks, firstWeekTasks } from "@/data/mockData";
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
  { day: 'S', value: 20, active: false },
  { day: 'M', value: 65, active: false },
  { day: 'T', value: 45, active: false },
  { day: 'W', value: 80, active: true },
  { day: 'T', value: 55, active: false },
  { day: 'F', value: 70, active: false },
  { day: 'S', value: 30, active: false },
];

// Onboarding tasks for the dark card
const onboardingTasks = [
  { id: 1, icon: MessageSquare, title: "Complete Profile", date: "Jan 25, 08:30", completed: true },
  { id: 2, icon: Sparkles, title: "Skills Assessment", date: "Jan 25, 10:30", completed: true },
  { id: 3, icon: Target, title: "Set Career Goals", date: "Jan 26, 13:00", completed: false },
  { id: 4, icon: FileText, title: "Upload Resume", date: "Jan 26, 14:45", completed: false },
  { id: 5, icon: Users, title: "Connect LinkedIn", date: "Jan 27, 16:30", completed: false },
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
    devices: false,
    goals: false,
    resources: false,
  });

  // Calculate stats
  const pendingApps = mockApplications.filter(a => a.status === 'pending').length;
  const acceptedApps = mockApplications.filter(a => a.status === 'accepted').length;
  const completedTasks = [...preOnboardingTasks, ...firstWeekTasks].filter(t => t.completed).length;
  const totalTasks = preOnboardingTasks.length + firstWeekTasks.length;

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

  // Auto-scroll to bottom
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
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
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
      toast({
        title: "Error", 
        description: "Failed to get response.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8F4F8] via-[#F0F7FA] to-[#E0EEF4] p-4 lg:p-6">
      {/* Top Stats Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#0B2B3D]">
            Welcome back, {mockUser.name}
          </h1>
          <p className="text-[#5D93A9] mt-1">Let's continue your career journey</p>
        </div>
        
        {/* Quick Stats Pills */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B2B3D] text-white text-sm font-medium">
            <span>{Math.round((completedTasks/totalTasks)*100)}%</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#A1D1E5] text-[#0B2B3D] text-sm font-medium">
            <span>{pendingApps} Pending</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 text-[#0B2B3D] text-sm font-medium shadow-sm">
            <span>{mockUser.careerReadinessScore}% Ready</span>
          </div>
          
          {/* Large Stats */}
          <div className="hidden lg:flex items-center gap-8 ml-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#5D93A9]" />
              <span className="text-3xl font-bold text-[#0B2B3D]">{mockApplications.length}</span>
              <span className="text-sm text-[#5D93A9]">Applications</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#5D93A9]" />
              <span className="text-3xl font-bold text-[#0B2B3D]">{acceptedApps}</span>
              <span className="text-sm text-[#5D93A9]">Accepted</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-[#5D93A9]" />
              <span className="text-3xl font-bold text-[#0B2B3D]">{completedTasks}</span>
              <span className="text-sm text-[#5D93A9]">Tasks Done</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        {/* Left Column */}
        <div className="lg:col-span-3 space-y-4">
          {/* Profile Card */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#A1D1E5] to-[#5D93A9] p-1">
            <div className="rounded-3xl overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-[#074C6B] to-[#0B2B3D] flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#A1D1E5] to-[#5D93A9] flex items-center justify-center text-white text-5xl font-bold">
                  {mockUser.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
              <div className="bg-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-[#0B2B3D] text-lg">{mockUser.name}</h3>
                    <p className="text-[#5D93A9] text-sm">{mockUser.stage}</p>
                  </div>
                  <div className="px-3 py-1.5 rounded-full bg-[#A1D1E5] text-[#0B2B3D] text-sm font-semibold">
                    {mockUser.careerReadinessScore}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Collapsible Sections */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 space-y-2">
            {/* Skills Section */}
            <button 
              onClick={() => toggleSection('skills')}
              className="w-full flex items-center justify-between p-3 hover:bg-[#E8F4F8] rounded-xl transition-colors"
            >
              <span className="font-medium text-[#0B2B3D]">Skills Assessment</span>
              {expandedSections.skills ? <ChevronDown className="w-5 h-5 text-[#5D93A9]" /> : <ChevronRight className="w-5 h-5 text-[#5D93A9]" />}
            </button>
            {expandedSections.skills && (
              <div className="px-3 pb-3 space-y-2">
                <div className="flex items-center gap-3 p-2 bg-[#E8F4F8] rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#074C6B] to-[#5D93A9] flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#0B2B3D]">Technical Skills</p>
                    <p className="text-xs text-[#5D93A9]">75% Complete</p>
                  </div>
                </div>
              </div>
            )}

            {/* Devices/Tools Section */}
            <button 
              onClick={() => toggleSection('devices')}
              className="w-full flex items-center justify-between p-3 hover:bg-[#E8F4F8] rounded-xl transition-colors"
            >
              <span className="font-medium text-[#0B2B3D]">Learning Resources</span>
              {expandedSections.devices ? <ChevronDown className="w-5 h-5 text-[#5D93A9]" /> : <ChevronRight className="w-5 h-5 text-[#5D93A9]" />}
            </button>
            {expandedSections.devices && (
              <div className="px-3 pb-3 space-y-2">
                <div className="flex items-center gap-3 p-2 bg-[#E8F4F8] rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                    <Laptop className="w-5 h-5 text-[#074C6B]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#0B2B3D]">Resume Builder</p>
                    <p className="text-xs text-[#5D93A9]">Quick Access</p>
                  </div>
                </div>
              </div>
            )}

            {/* Goals Section */}
            <button 
              onClick={() => toggleSection('goals')}
              className="w-full flex items-center justify-between p-3 hover:bg-[#E8F4F8] rounded-xl transition-colors"
            >
              <span className="font-medium text-[#0B2B3D]">Career Goals</span>
              {expandedSections.goals ? <ChevronDown className="w-5 h-5 text-[#5D93A9]" /> : <ChevronRight className="w-5 h-5 text-[#5D93A9]" />}
            </button>

            {/* Resources Section */}
            <button 
              onClick={() => toggleSection('resources')}
              className="w-full flex items-center justify-between p-3 hover:bg-[#E8F4F8] rounded-xl transition-colors"
            >
              <span className="font-medium text-[#0B2B3D]">Job Resources</span>
              {expandedSections.resources ? <ChevronDown className="w-5 h-5 text-[#5D93A9]" /> : <ChevronRight className="w-5 h-5 text-[#5D93A9]" />}
            </button>
          </div>
        </div>

        {/* Middle Column */}
        <div className="lg:col-span-6 space-y-4">
          {/* Top Row - Progress & Time Tracker */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Progress Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#0B2B3D]">Progress</h3>
                <Link to="/applications" className="w-8 h-8 rounded-xl bg-[#E8F4F8] flex items-center justify-center hover:bg-[#A1D1E5]/30 transition-colors">
                  <ChevronRight className="w-4 h-4 text-[#074C6B]" />
                </Link>
              </div>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-4xl font-bold text-[#0B2B3D]">{weeklyProgressData[weeklyProgressData.length - 1].score}</span>
                <span className="text-sm text-[#5D93A9] mb-1">% this week</span>
              </div>
              {/* Bar Chart */}
              <div className="flex items-end justify-between h-28 mt-4">
                {progressData.map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div 
                      className={`w-6 rounded-full transition-all ${item.active ? 'bg-[#0B2B3D]' : 'bg-[#A1D1E5]'}`}
                      style={{ height: `${item.value}%` }}
                    >
                      {item.active && (
                        <div className="relative -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#A1D1E5] rounded text-xs font-medium text-[#0B2B3D] whitespace-nowrap">
                          {item.value}%
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-[#5D93A9]">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Tracker Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#0B2B3D]">Focus Time</h3>
                <Link to="/profile" className="w-8 h-8 rounded-xl bg-[#E8F4F8] flex items-center justify-center hover:bg-[#A1D1E5]/30 transition-colors">
                  <ChevronRight className="w-4 h-4 text-[#074C6B]" />
                </Link>
              </div>
              {/* Circular Progress */}
              <div className="relative w-32 h-32 mx-auto my-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#E8F4F8"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#A1D1E5"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 56 * 0.65} ${2 * Math.PI * 56}`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-[#0B2B3D]">02:35</span>
                  <span className="text-xs text-[#5D93A9]">Focus Time</span>
                </div>
              </div>
              {/* Controls */}
              <div className="flex items-center justify-center gap-4 mt-2">
                <button className="w-10 h-10 rounded-full bg-[#E8F4F8] flex items-center justify-center hover:bg-[#A1D1E5]/30 transition-colors">
                  <Play className="w-4 h-4 text-[#074C6B]" />
                </button>
                <button className="w-10 h-10 rounded-full bg-[#E8F4F8] flex items-center justify-center hover:bg-[#A1D1E5]/30 transition-colors">
                  <Pause className="w-4 h-4 text-[#074C6B]" />
                </button>
                <button className="w-10 h-10 rounded-full bg-[#0B2B3D] flex items-center justify-center hover:bg-[#074C6B] transition-colors">
                  <Timer className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button className="px-4 py-1.5 rounded-full bg-[#0B2B3D] text-white text-sm font-medium">
                  This Week
                </button>
                <span className="text-[#0B2B3D] font-medium">January 2026</span>
                <button className="px-4 py-1.5 rounded-full bg-[#E8F4F8] text-[#5D93A9] text-sm font-medium hover:bg-[#A1D1E5]/30 transition-colors">
                  Next Week
                </button>
              </div>
            </div>
            
            {/* Week Days */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
                <div key={day} className="text-center">
                  <p className="text-xs text-[#5D93A9] mb-1">{day}</p>
                  <p className={`text-sm font-medium ${i === 2 ? 'w-8 h-8 rounded-full bg-[#0B2B3D] text-white flex items-center justify-center mx-auto' : 'text-[#0B2B3D]'}`}>
                    {27 + i}
                  </p>
                </div>
              ))}
            </div>

            {/* Time Slots */}
            <div className="space-y-2">
              {['8:00 am', '9:00 am', '10:00 am', '11:00 am'].map((time, i) => (
                <div key={time} className="flex items-start gap-4">
                  <span className="text-xs text-[#5D93A9] w-16">{time}</span>
                  {i === 1 && (
                    <div className="flex-1 p-3 rounded-xl bg-[#A1D1E5] flex items-center justify-between">
                      <div>
                        <p className="font-medium text-[#0B2B3D] text-sm">Resume Review Session</p>
                        <p className="text-xs text-[#074C6B]">With Career Advisor</p>
                      </div>
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-[#074C6B] border-2 border-[#A1D1E5]" />
                        <div className="w-6 h-6 rounded-full bg-[#5D93A9] border-2 border-[#A1D1E5]" />
                      </div>
                    </div>
                  )}
                  {i === 3 && (
                    <div className="flex-1 p-3 rounded-xl bg-[#E8F4F8] flex items-center justify-between ml-20">
                      <div>
                        <p className="font-medium text-[#0B2B3D] text-sm">Mock Interview</p>
                        <p className="text-xs text-[#5D93A9]">Technical Practice</p>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-[#074C6B]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-3 space-y-4">
          {/* Onboarding Progress Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#0B2B3D]">Onboarding</h3>
              <span className="text-2xl font-bold text-[#0B2B3D]">{Math.round((completedTasks/totalTasks)*100)}%</span>
            </div>
            {/* Progress Bars */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#5D93A9] w-8">30%</span>
                <div className="flex-1 h-8 bg-[#A1D1E5] rounded-lg" />
                <span className="text-xs text-[#5D93A9] w-8">25%</span>
                <div className="flex-1 h-8 bg-[#5D93A9] rounded-lg" />
                <span className="text-xs text-[#5D93A9] w-8">0%</span>
                <div className="flex-1 h-8 bg-[#E8F4F8] rounded-lg" />
              </div>
              <div className="flex items-center justify-center">
                <span className="px-4 py-1 rounded-full bg-[#0B2B3D] text-white text-xs">Tasks</span>
              </div>
            </div>
          </div>

          {/* Dark Task Card */}
          <div className="bg-[#0B2B3D] rounded-3xl p-5 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Career Tasks</h3>
              <span className="text-2xl font-bold">{completedTasks}/{totalTasks}</span>
            </div>
            <ScrollArea className="h-64">
              <div className="space-y-3 pr-2">
                {onboardingTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${task.completed ? 'bg-[#A1D1E5]' : 'bg-[#5D93A9]/50'}`}>
                      <task.icon className={`w-4 h-4 ${task.completed ? 'text-[#0B2B3D]' : 'text-white'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{task.title}</p>
                      <p className="text-xs text-white/60">{task.date}</p>
                    </div>
                    {task.completed && (
                      <CheckCircle2 className="w-5 h-5 text-[#A1D1E5]" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* AI Chat Quick Access */}
          <div className="bg-gradient-to-br from-[#074C6B] to-[#0B2B3D] rounded-3xl p-5 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#A1D1E5] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#0B2B3D]" />
              </div>
              <div>
                <h3 className="font-semibold">AURORA AI</h3>
                <p className="text-xs text-white/70">Career Assistant</p>
              </div>
            </div>
            <ScrollArea className="h-32 mb-4">
              <div className="space-y-2 pr-2">
                {messages.slice(-3).map((msg) => (
                  <div key={msg.id} className={`text-sm p-2 rounded-lg ${msg.role === 'user' ? 'bg-white/20 ml-4' : 'bg-white/10'}`}>
                    {msg.content.length > 80 ? msg.content.slice(0, 80) + '...' : msg.content}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Loader2 className="w-3 h-3 animate-spin" />
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
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 text-sm"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSend} 
                disabled={isLoading}
                size="icon"
                className="bg-[#A1D1E5] hover:bg-[#5D93A9] text-[#0B2B3D]"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 mt-3">
              {['Career', 'Resume', 'Interview'].map((action) => (
                <button
                  key={action}
                  onClick={() => handleQuickAction(action.toLowerCase())}
                  disabled={isLoading}
                  className="px-3 py-1 rounded-full bg-white/10 text-xs hover:bg-white/20 transition-colors disabled:opacity-50"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-[#E8F4F8]">
        <Link to="/dashboard" className="px-4 py-2 rounded-full bg-[#0B2B3D] text-white text-sm font-medium">
          Dashboard
        </Link>
        <Link to="/career-exploration" className="px-4 py-2 rounded-full hover:bg-[#E8F4F8] text-[#5D93A9] text-sm font-medium transition-colors">
          Explore
        </Link>
        <Link to="/applications" className="px-4 py-2 rounded-full hover:bg-[#E8F4F8] text-[#5D93A9] text-sm font-medium transition-colors">
          Applications
        </Link>
        <Link to="/onboarding" className="px-4 py-2 rounded-full hover:bg-[#E8F4F8] text-[#5D93A9] text-sm font-medium transition-colors">
          Onboarding
        </Link>
        <Link to="/profile" className="px-4 py-2 rounded-full hover:bg-[#E8F4F8] text-[#5D93A9] text-sm font-medium transition-colors flex items-center gap-2">
          <Settings className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
