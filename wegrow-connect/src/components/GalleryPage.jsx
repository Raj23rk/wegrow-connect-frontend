import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

// Default static gallery photos
export const DEFAULT_GALLERY_ITEMS = [
  {
    id: 1,
    category: 'workshop',
    title: 'Full Stack Live Bootcamp',
    subtitle: 'Hands-on web architecture, API integration & project deployment',
    image: '/Images/fu 1.jpg',
    badge: 'Workshop',
    date: '2026-02-15'
  },
  {
    id: 2,
    category: 'workshop',
    title: 'Practical Coding & Debugging Lab',
    subtitle: 'Students building interactive React applications',
    image: '/Images/fu 2.jpg',
    badge: 'Workshop',
    date: '2026-02-10'
  },
  {
    id: 3,
    category: 'workshop',
    title: 'AI & Machine Learning Practical',
    subtitle: 'Model training, data preprocessing & machine vision demo',
    image: '/Images/ai 1.jpeg',
    badge: 'Workshop',
    date: '2026-01-28'
  },
  {
    id: 4,
    category: 'workshop',
    title: 'Deep Learning & Neural Networks',
    subtitle: 'Hands-on implementation of intelligent algorithms',
    image: '/Images/ai 2.jpeg',
    badge: 'Workshop',
    date: '2026-01-20'
  },
  {
    id: 5,
    category: 'workshop',
    title: 'Digital Marketing & Growth Lab',
    subtitle: 'Campaign optimization, meta ads & analytics tracking',
    image: '/Images/dm 1.jpg',
    badge: 'Workshop',
    date: '2026-01-12'
  },
  {
    id: 6,
    category: 'workshop',
    title: 'SEO & Performance Funnels',
    subtitle: 'Keyword research and practical organic ranking masterclass',
    image: '/Images/dm 2.jpg',
    badge: 'Workshop',
    date: '2026-01-05'
  },
  {
    id: 7,
    category: 'activity',
    title: 'Tech Talk & Industry Keynote',
    subtitle: 'Senior tech leads sharing real-world software architecture advice',
    image: '/Images/tt 1.jpeg',
    badge: 'Activity',
    date: '2025-12-22'
  },
  {
    id: 8,
    category: 'activity',
    title: 'Campus Leadership & Interactive Session',
    subtitle: 'Q&A session with founder mentors & industry veterans',
    image: '/Images/tt 2.jpeg',
    badge: 'Activity',
    date: '2025-12-15'
  },
  {
    id: 9,
    category: 'activity',
    title: 'Annual Technology Symposium',
    subtitle: 'Showcasing student innovation & technical prototypes',
    image: '/seminar/1.png',
    badge: 'Activity',
    date: '2025-11-30'
  },
  {
    id: 10,
    category: 'activity',
    title: 'Business Idea Pitch & Brainstorming',
    subtitle: 'Team debates and creative startup ideation sessions',
    image: '/seminar/2.png',
    badge: 'Activity',
    date: '2025-11-18'
  },
  {
    id: 11,
    category: 'student',
    title: 'Student Project Presentation',
    subtitle: 'Demonstrating web & mobile apps to industry judges',
    image: '/story/1.png',
    badge: 'Student',
    date: '2025-11-02'
  },
  {
    id: 12,
    category: 'business',
    title: 'Corporate Networking & Partnership Meet',
    subtitle: 'Connecting business leaders with campus talent',
    image: '/visit/1.png',
    badge: 'Business',
    date: '2025-10-25'
  }
];

export function getCombinedGalleryItems() {
  try {
    const saved = localStorage.getItem('wegrow_custom_gallery_photos');
    if (saved) {
      const customItems = JSON.parse(saved);
      return [...customItems, ...DEFAULT_GALLERY_ITEMS];
    }
  } catch (e) {
    console.error('Error reading gallery items:', e);
  }
  return DEFAULT_GALLERY_ITEMS;
}

