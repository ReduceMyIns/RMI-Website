
import React, { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

interface NowCertsIframeProps {
  url: string;
  height?: string;
}

const NowCertsIframe: React.FC<NowCertsIframeProps> = ({ url, height = "1100" }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous content
    containerRef.current.innerHTML = '';

    // Create the script element as specified by NowCerts
    const script = document.createElement('script');
    script.id = "nowcerts";
    script.src = "https://www.nowcerts.com/Resources/Scripts/import.js?v-qr-ss";
    script.type = "text/javascript";
    script.setAttribute('data-url', url);
    script.setAttribute('data-height', height);

    // Append script to container
    containerRef.current.appendChild(script);

    return () => {
      // Cleanup script if necessary
      const existing = document.getElementById('nowcerts');
      if (existing) existing.remove();
    };
  }, [url, height]);

  return (
    <div className="w-full bg-white rounded-[2rem] overflow-hidden min-h-[600px] relative">
      <div className="absolute inset-0 flex flex-col items-center justify-center -z-10 bg-slate-900">
         <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
         <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Initializing Secure Intake Registry...</p>
      </div>
      <div ref={containerRef} className="relative z-10 w-full"></div>
    </div>
  );
};

export default NowCertsIframe;
