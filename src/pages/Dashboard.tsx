import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Edit, Compass, Briefcase, Rocket, MessageSquare, Send, FileText, TrendingUp, FolderOpen, BookOpen } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useState } from "react";
import { mockUser, weeklyProgressData } from "@/data/mockData";

interface Message {
  id: string;
  role: "user" | "aurora";
  content: string;
}

const quickActions = [
  { icon: Compass, label: "Career Exploration", action: "career" },
  { icon: Briefcase, label: "Application Management", action: "application" },
  { icon: Rocket, label: "Onboarding", action: "onboarding" },
  { icon: MessageSquare, label: "Ask Freely", action: "ask" },
];

const recommendedActions = [
  { icon: FileText, label: "Update Your Profile", href: "/profile" },
  { icon: TrendingUp, label: "Explore New Roles", href: "/career-exploration" },
  { icon: FolderOpen, label: "Track Applications", href: "/applications" },
  { icon: BookOpen, label: "View Resources", href: "/onboarding" },
];

export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "aurora",
      content: "Hi, I'm AURORA, your career agent. What would you like help with today?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    const auroraResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: "aurora",
      content: `I understand you're asking about: "${input}". Let me help you with that. Based on your current stage as a ${mockUser.stage}, I recommend focusing on building your skills and exploring relevant opportunities.`,
    };

    setMessages((prev) => [...prev, userMessage, auroraResponse]);
    setInput("");
  };

  const handleQuickAction = (action: string) => {
    const responses: Record<string, string> = {
      career: "Let's explore your career options! What stage are you at - Student, Intern/Job Seeker, or Professional?",
      application: "I can help you track and manage your applications. You currently have 5 applications in progress.",
      onboarding: "Getting ready for a new role? I'll help you with pre-onboarding tasks and first-week preparation.",
      ask: "Feel free to ask me anything about your career journey. I'm here to help!",
    };

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: quickActions.find(q => q.action === action)?.label || "",
    };

    const auroraResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: "aurora",
      content: responses[action] || "How can I help you?",
    };

    setMessages((prev) => [...prev, userMessage, auroraResponse]);
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-heading text-foreground">
              Welcome back, {mockUser.name}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                {mockUser.stage}
              </Badge>
              <span className="text-small text-muted-foreground">
                Current Stage
              </span>
            </div>
          </div>
          <Link to="/profile">
            <Button variant="outline" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Chat */}
          <div className="lg:col-span-7">
            <div className="bg-background rounded-lg border border-border overflow-hidden h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="bg-primary text-primary-foreground p-4">
                <h2 className="font-semibold">AURORA Chat Interface</h2>
                <p className="text-sm opacity-80">Your intelligent career assistant</p>
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
                        className={`max-w-[80%] p-4 rounded-lg ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Quick Actions */}
              <div className="p-4 border-t border-border">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                  {quickActions.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => handleQuickAction(action.action)}
                      className="flex items-center gap-2 p-3 text-sm rounded-md bg-muted hover:bg-muted/80 transition-all hover:scale-[1.02]"
                    >
                      <action.icon className="h-4 w-4 text-secondary" />
                      <span className="text-foreground hidden md:inline">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    className="flex-1"
                  />
                  <Button onClick={handleSend} variant="cta">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Stats */}
            <div className="bg-background rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Quick Stats</h3>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Current Stage</span>
                  <Badge variant="secondary" className="bg-secondary text-secondary-foreground">{mockUser.stage}</Badge>
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
            <div className="bg-background rounded-lg border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">Recommended Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {recommendedActions.map((action) => (
                  <Link
                    key={action.label}
                    to={action.href}
                    className="flex items-center gap-3 p-3 rounded-md bg-muted hover:bg-muted/80 transition-all hover:scale-[1.02]"
                  >
                    <action.icon className="h-5 w-5 text-primary" />
                    <span className="text-sm text-foreground">{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Progress Chart */}
            <div className="bg-background rounded-lg border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">Career Readiness Score</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyProgressData}>
                    <XAxis 
                      dataKey="week" 
                      tick={{ fill: 'hsl(0, 0%, 40%)', fontSize: 12 }} 
                      axisLine={false} 
                      tickLine={false} 
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      tick={{ fill: 'hsl(0, 0%, 40%)', fontSize: 12 }} 
                      axisLine={false} 
                      tickLine={false} 
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(0, 0%, 100%)', 
                        border: '1px solid hsl(0, 0%, 90%)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="hsl(176, 100%, 33%)" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(176, 100%, 33%)', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-center">
                <span className="text-3xl font-bold text-secondary">{mockUser.careerReadinessScore}%</span>
                <p className="text-sm text-muted-foreground">Current Score</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
