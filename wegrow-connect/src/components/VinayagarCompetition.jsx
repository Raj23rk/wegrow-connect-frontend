import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Calendar,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  Award,
  Palette,
  Users,
  Trophy,
  Sparkles,
  HelpCircle,
  FileText,
  Send,
  X,
  Share2,
  ChevronRight,
  Gift,
  Building,
  Heart,
  Copy,
  Check
} from 'lucide-react';
import { registerArtParticipant } from '../services/api';

// Realtime Blinking Festive Toran (Bunting Flags & Glowing Scalloped String Lights)
// Realtime Blinking Festive Toran (Bunting Flags & Glowing Scalloped String Lights)
function FestiveToranAndLights() {
  const flagColors = ['#E8720C', '#0E7A5B', '#C43D6B', '#C9972B', '#7A1B2B'];
  const bulbConfigs = [
    { fill: '#FFB800', glow: '#FFB800', anim: 1 },
    { fill: '#FF5722', glow: '#FF5722', anim: 2 },
    { fill: '#FFCA28', glow: '#FFCA28', anim: 3 },
    { fill: '#E91E63', glow: '#E91E63', anim: 4 },
    { fill: '#FF9800', glow: '#FF9800', anim: 5 },
  ];

  const totalWidth = 2000;
  const scallopWidth = 100;
  const numScallops = 20;
  const flagWidth = 24;
  const numFlags = 84;

  return (
    <div
      className="festive-toran-container"
      style={{
        width: '100%',
        background: '#FFF8EE',
        lineHeight: 0,
        overflow: 'hidden',
        position: 'relative',
        zIndex: 20,
      }}
    >
      <svg
        viewBox="0 0 2000 68"
        preserveAspectRatio="none"
        style={{ width: '100%', height: '64px', display: 'block' }}
      >
        <defs>
          <linearGradient id="festiveTopLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E8720C" />
            <stop offset="25%" stopColor="#0E7A5B" />
            <stop offset="50%" stopColor="#C43D6B" />
            <stop offset="75%" stopColor="#C9972B" />
            <stop offset="100%" stopColor="#7A1B2B" />
          </linearGradient>

          {bulbConfigs.map((cfg, idx) => (
            <radialGradient key={idx} id={`bulbGlow${idx}`}>
              <stop offset="0%" stopColor={cfg.glow} stopOpacity="0.9" />
              <stop offset="35%" stopColor={cfg.glow} stopOpacity="0.5" />
              <stop offset="100%" stopColor={cfg.glow} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>

        {/* Top colored stripe */}
        <line x1="0" y1="2" x2="2000" y2="2" stroke="url(#festiveTopLine)" strokeWidth="3" />

        {/* Bunting / Toran Flags (Triangles) */}
        {Array.from({ length: numFlags }).map((_, i) => {
          const x = i * flagWidth;
          const color = flagColors[i % flagColors.length];
          return (
            <polygon
              key={`flag-${i}`}
              points={`${x},3 ${x + flagWidth / 2},19 ${x + flagWidth},3`}
              fill={color}
            />
          );
        })}

        {/* Scalloped String Light Curves, Sockets, and Blinking Bulbs */}
        {Array.from({ length: numScallops }).map((_, i) => {
          const xStart = i * scallopWidth;
          const xMid = xStart + scallopWidth / 2;
          const xEnd = xStart + scallopWidth;
          const bulbCfg = bulbConfigs[i % bulbConfigs.length];

          return (
            <g key={`scallop-${i}`}>
              {/* Curved Hanging Wire */}
              <path
                d={`M ${xStart},19 Q ${xMid},37 ${xEnd},19`}
                fill="none"
                stroke="#4A3728"
                strokeWidth="1.2"
                opacity="0.8"
              />

              {/* Socket cap */}
              <rect
                x={xMid - 2.5}
                y="37"
                width="5"
                height="4"
                rx="1"
                fill="#2E2015"
              />

              {/* Glowing Halo (Realtime Pulse) */}
              <circle
                cx={xMid}
                cy="46"
                r="15"
                fill={`url(#bulbGlow${i % bulbConfigs.length})`}
                className={`fairy-halo-${bulbCfg.anim}`}
              />

              {/* Fairy Light Bulb (Realtime Blink) */}
              <ellipse
                cx={xMid}
                cy="46"
                rx="5"
                ry="7"
                fill={bulbCfg.fill}
                className={`fairy-light-${bulbCfg.anim}`}
              />

              {/* 3D Glass Specular Highlight */}
              <ellipse
                cx={xMid - 1.4}
                cy="44"
                rx="1.3"
                ry="2.1"
                fill="#FFFFFF"
                opacity="0.75"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// Realtime Falling Flower Petals Shower Animation (Top to Bottom Festive Pushpa Vrushti)
function FallingFlowerPetals() {
  const petals = [
    { id: 1, left: 2, delay: -1.2, duration: 8.5, type: 'marigold', size: 34, rot: 380, sway: 45 },
    { id: 2, left: 7, delay: -4.5, duration: 10.0, type: 'rose', size: 24, rot: -320, sway: -40 },
    { id: 3, left: 13, delay: -2.8, duration: 9.2, type: 'jasmine', size: 26, rot: 420, sway: 55 },
    { id: 4, left: 19, delay: -7.0, duration: 11.2, type: 'marigold-petal', size: 22, rot: 280, sway: -35 },
    { id: 5, left: 25, delay: -0.5, duration: 8.8, type: 'lotus-petal', size: 27, rot: -440, sway: 50 },
    { id: 6, left: 31, delay: -5.3, duration: 9.6, type: 'marigold', size: 36, rot: 360, sway: -55 },
    { id: 7, left: 37, delay: -3.2, duration: 10.4, type: 'rose', size: 25, rot: -300, sway: 40 },
    { id: 8, left: 43, delay: -8.1, duration: 8.4, type: 'jasmine', size: 28, rot: 400, sway: -45 },
    { id: 9, left: 49, delay: -2.1, duration: 11.5, type: 'marigold-petal', size: 23, rot: -360, sway: 35 },
    { id: 10, left: 55, delay: -6.4, duration: 9.0, type: 'marigold', size: 32, rot: 460, sway: -60 },
    { id: 11, left: 61, delay: -1.8, duration: 8.6, type: 'lotus-petal', size: 26, rot: -340, sway: 50 },
    { id: 12, left: 67, delay: -5.9, duration: 10.1, type: 'rose', size: 23, rot: 390, sway: -40 },
    { id: 13, left: 73, delay: -3.7, duration: 9.4, type: 'jasmine', size: 25, rot: -410, sway: 45 },
    { id: 14, left: 79, delay: -7.6, duration: 10.8, type: 'marigold', size: 35, rot: 330, sway: -35 },
    { id: 15, left: 85, delay: -0.8, duration: 8.5, type: 'marigold-petal', size: 21, rot: -380, sway: 55 },
    { id: 16, left: 91, delay: -4.9, duration: 11.0, type: 'rose', size: 26, rot: 420, sway: -50 },
    { id: 17, left: 96, delay: -2.4, duration: 9.8, type: 'jasmine', size: 27, rot: -350, sway: 45 },
    { id: 18, left: 5, delay: -6.1, duration: 10.5, type: 'lotus-petal', size: 25, rot: 370, sway: -40 },
    { id: 19, left: 16, delay: -8.5, duration: 9.5, type: 'marigold', size: 30, rot: -290, sway: 35 },
    { id: 20, left: 28, delay: -1.5, duration: 10.6, type: 'rose', size: 24, rot: 440, sway: -55 },
    { id: 21, left: 46, delay: -4.0, duration: 9.1, type: 'marigold-petal', size: 22, rot: -370, sway: 50 },
    { id: 22, left: 64, delay: -7.3, duration: 11.3, type: 'jasmine', size: 26, rot: 350, sway: -45 },
    { id: 23, left: 82, delay: -2.9, duration: 9.7, type: 'marigold', size: 33, rot: -390, sway: 40 },
    { id: 24, left: 94, delay: -6.7, duration: 10.3, type: 'lotus-petal', size: 28, rot: 380, sway: -50 },
  ];

  const renderFlower = (type, id) => {
    switch (type) {
      case 'marigold':
        // Full Marigold Blossom (Genda Phool) with layered ruffled petals
        return (
          <svg viewBox="0 0 40 40" width="100%" height="100%" fill="none">
            <defs>
              <radialGradient id={`mgGrad-${id}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFF176" />
                <stop offset="35%" stopColor="#FFA726" />
                <stop offset="75%" stopColor="#FB8C00" />
                <stop offset="100%" stopColor="#E65100" />
              </radialGradient>
            </defs>
            <g fill={`url(#mgGrad-${id})`} filter="drop-shadow(0 3px 6px rgba(230,81,0,0.38))">
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <ellipse key={deg} cx="20" cy="8.5" rx="5" ry="7.5" transform={`rotate(${deg} 20 20)`} />
              ))}
              {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map((deg) => (
                <ellipse key={deg} cx="20" cy="11.5" rx="4.2" ry="6" fill="#FFA000" transform={`rotate(${deg} 20 20)`} />
              ))}
              <circle cx="20" cy="20" r="5.5" fill="#E65100" />
              <circle cx="20" cy="20" r="3.2" fill="#FFE082" />
            </g>
          </svg>
        );
      case 'jasmine':
        // Auspicious White Jasmine (Malligai) 5-petal star blossom
        return (
          <svg viewBox="0 0 32 32" width="100%" height="100%" fill="none">
            <defs>
              <linearGradient id={`jasGrad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="70%" stopColor="#FEF9C3" />
                <stop offset="100%" stopColor="#FDE047" />
              </linearGradient>
            </defs>
            <g filter="drop-shadow(0 2px 5px rgba(202,138,4,0.3))">
              {[0, 72, 144, 216, 288].map((deg) => (
                <path
                  key={deg}
                  d="M16 16 C13 10, 12 4, 16 2 C20 4, 19 10, 16 16 Z"
                  fill={`url(#jasGrad-${id})`}
                  transform={`rotate(${deg} 16 16)`}
                />
              ))}
              <circle cx="16" cy="16" r="3.2" fill="#FACC15" />
              <circle cx="16" cy="16" r="1.6" fill="#65A30D" />
            </g>
          </svg>
        );
      case 'rose':
        // Velvet Red Rose Petal
        return (
          <svg viewBox="0 0 28 30" width="100%" height="100%" fill="none">
            <defs>
              <linearGradient id={`roseGrad-${id}`} x1="15%" y1="10%" x2="85%" y2="90%">
                <stop offset="0%" stopColor="#FB7185" />
                <stop offset="50%" stopColor="#E11D48" />
                <stop offset="100%" stopColor="#881337" />
              </linearGradient>
            </defs>
            <path
              d="M14 2 C21 2, 26 8, 25 18 C24 25, 17 28, 14 28 C11 28, 4 25, 3 18 C2 8, 7 2, 14 2 Z"
              fill={`url(#roseGrad-${id})`}
              filter="drop-shadow(0 3px 6px rgba(136,19,55,0.38))"
            />
          </svg>
        );
      case 'lotus-petal':
        // Auspicious Pink Lotus Petal
        return (
          <svg viewBox="0 0 26 32" width="100%" height="100%" fill="none">
            <defs>
              <linearGradient id={`lotusGrad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FBCFE8" />
                <stop offset="55%" stopColor="#F43F5E" />
                <stop offset="100%" stopColor="#9F1239" />
              </linearGradient>
            </defs>
            <path
              d="M13 2 C18 6, 23 15, 21 24 C19 29, 15 31, 13 31 C11 31, 7 29, 5 24 C3 15, 8 6, 13 2 Z"
              fill={`url(#lotusGrad-${id})`}
              filter="drop-shadow(0 3px 6px rgba(225,29,72,0.35))"
            />
          </svg>
        );
      case 'marigold-petal':
      default:
        // Single Marigold Petal
        return (
          <svg viewBox="0 0 24 28" width="100%" height="100%" fill="none">
            <defs>
              <linearGradient id={`mgpGrad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF59D" />
                <stop offset="40%" stopColor="#FFB300" />
                <stop offset="100%" stopColor="#E65100" />
              </linearGradient>
            </defs>
            <path
              d="M12 2 C17 2, 21 8, 20 18 C19 24, 15 27, 12 27 C9 27, 5 24, 4 18 C3 8, 7 2, 12 2 Z"
              fill={`url(#mgpGrad-${id})`}
              filter="drop-shadow(0 2px 5px rgba(230,81,0,0.32))"
            />
          </svg>
        );
    }
  };

  return (
    <div
      className="falling-flowers-container"
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 6,
      }}
    >
      {petals.map((p) => (
        <span
          key={p.id}
          className="flower-petal"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--sway': `${p.sway}px`,
            '--rot': `${p.rot}deg`,
          }}
        >
          {renderFlower(p.type, p.id)}
        </span>
      ))}
    </div>
  );
}

export default function VinayagarCompetition() {
  // 1. Live Countdown to Event: 14 September 2026, 11:00 AM IST
  const eventDate = new Date('2026-09-14T11:00:00+05:30').getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = eventDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [eventDate]);

  // Floating badge state
  const [showFloatingBadge, setShowFloatingBadge] = useState(true);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState(0);
  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  // Registration form state
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    college: '',
    degreeYear: '',
    artMedium: 'Color Pencils & Oil Pastels',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [confirmedReg, setConfirmedReg] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const copyRegId = () => {
    if (confirmedReg?.registrationNumber) {
      navigator.clipboard.writeText(confirmedReg.registrationNumber);
      setCopied(true);
      toast.success('Registration ID copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.phone.trim()) {
      toast.error('Please enter your full name and mobile number!');
      return;
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!formData.college.trim()) {
      toast.error('Please specify your College / Institution name.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await registerArtParticipant({
        fullName: formData.fullName.trim(),
        phone: cleanPhone.slice(-10),
        email: formData.email.trim() || undefined,
        collegeName: formData.college.trim(),
        degreeAndYear: formData.degreeYear.trim() || 'Not Specified',
        preferredArtMedium: formData.artMedium,
        notes: formData.notes?.trim() || undefined,
      });

      if (res?.success || res?.data?.registrationNumber) {
        const participantData = res?.data || res;
        setConfirmedReg(participantData);
        setIsRegistered(true);
        toast.success(`🎉 Registered successfully! Reg ID: ${participantData.registrationNumber || 'ART-2026'}`);
      } else {
        toast.error(res?.message || 'Failed to submit registration. Please check your details and try again.');
      }
    } catch (err) {
      console.error('Registration API error:', err);
      toast.error(err?.message || 'Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToRegister = (e) => {
    if (e) e.preventDefault();
    const target = document.getElementById('register');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const faqs = [
    {
      q: 'Who is eligible to participate in the Drawing Competition?',
      a: 'The competition is open to students from ANY college, institute, or university across Tamil Nadu. All degrees (B.E/B.Tech, Arts, Science, Commerce, Diploma, Management, Fine Arts, and Postgraduates) are warmly welcome!'
    },
    {
      q: 'Will drawing sheets be provided at the venue?',
      a: 'Yes! Standard high-quality A3 drawing sheets will be provided to all registered participants at the registration desk. You only need to bring your own drawing pencils, erasers, colors, brushes, and drawing pad.'
    },
    {
      q: 'Which art mediums and coloring tools are permitted?',
      a: 'Participants can use Pencil Shading / Charcoal, Oil Pastels, Crayons, Color Pencils, Watercolors, Poster Colors, Acrylics, or Mixed Media on the provided A3 paper. Digital tablets are not permitted as this is a live hand-drawn competition.'
    },
    {
      q: 'What are the judging criteria?',
      a: 'Entries will be evaluated by an esteemed panel of professional artists and faculties based on Creativity & Originality, Adherence to the Theme (Lord Vinayagar in His Divine Splendour), Color Harmony / Shading Mastery, and Overall Visual Impact.'
    },
    {
      q: 'Is there any registration fee?',
      a: 'No! Entry is 100% FREE as part of the WeGrow B School Festive Cultural Initiative. However, prior registration is mandatory to reserve your drawing seat and kit.'
    },
    {
      q: 'Will every participant receive a certificate?',
      a: 'Yes! Every participant who submits their artwork will be awarded an official Certificate of Participation from WeGrow Skill Campus & B School. Top winners will receive Cash Prizes, Trophies, and Special Mementos.'
    }
  ];

  return (
    <div className="vinayagar-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');

        .vinayagar-page {
          --saffron: #E8720C;
          --saffron-dark: #C55D06;
          --maroon: #7A1B2B;
          --gold: #C9972B;
          --green: #0E7A5B;
          --green-dark: #0A5C44;
          --pink: #C43D6B;
          --cream: #FFF8EC;
          --panel: #FFFFFF;
          --ink: #2B1B12;
          --muted: #8A7863;
          --line: #EFE1C8;
          --field-border: #16211A;
          --field-bg: #FDF6E7;
          --radius: 18px;
          --maxw: 1180px;
          font-family: 'Inter', sans-serif;
          color: var(--ink);
          background: var(--cream);
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        .vinayagar-page * { box-sizing: border-box; }
        .vinayagar-page h1, 
        .vinayagar-page h2, 
        .vinayagar-page h3, 
        .vinayagar-page h4,
        .vinayagar-page .display {
          font-family: 'Poppins', sans-serif;
          margin: 0;
          line-height: 1.15;
          color: var(--maroon);
        }
        .vinayagar-page img { max-width: 100%; display: block; }
        .vinayagar-page a { color: inherit; text-decoration: none; }
        .vinayagar-page .wrap { max-width: var(--maxw); margin: 0 auto; padding: 0 28px; }
        .vinayagar-page section { padding: 84px 0; }

        .vinayagar-page .eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--maroon); color: #fff;
          font-family: 'Inter', sans-serif; font-weight: 600; font-size: 12.5px;
          padding: 8px 16px; border-radius: 100px; letter-spacing: .3px; text-transform: uppercase;
        }
        .vinayagar-page .eyebrow .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); }

        .vinayagar-page .btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          font-family: 'Inter', sans-serif; font-weight: 700; font-size: 16px;
          padding: 16px 30px; border-radius: 100px; border: none; cursor: pointer;
          transition: transform .15s ease, box-shadow .15s ease;
          text-decoration: none;
        }
        .vinayagar-page .btn:hover { transform: translateY(-2px); }
        .vinayagar-page .btn-primary {
          background: linear-gradient(135deg, var(--saffron), var(--saffron-dark));
          color: #fff;
          box-shadow: 0 10px 24px -8px rgba(232, 114, 12, .5);
        }
        .vinayagar-page .btn-ghost {
          background: transparent; color: var(--maroon); border: 1.5px solid var(--maroon);
        }
        .vinayagar-page .btn-ghost:hover { background: var(--maroon); color: #fff; }
        .vinayagar-page .btn-light { background: #fff; color: var(--maroon); }

        /* ---------- Popup badge ---------- */
        @keyframes pulseBadge {
          0% { box-shadow: 0 0 0 0 rgba(232, 114, 12, .45); }
          70% { box-shadow: 0 0 0 14px rgba(232, 114, 12, 0); }
          100% { box-shadow: 0 0 0 0 rgba(232, 114, 12, 0); }
        }
        .vinayagar-page .popup-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: #fff; color: var(--maroon); font-weight: 700; font-size: 13px;
          padding: 10px 18px; border-radius: 100px; border: 1.5px solid var(--saffron);
          animation: pulseBadge 2.2s infinite; margin-bottom: 18px;
        }
        .vinayagar-page .popup-badge .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--saffron); flex: none; }

        .vinayagar-page .floating-badge {
          position: fixed; right: 20px; bottom: 20px; z-index: 80;
          display: flex; align-items: center; gap: 10px;
          background: var(--maroon); color: #fff; font-weight: 700; font-size: 13.5px;
          padding: 12px 18px; border-radius: 100px; box-shadow: 0 14px 30px -10px rgba(0, 0, 0, .4);
          animation: pulseBadge 2.4s infinite; cursor: pointer;
        }
        .vinayagar-page .floating-badge span.emoji { font-size: 16px; }
        .vinayagar-page .floating-badge .fclose {
          background: rgba(255, 255, 255, .2); border: none; color: #fff; width: 20px; height: 20px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 13px; line-height: 1; flex: none; margin-left: 2px;
        }
        @media(max-width: 640px) {
          .vinayagar-page .floating-badge { right: 14px; bottom: 14px; padding: 10px 14px; font-size: 12.5px; }
        }

        /* ---------- Realtime Blinking Fairy Lights & Halos ---------- */
        @keyframes fairyBlink1 {
          0%, 100% { opacity: 1; filter: drop-shadow(0 0 10px rgba(255, 184, 0, 0.95)) brightness(1.3); }
          50% { opacity: 0.28; filter: drop-shadow(0 0 2px rgba(255, 184, 0, 0.2)) brightness(0.7); }
        }
        @keyframes fairyBlink2 {
          0%, 100% { opacity: 0.25; filter: drop-shadow(0 0 2px rgba(255, 87, 34, 0.2)) brightness(0.65); }
          50% { opacity: 1; filter: drop-shadow(0 0 11px rgba(255, 87, 34, 0.95)) brightness(1.3); }
        }
        @keyframes fairyBlink3 {
          0%, 65%, 100% { opacity: 0.95; filter: drop-shadow(0 0 10px rgba(255, 202, 40, 0.95)) brightness(1.28); }
          30% { opacity: 0.22; filter: drop-shadow(0 0 1px rgba(255, 202, 40, 0.15)) brightness(0.65); }
        }
        @keyframes fairyBlink4 {
          0%, 100% { opacity: 0.3; filter: drop-shadow(0 0 2px rgba(233, 30, 99, 0.2)) brightness(0.7); }
          45% { opacity: 1; filter: drop-shadow(0 0 11px rgba(233, 30, 99, 0.95)) brightness(1.35); }
        }
        @keyframes fairyBlink5 {
          0%, 100% { opacity: 1; filter: drop-shadow(0 0 10px rgba(255, 152, 0, 0.95)) brightness(1.28); }
          75% { opacity: 0.25; filter: drop-shadow(0 0 2px rgba(255, 152, 0, 0.2)) brightness(0.65); }
        }

        .vinayagar-page .fairy-light-1 { animation: fairyBlink1 1.7s ease-in-out infinite; }
        .vinayagar-page .fairy-light-2 { animation: fairyBlink2 1.4s ease-in-out infinite; }
        .vinayagar-page .fairy-light-3 { animation: fairyBlink3 2.0s ease-in-out infinite; }
        .vinayagar-page .fairy-light-4 { animation: fairyBlink4 1.5s ease-in-out infinite; }
        .vinayagar-page .fairy-light-5 { animation: fairyBlink5 2.2s ease-in-out infinite; }

        @keyframes haloGlow1 {
          0%, 100% { opacity: 0.9; transform: scale(1.05); }
          50% { opacity: 0.12; transform: scale(0.5); }
        }
        @keyframes haloGlow2 {
          0%, 100% { opacity: 0.12; transform: scale(0.5); }
          50% { opacity: 0.95; transform: scale(1.08); }
        }
        @keyframes haloGlow3 {
          0%, 65%, 100% { opacity: 0.88; transform: scale(1.02); }
          30% { opacity: 0.1; transform: scale(0.48); }
        }
        @keyframes haloGlow4 {
          0%, 100% { opacity: 0.15; transform: scale(0.5); }
          45% { opacity: 0.95; transform: scale(1.08); }
        }
        @keyframes haloGlow5 {
          0%, 100% { opacity: 0.9; transform: scale(1.05); }
          75% { opacity: 0.15; transform: scale(0.5); }
        }

        .vinayagar-page .fairy-halo-1 { animation: haloGlow1 1.7s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
        .vinayagar-page .fairy-halo-2 { animation: haloGlow2 1.4s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
        .vinayagar-page .fairy-halo-3 { animation: haloGlow3 2.0s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
        .vinayagar-page .fairy-halo-4 { animation: haloGlow4 1.5s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
        .vinayagar-page .fairy-halo-5 { animation: haloGlow5 2.2s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }

        /* ---------- Rangoli dot pattern ---------- */
        .vinayagar-page .rangoli-dots {
          position: absolute; inset: 0; pointer-events: none;
          background-image: radial-gradient(var(--saffron) 1.5px, transparent 1.5px),
                            radial-gradient(var(--green) 1.5px, transparent 1.5px),
                            radial-gradient(var(--pink) 1.5px, transparent 1.5px);
          background-size: 60px 60px, 60px 60px, 60px 60px;
          background-position: 0 0, 20px 30px, 40px 10px;
          opacity: .18;
        }

        /* multi-colour icon chips: cycle saffron / green / maroon / gold */
        .vinayagar-page .comp-card:nth-child(4n+1) .ic { background: var(--maroon); }
        .vinayagar-page .comp-card:nth-child(4n+2) .ic { background: var(--green); }
        .vinayagar-page .comp-card:nth-child(4n+3) .ic { background: var(--saffron); }
        .vinayagar-page .comp-card:nth-child(4n+4) .ic { background: var(--gold); }
        .vinayagar-page .comp-card:nth-child(4n+1) { border-top: 3.5px solid var(--maroon); }
        .vinayagar-page .comp-card:nth-child(4n+2) { border-top: 3.5px solid var(--green); }
        .vinayagar-page .comp-card:nth-child(4n+3) { border-top: 3.5px solid var(--saffron); }
        .vinayagar-page .comp-card:nth-child(4n+4) { border-top: 3.5px solid var(--gold); }

        .vinayagar-page .pillar:nth-child(3n+1) { border-top: 3px solid var(--saffron); }
        .vinayagar-page .pillar:nth-child(3n+2) { border-top: 3px solid var(--green); }
        .vinayagar-page .pillar:nth-child(3n+3) { border-top: 3px solid var(--pink); }
        .vinayagar-page .pillar:nth-child(3n+1) .pillar-num { color: var(--saffron); }
        .vinayagar-page .pillar:nth-child(3n+2) .pillar-num { color: var(--green); }
        .vinayagar-page .pillar:nth-child(3n+3) .pillar-num { color: var(--pink); }

        .vinayagar-page .event-card:nth-child(4n+1) svg { color: var(--maroon); }
        .vinayagar-page .event-card:nth-child(4n+2) svg { color: var(--green); }
        .vinayagar-page .event-card:nth-child(4n+3) svg { color: var(--saffron); }
        .vinayagar-page .event-card:nth-child(4n+4) svg { color: var(--gold); }
        .vinayagar-page .event-card:nth-child(4n+1) { border-bottom: 3.5px solid var(--maroon); }
        .vinayagar-page .event-card:nth-child(4n+2) { border-bottom: 3.5px solid var(--green); }
        .vinayagar-page .event-card:nth-child(4n+3) { border-bottom: 3.5px solid var(--saffron); }
        .vinayagar-page .event-card:nth-child(4n+4) { border-bottom: 3.5px solid var(--gold); }

        .vinayagar-page .wcard:nth-child(3n+1) { border-top: 3.5px solid var(--saffron); }
        .vinayagar-page .wcard:nth-child(3n+2) { border-top: 3.5px solid var(--green); }
        .vinayagar-page .wcard:nth-child(3n+3) { border-top: 3.5px solid var(--pink); }
        .vinayagar-page .wcard:nth-child(3n+1) .wavatar { background: var(--saffron); }
        .vinayagar-page .wcard:nth-child(3n+2) .wavatar { background: var(--green); }
        .vinayagar-page .wcard:nth-child(3n+3) .wavatar { background: var(--pink); }

        /* ---------- Theme / Vinayagar showcase ---------- */
        .vinayagar-page .theme {
          background: linear-gradient(180deg, var(--cream) 0%, #FFF1D6 100%);
          position: relative; overflow: hidden; border-bottom: 1px solid var(--line);
        }
        .vinayagar-page .theme .wrap { position: relative; z-index: 1; text-align: center; max-width: 680px; }
        .vinayagar-page .theme-medallion {
          display: block; margin: 0 auto 20px; width: 190px; height: 190px;
          border-radius: 50%; object-fit: cover;
          border: 4px solid var(--gold);
          box-shadow: 0 16px 36px rgba(122, 27, 43, .22);
        }
        .vinayagar-page .theme h2 { font-size: 32px; font-weight: 800; margin: 6px 0 14px; }
        .vinayagar-page .theme p { color: var(--muted); font-size: 16px; max-width: 540px; margin: 0 auto; }

        /* ---------- Nav ---------- */
        .vinayagar-page .nav {
          position: sticky; top: 0; z-index: 50;
          background: #FFFFFF;
          border-bottom: 2px solid #F0E2D0;
          width: 100%;
        }
        .vinayagar-page .nav .wrap {
          display: flex; align-items: center; justify-content: space-between;
          width: 100%; max-width: 100%; margin: 0; padding: 12px 40px;
        }
        .vinayagar-page .nav-logo { display: flex; align-items: center; }
        .vinayagar-page .nav-logo img { height: 42px; width: auto; object-fit: contain; }
        .vinayagar-page .nav-cta { display: flex; align-items: center; gap: 22px; }
        .vinayagar-page .nav-call {
          font-size: 15px; font-weight: 700; color: #301E14;
          display: flex; align-items: center; gap: 7px;
          text-decoration: none;
        }
        .vinayagar-page .nav-call svg { width: 17px; height: 17px; flex: none; color: #301E14; }
        .vinayagar-page .nav-call:hover { color: var(--saffron); }
        .vinayagar-page .nav .btn-primary {
          background: var(--saffron);
          padding: 10px 24px;
          font-size: 14.5px;
          font-weight: 700;
          border-radius: 100px;
          box-shadow: 0 4px 14px rgba(232, 114, 12, 0.35);
        }
        @media(max-width: 640px) {
          .vinayagar-page .nav .wrap { padding: 10px 18px; }
          .vinayagar-page .nav-cta { gap: 12px; }
          .vinayagar-page .nav-call span.txt { display: none; }
        }

        /* ---------- Hero ---------- */
        .vinayagar-page .hero { position: relative; overflow: hidden; padding: 48px 0 28px; }
        .vinayagar-page .hero-blob {
          position: absolute; top: -100px; right: -80px; width: 640px; height: 640px;
          background: radial-gradient(circle at 45% 45%, #FBE3BE 0%, #FFF8EC 72%);
          border-radius: 50%; z-index: 0;
        }
        .vinayagar-page .hero-blob2 {
          position: absolute; bottom: -160px; left: -160px; width: 420px; height: 420px;
          background: radial-gradient(circle, rgba(14, 122, 91, .10), transparent 70%);
          border-radius: 50%; z-index: 0;
        }
        .vinayagar-page .hero-blob3 {
          position: absolute; top: 20%; left: -120px; width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(196, 61, 107, .10), transparent 70%);
          border-radius: 50%; z-index: 0;
        }
        .vinayagar-page .hero .wrap {
          position: relative; z-index: 1; display: grid; grid-template-columns: 1.05fr .95fr; gap: 36px;
          align-items: center; text-align: left; max-width: var(--maxw);
        }
        .vinayagar-page .hero-copy { position: relative; z-index: 5; }
        .vinayagar-page .hero h1 { font-size: 48px; font-weight: 800; margin: 18px 0 14px; line-height: 1.15; word-break: break-word; }
        .vinayagar-page .hero h1 .accent { color: var(--saffron); }
        .vinayagar-page .hero-tag { font-size: 17px; color: var(--muted); max-width: 500px; margin: 0 0 28px; line-height: 1.65; }
        .vinayagar-page .hero-actions { display: flex; flex-wrap: wrap; gap: 14px; margin-bottom: 28px; justify-content: flex-start; }
        .vinayagar-page .hero-actions .btn-primary { padding: 14px 34px; font-size: 16px; border-radius: 100px; font-weight: 700; }
        .vinayagar-page .hero-meta { display: flex; flex-wrap: wrap; gap: 12px; padding: 0; margin: 0; justify-content: flex-start; max-width: 520px; }
        .vinayagar-page .hero-meta li {
          list-style: none; display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: var(--maroon);
          background: #fff; border: 1px solid var(--line); padding: 9px 18px; border-radius: 100px;
          box-shadow: 0 4px 10px -2px rgba(0,0,0,.04);
        }
        .vinayagar-page .hero-meta svg { width: 17px; height: 17px; flex: none; color: var(--saffron); }
        .vinayagar-page .hero-visual { position: relative; text-align: center; display: flex; align-items: center; justify-content: center; width: 100%; }
        .vinayagar-page .hero-duo-wrap { position: relative; display: flex; align-items: center; justify-content: center; width: 100%; max-width: 480px; }
        /* ---------- Mascot & Vinayagar Duo Divine Animation ---------- */
        @keyframes floatDuoMascot {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-13px) rotate(1deg);
          }
        }

        @keyframes divineAuraGlow {
          0%, 100% {
            filter: drop-shadow(0 14px 28px rgba(122, 27, 43, 0.16))
                    drop-shadow(0 0 20px rgba(245, 158, 11, 0.35));
          }
          50% {
            filter: drop-shadow(0 20px 36px rgba(122, 27, 43, 0.26))
                    drop-shadow(0 0 45px rgba(245, 158, 11, 0.65))
                    drop-shadow(0 0 70px rgba(234, 88, 12, 0.3));
          }
        }
        /* ---------- Mascot Drawing Lord Vinayagar Animation ---------- */
        @keyframes floatMascotDrawing {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-9px) rotate(0.6deg);
          }
        }

        @keyframes divineCanvasGlow {
          0%, 100% {
            box-shadow: 0 16px 36px -8px rgba(122, 27, 43, 0.22),
                        0 0 25px rgba(245, 158, 11, 0.25),
                        inset 0 0 18px rgba(254, 240, 138, 0.12);
          }
          50% {
            box-shadow: 0 22px 48px -6px rgba(122, 27, 43, 0.32),
                        0 0 45px rgba(245, 158, 11, 0.55),
                        0 0 75px rgba(234, 88, 12, 0.28),
                        inset 0 0 30px rgba(254, 240, 138, 0.3);
          }
        }

        .vinayagar-page .mascot-drawing-card {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 485px;
          border-radius: 24px;
          overflow: hidden;
          border: 3px solid #F59E0B;
          background: #FFFBF5;
          animation: floatMascotDrawing 4.8s ease-in-out infinite, divineCanvasGlow 3.6s ease-in-out infinite;
          transition: transform .3s ease, box-shadow .3s ease;
          will-change: transform, box-shadow;
        }
        .vinayagar-page .mascot-drawing-card:hover {
          transform: translateY(-6px) scale(1.02);
        }

        .vinayagar-page .mascot-drawing-img {
          width: 100%;
          height: auto;
          display: block;
          border-radius: 21px;
        }

        /* Realtime Drawing Brush & Canvas Stroke Animation */
        .vinayagar-page .drawing-stroke-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 3;
        }

        @keyframes brushDrawingMotion {
          0% {
            transform: translate3d(0, 0, 0) rotate(-12deg);
            opacity: 0.95;
          }
          25% {
            transform: translate3d(14px, -18px, 0) rotate(14deg) scale(1.08);
            opacity: 1;
          }
          50% {
            transform: translate3d(-8px, 12px, 0) rotate(-8deg) scale(0.95);
            opacity: 0.9;
          }
          75% {
            transform: translate3d(18px, 6px, 0) rotate(16deg) scale(1.05);
            opacity: 1;
          }
          100% {
            transform: translate3d(0, 0, 0) rotate(-12deg);
            opacity: 0.95;
          }
        }

        .vinayagar-page .active-brush-tip {
          position: absolute;
          top: 48%;
          left: 36%;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: radial-gradient(circle, #FFE082 0%, #FF9800 60%, transparent 80%);
          filter: drop-shadow(0 0 10px #FF9800) drop-shadow(0 0 18px #F59E0B);
          animation: brushDrawingMotion 2.8s ease-in-out infinite;
          pointer-events: none;
        }
        .vinayagar-page .active-brush-tip::after {
          content: '✨';
          font-size: 16px;
          position: absolute;
          top: -10px;
          right: -8px;
          animation: sparkleFloat 1.8s ease-in-out infinite;
        }

        @keyframes canvasShimmer {
          0% {
            transform: translateX(-120%) rotate(30deg);
            opacity: 0;
          }
          30% {
            opacity: 0.6;
          }
          60% {
            transform: translateX(220%) rotate(30deg);
            opacity: 0;
          }
          100% {
            transform: translateX(220%) rotate(30deg);
            opacity: 0;
          }
        }

        .vinayagar-page .canvas-shimmer {
          position: absolute;
          top: 15%;
          left: 10%;
          width: 36%;
          height: 62%;
          background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.45) 50%, transparent 100%);
          pointer-events: none;
          animation: canvasShimmer 4.2s ease-in-out infinite;
        }

        /* Mascot Drawing Live Badge */
        .vinayagar-page .mascot-drawing-badge {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(43, 27, 18, 0.88);
          backdrop-filter: blur(8px);
          color: #FFF7ED;
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 12.5px;
          font-weight: 700;
          border: 1px solid rgba(245, 158, 11, 0.5);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
          white-space: nowrap;
          z-index: 4;
        }
        .vinayagar-page .mascot-drawing-badge .live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #22C55E;
          box-shadow: 0 0 8px #22C55E;
          animation: pulseBadge 1.6s infinite;
        }

        /* Divine Halo Backdrop Behind Mascot & Lord Vinayagar */
        .vinayagar-page .duo-divine-aura {
          position: absolute;
          width: 460px;
          height: 460px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(254, 240, 138, 0.45) 0%, rgba(251, 146, 60, 0.25) 45%, rgba(244, 63, 94, 0.08) 70%, transparent 80%);
          z-index: 1;
          pointer-events: none;
          animation: auraSpinPulse 9s ease-in-out infinite alternate;
        }

        @keyframes auraSpinPulse {
          0% {
            transform: scale(0.92) rotate(0deg);
            opacity: 0.6;
          }
          100% {
            transform: scale(1.1) rotate(180deg);
            opacity: 1;
          }
        }

        /* ---------- Flower Petals Animation (Top to Bottom Flow) ---------- */
        @keyframes petalFall {
          0% {
            transform: translate3d(0, -45px, 0) rotate(0deg) rotateY(0deg) scale(0.8);
            opacity: 0;
          }
          6% {
            opacity: 0.98;
            transform: translate3d(calc(var(--sway) * 0.2), 70px, 0) rotate(40deg) rotateY(45deg) scale(1);
          }
          50% {
            transform: translate3d(var(--sway), 50vh, 0) rotate(190deg) rotateY(180deg) scale(1.04);
            opacity: 0.95;
          }
          85% {
            opacity: 0.92;
          }
          100% {
            transform: translate3d(calc(var(--sway) * 0.4), calc(100vh + 60px), 0) rotate(var(--rot)) rotateY(360deg) scale(0.85);
            opacity: 0;
          }
        }

        .vinayagar-page .flower-petal {
          position: absolute;
          top: -45px;
          display: block;
          pointer-events: none;
          animation-name: petalFall;
          animation-timing-function: cubic-bezier(0.36, 0.45, 0.64, 0.95);
          animation-iteration-count: infinite;
          will-change: transform, opacity;
          z-index: 6;
          user-select: none;
        }
        .vinayagar-page .flower-petal svg {
          display: block;
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        /* 1. Marigold Orange Petal */
        .vinayagar-page .petal-marigold-orange {
          background: radial-gradient(circle at 35% 30%, #FFA726 0%, #F57C00 65%, #E65100 100%);
          border-radius: 60% 40% 70% 30% / 60% 30% 70% 40%;
          box-shadow: 0 4px 10px rgba(230, 81, 0, 0.35);
        }

        /* 2. Marigold Yellow Petal */
        .vinayagar-page .petal-marigold-yellow {
          background: radial-gradient(circle at 35% 30%, #FFF176 0%, #FDD835 60%, #F57F17 100%);
          border-radius: 70% 30% 60% 40% / 50% 60% 40% 50%;
          box-shadow: 0 4px 10px rgba(245, 127, 23, 0.3);
        }

        /* 3. Red Rose Petal */
        .vinayagar-page .petal-rose-red {
          background: radial-gradient(circle at 35% 30%, #FB7185 0%, #E11D48 60%, #9F1239 100%);
          border-radius: 50% 50% 60% 60% / 60% 60% 70% 70%;
          box-shadow: 0 4px 12px rgba(159, 18, 57, 0.35);
        }

        /* 4. White/Cream Jasmine Petal */
        .vinayagar-page .petal-jasmine-white {
          background: radial-gradient(circle at 35% 30%, #FFFFFF 0%, #FFFBEB 70%, #FEF08A 100%);
          border-radius: 50% 50% 70% 70% / 70% 70% 50% 50%;
          box-shadow: 0 3px 8px rgba(202, 138, 4, 0.25);
        }

        /* 5. Whole Marigold Blossom */
        .vinayagar-page .petal-marigold-blossom {
          background: radial-gradient(circle at 50% 50%, #FFE082 0%, #FFB300 45%, #FF6F00 85%, #E65100 100%);
          border-radius: 50%;
          box-shadow: 0 6px 14px rgba(230, 81, 0, 0.4), inset 0 0 4px rgba(255, 255, 255, 0.6);
        }

        @media(max-width: 920px) {
          .vinayagar-page .hero .wrap { grid-template-columns: 1fr; text-align: center; gap: 24px; }
          .vinayagar-page .hero-copy { text-align: center; }
          .vinayagar-page .hero-actions { justify-content: center; }
          .vinayagar-page .hero-meta { justify-content: center; }
          .vinayagar-page .hero-visual { order: -1; margin-bottom: 8px; }
          .vinayagar-page .hero-visual .duo-img { max-width: 360px; }
          .vinayagar-page .hero h1 { font-size: 34px; }
        }

        /* ---------- Competition info ---------- */
        .vinayagar-page .comp { background: var(--panel); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
        .vinayagar-page .comp-head { max-width: 680px; margin: 0 auto 44px; text-align: center; }
        .vinayagar-page .comp-head h2 { font-size: 32px; font-weight: 800; margin-top: 14px; }
        .vinayagar-page .comp-head p { color: var(--muted); font-size: 16px; margin-top: 12px; }
        .vinayagar-page .comp-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
        .vinayagar-page .comp-card {
          background: var(--cream); border: 1px solid var(--line); border-radius: var(--radius);
          padding: 28px 20px; text-align: center; transition: transform .2s ease, box-shadow .2s ease;
        }
        .vinayagar-page .comp-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px -8px rgba(0,0,0,.08); }
        .vinayagar-page .comp-card .ic {
          width: 50px; height: 50px; border-radius: 50%; color: #fff;
          display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;
        }
        .vinayagar-page .comp-card .ic svg { width: 24px; height: 24px; }
        .vinayagar-page .comp-card h4 { font-size: 15px; font-weight: 700; margin-bottom: 6px; }
        .vinayagar-page .comp-card p { font-size: 13.5px; color: var(--muted); margin: 0; line-height: 1.5; }
        @media(max-width: 820px) { .vinayagar-page .comp-grid { grid-template-columns: 1fr 1fr; } }
        @media(max-width: 480px) { .vinayagar-page .comp-grid { grid-template-columns: 1fr; } }

        /* ---------- Countdown / register ---------- */
        .vinayagar-page .countdown {
          background: linear-gradient(135deg, var(--maroon) 0%, #4A0F1A 100%);
          color: #fff; text-align: center; position: relative; overflow: hidden;
        }
        .vinayagar-page .countdown::before {
          content: ''; position: absolute; inset: 0;
          background-image: radial-gradient(#E8B23A 2px, transparent 2px),
                            radial-gradient(#0E7A5B 2px, transparent 2px),
                            radial-gradient(#E8720C 2px, transparent 2px);
          background-size: 70px 70px, 90px 90px, 55px 55px;
          background-position: 0 0, 35px 45px, 20px 60px;
          opacity: .15; pointer-events: none;
        }
        .vinayagar-page .countdown .wrap { position: relative; z-index: 1; }
        .vinayagar-page .countdown .eyebrow { background: var(--saffron); color: #fff; }
        .vinayagar-page .countdown h2 { color: #fff; font-size: 32px; font-weight: 800; margin: 16px 0 6px; }
        .vinayagar-page .countdown p.sub { color: #E9C9C9; font-size: 15px; margin-bottom: 36px; }
        .vinayagar-page .timer { display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; margin-bottom: 36px; }
        .vinayagar-page .timer .cell {
          background: rgba(255, 255, 255, .09); border: 1px solid rgba(255, 255, 255, .18);
          border-radius: 16px; padding: 18px 22px; min-width: 96px;
        }
        .vinayagar-page .timer .num { font-family: 'Poppins', sans-serif; font-size: 38px; font-weight: 800; color: var(--gold); line-height: 1; }
        .vinayagar-page .timer .lbl { font-size: 12px; letter-spacing: .5px; color: #E9C9C9; margin-top: 6px; text-transform: uppercase; }

        /* ---------- Registration form ---------- */
        .vinayagar-page .register-panel {
          background: #fff; border-radius: 22px; padding: 38px 34px; max-width: 540px; margin: 44px auto 0;
          text-align: left; box-shadow: 0 30px 60px -20px rgba(0, 0, 0, .35); color: var(--ink);
        }
        .vinayagar-page .register-panel h3 { font-size: 22px; font-weight: 800; margin-bottom: 6px; color: var(--maroon); }
        .vinayagar-page .register-panel p.note { color: var(--muted); font-size: 13.5px; margin-bottom: 22px; }
        .vinayagar-page .field { margin-bottom: 18px; }
        .vinayagar-page .field label { display: block; font-size: 14.5px; font-weight: 700; color: #141C15; margin-bottom: 8px; }
        .vinayagar-page .field label .req { color: var(--maroon); }
        .vinayagar-page .field input,
        .vinayagar-page .field select,
        .vinayagar-page .field textarea {
          width: 100%; padding: 13px 16px; border-radius: 10px; border: 1.5px solid var(--field-border);
          font-family: 'Inter', sans-serif; font-size: 14.5px; background: var(--field-bg); color: #2B1B12;
          transition: border-color .15s, outline .15s;
        }
        .vinayagar-page .field input::placeholder,
        .vinayagar-page .field textarea::placeholder { color: #9C9484; }
        .vinayagar-page .field input:focus,
        .vinayagar-page .field select:focus,
        .vinayagar-page .field textarea:focus {
          outline: 2px solid var(--saffron); outline-offset: 1px;
        }
        .vinayagar-page .register-panel .btn-primary { width: 100%; }

        .vinayagar-page .success-box {
          background: #FDF6E7; border: 1.5px solid var(--gold); border-radius: 14px; padding: 24px; text-align: center;
        }

        /* ---------- About ---------- */
        .vinayagar-page .about { background: var(--panel); border-bottom: 1px solid var(--line); }
        .vinayagar-page .about .wrap { display: grid; grid-template-columns: .95fr 1.05fr; gap: 56px; align-items: center; }
        .vinayagar-page .about h2 { font-size: 32px; font-weight: 800; margin: 14px 0 16px; }
        .vinayagar-page .about p { color: var(--muted); font-size: 15.5px; margin-bottom: 16px; line-height: 1.7; }
        .vinayagar-page .pillars { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 18px; }
        .vinayagar-page .pillar { background: var(--cream); border: 1px solid var(--line); border-radius: 14px; padding: 20px 16px; }
        .vinayagar-page .pillar-num { font-family: 'Poppins', sans-serif; font-weight: 800; font-size: 14px; margin-bottom: 6px; }
        .vinayagar-page .pillar h4 { font-size: 14.5px; font-weight: 700; color: var(--maroon); margin-bottom: 4px; }
        .vinayagar-page .pillar p { font-size: 12.5px; color: var(--muted); margin: 0; line-height: 1.45; }
        @media(max-width: 920px) { .vinayagar-page .about .wrap { grid-template-columns: 1fr; } }
        @media(max-width: 520px) { .vinayagar-page .pillars { grid-template-columns: 1fr; } }

        /* ---------- Event details ---------- */
        .vinayagar-page .event { background: var(--cream); border-bottom: 1px solid var(--line); }
        .vinayagar-page .event-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-top: 44px; }
        .vinayagar-page .event-card {
          border: 1px solid var(--line); border-radius: var(--radius); padding: 26px 22px; background: #fff;
          box-shadow: 0 6px 16px -4px rgba(0,0,0,.03);
        }
        .vinayagar-page .event-card svg { width: 26px; height: 26px; color: var(--saffron); margin-bottom: 14px; }
        .vinayagar-page .event-card h4 { font-size: 12.5px; text-transform: uppercase; letter-spacing: .5px; color: var(--muted); font-weight: 700; margin-bottom: 6px; }
        .vinayagar-page .event-card p { font-size: 16px; font-weight: 700; color: var(--maroon); margin: 0; line-height: 1.4; }
        .vinayagar-page .agenda { margin-top: 44px; border: 1px solid var(--line); border-radius: var(--radius); overflow: hidden; background: #fff; }
        .vinayagar-page .agenda-row { display: flex; gap: 20px; padding: 18px 26px; border-bottom: 1px solid var(--line); align-items: center; }
        .vinayagar-page .agenda-row:last-child { border-bottom: none; }
        .vinayagar-page .agenda-time { flex: none; width: 130px; font-weight: 700; color: var(--saffron); font-size: 14px; }
        .vinayagar-page .agenda-txt strong { color: var(--maroon); font-size: 15px; display: block; }
        .vinayagar-page .agenda-txt span { color: var(--muted); font-size: 13.5px; }
        @media(max-width: 920px) { .vinayagar-page .event-grid { grid-template-columns: 1fr 1fr; } }
        @media(max-width: 560px) {
          .vinayagar-page .event-grid { grid-template-columns: 1fr; }
          .vinayagar-page .agenda-row { flex-direction: column; align-items: flex-start; gap: 4px; }
          .vinayagar-page .agenda-time { width: auto; }
        }

        /* ---------- Gallery ---------- */
        .vinayagar-page .gallery-head { display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 12px; margin-bottom: 36px; }
        .vinayagar-page .gallery-head h2 { font-size: 32px; font-weight: 800; }
        .vinayagar-page .gallery-head p { color: var(--muted); max-width: 440px; font-size: 14.5px; }
        .vinayagar-page .gallery-grid { display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: 150px; gap: 16px; }
        .vinayagar-page .gallery-grid .g1 { grid-column: span 2; grid-row: span 2; }
        .vinayagar-page .gtile {
          border-radius: 14px; background: linear-gradient(135deg, #FBE9CC, #F5DCB2);
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;
          color: var(--muted); border: 1px dashed #E0C08C; padding: 16px; text-align: center;
          transition: transform .2s ease;
        }
        .vinayagar-page .gtile:hover { transform: scale(1.02); }
        .vinayagar-page .gtile svg { width: 28px; height: 28px; opacity: .7; color: var(--maroon); }
        .vinayagar-page .gtile span { font-size: 13px; font-weight: 700; color: var(--maroon); }
        .vinayagar-page .gtile small { font-size: 11.5px; color: var(--muted); }
        @media(max-width: 720px) {
          .vinayagar-page .gallery-grid { grid-template-columns: repeat(2, 1fr); }
          .vinayagar-page .gallery-grid .g1 { grid-column: span 2; grid-row: span 1; }
        }

        /* ---------- Why join ---------- */
        .vinayagar-page .why { background: var(--panel); border-bottom: 1px solid var(--line); }
        .vinayagar-page .why-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; margin-top: 44px; }
        .vinayagar-page .wcard { background: var(--cream); border: 1px solid var(--line); border-radius: var(--radius); padding: 28px; }
        .vinayagar-page .wcard .quote { font-size: 15px; color: var(--ink); margin-bottom: 20px; line-height: 1.6; }
        .vinayagar-page .wperson { display: flex; align-items: center; gap: 12px; }
        .vinayagar-page .wavatar {
          width: 42px; height: 42px; border-radius: 50%; color: #fff;
          display: flex; align-items: center; justify-content: center; font-weight: 700;
          font-family: 'Poppins', sans-serif; font-size: 15px; flex: none;
        }
        .vinayagar-page .wperson strong { display: block; font-size: 14px; color: var(--maroon); }
        .vinayagar-page .wperson span { font-size: 12.5px; color: var(--muted); }
        @media(max-width: 920px) { .vinayagar-page .why-grid { grid-template-columns: 1fr; } }

        /* ---------- FAQ ---------- */
        .vinayagar-page .faq-list { max-width: 760px; margin: 44px auto 0; }
        .vinayagar-page details { border-bottom: 1px solid var(--line); padding: 20px 4px; }
        .vinayagar-page details summary {
          list-style: none; cursor: pointer; display: flex; justify-content: space-between; align-items: center;
          font-weight: 700; font-size: 16px; color: var(--maroon); gap: 16px; user-select: none;
        }
        .vinayagar-page details summary::-webkit-details-marker { display: none; }
        .vinayagar-page details summary .plus {
          flex: none; width: 24px; height: 24px; border-radius: 50%; border: 1.5px solid var(--maroon);
          position: relative; transition: transform .2s ease;
        }
        .vinayagar-page details summary .plus::before,
        .vinayagar-page details summary .plus::after { content: ''; position: absolute; background: var(--maroon); }
        .vinayagar-page details summary .plus::before { left: 6px; right: 6px; top: 50%; height: 1.5px; transform: translateY(-50%); }
        .vinayagar-page details summary .plus::after { top: 6px; bottom: 6px; left: 50%; width: 1.5px; transform: translateX(-50%); }
        .vinayagar-page details[open] summary .plus { transform: rotate(45deg); }
        .vinayagar-page details p { color: var(--muted); font-size: 14.5px; margin: 14px 0 0; max-width: 660px; line-height: 1.65; }

        /* ---------- CTA strip ---------- */
        .vinayagar-page .cta-strip { background: linear-gradient(120deg, var(--saffron), var(--gold)); text-align: center; }
        .vinayagar-page .cta-strip h2 { color: #fff; font-size: 30px; font-weight: 800; }
        .vinayagar-page .cta-strip p { color: #FFF1DC; margin: 12px 0 30px; font-size: 16px; }

        /* ---------- Footer ---------- */
        .vinayagar-page footer {
          background: #2B1B12; color: #C9B8A6; padding: 60px 0 28px; border-top: 5px solid transparent;
          border-image: linear-gradient(90deg, #E8720C, #0E7A5B, #C43D6B, #C9972B, #7A1B2B) 1;
        }
        .vinayagar-page .foot-grid { display: grid; grid-template-columns: 1.3fr 1fr 1fr; gap: 36px; }
        .vinayagar-page .foot-logo { height: 36px; filter: brightness(0) invert(1); margin-bottom: 14px; }
        .vinayagar-page .foot-grid p { font-size: 13.5px; line-height: 1.7; color: #B3A08C; }
        .vinayagar-page .foot-col h5 { color: #fff; font-size: 13px; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 16px; }
        .vinayagar-page .foot-col a { display: block; font-size: 14px; color: #C9B8A6; margin-bottom: 10px; }
        .vinayagar-page .foot-col a:hover { color: #fff; }
        .vinayagar-page .foot-bottom {
          border-top: 1px solid rgba(255, 255, 255, .1); margin-top: 44px; padding-top: 22px;
          display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px; font-size: 12.5px; color: #8A7A68;
        }
        @media(max-width: 820px) { .vinayagar-page .foot-grid { grid-template-columns: 1fr 1fr; } }
        @media(max-width: 520px) { .vinayagar-page .foot-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* Floating Badge */}
      {showFloatingBadge && (
        <div className="floating-badge" onClick={scrollToRegister} title="Jump to registration">
          <span className="emoji">🎨</span>
          <span>Free Drawing Competition &bull; Register Now</span>
          <button
            type="button"
            className="fclose"
            onClick={(e) => {
              e.stopPropagation();
              setShowFloatingBadge(false);
            }}
            title="Dismiss badge"
          >
            &times;
          </button>
        </div>
      )}

      {/* Sticky Navigation */}
      <nav className="nav">
        <div className="wrap">
          <Link className="nav-logo" to="/home" title="WeGrow Home">
            <img src="/wegrow-logo.webp" alt="WeGrow Skill Campus & B School" onError={(e) => { e.target.src = '/logo.webp'; }} />
          </Link>
          <div className="nav-cta">
            <a className="nav-call" href="tel:+919363737332">
              <Phone size={17} />
              <span className="txt">93637 37332</span>
            </a>
            <a className="btn btn-primary" href="#register" onClick={scrollToRegister}>
              Register now
            </a>
          </div>
        </div>
      </nav>

      {/* Realtime Blinking Festive Toran & Fairy String Lights */}
      <FestiveToranAndLights />

      {/* Hero Section with Falling Flower Petals Shower */}
      <header className="hero" id="top">
        {/* Realtime Falling Flower Petals Animation */}
        <FallingFlowerPetals />

        <div className="hero-blob" aria-hidden="true" />
        <div className="hero-blob2" aria-hidden="true" />
        <div className="hero-blob3" aria-hidden="true" />
        <div className="wrap">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="dot" /> WeGrow Skill Campus &amp; B School presents
            </span>
            <h1>
              Vinayagar Chaturthi<br />
              <span className="accent">Drawing</span> Competition
            </h1>
            <p className="hero-tag">
              Celebrate Vinayagar Chaturthi with colour and creativity. An open drawing competition for students of every college and every degree — pick up your pencils and bring Lord Vinayagar to life on paper.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#register" onClick={scrollToRegister}>
                Register now
              </a>
            </div>
            <ul className="hero-meta">
              <li>
                <Calendar size={17} /> 14 September 2026
              </li>
              <li>
                <MapPin size={17} /> WeGrow B School, Sivakasi
              </li>
              <li>
                <Clock size={17} /> 11:00 AM &ndash; 1:00 PM
              </li>
            </ul>
          </div>

          <div className="hero-visual">
            <div className="hero-duo-wrap">
              {/* Divine Aura Backdrop */}
              <div className="duo-divine-aura" aria-hidden="true" />

              {/* Animated Mascot Drawing Card */}
              <div className="mascot-drawing-card">
                <img
                  className="mascot-drawing-img"
                  src="/events/mascot-drawing-vinayagar.jpg"
                  alt="WeGrow Squirrel Mascot actively drawing and painting Lord Vinayagar"
                  onError={(e) => { e.target.src = '/events/vinayagar-duo-full.png'; }}
                />

                {/* Live Realtime Drawing Brush & Canvas Shimmer Effect */}
                <div className="drawing-stroke-overlay" aria-hidden="true">
                  <div className="canvas-shimmer" />
                  <div className="active-brush-tip" title="Mascot Drawing Strokes" />
                </div>

                {/* Festive Drawing Badge */}
                <div className="mascot-drawing-badge">
                  <span className="live-dot" />
                  <span>Mascot Drawing Lord Vinayagar</span>
                  <span>🎨✨</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Competition Info Highlights */}
      {/* <section className="comp" id="highlights">
        <div className="wrap">
          <div className="comp-head">
            <span className="eyebrow"><span className="dot" /> Event Highlights</span>
            <h2>Showcase Your Artistic Devotion</h2>
            <p>
              Join hundreds of creative students across Tamil Nadu for an unforgettable morning of artistic celebration, divine inspiration, and friendly competition.
            </p>
          </div>

          <div className="comp-grid">
            <div className="comp-card">
              <div className="ic">
                <Users />
              </div>
              <h4>Open to All Colleges</h4>
              <p>Students from Arts, Science, Engineering, Diploma, or Business streams are eligible.</p>
            </div>

            <div className="comp-card">
              <div className="ic">
                <Palette />
              </div>
              <h4>Drawing Sheet Provided</h4>
              <p>Standard premium A3 drawing paper provided at check-in. Bring your favorite colors!</p>
            </div>

            <div className="comp-card">
              <div className="ic">
                <Trophy />
              </div>
              <h4>Prizes &amp; Mementos</h4>
              <p>Top 3 winners receive cash awards, shields, and merit citations from campus leadership.</p>
            </div>

            <div className="comp-card">
              <div className="ic">
                <Award />
              </div>
              <h4>Certified Participation</h4>
              <p>Every participant receives an authenticated Certificate of Participation.</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Theme Showcase */}
      {/* <section className="theme">
        <div className="rangoli-dots" aria-hidden="true" />
        <div className="wrap">
          <img
            className="theme-medallion"
            src="/events/vinayagar.jpg"
            alt="Lord Vinayagar Medallion"
            onError={(e) => { e.target.src = '/wegrow-mascot.webp'; }}
          />
          <span className="eyebrow"><span className="dot" /> Official Competition Theme</span>
          <h2>Lord Vinayagar in His Divine Splendour</h2>
          <p>
            Depict Lord Ganesha through your own unique artistic vision — traditional temple art, contemporary minimalism, ecological clay forms, or vibrant festive celebrations.
          </p>
        </div>
      </section> */}

      {/* Countdown & Registration Section */}
      <section className="countdown" id="register">
        <div className="wrap">
          <span className="eyebrow"><span className="dot" /> Ticking Down to the Event</span>
          <h2>Grand Event Starts In</h2>
          <p className="sub">Event Date: Monday, 14th September 2026 &bull; 11:00 AM IST at WeGrow B School, Sivakasi</p>

          <div className="timer">
            <div className="cell">
              <div className="num">{String(timeLeft.days).padStart(2, '0')}</div>
              <div className="lbl">Days</div>
            </div>
            <div className="cell">
              <div className="num">{String(timeLeft.hours).padStart(2, '0')}</div>
              <div className="lbl">Hours</div>
            </div>
            <div className="cell">
              <div className="num">{String(timeLeft.minutes).padStart(2, '0')}</div>
              <div className="lbl">Minutes</div>
            </div>
            <div className="cell">
              <div className="num">{String(timeLeft.seconds).padStart(2, '0')}</div>
              <div className="lbl">Seconds</div>
            </div>
          </div>

          {/* Registration Form Panel */}
          <div className="register-panel">
            {isRegistered ? (
              <div className="success-box">
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#0E7A5B', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h3>Registration Confirmed!</h3>

                {/* Unique Registration Number Card */}
                {confirmedReg?.registrationNumber && (
                  <div style={{ background: '#FFF8EC', border: '2px dashed #C9972B', borderRadius: '14px', padding: '14px 18px', margin: '14px 0', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#8A7863', fontWeight: 700 }}>
                      Official Registration ID
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: '#7A1B2B', letterSpacing: '1px', margin: '4px 0', fontFamily: 'Poppins, sans-serif' }}>
                      {confirmedReg.registrationNumber}
                    </div>
                    <button
                      type="button"
                      onClick={copyRegId}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#fff',
                        border: '1px solid #EFE1C8',
                        padding: '5px 14px',
                        borderRadius: '100px',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#7A1B2B',
                        cursor: 'pointer',
                        marginTop: '4px'
                      }}
                    >
                      {copied ? <Check size={14} color="#0E7A5B" /> : <Copy size={14} />}
                      {copied ? 'Copied to Clipboard!' : 'Copy Reg ID'}
                    </button>
                  </div>
                )}

                <p style={{ color: '#8A7863', fontSize: '14px', margin: '8px 0 16px', lineHeight: 1.5 }}>
                  Thank you, <strong>{confirmedReg?.fullName || formData.fullName}</strong>. Your entry for the <strong>Vinayagar Chaturthi Drawing Competition</strong> has been verified &amp; confirmed.
                </p>

                <div style={{ background: '#fff', border: '1px solid #EFE1C8', borderRadius: '12px', padding: '16px', textAlign: 'left', fontSize: '13.5px', marginBottom: '18px', lineHeight: 1.7 }}>
                  <div><strong>Participant:</strong> {confirmedReg?.fullName || formData.fullName}</div>
                  <div><strong>Phone:</strong> {confirmedReg?.phone || formData.phone}</div>
                  <div><strong>College:</strong> {confirmedReg?.collegeName || formData.college}</div>
                  <div><strong>Degree:</strong> {confirmedReg?.degreeAndYear || formData.degreeYear}</div>
                  <div><strong>Art Medium:</strong> {confirmedReg?.preferredArtMedium || formData.artMedium}</div>
                  <div><strong>Event Date:</strong> Monday, 14 September 2026</div>
                  <div><strong>Venue:</strong> WeGrow B School, Sivakasi</div>
                  <div><strong>Reporting Time:</strong> 10:00 AM (Competition: 11:00 AM &ndash; 1:00 PM)</div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setIsRegistered(false);
                    setConfirmedReg(null);
                    setFormData({
                      fullName: '',
                      phone: '',
                      email: '',
                      college: '',
                      degreeYear: '',
                      artMedium: 'Color Pencils & Oil Pastels',
                      notes: ''
                    });
                  }}
                  style={{ width: '100%', fontSize: '14px' }}
                >
                  Register Another Student
                </button>
              </div>
            ) : (
              <>
                <h3>Participant Registration</h3>
                <p className="note">100% Free Entry &bull; A3 Sheets Provided &bull; Open to All Degree &amp; College Students</p>

                <form onSubmit={handleFormSubmit}>
                  <div className="field">
                    <label>
                      Full Name <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="e.g. S. Karthikeyan"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="field">
                    <label>
                      WhatsApp / Mobile Number <span className="req">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="field">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="e.g. karthik@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="field">
                    <label>
                      College / Institution Name <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      name="college"
                      placeholder="e.g. Ayya Nadar Janaki Ammal College"
                      value={formData.college}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="field">
                    <label>
                      Degree &amp; Year of Study <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      name="degreeYear"
                      placeholder="e.g. B.Com (General) - 2nd Year"
                      value={formData.degreeYear}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="field">
                    <label>Preferred Art Medium</label>
                    <select
                      name="artMedium"
                      value={formData.artMedium}
                      onChange={handleInputChange}
                    >
                      <option value="Color Pencils & Oil Pastels">Color Pencils &amp; Oil Pastels</option>
                      <option value="Pencil Shading / Charcoal">Pencil Shading / Charcoal</option>
                      <option value="Watercolors / Poster Colors">Watercolors / Poster Colors</option>
                      <option value="Acrylic on Paper">Acrylic on Paper</option>
                      <option value="Mixed Media">Mixed Media</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Confirming Entry...' : 'Submit Registration'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* About WeGrow Skill Campus */}
      {/* <section className="about">
        <div className="wrap">
          <div>
            <span className="eyebrow"><span className="dot" /> Campus Heritage</span>
            <h2>About WeGrow Skill Campus &amp; B School</h2>
            <p>
              WeGrow Skill Campus &amp; B School in Sivakasi is a modern educational powerhouse dedicated to bridging academic learning with real-world entrepreneurial, design, and practical industry skills.
            </p>
            <p>
              Beyond corporate diplomas and management curricula, WeGrow actively celebrates Indian festivals and cultural expression, creating platforms where youth from all colleges can unleash their innate talents.
            </p>

            <div className="pillars">
              <div className="pillar">
                <div className="pillar-num">01</div>
                <h4>Creative Arts</h4>
                <p>Nurturing visual arts, design aesthetics, and holistic storytelling.</p>
              </div>
              <div className="pillar">
                <div className="pillar-num">02</div>
                <h4>Skill Campus</h4>
                <p>Industry-oriented skill development, tech workshops, and hands-on masterclasses.</p>
              </div>
              <div className="pillar">
                <div className="pillar-num">03</div>
                <h4>Community Hub</h4>
                <p>Connecting students, young founders, and creators across Tamil Nadu.</p>
              </div>
            </div>
          </div>

          <div>
            <div style={{ background: '#FDF6E7', border: '1px solid var(--line)', borderRadius: '20px', padding: '32px', textAlign: 'center' }}>
              <img
                src="/events/vinayagar.jpg"
                alt="WeGrow Campus Event"
                style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: '14px', marginBottom: '20px' }}
                onError={(e) => { e.target.src = '/wegrow-mascot.webp'; }}
              />
              <h3 style={{ fontSize: '20px', color: 'var(--maroon)', marginBottom: '8px' }}>
                WeGrow B School, Sivakasi Campus
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--muted)', margin: 0 }}>
                193/1A, Ground Floor, Ayyappan Kovil Opp. Police Station Road, Sivakasi &ndash; 626 123
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Event Details & Agenda */}
      {/* <section className="event" id="event-details">
        <div className="wrap">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
            <span className="eyebrow"><span className="dot" /> Event Schedule</span>
            <h2>Competition Plan &amp; Timetable</h2>
            <p style={{ color: 'var(--muted)', fontSize: '16px', marginTop: '10px' }}>
              Mark your calendar for Monday, 14 September 2026. Here is the planned schedule from check-in to awards.
            </p>
          </div>

          <div className="event-grid">
            <div className="event-card">
              <Calendar />
              <h4>Date</h4>
              <p>Monday, 14 September 2026</p>
            </div>
            <div className="event-card">
              <Clock />
              <h4>Reporting Time</h4>
              <p>10:00 AM IST (Desk check-in)</p>
            </div>
            <div className="event-card">
              <Palette />
              <h4>Drawing Window</h4>
              <p>11:00 AM &ndash; 1:00 PM (2 Hours)</p>
            </div>
            <div className="event-card">
              <MapPin />
              <h4>Venue</h4>
              <p>WeGrow B School Main Hall, Sivakasi</p>
            </div>
          </div>

          <div className="agenda">
            <div className="agenda-row">
              <div className="agenda-time">10:00 &ndash; 10:45 AM</div>
              <div className="agenda-txt">
                <strong>Reporting, Desk Verification &amp; A3 Sheet Distribution</strong>
                <span>Participants collect official stamped A3 drawing sheets and are seated in the competition hall.</span>
              </div>
            </div>

            <div className="agenda-row">
              <div className="agenda-time">10:45 &ndash; 11:00 AM</div>
              <div className="agenda-txt">
                <strong>Auspicious Lamp Lighting &amp; Welcome Address</strong>
                <span>Welcome address by WeGrow B School faculty and brief announcement of competition rules.</span>
              </div>
            </div>

            <div className="agenda-row">
              <div className="agenda-time">11:00 AM &ndash; 01:00 PM</div>
              <div className="agenda-txt">
                <strong>Live 2-Hour Drawing Competition</strong>
                <span>Participants bring Lord Vinayagar to life on paper using their chosen drawing mediums.</span>
              </div>
            </div>

            <div className="agenda-row">
              <div className="agenda-time">01:00 &ndash; 01:30 PM</div>
              <div className="agenda-txt">
                <strong>Submission &amp; Expert Jury Evaluation</strong>
                <span>Display of all artworks and review by distinguished fine-arts jury and guest judges.</span>
              </div>
            </div>

            <div className="agenda-row">
              <div className="agenda-time">01:30 &ndash; 02:00 PM</div>
              <div className="agenda-txt">
                <strong>Felicitation, Prize Distribution &amp; Photo Session</strong>
                <span>Cash awards, trophies for top winners, and certificates handed to every artist.</span>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Art Gallery / Showcase */}
      {/* <section style={{ background: 'var(--panel)', borderBottom: '1px solid var(--line)' }}>
        <div className="wrap">
          <div className="gallery-head">
            <div>
              <span className="eyebrow"><span className="dot" /> Art Inspiration</span>
              <h2>Visual Inspiration</h2>
            </div>
            <p>
              Explore diverse styles of drawing Ganesha — from intricate mandala art to radiant water-paintings.
            </p>
          </div>

          <div className="gallery-grid">
            <div className="gtile g1" style={{ background: 'linear-gradient(135deg, #FFF1D6, #FCE0B0)', borderColor: 'var(--saffron)' }}>
              <Palette size={36} color="var(--saffron)" />
              <span style={{ fontSize: '16px' }}>Divine Ganesha Portraiture</span>
              <small>Focus on expressive eyes, majestic trunk, and ornate crowns</small>
            </div>

            <div className="gtile">
              <Sparkles />
              <span>Mandala &amp; Zentangle</span>
              <small>Patterned geometric artistry</small>
            </div>

            <div className="gtile">
              <Award />
              <span>Clay &amp; Eco Forms</span>
              <small>Nature-friendly symbolism</small>
            </div>

            <div className="gtile">
              <Heart />
              <span>Pencil Shading</span>
              <small>Graphite light &amp; shadow mastery</small>
            </div>

            <div className="gtile">
              <Trophy />
              <span>Vibrant Watercolors</span>
              <small>Festive saffron, gold &amp; teal blends</small>
            </div>
          </div>
        </div>
      </section> */}

      {/* Why Join */}
      {/* <section className="why">
        <div className="wrap">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
            <span className="eyebrow"><span className="dot" /> Why You Should Compete</span>
            <h2>Celebrate, Compete &amp; Get Recognized</h2>
            <p style={{ color: 'var(--muted)', fontSize: '16px', marginTop: '10px' }}>
              Three great reasons to take part in this state-level collegiate art challenge.
            </p>
          </div>

          <div className="why-grid">
            <div className="wcard">
              <p className="quote">
                &ldquo;An authentic platform to showcase your artistic voice beyond your college walls. Win cash prizes and take home a prestigious trophy for your mantle.&rdquo;
              </p>
              <div className="wperson">
                <div className="wavatar">01</div>
                <div>
                  <strong>Awards &amp; Recognition</strong>
                  <span>Top 3 Cash Prizes + Mementos</span>
                </div>
              </div>
            </div>

            <div className="wcard">
              <p className="quote">
                &ldquo;Add a valuable state-level extracurricular achievement to your college resume and LinkedIn profile with an official WeGrow verified certificate.&rdquo;
              </p>
              <div className="wperson">
                <div className="wavatar">02</div>
                <div>
                  <strong>Resume &amp; Portfolio Value</strong>
                  <span>Verified Participation Certificate</span>
                </div>
              </div>
            </div>

            <div className="wcard">
              <p className="quote">
                &ldquo;Meet fellow artists, college creators, and design enthusiasts from across Tamil Nadu. Celebrate Vinayagar Chaturthi in high creative spirits.&rdquo;
              </p>
              <div className="wperson">
                <div className="wavatar">03</div>
                <div>
                  <strong>Festival Networking</strong>
                  <span>Community of Young Innovators</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* FAQ Section */}
      {/* <section style={{ background: 'var(--panel)', borderBottom: '1px solid var(--line)' }}>
        <div className="wrap">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
            <span className="eyebrow"><span className="dot" /> Got Questions?</span>
            <h2>Frequently Asked Questions</h2>
            <p style={{ color: 'var(--muted)', fontSize: '15px', marginTop: '10px' }}>
              Everything you need to know about participating in the competition.
            </p>
          </div>

          <div className="faq-list">
            {faqs.map((faq, index) => (
              <details key={index} open={openFaq === index} onClick={(e) => { e.preventDefault(); toggleFaq(index); }}>
                <summary>
                  <span>{faq.q}</span>
                  <div className="plus" />
                </summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Strip */}
      <section className="cta-strip">
        <div className="wrap">
          <h2>Ready to Bring Lord Vinayagar to Life on Paper?</h2>
          <p>Seats are limited per hall capacity. Register your spot today for free!</p>
          <a className="btn btn-light" href="#register" onClick={scrollToRegister}>
            Register Free Now &rarr;
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="wrap">
          <div className="foot-grid">
            <div>
              <img
                className="foot-logo"
                src="/wegrow-logo.webp"
                alt="WeGrow B School"
                onError={(e) => { e.target.src = '/logo.webp'; }}
              />
              <p>
                WeGrow Skill Campus &amp; B School is Sivakasi&rsquo;s premier skill innovation and management institute, equipping ambitious students with practical career pathways and creative confidence.
              </p>
            </div>

            <div className="foot-col">
              <h5>Event Venue &amp; Contact</h5>
              <p style={{ color: '#C9B8A6', fontSize: '13.5px', marginBottom: '8px' }}>
                WeGrow B School Campus<br />
                193/1A, Ground Floor, Ayyappan Kovil Opp. Police Station Road, Sivakasi &ndash; 626 123
              </p>
              <a href="tel:+919363737332">Phone: +91 93440 37331</a>
              <a href="mailto:wegrowskillcampus@gmail.com">Email: wegrowskillcampus@gmail.com</a>
            </div>

            <div className="foot-col">
              <h5>Quick Navigation</h5>
              <a href="#top">Back to Top</a>
              <a href="#highlights">Event Highlights</a>
              <a href="#event-details">Schedule &amp; Agenda</a>
              <a href="#register" onClick={scrollToRegister}>Registration Form</a>
              <Link to="/home">WeGrow Home</Link>
            </div>
          </div>

          <div className="foot-bottom">
            <span>&copy; {new Date().getFullYear()} WeGrow Skill Campus &amp; B School. All rights reserved.</span>
            <span>Vinayagar Chaturthi Drawing Competition &bull; Sivakasi</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
