import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import QRCode from 'qrcode';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  User,
  Mail,
  Phone,
  BookOpen,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  ShieldCheck,
  GraduationCap,
  Gift,
  Share2,
  Printer,
  RotateCw,
  Trophy,
  Flame,
  Award,
  Calendar,
  Volume2,
  VolumeX,
  ExternalLink,
  ChevronDown,
  Clock,
  Building,
  HelpCircle,
  Search,
  Download,
  Users,
  PartyPopper,
  Zap
} from 'lucide-react';
import { spinWheelApi, spinWinApi, REWARD_POOL } from '../services/spinWinApi';

// Web Audio API Sound Synthesizer (Realistic Ticks, Fanfares, Rockets, Anars, Chakris, Ladis & Booms - Optimized)
class SoundFX {
  constructor() {
    this.noiseBuffer = null;
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        try {
          const bufferSize = Math.floor(this.ctx.sampleRate * 0.2);
          this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
          const output = this.noiseBuffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
          }
        } catch {
          // Audio buffer fallback
        }
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTick() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800 + Math.random() * 200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Audio not permitted yet
    }
  }

  playFanfare() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.09);

        gain.gain.setValueAtTime(0, this.ctx.currentTime + i * 0.09);
        gain.gain.linearRampToValueAtTime(0.25, this.ctx.currentTime + i * 0.09 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.09 + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + i * 0.09);
        osc.stop(this.ctx.currentTime + i * 0.09 + 0.5);
      });
    } catch {
      // Audio not permitted yet
    }
  }

  playRocketWhistle() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = this.ctx.currentTime;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, t);
      osc.frequency.exponentialRampToValueAtTime(1900, t + 0.38);

      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.22);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.42);
    } catch {
      // Audio not permitted yet
    }
  }

  playCrackerBurst() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      // Deep resonant boom
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, t);
      osc.frequency.exponentialRampToValueAtTime(32, t + 0.32);

      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.34);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.34);

      // Crackling noise burst using cached buffer (no array allocation per pop)
      if (this.noiseBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.24, t + 0.02);
        noiseGain.gain.exponentialRampToValueAtTime(0.005, t + 0.22);
        noise.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);
        noise.start(t + 0.02);
      }
    } catch {
      // Audio not permitted yet
    }
  }

  playLadiPop() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx || !this.noiseBuffer) return;
      const t = this.ctx.currentTime;

      const noise = this.ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400 + Math.random() * 800, t);
      filter.Q.setValueAtTime(2.5, t);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(t);
    } catch {
      // Audio not permitted yet
    }
  }

  playAnarFountain() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx || !this.noiseBuffer) return;
      const t = this.ctx.currentTime;

      const noise = this.ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(2400, t);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.02, t);
      gain.gain.linearRampToValueAtTime(0.14, t + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(t);
    } catch {
      // Audio not permitted yet
    }
  }

  playChakriSound() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(280, t);
      osc.frequency.linearRampToValueAtTime(820, t + 0.9);
      osc.frequency.linearRampToValueAtTime(320, t + 2.0);

      gain.gain.setValueAtTime(0.02, t);
      gain.gain.linearRampToValueAtTime(0.16, t + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 2.0);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 2.0);
    } catch {
      // Audio not permitted yet
    }
  }
}

const sfx = new SoundFX();

// Course options matching WeGrow B-School curriculum
const WEGROW_COURSES = [
  'Full Stack Web & Cloud Development',
  'Applied AI, Machine Learning & Data Analytics',
  'Business Management & Entrepreneurship (MBA Track)',
  'Performance Digital Marketing & Growth',
  'Corporate Accounting, GST & Tally Prime',
  'AI Explorer — Tech & Robotics Foundation',
  'UI/UX Design, Figma & Product Prototyping',
  'Executive Leadership & Corporate Communications'
];

// Festive Firecracker Colors
const CRACKER_PALETTE = [
  '#F59E0B', // Golden Saffron
  '#FBBF24', // Yellow Gold
  '#EF4444', // Ruby Red
  '#F43F5E', // Rose Crimson
  '#10B981', // Emerald Green
  '#06B6D4', // Cyan Sky
  '#A855F7', // Royal Purple
  '#FFFBEB'  // Diamond Spark
];

