import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  GraduationCap,
  Briefcase,
  FileText,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Save,
  ShieldCheck,
} from 'lucide-react';

import StudentSidebar from './StudentSidebar';
import BusinessSidebar from './BusinessSidebar';
import Sidebar from './Sidebar';
import DashboardProfileMenu from './DashboardProfileMenu';

import {
  fetchProfile,
  updateProfile,
  deleteProfile,
  clearAuthStorage,
} from '../services/api';

// =====================================================
// EMPTY FORM
// =====================================================

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  phone: '',
  city: '',
  state: '',
  college: '',
  course: '',
  department: '',
  year: '',
  companyName: '',
  businessType: '',
  designation: '',
  experience: '',
  website: '',
  idCardUrl: '',
  visitingCardUrl: '',
};

// =====================================================
// PROFILE → FORM
// =====================================================

function profileToForm(profile) {
  return {
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    phone: profile?.phone || '',
    city: profile?.city || '',
    state: profile?.state || '',
    college: profile?.college || '',
    course: profile?.course || '',
    department: profile?.department || '',
    year: profile?.year || '',
    companyName: profile?.companyName || '',
    businessType: profile?.businessType || '',
    designation: profile?.designation || '',
    experience: profile?.experience ?? '',
    website: profile?.website || '',
    idCardUrl: profile?.idCardUrl || '',
    visitingCardUrl: profile?.visitingCardUrl || '',
  };
}

// =====================================================
// PROFILE PAGE
// =====================================================

