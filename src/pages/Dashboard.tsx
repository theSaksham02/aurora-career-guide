import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Edit, Compass, Briefcase, Rocket, MessageSquare, Send, FileText, TrendingUp, FolderOpen, BookOpen, Loader2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useState, useRef, useEffect } from "react";
import { mockUser, weeklyProgressData } from "@/data/mockData";
import { aiService } from "@/lib/ai-service";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "aurora";
  content: string;
}

const quickActions = [
  { icon: Compass, label: "Career Exploration", action: "career", href: "/career-exploration" },
  { icon: Briefcase, label: "Applications", action: "application", href: "/applications" },
  { icon: Rocket, label: "Onboarding", action: "onboarding", href: "/onboarding" },
  { icon: MessageSquare, label: "Ask Freely", action: "ask", href: null },
];

const recommendedActions = [
  { icon: FileText, label: "Update Your Profile", href: "/profile" },
  { icon: TrendingUp, label: "Explore New Roles", href: "/career-exploration" },
  { icon: FolderOpen, label: "Track Applications", href: "/applications" },
  { icon: BookOpen, label: "View Resources", href: "/onboarding" },
];

export default function Dashboard() {
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "aurora",
      content: `Hi ${mockUser.name}! I'm AURORA, your AI career agent. As a ${mockUser.stage}, I can help you with career exploration, application tracking, interview prep, and more. What would you like help with today?`,
    },
  ]);
  const [input, setInput] = useState("");

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await aiService.getCareerAdvice(input, mockUser.stage);
      
      const auroraResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "aurora",
        content: response,
      };

      setMessages((prev) => [...prev, auroraResponse]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
      console.error("AI Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (action: string) => {
    const prompts: Record<string, string> = {
      career: `I'm a ${mockUser.stage} looking to explore career options. What paths would you recommend?`,
      application: `Help me with my job applications. I currently have ${mockUser.applicationsInProgress} in progress.`,
      onboarding: "I'm preparing for a new role. What should I focus on for a successful start?",
      ask: "I have a career question. I'm ready to chat!",
    };

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: prompts[action],
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await aiService.getCareerAdvice(prompts[action], mockUser.stage);
      
      const auroraResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "aurora",
        content: response,
      };

      setMessages((prev) => [...prev, auroraResponse]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Welcome back, {mockUser.name}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <Badge className="bg-[#074C6B] text-white">
                {mockUser.stage}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Current Stage
              </span>
            </div>
          </div>
          <Link to="/profile">
            <Button variant="outline" size="icon" className="rounded-xl">
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column - Chat */}
          <div className="lg:col-span-7">
            <div className="bg-background rounded-2xl border border-border overflow-hidden h-[600px] flex flex-col shadow-sm">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-[#0B2B3D] to-[#074C6B] text-white p-4">
                <h2 className="font-semibold text-lg">AURORA AI Assistant</h2>
                <p className="text-sm text-white/80">Your intelligent career guide</p>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-2xl ${
                          message.role === "user"
                            ? "bg-[#074C6B] text-white"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] p-4 rounded-2xl bg-muted text-foreground flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>AURORA is thinking...</span>
                      </div>
                    </div>
                  )}
                  <div ref={scrollRef} />
                </div>
              </ScrollArea>

              {/* Quick Actions */}
              <div className="p-4 border-t border-border">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                  {quickActions.map((action) => (
                    action.href ? (
                      <Link
                        key={action.label}
                        to={action.href}
                        className="flex items-center gap-2 p-3 text-sm rounded-xl bg-muted hover:bg-[#A1D1E5]/20 transition-all hover:scale-[1.02] border border-transparent hover:border-[#5D93A9]/30"
                      >
                        <action.icon className="h-4 w-4 text-[#074C6B]" />
                        <span className="text-foreground hidden md:inline">{action.label}</span>
                      </Link>
                    ) : (
                      <button
                        key={action.label}
                        onClick={() => handleQuickAction(action.action)}
                        disabled={isLoading}
                        className="flex items-center gap-2 p-3 text-sm rounded-xl bg-muted hover:bg-[#A1D1E5]/20 transition-all hover:scale-[1.02] border border-transparent hover:border-[#5D93A9]/30 disabled:opacity-50"
                      >
                        <action.icon className="h-4 w-4 text-[#074C6B]" />
                        <span className="text-foreground hidden md:inline">{action.label}</span>
                      </button>
                    )
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask AURORA anything about your career..."
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button onClick={handleSend} disabled={isLoading} className="bg-[#074C6B] hover:bg-[#0B2B3D]">
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Stats */}
            <div className="bg-background rounded-2xl border border-border p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Quick Stats</h3>
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="text-[#5D93A9] hover:text-[#074C6B]">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Current Stage</span>
                  <Badge className="bg-[#5D93A9] text-white">{mockUser.stage}</Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Applications</span>
                  <span className="font-semibold text-foreground">{mockUser.applicationsInProgress}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Next Milestone</span>
                  <span className="text-sm text-foreground">{mockUser.nextMilestone}</span>
                </div>
              </div>
            </div>

            {/* Recommended Actions */}
            <div className="bg-background rounded-2xl border border-border p-6 shadow-sm">
              <h3 className="font-semibold text-foreground mb-4">Recommended Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {recommendedActions.map((action) => (
                  <Link
                    key={action.label}
                    to={action.href}
                    className="flex items-center gap-3 p-4 rounded-xl bg-muted hover:bg-[#A1D1E5]/20 transition-all hover:scale-[1.02] border border-transparent hover:border-[#5D93A9]/30"
                  >
                    <action.icon className="h-5 w-5 text-[#074C6B]" />
                    <span className="text-sm text-foreground font-medium">{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Progress Chart */}
            <div className="bg-background rounded-2xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">Career Readiness Score</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyProgressData}>
                    <XAxis 
                      dataKey="week" 
                      tick={{ fill: 'hsl(200, 30%, 40%)', fontSize: 12 }} 
                      axisLine={false} 
                      tickLine={false} 
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      tick={{ fill: 'hsl(200, 30%, 40%)', fontSize: 12 }} 
                      axisLine={false} 
                      tickLine={false} 
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(0, 0%, 100%)', 
                        border: '1px solid hsl(200, 20%, 88%)',
                        borderRadius: '12px'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#074C6B" 
                      strokeWidth={3}
                      dot={{ fill: '#5D93A9', strokeWidth: 2, stroke: '#074C6B' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-center">
                <span className="text-3xl font-bold text-gradient">{mockUser.careerReadinessScore}%</span>
                <p className="text-sm text-muted-foreground">Current Score</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
