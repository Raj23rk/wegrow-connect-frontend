import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { getCertificates, createCertificate } from "../../services/api";
import {
  Award,
  Plus,
  Search,
  Download,
  CheckCircle2,
  ExternalLink,
  X,
  Printer,
  Sparkles,
  FileCheck,
  Building,
  UserCheck
} from "lucide-react";

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState<any>(null);

  // New Certificate Form State
  const [formData, setFormData] = useState({
    studentName: "",
    studentEmail: "",
    courseName: "Full Stack Web Development with Next.js 14",
    instructor: "Silambarasan G",
    issueDate: "Aug 11, 2026",
  });

  // Load Certificates
  useEffect(() => {
    async function loadCertificates() {
      const data = await getCertificates();
      if (data && data.length > 0) {
        setCertificates(data);
      } else {
        // Fallback or leave empty
        setCertificates([
          {
            id: "CERT-2026-801",
            studentName: "Silambarasan G",
            studentEmail: "silambarasan@wegrow.com",
            courseName: "Full Stack Web Development with Next.js 14",
            issueDate: "Aug 10, 2026",
            instructor: "Karthik Raja",
            status: "Verified",
          }
        ]);
      }
    }
    loadCertificates();
  }, []);

  // Handle Certificate Generation
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      id: `CERT-2026-${800 + certificates.length + 1}`,
      ...formData,
      status: "Verified",
    };
    
    // Call API
    let newCert = payload;
    try {
      const created = await createCertificate(payload);
      if (created && (created.id || created._id)) {
        newCert = created;
      }
    } catch (error) {
      console.error("Failed to create certificate", error);
    }

    setCertificates([newCert, ...certificates]);
    setShowGenerateModal(false);
    setShowPreviewModal(newCert); // Show Preview directly after generation
    setFormData({
      studentName: "",
      studentEmail: "",
      courseName: "Full Stack Web Development with Next.js 14",
      instructor: "Silambarasan G",
      issueDate: "Aug 11, 2026",
    });
  };

  // Filter Search
  const filteredCertificates = certificates.filter(
    (c) =>
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-50/60 font-sans text-slate-800 antialiased">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Top Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Certificates & Credentials</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Issue, verify, and generate verifiable course & workshop completion certificates for WeGrow students.
            </p>
          </div>

          <button
            onClick={() => setShowGenerateModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>Generate Certificate</span>
          </button>
        </div>

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Total Certificates Issued</p>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">{certificates.length} Issued</h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Verified Credentials</p>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">100% Digital Verified</h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Active Courses</p>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">12 Modules</h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Downloads Count</p>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">1,420 Downloads</h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Search & List Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="font-extrabold text-slate-900 text-sm">Issued Certificates List</h2>

            {/* Search Box */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search Cert ID, Student name, Course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:border-blue-600 transition-all"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-y border-slate-100">
                <tr>
                  <th className="p-3">Certificate ID</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Course / Workshop Title</th>
                  <th className="p-3">Instructor</th>
                  <th className="p-3">Issue Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredCertificates.length > 0 ? (
                  filteredCertificates.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/60 transition-all">
                      <td className="p-3 font-mono font-bold text-blue-600">{c.id}</td>
                      <td className="p-3">
                        <p className="font-bold text-slate-900">{c.studentName}</p>
                        <p className="text-[11px] text-slate-400">{c.studentEmail}</p>
                      </td>
                      <td className="p-3 font-bold text-slate-800">{c.courseName}</td>
                      <td className="p-3 text-slate-600">{c.instructor}</td>
                      <td className="p-3 text-slate-500">{c.issueDate}</td>
                      <td className="p-3">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center gap-1 w-max">
                          <CheckCircle2 className="w-3 h-3" /> {c.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setShowPreviewModal(c)}
                            className="px-2.5 py-1 text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" /> Preview
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      No certificates found matching search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Generate Certificate Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4 border border-slate-100">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Generate New Certificate</h3>
              <button onClick={() => setShowGenerateModal(false)} className="cursor-pointer text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGenerate} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Silambarasan G"
                  className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none focus:border-blue-600"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Student Email</label>
                <input
                  type="email"
                  required
                  placeholder="student@gmail.com"
                  className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none focus:border-blue-600"
                  value={formData.studentEmail}
                  onChange={(e) => setFormData({ ...formData, studentEmail: e.target.value })}
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Course / Workshop Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js Production Masterclass"
                  className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none"
                  value={formData.courseName}
                  onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Instructor Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Instructor Name"
                    className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none"
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Issue Date</label>
                  <input
                    type="text"
                    required
                    placeholder="Aug 11, 2026"
                    className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Live Preview & Print Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl shadow-2xl space-y-6 border border-slate-100 relative">
            <button
              onClick={() => setShowPreviewModal(null)}
              className="absolute right-4 top-4 cursor-pointer text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center">
              <h3 className="font-extrabold text-slate-900 text-base">Certificate Preview</h3>
              <p className="text-xs text-slate-400">Verifiable Credential generated for WeGrow Platform</p>
            </div>

            {/* REAL CERTIFICATE TEMPLATE PREVIEW CARD */}
            <div className="border-8 border-double border-slate-200 bg-linear-to-br from-amber-50/30 via-white to-blue-50/20 p-8 rounded-2xl text-center space-y-4 shadow-inner relative">
              {/* Header Logo */}
              <div className="flex justify-center items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-xs">
                  WG
                </div>
                <span className="font-black text-slate-900 text-lg tracking-tight">WeGrow B School</span>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-amber-600">
                  Certificate of Completion
                </p>
                <p className="text-xs text-slate-400">This certificate is proudly presented to</p>
              </div>

              <h2 className="text-2xl font-black text-slate-900 border-b border-slate-200 pb-2 inline-block px-6">
                {showPreviewModal.studentName}
              </h2>

              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                for successfully completing the course & hands-on practical assessment on{" "}
                <span className="font-bold text-slate-900">{showPreviewModal.courseName}</span>.
              </p>

              {/* Signatures & Verification */}
              <div className="pt-6 flex justify-between items-end border-t border-slate-100 text-left text-xs">
                <div>
                  <p className="font-extrabold text-slate-900">{showPreviewModal.instructor}</p>
                  <p className="text-[10px] text-slate-400">Authorized Mentor / Instructor</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto border border-amber-300">
                    <Award className="w-6 h-6" />
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 block mt-1">Verified Credential</span>
                </div>

                <div className="text-right">
                  <p className="font-mono font-bold text-slate-900 text-[10px]">{showPreviewModal.id}</p>
                  <p className="text-[10px] text-slate-400">Issued Date: {showPreviewModal.issueDate}</p>
                </div>
              </div>
            </div>

            {/* Print & Download Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Print Certificate</span>
              </button>
              <button
                onClick={() => alert(`Downloading PDF for ${showPreviewModal.id}...`)}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}