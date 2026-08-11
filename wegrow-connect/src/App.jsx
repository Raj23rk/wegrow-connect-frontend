import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Splash from './components/Splash';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import EventSection from './components/EventSection';
import WorkshopSection from './components/WorkshopSection';
import SeminarSection from './components/SeminarSection';
import VisitSection from './components/VisitSection';
import RewardSection from './components/RewardSection';
import ResourceSection from './components/ResourceSection';
import Mentor from './components/Mentor';
import Enterprices from './components/Enterprices';
import SuccessStories from './components/SuccessStories';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import LoginScreen from './components/LoginScreen';
import RegisterSelection from './components/RegisterSelection';
import AuthLayout from './components/AuthLayout';
import { workshopsData } from './data/workshopsData';
import { theme } from './theme';
import StudentRegister from './components/StudentRegister';
import BusinessRegister from './components/BusinessRegister';
import ForgotPasswordScreen from './components/ForgotPasswordScreen';
import SetPasswordScreen from './components/SetPasswordScreen';

// Main Home Component
function MainHomePage() {
  const [activeItem, setActiveItem] = useState(workshopsData[0]);
  const [heroTransform, setHeroTransform] = useState({ opacity: 1, transform: 'scale(1) translateY(0%)' });
  
  // Section styles based on order: Hero -> EventSection -> Reward -> Resources -> Seminars -> Visit -> Workshops
  const [eventStyle, setEventStyle] = useState({ opacity: 0, transform: 'scale(0.98)' });
  const [rewardStyle, setRewardStyle] = useState({ opacity: 0, transform: 'scale(0.98)' });
  const [resourceStyle, setResourceStyle] = useState({ opacity: 0, transform: 'scale(0.98)' });
  const [seminarStyle, setSeminarStyle] = useState({ opacity: 0, transform: 'scale(0.98)' });
  const [visitStyle, setVisitStyle] = useState({ opacity: 0, transform: 'scale(0.98)' });
  const [workshopStyle, setWorkshopStyle] = useState({ opacity: 0, transform: 'scale(0.98) translateY(20px)' });

  const [mentorStyle, setMentorStyle] = useState({ opacity: 0, transform: 'scale(0.98)' });
  const [enterpricesStyle, setEnterpricesStyle] = useState({ opacity: 0, transform: 'scale(0.98)' });
  const [storiesStyle, setStoriesStyle] = useState({ opacity: 0, transform: 'scale(0.98)' });
  const [contactStyle, setContactStyle] = useState({ opacity: 0, transform: 'scale(0.98)' });
  const [imgOpacity, setImgOpacity] = useState(1);

  const [activeResourceTab, setActiveResourceTab] = useState('blog');

  const scrollContainerRef = useRef(null);
  
  // Target refs in new correct order
  const eventTargetRef = useRef(null);
  const rewardTargetRef = useRef(null);
  const resourceTargetRef = useRef(null);
  const seminarTargetRef = useRef(null);
  const visitTargetRef = useRef(null);
  const eventsTargetRef = useRef(null); // Workshops

  const mentorTargetRef = useRef(null);
  const enterpricesTargetRef = useRef(null);
  const storiesTargetRef = useRef(null);
  const contactTargetRef = useRef(null);
  const itemRefs = useRef([]);

  const scrollToHero = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToEventsMain = () => {
    if (eventTargetRef.current && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: Math.max(eventTargetRef.current.offsetTop - 40, 0),
        behavior: 'smooth'
      });
    }
  };

  const scrollToRewards = () => {
    if (rewardTargetRef.current && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: Math.max(rewardTargetRef.current.offsetTop - 80, 0),
        behavior: 'smooth'
      });
    }
  };

  const scrollToResources = (tab = 'blog') => {
    setActiveResourceTab(tab);
    if (resourceTargetRef.current && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: Math.max(resourceTargetRef.current.offsetTop - 40, 0),
        behavior: 'smooth'
      });
    }
  };

  const scrollToSeminars = () => {
    if (seminarTargetRef.current && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: Math.max(seminarTargetRef.current.offsetTop - 80, 0),
        behavior: 'smooth'
      });
    }
  };

  const scrollToVisits = () => {
    if (visitTargetRef.current && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: Math.max(visitTargetRef.current.offsetTop - 80, 0),
        behavior: 'smooth'
      });
    }
  };

  const scrollToEvents = () => {
    if (eventsTargetRef.current && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: Math.max(eventsTargetRef.current.offsetTop - 80, 0),
        behavior: 'smooth'
      });
    }
  };

  const scrollToMentors = () => {
    if (mentorTargetRef.current && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: Math.max(mentorTargetRef.current.offsetTop - 80, 0),
        behavior: 'smooth'
      });
    }
  };

  const scrollToEnterprices = () => {
    if (enterpricesTargetRef.current && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: Math.max(enterpricesTargetRef.current.offsetTop - 80, 0),
        behavior: 'smooth'
      });
    }
  };

  const scrollToStories = () => {
    if (storiesTargetRef.current && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: Math.max(storiesTargetRef.current.offsetTop - 80, 0),
        behavior: 'smooth'
      });
    }
  };

  const scrollToContact = () => {
    if (contactTargetRef.current && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: Math.max(contactTargetRef.current.offsetTop - 80, 0),
        behavior: 'smooth'
      });
    }
  };

  // Keeps --app-vh in sync with the real viewport height (handles mobile
  // browser chrome), and --navbar-height in sync with the ACTUAL rendered
  // navbar element instead of the fixed 56px/64px guess in index.css. A
  // guessed height meant that on some mobile widths the navbar renders
  // taller than assumed, so <main>'s clip-path/top-padding didn't clear
  // it - which is what was cutting into the top of the Mentor section's
  // heading. Measuring it directly makes this correct on every screen.
  useEffect(() => {
    const setAppHeight = () => {
      document.documentElement.style.setProperty('--app-vh', `${window.innerHeight}px`);
    };
    const setNavbarHeight = () => {
      // Was querySelector('nav') - but Navbar.jsx's actual fixed, full-width
      // positioned element is the outer <header> (with its own pt-4 padding
      // above the inner <nav>). Measuring just <nav> missed that 16px of
      // padding, which is exactly what was clipping the top of the Mentor
      // section's heading - <header> is the element that actually occupies
      // visual space at the top of the screen.
      const navEl = document.querySelector('header');
      if (navEl) {
        document.documentElement.style.setProperty('--navbar-height', `${navEl.offsetHeight}px`);
      }
    };

    setAppHeight();
    setNavbarHeight();
    // Re-measure shortly after mount too, in case the logo image or a
    // wrapping nav item shifts the navbar's height after first paint.
    const settleTimeout = setTimeout(setNavbarHeight, 300);

    window.addEventListener('resize', setAppHeight);
    window.addEventListener('resize', setNavbarHeight);
    window.addEventListener('orientationchange', setAppHeight);
    window.addEventListener('orientationchange', setNavbarHeight);
    return () => {
      clearTimeout(settleTimeout);
      window.removeEventListener('resize', setAppHeight);
      window.removeEventListener('resize', setNavbarHeight);
      window.removeEventListener('orientationchange', setAppHeight);
      window.removeEventListener('orientationchange', setNavbarHeight);
    };
  }, []);

  // Fades each section in ONCE the first time it enters the viewport, then
  // leaves it alone - instead of the previous approach, which recalculated
  // opacity/scale/translateY for all 10 sections on every single scroll
  // frame (continuously growing/shrinking as you scrolled past them, even
  // after they'd already been seen). This keeps the same "fade + rise into
  // view" feel on first appearance, at a fraction of the ongoing scroll
  // cost, and reads as calmer since content stops moving once it's visible.
  useEffect(() => {
    const sections = [
      { ref: eventTargetRef, setStyle: setEventStyle },
      { ref: rewardTargetRef, setStyle: setRewardStyle },
      { ref: resourceTargetRef, setStyle: setResourceStyle },
      { ref: seminarTargetRef, setStyle: setSeminarStyle },
      { ref: visitTargetRef, setStyle: setVisitStyle },
      { ref: eventsTargetRef, setStyle: setWorkshopStyle, extraTranslateY: 20 },
      { ref: mentorTargetRef, setStyle: setMentorStyle },
      { ref: enterpricesTargetRef, setStyle: setEnterpricesStyle },
      { ref: storiesTargetRef, setStyle: setStoriesStyle },
      { ref: contactTargetRef, setStyle: setContactStyle }
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const match = sections.find((s) => s.ref.current === entry.target);
          if (!match) return;
          match.setStyle({ opacity: 1, transform: 'scale(1) translateY(0px)' });
          observer.unobserve(entry.target); // seen once - stop watching it
        });
      },
      {
        root: scrollContainerRef.current,
        rootMargin: '0px 0px -10% 0px', // start the reveal slightly before it's fully in view
        threshold: 0.15
      }
    );

    sections.forEach(({ ref }) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const scrollY = scrollContainerRef.current.scrollTop;
    const windowHeight = window.innerHeight;

    if (scrollY <= windowHeight * 1.2) {
      const progress = Math.min(scrollY / windowHeight, 1); 
      setHeroTransform({
        opacity: Math.max(1 - progress * 1.2, 0),
        transform: `scale(${1 - progress * 0.05}) translateY(-${progress * 40}px)`
      });
    }
  };

  const updateActiveCard = (item) => {
    if (activeItem.id === item.id) return;
    setImgOpacity(0);
    setTimeout(() => {
      setActiveItem(item);
      setImgOpacity(1);
    }, 150);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            updateActiveCard(workshopsData[index]);
          }
        });
      },
      {
        root: scrollContainerRef.current,
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0.1
      }
    );

    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [activeItem]);

  return (
    <div className="app-shell font-['Inter'] overflow-hidden relative" style={{ backgroundColor: theme.bgDark, color: theme.textMain }}>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600" 
          alt="Auditorium" 
          className="w-full h-full object-cover object-right opacity-30 brightness-75 contrast-125"
        />
        <div className="absolute inset-0 z-10" style={{ background: theme.bgOverlay }}></div>
      </div>

      <Navbar 
        scrollToHero={scrollToHero}
        scrollToEvents={scrollToEventsMain} 
        scrollToSeminars={scrollToSeminars} 
        scrollToVisits={scrollToVisits} 
        scrollToRewards={scrollToRewards}
        scrollToResources={scrollToResources}
        scrollToMentors={scrollToMentors}
        scrollToEnterprices={scrollToEnterprices}
        scrollToStories={scrollToStories}
        scrollToContact={scrollToContact}
      />

      <main 
        ref={scrollContainerRef} 
        onScroll={handleScroll} 
        style={{ clipPath: 'inset(var(--navbar-height) 0 0 0)', paddingTop: 'var(--navbar-height)' }}
        className="scroll-container relative z-20 w-full overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* 1. HERO SECTION */}
        <Hero heroTransform={heroTransform} scrollToEvents={scrollToEventsMain} />
        
        {/* 2. EVENT SECTION (DYNAMIC API CAROUSEL - PLACED DIRECTLY BELOW HERO) */}
        <EventSection eventTargetRef={eventTargetRef} eventStyle={eventStyle} />

        {/* 3. REWARD SECTION */}
        <RewardSection rewardTargetRef={rewardTargetRef} rewardStyle={rewardStyle} />
        
        {/* 4. RESOURCE SECTION */}
        <ResourceSection resourceTargetRef={resourceTargetRef} resourceStyle={resourceStyle} activeTab={activeResourceTab} setActiveTab={setActiveResourceTab} />
        
        {/* 5. SEMINAR SECTION */}
        <SeminarSection seminarTargetRef={seminarTargetRef} seminarStyle={seminarStyle} />
        
        {/* 6. VISIT SECTION */}
        <VisitSection visitTargetRef={visitTargetRef} visitStyle={visitStyle} />
        
        {/* 7. WORKSHOP SECTION (EXPLORE WORKSHOP) */}
        <WorkshopSection 
          eventsTargetRef={eventsTargetRef}
          activeItem={activeItem}
          imgOpacity={imgOpacity}
          workshopsData={workshopsData}
          itemRefs={itemRefs}
          updateActiveCard={updateActiveCard}
          workshopStyle={workshopStyle}
        />

        <Mentor mentorTargetRef={mentorTargetRef} mentorStyle={mentorStyle} />
        <Enterprices enterpricesTargetRef={enterpricesTargetRef} enterpricesStyle={enterpricesStyle} />
        <SuccessStories storiesTargetRef={storiesTargetRef} storiesStyle={storiesStyle} />
        <ContactSection contactTargetRef={contactTargetRef} contactStyle={contactStyle} />

        <Footer 
          scrollToHero={scrollToHero}
          scrollToEvents={scrollToEventsMain}
          scrollToSeminars={scrollToSeminars}
          scrollToVisits={scrollToVisits}
          scrollToRewards={scrollToRewards}
          scrollToResources={scrollToResources}
          scrollToMentors={scrollToMentors}
          scrollToEnterprices={scrollToEnterprices}
          scrollToStories={scrollToStories}
          scrollToContact={scrollToContact}
        />
      </main>
    </div>
  );
}

// Root App Component wrapped with Router
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/home" element={<MainHomePage />} />
        
        {/* Auth Routes with constant background */}
        <Route path="/home/login" element={<AuthLayout><LoginScreen /></AuthLayout>} />
        <Route path="/login" element={<AuthLayout><LoginScreen /></AuthLayout>} />
        <Route path="/home/login/forgotpassword" element={<AuthLayout><ForgotPasswordScreen /></AuthLayout>} />
        <Route path="/home/login/option" element={<AuthLayout><RegisterSelection /></AuthLayout>} />
        <Route path="/home/login/forgotpassword/setpassword" element={<AuthLayout><SetPasswordScreen /></AuthLayout>} />
        
        {/* Student and Business Registration Routes */}
        <Route path="/home/login/option/student" element={<AuthLayout><StudentRegister /></AuthLayout>} />
        <Route path="/student/register" element={<AuthLayout><StudentRegister /></AuthLayout>} />
        <Route path="/home/login/option/business" element={<AuthLayout><BusinessRegister /></AuthLayout>} />

        <Route path="*" element={<MainHomePage />} />
      </Routes>
    </Router>
  );
}