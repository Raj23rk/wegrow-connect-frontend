import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Splash() {
  const navigate = useNavigate();
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // 2.8 seconds-ku aprom fade out start aagum
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true); 
    }, 2800); 

    // 3.8 seconds-ku aprom automatic-ah /home-ku redirect aidum
    const removeTimer = setTimeout(() => {
      navigate('/home', { replace: true });
    }, 3800); 

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(removeTimer);
    };
  }, [navigate]);

  return (
    <div className="font-['Inter'] overflow-hidden h-screen w-screen relative bg-[#edf2f9]">
      <style>{`
        @keyframes fadeInSplash {
          0% { opacity: 0; transform: scale(0.92); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-splash-in {
          animation: fadeInSplash 2.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
      <div 
        className={`fixed inset-0 z-[99999] flex items-center justify-center transition-opacity duration-1000 ease-in-out ${
          isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        style={{ backgroundColor: '#edf2f9' }}
      >
        <div className="w-full h-full flex items-center justify-center overflow-hidden p-0 m-0">
          <img 
            src="/splash.jpg" 
            alt="Splash Screen Logo" 
            className="w-[98%] md:w-[88%] h-[98%] md:h-[88%] object-contain animate-splash-in"
            onError={(e) => {
              e.target.src = '/image_4e0ce4.jpg';
            }}
          />
        </div>
      </div>
    </div>
  );
}