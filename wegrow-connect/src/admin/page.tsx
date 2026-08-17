import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import DashboardProfileMenu, { useDashboardUser } from "../components/DashboardProfileMenu";
import {
  Users,
  GraduationCap,
  Briefcase,
  IndianRupee,
  Plus,
  TrendingUp,
  Calendar,
  X
} from "lucide-react";
import { getAllEvents, createEvent } from "../services/api";

export default function AdminDashboard() {
  const { firstName } = useDashboardUser();
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State for Adding New Workshop
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    price: "",
    category: "Technical"
  });

  // Fetch Workshops from API
  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      const data = await getAllEvents();
      setWorkshops(data || []);
    } catch (err) {
      console.error("Failed to load events:", err);
    } finally {
      setLoading(false);
    }
  }

  // Handle Form Submit
  const handleCreateWorkshop = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEvent(formData);
      setShowModal(false);
      setFormData({ title: "", description: "", date: "", time: "", price: "", category: "Technical" });
      fetchDashboardData();
    } catch (err) {
      alert("Failed to create workshop. Check backend API connection.");
    }
  };

  // Mock Startup Submissions matching Screenshot
  const startupSubmissions = [
    { id: "WG-1024", applicant: "Karthik Raja", startup: "AgriTech Drone", stage: "Ideation", status: "Under Review", statusColor: "bg-amber-100 text-amber-800" },
    { id: "WG-1025", applicant: "Priya Sharma", startup: "EduLearn AI", stage: "MVP Ready", status: "Shortlisted", statusColor: "bg-blue-100 text-blue-800" },
    { id: "WG-1026", applicant: "Arun Kumar", startup: "EcoPack Solutions", stage: "Early Traction", status: "Approved", statusColor: "bg-emerald-100 text-emerald-800" },
    { id: "WG-1027", applicant: "Suresh M", startup: "DairyFresh Tech", stage: "Ideation", status: "Under Review", statusColor: "bg-amber-100 text-amber-800" },
  ];

  return (
    <>
 <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800 antialiased">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen max-h-screen overflow-hidden">
        {/* Full-width Top Header Bar (Matching Uploaded Image Format) */}
        <header className="bg-white border-b border-slate-200/80 px-8 py-3.5 flex items-center justify-between shadow-2xs shrink-0 w-full z-20">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Welcome, {firstName}</h1>
            {/* <p className="text-[11px] font-bold text-slate-500 mt-0.5">
              Role: <span className="text-[#00a8ec]">Admin</span>
            </p> */}
          </div>
          <div className="flex items-center gap-3">
            {/* <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200 text-[11px] font-mono font-bold text-slate-600">
              <span>WGF26012</span>
            </div> */}
            <DashboardProfileMenu />
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-8 space-y-8">

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total Users */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between hover:border-slate-300 transition-all">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Users</p>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">1,248</h2>
              <div className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-600">
                <TrendingUp className="w-3 h-3" />
                <span>+12% this month</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Active Workshops */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between hover:border-slate-300 transition-all">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Workshops</p>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{workshops.length || 18}</h2>
              <div className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-600">
                <TrendingUp className="w-3 h-3" />
                <span>+4 this month</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Startup Submissions */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between hover:border-slate-300 transition-all">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Startup Submissions</p>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">86</h2>
              <div className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-600">
                <TrendingUp className="w-3 h-3" />
                <span>+8 this month</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Total Revenue */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between hover:border-slate-300 transition-all">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Revenue</p>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">₹2,45,000</h2>
              <div className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-600">
                <TrendingUp className="w-3 h-3" />
                <span>+18% this month</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Dashboard Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Startup Submissions Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Recent Startup Submissions</h2>
                <p className="text-xs text-slate-400">Applications waiting for review & mentorship allocation</p>
              </div>
              <button className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer">
                View All →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-[10px] uppercase tracking-wider text-slate-400 font-bold border-y border-slate-100">
                    <th className="p-3">App ID</th>
                    <th className="p-3">Applicant</th>
                    <th className="p-3">Startup Name</th>
                    <th className="p-3">Stage</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {startupSubmissions.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/60 transition-all cursor-pointer">
                      <td className="p-3 font-mono font-bold text-slate-900">{s.id}</td>
                      <td className="p-3 font-semibold text-slate-800">{s.applicant}</td>
                      <td className="p-3 text-slate-600">{s.startup}</td>
                      <td className="p-3 text-slate-500">{s.stage}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${s.statusColor}`}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upcoming Live Workshops Box */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-extrabold text-slate-900">Upcoming Live Workshops</h2>

            <div className="space-y-3">
              {loading ? (
                <div className="p-4 text-xs text-slate-400 text-center">Loading live workshops...</div>
              ) : workshops.length > 0 ? (
                workshops.slice(0, 3).map((w: any, idx: number) => (
                  <div key={w._id || idx} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 hover:shadow-xs transition-all space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-xs">{w.title}</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">{w.date || "Today, 6:00 PM"}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 font-bold rounded-md text-[10px]">
                        {w.price ? `₹${w.price}` : "Free"}
                      </span>
                      <button className="text-blue-600 hover:text-blue-700 font-bold text-xs cursor-pointer">
                        Manage
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-xs">Build MVP in 3 Days</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">Today, 6:00 PM</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 font-bold rounded-md text-[10px]">
                        42 Enrolled
                      </span>
                      <button className="text-blue-600 font-bold text-xs cursor-pointer">Manage</button>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-xs">Legal & GST Setup Bootcamp</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">Aug 10, 4:00 PM</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-bold rounded-md text-[10px]">
                        28 Enrolled
                      </span>
                      <button className="text-blue-600 font-bold text-xs cursor-pointer">Manage</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>

      {/* Add New Workshop Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-slate-100">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">Add New Live Workshop</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWorkshop} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Workshop Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI-Powered Full Stack Bootcamp"
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-blue-600"
                  value={formData.title}
                  onChange={(e: { target: { value: any; }; }) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date & Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aug 15, 6:00 PM"
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-blue-600"
                    value={formData.date}
                    onChange={(e: { target: { value: any; }; }) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Price (₹)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1499"
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-blue-600"
                    value={formData.price}
                    onChange={(e: { target: { value: any; }; }) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Enter short workshop details..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-blue-600"
                  value={formData.description}
                  onChange={(e: { target: { value: any; }; }) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Publish Workshop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  );
}