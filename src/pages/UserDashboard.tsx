import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import MoodTracker from '@/components/MoodTracker';
import CalmRoom from '@/components/CalmRoom';
import AACBoard from '@/components/AACBoard';
import CommunitySupport from '@/components/CommunitySupport';
import { groqClient, isAIAvailable } from '@/lib/groqClient';
import { 
  Home, 
  MessageSquare, 
  Send, 
  Gamepad2, 
  CheckSquare,
  Loader2,
  ArrowLeft,
  AlertCircle,
  Wind,
  Grid,
  Users,
  BellRing,
  Star,
  Wand2,
  Plus,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface DailyTask {
  id: string;
  task: string;
  completed: boolean;
}

const defaultTasks: DailyTask[] = [
  { id: '1', task: 'Brush teeth', completed: false },
  { id: '2', task: 'Eat breakfast', completed: false },
  { id: '3', task: 'Take morning medicine', completed: false },
  { id: '4', task: 'Complete learning activity', completed: false },
  { id: '5', task: 'Lunch time', completed: false },
  { id: '6', task: 'Afternoon rest', completed: false },
];

export default function UserDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'mood' | 'routine' | 'assistant' | 'calm' | 'aac' | 'community'>('mood');
  const [stars, setStars] = useState(() => parseInt(localStorage.getItem('userStars') || '0', 10));
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { 
      role: 'assistant', 
      content: 'Hello! I\'m your NeuroNest assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<DailyTask[]>(() => {
    const saved = localStorage.getItem('dailyTasks');
    return saved ? JSON.parse(saved) : defaultTasks;
  });
  const [newTaskInput, setNewTaskInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const aiConfigured = isAIAvailable();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const userMessage = userInput.trim();
    setUserInput('');
    
    // Add user message
    const newUserMessage: ChatMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    
    const updatedMessages = [...chatMessages, newUserMessage];
    setChatMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await groqClient.assistUser(userMessage);
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setChatMessages([...updatedMessages, assistantMessage]);
    } catch (error) {
      toast.error('Failed to get response from assistant');
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setChatMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSOS = () => {
    localStorage.setItem('criticalAlert', JSON.stringify({ time: new Date().toISOString(), message: "User triggered Emergency SOS!" }));
    toast.error("Emergency SOS Sent to Caregiver!", { duration: 5000 });
  };

  const assistBreakdown = async () => {
    if (!aiConfigured) return toast.error("AI Assistant not configured. Add Groq API key.");
    setIsLoading(true);
    try {
      const resp = await groqClient.assistUser("Break down the task 'Clean my room' into 3 simple, motivating steps for a child.");
      toast.success("AI Task Breakdown received!");
      const newMsg: ChatMessage = { role: 'assistant', content: resp, timestamp: new Date() };
      setChatMessages(prev => [...prev, newMsg]);
      setActiveTab('assistant');
    } catch (e) {
      toast.error("Failed to generate breakdown.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    const wasCompleted = task?.completed;
    
    const updatedTasks = tasks.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
    localStorage.setItem('dailyTasks', JSON.stringify(updatedTasks));
    
    if (!wasCompleted) {
      const newStars = stars + 1;
      setStars(newStars);
      localStorage.setItem('userStars', newStars.toString());
      toast.success(`Great job! ✨ Earned 1 Star! You have ${newStars} total.`);
    }
  };

  const resetTasks = () => {
    const resetTasks = tasks.map(task => ({ ...task, completed: false }));
    setTasks(resetTasks);
    localStorage.setItem('dailyTasks', JSON.stringify(resetTasks));
    toast.info('Daily tasks reset for a new day!');
  };

  const handleAddTask = () => {
    if (!newTaskInput.trim()) return;
    const newTask: DailyTask = {
      id: Date.now().toString(),
      task: newTaskInput.trim(),
      completed: false
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    localStorage.setItem('dailyTasks', JSON.stringify(updatedTasks));
    setNewTaskInput('');
    toast.success('Task added successfully!');
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem('dailyTasks', JSON.stringify(updatedTasks));
    toast.success('Task deleted.');
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercentage = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="min-h-screen calm-background">
      {/* Header */}
      <div className="bg-zinc-950/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="neuronest-container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
                className="touch-target"
                aria-label="Go back to home"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Home className="h-6 w-6 text-blue-500" />
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">My Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleSOS}
                className="bg-red-500 hover:bg-red-600 text-white font-bold animate-pulse shadow-lg hidden sm:flex"
              >
                <BellRing className="mr-2 h-5 w-5" />
                SOS Help
              </Button>
              <Button
                onClick={() => navigate('/learning-games')}
                className="neuronest-button bg-purple-500 hover:bg-purple-600 text-white"
              >
                <Gamepad2 className="mr-2 h-5 w-5 hidden sm:inline" />
                Play Games
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="neuronest-container py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Button
            onClick={() => setActiveTab('mood')}
            variant={activeTab === 'mood' ? 'default' : 'outline'}
            className={`neuronest-button ${activeTab === 'mood' ? 'bg-blue-500 text-white' : ''}`}
            size="lg"
          >
            😊 Mood Tracker
          </Button>
          <Button
            onClick={() => setActiveTab('routine')}
            variant={activeTab === 'routine' ? 'default' : 'outline'}
            className={`neuronest-button ${activeTab === 'routine' ? 'bg-blue-500 text-white' : ''}`}
            size="lg"
          >
            <CheckSquare className="mr-2 h-5 w-5" />
            Daily Routine
          </Button>
          <Button
            onClick={() => setActiveTab('assistant')}
            variant={activeTab === 'assistant' ? 'default' : 'outline'}
            className={`neuronest-button ${activeTab === 'assistant' ? 'bg-blue-500 text-white' : ''}`}
            size="lg"
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            AI Assistant
          </Button>
          <Button
            onClick={() => setActiveTab('calm')}
            variant={activeTab === 'calm' ? 'default' : 'outline'}
            className={`neuronest-button ${activeTab === 'calm' ? 'bg-blue-500 text-white' : ''}`}
            size="lg"
          >
            <Wind className="mr-2 h-5 w-5" />
            Calm Room
          </Button>
          <Button
            onClick={() => setActiveTab('aac')}
            variant={activeTab === 'aac' ? 'default' : 'outline'}
            className={`neuronest-button ${activeTab === 'aac' ? 'bg-blue-500 text-white' : ''}`}
            size="lg"
          >
            <Grid className="mr-2 h-5 w-5" />
            AAC Board
          </Button>
          <Button
            onClick={() => setActiveTab('community')}
            variant={activeTab === 'community' ? 'default' : 'outline'}
            className={`neuronest-button ${activeTab === 'community' ? 'bg-blue-500 text-white' : ''}`}
            size="lg"
          >
            <Users className="mr-2 h-5 w-5" />
            Community
          </Button>
        </div>

        {/* Content Area */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          {activeTab === 'mood' && <MoodTracker />}
          {activeTab === 'calm' && <CalmRoom />}
          {activeTab === 'aac' && <AACBoard />}
          {activeTab === 'community' && <CommunitySupport />}

          {activeTab === 'routine' && (
            <Card className="neuronest-card">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-3">
                      My Daily Routine
                      <span className="text-lg bg-yellow-500/20 text-yellow-400 font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" /> {stars} {stars === 1 ? 'Star' : 'Stars'}
                      </span>
                    </CardTitle>
                    <CardDescription className="text-base">
                      Check off tasks to earn stars!
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={assistBreakdown}
                      variant="outline"
                      size="sm"
                      className="text-purple-400 border-purple-500/30 hover:bg-purple-500/10 hidden sm:flex"
                    >
                      <Wand2 className="w-4 h-4 mr-1" /> Break Down Task
                    </Button>
                    <Button
                      onClick={resetTasks}
                      variant="outline"
                      size="sm"
                    >
                      Reset Tasks
                    </Button>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-400">Today's Progress</span>
                    <span className="text-sm font-bold text-blue-400">
                      {completedCount}/{tasks.length} ({progressPercentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3">
                    <div 
                      className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                      role="progressbar"
                      aria-valuenow={progressPercentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-2 p-1">
                  <Input 
                    placeholder="Add a new custom task..." 
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                    className="bg-white/5 border-white/10 text-white rounded-xl placeholder:text-gray-500 flex-1 h-12"
                  />
                  <Button onClick={handleAddTask} disabled={!newTaskInput.trim()} className="neuronest-button bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl h-12">
                    <Plus className="w-5 h-5 mr-1" /> Add
                  </Button>
                </div>
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`
                        flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 group
                        ${task.completed 
                          ? 'bg-green-500/10 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]' 
                          : 'bg-zinc-900/60 backdrop-blur-md border-white/10 hover:border-blue-400/50 hover:bg-zinc-800/80'
                        }
                      `}
                    >
                      <Checkbox
                        id={task.id}
                        checked={task.completed}
                        onCheckedChange={() => toggleTask(task.id)}
                        className="h-6 w-6 touch-target shrink-0"
                        aria-label={`Mark ${task.task} as ${task.completed ? 'incomplete' : 'complete'}`}
                      />
                      <label
                        htmlFor={task.id}
                        className={`
                          flex-1 text-lg cursor-pointer transition-all duration-300
                          ${task.completed ? 'line-through text-gray-600' : 'text-gray-200 font-medium'}
                        `}
                      >
                        {task.task}
                      </label>
                      {task.completed && <span className="text-2xl animate-in zoom-in shrink-0">✅</span>}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTask(task.id)}
                        className={`shrink-0 transition-opacity duration-300 ${task.completed ? 'opacity-50' : 'opacity-0 group-hover:opacity-100'} hover:text-red-400 hover:bg-red-500/20`}
                        aria-label="Delete task"
                      >
                        <Trash2 className="w-5 h-5 text-gray-500 hover:text-red-400" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'assistant' && (
            <Card className="neuronest-card">
              <CardHeader>
                <CardTitle className="text-2xl">AI Voice Assistant</CardTitle>
                <CardDescription className="text-base">
                  Ask me anything! I'm here to help you with reminders, questions, or just to chat
                </CardDescription>
                {!aiConfigured && (
                  <Alert className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      AI Assistant is not configured. Add your Groq API key to enable this feature.
                    </AlertDescription>
                  </Alert>
                )}
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4 mb-4" ref={scrollAreaRef}>
                  <div className="space-y-4">
                    {chatMessages.map((message, index) => (
                      <div
                        key={index}
                        className={`
                          flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}
                          animate-in fade-in slide-in-from-bottom-2 duration-300
                        `}
                      >
                        <div
                          className={`
                            max-w-[80%] p-4 rounded-2xl shadow-lg border border-white/5
                            ${message.role === 'user'
                              ? 'bg-blue-600/90 text-white backdrop-blur-sm'
                              : 'bg-zinc-800/90 text-gray-200 backdrop-blur-md'
                            }
                          `}
                        >
                          <p className="text-base whitespace-pre-wrap">{message.content}</p>
                          <p className="text-xs mt-2 opacity-70">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-zinc-800/80 backdrop-blur-sm p-4 rounded-2xl border border-white/5 shadow-lg">
                          <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                <div className="flex gap-2">
                  <Input
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message to NeuroNest..."
                    className="text-base p-6 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:ring-purple-500/50"
                    disabled={isLoading}
                    aria-label="Chat message input"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !userInput.trim()}
                    className="neuronest-button bg-blue-500 hover:bg-blue-600 text-white px-6"
                    size="lg"
                    aria-label="Send message"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}