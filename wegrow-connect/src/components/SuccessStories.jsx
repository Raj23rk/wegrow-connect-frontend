import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';

// Updated Success Story Videos Data
const successVideos = [
  { id: 1, title: "AI Tools & Techniques", founder: "Bootcamp Session", company: "AI Tools Bootcamp", videoUrl: "/videos/video1.mp4" },
  { id: 2, title: "Digital Marketing Strategies", founder: "Future Marketer", company: "Digital Marketing", videoUrl: "/videos/video2.mp4" },
  { id: 3, title: "Target Audience & Retargeting", founder: "Marketing Webinar", company: "Digital Marketing", videoUrl: "/videos/video3.mp4" },
  { id: 4, title: "Tech Career & Skills", founder: "One Day Workshop", company: "Tech Career Explorer", videoUrl: "/videos/video4.mp4" },
  { id: 5, title: "Full Stack & Web Development", founder: "Coding Session", company: "Web Development", videoUrl: "/videos/video5.mp4" },
  { id: 6, title: "Soft Skills & Communication", founder: "Professional Training", company: "Vision 20 Plus", videoUrl: "/videos/video6.mp4" },
  { id: 7, title: "IT Training & Placement", founder: "Campus Overview", company: "WeGrow Skill Campus", videoUrl: "/videos/video7.mp4" },
  { id: 8, title: "Student Certifications", founder: "Milestone Celebration", company: "Graduation Day", videoUrl: "/videos/video8.mp4" },
  { id: 9, title: "Success Journey & Growth", founder: "Student Testimonials", company: "WeGrow Alumni", videoUrl: "/videos/video9.mp4" }
];

// Generate 15 certificate/image stories array (public/story/img1.png to img15.png)
const baseStories = Array.from({ length: 15 }, (_, i) => ({
  id: `story-${i + 1}`,
  title: `Success Milestone #${i + 1}`,
  subtitle: 'Certificate Awarded',
  image: `/story/img${i + 1}.png`
}));

// Tripled array for infinite continuous loop
const infiniteStories = [...baseStories, ...baseStories, ...baseStories];

