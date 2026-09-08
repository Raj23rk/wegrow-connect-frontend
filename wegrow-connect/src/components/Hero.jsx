import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { useTheme } from '../context/ThemeContext';

const carouselSlides = [
  {
    id: 1,
    badge: "✦ A BUSINESS GROWTH ECOSYSTEM ✦",
    title: (
      <>
        You built the business. <br />
        <span className="italic" style={{ color: '#F3A812' }}>
          Now, build what's next.
        </span>
      </>
    ),
    description: "A growth ecosystem for entrepreneurs, business owners and aspiring founders who are ready to learn, evolve and take their next step."
  },
  {
    id: 2,
    badge: "✦ GLOBAL LEARNING & ACCELERATOR ✦",
    title: (
      <>
        Learn. Connect. <br />
        <span className="italic" style={{ color: '#F3A812' }}>
          Grow Your Future.
        </span>
      </>
    ),
    description: "Master cutting-edge skills through hands-on workshops led by elite industry pioneers. Join a high-achieving global community and unlock your maximum potential today."
  },
  {
    id: 3,
    badge: "✦ STARTUP GROWTH HUB ✦",
    title: (
      <>
        Scale Your Startup <br />
        <span className="italic" style={{ color: '#F3A812' }}>
          to the Next Level.
        </span>
      </>
    ),
    description: "Discover powerful growth strategies, scaling frameworks, expert mentorship, and proven roadmaps to rapidly accelerate your business success."
  },
  {
    id: 4,
    badge: "✦ STUDENT ENTREPRENEURSHIP ✦",
    title: (
      <>
        Master Business Plans <br />
        <span className="italic" style={{ color: '#F3A812' }}>
          as a Student.
        </span>
      </>
    ),
    description: "Learn how to build rock-solid business plans, understand core market fundamentals, validate your ideas, and kickstart your entrepreneurial journey from scratch."
  }
];

