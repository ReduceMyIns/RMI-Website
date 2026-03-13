
import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const carriers = [
  { name: 'Progressive', src: 'https://cdn.jsdelivr.net/gh/ReduceMyIns/RMI-Website@main/public/carrier-logos/Progressive-Mobile.png', slug: 'progressive' },
  { name: 'Travelers', src: 'https://cdn.jsdelivr.net/gh/ReduceMyIns/RMI-Website@main/public/carrier-logos/Travelers-Mobile.jpg', slug: 'travelers' },
  { name: 'Nationwide', src: 'https://cdn.jsdelivr.net/gh/ReduceMyIns/RMI-Website@main/public/carrier-logos/Nationwide-Mobile.jpg', slug: 'nationwide' },
  { name: 'Liberty Mutual', src: 'https://cdn.jsdelivr.net/gh/ReduceMyIns/RMI-Website@main/public/carrier-logos/Liberty-Mutual.jpg', slug: 'liberty-mutual' },
  { name: 'The Hartford', src: 'https://cdn.jsdelivr.net/gh/ReduceMyIns/RMI-Website@main/public/carrier-logos/The-Hartford.png', slug: 'the-hartford' },
  { name: 'SafeCo', src: 'https://cdn.jsdelivr.net/gh/ReduceMyIns/RMI-Website@main/public/carrier-logos/SafeCo-Mobile.jpg', slug: 'safeco' },
  { name: 'Hiscox', src: 'https://cdn.jsdelivr.net/gh/ReduceMyIns/RMI-Website@main/public/carrier-logos/Hiscox.png', slug: 'hiscox' },
  { name: 'Openly', src: 'https://cdn.jsdelivr.net/gh/ReduceMyIns/RMI-Website@main/public/carrier-logos/Openly-transparent-logo.png', slug: 'openly' },
  { name: 'Geico', src: 'https://cdn.jsdelivr.net/gh/ReduceMyIns/RMI-Website@main/public/carrier-logos/geico-logo.png', slug: 'geico' },
  { name: 'Next', src: 'https://cdn.jsdelivr.net/gh/ReduceMyIns/RMI-Website@main/public/carrier-logos/Next-Insurance.png', slug: 'next-insurance' },
  { name: 'Encompass', src: 'https://cdn.jsdelivr.net/gh/ReduceMyIns/RMI-Website@main/public/carrier-logos/Encompass.png', slug: 'encompass' },
  { name: 'Employers', src: 'https://cdn.jsdelivr.net/gh/ReduceMyIns/RMI-Website@main/public/carrier-logos/Employers.png', slug: 'employers' },
];

const CarrierSlider: React.FC = () => {
  // Duplicate the list to create a seamless loop
  const duplicatedCarriers = [...carriers, ...carriers, ...carriers];

  return (
    <div className="w-full overflow-hidden py-20 bg-white/[0.03] border-y border-white/10 relative rounded-[3rem] mx-auto max-w-7xl my-16">
      <div className="absolute inset-y-0 left-0 w-64 bg-gradient-to-r from-slate-950 to-transparent z-10 rounded-l-[3rem]"></div>
      <div className="absolute inset-y-0 right-0 w-64 bg-gradient-to-l from-slate-950 to-transparent z-10 rounded-r-[3rem]"></div>
      
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <p className="text-[11px] uppercase tracking-[0.5em] font-bold text-blue-400/60 text-center">
          Tap a Carrier to View Service Details
        </p>
      </div>

      <motion.div 
        className="flex items-center gap-12 whitespace-nowrap"
        animate={{
          x: [0, -3000], // Adjust based on content width
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 50,
            ease: "linear",
          },
        }}
      >
        {duplicatedCarriers.map((carrier, i) => (
          <Link 
            key={i} 
            to={`/carrier/${carrier.slug}`}
            className="flex items-center justify-center min-w-[180px] grayscale-[0.5] opacity-70 hover:grayscale-0 hover:opacity-100 hover:scale-110 transition-all duration-300 cursor-pointer"
          >
            <img 
              src={carrier.src} 
              alt={carrier.name} 
              className="h-16 md:h-20 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              onError={(e) => {
                // Fallback to text if image fails
                (e.target as any).style.display = 'none';
                const parent = (e.target as any).parentElement;
                const text = document.createElement('span');
                text.innerText = carrier.name;
                text.className = 'text-2xl font-bold text-white';
                parent.appendChild(text);
              }}
            />
          </Link>
        ))}
      </motion.div>
    </div>
  );
};

export default CarrierSlider;
