import React, { useState } from "react";
import BusinessSidebar from "../../components/BusinessSidebar";
import {
  Target,
  CheckCircle2,
  Clock,
  Circle,
  Plus,
  Flag,
  Calendar,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Award
} from "lucide-react";

export default function BusinessRoadmap() {
  // Roadmap Stages Data
  const [milestones, setMilestones] = useState([
    {
      id: 1,
      phase: "Phase 1: Idea Validation & Market Research",
      quarter: "Q1 2026",
      status: "Completed",
      progress: 100,
      tasks: [
        { name: "Customer Survey & Problem Validation", done: true },
        { name: "Competitor Market Analysis", done: true },
        { name: "Business Model Canvas Setup", done: true },
      ],
    },
    {
      id: 2,
      phase: "Phase 2: MVP Development & Pilot Launch",
      quarter: "Q2 2026",
      status: "In Progress",
      progress: 75,
      tasks: [
        { name: "Core Feature Prototype Build", done: true },
        { name: "Alpha Testing with 50 Farmers", done: true },
        { name: "Feedback Iteration & UI Refinement", done: false },
      ],
    },
    {
      id: 3,
      phase: "Phase 3: Legal Compliance & Seed Funding",
      quarter: "Q3 2026",
      status: "Upcoming",
      progress: 20,
      tasks: [
        { name: "DPIIT Startup India Registration", done: true },
        { name: "Pitch Deck Preparation for Investors", done: false },
        { name: "Apply for Tamil Nadu Startup Grant", done: false },
      ],
    },
    {
      id: 4,
      phase: "Phase 4: Market Expansion & Revenue Growth",
      quarter: "Q4 2026",
      status: "Planned",
      progress: 0,
      tasks: [
        { name: "Onboard 500+ Paid Subscribers", done: false },
        { name: "B2B Partnership with Agri Suppliers", done: false },
        { name: "Mobile App Launch on Play Store", done: false },
      ],
    },
  ]);

  return (
    <div className="flex min-h-screen bg-slate-50/60 font-sans text-slate-800 antialiased">
      {/* Business Sidebar Navigation */}
      <BusinessSidebar />

      {/* Main Roadmap Area */}
      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <Target className="w-7 h-7 text-blue-600" />
              Startup Growth Roadmap
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Track strategic milestones, launch execution phases, and upcoming business goals.
            </p>
          </div>

          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>Add New Goal</span>
          </button>
        </div>

        {/* Overall Completion Progress Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="font-extrabold text-slate-900 text-sm">Overall Startup Goal Progression</h3>
            </div>
            <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              48% Total Execution
            </span>
          </div>

          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
            <div className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: "48%" }}></div>
          </div>
        </div>

        {/* Vertical Timeline / Milestones */}
        <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-8">
          {milestones.map((m) => (
            <div key={m.id} className="relative group">
              {/* Timeline Indicator Node */}
              <div
                className={`absolute -left-[35px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center border-2 bg-white ${
                  m.status === "Completed"
                    ? "border-emerald-500 text-emerald-600"
                    : m.status === "In Progress"
                    ? "border-blue-600 text-blue-600"
                    : "border-slate-300 text-slate-400"
                }`}
              >
                {m.status === "Completed" ? (
                  <CheckCircle2 className="w-4 h-4 fill-emerald-50" />
                ) : m.status === "In Progress" ? (
                  <Clock className="w-3.5 h-3.5" />
                ) : (
                  <Circle className="w-3 h-3" />
                )}
              </div>

              {/* Card Body */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-base">{m.phase}</h3>
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-100 text-slate-600 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {m.quarter}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`self-start sm:self-auto px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      m.status === "Completed"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : m.status === "In Progress"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-slate-50 text-slate-500 border border-slate-200"
                    }`}
                  >
                    {m.status}
                  </span>
                </div>

                {/* Sub-tasks */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Action Items</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {m.tasks.map((t, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2.5 ${
                          t.done
                            ? "bg-emerald-50/50 border-emerald-100 text-emerald-900"
                            : "bg-slate-50/50 border-slate-100 text-slate-600"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={t.done}
                          readOnly
                          className="w-4 h-4 accent-blue-600 rounded cursor-pointer shrink-0"
                        />
                        <span className={t.done ? "line-through opacity-75" : ""}>{t.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Individual Progress Bar */}
                <div className="pt-2 flex items-center gap-3">
                  <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        m.status === "Completed" ? "bg-emerald-500" : "bg-blue-600"
                      }`}
                      style={{ width: `${m.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-slate-500">{m.progress}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}