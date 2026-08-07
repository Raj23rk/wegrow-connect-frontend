import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import {
  fetchProfile,
  updateProfile,
  deleteProfile,
  clearAuthStorage,
} from '../services/api';

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

function profileToForm(profile) {
  return {
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    phone: profile.phone || '',
    city: profile.city || '',
    state: profile.state || '',
    college: profile.college || '',
    course: profile.course || '',
    department: profile.department || '',
    year: profile.year || '',
    companyName: profile.companyName || '',
    businessType: profile.businessType || '',
    designation: profile.designation || '',
    experience: profile.experience ?? '',
    website: profile.website || '',
    idCardUrl: profile.idCardUrl || '',
    visitingCardUrl: profile.visitingCardUrl || '',
  };
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/home/login');
      return;
    }

    loadProfile();
  }, [navigate]);

  useEffect(() => {
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';

    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    setMessage('');
    try {
      const data = await fetchProfile();
      if (data.success) {
        setProfile(data.data);
        setForm(profileToForm(data.data));
        localStorage.setItem('user', JSON.stringify(data.data));
      } else {
        setMessage(data.message || 'Failed to load profile');
        if (data.message?.toLowerCase().includes('unauthorized')) {
          clearAuthStorage();
          navigate('/home/login');
        }
      }
    } catch {
      setMessage('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const payload = {
      ...form,
      experience: form.experience === '' ? 0 : Number(form.experience),
    };

    try {
      const data = await updateProfile(payload);
      if (data.success) {
        setProfile(data.data);
        setForm(profileToForm(data.data));
        localStorage.setItem('user', JSON.stringify(data.data));
        setMessage('Profile updated successfully');
      } else {
        setMessage(data.message || 'Failed to update profile');
      }
    } catch {
      setMessage('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your profile? This cannot be undone.')) {
      return;
    }

    setDeleting(true);
    setMessage('');

    try {
      const data = await deleteProfile();
      if (data.success) {
        clearAuthStorage();
        navigate('/home/login');
      } else {
        setMessage(data.message || 'Failed to delete profile');
      }
    } catch {
      setMessage('Failed to delete profile');
    } finally {
      setDeleting(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border-2 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100';

  const labelClass = 'block text-xs font-bold uppercase mb-1.5';

  if (loading) {
    return (
      <div
        className="page-scroll flex items-center justify-center font-['Inter']"
        style={{ backgroundColor: theme.bgDark, color: theme.textMain }}
      >
        <p className="font-bold" style={{ color: theme.primary }}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div
      className="page-scroll font-['Inter'] py-10 px-4 pb-16"
      style={{ backgroundColor: theme.bgDark, color: theme.textMain }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold" style={{ color: theme.primary }}>
              My Profile
            </h1>
            {profile && (
              <p className="text-sm mt-1" style={{ color: theme.textMuted }}>
                {profile.email} · {profile.role}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="px-5 py-2.5 rounded-full text-sm font-bold border-2 transition"
            style={{ borderColor: theme.primary, color: theme.primary }}
          >
            ← Back to Home
          </button>
        </div>

        {message && (
          <div
            className="mb-6 px-4 py-3 rounded-xl text-sm font-semibold"
            style={{
              backgroundColor: message.includes('success') ? 'rgba(16, 66, 136, 0.08)' : 'rgba(220, 38, 38, 0.08)',
              color: message.includes('success') ? theme.primary : '#dc2626',
            }}
          >
            {message}
          </div>
        )}

        <form
          onSubmit={handleUpdate}
          className="rounded-2xl p-6 md:p-8 shadow-xl space-y-8"
          style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}
        >
          <section>
            <h2 className="text-lg font-extrabold mb-4" style={{ color: theme.primary }}>
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ['firstName', 'First Name'],
                ['lastName', 'Last Name'],
                ['phone', 'Phone'],
                ['city', 'City'],
                ['state', 'State'],
              ].map(([field, label]) => (
                <div key={field}>
                  <label className={labelClass} style={{ color: theme.textMuted }}>{label}</label>
                  <input
                    type="text"
                    value={form[field]}
                    onChange={handleChange(field)}
                    className={inputClass}
                    style={{ borderColor: theme.cardBorder }}
                  />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-extrabold mb-4" style={{ color: theme.primary }}>
              Academic Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ['college', 'College'],
                ['course', 'Course'],
                ['department', 'Department'],
                ['year', 'Year'],
              ].map(([field, label]) => (
                <div key={field}>
                  <label className={labelClass} style={{ color: theme.textMuted }}>{label}</label>
                  <input
                    type="text"
                    value={form[field]}
                    onChange={handleChange(field)}
                    className={inputClass}
                    style={{ borderColor: theme.cardBorder }}
                  />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-extrabold mb-4" style={{ color: theme.primary }}>
              Professional Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ['companyName', 'Company Name'],
                ['businessType', 'Business Type'],
                ['designation', 'Designation'],
                ['experience', 'Experience (years)'],
                ['website', 'Website'],
              ].map(([field, label]) => (
                <div key={field}>
                  <label className={labelClass} style={{ color: theme.textMuted }}>{label}</label>
                  <input
                    type={field === 'experience' ? 'number' : 'text'}
                    value={form[field]}
                    onChange={handleChange(field)}
                    className={inputClass}
                    style={{ borderColor: theme.cardBorder }}
                  />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-extrabold mb-4" style={{ color: theme.primary }}>
              Documents
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {[
                ['idCardUrl', 'ID Card URL'],
                ['visitingCardUrl', 'Visiting Card URL'],
              ].map(([field, label]) => (
                <div key={field}>
                  <label className={labelClass} style={{ color: theme.textMuted }}>{label}</label>
                  <input
                    type="text"
                    value={form[field]}
                    onChange={handleChange(field)}
                    className={inputClass}
                    style={{ borderColor: theme.cardBorder }}
                  />
                </div>
              ))}
            </div>
          </section>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-full font-extrabold text-sm text-white transition disabled:opacity-70"
              style={{ background: `linear-gradient(90deg, ${theme.orange} 0%, ${theme.primary} 100%)` }}
            >
              {saving ? 'Updating...' : 'Update Profile'}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="px-6 py-3 rounded-full font-extrabold text-sm transition disabled:opacity-70"
              style={{ color: '#dc2626', border: '2px solid rgba(220, 38, 38, 0.3)' }}
            >
              {deleting ? 'Deleting...' : 'Delete Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