export default function SpinAndWin() {
  // Step tracker: 1 = Register Form, 2 = Spin Wheel, 3 = Won Reward Pass
  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNo: '',
    fatherPhone: '',
    motherPhone: '',
    courseInterested: WEGROW_COURSES[0],
    preferredCampus: 'Sivakasi Campus (Opp. Police Station Rd)',
    educationLevel: 'College Student / Graduate',
    agreeRules: true
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Spin Wheel State
  const canvasRef = useRef(null);
  const crackerCanvasRef = useRef(null);
  const fireworksEngineRef = useRef({
    rockets: [],
    particles: [],
    fountains: [],
    chakris: [],
    ladis: [],
    flashAlpha: 0,
    animId: null,
    isRunning: false
  });

  const [isSpinning, setIsSpinning] = useState(false);
  const rotationAngleRef = useRef(0);
  const lastClickRef = useRef(0);
  const hasCelebratedRef = useRef(false);
  const [wonReward, setWonReward] = useState(null);
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherExpiry, setVoucherExpiry] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const loopRef = useRef(null);

  // Participant Data
  const [activeParticipant, setActiveParticipant] = useState(null);

  // Counselor Desk / Admin Modal State
  const [isCounselorView, setIsCounselorView] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [adminParticipants, setAdminParticipants] = useState([]);
  const [adminStats, setAdminStats] = useState({ total: 0, spun: 0, redeemed: 0 });

  // Wheel configuration matching user request: 5%, 10%, 15%, 20%, Gift, Free Demo Class
  const [slices, setSlices] = useState(REWARD_POOL);
  const numSlices = slices.length;
  const sliceAngle = (2 * Math.PI) / numSlices;

  // Fetch live backend rewards if available
  useEffect(() => {
    spinWheelApi.getRewards().then((res) => {
      if (Array.isArray(res) && res.length === 8) {
        setSlices(res);
      }
    });
  }, []);

  // Initialize Sound settings
  useEffect(() => {
    sfx.muted = !soundEnabled;
  }, [soundEnabled]);

  // Load existing session or voucher from URL query param (?voucher=...) or localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const voucherParam = urlParams.get('voucher');
    const emailParam = urlParams.get('email') || localStorage.getItem('wegrow_spin_last_email');

    // If student or counselor opened direct link from scanned QR code
    if (voucherParam) {
      spinWinApi.verifyVoucher(voucherParam).then((res) => {
        if (res && res.success && res.data) {
          const v = res.data;
          setWonReward(v.wonReward || v.reward || { title: v.rewardTitle || 'Skill Scholarship', valueText: v.voucherCode });
          setVoucherCode(voucherParam);
          setVoucherExpiry(v.voucherExpiry || '15 Days from Diwali');
          if (v.student) {
            setActiveParticipant(v.student);
            setFormData((prev) => ({
              ...prev,
              name: v.student.name || prev.name,
              email: v.student.email || prev.email,
              mobileNo: v.student.mobileNo || prev.mobileNo,
              preferredCampus: v.student.preferredCampus || prev.preferredCampus,
              courseInterested: v.student.courseInterested || prev.courseInterested
            }));
          }
          setStep(3);
        } else if (emailParam) {
          spinWinApi.getVoucherDetails(emailParam).then((vres) => {
            if (vres.success && vres.participant) {
              const p = vres.participant;
              setActiveParticipant(p);
              if (p.hasSpun && p.wonReward) {
                setWonReward(p.wonReward);
                setVoucherCode(p.voucherCode || voucherParam);
                setStep(3);
              }
            }
          });
        }
      }).catch((err) => console.warn('Voucher param verify error:', err));
      return;
    }

    if (emailParam) {
      spinWinApi.getVoucherDetails(emailParam).then((res) => {
        if (res.success && res.participant) {
          const p = res.participant;
          setActiveParticipant(p);
          setFormData((prev) => ({
            ...prev,
            name: p.name || prev.name,
            email: p.email || prev.email,
            mobileNo: p.mobileNo || prev.mobileNo,
            fatherPhone: p.fatherPhone || prev.fatherPhone,
            motherPhone: p.motherPhone || prev.motherPhone,
            courseInterested: p.courseInterested || prev.courseInterested,
            preferredCampus: p.preferredCampus || prev.preferredCampus
          }));

          if (p.hasSpun && p.wonReward) {
            setWonReward(p.wonReward);
            setVoucherCode(p.voucherCode);
            setVoucherExpiry(p.voucherExpiry || '15 Days from Diwali');
            setStep(3);
          } else {
            setStep(2);
          }
        }
      });
    }
  }, []);

  // Generate QR Code when reward is unlocked — encodes live public URL so phone camera scan opens voucher directly
  useEffect(() => {
    if (wonReward && voucherCode) {
      const studentEmail = activeParticipant?.email || formData.email || '';
      const liveVoucherUrl = `https://www.wegrowbschool.in/spin-and-win?voucher=${encodeURIComponent(voucherCode)}&email=${encodeURIComponent(studentEmail)}`;

      QRCode.toDataURL(liveVoucherUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#1e1b4b',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'H'
      })
        .then((url) => setQrCodeUrl(url))
        .catch((err) => console.error('QR Generation Error:', err));
    }
  }, [wonReward, voucherCode]);

  // ============================================================
  // FIRECRACKER CELEBRATION CANVAS ENGINE
  // ============================================================
  useEffect(() => {
    const canvas = crackerCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const engine = fireworksEngineRef.current;

    const loop = () => {
      // Check if any fireworks are actively running
      const hasActive =
        engine.rockets.length > 0 ||
        engine.particles.length > 0 ||
        engine.fountains.length > 0 ||
        engine.chakris.length > 0 ||
        engine.ladis.length > 0 ||
        engine.flashAlpha > 0.005;

      // Auto-sleep when idle to consume 0% CPU & 0% GPU!
      if (!hasActive) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        engine.isRunning = false;
        engine.animId = null;
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Flash overlay for celebration immersion
      if (engine.flashAlpha > 0.005) {
        ctx.fillStyle = `rgba(255, 230, 180, ${engine.flashAlpha})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        engine.flashAlpha *= 0.85;
      }

      ctx.save();
      ctx.globalCompositeOperation = 'lighter'; // Native additive blending (0 Gaussian blur overhead)

      // Update & Draw Fountains (Anars)
      for (let i = engine.fountains.length - 1; i >= 0; i--) {
        const f = engine.fountains[i];
        f.timer++;
        if (f.timer < f.duration) {
          const sparks = 3;
          for (let s = 0; s < sparks; s++) {
            const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.5;
            const speed = Math.random() * 9 + 5;
            const color = Math.random() > 0.25 ? '#FBBF24' : '#FFFBEB';
            engine.particles.push({
              x: f.x,
              y: f.y,
              prevX: f.x,
              prevY: f.y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              friction: 0.98,
              gravity: 0.3,
              alpha: 1,
              decay: 0.025,
              color,
              flicker: true,
              size: 2
            });
          }
        } else {
          engine.fountains.splice(i, 1);
        }
      }

      // Update & Draw Chakris
      for (let i = engine.chakris.length - 1; i >= 0; i--) {
        const c = engine.chakris[i];
        c.timer++;
        c.angle += 0.38;
        if (c.timer < c.duration) {
          for (let s = 0; s < 3; s++) {
            const sparkAngle = c.angle + (s * Math.PI) / 1.5 + (Math.random() - 0.5) * 0.3;
            const speed = 4 + Math.random() * 4;
            const color = CRACKER_PALETTE[Math.floor(Math.random() * CRACKER_PALETTE.length)];
            const cx = c.x + Math.cos(c.angle) * 16;
            const cy = c.y + Math.sin(c.angle) * 16;
            engine.particles.push({
              x: cx,
              y: cy,
              prevX: cx,
              prevY: cy,
              vx: Math.cos(sparkAngle) * speed,
              vy: Math.sin(sparkAngle) * speed,
              friction: 0.95,
              gravity: 0.04,
              alpha: 1,
              decay: 0.035,
              color,
              flicker: true,
              size: 2
            });
          }
        } else {
          engine.chakris.splice(i, 1);
        }
      }

      // Update & Draw Ladis
      for (let i = engine.ladis.length - 1; i >= 0; i--) {
        const l = engine.ladis[i];
        l.timer++;
        if (l.timer % l.popInterval === 0 && l.currentPop < l.totalPops) {
          const popY = l.y + l.currentPop * 14;
          sfx.playLadiPop();
          engine.flashAlpha = Math.max(engine.flashAlpha, 0.14);

          for (let s = 0; s < 8; s++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 1.2;
            engine.particles.push({
              x: l.x,
              y: popY,
              prevX: l.x,
              prevY: popY,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              friction: 0.94,
              gravity: 0.18,
              alpha: 1,
              decay: 0.03,
              color: Math.random() > 0.4 ? '#EF4444' : '#FBBF24',
              flicker: true,
              size: 2
            });
          }

          l.currentPop++;
          if (l.currentPop >= l.totalPops) {
            sfx.playCrackerBurst();
            engine.flashAlpha = 0.2;
            for (let p = 0; p < 20; p++) {
              const angle = Math.random() * Math.PI * 2;
              const speed = Math.random() * 5.5 + 1.5;
              engine.particles.push({
                x: l.x,
                y: popY,
                prevX: l.x,
                prevY: popY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                friction: 0.96,
                gravity: 0.18,
                alpha: 1,
                decay: 0.02,
                color: Math.random() > 0.5 ? '#EF4444' : '#F59E0B',
                flicker: true,
                size: 2.2
              });
            }
          }
        }
        if (l.currentPop >= l.totalPops && l.timer > l.totalPops * l.popInterval + 15) {
          engine.ladis.splice(i, 1);
        }
      }

      // Update & Draw Rockets
      for (let i = engine.rockets.length - 1; i >= 0; i--) {
        const r = engine.rockets[i];
        r.prevX = r.x;
        r.prevY = r.y;

        const vx = Math.cos(r.angle) * r.speed;
        const vy = Math.sin(r.angle) * r.speed;
        r.x += vx;
        r.y += vy;

        ctx.beginPath();
        ctx.moveTo(r.prevX, r.prevY);
        ctx.lineTo(r.x, r.y);
        ctx.strokeStyle = r.color;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        const currentDist = Math.hypot(r.targetX - r.x, r.targetY - r.y);
        if (currentDist <= r.speed || (vy > 0 && r.y >= r.targetY)) {
          sfx.playCrackerBurst();
          engine.flashAlpha = 0.18;
          const pCount = 28 + Math.floor(Math.random() * 8);
          for (let p = 0; p < pCount; p++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 6.5 + 1.5;
            engine.particles.push({
              x: r.targetX,
              y: r.targetY,
              prevX: r.targetX,
              prevY: r.targetY,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              friction: 0.95,
              gravity: 0.15,
              alpha: 1,
              decay: Math.random() * 0.018 + 0.015,
              color: r.color,
              flicker: true,
              size: 2.2
            });
          }
          engine.rockets.splice(i, 1);
        }
      }

      // Cap max particles to prevent any performance hit
      const maxParticles = 140;
      if (engine.particles.length > maxParticles) {
        engine.particles.splice(0, engine.particles.length - maxParticles);
      }

      // Update & Draw Explosion Particles (Fast batch stroke without shadowBlur)
      for (let i = engine.particles.length - 1; i >= 0; i--) {
        const p = engine.particles[i];
        p.prevX = p.x;
        p.prevY = p.y;
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          engine.particles.splice(i, 1);
          continue;
        }

        const displayAlpha = Math.max(p.alpha * (p.flicker ? 0.75 + Math.random() * 0.5 : 1), 0);
        ctx.globalAlpha = Math.min(displayAlpha, 1);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size || 2.2;
        ctx.beginPath();
        ctx.moveTo(p.prevX, p.prevY);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }

      ctx.restore();
      engine.animId = requestAnimationFrame(loop);
    };

    loopRef.current = loop;

    return () => {
      window.removeEventListener('resize', resize);
      if (engine.animId) cancelAnimationFrame(engine.animId);
      engine.isRunning = false;
      engine.animId = null;
    };
  }, []);

  // Wake up fireworks animation loop only when fireworks are actively playing
  const wakeUpFireworksEngine = () => {
    const engine = fireworksEngineRef.current;
    if (!engine.isRunning && loopRef.current) {
      engine.isRunning = true;
      engine.animId = requestAnimationFrame(loopRef.current);
    }
  };

  // Launch a single rocket firecracker
  const launchSingleRocket = (targetX, targetY, playSound = true) => {
    sfx.init();
    if (playSound) sfx.playRocketWhistle();

    const startX = targetX + (Math.random() - 0.5) * 80;
    const startY = window.innerHeight + 10;
    const color = CRACKER_PALETTE[Math.floor(Math.random() * CRACKER_PALETTE.length)];
    const angle = Math.atan2(targetY - startY, targetX - startX);
    const speed = 15 + Math.random() * 4;

    fireworksEngineRef.current.rockets.push({
      x: startX,
      y: startY,
      prevX: startX,
      prevY: startY,
      targetX,
      targetY,
      color,
      angle,
      speed
    });
    wakeUpFireworksEngine();
  };

  // Launch Anar (Flowerpot Fountain)
  const launchAnar = (baseX, baseY) => {
    sfx.init();
    sfx.playAnarFountain();
    const x = baseX || (120 + Math.random() * (window.innerWidth - 240));
    const y = baseY || (window.innerHeight - 30);
    fireworksEngineRef.current.fountains.push({
      x,
      y,
      duration: 80,
      timer: 0,
      color: '#FBBF24'
    });
    wakeUpFireworksEngine();
    toast('🪔 Golden Anar Fountain lit! Sparkling shower in motion!', { duration: 2500 });
  };

  // Launch Chakri (Ground Spinner)
  const launchChakri = (targetX, targetY) => {
    sfx.init();
    sfx.playChakriSound();
    const x = targetX || (window.innerWidth * 0.5 + (Math.random() - 0.5) * 300);
    const y = targetY || (window.innerHeight * 0.65);
    fireworksEngineRef.current.chakris.push({
      x,
      y,
      angle: 0,
      duration: 90,
      timer: 0
    });
    wakeUpFireworksEngine();
    toast('🎡 Zameen Chakri spinning! Whirring 360° sparks flying!', { duration: 2500 });
  };

  // Launch Ladi (Red Crackers String)
  const launchLadi = (targetX, targetY) => {
    sfx.init();
    const x = targetX || (window.innerWidth * 0.5 + (Math.random() - 0.5) * 200);
    const y = targetY || (window.innerHeight * 0.25);
    fireworksEngineRef.current.ladis.push({
      x,
      y,
      totalPops: 12,
      currentPop: 0,
      popInterval: 5,
      timer: 0
    });
    wakeUpFireworksEngine();
    toast('💥 Red Ladi ignited! Rapid-fire crackle chain!', { duration: 2500 });
  };

  // Handle Global Click on Background to burst cracker at cursor (throttled to avoid spam)
  useEffect(() => {
    const handleBackgroundClick = (e) => {
      const target = e.target;
      if (
        target.closest('button') ||
        target.closest('input') ||
        target.closest('select') ||
        target.closest('a') ||
        target.closest('label') ||
        target.closest('[role="button"]') ||
        target.closest('canvas')
      ) {
        return;
      }
      const now = Date.now();
      if (now - lastClickRef.current < 400) return;
      lastClickRef.current = now;
      launchSingleRocket(e.clientX, e.clientY, true);
    };

    window.addEventListener('click', handleBackgroundClick);
    return () => window.removeEventListener('click', handleBackgroundClick);
  }, []);

  // Launch Grand Diwali Celebration Barrage (4 crisp, non-blocking celebration rockets)
  const burstGrandDiwaliCrackers = () => {
    sfx.init();
    toast('💥 Happy Diwali! Bursting celebration crackers!', { icon: '🪔', duration: 3000 });
    const w = window.innerWidth;
    const h = window.innerHeight;

    const positions = [
      { x: w * 0.3, y: h * 0.25 },
      { x: w * 0.7, y: h * 0.22 },
      { x: w * 0.5, y: h * 0.18 },
      { x: w * 0.2, y: h * 0.3 }
    ];

    positions.forEach((pos, idx) => {
      setTimeout(() => {
        launchSingleRocket(pos.x, pos.y, true);
      }, idx * 350);
    });
  };

  // Trigger grand celebration when reaching Step 3 (won reward) - runs strictly once
  useEffect(() => {
    if (step === 3 && wonReward && !hasCelebratedRef.current) {
      hasCelebratedRef.current = true;
      const timer = setTimeout(() => {
        burstGrandDiwaliCrackers();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [step, wonReward]);

  // Draw Canvas Wheel (Accepts direct angle for 60fps spin without React re-renders)
  const drawWheel = useCallback((angle = rotationAngleRef.current) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 24;

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);

    // Draw Wheel Slices
    for (let i = 0; i < numSlices; i++) {
      const startAngle = i * sliceAngle;
      const endAngle = startAngle + sliceAngle;
      const slice = slices[i] || REWARD_POOL[i % REWARD_POOL.length];

      // Slice Background
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();

      // Create radial gradient for festive shimmer
      const grad = ctx.createRadialGradient(0, 0, 20, 0, 0, radius);
      grad.addColorStop(0, '#ffffff35');
      grad.addColorStop(0.3, slice.color || '#f59e0b');
      grad.addColorStop(1, slice.color || '#d97706');
      ctx.fillStyle = grad;
      ctx.fill();

      // Slice border / separator
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#FFE082';
      ctx.stroke();

      // Text and Icon
      ctx.save();
      const midAngle = startAngle + sliceAngle / 2;
      ctx.rotate(midAngle);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      // Outer festive tag / short text (e.g. 5% OFF, 10% OFF, 15% OFF, 20% OFF, GIFT, FREE DEMO)
      const displayShort = slice.shortTitle || slice.badge || slice.title || 'REWARD';
      const displayTag = slice.tag || slice.category || 'Diwali Special';

      ctx.fillStyle = slice.textColor || '#FFFFFF';
      ctx.font = 'bold 15px system-ui, sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 4;
      ctx.fillText(displayShort, radius - 28, 0);

      // Category / Value subtitle
      ctx.fillStyle = '#FFE57F';
      ctx.font = '700 10.5px system-ui, sans-serif';
      ctx.shadowBlur = 2;
      ctx.fillText(displayTag, radius - 28, 16);

      // Decorative Star/Dot near outer rim
      ctx.beginPath();
      ctx.arc(radius - 12, 0, 3.5, 0, 2 * Math.PI);
      ctx.fillStyle = '#FFF8E1';
      ctx.fill();

      ctx.restore();
    }

    // Outer Golden Ring with LED Studs
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#F59E0B';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, radius + 7, 0, 2 * Math.PI);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#D97706';
    ctx.stroke();

    // Draw Outer Lights / Studs
    const numBulbs = 24;
    for (let b = 0; b < numBulbs; b++) {
      const bAngle = (b * 2 * Math.PI) / numBulbs;
      const bx = (radius + 1) * Math.cos(bAngle);
      const by = (radius + 1) * Math.sin(bAngle);

      ctx.beginPath();
      ctx.arc(bx, by, 4, 0, 2 * Math.PI);
      ctx.fillStyle = b % 2 === 0 ? '#FEF08A' : '#F43F5E';
      ctx.shadowColor = '#FBBF24';
      ctx.shadowBlur = 6;
      ctx.fill();
    }

    // Central Wheel Hub (Diwali Diya theme)
    ctx.beginPath();
    ctx.arc(0, 0, 46, 0, 2 * Math.PI);
    const centerGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, 46);
    centerGrad.addColorStop(0, '#FFFBEB');
    centerGrad.addColorStop(0.5, '#F59E0B');
    centerGrad.addColorStop(1, '#92400E');
    ctx.fillStyle = centerGrad;
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#FFE082';
    ctx.stroke();

    // Central Text / Diya icon
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#78350F';
    ctx.font = '900 13px system-ui, sans-serif';
    ctx.shadowBlur = 0;
    ctx.fillText('WEGROW', 0, -6);
    ctx.fillStyle = '#B45309';
    ctx.font = 'bold 9px system-ui, sans-serif';
    ctx.fillText('DIWALI', 0, 8);

    ctx.restore();

    // Top Pointer (Fixed at top pointing down)
    ctx.save();
    ctx.translate(centerX, 20);

    // Pointer shadow
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 3;

    // Pointer Triangle
    ctx.beginPath();
    ctx.moveTo(-18, -12);
    ctx.lineTo(18, -12);
    ctx.lineTo(0, 26);
    ctx.closePath();
    const ptrGrad = ctx.createLinearGradient(0, -12, 0, 26);
    ptrGrad.addColorStop(0, '#DC2626');
    ptrGrad.addColorStop(0.5, '#EF4444');
    ptrGrad.addColorStop(1, '#FBBF24');
    ctx.fillStyle = ptrGrad;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#FEF08A';
    ctx.stroke();

    // Pointer Jewel
    ctx.beginPath();
    ctx.arc(0, -3, 6, 0, 2 * Math.PI);
    ctx.fillStyle = '#FEF08A';
    ctx.fill();

    ctx.restore();
  }, [numSlices, sliceAngle, slices]);

  // Draw wheel once when Step 2 mounts or slices change
  useEffect(() => {
    if (step === 2) {
      const raf = requestAnimationFrame(() => drawWheel());
      return () => cancelAnimationFrame(raf);
    }
  }, [step, drawWheel]);

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'mobileNo' || name === 'fatherPhone' || name === 'motherPhone') {
      const clean = value.replace(/\D/g, '').slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: clean }));
      if (formErrors[name]) {
        setFormErrors((prev) => ({ ...prev, [name]: '' }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
      if (formErrors[name]) {
        setFormErrors((prev) => ({ ...prev, [name]: '' }));
      }
    }
  };

  // Helper: Copy Student mobile to Father's mobile
  const copyStudentToFather = () => {
    if (!formData.mobileNo) {
      toast.error('Please enter student mobile number first');
      return;
    }
    setFormData((prev) => ({ ...prev, fatherPhone: prev.mobileNo }));
    setFormErrors((prev) => ({ ...prev, fatherPhone: '' }));
    toast.success("Copied to Father's contact");
  };

  // Helper: Copy Father's/Student mobile to Mother's mobile
  const copyToMother = () => {
    const src = formData.fatherPhone || formData.mobileNo;
    if (!src) {
      toast.error('Please enter student or father mobile number first');
      return;
    }
    setFormData((prev) => ({ ...prev, motherPhone: src }));
    setFormErrors((prev) => ({ ...prev, motherPhone: '' }));
    toast.success("Copied to Mother's contact");
  };

  // Validate Step 1 Form
  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Please enter student full name';
    if (!formData.email.trim()) {
      errs.email = 'Please enter an email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    // Student Mobile Validation
    if (!formData.mobileNo) {
      errs.mobileNo = 'Student mobile number is required';
    } else if (formData.mobileNo.length !== 10) {
      errs.mobileNo = 'Please enter a valid 10-digit mobile number';
    } else if (!/^[6-9]\d{9}$/.test(formData.mobileNo)) {
      errs.mobileNo = 'Enter valid Indian mobile number starting with 6, 7, 8, or 9';
    }

    // Father's Mobile Validation
    if (!formData.fatherPhone) {
      errs.fatherPhone = "Father's contact number is required";
    } else if (formData.fatherPhone.length !== 10) {
      errs.fatherPhone = "Please enter a valid 10-digit father's number";
    } else if (!/^[6-9]\d{9}$/.test(formData.fatherPhone)) {
      errs.fatherPhone = 'Enter valid 10-digit number starting with 6, 7, 8, or 9';
    }

    // Mother's Mobile Validation
    if (!formData.motherPhone) {
      errs.motherPhone = "Mother's contact number is required";
    } else if (formData.motherPhone.length !== 10) {
      errs.motherPhone = "Please enter a valid 10-digit mother's number";
    } else if (!/^[6-9]\d{9}$/.test(formData.motherPhone)) {
      errs.motherPhone = 'Enter valid 10-digit number starting with 6, 7, 8, or 9';
    }

    // Notice: We ALLOW shared family numbers! No blocking error!
    if (!formData.agreeRules) {
      errs.agreeRules = 'Please accept the fair play and campus visit rules';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Check if family numbers are shared
  const isNumbersSame =
    (formData.mobileNo && formData.fatherPhone && formData.mobileNo === formData.fatherPhone) ||
    (formData.mobileNo && formData.motherPhone && formData.mobileNo === formData.motherPhone) ||
    (formData.fatherPhone && formData.motherPhone && formData.fatherPhone === formData.motherPhone);

  // Step 1: Submit Registration -> Directly unlock spin wheel (No OTP)
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors in the form before proceeding.');
      return;
    }

    const cleanEmail = formData.email.trim().toLowerCase();

    // Check localStorage fast guard for 1-email-1-spin
    const alreadySpunLocal = localStorage.getItem(`wegrow_spun_${cleanEmail}`);
    if (alreadySpunLocal) {
      toast.error('This email has already spun the wheel! Each student is eligible for 1 spin only.', {
        duration: 5000,
        icon: '🔒'
      });
      if (activeParticipant?.wonReward) {
        setWonReward(activeParticipant.wonReward);
        setVoucherCode(activeParticipant.voucherCode || '');
        setStep(3);
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await spinWheelApi.sendOtp({
        name: formData.name,
        email: cleanEmail,
        mobileNo: formData.mobileNo,
        fatherMobile: formData.fatherPhone,
        motherMobile: formData.motherPhone,
        courseInterested: formData.courseInterested,
        campusPreference: formData.preferredCampus
      });

      if (res.alreadySpun) {
        toast.error('This email has already spun the wheel! Each student is eligible for 1 spin only.', {
          icon: '🔒',
          duration: 6000
        });
        if (res.data) {
          setWonReward(res.data.wonReward || {
            title: res.data.rewardTitle || 'Course Scholarship',
            description: res.data.rewardDescription || 'Redeem your Diwali skill scholarship on visiting WeGrow B-School Campus.'
          });
          setVoucherCode(res.data.voucherCode || 'WGW-SPIN-ALREADY');
          if (res.data.qrCodeDataUrl) setQrCodeUrl(res.data.qrCodeDataUrl);
        }
        localStorage.setItem(`wegrow_spun_${cleanEmail}`, 'true');
        setStep(3);
        setIsSubmitting(false);
        return;
      }

      if (res.success || res.canSpin) {
        toast.success('Registration successful! The Spin Wheel is unlocked!', { icon: '🎡' });
        localStorage.setItem('wegrow_spin_last_email', cleanEmail);
        setActiveParticipant(res.data?.student || { ...formData, email: cleanEmail });
        setStep(2);
      } else {
        toast.error(res.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      toast.error('Something went wrong. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Trigger Spin (Strict 1-spin-per-email policy)
  const handleSpinNow = async () => {
    if (isSpinning) return;
    sfx.init();

    const cleanEmail = (formData.email || '').trim().toLowerCase();
    const alreadySpun =
      activeParticipant?.hasSpun ||
      localStorage.getItem(`wegrow_spun_${cleanEmail}`) === 'true';

    if (alreadySpun) {
      toast.error('You have already used your 1-time spin for this email!', { icon: '🔒' });
      if (activeParticipant?.wonReward) {
        setWonReward(activeParticipant.wonReward);
        setVoucherCode(activeParticipant.voucherCode || '');
        setStep(3);
      }
      return;
    }

    setIsSpinning(true);
    try {
      const res = await spinWheelApi.spinWheel(cleanEmail);
      if (!res.success || res.alreadySpun) {
        toast.error(res.message || 'This email has already spun the wheel!', { icon: '🔒' });
        if (res.data?.reward || res.data?.rewardTitle) {
          setWonReward(res.data.reward || { title: res.data.rewardTitle });
          setVoucherCode(res.data.voucherCode || '');
          setStep(3);
        }
        setIsSpinning(false);
        return;
      }

      const targetSliceIndex = res.data?.sectorIndex !== undefined
        ? res.data.sectorIndex
        : (res.sliceIndex !== undefined ? res.sliceIndex : 0);
      const targetReward = res.data?.reward || slices[targetSliceIndex] || REWARD_POOL[targetSliceIndex];
      const code = res.data?.voucherCode || res.voucherCode || 'WGW-SPIN-' + Math.floor(10000 + Math.random() * 90000);
      const qrUrl = res.data?.qrCodeDataUrl || '';

      const fullRotations = 6 + Math.floor(Math.random() * 2);
      const targetMidAngle = (targetSliceIndex + 0.5) * sliceAngle;
      const jitter = (Math.random() - 0.5) * (sliceAngle * 0.4);
      const finalAngle =
        2 * Math.PI * fullRotations +
        (3 * Math.PI) / 2 -
        targetMidAngle +
        jitter;

      const duration = 5200;
      const startTime = performance.now();
      const initialAngle = rotationAngleRef.current % (2 * Math.PI);
      let lastTickSlice = -1;

      const animateWheel = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeOut = 1 - Math.pow(1 - progress, 3.8);
        const currentAngle = initialAngle + (finalAngle - initialAngle) * easeOut;
        rotationAngleRef.current = currentAngle;
        drawWheel(currentAngle);

        const effectiveAngle = ((3 * Math.PI) / 2 - currentAngle) % (2 * Math.PI);
        const normalized = (effectiveAngle + 2 * Math.PI) % (2 * Math.PI);
        const currentSlice = Math.floor(normalized / sliceAngle);

        if (currentSlice !== lastTickSlice && progress < 0.98) {
          lastTickSlice = currentSlice;
          sfx.playTick();
        }

        if (progress < 1) {
          requestAnimationFrame(animateWheel);
        } else {
          setIsSpinning(false);
          // Mark as spun to enforce 1 email 1 spin
          localStorage.setItem(`wegrow_spun_${cleanEmail}`, 'true');
          setActiveParticipant((prev) => ({ ...(prev || {}), hasSpun: true }));
          setWonReward(targetReward);
          setVoucherCode(code);
          if (qrUrl) setQrCodeUrl(qrUrl);
          if (res.data?.student) setActiveParticipant(res.data.student);

          // Victory fanfare & instant grand cracker celebration!
          sfx.playFanfare();
          hasCelebratedRef.current = true;
          burstGrandDiwaliCrackers();

          toast.success(`🎉 BINGO! You won: ${targetReward.title}!`, {
            duration: 6000
          });

          setTimeout(() => {
            setStep(3);
          }, 800);
        }
      };

      requestAnimationFrame(animateWheel);
    } catch (err) {
      console.error('Spin error:', err);
      toast.error('Failed to spin. Please try again.');
      setIsSpinning(false);
    }
  };

  // Copy Voucher Code
  const handleCopyCode = () => {
    if (!voucherCode) return;
    navigator.clipboard.writeText(voucherCode);
    setCopiedCode(true);
    toast.success('Voucher code copied to clipboard!');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // Share on WhatsApp
  const handleWhatsAppShare = () => {
    const text = `🎉 I just won an exclusive Diwali Skill Reward at WeGrow B-School!\n\n🏆 Reward: ${wonReward?.title} (${wonReward?.valueText || ''})\n🎫 Voucher Code: ${voucherCode}\n🏫 Campus: ${activeParticipant?.preferredCampus || formData.preferredCampus}\n\nCelebrate Diwali by upgrading your career skills! Spin the wheel at: https://www.wegrowbschool.in/spin-and-win`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Print Voucher Pass
  const handlePrintPass = () => {
    window.print();
  };

  // Counselor Desk Admin Logic
  const handleOpenCounselorDesk = async () => {
    setIsCounselorView(true);
    const data = await spinWinApi.getAllParticipants();
    setAdminParticipants(data.participants || []);
    setAdminStats({
      total: data.totalCount || 0,
      spun: data.spunCount || 0,
      redeemed: data.redeemedCount || 0
    });
  };

  const handleRedeemVoucher = async (code) => {
    const res = await spinWinApi.redeemAtCampus(
      code,
      formData.preferredCampus,
      'Campus Receptionist'
    );
    if (res.success) {
      toast.success(res.message);
      handleOpenCounselorDesk();
    } else {
      toast.error(res.message);
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    if (!adminParticipants.length) {
      toast.error('No participant records to export');
      return;
    }
    const headers = [
      'Name',
      'Email',
      'Student Mobile',
      'Father Mobile',
      'Mother Mobile',
      'Course',
      'Campus',
      'Voucher Code',
      'Reward Title',
      'Status',
      'Created At'
    ];
    const rows = adminParticipants.map((p) => [
      `"${p.name || ''}"`,
      `"${p.email || ''}"`,
      `"${p.mobileNo || ''}"`,
      `"${p.fatherPhone || ''}"`,
      `"${p.motherPhone || ''}"`,
      `"${p.courseInterested || ''}"`,
      `"${p.preferredCampus || ''}"`,
      `"${p.voucherCode || 'Not Spun'}"`,
      `"${p.wonReward?.title || 'None'}"`,
      `"${p.isRedeemed ? 'Redeemed' : p.hasSpun ? 'Spun (Pending Visit)' : 'Registered'}"`,
      `"${new Date(p.createdAt || Date.now()).toLocaleDateString()}"`
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `WeGrow_SpinWin_Students_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV exported successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#24060F] via-[#1A040B] to-[#0E0206] text-slate-100 font-sans selection:bg-amber-500 selection:text-white relative overflow-x-hidden">
      <Toaster position="top-center" reverseOrder={false} />

      {/* ============================================================ */}
      {/* FULLSCREEN CELEBRATION FIRECRACKERS CANVAS (CLICKABLE)       */}
      {/* ============================================================ */}
      <canvas
        ref={crackerCanvasRef}
        className="fixed inset-0 pointer-events-none z-30"
        title="Diwali Fireworks Canvas"
      />

      {/* ============================================================ */}
      {/* FESTIVE DIWALI CELEBRATION AMBIENCE & ANIMATIONS            */}
      {/* ============================================================ */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Warm Golden-Crimson Glow Auras using fast radial gradients (0 Gaussian blur passes) */}
        <div 
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-[750px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(245, 158, 11, 0.2) 0%, rgba(225, 29, 72, 0.12) 50%, transparent 75%)' }}
        />
        <div 
          className="absolute top-1/4 -left-20 w-80 h-80 rounded-full pointer-events-none opacity-60"
          style={{ background: 'radial-gradient(circle, rgba(217, 119, 6, 0.18) 0%, transparent 70%)' }}
        />
        <div 
          className="absolute top-1/2 -right-20 w-80 h-80 rounded-full pointer-events-none opacity-60"
          style={{ background: 'radial-gradient(circle, rgba(225, 29, 72, 0.18) 0%, transparent 70%)' }}
        />
        <div 
          className="absolute bottom-10 left-1/3 w-96 h-96 rounded-full pointer-events-none opacity-40"
          style={{ background: 'radial-gradient(circle, rgba(245, 158, 11, 0.14) 0%, transparent 70%)' }}
        />

        {/* Slowly Rotating Golden Rangoli Mandala Behind Content (GPU hardware-accelerated) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] opacity-10 pointer-events-none select-none will-change-transform">
          <svg viewBox="0 0 400 400" className="w-full h-full animate-[spin_120s_linear_infinite]">
            <circle cx="200" cy="200" r="190" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="6 6" />
            <circle cx="200" cy="200" r="160" fill="none" stroke="#FBBF24" strokeWidth="2" />
            <circle cx="200" cy="200" r="130" fill="none" stroke="#F59E0B" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="200" cy="200" r="100" fill="none" stroke="#FFE082" strokeWidth="2" />
            <circle cx="200" cy="200" r="70" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <g key={deg} transform={`rotate(${deg} 200 200)`}>
                <path d="M200 40 C210 100, 210 100, 200 160 C190 100, 190 100, 200 40 Z" fill="#F59E0B" opacity="0.35" />
                <circle cx="200" cy="30" r="4" fill="#FBBF24" />
              </g>
            ))}
          </svg>
        </div>

        {/* Floating Golden Sparks / Light Particles */}
        <div className="particles-container absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_6px_#f59e0b] animate-diwali-float will-change-transform"
              style={{
                left: `${(i * 8.33) % 100}%`,
                bottom: '-20px',
                animationDelay: `${(i * 0.8) % 6}s`,
                animationDuration: `${8 + (i % 4)}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* HANGING DIWALI MARIGOLD GARLAND (TORAN) & FAIRY LIGHTS ACROSS TOP */}
      <div className="relative z-20 w-full overflow-hidden select-none pointer-events-none">
        {/* Festive Fairy Lights String */}
        <div className="flex items-center justify-between px-2 py-1 max-w-full">
          {[...Array(28)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-[1px] h-3 bg-amber-400/40" />
              <div
                className={`w-2.5 h-2.5 rounded-full shadow-[0_0_10px_currentColor] transition-all duration-700 ${i % 3 === 0
                    ? 'bg-amber-300 text-amber-300 animate-diwali-twinkle'
                    : i % 3 === 1
                      ? 'bg-rose-400 text-rose-400 animate-diwali-twinkle'
                      : 'bg-yellow-400 text-yellow-400 animate-diwali-twinkle'
                  }`}
                style={{ animationDelay: `${(i * 0.2) % 2}s` }}
              />
            </div>
          ))}
        </div>

        {/* Marigold Flower Garland Loops */}
        <div className="flex justify-between items-start px-2 -mt-1 opacity-80">
          {[...Array(14)].map((_, i) => (
            <div key={i} className="flex items-center gap-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 shadow-sm inline-block" />
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 shadow-sm inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 shadow-sm inline-block" />
            </div>
          ))}
        </div>
      </div>

      {/* TOP FESTIVE BANNER / ACCREDITATION */}
      <div className="relative z-10 bg-gradient-to-r from-[#8B1E0F] via-[#B91C1C] to-[#8B1E0F] text-amber-100 py-2.5 px-4 shadow-lg text-xs md:text-sm font-semibold border-b border-amber-400/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 truncate">
            {/* Animated Diya Icon */}
            <span className="inline-block animate-diwali-flame text-lg">🪔</span>
            <span className="bg-amber-400/20 border border-amber-300/40 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider text-amber-200">
              Diwali Celebration Deal
            </span>
            <span className="truncate font-bold text-white drop-shadow-sm">
              WeGrow Skill Campus & B-School — 100% Guaranteed Learning Rewards & Scholarships!
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Standee QR Poster Link */}
            <Link
              to="/spin-qr"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-amber-200 text-xs font-bold transition border border-white/10"
              title="Print Event QR Standee Poster"
            >
              <span>📱</span>
              <span className="hidden sm:inline">Standee QR</span>
            </Link>

            <Link
              to="/"
              className="text-white hover:text-amber-200 text-xs font-bold transition"
            >
              Back to Home →
            </Link>
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <header className="relative z-10 pt-8 pb-4 px-4 text-center">
        <div className="max-w-4xl mx-auto relative">
          {/* Animated Decorative Diyas at Left & Right of Hero */}
          <div className="hidden md:flex absolute -left-12 top-4 flex-col items-center select-none">
            <div className="w-4 h-6 bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-200 rounded-full animate-diwali-flame blur-[1px] shadow-[0_0_15px_#f59e0b]" />
            <div className="w-10 h-4 bg-gradient-to-r from-amber-700 via-amber-500 to-amber-800 rounded-b-full border-t border-amber-300 shadow-md" />
          </div>

          <div className="hidden md:flex absolute -right-12 top-4 flex-col items-center select-none">
            <div className="w-4 h-6 bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-200 rounded-full animate-diwali-flame blur-[1px] shadow-[0_0_15px_#f59e0b]" />
            <div className="w-10 h-4 bg-gradient-to-r from-amber-700 via-amber-500 to-amber-800 rounded-b-full border-t border-amber-300 shadow-md" />
          </div>

          {/* Logo Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-amber-500/20 border border-amber-400/40 text-amber-300 text-xs md:text-sm font-bold mb-4 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
            <Flame className="w-4 h-4 text-amber-400 animate-diwali-flame" />
            <span>WEGROW SKILL CAMPUS • SIVAKASI & SRIVILLIPUTTUR</span>
            <span className="text-amber-400">🪔</span>
          </div>

          {/* Main Title Styled After Attached Image */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#FFFBEB] via-[#FDE047] to-[#EA580C] drop-shadow-[0_4px_22px_rgba(234,88,12,0.65)]">
            DIWALI DEAL!
          </h1>
          <p className="mt-1.5 text-2xl sm:text-3xl md:text-4xl font-extrabold text-amber-200 tracking-wide drop-shadow-md">
            SPIN THE WHEEL & WIN!
          </p>

          <p className="mt-3 text-amber-100/90 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-normal">
            Celebrate the Festival of Lights with career-transforming skills! Spin the wheel to unlock{' '}
            <span className="text-yellow-300 font-bold">5%, 10%, 15%, 20% Course Scholarships</span>,{' '}
            <span className="text-cyan-300 font-bold">Free Demo Class Passes</span>, and exclusive{' '}
            <span className="text-emerald-300 font-bold">Diwali Campus Gifts</span>!
            Visit our campus location to redeem your Diwali reward!
          </p>

          {/* Rules Pill (Anti-gambling guarantee) */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-amber-200/80">
            <span className="inline-flex items-center gap-1 bg-black/40 border border-amber-400/30 px-3 py-1 rounded-full backdrop-blur-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% Skill Rewards (No Cash Gambling)
            </span>
            <span className="inline-flex items-center gap-1 bg-black/40 border border-amber-400/30 px-3 py-1 rounded-full backdrop-blur-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              1 Spin Per Verified Student
            </span>
            <span className="inline-flex items-center gap-1 bg-black/40 border border-amber-400/30 px-3 py-1 rounded-full backdrop-blur-xs">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              Redeemable at WeGrow Campus
            </span>
          </div>
        </div>
      </header>

      {/* STEP PROGRESS INDICATOR */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-black/50 border border-white/10 -translate-y-1/2 z-0 rounded-full" />
          <div
            className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 -translate-y-1/2 z-0 transition-all duration-500 rounded-full shadow-[0_0_10px_#f59e0b]"
            style={{
              width:
                step === 1 ? '20%' : step === 2 ? '60%' : '100%'
            }}
          />

          {/* Step 1 Node */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${step >= 1
                  ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/30 shadow-[0_0_12px_#f59e0b]'
                  : 'bg-black/60 border border-white/20 text-slate-400'
                }`}
            >
              {step > 1 ? <Check className="w-4 h-4 stroke-[3]" /> : '1'}
            </div>
            <span className="text-[11px] font-bold mt-1.5 text-amber-200">Registration</span>
          </div>

          {/* Step 2 Node: Spin Wheel */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${step >= 2
                  ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/30 shadow-[0_0_12px_#f59e0b]'
                  : 'bg-black/60 border border-white/20 text-slate-400'
                }`}
            >
              {step > 2 ? <Check className="w-4 h-4 stroke-[3]" /> : '2'}
            </div>
            <span className="text-[11px] font-bold mt-1.5 text-amber-200">Spin Wheel</span>
          </div>

          {/* Step 3 Node: Campus Pass */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${step >= 3
                  ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/30 shadow-[0_0_15px_#f59e0b]'
                  : 'bg-black/60 border border-white/20 text-slate-400'
                }`}
            >
              <Trophy className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold mt-1.5 text-amber-200">Campus Pass</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 py-6 mb-16">
        {/* ======================================================== */}
        {/* STEP 1: STUDENT REGISTRATION FORM                        */}
        {/* ======================================================== */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto bg-gradient-to-b from-[#2B0914]/95 via-[#20060E]/95 to-[#150308]/95 border-2 border-amber-400/40 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(245,158,11,0.25)] backdrop-blur-md relative overflow-hidden">
            {/* Corner Diya Ambient Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="text-center mb-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold mb-2">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Eligibility: Open To All Students & Learners</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white drop-shadow-sm">
                Student Campus Registration
              </h2>
              <p className="text-xs sm:text-sm text-amber-100/80 mt-1">
                Enter your details to generate your verified student profile and unlock the Diwali Spinning Wheel.
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4 relative z-10">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-200 mb-1.5">
                  Student Full Name <span className="text-rose-400">*</span>
                </label>
                <div
                  className={`flex items-center rounded-xl border ${formErrors.name
                      ? 'border-rose-500 ring-1 ring-rose-500/40'
                      : 'border-amber-400/30 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/30'
                    } bg-[#140308] overflow-hidden transition-all shadow-inner`}
                >
                  <div className="flex items-center justify-center px-3.5 py-3 bg-black/40 border-r border-amber-400/20 text-amber-400 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter student full name"
                    className="w-full bg-transparent px-3.5 py-3 text-sm font-semibold text-white placeholder-amber-200/40 focus:outline-none"
                  />
                </div>
                {formErrors.name && (
                  <p className="text-xs text-rose-400 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{formErrors.name}</span>
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-200 mb-1.5">
                  Email Address (For Reward Voucher Delivery) <span className="text-rose-400">*</span>
                </label>
                <div
                  className={`flex items-center rounded-xl border ${formErrors.email
                      ? 'border-rose-500 ring-1 ring-rose-500/40'
                      : 'border-amber-400/30 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/30'
                    } bg-[#140308] overflow-hidden transition-all shadow-inner`}
                >
                  <div className="flex items-center justify-center px-3.5 py-3 bg-black/40 border-r border-amber-400/20 text-amber-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="student@example.com"
                    className="w-full bg-transparent px-3.5 py-3 text-sm font-semibold text-white placeholder-amber-200/40 focus:outline-none"
                  />
                </div>
                {formErrors.email && (
                  <p className="text-xs text-rose-400 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{formErrors.email}</span>
                  </p>
                )}
              </div>

              {/* Student Mobile No */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-200 mb-1.5">
                  Student Mobile Number <span className="text-rose-400">*</span>
                </label>
                <div
                  className={`flex items-center rounded-xl border ${formErrors.mobileNo
                      ? 'border-rose-500 ring-1 ring-rose-500/40'
                      : 'border-amber-400/30 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/30'
                    } bg-[#140308] overflow-hidden transition-all shadow-inner`}
                >
                  <div className="flex items-center gap-1.5 px-3.5 py-3 bg-black/40 border-r border-amber-400/20 text-amber-300 font-bold text-xs select-none shrink-0">
                    <Phone className="w-4 h-4 text-amber-400" />
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    name="mobileNo"
                    maxLength={10}
                    value={formData.mobileNo}
                    onChange={handleInputChange}
                    placeholder="98765 43210"
                    className="w-full bg-transparent px-3.5 py-3 text-sm font-semibold text-white placeholder-amber-200/40 focus:outline-none tracking-wide"
                  />
                </div>
                {formErrors.mobileNo && (
                  <p className="text-xs text-rose-400 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{formErrors.mobileNo}</span>
                  </p>
                )}
              </div>

              {/* Two Column: Father's Number & Mother's Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Father's Mobile */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-amber-200">
                      Father's Mobile No <span className="text-rose-400">*</span>
                    </label>
                    {formData.mobileNo && formData.fatherPhone !== formData.mobileNo && (
                      <button
                        type="button"
                        onClick={copyStudentToFather}
                        className="text-[10px] text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
                        title="Copy student mobile to father's contact"
                      >
                        Same as student
                      </button>
                    )}
                  </div>
                  <div
                    className={`flex items-center rounded-xl border ${formErrors.fatherPhone
                        ? 'border-rose-500 ring-1 ring-rose-500/40'
                        : 'border-amber-400/30 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/30'
                      } bg-[#140308] overflow-hidden transition-all shadow-inner`}
                  >
                    <div className="flex items-center gap-1.5 px-3 py-3 bg-black/40 border-r border-amber-400/20 text-amber-300 font-bold text-xs select-none shrink-0">
                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                      <span>+91</span>
                    </div>
                    <input
                      type="tel"
                      name="fatherPhone"
                      maxLength={10}
                      value={formData.fatherPhone}
                      onChange={handleInputChange}
                      placeholder="Father's 10 digits"
                      className="w-full bg-transparent px-3 py-3 text-sm font-semibold text-white placeholder-amber-200/40 focus:outline-none tracking-wide"
                    />
                  </div>
                  {formErrors.fatherPhone && (
                    <p className="text-xs text-rose-400 font-semibold mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{formErrors.fatherPhone}</span>
                    </p>
                  )}
                </div>

                {/* Mother's Mobile */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-amber-200">
                      Mother's Mobile No <span className="text-rose-400">*</span>
                    </label>
                    {(formData.fatherPhone || formData.mobileNo) && (
                      <button
                        type="button"
                        onClick={copyToMother}
                        className="text-[10px] text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
                        title="Copy contact number to mother's field"
                      >
                        Same as family
                      </button>
                    )}
                  </div>
                  <div
                    className={`flex items-center rounded-xl border ${formErrors.motherPhone
                        ? 'border-rose-500 ring-1 ring-rose-500/40'
                        : 'border-amber-400/30 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/30'
                      } bg-[#140308] overflow-hidden transition-all shadow-inner`}
                  >
                    <div className="flex items-center gap-1.5 px-3 py-3 bg-black/40 border-r border-amber-400/20 text-amber-300 font-bold text-xs select-none shrink-0">
                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                      <span>+91</span>
                    </div>
                    <input
                      type="tel"
                      name="motherPhone"
                      maxLength={10}
                      value={formData.motherPhone}
                      onChange={handleInputChange}
                      placeholder="Mother's 10 digits"
                      className="w-full bg-transparent px-3 py-3 text-sm font-semibold text-white placeholder-amber-200/40 focus:outline-none tracking-wide"
                    />
                  </div>
                  {formErrors.motherPhone && (
                    <p className="text-xs text-rose-400 font-semibold mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{formErrors.motherPhone}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Shared Family Number Helpful Confirmation Note */}
              {isNumbersSame && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-200 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    <strong>Shared Family Mobile:</strong> You have entered the same contact number.
                    Our campus admission desk will deliver your Diwali voucher codes & WhatsApp scholarship updates directly to this primary phone.
                  </span>
                </div>
              )}

              {/* Course Interested In */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-200 mb-1.5">
                  Which Course Are You Interested In? <span className="text-rose-400">*</span>
                </label>
                <div className="flex items-center rounded-xl border border-amber-400/30 bg-[#140308] overflow-hidden transition-all shadow-inner focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/30 relative">
                  <div className="flex items-center justify-center px-3.5 py-3 bg-black/40 border-r border-amber-400/20 text-amber-400 shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <select
                    name="courseInterested"
                    value={formData.courseInterested}
                    onChange={handleInputChange}
                    className="w-full bg-transparent px-3.5 py-3 text-sm font-semibold text-white focus:outline-none appearance-none cursor-pointer pr-10"
                  >
                    {WEGROW_COURSES.map((course) => (
                      <option key={course} value={course} className="bg-[#20060E] text-white">
                        {course}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-amber-300 pointer-events-none" />
                </div>
              </div>

              {/* Preferred Campus Location */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-200 mb-1.5">
                  Preferred WeGrow Campus To Visit & Redeem Offer <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${formData.preferredCampus.includes('Sivakasi')
                        ? 'bg-amber-500/20 border-amber-400 text-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                        : 'bg-[#140308] border-amber-400/20 text-slate-300 hover:border-amber-400/40'
                      }`}
                  >
                    <input
                      type="radio"
                      name="preferredCampus"
                      value="Sivakasi Campus (Opp. Police Station Rd)"
                      checked={formData.preferredCampus.includes('Sivakasi')}
                      onChange={handleInputChange}
                      className="mt-1 accent-amber-500"
                    />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>Sivakasi Campus</span>
                      </div>
                      <div className="text-[11px] text-amber-100/70 leading-tight mt-0.5">
                        Ayyapan Kovil Opp. Police Station Road, Sivakasi
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${formData.preferredCampus.includes('Srivilliputtur')
                        ? 'bg-amber-500/20 border-amber-400 text-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                        : 'bg-[#140308] border-amber-400/20 text-slate-300 hover:border-amber-400/40'
                      }`}
                  >
                    <input
                      type="radio"
                      name="preferredCampus"
                      value="Srivilliputtur Campus (North Car Street)"
                      checked={formData.preferredCampus.includes('Srivilliputtur')}
                      onChange={handleInputChange}
                      className="mt-1 accent-amber-500"
                    />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" />
                        <span>Srivilliputtur Campus</span>
                      </div>
                      <div className="text-[11px] text-amber-100/70 leading-tight mt-0.5">
                        129, North Car St, Opp. Bombay Textiles, Srivilliputtur
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Agree Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeRules"
                    checked={formData.agreeRules}
                    onChange={handleInputChange}
                    className="mt-1 rounded bg-[#140308] border-amber-500/40 text-amber-500 focus:ring-amber-400"
                  />
                  <span className="text-xs text-amber-100/80 leading-relaxed">
                    I agree to the Fair Play Rules: Rewards are strictly educational course
                    scholarships & passes. I understand I must present my voucher pass upon visiting
                    the WeGrow Campus to redeem my offer.
                  </span>
                </label>
                {formErrors.agreeRules && (
                  <p className="text-xs text-rose-400 font-semibold mt-1">{formErrors.agreeRules}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 active:scale-[0.99] transition shadow-[0_6px_25px_rgba(245,158,11,0.5)] border border-yellow-200 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Confirming Registration...</span>
                  </>
                ) : (
                  <>
                    <PartyPopper className="w-4 h-4 text-orange-800" />
                    <span>Proceed To Spin Wheel</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 2: INTERACTIVE DIWALI SPINNING WHEEL                */}
        {/* ======================================================== */}
        {step === 2 && (
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            {/* Student Banner */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 w-full max-w-lg">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Eligible Student: {formData.name} • {formData.email}</span>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-amber-300 hover:text-amber-200 underline font-semibold flex items-center gap-1 cursor-pointer transition"
                title="Change student or contact details"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Edit Details</span>
              </button>
            </div>

            {/* Wheel Canvas Container */}
            <div className="relative flex flex-col items-center justify-center my-4">
              {/* Outer Decorative Diya Glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500/30 via-orange-500/25 to-rose-500/30 blur-3xl pointer-events-none animate-pulse" />

              {/* Canvas Wheel */}
              <div className="relative p-2.5 rounded-full border-4 border-amber-400/50 bg-[#1A040B] shadow-[0_0_60px_rgba(245,158,11,0.4)]">
                <canvas
                  ref={canvasRef}
                  width={420}
                  height={420}
                  className="max-w-[85vw] sm:max-w-[400px] md:max-w-[420px] aspect-square rounded-full cursor-pointer select-none"
                  onClick={handleSpinNow}
                />
              </div>

              {/* Big "SPIN NOW" Button Below Wheel Styled After Reference Image */}
              <button
                type="button"
                onClick={handleSpinNow}
                disabled={isSpinning}
                className="mt-6 px-12 py-4 rounded-full font-black text-xl md:text-2xl uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,200,0,0.8)] border-3 border-yellow-200 disabled:opacity-60 disabled:hover:scale-100 cursor-pointer flex items-center gap-3 animate-pulse"
              >
                {isSpinning ? (
                  <>
                    <RotateCw className="w-6 h-6 animate-spin text-slate-950" />
                    <span>SPINNING...</span>
                  </>
                ) : (
                  <>
                    <Flame className="w-6 h-6 text-orange-700" />
                    <span>SPIN NOW</span>
                    <Sparkles className="w-6 h-6 text-yellow-800" />
                  </>
                )}
              </button>
            </div>

            {/* Rewards Legend / Preview */}
            <div className="w-full mt-10 p-5 rounded-3xl bg-black/40 border border-amber-400/30 backdrop-blur-md">
              <h3 className="text-center text-xs font-bold uppercase tracking-widest text-amber-300 mb-4 flex items-center justify-center gap-2">
                <span>🪔</span>
                <span>Exclusive Diwali Skill Reward Pool (Fixed Campus Budget)</span>
                <span>🪔</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                {slices.map((slice) => (
                  <div
                    key={slice.id}
                    className="p-3 rounded-2xl border border-amber-400/20 bg-gradient-to-b from-white/5 to-black/30 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: slice.color }}
                        />
                        <span className="text-xs font-extrabold text-white truncate">
                          {slice.shortTitle}
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-100/80 font-medium leading-tight">
                        {slice.title}
                      </p>
                    </div>
                    <div className="mt-2 text-[10px] font-bold text-amber-300">
                      {slice.valueText}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 3: WON REWARD PASS & VOUCHER                        */}
        {/* ======================================================== */}
        {step === 3 && wonReward && (
          <div className="max-w-2xl mx-auto">
            {/* Celebratory Banner */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-sm font-extrabold mb-3 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                <Trophy className="w-4 h-4 text-amber-300 animate-bounce" />
                <span>CONGRATULATIONS! DIWALI REWARD UNLOCKED</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white drop-shadow-md">
                You Won: {wonReward.title}!
              </h2>
              <p className="text-sm text-amber-100/90 mt-1 max-w-lg mx-auto">
                {wonReward.description}
              </p>
            </div>

            {/* GOLDEN DIGITAL VOUCHER PASS CARD (Printable) */}
            <div
              id="printableVoucher"
              className="bg-gradient-to-b from-[#2A0914] via-[#1E060E] to-[#120308] border-2 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(245,158,11,0.3)] relative overflow-hidden"
            >
              {/* Top Golden Rim Ribbon */}
              <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500" />

              {/* Watermark Logo */}
              <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none select-none text-white font-black text-9xl">
                WEGROW
              </div>

              {/* Voucher Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-amber-400/20">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-amber-400">
                    WeGrow Skill Campus & B-School
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                    Official Diwali Skill Pass
                  </h3>
                  <p className="text-xs text-amber-100/70">
                    Redeemable for campus enrollment & learning rewards
                  </p>
                </div>

                {/* Voucher Code Box */}
                <div className="bg-amber-500/15 border border-amber-400/50 rounded-2xl p-3 text-center sm:text-right shrink-0">
                  <span className="text-[10px] uppercase font-bold text-amber-200/70 block">
                    Voucher Pass Code
                  </span>
                  <span className="text-lg font-black tracking-wider text-amber-300 font-mono">
                    {voucherCode}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-200 transition cursor-pointer"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Voucher Content Grid */}
              <div className="py-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Details Column */}
                <div className="md:col-span-7 space-y-3">
                  <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-400/40">
                    <span className="text-[10px] font-bold uppercase text-amber-300 block">
                      Awarded Scholarship / Pass
                    </span>
                    <span className="text-lg font-extrabold text-white block mt-0.5">
                      {wonReward.title}
                    </span>
                    <span className="text-xs text-amber-200 font-semibold block">
                      {wonReward.valueText}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                      <span className="text-[10px] uppercase text-amber-200/60 block font-semibold">
                        Student Name
                      </span>
                      <span className="font-bold text-white truncate block">
                        {activeParticipant?.name || formData.name}
                      </span>
                    </div>

                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                      <span className="text-[10px] uppercase text-amber-200/60 block font-semibold">
                        Mobile Number
                      </span>
                      <span className="font-bold text-white block">
                        +91 {activeParticipant?.mobileNo || formData.mobileNo}
                      </span>
                    </div>

                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                      <span className="text-[10px] uppercase text-amber-200/60 block font-semibold">
                        Interested Course
                      </span>
                      <span className="font-bold text-white truncate block">
                        {activeParticipant?.courseInterested || formData.courseInterested}
                      </span>
                    </div>

                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                      <span className="text-[10px] uppercase text-amber-200/60 block font-semibold">
                        Redeem Valid Until
                      </span>
                      <span className="font-bold text-amber-300 block">
                        {voucherExpiry || '15 Days from Diwali'}
                      </span>
                    </div>
                  </div>

                  {/* Campus Location to Visit */}
                  <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-400/30 flex items-start gap-2.5 text-xs text-rose-200">
                    <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">
                        Campus Visit Location:
                      </span>
                      <span>
                        {activeParticipant?.preferredCampus || formData.preferredCampus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* QR Code Column */}
                <div className="md:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-black/40 border border-amber-400/30 text-center">
                  {qrCodeUrl ? (
                    <img
                      src={qrCodeUrl}
                      alt="Diwali Voucher QR"
                      className="w-44 h-44 rounded-xl border-4 border-amber-400 shadow-md bg-white p-1"
                    />
                  ) : (
                    <div className="w-44 h-44 rounded-xl bg-white/10 flex items-center justify-center text-xs">
                      Generating QR...
                    </div>
                  )}
                  <span className="text-[11px] text-amber-200 mt-2 font-medium">
                    Scan at Campus Reception to Claim
                  </span>
                </div>
              </div>

              {/* Campus Redemption Notice */}
              <div className="pt-4 border-t border-amber-400/20 text-xs text-amber-100/70 flex items-center justify-between">
                <span>
                  * Terms: Non-transferable. Valid on physical visit to WeGrow B-School Campus.
                </span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Spin
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={handlePrintPass}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition border border-white/10 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Print / Save Pass</span>
              </button>

              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="p-3 rounded-2xl bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-200 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition border border-emerald-500/30 cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-emerald-400" />
                <span>Share WhatsApp</span>
              </button>

              <a
                href={
                  formData.preferredCampus.includes('Srivilliputtur')
                    ? 'https://maps.google.com/?q=129+North+Car+Street+Srivilliputtur'
                    : 'https://maps.google.com/?q=WeGrow+B-School+Sivakasi'
                }
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-2xl bg-rose-600/25 hover:bg-rose-600/35 text-rose-200 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition border border-rose-500/30 cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-rose-400" />
                <span>Campus Location</span>
              </a>

              <a
                href="tel:+919344337331"
                className="p-3 rounded-2xl bg-amber-600/25 hover:bg-amber-600/35 text-amber-200 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition border border-amber-500/30 cursor-pointer"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Call Counselor</span>
              </a>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* COUNSELOR DESK / ADMIN VERIFICATION MODAL                */}
        {/* ======================================================== */}
        {isCounselorView && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#1C050E] border-2 border-amber-500/40 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl text-slate-100">
              {/* Modal Header */}
              <div className="p-5 border-b border-amber-400/20 flex items-center justify-between bg-gradient-to-r from-amber-950/60 to-rose-950/60">
                <div className="flex items-center gap-2.5">
                  <Building className="w-5 h-5 text-amber-400" />
                  <div>
                    <h3 className="font-extrabold text-base text-white">
                      WeGrow Campus Counselor Desk
                    </h3>
                    <p className="text-xs text-amber-200/70">
                      Verify & Redeem Student Diwali Vouchers Upon Campus Visit
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportCsv}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 text-xs font-bold transition flex items-center gap-1.5 border border-emerald-500/30 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>

                  <button
                    onClick={() => setIsCounselorView(false)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-3 p-4 bg-black/40 border-b border-white/5 text-center text-xs">
                <div>
                  <span className="text-amber-200/70 block text-[11px]">Total Students</span>
                  <span className="text-lg font-black text-white">{adminStats.total}</span>
                </div>
                <div>
                  <span className="text-amber-200/70 block text-[11px]">Completed Spins</span>
                  <span className="text-lg font-black text-amber-400">{adminStats.spun}</span>
                </div>
                <div>
                  <span className="text-amber-200/70 block text-[11px]">Campus Redemptions</span>
                  <span className="text-lg font-black text-emerald-400">{adminStats.redeemed}</span>
                </div>
              </div>

              {/* Search Bar */}
              <div className="p-4 border-b border-white/5">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Voucher Code, Student Name, Phone, or Email..."
                    className="w-full bg-[#120308] border border-amber-400/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Participants Table */}
              <div className="overflow-y-auto flex-1 p-4">
                {adminParticipants.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-xs">
                    No student registrations found yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {adminParticipants
                      .filter((p) => {
                        const q = searchQuery.toLowerCase();
                        return (
                          !q ||
                          p.name?.toLowerCase().includes(q) ||
                          p.email?.toLowerCase().includes(q) ||
                          p.mobileNo?.includes(q) ||
                          p.voucherCode?.toLowerCase().includes(q)
                        );
                      })
                      .map((p) => (
                        <div
                          key={p.id || p.email}
                          className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm">{p.name}</span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${p.isRedeemed
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : p.hasSpun
                                      ? 'bg-amber-500/20 text-amber-300'
                                      : 'bg-slate-700 text-slate-300'
                                  }`}
                              >
                                {p.isRedeemed ? 'Redeemed' : p.hasSpun ? 'Spun' : 'Registered'}
                              </span>
                            </div>
                            <div className="text-amber-100/70 text-[11px] mt-0.5">
                              {p.email} • Ph: {p.mobileNo} • Father: {p.fatherPhone || 'N/A'} • Mother: {p.motherPhone || 'N/A'}
                            </div>
                            <div className="text-amber-200 text-[11px] font-medium mt-1">
                              Interested Course: <strong>{p.courseInterested}</strong> • {p.preferredCampus}
                            </div>
                            {p.wonReward && (
                              <div className="text-white text-[11px] mt-1 font-semibold">
                                Won: <span className="text-amber-400">{p.wonReward.title}</span> (
                                {p.voucherCode})
                              </div>
                            )}
                          </div>

                          <div className="shrink-0">
                            {p.hasSpun && !p.isRedeemed && (
                              <button
                                onClick={() => handleRedeemVoucher(p.voucherCode)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs hover:bg-emerald-400 transition cursor-pointer"
                              >
                                Mark Redeemed
                              </button>
                            )}
                            {p.isRedeemed && (
                              <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Redeemed at Campus
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* CAMPUS VISITATION INFORMATION & FAQ */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 pb-16">
        <div className="bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-amber-500/15 border-2 border-amber-400/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
          <div className="text-center mb-6">
            <span className="text-xs uppercase font-extrabold tracking-widest text-amber-300">
              Redemption Locations
            </span>
            <h3 className="text-2xl font-black text-white mt-1">
              Visit WeGrow B-School To Claim Your Reward
            </h3>
            <p className="text-xs text-amber-100/80 mt-1 max-w-xl mx-auto">
              Our campus doors are open for all participating students. Meet our mentors, experience our labs, and enroll with your exclusive Diwali voucher!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sivakasi Branch */}
            <div className="p-4 rounded-2xl bg-black/50 border border-amber-400/30 text-xs text-amber-100/80">
              <div className="flex items-center gap-2 mb-2">
                <Building className="w-4 h-4 text-amber-400" />
                <span className="font-extrabold text-white text-sm">Sivakasi Campus</span>
              </div>
              <p className="leading-relaxed">
                WeGrow B-School, 193/1A, Ground Floor, Ayyapan Kovil Opp. Police Station Road, Sivakasi – 626 123
              </p>
              <div className="mt-3 flex items-center justify-between text-[11px] pt-2 border-t border-white/10">
                <span className="text-amber-300 font-bold">Ph: +91 93443 37331</span>
                <span className="text-amber-100/60">Mon - Sat: 10 AM - 7 PM</span>
              </div>
            </div>

            {/* Srivilliputtur Branch */}
            <div className="p-4 rounded-2xl bg-black/50 border border-rose-400/30 text-xs text-amber-100/80">
              <div className="flex items-center gap-2 mb-2">
                <Building className="w-4 h-4 text-rose-400" />
                <span className="font-extrabold text-white text-sm">Srivilliputtur Campus</span>
              </div>
              <p className="leading-relaxed">
                129, North Car Street, Opposite Bombay Textiles, Upstairs Pathras Kids & Gift Shop, Srivilliputtur – 626 125
              </p>
              <div className="mt-3 flex items-center justify-between text-[11px] pt-2 border-t border-white/10">
                <span className="text-rose-300 font-bold">Ph: +91 93633 37331</span>
                <span className="text-amber-100/60">Mon - Sat: 10 AM - 7 PM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DIWALI CELEBRATION CUSTOM CSS ANIMATIONS & AUTOFILL FIX */}
      <style>{`
        @keyframes diwaliFlame {
          0%, 100% {
            transform: scale(1) rotate(-1.5deg);
          }
          50% {
            transform: scale(1.12, 0.94) rotate(2deg);
          }
        }

        .animate-diwali-flame {
          animation: diwaliFlame 1.4s ease-in-out infinite;
          transform-origin: bottom center;
          filter: drop-shadow(0 0 8px #f59e0b);
          will-change: transform;
        }

        @keyframes diwaliTwinkle {
          0%, 100% { opacity: 0.4; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.15); }
        }

        .animate-diwali-twinkle {
          animation: diwaliTwinkle 2s ease-in-out infinite;
          will-change: transform, opacity;
        }

        @keyframes diwaliFloat {
          0% {
            transform: translate3d(0, 0, 0) scale(0.6);
            opacity: 0;
          }
          30% {
            opacity: 0.8;
          }
          70% {
            opacity: 0.6;
          }
          100% {
            transform: translate3d(0, -750px, 0) scale(1.1);
            opacity: 0;
          }
        }

        .animate-diwali-float {
          animation: diwaliFloat 9s linear infinite;
          will-change: transform, opacity;
        }

        @keyframes anarShower {
          0% {
            opacity: 0.5;
            transform: scaleY(0.6) scaleX(0.7);
          }
          50% {
            opacity: 1;
            transform: scaleY(1.3) scaleX(1.1);
            filter: drop-shadow(0 -10px 20px #f59e0b);
          }
          100% {
            opacity: 0.5;
            transform: scaleY(0.7) scaleX(0.8);
          }
        }

        .animate-anar-shower {
          animation: anarShower 0.35s ease-in-out infinite;
          transform-origin: bottom center;
        }

        /* Prevent Chrome Autofill from turning inputs white/light blue */
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px #140308 inset !important;
          -webkit-text-fill-color: #ffffff !important;
          caret-color: #f59e0b !important;
          transition: background-color 5000s ease-in-out 0s !important;
        }

        @media print {
          body * {
            visibility: hidden;
          }
          #printableVoucher, #printableVoucher * {
            visibility: visible;
          }
          #printableVoucher {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: #ffffff !important;
            color: #000000 !important;
            border: 2px solid #000000 !important;
          }
        }
      `}</style>
    </div>
  );
}
