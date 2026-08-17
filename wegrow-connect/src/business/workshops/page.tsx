import React, { useState } from "react";
import BusinessSidebar from "../../components/BusinessSidebar";
import {
  Video,
  Calendar,
  Clock,
  Users,
  Award,
  Sparkles,
  Search,
  Plus,
  CheckCircle2,
  PlayCircle,
  ArrowRight,
  ExternalLink
} from "lucide-react";

export default function BusinessWorkshops() {
  const [filter, setFilter] = useState("all");

  // Workshops & Masterclasses List
  const workshops = [
    {
      id: "WS-01",
      title: "Seed Funding & Investor Pitch Masterclass",
      speaker: "Senthil Nathan (Venture Capital Partner)",
      date: "Aug 18, 2026",
      time: "06:00 PM - 08:00 PM IST",
      category: "Funding",
      type: "Live Interactive",
      seatsLeft: 12,
      price: "Included with Pro Pass",
      status: "Upcoming",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      id: "WS-02",
      title: "AgriTech Scale-Up & IoT Supply Chain Setup",
      speaker: "Dr. K. Arunkumar (Agri Operations Head)",
      date: "Aug 24, 2026",
      time: "05:00 PM - 07:00 PM IST",
      category: "AgriTech",
      type: "Live Interactive",
      seatsLeft: 5,
      price: "Included with Pro Pass",
      status: "Upcoming",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      id: "WS-03",
      title: "Startup GST, Compliance & Legal Protection",
      speaker: "Adv. Priya Ramachandran (Corporate Lawyer)",
      date: "Jul 29, 2026",
      time: "Recorded (2.5 Hours)",
      category: "Legal & Tax",
      type: "On-Demand Video",
      seatsLeft: 0,
      price: "Free Access",
      status: "Recorded",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    },
    {
      id: "WS-04",
      title: "B2B Marketing & Cold Email Strategies for Startups",
      speaker: "Rajesh Kannan (Growth Consultant)",
      date: "Jul 15, 2026",
      time: "Recorded (1.8 Hours)",
      category: "Growth",
      type: "On-Demand Video",
      seatsLeft: 0,
      price: "Free Access",
      status: "Recorded",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50/60 font-sans text-slate-800 antialiased">
      {/* Business Sidebar */}
      <BusinessSidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <Video className="w-7 h-7 text-blue-600" />
              Startup Workshops & Masterclasses
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Learn directly from VC investors, corporate lawyers, and domain experts to scale your business.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-60 text-xs">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search topic or speaker..."
                className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl bg-white outline-none focus:border-blue-600 text-xs shadow-xs"
              />
            </div>

            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer shrink-0">
              <Plus className="w-4 h-4" />
              <span>Request Topic</span>
            </button>
          </div>
        </div>

        {/* Featured Live Banner Card */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-red-500/20 text-red-300 border border-red-400/30 rounded-lg text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Next Live Session
              </span>
              <span className="text-xs text-slate-300 font-medium">Aug 18, 2026 • 6:00 PM</span>
            </div>
            <h2 className="text-xl font-black">Seed Funding & Investor Pitch Masterclass</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Join VC Partner Senthil Nathan to learn how to structure your valuation, handle investor Q&A, and close seed funding rounds.
            </p>
          </div>

          <button className="bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all text-white px-6 py-3 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer shrink-0 flex items-center gap-2">
            <span>Reserve Free Seat</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3 text-xs">
          {["all", "upcoming", "recorded", "funding", "legal"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl font-extrabold capitalize transition-all cursor-pointer ${
                filter === cat
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-500 border border-slate-200 hover:text-slate-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Workshops Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {workshops.map((ws) => (
            <div
              key={ws.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold border ${ws.badgeColor}`}>
                    {ws.category}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {ws.time}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900 leading-snug">{ws.title}</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-1">Speaker: {ws.speaker}</p>
                </div>
              </div>

              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>{ws.date}</span>
                  </div>

                  {ws.status === "Upcoming" ? (
                    <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-md border border-orange-100">
                      {ws.seatsLeft} Seats Left
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-100 flex items-center gap-1">
                      <PlayCircle className="w-3.5 h-3.5" /> On-Demand Video
                    </span>
                  )}
                </div>

                <button
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    ws.status === "Upcoming"
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 active:scale-95"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200"
                  }`}
                >
                  {ws.status === "Upcoming" ? (
                    <>
                      <span>Register for Workshop</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-4 h-4 text-purple-600" />
                      <span>Watch Recording</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}