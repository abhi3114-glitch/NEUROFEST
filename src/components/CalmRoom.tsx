import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

export default function CalmRoom() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [isAudioMuted, setIsAudioMuted] = useState(true);

  // Sensory Break Timer (Pomodoro-style)
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minute default break
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      if ('speechSynthesis' in window) {
         window.speechSynthesis.speak(new SpeechSynthesisUtterance("Sensory break is finished."));
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Simple breathing logical cycle: Inhale (4s), Exhale (4s)
  useEffect(() => {
    if (!isPlaying) return;
    
    let isMounted = true;
    const cycle = async () => {
       while (isMounted && isPlaying) {
          setPhase('Inhale');
          await new Promise(r => setTimeout(r, 4000));
          if (!isMounted || !isPlaying) break;
          
          setPhase('Exhale');
          await new Promise(r => setTimeout(r, 4000));
       }
    };
    cycle();
    return () => { isMounted = false; };
  }, [isPlaying]);

  return (
    <Card className="neuronest-card w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Interactive Calm Room</CardTitle>
        <CardDescription>Follow the circle to regulate your breathing and calm your senses.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-8 min-h-[400px] py-8">
        
        {/* Sensory Break Timer */}
        <div className="w-full max-w-sm bg-purple-500/10 p-6 rounded-3xl border-2 border-purple-500/20 flex flex-col items-center gap-4 mb-4 backdrop-blur-md">
           <h3 className="text-xl font-bold text-purple-300">Sensory Break Timer</h3>
           <div className="text-5xl font-mono font-bold text-purple-400 tracking-wider">
             {formatTime(timeLeft)}
           </div>
           <div className="flex gap-2 w-full mt-2">
             <Button 
               onClick={() => setIsTimerRunning(!isTimerRunning)} 
               className={`flex-1 ${isTimerRunning ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
             >
               {isTimerRunning ? 'Pause Break' : 'Start Break'}
             </Button>
             <Button 
               onClick={() => setTimeLeft(5 * 60)} 
               variant="outline" 
               className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 font-semibold"
             >
               Reset
             </Button>
           </div>
        </div>

        <div className="w-full h-px bg-white/10" />

        {/* Breathing Circle Container */}
        <div className="relative flex items-center justify-center w-64 h-64">
           {/* Center Circle */}
           <div 
             className="z-10 flex items-center justify-center rounded-full bg-blue-400 shadow-xl"
             style={{
               width: isPlaying ? (phase === 'Inhale' ? '240px' : '100px') : '150px',
               height: isPlaying ? (phase === 'Inhale' ? '240px' : '100px') : '150px',
               transition: 'all 4s ease-in-out'
             }}
           >
              <span className="text-white font-medium text-xl text-center px-4">
                {!isPlaying ? 'Ready' : phase}
              </span>
           </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4">
          <Button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="neuronest-button bg-blue-500 hover:bg-blue-600 text-white w-32"
          >
            {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {isPlaying ? 'Pause' : 'Start'}
          </Button>
          
          <Button 
            onClick={() => {
              setIsAudioMuted(!isAudioMuted);
              // In a real app, ambient audio would start here
            }}
            variant="outline"
            className="w-32"
          >
            {isAudioMuted ? <VolumeX className="mr-2 h-4 w-4" /> : <Volume2 className="mr-2 h-4 w-4" />}
            {isAudioMuted ? 'Unmute' : 'Mute'}
          </Button>
        </div>

        <p className="text-sm text-gray-500 mt-4 text-center max-w-sm">
          Focus on the circle. Take slow, deep breaths as it expands, and exhale as it shrinks.
        </p>

      </CardContent>
    </Card>
  );
}
