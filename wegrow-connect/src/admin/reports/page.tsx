import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import {
  BarChart3,
  TrendingUp,
  Download,
  Users,
  IndianRupee,
  Award,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  FileSpreadsheet,
  CheckCircle2,
  Filter
} from "lucide-react";

export default function ReportsAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("This Month");

  // Sample Analytics Data
  const performanceData = [
    {
      title: "30-Day Full Stack Next.js Bootcamp",
      category: "Bootcamp",
      students: 184,
      revenue: "₹5,51,816",
      completionRate: "92%",
      rating: "4.9 ⭐",
    },
    {
      title: "AI & Startup Pitch Masterclass",
      category: "Seminar",
      students: 250,
      revenue: "₹1,24,750",
      completionRate: "98%",
      rating: "4.8 ⭐",
    },
    {
      title: "Data Analytics & PowerBI Certification",
      category: "Course",
      students: 120,
      revenue: "₹1,79,880",
      completionRate: "85%",
      rating: "4.7 ⭐",
    },
    {
      title: "UI/UX Design Systems Workshop",
      category: "Workshop",
      students: 95,
      revenue: "₹94,905",
      completionRate: "90%",
      rating: "4.9 ⭐",
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50/60 font-sans text-slate-800 antialiased">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Top Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Reports & Analytics</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Deep dive into revenue growth, course completions, and platform engagement metrics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Time Range Filter */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-white border border-slate-200 text-xs font-bold text-slate-700 px-3 py-2 rounded-xl outline-none shadow-2xs cursor-pointer"
            >
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="Last Quarter">Last Quarter</option>
              <option value="This Year">This Year (2026)</option>
            </select>

            <button
              onClick={() => alert("Exporting Full Platform Analytics Report (CSV)...")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Top Metric Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Total Gross Revenue</p>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">₹9,51,351</h2>
              <span className="text-[10px] font-bold text-emerald-600 inline-flex items-center mt-1">
                <ArrowUpRight className="w-3 h-3" /> +18.4% from last month
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Active Platform Learners</p>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">1,240 Students</h2>
              <span className="text-[10px] font-bold text-emerald-600 inline-flex items-center mt-1">
                <ArrowUpRight className="w-3 h-3" /> +12.1% new signups
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Avg. Completion Rate</p>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">88.4%</h2>
              <span className="text-[10px] font-bold text-emerald-600 inline-flex items-center mt-1">
                <ArrowUpRight className="w-3 h-3" /> +3.2% completion boost
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Avg. Order Value (AOV)</p>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">₹1,499</h2>
              <span className="text-[10px] font-bold text-amber-600 inline-flex items-center mt-1">
                Stable across tiers
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Visual Charts & Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Revenue & Growth Visual Bar Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Monthly Revenue Trend (2026)</h3>
                <p className="text-xs text-slate-400">Earnings breakdown in INR (Thousands)</p>
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                Peak: Aug 2026
              </span>
            </div>

            {/* Custom Bar Chart Component */}
            <div className="pt-6 pb-2 flex items-end justify-between gap-3 h-48 border-b border-slate-100">
              {[
                { month: "Jan", val: 40, amt: "₹1.2L" },
                { month: "Feb", val: 55, amt: "₹1.8L" },
                { month: "Mar", val: 45, amt: "₹1.4L" },
                { month: "Apr", val: 70, amt: "₹2.2L" },
                { month: "May", val: 60, amt: "₹1.9L" },
                { month: "Jun", val: 80, amt: "₹2.6L" },
                { month: "Jul", val: 75, amt: "₹2.4L" },
                { month: "Aug", val: 95, amt: "₹3.1L" },
              ].map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="text-[9px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-all">
                    {bar.amt}
                  </div>
                  <div
                    style={{ height: `${bar.val}%` }}
                    className={`w-full max-w-[28px] rounded-t-lg transition-all ${
                      bar.month === "Aug"
                        ? "bg-blue-600 shadow-md shadow-blue-500/30"
                        : "bg-slate-200 group-hover:bg-blue-400"
                    }`}
                  ></div>
                  <span className="text-[10px] font-bold text-slate-500">{bar.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Download Reports Box */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Exportable Statements
              </h3>
              <p className="text-xs text-slate-400 mt-1">Download pre-generated financial and user activity logs.</p>

              <div className="space-y-3 pt-4">
                <button
                  onClick={() => alert("Downloading Monthly Tax & Revenue Statement...")}
                  className="w-full p-3 rounded-xl border border-slate-200/80 hover:border-blue-300 hover:bg-slate-50 transition-all flex items-center justify-between text-left cursor-pointer"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900">August 2026 GST Statement</p>
                    <p className="text-[10px] text-slate-400">PDF • 1.2 MB</p>
                  </div>
                  <Download className="w-4 h-4 text-slate-400 hover:text-blue-600" />
                </button>

                <button
                  onClick={() => alert("Downloading Student Enrollment Spreadsheet...")}
                  className="w-full p-3 rounded-xl border border-slate-200/80 hover:border-blue-300 hover:bg-slate-50 transition-all flex items-center justify-between text-left cursor-pointer"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900">Student Signups & Activity</p>
                    <p className="text-[10px] text-slate-400">CSV • 450 KB</p>
                  </div>
                  <Download className="w-4 h-4 text-slate-400 hover:text-blue-600" />
                </button>
              </div>
            </div>

            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-700 font-medium">
              💡 Automated weekly reports are delivered to <span className="font-bold">admin@wegrow.com</span>
            </div>
          </div>
        </div>

        {/* Top Performing Programs Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-slate-900 text-sm">Top Performing Bootcamps & Workshops</h3>
            <span className="text-xs text-slate-400 font-medium">Ranked by Total Revenue</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-y border-slate-100">
                <tr>
                  <th className="p-3">Program Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Enrolled Students</th>
                  <th className="p-3">Total Revenue</th>
                  <th className="p-3">Completion Rate</th>
                  <th className="p-3 text-center">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {performanceData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-all">
                    <td className="p-3 font-bold text-slate-900">{item.title}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-100 text-slate-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-700">{item.students} Learners</td>
                    <td className="p-3 font-extrabold text-slate-900">{item.revenue}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            style={{ width: item.completionRate }}
                            className="bg-emerald-500 h-full rounded-full"
                          ></div>
                        </div>
                        <span className="text-[11px] font-bold text-slate-700">{item.completionRate}</span>
                      </div>
                    </td>
                    <td className="p-3 text-center font-bold text-slate-800">{item.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}