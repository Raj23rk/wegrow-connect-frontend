import React, { useState } from "react";
import BusinessSidebar from "../../components/BusinessSidebar";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  Download,
  PieChart as PieIcon,
  Activity,
  Layers,
  Award
} from "lucide-react";

export default function BusinessAnalytics() {
  const [timeRange, setTimeRange] = useState("30d");

  // Monthly Revenue & Active Users Analytics Data
  const monthlyPerformance = [
    { month: "Jan", revenue: 32000, users: 140 },
    { month: "Feb", revenue: 45000, users: 210 },
    { month: "Mar", revenue: 58000, users: 290 },
    { month: "Apr", revenue: 72000, users: 380 },
    { month: "May", revenue: 91000, users: 460 },
    { month: "Jun", revenue: 124500, users: 580 },
  ];

  // User Engagement & Plan Breakdown
  const userSegmentData = [
    { name: "Incubator Annual Pass", percentage: "52%", count: "302 Startups", color: "bg-blue-600" },
    { name: "Pro Monthly Members", percentage: "31%", count: "180 Active Users", color: "bg-emerald-500" },
    { name: "Workshop & Events", percentage: "17%", count: "98 Participants", color: "bg-purple-500" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50/60 font-sans text-slate-800 antialiased">
      {/* Sidebar Navigation */}
      <BusinessSidebar />

      {/* Analytics Main Dashboard */}
      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <BarChart3 className="w-7 h-7 text-blue-600" />
              Business Analytics & Reports
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Track real-time growth performance, subscription revenue, user retention, and platform usage metrics.
            </p>
          </div>

          {/* Time Filter & Export Buttons */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-xs">
              {["7d", "30d", "90d", "1y"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                    timeRange === range
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {range.toUpperCase()}
                </button>
              ))}
            </div>

            <button className="flex items-center gap-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer">
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Top 4 Performance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total Gross Revenue */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Platform Revenue</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                ₹
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">₹4,22,500</h2>
              <div className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 mt-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+24.5% vs last month</span>
              </div>
            </div>
          </div>

          {/* Card 2: Total Active Subscribers */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Active Members</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">580 Users</h2>
              <div className="flex items-center gap-1 text-[11px] font-extrabold text-blue-600 mt-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+82 new signups this month</span>
              </div>
            </div>
          </div>

          {/* Card 3: Avg Revenue Per User (ARPU) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Avg Revenue Per User</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">₹2,850</h2>
              <div className="flex items-center gap-1 text-[11px] font-extrabold text-purple-600 mt-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+12% plan upgrade rate</span>
              </div>
            </div>
          </div>

          {/* Card 4: Customer Retention */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Retention Rate</span>
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">94.2%</h2>
              <div className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 mt-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Low churn rate (&lt; 2%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Graphical Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue & Growth Trend Line/Bar Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Revenue vs Active User Growth Trends
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Monthly progression over the last 6 months</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Revenue (₹)
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span> Active Users
                </span>
              </div>
            </div>

            {/* Custom Bar/Growth Chart */}
            <div className="pt-4 pb-2">
              <div className="h-60 flex items-end justify-between gap-4 px-2 border-b border-slate-100 pb-2">
                {monthlyPerformance.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
                    {/* Hover Info Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 transition-all bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-md mb-1 text-center">
                      <div>₹{(item.revenue / 1000).toFixed(1)}k</div>
                      <div className="text-slate-300">{item.users} Users</div>
                    </div>

                    {/* Multi-Bar Representation */}
                    <div className="w-full max-w-[44px] flex items-end justify-center gap-1.5 h-full">
                      {/* Revenue Bar */}
                      <div
                        style={{ height: `${(item.revenue / 130000) * 100}%` }}
                        className="w-1/2 bg-blue-600 group-hover:bg-blue-700 rounded-t-lg transition-all duration-300 shadow-xs"
                      ></div>
                      {/* Active Users Bar */}
                      <div
                        style={{ height: `${(item.users / 600) * 100}%` }}
                        className="w-1/2 bg-purple-400 group-hover:bg-purple-500 rounded-t-lg transition-all duration-300 shadow-xs"
                      ></div>
                    </div>

                    {/* Month Text */}
                    <span className="text-[11px] font-bold text-slate-500 group-hover:text-blue-600">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Membership Plan Distribution (Pie / Donut Visual) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6 flex flex-col justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-emerald-600" />
                Subscription Plan Share
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">User proportion by active tier</p>
            </div>

            {/* Custom Circular Donut Visual */}
            <div className="flex justify-center items-center py-2 relative">
              <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="4.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Segment 1: Incubator Pass (52%) */}
                <path
                  stroke="#2563eb"
                  strokeWidth="4.5"
                  strokeDasharray="52, 100"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Segment 2: Pro Members (31%) */}
                <path
                  stroke="#10b981"
                  strokeWidth="4.5"
                  strokeDasharray="31, 100"
                  strokeDashoffset="-52"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Segment 3: Workshops (17%) */}
                <path
                  stroke="#a855f7"
                  strokeWidth="4.5"
                  strokeDasharray="17, 100"
                  strokeDashoffset="-83"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Paid</span>
                <span className="text-base font-black text-slate-900">580 Users</span>
              </div>
            </div>

            {/* Plan Category Legend */}
            <div className="space-y-2.5 text-xs">
              {userSegmentData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-md ${item.color}`}></span>
                    <span className="font-bold text-slate-800">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900">{item.count}</span>
                    <span className="text-[10px] font-bold text-slate-400">({item.percentage})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section: Top Performing Categories */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Top Startup Industry Performance</h2>
              <p className="text-xs text-slate-400">Most active sectors registered in WeGrow Business Portal.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">AgriTech & Smart Farming</span>
                <span className="text-xs font-extrabold text-emerald-600">42% Share</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: "42%" }}></div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">EdTech & Skill Building</span>
                <span className="text-xs font-extrabold text-blue-600">33% Share</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: "33%" }}></div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Sustainable Eco Products</span>
                <span className="text-xs font-extrabold text-purple-600">25% Share</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: "25%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}