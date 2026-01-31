import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Edit3, Check, X, Plus, Trash2, GripVertical,
  Target, Sparkles, Loader2,
  FileText,
  Timer, MessageSquare, Send,
  TrendingUp, Briefcase, Clock, Settings,
  Calendar, ChevronRight
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { careerAgent, AgentMessage, CareerStage } from "@/lib/career-agent";
import { toast } from "sonner";

// Map user stage to agent stage
const mapUserStage = (stage: string): CareerStage => {
  const stageMap: Record<string, CareerStage> = {
    'Student': 'student',
    'Intern': 'intern_jobseeker',
    'Professional': 'professional',
  };
  return stageMap[stage] || 'unknown';
};

// Widget types
type WidgetType = 'stats' | 'tasks' | 'timer' | 'calendar' | 'ai';

interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  enabled: boolean;
}

const defaultWidgets: Widget[] = [
  { id: 'stats', type: 'stats', title: 'Quick Stats', enabled: true },
  { id: 'tasks', type: 'tasks', title: 'Career Tasks', enabled: true },
  { id: 'timer', type: 'timer', title: 'Focus Timer', enabled: true },
  { id: 'calendar', type: 'calendar', title: 'Upcoming Events', enabled: true },
  { id: 'ai', type: 'ai', title: 'AURORA AI', enabled: true },
];

// Task type
interface Task {
  id: string;
  title: string;
  completed: boolean;
  date: string;
}

