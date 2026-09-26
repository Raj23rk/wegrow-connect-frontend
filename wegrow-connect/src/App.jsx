import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import FloatingWhatsApp from './components/FloatingWhatsApp';
import WeGrowChatbot from './components/WeGrowChatbot';
import AuthLayout from './components/AuthLayout';
import { workshopsData } from './data/workshopsData';
import { theme } from './theme';
import WhoCanJoinSection from './components/WhoCanJoinSection';
import WhyWeGrowSection from './components/WhyWeGrowSection';
import FinalCTASection from './components/FinalCTASection';

// Lazy load Route Pages for fast initial paint & high PageSpeed score
const LoginScreen = lazy(() => import('./components/LoginScreen'));
const RegisterSelection = lazy(() => import('./components/RegisterSelection'));
const ForgotPasswordScreen = lazy(() => import('./components/ForgotPasswordScreen'));
const SetPasswordScreen = lazy(() => import('./components/SetPasswordScreen'));
const StudentRegister = lazy(() => import('./components/StudentRegister'));
const BusinessRegister = lazy(() => import('./components/BusinessRegister'));
const ProfilePage = lazy(() => import('./components/ProfilePage'));
const EventDetails = lazy(() => import('./components/EventDetails'));
const WomensCommunity = lazy(() => import('./components/WomensCommunity'));
const StudentFoundersCommunity = lazy(() => import('./components/StudentFoundersCommunity'));
const BusinessFoundersCommunity = lazy(() => import('./components/BusinessFoundersCommunity'));
const WomensCommunityV1 = lazy(() => import('./components/WomensCommunityV1'));
const GalleryPage = lazy(() => import('./components/GalleryPage'));

const SingAlongBooking = lazy(() => import('./components/SingAlongBooking'));
const SingAlongSponsorBooking = lazy(() => import('./components/SingAlongSponsorBooking'));
const BusinessDependencyTest = lazy(() => import('./components/BusinessDependencyTest'));
const BusinessConsultancy = lazy(() => import('./components/BusinessConsultancy'));
const WhoCanJoinPage = lazy(() => import('./components/WhoCanJoinPage'));
const EventTeaser = lazy(() => import('./components/EventTeaser'));

// Auth Context, Theme Context and Guard
import { AuthProvider, ProtectedRoute } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Student Portal Sub-pages (Lazy Loaded)
const StudentDashboard = lazy(() => import('./student/dashboard/page'));
const StudentCourses = lazy(() => import('./student/courses/page'));
const StudentCertificates = lazy(() => import('./student/certificates/page'));
const StudentRewards = lazy(() => import('./student/rewards/page'));
const StudentAnalytics = lazy(() => import('./student/analytics/page'));
const StudentWorkshops = lazy(() => import('./student/workshops/page'));
const StudentSubscriptions = lazy(() => import('./student/subscriptions/page'));
const StudentSettings = lazy(() => import('./student/settings/page'));

// Business Portal Sub-pages (Lazy Loaded)
const BusinessDashboard = lazy(() => import('./business/dashboard/page'));
const BusinessAnalytics = lazy(() => import('./business/analytics/page'));
const BusinessCanvas = lazy(() => import('./business/canvas/page'));
const BusinessRoadmap = lazy(() => import('./business/roadmap/page'));
const BusinessWorkshops = lazy(() => import('./business/workshops/page'));
const BusinessLegal = lazy(() => import('./business/legal/page'));
const BusinessSubscriptions = lazy(() => import('./business/subscriptions/page'));
const BusinessSettings = lazy(() => import('./business/settings/page'));

// Admin Portal Sub-pages (Lazy Loaded)
const AdminDashboard = lazy(() => import('./admin/page'));
const AdminCertificates = lazy(() => import('./admin/certificates/page'));
const AdminEvents = lazy(() => import('./admin/events/page'));
const AdminGalleryPage = lazy(() => import('./admin/gallery/page'));
const AdminNotifications = lazy(() => import('./admin/notifications/page'));
const AdminPayments = lazy(() => import('./admin/payments/page'));
const AdminReports = lazy(() => import('./admin/reports/page'));
const AdminRewards = lazy(() => import('./admin/rewards/page'));
const AdminRoles = lazy(() => import('./admin/roles/page'));
const AdminSettings = lazy(() => import('./admin/settings/page'));
const AdminSubscriptions = lazy(() => import('./admin/subscriptions/page'));
const AdminUsers = lazy(() => import('./admin/users/page'));
const AdminWorkshops = lazy(() => import('./admin/workshops/page'));
const AdminWomenEntrepreneurs = lazy(() => import('./admin/women-entrepreneurs/page'));
const AdminStudentFounders = lazy(() => import('./admin/student-founders/page'));
const AdminBusinessFounders = lazy(() => import('./admin/business-founders/page'));

