import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Users, 
  TrendingUp, 
  AlertCircle,
  Calendar,
  MessageSquare,
  FileText
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
        return 'bg-green-100 text-green-800 border-green-200';
      case 'needs-attention':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const recentMoods = moodHistory.slice(-5).reverse();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
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
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-green-500" />
                <h1 className="text-2xl font-bold text-gray-900">Caregiver Dashboard</h1>
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
                        w-full p-4 rounded-xl border-2 transition-all duration-200 text-left
                        ${selectedPatient.id === patient.id
                          ? 'border-blue-400 bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-blue-200'
                        }
                      `}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                        <Badge className={getStatusColor(patient.status)}>
                          {patient.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">Age: {patient.age}</p>
                      <p className="text-sm text-gray-600">{patient.condition}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-white rounded-xl shadow-sm">
                <TabsTrigger value="overview" className="text-sm py-3">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="mood" className="text-sm py-3">
                  Mood Logs
                </TabsTrigger>
                <TabsTrigger value="alerts" className="text-sm py-3">
                  Alerts
                </TabsTrigger>
                <TabsTrigger value="notes" className="text-sm py-3">
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
                      <div className="p-4 bg-blue-50 rounded-xl">
                        <p className="text-sm text-gray-600 mb-1">Age</p>
                        <p className="text-2xl font-bold text-gray-900">{selectedPatient.age} years</p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-xl">
                        <p className="text-sm text-gray-600 mb-1">Condition</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedPatient.condition}</p>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="p-4 bg-green-50 rounded-xl text-center">
                        <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Tasks Completed</p>
                        <p className="text-2xl font-bold text-gray-900">4/6</p>
                      </div>
                      <div className="p-4 bg-yellow-50 rounded-xl text-center">
                        <Calendar className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Mood Entries</p>
                        <p className="text-2xl font-bold text-gray-900">{moodHistory.length}</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-xl text-center">
                        <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">AI Interactions</p>
                        <p className="text-2xl font-bold text-gray-900">12</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
                              className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start gap-4">
                                <span className="text-4xl">{entry.emoji}</span>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-lg text-gray-900">
                                      {entry.mood}
                                    </h4>
                                    <span className="text-sm text-gray-500">
                                      {new Date(entry.timestamp).toLocaleDateString()} at{' '}
                                      {new Date(entry.timestamp).toLocaleTimeString()}
                                    </span>
                                  </div>
                                  {entry.note && (
                                    <p className="text-gray-600 text-base">{entry.note}</p>
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
                      <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
                        <div className="flex gap-3">
                          <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-gray-900">Routine Incomplete</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {selectedPatient.name} has 2 tasks remaining for today
                            </p>
                            <p className="text-xs text-gray-500 mt-2">2 hours ago</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-lg">
                        <div className="flex gap-3">
                          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-gray-900">Learning Progress</h4>
                            <p className="text-sm text-gray-600 mt-1">
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
                      <div className="p-4 bg-white border border-gray-200 rounded-xl">
                        <div className="flex items-start gap-3 mb-3">
                          <FileText className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">Session Notes - Nov 8, 2025</h4>
                            <p className="text-sm text-gray-500">Dr. Sarah Williams</p>
                          </div>
                        </div>
                        <p className="text-gray-600 text-base">
                          Patient showed excellent progress in emotion recognition activities. 
                          Recommend continuing with current learning path. Mood tracking indicates 
                          stable emotional state.
                        </p>
                      </div>

                      <div className="p-4 bg-white border border-gray-200 rounded-xl">
                        <div className="flex items-start gap-3 mb-3">
                          <FileText className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">Session Notes - Nov 1, 2025</h4>
                            <p className="text-sm text-gray-500">Dr. Sarah Williams</p>
                          </div>
                        </div>
                        <p className="text-gray-600 text-base">
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