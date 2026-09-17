import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const QUESTIONS = [
  "Sales and new customer acquisition happen without my direct involvement.",
  "Day-to-day operations run smoothly even when I'm not around.",
  "My team makes key decisions without waiting for my approval.",
  "Financial tracking and cash flow are managed without me checking daily.",
  "Customer relationships aren't solely dependent on me personally.",
  "We have documented processes (SOPs) for our core tasks.",
  "My team can hire, train and manage new people without my hands-on involvement.",
  "I could take a 2-week vacation with zero client or team disruption."
];

const SCALE_LABELS = [
  { n: 1, l: "Never" },
  { n: 2, l: "Rarely" },
  { n: 3, l: "Sometimes" },
  { n: 4, l: "Mostly" },
  { n: 5, l: "Always" }
];

const BANDS = [
  {
    min: 75,
    max: 100,
    key: "green",
    name: "Self-Running Business",
    explain: "Your business runs on systems and people, not on you. Keep reinforcing what's working and plan your next stage of growth."
  },
  {
    min: 50,
    max: 74,
    key: "amber",
    name: "Partially Systemized",
    explain: "Good foundations exist, but a few critical functions still route through you. Closing those gaps will free up real time."
  },
  {
    min: 25,
    max: 49,
    key: "burnt",
    name: "Heavily Dependent",
    explain: "Most of the business still runs through you day to day. Without a plan to delegate, growth will keep costing you personally."
  },
  {
    min: 0,
    max: 24,
    key: "red",
    name: "100% Owner Dependent",
    explain: "Right now, the business is you. Nothing moves without your direct involvement — the highest-risk position an owner can be in."
  }
];

const BAND_STYLES = {
  green: { bg: "#E7F5EE", fg: "#1E8A5F", arc: "#1E8A5F" },
  amber: { bg: "#FBF1DA", fg: "#B9820A", arc: "#B9820A" },
  burnt: { bg: "#FBEADC", fg: "#C1541B", arc: "#C1541B" },
  red:   { bg: "#FBE7E5", fg: "#C63B32", arc: "#C63B32" }
};

