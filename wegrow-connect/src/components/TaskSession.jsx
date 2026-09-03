import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Clock, Camera, Mic, AlertTriangle, Shield, CheckCircle2,
  Loader2, Eye, EyeOff, Send, Save, Video
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  startTaskSession,
  getActiveTaskSession,
  getTaskSessionById,
  saveTaskSessionDraft,
  logTaskSessionEvent,
  submitTaskSession,
} from '../services/api';

const VIOLATION_LIMIT = 3;
const AUTOSAVE_INTERVAL = 30000; // 30s

export default function TaskSession() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const studentId = searchParams.get('studentId');
  const taskId = searchParams.get('taskId');

  // ── Core State ───────────────────────────────────────────────────────────
  const [phase, setPhase] = useState('loading'); // loading | permissions | ready | active | submitted | error
  const [session, setSession] = useState(null);
  const [task, setTask] = useState(null);
  const [answer, setAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // ── Timer ────────────────────────────────────────────────────────────────
  const [secondsLeft, setSecondsLeft] = useState(0);
  const timerRef = useRef(null);

  // ── Anti-Cheat ───────────────────────────────────────────────────────────
  const [violations, setViolations] = useState(0);
  const [warningMsg, setWarningMsg] = useState('');
  const violationsRef = useRef(0);
  const sessionRef = useRef(null);

  // ── Camera/Mic ───────────────────────────────────────────────────────────
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [camError, setCamError] = useState('');

  // ── Auto-save ────────────────────────────────────────────────────────────
  const answerRef = useRef('');
  const autosaveRef = useRef(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [saving, setSaving] = useState(false);

  // ── Submission ───────────────────────────────────────────────────────────
  const [submitting, setSubmitting] = useState(false);

  /* ─────────────────────────────────────────────────────────────────────────
     1. INITIAL LOAD
  ───────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!studentId || !taskId) {
      setErrorMsg('Invalid task link. Please use the link sent to your email.');
      setPhase('error');
      return;
    }
    setPhase('permissions');
  }, [studentId, taskId]);

  /* ─────────────────────────────────────────────────────────────────────────
     2. REQUEST CAMERA + MIC
  ───────────────────────────────────────────────────────────────────────── */
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraOn(true);
      return true;
    } catch {
      setCamError('Camera/microphone access denied. The session will be flagged.');
      setCameraOn(false);
      return false;
    }
  };

  /* ─────────────────────────────────────────────────────────────────────────
     3. START SESSION
  ───────────────────────────────────────────────────────────────────────── */
  const handleStart = async () => {
    setPhase('loading');
    await startCamera(); // don't block if denied

    try {
      // Check for existing active session first
      let res;
      try {
        res = await getActiveTaskSession(studentId);
      } catch { res = null; }

      let sess = res?.data?.session || res?.data || null;

      if (!sess) {
        const started = await startTaskSession({ studentId, taskId });
        sess = started?.data?.session || started?.data || started;
      }

      if (!sess?._id) throw new Error('Could not start session.');

      sessionRef.current = sess;
      setSession(sess);
      setTask(sess.task || { duration: 60, title: 'Task', description: '', instructions: '', maxMarks: 100 });
      const dur = (sess.task?.duration || 60) * 60;
      setSecondsLeft(dur);
      setPhase('active');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to start task. Please contact admin.');
      setPhase('error');
    }
  };

  /* ─────────────────────────────────────────────────────────────────────────
     4. COUNTDOWN TIMER
  ───────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (phase !== 'active') return;
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          handleSubmit('TIME_UP');
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const timerColor = secondsLeft < 300 ? '#f87171' : secondsLeft < 600 ? '#fbbf24' : '#22c55e';

  /* ─────────────────────────────────────────────────────────────────────────
     5. ANTI-CHEAT: block copy/paste/cut/select/context-menu
  ───────────────────────────────────────────────────────────────────────── */
  const logViolation = useCallback(async (eventType, details) => {
    if (!sessionRef.current?._id) return;
    await logTaskSessionEvent(sessionRef.current._id, eventType, details).catch(() => {});
    violationsRef.current += 1;
    setViolations(violationsRef.current);
    setWarningMsg(`⚠️ Violation ${violationsRef.current}/${VIOLATION_LIMIT}: ${details}. ${VIOLATION_LIMIT - violationsRef.current} warnings remaining.`);
    if (violationsRef.current >= VIOLATION_LIMIT) {
      toast.error('Too many violations! Submitting your task automatically.');
      handleSubmit('AUTO_SUBMIT_VIOLATIONS');
    }
  }, []);

  useEffect(() => {
    if (phase !== 'active') return;

    const blockEvent = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleKeyDown = (e) => {
      const blocked = (e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 'a', 'u'].includes(e.key.toLowerCase());
      if (blocked) {
        blockEvent(e);
        const label = `Ctrl+${e.key.toUpperCase()}`;
        logViolation('KEY_BLOCK', `User pressed ${label}`);
      }
    };

    const handleVisibility = () => {
      if (document.hidden) {
        logViolation('TAB_SWITCH', 'User switched tab or minimized window');
      }
    };

    const handleBlur = () => {
      logViolation('WINDOW_BLUR', 'User clicked outside the task window');
    };

    document.addEventListener('copy', blockEvent);
    document.addEventListener('cut', blockEvent);
    document.addEventListener('paste', blockEvent);
    document.addEventListener('contextmenu', blockEvent);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('copy', blockEvent);
      document.removeEventListener('cut', blockEvent);
      document.removeEventListener('paste', blockEvent);
      document.removeEventListener('contextmenu', blockEvent);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
    };
  }, [phase, logViolation]);

  /* ─────────────────────────────────────────────────────────────────────────
     6. AUTO-SAVE
  ───────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    answerRef.current = answer;
  }, [answer]);

  useEffect(() => {
    if (phase !== 'active') return;
    autosaveRef.current = setInterval(async () => {
      if (!sessionRef.current?._id || !answerRef.current) return;
      setSaving(true);
      try {
        await saveTaskSessionDraft(sessionRef.current._id, answerRef.current);
        setLastSaved(new Date());
      } catch { /* silent */ }
      finally { setSaving(false); }
    }, AUTOSAVE_INTERVAL);
    return () => clearInterval(autosaveRef.current);
  }, [phase]);

  /* ─────────────────────────────────────────────────────────────────────────
     7. SUBMIT
  ───────────────────────────────────────────────────────────────────────── */
  const handleSubmit = async (reason = 'MANUAL') => {
    if (submitting) return;
    setSubmitting(true);
    clearInterval(timerRef.current);
    clearInterval(autosaveRef.current);

    // Stop camera
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }

    try {
      await submitTaskSession(sessionRef.current._id, answerRef.current || answer);
      setPhase('submitted');
    } catch (err) {
      toast.error('Submission failed. Please try again.');
      setSubmitting(false);
    }
  };

  /* ─────────────────────────────────────────────────────────────────────────
     8. CLEANUP
  ───────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearInterval(autosaveRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, []);

  /* ── Prevent browser back ─── */
  useEffect(() => {
    if (phase !== 'active') return;
    const handlePopstate = (e) => {
      window.history.pushState(null, '', window.location.href);
    };
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopstate);
    return () => window.removeEventListener('popstate', handlePopstate);
  }, [phase]);

  /* ─────────────────────────────────────────────────────────────────────────
     RENDER PHASES
  ───────────────────────────────────────────────────────────────────────── */

  /* ── Loading ─── */
  if (phase === 'loading') {
    return (
      <div style={S.page}>
        <Loader2 style={{ width: 48, height: 48, color: '#60a5fa', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: '#94a3b8', marginTop: 16 }}>Setting up your task…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  /* ── Error ─── */
  if (phase === 'error') {
    return (
      <div style={S.page}>
        <AlertTriangle style={{ width: 56, height: 56, color: '#f87171' }} />
        <h2 style={{ color: '#f1f5f9', fontSize: 20, fontWeight: 700, marginTop: 16 }}>Unable to Load Task</h2>
        <p style={{ color: '#94a3b8', textAlign: 'center', maxWidth: 380 }}>{errorMsg}</p>
        <button style={S.homeBtn} onClick={() => navigate('/home')}>Go to Home</button>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  /* ── Permissions Screen ─── */
  if (phase === 'permissions') {
    return (
      <div style={S.page}>
        <div style={S.permCard}>
          <div style={S.shieldIcon}><Shield style={{ width: 36, height: 36, color: '#60a5fa' }} /></div>
          <h2 style={S.permTitle}>Before You Begin</h2>
          <p style={S.permSubtitle}>This is a secure assessment. Please read the rules carefully.</p>

          <div style={S.rulesList}>
            {[
              { icon: Clock, text: 'You have a fixed time limit. The timer starts immediately.' },
              { icon: Camera, text: 'Camera & microphone will be enabled for proctoring.' },
              { icon: Shield, text: 'Copying, pasting, or switching tabs is not allowed.' },
              { icon: Eye, text: 'All activities are logged and reviewed by admin.' },
              { icon: AlertTriangle, text: `${VIOLATION_LIMIT} violations = automatic submission.` },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={S.ruleRow}>
                <div style={S.ruleIcon}><Icon style={{ width: 16, height: 16, color: '#60a5fa' }} /></div>
                <span style={S.ruleText}>{text}</span>
              </div>
            ))}
          </div>

          <button id="btn-start-task" style={S.startBtn} onClick={handleStart}>
            I Understand — Start Task
          </button>
          <p style={{ color: '#475569', fontSize: 11, marginTop: 8 }}>By clicking, you agree to monitoring conditions.</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  /* ── Submitted ─── */
  if (phase === 'submitted') {
    return (
      <div style={S.page}>
        <div style={S.successCard}>
          <div style={S.successIcon}><CheckCircle2 style={{ width: 52, height: 52, color: '#22c55e' }} /></div>
          <h2 style={S.successTitle}>Task Submitted!</h2>
          <p style={S.successSubtitle}>
            Your response has been recorded. Our team will review and evaluate your submission.
            <br /><br />
            <strong style={{ color: '#60a5fa' }}>Check your email</strong> — if selected, we will contact you with next steps and gift/offer details.
          </p>
          <button style={S.homeBtn} onClick={() => navigate('/home')}>Return to Home</button>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  /* ── Active Task ─── */
  return (
    <div style={S.taskPage}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { user-select: none; -webkit-user-select: none; }
        textarea { user-select: text !important; -webkit-user-select: text !important; }
        .task-answer::selection { background: rgba(59,130,246,0.3); }
      `}</style>

      {/* ── Top Bar ── */}
      <div style={S.topBar}>
        <div style={S.topLeft}>
          <img src="/wegrow-logo.png" alt="WeGrow" style={{ height: 32, objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
          <span style={S.taskName}>{task?.title || 'Assessment Task'}</span>
        </div>

        <div style={S.topCenter}>
          <div style={{ ...S.timer, color: timerColor }}>
            <Clock style={{ width: 16, height: 16 }} />
            <span style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: 1 }}>{formatTime(secondsLeft)}</span>
          </div>
        </div>

        <div style={S.topRight}>
          {/* Violation indicator */}
          <div style={{ ...S.violationBadge, borderColor: violations > 0 ? '#f87171' : 'rgba(255,255,255,0.1)' }}>
            <AlertTriangle style={{ width: 13, height: 13, color: violations > 0 ? '#f87171' : '#475569' }} />
            <span style={{ color: violations > 0 ? '#f87171' : '#475569', fontSize: 12, fontWeight: 700 }}>{violations}/{VIOLATION_LIMIT}</span>
          </div>

          {/* Save indicator */}
          {saving ? (
            <div style={S.saveStatus}><Loader2 style={{ width: 12, height: 12, animation: 'spin 1s linear infinite' }} /> Saving…</div>
          ) : lastSaved ? (
            <div style={S.saveStatus}><Save style={{ width: 12, height: 12 }} /> Saved {lastSaved.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
          ) : null}

          {/* Camera thumbnail */}
          <div style={S.camThumb}>
            {cameraOn
              ? <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} muted autoPlay playsInline />
              : <div style={S.camOff}><Video style={{ width: 16, height: 16, color: '#475569' }} /></div>
            }
          </div>
        </div>
      </div>

      {/* ── Warning Banner ── */}
      {warningMsg && (
        <div style={S.warningBanner}>
          <AlertTriangle style={{ width: 14, height: 14, color: '#fbbf24', flexShrink: 0 }} />
          <span>{warningMsg}</span>
          <button style={S.dismissWarn} onClick={() => setWarningMsg('')}>✕</button>
        </div>
      )}

      {/* ── Camera error ── */}
      {camError && (
        <div style={{ ...S.warningBanner, background: 'rgba(239,68,68,0.12)', borderColor: 'rgba(239,68,68,0.3)', color: '#fca5a5' }}>
          <Camera style={{ width: 14, height: 14, color: '#f87171', flexShrink: 0 }} />
          <span>{camError}</span>
        </div>
      )}

      {/* ── Main Content ── */}
      <div style={S.mainContent}>
        {/* Task Info Panel */}
        <div style={S.infoPanel}>
          <div style={S.infoBadge}>{task?.category || 'Assessment'}</div>
          <h2 style={S.taskTitle}>{task?.title}</h2>
          <p style={S.taskDesc}>{task?.description}</p>

          {task?.instructions && (
            <div style={S.instructionsBox}>
              <p style={S.instructionsLabel}>Instructions</p>
              <pre style={S.instructionsText}>{task.instructions}</pre>
            </div>
          )}

          <div style={S.metaRow}>
            <div style={S.metaItem}>
              <Clock style={{ width: 13, height: 13, color: '#64748b' }} />
              <span>{task?.duration || 60} min</span>
            </div>
            <div style={S.metaItem}>
              <Shield style={{ width: 13, height: 13, color: '#64748b' }} />
              <span>Max: {task?.maxMarks || 100} marks</span>
            </div>
          </div>
        </div>

        {/* Answer Panel */}
        <div style={S.answerPanel}>
          <div style={S.answerHeader}>
            <span style={S.answerLabel}>Your Answer</span>
            <span style={S.charCount}>{answer.length} chars</span>
          </div>
          <textarea
            className="task-answer"
            id="task-answer-textarea"
            style={S.textarea}
            placeholder="Write your answer here…&#10;&#10;Be clear, concise and organized. You can use numbers or bullet points."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onCopy={(e) => e.preventDefault()}
            onPaste={(e) => e.preventDefault()}
            onCut={(e) => e.preventDefault()}
            spellCheck
          />

          <div style={S.submitRow}>
            <button
              id="btn-save-draft"
              style={S.saveBtn}
              onClick={async () => {
                if (!session?._id || !answer) return;
                setSaving(true);
                try { await saveTaskSessionDraft(session._id, answer); setLastSaved(new Date()); toast.success('Draft saved!'); }
                catch { toast.error('Save failed'); }
                finally { setSaving(false); }
              }}
              disabled={saving}
            >
              <Save style={{ width: 14, height: 14 }} /> Save Draft
            </button>

            <button
              id="btn-submit-task"
              style={S.submitBtn}
              onClick={() => {
                if (!answer.trim()) { toast.error('Please write your answer before submitting.'); return; }
                if (window.confirm('Are you sure you want to submit? This cannot be undone.')) {
                  handleSubmit('MANUAL');
                }
              }}
              disabled={submitting}
            >
              {submitting
                ? <><Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} /> Submitting…</>
                : <><Send style={{ width: 14, height: 14 }} /> Submit Task</>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Styles ─────────────────────────────────────────────────────────────── */
const S = {
  page: {
    minHeight: '100vh', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: 16,
    background: 'linear-gradient(135deg, #050f1f, #0a1f3d)',
    fontFamily: "'Inter', sans-serif", padding: 24,
  },
  homeBtn: {
    background: 'linear-gradient(135deg, #104288, #1d4ed8)', border: 'none',
    borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 600,
    padding: '12px 28px', cursor: 'pointer', marginTop: 8,
  },
  permCard: {
    maxWidth: 500, width: '100%',
    background: 'rgba(15,23,42,0.9)',
    border: '1.5px solid rgba(255,255,255,0.1)',
    borderRadius: 28, backdropFilter: 'blur(24px)',
    padding: '36px 32px', display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: 16,
    boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
  },
  shieldIcon: {
    width: 72, height: 72, borderRadius: '50%',
    background: 'rgba(59,130,246,0.12)',
    border: '2px solid rgba(59,130,246,0.25)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  permTitle: { color: '#f1f5f9', fontSize: 24, fontWeight: 800, margin: 0, textAlign: 'center' },
  permSubtitle: { color: '#64748b', fontSize: 13, margin: 0, textAlign: 'center' },
  rulesList: { width: '100%', display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 },
  ruleRow: { display: 'flex', alignItems: 'flex-start', gap: 12 },
  ruleIcon: {
    width: 32, height: 32, borderRadius: '50%',
    background: 'rgba(59,130,246,0.1)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  ruleText: { color: '#94a3b8', fontSize: 13, lineHeight: 1.6, paddingTop: 6 },
  startBtn: {
    width: '100%', padding: 14,
    background: 'linear-gradient(135deg, #104288, #1d4ed8)',
    border: 'none', borderRadius: 14, color: '#fff',
    fontSize: 15, fontWeight: 700, cursor: 'pointer',
    boxShadow: '0 8px 24px rgba(16,66,136,0.35)',
  },
  successCard: {
    maxWidth: 440, width: '100%',
    background: 'rgba(15,23,42,0.9)',
    border: '1.5px solid rgba(34,197,94,0.25)',
    borderRadius: 28, backdropFilter: 'blur(24px)',
    padding: '40px 32px', display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: 16, textAlign: 'center',
    boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
  },
  successIcon: {
    width: 88, height: 88, borderRadius: '50%',
    background: 'rgba(34,197,94,0.1)',
    border: '2px solid rgba(34,197,94,0.3)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  successTitle: { color: '#f1f5f9', fontSize: 26, fontWeight: 800, margin: 0 },
  successSubtitle: { color: '#94a3b8', fontSize: 14, lineHeight: 1.7, margin: 0 },

  // Task page
  taskPage: {
    minHeight: '100vh', display: 'flex', flexDirection: 'column',
    background: '#060f1e',
    fontFamily: "'Inter', sans-serif",
  },
  topBar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 20px',
    background: 'rgba(5,15,31,0.95)',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    backdropFilter: 'blur(12px)',
    position: 'sticky', top: 0, zIndex: 100,
    gap: 12, flexWrap: 'wrap',
  },
  topLeft: { display: 'flex', alignItems: 'center', gap: 10 },
  taskName: { color: '#94a3b8', fontSize: 13, fontWeight: 600, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  topCenter: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  timer: {
    display: 'flex', alignItems: 'center', gap: 7,
    fontSize: 22, fontWeight: 800,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12, padding: '6px 16px',
    transition: 'color 0.3s',
  },
  topRight: { display: 'flex', alignItems: 'center', gap: 10 },
  violationBadge: {
    display: 'flex', alignItems: 'center', gap: 5,
    border: '1px solid',
    borderRadius: 20, padding: '4px 10px',
    transition: 'all 0.3s',
  },
  saveStatus: {
    display: 'flex', alignItems: 'center', gap: 5,
    color: '#475569', fontSize: 11, fontWeight: 600,
  },
  camThumb: {
    width: 56, height: 40, borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.1)',
    overflow: 'hidden', background: '#0f172a',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  camOff: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' },

  warningBanner: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 20px',
    background: 'rgba(251,191,36,0.1)',
    borderBottom: '1px solid rgba(251,191,36,0.25)',
    color: '#fbbf24', fontSize: 13, fontWeight: 600,
    position: 'sticky', top: 65, zIndex: 99,
  },
  dismissWarn: {
    background: 'transparent', border: 'none', color: '#fbbf24',
    cursor: 'pointer', marginLeft: 'auto', fontSize: 14, fontWeight: 700,
  },

  mainContent: {
    flex: 1, display: 'flex', gap: 0,
    overflow: 'hidden',
    height: 'calc(100vh - 65px)',
  },
  infoPanel: {
    width: '38%', minWidth: 280,
    padding: '24px 24px',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    overflowY: 'auto',
    display: 'flex', flexDirection: 'column', gap: 14,
    background: 'rgba(5,15,31,0.6)',
  },
  infoBadge: {
    display: 'inline-flex',
    background: 'rgba(59,130,246,0.12)',
    border: '1px solid rgba(59,130,246,0.25)',
    borderRadius: 20, padding: '4px 12px',
    color: '#60a5fa', fontSize: 11, fontWeight: 700,
    letterSpacing: 0.5, alignSelf: 'flex-start',
  },
  taskTitle: { color: '#f1f5f9', fontSize: 18, fontWeight: 700, margin: 0, lineHeight: 1.3 },
  taskDesc: { color: '#94a3b8', fontSize: 13, lineHeight: 1.7, margin: 0 },
  instructionsBox: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 14, padding: '14px 16px',
  },
  instructionsLabel: { color: '#475569', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', margin: '0 0 8px' },
  instructionsText: { color: '#94a3b8', fontSize: 13, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap', fontFamily: "'Inter', sans-serif" },
  metaRow: { display: 'flex', gap: 16, flexWrap: 'wrap' },
  metaItem: { display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 12 },

  answerPanel: {
    flex: 1, display: 'flex', flexDirection: 'column',
    padding: '20px 24px 20px',
    gap: 12,
  },
  answerHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  answerLabel: { color: '#94a3b8', fontSize: 13, fontWeight: 700 },
  charCount: { color: '#334155', fontSize: 11, fontWeight: 600 },
  textarea: {
    flex: 1,
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1.5px solid rgba(255,255,255,0.1)',
    borderRadius: 16,
    color: '#f1f5f9',
    fontSize: 14,
    lineHeight: 1.8,
    padding: '18px 20px',
    resize: 'none',
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  submitRow: { display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'flex-end' },
  saveBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12, color: '#94a3b8',
    fontSize: 13, fontWeight: 600,
    padding: '10px 18px', cursor: 'pointer',
  },
  submitBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: 'linear-gradient(135deg, #104288, #1d4ed8)',
    border: 'none', borderRadius: 12, color: '#fff',
    fontSize: 13, fontWeight: 700,
    padding: '10px 22px', cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(16,66,136,0.35)',
  },
};
