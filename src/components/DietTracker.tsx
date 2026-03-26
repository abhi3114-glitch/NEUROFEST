import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Log {
  time: string;
  food: string;
  reaction: string;
}

export default function DietTracker() {
  const [logs, setLogs] = useState<Log[]>(() => {
    const savedLogs = localStorage.getItem('dietLogs');
    return savedLogs ? JSON.parse(savedLogs) : [];
  });
  const [food, setFood] = useState('');
  const [reaction, setReaction] = useState('');

  useEffect(() => {
    localStorage.setItem('dietLogs', JSON.stringify(logs));
  }, [logs]);

  const addLog = () => {
    if (!food.trim()) return;
    setLogs([{ time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), food, reaction }, ...logs]);
    setFood('');
    setReaction('');
  };

  return (
    <Card className="neuronest-card animate-in fade-in slide-in-from-bottom-4">
      <CardHeader>
        <CardTitle className="text-2xl">Diet & Sensory Food Tracker</CardTitle>
        <CardDescription>Log meals and track sensory reactions (texture, smell, taste aversions)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6 bg-zinc-900/50 border border-white/10 p-4 rounded-xl shadow-inner">
          <Input 
            placeholder="What did the patient eat? (e.g., Apple slices)" 
            value={food} 
            onChange={e => setFood(e.target.value)} 
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-lg"
          />
          <Input 
            placeholder="Sensory reaction? (e.g., Disliked the skin texture)" 
            value={reaction} 
            onChange={e => setReaction(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-lg"
          />
          <Button onClick={addLog} className="w-full neuronest-button bg-blue-600 hover:bg-blue-700 text-white font-semibold">
            Save Meal Log
          </Button>
        </div>
        
        <ScrollArea className="h-64 rounded-xl border border-white/10 bg-black/20 p-4 shadow-inner">
          <div className="space-y-3">
            {logs.map((log, i) => (
               <div key={i} className="p-4 bg-zinc-900/40 backdrop-blur-md rounded-xl border border-white/10 shadow-lg flex flex-col gap-1 transition-all hover:bg-zinc-800/60">
                 <div className="flex justify-between font-bold text-white">
                   <span className="text-lg">{log.food}</span>
                   <span className="text-blue-400 text-sm font-medium bg-blue-500/10 px-2 py-0.5 rounded-full ring-1 ring-blue-500/30">{log.time}</span>
                 </div>
                 {log.reaction && <p className="text-gray-400 text-sm italic">"{log.reaction}"</p>}
               </div>
            ))}
            {logs.length === 0 && (
              <div className="h-full flex items-center justify-center text-gray-500 font-medium pt-12">
                No meals logged today.
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
