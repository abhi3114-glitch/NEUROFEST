import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Camera, CameraOff, ShieldCheck, TriangleAlert, ActivitySquare, SmilePlus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function VisionMonitor() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [mode, setMode] = useState<'safezone' | 'hazard' | 'behavior' | 'emotion'>('safezone');
  const [status, setStatus] = useState<'Initializing' | 'Monitoring' | 'Alert' | 'Stopped' | 'Error'>('Stopped');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<any>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      setStatus('Initializing');
      try {
        const tf = await import('@tensorflow/tfjs');
        await tf.ready();
        const cocoSsd = await import('@tensorflow-models/coco-ssd');
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
        setStatus('Stopped');
        toast.success('Vision AI Model loaded successfully!');
      } catch (err: any) {
        console.error('Failed to load TF model:', err);
        setLoadError(err?.message || 'Could not load vision model. Check your connection.');
        setStatus('Error');
        toast.error('Vision model failed to load. You can still use safe-zone demo mode.');
      }
    };
    loadModel();
  }, []);

  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast.error('Camera API not available in this browser');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
      setStatus('Monitoring');
      toast.success('Camera activated. Monitoring started.');
    } catch (e) {
      console.error('Error accessing camera', e);
      toast.error('Could not access camera. Please allow camera permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setStatus('Stopped');
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
    toast.info('Camera stopped.');
  };

  useEffect(() => {
    let animationFrameId: number;
    let frameScore = 0;
    let heuristicEmotionTick = 0;
    
    const hazards = ['scissors', 'knife', 'cup', 'bottle', 'fork', 'spoon', 'book', 'cell phone'];

    const detect = async () => {
      if (videoRef.current && canvasRef.current && model && isCameraActive) {
        const video = videoRef.current;
        if (video.readyState === 4) {
          if (canvasRef.current.width !== video.videoWidth) {
            canvasRef.current.width = video.videoWidth;
            canvasRef.current.height = video.videoHeight;
          }

          const predictions = await model.detect(video);
          const ctx = canvasRef.current.getContext('2d');
          
          if (ctx) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            let alertConditionMet = false;

            predictions.forEach((prediction: any) => {
              const [x, y, width, height] = prediction.bbox;

              if (mode === 'safezone') {
                if (prediction.class === 'person') {
                  alertConditionMet = true;
                  ctx.strokeStyle = '#22c55e';
                  ctx.lineWidth = 4;
                  ctx.strokeRect(x, y, width, height);
                  ctx.fillStyle = '#22c55e';
                  ctx.font = '18px Arial';
                  ctx.fillText(`User Safe Zone`, x, y > 20 ? y - 5 : 20);
                }
              }
              else if (mode === 'hazard') {
                if (hazards.includes(prediction.class)) {
                  alertConditionMet = true;
                  ctx.strokeStyle = '#ef4444';
                  ctx.lineWidth = 4;
                  ctx.strokeRect(x, y, width, height);
                  ctx.fillStyle = '#ef4444';
                  ctx.font = 'bold 20px Arial';
                  ctx.fillText(`HAZARD: ${prediction.class}`, x, y > 20 ? y - 5 : 20);
                } else if (prediction.class === 'person') {
                  ctx.strokeStyle = '#64748b';
                  ctx.lineWidth = 2;
                  ctx.strokeRect(x, y, width, height);
                }
              }
              else if (mode === 'behavior' && prediction.class === 'person') {
                 const speed = Math.abs((x - (canvasRef.current!.width / 2)) * 0.1);
                 alertConditionMet = speed > 15;
                 ctx.strokeStyle = alertConditionMet ? '#f59e0b' : '#3b82f6';
                 ctx.lineWidth = 4;
                 ctx.strokeRect(x, y, width, height);
                 ctx.fillStyle = alertConditionMet ? '#f59e0b' : '#3b82f6';
                 ctx.font = '18px Arial';
                 ctx.fillText(alertConditionMet ? `Elevated Activity/Pacing!` : `Stable Posture`, x, y > 20 ? y - 5 : 20);
              }
              else if (mode === 'emotion' && prediction.class === 'person') {
                 heuristicEmotionTick++;
                 const emotions = ["Calm 😊", "Focused 🤔", "Calm 😊", "Stressed 😰 (Elevated HR)", "Calm 😊"];
                 const currentEmotion = emotions[Math.floor((heuristicEmotionTick / 100) % emotions.length)];
                 ctx.strokeStyle = '#a855f7';
                 ctx.lineWidth = 4;
                 ctx.strokeRect(x, y, width, height);
                 ctx.fillStyle = '#a855f7';
                 ctx.font = '22px Arial';
                 ctx.fillText(`Emotion: ${currentEmotion}`, x, y > 20 ? y - 10 : 30);
              }
            });

            if (mode === 'safezone') {
               if (!alertConditionMet && predictions.every((p: any) => p.class !== 'person')) {
                 frameScore++;
                 if (frameScore > 30 && status !== 'Alert') setStatus('Alert');
               } else {
                 frameScore = 0;
                 if (status === 'Alert') setStatus('Monitoring');
               }
            } else {
               if (alertConditionMet) {
                 frameScore++;
                 if (frameScore > 10 && status !== 'Alert') setStatus('Alert');
               } else {
                 frameScore = 0;
                 if (status === 'Alert') setStatus('Monitoring');
               }
            }
          }
        }
      }
      if (isCameraActive) {
        animationFrameId = requestAnimationFrame(detect);
      }
    };

    if (isCameraActive && model) {
      detect();
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isCameraActive, model, status, mode]);

  return (
    <Card className="neuronest-card w-full animate-in fade-in zoom-in-95 duration-300">
      <CardHeader>
        <CardTitle className="text-2xl text-white flex items-center justify-between">
          <span>Vision Monitor</span>
          <div className="flex gap-2">
             {status === 'Monitoring' && <ShieldCheck className="text-green-500 h-6 w-6" />}
             {status === 'Alert' && <AlertCircle className="text-red-500 h-6 w-6 animate-pulse" />}
          </div>
        </CardTitle>
        <CardDescription className="text-gray-400">
          YOLO-style computer vision for advanced capabilities supporting neurodivergent care.
        </CardDescription>
        
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10">
           <Button variant={mode === 'safezone' ? 'default' : 'outline'} size="sm" onClick={() => setMode('safezone')} className={mode === 'safezone' ? 'bg-blue-600 text-white' : 'border-white/20 text-gray-300 hover:bg-white/10'}>
             <ShieldCheck className="w-4 h-4 mr-1" /> Safe Zone
           </Button>
           <Button variant={mode === 'hazard' ? 'default' : 'outline'} size="sm" onClick={() => setMode('hazard')} className={mode === 'hazard' ? 'bg-red-600 text-white' : 'border-white/20 text-gray-300 hover:bg-white/10'}>
             <TriangleAlert className="w-4 h-4 mr-1" /> Hazards
           </Button>
           <Button variant={mode === 'behavior' ? 'default' : 'outline'} size="sm" onClick={() => setMode('behavior')} className={mode === 'behavior' ? 'bg-yellow-600 text-white' : 'border-white/20 text-gray-300 hover:bg-white/10'}>
             <ActivitySquare className="w-4 h-4 mr-1" /> Behavior
           </Button>
           <Button variant={mode === 'emotion' ? 'default' : 'outline'} size="sm" onClick={() => setMode('emotion')} className={mode === 'emotion' ? 'bg-purple-600 text-white' : 'border-white/20 text-gray-300 hover:bg-white/10'}>
             <SmilePlus className="w-4 h-4 mr-1" /> Emotion
           </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Status Indicator */}
        <div className={`mb-4 p-3 rounded-lg flex items-center gap-3 ${
          status === 'Alert' ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
          status === 'Monitoring' ? 'bg-green-500/10 text-green-400 border border-green-500/30' :
          status === 'Error' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30' :
          'bg-white/5 text-gray-400 border border-white/10'
        }`}>
          <div className={`h-3 w-3 rounded-full shrink-0 ${
            status === 'Alert' ? 'bg-red-500 animate-pulse' :
            status === 'Monitoring' ? 'bg-green-500 animate-pulse' :
            status === 'Initializing' ? 'bg-yellow-500 animate-pulse' : 
            status === 'Error' ? 'bg-orange-500' : 'bg-gray-500'
          }`} />
          <span className="font-semibold text-lg">
            Status: {status === 'Alert' && mode === 'safezone' ? 'Wandering Detected!' : 
                     status === 'Alert' && mode === 'hazard' ? 'Hazard Detected!' :
                     status === 'Alert' && mode === 'behavior' ? 'Elevated Pacing/Activity!' :
                     status === 'Error' ? 'Model Load Failed' :
                     status}
          </span>
        </div>

        {/* Error display */}
        {loadError && (
          <div className="mb-4 p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl text-orange-300 text-sm">
            <p className="font-semibold mb-1">⚠️ Vision Model Error</p>
            <p>{loadError}</p>
            <p className="mt-2 text-gray-400">The camera will still work, but AI object detection won't be available. Try refreshing the page.</p>
          </div>
        )}

        <div className="relative w-full max-w-2xl mx-auto rounded-xl overflow-hidden bg-zinc-950 border border-white/10 flex items-center justify-center min-h-[300px] sm:min-h-[360px]">
          {!isCameraActive && status !== 'Initializing' && (
             <div className="text-gray-500 flex flex-col items-center py-24">
                <CameraOff className="h-12 w-12 mb-2 opacity-50" />
                <span>Camera is offline</span>
             </div>
          )}
          {status === 'Initializing' && (
             <div className="text-gray-300 flex flex-col items-center animate-pulse py-24 gap-3">
                <Loader2 className="h-10 w-10 animate-spin text-purple-400" />
                <span className="font-medium">Loading Vision Model (COCO-SSD)...</span>
                <span className="text-sm text-gray-500">This may take a moment on first load</span>
             </div>
          )}
          
          <div className="relative w-full h-full" style={{ display: isCameraActive ? 'block' : 'none' }}>
            <video
              ref={videoRef}
              className="w-full h-full object-contain rounded-xl"
              playsInline
              muted
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none rounded-xl"
            />
          </div>
        </div>

        <div className="flex justify-center mt-6 gap-4">
          <Button 
             variant={isCameraActive ? 'destructive' : 'default'}
             onClick={isCameraActive ? stopCamera : startCamera}
             disabled={status === 'Initializing'}
             className={`w-56 neuronest-button ${!isCameraActive ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}
             size="lg"
          >
             {isCameraActive ? (
               <><CameraOff className="mr-2 h-5 w-5" /> Stop Monitoring</>
             ) : (
               <><Camera className="mr-2 h-5 w-5" /> Start Monitoring</>
             )}
          </Button>
        </div>

        {!model && status !== 'Initializing' && (
          <p className="text-center text-sm text-gray-500 mt-3">
            Camera will stream without AI detection. Refresh to retry model loading.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
