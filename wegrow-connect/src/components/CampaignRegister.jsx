import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  BookOpen, GraduationCap, User, Mail, Phone, Building2,
  ChevronRight, ChevronLeft, CheckCircle2, Loader2, AlertCircle, Sparkles, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getCampaignByLookup, registerCampaignStudent } from '../services/api';

const YEARS = ['I', 'II', 'III', 'IV', 'V'];
const CLASSES = ['8th', '9th', '10th', '11th', '12th'];
const DEPARTMENTS = [
  'Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical',
  'Business Administration', 'Commerce', 'Arts', 'Science', 'Other'
];

export default function CampaignRegister() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const studentType = searchParams.get('type') || 'COLLEGE'; // SCHOOL | COLLEGE

  const [campaign, setCampaign] = useState(null);
  const [step, setStep] = useState(1); // 1 = form, 2 = success
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const isSchool = studentType === 'SCHOOL';

  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    whatsapp: '',
    useMobileAsWhatsapp: true,
    // School fields
    schoolName: '',
    class: '',
    // College fields
    collegeName: '',
    department: '',
    year: '',
  });

  useEffect(() => {
    if (!campaignId) return;
    getCampaignByLookup(campaignId)
      .then((res) => setCampaign(res?.data?.campaign || res?.data || res))
      .catch(() => {});
  }, [campaignId]);

  const setField = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Valid email required';
    if (!form.mobile.trim() || form.mobile.length < 10) errs.mobile = 'Valid 10-digit mobile required';
    if (isSchool) {
      if (!form.schoolName.trim()) errs.schoolName = 'School name is required';
      if (!form.class) errs.class = 'Class selection is required';
    } else {
      if (!form.collegeName.trim()) errs.collegeName = 'College name is required';
      if (!form.department) errs.department = 'Department selection is required';
      if (!form.year) errs.year = 'Year selection is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        mobile: form.mobile.trim(),
        whatsapp: form.useMobileAsWhatsapp ? form.mobile.trim() : form.whatsapp.trim(),
        useMobileAsWhatsapp: form.useMobileAsWhatsapp,
        studentType,
        campaignId,
        ...(isSchool
          ? { schoolName: form.schoolName.trim(), class: form.class }
          : { collegeName: form.collegeName.trim(), department: form.department, year: form.year }
        ),
      };
      await registerCampaignStudent(payload);
      setStep(2);
    } catch (err) {
      const msg = err?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Success Screen ─────────────────────── */
  if (step === 2) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#f8fafc] via-[#f1f6fe] to-[#f8fafc] font-['Inter',sans-serif] px-4 py-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full text-center shadow-2xl border border-slate-200/80 relative z-10">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5 text-emerald-600 border border-emerald-100 shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">You're Registered! 🎉</h2>
          <p className="text-sm font-medium text-slate-600 mb-6 leading-relaxed">
            Thank you, <strong className="text-[#104288]">{form.name}</strong>!<br />
            Your registration has been received. Our team will send your <strong className="text-[#f3a812]">exclusive task link</strong> via email.
          </p>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mb-6 text-left space-y-2 text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" />
              <span>{form.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400" />
              <span>{form.mobile}</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 font-medium mb-6">
            Please check your inbox and spam folder. The task link will be valid for a limited window.
          </p>

          <button
            onClick={() => navigate('/home')}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#104288] hover:bg-[#0c336b] text-white font-extrabold text-sm transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            Go to Home Page
          </button>
        </div>
      </div>
    );
  }

  /* ── Registration Form ──────────────────── */
  return (
    <div className="min-h-screen w-full relative overflow-x-hidden bg-gradient-to-b from-[#f8fafc] via-[#f1f6fe] to-[#f8fafc] font-['Inter',sans-serif] text-slate-800 flex flex-col items-center justify-between">
      {/* Decorative Ambient Background Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-blue-200/35 via-blue-100/20 to-transparent blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-40 -left-20 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-60 -right-20 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Main Card Container */}
      <main className="w-full max-w-2xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-12 relative z-10 flex flex-col items-center">
        
        {/* Top Header Row with Back Button */}
        <div className="w-full flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => navigate(`/campaign/${campaignId}`)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Selection
          </button>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#104288] text-xs font-extrabold">
            {isSchool ? (
              <>
                <BookOpen className="w-3.5 h-3.5" />
                <span>School Student Form</span>
              </>
            ) : (
              <>
                <GraduationCap className="w-3.5 h-3.5 text-[#f3a812]" />
                <span>College Student Form</span>
              </>
            )}
          </div>
        </div>

        {/* Card */}
        <div className="w-full bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200/90 relative overflow-hidden">
          {/* Top colored accent line */}
          <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${
            isSchool ? 'from-[#104288] to-[#3b82f6]' : 'from-[#f3a812] to-[#ea580c]'
          }`} />

          {/* Logo & Headline */}
          <div className="flex flex-col items-center text-center mb-8">
            <div 
              onClick={() => navigate('/home')}
              className="cursor-pointer p-2 rounded-xl hover:bg-slate-50 transition mb-3"
            >
              <img
                src="/wegrow-logo.png"
                alt="WeGrow B School"
                className="h-10 sm:h-12 w-auto object-contain"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
              Register for <span className={isSchool ? 'text-[#104288]' : 'text-[#f3a812]'}>{campaign?.name || 'WeGrow Campaign'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md">
              Please enter your details accurately. Your personalized challenge link will be dispatched to this email address.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            
            {/* ── Section: Personal Info ── */}
            <div>
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 mb-4">
                <User className="w-3.5 h-3.5 text-[#104288]" />
                <span>Personal Information</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name" id="reg-name" required error={errors.name}>
                  <input
                    id="reg-name"
                    type="text"
                    placeholder="Enter your full name"
                    className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold text-slate-800 bg-white outline-none transition ${
                      errors.name ? 'border-red-500 ring-1 ring-red-100' : 'border-slate-300 focus:border-[#104288] focus:ring-2 focus:ring-blue-100'
                    }`}
                    value={form.name}
                    onChange={(e) => setField('name', e.target.value)}
                  />
                </Field>

                <Field label="Email Address" id="reg-email" required error={errors.email}>
                  <input
                    id="reg-email"
                    type="email"
                    placeholder="name@example.com"
                    className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold text-slate-800 bg-white outline-none transition ${
                      errors.email ? 'border-red-500 ring-1 ring-red-100' : 'border-slate-300 focus:border-[#104288] focus:ring-2 focus:ring-blue-100'
                    }`}
                    value={form.email}
                    onChange={(e) => setField('email', e.target.value)}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <Field label="Mobile Number" id="reg-mobile" required error={errors.mobile}>
                  <input
                    id="reg-mobile"
                    type="tel"
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold text-slate-800 bg-white outline-none transition ${
                      errors.mobile ? 'border-red-500 ring-1 ring-red-100' : 'border-slate-300 focus:border-[#104288] focus:ring-2 focus:ring-blue-100'
                    }`}
                    value={form.mobile}
                    onChange={(e) => setField('mobile', e.target.value.replace(/\D/g, ''))}
                  />
                </Field>

                <div className="flex flex-col justify-end">
                  <div className="flex items-center gap-2 mb-2 pt-1">
                    <input
                      type="checkbox"
                      id="reg-same-wp"
                      checked={form.useMobileAsWhatsapp}
                      onChange={(e) => setField('useMobileAsWhatsapp', e.target.checked)}
                      className="w-4 h-4 rounded text-[#104288] accent-[#104288] cursor-pointer"
                    />
                    <label htmlFor="reg-same-wp" className="text-xs font-semibold text-slate-600 cursor-pointer">
                      WhatsApp number is same as mobile
                    </label>
                  </div>

                  {!form.useMobileAsWhatsapp && (
                    <Field label="WhatsApp Number" id="reg-wp" error={errors.whatsapp}>
                      <input
                        id="reg-wp"
                        type="tel"
                        maxLength={10}
                        placeholder="WhatsApp number"
                        className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold text-slate-800 bg-white outline-none transition ${
                          errors.whatsapp ? 'border-red-500 ring-1 ring-red-100' : 'border-slate-300 focus:border-[#104288] focus:ring-2 focus:ring-blue-100'
                        }`}
                        value={form.whatsapp}
                        onChange={(e) => setField('whatsapp', e.target.value.replace(/\D/g, ''))}
                      />
                    </Field>
                  )}
                </div>
              </div>
            </div>

            {/* ── Section: School or College Specific Details ── */}
            <div>
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 mb-4">
                {isSchool ? <BookOpen className="w-3.5 h-3.5 text-[#104288]" /> : <GraduationCap className="w-3.5 h-3.5 text-[#f3a812]" />}
                <span>{isSchool ? 'School Information' : 'College Information'}</span>
              </div>

              {isSchool ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <Field label="School Name" id="reg-school" required error={errors.schoolName}>
                      <input
                        id="reg-school"
                        type="text"
                        placeholder="e.g. St. Joseph Higher Secondary School"
                        className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold text-slate-800 bg-white outline-none transition ${
                          errors.schoolName ? 'border-red-500 ring-1 ring-red-100' : 'border-slate-300 focus:border-[#104288] focus:ring-2 focus:ring-blue-100'
                        }`}
                        value={form.schoolName}
                        onChange={(e) => setField('schoolName', e.target.value)}
                      />
                    </Field>
                  </div>
                  <div>
                    <Field label="Class" id="reg-class" required error={errors.class}>
                      <select
                        id="reg-class"
                        className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold text-slate-800 bg-white outline-none cursor-pointer transition ${
                          errors.class ? 'border-red-500 ring-1 ring-red-100' : 'border-slate-300 focus:border-[#104288] focus:ring-2 focus:ring-blue-100'
                        }`}
                        value={form.class}
                        onChange={(e) => setField('class', e.target.value)}
                      >
                        <option value="">Select Class</option>
                        {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </Field>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Field label="College / University Name" id="reg-college" required error={errors.collegeName}>
                    <input
                      id="reg-college"
                      type="text"
                      placeholder="e.g. WeGrow College / Institute of Technology"
                      className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold text-slate-800 bg-white outline-none transition ${
                        errors.collegeName ? 'border-red-500 ring-1 ring-red-100' : 'border-slate-300 focus:border-[#f3a812] focus:ring-2 focus:ring-amber-100'
                      }`}
                      value={form.collegeName}
                      onChange={(e) => setField('collegeName', e.target.value)}
                    />
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Department / Discipline" id="reg-dept" required error={errors.department}>
                      <select
                        id="reg-dept"
                        className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold text-slate-800 bg-white outline-none cursor-pointer transition ${
                          errors.department ? 'border-red-500 ring-1 ring-red-100' : 'border-slate-300 focus:border-[#f3a812] focus:ring-2 focus:ring-amber-100'
                        }`}
                        value={form.department}
                        onChange={(e) => setField('department', e.target.value)}
                      >
                        <option value="">Select Department</option>
                        {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </Field>

                    <Field label="Year of Study" id="reg-year" required error={errors.year}>
                      <select
                        id="reg-year"
                        className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold text-slate-800 bg-white outline-none cursor-pointer transition ${
                          errors.year ? 'border-red-500 ring-1 ring-red-100' : 'border-slate-300 focus:border-[#f3a812] focus:ring-2 focus:ring-amber-100'
                        }`}
                        value={form.year}
                        onChange={(e) => setField('year', e.target.value)}
                      >
                        <option value="">Select Year</option>
                        {YEARS.map((y) => <option key={y} value={y}>{y} Year</option>)}
                      </select>
                    </Field>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                id="btn-register-submit"
                type="submit"
                disabled={submitting}
                className={`w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-xl cursor-pointer ${
                  isSchool
                    ? 'bg-[#104288] hover:bg-[#0c336b] text-white'
                    : 'bg-[#f3a812] hover:bg-[#d9920a] text-white'
                } ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting Registration…</span>
                  </>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Security / Terms Notice */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Official WeGrow B School Portal • Your data is protected</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 bg-white/70 backdrop-blur-md py-6 text-center text-xs font-medium text-slate-500 relative z-10">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">WeGrow Connect</span>
            <span>•</span>
            <span className="text-[#104288] font-semibold">WeGrow B School</span>
          </div>
          <div className="text-slate-400">
            Campaign ID: <span className="font-mono font-semibold text-slate-700">{campaignId}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Field component ─────────────────────────── */
function Field({ label, id, required, error, children }) {
  return (
    <div className="flex-1 flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-bold text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <span className="text-xs text-red-500 font-semibold flex items-center gap-1 mt-0.5">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </span>
      )}
    </div>
  );
}
