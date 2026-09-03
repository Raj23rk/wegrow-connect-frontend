import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Clock, Camera, Mic, AlertTriangle, Shield, CheckCircle2,
  Loader2, Eye, EyeOff, Send, Save, Video, ArrowRight, ShieldCheck
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
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);

  const handleSelectOption = (qId, optionVal) => {
    const nextAnswers = { ...selectedAnswers, [qId]: optionVal };
    setSelectedAnswers(nextAnswers);
    const jsonStr = JSON.stringify(nextAnswers);
    setAnswer(jsonStr);
    answerRef.current = jsonStr;
  };
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
      setErrorMsg('Missing student or task information in the link. Please use the link provided in your email.');
      setPhase('error');
      return;
    }

    // Check if session already exists for this student/task
    getActiveTaskSession(studentId, taskId)
      .then((res) => {
        const existing = res?.data?.session || res?.data;
        if (existing) {
          if (existing.status === 'SUBMITTED' || existing.status === 'EVALUATED') {
            setPhase('submitted');
            return;
          }
          // Resume in-progress session
          sessionRef.current = existing;
          setSession(existing);
          setTask(existing.taskId || existing.task);
          setAnswer(existing.answerText || '');
        if (existing.answerText) {
          try {
            const parsed = JSON.parse(existing.answerText);
            if (typeof parsed === 'object' && parsed !== null) {
              setSelectedAnswers(parsed);
            }
          } catch {}
        }
          violationsRef.current = existing.violationCount || 0;
          setViolations(existing.violationCount || 0);

          // Calculate remaining time
          const startedTime = existing.startedAt ? new Date(existing.startedAt).getTime() : Date.now();
          const elapsed = isNaN(startedTime) ? 0 : Math.floor((Date.now() - startedTime) / 1000);
          const durationMins = Number(existing.durationMinutes) || Number(existing.taskId?.duration) || 60;
          const totalSecs = durationMins * 60;
          const remaining = isNaN(elapsed) ? totalSecs : Math.max(0, totalSecs - elapsed);
          setSecondsLeft(remaining);

          if (remaining <= 0) {
            handleSubmit('TIMEOUT');
            return;
          }

          // Request camera and resume
          requestCamera().then(() => {
            setPhase('active');
            startTimer(remaining);
          });
        } else {
          // New session — show permissions screen
          setPhase('permissions');
        }
      })
      .catch((err) => {
        // If 404, it means no active session yet → start fresh
        setPhase('permissions');
      });
  }, [studentId, taskId]);

  /* ─────────────────────────────────────────────────────────────────────────
     2. CAMERA & MIC PERMISSIONS
  ───────────────────────────────────────────────────────────────────────── */
  const requestCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: 'user' },
        audio: true,
      });
      streamRef.current = stream;
      setCameraOn(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      return stream;
    } catch (err) {
      console.warn('Camera/Mic permission denied or unavailable:', err);
      setCamError('Camera access not detected. Please enable permissions if possible.');
      return null;
    }
  };

  /* ─────────────────────────────────────────────────────────────────────────
     3. START SESSION
  ───────────────────────────────────────────────────────────────────────── */
  const handleStart = async () => {
    setPhase('loading');
    await requestCamera();

    try {
      const res = await startTaskSession({ studentId, taskId });
      const data = res?.data?.session || res?.data || res;
      sessionRef.current = data;
      setSession(data);
      setTask(data.taskId || data.task);
      const durationMins = Number(data.durationMinutes) || Number(data.taskId?.duration) || Number(data.task?.duration) || 60;
      const totalSecs = durationMins * 60;
      setSecondsLeft(totalSecs);
      setPhase('active');
      startTimer(totalSecs);
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to initialize your assessment session. Please try again.');
      setPhase('error');
    }
  };

  /* ─────────────────────────────────────────────────────────────────────────
     4. TIMER
  ───────────────────────────────────────────────────────────────────────── */
  const startTimer = (initialSecs) => {
    clearInterval(timerRef.current);
    let rem = Number(initialSecs);
    if (isNaN(rem) || rem <= 0) rem = 3600;
    timerRef.current = setInterval(() => {
      rem -= 1;
      setSecondsLeft(rem);
      if (rem <= 0) {
        clearInterval(timerRef.current);
        handleSubmit('TIMEOUT');
      }
    }, 1000);
  };

  const formatTime = (secs) => {
    const sVal = Number(secs);
    if (isNaN(sVal) || sVal <= 0) return '00:00';
    const m = Math.floor(sVal / 60);
    const s = sVal % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const timerColor = secondsLeft < 300 ? '#ef4444' : secondsLeft < 600 ? '#f59e0b' : '#104288';

  /* ─────────────────────────────────────────────────────────────────────────
     5. ANTI-CHEAT EVENTS
  ───────────────────────────────────────────────────────────────────────── */
  const logViolation = useCallback(async (type, detail) => {
    const newCount = violationsRef.current + 1;
    violationsRef.current = newCount;
    setViolations(newCount);

    const msg = `Security Alert: ${detail} (Notice ${newCount}/${VIOLATION_LIMIT})`;
    setWarningMsg(msg);
    toast.error(msg, { duration: 4000 });

    if (sessionRef.current?._id) {
      logTaskSessionEvent(sessionRef.current._id, { eventType: type, detail }).catch(() => {});
    }

    if (newCount >= VIOLATION_LIMIT) {
      toast.error('Violation limit exceeded. Your task is being submitted automatically.', { duration: 5000 });
      setTimeout(() => handleSubmit('VIOLATION_LIMIT'), 1500);
    }
  }, []);

  useEffect(() => {
    if (phase !== 'active') return;

    // 1. Copy/Paste/Cut prevention
    const blockEvent = (e) => {
      e.preventDefault();
      logViolation('CLIPBOARD_ACTION', 'Copy/paste operations are disabled');
    };

    // 2. Right-click context menu
    const blockContext = (e) => {
      e.preventDefault();
    };

    // 3. Tab switch / minimize detection
    const handleVisibility = () => {
      if (document.hidden) {
        logViolation('TAB_SWITCH', 'Switched away from assessment window');
      }
    };

    // 4. Window blur
    const handleBlur = () => {
      logViolation('WINDOW_BLUR', 'Assessment lost active focus');
    };

    // 5. Block devtools shortcuts
    const handleKeyDown = (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && (e.key === 'u' || e.key === 'U'))
      ) {
        e.preventDefault();
        logViolation('DEVTOOLS_ATTEMPT', 'Developer inspection tool attempt');
      }
    };

    document.addEventListener('copy', blockEvent);
    document.addEventListener('cut', blockEvent);
    document.addEventListener('paste', blockEvent);
    document.addEventListener('contextmenu', blockContext);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('copy', blockEvent);
      document.removeEventListener('cut', blockEvent);
      document.removeEventListener('paste', blockEvent);
      document.removeEventListener('contextmenu', blockContext);
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
    const handlePopstate = () => {
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
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#f8fafc] via-[#f1f6fe] to-[#f8fafc] font-['Inter',sans-serif] px-4">
        <div className="flex flex-col items-center justify-center bg-white/95 backdrop-blur-md px-10 py-12 rounded-3xl shadow-xl border border-slate-200/80 text-center max-w-sm w-full">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4 text-[#104288] shadow-inner">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">Setting Up Task</h3>
          <p className="text-xs text-slate-500 font-medium">Securing your proctored session…</p>
        </div>
      </div>
    );
  }

  /* ── Error ─── */
  if (phase === 'error') {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#f8fafc] via-[#f1f6fe] to-[#f8fafc] font-['Inter',sans-serif] px-4">
        <div className="flex flex-col items-center justify-center bg-white/95 backdrop-blur-md p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-200/80 text-center max-w-md w-full">
          <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-4 text-red-500 shadow-inner">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Unable to Load Task</h2>
          <p className="text-sm font-medium text-slate-600 mb-6 leading-relaxed">{errorMsg}</p>
          <button
            onClick={() => navigate('/home')}
            className="w-full py-3.5 px-6 rounded-xl bg-[#104288] hover:bg-[#0c336b] text-white font-bold text-sm transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            Return to Home Page
          </button>
        </div>
      </div>
    );
  }

  /* ── Permissions Screen ─── */
  if (phase === 'permissions') {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#f8fafc] via-[#f1f6fe] to-[#f8fafc] font-['Inter',sans-serif] px-4 py-8 relative overflow-hidden">
        {/* Ambient Lights */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gradient-to-b from-blue-200/35 via-blue-100/20 to-transparent blur-3xl pointer-events-none -z-0" />
        
        <div className="bg-white rounded-3xl p-7 sm:p-10 max-w-lg w-full shadow-2xl border border-slate-200/90 relative z-10">
          
          {/* Header Brand */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 mb-3">
              <img src="/wegrow-logo.png" alt="WeGrow B School" className="h-9 w-auto object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-3 text-[#104288]">
              <Shield className="w-7 h-7" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">Before You Begin</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">This is an automated, secure skill assessment. Please read instructions carefully.</p>
          </div>

          {/* Rules List */}
          <div className="space-y-3 mb-8 bg-slate-50 p-5 rounded-2xl border border-slate-200/70">
            {[
              { icon: Clock, text: 'You have a fixed duration. The timer begins immediately on clicking start.' },
              { icon: Camera, text: 'Camera & microphone are utilized for automated proctoring verification.' },
              { icon: Shield, text: 'Copying, pasting, and switching tabs/windows are strictly recorded.' },
              { icon: Eye, text: 'All assessment activities are logged and reviewed by the evaluation team.' },
              { icon: AlertTriangle, text: `Reaching ${VIOLATION_LIMIT} infractions will trigger automatic submission.` },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-blue-100/70 text-[#104288] flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-700 leading-snug">{text}</span>
              </div>
            ))}
          </div>

          <button
            id="btn-start-task"
            onClick={handleStart}
            className="w-full py-4 px-6 rounded-2xl bg-[#104288] hover:bg-[#0c336b] text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            <span>I Understand — Start Task</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official WeGrow Talent Evaluation Portal</span>
          </div>
        </div>
      </div>
    );
  }

  /* ── Submitted ─── */
  if (phase === 'submitted') {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#f8fafc] via-[#f1f6fe] to-[#f8fafc] font-['Inter',sans-serif] px-4 py-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full text-center shadow-2xl border border-slate-200/90 relative z-10">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5 text-emerald-600 border border-emerald-100 shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">Task Submitted! 🎉</h2>
          <p className="text-sm font-medium text-slate-600 mb-6 leading-relaxed">
            Your task responses have been safely recorded and submitted for review.
            <br /><br />
            <strong className="text-[#104288]">Check your registered email</strong> — our evaluation committee will contact shortlisted candidates with results and reward instructions.
          </p>
          <button
            onClick={() => navigate('/home')}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#104288] hover:bg-[#0c336b] text-white font-extrabold text-sm transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            Return to Home Page
          </button>
        </div>
      </div>
    );
  }

  /* ── Active Task ─── */
  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-['Inter',sans-serif] text-slate-800">
      <style>{`
        * { user-select: none; -webkit-user-select: none; }
        textarea { user-select: text !important; -webkit-user-select: text !important; }
        .task-answer::selection { background: rgba(16,66,136,0.2); }
      `}</style>

      {/* ── Top Bar ── */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg">
            <img src="/wegrow-logo.png" alt="WeGrow B School" className="h-6 w-auto object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
          <span className="font-bold text-slate-800 text-sm max-w-[200px] truncate">{task?.title || 'Assessment Task'}</span>
        </div>

        {/* Center: Timer */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 font-extrabold text-base" style={{ color: timerColor }}>
            <Clock className="w-4 h-4" />
            <span className="font-mono tracking-wider">{formatTime(secondsLeft)}</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Violation indicator */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${
            violations > 0 ? 'bg-red-50 text-red-600 border-red-200' : 'bg-slate-50 text-slate-400 border-slate-200'
          }`}>
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{violations}/{VIOLATION_LIMIT} Notices</span>
          </div>

          {/* Auto-save Status */}
          {saving ? (
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Loader2 className="w-3 h-3 animate-spin text-[#104288]" /> Saving…
            </div>
          ) : lastSaved ? (
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <Save className="w-3 h-3" /> Saved {lastSaved.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </div>
          ) : null}

          {/* Proctoring camera preview */}
          <div className="w-14 h-10 rounded-lg border border-slate-300 overflow-hidden bg-slate-900 flex items-center justify-center shadow-xs">
            {cameraOn ? (
              <video ref={videoRef} className="w-full h-full object-cover" muted autoPlay playsInline />
            ) : (
              <Video className="w-4 h-4 text-slate-500" />
            )}
          </div>
        </div>
      </header>

      {/* Warning Banner */}
      {warningMsg && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between text-amber-800 text-xs font-bold sticky top-[57px] z-40">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{warningMsg}</span>
          </div>
          <button onClick={() => setWarningMsg('')} className="text-amber-800 hover:text-amber-950 font-black cursor-pointer px-2">✕</button>
        </div>
      )}

      {/* ── Main Two-Column Layout ── */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden" style={{ height: 'calc(100vh - 60px)' }}>
        
        {/* Left: Task Details Panel */}
        <aside className="w-full md:w-5/12 lg:w-4/12 bg-white border-r border-slate-200 p-6 overflow-y-auto flex flex-col gap-4">
          <div className="inline-block self-start px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#104288] text-xs font-black uppercase tracking-wider">
            {task?.category || 'Task Assessment'}
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
            {task?.title}
          </h2>

          <p className="text-sm font-medium text-slate-600 leading-relaxed whitespace-pre-wrap">
            {task?.description}
          </p>

          {task?.instructions && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2">Instructions & Guidelines</span>
              <pre className="text-xs font-semibold text-slate-700 whitespace-pre-wrap leading-relaxed font-['Inter',sans-serif]">
                {task.instructions}
              </pre>
            </div>
          )}

          <div className="mt-auto pt-4 border-t border-slate-100 flex items-center gap-4 text-xs font-bold text-slate-500">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{task?.duration || 60} mins</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              <span>Max: {task?.maxMarks || 100} marks</span>
            </div>
          </div>
        </aside>

        {/* Right: Answer Editor Panel */}
        <main className="flex-1 flex flex-col p-4 sm:p-6 bg-slate-50 overflow-y-auto">
          {Array.isArray(task?.questions) && task.questions.length > 0 ? (
            /* Structured Questions UI */
            <div className="flex-1 flex flex-col gap-4">
              {/* Question Navigation Palette */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                      Question {activeQuestionIdx + 1} of {task.questions.length}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
                      {task.questions[activeQuestionIdx]?.marks || 10} Marks
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">
                    {Object.keys(selectedAnswers).length}/{task.questions.length} Answered
                  </span>
                </div>

                {/* Question Numbers Jump Bar */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {task.questions.map((q, idx) => {
                    const isAnswered = selectedAnswers[q.id] !== undefined && selectedAnswers[q.id] !== '';
                    const isActive = idx === activeQuestionIdx;
                    return (
                      <button
                        key={q.id || idx}
                        type="button"
                        onClick={() => setActiveQuestionIdx(idx)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                          isActive
                            ? 'bg-[#104288] text-white ring-2 ring-blue-300'
                            : isAnswered
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Question Card */}
              {task.questions[activeQuestionIdx] && (() => {
                const currentQ = task.questions[activeQuestionIdx];
                const currentAns = selectedAnswers[currentQ.id];
                return (
                  <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
                    <div className="mb-4">
                      <span className="text-xs font-bold text-[#104288] uppercase tracking-wide">Question {activeQuestionIdx + 1}</span>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1 leading-snug">
                        {currentQ.question}
                      </h2>
                    </div>

                    {/* Options */}
                    <div className="flex flex-col gap-3 my-auto">
                      {(currentQ.options || []).map((opt, optIdx) => {
                        const optLetter = ['A', 'B', 'C', 'D'][optIdx] || String(optIdx + 1);
                        const isSelected = currentAns === opt;
                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSelectOption(currentQ.id, opt)}
                            className={`w-full text-left p-4 rounded-xl border transition flex items-center gap-3 cursor-pointer ${
                              isSelected
                                ? 'bg-blue-50/80 border-[#104288] text-[#104288] shadow-xs'
                                : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/80 text-slate-700'
                            }`}
                          >
                            <span className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center ${
                              isSelected ? 'bg-[#104288] text-white' : 'bg-slate-200 text-slate-600'
                            }`}>
                              {optLetter}
                            </span>
                            <span className="text-sm font-semibold flex-1">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Question Step Controls */}
                    <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-4">
                      <button
                        type="button"
                        disabled={activeQuestionIdx === 0}
                        onClick={() => setActiveQuestionIdx(prev => Math.max(0, prev - 1))}
                        className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                      >
                        ← Previous
                      </button>

                      {activeQuestionIdx < task.questions.length - 1 ? (
                        <button
                          type="button"
                          onClick={() => setActiveQuestionIdx(prev => Math.min(task.questions.length - 1, prev + 1))}
                          className="px-5 py-2 rounded-xl bg-[#104288] text-white text-xs font-bold hover:bg-[#0c336b] cursor-pointer"
                        >
                          Next Question →
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-600 font-bold">✓ All questions reviewed</span>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            /* Fallback: Free-form Textarea */
            <>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">Your Response</span>
                <span className="text-xs font-mono font-semibold text-slate-400">{answer.length} characters</span>
              </div>

              <textarea
                className="task-answer flex-1 w-full bg-white border border-slate-300 rounded-2xl p-5 text-sm sm:text-base font-medium text-slate-800 outline-none focus:border-[#104288] focus:ring-2 focus:ring-blue-100 shadow-sm transition resize-none leading-relaxed"
                id="task-answer-textarea"
                placeholder="Type your comprehensive response here...&#10;&#10;Structure your points clearly. Formatting and analytical thought are evaluated."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onCopy={(e) => e.preventDefault()}
                onPaste={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
                spellCheck
              />
            </>
          )}

          {/* Action Row */}
          <div className="mt-4 flex items-center justify-between gap-3 pt-2">
            <button
              id="btn-save-draft"
              type="button"
              disabled={saving}
              onClick={async () => {
                if (!session?._id || !answer) return;
                setSaving(true);
                try {
                  await saveTaskSessionDraft(session._id, answer);
                  setLastSaved(new Date());
                  toast.success('Draft saved successfully!');
                } catch {
                  toast.error('Draft save failed');
                } finally {
                  setSaving(false);
                }
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs sm:text-sm font-bold shadow-xs hover:shadow-sm transition cursor-pointer"
            >
              <Save className="w-4 h-4 text-slate-500" />
              <span>Save Draft</span>
            </button>

            <button
              id="btn-submit-task"
              type="button"
              disabled={submitting}
              onClick={() => {
                if (!answer.trim()) {
                  toast.error('Please write your response before submitting.');
                  return;
                }
                if (window.confirm('Are you sure you want to submit your assessment? Once submitted, no further edits are possible.')) {
                  handleSubmit('MANUAL');
                }
              }}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#104288] hover:bg-[#0c336b] text-white text-xs sm:text-sm font-black shadow-md hover:shadow-lg transition cursor-pointer disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting…</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Assessment</span>
                </>
              )}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
