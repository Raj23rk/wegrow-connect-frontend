import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { submitEventTeaserGuess } from '../services/api';

/**
 * EventTeaser Component (Single-file React JSX)
 * 
 * Images expected in your React project's `public/` directory:
 * - /question.png
 * - /answer_yes.png
 * - /answer_no.png
 * - /ChatGPT Image Sep 23, 2026, 09_49_26 PM.png
 * - /ChatGPT Image Sep 23, 2026, 09_54_58 PM.png
 */
export default function EventTeaser({
    onFormSubmit,
    questionBg = '/question.png',
    yesBg = '/answer_yes.png',
    noBg = '/answer_no.png',
    submittedImg = '/ChatGPT Image Sep 23, 2026, 09_49_26 PM.png',
    rejectedImg = '/ChatGPT Image Sep 23, 2026, 09_54_58 PM.png'
}) {
    // 'initial' | 'form' | 'submitted' | 'no'
    const [currentState, setCurrentState] = useState('initial');
    const [activeBg, setActiveBg] = useState('question'); // 'question' | 'yes' | 'no'
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        guess: ''
    });
    const [errors, setErrors] = useState({});
    const [lastSubmission, setLastSubmission] = useState(null);

    const canvasRef = useRef(null);
    const nameInputRef = useRef(null);

    // Smooth State Transition Handler
    const transitionTo = (nextState, bgType = 'question') => {
        if (currentState === nextState || isTransitioning) return;

        setIsTransitioning(true);
        setActiveBg(bgType);

        setTimeout(() => {
            setCurrentState(nextState);
            setIsTransitioning(false);

            if (nextState === 'form') {
                setTimeout(() => {
                    nameInputRef.current?.focus();
                }, 100);
            }
        }, 280);
    };

    // Form input change handler
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: false }));
        }
    };

    // Form submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = true;
        if (!formData.phone.trim()) newErrors.phone = true;
        if (!formData.email.trim()) newErrors.email = true;
        if (!formData.guess.trim()) newErrors.guess = true;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setIsSubmitting(true);
            await submitEventTeaserGuess({
                name: formData.name.trim(),
                phone: formData.phone.trim(),
                email: formData.email.trim(),
                guess: formData.guess.trim(),
                eventId: 'MYSTERY-EVENT-2026'
            });

            toast.success('Your guess has been locked successfully! 🎉');

            setLastSubmission({
                name: formData.name.trim(),
                guess: formData.guess.trim()
            });

            if (onFormSubmit) {
                onFormSubmit(formData);
            }

            transitionTo('submitted', 'yes');
        } catch (err) {
            console.error('Failed to submit event guess:', err);
            toast.error(err?.message || 'Failed to lock your guess. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Reset to initial screen
    const handleReset = () => {
        setFormData({ name: '', phone: '', email: '', guess: '' });
        setErrors({});
        transitionTo('initial', 'question');
    };

    // Canvas Golden Particle Atmosphere Animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        const PARTICLE_COUNT = 65;
        const particles = [];

        class GoldParticle {
            constructor() {
                this.reset(true);
            }

            reset(init = false) {
                this.x = Math.random() * width;
                this.y = init ? Math.random() * height : height + 20;
                this.size = Math.random() * 3 + 1;
                this.speedY = -(Math.random() * 0.45 + 0.15);
                this.speedX = (Math.random() - 0.5) * 0.35;
                this.alpha = Math.random() * 0.7 + 0.2;
                this.maxAlpha = this.alpha;
                this.twinkleSpeed = Math.random() * 0.03 + 0.01;
                this.twinkleFactor = Math.random() * Math.PI * 2;
                const hues = [42, 45, 48, 38];
                this.hue = hues[Math.floor(Math.random() * hues.length)];
            }

            update() {
                this.y += this.speedY;
                this.x += this.speedX + Math.sin(this.twinkleFactor) * 0.15;
                this.twinkleFactor += this.twinkleSpeed;
                this.currentAlpha = this.alpha * (0.6 + 0.4 * Math.sin(this.twinkleFactor));

                if (this.y < -20 || this.x < -20 || this.x > width + 20) {
                    this.reset(false);
                }
            }

            draw() {
                ctx.save();
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 95%, 65%, ${this.currentAlpha})`;
                ctx.shadowColor = `hsla(${this.hue}, 100%, 60%, 0.8)`;
                ctx.shadowBlur = this.size * 5;
                ctx.fill();

                if (this.size > 2.8 && this.currentAlpha > 0.5) {
                    ctx.strokeStyle = `rgba(255, 245, 200, ${this.currentAlpha * 0.6})`;
                    ctx.lineWidth = 0.75;
                    const ray = this.size * 2.2;
                    ctx.beginPath();
                    ctx.moveTo(this.x - ray, this.y);
                    ctx.lineTo(this.x + ray, this.y);
                    ctx.moveTo(this.x, this.y - ray);
                    ctx.lineTo(this.x, this.y + ray);
                    ctx.stroke();
                }
                ctx.restore();
            }
        }

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new GoldParticle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="event-teaser-root">
            {/* Import Google Fonts */}
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
            />

            {/* Full-Screen Background Container */}
            <div className="background-container">
                <div
                    className={`bg-layer ${activeBg === 'question' ? 'active' : ''}`}
                    style={{ backgroundImage: `url("${encodeURI(questionBg)}")` }}
                />
                <div
                    className={`bg-layer ${activeBg === 'yes' ? 'active' : ''}`}
                    style={{ backgroundImage: `url("${encodeURI(yesBg)}")` }}
                />
                <div
                    className={`bg-layer ${activeBg === 'no' ? 'active' : ''}`}
                    style={{ backgroundImage: `url("${encodeURI(noBg)}")` }}
                />
                <canvas ref={canvasRef} className="gold-particles-canvas" />
                <div className="bg-overlay" />
            </div>

            {/* Main Content Layout */}
            <main className="page-wrapper">
                <div className="left-spacer" aria-hidden="true" />

                <section className="teaser-panel-wrapper">
                    <div className="glass-card">
                        <div className="card-glow" aria-hidden="true" />

                        {/* 1. INITIAL STATE */}
                        {currentState === 'initial' && (
                            <div className={`panel-state ${isTransitioning ? 'exit' : 'active'}`}>
                                <div className="badge-pill">
                                    <span className="badge-dot" />
                                    <span>Mystery Reveal</span>
                                </div>

                                <h1 className="main-heading">
                                    Ready for the <span className="gradient-text">next event?</span>
                                </h1>

                                <p className="sub-line">
                                    Are you ready to discover what’s coming next?
                                </p>

                                <div className="button-group">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => transitionTo('form', 'yes')}
                                    >
                                        <span>YES, I’M READY</span>
                                        <svg
                                            className="btn-arrow"
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-outline"
                                        onClick={() => transitionTo('no', 'no')}
                                    >
                                        <span>NO, NOT YET</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* 2. FORM STATE */}
                        {currentState === 'form' && (
                            <div className={`panel-state ${isTransitioning ? 'exit' : 'active'}`}>
                                <div className="badge-pill badge-pill-warm">
                                    <span>VIP Access</span>
                                </div>

                                <h2 className="main-heading">Let’s see what’s next!</h2>

                                <p className="sub-line">
                                    Enter your details and place your secret guess.
                                </p>

                                <form className="event-form" onSubmit={handleSubmit} noValidate>
                                    <div className="input-field">
                                        <label htmlFor="userName">Full Name</label>
                                        <div className={`input-wrapper ${errors.name ? 'error' : ''}`}>
                                            <input
                                                ref={nameInputRef}
                                                type="text"
                                                id="userName"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="John Doe"
                                                autoComplete="name"
                                            />
                                            <svg
                                                className="field-icon"
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="input-row">
                                        <div className="input-field">
                                            <label htmlFor="userPhone">Phone Number</label>
                                            <div className={`input-wrapper ${errors.phone ? 'error' : ''}`}>
                                                <input
                                                    type="tel"
                                                    id="userPhone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    placeholder="+1 (555) 000-0000"
                                                    autoComplete="tel"
                                                />
                                                <svg
                                                    className="field-icon"
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                                </svg>
                                            </div>
                                        </div>

                                        <div className="input-field">
                                            <label htmlFor="userEmail">Email Address</label>
                                            <div className={`input-wrapper ${errors.email ? 'error' : ''}`}>
                                                <input
                                                    type="email"
                                                    id="userEmail"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    placeholder="john@example.com"
                                                    autoComplete="email"
                                                />
                                                <svg
                                                    className="field-icon"
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                                    <polyline points="22,6 12,13 2,6" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="input-field">
                                        <label htmlFor="userGuess">Guess the Event</label>
                                        <div className={`input-wrapper ${errors.guess ? 'error' : ''}`}>
                                            <input
                                                type="text"
                                                id="userGuess"
                                                name="guess"
                                                value={formData.guess}
                                                onChange={handleInputChange}
                                                placeholder="What surprise is awaiting you?"
                                            />
                                            <svg
                                                className="field-icon"
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <circle cx="12" cy="12" r="10" />
                                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                                <line x1="12" y1="17" x2="12.01" y2="17" />
                                            </svg>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-block"
                                        disabled={isSubmitting}
                                        style={{ opacity: isSubmitting ? 0.75 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                                    >
                                        <span>{isSubmitting ? 'Locking Guess...' : 'Lock Your Guess'}</span>
                                        {isSubmitting ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin ml-2" />
                                        ) : (
                                            <svg
                                                className="btn-arrow"
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <line x1="22" y1="2" x2="11" y2="13" />
                                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                            </svg>
                                        )}
                                    </button>
                                </form>

                                <button
                                    type="button"
                                    className="btn-back"
                                    onClick={() => transitionTo('initial', 'question')}
                                >
                                    &larr; Back to question
                                </button>
                            </div>
                        )}

                        {/* 3. SUCCESS / SUBMITTED STATE */}
                        {currentState === 'submitted' && (
                            <div className={`panel-state ${isTransitioning ? 'exit' : 'active'}`}>
                                <div className="submitted-mobile-hero">
                                    <img
                                        src={submittedImg}
                                        alt="Celebration Reveal"
                                        className="mobile-reveal-img"
                                    />
                                </div>

                                <h2 className="main-heading">Thanks for playing!</h2>

                                <p className="sub-line success-sub-line">
                                    Stay tuned for what’s coming next.
                                </p>

                                {lastSubmission && (
                                    <div className="user-guess-preview">
                                        <div>
                                            Guess recorded for <strong>{lastSubmission.name}</strong>:
                                        </div>
                                        <div
                                            style={{
                                                marginTop: '6px',
                                                fontWeight: 600,
                                                color: '#fff',
                                                fontSize: '1.05rem'
                                            }}
                                        >
                                            “{lastSubmission.guess}”
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="button"
                                    className="btn btn-outline btn-block"
                                    onClick={handleReset}
                                >
                                    <span>TRY ANOTHER GUESS</span>
                                </button>
                            </div>
                        )}

                        {/* 4. NO / TEASE STATE */}
                        {currentState === 'no' && (
                            <div className={`panel-state ${isTransitioning ? 'exit' : 'active'}`}>
                                <div className="no-mobile-hero">
                                    <img
                                        src={rejectedImg}
                                        alt="Oops Missed Out"
                                        className="mobile-reveal-img"
                                    />
                                </div>

                                <div className="badge-pill badge-pill-subtle">
                                    <span>Second Chance</span>
                                </div>

                                <h2 className="main-heading">Oops! You’re missing out!</h2>

                                <p className="sub-line">
                                    Something exciting is coming your way.
                                </p>

                                <div className="button-group single-btn-group">
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-block"
                                        onClick={() => transitionTo('initial', 'question')}
                                    >
                                        <span>WAIT… I’M IN!</span>
                                        <svg
                                            className="btn-arrow"
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Embedded Scoped CSS Styles */}
            <style>{`
        .event-teaser-root {
          --bg-dark: #0a0a0c;
          --glass-bg: rgba(18, 14, 12, 0.72);
          --primary-accent: #f59e0b;
          --primary-glow: rgba(245, 158, 11, 0.45);
          --accent-gradient: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%);
          --text-white: #ffffff;
          --text-muted: #d1d5db;
          --text-dim: #9ca3af;
          --trans-fast: 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          --trans-smooth: 0.45s cubic-bezier(0.16, 1, 0.3, 1);

          position: relative;
          min-height: 100vh;
          width: 100%;
          overflow-x: hidden;
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: var(--bg-dark);
          color: var(--text-white);
          -webkit-font-smoothing: antialiased;
          box-sizing: border-box;
        }

        .event-teaser-root * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .event-teaser-root .background-container {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
          overflow: hidden;
        }

        .event-teaser-root .bg-layer {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          background-size: 100% 100%;
          background-position: center center;
          background-repeat: no-repeat;
          opacity: 0;
          image-rendering: -webkit-optimize-contrast;
          transition: opacity 0.6s ease-in-out;
        }

        .event-teaser-root .bg-layer.active {
          opacity: 1;
        }

        .event-teaser-root .gold-particles-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
          pointer-events: none;
          opacity: 0.9;
          mix-blend-mode: screen;
        }

        .event-teaser-root .bg-overlay {
          position: absolute;
          inset: 0;
          z-index: 3;
          background: linear-gradient(to right, transparent 65%, rgba(0, 0, 0, 0.3) 100%);
          pointer-events: none;
        }

        .event-teaser-root .page-wrapper {
          position: relative;
          z-index: 10;
          min-height: 100vh;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-end;
          padding: 2rem 4.5rem;
          box-sizing: border-box;
        }

        .event-teaser-root .left-spacer {
          flex: 1;
          pointer-events: none;
        }

        .event-teaser-root .teaser-panel-wrapper {
          flex: 0 0 520px;
          max-width: 540px;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          perspective: 1000px;
          margin: auto 0;
        }

        .event-teaser-root .glass-card {
          position: relative;
          width: 100%;
          background: transparent;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
          border: none;
          padding: 0 0.5rem;
          text-align: center;
          overflow: visible;
          transition: transform var(--trans-smooth);
        }

        .event-teaser-root .card-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(245, 158, 11, 0.14) 0%, rgba(217, 119, 6, 0.05) 50%, transparent 75%);
          border-radius: 50%;
          pointer-events: none;
          filter: blur(60px);
          z-index: -1;
        }

        .event-teaser-root .badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 1.1rem;
          border-radius: 9999px;
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #fef3c7;
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.3);
          margin-bottom: 0.75rem;
        }

        .event-teaser-root .badge-pill-warm {
          background: rgba(234, 88, 12, 0.15);
          border-color: rgba(249, 115, 22, 0.4);
          color: #ffedd5;
        }

        .event-teaser-root .badge-pill-subtle {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.15);
          color: #e5e7eb;
        }

        .event-teaser-root .badge-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: #f59e0b;
          box-shadow: 0 0 10px #f59e0b;
          animation: pulse-dot-react 1.8s infinite ease-in-out;
        }

        @keyframes pulse-dot-react {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }

        .event-teaser-root .main-heading {
          font-family: 'Dancing Script', cursive, sans-serif;
          font-size: 3.4rem;
          font-weight: 700;
          line-height: 1.15;
          color: var(--text-white);
          letter-spacing: 0.01em;
          margin-bottom: 0.9rem;
          text-shadow: 0 4px 25px rgba(0, 0, 0, 0.85);
        }

        .event-teaser-root .gradient-text {
          font-family: 'Dancing Script', cursive, sans-serif;
          font-weight: 700;
          background: var(--accent-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline-block;
          filter: drop-shadow(0 4px 18px rgba(245, 158, 11, 0.55));
        }

        .event-teaser-root .sub-line {
          font-size: 1.2rem;
          font-weight: 500;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 2.5rem;
          max-width: 440px;
          margin-left: auto;
          margin-right: auto;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.85);
        }

        .event-teaser-root .success-sub-line {
          font-size: 1.2rem;
          color: #fef3c7;
          margin-bottom: 1.5rem;
        }

        .event-teaser-root .panel-state {
          display: block;
          opacity: 0;
          transform: translateY(18px) scale(0.98);
          animation: state-enter 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .event-teaser-root .panel-state.active {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .event-teaser-root .panel-state.exit {
          animation: state-exit 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes state-enter {
          from { opacity: 0; transform: translateY(18px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes state-exit {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(-16px) scale(0.97); }
        }

        .event-teaser-root .button-group {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.25rem;
          flex-wrap: wrap;
        }

        .event-teaser-root .single-btn-group {
          max-width: 340px;
          margin: 0 auto;
        }

        .event-teaser-root .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1.15rem 2.4rem;
          font-family: 'Outfit', sans-serif;
          font-size: 0.95rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border-radius: 9999px;
          cursor: pointer;
          outline: none;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
          user-select: none;
        }

        .event-teaser-root .btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -120%;
          width: 60%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.35),
            transparent
          );
          transform: skewX(-25deg);
          transition: left 0.75s ease;
          pointer-events: none;
        }

        .event-teaser-root .btn:hover::before {
          left: 180%;
        }

        .event-teaser-root .btn:active {
          transform: scale(0.96) translateY(1px);
        }

        .event-teaser-root .btn-primary {
          background: linear-gradient(135deg, #ffe082 0%, #ffb300 45%, #ff8f00 75%, #e65100 100%);
          color: #120902;
          border: 1px solid rgba(255, 245, 200, 0.5);
          box-shadow: 
            0 12px 35px rgba(245, 158, 11, 0.5),
            0 0 25px rgba(245, 158, 11, 0.3),
            inset 0 1.5px 2px rgba(255, 255, 255, 0.8),
            inset 0 -2px 4px rgba(0, 0, 0, 0.2);
        }

        .event-teaser-root .btn-primary:hover {
          background: linear-gradient(135deg, #fff3c4 0%, #ffc107 45%, #ffa000 75%, #f57c00 100%);
          box-shadow: 
            0 16px 45px rgba(245, 158, 11, 0.75),
            0 0 40px rgba(255, 179, 0, 0.55),
            inset 0 2px 3px rgba(255, 255, 255, 0.95),
            inset 0 -2px 5px rgba(0, 0, 0, 0.25);
          transform: translateY(-3px);
          color: #050200;
        }

        .event-teaser-root .btn-primary .btn-arrow {
          transition: transform var(--trans-fast);
        }

        .event-teaser-root .btn-primary:hover .btn-arrow {
          transform: translateX(4px);
        }

        .event-teaser-root .btn-outline {
          background: rgba(22, 17, 13, 0.55);
          color: #ffffff;
          border: 1.5px solid rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          box-shadow: 
            0 10px 30px rgba(0, 0, 0, 0.6),
            inset 0 1px 1.5px rgba(255, 255, 255, 0.25);
        }

        .event-teaser-root .btn-outline:hover {
          background: rgba(35, 26, 18, 0.75);
          border-color: rgba(255, 200, 115, 0.7);
          color: #ffedd5;
          transform: translateY(-3px);
          box-shadow: 
            0 15px 40px rgba(0, 0, 0, 0.75),
            0 0 25px rgba(245, 158, 11, 0.25),
            inset 0 1px 2px rgba(255, 235, 200, 0.45);
        }

        .event-teaser-root .btn-block {
          width: 100%;
        }

        .event-teaser-root .btn-back {
          background: transparent;
          border: none;
          color: var(--text-dim);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          margin-top: 1.25rem;
          transition: color var(--trans-fast);
          display: inline-block;
        }

        .event-teaser-root .btn-back:hover {
          color: var(--primary-accent);
          text-decoration: underline;
          text-underline-offset: 4px;
        }

        .event-teaser-root .event-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          text-align: left;
        }

        .event-teaser-root .input-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .event-teaser-root .input-field {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .event-teaser-root .input-field label {
          font-size: 0.76rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.7);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding-left: 0.35rem;
        }

        .event-teaser-root .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .event-teaser-root .input-wrapper input {
          width: 100%;
          padding: 1rem 1.15rem 1rem 2.85rem;
          background: rgba(15, 12, 10, 0.55);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          color: var(--text-white);
          font-family: inherit;
          font-size: 0.95rem;
          outline: none;
          transition: all var(--trans-fast);
        }

        .event-teaser-root .input-wrapper input::placeholder {
          color: rgba(255, 255, 255, 0.35);
        }

        .event-teaser-root .input-wrapper input:focus {
          border-color: rgba(245, 158, 11, 0.8);
          background: rgba(18, 14, 11, 0.85);
          box-shadow: 0 0 25px rgba(245, 158, 11, 0.25), 0 4px 12px rgba(0, 0, 0, 0.5);
        }

        .event-teaser-root .input-wrapper .field-icon {
          position: absolute;
          left: 1rem;
          color: rgba(255, 255, 255, 0.4);
          pointer-events: none;
          transition: color var(--trans-fast);
        }

        .event-teaser-root .input-wrapper input:focus + .field-icon,
        .event-teaser-root .input-wrapper input:focus ~ .field-icon {
          color: #fbbf24;
        }

        .event-teaser-root .input-wrapper.error input {
          border-color: #ef4444;
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.35);
        }

        .event-teaser-root .submitted-mobile-hero,
        .event-teaser-root .no-mobile-hero {
          display: none;
        }

        .event-teaser-root .user-guess-preview {
          margin: 1.5rem 0 2.25rem 0;
          padding: 1.25rem 1.5rem;
          background: rgba(18, 14, 11, 0.6);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(245, 158, 11, 0.35);
          border-radius: 20px;
          font-size: 1rem;
          color: var(--text-muted);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
        }

        .event-teaser-root .user-guess-preview strong {
          color: #fbbf24;
        }

        @media (max-width: 1024px) {
          .event-teaser-root .page-wrapper {
            padding: 2rem 2rem;
          }
          .event-teaser-root .teaser-panel-wrapper {
            flex: 0 0 460px;
          }
          .event-teaser-root .main-heading {
            font-size: 2.85rem;
          }
        }

        @media (max-width: 768px) {
          .event-teaser-root .page-wrapper {
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 2rem 1.5rem;
            min-height: 100vh;
          }

          .event-teaser-root .left-spacer {
            display: none;
          }

          .event-teaser-root .teaser-panel-wrapper {
            flex: 0 0 auto;
            width: 100%;
            max-width: 440px;
            margin: 0 auto;
            z-index: 20;
          }

          .event-teaser-root .glass-card {
            padding: 1.5rem 0.5rem;
          }

          .event-teaser-root .card-glow {
            width: 320px;
            height: 320px;
          }

          .event-teaser-root .main-heading {
            font-size: 2.6rem;
            line-height: 1.15;
            margin-bottom: 0.75rem;
          }

          .event-teaser-root .sub-line {
            font-size: 1.05rem;
            margin-bottom: 2rem;
          }

          .event-teaser-root .input-row {
            grid-template-columns: 1fr;
            gap: 1.15rem;
          }

          .event-teaser-root .button-group {
            flex-direction: column;
            gap: 1rem;
            width: 100%;
          }

          .event-teaser-root .btn {
            width: 100%;
            padding: 1.1rem 1.5rem;
            font-size: 0.95rem;
          }

          .event-teaser-root .bg-layer {
            display: none !important;
          }

          .event-teaser-root .submitted-mobile-hero,
          .event-teaser-root .no-mobile-hero {
            display: block;
            width: 100%;
            margin-bottom: 1.5rem;
            animation: fade-in-scale-react 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .event-teaser-root .mobile-reveal-img {
            width: 100%;
            max-width: 280px;
            height: auto;
            border-radius: 20px;
            box-shadow: 0 12px 35px rgba(0, 0, 0, 0.65);
            display: block;
            margin: 0 auto;
            object-fit: cover;
          }

          @keyframes fade-in-scale-react {
            0% { opacity: 0; transform: translateY(-15px) scale(0.92); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }

          .event-teaser-root .background-container {
            background: radial-gradient(circle at 50% 30%, #17110b 0%, #0a0a0c 100%);
          }

          .event-teaser-root .bg-overlay {
            display: none;
          }
        }
      `}</style>
        </div>
    );
}
