import React, { useState } from "react";
import StudentSidebar from "../../components/StudentSidebar";
import {
  Medal,
  Award,
  Zap,
  Trophy,
  Flame,
  Star,
  CheckCircle2,
  Lock,
  Gift,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Search
} from "lucide-react";

export default function StudentRewards() {
  const [activeTab, setActiveTab] = useState<"badges" | "perks" | "leaderboard">("badges");

  // Badges Data
  const badges = [
    {
      id: "b-1",
      title: "React & Next.js Pro",
      category: "Development",
      xp: "+500 XP",
      earned: true,
      earnedDate: "Aug 02, 2026",
      icon: "⚛️",
      description: "Completed Next.js 15 App Router & Server Actions module.",
    },
    {
      id: "b-2",
      title: "MongoDB Atlas Master",
      category: "Database",
      xp: "+400 XP",
      earned: true,
      earnedDate: "Jul 20, 2026",
      icon: "🍃",
      description: "Configured cloud database network access & schemas.",
    },
    {
      id: "b-3",
      title: "Facial Recognition AI",
      category: "Deep Learning",
      xp: "+650 XP",
      earned: true,
      earnedDate: "Jul 05, 2026",
      icon: "🤖",
      description: "Published research paper & built deep learning model.",
    },
    {
      id: "b-4",
      title: "Workshop Enthusiast",
      category: "Community",
      xp: "+300 XP",
      earned: true,
      earnedDate: "Jun 18, 2026",
      icon: "🔥",
      description: "Attended 5 live masterclass sessions back-to-back.",
    },
    {
      id: "b-5",
      title: "TypeScript Warrior",
      category: "Development",
      xp: "+450 XP",
      earned: false,
      earnedDate: "Locked",
      icon: "🛡️",
      description: "Complete 10 type-safe API projects in WeGrow Labs.",
    },
    {
      id: "b-6",
      title: "Agritech Innovator",
      category: "Startup",
      xp: "+800 XP",
      earned: false,
      earnedDate: "Locked",
      icon: "🌱",
      description: "Submit a full-stack project focused on farming solutions.",
    },
  ];

  // Redeemable Perks Data
  const perks = [
    {
      id: "p-1",
      title: "1-on-1 Mentor Session",
      cost: "1,500 XP",
      partner: "WeGrow Experts",
      available: true,
      description: "Get 30 minutes code review & career guidance from lead engineers.",
    },
    {
      id: "p-2",
      title: "Pro Certificate Fast-Track",
      cost: "2,000 XP",
      partner: "Infosys & ICT Academy",
      available: true,
      description: "Skip queue for Data Analytics verified diploma certification.",
    },
    {
      id: "p-3",
      title: "Swag Box & Coffee Mug",
      cost: "3,500 XP",
      partner: "WeGrow Store",
      available: false,
      description: "Exclusive WeGrow developer t-shirt, stickers, and mug.",
    },
  ];

  // Leaderboard Top Rankers
  const leaderboard = [
    { rank: 1, name: "Arun Kumar", points: "4,250 XP", badges: 14, avatar: "AK", isUser: false },
    { rank: 2, name: "Silambarasan G (You)", points: "3,850 XP", badges: 12, avatar: "SG", isUser: true },
    { rank: 3, name: "Priya Sharma", points: "3,600 XP", badges: 11, avatar: "PS", isUser: false },
    { rank: 4, name: "Karthik Raja", points: "3,100 XP", badges: 9, avatar: "KR", isUser: false },
    { rank: 5, name: "Anitha M", points: "2,950 XP", badges: 8, avatar: "AM", isUser: false },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50/60 font-sans text-slate-800 antialiased">
      {/* Student Sidebar */}
      <StudentSidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <Medal className="w-7 h-7 text-amber-500" />
              Rewards & Skill Badges
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Earn XP by completing modules, attending workshops, and unlock exclusive WeGrow perks!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span className="text-xs font-black text-amber-700">3,850 Total XP</span>
            </div>
            <div className="bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-600 fill-rose-500" />
              <span className="text-xs font-black text-rose-700">7 Day Streak</span>
            </div>
          </div>
        </div>

        {/* Level Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 z-10">
            <div className="flex items-center gap-2">
              <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Level 4 Scholar
              </span>
              <span className="text-xs font-semibold text-indigo-200">150 XP needed for Level 5</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight">
              You are in the Top 5% of Learners this Month! 🚀
            </h2>
            <p className="text-xs text-slate-300">
              Keep attending workshops and submitting assignments to maintain your rank.
            </p>
          </div>

          <div className="w-full md:w-64 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 z-10 shrink-0 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-indigo-200">Level Progress</span>
              <span className="text-amber-400">85%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5">
              <div className="bg-gradient-to-r from-amber-400 to-amber-500 h-2.5 rounded-full w-[85%]" />
            </div>
            <p className="text-[10px] text-slate-400 text-right">3,850 / 4,000 XP</p>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3 text-xs overflow-x-auto">
          {[
            { id: "badges", label: "My Badges (12)", icon: Award },
            { id: "perks", label: "Redeem Perks", icon: Gift },
            { id: "leaderboard", label: "Student Leaderboard", icon: Trophy },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-extrabold transition-all cursor-pointer shrink-0 ${
                  activeTab === tab.id
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "bg-white text-slate-500 border border-slate-200 hover:text-slate-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: Badges */}
        {activeTab === "badges" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`bg-white rounded-2xl p-6 border transition-all flex flex-col justify-between space-y-4 relative overflow-hidden ${
                  b.earned ? "border-slate-200/80 shadow-2xs hover:shadow-md" : "border-slate-200/50 bg-slate-50/50 opacity-75"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl shadow-inner">
                    {b.icon}
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border ${
                    b.earned ? "bg-amber-50 text-amber-700 border-amber-200/60" : "bg-slate-100 text-slate-500 border-slate-200"
                  }`}>
                    {b.xp}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-black text-sm text-slate-900 flex items-center gap-1.5">
                    {b.title}
                    {b.earned && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                  </h3>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{b.category}</span>
                  <p className="text-[11px] text-slate-500 leading-relaxed pt-1">{b.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                  <span>Status:</span>
                  {b.earned ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Unlocked ({b.earnedDate})
                    </span>
                  ) : (
                    <span className="text-slate-400 font-bold flex items-center gap-1">
                      <Lock className="w-3 h-3" /> {b.earnedDate}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: Perks */}
        {activeTab === "perks" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {perks.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{p.partner}</span>
                    <h3 className="font-black text-sm text-slate-900 mt-0.5">{p.title}</h3>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{p.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-black text-amber-600">{p.cost}</span>
                  <button className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer">
                    Redeem
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: Leaderboard */}
        {activeTab === "leaderboard" && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-900 text-sm">Monthly XP Rankings</h3>
                <p className="text-[11px] text-slate-400">Updated every 24 hours based on workshop attendance & course completions.</p>
              </div>
              <Trophy className="w-5 h-5 text-amber-500" />
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {leaderboard.map((item) => (
                <div
                  key={item.rank}
                  className={`p-4 flex items-center justify-between transition-colors ${
                    item.isUser ? "bg-blue-50/60 font-bold" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-6 text-center font-black ${
                      item.rank === 1 ? "text-amber-500 text-sm" :
                      item.rank === 2 ? "text-slate-400 text-sm" :
                      item.rank === 3 ? "text-amber-700 text-sm" : "text-slate-400"
                    }`}>
                      #{item.rank}
                    </span>

                    <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center">
                      {item.avatar}
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900">{item.name}</h4>
                      <p className="text-[10px] text-slate-400">{item.badges} Badges Unlocked</p>
                    </div>
                  </div>

                  <span className="font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200/60">
                    {item.points}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}