export default function ProfilePage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState('');

  // =====================================================
  // AUTH CHECK + LOAD PROFILE
  // =====================================================

  useEffect(() => {
    let isMounted = true;

    const checkAuthAndLoadProfile = async () => {
      /*
       * IMPORTANT:
       *
       * Authentication token must live in sessionStorage.
       *
       * sessionStorage survives:
       * - page refresh
       * - route changes
       *
       * sessionStorage is cleared when the browser session ends.
       */

      const token = sessionStorage.getItem('accessToken');

      if (!token) {
        // Remove any old token left from previous localStorage implementation
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        localStorage.removeItem('role');

        clearAuthStorage();

        navigate('/home/login', { replace: true });
        return;
      }

      if (!isMounted) return;

      await loadProfile();
    };

    checkAuthAndLoadProfile();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  // =====================================================
  // PAGE SCROLL
  // =====================================================

  useEffect(() => {
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';

    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

  // =====================================================
  // LOAD PROFILE
  // =====================================================

  const loadProfile = async () => {
    setLoading(true);
    setMessage('');

    try {
      const data = await fetchProfile();

      if (data?.success) {
        setProfile(data.data);
        setForm(profileToForm(data.data));

        /*
         * IMPORTANT:
         *
         * User information can be stored in sessionStorage.
         * Do not use localStorage for authenticated user data.
         */
        sessionStorage.setItem(
          'user',
          JSON.stringify(data.data)
        );

        if (data.data?.role) {
          sessionStorage.setItem(
            'role',
            String(data.data.role)
          );
        }
      } else {
        const errorMessage =
          data?.message || 'Failed to load profile';

        setMessage(errorMessage);

        if (
          errorMessage.toLowerCase().includes('unauthorized') ||
          errorMessage.toLowerCase().includes('token') ||
          errorMessage.toLowerCase().includes('authentication') ||
          errorMessage.toLowerCase().includes('jwt')
        ) {
          handleLogout();
        }
      }
    } catch (error) {
      console.error('Load profile error:', error);

      /*
       * If API returns 401 through your api.js,
       * clear the session and redirect to login.
       */
      if (
        error?.response?.status === 401 ||
        error?.status === 401
      ) {
        handleLogout();
        return;
      }

      setMessage('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOGOUT / CLEAR AUTH
  // =====================================================

  const handleLogout = () => {
    /*
     * Clear BOTH storages here.
     *
     * localStorage is cleared because old versions
     * of your application may have stored the token there.
     */

    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('role');

    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('role');

    try {
      clearAuthStorage();
    } catch (error) {
      console.error('clearAuthStorage error:', error);
    }

    navigate('/home/login', { replace: true });
  };

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  // =====================================================
  // UPDATE PROFILE
  // =====================================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage('');

    const payload = {
      ...form,
      experience:
        form.experience === ''
          ? 0
          : Number(form.experience),
    };

    try {
      const data = await updateProfile(payload);

      if (data?.success) {
        setProfile(data.data);
        setForm(profileToForm(data.data));

        /*
         * Store latest profile only in sessionStorage.
         */
        sessionStorage.setItem(
          'user',
          JSON.stringify(data.data)
        );

        if (data.data?.role) {
          sessionStorage.setItem(
            'role',
            String(data.data.role)
          );
        }

        setMessage('Profile updated successfully!');
      } else {
        setMessage(
          data?.message || 'Failed to update profile'
        );
      }
    } catch (error) {
      console.error('Update profile error:', error);

      if (
        error?.response?.status === 401 ||
        error?.status === 401
      ) {
        handleLogout();
        return;
      }

      setMessage('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE PROFILE
  // =====================================================

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your profile? This action cannot be undone.'
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setMessage('');

    try {
      const data = await deleteProfile();

      if (data?.success) {
        handleLogout();
      } else {
        setMessage(
          data?.message || 'Failed to delete profile'
        );
      }
    } catch (error) {
      console.error('Delete profile error:', error);

      if (
        error?.response?.status === 401 ||
        error?.status === 401
      ) {
        handleLogout();
        return;
      }

      setMessage('Failed to delete profile');
    } finally {
      setDeleting(false);
    }
  };

  // =====================================================
  // ROLE / USER INFO
  // =====================================================

  const role = (
    profile?.role ||
    sessionStorage.getItem('role') ||
    'student'
  ).toLowerCase();

  const firstName =
    profile?.firstName ||
    profile?.name ||
    profile?.username ||
    profile?.email?.split('@')[0] ||
    'User';

  const fullName =
    `${profile?.firstName || ''} ${
      profile?.lastName || ''
    }`.trim() ||
    profile?.name ||
    profile?.email ||
    'User';

  const initial = (
    firstName?.[0] || 'U'
  ).toUpperCase();

  // =====================================================
  // STYLES
  // =====================================================

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#00a8ec] focus:ring-2 focus:ring-cyan-100 transition-all shadow-2xs';

  const labelClass =
    'block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5';

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
        <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
          <div className="w-5 h-5 border-2 border-[#00a8ec] border-t-transparent rounded-full animate-spin" />
          <span>Loading Profile Details...</span>
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="flex min-h-screen bg-slate-50/60 font-sans text-slate-800 antialiased">

      {/* =================================================
          DYNAMIC SIDEBAR
      ================================================= */}

      {role === 'admin' ? (
        <Sidebar />
      ) : role === 'business' ? (
        <BusinessSidebar />
      ) : (
        <StudentSidebar />
      )}

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="flex-1 flex flex-col min-w-0 h-screen max-h-screen overflow-hidden">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="bg-white border-b border-slate-200/80 px-8 py-3.5 flex items-center justify-between shadow-2xs shrink-0 w-full z-20">
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            My Profile
          </h1>

          <div className="flex items-center gap-3">
            <DashboardProfileMenu />
          </div>
        </header>

        {/* =================================================
            SCROLL CONTENT
        ================================================= */}

        <main className="flex-1 overflow-y-auto p-8 space-y-8">

          {/* =================================================
              MESSAGE
          ================================================= */}

          {message && (
            <div
              className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${
                message.includes('success')
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {message.includes('success') ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}

              <span>{message}</span>
            </div>
          )}

          {/* =================================================
              PROFILE
          ================================================= */}

          <div className="space-y-6 max-w-5xl">

            {/* =================================================
                PROFILE HEADER
            ================================================= */}

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">

              <div className="flex items-center gap-4">

                <div className="relative">

                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#00a8ec] to-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
                    {initial}
                  </div>

                  <span className="absolute bottom-0 right-0 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />

                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white" />
                  </span>

                </div>

                <div>

                  <h2 className="text-xl font-black text-slate-900 leading-tight">
                    {fullName}
                  </h2>

                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {profile?.email}
                  </p>

                  <div className="flex items-center gap-2 mt-2">

                    <span className="px-2.5 py-0.5 bg-cyan-50 text-[#00a8ec] border border-cyan-200/60 rounded-full text-[10px] font-black uppercase tracking-wider">
                      {role}
                    </span>

                    <span className="flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full text-[10px] font-black">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      Verified Active Account
                    </span>

                  </div>

                </div>

              </div>

            </div>

            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={handleUpdate}
              className="space-y-6"
            >

              {/* =================================================
                  PERSONAL
              ================================================= */}

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">

                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <User className="w-5 h-5 text-[#00a8ec]" />

                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Personal Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                  {[
                    ['firstName', 'First Name'],
                    ['lastName', 'Last Name'],
                    ['phone', 'Phone'],
                    ['city', 'City'],
                    ['state', 'State'],
                  ].map(([field, label]) => (
                    <div key={field}>

                      <label className={labelClass}>
                        {label}
                      </label>

                      <input
                        type="text"
                        value={form[field]}
                        onChange={handleChange(field)}
                        className={inputClass}
                        placeholder={`Enter ${label.toLowerCase()}`}
                      />

                    </div>
                  ))}

                </div>

              </div>

              {/* =================================================
                  ACADEMIC
              ================================================= */}

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">

                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <GraduationCap className="w-5 h-5 text-[#00a8ec]" />

                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Academic Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                  {[
                    ['college', 'College / Institution'],
                    ['course', 'Degree / Course'],
                    ['department', 'Department'],
                    ['year', 'Passing Year'],
                  ].map(([field, label]) => (
                    <div key={field}>

                      <label className={labelClass}>
                        {label}
                      </label>

                      <input
                        type="text"
                        value={form[field]}
                        onChange={handleChange(field)}
                        className={inputClass}
                        placeholder={`Enter ${label.toLowerCase()}`}
                      />

                    </div>
                  ))}

                </div>

              </div>

              {/* =================================================
                  PROFESSIONAL
              ================================================= */}

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">

                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Briefcase className="w-5 h-5 text-[#00a8ec]" />

                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Professional Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                  {[
                    ['companyName', 'Company Name'],
                    ['businessType', 'Business Type'],
                    ['designation', 'Designation'],
                    ['experience', 'Experience (Years)'],
                    ['website', 'Website URL'],
                  ].map(([field, label]) => (
                    <div key={field}>

                      <label className={labelClass}>
                        {label}
                      </label>

                      <input
                        type={
                          field === 'experience'
                            ? 'number'
                            : 'text'
                        }
                        value={form[field]}
                        onChange={handleChange(field)}
                        className={inputClass}
                        placeholder={`Enter ${label.toLowerCase()}`}
                      />

                    </div>
                  ))}

                </div>

              </div>

              {/* =================================================
                  DOCUMENTS
              ================================================= */}

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">

                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <FileText className="w-5 h-5 text-[#00a8ec]" />

                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Identity & Documents
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {[
                    ['idCardUrl', 'ID Card File URL'],
                    ['visitingCardUrl', 'Visiting Card / Proof URL'],
                  ].map(([field, label]) => (
                    <div key={field}>

                      <label className={labelClass}>
                        {label}
                      </label>

                      <input
                        type="text"
                        value={form[field]}
                        onChange={handleChange(field)}
                        className={inputClass}
                        placeholder={`Enter ${label.toLowerCase()}`}
                      />

                    </div>
                  ))}

                </div>

              </div>

              {/* =================================================
                  BUTTONS
              ================================================= */}

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#00a8ec] hover:bg-[#0294d1] text-white px-8 py-3 rounded-xl text-xs font-black shadow-md shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />

                  <span>
                    {saving
                      ? 'Updating Profile...'
                      : 'Save Profile Changes'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-rose-600 border border-rose-200 hover:bg-rose-50 transition-all cursor-pointer disabled:opacity-60"
                >
                  <Trash2 className="w-4 h-4 text-rose-500" />

                  <span>
                    {deleting
                      ? 'Deleting...'
                      : 'Delete Account'}
                  </span>
                </button>

              </div>

            </form>

          </div>

        </main>

      </div>

    </div>
  );
}