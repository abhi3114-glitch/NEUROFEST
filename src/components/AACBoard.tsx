import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Apple, Coffee, HelpCircle, Bed, ThumbsUp, ThumbsDown, Activity, Heart } from 'lucide-react';

const options = [
  { text: "I'm hungry", icon: Apple, color: "bg-red-500/20 text-red-400 hover:border-red-400" },
  { text: "I'm thirsty", icon: Coffee, color: "bg-blue-500/20 text-blue-400 hover:border-blue-400" },
  { text: "I need help", icon: HelpCircle, color: "bg-orange-500/20 text-orange-400 hover:border-orange-400" },
  { text: "I'm tired", icon: Bed, color: "bg-indigo-500/20 text-indigo-400 hover:border-indigo-400" },
  { text: "I feel sick", icon: Activity, color: "bg-green-500/20 text-green-400 hover:border-green-400" },
  { text: "Yes", icon: ThumbsUp, color: "bg-emerald-500/20 text-emerald-400 hover:border-emerald-400" },
  { text: "No", icon: ThumbsDown, color: "bg-rose-500/20 text-rose-400 hover:border-rose-400" },
  { text: "I need a break", icon: Heart, color: "bg-pink-500/20 text-pink-400 hover:border-pink-400" },
];

export default function AACBoard() {
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <Card className="neuronest-card w-full animate-in fade-in zoom-in-95 duration-300">
      <CardHeader>
        <CardTitle className="text-2xl">Communication Board</CardTitle>
        <CardDescription>Tap an icon to say what you need aloud</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => speak(opt.text)}
              className={`p-6 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 ${opt.color} border-2 border-transparent touch-target shadow-sm`}
            >
              <opt.icon className="w-12 h-12" />
              <span className="font-bold text-lg text-center">{opt.text}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
