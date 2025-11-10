import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Save } from 'lucide-react';
import { toast } from 'sonner';

interface Mood {
  emoji: string;
  label: string;
  color: string;
}

const moods: Mood[] = [
  { emoji: '😊', label: 'Happy', color: 'bg-yellow-100 hover:bg-yellow-200' },
  { emoji: '😢', label: 'Sad', color: 'bg-blue-100 hover:bg-blue-200' },
  { emoji: '😠', label: 'Angry', color: 'bg-red-100 hover:bg-red-200' },
  { emoji: '😰', label: 'Anxious', color: 'bg-purple-100 hover:bg-purple-200' },
  { emoji: '😴', label: 'Tired', color: 'bg-gray-100 hover:bg-gray-200' },
  { emoji: '😌', label: 'Calm', color: 'bg-green-100 hover:bg-green-200' },
];

interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [note, setNote] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice input is not supported in your browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      toast.info('Listening... Speak now');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setNote(transcript);
      toast.success('Voice input captured!');
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      toast.error('Could not capture voice input');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const saveMood = () => {
    if (!selectedMood) {
      toast.error('Please select a mood first');
      return;
    }

    const moodEntry = {
      mood: selectedMood.label,
      emoji: selectedMood.emoji,
      note,
      timestamp: new Date().toISOString(),
    };

    // Save to localStorage
    const existingMoods = JSON.parse(localStorage.getItem('moodHistory') || '[]');
    existingMoods.push(moodEntry);
    localStorage.setItem('moodHistory', JSON.stringify(existingMoods));

    toast.success(`Mood saved: ${selectedMood.emoji} ${selectedMood.label}`);
    
    // Reset
    setSelectedMood(null);
    setNote('');
  };

  return (
    <Card className="neuronest-card">
      <CardHeader>
        <CardTitle className="text-2xl">How are you feeling today?</CardTitle>
        <CardDescription className="text-base">Select an emoji that matches your mood</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mood Selection */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {moods.map((mood) => (
            <button
              key={mood.label}
              onClick={() => setSelectedMood(mood)}
              className={`
                ${mood.color}
                p-4 rounded-2xl transition-all duration-200 touch-target
                ${selectedMood?.label === mood.label ? 'ring-4 ring-blue-400 scale-110' : 'hover:scale-105'}
                flex flex-col items-center gap-2
              `}
            >
              <span className="text-5xl">{mood.emoji}</span>
              <span className="text-sm font-medium text-gray-700">{mood.label}</span>
            </button>
          ))}
        </div>

        {/* Selected Mood Display */}
        {selectedMood && (
          <div className="p-4 bg-blue-50 rounded-xl text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
            <p className="text-lg">
              You selected: <span className="text-3xl mx-2">{selectedMood.emoji}</span>
              <span className="font-semibold text-blue-600">{selectedMood.label}</span>
            </p>
          </div>
        )}

        {/* Note Input */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Want to add a note? (Optional)
          </label>
          <div className="flex gap-2">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Tell us more about how you're feeling..."
              className="flex-1 min-h-[100px] p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
            />
          </div>
          <Button
            onClick={handleVoiceInput}
            disabled={isListening}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Mic className={`mr-2 h-4 w-4 ${isListening ? 'animate-pulse text-red-500' : ''}`} />
            {isListening ? 'Listening...' : 'Use Voice Input'}
          </Button>
        </div>

        {/* Save Button */}
        <Button
          onClick={saveMood}
          disabled={!selectedMood}
          className="w-full neuronest-button bg-blue-500 hover:bg-blue-600 text-white"
          size="lg"
        >
          <Save className="mr-2 h-5 w-5" />
          Save My Mood
        </Button>
      </CardContent>
    </Card>
  );
}