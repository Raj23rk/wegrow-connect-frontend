import React from "react";
import { Briefcase, Building2, Users, Plus, FileText } from "lucide-react";

export default function BusinessDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Business & Enterprise Portal</h1>
            <p className="text-xs text-slate-500 mt-1">Manage startup incubator applications, corporate hiring, & mentorship programs.</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer">
            <Plus className="w-4 h-4" /> Submit New Proposal
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Submitted Projects</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">3 Submitted</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Incubation Status</p>
              <h3 className="text-sm font-extrabold text-emerald-600 mt-1">Approved & Active</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Assigned Mentors</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">2 Mentors</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Business Submissions Status Table */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900">Incubation & Proposal Applications</h2>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 uppercase text-[10px] text-slate-400 font-bold border-b">
              <tr>
                <th className="p-3">Proposal Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Submission Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              <tr>
                <td className="p-3 font-bold text-slate-900">AgriTech Smart Automation</td>
                <td className="p-3 text-slate-500">Agriculture / AI</td>
                <td className="p-3">Aug 01, 2026</td>
                <td className="p-3"><span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 font-bold rounded-lg text-[10px]">Approved</span></td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-900">Logistics Fleet Optimizer</td>
                <td className="p-3 text-slate-500">Supply Chain</td>
                <td className="p-3">Jul 24, 2026</td>
                <td className="p-3"><span className="px-2.5 py-1 bg-amber-50 text-amber-600 font-bold rounded-lg text-[10px]">Under Review</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}