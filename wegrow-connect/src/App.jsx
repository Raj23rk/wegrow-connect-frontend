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

    if (
      eventTargetRef.current &&
      rewardTargetRef.current && 
      resourceTargetRef.current && 
      seminarTargetRef.current && 
      visitTargetRef.current && 
      eventsTargetRef.current && 
      mentorTargetRef.current &&
      enterpricesTargetRef.current &&
      storiesTargetRef.current &&
      contactTargetRef.current
    ) {
      const eventTop = eventTargetRef.current.getBoundingClientRect().top;
      const rewardTop = rewardTargetRef.current.getBoundingClientRect().top;
      const resourceTop = resourceTargetRef.current.getBoundingClientRect().top;
      const seminarTop = seminarTargetRef.current.getBoundingClientRect().top;
      const visitTop = visitTargetRef.current.getBoundingClientRect().top;
      const eventsTop = eventsTargetRef.current.getBoundingClientRect().top;
      const mentorTop = mentorTargetRef.current.getBoundingClientRect().top;
      const enterpricesTop = enterpricesTargetRef.current.getBoundingClientRect().top;
      const storiesTop = storiesTargetRef.current.getBoundingClientRect().top;
      const contactTop = contactTargetRef.current.getBoundingClientRect().top;

      // 1. Event Section Animation
      if (eventTop <= windowHeight) {
        const eventFadeIn = Math.min(Math.max((windowHeight - eventTop) / (windowHeight * 0.4), 0), 1);
        let eventFadeOut = 0;
        if (rewardTop < windowHeight * 0.85) {
          eventFadeOut = Math.min(Math.max((windowHeight * 0.85 - rewardTop) / (windowHeight * 0.5), 0), 1);
        }
        setEventStyle({
          opacity: Math.max(eventFadeIn - eventFadeOut, 0),
          transform: `scale(${0.98 + (0.02 * eventFadeIn) - (0.03 * eventFadeOut)})`
        });
      } else {
        setEventStyle({ opacity: 0, transform: 'scale(0.98)' });
      }

      // 2. Reward Animation
      if (rewardTop <= windowHeight) {
        const rewardFadeIn = Math.min(Math.max((windowHeight - rewardTop) / (windowHeight * 0.4), 0), 1);
        let rewardFadeOut = 0;
        if (resourceTop < windowHeight * 0.85) {
          rewardFadeOut = Math.min(Math.max((windowHeight * 0.85 - resourceTop) / (windowHeight * 0.5), 0), 1);
        }
        setRewardStyle({
          opacity: Math.max(rewardFadeIn - rewardFadeOut, 0),
          transform: `scale(${0.98 + (0.02 * rewardFadeIn) - (0.03 * rewardFadeOut)})`
        });
      } else {
        setRewardStyle({ opacity: 0, transform: 'scale(0.98)' });
      }

      // 3. Resource Animation
      if (resourceTop <= windowHeight) {
        const resourceFadeIn = Math.min(Math.max((windowHeight - resourceTop) / (windowHeight * 0.4), 0), 1);
        let resourceFadeOut = 0;
        if (seminarTop < windowHeight * 0.85) {
          resourceFadeOut = Math.min(Math.max((windowHeight * 0.85 - seminarTop) / (windowHeight * 0.5), 0), 1);
        }
        setResourceStyle({
          opacity: Math.max(resourceFadeIn - resourceFadeOut, 0),
          transform: `scale(${0.98 + (0.02 * resourceFadeIn) - (0.03 * resourceFadeOut)})`
        });
      } else {
        setResourceStyle({ opacity: 0, transform: 'scale(0.98)' });
      }

      // 4. Seminars Animation
      if (seminarTop <= windowHeight) {
        const seminarFadeIn = Math.min(Math.max((windowHeight - seminarTop) / (windowHeight * 0.4), 0), 1);
        let seminarFadeOut = 0;
        if (visitTop < windowHeight * 0.85) {
          seminarFadeOut = Math.min(Math.max((windowHeight * 0.85 - visitTop) / (windowHeight * 0.5), 0), 1);
        }
        setSeminarStyle({
          opacity: Math.max(seminarFadeIn - seminarFadeOut, 0),
          transform: `scale(${0.98 + (0.02 * seminarFadeIn) - (0.03 * seminarFadeOut)})`
        });
      } else {
        setSeminarStyle({ opacity: 0, transform: 'scale(0.98)' });
      }

      // 5. Visit Animation
      if (visitTop <= windowHeight) {
        const visitFadeIn = Math.min(Math.max((windowHeight - visitTop) / (windowHeight * 0.4), 0), 1);
        let visitFadeOut = 0;
        if (eventsTop < windowHeight * 0.85) {
          visitFadeOut = Math.min(Math.max((windowHeight * 0.85 - eventsTop) / (windowHeight * 0.5), 0), 1);
        }
        setVisitStyle({
          opacity: Math.max(visitFadeIn - visitFadeOut, 0),
          transform: `scale(${0.98 + (0.02 * visitFadeIn) - (0.03 * visitFadeOut)})`
        });
      } else {
        setVisitStyle({ opacity: 0, transform: 'scale(0.98)' });
      }

      // 6. Workshops Animation
      if (eventsTop <= windowHeight) {
        const fadeInProgress = Math.min(Math.max((windowHeight - eventsTop) / (windowHeight * 0.45), 0), 1);
        let fadeOutProgress = 0;
        if (mentorTop < windowHeight * 0.85) {
          fadeOutProgress = Math.min(Math.max((windowHeight * 0.85 - mentorTop) / (windowHeight * 0.5), 0), 1);
        }
        setWorkshopStyle({
          opacity: Math.max(fadeInProgress - fadeOutProgress, 0),
          transform: `scale(${Math.max(0.98 + (0.02 * fadeInProgress) - (0.03 * fadeOutProgress), 0.93)}) translateY(${(1 - fadeInProgress) * 20 - (fadeOutProgress * 20)}px)`
        });
      } else {
        setWorkshopStyle({ opacity: 0, transform: 'scale(0.98) translateY(20px)' });
      }

      if (mentorTop <= windowHeight) {
        const mentorFadeIn = Math.min(Math.max((windowHeight - mentorTop) / (windowHeight * 0.4), 0), 1);
        let mentorFadeOut = 0;
        if (enterpricesTop < windowHeight * 0.85) {
          mentorFadeOut = Math.min(Math.max((windowHeight * 0.85 - enterpricesTop) / (windowHeight * 0.5), 0), 1);
        }
        setMentorStyle({
          opacity: Math.max(mentorFadeIn - mentorFadeOut, 0),
          transform: `scale(${0.98 + (0.02 * mentorFadeIn) - (0.03 * mentorFadeOut)})`
        });
      } else {
        setMentorStyle({ opacity: 0, transform: 'scale(0.98)' });
      }

      if (enterpricesTop <= windowHeight) {
        const enterpricesFadeIn = Math.min(Math.max((windowHeight - enterpricesTop) / (windowHeight * 0.4), 0), 1);
        let enterpricesFadeOut = 0;
        if (storiesTop < windowHeight * 0.85) {
          enterpricesFadeOut = Math.min(Math.max((windowHeight * 0.85 - storiesTop) / (windowHeight * 0.5), 0), 1);
        }
        setEnterpricesStyle({
          opacity: Math.max(enterpricesFadeIn - enterpricesFadeOut, 0),
          transform: `scale(${0.98 + (0.02 * enterpricesFadeIn) - (0.03 * enterpricesFadeOut)})`
        });
      } else {
        setEnterpricesStyle({ opacity: 0, transform: 'scale(0.98)' });
      }

      if (storiesTop <= windowHeight) {
        const storiesFadeIn = Math.min(Math.max((windowHeight - storiesTop) / (windowHeight * 0.4), 0), 1);
        let storiesFadeOut = 0;
        if (contactTop < windowHeight * 0.85) {
          storiesFadeOut = Math.min(Math.max((windowHeight * 0.85 - contactTop) / (windowHeight * 0.5), 0), 1);
        }
        setStoriesStyle({
          opacity: Math.max(storiesFadeIn - storiesFadeOut, 0),
          transform: `scale(${0.98 + (0.02 * storiesFadeIn) - (0.03 * storiesFadeOut)})`
        });
      } else {
        setStoriesStyle({ opacity: 0, transform: 'scale(0.98)' });
      }

      if (contactTop <= windowHeight) {
        const contactFadeIn = Math.min(Math.max((windowHeight - contactTop) / (windowHeight * 0.4), 0), 1);
        setContactStyle({
          opacity: contactFadeIn,
          transform: `scale(${0.98 + (0.02 * contactFadeIn)})`
        });
      } else {
        setContactStyle({ opacity: 0, transform: 'scale(0.98)' });
      }
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
    <div className="font-['Inter'] overflow-hidden h-screen w-screen relative" style={{ backgroundColor: theme.bgDark, color: theme.textMain }}>
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
        style={{ clipPath: 'inset(55px 0 0 0)' }}
        className="scroll-container relative z-20 w-full h-full overflow-y-auto pt-14 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
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