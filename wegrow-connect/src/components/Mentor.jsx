import React, { useRef, useEffect, useState } from 'react';
import { theme } from '../theme';

const baseMentors = [
  {
    id: 'm1',
    name: 'Arun Prakash',
    role: 'Lead AI Engineer',
    rating: '4.9',
    reviews: '120+',
    experience: '8+ Yrs Exp',
    bio: 'Specializes in Machine Learning models, Deep Learning architectures, and scaling AI pipelines.',
    skills: ['Python', 'PyTorch', 'System Design'],
    img: '/mentor/s1.jpg'
  },
  {
    id: 'm2',
    name: 'Kavitha Raman',
    role: 'Principal Full Stack Architect',
    rating: '5.0',
    reviews: '98+',
    experience: '10+ Yrs Exp',
    bio: 'Expert in modern Web Development, microservices, and high-performance web systems.',
    skills: ['React', 'Node.js', 'AWS'],
    img: '/mentor/g1.jpg'
  },
  {
    id: 'm3',
    name: 'Siddharth Kumar',
    role: 'Growth Marketing Lead',
    rating: '4.8',
    reviews: '150+',
    experience: '6+ Yrs Exp',
    bio: 'Passionate about data-driven Digital Marketing, growth hacking strategies, and ads.',
    skills: ['SEO', 'Performance Ads', 'Analytics'],
    img: '/mentor/s2.jpg'
  },
  {
    id: 'm4',
    name: 'Priya Sundaram',
    role: 'UI/UX Design Specialist',
    rating: '4.9',
    reviews: '85+',
    experience: '7+ Yrs Exp',
    bio: 'Crafting intuitive digital products, wireframes, and enterprise design systems.',
    skills: ['Figma', 'User Research', 'Prototyping'],
    img: '/mentor/g2.jpg'
  },
  {
    id: 'm5',
    name: 'Rajesh Sharma',
    role: 'Cloud & DevOps Lead',
    rating: '5.0',
    reviews: '210+',
    experience: '12+ Yrs Exp',
    bio: 'Building automated CI/CD deployment pipelines and Kubernetes infrastructure.',
    skills: ['Docker', 'Kubernetes', 'AWS'],
    img: '/mentor/s3.jpg'
  },
  {
    id: 'm6',
    name: 'Ananya Deshmukh',
    role: 'Data Science & Analytics Lead',
    rating: '4.9',
    reviews: '95+',
    experience: '8+ Yrs Exp',
    bio: 'Turning big data into actionable insights and predictive analytical dashboards.',
    skills: ['Pandas', 'SQL', 'Tableau'],
    img: '/mentor/g3.jpg'
  },
  {
    id: 'm7',
    name: 'Karthik Raja',
    role: 'Cybersecurity Analyst',
    rating: '4.8',
    reviews: '110+',
    experience: '9+ Yrs Exp',
    bio: 'Specializing in penetration testing, network security protocols, and ethical hacking.',
    skills: ['Ethical Hacking', 'SIEM', 'Network Sec'],
    img: '/mentor/s4.jpg'
  },
  {
    id: 'm8',
    name: 'Divya Venkatesh',
    role: 'Product Manager',
    rating: '5.0',
    reviews: '130+',
    experience: '7+ Yrs Exp',
    bio: 'Bridging technical engineering execution with high-impact business roadmap development.',
    skills: ['Agile', 'Scrum', 'Product Strategy'],
    img: '/mentor/g4.jpg'
  },
  {
    id: 'm9',
    name: 'Vikram Sethi',
    role: 'Blockchain Developer',
    rating: '4.9',
    reviews: '75+',
    experience: '5+ Yrs Exp',
    bio: 'Architecting Web3 applications, smart contracts, and decentralized finance protocols.',
    skills: ['Solidity', 'Ethereum', 'Web3.js'],
    img: '/mentor/s5.jpg'
  },
  {
    id: 'm10',
    name: 'Meera Nambiar',
    role: 'Mobile App Lead (iOS/Android)',
    rating: '4.9',
    reviews: '160+',
    experience: '9+ Yrs Exp',
    bio: 'Building cross-platform mobile apps with native performance and smooth UI animations.',
    skills: ['Flutter', 'React Native', 'Swift'],
    img: '/mentor/g5.jpg'
  }
];

// Tripled list for infinite loop
const infiniteMentors = [...baseMentors, ...baseMentors, ...baseMentors];