export default function SuccessStories({ storiesTargetRef, storiesStyle }) {
  const navigate = useNavigate();
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [mutedVideos, setMutedVideos] = useState({});
  const [isApplyHovered, setIsApplyHovered] = useState(false);

  const sliderRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(1);

  const cardWidth = 324; // Card width + gap
  const singleSetWidth = cardWidth * baseStories.length;

  // Toggle Mute / Unmute for specific video
  const toggleSound = (e, id) => {
    e.stopPropagation();
    setMutedVideos((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // CONTINUOUS ULTRA-SLOW & SMOOTH ROLLING LOOP FOR CERTIFICATES
  useEffect(() => {
    let animationFrameId;

    const smoothContinuousScroll = () => {
      if (sliderRef.current && !isPaused) {
        sliderRef.current.scrollLeft += 0.5;

        if (sliderRef.current.scrollLeft >= singleSetWidth * 2) {
          sliderRef.current.scrollLeft -= singleSetWidth;
        } else if (sliderRef.current.scrollLeft <= 0) {
          sliderRef.current.scrollLeft += singleSetWidth;
        }

        const scrollLeft = sliderRef.current.scrollLeft;
        const centerIndex = Math.round((scrollLeft + sliderRef.current.clientWidth / 2 - 150) / cardWidth);
        setActiveIndex(centerIndex);
      }
      animationFrameId = requestAnimationFrame(smoothContinuousScroll);
    };

    animationFrameId = requestAnimationFrame(smoothContinuousScroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, singleSetWidth, cardWidth]);

  // Manual Chevron Button Smooth Scroll Action for Certificates
  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      sliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Handle Apply Now Click
  const handleApplyClick = () => {
    navigate('/home/login');
  };

  return (
    <section 
      ref={storiesTargetRef} 
      id="success-stories" 
      style={storiesStyle}
      className="relative pt-0 pb-16 transition-all duration-300 ease-out transform-gpu"
    >
      <style>{`
        @keyframes moveLeftRightLeft {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-6px); }
        }
        @keyframes moveLeftRightRight {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(6px); }
        }
        .animate-nudge-left {
          animation: moveLeftRightLeft 1.4s infinite ease-in-out;
        }
        .animate-nudge-right {
          animation: moveLeftRightRight 1.4s infinite ease-in-out;
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(245, 158, 11, 0.4); }
          50% { box-shadow: 0 0 35px rgba(245, 158, 11, 0.8); }
        }
        .apply-glow-btn {
          animation: pulseGlow 3s infinite ease-in-out;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative space-y-12">

        {/* HEADER SECTION */}
        <div id="story-title" className="max-w-4xl mx-auto text-center space-y-2">
          <span className="text-xs uppercase font-black tracking-widest block" style={{ color: theme.orange }}>
            STUDENT ACHIEVEMENTS & MILESTONES
          </span>
          <h2 className="text-3xl lg:text-5xl font-extrabold drop-shadow-sm leading-tight" style={{ color: theme.primary }}>
            Success Stories & Certifications
          </h2>
          <p className="text-sm lg:text-base font-semibold leading-relaxed" style={{ color: theme.textMuted }}>
            Watch our workshop highlights, skill development sessions, and celebrate student certifications.
          </p>
        </div>

        {/* PART 1: STUDENT CERTIFICATIONS & MILESTONES */}
        <div>
          <div className="text-center mb-1">
            <h3 className="text-2xl md:text-3xl font-extrabold" style={{ color: theme.primary }}>
              Student <span style={{ color: theme.orange }}>Certifications & Milestones</span>
            </h3>
          </div>

          <div 
            className="relative w-full pt-4 pb-8"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* LEFT CHEVRON ARROW */}
            <button 
              onClick={() => scroll('left')}
              className="absolute -left-3 md:-left-7 top-1/2 -translate-y-1/2 z-50 p-1.5 transition-all duration-300 hover:scale-125 focus:outline-none cursor-pointer bg-transparent border-none"
              title="Previous"
            >
              <svg 
                className="w-7 h-7 md:w-9 md:h-9 animate-nudge-left transition-colors" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke={theme.primary} 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* RIGHT CHEVRON ARROW */}
            <button 
              onClick={() => scroll('right')}
              className="absolute -right-3 md:-right-7 top-1/2 -translate-y-1/2 z-50 p-1.5 transition-all duration-300 hover:scale-125 focus:outline-none cursor-pointer bg-transparent border-none"
              title="Next"
            >
              <svg 
                className="w-7 h-7 md:w-9 md:h-9 animate-nudge-right transition-colors" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke={theme.primary} 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* CONTINUOUS ROLLING CONTAINER */}
            <div 
              ref={sliderRef}
              className="flex gap-6 overflow-x-auto pb-4 pt-4 px-4 md:px-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {infiniteStories.map((item, index) => {
                const isCenter = index === activeIndex;
                return (
                  <div 
                    key={`${item.id}-${index}`}
                    className={`shrink-0 w-[280px] sm:w-[300px] group backdrop-blur-md rounded-3xl overflow-visible border p-5 flex flex-col justify-between transition-all duration-500 transform-gpu ${
                      isCenter 
                        ? 'scale-100 shadow-2xl z-30 border-amber-500/60 brightness-110 -translate-y-2' 
                        : 'scale-95 opacity-70 shadow-md z-10 border-transparent hover:opacity-100 hover:scale-100'
                    }`}
                    style={{ 
                      backgroundColor: theme.cardBg, 
                      borderColor: isCenter ? theme.orange : theme.cardBorder 
                    }}
                  >
                    <div>
                      <div className="w-full h-[220px] rounded-2xl overflow-hidden relative mb-4 bg-zinc-900 border border-amber-500/10">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600';
                          }}
                        />
                        <span 
                          className="absolute bottom-2 left-2 text-[10px] font-black px-2.5 py-1 rounded-full backdrop-blur-md border shadow-md"
                          style={{ color: theme.orange, backgroundColor: 'white', borderColor: theme.cardBorder }}
                        >
                          🎓 Certified
                        </span>
                      </div>

                      <div className="text-left space-y-1">
                        <h4 className="text-lg font-extrabold truncate" style={{ color: theme.textBright }}>
                          {item.title}
                        </h4>
                        <p className="text-[11px] font-bold uppercase tracking-wider truncate" style={{ color: theme.primary }}>
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t mt-4 flex items-center justify-between text-[11px] font-bold" style={{ borderColor: 'rgba(255,255,255,0.08)', color: theme.textMuted }}>
                      <span>WeGrow Graduate</span>
                      <span style={{ color: theme.primary }}>✦ Verified</span>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* PART 2: WORKSHOP HIGHLIGHTS VIDEO GRID */}
        <div>
          <div className="text-center mb-6">
            <h3 className="text-2xl md:text-3xl font-extrabold" style={{ color: theme.primary }}>
              Workshop Highlights & <span style={{ color: theme.orange }}>Training Sessions</span>
            </h3>
            <p className="text-xs md:text-sm font-semibold mt-1" style={{ color: theme.textMuted }}>
              Hover over cards to watch our expert-led sessions and hands-on bootcamps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {successVideos.map((item) => {
              const isHovered = activeVideoId === item.id;
              const isAnyHovered = activeVideoId !== null;
              const isMuted = mutedVideos[item.id] !== false;

              return (
                <div 
                  key={item.id}
                  onMouseEnter={() => setActiveVideoId(item.id)}
                  onMouseLeave={() => {
                    setActiveVideoId(null);
                    setMutedVideos((prev) => ({ ...prev, [item.id]: true }));
                  }}
                  className={`relative rounded-2xl overflow-hidden shadow-2xl border bg-black group transition-all duration-500 transform-gpu cursor-pointer ${
                    isAnyHovered && !isHovered ? 'scale-[0.98]' : 'scale-100'
                  }`}
                  style={{ borderColor: theme.cardBorder }}
                >
                  <video 
                    src={item.videoUrl}
                    muted={isMuted}
                    loop
                    playsInline
                    ref={(el) => {
                      if (el) {
                        if (isHovered) {
                          el.play().catch(() => {});
                        } else {
                          el.pause();
                          el.currentTime = 0;
                        }
                      }
                    }}
                    className="w-full h-[260px] object-cover transition-all duration-500"
                    style={{
                      filter: isAnyHovered && !isHovered 
                        ? 'grayscale(100%) contrast(150%) brightness(55%)' 
                        : isHovered 
                        ? 'grayscale(0%) contrast(100%) brightness(100%)' 
                        : 'grayscale(40%) contrast(120%) brightness(80%)'
                    }}
                  />

                  {/* TOP-RIGHT SOUND BUTTON */}
                  {isHovered && (
                    <button
                      onClick={(e) => toggleSound(e, item.id)}
                      className="absolute top-3 right-3 z-30 p-2.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white transition-all duration-300 hover:scale-110 shadow-lg cursor-pointer flex items-center justify-center"
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? (
                        <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-amber-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                      )}
                    </button>
                  )}

                  {/* OVERLAY TEXT */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent flex flex-col justify-end p-5 transition-opacity duration-300 z-10 ${
                    isHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                  }`}>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1 drop-shadow-md">
                      {item.company}
                    </span>
                    <h4 className="text-lg font-extrabold text-white mb-0.5 drop-shadow-md">
                      {item.founder}
                    </h4>
                    <p className="text-xs font-medium text-gray-200 drop-shadow-md">
                      {item.title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PART 3: STYLISH "APPLY FOR NOW" CALL TO ACTION BUTTON WITH HOVER ORANGE EFFECT */}
        <div className="pt-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-8 rounded-3xl w-full max-w-4xl border backdrop-blur-md shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6"
               style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
          >
            <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full opacity-10 pointer-events-none" style={{ backgroundColor: theme.orange }}></div>
            
            <div className="text-left space-y-1">
              <span className="text-xs font-black uppercase tracking-wider" style={{ color: theme.orange }}>
                ✦ START YOUR IT JOURNEY TODAY ✦
              </span>
              <h4 className="text-xl md:text-2xl font-extrabold" style={{ color: theme.primary }}>
                Ready to Build Your Tech Career?
              </h4>
              <p className="text-xs md:text-sm font-medium" style={{ color: theme.textMuted }}>
                Join our upcoming batch, master cutting-edge skills, and secure your 100% placement support.
              </p>
            </div>

            <button 
              onClick={handleApplyClick}
              onMouseEnter={() => setIsApplyHovered(true)}
              onMouseLeave={() => setIsApplyHovered(false)}
              className="apply-glow-btn px-8 py-4 rounded-full font-black text-sm md:text-base uppercase tracking-wider transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer shadow-xl flex items-center gap-3 shrink-0"
              style={{ 
                backgroundColor: isApplyHovered ? theme.orange : theme.primary, 
                color: '#ffffff' 
              }}
            >
              <span>Apply For Now</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}