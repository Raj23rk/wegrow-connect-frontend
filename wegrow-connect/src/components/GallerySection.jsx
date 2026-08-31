import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { getCombinedGalleryItems } from './GalleryPage';

export default function GallerySection({ galleryTargetRef, galleryStyle }) {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [allItems, setAllItems] = useState([]);

  useEffect(() => {
    setAllItems(getCombinedGalleryItems());
  }, []);

  const filterTabs = [
    { id: 'all', label: 'All Photos', icon: '📸' },
    { id: 'workshop', label: 'Workshop', icon: '🛠️' },
    { id: 'activity', label: 'Activity', icon: '⚡' },
    { id: 'student', label: 'Student', icon: '🎓' },
    { id: 'business', label: 'Business', icon: '🏢' }
  ];

  const getBadgeStyle = (cat) => {
    switch (cat) {
      case 'workshop': return 'bg-blue-600 text-white';
      case 'activity': return 'bg-[#f3a812] text-[#104288]';
      case 'student': return 'bg-emerald-600 text-white';
      case 'business': return 'bg-purple-600 text-white';
      default: return 'bg-gray-800 text-white';
    }
  };

  const filteredItems = allItems.filter(item => {
    if (activeFilter === 'all') return true;
    return item.category === activeFilter;
  });

  // Show only 4 photos on home page section
  const displayedItems = filteredItems.slice(0, 4);

  return (
    <section 
      ref={galleryTargetRef} 
      style={galleryStyle}
      className="py-6 sm:py-10 md:py-14 px-3 sm:px-4 md:px-8 relative z-10 transition-all duration-700"
    >
      <div className="max-w-7xl mx-auto w-full">
        
        {/* SECTION HEADER */}
        <div className="text-center mb-5 sm:mb-8 md:mb-10">
          <div 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-2.5 shadow-sm border"
            style={{ 
              backgroundColor: 'rgba(16, 66, 136, 0.08)', 
              color: theme.primary || '#104288',
              borderColor: 'rgba(16, 66, 136, 0.2)' 
            }}
          >
            <span>📸</span>
            <span>Campus & Industry Moments</span>
          </div>

          <h2 
            className="text-xl sm:text-3xl md:text-5xl font-black tracking-tight"
            style={{ color: theme.primary || '#104288' }}
          >
            WeGrow <span style={{ color: theme.orange || '#f3a812' }}>Gallery</span>
          </h2>

          <p 
            className="mt-2.5 text-xs sm:text-sm font-semibold max-w-2xl mx-auto leading-relaxed"
            style={{ color: theme.textMuted || '#50637f' }}
          >
            A vibrant glimpse into our interactive workshops, campus activities, student achievements, 
            and enterprise collaborations across our Sivakasi & Srivilliputhur campuses.
          </p>

          {/* 4 MENU CATEGORY TABS (Workshop, Activity, Student, Business) */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-4 sm:mt-6">
            {filterTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-sm font-extrabold flex items-center gap-1.5 sm:gap-2 transition-all duration-300 shadow-sm cursor-pointer ${
                  activeFilter === tab.id 
                    ? 'text-white scale-105 shadow-md' 
                    : 'bg-white/80 hover:bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                }`}
                style={{
                  backgroundColor: activeFilter === tab.id ? (theme.primary || '#104288') : undefined,
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* GALLERY GRID (LIMITED TO 4 PHOTOS ON HOME PAGE) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {displayedItems.map(item => (
            <div 
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5 cursor-pointer border bg-white"
              style={{ borderColor: theme.cardBorder || 'rgba(16, 66, 136, 0.15)' }}
            >
              {/* IMAGE WRAPPER */}
              <div className="w-full h-44 sm:h-52 overflow-hidden relative bg-gray-100">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800';
                  }}
                />

                {/* GRADIENT OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                {/* CATEGORY BADGE */}
                <div className="absolute top-3 left-3 z-10">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md ${getBadgeStyle(item.category)}`}>
                    {item.badge}
                  </span>
                </div>

                {/* ZOOM ICON */}
                <div className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>

                {/* TITLE OVERLAY AT BOTTOM OF CARD */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
                  <h4 className="font-extrabold text-sm leading-snug group-hover:text-amber-300 transition-colors drop-shadow-sm line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-gray-200 mt-1 line-clamp-1 opacity-90">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SHOW MORE BUTTON */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/gallery')}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-extrabold text-white text-xs sm:text-sm shadow-xl transition-all duration-300 hover:scale-105 transform cursor-pointer border border-amber-400/40"
            style={{
              backgroundColor: '#104288',
              backgroundImage: 'linear-gradient(135deg, #104288 0%, #0c336b 100%)'
            }}
          >
            <span>Show More Gallery Photos</span>
            <span className="text-[#f3a812] text-base">→</span>
          </button>
        </div>

        {/* LIGHTBOX MODAL */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
            onClick={() => setSelectedImage(null)}
          >
            <div 
              className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-white/20 p-2 sm:p-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* CLOSE BUTTON */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>

              {/* MODAL IMAGE */}
              <div className="w-full max-h-[70vh] rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                <img 
                  src={selectedImage.image} 
                  alt={selectedImage.title}
                  className="w-full h-full max-h-[70vh] object-contain"
                />
              </div>

              {/* MODAL CAPTION */}
              <div className="p-4 sm:p-6 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${getBadgeStyle(selectedImage.category)}`}>
                    {selectedImage.badge}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900" style={{ color: theme.primary || '#104288' }}>
                  {selectedImage.title}
                </h3>
                <p className="text-sm font-semibold text-gray-600 mt-1">
                  {selectedImage.subtitle}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
