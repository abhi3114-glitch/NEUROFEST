import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
  Stethoscope,
  Activity,
  FileText,
  Pill,
  Video,
  Hospital,
  BrainCircuit,
  Plus,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface PatientRecord {
  id: string;
  name: string;
  age: number;
  condition: string;
  status: 'stable' | 'observation' | 'critical';
}

const mockPatients: PatientRecord[] = [
  { id: '1', name: 'Alex Johnson', age: 12, condition: 'Autism Spectrum Disorder', status: 'stable' },
  { id: '2', name: 'Emma Davis', age: 10, condition: 'Dyslexia & ADHD', status: 'observation' },
  { id: '3', name: 'Michael Chen', age: 14, condition: 'ADHD', status: 'stable' },
];

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord>(mockPatients[0]);
  const [prescriptions, setPrescriptions] = useState<{ id: number; name: string; dosage: string }[]>([
    { id: 1, name: 'Methylphenidate', dosage: '10mg daily' },
    { id: 2, name: 'Melatonin', dosage: '2mg before bed' }
  ]);
  const [isCalling, setIsCalling] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');

  const getStatusColor = (status: PatientRecord['status']) => {
    switch (status) {
      case 'stable': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'observation': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/50';
    }
  };

  const handleRevokePrescription = (id: number) => {
    const med = prescriptions.find(p => p.id === id);
    setPrescriptions(prescriptions.filter(p => p.id !== id));
    toast.success(`Prescription for "${med?.name}" has been revoked.`);
  };

  const handleAddPrescription = () => {
    if (!newMedName.trim() || !newMedDosage.trim()) {
      toast.error('Please fill in both medication name and dosage.');
      return;
    }
    setPrescriptions([...prescriptions, { id: Date.now(), name: newMedName.trim(), dosage: newMedDosage.trim() }]);
    setNewMedName('');
    setNewMedDosage('');
    setShowAddForm(false);
    toast.success(`Prescription for "${newMedName.trim()}" added successfully.`);
  };

  const handleTelehealth = () => {
    setIsCalling(true);
    toast.success("Connecting to secure WebRTC Telehealth portal...");
    setTimeout(() => {
      setIsCalling(false);
      toast.info("Patient unavailable at this time.");
    }, 4500);
  };

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
                className="touch-target text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Stethoscope className="h-6 w-6 text-purple-400" />
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  Doctor Portal
                </h1>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
              <Hospital className="h-4 w-4 text-blue-400"/>
              <span className="text-sm font-medium text-blue-200">NeuroNest Clinical System</span>
            </div>
          </div>
        </div>
      </div>

      <div className="neuronest-container py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Patient Roster Sidebar */}
          <div className="lg:col-span-1 border-r border-white/5 pr-4 hidden lg:block">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-gray-400" /> Patient Roster
            </h2>
            <div className="space-y-3">
              {mockPatients.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className={`
                    w-full p-4 rounded-xl border transition-all duration-300 text-left backdrop-blur-md
                    ${selectedPatient.id === patient.id
                      ? 'border-purple-500/50 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                    }
                  `}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-white">{patient.name}</h3>
                  </div>
                  <Badge className={`mb-2 ${getStatusColor(patient.status)}`}>
                    {patient.status.toUpperCase()}
                  </Badge>
                  <p className="text-xs text-gray-400">{patient.condition}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Main Clinical Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="emr" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-zinc-900/50 border border-white/10 rounded-xl shadow-sm">
                <TabsTrigger value="emr" className="text-sm py-3">
                  Electronic Medical Record (EMR)
                </TabsTrigger>
                <TabsTrigger value="prescriptions" className="text-sm py-3">
                  Prescriptions
                </TabsTrigger>
                <TabsTrigger value="telehealth" className="text-sm py-3 flex items-center justify-center">
                  Telehealth Connect
                </TabsTrigger>
              </TabsList>

              {/* EMR Tab */}
              <TabsContent value="emr" className="space-y-6">
                <Card className="neuronest-card">
                  <CardHeader>
                    <CardTitle className="text-3xl text-white">{selectedPatient.name}</CardTitle>
                    <CardDescription className="text-gray-400">
                      Primary Diagnosis: <span className="text-white font-medium">{selectedPatient.condition}</span> • Age: {selectedPatient.age}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                        <p className="text-sm text-purple-200 mb-1 flex items-center gap-1"><BrainCircuit className="w-4 h-4"/> AI Behavioral Analysis</p>
                        <p className="text-lg text-white font-medium mt-2">Patient logs indicate a 40% reduction in dysregulation events since the introduction of the digital Calm Room.</p>
                      </div>
                      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                        <p className="text-sm text-blue-200 mb-1 flex items-center gap-1"><Activity className="w-4 h-4"/> Recent Vitals Alert</p>
                        <p className="text-lg text-white font-medium mt-2">No critical heart rate or stress spikes detected in the last 72 hours.</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl text-white font-bold mb-3 mt-4 border-b border-white/10 pb-2">Therapist Notes</h3>
                      <div className="space-y-3">
                        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-xs text-gray-500 mb-1">Dr. S. Williams • Nov 8, 2025</p>
                          <p className="text-gray-300">Reviewed usage of Social Story Builder. Encouraged parents to create a 'Waiting at the Dentist' story before next checkup.</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-xs text-gray-500 mb-1">Dr. S. Williams • Oct 22, 2025</p>
                          <p className="text-gray-300">Introduced the new math games feature. Attention span tested well. Maintain current medication dosage.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Prescriptions Tab */}
              <TabsContent value="prescriptions" className="space-y-6">
                <Card className="neuronest-card">
                  <CardHeader>
                    <CardTitle className="text-2xl text-white flex items-center gap-2"><Pill className="text-green-400"/> Active Prescriptions</CardTitle>
                    <CardDescription className="text-gray-400">
                      Manage medication for {selectedPatient.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px] w-full pr-4">
                      {prescriptions.map(med => (
                        <div key={med.id} className="flex justify-between items-center p-4 bg-green-500/5 border border-green-500/20 rounded-xl mb-3 shadow-[0_0_15px_rgba(34,197,94,0.05)]">
                          <div>
                            <h4 className="text-lg font-bold text-white mb-1">{med.name}</h4>
                            <p className="text-green-300 text-sm">Dosage: {med.dosage}</p>
                          </div>
                          <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10" onClick={() => handleRevokePrescription(med.id)}>Revoke</Button>
                        </div>
                      ))}
                      {prescriptions.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                          <Pill className="w-10 h-10 mx-auto mb-2 opacity-40" />
                          <p>No active prescriptions for this patient.</p>
                        </div>
                      )}
                    </ScrollArea>
                    {showAddForm && (
                      <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="flex justify-between items-center">
                          <h4 className="text-white font-semibold">New Prescription</h4>
                          <Button variant="ghost" size="icon" onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-white"><X className="w-4 h-4" /></Button>
                        </div>
                        <Input placeholder="Medication name (e.g., Ritalin)" value={newMedName} onChange={e => setNewMedName(e.target.value)} className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-lg" />
                        <Input placeholder="Dosage (e.g., 5mg twice daily)" value={newMedDosage} onChange={e => setNewMedDosage(e.target.value)} className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-lg" />
                        <Button onClick={handleAddPrescription} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold">Confirm Prescription</Button>
                      </div>
                    )}
                    <Button onClick={() => setShowAddForm(!showAddForm)} className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold">
                       <Plus className="w-4 h-4 mr-2" /> Add New Prescription
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Telehealth Tab */}
              <TabsContent value="telehealth" className="space-y-6">
                <Card className="neuronest-card text-center py-16">
                  <CardHeader>
                    <div className="mx-auto bg-blue-500/10 p-6 rounded-full w-24 h-24 flex items-center justify-center mb-4 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                      <Video className="w-10 h-10 text-blue-400" />
                    </div>
                    <CardTitle className="text-3xl text-white">Telehealth Connect</CardTitle>
                    <CardDescription className="text-gray-400 max-w-md mx-auto mt-2">
                      Initiate a secure, encrypted WebRTC video call with {selectedPatient.name} or their caregivers.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={handleTelehealth} 
                      disabled={isCalling}
                      className="px-8 py-6 text-lg bg-blue-500 hover:bg-blue-600 text-white rounded-full font-bold transition-all shadow-[0_0_20px_rgba(59,130,246,0.5)] disabled:opacity-50"
                    >
                      {isCalling ? "Calling..." : "Start Virtual Consultation"}
                    </Button>
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
