import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// =========================================================================
// WEGROW SKILL CAMPUS & B-SCHOOL COMPREHENSIVE KNOWLEDGE BASE
// =========================================================================
const KNOWLEDGE_BASE = [
  {
    id: 'about-wegrow',
    keywords: ['about', 'what is wegrow', 'who are you', 'introduction', 'overview', 'overview of wegrow', 'campus', 'institution', 'college'],
    title: 'About WeGrow Skill Campus & B-School',
    response: `**WeGrow Skill Campus & B-School** is a premier practical-learning institute and business incubation hub based in Tamil Nadu (Sivakasi & Srivilliputtur).\n\n• **Skill Campus**: Delivers hands-on, industry-aligned tech, AI, design, and digital marketing programs with dedicated placement assistance.\n• **B-School**: Prepares future entrepreneurs and leaders through real-world business mechanics, startup incubation, financial modeling, and executive coaching.\n• **Business Consultancy**: Led by Founder & MD Thavabalan, providing diagnostic tools like the *Business Dependency Test (BDT)* to help companies scale systematically.`,
    quickActions: [
      { label: 'Explore Courses', query: 'What courses do you offer?' },
      { label: 'B-School & MBA Track', query: 'Tell me about the B-School program' },
      { label: 'Campus Locations', query: 'Where is the campus located?' }
    ]
  },
  {
    id: 'courses-list',
    keywords: ['course', 'courses', 'programs', 'training', 'classes', 'what do you teach', 'syllabus', 'curriculum', 'study', 'tracks'],
    title: 'Skill Campus & B-School Courses',
    response: `We offer industry-accredited, job-ready programs across 3 key disciplines:\n\n💻 **1. Tech & AI Tracks**:\n• *Full Stack Web & Cloud Development* (React, Node.js, Express, MongoDB, REST APIs, Git, Cloud — 16 Weeks)\n• *Python Data Analytics & AI* (Machine Learning, Pandas, Scikit-learn, Neural Networks — 14 Weeks)\n\n📈 **2. Business & Management (B-School)**:\n• *Business Management & Entrepreneurship* (Signature MBA Track: Startup Incubation, Business Model Canvas, Financial Modeling, Pitching — 12 Weeks)\n• *Product Management & Operations Leadership* (12 Weeks)\n\n🎨 **3. Marketing & Design**:\n• *UI/UX Design Mastery* (Figma to Code, Design Systems, UX Research — 12 Weeks)\n• *Digital Marketing & Performance Branding* (SEO, Performance Ads, Funnels, Growth Hacking — 10 Weeks)`,
    quickActions: [
      { label: 'Full Stack Details', query: 'Tell me about Full Stack Web Development' },
      { label: 'MBA Entrepreneurship', query: 'Tell me about the B-School program' },
      { label: 'Course Fees & Duration', query: 'What is the course fee and duration?' }
    ]
  },
  {
    id: 'full-stack',
    keywords: ['full stack', 'web development', 'react', 'node', 'mern', 'coding', 'frontend', 'backend', 'software'],
    title: 'Full Stack Web & Cloud Development',
    response: `💻 **Full Stack Web & Cloud Development** is our flagship tech program:\n\n• **Duration**: 16 Weeks (Offline / Hybrid)\n• **Key Skills**: React.js, Tailwind CSS, Next.js, Node.js, Express.js, MongoDB, RESTful APIs, Git, Cloud Deployment\n• **Real Projects**: Build 4+ production-level capstone projects\n• **Outcomes**: 100% Placement Support, Mock Technical Interviews & Industry Certifications.`,
    quickActions: [
      { label: 'Fees & Enrollment', query: 'How to enroll and what is the fee?' },
      { label: 'Talk to Advisor', query: 'I want to speak with a course counsellor' }
    ]
  },
  {
    id: 'b-school-program',
    keywords: ['b school', 'bschool', 'mba', 'business school', 'entrepreneurship', 'founder program', 'business management', 'startup'],
    title: 'WeGrow B-School & MBA Entrepreneurship Track',
    response: `🏛️ **WeGrow B-School** departs from outdated textbook theory to focus on **Practical Business Mechanics**:\n\n• **Signature Track**: *Business Management & Entrepreneurship* (12 Weeks)\n• **Core Pillars**: Market Validation, Business Model Canvas, Financial Projections, Unit Economics, Capital Acquisition, and Team Leadership.\n• **Incubation**: Direct mentorship from veteran founders and investors.\n• **Target Audience**: Aspiring entrepreneurs, 2nd-generation family business owners, and corporate leaders seeking operational mastery.`,
    quickActions: [
      { label: 'Business Dependency Test', query: 'What is the Business Dependency Test?' },
      { label: 'Admissions Info', query: 'How do I apply for B-School?' }
    ]
  },
  {
    id: 'bdt-consultancy',
    keywords: ['bdt', 'business dependency test', 'consultancy', 'consulting', 'diagnostic', 'icu', 'thavabalan', 'owner dependence', 'scale business'],
    title: 'Business Dependency Test (BDT) & Consultancy',
    response: `🩺 **WeGrow Business Diagnostic & Consultancy**:\n\n• **Business Dependency Test (BDT)**: A 2-minute clinical diagnostic that reveals how heavily your enterprise depends on your personal daily involvement.\n• **5 Vital Diagnosis Areas**: Financial Control & Cashflow, Sales Engine & Pipeline, Leadership & Culture, Org Structure, and Systems & SOPs.\n• **Advisory Team**: Led by **Thavabalan** (Founder & Managing Director, WeGrow).\n• **Take the Test**: You can take the 2-minute diagnostic directly on this portal under **/business-dependency-test**!`,
    quickActions: [
      { label: 'Take 2-Min Test', link: '/business-dependency-test' },
      { label: 'Book Advisory Session', link: '/consultancy' }
    ]
  },
  {
    id: 'fees-scholarship',
    keywords: ['fee', 'fees', 'cost', 'price', 'pricing', 'scholarship', 'discount', 'installments', 'emi'],
    title: 'Fees & Scholarships',
    response: `💰 **Course Fees & Financial Options**:\n\n• **Transparent Pricing**: Course fees vary depending on the track (Technical, Design, or B-School Executive).\n• **Flexible EMI**: 0% interest monthly installment options available for students.\n• **Merit Scholarships**: Up to 30% fee waivers for deserving students, women entrepreneurs, and rural innovators.\n• **Connect with us**: Our program advisors provide exact fee structures and current cohort scholarship grants.`,
    quickActions: [
      { label: 'Get Fee Details on WhatsApp', whatsapp: true },
      { label: 'Contact Advisors', query: 'Give me contact details and address' }
    ]
  },
  {
    id: 'placements',
    keywords: ['placement', 'placements', 'jobs', 'salary', 'hiring', 'companies', 'internship', 'careers'],
    title: 'Placement Assistance & Internships',
    response: `🚀 **Career & Placement Support at WeGrow**:\n\n• **Dedicated Placement Cell**: 50+ corporate hiring partners across IT, SaaS, and Core industries.\n• **Real Internships**: Live project sprints that build an impressive portfolio before graduation.\n• **Interview Prep**: Rigorous resume building, algorithmic problem solving, mock HR & technical rounds.\n• **Alumni Success**: Our alumni work in premier tech agencies, high-growth startups, and established enterprises.`,
    quickActions: [
      { label: 'View All Courses', query: 'What courses do you offer?' },
      { label: 'Talk on WhatsApp', whatsapp: true }
    ]
  },
  {
    id: 'communities',
    keywords: ['community', 'communities', 'women', 'women entrepreneurs', 'student founders', 'networking', 'club'],
    title: 'WeGrow Active Founder Communities',
    response: `🤝 **Join Our Thriving Communities**:\n\n1. **Women's Entrepreneurship Community**: Empowering women founders with funding guidance, mentorship, peer support, and executive meets.\n2. **Student Founders Community**: Helping college students turn innovative ideas into viable, revenue-generating startups.\n3. **Business Founders Network**: Connecting 500+ MSME and enterprise leaders across 20+ sectors for collaborative growth.`,
    quickActions: [
      { label: 'Women Community', link: '/womens-community' },
      { label: 'Student Founders', link: '/student-founders' },
      { label: 'Business Founders', link: '/business-founders' }
    ]
  },
  {
    id: 'location-contact',
    keywords: ['location', 'address', 'where', 'contact', 'phone', 'mobile', 'email', 'sivakasi', 'srivilliputtur', 'call', 'visit'],
    title: 'Campus Locations & Contact Information',
    response: `📍 **WeGrow Skill Campus & B-School**\n\n• **Campus Location**: Sivakasi & Srivilliputtur, Tamil Nadu, India\n• **Phone / WhatsApp**: +91 9363337331 / +91 9344037331\n• **Email**: wegrowskillcampus@gmail.com\n• **Working Hours**: Mon – Sat (9:00 AM – 7:00 PM IST)\n\nYou are always welcome to visit our physical campus for an in-person counselling session and campus tour!`,
    quickActions: [
      { label: 'Chat on WhatsApp', whatsapp: true },
      { label: 'Email Campus', email: 'wegrowskillcampus@gmail.com' }
    ]
  },
  {
    id: 'founder-leadership',
    keywords: ['founder', 'thavabalan', 'director', 'managing director', 'leader', 'leadership', 'team', 'who started'],
    title: 'Leadership & Founder',
    response: `👔 **Led by Thavabalan (Founder & Managing Director, WeGrow)**:\n\n• Renowned business architect, educator, and entrepreneurial mentor who has spent decades on both sides of the table — classroom pedagogy and corporate boardroom strategy.\n• Creator of the *Business Dependency Diagnostic* and mentor to 500+ founders across Tamil Nadu.\n• Committed to transforming regional talent into world-class innovators and independent business leaders.`,
    quickActions: [
      { label: 'Business Consultancy', link: '/consultancy' },
      { label: 'Diagnostic Test', link: '/business-dependency-test' }
    ]
  },
  {
    id: 'events-workshops',
    keywords: ['events', 'event', 'workshop', 'workshops', 'seminar', 'webinar', 'sing along', 'competition', 'sponsors'],
    title: 'Events, Workshops & Cultural Meets',
    response: `🎉 **Events & Industry Workshops**:\n\n• **Sing Along Live Concert**: Mega music festival at Arasan Turf, Sivakasi (Sun, Sep 27, 2026) with VIP & Sponsor passes!\n• **Expert Masterclasses**: Hands-on weekend workshops covering Full Stack, AI Tools, Digital Ads, and Financial Planning.\n• **Founder Roundtables**: Monthly closed-door meetups for startup founders.`,
    quickActions: [
      { label: 'Sponsor Passes Portal', link: '/sing-along/sponsors' },
      { label: 'Chat on WhatsApp', whatsapp: true }
    ]
  }
];

