
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { Mic, MicOff, Volume2, X, Sparkles, Loader2, Info } from 'lucide-react';

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
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

export const LiveAssistant: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<{ input: AudioContext; output: AudioContext } | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());
  const [transcription, setTranscription] = useState('');

  const startSession = async () => {
    setIsConnecting(true);
    try {
      if (!process.env.API_KEY) {
        console.error("Gemini API Key is missing. Cannot start live session.");
        setIsConnecting(false);
        return;
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = { input: inputCtx, output: outputCtx };

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message) => {
            // Handle Audio Output
            const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64EncodedAudioString && audioContextRef.current) {
              const { output: ctx } = audioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decode(base64EncodedAudioString), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            // Handle Transcriptions
            if (message.serverContent?.outputTranscription) {
              setTranscription(prev => prev + message.serverContent!.outputTranscription!.text);
            }

            // Handle Interruptions
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => {
                try { s.stop(); } catch (e) {}
              });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }

            if (message.serverContent?.turnComplete) {
              setTranscription('');
            }
          },
          onclose: () => setIsActive(false),
          onerror: (e) => {
            console.error('Live session error:', e);
            setIsConnecting(false);
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: `You are a professional voice agent for ReduceMyInsurance.Net.
      
      BEHAVIOR:
      - Keep responses short (1-2 sentences maximum).
      - Be warm and natural.
      - Confirm key details verbally.
      
      CORE KNOWLEDGE:
      - Agency: ReduceMyInsurance.Net in Murfreesboro, TN.
      - Phone: (615) 900-0288.
      - We compare 80+ carriers to find the best rate.
      
      SCENARIOS:
      - New Quote: Ask for name and vehicle details.
      - Billing/Claims: Identify carrier and suggest transfer if applicable (Full Service vs Billing Service).
      - Cancel/Reshop: Suggest booking appointment with Chase Henderson.
      
      Always refer to yourself as an agent of ReduceMyInsurance.Net.`,
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    startSession();
    return () => {
      sessionRef.current?.close();
      audioContextRef.current?.input.close().catch(() => {});
      audioContextRef.current?.output.close().catch(() => {});
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-12 p-12 bg-slate-900/40 backdrop-blur-3xl text-white h-full rounded-[3rem] border border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-600/5 blur-[100px] pointer-events-none"></div>
      
      <div className="relative group">
        <div className={`w-40 h-40 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-[0_0_80px_rgba(37,99,235,0.3)] transition-all duration-700 ${isActive ? 'scale-110' : 'opacity-50'}`}>
          <Mic className={`w-16 h-16 ${isActive ? 'animate-pulse' : ''}`} />
        </div>
        {isActive && (
          <>
            <div className="absolute inset-[-10px] border border-blue-500/30 rounded-full animate-ping opacity-20"></div>
            <div className="absolute inset-[-20px] border border-blue-500/10 rounded-full animate-ping opacity-10 [animation-delay:0.5s]"></div>
          </>
        )}
      </div>

      <div className="text-center space-y-4 max-w-sm">
        <h2 className="text-3xl font-heading font-bold tracking-tight">
          {isConnecting ? 'Initializing Neural Link...' : isActive ? 'Agent Zephyr Active' : 'Offline'}
        </h2>
        <div className="flex items-center justify-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            {isActive ? 'Bi-Directional Stream Active' : 'Connecting to Core...'}
          </span>
        </div>
      </div>

      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-6 min-h-[100px] flex items-center justify-center text-center">
        {transcription ? (
          <p className="text-lg text-blue-100 font-medium leading-relaxed italic">"{transcription}"</p>
        ) : (
          <p className="text-sm text-slate-500 font-medium tracking-wide">
            {isActive ? "Say 'I need a quote' or 'I have a billing question'" : "Awaiting response..."}
          </p>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <button 
          onClick={onClose}
          className="bg-white/5 hover:bg-white/10 border border-white/10 p-6 rounded-3xl transition-all group active:scale-95"
          title="Close Session"
        >
          <X className="w-6 h-6 text-slate-400 group-hover:text-red-400" />
        </button>
      </div>

      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
        <Sparkles className="w-3 h-3" /> Powered by Gemini 2.5 Native Audio
      </div>
    </div>
  );
};
