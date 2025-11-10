import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Star, Trophy, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface Emotion {
  emoji: string;
  name: string;
  description: string;
}

const emotions: Emotion[] = [
  { emoji: '😊', name: 'Happy', description: 'Feeling joyful and content' },
  { emoji: '😢', name: 'Sad', description: 'Feeling down or upset' },
  { emoji: '😠', name: 'Angry', description: 'Feeling frustrated or mad' },
  { emoji: '😰', name: 'Worried', description: 'Feeling anxious or nervous' },
  { emoji: '😴', name: 'Tired', description: 'Feeling sleepy or exhausted' },
  { emoji: '😌', name: 'Calm', description: 'Feeling peaceful and relaxed' },
];

const letterColors = [
  'text-red-500',
  'text-blue-500',
  'text-green-500',
  'text-purple-500',
  'text-yellow-600',
  'text-pink-500',
];

export default function LearningGames() {
  const navigate = useNavigate();
  const [activeGame, setActiveGame] = useState<'emotion' | 'literacy' | null>(null);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  
  // Emotion game state
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>(
    emotions[Math.floor(Math.random() * emotions.length)]
  );

  // Literacy game state
  const words = ['CAT', 'DOG', 'SUN', 'TREE', 'BOOK'];
  const [currentWord] = useState(words[Math.floor(Math.random() * words.length)]);

  const startEmotionGame = () => {
    setActiveGame('emotion');
    setScore(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setCurrentEmotion(emotions[Math.floor(Math.random() * emotions.length)]);
  };

  const startLiteracyGame = () => {
    setActiveGame('literacy');
    setScore(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
  };

  const checkEmotionAnswer = (selectedName: string) => {
    setSelectedAnswer(selectedName);
    
    if (selectedName === currentEmotion.name) {
      setScore(score + 1);
      toast.success('🎉 Correct! Great job!');
    } else {
      toast.error(`Not quite! The correct answer was ${currentEmotion.name}`);
    }

    setTimeout(() => {
      if (currentQuestion < 4) {
        setCurrentQuestion(currentQuestion + 1);
        setCurrentEmotion(emotions[Math.floor(Math.random() * emotions.length)]);
        setSelectedAnswer(null);
      } else {
        toast.success(`Game Over! You scored ${score + (selectedName === currentEmotion.name ? 1 : 0)} out of 5! 🏆`);
        setTimeout(() => setActiveGame(null), 2000);
      }
    }, 2000);
  };

  const speakWord = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentWord);
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error('Text-to-speech not supported in your browser');
    }
  };

  const progress = ((currentQuestion + 1) / 5) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="neuronest-container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => activeGame ? setActiveGame(null) : navigate('/user-dashboard')}
                className="touch-target"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-purple-500" />
                <h1 className="text-2xl font-bold text-gray-900">Learning Games</h1>
              </div>
            </div>
            {activeGame && (
              <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-xl">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="font-bold text-gray-900">Score: {score}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="neuronest-container py-8">
        {!activeGame ? (
          /* Game Selection */
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Choose a Learning Activity
              </h2>
              <p className="text-lg text-gray-600">
                Pick a game to start learning and having fun!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card 
                className="neuronest-card cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={startEmotionGame}
              >
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-pink-100 rounded-3xl">
                      <span className="text-6xl">😊</span>
                    </div>
                  </div>
                  <CardTitle className="text-2xl">Emotion Detective</CardTitle>
                  <CardDescription className="text-base">
                    Learn to identify different emotions and feelings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full neuronest-button bg-pink-500 hover:bg-pink-600 text-white" size="lg">
                    Start Playing
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className="neuronest-card cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={startLiteracyGame}
              >
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-blue-100 rounded-3xl">
                      <span className="text-6xl">📚</span>
                    </div>
                  </div>
                  <CardTitle className="text-2xl">Word Builder</CardTitle>
                  <CardDescription className="text-base">
                    Practice reading and spelling with colorful letters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full neuronest-button bg-blue-500 hover:bg-blue-600 text-white" size="lg">
                    Start Playing
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : activeGame === 'emotion' ? (
          /* Emotion Game */
          <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
            <Card className="neuronest-card">
              <CardHeader>
                <div className="flex justify-between items-center mb-4">
                  <CardTitle className="text-2xl">Question {currentQuestion + 1} of 5</CardTitle>
                  <Trophy className="h-8 w-8 text-yellow-500" />
                </div>
                <Progress value={progress} className="h-3" />
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Current Emotion Display */}
                <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
                  <p className="text-xl text-gray-700 mb-6">
                    Which emotion is this?
                  </p>
                  <div className="text-9xl mb-4 animate-bounce">
                    {currentEmotion.emoji}
                  </div>
                  <p className="text-lg text-gray-600 italic">
                    {currentEmotion.description}
                  </p>
                </div>

                {/* Answer Options */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {emotions.map((emotion) => (
                    <button
                      key={emotion.name}
                      onClick={() => !selectedAnswer && checkEmotionAnswer(emotion.name)}
                      disabled={!!selectedAnswer}
                      className={`
                        p-6 rounded-2xl border-2 transition-all duration-200 touch-target
                        ${selectedAnswer === emotion.name
                          ? emotion.name === currentEmotion.name
                            ? 'bg-green-100 border-green-400 scale-105'
                            : 'bg-red-100 border-red-400'
                          : selectedAnswer && emotion.name === currentEmotion.name
                          ? 'bg-green-100 border-green-400 scale-105'
                          : 'bg-white border-gray-200 hover:border-purple-300 hover:scale-105'
                        }
                        ${selectedAnswer ? 'cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      <div className="text-4xl mb-2">{emotion.emoji}</div>
                      <div className="font-semibold text-gray-900">{emotion.name}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Literacy Game */
          <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
            <Card className="neuronest-card">
              <CardHeader>
                <CardTitle className="text-2xl">Word Builder</CardTitle>
                <CardDescription className="text-base">
                  Click the speaker to hear the word, then trace the letters!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Word Display */}
                <div className="text-center p-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
                  <div className="flex justify-center gap-4 mb-8">
                    {currentWord.split('').map((letter, index) => (
                      <div
                        key={index}
                        className={`
                          text-8xl font-bold ${letterColors[index % letterColors.length]}
                          animate-in fade-in slide-in-from-bottom-4 duration-500
                        `}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {letter}
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={speakWord}
                    className="neuronest-button bg-blue-500 hover:bg-blue-600 text-white"
                    size="lg"
                  >
                    <span className="text-2xl mr-2">🔊</span>
                    Hear the Word
                  </Button>
                </div>

                {/* Interactive Area */}
                <div className="p-8 bg-white border-2 border-dashed border-gray-300 rounded-2xl text-center">
                  <p className="text-lg text-gray-600 mb-4">
                    Practice writing the letters on paper or trace them with your finger!
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button
                      onClick={() => {
                        toast.success('🎉 Great job practicing!');
                        setScore(score + 1);
                      }}
                      className="neuronest-button bg-green-500 hover:bg-green-600 text-white"
                      size="lg"
                    >
                      <Trophy className="mr-2 h-5 w-5" />
                      I Practiced!
                    </Button>
                    <Button
                      onClick={() => setActiveGame(null)}
                      variant="outline"
                      size="lg"
                    >
                      Try Another Word
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}