export default function Dashboard() {
  const { profile, applications } = useUser();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Edit mode
  const [isEditMode, setIsEditMode] = useState(false);
  const [widgets, setWidgets] = useState<Widget[]>(() => {
    const saved = localStorage.getItem('aurora_dashboard_widgets');
    return saved ? JSON.parse(saved) : defaultWidgets;
  });

  // Tasks
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('aurora_tasks');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Complete Profile', completed: true, date: 'Jan 25' },
      { id: '2', title: 'Skills Assessment', completed: true, date: 'Jan 25' },
      { id: '3', title: 'Set Career Goals', completed: false, date: 'Jan 26' },
      { id: '4', title: 'Upload Resume', completed: false, date: 'Jan 26' },
    ];
  });
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Timer
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(1500);

  // AI Chat
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [input, setInput] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  // Stats
  const acceptedApps = applications.filter(a => a.status === 'accepted').length;
  const pendingApps = applications.filter(a => a.status === 'pending').length;
  const completedTasks = tasks.filter(t => t.completed).length;

  // Save widgets
  useEffect(() => {
    localStorage.setItem('aurora_dashboard_widgets', JSON.stringify(widgets));
  }, [widgets]);

  // Save tasks
  useEffect(() => {
    localStorage.setItem('aurora_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds(s => s - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Initialize AI
  useEffect(() => {
    if (!isInitialized) {
      const userStage = mapUserStage(profile.stage);
      careerAgent.setStage(userStage);
      const greeting = careerAgent.getGreeting(profile.name);
      setMessages([greeting]);
      setIsInitialized(true);
    }
  }, [isInitialized, profile]);

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
    } catch {
      toast.error("Failed to get response");
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
    } catch {
      toast.error("Failed to get response");
    } finally {
      setIsLoading(false);
    }
  };

  // Widget controls
  const toggleWidget = (id: string) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, enabled: !w.enabled } : w));
  };

  // Task controls
  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    setTasks(prev => [...prev, {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }]);
    setNewTaskTitle('');
    toast.success('Task added!');
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    toast.success('Task deleted');
  };

  // Widget renderer
  const renderWidget = (widget: Widget) => {
    if (!widget.enabled && !isEditMode) return null;

    switch (widget.type) {
      case 'stats':
        return (
          <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${!widget.enabled ? 'opacity-50' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">{widget.title}</h3>
              {isEditMode && (
                <button onClick={() => toggleWidget(widget.id)} className={`p-1 rounded ${widget.enabled ? 'text-green-500' : 'text-gray-400'}`}>
                  {widget.enabled ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                <p className="text-xs text-gray-500">Applications</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <Briefcase className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{acceptedApps}</p>
                <p className="text-xs text-gray-500">Accepted</p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-xl">
                <Clock className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{pendingApps}</p>
                <p className="text-xs text-gray-500">Pending</p>
              </div>
            </div>
          </div>
        );

      case 'tasks':
        return (
          <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${!widget.enabled ? 'opacity-50' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">{widget.title}</h3>
              {isEditMode && (
                <button onClick={() => toggleWidget(widget.id)} className={`p-1 rounded ${widget.enabled ? 'text-green-500' : 'text-gray-400'}`}>
                  {widget.enabled ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </button>
              )}
            </div>

            <div className="space-y-2 mb-4">
              {tasks.map(task => (
                <div key={task.id} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${task.completed ? 'bg-gray-50' : 'bg-blue-50/50'}`}>
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'
                      }`}
                  >
                    {task.completed && <Check className="w-3 h-3" />}
                  </button>
                  <span className={`flex-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {task.title}
                  </span>
                  <span className="text-xs text-gray-400">{task.date}</span>
                  <button onClick={() => deleteTask(task.id)} className="p-1 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                placeholder="Add new task..."
                className="text-sm"
              />
              <Button onClick={addTask} size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );

      case 'timer':
        return (
          <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${!widget.enabled ? 'opacity-50' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">{widget.title}</h3>
              {isEditMode && (
                <button onClick={() => toggleWidget(widget.id)} className={`p-1 rounded ${widget.enabled ? 'text-green-500' : 'text-gray-400'}`}>
                  {widget.enabled ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </button>
              )}
            </div>

            <div className="text-center py-6">
              <div className="text-5xl font-bold text-gray-900 mb-2">{formatTime(timerSeconds)}</div>
              <p className="text-sm text-gray-500 mb-6">{timerActive ? 'Focus time running' : 'Ready to focus'}</p>

              <div className="flex justify-center gap-3">
                <Button
                  onClick={() => setTimerActive(true)}
                  disabled={timerActive}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Start
                </Button>
                <Button
                  onClick={() => setTimerActive(false)}
                  disabled={!timerActive}
                  variant="outline"
                >
                  Pause
                </Button>
                <Button
                  onClick={() => { setTimerSeconds(1500); setTimerActive(false); }}
                  variant="outline"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        );

      case 'calendar':
        return (
          <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${!widget.enabled ? 'opacity-50' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">{widget.title}</h3>
              {isEditMode && (
                <button onClick={() => toggleWidget(widget.id)} className={`p-1 rounded ${widget.enabled ? 'text-green-500' : 'text-gray-400'}`}>
                  {widget.enabled ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </button>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                <Calendar className="w-10 h-10 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Resume Review</p>
                  <p className="text-sm text-gray-500">Today, 9:00 AM</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
                <Calendar className="w-10 h-10 text-purple-600" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Mock Interview</p>
                  <p className="text-sm text-gray-500">Tomorrow, 2:00 PM</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        );

      case 'ai':
        return (
          <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${!widget.enabled ? 'opacity-50' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">AURORA AI</h3>
                  <p className="text-xs text-gray-500">Career Assistant</p>
                </div>
              </div>
              {isEditMode && (
                <button onClick={() => toggleWidget(widget.id)} className={`p-1 rounded ${widget.enabled ? 'text-green-500' : 'text-gray-400'}`}>
                  {widget.enabled ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </button>
              )}
            </div>

            <ScrollArea className="h-40 mb-4">
              <div className="space-y-3">
                {messages.slice(-4).map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-xl text-sm ${msg.role === 'user'
                        ? 'bg-blue-600 text-white ml-8'
                        : 'bg-gray-100 text-gray-700'
                      }`}
                  >
                    {msg.content.length > 120 ? msg.content.slice(0, 120) + '...' : msg.content}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 p-3">
                    <Loader2 className="w-4 h-4 animate-spin" />
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
                className="text-sm"
                disabled={isLoading}
              />
              <Button onClick={handleSend} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                <Send className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {['Resume Tips', 'Interview Prep', 'Career Paths'].map(action => (
                <button
                  key={action}
                  onClick={() => handleQuickAction(action.toLowerCase())}
                  disabled={isLoading}
                  className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen font-sf bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <p className="text-gray-500 text-sm">Welcome back</p>
            <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsEditMode(!isEditMode)}
              variant={isEditMode ? "default" : "outline"}
              className={isEditMode ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              {isEditMode ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Done Editing
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Customize Dashboard
                </>
              )}
            </Button>
            <Link to="/profile">
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </Link>
          </div>
        </div>

        {/* Edit Mode Panel */}
        {isEditMode && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <GripVertical className="w-5 h-5 text-blue-600" />
              <p className="text-blue-800 font-medium">
                Edit Mode Active — Toggle widgets on/off using the checkmark buttons
              </p>
            </div>
          </div>
        )}

        {/* Widgets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {widgets.map(widget => (
            <div key={widget.id}>
              {renderWidget(widget)}
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/applications" className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <FileText className="w-8 h-8 text-blue-600" />
            <div>
              <p className="font-semibold text-gray-900">Applications</p>
              <p className="text-sm text-gray-500">{applications.length} total</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
          </Link>

          <Link to="/onboarding" className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <Target className="w-8 h-8 text-green-600" />
            <div>
              <p className="font-semibold text-gray-900">Onboarding</p>
              <p className="text-sm text-gray-500">Continue setup</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
          </Link>

          <Link to="/career-exploration" className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <MessageSquare className="w-8 h-8 text-purple-600" />
            <div>
              <p className="font-semibold text-gray-900">Explore Careers</p>
              <p className="text-sm text-gray-500">Find your path</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
          </Link>
        </div>
      </div>
    </div>
  );
}