const AdminSingAlong = lazy(() => import('./admin/sing-along/page'));
const AdminBusinessDependencyTest = lazy(() => import('./admin/business-dependency-test/page'));
const AdminEventTeaser = lazy(() => import('./admin/event-teaser/page'));

// Campaign Platform (Public & Admin Lazy Loaded)
const CampaignLanding = lazy(() => import('./components/CampaignLanding'));
const CampaignRegister = lazy(() => import('./components/CampaignRegister'));
const TaskSession = lazy(() => import('./components/TaskSession'));
const AdminCampaigns = lazy(() => import('./admin/campaigns/page'));
const AdminCampaignStudents = lazy(() => import('./admin/students/page'));
const AdminTasks = lazy(() => import('./admin/tasks/page'));
const AdminSubmissions = lazy(() => import('./admin/submissions/page'));

// Lightweight fallback for fast route transitions
const RouteLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0B0F19]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-amber-400/20 border-t-[#ff6a00] rounded-full animate-spin" />
      <span className="text-xs text-amber-200/70 font-mono tracking-wider">LOADING...</span>
    </div>
  </div>
);

// Main Home Component
function MainHomePage() {
  const { isDarkMode } = useTheme();
  const [activeItem, setActiveItem] = useState(workshopsData[0]);
  const [heroTransform, setHeroTransform] = useState({ opacity: 1, transform: 'scale(1) translateY(0%)' });
  
  // Section styles based on order: Hero -> EventSection -> MissionVision -> Courses -> Gallery -> Reward -> Resources -> Seminars -> Visit -> Workshops
  const [whoCanJoinStyle, setWhoCanJoinStyle] = useState({ opacity: 1, transform: 'scale(1)' });
  const [whyWeGrowStyle, setWhyWeGrowStyle] = useState({ opacity: 0, transform: 'scale(0.98)' });
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
  const [ctaStyle, setCtaStyle] = useState({ opacity: 0, transform: 'scale(0.98)' });
  const [contactStyle, setContactStyle] = useState({ opacity: 0, transform: 'scale(0.98)' });
  const [imgOpacity, setImgOpacity] = useState(1);

  const [activeResourceTab, setActiveResourceTab] = useState('blog');

  const scrollContainerRef = useRef(null);
  
  // Target refs in new correct order
  const whoCanJoinTargetRef = useRef(null);
  const whyWeGrowTargetRef = useRef(null);
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
  const ctaTargetRef = useRef(null);
  const contactTargetRef = useRef(null);
  const itemRefs = useRef([]);

  const scrollToHero = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToWhoCanJoin = () => {
    if (whoCanJoinTargetRef.current && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: Math.max(whoCanJoinTargetRef.current.offsetTop - 30, 0),
        behavior: 'smooth'
      });
    }
  };

  const scrollToEventsMain = () => {
    if (whoCanJoinTargetRef.current && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: Math.max(whoCanJoinTargetRef.current.offsetTop - 30, 0),
        behavior: 'smooth'
      });
    } else if (missionVisionTargetRef.current && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: Math.max(missionVisionTargetRef.current.offsetTop - 40, 0),
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

  const scrollToWhyWeGrow = () => {
    if (whyWeGrowTargetRef.current && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: Math.max(whyWeGrowTargetRef.current.offsetTop - 30, 0),
        behavior: 'smooth'
      });
    }
  };

  const scrollToCourses = () => {
    if (eventsTargetRef.current && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: Math.max(eventsTargetRef.current.offsetTop - 40, 0),
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
    if (seminarTargetRef.current && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: Math.max(seminarTargetRef.current.offsetTop - 40, 0),
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

  const scrollToCta = () => {
    if (ctaTargetRef.current && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: Math.max(ctaTargetRef.current.offsetTop - 80, 0),
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
      missionVisionTargetRef.current &&
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
      const whoCanJoinTop = whoCanJoinTargetRef.current ? whoCanJoinTargetRef.current.getBoundingClientRect().top : 9999;
      const missionVisionTop = missionVisionTargetRef.current.getBoundingClientRect().top;
      const whyWeGrowTop = whyWeGrowTargetRef.current ? whyWeGrowTargetRef.current.getBoundingClientRect().top : 9999;
      const galleryTop = galleryTargetRef.current.getBoundingClientRect().top;
      const rewardTop = rewardTargetRef.current.getBoundingClientRect().top;
      const resourceTop = resourceTargetRef.current.getBoundingClientRect().top;
      const seminarTop = seminarTargetRef.current.getBoundingClientRect().top;
      const visitTop = visitTargetRef.current.getBoundingClientRect().top;
      const eventsTop = eventsTargetRef.current.getBoundingClientRect().top;
      const mentorTop = mentorTargetRef.current.getBoundingClientRect().top;
      const enterpricesTop = enterpricesTargetRef.current.getBoundingClientRect().top;
      const storiesTop = storiesTargetRef.current.getBoundingClientRect().top;
      const ctaTop = ctaTargetRef.current ? ctaTargetRef.current.getBoundingClientRect().top : 9999;
      const contactTop = contactTargetRef.current.getBoundingClientRect().top;

      // 1. Who Can Join Animation
      if (whoCanJoinTop <= windowHeight) {
        const wcFadeIn = Math.min(Math.max((windowHeight - whoCanJoinTop) / (windowHeight * 0.4), 0), 1);
        let wcFadeOut = 0;
        if (missionVisionTop < windowHeight * 0.85) {
          wcFadeOut = Math.min(Math.max((windowHeight * 0.85 - missionVisionTop) / (windowHeight * 0.5), 0), 1);
        }
        setWhoCanJoinStyle({
          opacity: Math.max(wcFadeIn - wcFadeOut, 0),
          transform: `scale(${0.98 + (0.02 * wcFadeIn) - (0.03 * wcFadeOut)})`
        });
      } else {
        setWhoCanJoinStyle({ opacity: 0, transform: 'scale(0.98)' });
      }

      // 2. Mission & Vision Animation
      if (missionVisionTop <= windowHeight) {
        const mvFadeIn = Math.min(Math.max((windowHeight - missionVisionTop) / (windowHeight * 0.4), 0), 1);
        let mvFadeOut = 0;
        if (whyWeGrowTop < windowHeight * 0.85) {
          mvFadeOut = Math.min(Math.max((windowHeight * 0.85 - whyWeGrowTop) / (windowHeight * 0.5), 0), 1);
        }
        setMissionVisionStyle({
          opacity: Math.max(mvFadeIn - mvFadeOut, 0),
          transform: `scale(${0.98 + (0.02 * mvFadeIn) - (0.03 * mvFadeOut)})`
        });
      } else {
        setMissionVisionStyle({ opacity: 0, transform: 'scale(0.98)' });
      }

      // 3. Why WeGrow Animation
      if (whyWeGrowTop <= windowHeight) {
        const whyFadeIn = Math.min(Math.max((windowHeight - whyWeGrowTop) / (windowHeight * 0.4), 0), 1);
        let whyFadeOut = 0;
        if (galleryTop < windowHeight * 0.85) {
          whyFadeOut = Math.min(Math.max((windowHeight * 0.85 - galleryTop) / (windowHeight * 0.5), 0), 1);
        }
        setWhyWeGrowStyle({
          opacity: Math.max(whyFadeIn - whyFadeOut, 0),
          transform: `scale(${0.98 + (0.02 * whyFadeIn) - (0.03 * whyFadeOut)})`
        });
      } else {
        setWhyWeGrowStyle({ opacity: 0, transform: 'scale(0.98)' });
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
        if (ctaTop < windowHeight * 0.85) {
          storiesFadeOut = Math.min(Math.max((windowHeight * 0.85 - ctaTop) / (windowHeight * 0.5), 0), 1);
        }
        setStoriesStyle({
          opacity: Math.max(storiesFadeIn - storiesFadeOut, 0),
          transform: `scale(${0.98 + (0.02 * storiesFadeIn) - (0.03 * storiesFadeOut)})`
        });
      } else {
        setStoriesStyle({ opacity: 0, transform: 'scale(0.98)' });
      }

      if (ctaTop <= windowHeight) {
        const ctaFadeIn = Math.min(Math.max((windowHeight - ctaTop) / (windowHeight * 0.4), 0), 1);
        let ctaFadeOut = 0;
        if (contactTop < windowHeight * 0.85) {
          ctaFadeOut = Math.min(Math.max((windowHeight * 0.85 - contactTop) / (windowHeight * 0.5), 0), 1);
        }
        setCtaStyle({
          opacity: Math.max(ctaFadeIn - ctaFadeOut, 0),
          transform: `scale(${0.98 + (0.02 * ctaFadeIn) - (0.03 * ctaFadeOut)})`
        });
      } else {
        setCtaStyle({ opacity: 0, transform: 'scale(0.98)' });
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

  useEffect(() => {
    // Initial scroll position calculation
    handleScroll();
    if (window.location.hash === '#audience' || window.location.hash === '#who-can-join') {
      setTimeout(scrollToWhoCanJoin, 350);
    } else if (window.location.hash === '#why' || window.location.hash === '#what' || window.location.hash === '#why-wegrow') {
      setTimeout(scrollToWhyWeGrow, 350);
    } else if (window.location.hash === '#programmes' || window.location.hash === '#workshops') {
      setTimeout(scrollToCourses, 350);
    } else if (window.location.hash === '#events' || window.location.hash === '#seminars') {
      setTimeout(scrollToEvents, 350);
    } else if (window.location.hash === '#impact' || window.location.hash === '#mentors') {
      setTimeout(scrollToMentors, 350);
    } else if (window.location.hash === '#cta' || window.location.hash === '#final-cta') {
      setTimeout(scrollToCta, 350);
    }
  }, []);

  return (
    <div 
      className="font-['Inter'] overflow-x-hidden overflow-y-hidden h-screen w-full max-w-full relative transition-colors duration-500" 
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
        scrollToWhoCanJoin={scrollToWhoCanJoin}
        scrollToEvents={scrollToEvents} 
        scrollToCourses={scrollToCourses}
        scrollToMissionVision={scrollToMissionVision}
        scrollToWhyWeGrow={scrollToWhyWeGrow}
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
        className="scroll-container relative z-20 w-full max-w-full h-full overflow-y-auto overflow-x-hidden pt-20 sm:pt-24 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* 1. HERO SECTION */}
        <Hero heroTransform={heroTransform} scrollToEvents={scrollToWhoCanJoin} />
        
        {/* ============ WHO CAN JOIN ============ */}
        <WhoCanJoinSection whoCanJoinTargetRef={whoCanJoinTargetRef} whoCanJoinStyle={whoCanJoinStyle} />

        {/* 2. EVENT SECTION (HIDDEN) */}
        {/* <EventSection eventTargetRef={eventTargetRef} eventStyle={eventStyle} /> */}

        {/* 3. MISSION & VISION SECTION */}
        <MissionVisionSection missionVisionTargetRef={missionVisionTargetRef} missionVisionStyle={missionVisionStyle} />

        {/* 4. WHAT IS WEGROW, PHILOSOPHY & WHY WEGROW SECTION */}
        <WhyWeGrowSection whyWeGrowTargetRef={whyWeGrowTargetRef} whyWeGrowStyle={whyWeGrowStyle} />

        {/* 5. COURSES SECTION (HIDDEN) */}
        {/* <CoursesSection coursesTargetRef={coursesTargetRef} coursesStyle={coursesStyle} scrollToContact={scrollToContact} /> */}

        {/* 6. GALLERY SECTION (4 CATEGORIES: WORKSHOP, ACTIVITY, STUDENT, BUSINESS) */}
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
        <FinalCTASection 
          ctaTargetRef={ctaTargetRef} 
          ctaStyle={ctaStyle} 
          scrollToCourses={scrollToCourses}
          scrollToContact={scrollToContact}
        />
        <ContactSection contactTargetRef={contactTargetRef} contactStyle={contactStyle} />

        <Footer 
          scrollToHero={scrollToHero}
          scrollToWhoCanJoin={scrollToWhoCanJoin}
          scrollToEvents={scrollToEvents} 
          scrollToCourses={scrollToCourses}
          scrollToMissionVision={scrollToMissionVision}
          scrollToWhyWeGrow={scrollToWhyWeGrow}
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
          {/* Left-Side Floating WhatsApp Button */}
          <FloatingWhatsApp />

          {/* WeGrow Skill Campus & B-School Search & Answer Chatbot */}
          <WeGrowChatbot />

          <Suspense fallback={<RouteLoader />}>
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
            <Route path="/who-can-join" element={<WhoCanJoinPage />} />
            <Route path="/audience" element={<Navigate to="/who-can-join" replace />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/home/profile" element={<ProfilePage />} />
            {/* Event Details Route (Hidden - redirects to home) */}
            <Route path="/home/events/:eventId" element={<Navigate to="/" replace />} />
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

            {/* Women's Community V1 */}
            <Route path="/womens-community/v1" element={<WomensCommunityV1 />} />
            <Route path="/womens-community-v1" element={<WomensCommunityV1 />} />
            <Route path="/events/womens-community-v1" element={<WomensCommunityV1 />} />
            <Route path="/women-founder-25" element={<WomensCommunityV1 />} />
            <Route path="/women-founders-25" element={<WomensCommunityV1 />} />



            {/* Sing Along Musical Night Event — Ticket Booking */}
            <Route path="/sing-along" element={<SingAlongBooking />} />
            <Route path="/singalong" element={<SingAlongBooking />} />
            <Route path="/events/sing-along" element={<SingAlongBooking />} />
            <Route path="/events/singalong" element={<SingAlongBooking />} />
            <Route path="/book-tickets" element={<SingAlongBooking />} />

            {/* Sing Along Musical Night Event — Sponsors & VIP Passes */}
            <Route path="/sing-along/sponsors" element={<SingAlongSponsorBooking />} />
            <Route path="/singalong/sponsors" element={<SingAlongSponsorBooking />} />
            <Route path="/events/sing-along/sponsors" element={<SingAlongSponsorBooking />} />
            <Route path="/sing-along-sponsors" element={<SingAlongSponsorBooking />} />
            <Route path="/singalong-sponsors" element={<SingAlongSponsorBooking />} />
            <Route path="/sponsors" element={<SingAlongSponsorBooking />} />

            {/* WeGrow Business Dependency Test */}
            <Route path="/business-dependency-test" element={<BusinessDependencyTest />} />
            <Route path="/dependency-test" element={<BusinessDependencyTest />} />
            <Route path="/business/dependency-test" element={<BusinessDependencyTest />} />

            {/* WeGrow Business Consultancy */}
            <Route path="/consultancy" element={<BusinessConsultancy />} />
            <Route path="/business-consultancy" element={<BusinessConsultancy />} />
            <Route path="/business/consultancy" element={<BusinessConsultancy />} />

            {/* Event Teaser Interactive Quiz / Mystery Page */}
            <Route path="/event-teaser" element={<EventTeaser />} />
            <Route path="/eventteaser" element={<EventTeaser />} />
            <Route path="/teaser" element={<EventTeaser />} />
            <Route path="/guess-event" element={<EventTeaser />} />

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

            <Route path="/admin/sing-along" element={<ProtectedRoute allowedRoles={['admin']}><AdminSingAlong /></ProtectedRoute>} />
            <Route path="/admin/singalong" element={<ProtectedRoute allowedRoles={['admin']}><AdminSingAlong /></ProtectedRoute>} />
            <Route path="/admin/business-dependency-test" element={<ProtectedRoute allowedRoles={['admin']}><AdminBusinessDependencyTest /></ProtectedRoute>} />
            <Route path="/admin/dependency-test" element={<ProtectedRoute allowedRoles={['admin']}><AdminBusinessDependencyTest /></ProtectedRoute>} />
            <Route path="/admin/event-teaser" element={<ProtectedRoute allowedRoles={['admin']}><AdminEventTeaser /></ProtectedRoute>} />
            <Route path="/admin/event-teasers" element={<ProtectedRoute allowedRoles={['admin']}><AdminEventTeaser /></ProtectedRoute>} />
            <Route path="/admin/teasers" element={<ProtectedRoute allowedRoles={['admin']}><AdminEventTeaser /></ProtectedRoute>} />
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
          </Suspense>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}