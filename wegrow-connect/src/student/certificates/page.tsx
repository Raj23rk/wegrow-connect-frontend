import React, { useMemo, useState, useEffect } from "react";
import StudentSidebar from "../../components/StudentSidebar";
import { getCertificates } from "../../services/api";

import {
  Award,
  Download,
  Share2,
  CheckCircle2,
  Search,
  ShieldCheck,
  Calendar,
  Printer,
  Sparkles,
  Eye,
  Lock,
  X,
  ExternalLink,
  BadgeCheck,
} from "lucide-react";

// =====================================================
// TYPES
// =====================================================

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  grade: string;
  credentialUrl: string;
  skills: string[];
  isUnlocked: boolean;
  downloads: number;
}

// =====================================================
// COMPONENT
// =====================================================

export default function StudentCertificates() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCert, setSelectedCert] =
    useState<Certificate | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  // =====================================================
  // STUDENT
  // =====================================================

  const studentName = "Silambarasan G";

  // =====================================================
  // FETCH CERTIFICATES
  // =====================================================

  useEffect(() => {
    async function loadCertificates() {
      const data = await getCertificates();
      if (Array.isArray(data) && data.length > 0) {
        setCertificates(data);
      } else {
        // Fallback default certificate if backend returns empty
        setCertificates([
          {
            id: "CERT-2026-801",
            title: "Full Stack Web Development with Next.js 14",
            issuer: "WeGrow Skill Campus",
            issueDate: "Aug 10, 2026",
            grade: "A+",
            credentialUrl: "#",
            skills: ["Next.js 14", "React", "TypeScript", "Node.js"],
            isUnlocked: true,
            downloads: 12,
          },
        ]);
      }
    }
    loadCertificates();
  }, []);


  // =====================================================
  // FILTER
  // =====================================================

  const filteredCertificates = useMemo(() => {
    const search = searchQuery
      .trim()
      .toLowerCase();

    if (!search) {
      return certificates;
    }

    return certificates.filter((certificate) => {
      const title = String(certificate.title || "").toLowerCase();
      const issuer = String(certificate.issuer || "").toLowerCase();
      const id = String(certificate.id || "").toLowerCase();
      const skills = Array.isArray(certificate.skills) ? certificate.skills : [];

      return (
        title.includes(search) ||
        issuer.includes(search) ||
        id.includes(search) ||
        skills.some((skill) => String(skill).toLowerCase().includes(search))
      );
    });
  }, [certificates, searchQuery]);

  // =====================================================
  // DOWNLOAD / PRINT CERTIFICATE
  // =====================================================

  const handleDownload = (
    certificate: Certificate
  ) => {
    if (!certificate.isUnlocked) {
      return;
    }

    setSelectedCert(certificate);

    // Wait for modal/document to render
    setTimeout(() => {
      window.print();
    }, 300);
  };

  // =====================================================
  // SHARE LINKEDIN
  // =====================================================

  const handleShareLinkedIn = (
    certificate: Certificate
  ) => {
    const verificationUrl =
      certificate.credentialUrl;

    const linkedInUrl =
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        verificationUrl
      )}`;

    window.open(
      linkedInUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // =====================================================
  // OPEN VERIFICATION
  // =====================================================

  const handleVerify = (
    certificate: Certificate
  ) => {
    if (
      certificate.credentialUrl &&
      certificate.credentialUrl !== "#"
    ) {
      window.open(
        certificate.credentialUrl,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  // =====================================================
  // PRINT
  // =====================================================

  const handlePrint = () => {
    window.print();
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closePreview = () => {
    setSelectedCert(null);
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <>
      <style>
        {`
          @media print {
            body {
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
            }

            body * {
              visibility: hidden;
            }

            .certificate-print-area,
            .certificate-print-area * {
              visibility: visible;
            }

            .certificate-print-area {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              min-height: 100vh !important;
              background: white !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              padding: 20px !important;
            }

            .certificate-print-document {
              width: 100% !important;
              max-width: 1100px !important;
              min-height: 700px !important;
              box-shadow: none !important;
              margin: 0 auto !important;
            }

            .print-hidden {
              display: none !important;
            }

            @page {
              size: A4 landscape;
              margin: 0;
            }
          }
        `}
      </style>

      <div className="flex min-h-screen bg-slate-50/60 font-sans text-slate-800 antialiased">

        {/* =====================================================
            SIDEBAR
        ===================================================== */}

        <div className="print-hidden">
          <StudentSidebar />
        </div>

        {/* =====================================================
            MAIN
        ===================================================== */}

        <main className="flex-1 p-5 md:p-8 space-y-8 overflow-y-auto print-hidden">

          {/* =====================================================
              HEADER
          ===================================================== */}

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            <div>
              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20">
                  <Award className="w-6 h-6" />
                </div>

                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    My Certificates
                  </h1>

                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Download, preview and share your verified
                    learning credentials.
                  </p>
                </div>

              </div>
            </div>

            {/* Search */}

            <div className="relative">

              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search certificate or skill..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                className="w-full sm:w-72 pl-9 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-xs font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              />

            </div>

          </div>

          {/* =====================================================
              VERIFICATION BANNER
          ===================================================== */}

          <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-blue-950 to-slate-950 rounded-3xl p-6 md:p-8 text-white shadow-xl">

            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

              <div>

                <div className="flex flex-wrap items-center gap-2 mb-3">

                  <span className="inline-flex items-center gap-1.5 bg-emerald-500 text-slate-950 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">

                    <ShieldCheck className="w-3 h-3" />

                    Verified Credentials

                  </span>

                  <span className="text-xs text-blue-200 font-semibold">
                    {
                      certificates.filter(
                        (c) => c.isUnlocked
                      ).length
                    } Certificates Issued
                  </span>

                </div>

                <h2 className="text-xl md:text-2xl font-black tracking-tight">
                  Your achievements are officially
                  certified 🎓
                </h2>

                <p className="text-xs text-slate-300 mt-2 max-w-2xl leading-relaxed">
                  Download your certificate as a PDF,
                  print it or share your verified credential
                  with recruiters and employers.
                </p>

              </div>

              <button
                onClick={() => {
                  const firstCertificate =
                    certificates.find(
                      (certificate) =>
                        certificate.isUnlocked
                    );

                  if (firstCertificate) {
                    handleVerify(firstCertificate);
                  }
                }}
                className="shrink-0 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl text-xs font-black transition shadow-lg shadow-blue-500/20"
              >
                <ShieldCheck className="w-4 h-4" />

                Verify Credentials

                <ExternalLink className="w-3 h-3" />
              </button>

            </div>

          </div>

          {/* =====================================================
              CERTIFICATE GRID
          ===================================================== */}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            {filteredCertificates.map(
              (certificate) => (

                <div
                  key={certificate.id}
                  className={`
                    bg-white rounded-3xl border p-6
                    transition-all duration-300
                    ${
                      certificate.isUnlocked
                        ? "border-slate-200 shadow-sm hover:shadow-lg"
                        : "border-slate-200/60 bg-slate-50/70 opacity-80"
                    }
                  `}
                >

                  {/* TOP */}

                  <div className="flex items-start justify-between gap-4">

                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">

                      {certificate.isUnlocked ? (
                        <Award className="w-7 h-7" />
                      ) : (
                        <Lock className="w-6 h-6" />
                      )}

                    </div>

                    {certificate.isUnlocked ? (

                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">

                        <CheckCircle2 className="w-3.5 h-3.5" />

                        Verified

                      </span>

                    ) : (

                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase bg-slate-100 text-slate-500 border border-slate-200">

                        <Lock className="w-3 h-3" />

                        Locked

                      </span>

                    )}

                  </div>

                  {/* TITLE */}

                  <div className="mt-5">

                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-wider">
                      {certificate.issuer}
                    </p>

                    <h3 className="text-lg font-black text-slate-900 mt-1 leading-snug">
                      {certificate.title}
                    </h3>

                  </div>

                  {/* DETAILS */}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-5">

                    <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">

                      <p className="text-[9px] uppercase font-black text-slate-400">
                        Certificate ID
                      </p>

                      <p className="font-mono text-[10px] font-bold text-slate-700 mt-1 break-all">
                        {certificate.id}
                      </p>

                    </div>

                    <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">

                      <p className="text-[9px] uppercase font-black text-slate-400">
                        Issue Date
                      </p>

                      <p className="text-[10px] font-bold text-slate-700 mt-1">
                        {certificate.issueDate}
                      </p>

                    </div>

                    <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">

                      <p className="text-[9px] uppercase font-black text-slate-400">
                        Grade
                      </p>

                      <p className="text-[10px] font-bold text-slate-700 mt-1">
                        {certificate.grade}
                      </p>

                    </div>

                  </div>

                  {/* SKILLS */}

                  <div className="mt-5">

                    <p className="text-[10px] uppercase font-black text-slate-400 mb-2">
                      Skills Certified
                    </p>

                    <div className="flex flex-wrap gap-1.5">

                      {certificate.skills.map(
                        (skill) => (

                          <span
                            key={skill}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-700"
                          >
                            {skill}
                          </span>

                        )
                      )}

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="mt-6 pt-5 border-t border-slate-100">

                    {certificate.isUnlocked ? (

                      <div className="flex flex-wrap items-center justify-between gap-3">

                        <div className="flex flex-wrap gap-2">

                          {/* DOWNLOAD */}

                          <button
                            onClick={() =>
                              handleDownload(
                                certificate
                              )
                            }
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-black transition shadow-sm"
                          >
                            <Download className="w-4 h-4" />

                            Download Certificate
                          </button>

                          {/* PREVIEW */}

                          <button
                            onClick={() =>
                              setSelectedCert(
                                certificate
                              )
                            }
                            className="inline-flex items-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-black transition"
                          >
                            <Eye className="w-4 h-4" />

                            Preview
                          </button>

                        </div>

                        {/* SHARE */}

                        <button
                          onClick={() =>
                            handleShareLinkedIn(
                              certificate
                            )
                          }
                          className="inline-flex items-center gap-1.5 text-slate-600 hover:text-blue-600 text-xs font-black transition"
                        >
                          <Share2 className="w-4 h-4" />

                          Share
                        </button>

                      </div>

                    ) : (

                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">

                        <Lock className="w-4 h-4" />

                        Complete all course modules
                        to unlock this certificate.

                      </div>

                    )}

                  </div>

                </div>

              )
            )}

          </div>

          {/* =====================================================
              NO RESULTS
          ===================================================== */}

          {filteredCertificates.length === 0 && (

            <div className="bg-white rounded-2xl border border-slate-200 py-16 text-center">

              <Search className="w-10 h-10 mx-auto text-slate-300" />

              <h3 className="text-base font-black text-slate-900 mt-4">
                No certificates found
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                Try searching using the certificate name,
                ID or skill.
              </p>

            </div>

          )}

        </main>

        {/* =====================================================
            CERTIFICATE PREVIEW / PRINT AREA
        ===================================================== */}

        {selectedCert && (

          <div className="certificate-print-area fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">

            <div className="w-full max-w-5xl">

              {/* =================================================
                  CERTIFICATE DOCUMENT
              ================================================= */}

              <div
                className="certificate-print-document bg-white rounded-2xl shadow-2xl overflow-hidden border-[10px] border-slate-900"
              >

                <div className="relative min-h-[650px] p-8 md:p-12 flex flex-col justify-between">

                  {/* Decorative Borders */}

                  <div className="absolute inset-3 border-2 border-blue-600/20 pointer-events-none rounded-lg" />

                  <div className="absolute inset-5 border border-slate-200 pointer-events-none rounded-md" />

                  {/* HEADER */}

                  <div className="relative text-center">

                    <div className="flex justify-center mb-3">

                      <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">

                        <Award className="w-8 h-8" />

                      </div>

                    </div>

                    <h1 className="text-3xl md:text-4xl font-black tracking-[0.2em] text-blue-700">
                      WEGROW
                    </h1>

                    <p className="text-[11px] tracking-[0.35em] font-bold text-slate-400 mt-1">
                      SKILL CAMPUS
                    </p>

                    <div className="mt-5">

                      <span className="text-xs font-serif italic text-slate-400">
                        Certificate of Achievement
                      </span>

                    </div>

                  </div>

                  {/* BODY */}

                  <div className="relative text-center mt-8">

                    <p className="text-sm text-slate-500 font-serif italic">
                      This is to certify that
                    </p>

                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-4">
                      {studentName}
                    </h2>

                    <div className="w-48 h-px bg-blue-500 mx-auto mt-3" />

                    <p className="text-sm text-slate-500 mt-6 max-w-2xl mx-auto leading-relaxed">
                      has successfully completed the
                      required learning modules, assessments
                      and practical requirements for
                    </p>

                    <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-4 max-w-3xl mx-auto">
                      {selectedCert.title}
                    </h3>

                    {/* GRADE */}

                    <div className="inline-flex items-center gap-2 mt-5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-full">

                      <BadgeCheck className="w-4 h-4" />

                      <span className="text-xs font-black">
                        {selectedCert.grade}
                      </span>

                    </div>

                  </div>

                  {/* SKILLS */}

                  <div className="relative mt-7">

                    <p className="text-[9px] uppercase tracking-widest font-black text-slate-400 text-center mb-3">
                      Skills Certified
                    </p>

                    <div className="flex flex-wrap justify-center gap-2">

                      {selectedCert.skills.map(
                        (skill) => (

                          <span
                            key={skill}
                            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700"
                          >
                            {skill}
                          </span>

                        )
                      )}

                    </div>

                  </div>

                  {/* FOOTER */}

                  <div className="relative mt-8">

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">

                      {/* DATE */}

                      <div className="text-center">

                        <div className="border-b border-slate-300 pb-2">

                          <p className="text-xs font-black text-slate-800">
                            {selectedCert.issueDate}
                          </p>

                        </div>

                        <p className="text-[9px] uppercase tracking-wider font-black text-slate-400 mt-2">
                          Date of Issue
                        </p>

                      </div>

                      {/* SEAL */}

                      <div className="flex justify-center">

                        <div className="w-20 h-20 rounded-full border-4 border-blue-600 flex items-center justify-center relative">

                          <div className="absolute inset-1 rounded-full border border-blue-300" />

                          <div className="text-center">

                            <ShieldCheck className="w-6 h-6 mx-auto text-blue-600" />

                            <p className="text-[7px] font-black text-blue-700 mt-1">
                              VERIFIED
                            </p>

                          </div>

                        </div>

                      </div>

                      {/* SIGNATURE */}

                      <div className="text-center">

                        <div className="border-b border-slate-300 pb-2">

                          <p className="font-serif italic text-base text-slate-700">
                            WeGrow Academy
                          </p>

                        </div>

                        <p className="text-[9px] uppercase tracking-wider font-black text-slate-400 mt-2">
                          Authorized Signatory
                        </p>

                      </div>

                    </div>

                    {/* CERTIFICATE ID */}

                    <div className="mt-7 pt-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-2">

                      <p className="text-[9px] font-bold text-slate-400">
                        Certificate ID:
                        <span className="font-mono text-slate-600 ml-1">
                          {selectedCert.id}
                        </span>
                      </p>

                      <p className="text-[9px] font-bold text-slate-400">
                        Verify at:
                        <span className="text-blue-600 ml-1">
                          wegrow.com/verify
                        </span>
                      </p>

                    </div>

                  </div>

                </div>

              </div>

              {/* =================================================
                  MODAL ACTIONS
              ================================================= */}

              <div className="print-hidden mt-4 bg-white rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">

                <div>

                  <p className="text-xs font-black text-slate-900">
                    Certificate Ready
                  </p>

                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Use Print → Save as PDF to download your
                    official certificate.
                  </p>

                </div>

                <div className="flex items-center gap-2">

                  {/* CLOSE */}

                  <button
                    onClick={closePreview}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-black text-slate-700 hover:bg-slate-50"
                  >
                    <X className="w-4 h-4" />

                    Close
                  </button>

                  {/* PRINT */}

                  <button
                    onClick={handlePrint}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-lg shadow-blue-500/20"
                  >
                    <Download className="w-4 h-4" />

                    Download / Save PDF
                  </button>

                  {/* PRINT */}

                  <button
                    onClick={handlePrint}
                    className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-black text-slate-700 hover:bg-slate-50"
                  >
                    <Printer className="w-4 h-4" />

                    Print
                  </button>

                </div>

              </div>

            </div>

          </div>

        )}

      </div>
    </>
  );
}