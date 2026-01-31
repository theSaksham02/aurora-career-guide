import { useState, useRef, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    User,
    Paperclip,
    Loader2,
    Sparkles,
    RefreshCw,
    ArrowUp,
    FileText,
    MessageSquare,
    Target,
    Briefcase,
    Zap
} from "lucide-react";
import { careerAgent, AgentMessage } from "@/lib/career-agent";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

// Suggested prompts for demo
const suggestedPrompts = [
    { icon: FileText, label: "Analyze my resume", prompt: "I'd like to upload my resume for analysis" },
    { icon: MessageSquare, label: "Practice interview", prompt: "Help me prepare for a software engineering interview at Google" },
    { icon: Target, label: "Career roadmap", prompt: "Create a personalized career roadmap from Junior to Senior Developer" },
    { icon: Briefcase, label: "Job search tips", prompt: "What are the best strategies for landing my first tech job?" },
];

export default function ChatPage() {
    const [messages, setMessages] = useState<AgentMessage[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showWelcome, setShowWelcome] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const history = careerAgent.getHistory();
        if (history.length > 0) {
            setMessages(history);
            setShowWelcome(false);
        }
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isLoading]);

    const handleSend = async (content: string = input) => {
        if (!content.trim()) return;

        setShowWelcome(false);

        const userMsg: AgentMessage = {
            id: Date.now().toString(),
            role: "user",
            content: content,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMsg]);

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
        setShowWelcome(false);

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
        setShowWelcome(true);
    };

    const formatContent = (content: string) => {
        const lines = content.split('\n');
        return lines.map((line, i) => {
            line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#A1D1E5]">$1</strong>');
            if (line.startsWith('## ')) return <h4 key={i} className="text-lg font-semibold mt-4 mb-2 text-white">{line.substring(3)}</h4>;
            if (line.startsWith('### ')) return <h5 key={i} className="font-semibold mt-3 mb-1 text-white/90">{line.substring(4)}</h5>;
            if (line.startsWith('- ') || line.startsWith('• ')) return <li key={i} className="ml-4 text-white/90" dangerouslySetInnerHTML={{ __html: line.substring(2) }} />;
            if (line.match(/^(\d+)\.\s/)) {
                const match = line.match(/^(\d+)\.\s(.+)/);
                return <li key={i} className="ml-4 list-decimal text-white/90" dangerouslySetInnerHTML={{ __html: match ? match[2] : line }} />;
            }
            if (line.trim()) return <p key={i} className="mb-2 leading-relaxed text-white/90" dangerouslySetInnerHTML={{ __html: line }} />;
            return <div key={i} className="h-2" />;
        });
    };

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] mt-24 container mx-auto max-w-5xl px-4 md:px-0">

            {/* Header Bar */}
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-2xl mb-4">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="bg-gradient-to-br from-[#A1D1E5] to-[#5D93A9] w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg">
                            <Sparkles className="w-6 h-6 text-[#0B2B3D]" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0B2B3D] animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                            AURORA AI
                            <span className="text-xs font-medium px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full">PRO</span>
                        </h1>
                        <p className="text-xs text-white/50 font-medium">Your AI Career Intelligence Partner</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                        className="text-white/50 hover:text-white hover:bg-white/10"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        New Chat
                    </Button>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 overflow-hidden rounded-3xl bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm border border-white/5">
                <ScrollArea className="h-full">
                    <div className="p-6 min-h-full">

                        {/* Welcome Screen */}
                        {showWelcome && messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in-up">
                                {/* Hero */}
                                <div className="relative mb-8">
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#A1D1E5]/20 to-[#5D93A9]/20 blur-3xl rounded-full" />
                                    <div className="relative w-24 h-24 bg-gradient-to-br from-[#A1D1E5] to-[#074C6B] rounded-3xl flex items-center justify-center shadow-2xl">
                                        <Zap className="w-12 h-12 text-white" />
                                    </div>
                                </div>

                                <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-3">
                                    How can I help your <span className="text-gradient bg-gradient-to-r from-[#A1D1E5] to-emerald-400">career</span> today?
                                </h2>
                                <p className="text-white/50 text-center max-w-md mb-10">
                                    I'm AURORA, your AI career coach. Ask me anything about resumes, interviews, job searching, or career planning.
                                </p>

                                {/* Suggested Prompts Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                                    {suggestedPrompts.map((item, index) => (
                                        <button
                                            key={item.label}
                                            onClick={() => handleSend(item.prompt)}
                                            className="group flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#A1D1E5]/50 rounded-2xl text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-lg animate-fade-in-up"
                                            style={{ animationDelay: `${index * 100}ms` }}
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#074C6B] to-[#0B2B3D] flex items-center justify-center group-hover:from-[#A1D1E5] group-hover:to-[#5D93A9] transition-all">
                                                <item.icon className="w-5 h-5 text-[#A1D1E5] group-hover:text-[#0B2B3D] transition-colors" />
                                            </div>
                                            <div>
                                                <span className="text-white font-semibold block">{item.label}</span>
                                                <span className="text-white/40 text-sm line-clamp-1">{item.prompt}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* Upload CTA */}
                                <div className="mt-8 flex items-center gap-3 text-white/30 text-sm">
                                    <div className="h-px flex-1 bg-white/10" />
                                    <span>or upload your resume to get started</span>
                                    <div className="h-px flex-1 bg-white/10" />
                                </div>
                            </div>
                        )}

                        {/* Messages */}
                        {messages.map((msg, index) => (
                            <div
                                key={msg.id || index}
                                className={`flex gap-4 mb-6 group ${msg.role === "user" ? "flex-row-reverse" : "flex-row"} animate-fade-in-up`}
                            >
                                <Avatar className={`w-10 h-10 border-2 shadow-lg mt-1 shrink-0 ${msg.role === 'user' ? 'border-white/20' : 'border-[#A1D1E5]/30'}`}>
                                    <AvatarImage src={msg.role === 'user' ? undefined : "/aurora-avatar.png"} />
                                    <AvatarFallback className={msg.role === 'user' ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' : 'bg-gradient-to-br from-[#A1D1E5] to-[#5D93A9] text-[#0B2B3D]'}>
                                        {msg.role === "user" ? <User className="w-5 h-5" /> : "A"}
                                    </AvatarFallback>
                                </Avatar>

                                <div className={`flex flex-col max-w-[85%] md:max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                                    <div
                                        className={`px-5 py-4 rounded-2xl shadow-lg text-[15px] leading-relaxed ${msg.role === "user"
                                                ? "bg-gradient-to-br from-[#074C6B] to-[#0B2B3D] border border-white/10 text-white rounded-tr-sm"
                                                : "bg-white/10 border border-white/10 text-slate-100 rounded-tl-sm"
                                            }`}
                                    >
                                        <div className="prose prose-invert max-w-none">
                                            {formatContent(msg.content)}
                                        </div>
                                    </div>

                                    <span className="text-[11px] text-white/30 mt-2 px-1 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>

                                    {msg.quickActions && msg.quickActions.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {msg.quickActions.map((action) => (
                                                <button
                                                    key={action.value}
                                                    onClick={() => handleSend(action.label)}
                                                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/5 hover:bg-[#A1D1E5]/20 border border-white/10 text-white/90 transition-all hover:scale-105"
                                                >
                                                    {action.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Loading */}
                        {isLoading && (
                            <div className="flex gap-4 animate-fade-in">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A1D1E5] to-[#5D93A9] flex items-center justify-center shrink-0 shadow-lg">
                                    <span className="text-[#0B2B3D] font-bold text-sm">A</span>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm inline-flex items-center gap-3">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-[#A1D1E5] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-2 h-2 bg-[#A1D1E5] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-2 h-2 bg-[#A1D1E5] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                    <span className="text-white/50 text-sm">AURORA is thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={scrollRef} className="h-4" />
                    </div>
                </ScrollArea>
            </div>

            {/* Input Bar */}
            <div className="mt-4 mb-2">
                <div className="relative flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-xl transition-all focus-within:border-[#A1D1E5]/50 focus-within:bg-white/10">
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
                        className="h-11 w-11 rounded-xl text-white/40 hover:text-white hover:bg-white/10"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading || isUploading}
                        title="Upload Resume (PDF)"
                    >
                        {isUploading ? (
                            <Loader2 className="w-5 h-5 animate-spin text-[#A1D1E5]" />
                        ) : (
                            <Paperclip className="w-5 h-5" />
                        )}
                    </Button>

                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                        placeholder={isUploading ? "Reading your resume..." : "Message AURORA..."}
                        className="flex-1 h-11 border-0 bg-transparent focus-visible:ring-0 text-base placeholder:text-white/30 text-white"
                        disabled={isLoading || isUploading}
                        autoFocus
                    />

                    <Button
                        size="icon"
                        onClick={() => handleSend()}
                        disabled={!input.trim() || isLoading || isUploading}
                        className={`h-11 w-11 rounded-xl transition-all ${!input.trim()
                                ? "bg-white/5 text-white/20"
                                : "bg-gradient-to-r from-[#A1D1E5] to-[#5D93A9] text-[#0B2B3D] hover:opacity-90 shadow-lg"
                            }`}
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowUp className="w-5 h-5" />}
                    </Button>
                </div>

                <p className="text-center text-[10px] text-white/20 mt-2 font-medium tracking-wide">
                    AURORA can make mistakes. Consider checking important information.
                </p>
            </div>
        </div>
    );
}
