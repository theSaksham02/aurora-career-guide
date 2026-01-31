import { useState, useRef, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Bot, User, Paperclip, FileText, Loader2, RefreshCw } from "lucide-react";
import { careerAgent, AgentMessage } from "@/lib/career-agent";
import * as pdfjsLib from "pdfjs-dist";

// Set worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export default function ChatPage() {
    const [messages, setMessages] = useState<AgentMessage[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialize chat or load history
    useEffect(() => {
        const history = careerAgent.getHistory();
        if (history.length === 0) {
            // Trigger initial greeting if empty
            handleSend("Hello!", true);
        } else {
            setMessages(history);
        }
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isLoading]);

    const handleSend = async (content: string = input, hidden: boolean = false) => {
        if (!content.trim()) return;

        if (!hidden) {
            // Optimistically add user message
            const userMsg: AgentMessage = {
                id: Date.now().toString(),
                role: "user",
                content: content,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, userMsg]);
        }

        setInput("");
        setIsLoading(true);

        try {
            // Get agent response
            await careerAgent.processMessage(content);
            const history = careerAgent.getHistory();
            setMessages(history);
        } catch (error) {
            console.error("Chat error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            alert("Please upload a PDF file.");
            return;
        }

        setIsUploading(true);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = "";

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(" ");
                fullText += pageText + "\n";
            }

            // Add a visual message for the file upload
            const fileMsg: AgentMessage = {
                id: Date.now().toString(),
                role: "user",
                content: `📄 **Attached:** ${file.name}`,
                timestamp: new Date(),
            };

            // Update state directly first so user sees the file
            setMessages(prev => [...prev, fileMsg]);

            // Send the content to the agent with a context wrapper
            const prompt = `I have uploaded my resume/document (${file.name}). Here is the content:\n\n${fullText}\n\nPlease analyze this and tell me my strengths, weaknesses, and how well I match my target role.`;

            setIsLoading(true);
            await careerAgent.processMessage(prompt);
            setMessages(careerAgent.getHistory());

        } catch (error) {
            console.error("PDF Error:", error);
            alert("Failed to read PDF. Please try a different file.");
        } finally {
            setIsUploading(false);
            setIsLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleReset = () => {
        careerAgent.reset();
        setMessages([]);
        handleSend("Hello!", true);
    };

    // Format message content with markdown-like styling (Matched with AuroraChat.tsx)
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
        <div className="flex flex-col h-[calc(100vh-80px)] mt-20 container mx-auto max-w-4xl px-4 md:px-0">
            {/* Header */}
            <div className="flex items-center justify-between py-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-[#A1D1E5] to-[#5D93A9] p-2 rounded-xl">
                        <Bot className="w-6 h-6 text-[#0B2B3D]" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">AURORA Chat</h1>
                        <p className="text-sm text-white/60">Your AI Career Assistant</p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="border-white/20 text-white/80 hover:bg-white/10 hover:text-white"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset Chat
                </Button>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 pr-4 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/5 p-4 mb-4">
                <div className="space-y-6">
                    {messages.map((msg, index) => (
                        <div
                            key={msg.id || index}
                            className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                        >
                            <Avatar className={`w-10 h-10 border-2 ${msg.role === 'user' ? 'border-indigo-500/50' : 'border-[#A1D1E5]/50'}`}>
                                <AvatarImage src={msg.role === 'user' ? undefined : "/aurora-avatar.png"} />
                                <AvatarFallback className={msg.role === 'user' ? 'bg-indigo-900 text-indigo-100' : 'bg-[#0B2B3D] text-[#A1D1E5]'}>
                                    {msg.role === "user" ? <User className="w-5 h-5" /> : "A"}
                                </AvatarFallback>
                            </Avatar>

                            <div
                                className={`flex flex-col max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"
                                    }`}
                            >
                                <div
                                    className={`px-5 py-3.5 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed ${msg.role === "user"
                                            ? "bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-tr-sm"
                                            : "bg-white text-slate-800 rounded-tl-sm shadow-md"
                                        }`}
                                >
                                    <div className="space-y-1">
                                        {formatContent(msg.content)}
                                    </div>
                                </div>
                                <span className="text-xs text-white/40 mt-1.5 px-1">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>

                                {/* Quick Actions */}
                                {msg.quickActions && (
                                    <div className="flex flex-wrap gap-2 mt-3 animate-fade-in">
                                        {msg.quickActions.map((action) => (
                                            <button
                                                key={action.value}
                                                onClick={() => handleSend(action.label)}
                                                className="px-3.5 py-2 text-xs font-medium rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white/90 transition-all hover:scale-105 active:scale-95"
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
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#0B2B3D] border-2 border-[#A1D1E5]/50 flex items-center justify-center">
                                <span className="text-[#A1D1E5] font-bold text-sm">A</span>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex items-center">
                                <Loader2 className="w-5 h-5 text-slate-500 animate-spin mr-2" />
                                <span className="text-slate-600 text-sm font-medium">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="relative mb-2">
                <div className="relative flex items-end gap-2 bg-white rounded-2xl p-2 shadow-lg ring-1 ring-black/5">
                    <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-100 mb-[1px]"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading || isUploading}
                    >
                        {isUploading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Paperclip className="w-5 h-5" />
                        )}
                    </Button>

                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                        placeholder={isUploading ? "Uploading file..." : "Ask AURORA anything..."}
                        className="flex-1 min-h-[48px] border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base placeholder:text-slate-400 py-3"
                        disabled={isLoading || isUploading}
                        autoFocus
                    />

                    <Button
                        size="icon"
                        onClick={() => handleSend()}
                        disabled={!input.trim() || isLoading || isUploading}
                        className="h-12 w-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 mb-[1px]"
                    >
                        <Send className="w-5 h-5" />
                    </Button>
                </div>
                <div className="text-center mt-2">
                    <p className="text-xs text-white/30">Powered by AI • Free Resume Analysis included</p>
                </div>
            </div>
        </div>
    );
}
