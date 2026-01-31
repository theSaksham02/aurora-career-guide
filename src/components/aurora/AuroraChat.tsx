import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send, Loader2, Sparkles, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { careerAgent, AgentMessage, CareerStage } from "@/lib/career-agent";
import { useToast } from "@/hooks/use-toast";

export function AuroraChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize chat with greeting when opened
  useEffect(() => {
    if (isOpen && !isInitialized) {
      const greeting = careerAgent.getGreeting();
      setMessages([greeting]);
      setIsInitialized(true);
    }
  }, [isOpen, isInitialized]);

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

    const userInput = input;
    setInput("");
    setIsLoading(true);

    // Optimistically add user message
    const tempUserMessage: AgentMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: userInput,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, tempUserMessage]);

    try {
      const response = await careerAgent.processMessage(userInput);

      // Update messages with actual history from agent
      // This includes fallback responses if AI API fails
      setMessages(careerAgent.getHistory());
    } catch (error) {
      console.error("AI Error:", error);

      // The agent already handles errors and returns smart fallback responses
      // So we just update from the agent's history which includes the fallback
      const history = careerAgent.getHistory();
      if (history.length > 0) {
        setMessages(history);
      } else {
        // Only show generic error if agent history is empty (shouldn't happen)
        toast({
          title: "Connection Error",
          description: "Please check your AI API configuration",
          variant: "destructive",
        });

        const errorMessage: AgentMessage = {
          id: `error-${Date.now()}`,
          role: 'aurora',
          content: "I'm having trouble connecting right now, but I can still help! **What stage are you in?**\n\n🔍 Exploring careers\n📋 Applied to a role\n🎤 Preparing for interviews\n🚀 Starting a new job\n\nTap one of the options below to get stage-specific guidance.",
          timestamp: new Date(),
          quickActions: [
            { label: '🔍 Exploring Careers', value: 'stage_exploring' },
            { label: '📋 Applied to a Role', value: 'stage_applied' },
            { label: '🎤 Interview Prep', value: 'stage_interviewing' },
          ]
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (actionValue: string) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      // Handle stage selection
      if (actionValue.startsWith('stage_')) {
        const stageMap: Record<string, CareerStage> = {
          'stage_student': 'student',
          'stage_jobseeker': 'intern_jobseeker',
          'stage_professional': 'professional'
        };
        const stage = stageMap[actionValue];
        if (stage) {
          careerAgent.setStage(stage);

          // Add user response
          const stageLabels: Record<string, string> = {
            'stage_student': "I'm a student",
            'stage_jobseeker': "I'm looking for a job",
            'stage_professional': "I'm a working professional"
          };

          const response = await careerAgent.processMessage(stageLabels[actionValue]);
          setMessages(careerAgent.getHistory());
        }
      } else {
        // Handle intent selection
        const response = await careerAgent.handleQuickAction(actionValue);
        setMessages(careerAgent.getHistory());
      }
    } catch (error) {
      console.error("Quick action error:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    careerAgent.reset();
    const greeting = careerAgent.getGreeting();
    setMessages([greeting]);
  };

  // Format message content with markdown-like styling
  const formatContent = (content: string) => {
    // Split by lines and process
    const lines = content.split('\n');
    return lines.map((line, i) => {
      // Bold text
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      // Bullet points
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return <li key={i} className="ml-4" dangerouslySetInnerHTML={{ __html: line.substring(2) }} />;
      }

      // Numbered lists
      const numberedMatch = line.match(/^(\d+)\.\s(.+)/);
      if (numberedMatch) {
        return <li key={i} className="ml-4" dangerouslySetInnerHTML={{ __html: numberedMatch[2] }} />;
      }

      // Headers
      if (line.startsWith('## ')) {
        return <h4 key={i} className="font-semibold mt-2 mb-1">{line.substring(3)}</h4>;
      }

      // Regular paragraph
      if (line.trim()) {
        return <p key={i} className="mb-1" dangerouslySetInnerHTML={{ __html: line }} />;
      }

      return <br key={i} />;
    });
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-[#074C6B] to-[#0B2B3D] text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-[0_10px_40px_rgba(7,76,107,0.4)]"
        aria-label="Toggle AURORA chat"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <div className="relative">
            <MessageCircle className="h-7 w-7" />
            <Sparkles className="h-3 w-3 absolute -top-1 -right-1 text-[#A1D1E5]" />
          </div>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-28 right-6 z-50 w-[400px] max-w-[calc(100vw-3rem)] bg-background border border-border rounded-3xl shadow-2xl animate-scale-in overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0B2B3D] to-[#074C6B] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-[#A1D1E5]" />
              </div>
              <div>
                <h3 className="font-bold text-lg">AURORA</h3>
                <p className="text-xs text-white/70">AI Career Agent</p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              title="Reset conversation"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <ScrollArea ref={scrollAreaRef} className="h-[350px] p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl text-sm ${message.role === "user"
                        ? "bg-[#074C6B] text-white rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                      }`}
                  >
                    <div className="space-y-1">
                      {formatContent(message.content)}
                    </div>

                    {/* Quick Actions */}
                    {message.quickActions && message.quickActions.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.quickActions.map((action, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleQuickAction(action.value)}
                            disabled={isLoading}
                            className="px-3 py-2 text-xs font-medium rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] p-4 rounded-2xl rounded-bl-md text-sm bg-muted text-foreground flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-[#5D93A9]" />
                    <span className="text-muted-foreground">AURORA is thinking...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border bg-muted/30">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask AURORA anything..."
                onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSend()}
                disabled={isLoading}
                className="flex-1 rounded-xl border-border/50 focus:border-[#5D93A9]"
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="rounded-xl bg-[#074C6B] hover:bg-[#0B2B3D] w-10 h-10"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Powered by AI • Stage-aware career guidance
            </p>
          </div>
        </div>
      )}
    </>
  );
}
