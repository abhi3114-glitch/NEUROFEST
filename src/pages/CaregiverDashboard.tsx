import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VisionMonitor from '@/components/VisionMonitor';
import DietTracker from '@/components/DietTracker';
import SocialStoryBuilder from '@/components/SocialStoryBuilder';
import { 
  ArrowLeft, 
  Users, 
  TrendingUp, 
  AlertCircle,
  Calendar,
  MessageSquare,
  FileText,
  Camera,
  HeartPulse,
  Utensils,
  BookOpen,
  ActivitySquare
} from 'lucide-react';

interface MoodEntry {
  mood: string;
  emoji: string;
  note: string;
  timestamp: string;
}

interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  status: 'stable' | 'needs-attention' | 'critical';
}

const mockPatients: Patient[] = [
  { id: '1', name: 'Alex Johnson', age: 12, condition: 'Autism Spectrum', status: 'stable' },
  { id: '2', name: 'Emma Davis', age: 10, condition: 'Dyslexia', status: 'stable' },
  { id: '3', name: 'Michael Chen', age: 14, condition: 'ADHD', status: 'needs-attention' },
];

export default function CaregiverDashboard() {
  const navigate = useNavigate();
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient>(mockPatients[0]);

  useEffect(() => {
    // Load mood history from localStorage
    const saved = localStorage.getItem('moodHistory');
    if (saved) {
      setMoodHistory(JSON.parse(saved));
    }
  }, []);

  const getStatusColor = (status: Patient['status']) => {
    switch (status) {
      case 'stable':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'needs-attention':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
    }
  };

  const recentMoods = moodHistory.slice(-5).reverse();

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
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-green-500" />
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">Caregiver Dashboard</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="neuronest-container py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Patient List Sidebar */}
          <div className="lg:col-span-1">
            <Card className="neuronest-card">
              <CardHeader>
                <CardTitle className="text-xl">Patient List</CardTitle>
                <CardDescription>Select a patient to view details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockPatients.map((patient) => (
                    <button
                      key={patient.id}
                      onClick={() => setSelectedPatient(patient)}
                      className={`
                        w-full p-4 rounded-xl border transition-all duration-300 text-left backdrop-blur-md
                        ${selectedPatient.id === patient.id
                          ? 'border-blue-500/50 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                        }
                      `}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-white">{patient.name}</h3>
                        <Badge className={getStatusColor(patient.status)}>
                          {patient.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400">Age: {patient.age}</p>
                      <p className="text-sm text-gray-400">{patient.condition}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-7 h-auto p-1 bg-zinc-900/50 border border-white/10 rounded-xl shadow-sm hidden lg:grid">
                <TabsTrigger value="overview" className="text-sm py-3">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="mood" className="text-sm py-3">
                  Mood Logs
                </TabsTrigger>
                <TabsTrigger value="vision" className="text-sm py-3 flex items-center justify-center">
                  <Camera className="w-4 h-4 mr-1 hidden lg:inline" /> Monitor
                </TabsTrigger>
                <TabsTrigger value="diet" className="text-sm py-3">
                  Diet
                </TabsTrigger>
                <TabsTrigger value="story" className="text-sm py-3">
                  Story
                </TabsTrigger>
                <TabsTrigger value="alerts" className="text-sm py-3">
                  Alerts
                </TabsTrigger>
                <TabsTrigger value="notes" className="text-sm py-3">
                  Notes
                </TabsTrigger>
              </TabsList>
              
              {/* Mobile variant for TabsList */}
              <TabsList className="flex w-full overflow-x-auto h-auto p-1 bg-zinc-900/50 border border-white/10 rounded-xl shadow-sm lg:hidden scrollbar-hide">
                <TabsTrigger value="overview" className="text-sm py-3 px-4 min-w-fit">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="mood" className="text-sm py-3 px-4 min-w-fit">
                  Mood Logs
                </TabsTrigger>
                <TabsTrigger value="vision" className="text-sm py-3 px-4 min-w-fit flex items-center">
                  <Camera className="w-4 h-4 mr-1" /> Monitor
                </TabsTrigger>
                <TabsTrigger value="diet" className="text-sm py-3 px-4 min-w-fit flex items-center">
                  <Utensils className="w-4 h-4 mr-1" /> Diet
                </TabsTrigger>
                <TabsTrigger value="story" className="text-sm py-3 px-4 min-w-fit flex items-center">
                  <BookOpen className="w-4 h-4 mr-1" /> Story
                </TabsTrigger>
                <TabsTrigger value="alerts" className="text-sm py-3 px-4 min-w-fit">
                  Alerts
                </TabsTrigger>
                <TabsTrigger value="notes" className="text-sm py-3 px-4 min-w-fit">
                  Notes
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <Card className="neuronest-card">
                  <CardHeader>
                    <CardTitle className="text-2xl">{selectedPatient.name}</CardTitle>
                    <CardDescription className="text-base">
                      Patient Overview & Recent Activity
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Patient Info */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                        <p className="text-sm text-blue-200 mb-1">Age</p>
                        <p className="text-2xl font-bold text-white">{selectedPatient.age} years</p>
                      </div>
                      <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                        <p className="text-sm text-purple-200 mb-1">Condition</p>
                        <p className="text-lg font-semibold text-white">{selectedPatient.condition}</p>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
                        <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
                        <p className="text-sm text-green-200">Tasks Completed</p>
                        <p className="text-2xl font-bold text-white">4/6</p>
                      </div>
                      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-center">
                        <Calendar className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                        <p className="text-sm text-yellow-200">Mood Entries</p>
                        <p className="text-2xl font-bold text-white">{moodHistory.length}</p>
                      </div>
                      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-center">
                        <MessageSquare className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                        <p className="text-sm text-blue-200">AI Interactions</p>
                        <p className="text-2xl font-bold text-white">12</p>
                      </div>
                    </div>

                    {/* Smart Wearable Mock Integrations */}
                    <div className="mt-8 border-t border-white/10 pt-6">
                       <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                          <HeartPulse className="text-red-500 w-6 h-6" /> Live Vitals (Mock Wearable)
                       </h3>
                       <div className="grid sm:grid-cols-2 gap-4">
                         <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.15)] flex items-center justify-between">
                            <div>
                               <p className="text-sm text-red-400 font-medium">Heart Rate</p>
                               <p className="text-3xl font-bold text-white animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">84 bpm</p>
                            </div>
                            <HeartPulse className="w-10 h-10 text-red-400 opacity-80" />
                         </div>
                         <div className="p-4 bg-orange-500/10 rounded-xl border border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.15)] flex items-center justify-between">
                            <div>
                               <p className="text-sm text-orange-400 font-medium">Stress Level</p>
                               <p className="text-3xl font-bold text-white drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]">Low</p>
                            </div>
                            <ActivitySquare className="w-10 h-10 text-orange-400 opacity-80" />
                         </div>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Vision Monitor Tab */}
              <TabsContent value="vision" className="space-y-6">
                <VisionMonitor />
              </TabsContent>

              {/* Diet Tracker Tab */}
              <TabsContent value="diet" className="space-y-6">
                <DietTracker />
              </TabsContent>

              {/* Social Story Tab */}
              <TabsContent value="story" className="space-y-6">
                <SocialStoryBuilder />
              </TabsContent>

              {/* Mood Logs Tab */}
              <TabsContent value="mood">
                <Card className="neuronest-card">
                  <CardHeader>
                    <CardTitle className="text-2xl">Mood History</CardTitle>
                    <CardDescription className="text-base">
                      Recent mood entries for {selectedPatient.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[500px] pr-4">
                      {recentMoods.length === 0 ? (
                        <div className="text-center py-12">
                          <p className="text-gray-500 text-lg">No mood entries yet</p>
                          <p className="text-gray-400 text-sm mt-2">
                            Mood entries will appear here once the user tracks their mood
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {recentMoods.map((entry, index) => (
                            <div
                              key={index}
                              className="p-4 bg-zinc-900/40 border border-white/10 rounded-xl hover:bg-zinc-800/60 transition-all backdrop-blur-md"
                            >
                              <div className="flex items-start gap-4">
                                <span className="text-4xl">{entry.emoji}</span>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-lg text-white">
                                      {entry.mood}
                                    </h4>
                                    <span className="text-sm text-gray-500">
                                      {new Date(entry.timestamp).toLocaleDateString()} at{' '}
                                      {new Date(entry.timestamp).toLocaleTimeString()}
                                    </span>
                                  </div>
                                  {entry.note && (
                                    <p className="text-gray-400 text-base">{entry.note}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Alerts Tab */}
              <TabsContent value="alerts">
                <Card className="neuronest-card">
                  <CardHeader>
                    <CardTitle className="text-2xl">Active Alerts</CardTitle>
                    <CardDescription className="text-base">
                      Real-time notifications and important updates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-yellow-500/10 border-l-4 border-yellow-400 rounded-lg">
                        <div className="flex gap-3">
                          <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-white">Routine Incomplete</h4>
                            <p className="text-sm text-gray-400 mt-1">
                              {selectedPatient.name} has 2 tasks remaining for today
                            </p>
                            <p className="text-xs text-gray-500 mt-2">2 hours ago</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-500/10 border-l-4 border-blue-400 rounded-lg">
                        <div className="flex gap-3">
                          <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-white">Learning Progress</h4>
                            <p className="text-sm text-gray-400 mt-1">
                              Completed 3 learning activities today - Great progress!
                            </p>
                            <p className="text-xs text-gray-500 mt-2">4 hours ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notes Tab */}
              <TabsContent value="notes">
                <Card className="neuronest-card">
                  <CardHeader>
                    <CardTitle className="text-2xl">Therapy Notes</CardTitle>
                    <CardDescription className="text-base">
                      Medical history and session notes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-zinc-900/40 border border-white/10 rounded-xl backdrop-blur-md">
                        <div className="flex items-start gap-3 mb-3">
                          <FileText className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-white">Session Notes - Nov 8, 2025</h4>
                            <p className="text-sm text-gray-500">Dr. Sarah Williams</p>
                          </div>
                        </div>
                        <p className="text-gray-400 text-base">
                          Patient showed excellent progress in emotion recognition activities. 
                          Recommend continuing with current learning path. Mood tracking indicates 
                          stable emotional state.
                        </p>
                      </div>

                      <div className="p-4 bg-zinc-900/40 border border-white/10 rounded-xl backdrop-blur-md">
                        <div className="flex items-start gap-3 mb-3">
                          <FileText className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-white">Session Notes - Nov 1, 2025</h4>
                            <p className="text-sm text-gray-500">Dr. Sarah Williams</p>
                          </div>
                        </div>
                        <p className="text-gray-400 text-base">
                          Introduced new literacy games. Patient engaged well with visual learning 
                          materials. Continue monitoring daily routine completion.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}