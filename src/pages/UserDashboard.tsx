import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import MoodTracker from '@/components/MoodTracker';
import { groqClient, isAIAvailable } from '@/lib/groqClient';
import { 
  Home, 
  MessageSquare, 
  Send, 
  Gamepad2, 
  CheckSquare,
  Loader2,
  ArrowLeft,
  AlertCircle
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
  const [activeTab, setActiveTab] = useState<'mood' | 'routine' | 'assistant'>('mood');
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

  const toggleTask = (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('dailyTasks', JSON.stringify(updatedTasks));
    
    const task = updatedTasks.find(t => t.id === taskId);
    if (task?.completed) {
      toast.success(`Great job! ✨ ${task.task} completed!`);
    }
  };

  const resetTasks = () => {
    const resetTasks = tasks.map(task => ({ ...task, completed: false }));
    setTasks(resetTasks);
    localStorage.setItem('dailyTasks', JSON.stringify(resetTasks));
    toast.info('Daily tasks reset for a new day!');
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercentage = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
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
                <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
              </div>
            </div>
            <Button
              onClick={() => navigate('/learning-games')}
              className="neuronest-button bg-purple-500 hover:bg-purple-600 text-white"
            >
              <Gamepad2 className="mr-2 h-5 w-5" />
              Play Games
            </Button>
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
        </div>

        {/* Content Area */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          {activeTab === 'mood' && <MoodTracker />}

          {activeTab === 'routine' && (
            <Card className="neuronest-card">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">My Daily Routine</CardTitle>
                    <CardDescription className="text-base">
                      Check off tasks as you complete them throughout the day
                    </CardDescription>
                  </div>
                  <Button
                    onClick={resetTasks}
                    variant="outline"
                    size="sm"
                  >
                    Reset Tasks
                  </Button>
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Today's Progress</span>
                    <span className="text-sm font-bold text-blue-600">
                      {completedCount}/{tasks.length} ({progressPercentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
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
              <CardContent>
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`
                        flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200
                        ${task.completed 
                          ? 'bg-green-50 border-green-300' 
                          : 'bg-white border-gray-200 hover:border-blue-300'
                        }
                      `}
                    >
                      <Checkbox
                        id={task.id}
                        checked={task.completed}
                        onCheckedChange={() => toggleTask(task.id)}
                        className="h-6 w-6 touch-target"
                        aria-label={`Mark ${task.task} as ${task.completed ? 'incomplete' : 'complete'}`}
                      />
                      <label
                        htmlFor={task.id}
                        className={`
                          flex-1 text-lg cursor-pointer
                          ${task.completed ? 'line-through text-gray-500' : 'text-gray-900 font-medium'}
                        `}
                      >
                        {task.task}
                      </label>
                      {task.completed && <span className="text-2xl" aria-label="Completed">✅</span>}
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
                            max-w-[80%] p-4 rounded-2xl
                            ${message.role === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-900'
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
                        <div className="bg-gray-100 p-4 rounded-2xl">
                          <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
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
                    placeholder="Type your message here..."
                    className="text-base p-6 rounded-xl"
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