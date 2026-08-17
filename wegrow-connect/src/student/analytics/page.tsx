import React, { useState } from "react";
import StudentSidebar from "../../components/StudentSidebar";
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  Target,
  Zap,
  Calendar,
  Award,
  BookOpen,
  ArrowUpRight,
  BrainCircuit,
  Filter
} from "lucide-react";

export default function StudentAnalytics() {
  const [timeRange, setTimeRange] = useState("this_month");

  // Mock Study Hours Chart Data
  const weeklyData = [
    { day: "Mon", hours: 3.5 },
    { day: "Tue", hours: 4.2 },
    { day: "Wed", hours: 2.8 },
    { day: "Thu", hours: 5.0 },
    { day: "Fri", hours: 4.5 },
    { day: "Sat", hours: 6.2 },
    { day: "Sun", hours: 3.0 },
  ];

  // Skill Proficiency Breakdown
  const skillsProficiency = [
    { skill: "Next.js & React (Frontend)", level: 88, status: "Advanced", color: "bg-blue-600" },
    { skill: "Python & Data Analytics", level: 65, status: "Intermediate", color: "bg-emerald-500" },
    { skill: "Deep Learning & Computer Vision", level: 92, status: "Expert", color: "bg-purple-600" },
    { skill: "MongoDB & Prisma (Database)", level: 78, status: "Advanced", color: "bg-amber-500" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50/60 font-sans text-slate-800 antialiased">
      {/* Student Sidebar */}
      <StudentSidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <BarChart3 className="w-7 h-7 text-blue-600" />
              Learning Performance & Analytics
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Analyze your weekly study time, skill accuracy rates, assignment completions, and learning habits.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-200/80 rounded-xl p-1 shadow-2xs text-xs font-bold">
              {["this_week", "this_month", "all_time"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                    timeRange === range
                      ? "bg-slate-900 text-white shadow-2xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {range.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Top Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Time Spent</span>
              <p className="text-2xl font-black text-slate-900 mt-1">29.2 Hrs</p>
              <span className="text-[10px] font-bold text-emerald-600 mt-1 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +14% vs last week
              </span>
            </div>
            <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quiz Pass Rate</span>
              <p className="text-2xl font-black text-slate-900 mt-1">94.5%</p>
              <span className="text-[10px] font-bold text-blue-600 mt-1 inline-block">18 / 19 Quizzes Passed</span>
            </div>
            <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assignments Done</span>
              <p className="text-2xl font-black text-slate-900 mt-1">12 / 12</p>
              <span className="text-[10px] font-bold text-purple-600 mt-1 inline-block">100% On-time submission</span>
            </div>
            <div className="w-11 h-11 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Daily Streak</span>
              <p className="text-2xl font-black text-slate-900 mt-1">7 Days</p>
              <span className="text-[10px] font-bold text-amber-600 mt-1 inline-block">Personal Best: 14 Days</span>
            </div>
            <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Weekly Study Hours Chart Bar Visual */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Study Time Breakdown (Hours / Day)</h3>
                <p className="text-[11px] text-slate-400">Track your daily video watching and coding exercise hours.</p>
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">Avg 4.1 hrs/day</span>
            </div>

            {/* Visual Bar Chart */}
            <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
              {weeklyData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.hours}h
                  </span>
                  <div className="w-full bg-slate-100 rounded-xl h-full flex items-end overflow-hidden p-1">
                    <div
                      className="w-full bg-blue-600 group-hover:bg-blue-500 rounded-lg transition-all"
                      style={{ height: `${(d.hours / 7) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-600">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Learning Insights Card */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-md border border-slate-800 space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h3 className="font-black text-base text-white">WeGrow AI Insights 🤖</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                You perform <span className="text-amber-400 font-bold">25% better</span> in full-stack coding modules on Saturdays. We recommend tackling Next.js Server Actions this weekend!
              </p>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
              <span className="text-[10px] font-bold text-indigo-300 uppercase">Suggested Next Focus</span>
              <p className="text-xs font-bold text-white">Prisma ORM Database Migrations</p>
            </div>
          </div>
        </div>

        {/* Skill Proficiency Progress Bars */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm">Skill Mastery & Domain Scores</h3>
            <p className="text-[11px] text-slate-400">Based on your practical assignments, quizzes, and live workshop attendance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skillsProficiency.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800">{item.skill}</span>
                  <span className="text-slate-500">{item.level}% ({item.status})</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div
                    className={`${item.color} h-2.5 rounded-full transition-all`}
                    style={{ width: `${item.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}