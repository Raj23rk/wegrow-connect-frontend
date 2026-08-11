import React, { useState, useEffect, useRef } from 'react';
import { theme } from '../theme';

export default function EventSection({ eventTargetRef, eventStyle }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All'); // 'All', 'STUDENT', 'BUSINESS'
  const sliderRef = useRef(null);

  // Fetch data from your AWS API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://13.239.234.181:4000/v1/events/all-event?page=1&limit=10');
        const json = await response.json();
        if (json.success && json.data && json.data.events) {
          setEvents(json.data.events);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on selected tab
  const filteredEvents = events.filter((ev) => {
    if (activeTab === 'All') return true;
    return ev.type?.toUpperCase() === activeTab.toUpperCase();
  });

  // Tripled list for smooth infinite scrolling effect matching Mentor section
  const infiniteEvents = [...filteredEvents, ...filteredEvents, ...filteredEvents];

  // Custom Smooth Ease-In-Out Smooth Scroll
  const customSmoothScroll = (targetScrollLeft, duration = 1000) => {
    if (!sliderRef.current) return;
    const startScrollLeft = sliderRef.current.scrollLeft;
    const distance = targetScrollLeft - startScrollLeft;
    let startTime = null;

    const easeInOutCubic = (t) => 
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const animation = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easeProgress = easeInOutCubic(progress);

      if (sliderRef.current) {
        sliderRef.current.scrollLeft = startScrollLeft + (distance * easeProgress);
      }

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      } else if (sliderRef.current) {
        const singleSetWidth = sliderRef.current.scrollWidth / 3;
        if (sliderRef.current.scrollLeft >= singleSetWidth * 2) {
          sliderRef.current.scrollLeft -= singleSetWidth;
        } else if (sliderRef.current.scrollLeft <= 0) {
          sliderRef.current.scrollLeft += singleSetWidth;
        }
      }
    };

    requestAnimationFrame(animation);
  };

  const scroll = (direction) => {
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.children[0]?.offsetWidth + 24 || 350;
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      customSmoothScroll(sliderRef.current.scrollLeft + scrollAmount, 900);
    }
  };

  return (
    <section 
      ref={eventTargetRef} 
      style={{
        ...eventStyle,
        backgroundColor: 'transparent',
      }}
      className="w-full py-16 px-6 sm:px-12 flex flex-col items-center justify-center transition-all duration-700 my-4 w-full"
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
      `}</style>

      {/* HEADER SECTION */}
      <div className="text-center max-w-3xl mb-10">
        <span className="text-xs sm:text-sm font-black tracking-widest uppercase mb-2 block drop-shadow-sm text-[#f59e0b]">
          UPCOMING EVENTS & SESSIONS
        </span>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-3 drop-shadow-md" style={{ color: '#104288' }}>
          Expand Your Knowledge With Expert-Led Events
        </h2>
        <p className="text-sm sm:text-base font-semibold text-gray-700 leading-relaxed drop-shadow-sm">
          Discover interactive workshops, professional seminars, and hands-on industrial experiences designed to accelerate your career growth.
        </p>
      </div>

      {/* CATEGORY TABS */}
      <div className="flex items-center justify-center gap-3 bg-white/70 backdrop-blur-md p-2 rounded-full mb-12 shadow-lg border border-white/60">
        {['All', 'STUDENT', 'BUSINESS'].map((tab) => (
          <button
            key={tab}
            onClick={() => { 
              setActiveTab(tab); 
              if (sliderRef.current) sliderRef.current.scrollLeft = 0; 
            }}
            className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-300 cursor-pointer ${
              activeTab === tab 
                ? 'bg-[#104288] text-white shadow-lg' 
                : 'text-gray-700 hover:text-[#104288] bg-transparent'
            }`}
          >
            {tab === 'All' ? 'All Sessions' : tab === 'STUDENT' ? 'Student' : 'Business Pro'}
          </button>
        ))}
      </div>

      {/* CAROUSEL WRAPPER WITH MENTOR STYLE ARROWS */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 relative">

        {loading ? (
          <div className="py-16 text-center text-sm font-bold text-gray-700 animate-pulse">Loading amazing events from server...</div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-16 text-center text-sm font-bold text-gray-700">No events found for this category.</div>
        ) : (
          <>
            {/* LEFT ARROW */}
            <button 
              onClick={() => scroll('left')}
              className="absolute -left-3 md:-left-7 top-1/2 -translate-y-1/2 z-50 p-1.5 transition-all duration-300 hover:scale-125 focus:outline-none cursor-pointer bg-transparent border-none"
              title="Previous"
            >
              <svg 
                className="w-7 h-7 md:w-9 md:h-9 animate-nudge-left transition-colors" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#104288" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* RIGHT ARROW */}
            <button 
              onClick={() => scroll('right')}
              className="absolute -right-3 md:-right-7 top-1/2 -translate-y-1/2 z-50 p-1.5 transition-all duration-300 hover:scale-125 focus:outline-none cursor-pointer bg-transparent border-none"
              title="Next"
            >
              <svg 
                className="w-7 h-7 md:w-9 md:h-9 animate-nudge-right transition-colors" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#104288" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* HORIZONTAL SLIDER CONTAINER */}
            <div 
              ref={sliderRef}
              className="flex gap-6 overflow-x-auto pb-4 pt-1 px-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {infiniteEvents.map((item, index) => (
                <div 
                  key={`${item._id || item.id || index}-${index}`}
                  className="shrink-0 w-full sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)] bg-white/95 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-2xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-2"
                >
                  <div>
                    <span className="inline-block text-[10px] sm:text-xs font-semibold uppercase px-3 py-1 rounded-full mb-4 shadow-sm" style={{ backgroundColor: theme.neutralBg, color: theme.neutralText }}>
                      {item.type || 'SESSION'}
                    </span>

                    {item.image && (
                      <div className="w-full h-44 rounded-2xl overflow-hidden mb-5 shadow-md bg-gray-100">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          onError={(e)=>{e.target.src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80"}}
                        />
                      </div>
                    )}

                    <h3 className="text-lg font-black text-gray-900 mb-2 line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-xs font-semibold text-gray-700 leading-relaxed mb-5 line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-4 border-t border-gray-200/80 flex flex-col gap-3">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-600">
                      <div className="flex items-center gap-1.5 truncate">
                        <span>📍</span> <span className="truncate">{item.location || 'Online'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span>📅</span> {item.date ? new Date(item.date).toLocaleDateString() : 'TBA'}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <span className="block text-[10px] font-bold text-gray-400 uppercase">Seat Fee</span>
                        <span className="text-base font-black text-[#104288]">
                          ₹{item.price || '999'}
                        </span>
                      </div>

                      <button 
                        onClick={() => alert(`Booking seat for: ${item.title}`)}
                        className="bg-[#104288] hover:bg-[#f97316] text-white font-extrabold text-xs px-4 py-2 rounded-full transition-all duration-300 shadow-md cursor-pointer"
                      >
                        Book Seat Now →
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </section>
  );
}