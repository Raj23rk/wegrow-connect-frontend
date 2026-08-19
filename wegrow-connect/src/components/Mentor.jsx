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

  // Measured from the real rendered card instead of assumed, so this stays
  // accurate whether the card is w-[280px] (mobile) or sm:w-[320px] (desktop)
  // instead of drifting out of sync with the actual layout on mobile.
  const [cardWidth, setCardWidth] = useState(344); // fallback until measured
  const singleSetWidth = cardWidth * baseMentors.length;

  useEffect(() => {
    const measureCardWidth = () => {
      if (sliderRef.current?.children[0]) {
        const firstCard = sliderRef.current.children[0];
        const gapPx = parseFloat(window.getComputedStyle(sliderRef.current).columnGap) || 24;
        setCardWidth(firstCard.offsetWidth + gapPx);
      }
    };
    measureCardWidth();
    window.addEventListener('resize', measureCardWidth);
    return () => window.removeEventListener('resize', measureCardWidth);
  }, []);

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

  // 2.5 SECONDS STEP-BY-STEP ULTRA SMOOTH SLIDE
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (sliderRef.current) {
        const target = sliderRef.current.scrollLeft + cardWidth;
        customSmoothScroll(target, 1200); // 1.2s smooth slide transition time
      }
    }, 2800); // Trigger every 2.8s

    return () => clearInterval(interval);
  }, [isPaused, cardWidth, singleSetWidth]);

  return (
    <section 
      ref={mentorTargetRef} 
      id="mentors" 
      style={mentorStyle}
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
      `}</style>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative">

        {/* HEADER SECTION - REDUCED TOP/BOTTOM MARGIN */}
        <div id="mentor-title" className="max-w-4xl mx-auto text-center space-y-2 mb-6">
          <span className="text-xs uppercase font-black tracking-widest block" style={{ color: theme.orange }}>
            WORLD-CLASS GUIDANCE
          </span>
          <h2 className="text-3xl lg:text-5xl font-extrabold drop-shadow-sm leading-tight" style={{ color: theme.primary }}>
            Meet Our Mentors & Instructors
          </h2>
          <p className="text-sm lg:text-base font-semibold leading-relaxed" style={{ color: theme.textMuted }}>
            Learn directly from top Indian industry veterans and online experts with proven field execution.
          </p>
        </div>

        {/* CAROUSEL WRAPPER WITH PAUSE ON HOVER */}
        <div 
          className="relative w-full"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >

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
              stroke={theme.primary} 
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
              stroke={theme.primary} 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* INFINITE MENTORS SLIDER CONTAINER */}
          <div 
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto pb-4 pt-1 px-4 md:px-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {infiniteMentors.map((mentor, index) => (
              <div 
                key={`${mentor.id}-${index}`}
                className="shrink-0 w-full sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)] xl:w-[calc((100%-4.5rem)/4)] group backdrop-blur-md rounded-3xl overflow-hidden border shadow-xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
              >
                <div>
                  {/* FULL WIDTH FIT IMAGE BOX */}
                  <div className="w-full h-[220px] rounded-2xl overflow-hidden relative mb-4 bg-zinc-900 border border-amber-500/10">
                    <img 
                      src={mentor.img} 
                      alt={mentor.name} 
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <span 
                      className="absolute bottom-2 left-2 text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-md border shadow-md"
                      style={{ color: theme.neutralText, backgroundColor: 'white', borderColor: theme.neutralBorder }}
                    >
                      ✦ {mentor.experience}
                    </span>
                  </div>

                  {/* STAR RATING & REVIEWS */}
                  <div className="flex items-center gap-1.5 mb-2 text-left">
                    <span className="text-amber-400 text-sm">★</span>
                    <span className="text-xs font-black" style={{ color: theme.textBright }}>{mentor.rating}</span>
                    <span className="text-[11px] font-semibold" style={{ color: theme.textMuted }}>({mentor.reviews} reviews)</span>
                  </div>

                  {/* DETAILS */}
                  <div className="text-left space-y-1">
                    <h3 className="text-lg font-extrabold truncate" style={{ color: theme.textBright }}>
                      {mentor.name}
                    </h3>
                    <p className="text-[11px] font-bold uppercase tracking-wider truncate" style={{ color: theme.primary }}>
                      {mentor.role}
                    </p>
                    <p className="text-xs leading-relaxed pt-1.5 line-clamp-2" style={{ color: theme.textMain }}>
                      {mentor.bio}
                    </p>
                  </div>
                </div>

                {/* SKILLS TAGS */}
                <div className="pt-4 border-t mt-4 flex flex-wrap gap-1.5" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  {mentor.skills.map((skill, idx) => (
                    <span 
                      key={idx} 
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                      style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: theme.textMuted }}
                    >
                      #{skill}
                    </span>
                  ))}
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}