export default function GalleryPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);

  useEffect(() => {
    setGalleryItems(getCombinedGalleryItems());
    // Ensure body & html allow native scrolling on standalone gallery page
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    };
  }, []);

  const filterTabs = [
    { id: 'all', label: 'All Photos', icon: '📸' },
    { id: 'workshop', label: 'Workshops', icon: '🛠️' },
    { id: 'activity', label: 'Activities', icon: '⚡' },
    { id: 'student', label: 'Students', icon: '🎓' },
    { id: 'business', label: 'Business', icon: '🏢' }
  ];

  const filteredItems = galleryItems.filter(item => {
    const matchesFilter = activeFilter === 'all' || item.category === activeFilter;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getBadgeStyle = (cat) => {
    switch (cat) {
      case 'workshop': return 'bg-blue-600 text-white';
      case 'activity': return 'bg-[#f3a812] text-[#104288]';
      case 'student': return 'bg-emerald-600 text-white';
      case 'business': return 'bg-purple-600 text-white';
      default: return 'bg-gray-800 text-white';
    }
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    } else {
      setSelectedImageIndex(filteredItems.length - 1);
    }
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    if (selectedImageIndex < filteredItems.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    } else {
      setSelectedImageIndex(0);
    }
  };

  const currentSelectedImage = selectedImageIndex !== null ? filteredItems[selectedImageIndex] : null;

  return (
    <div className="w-full min-h-screen bg-slate-900 text-white flex flex-col font-sans relative">
      
      {/* NAVBAR */}
      <Navbar 
        scrollToHero={() => navigate('/home')}
        scrollToEvents={() => navigate('/home')} 
        scrollToCourses={() => navigate('/home')}
        scrollToMissionVision={() => navigate('/home')}
        scrollToGallery={() => navigate('/home')}
        scrollToSeminars={() => navigate('/home')} 
        scrollToVisits={() => navigate('/home')} 
        scrollToRewards={() => navigate('/home')}
        scrollToResources={() => navigate('/home')}
        scrollToMentors={() => navigate('/home')}
        scrollToEnterprices={() => navigate('/home')}
        scrollToStories={() => navigate('/home')}
        scrollToContact={() => navigate('/home')}
      />

      <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-grow">
        
        {/* HEADER SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-[#f3a812] text-xs font-black uppercase tracking-widest mb-3">
            <span>🖼️</span> WeGrow Media Showcase
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            WeGrow <span className="text-[#f3a812]">Photo Gallery</span>
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-gray-300 leading-relaxed font-semibold">
            Explore live snapshots from our interactive bootcamps, campus events, industrial visits, 
            and student innovation milestones across all departments.
          </p>

          {/* SEARCH & FILTER CONTROLS */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-800/80 p-4 rounded-3xl border border-slate-700/60 shadow-xl backdrop-blur-md">
            
            {/* FILTER TABS */}
            <div className="flex flex-wrap items-center justify-center gap-2 w-full sm:w-auto">
              {filterTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                    activeFilter === tab.id
                      ? 'bg-[#104288] text-white shadow-md border border-blue-400/30'
                      : 'bg-slate-700/60 hover:bg-slate-700 text-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* SEARCH INPUT */}
            <div className="relative w-full sm:w-64">
              <input 
                type="text"
                placeholder="Search photos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-9 bg-slate-900/90 text-xs font-semibold rounded-full border border-slate-700 text-white placeholder-gray-400 focus:outline-none focus:border-[#f3a812] transition-colors"
              />
              <span className="absolute left-3 top-2.5 text-xs text-gray-400">🔍</span>
            </div>

          </div>

          <div className="mt-4 text-left text-xs font-semibold text-gray-400 flex items-center justify-between px-2">
            <span>Showing <strong className="text-white">{filteredItems.length}</strong> photos</span>
            <button 
              onClick={() => navigate('/home')} 
              className="text-[#f3a812] hover:underline font-bold"
            >
              ← Back to Main Home
            </button>
          </div>
        </div>

        {/* PHOTO GRID */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredItems.map((item, idx) => (
              <div 
                key={item.id || idx}
                onClick={() => setSelectedImageIndex(idx)}
                className="group relative rounded-2xl overflow-hidden bg-slate-800 border border-slate-700/80 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
              >
                {/* IMAGE */}
                <div className="w-full h-48 sm:h-52 overflow-hidden relative bg-slate-950">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800';
                    }}
                  />

                  {/* GRADIENT OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

                  {/* CATEGORY BADGE */}
                  <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md ${getBadgeStyle(item.category)}`}>
                    {item.badge}
                  </span>

                  {/* ZOOM ICON */}
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    🔍
                  </div>

                  {/* CONTENT */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                    <h3 className="font-extrabold text-sm text-white group-hover:text-[#f3a812] transition-colors leading-snug line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-gray-300 mt-1 line-clamp-2 leading-tight">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-800/40 rounded-3xl border border-slate-700/60 p-8">
            <div className="text-4xl mb-3">🖼️</div>
            <h3 className="text-xl font-bold text-white">No photos found</h3>
            <p className="text-xs text-gray-400 mt-1">Try resetting your search query or filter tab.</p>
            <button 
              onClick={() => { setActiveFilter('all'); setSearchQuery(''); }} 
              className="mt-4 px-4 py-2 rounded-full bg-[#104288] text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

      {/* LIGHTBOX MODAL */}
      {currentSelectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedImageIndex(null)}
        >
          <div 
            className="relative max-w-5xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 p-3 sm:p-5 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setSelectedImageIndex(null)}
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer text-sm font-bold border border-white/20"
            >
              ✕
            </button>

            {/* PREV / NEXT BUTTONS */}
            <button
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer text-base font-bold border border-white/20"
            >
              ‹
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer text-base font-bold border border-white/20"
            >
              ›
            </button>

            {/* IMAGE CONTAINER */}
            <div className="w-full max-h-[75vh] rounded-2xl overflow-hidden bg-black flex items-center justify-center relative">
              <img 
                src={currentSelectedImage.image} 
                alt={currentSelectedImage.title}
                className="w-full h-full max-h-[75vh] object-contain"
              />
            </div>

            {/* CAPTION */}
            <div className="p-4 sm:p-5 text-left flex items-start justify-between gap-4">
              <div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${getBadgeStyle(currentSelectedImage.category)}`}>
                  {currentSelectedImage.badge}
                </span>
                <h3 className="text-lg sm:text-2xl font-black text-white mt-2">
                  {currentSelectedImage.title}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-gray-300 mt-1">
                  {currentSelectedImage.subtitle}
                </p>
              </div>
              <div className="text-right shrink-0 text-xs font-bold text-gray-400">
                Photo {selectedImageIndex + 1} of {filteredItems.length}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="w-full shrink-0 mt-auto relative z-20">
        <Footer 
          scrollToHero={() => navigate('/home')}
          scrollToEvents={() => navigate('/home')}
          scrollToCourses={() => navigate('/home')}
          scrollToMissionVision={() => navigate('/home')}
          scrollToGallery={() => navigate('/home')}
          scrollToSeminars={() => navigate('/home')}
          scrollToVisits={() => navigate('/home')}
          scrollToRewards={() => navigate('/home')}
          scrollToResources={() => navigate('/home')}
          scrollToMentors={() => navigate('/home')}
          scrollToEnterprices={() => navigate('/home')}
          scrollToStories={() => navigate('/home')}
          scrollToContact={() => navigate('/home')}
        />
      </div>

    </div>
  );
}
