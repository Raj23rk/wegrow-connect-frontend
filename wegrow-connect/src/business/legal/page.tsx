import React, { useState } from "react";
import BusinessSidebar from "../../components/BusinessSidebar";
import {
  ShieldCheck,
  FileText,
  Download,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Scale,
  ExternalLink,
  Plus
} from "lucide-react";

export default function BusinessLegal() {
  const [activeTab, setActiveTab] = useState("agreements");

  // Legal Documents / Agreements List
  const legalDocs = [
    {
      id: "DOC-001",
      title: "Non-Disclosure Agreement (NDA)",
      category: "Intellectual Property",
      status: "Verified & Active",
      lastUpdated: "Aug 02, 2026",
      statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200"
    },
    {
      id: "DOC-002",
      title: "Founders' Agreement & Equity Split",
      category: "Corporate Governance",
      status: "Needs Review",
      lastUpdated: "Jul 18, 2026",
      statusColor: "bg-amber-50 text-amber-700 border-amber-200"
    },
    {
      id: "DOC-003",
      title: "Master Service Agreement (MSA)",
      category: "Client Contracts",
      status: "Verified & Active",
      lastUpdated: "Jun 28, 2026",
      statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200"
    },
    {
      id: "DOC-004",
      title: "Privacy Policy & Data Compliance (GDPR/DPDP)",
      category: "Regulatory",
      status: "Draft Mode",
      lastUpdated: "Aug 08, 2026",
      statusColor: "bg-blue-50 text-blue-700 border-blue-200"
    }
  ];

  // Statutory Compliance Checklist
  const compliances = [
    { task: "GST Monthly Return (GSTR-3B)", dueDate: "Aug 20, 2026", status: "Upcoming", color: "text-amber-600 bg-amber-50" },
    { task: "MCA Annual Filing (ROC)", dueDate: "Sep 30, 2026", status: "On Track", color: "text-blue-600 bg-blue-50" },
    { task: "Startup India DPIIT Recognition", dueDate: "Completed", status: "Verified", color: "text-emerald-600 bg-emerald-50" },
    { task: "Trademark Filing (Class 42 & 35)", dueDate: "Under Examination", status: "In Progress", color: "text-purple-600 bg-purple-50" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50/60 font-sans text-slate-800 antialiased">
      {/* Business Sidebar */}
      <BusinessSidebar />

      {/* Main Legal Dashboard */}
      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <Scale className="w-7 h-7 text-blue-600" />
              Legal & Compliance Portal
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Manage startup contracts, statutory compliances, intellectual property, and legal advisory sessions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer">
              <UploadCloud className="w-4 h-4 text-slate-500" />
              <span>Upload Document</span>
            </button>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer">
              <Plus className="w-4 h-4" />
              <span>Draft New Agreement</span>
            </button>
          </div>
        </div>

        {/* 4 Core Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Agreements</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-slate-900">12 Documents</h2>
            <p className="text-[11px] text-emerald-600 font-bold">8 Active & Signed</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Compliance Health</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-slate-900">92% Compliant</h2>
            <p className="text-[11px] text-blue-600 font-bold">All major filings on time</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pending Filings</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-slate-900">1 Due Soon</h2>
            <p className="text-[11px] text-amber-600 font-bold">GST Return due Aug 20</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">IP & Trademarks</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Scale className="w-4 h-4" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-slate-900">2 Trademarks</h2>
            <p className="text-[11px] text-purple-600 font-bold">Brand logo & name filed</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contracts & Agreements Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Repository & Agreements</h2>
                <p className="text-xs text-slate-400">Legal templates and executed startup contracts.</p>
              </div>

              <div className="relative w-56 text-xs">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search agreements..."
                  className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-blue-600 text-xs"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400 font-bold border-y border-slate-100">
                    <th className="p-3">Document Title</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Last Updated</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {legalDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/60 transition-all cursor-pointer">
                      <td className="p-3 font-semibold text-slate-900 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>{doc.title}</span>
                      </td>
                      <td className="p-3 text-slate-500">{doc.category}</td>
                      <td className="p-3 text-slate-500">{doc.lastUpdated}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${doc.statusColor}`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-all cursor-pointer">
                          <Download className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Statutory Compliance Checklist & Legal Advisor Panel */}
          <div className="space-y-6">
            {/* Compliance Tracker */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Statutory Tracker
              </h2>

              <div className="space-y-3 text-xs">
                {compliances.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-slate-800">{item.task}</h4>
                      <p className="text-[10px] text-slate-400">Due: {item.dueDate}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${item.color}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Legal Advisor Connect */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-md space-y-4">
              <div className="space-y-1.5">
                <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-lg text-[10px] font-extrabold uppercase tracking-wider">
                  Verified Legal Network
                </span>
                <h3 className="text-base font-black tracking-tight">Need Contract Review?</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Book a consultation session with corporate lawyers for term sheets, GST setup, and patent advisory.
                </p>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all text-white py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer flex items-center justify-center gap-2">
                <span>Book Legal Consultation</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}