export default function Mentor({ mentorTargetRef, mentorStyle }) {
  const sliderRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const cardWidth = 310; // card width + gap
  const singleSetWidth = cardWidth * baseMentors.length;

  // Custom Smooth Ease-In-Out Smooth Scroll
  const customSmoothScroll = (targetScrollLeft, duration = 1200) => {
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
        // Infinite Loop Reset checking
        if (sliderRef.current.scrollLeft >= singleSetWidth * 2) {
          sliderRef.current.scrollLeft -= singleSetWidth;
        }
      }
    };

    requestAnimationFrame(animation);
  };

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      customSmoothScroll(sliderRef.current.scrollLeft + scrollAmount, 800);
    }
  };

  // Auto-slide
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (sliderRef.current) {
        const target = sliderRef.current.scrollLeft + cardWidth;
        customSmoothScroll(target, 1200);
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [isPaused, cardWidth, singleSetWidth]);

  return (
    <section 
      ref={mentorTargetRef} 
      id="mentors" 
      style={mentorStyle}
      className="relative py-5 sm:py-8 md:py-12 transition-all duration-300 ease-out transform-gpu overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 relative">

        {/* HEADER */}
        <div className="max-w-4xl mx-auto text-center mb-4 sm:mb-6 md:mb-8">
          <span 
            className="text-xs uppercase font-black tracking-[0.2em] block mb-2" 
            style={{ color: theme.orange }}
          >
            WORLD-CLASS GUIDANCE
          </span>
          <h2 
            className="text-2xl sm:text-4xl font-black tracking-tight mb-2 sm:mb-3" 
            style={{ color: theme.primary }}
          >
            Meet Our Mentors & Instructors
          </h2>
          <p 
            className="text-xs sm:text-sm font-medium leading-relaxed max-w-2xl mx-auto" 
            style={{ color: theme.textMuted }}
          >
            Learn directly from top Indian industry veterans and online experts with proven field execution.
          </p>
        </div>

        {/* CAROUSEL WRAPPER */}
        <div 
          className="relative w-full"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >

          {/* LEFT ARROW */}
          <button 
            onClick={() => scroll('left')}
            className="absolute -left-1 md:left-0 top-1/2 -translate-y-1/2 z-50 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-[#104288] hover:text-white hover:border-[#104288] hover:shadow-xl transition-all duration-300 focus:outline-none cursor-pointer group"
            title="Previous"
          >
            <svg 
              className="w-4 h-4 md:w-5 md:h-5 text-gray-600 group-hover:text-white transition-colors" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* RIGHT ARROW */}
          <button 
            onClick={() => scroll('right')}
            className="absolute -right-1 md:right-0 top-1/2 -translate-y-1/2 z-50 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-[#104288] hover:text-white hover:border-[#104288] hover:shadow-xl transition-all duration-300 focus:outline-none cursor-pointer group"
            title="Next"
          >
            <svg 
              className="w-4 h-4 md:w-5 md:h-5 text-gray-600 group-hover:text-white transition-colors" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* FADE EDGES */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 md:w-16 z-40" style={{ background: 'linear-gradient(to right, rgba(244,247,251,1) 0%, rgba(244,247,251,0) 100%)' }} />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 md:w-16 z-40" style={{ background: 'linear-gradient(to left, rgba(244,247,251,1) 0%, rgba(244,247,251,0) 100%)' }} />

          {/* MENTORS SLIDER CONTAINER */}
          <div 
            ref={sliderRef}
            className="flex gap-5 overflow-x-auto pb-3 pt-1 px-10 md:px-14 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {infiniteMentors.map((mentor, index) => (
              <div 
                key={`${mentor.id}-${index}`}
                className="shrink-0 w-[220px] sm:w-[245px] md:w-[260px] group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-[0_2px_14px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
              >
                {/* IMAGE */}
                <div className="w-full h-[140px] sm:h-[165px] md:h-[180px] overflow-hidden relative bg-gray-100">
                  <img 
                    src={mentor.img} 
                    alt={mentor.name} 
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Experience Badge */}
                  <span 
                    className="absolute bottom-2.5 left-2.5 text-[9px] font-bold px-2.5 py-1 rounded-md shadow-md backdrop-blur-sm"
                    style={{ 
                      color: '#ffffff', 
                      backgroundColor: 'rgba(16,66,136,0.88)',
                    }}
                  >
                    ✦ {mentor.experience}
                  </span>
                </div>

                {/* CONTENT */}
                <div className="p-3.5 flex flex-col flex-1">
                  {/* STAR RATING & REVIEWS */}
                  <div className="flex items-center gap-1 mb-1.5">
                    <span className="text-amber-400 text-xs">★</span>
                    <span className="text-xs font-black text-gray-900">{mentor.rating}</span>
                    <span className="text-[10px] font-medium text-gray-400">({mentor.reviews})</span>
                  </div>

                  {/* NAME & ROLE */}
                  <h3 className="text-base font-extrabold text-gray-900 truncate mb-0.5 group-hover:text-[#104288] transition-colors duration-300">
                    {mentor.name}
                  </h3>
                  <p 
                    className="text-[9px] font-bold uppercase tracking-wider truncate mb-1.5"
                    style={{ color: theme.primary }}
                  >
                    {mentor.role}
                  </p>

                  {/* BIO */}
                  <p className="text-xs font-medium text-gray-500 leading-relaxed line-clamp-2 mb-2.5 flex-1">
                    {mentor.bio}
                  </p>

                  {/* SKILLS */}
                  <div className="pt-2 border-t border-gray-100 flex flex-wrap gap-1">
                    {mentor.skills.map((skill, idx) => (
                      <span 
                        key={idx} 
                        className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-gray-50 text-gray-500 border border-gray-100"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}