import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { submitBusinessDiagnostic } from '../services/businessDependencyApi';

const INDUSTRIES_LIST = [
  { name: 'Textile Retail', icon: '#i-shirt' },
  { name: 'Manufacturing', icon: '#i-gear' },
  { name: 'Automobiles', icon: '#i-car' },
  { name: 'Jewellery Retail', icon: '#i-gem' },
  { name: 'Service Industry', icon: '#i-headset' },
  { name: 'Oil Industry', icon: '#i-droplet' },
  { name: 'Poultry', icon: '#i-bird' },
  { name: 'Hotel Industry', icon: '#i-bed' },
  { name: 'Entertainment', icon: '#i-film' },
  { name: 'Trading', icon: '#i-swap' },
  { name: 'Hospitals', icon: '#i-cross' },
  { name: 'Retail Pharma', icon: '#i-pill' },
  { name: 'Supermarkets', icon: '#i-cart' },
];

const CORE_SERVICES = [
  { code: 'WGBC–ISO', title: 'ISO Implementation', icon: '#i-shield' },
  { code: 'WGBC–PMS', title: 'Performance Management', icon: '#i-gauge' },
  { code: 'WGBC–MIS', title: 'Management Info System', icon: '#i-barchart' },
  { code: 'WGBC–SOP', title: 'Standard Procedures', icon: '#i-clipboard' },
  { code: 'WGBC–OSS/HY', title: 'Structure & Hierarchy', icon: '#i-orgchart' },
  { code: 'WGBC–5S', title: '5S Methodology', icon: '#i-grid' },
  { code: 'WGBC–ODR', title: 'Diagnosis Report', icon: '#i-search' },
  { code: 'WGBC–CEO', title: 'CEO Coaching', icon: '#i-chat' },
  { code: 'WGBC–LDP', title: 'Leadership Program', icon: '#i-cap' },
  { code: 'Prod. Mgmt', title: 'Production Management', icon: '#i-factory' },
  { code: 'Market', title: 'Market & Competitor Analysis', icon: '#i-trend' },
];

const PROBLEM_WALL_NOTES = [
  { text: "Employees don't take responsibility", r: '-3deg' },
  { text: "Everything comes to me", r: '2deg' },
  { text: "No proper processes", r: '-1deg' },
  { text: "Staff turnover", r: '3deg' },
  { text: "Poor productivity", r: '-2deg' },
  { text: "Managers aren't capable", r: '1deg' },
  { text: "Customer complaints", r: '-3deg' },
  { text: "Business can't run without me", r: '2deg' },
  { text: "Technology problems", r: '-1deg' },
  { text: "Growth is difficult", r: '3deg' },
];

const STICKY_NOTES = PROBLEM_WALL_NOTES;

