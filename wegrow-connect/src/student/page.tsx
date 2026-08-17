import React, { useEffect, useState } from "react";
import { getAllEvents } from"../services/api";
import { BookOpen, Calendar, Award, Clock, ArrowRight } from "lucide-react";

export default function StudentDashboard() {
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWorkshops() {
      setLoading(true);
      const data = await getAllEvents();
      setWorkshops(data);
      setLoading(false);
    }
    loadWorkshops();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Student Learning Portal</h1>
            <p className="text-xs text-slate-500 mt-1">Welcome back! Browse upcoming live workshops & enrolled courses.</p>
          </div>
          <span className="px-3 py-1.5 bg-blue-50 text-blue-600 font-bold rounded-xl text-xs">
            Student Account
          </span>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Enrolled Workshops</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">4 Active</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Certificates Earned</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">2 Issued</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Next Live Session</p>
              <h3 className="text-sm font-bold text-slate-900 mt-1">Today at 6:00 PM</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Live Workshops List from Admin API */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900">Available Workshops</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              <p className="text-xs text-slate-400">Loading workshops...</p>
            ) : workshops.length === 0 ? (
              <p className="text-xs text-slate-400">No active workshops available right now.</p>
            ) : (
              workshops.map((w: any, idx: number) => (
                <div key={w._id || idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all space-y-2">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 font-bold rounded-md text-[10px] uppercase">
                    {w.type || "WORKSHOP"}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-sm">{w.title}</h3>
                  <p className="text-xs text-slate-500 font-medium">Price: <span className="font-bold text-emerald-600">₹{w.price || 0}</span></p>
                  <button className="w-full mt-2 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer">
                    Enroll Now <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}