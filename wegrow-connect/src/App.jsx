import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MissionVisionSection from './components/MissionVisionSection';
import CoursesSection from './components/CoursesSection';
import GallerySection from './components/GallerySection';
import { Toaster } from 'react-hot-toast';
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
import ProfilePage from './components/ProfilePage';
import { workshopsData } from './data/workshopsData';
import { theme } from './theme';
import StudentRegister from './components/StudentRegister';
import BusinessRegister from './components/BusinessRegister';
import ForgotPasswordScreen from './components/ForgotPasswordScreen';
import SetPasswordScreen from './components/SetPasswordScreen';
import EventDetails from "./components/EventDetails";
import WomensCommunity from './components/WomensCommunity';
import StudentFoundersCommunity from './components/StudentFoundersCommunity';
import BusinessFoundersCommunity from './components/BusinessFoundersCommunity';

// Auth Context, Theme Context and Guard
import { AuthProvider, ProtectedRoute } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Student Portal Sub-pages
import StudentDashboard from './student/dashboard/page';
import StudentCourses from './student/courses/page';
import StudentCertificates from './student/certificates/page';
import StudentRewards from './student/rewards/page';
import StudentAnalytics from './student/analytics/page';
import StudentWorkshops from './student/workshops/page';
import StudentSubscriptions from './student/subscriptions/page';
import StudentSettings from './student/settings/page';

// Business Portal Sub-pages
import BusinessDashboard from './business/dashboard/page';
import BusinessAnalytics from './business/analytics/page';
import BusinessCanvas from './business/canvas/page';
import BusinessRoadmap from './business/roadmap/page';
import BusinessWorkshops from './business/workshops/page';
import BusinessLegal from './business/legal/page';
import BusinessSubscriptions from './business/subscriptions/page';
import BusinessSettings from './business/settings/page';

import GalleryPage from './components/GalleryPage';

// Admin Portal Sub-pages
import AdminDashboard from './admin/page';
import AdminCertificates from './admin/certificates/page';
import AdminEvents from './admin/events/page';
import AdminGalleryPage from './admin/gallery/page';
import AdminNotifications from './admin/notifications/page';
import AdminPayments from './admin/payments/page';
import AdminReports from './admin/reports/page';
import AdminRewards from './admin/rewards/page';
import AdminRoles from './admin/roles/page';
import AdminSettings from './admin/settings/page';
import AdminSubscriptions from './admin/subscriptions/page';
import AdminUsers from './admin/users/page';
import AdminWorkshops from './admin/workshops/page';
import AdminWomenEntrepreneurs from './admin/women-entrepreneurs/page';
import AdminStudentFounders from './admin/student-founders/page';
import AdminBusinessFounders from './admin/business-founders/page';

// Campaign Platform (Public)
import CampaignLanding from './components/CampaignLanding';
import CampaignRegister from './components/CampaignRegister';
import TaskSession from './components/TaskSession';

// Campaign Platform (Admin)
import AdminCampaigns from './admin/campaigns/page';
import AdminCampaignStudents from './admin/students/page';
import AdminTasks from './admin/tasks/page';
import AdminSubmissions from './admin/submissions/page';

