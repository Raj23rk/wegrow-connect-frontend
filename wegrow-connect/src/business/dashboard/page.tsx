import React, { useState } from "react";
import BusinessSidebar from "../../components/BusinessSidebar";
import DashboardProfileMenu, { useDashboardUser } from "../../components/DashboardProfileMenu";
import {
  TrendingUp,
  Users,
  CreditCard,
  Rocket,
  BarChart3,
  PieChart as PieIcon,
  Search,
  Bell,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Plus
} from "lucide-react";

export default function BusinessDashboard() {
  const { firstName } = useDashboardUser();
  const [selectedPeriod, setSelectedPeriod] = useState("6m");

  // Bar Chart Data (Monthly Revenue / Growth)
  const monthlyData = [
    { month: "Mar", revenue: 45, target: 50 },
    { month: "Apr", revenue: 62, target: 60 },
    { month: "May", revenue: 78, target: 70 },
    { month: "Jun", revenue: 95, target: 85 },
    { month: "Jul", revenue: 110, target: 100 },
    { month: "Aug", revenue: 124, target: 115 },
  ];

  // Pie Chart Data Categories
  const revenueSources = [
    { name: "Incubator Pass", percentage: "45%", value: "₹55,800", color: "bg-blue-600", stroke: "#2563eb" },
    { name: "Pro Subscriptions", percentage: "30%", value: "₹37,200", color: "bg-emerald-500", stroke: "#10b981" },
    { name: "Mentor Sessions", percentage: "15%", value: "₹18,600", color: "bg-orange-500", stroke: "#f97316" },
    { name: "Workshops & Events", percentage: "10%", value: "₹12,400", color: "bg-purple-500", stroke: "#a855f7" },
  ];

  // Investor / Pitch Submissions
  const investorActivity = [
    { name: "Sequoia Capital India", status: "Pitch Deck Viewed", time: "2 hours ago", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    { name: "Blume Ventures", status: "Term Sheet Under Review", time: "1 day ago", badge: "bg-blue-50 text-blue-700 border-blue-200" },
    { name: "Tamil Nadu Startup Fund", status: "Meeting Scheduled", time: "Aug 14, 10:00 AM", badge: "bg-amber-50 text-amber-700 border-amber-200" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50/60 font-sans text-slate-800 antialiased">
      {/* Business Sidebar Navigation */}
      <BusinessSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen max-h-screen overflow-hidden">
        {/* Full-width Top Header Bar (Matching Uploaded Image Format) */}
        <header className="bg-white border-b border-slate-200/80 px-8 py-3.5 flex items-center justify-between shadow-2xs shrink-0 w-full z-20">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Welcome, {firstName}</h1>
            {/* <p className="text-[11px] font-bold text-slate-500 mt-0.5">
              Role: <span className="text-[#00a8ec]">Business</span>
            </p> */}
          </div>

          <div className="flex items-center gap-3">
            {/* <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200 text-[11px] font-mono font-bold text-slate-600">
              <span>WGF26012</span>
            </div> */}
            {/* <div className="relative w-64 text-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search investors, metrics, reports..."
                className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl bg-white outline-none focus:border-[#00a8ec] transition-all shadow-xs"
              />
            </div> */}
            {/* <button className="flex items-center gap-2 bg-[#00a8ec] hover:bg-[#0294d1] active:scale-95 transition-all text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-cyan-500/20 cursor-pointer">
              <Plus className="w-4 h-4" />
              <span>New Pitch Deck</span>
            </button> */}
            <DashboardProfileMenu />
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-8 space-y-8">

        {/* 4 Core Business Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: MRR / Revenue */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Monthly Recurring Revenue</p>
              <h2 className="text-2xl font-black text-slate-900">₹1,24,500</h2>
              <div className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-600">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+18.4% from last month</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              ₹
            </div>
          </div>

          {/* Card 2: Active Subscriptions */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Paid Clients</p>
              <h2 className="text-2xl font-black text-slate-900">42 Subscribers</h2>
              <div className="flex items-center gap-1 text-[11px] font-extrabold text-blue-600">
                <Users className="w-3.5 h-3.5" />
                <span>+6 New this week</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>

          {/* Card 3: Pitch Deck Views */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Investor Pitch Engagement</p>
              <h2 className="text-2xl font-black text-slate-900">188 Views</h2>
              <div className="flex items-center gap-1 text-[11px] font-extrabold text-orange-600">
                <Rocket className="w-3.5 h-3.5" />
                <span>12 Term sheet downloads</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>

          {/* Card 4: Advisory & Mentorship Hours */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Mentorship Hours</p>
              <h2 className="text-2xl font-black text-slate-900">24 Hours</h2>
              <div className="flex items-center gap-1 text-[11px] font-extrabold text-purple-600">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Next Session: Tomorrow 5 PM</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Charts & Graphical Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* BAR CHART: Monthly Revenue & Growth */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Revenue Performance & Growth Trends
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Monthly revenue vs forecast target (in ₹ Thousands)</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Actual Revenue
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200"></span> Target
                </span>
              </div>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="pt-4 pb-2">
              <div className="h-56 flex items-end justify-between gap-4 px-2 border-b border-slate-100 pb-2">
                {monthlyData.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-all bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md mb-1">
                      ₹{d.revenue}k
                    </div>

                    {/* Bars Container */}
                    <div className="w-full max-w-[42px] flex items-end justify-center gap-1.5 h-full">
                      {/* Actual Revenue Bar */}
                      <div
                        style={{ height: `${(d.revenue / 130) * 100}%` }}
                        className="w-1/2 bg-blue-600 group-hover:bg-blue-700 rounded-t-lg transition-all duration-300 shadow-sm"
                      ></div>
                      {/* Target Bar */}
                      <div
                        style={{ height: `${(d.target / 130) * 100}%` }}
                        className="w-1/2 bg-slate-200 group-hover:bg-slate-300 rounded-t-lg transition-all duration-300"
                      ></div>
                    </div>

                    {/* Month Label */}
                    <span className="text-[11px] font-bold text-slate-500 group-hover:text-blue-600">{d.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PIE / DONUT CHART: Revenue Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6 flex flex-col justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-emerald-600" />
                Revenue Channels
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Distribution by product source</p>
            </div>

            {/* Visual SVG Donut Graphic */}
            <div className="flex justify-center items-center py-2 relative">
              <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 36 36">
                {/* Background Track */}
                <path
                  className="text-slate-100"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Segment 1: Incubator Pass (45%) */}
                <path
                  stroke="#2563eb"
                  strokeWidth="4.5"
                  strokeDasharray="45, 100"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Segment 2: Pro Subscriptions (30%) */}
                <path
                  stroke="#10b981"
                  strokeWidth="4.5"
                  strokeDasharray="30, 100"
                  strokeDashoffset="-45"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Segment 3: Mentorship (15%) */}
                <path
                  stroke="#f97316"
                  strokeWidth="4.5"
                  strokeDasharray="15, 100"
                  strokeDashoffset="-75"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold text-slate-400 uppercase">Total MRR</span>
                <span className="text-base font-black text-slate-900">₹1.24L</span>
              </div>
            </div>

            {/* Legend & Breakdown Details */}
            <div className="space-y-2 text-xs">
              {revenueSources.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-md ${item.color}`}></span>
                    <span className="font-bold text-slate-700">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900">{item.value}</span>
                    <span className="text-[10px] font-bold text-slate-400">({item.percentage})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section: Investor Pipeline & Milestones */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Investor Pipeline Activity */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Investor & Pitch Pipeline</h2>
                <p className="text-xs text-slate-400">Venture capital interactions and term sheet updates.</p>
              </div>
              <button className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer">
                View All Pitch Decks →
              </button>
            </div>

            <div className="space-y-3">
              {investorActivity.map((inv, index) => (
                <div key={index} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/40 hover:bg-white hover:shadow-xs transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center">
                      {inv.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{inv.name}</h4>
                      <p className="text-[11px] text-slate-400">{inv.time}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${inv.badge}`}>
                    {inv.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Business Quick Action Panel */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-md flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="px-2.5 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-lg text-[10px] font-extrabold uppercase tracking-wider">
                Growth Acceleration
              </span>
              <h3 className="text-lg font-black tracking-tight">Need Expert Mentorship?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect with domain experts in AgriTech, Fintech, and SaaS for pitch deck reviews and legal setup.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button className="w-full bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all text-white py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer">
                Book 1-on-1 Mentor Slot
              </button>
              <button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer">
                Download Investor Agreement Template
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
  );
}