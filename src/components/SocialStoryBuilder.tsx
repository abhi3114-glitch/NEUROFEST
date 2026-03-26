import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImagePlus, Trash2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface StoryStep {
  id: number;
  image: string;
  text: string;
}

export default function SocialStoryBuilder() {
  const [steps, setSteps] = useState<StoryStep[]>(() => {
    const saved = localStorage.getItem('socialStories');
    return saved ? JSON.parse(saved) : [
      { id: 1, image: '🏥', text: "Today we are visiting Dr. Smith." },
      { id: 2, image: '🩺', text: "She will listen to my heart." },
      { id: 3, image: '🍭', text: "I get a sticker when I'm done!" }
    ];
  });

  useEffect(() => {
    localStorage.setItem('socialStories', JSON.stringify(steps));
  }, [steps]);

  const addStep = () => {
    setSteps([...steps, { id: Date.now(), image: '🖼️', text: '' }]);
  };

  const updateText = (id: number, text: string) => {
    setSteps(steps.map(s => s.id === id ? { ...s, text } : s));
  };
  
  const updateEmoji = (id: number, image: string) => {
    setSteps(steps.map(s => s.id === id ? { ...s, image } : s));
  };

  const removeStep = (id: number) => {
    setSteps(steps.filter(s => s.id !== id));
  };

  const playStory = () => {
    toast.success("Story Saved! (In production this opens the guided visual viewer)");
  };

  return (
    <Card className="neuronest-card animate-in fade-in slide-in-from-bottom-4">
      <CardHeader>
        <CardTitle className="text-2xl">Social Story Builder</CardTitle>
        <CardDescription>Create step-by-step visual narratives to prepare the user for new or stressful situations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, idx) => (
             <div key={step.id} className="flex flex-col sm:flex-row items-center gap-3 bg-purple-500/10 p-4 rounded-xl border border-purple-500/20 shadow-sm relative group backdrop-blur-md">
               <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/30 text-purple-300 font-bold flex-shrink-0">
                 {idx + 1}
               </div>
               <Input 
                 className="w-16 h-16 text-center text-3xl bg-white/5 border-white/10 text-white shadow-sm rounded-xl focus:ring-purple-400" 
                 value={step.image} 
                 onChange={e => updateEmoji(step.id, e.target.value)} 
                 placeholder="😎"
                 maxLength={2}
               />
               <Input 
                 className="flex-1 h-16 text-lg bg-white/5 border-white/10 text-white shadow-sm rounded-xl px-4 focus:ring-purple-400 placeholder:text-gray-500" 
                 value={step.text} 
                 onChange={e => updateText(step.id, e.target.value)}
                 placeholder="Type what happens in this step..."
               />
               <Button 
                 variant="ghost" 
                 className="h-16 w-16 text-red-400 opacity-50 hover:opacity-100 hover:text-red-400 hover:bg-red-500/10 rounded-xl" 
                 onClick={() => removeStep(step.id)}
               >
                 <Trash2 className="w-6 h-6" />
               </Button>
               {idx < steps.length - 1 && (
                 <ArrowRight className="absolute -bottom-6 left-1/2 sm:left-auto sm:-right-4 sm:top-1/2 -ml-3 sm:ml-0 -mt-3 text-purple-300 w-6 h-6 rotate-90 sm:rotate-0 z-10" />
               )}
             </div>
          ))}
          
          <div className="flex gap-4 pt-6">
             <Button onClick={addStep} variant="outline" className="flex-1 h-14 text-lg gap-2 border-purple-500/30 text-purple-300 hover:bg-purple-500/10 font-semibold rounded-xl">
               <ImagePlus className="w-5 h-5" /> Add Step
             </Button>
             <Button onClick={playStory} className="flex-1 h-14 text-lg neuronest-button bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl">
               Save Story
             </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