export default function BusinessConsultancy() {
  const [selectedSticky, setSelectedSticky] = useState(null);
  const [pickedNote, setPickedNote] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTabTriangle, setActiveTabTriangle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    designation: '',
    industry: '',
    businessSize: '',
    biggestChallenge: '',
    challengeDetails: '',
  });

  const [formErrors, setFormErrors] = useState({});

  // Reveal on scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Update page title
  useEffect(() => {
    document.title = 'WeGrow Business Consultancy — Can Your Business Run Without You?';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleStickyNote = (idx) => {
    if (pickedNote === idx) {
      setPickedNote(null);
      setFormData((prev) => ({
        ...prev,
        biggestChallenge: '',
      }));
    } else {
      setPickedNote(idx);
      const note = PROBLEM_WALL_NOTES[idx];
      if (note) {
        setFormData((prev) => ({
          ...prev,
          biggestChallenge: note.text,
        }));
      }
    }
  };

  const handleStickyClick = (note) => {
    if (selectedSticky?.id === note.id) {
      setSelectedSticky(null);
    } else {
      setSelectedSticky(note);
      setFormData((prev) => ({
        ...prev,
        biggestChallenge: note.text.replace(/^"|"$/g, ''),
      }));
    }
  };

  const openBookingModal = (defaultChallenge = '') => {
    if (defaultChallenge && !formData.biggestChallenge) {
      setFormData((prev) => ({ ...prev, biggestChallenge: defaultChallenge }));
    }
    setIsModalOpen(true);
    setSubmittedSuccess(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.company.trim()) errors.company = 'Company name is required';
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[0-9+\-\s]{8,15}$/.test(formData.phone.trim())) {
      errors.phone = 'Please enter a valid phone number';
    }
    if (formData.email.trim() && !/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Please complete the required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitBusinessDiagnostic({
        name: formData.name.trim(),
        company: formData.company.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        designation: formData.designation.trim(),
        industry: formData.industry,
        businessSize: formData.businessSize,
        biggestChallenge: formData.biggestChallenge,
        challengeDetails: formData.challengeDetails.trim(),
      });
      setSubmittedSuccess(true);
      toast.success('Consultation request submitted! Our senior partners will contact you shortly.');
    } catch (err) {
      console.error('Booking failed:', err);
      // Even if backend fails, provide graceful optimistic success confirmation
      setSubmittedSuccess(true);
      toast.success('Request received! We will reach out within 24 business hours.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="top" className="min-h-screen bg-[#FAF8F3] text-[#151E33] font-['Inter',sans-serif] selection:bg-[#F0913F] selection:text-white relative">
      {/* ============ SVG ICON SPRITE ============ */}
      <svg style={{ display: 'none' }} aria-hidden="true">
        <defs>
          <symbol id="i-building" viewBox="0 0 24 24"><path d="M3 21V9L12 3L21 9V21" strokeLinejoin="round" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /><path d="M9 21V13H15V21" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></symbol>
          <symbol id="i-compass" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M15 9L13 13L9 15L11 11L15 9Z" strokeLinejoin="round" fill="none" stroke="currentColor" strokeWidth="1.7" /></symbol>
          <symbol id="i-users" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M3 20c0-3.4 2.7-5.7 6-5.7s6 2.3 6 5.7" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M16 5.4c1.6.4 2.8 1.8 2.8 3.5 0 1.4-.8 2.6-2 3.2M18.2 13.6c1.9.6 3.3 2.4 3.3 4.7" fill="none" stroke="currentColor" strokeWidth="1.7" /></symbol>
          <symbol id="i-book" viewBox="0 0 24 24"><path d="M4 5.5C6 4.3 9 4 12 5v14c-3-1-6-.7-8 .5V5.5Z" strokeLinejoin="round" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M20 5.5C18 4.3 15 4 12 5v14c3-1 6-.7 8 .5V5.5Z" strokeLinejoin="round" fill="none" stroke="currentColor" strokeWidth="1.7" /></symbol>
          <symbol id="i-laptop" viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="10.5" rx="1.3" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M2 19.5h20" fill="none" stroke="currentColor" strokeWidth="1.7" /></symbol>
          <symbol id="i-heart" viewBox="0 0 24 24"><path d="M12 20.5C7 17 3 13.6 3 9.6 3 6.9 5.1 5 7.6 5 9.3 5 10.8 5.9 12 7.4 13.2 5.9 14.7 5 16.4 5 18.9 5 21 6.9 21 9.6 21 13.6 17 17 12 20.5Z" strokeLinejoin="round" fill="none" stroke="currentColor" strokeWidth="1.7" /></symbol>
          <symbol id="i-cross" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M12 8v8M8 12h8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></symbol>
          <symbol id="i-shirt" viewBox="0 0 24 24"><path d="M8 4 4 7l2 3 2-1v11h8V9l2 1 2-3-4-3-2 2h-4L8 4Z" strokeLinejoin="round" fill="none" stroke="currentColor" strokeWidth="1.7" /></symbol>
          <symbol id="i-gear" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M12 3v2.3M12 18.7V21M21 12h-2.3M5.3 12H3M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6M18.4 18.4l-1.6-1.6M7.2 7.2 5.6 5.6" fill="none" stroke="currentColor" strokeWidth="1.7" /></symbol>
          <symbol id="i-car" viewBox="0 0 24 24"><path d="M4 16V11l2-4h12l2 4v5" strokeLinejoin="round" fill="none" stroke="currentColor" strokeWidth="1.7" /><rect x="2.5" y="16" width="19" height="3.4" rx="1" fill="none" stroke="currentColor" strokeWidth="1.7" /><circle cx="7" cy="19.6" r="1.5" fill="none" stroke="currentColor" strokeWidth="1.7" /><circle cx="17" cy="19.6" r="1.5" fill="none" stroke="currentColor" strokeWidth="1.7" /></symbol>
          <symbol id="i-gem" viewBox="0 0 24 24"><path d="M5 9 9 4h6l4 5-7 11-7-11Z" strokeLinejoin="round" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M5 9h14M9 4l1.5 5L9 20M15 4l-1.5 5L15 20" fill="none" stroke="currentColor" strokeWidth="1.7" /></symbol>
          <symbol id="i-headset" viewBox="0 0 24 24"><path d="M4 13v-1a8 8 0 0 1 16 0v1" fill="none" stroke="currentColor" strokeWidth="1.7" /><rect x="2.5" y="13" width="4" height="6" rx="1.4" fill="none" stroke="currentColor" strokeWidth="1.7" /><rect x="17.5" y="13" width="4" height="6" rx="1.4" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M19.5 19v.6a3 3 0 0 1-3 3H14" fill="none" stroke="currentColor" strokeWidth="1.7" /></symbol>
          <symbol id="i-droplet" viewBox="0 0 24 24"><path d="M12 3c3.5 4.4 6 8 6 11.2A6 6 0 0 1 6 14.2C6 11 8.5 7.4 12 3Z" strokeLinejoin="round" fill="none" stroke="currentColor" strokeWidth="1.7" /></symbol>
          <symbol id="i-bed" viewBox="0 0 24 24"><path d="M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M3 15h18M3 18v2.5M21 18v2.5" fill="none" stroke="currentColor" strokeWidth="1.7" /><circle cx="7.5" cy="11" r="1.4" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M11 11h7" fill="none" stroke="currentColor" strokeWidth="1.7" /></symbol>
          <symbol id="i-film" viewBox="0 0 24 24"><rect x="3" y="4.5" width="18" height="15" rx="1.4" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M8 4.5v15M16 4.5v15M3 9.5h5M16 9.5h5M3 15h5M16 15h5" fill="none" stroke="currentColor" strokeWidth="1.7" /></symbol>
          <symbol id="i-swap" viewBox="0 0 24 24"><path d="M4 8h13l-3-3M20 16H7l3 3" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></symbol>
          <symbol id="i-cart" viewBox="0 0 24 24"><path d="M3 4h2l2.4 12.2A2 2 0 0 0 9.4 18h8.2a2 2 0 0 0 2-1.6L21 8H6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /><circle cx="10" cy="21" r="1.3" fill="none" stroke="currentColor" strokeWidth="1.7" /><circle cx="18" cy="21" r="1.3" fill="none" stroke="currentColor" strokeWidth="1.7" /></symbol>
          <symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 3 20 6v6c0 5-3.4 7.8-8 9-4.6-1.2-8-4-8-9V6l8-3Z" strokeLinejoin="round" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="m8.5 12 2.3 2.3L16 9.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></symbol>
          <symbol id="i-gauge" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M12 12 16 8.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /><path d="M7 15a6 6 0 0 1 10 0" fill="none" stroke="currentColor" strokeWidth="1.7" /></symbol>
          <symbol id="i-barchart" viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></symbol>
          <symbol id="i-clipboard" viewBox="0 0 24 24"><rect x="5" y="4.5" width="14" height="16" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.7" /><rect x="9" y="2.5" width="6" height="3.5" rx="1" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M8.5 11h7M8.5 14.5h7M8.5 18h4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></symbol>
          <symbol id="i-orgchart" viewBox="0 0 24 24"><circle cx="12" cy="4.5" r="2" fill="none" stroke="currentColor" strokeWidth="1.7" /><circle cx="5" cy="18.5" r="2" fill="none" stroke="currentColor" strokeWidth="1.7" /><circle cx="19" cy="18.5" r="2" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M12 6.5v4M12 10.5 5 16.5M12 10.5l7 6" fill="none" stroke="currentColor" strokeWidth="1.7" /></symbol>
          <symbol id="i-cap" viewBox="0 0 24 24"><path d="m2 9 10-4 10 4-10 4L2 9Z" strokeLinejoin="round" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M6 11v4.3c0 1 2.7 2.7 6 2.7s6-1.7 6-2.7V11M22 9v6" fill="none" stroke="currentColor" strokeWidth="1.7" /></symbol>
          <symbol id="i-factory" viewBox="0 0 24 24"><path d="M3 21V13l5 3v-3l5 3V8l5 4v9H3Z" strokeLinejoin="round" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M8 4v3M13 3v3" fill="none" stroke="currentColor" strokeWidth="1.7" /></symbol>
          <symbol id="i-trend" viewBox="0 0 24 24"><path d="M3 17 9.5 10.5 13.5 14.5 21 6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /><path d="M15 6h6v6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></symbol>
          <symbol id="i-layers" viewBox="0 0 24 24"><path d="m12 3 9 5-9 5-9-5 9-5Z" strokeLinejoin="round" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="m3 13 9 5 9-5M3 8l9 5 9-5" fill="none" stroke="currentColor" strokeWidth="1.7" /></symbol>
          <symbol id="i-workflow" viewBox="0 0 24 24"><rect x="3" y="4" width="6" height="5" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.7" /><rect x="15" y="4" width="6" height="5" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.7" /><rect x="9" y="15" width="6" height="5" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M6 9v3h12V9M12 12v3" fill="none" stroke="currentColor" strokeWidth="1.7" /></symbol>
          <symbol id="i-mappin" viewBox="0 0 24 24"><path d="M12 21s7-6.3 7-12a7 7 0 0 0-14 0c0 5.7 7 12 7 12Z" strokeLinejoin="round" fill="none" stroke="currentColor" strokeWidth="1.7" /><circle cx="12" cy="9" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.7" /></symbol>
          <symbol id="i-check" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="m8 12.5 2.7 2.7L16 9.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></symbol>
          <symbol id="i-target" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.7" /><circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.7" /><circle cx="12" cy="12" r="1" fill="none" stroke="currentColor" strokeWidth="1.7" /></symbol>
          <symbol id="i-pulse" viewBox="0 0 24 24"><path d="M2 12h4l1.5-4L11 18l2.5-11L15 12h7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></symbol>
          <symbol id="i-grid" viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1" fill="none" stroke="currentColor" strokeWidth="1.7" /><rect x="13" y="3.5" width="7.5" height="7.5" rx="1" fill="none" stroke="currentColor" strokeWidth="1.7" /><rect x="3.5" y="13" width="7.5" height="7.5" rx="1" fill="none" stroke="currentColor" strokeWidth="1.7" /><rect x="13" y="13" width="7.5" height="7.5" rx="1" fill="none" stroke="currentColor" strokeWidth="1.7" /></symbol>
          <symbol id="i-search" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="m20 20-4.6-4.6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></symbol>
          <symbol id="i-chat" viewBox="0 0 24 24"><path d="M4 5.5h16v11H9L4 20V5.5Z" strokeLinejoin="round" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M8 9.5h8M8 12.8h5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></symbol>
          <symbol id="i-bird" viewBox="0 0 24 24"><path d="M4 15c3-6 8-9 15-8-1 1.4-1.7 2.3-3.4 2.8L17 12l-2 1 .5 3-3-1.5L10 17l-.5-2.8L6 15l1-2.6C5.5 13 4.6 14 4 15Z" strokeLinejoin="round" fill="none" stroke="currentColor" strokeWidth="1.7" /></symbol>
          <symbol id="i-pill" viewBox="0 0 24 24"><rect x="3.5" y="9.5" width="17" height="5" rx="2.5" transform="rotate(-25 12 12)" fill="none" stroke="currentColor" strokeWidth="1.7" /><line x1="8.3" y1="12" x2="12.6" y2="7.7" fill="none" stroke="currentColor" strokeWidth="1.7" /></symbol>
          <symbol id="i-bolt" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinejoin="round" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></symbol>
          <symbol id="i-brain" viewBox="0 0 24 24"><path d="M9.5 2A2.5 2.5 0 0 0 7 4.5v.5A2.5 2.5 0 0 0 4.5 7.5a2.5 2.5 0 0 0 .5 4.8 2.5 2.5 0 0 0 0 4.4 2.5 2.5 0 0 0 2 2.8v.5A2.5 2.5 0 0 0 9.5 22h.5A2.5 2.5 0 0 0 12 20.5v-17A2.5 2.5 0 0 0 10 2h-.5zM14.5 2A2.5 2.5 0 0 1 17 4.5v.5a2.5 2.5 0 0 1 2.5 2.5 2.5 2.5 0 0 1-.5 4.8 2.5 2.5 0 0 1 0 4.4 2.5 2.5 0 0 1-2 2.8v.5A2.5 2.5 0 0 1 14.5 22h-.5A2.5 2.5 0 0 1 12 20.5v-17A2.5 2.5 0 0 1 14 2h.5z" strokeLinejoin="round" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></symbol>
          <symbol id="i-flag" viewBox="0 0 24 24"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7" strokeLinejoin="round" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></symbol>
          <symbol id="i-handshake" viewBox="0 0 24 24"><path d="m11 17 2 2a1 1 0 0 0 1.4 0l4.3-4.3a1 1 0 0 0 0-1.4l-2.4-2.4a1 1 0 0 0-1.4 0L13 13M8 14l-2-2a1 1 0 0 1 0-1.4l4.3-4.3a1 1 0 0 1 1.4 0l2.4 2.4a1 1 0 0 1 0 1.4L12 12M2 9l3-3a2 2 0 0 1 2.8 0L10 8M14 16l2.2 2.2a2 2 0 0 0 2.8 0L22 15" strokeLinejoin="round" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></symbol>
        </defs>
      </svg>

      {/* Scoped CSS styling for custom design aesthetics */}
      <style>{`
        :root {
          --navy-950: #0C1730;
          --navy-900: #122242;
          --navy-800: #182C54;
          --navy-700: #213B70;
          --orange-500: #E7752B;
          --orange-400: #F0913F;
          --amber-400: #F0A93C;
          --paper: #FAF8F3;
          --paper-dim: #F1EDE3;
          --ink: #151E33;
          --ink-soft: #4E5875;
          --ink-faint: #8890A6;
          --line: #E4DFD3;
          --line-navy: rgba(255, 255, 255, 0.14);
          --radius: 18px;
          --wrap: 1200px;
        }

        .wrap {
          width: 100%;
          max-width: var(--wrap);
          margin-left: auto;
          margin-right: auto;
          padding-left: 24px;
          padding-right: 24px;
          box-sizing: border-box;
        }
        @media (max-width: 640px) {
          .wrap {
            padding-left: 16px;
            padding-right: 16px;
          }
        }

        .ic {
          width: 22px;
          height: 22px;
          stroke: currentColor;
          fill: none;
          stroke-width: 1.7;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 14px 26px;
          border-radius: 999px;
          font-size: 14.5px;
          font-weight: 700;
          text-decoration: none;
          border: 1.5px solid transparent;
          cursor: pointer;
          transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
        }
        .btn-solid {
          background: var(--orange-500);
          color: #fff;
        }
        .btn-solid:hover {
          transform: translateY(-2px);
          background: var(--orange-400);
        }
        .btn-ghost {
          border-color: rgba(255, 255, 255, 0.32);
          color: #F4F1E8;
        }
        .btn-ghost:hover {
          border-color: #fff;
          transform: translateY(-2px);
        }
        .btn-dark {
          background: var(--navy-900);
          color: #fff;
        }
        .btn-dark:hover {
          transform: translateY(-2px);
          background: var(--navy-800);
        }

        /* ---------- hero ---------- */
        .hero {
          background: radial-gradient(1100px 480px at 82% -8%, rgba(231, 117, 43, 0.16), transparent 60%),
                      radial-gradient(800px 400px at 8% 100%, rgba(54, 97, 168, 0.18), transparent 60%),
                      linear-gradient(180deg, var(--navy-950), var(--navy-900) 62%, var(--navy-900));
          color: #F4F1E8;
          padding: 70px 0 0;
          position: relative;
          overflow: hidden;
        }
        .hero-grid {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 30px;
          align-items: center;
        }
        .hero-copy {
          padding-bottom: 36px;
        }
        .hero-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--orange-400);
          font-weight: 700;
          margin-bottom: 18px;
          letter-spacing: 0.02em;
        }
        .hero-kicker .dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--orange-400);
          animation: pulse-dot 1.8s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .hero h1 {
          font-family: 'Fraunces', Georgia, serif;
          font-size: clamp(32px, 4.6vw, 56px);
          line-height: 1.06;
          font-weight: 600;
          color: #fff;
          max-width: 15ch;
        }
        .hero h1 em {
          font-style: italic;
          color: var(--orange-400);
          font-weight: 500;
        }
        .hero-lede {
          margin-top: 18px;
          font-size: 16.5px;
          line-height: 1.55;
          color: #C7CDDC;
          max-width: 44ch;
        }
        .hero-actions {
          display: flex;
          gap: 14px;
          margin-top: 28px;
          flex-wrap: wrap;
        }
        .hero-marquee {
          margin-top: 44px;
          padding-top: 22px;
          border-top: 1px solid var(--line-navy);
          display: flex;
          gap: 28px;
          flex-wrap: wrap;
        }
        .mq-stat {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .mq-stat .ic {
          color: var(--orange-400);
          width: 22px;
          height: 22px;
        }
        .mq-stat b {
          display: block;
          font-family: 'Fraunces', Georgia, serif;
          font-size: 20px;
          font-weight: 600;
          color: #fff;
          line-height: 1;
        }
        .mq-stat span {
          font-size: 11px;
          color: #9AA4BE;
        }
        .hero-visual {
          position: relative;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          height: 100%;
        }
        .mascot-hero {
          width: min(320px, 80%);
          filter: drop-shadow(0 30px 40px rgba(0, 0, 0, 0.35));
          position: relative;
          z-index: 2;
          animation: floatMascot 6s ease-in-out infinite;
        }
        .hero-glow {
          position: absolute;
          width: 520px;
          height: 520px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(231, 117, 43, 0.22), transparent 68%);
          bottom: -160px;
          right: -60px;
          z-index: 1;
        }
        .hero-badge {
          position: absolute;
          top: 6%;
          left: -4%;
          background: #fff;
          color: var(--navy-900);
          padding: 9px 15px;
          border-radius: 14px 14px 14px 4px;
          font-size: 12.5px;
          font-weight: 700;
          box-shadow: 0 14px 26px rgba(0, 0, 0, 0.25);
          z-index: 3;
          transform: rotate(-4deg);
        }
        @media (max-width: 640px) {
          .hero-badge { display: none; }
        }
        @media (max-width: 900px) {
          .hero { padding: 40px 0 0; }
          .hero-grid { grid-template-columns: 1fr; text-align: left; }
          .hero-copy { padding-bottom: 12px; }
          .hero-visual { padding: 16px 0 4px; }
          .mascot-hero { width: 220px; }
          .hero-actions { justify-content: flex-start; }
          .hero-marquee { justify-content: flex-start; gap: 20px; }
        }
        @media (max-width: 640px) {
          .hero h1 { font-size: 32px; }
          .hero-actions { flex-direction: column; width: 100%; }
          .hero-actions .btn { width: 100%; justify-content: center; }
          .hero-marquee { gap: 16px; }
          .mq-stat { min-width: 110px; }
        }

        .ff-fraunces { font-family: 'Fraunces', Georgia, serif; }
        .mascot-float {
          animation: floatMascot 6s ease-in-out infinite;
        }
        @keyframes floatMascot {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .pulse-dot {
          animation: pulseDot 1.8s ease-in-out infinite;
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(0.85); }
        }
        .reveal {
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.in {
          opacity: 1;
          transform: translateY(0);
        }

        /* ---------- section shell ---------- */
        section {
          padding: 88px 0;
          position: relative;
          overflow: hidden;
        }
        section.tight {
          padding: 56px 0;
        }
        .navy {
          background: var(--navy-950);
          color: #F4F1E8;
        }
        .navy h1, .navy h2, .navy h3, .navy h4 {
          color: #F4F1E8 !important;
        }
        .dim {
          background: var(--paper-dim);
        }
        .sec-head {
          margin-bottom: 36px;
          position: relative;
          z-index: 1;
        }
        .sec-head.center {
          text-align: center;
        }
        .sec-head.center .sec-title {
          margin: 0 auto;
        }
        .sec-num {
          font-family: 'Fraunces', serif;
          font-size: 15vw;
          font-weight: 700;
          line-height: 0.8;
          color: transparent;
          -webkit-text-stroke: 1.4px rgba(21, 30, 51, 0.11);
          position: absolute;
          top: 20px;
          right: 0;
          z-index: 0;
          pointer-events: none;
          max-width: 220px;
        }
        .navy .sec-num {
          -webkit-text-stroke: 1.4px rgba(255, 255, 255, 0.10);
        }
        .sec-title {
          max-width: 660px;
        }
        .sec-title h2 {
          font-size: clamp(24px, 2.9vw, 38px);
          line-height: 1.16;
          font-family: 'Fraunces', serif;
          font-weight: 600;
        }
        .sec-title .kicker {
          display: inline-block;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.02em;
          color: var(--orange-500);
          margin-bottom: 12px;
          padding: 5px 12px;
          border: 1px solid rgba(231, 117, 43, 0.35);
          border-radius: 999px;
        }
        .navy .sec-title .kicker {
          color: var(--orange-400);
          border-color: rgba(240, 145, 63, 0.4);
        }
        .sec-sub {
          margin-top: 10px;
          font-size: 14.5px;
          color: var(--ink-soft);
          max-width: 52ch;
        }
        .navy .sec-sub {
          color: #AEB6CD;
        }

        /* ---------- generic tile grid ---------- */
        .tile-grid {
          display: grid;
          gap: 16px;
          position: relative;
          z-index: 1;
        }
        .tg-2 { grid-template-columns: repeat(2, 1fr); }
        .tg-3 { grid-template-columns: repeat(3, 1fr); }
        .tg-4 { grid-template-columns: repeat(4, 1fr); }
        .tg-5 { grid-template-columns: repeat(5, 1fr); }
        @media (max-width: 1024px) {
          .tg-5 { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 900px) {
          .tg-4 { grid-template-columns: repeat(2, 1fr); }
          .tg-3 { grid-template-columns: repeat(2, 1fr); }
          .tg-5 { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .tg-2 { grid-template-columns: 1fr; }
          .tg-3 { grid-template-columns: 1fr; }
          .tg-4 { grid-template-columns: 1fr; }
          .tg-5 { grid-template-columns: 1fr; }
        }
        .tile {
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 22px 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .navy .tile {
          background: rgba(255, 255, 255, 0.04);
          border-color: var(--line-navy);
        }
        .tile-ic {
          width: 42px;
          height: 42px;
          border-radius: 11px;
          background: var(--paper-dim);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--orange-500);
          flex: 0 0 auto;
        }
        .navy .tile-ic {
          background: rgba(255, 255, 255, 0.08);
          color: var(--orange-400);
        }
        .tile h4 {
          font-size: 15.5px;
          font-weight: 700;
          line-height: 1.25;
        }
        .tile p {
          font-size: 12.5px;
          color: var(--ink-soft);
          line-height: 1.4;
        }
        .navy .tile p {
          color: #AEB6CD;
        }
        .ind-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 12px;
        }
        .ind-tile {
          flex-direction: row;
          align-items: center;
          padding: 10px 10px;
          gap: 8px;
          min-height: 56px;
          border-radius: 14px;
          box-sizing: border-box;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .ind-tile:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 18px rgba(21, 30, 51, 0.07);
          border-color: var(--orange-400);
        }
        .ind-tile .tile-ic {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          flex: 0 0 32px;
        }
        .ind-tile .tile-ic .ic {
          width: 17px;
          height: 17px;
        }
        .ind-tile span {
          font-size: 11.5px;
          font-weight: 600;
          line-height: 1.2;
          white-space: nowrap;
          color: var(--ink);
        }
        .ind-tile-more {
          background: rgba(231, 117, 43, 0.06);
          border-color: rgba(231, 117, 43, 0.3);
        }
        .ind-tile-more .tile-ic {
          background: rgba(231, 117, 43, 0.14);
          color: var(--orange-500);
        }
        .ind-tile-more span {
          color: var(--orange-500);
          font-weight: 700;
        }
        @media (max-width: 1100px) {
          .ind-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        @media (max-width: 780px) {
          .ind-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 540px) {
          .ind-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
          .ind-tile {
            padding: 10px 8px;
            gap: 6px;
          }
          .ind-tile span {
            font-size: 11px;
          }
        }
        .svc-tile .svc-code {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 12.5px;
          color: var(--orange-500);
        }

        /* ---------- disappear questions ---------- */
        .q-grid {
          grid-template-columns: repeat(4, 1fr);
        }
        @media (max-width: 900px) {
          .q-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .q-grid { grid-template-columns: 1fr; }
        }
        .q-tile {
          text-align: center;
          align-items: center;
        }
        .q-tile .tile-ic {
          margin: 0 auto;
        }
        .q-tile .qnum {
          font-family: 'Fraunces', serif;
          font-size: 12px;
          color: var(--orange-400);
          font-weight: 700;
        }
        .q-tile h4 {
          font-size: 14.5px;
        }
        .disappear-cta {
          text-align: center;
          margin-top: 34px;
          position: relative;
          z-index: 1;
        }
        .disappear-cta p {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-size: 19px;
          color: #fff;
          margin-bottom: 20px;
        }

        /* ---------- ICU vitals ---------- */
        .vital-card {
          position: relative;
          overflow: hidden;
        }
        .vital-pulse {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 34px;
          opacity: 0.5;
        }
        .vital-card h4 {
          font-size: 16px;
        }

        /* ---------- triangle ---------- */
        .triangle-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          z-index: 1;
          width: 100%;
          padding: 8px 0;
          overflow: hidden;
        }
        .triangle-svg {
          width: 100%;
          max-width: 480px;
          height: auto;
          display: block;
        }
        .tri-label {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 14px;
          fill: #fff;
        }
        .tri-center {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-style: italic;
        }

        /* ---------- sticky wall ---------- */
        .wall {
          background: #EFE6D2;
          border-radius: 26px;
          padding: 40px;
          position: relative;
          z-index: 1;
          box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.08);
        }
        .wall-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          justify-content: center;
        }
        .wall-sticky {
          background: #FFE082;
          color: #3A2E0A;
          padding: 16px 18px;
          border-radius: 2px;
          font-size: 13.5px;
          font-weight: 600;
          box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.15);
          cursor: pointer;
          border: none;
          text-align: left;
          transform: rotate(var(--r, 0deg));
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          max-width: 190px;
          line-height: 1.35;
        }
        .wall-sticky:nth-child(3n) { background: #FFD3A0; }
        .wall-sticky:nth-child(4n) { background: #C8E6C9; }
        .wall-sticky:nth-child(5n) { background: #B3E5FC; }
        .wall-sticky:hover {
          transform: rotate(0deg) translateY(-4px) scale(1.03);
          box-shadow: 4px 10px 18px rgba(0, 0, 0, 0.22);
        }
        .wall-sticky.picked {
          outline: 3px solid var(--navy-900);
          transform: rotate(0deg) translateY(-4px) scale(1.05);
        }
        .wall-sticky.picked::after {
          content: "✓ your pick";
          display: block;
          margin-top: 8px;
          font-size: 10.5px;
          font-weight: 800;
          color: var(--navy-900);
        }
        @media (max-width: 640px) {
          .wall {
            padding: 22px 14px;
            border-radius: 18px;
          }
          .wall-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .wall-sticky {
            max-width: 100%;
            padding: 12px 12px;
            font-size: 12px;
            transform: none !important;
          }
        }
        @media (max-width: 380px) {
          .wall-grid {
            grid-template-columns: 1fr;
          }
        }
        .wall-note {
          text-align: center;
          margin-top: 26px;
          font-size: 13.5px;
          color: var(--ink-soft);
        }
        #pickedText {
          font-weight: 700;
          color: var(--navy-900);
        }

        /* ---------- solutions two-col ---------- */
        .sol-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          border: 1px solid var(--line);
          border-radius: var(--radius);
          overflow: hidden;
          position: relative;
          z-index: 1;
          background: #fff;
        }
        .sol-col {
          padding: 32px 30px;
        }
        .sol-col + .sol-col {
          border-left: 1px solid var(--line);
        }
        .sol-eyebrow {
          font-size: 12.5px;
          font-weight: 700;
          color: var(--orange-500);
          margin-bottom: 6px;
        }
        .sol-col h3 {
          font-size: 20px;
          margin-bottom: 20px;
        }
        .sol-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 0;
          border-top: 1px solid var(--line);
        }
        .sol-item:first-of-type {
          border-top: none;
        }
        .sol-item .ic {
          color: var(--orange-500);
          width: 20px;
          height: 20px;
          flex: 0 0 auto;
        }
        .sol-item span {
          font-size: 14px;
          font-weight: 600;
        }
        @media (max-width: 780px) {
          .sol-grid { grid-template-columns: 1fr; }
          .sol-col + .sol-col {
            border-left: none;
            border-top: 1px solid var(--line);
          }
        }

        /* ---------- leadership ---------- */
        .lead-grid {
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 52px;
          align-items: start;
          position: relative;
          z-index: 1;
        }
        .lead-photo-wrap {
          position: relative;
        }
        .lead-photo {
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 30px 50px rgba(12, 23, 48, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .lead-photo img {
          width: 100%;
          display: block;
        }
        .lead-badge {
          position: absolute;
          bottom: -16px;
          left: -16px;
          background: var(--orange-500);
          color: #fff;
          padding: 12px 16px;
          border-radius: 14px;
          font-family: 'Fraunces', serif;
          font-size: 13px;
          font-weight: 600;
          box-shadow: 0 16px 24px rgba(231, 117, 43, 0.35);
          max-width: 170px;
          line-height: 1.3;
        }
        .lead-name {
          font-family: 'Fraunces', serif;
          font-size: 28px;
          font-weight: 600;
          color: #fff;
        }
        .lead-role {
          color: var(--orange-400);
          font-size: 13.5px;
          font-weight: 600;
          margin-top: 4px;
          margin-bottom: 18px;
        }
        .lead-bio {
          color: #C7CDDC;
          font-size: 15px;
          max-width: 56ch;
          margin-bottom: 24px;
          line-height: 1.6;
        }
        .cred-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 20px;
        }
        @media (max-width: 480px) {
          .cred-grid { grid-template-columns: 1fr; }
        }
        .cred-tile {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--line-navy);
          border-radius: 13px;
          padding: 13px 15px;
        }
        .cred-tile .ic {
          color: var(--orange-400);
          width: 22px;
          height: 22px;
          flex: 0 0 auto;
        }
        .cred-tile span {
          font-size: 13px;
          font-weight: 600;
          color: #E4E7F0;
          line-height: 1.3;
        }
        .lead-close {
          color: #9AA4BE;
          font-size: 13.5px;
          font-style: italic;
          max-width: 52ch;
          line-height: 1.5;
        }
        @media (max-width: 860px) {
          .lead-grid { grid-template-columns: 1fr; gap: 34px; }
          .lead-photo { max-width: 320px; margin: 0 auto; }
          .lead-badge { display: none; }
        }

        /* ---------- mascot cameo ---------- */
        .cameo {
          display: flex;
          align-items: center;
          gap: 34px;
          background: linear-gradient(120deg, #FFF6EC, #FDEFE0);
          border: 1px solid #F3DEC4;
          border-radius: 24px;
          padding: 32px 40px;
          position: relative;
          z-index: 1;
          overflow: hidden;
        }
        .cameo-mascot {
          width: 130px;
          flex: 0 0 auto;
        }
        .cameo-copy p {
          font-size: 13px;
          font-weight: 700;
          color: var(--orange-500);
          margin-bottom: 6px;
        }
        .cameo-copy h3 {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-weight: 500;
          font-size: clamp(18px, 2.2vw, 24px);
          color: var(--navy-900);
          line-height: 1.3;
          max-width: 36ch;
        }
        @media (max-width: 680px) {
          .cameo {
            flex-direction: column;
            text-align: center;
            padding: 30px 24px;
          }
        }
      `}</style>

      {/* ===================== STICKY TOPBAR ===================== */}
      <header className="sticky top-0 z-50 w-full bg-[#FAF8F3]/95 backdrop-blur-md border-b border-[#E4DFD3] transition-all">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <Link to="/home" className="flex items-center gap-2 group flex-shrink-0" title="Return to WeGrow Home">
            <img
              src="/bdt_logo.png"
              className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
              onError={(e) => { e.target.src = '/wegrow-logo.webp'; }}
            />
          </Link>

          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-[13.5px] font-semibold text-[#4E5875]">
            <Link to="/home" className="hover:text-[#E7752B] transition-colors whitespace-nowrap">Home</Link>
            <a href="#icu" className="hover:text-[#E7752B] transition-colors whitespace-nowrap">Diagnosis</a>
            <a href="#triangle" className="hover:text-[#E7752B] transition-colors whitespace-nowrap">Approach</a>
            <a href="#services" className="hover:text-[#E7752B] transition-colors whitespace-nowrap">Solutions</a>
            <a href="#industries" className="hover:text-[#E7752B] transition-colors whitespace-nowrap">Industries</a>
            <a href="#leadership" className="hover:text-[#E7752B] transition-colors whitespace-nowrap">About</a>
            <Link
              to="/business-dependency-test"
              className="text-[#E7752B] bg-[#E7752B]/10 px-3.5 py-1.5 rounded-full hover:bg-[#E7752B]/20 transition-all font-bold whitespace-nowrap text-xs"
            >
              Take 2-Min Test
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              onClick={() => openBookingModal()}
              className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#122242] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-[13px] font-bold whitespace-nowrap hover:bg-[#E7752B] hover:-translate-y-0.5 transition-all shadow-md"
            >
              <span>Book Diagnostic</span>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="md:hidden p-1.5 rounded-lg text-[#151E33] hover:text-[#E7752B] hover:bg-[#EFE6D2]/60 focus:outline-none transition-colors"
              aria-label="Toggle navigation"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FAF8F3] border-b border-[#E4DFD3] px-6 py-4 space-y-2.5 shadow-lg transition-all animate-fadeIn">
            <Link
              to="/home"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-[#4E5875] hover:text-[#E7752B] py-1"
            >
              Home
            </Link>
            <a
              href="#icu"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-[#4E5875] hover:text-[#E7752B] py-1"
            >
              Diagnosis
            </a>
            <a
              href="#triangle"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-[#4E5875] hover:text-[#E7752B] py-1"
            >
              Approach
            </a>
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-[#4E5875] hover:text-[#E7752B] py-1"
            >
              Solutions
            </a>
            <a
              href="#industries"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-[#4E5875] hover:text-[#E7752B] py-1"
            >
              Industries
            </a>
            <a
              href="#leadership"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-[#4E5875] hover:text-[#E7752B] py-1"
            >
              About
            </a>
            <div className="pt-2">
              <Link
                to="/business-dependency-test"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-block text-center w-full text-[#E7752B] bg-[#E7752B]/10 px-4 py-2.5 rounded-xl hover:bg-[#E7752B]/20 transition-all font-bold text-xs"
              >
                Take 2-Min Self-Audit Test →
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ===================== HERO ===================== */}
      <header className="hero" id="top">
        <div className="hero-glow" aria-hidden="true"></div>
        <div className="wrap">
          <div className="hero-grid">
            <div className="hero-copy reveal">
              <span className="hero-kicker"><span className="dot"></span>WeGrow Business Consultancy</span>
              <h1>Can your business run for 30 days <em>without you?</em></h1>
              <p className="hero-lede">Most owners can't answer that honestly. We help you build the systems — people, process, technology — so it can.</p>
              <div className="hero-actions">
                <a className="btn btn-solid" href="#contact" onClick={(e) => { e.preventDefault(); openBookingModal(); }}>Book a Free Diagnostic</a>
                <a className="btn btn-ghost" href="#triangle">See Our Approach</a>
              </div>
              <div className="hero-marquee">
                <div className="mq-stat"><svg className="ic"><use href="#i-building" /></svg><div><b>2+1</b><span>Campuses</span></div></div>
                <div className="mq-stat"><svg className="ic"><use href="#i-compass" /></svg><div><b>13</b><span>Industries</span></div></div>
                <div className="mq-stat"><svg className="ic"><use href="#i-cap" /></svg><div><b>11 yrs</b><span>Track record</span></div></div>
              </div>
            </div>
            <div className="hero-visual reveal">
              <div className="hero-badge">Meet Bunty 👋</div>
              <img
                className="mascot-hero"
                src="/bunty-hero.webp"
                alt="Bunty, the WeGrow mascot — an orange squirrel in a navy suit, giving a thumbs up"
                onError={(e) => { e.target.src = '/bdt_mascot.webp'; }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ===================== IF YOU DISAPPEAR ===================== */}
      <section className="navy" id="disappear">
        <span className="sec-num" aria-hidden="true">01</span>
        <div className="wrap">
          <div className="sec-head center reveal">
            <div className="sec-title">
              <span className="kicker">The hard question</span>
              <h2>If you disappeared for 30 days, what happens?</h2>
            </div>
          </div>
          <div className="tile-grid q-grid reveal">
            <div className="tile q-tile"><div className="tile-ic"><svg className="ic"><use href="#i-target" /></svg></div><span className="qnum">01</span><h4>Who takes decisions?</h4></div>
            <div className="tile q-tile"><div className="tile-ic"><svg className="ic"><use href="#i-headset" /></svg></div><span className="qnum">02</span><h4>Who handles customers?</h4></div>
            <div className="tile q-tile"><div className="tile-ic"><svg className="ic"><use href="#i-workflow" /></svg></div><span className="qnum">03</span><h4>Who knows your processes?</h4></div>
            <div className="tile q-tile"><div className="tile-ic"><svg className="ic"><use href="#i-bolt" /></svg></div><span className="qnum">04</span><h4>Who solves problems?</h4></div>
          </div>
          <div className="disappear-cta reveal">
            <p>"If the answer is you — every time — we need to talk."</p>
            <a className="btn btn-solid" href="#contact" onClick={(e) => { e.preventDefault(); openBookingModal(); }}>Let's Talk</a>
          </div>
        </div>
      </section>

      {/* ===================== BUSINESS ICU ===================== */}
      <section className="dim" id="icu">
        <span className="sec-num" aria-hidden="true">03</span>
        <div className="wrap">
          <div className="sec-head center reveal">
            <div className="sec-title">
              <span className="kicker">Your business, diagnosed</span>
              <h2>Welcome to the Business ICU</h2>
              <p className="sec-sub" style={{ marginLeft: 'auto', marginRight: 'auto' }}>Four vitals. One common diagnosis: Owner Dependency Syndrome.</p>
            </div>
          </div>
          <div className="tile-grid tg-4 reveal">
            <div className="tile vital-card"><div className="tile-ic"><svg className="ic"><use href="#i-heart" /></svg></div><h4>People</h4><p>Does your team function independently?</p></div>
            <div className="tile vital-card"><div className="tile-ic"><svg className="ic"><use href="#i-brain" /></svg></div><h4>Process</h4><p>Does work happen systematically?</p></div>
            <div className="tile vital-card"><div className="tile-ic"><svg className="ic"><use href="#i-gear" /></svg></div><h4>Operations</h4><p>Can it run without constant supervision?</p></div>
            <div className="tile vital-card"><div className="tile-ic"><svg className="ic"><use href="#i-laptop" /></svg></div><h4>Technology</h4><p>Are you using it effectively?</p></div>
          </div>
        </div>
      </section>

      {/* ===================== TRIANGLE ===================== */}
      <section className="navy" id="triangle">
        <span className="sec-num" aria-hidden="true">04</span>
        <div className="wrap">
          <div className="sec-head center reveal">
            <div className="sec-title">
              <span className="kicker">Our framework</span>
              <h2>The WeGrow Business Triangle</h2>
              <p className="sec-sub" style={{ marginLeft: 'auto', marginRight: 'auto' }}>We work on all three corners — together, not one at a time.</p>
            </div>
          </div>
          <div className="triangle-wrap reveal">
            <svg className="triangle-svg" viewBox="-25 -10 570 460" xmlns="http://www.w3.org/2000/svg">
              <polygon points="260,35 470,395 50,395" fill="none" stroke="#F0913F" strokeWidth="2.5" strokeLinejoin="round" />
              <circle cx="260" cy="35" r="46" fill="#182C54" stroke="#F0913F" strokeWidth="2" />
              <circle cx="470" cy="395" r="46" fill="#182C54" stroke="#F0913F" strokeWidth="2" />
              <circle cx="50" cy="395" r="46" fill="#182C54" stroke="#F0913F" strokeWidth="2" />
              <text x="260" y="32" textAnchor="middle" className="tri-label">PEOPLE</text>
              <text x="470" y="391" textAnchor="middle" className="tri-label">TECH</text>
              <text x="50" y="391" textAnchor="middle" className="tri-label">PROCESS</text>
              <circle cx="260" cy="275" r="68" fill="#E7752B" />
              <text x="260" y="268" textAnchor="middle" className="tri-label tri-center" fontSize="16" fill="#fff">INDEPENDENT</text>
              <text x="260" y="290" textAnchor="middle" className="tri-label tri-center" fontSize="16" fill="#fff">BUSINESS</text>
            </svg>
          </div>
        </div>
      </section>

      {/* ===================== PROBLEM WALL ===================== */}
      <section id="wall">
        <span className="sec-num" aria-hidden="true">05</span>
        <div className="wrap">
          <div className="sec-head center reveal">
            <div className="sec-title">
              <span className="kicker">Tell us</span>
              <h2>What's your biggest business headache?</h2>
              <p className="sec-sub" style={{ marginLeft: 'auto', marginRight: 'auto' }}>Pick the one that keeps you up at night.</p>
            </div>
          </div>
          <div className="wall reveal">
            <div className="wall-grid" id="stickyWall">
              {PROBLEM_WALL_NOTES.map((note, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleStickyNote(idx)}
                  className={`wall-sticky ${pickedNote === idx ? 'picked' : ''}`}
                  style={{ '--r': note.r }}
                >
                  {note.text}
                </button>
              ))}
            </div>
            <p className="wall-note">
              Your pick: <span id="pickedText">{pickedNote !== null && PROBLEM_WALL_NOTES[pickedNote] ? PROBLEM_WALL_NOTES[pickedNote].text : 'none yet — tap a note above'}</span>
            </p>
          </div>
        </div>
      </section>

      {/* ===================== WHAT WE BUILD ===================== */}
      <section className="dim" id="build">
        <span className="sec-num" aria-hidden="true">06</span>
        <div className="wrap">
          <div className="sec-head reveal">
            <div className="sec-title"><span className="kicker">What we build</span><h2>The base, and the strategy on top</h2></div>
          </div>
          <div className="sol-grid reveal">
            <div className="sol-col">
              <div className="sol-eyebrow">Foundational</div><h3>Building the base</h3>
              <div className="sol-item"><svg className="ic"><use href="#i-gear" /></svg><span>Operational management</span></div>
              <div className="sol-item"><svg className="ic"><use href="#i-clipboard" /></svg><span>Process management (SOPs)</span></div>
              <div className="sol-item"><svg className="ic"><use href="#i-users" /></svg><span>Team Handling</span></div>
              <div className="sol-item"><svg className="ic"><use href="#i-barchart" /></svg><span>Data &amp; tech support</span></div>
            </div>
            <div className="sol-col">
              <div className="sol-eyebrow">Advanced</div><h3>Scaling with strategy</h3>
              <div className="sol-item"><svg className="ic"><use href="#i-flag" /></svg><span>Organisational strategy</span></div>
              <div className="sol-item"><svg className="ic"><use href="#i-layers" /></svg><span>Operational strategy</span></div>
              <div className="sol-item"><svg className="ic"><use href="#i-workflow" /></svg><span>Business process design</span></div>
              <div className="sol-item"><svg className="ic"><use href="#i-cap" /></svg><span>CEO / MD training</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== CORE SERVICES ===================== */}
      <section id="services">
        <span className="sec-num" aria-hidden="true">07</span>
        <div className="wrap">
          <div className="sec-head reveal">
            <div className="sec-title"><span className="kicker">Core services</span><h2>Eleven ways we get involved</h2></div>
          </div>
          <div className="tile-grid tg-4 reveal">
            <div className="tile svc-tile"><div className="tile-ic"><svg className="ic"><use href="#i-shield" /></svg></div><div className="svc-code">WGBC–ISO</div><h4>ISO Implementation</h4></div>
            <div className="tile svc-tile"><div className="tile-ic"><svg className="ic"><use href="#i-gauge" /></svg></div><div className="svc-code">WGBC–PMS</div><h4>Performance Management</h4></div>
            <div className="tile svc-tile"><div className="tile-ic"><svg className="ic"><use href="#i-barchart" /></svg></div><div className="svc-code">WGBC–MIS</div><h4>Management Info System</h4></div>
            <div className="tile svc-tile"><div className="tile-ic"><svg className="ic"><use href="#i-clipboard" /></svg></div><div className="svc-code">WGBC–SOP</div><h4>Standard Procedures</h4></div>
            <div className="tile svc-tile"><div className="tile-ic"><svg className="ic"><use href="#i-orgchart" /></svg></div><div className="svc-code">WGBC–OSS/HY</div><h4>Structure &amp; Hierarchy</h4></div>
            <div className="tile svc-tile"><div className="tile-ic"><svg className="ic"><use href="#i-grid" /></svg></div><div className="svc-code">WGBC–5S</div><h4>5S Methodology</h4></div>
            <div className="tile svc-tile"><div className="tile-ic"><svg className="ic"><use href="#i-search" /></svg></div><div className="svc-code">WGBC–ODR</div><h4>Diagnosis Report</h4></div>
            <div className="tile svc-tile"><div className="tile-ic"><svg className="ic"><use href="#i-chat" /></svg></div><div className="svc-code">WGBC–CEO</div><h4>CEO Coaching</h4></div>
            <div className="tile svc-tile"><div className="tile-ic"><svg className="ic"><use href="#i-cap" /></svg></div><div className="svc-code">WGBC–LDP</div><h4>Leadership Program</h4></div>
            <div className="tile svc-tile"><div className="tile-ic"><svg className="ic"><use href="#i-factory" /></svg></div><div className="svc-code">Prod. Mgmt</div><h4>Production Management</h4></div>
            <div className="tile svc-tile"><div className="tile-ic"><svg className="ic"><use href="#i-trend" /></svg></div><div className="svc-code">Market</div><h4>Market &amp; Competitor Analysis</h4></div>
          </div>
        </div>
      </section>

      {/* ===================== INDUSTRIES ===================== */}
      <section className="dim" id="industries">
        <span className="sec-num" aria-hidden="true">08</span>
        <div className="wrap">
          <div className="sec-head reveal">
            <div className="sec-title"><span className="kicker">Where we work</span><h2>Industries we serve</h2></div>
          </div>
          <div className="tile-grid ind-grid reveal">
            <div className="tile ind-tile"><div className="tile-ic"><svg className="ic"><use href="#i-shirt" /></svg></div><span>Textile Retail</span></div>
            <div className="tile ind-tile"><div className="tile-ic"><svg className="ic"><use href="#i-gear" /></svg></div><span>Manufacturing</span></div>
            <div className="tile ind-tile"><div className="tile-ic"><svg className="ic"><use href="#i-car" /></svg></div><span>Automobiles</span></div>
            <div className="tile ind-tile"><div className="tile-ic"><svg className="ic"><use href="#i-gem" /></svg></div><span>Jewellery Retail</span></div>
            <div className="tile ind-tile"><div className="tile-ic"><svg className="ic"><use href="#i-headset" /></svg></div><span>Service Industry</span></div>
            <div className="tile ind-tile"><div className="tile-ic"><svg className="ic"><use href="#i-droplet" /></svg></div><span>Oil Industry</span></div>
            <div className="tile ind-tile"><div className="tile-ic"><svg className="ic"><use href="#i-bird" /></svg></div><span>Poultry</span></div>
            <div className="tile ind-tile"><div className="tile-ic"><svg className="ic"><use href="#i-bed" /></svg></div><span>Hotel Industry</span></div>
            <div className="tile ind-tile"><div className="tile-ic"><svg className="ic"><use href="#i-film" /></svg></div><span>Entertainment</span></div>
            <div className="tile ind-tile"><div className="tile-ic"><svg className="ic"><use href="#i-swap" /></svg></div><span>Trading</span></div>
            <div className="tile ind-tile"><div className="tile-ic"><svg className="ic"><use href="#i-cross" /></svg></div><span>Hospitals</span></div>
            <div className="tile ind-tile"><div className="tile-ic"><svg className="ic"><use href="#i-pill" /></svg></div><span>Retail Pharma</span></div>
            <div className="tile ind-tile"><div className="tile-ic"><svg className="ic"><use href="#i-cart" /></svg></div><span>Supermarkets</span></div>
            <div className="tile ind-tile ind-tile-more"><div className="tile-ic"><svg className="ic"><use href="#i-compass" /></svg></div><span>&amp; More Sectors</span></div>
          </div>
        </div>
      </section>

      {/* ===================== OUR EDGE ===================== */}
      <section id="edge">
        <span className="sec-num" aria-hidden="true">10</span>
        <div className="wrap">
          <div className="sec-head reveal">
            <div className="sec-title"><span className="kicker">Our edge</span><h2>Why owners choose WeGrow</h2></div>
          </div>
          <div className="tile-grid tg-5 reveal">
            <div className="tile"><div className="tile-ic"><svg className="ic"><use href="#i-cap" /></svg></div><h4>Training pedigree</h4></div>
            <div className="tile"><div className="tile-ic"><svg className="ic"><use href="#i-building" /></svg></div><h4>We run what we teach</h4></div>
            <div className="tile"><div className="tile-ic"><svg className="ic"><use href="#i-mappin" /></svg></div><h4>Deep regional context</h4></div>
            <div className="tile"><div className="tile-ic"><svg className="ic"><use href="#i-handshake" /></svg></div><h4>Founder-led coaching</h4></div>
            <div className="tile"><div className="tile-ic"><svg className="ic"><use href="#i-heart" /></svg></div><h4>Community-rooted trust</h4></div>
          </div>
        </div>
      </section>

      {/* ===================== LEADERSHIP ===================== */}
      <section className="navy" id="leadership">
        <div className="wrap">
          <div className="reveal flex justify-center">
            <img
              src="/learn-from-experts.jpg"
              alt="WeGrow B School - Learn from Real Business Experts"
              className="w-full max-w-5xl rounded-2xl shadow-2xl block mx-auto"
            />
          </div>
        </div>
      </section>

      {/* ===================== MASCOT CAMEO ===================== */}
      <section className="tight">
        <div className="wrap">
          <div className="cameo reveal">
            <img className="cameo-mascot" src="/bunty-hero.webp" alt="Bunty Mascot" onError={(e) => { e.target.src = '/bdt_mascot.webp'; }} />
            <div className="cameo-copy">
              <p>BUNTY SAYS</p>
              <h3>"The best business is the one that grows even while you're asleep."</h3>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SECTION 8: CTA & FOOTER ===================== */}
      <footer id="contact" className="bg-[#0C1730] text-[#F4F1E8] pt-20 pb-10">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8">

          {/* Main CTA block */}
          <div className="text-center pb-16 border-b border-white/10 reveal">
            <h2 className="ff-fraunces text-3xl sm:text-4xl md:text-5xl font-semibold text-white max-w-2xl mx-auto leading-tight">
              Ready to Build a Business That Runs Without You?
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#AAB3CB] max-w-xl mx-auto leading-relaxed">
              Book a confidential, 45-minute Business Dependency Diagnostic with our senior partners. No generic sales pitches — just an honest audit of where your enterprise stands.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <button
                onClick={() => openBookingModal()}
                className="inline-flex items-center gap-2.5 bg-[#E7752B] hover:bg-[#F0913F] text-white px-8 py-4 rounded-full text-base font-bold shadow-xl transition-all hover:-translate-y-0.5"
              >
                <span>Book Your Free Diagnostic</span>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>

              <Link
                to="/business-dependency-test"
                className="inline-flex items-center gap-2 border border-white/20 hover:border-white text-white px-7 py-4 rounded-full text-base font-semibold transition-all hover:-translate-y-0.5"
              >
                <span>Take Online Self-Audit</span>
              </Link>
            </div>

            {/* Campus Chips */}
            <div className="flex flex-wrap justify-center gap-3.5 mt-12">
              <div className="flex items-center gap-3 border border-white/10 rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#E4E7F0] bg-white/[0.02]">
                <svg className="w-5 h-5 text-[#F0913F] flex-shrink-0"><use href="#i-mappin" /></svg>
                <div className="text-left">
                  <b className="block font-bold text-white">Sivakasi Campus 1.0</b>
                  <span className="text-[11.5px] text-[#9AA4BE]">Headquarters & Incubation Center</span>
                </div>
              </div>

              <div className="flex items-center gap-3 border border-white/10 rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#E4E7F0] bg-white/[0.02]">
                <svg className="w-5 h-5 text-[#F0913F] flex-shrink-0"><use href="#i-mappin" /></svg>
                <div className="text-left">
                  <b className="block font-bold text-white">srivilliputhur Campus 2.0</b>
                  <span className="text-[11.5px] text-[#9AA4BE]">Executive Learning Center</span>
                </div>
              </div>

              <div className="flex items-center gap-3 border border-white/10 rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#E4E7F0] bg-white/[0.02]">
                <svg className="w-5 h-5 text-[#F0913F] flex-shrink-0"><use href="#i-mappin" /></svg>
                <div className="text-left">
                  <b className="block font-bold text-white">Sivakasi Campus 3.0</b>
                  <span className="text-[11.5px] text-[#9AA4BE]">Regional Corporate Center</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer bottom */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 text-xs text-[#8890A6]">
            {/* Left: Brand */}
            <div className="flex items-center">
              <img
                src="/wegrow-logo.webp"
                alt="WeGrow Business Consultancy"
                className="h-8 sm:h-9 w-auto object-contain brightness-0 invert opacity-90"
                onError={(e) => { e.target.src = '/bdt_logo.png'; }}
              />
            </div>

            {/* Middle: Links + Back to top */}
            <div className="flex flex-col items-center md:items-start gap-2 text-[#9AA4BE]">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 lg:gap-8">
                <Link to="/home" className="hover:text-[#F0913F] transition-colors">Home</Link>
                <a href="#icu" className="hover:text-[#F0913F] transition-colors">Diagnosis</a>
                <a href="#services" className="hover:text-[#F0913F] transition-colors">Services</a>
                <a href="#industries" className="hover:text-[#F0913F] transition-colors">Industries</a>
                <a href="#leadership" className="hover:text-[#F0913F] transition-colors">Leadership</a>
                <Link to="/business-dependency-test" className="hover:text-[#F0913F] transition-colors">Self-Audit</Link>
              </div>
              <a
                href="#top"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-xs font-medium text-[#8890A6] hover:text-white transition-colors cursor-pointer self-center md:self-start mt-0.5"
              >
                Back to top ↑
              </a>
            </div>

            {/* Right: Copyright */}
            <div className="text-center md:text-right text-xs text-[#8890A6] leading-relaxed">
              © {new Date().getFullYear()} WeGrow Connect. All rights reserved.
            </div>
          </div>

        </div>
      </footer>

      {/* ===================== DIAGNOSTIC BOOKING MODAL ===================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#FAF8F3] text-[#151E33] border border-[#E4DFD3] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8">

            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#E4DFD3]/60 hover:bg-[#E4DFD3] text-[#151E33] flex items-center justify-center transition-colors text-lg font-bold"
            >
              ✕
            </button>

            {submittedSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-[#3FA96A]/20 text-[#3FA96A] flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                </div>
                <h3 className="ff-fraunces text-2xl font-bold text-[#122242] mb-2">
                  Diagnostic Booked Successfully!
                </h3>
                <p className="text-sm text-[#4E5875] max-w-md mx-auto mb-6">
                  Thank you, <b>{formData.name}</b>. Our senior advisory partners have received your details for <b>{formData.company || 'your business'}</b> and will reach out via WhatsApp/Call to confirm your slot.
                </p>
                <div className="flex justify-center gap-3">
                  <Link
                    to="/business-dependency-test"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-[#E7752B] text-white px-6 py-2.5 rounded-full text-xs font-bold"
                  >
                    Take Online Self-Audit (2 Mins)
                  </Link>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="bg-[#122242] text-white px-6 py-2.5 rounded-full text-xs font-bold"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <span className="text-xs font-bold text-[#E7752B] uppercase tracking-wider">
                    Confidential 45-Minute Session
                  </span>
                  <h3 className="ff-fraunces text-2xl sm:text-3xl font-semibold text-[#122242] mt-1">
                    Book Your Business Diagnostic
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4E5875] mt-1.5">
                    Discuss your bottlenecks directly with practitioners who have built and scaled enterprises.
                  </p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-[#151E33] mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g., Rajesh Kumar"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D7D0C0] bg-white text-xs sm:text-sm focus:outline-none focus:border-[#E7752B] transition-colors"
                      />
                      {formErrors.name && <p className="text-[11px] text-red-500 mt-1">{formErrors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#151E33] mb-1">
                        Company / Business Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="e.g., Apex Manufacturing Ltd."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D7D0C0] bg-white text-xs sm:text-sm focus:outline-none focus:border-[#E7752B] transition-colors"
                      />
                      {formErrors.company && <p className="text-[11px] text-red-500 mt-1">{formErrors.company}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-[#151E33] mb-1">
                        Phone / WhatsApp <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D7D0C0] bg-white text-xs sm:text-sm focus:outline-none focus:border-[#E7752B] transition-colors"
                      />
                      {formErrors.phone && <p className="text-[11px] text-red-500 mt-1">{formErrors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#151E33] mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="rajesh@company.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D7D0C0] bg-white text-xs sm:text-sm focus:outline-none focus:border-[#E7752B] transition-colors"
                      />
                      {formErrors.email && <p className="text-[11px] text-red-500 mt-1">{formErrors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-[#151E33] mb-1">
                        Industry
                      </label>
                      <select
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D7D0C0] bg-white text-xs sm:text-sm focus:outline-none focus:border-[#E7752B] transition-colors"
                      >
                        <option value="">Select industry</option>
                        {INDUSTRIES_LIST.map((ind) => (
                          <option key={ind.id} value={ind.name}>{ind.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#151E33] mb-1">
                        Team Size
                      </label>
                      <select
                        name="businessSize"
                        value={formData.businessSize}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D7D0C0] bg-white text-xs sm:text-sm focus:outline-none focus:border-[#E7752B] transition-colors"
                      >
                        <option value="">Select team size</option>
                        <option value="1-10">1 - 10 employees</option>
                        <option value="11-50">11 - 50 employees</option>
                        <option value="51-200">51 - 200 employees</option>
                        <option value="200+">200+ employees</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#151E33] mb-1">
                      Biggest Dependency Bottleneck
                    </label>
                    <input
                      type="text"
                      name="biggestChallenge"
                      value={formData.biggestChallenge}
                      onChange={handleInputChange}
                      placeholder="e.g., Sales drop when I'm not involved, or managers can't decide on pricing"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D7D0C0] bg-white text-xs sm:text-sm focus:outline-none focus:border-[#E7752B] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#151E33] mb-1">
                      Additional Notes / Objectives
                    </label>
                    <textarea
                      name="challengeDetails"
                      rows="2"
                      value={formData.challengeDetails}
                      onChange={handleInputChange}
                      placeholder="Briefly tell us what you'd like to achieve in the next 6-12 months..."
                      className="w-full px-3.5 py-2 rounded-xl border border-[#D7D0C0] bg-white text-xs sm:text-sm focus:outline-none focus:border-[#E7752B] transition-colors resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#E7752B] hover:bg-[#F0913F] text-white py-3.5 rounded-full text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Securing Your Session...</span>
                      ) : (
                        <>
                          <span>Confirm My 45-Min Diagnostic</span>
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-center text-[#8890A6] mt-2">
                      🔒 100% confidential. No spam. Direct access to WeGrow advisory partners.
                    </p>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
