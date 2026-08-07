import React, { useState, useEffect } from 'react';
import { theme } from '../theme';

export default function EventSection({ eventTargetRef, eventStyle }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All'); // 'All', 'STUDENT', 'BUSINESS'
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? Math.max(0, filteredEvents.length - 1) : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= filteredEvents.length - 1 ? 0 : prev + 1));
  };

  return (
    <section 
      ref={eventTargetRef} 
      style={{
        ...eventStyle,
        backgroundColor: 'transparent',
      }}
      className="w-full min-h-[80vh] py-10 px-6 sm:px-12 flex flex-col items-center justify-center transition-all duration-700 my-4 max-w-7xl mx-auto"
    >
      {/* HEADER SECTION WITH REDUCED TOP/BOTTOM SPACING & IMAGE 2/4 MATCHING YELLOW COLOR */}
      <div className="text-center max-w-3xl mb-8">
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
      <div className="flex items-center justify-center gap-3 bg-white/70 backdrop-blur-md p-2 rounded-full mb-8 shadow-lg border border-white/60">
        {['All', 'STUDENT', 'BUSINESS'].map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setCurrentIndex(0); }}
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

      {/* CAROUSEL CONTAINER */}
      <div className="w-full max-w-4xl relative flex items-center justify-center">
        {loading ? (
          <div className="py-16 text-sm font-bold text-gray-700 animate-pulse">Loading amazing events...</div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-16 text-sm font-bold text-gray-700">No events found for this category.</div>
        ) : (
          <div className="w-full flex items-center justify-center relative overflow-hidden px-4">
            
            {/* EVENT CARD */}
            <div className="w-full bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between transition-all duration-500">
              
              <div>
                <span className="inline-block text-[10px] sm:text-xs font-black uppercase px-3 py-1 rounded-full bg-blue-50 text-[#104288] mb-4 shadow-sm">
                  {filteredEvents[currentIndex]?.type || 'SESSION'}
                </span>

                {filteredEvents[currentIndex]?.image && (
                  <div className="w-full h-44 sm:h-56 rounded-2xl overflow-hidden mb-5 shadow-md bg-gray-100">
                    <img 
                      src={filteredEvents[currentIndex].image} 
                      alt="Event banner" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      onError={(e)=>{e.target.src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80"}}
                    />
                  </div>
                )}

                <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">
                  {filteredEvents[currentIndex]?.title}
                </h3>

                <p className="text-xs sm:text-sm font-semibold text-gray-700 leading-relaxed mb-5">
                  {filteredEvents[currentIndex]?.description}
                </p>
              </div>

              {/* Card Footer: Location, Date & Price */}
              <div className="pt-4 border-t border-gray-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <span>📍</span> {filteredEvents[currentIndex]?.location || 'Online'}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>📅</span> {filteredEvents[currentIndex]?.date ? new Date(filteredEvents[currentIndex].date).toLocaleDateString() : 'TBA'}
                  </div>
                </div>

                <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-6">
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">Seat Fee</span>
                    <span className="text-lg sm:text-xl font-black text-[#104288]">
                      ₹{filteredEvents[currentIndex]?.price || '999'}
                    </span>
                  </div>

                  <button 
                    onClick={() => alert(`Booking seat for: ${filteredEvents[currentIndex]?.title}`)}
                    className="bg-[#104288] hover:bg-[#f97316] text-white font-extrabold text-xs px-6 py-3 rounded-full transition-all duration-300 shadow-md cursor-pointer flex items-center gap-2"
                  >
                    Book Seat Now →
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}
      </div>

      {/* CAROUSEL CONTROLS */}
      {!loading && filteredEvents.length > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button 
            onClick={handlePrev}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-gray-300 text-[#104288] font-black flex items-center justify-center shadow-lg hover:bg-[#104288] hover:text-white transition-all cursor-pointer"
          >
            ←
          </button>
          
          <div className="flex items-center gap-2">
            {filteredEvents.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-[#f97316]' : 'w-2 bg-gray-300'}`}
              />
            ))}
          </div>

          <button 
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-gray-300 text-[#104288] font-black flex items-center justify-center shadow-lg hover:bg-[#104288] hover:text-white transition-all cursor-pointer"
          >
            →
          </button>
        </div>
      )}
    </section>
  );
}