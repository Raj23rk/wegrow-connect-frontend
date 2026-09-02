import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { useTheme } from '../context/ThemeContext';

const carouselSlides = [
  {
    id: 1,
    badge: "✦ GLOBAL LEARNING & ACCELERATOR ✦",
    title: "Learn. Connect. Grow Your Future.",
    description: (
      <>
        Master cutting-edge skills through hands-on workshops led by elite industry pioneers. <br />
        Join a high-achieving global community and unlock your maximum <br />
        potential today.
      </>
    )
  },
  {
    id: 2,
    badge: "✦ STARTUP GROWTH HUB ✦",
    title: "Scale Your Startup to the Next Level",
    description: (
      <>
        Got a startup company? Come to this website to discover powerful growth strategies, scaling <br />
        frameworks, expert mentorship, and proven roadmaps to rapidly accelerate your business success.
      </>
    )
  },
  {
    id: 3,
    badge: "✦ STUDENT ENTREPRENEURSHIP ✦",
    title: "Master Business Plans as a Student",
    description: (
      <>
        Are you a student? Learn how to build rock-solid business plans, understand core market <br />
        fundamentals, validate your ideas, and kickstart your entrepreneurial journey <br />
        from scratch.
      </>
    )
  }
];

// High-resolution professional event and workshop photos
const backgroundCollageImages = [
  "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800",
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800",
  "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?w=800",
  "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800",
  "https://images.unsplash.com/photo-1515169067868-5387ec356754?w=800",
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800"
];