export default function BusinessDependencyTest() {
  // Screen: 'open' | 'test' | 'result' | 'lead' | 'thanks'
  const [screen, setScreen] = useState('open');

  // Screen 1: Open info
  const [openInfo, setOpenInfo] = useState({ name: '', business: '', phone: '' });
  const [openErrors, setOpenErrors] = useState({});

  // Screen 2: Test answers
  const [answers, setAnswers] = useState(new Array(QUESTIONS.length).fill(null));

  // Screen 3: Result state
  const [resultState, setResultState] = useState({ score: 0, band: BANDS[3] });
  const [arcOffset, setArcOffset] = useState(402.1);

  // Screen 4: Lead form
  const [leadVals, setLeadVals] = useState({
    name: '',
    company: '',
    designation: '',
    industry: '',
    phone: '',
    email: '',
    size: '',
    challengeSelect: '',
    challengeNote: ''
  });
  const [leadErrors, setLeadErrors] = useState({});

  // Admin panel state
  const [adminOpen, setAdminOpen] = useState(false);
  const [submissions, setSubmissions] = useState([]);

  // Scroll to top on screen change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [screen]);

  // Gauge animation when result screen opens
  useEffect(() => {
    if (screen === 'result') {
      const circumference = 2 * Math.PI * 64;
      const targetOffset = circumference * (1 - resultState.score / 100);
      setArcOffset(circumference);
      const timer = setTimeout(() => {
        setArcOffset(targetOffset);
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [screen, resultState.score]);

  // Load submissions for admin panel
  const loadSubmissions = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('wegrow_bdt_submissions') || '[]');
      if (Array.isArray(stored)) {
        setSubmissions(stored);
      }
    } catch (e) {
      console.error("Failed to load submissions:", e);
    }
  };

  const isPhone = (v) => /^[\d\s\-\+\(\)]{7,15}$/.test((v || '').trim());
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || '').trim());

  // Screen 1: Start Test Handler
  const handleStartTest = () => {
    const errs = {};
    if (!openInfo.name || openInfo.name.trim().length <= 1) {
      errs.name = "Enter your name to continue.";
    }
    if (!openInfo.business || openInfo.business.trim().length <= 1) {
      errs.business = "Enter your business name.";
    }
    if (!isPhone(openInfo.phone)) {
      errs.phone = "Enter a valid phone number.";
    }

    setOpenErrors(errs);
    if (Object.keys(errs).length === 0) {
      setScreen('test');
    }
  };

  // Screen 2: Select answer
  const handleSelectAnswer = (qIndex, val) => {
    const updated = [...answers];
    updated[qIndex] = val;
    setAnswers(updated);
  };

  // Screen 2: Submit test & compute score
  const handleSubmitTest = () => {
    if (answers.some(a => a === null)) return;
    const sum = answers.reduce((a, b) => a + b, 0);
    const min = QUESTIONS.length * 1;
    const max = QUESTIONS.length * 5;
    const score = Math.round(((sum - min) / (max - min)) * 100);
    const band = BANDS.find(b => score >= b.min && score <= b.max) || BANDS[BANDS.length - 1];

    setResultState({ score, band });
    setScreen('result');
  };

  // Screen 3: Go to Lead Form
  const handleGoLead = () => {
    setLeadVals(prev => ({
      ...prev,
      name: openInfo.name,
      company: openInfo.business,
      phone: openInfo.phone
    }));
    setScreen('lead');
  };

  // Screen 4: Submit Diagnostic Request
  const handleSubmitLead = () => {
    const errs = {};
    if (!leadVals.name || leadVals.name.trim().length <= 1) errs.name = "Enter your name.";
    if (!leadVals.company || leadVals.company.trim().length <= 1) errs.company = "Enter your company name.";
    if (!leadVals.designation || leadVals.designation.trim().length <= 1) errs.designation = "Enter your designation.";
    if (!leadVals.industry) errs.industry = "Select your industry.";
    if (!isPhone(leadVals.phone)) errs.phone = "Enter a valid phone number.";
    if (!isEmail(leadVals.email)) errs.email = "Enter a valid email.";
    if (!leadVals.size) errs.size = "Select your business size.";
    if (!leadVals.challengeSelect) errs.challengeSelect = "Select your biggest challenge.";

    setLeadErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const submission = {
      id: "bdt_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      submittedAt: new Date().toISOString(),
      ...leadVals,
      score: resultState.score,
      category: resultState.band.name,
      originalTestName: openInfo.name,
      originalBusiness: openInfo.business
    };

    // Save to localStorage
    try {
      const stored = JSON.parse(localStorage.getItem('wegrow_bdt_submissions') || '[]');
      stored.unshift(submission);
      localStorage.setItem('wegrow_bdt_submissions', JSON.stringify(stored));
      // Also save individual key for backward-compatibility
      localStorage.setItem(`submission:${Date.now()}`, JSON.stringify(submission));
    } catch (e) {
      console.error("Storage write error:", e);
    }

    setScreen('thanks');
  };

  // Reset entire test
  const handleResetAll = () => {
    setOpenInfo({ name: '', business: '', phone: '' });
    setOpenErrors({});
    setAnswers(new Array(QUESTIONS.length).fill(null));
    setResultState({ score: 0, band: BANDS[3] });
    setLeadVals({
      name: '',
      company: '',
      designation: '',
      industry: '',
      phone: '',
      email: '',
      size: '',
      challengeSelect: '',
      challengeNote: ''
    });
    setLeadErrors({});
    setScreen('open');
  };

  // Toggle admin panel
  const handleToggleAdmin = () => {
    const next = !adminOpen;
    setAdminOpen(next);
    if (next) {
      loadSubmissions();
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (submissions.length === 0) return;
    const headers = ["Date", "Name", "Company", "Designation", "Industry", "Phone", "Email", "Size", "Challenge", "Score", "Category"];
    const rows = submissions.map(s => [
      s.submittedAt ? new Date(s.submittedAt).toLocaleString() : '',
      `"${(s.name || '').replace(/"/g, '""')}"`,
      `"${(s.company || '').replace(/"/g, '""')}"`,
      `"${(s.designation || '').replace(/"/g, '""')}"`,
      `"${(s.industry || '').replace(/"/g, '""')}"`,
      `"${(s.phone || '').replace(/"/g, '""')}"`,
      `"${(s.email || '').replace(/"/g, '""')}"`,
      `"${(s.size || '').replace(/"/g, '""')}"`,
      `"${(s.challengeSelect || '').replace(/"/g, '""')}"`,
      s.score,
      `"${(s.category || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `wegrow_bdt_submissions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const answeredCount = answers.filter(a => a !== null).length;
  const currentBandStyle = BAND_STYLES[resultState.band.key] || BAND_STYLES.red;
  const circumference = 2 * Math.PI * 64;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(1100px 500px at 15% -10%, #223a9c 0%, transparent 55%), radial-gradient(900px 500px at 100% 0%, #0f1730 0%, transparent 60%), #131C3A',
      color: '#161B2E',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '28px 16px 60px',
      fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      {/* Brand Bar */}
      <div style={{
        width: '100%',
        maxWidth: '640px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '18px'
      }}>
        <Link to="/home" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }} title="Return to WeGrow Home">
          <img 
            src="/bdt_logo.png" 
            alt="WeGrow Skill Campus and B School" 
            style={{ height: '46px', display: 'block', objectFit: 'contain' }}
            onError={(e) => { e.currentTarget.src = '/wegrow-logo.webp'; }}
          />
        </Link>
        <div style={{
          fontSize: '12.5px',
          color: '#C9D2F5',
          fontWeight: 500,
          letterSpacing: '.01em',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>Business Dependency Test</span>
          <Link to="/home" style={{ color: '#F07E1B', textDecoration: 'none', fontWeight: 600, fontSize: '11px', background: 'rgba(240, 126, 27, 0.12)', padding: '4px 9px', borderRadius: '12px' }}>
            ← Home
          </Link>
        </div>
      </div>

      {/* Main Shell Card */}
      <div style={{
        width: '100%',
        maxWidth: '640px',
        background: '#FBF9F5',
        borderRadius: '10px',
        border: '1px solid #E7E2D6',
        boxShadow: '0 30px 60px -25px rgba(6,10,30,0.55)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Accent Top Bar */}
        <div style={{
          height: '5px',
          background: 'linear-gradient(90deg, #F07E1B, #233A8C)'
        }} />

        {/* SCREEN 1: OPENING */}
        {screen === 'open' && (
          <div style={{ padding: '36px 32px 30px' }} className="animate-fadeIn">
            <div style={{
              display: 'inline-block',
              fontSize: '12.5px',
              fontWeight: 600,
              color: '#1B2A6E',
              background: '#FDF0E2',
              border: '1px solid #F3D3AC',
              padding: '4px 12px',
              borderRadius: '100px',
              marginBottom: '14px'
            }}>
              Free 2-minute test
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginBottom: '8px'
            }}>
              <img 
                src="/bdt_mascot.webp" 
                alt="WeGrow mascot" 
                style={{ width: '110px', flex: 'none', marginTop: '-12px', objectFit: 'contain' }}
                onError={(e) => { e.currentTarget.src = '/we_mascot.jpeg'; }}
              />
              <h1 style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: '27px',
                lineHeight: 1.22,
                color: '#131C3A',
                fontWeight: 700,
                margin: 0
              }}>
                Can your business run <span style={{ color: '#D9661A' }}>without you?</span>
              </h1>
            </div>

            <p style={{
              fontSize: '15px',
              color: '#4B5170',
              lineHeight: 1.55,
              margin: '14px 0 26px',
              maxWidth: '52ch'
            }}>
              Answer 8 quick questions about how your business runs today. We'll calculate your Business Independence Score and show you exactly where the business still leans on you.
            </p>

            {/* Input Name */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#131C3A', marginBottom: '6px' }}>
                Your name
              </label>
              <input 
                type="text" 
                value={openInfo.name}
                onChange={(e) => setOpenInfo({ ...openInfo, name: e.target.value })}
                placeholder="e.g. Arjun Mehta"
                style={{
                  width: '100%',
                  fontSize: '15px',
                  padding: '12px 14px',
                  borderRadius: '7px',
                  border: `1.5px solid ${openErrors.name ? '#C63B32' : '#D7D0C0'}`,
                  background: '#FFFFFF',
                  color: '#161B2E',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              {openErrors.name && (
                <div style={{ fontSize: '12.5px', color: '#C63B32', marginTop: '5px', fontWeight: 500 }}>
                  {openErrors.name}
                </div>
              )}
            </div>

            {/* Input Business */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#131C3A', marginBottom: '6px' }}>
                Business name
              </label>
              <input 
                type="text" 
                value={openInfo.business}
                onChange={(e) => setOpenInfo({ ...openInfo, business: e.target.value })}
                placeholder="e.g. Mehta Interiors"
                style={{
                  width: '100%',
                  fontSize: '15px',
                  padding: '12px 14px',
                  borderRadius: '7px',
                  border: `1.5px solid ${openErrors.business ? '#C63B32' : '#D7D0C0'}`,
                  background: '#FFFFFF',
                  color: '#161B2E',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              {openErrors.business && (
                <div style={{ fontSize: '12.5px', color: '#C63B32', marginTop: '5px', fontWeight: 500 }}>
                  {openErrors.business}
                </div>
              )}
            </div>

            {/* Input Phone */}
            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#131C3A', marginBottom: '6px' }}>
                Phone number
              </label>
              <input 
                type="tel" 
                value={openInfo.phone}
                onChange={(e) => setOpenInfo({ ...openInfo, phone: e.target.value })}
                placeholder="e.g. 98765 43210"
                style={{
                  width: '100%',
                  fontSize: '15px',
                  padding: '12px 14px',
                  borderRadius: '7px',
                  border: `1.5px solid ${openErrors.phone ? '#C63B32' : '#D7D0C0'}`,
                  background: '#FFFFFF',
                  color: '#161B2E',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              {openErrors.phone && (
                <div style={{ fontSize: '12.5px', color: '#C63B32', marginTop: '5px', fontWeight: 500 }}>
                  {openErrors.phone}
                </div>
              )}
            </div>

            {/* Start Button */}
            <button 
              type="button"
              onClick={handleStartTest}
              style={{
                width: '100%',
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Sora', sans-serif",
                fontWeight: 700,
                fontSize: '15.5px',
                padding: '14px 22px',
                borderRadius: '8px',
                background: '#F07E1B',
                color: '#FFFFFF',
                letterSpacing: '.01em',
                transition: 'background .15s ease, transform .1s ease',
                boxShadow: '0 4px 12px rgba(240, 126, 27, 0.28)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#D9661A'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#F07E1B'}
            >
              Start the test →
            </button>
            <p style={{ fontSize: '12px', color: '#9A93A0', textAlign: 'center', marginTop: '14px', marginBottom: 0 }}>
              Takes about 2 minutes · No spam, ever
            </p>
          </div>
        )}

        {/* SCREEN 2: TEST QUESTIONS */}
        {screen === 'test' && (
          <div style={{ padding: '36px 32px 30px' }} className="animate-fadeIn">
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '4px' }}>
              <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: '21px', color: '#131C3A', margin: 0 }}>
                The 8 questions
              </h2>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#4B5170', whiteSpace: 'nowrap' }}>
                {answeredCount} / {QUESTIONS.length} answered
              </div>
            </div>

            {/* Progress track */}
            <div style={{ display: 'flex', gap: '5px', margin: '14px 0 24px' }}>
              {answers.map((ans, idx) => (
                <div 
                  key={idx}
                  style={{
                    flex: 1,
                    height: '5px',
                    borderRadius: '4px',
                    background: ans !== null ? '#F07E1B' : '#E7E2D6',
                    transition: 'background .2s ease'
                  }}
                />
              ))}
            </div>

            {/* Questions List */}
            <div>
              {QUESTIONS.map((qtext, qIndex) => {
                const isFirst = qIndex === 0;
                return (
                  <div 
                    key={qIndex}
                    style={{
                      padding: '18px 0',
                      borderTop: isFirst ? 'none' : '1px solid #E7E2D6',
                      paddingTop: isFirst ? '2px' : '18px'
                    }}
                  >
                    <p style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      color: '#131C3A',
                      margin: '0 0 12px',
                      lineHeight: 1.4
                    }}>
                      {qIndex + 1}. {qtext}
                    </p>

                    <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
                      {SCALE_LABELS.map(opt => {
                        const isSelected = answers[qIndex] === opt.n;
                        return (
                          <button
                            key={opt.n}
                            type="button"
                            onClick={() => handleSelectAnswer(qIndex, opt.n)}
                            style={{
                              flex: '1 1 18%',
                              minWidth: '55px',
                              border: `1.5px solid ${isSelected ? '#1B2A6E' : '#D7D0C0'}`,
                              background: isSelected ? '#1B2A6E' : '#FFFFFF',
                              color: isSelected ? '#FFFFFF' : '#161B2E',
                              borderRadius: '7px',
                              padding: '10px 4px 9px',
                              cursor: 'pointer',
                              textAlign: 'center',
                              transition: 'all .12s ease'
                            }}
                          >
                            <span style={{
                              display: 'block',
                              fontFamily: "'Sora', sans-serif",
                              fontWeight: 700,
                              fontSize: '15px',
                              color: isSelected ? '#FFFFFF' : '#131C3A'
                            }}>
                              {opt.n}
                            </span>
                            <span style={{
                              display: 'block',
                              fontSize: '10px',
                              color: isSelected ? '#C9D2F5' : '#4B5170',
                              marginTop: '2px',
                              lineHeight: 1.2
                            }}>
                              {opt.l}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Test Actions */}
            <div style={{ marginTop: '28px', display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setScreen('open')}
                style={{
                  padding: '14px 18px',
                  borderRadius: '8px',
                  border: '1.5px solid #D7D0C0',
                  background: 'transparent',
                  color: '#1B2A6E',
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={answeredCount < QUESTIONS.length}
                onClick={handleSubmitTest}
                style={{
                  flex: 1,
                  border: 'none',
                  cursor: answeredCount < QUESTIONS.length ? 'not-allowed' : 'pointer',
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 700,
                  fontSize: '15.5px',
                  padding: '14px 22px',
                  borderRadius: '8px',
                  background: answeredCount < QUESTIONS.length ? '#D8D2C4' : '#F07E1B',
                  color: answeredCount < QUESTIONS.length ? '#8B8471' : '#FFFFFF',
                  letterSpacing: '.01em',
                  transition: 'background .15s ease'
                }}
              >
                See my score ({answeredCount}/8) →
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 3: RESULT */}
        {screen === 'result' && (
          <div style={{ padding: '36px 32px 30px' }} className="animate-fadeIn">
            <div style={{
              display: 'flex',
              gap: '22px',
              alignItems: 'flex-start',
              marginBottom: '22px',
              flexWrap: 'wrap'
            }}>
              {/* Circular Gauge */}
              <div style={{ position: 'relative', width: '150px', height: '150px', flex: 'none', margin: '0 auto' }}>
                <svg viewBox="0 0 150 150" style={{ width: '150px', height: '150px', transform: 'rotate(-90deg)' }}>
                  <circle cx="75" cy="75" r="64" fill="none" stroke="#E7E2D6" strokeWidth="12" />
                  <circle 
                    cx="75" 
                    cy="75" 
                    r="64" 
                    fill="none" 
                    stroke={currentBandStyle.arc} 
                    strokeWidth="12" 
                    strokeLinecap="round" 
                    strokeDasharray={circumference.toFixed(1)} 
                    strokeDashoffset={arcOffset}
                    style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  />
                </svg>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: '36px', color: '#131C3A', lineHeight: 1 }}>
                    {resultState.score}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#4B5170', fontWeight: 600, marginTop: '2px' }}>
                    out of 100
                  </div>
                </div>
              </div>

              {/* Result Copy */}
              <div style={{ flex: 1, minWidth: '220px', paddingTop: '6px' }}>
                <div style={{
                  display: 'inline-block',
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 700,
                  fontSize: '14px',
                  padding: '6px 14px',
                  borderRadius: '100px',
                  marginBottom: '10px',
                  background: currentBandStyle.bg,
                  color: currentBandStyle.fg
                }}>
                  {resultState.band.name}
                </div>
                <p style={{ fontSize: '14.5px', color: '#4B5170', lineHeight: 1.55, margin: 0 }}>
                  {resultState.band.explain}
                </p>
              </div>
            </div>

            {/* Band Rail Scale */}
            <div style={{ margin: '8px 0 28px' }}>
              <div style={{ position: 'relative', height: '0' }}>
                <div style={{
                  position: 'absolute',
                  top: '-19px',
                  left: `${resultState.score}%`,
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: `7px solid ${currentBandStyle.arc}`,
                  transition: 'left 1s ease'
                }} />
              </div>
              <div style={{ display: 'flex', height: '9px', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ flex: 1, background: '#C63B32' }} title="0-24: 100% Owner Dependent" />
                <div style={{ flex: 1, background: '#C1541B' }} title="25-49: Heavily Dependent" />
                <div style={{ flex: 1, background: '#B9820A' }} title="50-74: Partially Systemized" />
                <div style={{ flex: 1, background: '#1E8A5F' }} title="75-100: Self-Running Business" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: '#9A93A0', marginTop: '6px', fontWeight: 600 }}>
                <span>0</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
              </div>
            </div>

            {/* CTA Card */}
            <div style={{
              background: '#131C3A',
              borderRadius: '10px',
              padding: '22px',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap'
            }}>
              <img 
                src="/bdt_mascot.webp" 
                alt="WeGrow mascot" 
                style={{ width: '66px', flex: 'none', objectFit: 'contain' }}
                onError={(e) => { e.currentTarget.src = '/we_mascot.jpeg'; }}
              />
              <div style={{ flex: 1, minWidth: '200px' }}>
                <h3 style={{ fontSize: '16.5px', color: '#FFFFFF', marginBottom: '6px', lineHeight: 1.3 }}>
                  Want to know your 3 biggest gaps?
                </h3>
                <p style={{ fontSize: '13px', color: '#C9D2F5', margin: '0 0 14px', lineHeight: 1.5 }}>
                  Book a free 20-minute diagnostic and we'll walk through exactly what's keeping the business dependent on you — and what to fix first.
                </p>
                <button 
                  type="button"
                  onClick={handleGoLead}
                  style={{
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: "'Sora', sans-serif",
                    fontWeight: 700,
                    fontSize: '14.5px',
                    padding: '12px 18px',
                    borderRadius: '8px',
                    background: '#F07E1B',
                    color: '#FFFFFF',
                    letterSpacing: '.01em'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#D9661A'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#F07E1B'}
                >
                  Book your free business diagnostic →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 4: LEAD FORM */}
        {screen === 'lead' && (
          <div style={{ padding: '36px 32px 30px' }} className="animate-fadeIn">
            <div style={{ marginBottom: '18px' }}>
              <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: '21px', color: '#131C3A', marginBottom: '6px' }}>
                Book your free diagnostic
              </h2>
              <p style={{ fontSize: '14px', color: '#4B5170', margin: 0 }}>
                A few details so our team can prepare for your session.
              </p>
            </div>

            {/* Summary Chip */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#FDF0E2',
              border: '1px solid #F3D3AC',
              borderRadius: '7px',
              padding: '10px 14px',
              marginBottom: '20px',
              fontSize: '13.5px',
              color: '#131C3A',
              fontWeight: 600
            }}>
              <span>Your score: <strong>{resultState.score}</strong>/100</span>
              <span style={{ color: currentBandStyle.fg, fontWeight: 700 }}>
                {resultState.band.name}
              </span>
            </div>

            {/* Row 1 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0 14px' }}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#131C3A', marginBottom: '6px' }}>
                  Full name
                </label>
                <input 
                  type="text" 
                  value={leadVals.name}
                  onChange={(e) => setLeadVals({ ...leadVals, name: e.target.value })}
                  style={{
                    width: '100%',
                    fontSize: '15px',
                    padding: '12px 13px',
                    borderRadius: '7px',
                    border: `1.5px solid ${leadErrors.name ? '#C63B32' : '#D7D0C0'}`,
                    background: '#FFFFFF',
                    boxSizing: 'border-box'
                  }}
                />
                {leadErrors.name && <div style={{ fontSize: '12.5px', color: '#C63B32', marginTop: '4px' }}>{leadErrors.name}</div>}
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#131C3A', marginBottom: '6px' }}>
                  Company
                </label>
                <input 
                  type="text" 
                  value={leadVals.company}
                  onChange={(e) => setLeadVals({ ...leadVals, company: e.target.value })}
                  style={{
                    width: '100%',
                    fontSize: '15px',
                    padding: '12px 13px',
                    borderRadius: '7px',
                    border: `1.5px solid ${leadErrors.company ? '#C63B32' : '#D7D0C0'}`,
                    background: '#FFFFFF',
                    boxSizing: 'border-box'
                  }}
                />
                {leadErrors.company && <div style={{ fontSize: '12.5px', color: '#C63B32', marginTop: '4px' }}>{leadErrors.company}</div>}
              </div>
            </div>

            {/* Row 2 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0 14px' }}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#131C3A', marginBottom: '6px' }}>
                  Designation
                </label>
                <input 
                  type="text" 
                  value={leadVals.designation}
                  onChange={(e) => setLeadVals({ ...leadVals, designation: e.target.value })}
                  placeholder="e.g. Founder, CEO"
                  style={{
                    width: '100%',
                    fontSize: '15px',
                    padding: '12px 13px',
                    borderRadius: '7px',
                    border: `1.5px solid ${leadErrors.designation ? '#C63B32' : '#D7D0C0'}`,
                    background: '#FFFFFF',
                    boxSizing: 'border-box'
                  }}
                />
                {leadErrors.designation && <div style={{ fontSize: '12.5px', color: '#C63B32', marginTop: '4px' }}>{leadErrors.designation}</div>}
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#131C3A', marginBottom: '6px' }}>
                  Industry
                </label>
                <select 
                  value={leadVals.industry}
                  onChange={(e) => setLeadVals({ ...leadVals, industry: e.target.value })}
                  style={{
                    width: '100%',
                    fontSize: '15px',
                    padding: '12px 13px',
                    borderRadius: '7px',
                    border: `1.5px solid ${leadErrors.industry ? '#C63B32' : '#D7D0C0'}`,
                    background: '#FFFFFF',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">Select industry</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Retail / E-commerce">Retail / E-commerce</option>
                  <option value="IT / Technology services">IT / Technology services</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Construction / Real estate">Construction / Real estate</option>
                  <option value="Education">Education</option>
                  <option value="Food & beverage">Food & beverage</option>
                  <option value="Professional services">Professional services</option>
                  <option value="Other">Other</option>
                </select>
                {leadErrors.industry && <div style={{ fontSize: '12.5px', color: '#C63B32', marginTop: '4px' }}>{leadErrors.industry}</div>}
              </div>
            </div>

            {/* Row 3 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0 14px' }}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#131C3A', marginBottom: '6px' }}>
                  Phone
                </label>
                <input 
                  type="tel" 
                  value={leadVals.phone}
                  onChange={(e) => setLeadVals({ ...leadVals, phone: e.target.value })}
                  style={{
                    width: '100%',
                    fontSize: '15px',
                    padding: '12px 13px',
                    borderRadius: '7px',
                    border: `1.5px solid ${leadErrors.phone ? '#C63B32' : '#D7D0C0'}`,
                    background: '#FFFFFF',
                    boxSizing: 'border-box'
                  }}
                />
                {leadErrors.phone && <div style={{ fontSize: '12.5px', color: '#C63B32', marginTop: '4px' }}>{leadErrors.phone}</div>}
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#131C3A', marginBottom: '6px' }}>
                  Email
                </label>
                <input 
                  type="email" 
                  value={leadVals.email}
                  onChange={(e) => setLeadVals({ ...leadVals, email: e.target.value })}
                  placeholder="name@company.com"
                  style={{
                    width: '100%',
                    fontSize: '15px',
                    padding: '12px 13px',
                    borderRadius: '7px',
                    border: `1.5px solid ${leadErrors.email ? '#C63B32' : '#D7D0C0'}`,
                    background: '#FFFFFF',
                    boxSizing: 'border-box'
                  }}
                />
                {leadErrors.email && <div style={{ fontSize: '12.5px', color: '#C63B32', marginTop: '4px' }}>{leadErrors.email}</div>}
              </div>
            </div>

            {/* Row 4 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0 14px' }}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#131C3A', marginBottom: '6px' }}>
                  Business size
                </label>
                <select 
                  value={leadVals.size}
                  onChange={(e) => setLeadVals({ ...leadVals, size: e.target.value })}
                  style={{
                    width: '100%',
                    fontSize: '15px',
                    padding: '12px 13px',
                    borderRadius: '7px',
                    border: `1.5px solid ${leadErrors.size ? '#C63B32' : '#D7D0C0'}`,
                    background: '#FFFFFF',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">Select team size</option>
                  <option value="Solo / just me">Solo / just me</option>
                  <option value="2–10 employees">2–10 employees</option>
                  <option value="11–50 employees">11–50 employees</option>
                  <option value="51–200 employees">51–200 employees</option>
                  <option value="200+ employees">200+ employees</option>
                </select>
                {leadErrors.size && <div style={{ fontSize: '12.5px', color: '#C63B32', marginTop: '4px' }}>{leadErrors.size}</div>}
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#131C3A', marginBottom: '6px' }}>
                  Biggest challenge
                </label>
                <select 
                  value={leadVals.challengeSelect}
                  onChange={(e) => setLeadVals({ ...leadVals, challengeSelect: e.target.value })}
                  style={{
                    width: '100%',
                    fontSize: '15px',
                    padding: '12px 13px',
                    borderRadius: '7px',
                    border: `1.5px solid ${leadErrors.challengeSelect ? '#C63B32' : '#D7D0C0'}`,
                    background: '#FFFFFF',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">Select the closest fit</option>
                  <option value="Everything depends on me personally">Everything depends on me personally</option>
                  <option value="No documented systems or SOPs">No documented systems or SOPs</option>
                  <option value="Can't find or trust the right team">Can't find or trust the right team</option>
                  <option value="Sales relies on me">Sales relies on me</option>
                  <option value="Cash flow / financial visibility">Cash flow / financial visibility</option>
                  <option value="Other">Other</option>
                </select>
                {leadErrors.challengeSelect && <div style={{ fontSize: '12.5px', color: '#C63B32', marginTop: '4px' }}>{leadErrors.challengeSelect}</div>}
              </div>
            </div>

            {/* Note */}
            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#131C3A', marginBottom: '6px' }}>
                Anything else about this challenge? (optional)
              </label>
              <textarea 
                rows={3} 
                value={leadVals.challengeNote}
                onChange={(e) => setLeadVals({ ...leadVals, challengeNote: e.target.value })}
                placeholder="A sentence or two is plenty"
                style={{
                  width: '100%',
                  fontSize: '15px',
                  padding: '12px 13px',
                  borderRadius: '7px',
                  border: '1.5px solid #D7D0C0',
                  background: '#FFFFFF',
                  color: '#161B2E',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setScreen('result')}
                style={{
                  padding: '14px 18px',
                  borderRadius: '8px',
                  border: '1.5px solid #D7D0C0',
                  background: 'transparent',
                  color: '#1B2A6E',
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleSubmitLead}
                style={{
                  flex: 1,
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 700,
                  fontSize: '15.5px',
                  padding: '14px 22px',
                  borderRadius: '8px',
                  background: '#F07E1B',
                  color: '#FFFFFF',
                  letterSpacing: '.01em'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#D9661A'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#F07E1B'}
              >
                Send my diagnostic request →
              </button>
            </div>
            <p style={{ fontSize: '12px', color: '#9A93A0', textAlign: 'center', marginTop: '14px', marginBottom: 0 }}>
              Your score ({resultState.score}/100) and category ({resultState.band.name}) are attached automatically
            </p>
          </div>
        )}

        {/* SCREEN 5: THANKS */}
        {screen === 'thanks' && (
          <div style={{ padding: '36px 32px 30px', textAlign: 'center' }} className="animate-fadeIn">
            <img 
              src="/bdt_mascot.webp" 
              alt="WeGrow mascot" 
              style={{ width: '140px', margin: '0 auto 12px', display: 'block', objectFit: 'contain' }}
              onError={(e) => { e.currentTarget.src = '/we_mascot.jpeg'; }}
            />
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: '24px', color: '#131C3A', marginBottom: '10px' }}>
              Request received!
            </h2>
            <p style={{ fontSize: '14.5px', color: '#4B5170', lineHeight: 1.6, maxWidth: '42ch', margin: '0 auto 24px' }}>
              Our team will reach out within 1 business day to schedule your free diagnostic. Keep an eye on your phone and inbox.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleResetAll}
                style={{
                  background: 'transparent',
                  color: '#1B2A6E',
                  border: '1.5px solid #D7D0C0',
                  borderRadius: '8px',
                  padding: '12px 20px',
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Take the test again
              </button>
              <Link
                to="/home"
                style={{
                  textDecoration: 'none',
                  background: '#F07E1B',
                  color: '#FFFFFF',
                  borderRadius: '8px',
                  padding: '12px 22px',
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 700,
                  fontSize: '14px',
                  display: 'inline-flex',
                  alignItems: 'center'
                }}
              >
                Back to WeGrow Home →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Admin Panel Toggle */}
      <button 
        type="button"
        onClick={handleToggleAdmin}
        style={{
          marginTop: '20px',
          fontSize: '12px',
          color: '#8D99C7',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textDecoration: 'underline',
          padding: '6px'
        }}
      >
        {adminOpen ? '▲ Hide captured submissions' : '▼ View captured submissions'} ({submissions.length})
      </button>

      {/* Admin Panel Details */}
      {adminOpen && (
        <div style={{
          width: '100%',
          maxWidth: '640px',
          marginTop: '14px',
          background: '#FFFFFF',
          borderRadius: '10px',
          border: '1px solid #E7E2D6',
          padding: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          boxSizing: 'border-box'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: '16px', color: '#131C3A', margin: 0 }}>
              Captured submissions ({submissions.length})
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              {submissions.length > 0 && (
                <button
                  type="button"
                  onClick={handleExportCSV}
                  style={{
                    background: '#1E8A5F',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Download CSV
                </button>
              )}
              {submissions.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to clear stored test submissions?")) {
                      localStorage.removeItem('wegrow_bdt_submissions');
                      setSubmissions([]);
                    }
                  }}
                  style={{
                    background: '#C63B32',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          <div style={{ overflowX: 'auto', border: '1px solid #E7E2D6', borderRadius: '6px' }}>
            {submissions.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#4B5170', padding: '16px', textAlign: 'center', margin: 0 }}>
                No submissions captured yet. Take the test above and submit to see entries here.
              </p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ background: '#FBF9F5', borderBottom: '1.5px solid #E7E2D6' }}>
                    <th style={{ textAlign: 'left', padding: '9px 10px', color: '#131C3A', whiteSpace: 'nowrap' }}>Date</th>
                    <th style={{ textAlign: 'left', padding: '9px 10px', color: '#131C3A', whiteSpace: 'nowrap' }}>Name</th>
                    <th style={{ textAlign: 'left', padding: '9px 10px', color: '#131C3A', whiteSpace: 'nowrap' }}>Company</th>
                    <th style={{ textAlign: 'left', padding: '9px 10px', color: '#131C3A', whiteSpace: 'nowrap' }}>Designation</th>
                    <th style={{ textAlign: 'left', padding: '9px 10px', color: '#131C3A', whiteSpace: 'nowrap' }}>Industry</th>
                    <th style={{ textAlign: 'left', padding: '9px 10px', color: '#131C3A', whiteSpace: 'nowrap' }}>Phone</th>
                    <th style={{ textAlign: 'left', padding: '9px 10px', color: '#131C3A', whiteSpace: 'nowrap' }}>Email</th>
                    <th style={{ textAlign: 'left', padding: '9px 10px', color: '#131C3A', whiteSpace: 'nowrap' }}>Size</th>
                    <th style={{ textAlign: 'left', padding: '9px 10px', color: '#131C3A', whiteSpace: 'nowrap' }}>Challenge</th>
                    <th style={{ textAlign: 'left', padding: '9px 10px', color: '#131C3A', whiteSpace: 'nowrap' }}>Score</th>
                    <th style={{ textAlign: 'left', padding: '9px 10px', color: '#131C3A', whiteSpace: 'nowrap' }}>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #E7E2D6' }}>
                      <td style={{ padding: '8px 10px', whiteSpace: 'nowrap', color: '#4B5170' }}>
                        {r.submittedAt ? new Date(r.submittedAt).toLocaleDateString() : ''}
                      </td>
                      <td style={{ padding: '8px 10px', whiteSpace: 'nowrap', fontWeight: 600, color: '#131C3A' }}>{r.name}</td>
                      <td style={{ padding: '8px 10px', whiteSpace: 'nowrap' }}>{r.company}</td>
                      <td style={{ padding: '8px 10px', whiteSpace: 'nowrap' }}>{r.designation}</td>
                      <td style={{ padding: '8px 10px', whiteSpace: 'nowrap' }}>{r.industry}</td>
                      <td style={{ padding: '8px 10px', whiteSpace: 'nowrap' }}>{r.phone}</td>
                      <td style={{ padding: '8px 10px', whiteSpace: 'nowrap' }}>{r.email}</td>
                      <td style={{ padding: '8px 10px', whiteSpace: 'nowrap' }}>{r.size}</td>
                      <td style={{ padding: '8px 10px', whiteSpace: 'nowrap' }}>{r.challengeSelect}</td>
                      <td style={{ padding: '8px 10px', whiteSpace: 'nowrap', fontWeight: 700, color: '#F07E1B' }}>{r.score}</td>
                      <td style={{ padding: '8px 10px', whiteSpace: 'nowrap', fontWeight: 600 }}>{r.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