// Main Home Component
function MainHomePage() {
  const { isDarkMode } = useTheme();
  const [activeItem, setActiveItem] = useState(workshopsData[0]);
  const [heroTransform, setHeroTransform] = useState({ opacity: 1, transform: 'scale(1) translateY(0%)' });
  
  // Section styles based on order: Hero -> EventSection -> MissionVision -> Courses -> Gallery -> Reward -> Resources -> Seminars -> Visit -> Workshops
  const [eventStyle, setEventStyle] = useState({ opacity: 0, transform: 'scale(0.98)' });
  const [missionVisionStyle, setMissionVisionStyle] = useState({ opacity: 0, transform: 'scale(0.98)' });
  const [coursesStyle, setCoursesStyle] = useState({ opacity: 0, transform: 'scale(0.98)' });
  const [galleryStyle, setGalleryStyle] = useState({ opacity: 0, transform: 'scale(0.98)' });
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
  const missionVisionTargetRef = useRef(null);
  const coursesTargetRef = useRef(null);
  const galleryTargetRef = useRef(null);
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

  const scrollToMissionVision = () => {
    if (missionVisionTargetRef.current && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: Math.max(missionVisionTargetRef.current.offsetTop - 40, 0),
        behavior: 'smooth'
      });
    }
  };

  const scrollToCourses = () => {
    if (coursesTargetRef.current && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: Math.max(coursesTargetRef.current.offsetTop - 40, 0),
        behavior: 'smooth'
      });
    }
  };

  const scrollToGallery = () => {
    if (galleryTargetRef.current && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: Math.max(galleryTargetRef.current.offsetTop - 40, 0),
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
      missionVisionTargetRef.current &&
      coursesTargetRef.current &&
      galleryTargetRef.current &&
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
      const missionVisionTop = missionVisionTargetRef.current.getBoundingClientRect().top;
      const coursesTop = coursesTargetRef.current.getBoundingClientRect().top;
      const galleryTop = galleryTargetRef.current.getBoundingClientRect().top;
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
        if (missionVisionTop < windowHeight * 0.85) {
          eventFadeOut = Math.min(Math.max((windowHeight * 0.85 - missionVisionTop) / (windowHeight * 0.5), 0), 1);
        }
        setEventStyle({
          opacity: Math.max(eventFadeIn - eventFadeOut, 0),
          transform: `scale(${0.98 + (0.02 * eventFadeIn) - (0.03 * eventFadeOut)})`
        });
      } else {
        setEventStyle({ opacity: 0, transform: 'scale(0.98)' });
      }

      // 2. Mission & Vision Animation
      if (missionVisionTop <= windowHeight) {
        const mvFadeIn = Math.min(Math.max((windowHeight - missionVisionTop) / (windowHeight * 0.4), 0), 1);
        let mvFadeOut = 0;
        if (coursesTop < windowHeight * 0.85) {
          mvFadeOut = Math.min(Math.max((windowHeight * 0.85 - coursesTop) / (windowHeight * 0.5), 0), 1);
        }
        setMissionVisionStyle({
          opacity: Math.max(mvFadeIn - mvFadeOut, 0),
          transform: `scale(${0.98 + (0.02 * mvFadeIn) - (0.03 * mvFadeOut)})`
        });
      } else {
        setMissionVisionStyle({ opacity: 0, transform: 'scale(0.98)' });
      }

      // 3. Courses Animation
      if (coursesTop <= windowHeight) {
        const cFadeIn = Math.min(Math.max((windowHeight - coursesTop) / (windowHeight * 0.4), 0), 1);
        let cFadeOut = 0;
        if (galleryTop < windowHeight * 0.85) {
          cFadeOut = Math.min(Math.max((windowHeight * 0.85 - galleryTop) / (windowHeight * 0.5), 0), 1);
        }
        setCoursesStyle({
          opacity: Math.max(cFadeIn - cFadeOut, 0),
          transform: `scale(${0.98 + (0.02 * cFadeIn) - (0.03 * cFadeOut)})`
        });
      } else {
        setCoursesStyle({ opacity: 0, transform: 'scale(0.98)' });
      }

      // 4. Gallery Animation
      if (galleryTop <= windowHeight) {
        const gFadeIn = Math.min(Math.max((windowHeight - galleryTop) / (windowHeight * 0.4), 0), 1);
        let gFadeOut = 0;
        if (rewardTop < windowHeight * 0.85) {
          gFadeOut = Math.min(Math.max((windowHeight * 0.85 - rewardTop) / (windowHeight * 0.5), 0), 1);
        }
        setGalleryStyle({
          opacity: Math.max(gFadeIn - gFadeOut, 0),
          transform: `scale(${0.98 + (0.02 * gFadeIn) - (0.03 * gFadeOut)})`
        });
      } else {
        setGalleryStyle({ opacity: 0, transform: 'scale(0.98)' });
      }

      // 5. Reward Animation
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

      // 6. Resource Animation
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

      // 7. Seminars Animation
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

      // 8. Visit Animation
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

      // 9. Workshops Animation
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
    <div 
      className="font-['Inter'] overflow-hidden h-screen w-screen relative transition-colors duration-500" 
      style={{ 
        backgroundColor: isDarkMode ? '#061325' : theme.bgDark, 
        color: isDarkMode ? '#f8fafc' : theme.textMain 
      }}
    >
      <div className="fixed inset-0 z-0 pointer-events-none transition-all duration-500">
        <img 
          src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600" 
          alt="Auditorium" 
          className={`w-full h-full object-cover object-right transition-opacity duration-500 ${
            isDarkMode ? 'opacity-15 brightness-50 contrast-150' : 'opacity-30 brightness-75 contrast-125'
          }`}
        />
        <div 
          className="absolute inset-0 z-10 transition-colors duration-500" 
          style={{ 
            background: isDarkMode 
              ? 'linear-gradient(180deg, rgba(6, 19, 37, 0.96) 0%, rgba(4, 12, 24, 0.98) 100%)' 
              : theme.bgOverlay 
          }}
        ></div>
      </div>

      <Navbar 
        scrollToHero={scrollToHero}
        scrollToEvents={scrollToEventsMain} 
        scrollToCourses={scrollToCourses}
        scrollToMissionVision={scrollToMissionVision}
        scrollToGallery={scrollToGallery}
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
        className="scroll-container relative z-20 w-full h-full overflow-y-auto pt-20 sm:pt-24 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* 1. HERO SECTION */}
        <Hero heroTransform={heroTransform} scrollToEvents={scrollToEventsMain} />
        
        {/* 2. EVENT SECTION (DYNAMIC API CAROUSEL - PLACED DIRECTLY BELOW HERO) */}
        <EventSection eventTargetRef={eventTargetRef} eventStyle={eventStyle} />

        {/* 3. MISSION & VISION SECTION */}
        <MissionVisionSection missionVisionTargetRef={missionVisionTargetRef} missionVisionStyle={missionVisionStyle} />

        {/* 4. COURSES SECTION */}
        <CoursesSection coursesTargetRef={coursesTargetRef} coursesStyle={coursesStyle} scrollToContact={scrollToContact} />

        {/* 5. GALLERY SECTION (4 CATEGORIES: WORKSHOP, ACTIVITY, STUDENT, BUSINESS) */}
        <GallerySection galleryTargetRef={galleryTargetRef} galleryStyle={galleryStyle} />

        {/* 6. REWARD SECTION */}
        <RewardSection rewardTargetRef={rewardTargetRef} rewardStyle={rewardStyle} />
        
        {/* 7. RESOURCE SECTION */}
        <ResourceSection resourceTargetRef={resourceTargetRef} resourceStyle={resourceStyle} activeTab={activeResourceTab} setActiveTab={setActiveResourceTab} />
        
        {/* 8. SEMINAR SECTION */}
        <SeminarSection seminarTargetRef={seminarTargetRef} seminarStyle={seminarStyle} />
        
        {/* 9. VISIT SECTION */}
        <VisitSection visitTargetRef={visitTargetRef} visitStyle={visitStyle} />
        
        {/* 10. WORKSHOP SECTION (EXPLORE WORKSHOP) */}
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
          scrollToCourses={scrollToCourses}
          scrollToMissionVision={scrollToMissionVision}
          scrollToGallery={scrollToGallery}
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
    <ThemeProvider>
      <AuthProvider>
        <Toaster position="top-right" reverseOrder={false} toastOptions={{ duration: 4000 }} />
        <Router>
          <Routes>
            {/* Public Landing & Splash */}
            <Route path="/" element={<Splash />} />
            <Route path="/home" element={<MainHomePage />} />
            
            {/* Auth Routes with constant background */}
            <Route path="/home/login" element={<AuthLayout><LoginScreen /></AuthLayout>} />
            <Route path="/login" element={<AuthLayout><LoginScreen /></AuthLayout>} />
            <Route path="/home/login/forgotpassword" element={<AuthLayout><ForgotPasswordScreen /></AuthLayout>} />
            <Route path="/home/login/option" element={<AuthLayout><RegisterSelection /></AuthLayout>} />
            <Route path="/home/login/forgotpassword/setpassword" element={<AuthLayout><SetPasswordScreen /></AuthLayout>} />
            
            {/* Registration Routes */}
            <Route path="/home/login/option/student" element={<AuthLayout><StudentRegister /></AuthLayout>} />
            <Route path="/student/register" element={<AuthLayout><StudentRegister /></AuthLayout>} />
            <Route path="/home/login/option/business" element={<AuthLayout><BusinessRegister /></AuthLayout>} />
            
            {/* Other Public/Partially Protected Routes */}
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/home/profile" element={<ProfilePage />} />
            <Route path="/home/events/:eventId" element={<EventDetails />} />
            <Route path="/womens-community" element={<WomensCommunity />} />
            <Route path="/events/womens-community" element={<WomensCommunity />} />
            <Route path="/orientation" element={<WomensCommunity />} />

            {/* Student Founders Community */}
            <Route path="/student-founders" element={<StudentFoundersCommunity />} />
            <Route path="/student-community" element={<StudentFoundersCommunity />} />
            <Route path="/events/student-founders" element={<StudentFoundersCommunity />} />

            {/* Business Founders Community */}
            <Route path="/business-founders" element={<BusinessFoundersCommunity />} />
            <Route path="/business-community" element={<BusinessFoundersCommunity />} />
            <Route path="/events/business-founders" element={<BusinessFoundersCommunity />} />
            <Route path="/founders-orientation" element={<BusinessFoundersCommunity />} />

            {/* Student Dashboard Routes (Protected) */}
            <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student/courses" element={<ProtectedRoute allowedRoles={['student']}><StudentCourses /></ProtectedRoute>} />
            <Route path="/student/certificates" element={<ProtectedRoute allowedRoles={['student']}><StudentCertificates /></ProtectedRoute>} />
            <Route path="/student/rewards" element={<ProtectedRoute allowedRoles={['student']}><StudentRewards /></ProtectedRoute>} />
            <Route path="/student/analytics" element={<ProtectedRoute allowedRoles={['student']}><StudentAnalytics /></ProtectedRoute>} />
            <Route path="/student/workshops" element={<ProtectedRoute allowedRoles={['student']}><StudentWorkshops /></ProtectedRoute>} />
            <Route path="/student/subscriptions" element={<ProtectedRoute allowedRoles={['student']}><StudentSubscriptions /></ProtectedRoute>} />
            <Route path="/student/settings" element={<ProtectedRoute allowedRoles={['student']}><StudentSettings /></ProtectedRoute>} />

            {/* Business Dashboard Routes (Protected) */}
            <Route path="/business/dashboard" element={<ProtectedRoute allowedRoles={['business']}><BusinessDashboard /></ProtectedRoute>} />
            <Route path="/business/analytics" element={<ProtectedRoute allowedRoles={['business']}><BusinessAnalytics /></ProtectedRoute>} />
            <Route path="/business/canvas" element={<ProtectedRoute allowedRoles={['business']}><BusinessCanvas /></ProtectedRoute>} />
            <Route path="/business/roadmap" element={<ProtectedRoute allowedRoles={['business']}><BusinessRoadmap /></ProtectedRoute>} />
            <Route path="/business/workshops" element={<ProtectedRoute allowedRoles={['business']}><BusinessWorkshops /></ProtectedRoute>} />
            <Route path="/business/legal" element={<ProtectedRoute allowedRoles={['business']}><BusinessLegal /></ProtectedRoute>} />
            <Route path="/business/subscriptions" element={<ProtectedRoute allowedRoles={['business']}><BusinessSubscriptions /></ProtectedRoute>} />
            <Route path="/business/settings" element={<ProtectedRoute allowedRoles={['business']}><BusinessSettings /></ProtectedRoute>} />

            {/* Admin Dashboard Routes (Protected) */}
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/roles" element={<ProtectedRoute allowedRoles={['admin']}><AdminRoles /></ProtectedRoute>} />
            <Route path="/admin/women-entrepreneurs" element={<ProtectedRoute allowedRoles={['admin']}><AdminWomenEntrepreneurs /></ProtectedRoute>} />
            <Route path="/admin/student-founders" element={<ProtectedRoute allowedRoles={['admin']}><AdminStudentFounders /></ProtectedRoute>} />
            <Route path="/admin/business-founders" element={<ProtectedRoute allowedRoles={['admin']}><AdminBusinessFounders /></ProtectedRoute>} />
            <Route path="/admin/workshops" element={<ProtectedRoute allowedRoles={['admin']}><AdminWorkshops /></ProtectedRoute>} />
            <Route path="/admin/events" element={<ProtectedRoute allowedRoles={['admin']}><AdminEvents /></ProtectedRoute>} />
            <Route path="/admin/gallery" element={<ProtectedRoute allowedRoles={['admin']}><AdminGalleryPage /></ProtectedRoute>} />
            <Route path="/admin/subscriptions" element={<ProtectedRoute allowedRoles={['admin']}><AdminSubscriptions /></ProtectedRoute>} />
            <Route path="/admin/payments" element={<ProtectedRoute allowedRoles={['admin']}><AdminPayments /></ProtectedRoute>} />
            <Route path="/admin/certificates" element={<ProtectedRoute allowedRoles={['admin']}><AdminCertificates /></ProtectedRoute>} />
            <Route path="/admin/rewards" element={<ProtectedRoute allowedRoles={['admin']}><AdminRewards /></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><AdminReports /></ProtectedRoute>} />
            <Route path="/admin/notifications" element={<ProtectedRoute allowedRoles={['admin']}><AdminNotifications /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><AdminSettings /></ProtectedRoute>} />

            {/* Campaign Platform — Public */}
            <Route path="/campaign/:campaignId" element={<CampaignLanding />} />
            <Route path="/campaign/:campaignId/register" element={<CampaignRegister />} />
            <Route path="/task" element={<TaskSession />} />

            {/* Campaign Platform — Admin (Protected) */}
            <Route path="/admin/campaigns" element={<ProtectedRoute allowedRoles={['admin']}><AdminCampaigns /></ProtectedRoute>} />
            <Route path="/admin/students" element={<ProtectedRoute allowedRoles={['admin']}><AdminCampaignStudents /></ProtectedRoute>} />
            <Route path="/admin/tasks" element={<ProtectedRoute allowedRoles={['admin']}><AdminTasks /></ProtectedRoute>} />
            <Route path="/admin/submissions" element={<ProtectedRoute allowedRoles={['admin']}><AdminSubmissions /></ProtectedRoute>} />

            {/* Catch all redirecting to home */}
            <Route path="*" element={<MainHomePage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}