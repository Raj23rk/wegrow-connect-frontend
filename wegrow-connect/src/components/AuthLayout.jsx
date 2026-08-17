import React, { useEffect, useRef } from 'react';
import { theme } from '../theme';

export default function AuthLayout({ children }) {
  const bgImages = [
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&auto=format&fit=crop&q=90",
    "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1600&auto=format&fit=crop&q=90",
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1600&auto=format&fit=crop&q=90",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&auto=format&fit=crop&q=90",
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1600&auto=format&fit=crop&q=90",
    "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600&auto=format&fit=crop&q=90",
  ];

  const gridRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    let scrollTop = 0;
    const speed = 0.5; // Scroll speed (adjust if needed)

    const scrollGrid = () => {
      if (gridRef.current) {
        scrollTop += speed;
        // When it reaches half of the total duplicated content height, reset instantly and seamlessly
        const halfHeight = gridRef.current.scrollHeight / 2;
        if (scrollTop >= halfHeight) {
          scrollTop = 0;
        }
        gridRef.current.scrollTop = scrollTop;
      }
      animationFrameId = requestAnimationFrame(scrollGrid);
    };

    animationFrameId = requestAnimationFrame(scrollGrid);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div 
      className="font-['Inter'] min-h-screen w-screen h-screen overflow-hidden flex items-center justify-center relative animate-fade-in"
      style={{ backgroundColor: theme.bgDark, color: theme.textMain }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        /* Hide scrollbar for smooth JS container */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* CONTINUOUS SMOOTH JAVASCRIPT ROLLING BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-40">
        <div 
          ref={gridRef}
          className="absolute inset-0 overflow-y-auto no-scrollbar grid grid-cols-2 md:grid-cols-3 gap-6 p-4"
        >
          {[...bgImages, ...bgImages, ...bgImages, ...bgImages].map((img, idx) => (
            <div key={idx} className="h-72 rounded-2xl overflow-hidden shadow-2xl border border-white/80 bg-white">
              <img src={img} alt="Campus Album HD" className="w-full h-full object-cover filter contrast-110 brightness-100" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-white/90 via-white/70 to-white/90 backdrop-blur-[2px]"></div>
      </div>

      {/* PAGE CONTENT CONTAINER */}
      <div className="relative z-20 w-full h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}