import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send, Compass, Briefcase, Rocket, MessageSquare, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { aiService } from "@/lib/ai-service";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "aurora";
  content: string;
  isLoading?: boolean;
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
      content: "Hi, I'm AURORA, your AI-powered career guide. What would you like help with today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
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
      const response = await aiService.getCareerAdvice(input, {
        stage: "Student", // You can pass user context here
      });

      const auroraResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "aurora",
        content: response,
      };

      setMessages((prev) => [...prev, auroraResponse]);
    } catch (error) {
      console.error("AI Error:", error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "aurora",
        content: "I apologize, but I'm having trouble connecting to my AI service right now. Please make sure your API key is configured correctly in the .env.local file. You can get a free API key from OpenRouter (https://openrouter.ai/keys).",
      };

      setMessages((prev) => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Please check your AI API configuration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (label: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: label,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const prompts: Record<string, string> = {
        "Career Exploration": "I want to explore career options. What are some ways you can help me discover and evaluate different career paths?",
        "Application Management": "I need help managing my job applications. What strategies and tools can you recommend for tracking applications effectively?",
        "Onboarding": "I'm starting a new role soon. What should I focus on during my onboarding period to be successful?",
        "Ask Freely": "What are some of the most common challenges people face in their career journey, and how can I prepare for them?",
      };

      const response = await aiService.getCareerAdvice(prompts[label] || label, {
        stage: "Student",
      });

      const auroraResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "aurora",
        content: response,
      };

      setMessages((prev) => [...prev, auroraResponse]);
    } catch (error) {
      console.error("AI Error:", error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "aurora",
        content: "I'm having trouble connecting right now. Please check your API configuration.",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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
          <ScrollArea ref={scrollAreaRef} className="h-[300px] p-4">
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
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-lg text-sm bg-muted text-foreground animate-slide-in-left flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>AURORA is thinking...</span>
                  </div>
                </div>
              )}
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
                onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSend()}
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                size="icon" 
                onClick={handleSend} 
                variant="cta"
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
