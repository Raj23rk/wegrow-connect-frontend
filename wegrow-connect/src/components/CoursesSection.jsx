import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';

export default function CoursesSection({ coursesTargetRef, coursesStyle, scrollToContact }) {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = [
    { id: 'all', label: 'All Courses' },
    { id: 'tech', label: 'Tech & AI' },
    { id: 'business', label: 'Business & Management' },
    { id: 'marketing', label: 'Marketing & Design' }
  ];

  const staticCourses = [
    {
      id: 1,
      category: 'tech',
      title: 'Full Stack Web & Cloud Development',
      badge: 'Bestseller',
      badgeColor: 'bg-blue-600',
      level: 'Beginner to Pro',
      duration: '16 Weeks',
      mode: 'Offline / Hybrid',
      rating: '4.9',
      reviews: '280+',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
      description: 'Master modern frontend & backend architectures using React, Node.js, Express, MongoDB, RESTful APIs, Git, and Cloud deployment.',
      highlights: [
        'React.js, Tailwind CSS & Next.js',
        'Node.js, Express & MongoDB Backend',
        'Authentication, Payment Gateways & APIs',
        'Capstone Projects & Placement Guarantee'
      ],
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    },
    {
      id: 2,
      category: 'business',
      title: 'Business Management & Entrepreneurship',
      badge: 'Signature MBA Track',
      badgeColor: 'bg-amber-600',
      level: 'All Levels',
      duration: '12 Weeks',
      mode: 'Offline / Campus',
      rating: '4.95',
      reviews: '340+',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
      description: 'Practical business mechanics, startup incubation, financial forecasting, operations management, investor pitch decking, and leadership.',
      highlights: [
        'Startup Validation & Business Model Canvas',
        'Financial Projections & Cost Management',
        'Market Research & Brand Positioning',
        'Live Mentorship from Successful Founders'
      ],
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 3,
      category: 'tech',
      title: 'Applied AI, Machine Learning & Data Analytics',
      badge: 'Trending Tech',
      badgeColor: 'bg-indigo-600',
      level: 'Intermediate',
      duration: '12 Weeks',
      mode: 'Hybrid Live',
      rating: '4.88',
      reviews: '190+',
      image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=80',
      description: 'Harness the power of Python, Pandas, Power BI, Machine Learning algorithms, and generative AI models to solve complex business problems.',
      highlights: [
        'Python Programming & Statistical Modeling',
        'Data Visualization with Power BI & Tableau',
        'Predictive Analytics & Scikit-Learn',
        'Hands-on Enterprise Data Case Studies'
      ],
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 4,
      category: 'marketing',
      title: 'Performance Digital Marketing & Growth',
      badge: 'High Demand',
      badgeColor: 'bg-emerald-600',
      level: 'Beginner Friendly',
      duration: '8 Weeks',
      mode: 'Offline / Hybrid',
      rating: '4.92',
      reviews: '410+',
      image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=600&auto=format&fit=crop&q=80',
      description: 'End-to-end growth marketing: SEO strategies, Google & Meta Ads, Social Media Marketing, Content Funnels, Email Automation, and ROI analytics.',
      highlights: [
        'Search Engine Optimization (Technical & On-Page)',
        'Meta Ads Manager & Google Ads Masterclass',
        'Marketing Funnel Strategy & Conversion Optimization',
        'Live Ad Budget Execution on Real Brands'
      ],
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      )
    },
    {
      id: 5,
      category: 'business',
      title: 'Corporate Accounting, GST & Tally Prime',
      badge: 'Job Assured',
      badgeColor: 'bg-cyan-600',
      level: 'Practical',
      duration: '6 Weeks',
      mode: 'Offline Campus',
      rating: '4.85',
      reviews: '230+',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
      description: 'Practical financial accounting, GST filing, TDS/TCS compliance, Payroll management, Auditing basics, and Tally Prime industry workflows.',
      highlights: [
        'Complete Tally Prime Corporate Workflow',
        'Live GST Return Filing (GSTR-1, 3B & 9)',
        'Income Tax, TDS & E-Way Bill Management',
        'Direct Placement in Auditing & SME Firms'
      ],
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 6,
      category: 'marketing',
      title: 'UI/UX Design & Product Experience',
      badge: 'Creative Career',
      badgeColor: 'bg-rose-600',
      level: 'Beginner to Advanced',
      duration: '10 Weeks',
      mode: 'Hybrid Live',
      rating: '4.89',
      reviews: '175+',
      image: 'https://images.unsplash.com/photo-1561070791-26c113006238?w=600&auto=format&fit=crop&q=80',
      description: 'Design captivating web and mobile experiences. Learn Figma, Wireframing, User Research, Design Systems, Interactive Prototyping, and Usability Testing.',
      highlights: [
        'User Psychology, Wireframing & Information Architecture',
        'Advanced Figma, Auto Layout & Interactive Prototypes',
        'Creating Scalable Design Systems & UI Kits',
        'Complete Portfolio Development with Case Studies'
      ],
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      )
    }
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError('');
        const token = sessionStorage.getItem('accessToken');

        const response = await fetch(
          'https://wegrow-connect-backend-1.onrender.com/api/v1/events/all-event?page=1&limit=10',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
          }
        );

        const json = await response.json();

        if (!response.ok) {
          throw new Error(json?.message || 'Failed to fetch courses');
        }

        if (json?.success && Array.isArray(json?.data?.events)) {
          const mapped = json.data.events.map((event, idx) => {
            const typeStr = (event.type || '').toLowerCase();
            const titleLower = (event.title || '').toLowerCase();
            
            // Map category based on type and title
            let category = 'tech';
            if (typeStr.includes('business') || typeStr.includes('management') || titleLower.includes('business') || titleLower.includes('entrepreneurship') || titleLower.includes('accounting') || titleLower.includes('tally')) {
              category = 'business';
            } else if (typeStr.includes('marketing') || typeStr.includes('design') || titleLower.includes('marketing') || titleLower.includes('seo') || titleLower.includes('ads') || titleLower.includes('ui') || titleLower.includes('ux') || titleLower.includes('figma')) {
              category = 'marketing';
            }

            // Highlights
            let highlights = [
              'Interactive Hands-on Workshops',
              'Direct Mentorship from Industry Experts',
              'Practical Placement-Oriented Projects',
              'Official Certificate of Completion'
            ];

            if (category === 'tech') {
              highlights = [
                'Full Stack Web, Cloud & AI Modules',
                'Backend APIs, Databases & Authentication',
                'Real-world Coding & Project Portfolios',
                'Technical Interview & Code Review Prep'
              ];
            } else if (category === 'business') {
              highlights = [
                'Startup Validation & Business Models',
                'Financial Forecasting & Cost Management',
                'Pitch Decking & Investor Presentation',
                'Leadership & Operation Mechanics'
              ];
            } else if (category === 'marketing') {
              highlights = [
                'SEO, SEM, Meta & Google Ads Manager',
                'Brand Positioning & Content Funnels',
                'UI/UX Prototypes & Figma Projects',
                'Live Ad Budget Execution & Analytics'
              ];
            }

            // Icons
            const icon = category === 'tech' ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            ) : category === 'business' ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            );

            return {
              id: event._id || event.id || `api-course-${idx}`,
              category,
              title: event.title,
              badge: event.type || 'Masterclass',
              badgeColor: category === 'tech' ? 'bg-blue-600' : category === 'business' ? 'bg-amber-600' : 'bg-emerald-600',
              level: 'All Levels',
              duration: event.date ? new Date(event.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Flexible',
              mode: event.location || 'Offline / Hybrid',
              rating: '4.9',
              reviews: '120+',
              description: event.description || 'Transform your future with hands-on, action-oriented training led by seasoned industry mentors.',
              highlights,
              icon,
              image: event.image
            };
          });

          setCourses(mapped);
        } else {
          setCourses([]);
        }
      } catch (err) {
        console.error('Course API fetch error:', err);
        setError(err.message || 'Unable to fetch courses.');
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const displayCourses = courses.length > 0 ? courses : staticCourses;

  const filteredCourses = activeCategory === 'all' 
    ? displayCourses 
    : displayCourses.filter(c => c.category === activeCategory);

  // Show only 3 courses in landing page grid
  const visibleCourses = filteredCourses.slice(0, 3);

  const handleShowMoreClick = () => {
    navigate('/student/courses');
  };

  return (
    <section 
      ref={coursesTargetRef} 
      style={coursesStyle}
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
            <span>📚</span>
            <span>Career-Accelerating Programs</span>
          </div>

          <h2 
            className="text-xl sm:text-3xl md:text-5xl font-black tracking-tight"
            style={{ color: theme.primary || '#104288' }}
          >
            Featured <span style={{ color: theme.orange || '#f3a812' }}>Courses & Masterclasses</span>
          </h2>

          <p 
            className="mt-2.5 text-xs sm:text-sm font-semibold max-w-2xl mx-auto leading-relaxed"
            style={{ color: theme.textMuted || '#50637f' }}
          >
            Industry-aligned curriculum curated by experienced practitioners to help you gain in-demand skills, 
            build a standout portfolio, and launch your dream career.
          </p>

          {/* FILTER TABS */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mt-4 sm:mt-6">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-sm font-extrabold transition-all duration-300 shadow-sm cursor-pointer ${
                  activeCategory === cat.id 
                    ? 'text-white scale-105 shadow-md' 
                    : 'bg-white/80 hover:bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                }`}
                style={{
                  backgroundColor: activeCategory === cat.id ? (theme.primary || '#104288') : undefined,
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* LOADING INDICATOR */}
        {loading && courses.length === 0 && (
          <div className="py-14 flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#104288] rounded-full animate-spin" />
            <span className="text-sm font-semibold text-gray-500">Loading courses...</span>
          </div>
        )}

        {/* COURSES GRID */}
        {(!loading || displayCourses.length > 0) && (
          <div className="flex flex-col items-center gap-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-7 w-full">
              {visibleCourses.map(course => (
                <div 
                  key={course.id}
                  className="rounded-3xl border p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group relative overflow-hidden bg-white"
                  style={{ 
                    borderColor: theme.cardBorder || 'rgba(16, 66, 136, 0.15)'
                  }}
                >
                  {/* TOP HEADER */}
                  <div>
                    {/* COURSE IMAGE */}
                    {course.image ? (
                      <div className="relative w-full h-36 sm:h-40 overflow-hidden rounded-2xl mb-4 bg-gray-100">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600";
                          }}
                        />
                        {/* Floating Badge */}
                        <span className={`absolute top-2.5 right-2.5 text-[9px] font-black uppercase tracking-wider text-white px-2.5 py-1 rounded-md shadow-md ${course.badgeColor}`}>
                          {course.badge}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div 
                          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md transform group-hover:scale-105 transition-transform"
                          style={{ backgroundColor: theme.primary || '#104288' }}
                        >
                          {course.icon}
                        </div>

                        <span className={`text-[11px] font-black uppercase tracking-wider text-white px-3 py-1 rounded-full shadow-sm ${course.badgeColor}`}>
                          {course.badge}
                        </span>
                      </div>
                    )}

                    <h3 
                      className="text-xl font-black mb-2 line-clamp-2 leading-snug group-hover:text-blue-900 transition-colors"
                      style={{ color: theme.primary || '#104288' }}
                    >
                      {course.title}
                    </h3>

                    {/* METADATA PILLS */}
                    <div className="flex flex-wrap items-center gap-2 mb-4 text-[11px] font-bold text-gray-600">
                      <span className="px-2.5 py-1 bg-gray-100 rounded-lg flex items-center gap-1">
                        ⏱️ {course.duration}
                      </span>
                      <span className="px-2.5 py-1 bg-gray-100 rounded-lg flex items-center gap-1">
                        📍 {course.mode}
                      </span>
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg flex items-center gap-1">
                        ⭐ {course.rating} ({course.reviews})
                      </span>
                    </div>

                    <p className="text-xs font-semibold leading-relaxed mb-5" style={{ color: theme.textMuted }}>
                      {course.description}
                    </p>

                    {/* CURRICULUM HIGHLIGHTS */}
                    <div className="space-y-2 mb-6 pt-4 border-t border-gray-100">
                      <span className="text-[11px] font-black uppercase tracking-wider text-gray-500 block mb-2">Key Modules Included:</span>
                      {course.highlights.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">✓</span>
                          <span className="text-xs font-semibold text-gray-700 leading-tight">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ACTION BUTTON */}
                  <div className="pt-2">
                    <button
                      onClick={scrollToContact}
                      className="w-full py-3 rounded-full font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer transform hover:scale-[1.02]"
                      style={{
                        backgroundColor: theme.orange || '#f3a812',
                        color: '#ffffff'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme.primary || '#104288';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = theme.orange || '#f3a812';
                      }}
                    >
                      Enroll / Enquire Now →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* SHOW MORE BUTTON */}
            {filteredCourses.length > 3 && (
              <button
                onClick={handleShowMoreClick}
                className="font-black px-8 py-3.5 rounded-full text-sm transition-all duration-300 shadow-lg hover:scale-105 hover:shadow-xl transform focus:outline-none cursor-pointer border border-amber-400/50 flex items-center gap-2"
                style={{
                  backgroundColor: '#f3a812',
                  color: '#104288'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.primary || '#104288';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3a812';
                  e.currentTarget.style.color = '#104288';
                }}
              >
                Show More Courses
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