export default function Hero({ heroTransform, scrollToEvents, scrollToSeminars }) {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fade, setFade] = useState(true);

  // Slow and smooth fade transition effect for carousel slides
  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false); // Slow fade out
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
        setFade(true); // Slow fade in
      }, 1000); 
    }, 7000); 

    return () => clearInterval(timer);
  }, []);

  // Direct Smooth Scroll Trigger for Explore Workshops button
  const handleExploreClick = (e) => {
    e.preventDefault();
    if (scrollToEvents) {
      scrollToEvents();
    } else {
      const eventsSection = document.getElementById('events') || document.getElementById('workshops');
      if (eventsSection) {
        eventsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Direct Navigation to Login Page for Join Membership button
  const handleJoinMembershipClick = (e) => {
    e.preventDefault();
    navigate('/home/login');
  };

  // Direct Smooth Scroll Trigger for Arrow to navigate to Event Section
  const handleEventScroll = (e) => {
    e.preventDefault();
    if (scrollToEvents) {
      scrollToEvents();
    } else {
      const eventSection = document.getElementById('event-section') || document.getElementById('events');
      const scrollContainer = document.querySelector('.scroll-container');
      if (eventSection && scrollContainer) {
        const topPos = Math.max(eventSection.offsetTop - 80, 0);
        scrollContainer.scrollTo({ top: topPos, behavior: 'smooth' });
      } else if (eventSection) {
        eventSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const slide = carouselSlides[currentSlide];

  return (
    <section 
      id="hero-section" 
      style={heroTransform} 
      className="min-h-[calc(100vh-100px)] relative flex flex-col justify-between py-4 sm:py-6 transition-transform duration-100 ease-out overflow-hidden animate-hero-reveal"
    >
      <style>{`
        @keyframes heroReveal {
          0% { opacity: 0; filter: blur(10px); transform: scale(0.98) translateY(10px); }
          100% { opacity: 1; filter: blur(0px); transform: scale(1) translateY(0); }
        }
        .animate-hero-reveal {
          animation: heroReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes marqueeLeft {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }

        @keyframes marqueeRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }

        .animate-marquee-left {
          display: flex;
          width: max-content;
          animation: marqueeLeft 35s linear infinite;
        }

        .animate-marquee-right {
          display: flex;
          width: max-content;
          animation: marqueeRight 40s linear infinite;
        }

        .animate-marquee-left:hover, .animate-marquee-right:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      {/* BACKGROUND PHOTO COLLAGE ANIMATION */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-30 flex flex-col justify-around py-2 space-y-3">
        
        {/* ROW 1: Moving Left */}
        <div className="animate-marquee-left gap-4">
          {[...backgroundCollageImages, ...backgroundCollageImages].map((imgUrl, index) => (
            <div key={`row1-${index}`} className="w-40 h-24 sm:w-64 sm:h-36 rounded-2xl overflow-hidden shadow-lg shrink-0 border-2 border-white/20">
              <img src={imgUrl} alt="Collage Item" className="w-full h-full object-cover filter contrast-100 hover:scale-105 transition duration-500" />
            </div>
          ))}
        </div>

        {/* ROW 2: Moving Right */}
        <div className="animate-marquee-right gap-4">
          {[...backgroundCollageImages.reverse(), ...backgroundCollageImages].map((imgUrl, index) => (
            <div key={`row2-${index}`} className="w-40 h-24 sm:w-64 sm:h-36 rounded-2xl overflow-hidden shadow-lg shrink-0 border-2 border-white/20">
              <img src={imgUrl} alt="Collage Item" className="w-full h-full object-cover filter contrast-100 hover:scale-105 transition duration-500" />
            </div>
          ))}
        </div>

        {/* ROW 3: Moving Left */}
        <div className="animate-marquee-left gap-4" style={{ animationDuration: '45s' }}>
          {[...backgroundCollageImages, ...backgroundCollageImages].map((imgUrl, index) => (
            <div key={`row3-${index}`} className="w-40 h-24 sm:w-64 sm:h-36 rounded-2xl overflow-hidden shadow-lg shrink-0 border-2 border-white/20">
              <img src={imgUrl} alt="Collage Item" className="w-full h-full object-cover filter contrast-100 hover:scale-105 transition duration-500" />
            </div>
          ))}
        </div>

        {/* Smooth gradient overlay */}
        <div 
          className="absolute inset-0 z-10 transition-colors duration-500" 
          style={{ 
            background: isDarkMode 
              ? 'linear-gradient(to bottom, rgba(6,19,37,0.92) 0%, rgba(6,19,37,0.80) 50%, rgba(6,19,37,0.96) 100%)' 
              : 'linear-gradient(to bottom, rgba(242,244,248,0.78) 0%, rgba(242,244,248,0.65) 50%, rgba(242,244,248,0.82) 100%)' 
          }}
        />
      </div>

      {/* MAIN CONTAINER */}
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 my-auto py-1 sm:py-2 relative z-20 flex flex-col items-center text-center">
        
        {/* CONTENT WRAPPER */}
        <div className="flex flex-col items-center space-y-3 sm:space-y-4 w-full">
          
          {/* STATIC BADGE */}
          <div 
            className="inline-flex items-center gap-2 px-3 py-1 sm:px-5 sm:py-1.5 rounded-full border text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-wider shadow-md backdrop-blur-md transition-all duration-300"
            style={{ 
              borderColor: isDarkMode ? 'rgba(243, 168, 18, 0.45)' : theme.cardBorder, 
              backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.85)' : theme.cardBg, 
              color: isDarkMode ? '#f3a812' : theme.primary 
            }}
          >
            {slide.badge}
          </div>
          
          {/* TITLE & SUBTITLE WITH SLOW SMOOTH FADE TRANSITION */}
          <div className={`flex flex-col items-center space-y-2.5 w-full transition-opacity duration-1000 ease-in-out ${fade ? 'opacity-100' : 'opacity-0'}`}>
            
            {/* MAIN HEADING */}
            <h1 
              className="text-xl sm:text-3xl md:text-5xl lg:text-5.5xl font-black tracking-tight leading-tight drop-shadow-sm transition-colors duration-300" 
              style={{ color: isDarkMode ? '#ffffff' : theme.primary }}
            >
              {slide.title.includes("Learn") ? (
                <>Learn. Connect. <br /><span style={{ color: theme.orange }}>Grow Your Future.</span></>
              ) : slide.title.includes("Scale") ? (
                <>Scale Your Startup <br /><span style={{ color: theme.orange }}>to the Next Level.</span></>
              ) : (
                <>Master Business Plans <br /><span style={{ color: theme.orange }}>as a Student.</span></>
              )}
            </h1>
            
            {/* SUBTITLE */}
            <p 
              className="text-xs sm:text-sm md:text-base max-w-2xl leading-relaxed font-semibold transition-colors duration-300" 
              style={{ color: isDarkMode ? '#cbd5e1' : theme.textMuted }}
            >
              {slide.description}
            </p>

          </div>

          {/* CONSTANT BUTTONS */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <button 
              onClick={handleExploreClick} 
              className="font-extrabold px-5 sm:px-8 py-2 sm:py-3 rounded-full transition-all duration-300 shadow-xl hover:scale-105 transform focus:outline-none text-xs sm:text-sm md:text-base cursor-pointer"
              style={{ backgroundColor: isDarkMode ? '#1d4ed8' : theme.primary, color: '#ffffff' }}
            >
              Explore Workshops
            </button>
            
            <button 
              onClick={handleJoinMembershipClick} 
              className="font-extrabold px-5 sm:px-8 py-2 sm:py-3 rounded-full transition-all duration-300 shadow-md border focus:outline-none hover:scale-105 hover:shadow-xl hover:border-transparent text-xs sm:text-sm md:text-base cursor-pointer"
              style={{ 
                borderColor: isDarkMode ? 'rgba(243, 168, 18, 0.6)' : theme.primary, 
                color: isDarkMode ? '#ffffff' : theme.primary,
                backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.85)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDarkMode ? '#f3a812' : theme.primary;
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.85)';
                e.currentTarget.style.color = isDarkMode ? '#ffffff' : theme.primary;
              }}
            >
              Join Membership 🌟
            </button>
          </div>

          {/* CONSTANT METRICS */}
          <div 
            className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t text-[11px] sm:text-xs md:text-sm max-w-2xl w-full font-bold transition-colors duration-300" 
            style={{ 
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : theme.cardBorder, 
              color: isDarkMode ? '#cbd5e1' : theme.textMuted 
            }}
          >
            <div><strong className="block text-xs sm:text-sm font-extrabold" style={{ color: isDarkMode ? '#ffffff' : theme.textBright }}>Startup</strong> Growth Ideas</div>
            <div><strong className="block text-xs sm:text-sm font-extrabold" style={{ color: isDarkMode ? '#ffffff' : theme.textBright }}>Student</strong> Business Plans</div>
            <div><strong className="block text-xs sm:text-sm font-extrabold" style={{ color: isDarkMode ? '#ffffff' : theme.textBright }}>Global</strong> Networking Hub</div>
            <div><strong className="block text-xs sm:text-sm font-extrabold" style={{ color: isDarkMode ? '#ffffff' : theme.textBright }}>Verified</strong> Certificates</div>
          </div>

        </div>

      </div>

      {/* BOUNCING ARROW LINKED TO EVENT SECTION */}
      <div className="flex justify-center pb-1 pt-0 relative z-20">
        <button onClick={handleEventScroll} className="bounce-arrow transition p-1.5 focus:outline-none cursor-pointer" style={{ color: isDarkMode ? '#f3a812' : theme.primary }}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
      </div>
    </section>
  );
}