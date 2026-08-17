import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import {
  Award,
  Plus,
  Search,
  Trophy,
  Zap,
  Gift,
  Flame,
  CheckCircle2,
  X,
  Star,
  Users,
  Sparkles,
  ShoppingBag,
  Medal
} from "lucide-react";

export default function RewardsBadgesPage() {
  // Available Badges List
  const [badges, setBadges] = useState([
    {
      id: "BDG-101",
      title: "Full Stack Ninja",
      description: "Completed 5+ Next.js & Full Stack Workshops",
      icon: "⚡",
      xpPoints: 500,
      badgeColor: "bg-amber-50 text-amber-600 border-amber-200",
      issuedCount: 124,
    },
    {
      id: "BDG-102",
      title: "Hackathon Winner",
      description: "Secured Top 3 in WeGrow National Hackathon",
      icon: "🏆",
      xpPoints: 1000,
      badgeColor: "bg-purple-50 text-purple-600 border-purple-200",
      issuedCount: 18,
    },
    {
      id: "BDG-103",
      title: "Early Bird Learner",
      description: "Enrolled in 3 masterclasses within first hour",
      icon: "🔥",
      xpPoints: 200,
      badgeColor: "bg-orange-50 text-orange-600 border-orange-200",
      issuedCount: 310,
    },
    {
      id: "BDG-104",
      title: "Community Mentor",
      description: "Helped 20+ peers on WeGrow Discussion Forum",
      icon: "🌟",
      xpPoints: 750,
      badgeColor: "bg-blue-50 text-blue-600 border-blue-200",
      issuedCount: 45,
    },
  ]);

  // Student Leaderboard Data
  const [studentsLeaderboard, setStudentsLeaderboard] = useState([
    {
      rank: 1,
      name: "Silambarasan G",
      email: "silambarasan@wegrow.com",
      xp: 3450,
      badgesCount: 8,
      lastClaimed: "WeGrow Swag Pack",
    },
    {
      rank: 2,
      name: "Priya Sharma",
      email: "priya@gmail.com",
      xp: 2900,
      badgesCount: 6,
      lastClaimed: "1-on-1 Mentorship Voucher",
    },
    {
      rank: 3,
      name: "Karthik Raja",
      email: "karthik@agritech.io",
      xp: 2400,
      badgesCount: 5,
      lastClaimed: "Free Bootcamp Pass",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddBadgeModal, setShowAddBadgeModal] = useState(false);

  // New Badge Form State
  const [newBadge, setNewBadge] = useState({
    title: "",
    description: "",
    icon: "🎖️",
    xpPoints: "250",
  });

  // Handle Badge Creation
  const handleCreateBadge = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: `BDG-${100 + badges.length + 1}`,
      title: newBadge.title,
      description: newBadge.description,
      icon: newBadge.icon || "🎖️",
      xpPoints: Number(newBadge.xpPoints),
      badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-200",
      issuedCount: 0,
    };
    setBadges([...badges, created]);
    setShowAddBadgeModal(false);
    setNewBadge({ title: "", description: "", icon: "🎖️", xpPoints: "250" });
  };

  return (
    <div className="flex min-h-screen bg-slate-50/60 font-sans text-slate-800 antialiased">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Top Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Rewards & Gamification</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Manage student XP points, digital achievement badges, and redeemable store perks.
            </p>
          </div>

          <button
            onClick={() => setShowAddBadgeModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Badge</span>
          </button>
        </div>

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Total Badges Issued</p>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">497 Badges</h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Total XP Distributed</p>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">1,24,500 XP</h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Active Gamified Users</p>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">850 Students</h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Perks Claimed</p>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">64 Rewards</h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Gift className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Badges Grid Showcase */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" /> Available Achievement Badges
            </h2>
            <span className="text-xs text-slate-400 font-medium">{badges.length} Active Badges</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {badges.map((b) => (
              <div
                key={b.id}
                className="bg-slate-50/60 border border-slate-200/80 rounded-2xl p-4 space-y-3 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-2xl p-2 bg-white rounded-xl shadow-xs border border-slate-100">
                      {b.icon}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-100 text-amber-700">
                      +{b.xpPoints} XP
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-sm">{b.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{b.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex justify-between items-center text-[11px]">
                  <span className="text-slate-400 font-medium">Issued To:</span>
                  <span className="font-bold text-slate-900">{b.issuedCount} Students</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Leaderboard Section */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Medal className="w-4 h-4 text-amber-500" /> Student XP Leaderboard
              </h2>
              <p className="text-xs text-slate-400">Top performers earning badges and XP points</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search leaderboard..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:border-blue-600 transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-y border-slate-100">
                <tr>
                  <th className="p-3">Rank</th>
                  <th className="p-3">Student</th>
                  <th className="p-3">Total XP</th>
                  <th className="p-3">Badges Earned</th>
                  <th className="p-3">Last Rewards Claimed</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {studentsLeaderboard.map((s) => (
                  <tr key={s.rank} className="hover:bg-slate-50/60 transition-all">
                    <td className="p-3 font-black text-slate-900">
                      {s.rank === 1 ? "🥇 #1" : s.rank === 2 ? "🥈 #2" : "🥉 #3"}
                    </td>
                    <td className="p-3">
                      <p className="font-bold text-slate-900">{s.name}</p>
                      <p className="text-[11px] text-slate-400">{s.email}</p>
                    </td>
                    <td className="p-3 font-extrabold text-blue-600">{s.xp} XP</td>
                    <td className="p-3 font-bold text-slate-800">{s.badgesCount} Badges</td>
                    <td className="p-3 text-slate-600">{s.lastClaimed}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => alert(`Bonus XP granted to ${s.name}`)}
                        className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all cursor-pointer"
                      >
                        + Grant Bonus XP
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Create Badge Modal */}
      {showAddBadgeModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4 border border-slate-100">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Create New Badge</h3>
              <button onClick={() => setShowAddBadgeModal(false)} className="cursor-pointer text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBadge} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Badge Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Master Mind"
                  className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none focus:border-blue-600"
                  value={newBadge.title}
                  onChange={(e) => setNewBadge({ ...newBadge, title: e.target.value })}
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Granted for completing AI Foundations"
                  className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none focus:border-blue-600"
                  value={newBadge.description}
                  onChange={(e) => setNewBadge({ ...newBadge, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Badge Icon (Emoji)</label>
                  <input
                    type="text"
                    required
                    placeholder="⚡, 🏆, 🚀"
                    className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none text-center text-lg"
                    value={newBadge.icon}
                    onChange={(e) => setNewBadge({ ...newBadge, icon: e.target.value })}
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">XP Points Awarded</label>
                  <input
                    type="number"
                    required
                    placeholder="500"
                    className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none"
                    value={newBadge.xpPoints}
                    onChange={(e) => setNewBadge({ ...newBadge, xpPoints: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddBadgeModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Publish Badge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}