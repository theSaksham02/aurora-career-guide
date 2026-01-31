import { useState, useRef, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Bot, User, Paperclip, Loader2, Sparkles, RefreshCw, ArrowUp } from "lucide-react";
import { careerAgent, AgentMessage } from "@/lib/career-agent";
import * as pdfjsLib from "pdfjs-dist";

// Set worker source for PDF.js - Ensure version matches installed package
// Using a specific version to avoid mismatch errors if possible, or dynamic
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
            handleSend("Hello!", true);
        } else {
            setMessages(history);
        }
    }, []);

    // Auto-scroll logic
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isLoading]);

    const handleSend = async (content: string = input, hidden: boolean = false) => {
        if (!content.trim()) return;

        if (!hidden) {
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

            const fileMsg: AgentMessage = {
                id: Date.now().toString(),
                role: "user",
                content: `📄 **Attached Resume:** ${file.name}`,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, fileMsg]);

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

    const formatContent = (content: string) => {
        const lines = content.split('\n');
        return lines.map((line, i) => {
            // Bold text
            line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            // Headers
            if (line.startsWith('## ')) return <h4 key={i} className="text-lg font-semibold mt-4 mb-2 text-white">{line.substring(3)}</h4>;
            if (line.startsWith('### ')) return <h5 key={i} className="font-semibold mt-3 mb-1 text-white/90">{line.substring(4)}</h5>;
            // Lists
            if (line.startsWith('- ') || line.startsWith('• ')) return <li key={i} className="ml-4 text-white/90" dangerouslySetInnerHTML={{ __html: line.substring(2) }} />;
            if (line.match(/^(\d+)\.\s/)) {
                const match = line.match(/^(\d+)\.\s(.+)/);
                return <li key={i} className="ml-4 list-decimal text-white/90" dangerouslySetInnerHTML={{ __html: match ? match[2] : line }} />;
            }
            // Paragraphs
            if (line.trim()) return <p key={i} className="mb-2 leading-relaxed text-white/90" dangerouslySetInnerHTML={{ __html: line }} />;
            return <div key={i} className="h-2" />;
        });
    };

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] mt-32 container mx-auto max-w-5xl px-4 md:px-0">

            {/* Glassmorphism Header */}
            <div className="absolute top-20 left-0 right-0 z-10 px-4 md:px-0 container mx-auto max-w-5xl">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-[#A1D1E5] to-[#5D93A9] w-10 h-10 rounded-xl flex items-center justify-center shadow-inner">
                            <Sparkles className="w-5 h-5 text-[#0B2B3D]" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white tracking-tight">AURORA AI</h1>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                <p className="text-xs text-white/70 font-medium">Online • Powered by Groq Llama 3</p>
                            </div>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                        className="text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        New Chat
                    </Button>
                </div>
            </div>

            {/* Messages Scroll Area */}
            <ScrollArea className="flex-1 rounded-3xl mt-24 mb-6 bg-gradient-to-b from-[#0B2B3D]/50 to-transparent backdrop-blur-sm border border-white/5 shadow-inner">
                <div className="p-6 space-y-8 min-h-full">
                    {/* Welcome Message Empty State */}
                    {messages.length === 0 && !isLoading && (
                        <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4 opacity-50">
                            <Bot className="w-16 h-16 text-white/20" />
                            <p className="text-white/40 text-lg">Start a conversation with AURORA</p>
                        </div>
                    )}

                    {messages.map((msg, index) => (
                        <div
                            key={msg.id || index}
                            className={`flex gap-4 group ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                        >
                            {/* Avatar */}
                            <Avatar className={`w-10 h-10 border-2 shadow-lg mt-1 shrink-0 ${msg.role === 'user' ? 'border-white/20' : 'border-[#A1D1E5]/50'}`}>
                                <AvatarImage src={msg.role === 'user' ? undefined : "/aurora-avatar.png"} />
                                <AvatarFallback className={msg.role === 'user' ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' : 'bg-[#0B2B3D] text-[#A1D1E5]'}>
                                    {msg.role === "user" ? <User className="w-5 h-5" /> : "A"}
                                </AvatarFallback>
                            </Avatar>

                            {/* Message Bubble */}
                            <div className={`flex flex-col max-w-[85%] md:max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                                <div
                                    className={`px-6 py-4 rounded-2xl shadow-xl backdrop-blur-md text-[15px] leading-relaxed transition-all duration-300 ${msg.role === "user"
                                        ? "bg-gradient-to-br from-[#074C6B] to-[#0B2B3D] border border-white/10 text-white rounded-tr-sm"
                                        : "bg-white/10 border border-white/10 text-slate-100 rounded-tl-sm hover:bg-white/15"
                                        }`}
                                >
                                    <div className="prose prose-invert max-w-none">
                                        {formatContent(msg.content)}
                                    </div>
                                </div>

                                {/* Timestamp */}
                                <span className={`text-[11px] text-white/30 mt-2 px-1 font-medium opacity-0 group-hover:opacity-100 transition-opacity`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>

                                {/* Quick Actions */}
                                {msg.quickActions && msg.quickActions.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3 animate-fade-in pl-1">
                                        {msg.quickActions.map((action) => (
                                            <button
                                                key={action.value}
                                                onClick={() => handleSend(action.label)}
                                                className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/5 hover:bg-white/20 border border-white/10 text-white/90 transition-all hover:scale-105 active:scale-95 shadow-sm"
                                            >
                                                {action.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Loading Indicator */}
                    {isLoading && (
                        <div className="flex gap-4 animate-pulse">
                            <div className="w-10 h-10 rounded-full bg-[#0B2B3D] border-2 border-[#A1D1E5]/50 flex items-center justify-center shrink-0">
                                <span className="text-[#A1D1E5] font-bold text-sm">A</span>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl rounded-tl-sm px-6 py-4 shadow-sm flex items-center gap-3">
                                <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                                <span className="text-white/70 text-sm font-medium">AURORA is thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={scrollRef} className="h-4" />
                </div>
            </ScrollArea>

            {/* Input Area - Floating Glassmorphism */}
            <div className="relative mb-6">
                <div className="relative flex items-end gap-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-2 shadow-2xl ring-1 ring-white/5 transition-all focus-within:ring-white/20 focus-within:bg-white/15">
                    {/* File Upload */}
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
                        className="h-12 w-12 rounded-2xl text-white/60 hover:text-white hover:bg-white/10 transition-all"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading || isUploading}
                        title="Upload Resume (PDF)"
                    >
                        {isUploading ? (
                            <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                        ) : (
                            <Paperclip className="w-5 h-5" />
                        )}
                    </Button>

                    {/* Text Input */}
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                        placeholder={isUploading ? "Reading resume..." : "Ask AURORA anything..."}
                        className="flex-1 min-h-[50px] border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base md:text-lg placeholder:text-white/30 text-white py-3 font-medium"
                        disabled={isLoading || isUploading}
                        autoFocus
                    />

                    {/* Send Button */}
                    <Button
                        size="icon"
                        onClick={() => handleSend()}
                        disabled={!input.trim() || isLoading || isUploading}
                        className={`h-12 w-12 rounded-2xl shadow-lg transition-all duration-300 ${!input.trim() ? "bg-white/10 text-white/20" : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:scale-105 hover:shadow-emerald-500/25"
                            }`}
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowUp className="w-6 h-6" />}
                    </Button>
                </div>

                {/* Footer Credit */}
                <div className="text-center mt-3">
                    <p className="text-[10px] text-white/20 font-medium uppercase tracking-widest">
                        Powered by Llama 3 • Secure Resume Analysis
                    </p>
                </div>
            </div>
        </div>
    );
}
