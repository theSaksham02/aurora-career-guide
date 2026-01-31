import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send, Compass, Briefcase, Rocket, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  role: "user" | "aurora";
  content: string;
}

const quickActions = [
  { icon: Compass, label: "Career Exploration" },
  { icon: Briefcase, label: "Application Management" },
  { icon: Rocket, label: "Onboarding" },
  { icon: MessageSquare, label: "Ask Freely" },
];

export function AuroraChat() {
  const [isOpen, setIsOpen] = useState(false);
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
      content: "I understand you're asking about: \"" + input + "\". Let me help you with that. For now, I'm in demo mode, but I can assist with career exploration, application tracking, and onboarding support.",
    };

    setMessages((prev) => [...prev, userMessage, auroraResponse]);
    setInput("");
  };

  const handleQuickAction = (label: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: label,
    };

    const responses: Record<string, string> = {
      "Career Exploration": "Let's explore your career options! What stage are you at - Student, Intern/Job Seeker, or Professional?",
      "Application Management": "I can help you track and manage your applications. Would you like to see your current applications or add a new one?",
      "Onboarding": "Getting ready for a new role? I'll help you with pre-onboarding tasks and first-week preparation.",
      "Ask Freely": "Feel free to ask me anything about your career journey. I'm here to help!",
    };

    const auroraResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: "aurora",
      content: responses[label] || "How can I help you with that?",
    };

    setMessages((prev) => [...prev, userMessage, auroraResponse]);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-accent text-accent-foreground rounded-full shadow-accent flex items-center justify-center hover:scale-105 transition-transform"
        aria-label="Toggle AURORA chat"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] bg-background border border-border rounded-lg shadow-lg animate-scale-in overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4">
            <h3 className="font-semibold">AURORA</h3>
            <p className="text-sm opacity-80">Your Career Agent</p>
          </div>

          {/* Messages */}
          <ScrollArea className="h-[300px] p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground animate-slide-in-right"
                        : "bg-muted text-foreground animate-slide-in-left"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Quick Actions */}
          <div className="p-3 border-t border-border">
            <div className="grid grid-cols-2 gap-2 mb-3">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action.label)}
                  className="flex items-center gap-2 p-2 text-xs rounded-md bg-muted hover:bg-muted/80 transition-colors text-left"
                >
                  <action.icon className="h-4 w-4 text-secondary" />
                  <span className="text-foreground">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                className="flex-1"
              />
              <Button size="icon" onClick={handleSend} variant="cta">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
