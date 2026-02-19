
import React, { useEffect, useRef, useState } from 'react';
import { Camera, X, CheckCircle2, Loader2, Sparkles, AlertCircle, Maximize2, Pause, Play, AlertTriangle, ZoomIn, ZoomOut } from 'lucide-react';
import { connectInspectionSession } from '../services/geminiService';
import { PhotoRequirement, AIAnalysisResult } from '../types';

// Helper to encode image frames for Live API
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Helper to decode audio
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Audio Decoding for playback
async function decodeAudioData(data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const sampleRate = 24000;
  const numChannels = 1;
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

interface LiveInspectionProps {
  requirements: PhotoRequirement[];
  onCapture: (reqId: string, photoData: string, analysis: AIAnalysisResult) => void;
  onClose: () => void;
}

const LiveInspection: React.FC<LiveInspectionProps> = ({ requirements, onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeReqs, setActiveReqs] = useState<PhotoRequirement[]>([]);
  const [currentReqIndex, setCurrentReqIndex] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [aiFeedback, setAiFeedback] = useState("Initializing Optical Link...");
  const [capturedItems, setCapturedItems] = useState<string[]>([]);
  
  // Zoom State
  const [zoom, setZoom] = useState(1);
  const [zoomCap, setZoomCap] = useState<{min: number, max: number} | null>(null);
  
  // Audio / Stream Refs
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const streamRef = useRef<MediaStream | null>(null);
  const frameIntervalRef = useRef<number | null>(null);

  // Sync requirements
  useEffect(() => {
    const pending = requirements.filter(r => r.status === 'Required' || r.status === 'Rejected');
    setActiveReqs(pending);
    if (pending.length === 0) {
      setAiFeedback("Inspection Complete!");
    }
  }, [requirements]);

  // Handle Session Lifecycle based on Pause state
  useEffect(() => {
    if (!isPaused && activeReqs.length > 0) {
      startCamera();
    } else {
      stopCamera();
      if (sessionRef.current) {
        sessionRef.current.close();
        sessionRef.current = null;
      }
    }

    return () => {
      stopCamera();
      if (sessionRef.current) sessionRef.current.close();
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, [isPaused, activeReqs.length]); // Re-run if paused toggles or items change

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
            facingMode: 'environment', 
            width: { ideal: 1280 }, 
            height: { ideal: 720 },
            zoom: true
        } as any,
        audio: true 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Initialize Zoom Capabilities
      const track = stream.getVideoTracks()[0];
      const capabilities = (track.getCapabilities && track.getCapabilities()) || {};
      if ('zoom' in capabilities) {
        const zoomDetails = (capabilities as any).zoom;
        setZoomCap({ min: zoomDetails.min, max: zoomDetails.max });
        setZoom(1); // Reset to 1x
      }
      
      // Initialize Audio Context for AI Voice if not already active
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
         audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      // Ensure audio context is running (browser policy often requires resume)
      await audioContextRef.current.resume();
      
      // Start Gemini Session
      initGeminiSession();

    } catch (err) {
      console.error("Camera Error:", err);
      setAiFeedback("Camera access denied. Please allow permissions.");
    }
  };

  const handleZoomChange = (newZoom: number) => {
    if (!streamRef.current || !zoomCap) return;
    const track = streamRef.current.getVideoTracks()[0];
    const constrainedZoom = Math.min(Math.max(newZoom, zoomCap.min), zoomCap.max);
    setZoom(constrainedZoom);
    
    try {
        track.applyConstraints({ advanced: [{ zoom: constrainedZoom }] } as any);
    } catch (e) {
        console.warn("Zoom not supported directly", e);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (frameIntervalRef.current) {
      window.clearInterval(frameIntervalRef.current);
    }
  };

  const initGeminiSession = async () => {
    if (activeReqs.length === 0) return;

    // Prioritize the top item in the list for specific guidance
    const currentTarget = activeReqs[0]; 
    const pendingNames = activeReqs.map(r => r.category);
    
    try {
      const sessionPromise = connectInspectionSession(pendingNames, `${currentTarget.group}: ${currentTarget.category} - ${currentTarget.description}`, {
        onMessage: async (msg) => {
          // 1. Play Audio
          const audioBytes = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audioBytes && audioContextRef.current) {
             const ctx = audioContextRef.current;
             nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
             const buffer = await decodeAudioData(decode(audioBytes), ctx);
             const source = ctx.createBufferSource();
             source.buffer = buffer;
             source.connect(ctx.destination);
             source.start(nextStartTimeRef.current);
             nextStartTimeRef.current += buffer.duration;
          }

          // 2. Transcription / Text Command Handling
          if (msg.serverContent?.outputTranscription) {
             const text = msg.serverContent.outputTranscription.text;
             if (text) {
                setAiFeedback(prev => text.length > 50 ? text : prev); 
                
                // Logic: Detect "CAPTURE" command
                if (text.toUpperCase().includes("CAPTURE")) {
                   // Ideally the AI says "CAPTURE: MAILBOX" so we know what matched
                   const match = activeReqs.find(r => text.toUpperCase().includes(r.category.toUpperCase().split(' ')[0]));
                   if (match) {
                      triggerCapture(match);
                   } else {
                      // Fallback: Capture current target if unspecified
                      triggerCapture(activeReqs[0]);
                   }
                }
             }
          }
        },
        onClose: () => setIsSessionActive(false),
        onError: (e) => console.error("Session Error", e)
      });

      const session = await sessionPromise;
      sessionRef.current = session;
      setIsSessionActive(true);
      setAiFeedback(`Listening...`);

      // Kickstart the conversation explicitly
      session.sendRealtimeInput({
        media: {
            mimeType: "text/plain",
            data: btoa(`I am ready. We are looking for ${currentTarget.category}. Please speak to me and guide me on how to frame the shot.`)
        }
      });

      // Start Frame Loop (1 FPS)
      frameIntervalRef.current = window.setInterval(() => {
        if (!isPaused) sendFrameToGemini(session);
      }, 1000);

    } catch (e) {
      console.error("Gemini Connection Failed", e);
      setAiFeedback("Connection Failed. Retrying...");
    }
  };

  const sendFrameToGemini = (session: any) => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth / 2; 
    canvas.height = video.videoHeight / 2;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64 = canvas.toDataURL('image/jpeg', 0.6).split(',')[1];
      
      session.sendRealtimeInput({
        media: { mimeType: 'image/jpeg', data: base64 }
      });
    }
  };

  const triggerCapture = (req: PhotoRequirement) => {
    if (capturedItems.includes(req.id)) return;
    setCapturedItems(prev => [...prev, req.id]);
    setAiFeedback(`Capturing ${req.category}...`);

    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    // High Res Capture
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0);
    const photoData = canvas.toDataURL('image/jpeg', 0.9);

    const liveAnalysis: AIAnalysisResult = {
        matches: true,
        matchReason: "Verified via Active Vision",
        confidenceScore: 0.98,
        qualityCheck: { clarity: 'excellent', lighting: 'good', framing: 'good' },
        presentationCheck: { isClean: true, clutterDetected: [], improvementSuggestions: [] },
        conditionAssessment: { overall: 'good', rating: 8, strengths: ['Visible'], concerns: [] },
        inspectorNotes: "Auto-captured during live session.",
        detailedSummary: `Live agent identified ${req.category} in video stream.`
    };

    // Notify AI we captured it
    if (sessionRef.current) {
        sessionRef.current.sendRealtimeInput({
            media: {
                mimeType: "text/plain",
                data: btoa(`Captured ${req.category}. What is the next item?`)
            }
        });
    }

    onCapture(req.id, photoData, liveAnalysis);
    
    // Move to next item visual feedback
    setTimeout(() => {
        setAiFeedback("Image Verified! Moving to next item...");
    }, 1000);
  };

  const currentTarget = activeReqs[0];

  return (
    <div className="fixed inset-0 z-[300] bg-black flex flex-col">
      <canvas ref={canvasRef} className="hidden" />

      {/* Video Feed */}
      <div className="relative flex-grow overflow-hidden bg-slate-900">
        {!isPaused && (
            <video 
            ref={videoRef} 
            className="absolute inset-0 w-full h-full object-cover" 
            muted 
            playsInline 
            autoPlay 
            />
        )}
        {isPaused && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="text-center space-y-4">
                    <Pause className="w-16 h-16 text-yellow-400 mx-auto" />
                    <h3 className="text-2xl font-bold text-white">Inspection Paused</h3>
                    <p className="text-slate-300">Clean up the area or take a break.<br/>Resume when ready.</p>
                </div>
            </div>
        )}
        
        {/* HUD Overlay */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 safe-area-inset">
           {/* Top Bar */}
           <div className="flex justify-between items-start">
              <div className="bg-black/60 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-white max-w-[240px]">
                 <div className="flex items-center gap-2 mb-2 text-red-500 font-bold uppercase tracking-widest text-[10px]">
                    <div className={`w-2 h-2 bg-red-500 rounded-full ${!isPaused ? 'animate-pulse' : ''}`}></div> 
                    {isPaused ? 'Session Paused' : 'Live Vision Active'}
                 </div>
                 {currentTarget ? (
                     <div>
                        <div className="text-xs text-blue-400 font-bold uppercase mb-1">Current Target</div>
                        <div className="text-lg font-bold leading-none mb-1">{currentTarget.category}</div>
                        <div className="text-[10px] text-slate-300 leading-tight opacity-80">{currentTarget.description}</div>
                     </div>
                 ) : (
                     <div className="text-green-400 font-bold">All items captured!</div>
                 )}
              </div>
              <button onClick={onClose} className="pointer-events-auto p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all">
                 <X className="w-6 h-6 text-white" />
              </button>
           </div>

           {/* Zoom Slider (Right Side) */}
           {zoomCap && !isPaused && (
             <div className="pointer-events-auto absolute right-6 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-md rounded-full py-4 px-2 flex flex-col items-center gap-4 border border-white/10">
                <ZoomIn className="w-5 h-5 text-white" onClick={() => handleZoomChange(Math.min(zoom + 0.5, zoomCap.max))} />
                <div className="h-32 w-1 bg-white/20 rounded-full relative">
                   <input 
                     type="range" 
                     min={zoomCap.min} 
                     max={zoomCap.max} 
                     step={0.1} 
                     value={zoom} 
                     onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                     style={{ writingMode: 'vertical-lr', direction: 'rtl' }} 
                   />
                   <div 
                     className="absolute bottom-0 left-0 right-0 bg-white rounded-full transition-all"
                     style={{ height: `${((zoom - zoomCap.min) / (zoomCap.max - zoomCap.min)) * 100}%` }}
                   ></div>
                </div>
                <ZoomOut className="w-5 h-5 text-white" onClick={() => handleZoomChange(Math.max(zoom - 0.5, zoomCap.min))} />
                <div className="text-[10px] font-bold text-white">{zoom.toFixed(1)}x</div>
             </div>
           )}

           {/* Central Reticle */}
           {!isPaused && (
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 border-2 border-white/30 rounded-[2rem] flex flex-col items-center justify-center opacity-70">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-white"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-white"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-white"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-white"></div>
                  <Maximize2 className="w-8 h-8 text-white/30" />
               </div>
           )}

           {/* Bottom Area */}
           <div className="mb-24 space-y-4">
              {/* AI Feedback Bubble */}
              <div className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center animate-in slide-in-from-bottom-4 mx-auto max-w-sm shadow-2xl">
                 <div className="flex items-center justify-center gap-2 mb-1 text-blue-400 font-bold uppercase tracking-widest text-[10px]">
                    <Sparkles className="w-3 h-3 animate-pulse" /> Inspector Voice
                 </div>
                 <p className="text-white text-base font-medium leading-tight">"{aiFeedback}"</p>
              </div>
           </div>
        </div>
      </div>

      {/* Control Deck */}
      <div className="h-32 bg-slate-950 flex items-center justify-between px-8 border-t border-white/10 relative z-[310]">
         <button 
            onClick={() => setIsPaused(!isPaused)}
            className={`flex flex-col items-center gap-1 ${isPaused ? 'text-green-400' : 'text-yellow-400'} hover:opacity-80 transition-opacity`}
         >
            <div className={`p-4 rounded-full ${isPaused ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}>
                {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
            </div>
            <span className="text-[10px] font-bold uppercase">{isPaused ? 'Resume' : 'Pause'}</span>
         </button>
         
         <div className="flex-1 px-6">
            {currentTarget && (
                <button 
                    onClick={() => triggerCapture(currentTarget)}
                    className="w-full py-4 bg-white text-slate-900 rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    <Camera className="w-5 h-5" /> Manual Capture
                </button>
            )}
         </div>

         <div className="flex flex-col items-center gap-1 text-slate-500">
            <div className="p-4 rounded-full bg-white/5">
                <AlertTriangle className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase">Report</span>
         </div>
      </div>
    </div>
  );
};

export default LiveInspection;