// Default initial suggestions
const POPULAR_QUESTIONS = [
  'What courses do you offer?',
  'Tell me about the B-School program',
  'What is the Business Dependency Test?',
  'Placement & internship support',
  'Campus location & contact details'
];

export default function WeGrowChatbot() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Hide on Sing Along and Sponsor pages
  const isHidden =
    location.pathname.includes('sing-along') ||
    location.pathname.includes('singalong') ||
    location.pathname.includes('sponsors');

  if (isHidden) return null;
  const [messages, setMessages] = useState([
    {
      id: 'welcome-msg',
      sender: 'bot',
      text: `Hello! 👋 I'm **Grow AI**, your virtual guide to **WeGrow Skill Campus & B-School**.\n\nAsk me anything about our **Tech courses**, **MBA Entrepreneurship track**, **Business Dependency Test**, **fees**, **admissions**, or **campus locations**!`,
      quickActions: [
        { label: 'Explore Courses', query: 'What courses do you offer?' },
        { label: 'B-School Program', query: 'Tell me about the B-School program' },
        { label: 'Business Diagnostic (BDT)', query: 'What is the Business Dependency Test?' },
        { label: 'Campus & Contact Info', query: 'Where is the campus located?' }
      ],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  // Search Engine: matches query against Knowledge Base
  const findAnswer = (query) => {
    const cleanQuery = query.toLowerCase().trim();
    if (!cleanQuery) return null;

    const words = cleanQuery.split(/\s+/).filter(w => w.length > 2);

    let bestMatch = null;
    let highestScore = 0;

    KNOWLEDGE_BASE.forEach(item => {
      let score = 0;

      // Exact phrase match in keywords
      item.keywords.forEach(kw => {
        if (cleanQuery.includes(kw)) score += 10;
        if (kw.includes(cleanQuery)) score += 6;
      });

      // Word match in keywords
      words.forEach(w => {
        item.keywords.forEach(kw => {
          if (kw.includes(w)) score += 3;
        });
        if (item.title.toLowerCase().includes(w)) score += 4;
        if (item.response.toLowerCase().includes(w)) score += 1;
      });

      if (score > highestScore) {
        highestScore = score;
        bestMatch = item;
      }
    });

    if (highestScore >= 3 && bestMatch) {
      return bestMatch;
    }

    // Intelligent fallback
    return {
      title: 'WeGrow Knowledge Assistant',
      response: `I searched our **WeGrow Skill Campus & B-School** records for *"&ldquo;${query}&rdquo;"*.\n\nWhile I may not have an exact pre-recorded note on that specific phrasing, here is what I can directly assist you with:\n\n• **Skill Training**: Full Stack Web Development, Python & AI, UI/UX, Digital Marketing\n• **B-School & MBA**: Startup Incubation, Business Strategy, Entrepreneurship Track\n• **Business Diagnosis**: Take the 2-minute Business Dependency Test (BDT)\n• **Admissions & Fees**: Fast-track enrollment, scholarships, and campus visits in Sivakasi\n\nWould you like to connect directly with a senior counsellor?`,
      quickActions: [
        { label: 'View All Courses', query: 'What courses do you offer?' },
        { label: 'Take Dependency Test', link: '/business-dependency-test' },
        { label: 'Talk on WhatsApp', whatsapp: true }
      ]
    };
  };

  const handleSendMessage = (textToSend = null) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    // Add user message
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Search response with slight natural typing pause
    setTimeout(() => {
      const match = findAnswer(text);
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: match.response,
        quickActions: match.quickActions || [],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleActionClick = (action) => {
    if (action.link) {
      window.location.href = action.link;
      return;
    }
    if (action.whatsapp) {
      const defaultMsg = encodeURIComponent('Hi WeGrow Team! I would like to talk to an advisor regarding WeGrow Skill Campus & B-School.');
      window.open(`https://wa.me/919363337331?text=${defaultMsg}`, '_blank');
      return;
    }
    if (action.email) {
      window.open(`mailto:${action.email}?subject=WeGrow%20Campus%20Enquiry`, '_blank');
      return;
    }
    if (action.query) {
      handleSendMessage(action.query);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'bot',
        text: `Conversation reset! How can I help you today regarding **WeGrow Skill Campus & B-School**?`,
        quickActions: [
          { label: 'Explore Courses', query: 'What courses do you offer?' },
          { label: 'B-School Program', query: 'Tell me about the B-School program' },
          { label: 'Campus Locations', query: 'Where is the campus located?' }
        ],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Simple Markdown-style formatter (handles **bold**, *italic*, • bullets, and line breaks)
  const renderFormattedText = (text) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      // Replace **text** with <strong>
      const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g);
      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-bold text-gray-900 dark:text-amber-300">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return <em key={pIdx} className="italic text-gray-800 dark:text-slate-200">{part.slice(1, -1)}</em>;
        }
        return part;
      });

      const isBullet = line.trim().startsWith('•');
      return (
        <p key={idx} className={`leading-relaxed ${isBullet ? 'pl-2 text-xs sm:text-[13px] my-0.5' : 'text-xs sm:text-[13px] my-1'}`}>
          {formattedParts}
        </p>
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* =======================================================
          CHATBOT DIALOG WINDOW
      ======================================================= */}
      {isOpen && (
        <div 
          className="w-[92vw] sm:w-[410px] h-[580px] max-h-[82vh] bg-white dark:bg-[#071328] rounded-3xl shadow-[0_20px_60px_rgba(6,19,37,0.35)] border border-gray-200 dark:border-slate-800 flex flex-col overflow-hidden mb-3.5 animate-fadeIn transition-all duration-300"
          style={{ backdropFilter: 'blur(20px)' }}
        >
          {/* HEADER */}
          <div className="bg-gradient-to-r from-[#104288] via-[#0c336b] to-[#061a38] text-white p-4 flex items-center justify-between shadow-md relative">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="/mascot.webp"
                  alt="Grow Mascot"
                  className="w-10 h-10 rounded-full object-cover bg-white/10 p-0.5 border border-white/20 shadow-sm"
                  onError={(e) => { e.currentTarget.src = '/wegrow-mascot.webp'; }}
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#104288] rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm tracking-wide text-white flex items-center gap-1.5">
                    Grow AI
                    <span className="bg-[#f3a812] text-slate-950 font-black text-[9px] uppercase px-1.5 py-0.2 rounded-sm shadow-xs">
                      Campus
                    </span>
                  </h3>
                </div>
                <p className="text-[11px] text-blue-100/80 font-medium">
                  WeGrow Skill Campus &amp; B-School
                </p>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={resetChat}
                title="Restart Chat"
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Restart chat"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>

              <button
                onClick={() => setIsOpen(false)}
                title="Minimize Chat"
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* CHAT MESSAGES BODY */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#F9FBFE] dark:bg-[#071328] scrollbar-thin">
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
                >
                  <div className={`flex items-start gap-2 max-w-[88%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                    {isBot && (
                      <div className="w-6 h-6 rounded-full bg-[#104288] flex items-center justify-center text-white text-[10px] shrink-0 mt-1 shadow-xs">
                        🌱
                      </div>
                    )}
                    <div
                      className={`p-3.5 rounded-2xl shadow-xs transition-all ${
                        isBot
                          ? 'bg-white dark:bg-[#0f2444] text-gray-800 dark:text-slate-100 border border-gray-100 dark:border-slate-700/60 rounded-tl-sm'
                          : 'bg-gradient-to-r from-[#104288] to-[#1e58a8] text-white rounded-tr-sm shadow-md'
                      }`}
                    >
                      {isBot ? renderFormattedText(msg.text) : <p className="text-xs sm:text-[13px] leading-relaxed">{msg.text}</p>}
                    </div>
                  </div>

                  {/* QUICK ACTION BUTTONS */}
                  {isBot && msg.quickActions && msg.quickActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 ml-8">
                      {msg.quickActions.map((action, aIdx) => (
                        <button
                          key={aIdx}
                          onClick={() => handleActionClick(action)}
                          className="text-[11px] font-bold px-3 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1 bg-blue-50/70 hover:bg-blue-100 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-[#104288] dark:text-blue-300 border-blue-200 dark:border-slate-700 hover:scale-[1.02]"
                        >
                          {action.whatsapp && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          )}
                          <span>{action.label}</span>
                          <span className="text-[10px] opacity-70">➔</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="text-[9px] text-gray-400 dark:text-slate-500 mt-1 px-1">
                    {msg.time}
                  </span>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-6 h-6 rounded-full bg-[#104288] flex items-center justify-center text-white text-[10px]">
                  🌱
                </div>
                <div className="bg-white dark:bg-[#0f2444] border border-gray-100 dark:border-slate-700 px-3 py-2 rounded-2xl rounded-tl-sm flex items-center gap-1 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#104288] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#104288] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#104288] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* POPULAR QUICK SUGGESTIONS SCROLL */}
          <div className="px-3 py-2 bg-white dark:bg-[#08172e] border-t border-gray-100 dark:border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0 pl-1">
              Ask:
            </span>
            {POPULAR_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="text-[11px] font-semibold whitespace-nowrap px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-[#104288] hover:text-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 transition-colors shrink-0 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* INPUT BAR */}
          <div className="p-3 bg-white dark:bg-[#071328] border-t border-gray-100 dark:border-slate-800 flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about courses, B-School, fees, admissions..."
              className="flex-1 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white text-xs sm:text-[13px] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#104288] focus:ring-1 focus:ring-[#104288] transition"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim()}
              className="w-10 h-10 rounded-xl bg-[#104288] hover:bg-[#0a2e61] disabled:opacity-40 disabled:hover:bg-[#104288] text-white flex items-center justify-center transition-all shadow-md cursor-pointer shrink-0"
              aria-label="Send message"
            >
              <svg className="w-4 h-4 translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* =======================================================
          FLOATING LAUNCHER BUTTON
      ======================================================= */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 bg-[#104288] hover:bg-[#0c336b] text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-[0_6px_25px_rgba(16,66,136,0.45)] hover:shadow-[0_10px_35px_rgba(16,66,136,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border-2 border-white/20"
        aria-label="Open WeGrow Skill Campus & B-School AI Chatbot"
      >
        {/* Mascot Avatar */}
        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white/10 shrink-0">
          <img
            src="/mascot.webp"
            alt="Grow Mascot"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => { e.currentTarget.src = '/wegrow-mascot.webp'; }}
          />
          {hasUnread && (
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#f3a812] border-2 border-[#104288] rounded-full animate-ping" />
          )}
        </div>

        {/* Label on desktop */}
        <div className="hidden sm:flex flex-col text-left pr-1">
          <span className="text-[10px] uppercase font-black tracking-wider text-[#FFC862] leading-none">
            Need Help?
          </span>
          <span className="text-xs font-bold leading-tight text-white">
            Ask Grow AI
          </span>
        </div>

        {/* Icon toggle */}
        <div className="w-5 h-5 flex items-center justify-center text-white/90">
          {isOpen ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          )}
        </div>
      </button>
    </div>
  );
}