// High-resolution background collage photos
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
      }, 700); 
    }, 6500); 

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
      style={{
        ...heroTransform,
        backgroundColor: 'rgb(16, 66, 136)'
      }} 
      className="min-h-[calc(100vh-100px)] relative flex flex-col justify-between py-4 sm:py-6 transition-transform duration-100 ease-out overflow-hidden animate-hero-reveal text-white"
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

        @keyframes mascotFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
      
      {/* BACKGROUND PHOTO COLLAGE ANIMATION WITH ENHANCED BRIGHTNESS */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40 sm:opacity-45 flex flex-col justify-around py-2 space-y-3">
        {/* ROW 1: Moving Left */}
        <div className="animate-marquee-left gap-4">
          {[...backgroundCollageImages, ...backgroundCollageImages].map((imgUrl, index) => (
            <div key={`row1-${index}`} className="w-44 h-28 sm:w-64 sm:h-36 rounded-2xl overflow-hidden shadow-lg shrink-0 border-2 border-white/40">
              <img src={imgUrl} alt="Collage Item" className="w-full h-full object-cover filter brightness-125 contrast-110 saturate-110 hover:scale-105 transition duration-500" />
            </div>
          ))}
        </div>

        {/* ROW 2: Moving Right */}
        <div className="animate-marquee-right gap-4">
          {[...backgroundCollageImages.reverse(), ...backgroundCollageImages].map((imgUrl, index) => (
            <div key={`row2-${index}`} className="w-44 h-28 sm:w-64 sm:h-36 rounded-2xl overflow-hidden shadow-lg shrink-0 border-2 border-white/40">
              <img src={imgUrl} alt="Collage Item" className="w-full h-full object-cover filter brightness-125 contrast-110 saturate-110 hover:scale-105 transition duration-500" />
            </div>
          ))}
        </div>

        {/* ROW 3: Moving Left */}
        <div className="animate-marquee-left gap-4" style={{ animationDuration: '45s' }}>
          {[...backgroundCollageImages, ...backgroundCollageImages].map((imgUrl, index) => (
            <div key={`row3-${index}`} className="w-44 h-28 sm:w-64 sm:h-36 rounded-2xl overflow-hidden shadow-lg shrink-0 border-2 border-white/40">
              <img src={imgUrl} alt="Collage Item" className="w-full h-full object-cover filter brightness-125 contrast-110 saturate-110 hover:scale-105 transition duration-500" />
            </div>
          ))}
        </div>

        {/* Smooth gradient overlay using rgb(16, 66, 136) calibrated for bright background visibility */}
        <div 
          className="absolute inset-0 z-10 transition-colors duration-500" 
          style={{ 
            background: 'linear-gradient(135deg, rgba(16, 66, 136, 0.82) 0%, rgba(11, 46, 95, 0.78) 50%, rgba(6, 24, 52, 0.86) 100%)' 
          }}
        />
      </div>

      {/* TWO-PART SPLIT CONTAINER: CONTENT LEFT, IMAGE RIGHT */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 my-auto py-3 sm:py-6 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* =====================================================
              LEFT SIDE: CONTENT SHOWING
              ===================================================== */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
            
            {/* STATIC / SLIDE BADGE */}
            <div 
              className="inline-flex items-center gap-2 px-3.5 py-1 sm:px-5 sm:py-1.5 rounded-full border text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-sm backdrop-blur-md transition-all duration-300"
              style={{ 
                borderColor: 'rgba(255, 200, 98, 0.45)', 
                backgroundColor: 'rgba(255, 255, 255, 0.15)', 
                color: '#FFC862' 
              }}
            >
              <span>—</span>
              <span>{slide.badge.replace(/✦/g, '').trim()}</span>
            </div>
            
            {/* TITLE & SUBTITLE WITH SLOW SMOOTH FADE TRANSITION */}
            <div className={`flex flex-col items-center lg:items-start space-y-2.5 w-full transition-opacity duration-700 ease-in-out ${fade ? 'opacity-100' : 'opacity-0'}`}>
              
              {/* MAIN HEADING */}
              <h1 
                className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1] drop-shadow-sm text-white"
              >
                {slide.title}
              </h1>
              
              {/* SUBTITLE */}
              <p 
                className="text-xs sm:text-sm md:text-base max-w-xl leading-relaxed font-normal text-blue-100/90"
              >
                {slide.description}
              </p>

            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-1">
              <button 
                onClick={handleExploreClick} 
                className="font-bold px-6 sm:px-8 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 transform focus:outline-none text-xs sm:text-sm cursor-pointer inline-flex items-center gap-2 border border-white/30 backdrop-blur-md"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.15)', 
                  color: '#ffffff' 
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                }}
              >
                <span>Discover WeGrow</span>
              </button>
              
              <button 
                onClick={handleJoinMembershipClick} 
                className="font-bold px-6 sm:px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:scale-105 transform focus:outline-none text-xs sm:text-sm cursor-pointer inline-flex items-center gap-2"
                style={{ 
                  backgroundColor: '#FF6A45',
                  color: '#ffffff',
                  boxShadow: '0 6px 22px rgba(255, 106, 69, 0.45)'
                }}
              >
                <span>Become a Member</span>
                <span className="text-base font-black">→</span>
              </button>
            </div>

            {/* SOCIAL PROOF (FOUNDER AVATARS & TRUST BADGE) */}
            {/* <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <div className="flex items-center -space-x-2 shrink-0">
                <img className="w-8 h-8 rounded-full border-2 border-white/60 object-cover shadow-sm" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Founder 1" />
                <img className="w-8 h-8 rounded-full border-2 border-white/60 object-cover shadow-sm" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Founder 2" />
                <img className="w-8 h-8 rounded-full border-2 border-white/60 object-cover shadow-sm" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Founder 3" />
                <img className="w-8 h-8 rounded-full border-2 border-white/60 object-cover shadow-sm" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="Founder 4" />
              </div>
              <p className="text-xs font-semibold text-blue-100">
                Trusted by <strong className="font-extrabold text-[#FFC862]">500+ founders</strong> across 20+ industries since 2019
              </p>
            </div> */}

            {/* CONSTANT METRICS ROW */}
            <div 
              className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-white/20 text-[11px] sm:text-xs max-w-xl w-full font-bold transition-colors duration-300 text-blue-100" 
            >
              <div className="p-2 rounded-xl bg-white/10 border border-white/20 shadow-xs text-left backdrop-blur-xs">
                <strong className="block text-xs font-extrabold text-[#FFC862]">Startup</strong> Growth Ideas
              </div>
              <div className="p-2 rounded-xl bg-white/10 border border-white/20 shadow-xs text-left backdrop-blur-xs">
                <strong className="block text-xs font-extrabold text-[#FFC862]">Student</strong> Business Plans
              </div>
              <div className="p-2 rounded-xl bg-white/10 border border-white/20 shadow-xs text-left backdrop-blur-xs">
                <strong className="block text-xs font-extrabold text-[#FFC862]">Global</strong> Networking Hub
              </div>
              <div className="p-2 rounded-xl bg-white/10 border border-white/20 shadow-xs text-left backdrop-blur-xs">
                <strong className="block text-xs font-extrabold text-[#FFC862]">Verified</strong> Certificates
              </div>
            </div>

          </div>

          {/* =====================================================
              RIGHT SIDE: MASCOT SQUIRREL IMAGE (BACKGROUND REMOVED)
              ===================================================== */}
          <div className="lg:col-span-5 flex flex-col justify-center items-center relative pt-2 lg:pt-0">
            {/* Ambient Radial Color Glow */}
            <div 
              className="absolute w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full blur-3xl -z-10 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(255, 200, 98, 0.40) 0%, rgba(255, 106, 69, 0.25) 45%, transparent 70%)'
              }}
            ></div>

            {/* Mascot Image with Float Animation */}
            <div className="relative max-w-[280px] sm:max-w-[340px] lg:max-w-[420px] w-full flex flex-col items-center animate-[mascotFloat_6s_ease-in-out_infinite]">
              <img 
                src="/mascot.png" 
                alt="Grow — WeGrow B-School Mascot Squirrel" 
                className="w-full h-auto max-h-[460px] lg:max-h-[530px] object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.50)] hover:scale-105 transition-transform duration-500 cursor-pointer"
                onError={(e) => {
                  e.currentTarget.src = "/wegrow-mascot.jpeg";
                }}
              />

              {/* Floating Mascot Badge */}
              <div 
                className="mt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full shadow-lg border backdrop-blur-md transition-all duration-300"
                style={{
                  backgroundColor: 'rgba(6, 26, 56, 0.85)',
                  borderColor: 'rgba(255, 200, 98, 0.45)',
                  color: '#FFC862'
                }}
              >
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
                <span className="text-[11px] font-black uppercase tracking-wider">
                  Meet Grow • WeGrow Mascot
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* BOUNCING ARROW LINKED Trusted by 500+ founders across 20+ industries since 2019O EVENT SECTION */}
      <div className="flex justify-center pb-1 pt-0 relative z-20">
        <button onClick={handleEventScroll} className="bounce-arrow transition p-1.5 focus:outline-none cursor-pointer text-[#FFC862] hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
      </div>
    </section>
  );
}