// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import Sidebar from "../components/Sidebar";
// import DashboardProfileMenu, { useDashboardUser } from "../components/DashboardProfileMenu";
// import {
//   Users,
//   GraduationCap,
//   BookOpen,
//   CreditCard,
//   TrendingUp,
//   Calendar,
//   MapPin,
//   Loader2,
//   X,
//   Plus,
//   ArrowRight,
//   CheckCircle2,
//   Clock3,
// } from "lucide-react";
// import { getAllEvents, createEvent, adminGetSubscriptions, getAuthHeaders, API_BASE } from "../services/api";

// // ─── Format date helper ────────────────────────────────────
// function formatEventDate(date: string) {
//   if (!date) return "TBA";
//   return new Date(date).toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// }

// // ─── Main Component ────────────────────────────────────────
// export default function AdminDashboard() {
//   const { firstName } = useDashboardUser();
//   const navigate = useNavigate();

//   // ── State ─────────────────────────────────────────────
//   const [events,          setEvents]          = useState<any[]>([]);
//   const [users,           setUsers]           = useState<any[]>([]);
//   const [usersTotal,      setUsersTotal]      = useState<number | null>(null);
//   const [bookingsTotal,   setBookingsTotal]   = useState<number | null>(null);
//   const [subsTotal,       setSubsTotal]       = useState<number | null>(null);

//   const [loadingEvents,   setLoadingEvents]   = useState(true);
//   const [loadingUsers,    setLoadingUsers]    = useState(true);
//   const [loadingBookings, setLoadingBookings] = useState(true);
//   const [loadingSubs,     setLoadingSubs]     = useState(true);

//   const [showModal,   setShowModal]   = useState(false);
//   const [creating,    setCreating]    = useState(false);
//   const [formData,    setFormData]    = useState({
//     title: "", description: "", date: "", price: "", category: "Technical",
//   });

//   // ── PAUSE on hover ─────────────────────────────────────
//   const [paused, setPaused] = useState(false);

//   // ── FETCH EVENTS ──────────────────────────────────────
//   useEffect(() => {
//     setLoadingEvents(true);
//     getAllEvents()
//       .then((data) => setEvents(Array.isArray(data) ? data : []))
//       .catch(() => setEvents([]))
//       .finally(() => setLoadingEvents(false));
//   }, []);

//   // ── FETCH USERS ───────────────────────────────────────
//   useEffect(() => {
//     setLoadingUsers(true);
//     fetch(`${API_BASE}/users/all?page=1&limit=5`, { headers: getAuthHeaders() })
//       .then((r) => r.json())
//       .then((data) => {
//         const list = Array.isArray(data?.data?.users)
//           ? data.data.users
//           : Array.isArray(data?.data) ? data.data : [];
//         const total =
//           data?.data?.pagination?.total ??
//           data?.data?.total ??
//           data?.total ??
//           list.length;
//         setUsers(list.slice(0, 5));
//         setUsersTotal(total);
//       })
//       .catch(() => { setUsers([]); setUsersTotal(0); })
//       .finally(() => setLoadingUsers(false));
//   }, []);

//   // ── FETCH BOOKINGS COUNT ──────────────────────────────
//   useEffect(() => {
//     setLoadingBookings(true);
//     fetch(`${API_BASE}/bookings/all?page=1&limit=1`, { headers: getAuthHeaders() })
//       .then((r) => r.json())
//       .then((data) => {
//         setBookingsTotal(
//           data?.data?.pagination?.total ??
//           data?.data?.total ??
//           data?.total ??
//           null
//         );
//       })
//       .catch(() => setBookingsTotal(null))
//       .finally(() => setLoadingBookings(false));
//   }, []);

//   // ── FETCH SUBSCRIPTIONS COUNT ─────────────────────────
//   useEffect(() => {
//     setLoadingSubs(true);
//     adminGetSubscriptions()
//       .then((data) => setSubsTotal(Array.isArray(data) ? data.length : 0))
//       .catch(() => setSubsTotal(0))
//       .finally(() => setLoadingSubs(false));
//   }, []);

//   // ── DERIVED ───────────────────────────────────────────
//   const activeEvents = events.filter((e) => e.isActive);
//   // Duplicate events list for seamless infinite scroll
//   const scrollEvents = events.length > 0 ? [...events, ...events, ...events] : [];

//   // ── Duration for scroll animation: 4s per card ────────
//   const animDuration = Math.max(events.length * 4, 20);

//   // ── CREATE WORKSHOP ───────────────────────────────────
//   const handleCreateWorkshop = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setCreating(true);
//     try {
//       await createEvent(formData);
//       setShowModal(false);
//       setFormData({ title: "", description: "", date: "", price: "", category: "Technical" });
//       getAllEvents().then((data) => setEvents(Array.isArray(data) ? data : []));
//     } catch {
//       alert("Failed to create workshop.");
//     } finally {
//       setCreating(false);
//     }
//   };

//   // ── HELPERS ───────────────────────────────────────────
//   function roleBadge(role: string) {
//     const r = (role || "").toLowerCase();
//     if (r === "admin")    return "bg-purple-100 text-purple-700";
//     if (r === "business") return "bg-orange-100 text-orange-700";
//     return "bg-blue-100 text-blue-700";
//   }

//   function statVal(val: number | null, loading: boolean) {
//     if (loading) return <Loader2 className="w-4 h-4 animate-spin text-slate-400 inline" />;
//     if (val === null) return "—";
//     return val.toLocaleString("en-IN");
//   }

//   // =====================================================
//   // RENDER
//   // =====================================================
//   return (
//     <>
//       {/* CSS keyframe for infinite top-to-bottom scroll */}
//       <style>{`
//         @keyframes scrollDown {
//           0%   { transform: translateY(0); }
//           100% { transform: translateY(-50%); }
//         }
//         .scroll-track {
//           animation: scrollDown ${animDuration}s linear infinite;
//         }
//         .scroll-track.paused {
//           animation-play-state: paused;
//         }
//       `}</style>

//       <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800 antialiased">

//         {/* Sidebar */}
//         <Sidebar />

//         <div className="flex-1 flex flex-col min-w-0 h-screen max-h-screen overflow-hidden">

//           {/* ─── HEADER ───────────────────────────────────── */}
//           <header className="bg-white border-b border-slate-200/80 px-8 py-3.5 flex items-center justify-between shadow-2xs shrink-0 z-20">
//             <div>
//               <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
//                 Welcome, {firstName}
//               </h1>
//               <p className="text-[11px] font-bold text-slate-400 mt-0.5">
//                 Admin Dashboard Overview
//               </p>
//             </div>
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={() => setShowModal(true)}
//                 className="hidden sm:flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-3.5 py-2 rounded-xl shadow-sm transition-all cursor-pointer"
//               >
//                 <Plus className="w-3.5 h-3.5" /> New Workshop
//               </button>
//               <DashboardProfileMenu />
//             </div>
//           </header>

//           {/* ─── SCROLLABLE CONTENT ───────────────────────── */}
//           <main className="flex-1 overflow-y-auto p-8 space-y-7">

//             {/* ── METRIC CARDS ─────────────────────────────── */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

//               {/* Card 1 – Total Users */}
//               <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between hover:border-blue-200 hover:shadow-sm transition-all">
//                 <div className="space-y-1">
//                   <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Users</p>
//                   <h2 className="text-2xl font-black text-slate-900 tracking-tight min-h-[32px] flex items-center">
//                     {statVal(usersTotal, loadingUsers)}
//                   </h2>
//                   <p className="text-[11px] font-extrabold text-emerald-600 flex items-center gap-1">
//                     <TrendingUp className="w-3 h-3" /> All registered members
//                   </p>
//                 </div>
//                 <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
//                   <Users className="w-6 h-6" />
//                 </div>
//               </div>

//               {/* Card 2 – Active Events */}
//               <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between hover:border-emerald-200 hover:shadow-sm transition-all">
//                 <div className="space-y-1">
//                   <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Events</p>
//                   <h2 className="text-2xl font-black text-slate-900 tracking-tight min-h-[32px] flex items-center">
//                     {loadingEvents ? <Loader2 className="w-4 h-4 animate-spin text-slate-400" /> : activeEvents.length}
//                   </h2>
//                   <p className="text-[11px] font-extrabold text-emerald-600 flex items-center gap-1">
//                     <TrendingUp className="w-3 h-3" /> of {events.length} total events
//                   </p>
//                 </div>
//                 <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
//                   <GraduationCap className="w-6 h-6" />
//                 </div>
//               </div>

//               {/* Card 3 – Total Bookings */}
//               <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between hover:border-orange-200 hover:shadow-sm transition-all">
//                 <div className="space-y-1">
//                   <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Bookings</p>
//                   <h2 className="text-2xl font-black text-slate-900 tracking-tight min-h-[32px] flex items-center">
//                     {statVal(bookingsTotal, loadingBookings)}
//                   </h2>
//                   <p className="text-[11px] font-extrabold text-emerald-600 flex items-center gap-1">
//                     <TrendingUp className="w-3 h-3" /> Event bookings registered
//                   </p>
//                 </div>
//                 <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
//                   <BookOpen className="w-6 h-6" />
//                 </div>
//               </div>

//               {/* Card 4 – Subscriptions */}
//               <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between hover:border-purple-200 hover:shadow-sm transition-all">
//                 <div className="space-y-1">
//                   <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Subscriptions</p>
//                   <h2 className="text-2xl font-black text-slate-900 tracking-tight min-h-[32px] flex items-center">
//                     {statVal(subsTotal, loadingSubs)}
//                   </h2>
//                   <p className="text-[11px] font-extrabold text-emerald-600 flex items-center gap-1">
//                     <TrendingUp className="w-3 h-3" /> Active subscription plans
//                   </p>
//                 </div>
//                 <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20 shrink-0">
//                   <CreditCard className="w-6 h-6" />
//                 </div>
//               </div>

//             </div>

//             {/* ── MAIN GRID ─────────────────────────────────── */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//               {/* ── LEFT — Recent Users Table ────────────────── */}
//               <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <h2 className="text-base font-extrabold text-slate-900">Recent Users</h2>
//                     <p className="text-xs text-slate-400">Latest registered members on the platform</p>
//                   </div>
//                   <button
//                     onClick={() => navigate("/admin/users")}
//                     className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
//                   >
//                     View All <ArrowRight className="w-3.5 h-3.5" />
//                   </button>
//                 </div>

//                 {loadingUsers ? (
//                   <div className="flex items-center justify-center py-10">
//                     <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
//                     <span className="ml-2 text-xs text-slate-400">Loading users…</span>
//                   </div>
//                 ) : users.length === 0 ? (
//                   <p className="text-xs text-slate-400 text-center py-8">No users found.</p>
//                 ) : (
//                   <div className="overflow-x-auto">
//                     <table className="w-full text-left text-xs border-collapse">
//                       <thead>
//                         <tr className="bg-slate-50/80 text-[10px] uppercase tracking-wider text-slate-400 font-bold border-y border-slate-100">
//                           <th className="p-3">#</th>
//                           <th className="p-3">Name</th>
//                           <th className="p-3">Email</th>
//                           <th className="p-3">Role</th>
//                           <th className="p-3">Joined</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-slate-100 font-medium">
//                         {users.map((u: any, idx: number) => (
//                           <tr
//                             key={u._id || idx}
//                             className="hover:bg-slate-50/60 transition-all cursor-pointer"
//                             onClick={() => navigate("/admin/users")}
//                           >
//                             <td className="p-3 font-mono text-slate-400 text-[10px]">{idx + 1}</td>
//                             <td className="p-3">
//                               <div className="flex items-center gap-2">
//                                 <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-black shrink-0">
//                                   {(u.firstName || u.name || u.email || "U").charAt(0).toUpperCase()}
//                                 </div>
//                                 <span className="font-semibold text-slate-800">
//                                   {u.firstName && u.lastName
//                                     ? `${u.firstName} ${u.lastName}`
//                                     : u.name || u.fullName || "—"}
//                                 </span>
//                               </div>
//                             </td>
//                             <td className="p-3 text-slate-500 truncate max-w-[160px]">{u.email || "—"}</td>
//                             <td className="p-3">
//                               <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold capitalize ${roleBadge(u.role)}`}>
//                                 {u.role || "student"}
//                               </span>
//                             </td>
//                             <td className="p-3 text-slate-400">
//                               {u.createdAt
//                                 ? new Date(u.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
//                                 : "—"}
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}

//                 <div className="pt-2 border-t border-slate-100 flex justify-end">
//                   <button
//                     onClick={() => navigate("/admin/users")}
//                     className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
//                   >
//                     See all {usersTotal !== null ? `${usersTotal.toLocaleString("en-IN")} users` : "users"}
//                     <ArrowRight className="w-3.5 h-3.5" />
//                   </button>
//                 </div>
//               </div>

//               {/* ── RIGHT — Upcoming Live Workshops (CSS scroll) ── */}
//               <div
//                 className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col"
//                 style={{ height: 460 }}
//               >
//                 {/* Panel header */}
//                 <div className="px-5 pt-5 pb-3 border-b border-slate-100 shrink-0">
//                   <div className="flex items-center gap-2 mb-0.5">
//                     <span className="relative flex h-2 w-2 shrink-0">
//                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
//                       <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
//                     </span>
//                     <h2 className="text-sm font-extrabold text-slate-900">Upcoming Live Workshops</h2>
//                     {!loadingEvents && (
//                       <span className="ml-auto text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full shrink-0">
//                         {events.length} events
//                       </span>
//                     )}
//                   </div>
//                   <p className="text-[10px] text-slate-400 font-semibold">Hover to pause · Auto-scrolling</p>
//                 </div>

//                 {/* Scroll viewport */}
//                 <div className="relative flex-1 overflow-hidden">

//                   {/* Top fade */}
//                   <div
//                     className="absolute top-0 left-0 right-0 h-6 z-10 pointer-events-none"
//                     style={{ background: "linear-gradient(to bottom, #fff 0%, transparent 100%)" }}
//                   />
//                   {/* Bottom fade */}
//                   <div
//                     className="absolute bottom-0 left-0 right-0 h-6 z-10 pointer-events-none"
//                     style={{ background: "linear-gradient(to top, #fff 0%, transparent 100%)" }}
//                   />

//                   {loadingEvents ? (
//                     <div className="flex items-center justify-center h-full">
//                       <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
//                     </div>
//                   ) : events.length === 0 ? (
//                     <p className="text-xs text-slate-400 text-center py-10">No events found.</p>
//                   ) : (
//                     /* The scroll track — CSS transform animation */
//                     <div
//                       className={`scroll-track${paused ? " paused" : ""}`}
//                       onMouseEnter={() => setPaused(true)}
//                       onMouseLeave={() => setPaused(false)}
//                     >
//                       {/* Render events × 2 so animation loops seamlessly */}
//                       {[...events, ...events].map((w: any, idx: number) => (
//                         <div
//                           key={`${w._id || idx}-${idx}`}
//                           className="mx-4 my-2 p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-slate-200 hover:shadow-xs transition-all cursor-pointer space-y-2.5"
//                         >
//                           {/* Top row */}
//                           <div className="flex items-start gap-2.5">
//                             <div className={`p-1.5 rounded-xl shrink-0 ${w.type === "BUSINESS" ? "bg-orange-50 text-orange-500" : "bg-blue-50 text-blue-600"}`}>
//                               <Calendar className="w-3.5 h-3.5" />
//                             </div>
//                             <div className="min-w-0 flex-1">
//                               <h3 className="font-extrabold text-slate-900 text-[11px] leading-tight line-clamp-2">
//                                 {w.title || "Untitled Workshop"}
//                               </h3>
//                               <div className="flex flex-wrap items-center gap-2 mt-1">
//                                 <span className="flex items-center gap-0.5 text-[10px] text-slate-400 font-semibold">
//                                   <Calendar className="w-2.5 h-2.5" />
//                                   {formatEventDate(w.date)}
//                                 </span>
//                                 {w.location && (
//                                   <span className="flex items-center gap-0.5 text-[10px] text-slate-400 font-semibold">
//                                     <MapPin className="w-2.5 h-2.5" />
//                                     {w.location}
//                                   </span>
//                                 )}
//                               </div>
//                             </div>
//                           </div>

//                           {/* Bottom row */}
//                           <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
//                             <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
//                               w.price && Number(w.price) > 0
//                                 ? "bg-blue-100 text-blue-700"
//                                 : "bg-emerald-100 text-emerald-700"
//                             }`}>
//                               {w.price && Number(w.price) > 0
//                                 ? `₹${Number(w.price).toLocaleString("en-IN")}`
//                                 : "Free"}
//                             </span>
//                             <div className="flex items-center gap-1.5">
//                               {w.isActive ? (
//                                 <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600">
//                                   <CheckCircle2 className="w-3 h-3" /> Active
//                                 </span>
//                               ) : (
//                                 <span className="flex items-center gap-0.5 text-[10px] font-bold text-slate-400">
//                                   <Clock3 className="w-3 h-3" /> Upcoming
//                                 </span>
//                               )}
//                               <button
//                                 onClick={(e) => { e.stopPropagation(); navigate("/admin/events"); }}
//                                 className="text-blue-600 hover:text-blue-700 font-bold text-[10px] cursor-pointer ml-1"
//                               >
//                                 Manage →
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>

//             </div>
//           </main>
//         </div>
//       </div>

//       {/* ── ADD WORKSHOP MODAL ─────────────────────────────── */}
//       {showModal && (
//         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-slate-100">

//             <div className="flex justify-between items-center border-b pb-3">
//               <h3 className="font-extrabold text-slate-900 text-base">Add New Live Workshop</h3>
//               <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <form onSubmit={handleCreateWorkshop} className="space-y-3 text-xs">
//               <div>
//                 <label className="font-bold text-slate-700 block mb-1">Workshop Title</label>
//                 <input
//                   type="text"
//                   required
//                   placeholder="e.g. AI-Powered Full Stack Bootcamp"
//                   className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-blue-600"
//                   value={formData.title}
//                   onChange={(e: any) => setFormData({ ...formData, title: e.target.value })}
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="font-bold text-slate-700 block mb-1">Date</label>
//                   <input
//                     type="date"
//                     required
//                     className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-blue-600"
//                     value={formData.date}
//                     onChange={(e: any) => setFormData({ ...formData, date: e.target.value })}
//                   />
//                 </div>
//                 <div>
//                   <label className="font-bold text-slate-700 block mb-1">Price (₹)</label>
//                   <input
//                     type="number"
//                     min="0"
//                     placeholder="e.g. 1499"
//                     className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-blue-600"
//                     value={formData.price}
//                     onChange={(e: any) => setFormData({ ...formData, price: e.target.value })}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="font-bold text-slate-700 block mb-1">Description</label>
//                 <textarea
//                   rows={3}
//                   placeholder="Enter short workshop details..."
//                   className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-blue-600 resize-none"
//                   value={formData.description}
//                   onChange={(e: any) => setFormData({ ...formData, description: e.target.value })}
//                 />
//               </div>

//               <div className="pt-2 flex gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setShowModal(false)}
//                   disabled={creating}
//                   className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer disabled:opacity-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={creating}
//                   className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5"
//                 >
//                   {creating
//                     ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Publishing…</>
//                     : "Publish Workshop"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";

import DashboardProfileMenu, {
  useDashboardUser,
} from "../components/DashboardProfileMenu";

import {
  Users,
  GraduationCap,
  BookOpen,
  CreditCard,
  TrendingUp,
  Calendar,
  MapPin,
  Loader2,
  X,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import {
  getAllEvents,
  createEvent,
  adminGetSubscriptions,
  getAdminUsers,
  getAllBookings,
} from "../services/api";


// =====================================================
// FORMAT DATE
// =====================================================

function formatEventDate(date: string) {
  if (!date) {
    return "TBA";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "TBA";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}


// =====================================================
// GET USERS LIST FROM DIFFERENT API RESPONSE FORMATS
// =====================================================

function extractUsers(response: any): any[] {
  console.log("USERS RAW RESPONSE:", response);

  // Direct array
  if (Array.isArray(response)) {
    return response;
  }

  // response.data.users
  if (Array.isArray(response?.data?.users)) {
    return response.data.users;
  }

  // response.data.data.users
  if (Array.isArray(response?.data?.data?.users)) {
    return response.data.data.users;
  }

  // response.users
  if (Array.isArray(response?.users)) {
    return response.users;
  }

  // response.data
  if (Array.isArray(response?.data)) {
    return response.data;
  }

  // response.data.data
  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }

  return [];
}


// =====================================================
// GET BOOKINGS LIST FROM DIFFERENT API RESPONSE FORMATS
// =====================================================

function extractBookings(response: any): any[] {
  console.log("BOOKINGS RAW RESPONSE:", response);

  // Direct array
  if (Array.isArray(response)) {
    return response;
  }

  // response.data.bookings
  if (Array.isArray(response?.data?.bookings)) {
    return response.data.bookings;
  }

  // response.data.data.bookings
  if (Array.isArray(response?.data?.data?.bookings)) {
    return response.data.data.bookings;
  }

  // response.bookings
  if (Array.isArray(response?.bookings)) {
    return response.bookings;
  }

  // response.data
  if (Array.isArray(response?.data)) {
    return response.data;
  }

  // response.data.data
  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }

  return [];
}


// =====================================================
// EXTRACT TOTAL FROM API RESPONSE
// =====================================================

function extractTotal(response: any, fallbackLength = 0): number {
  console.log("TOTAL RESPONSE:", response);

  const possibleTotals = [
    response?.data?.pagination?.total,
    response?.data?.pagination?.totalItems,

    response?.data?.meta?.total,
    response?.data?.meta?.totalItems,

    response?.data?.total,
    response?.data?.totalCount,
    response?.data?.count,

    response?.pagination?.total,
    response?.pagination?.totalItems,

    response?.meta?.total,
    response?.meta?.totalItems,

    response?.total,
    response?.totalCount,
    response?.count,
  ];

  for (const value of possibleTotals) {
    if (
      value !== undefined &&
      value !== null &&
      !Number.isNaN(Number(value))
    ) {
      return Number(value);
    }
  }

  return fallbackLength;
}


// =====================================================
// MAIN COMPONENT
// =====================================================

export default function AdminDashboard() {
  const { firstName } = useDashboardUser();

  const navigate = useNavigate();


  // =====================================================
  // STATE
  // =====================================================

  const [events, setEvents] = useState<any[]>([]);

  const [users, setUsers] = useState<any[]>([]);

  const [usersTotal, setUsersTotal] = useState<number | null>(null);

  const [bookingsTotal, setBookingsTotal] =
    useState<number | null>(null);

  const [subsTotal, setSubsTotal] =
    useState<number | null>(null);


  // =====================================================
  // LOADING
  // =====================================================

  const [loadingEvents, setLoadingEvents] =
    useState(true);

  const [loadingUsers, setLoadingUsers] =
    useState(true);

  const [loadingBookings, setLoadingBookings] =
    useState(true);

  const [loadingSubs, setLoadingSubs] =
    useState(true);


  // =====================================================
  // MODAL
  // =====================================================

  const [showModal, setShowModal] =
    useState(false);

  const [creating, setCreating] =
    useState(false);


  // =====================================================
  // FORM
  // =====================================================

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    price: "",
    category: "Technical",
  });


  // =====================================================
  // PAUSE SCROLL
  // =====================================================

  const [paused, setPaused] =
    useState(false);


  // =====================================================
  // FETCH EVENTS
  // =====================================================

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoadingEvents(true);

        const response = await getAllEvents();

        console.log(
          "================ EVENTS ================="
        );

        console.log(response);

        console.log(
          "=========================================="
        );

        setEvents(
          Array.isArray(response)
            ? response
            : Array.isArray(response?.data)
            ? response.data
            : []
        );
      } catch (error) {
        console.error(
          "Events API Error:",
          error
        );

        setEvents([]);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);


  // =====================================================
  // FETCH USERS
  // =====================================================

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);

        /*
         * IMPORTANT:
         *
         * Use your existing API service function.
         * Do not directly call:
         *
         * fetch(`${API_BASE}/users/all`)
         *
         */

        const response =
          await getAdminUsers(1, 5);

        console.log(
          "================ USERS ================="
        );

        console.log(
          "RAW USERS RESPONSE:",
          response
        );

        console.log(
          "========================================="
        );


        // Extract users
        const list =
          extractUsers(response);


        console.log(
          "USERS LIST:",
          list
        );


        // Extract total
        const total =
          extractTotal(
            response,
            list.length
          );


        console.log(
          "USERS TOTAL:",
          total
        );


        setUsers(
          list.slice(0, 5)
        );

        setUsersTotal(
          total
        );

      } catch (error) {
        console.error(
          "Users API Error:",
          error
        );

        setUsers([]);

        setUsersTotal(0);

      } finally {
        setLoadingUsers(false);
      }
    };


    fetchUsers();

  }, []);


  // =====================================================
  // FETCH BOOKINGS
  // =====================================================

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoadingBookings(true);


        /*
         * IMPORTANT:
         *
         * Use the existing service function.
         */

        const response =
          await getAllBookings(1, 1);


        console.log(
          "============== BOOKINGS =============="
        );

        console.log(
          "RAW BOOKINGS RESPONSE:",
          response
        );

        console.log(
          "======================================="
        );


        // Extract booking array
        const list =
          extractBookings(response);


        console.log(
          "BOOKINGS LIST:",
          list
        );


        // Extract total
        const total =
          extractTotal(
            response,
            list.length
          );


        console.log(
          "BOOKINGS TOTAL:",
          total
        );


        setBookingsTotal(
          total
        );

      } catch (error) {
        console.error(
          "Bookings API Error:",
          error
        );

        setBookingsTotal(0);

      } finally {
        setLoadingBookings(false);
      }
    };


    fetchBookings();

  }, []);


  // =====================================================
  // FETCH SUBSCRIPTIONS
  // =====================================================

  useEffect(() => {
    const fetchSubscriptions =
      async () => {

        try {
          setLoadingSubs(true);

          const response =
            await adminGetSubscriptions();


          console.log(
            "SUBSCRIPTIONS:",
            response
          );


          let list: any[] = [];


          if (Array.isArray(response)) {
            list = response;
          } else if (
            Array.isArray(response?.data)
          ) {
            list = response.data;
          } else if (
            Array.isArray(
              response?.data?.subscriptions
            )
          ) {
            list =
              response.data.subscriptions;
          } else if (
            Array.isArray(
              response?.subscriptions
            )
          ) {
            list =
              response.subscriptions;
          }


          setSubsTotal(
            list.length
          );

        } catch (error) {
          console.error(
            "Subscriptions API Error:",
            error
          );

          setSubsTotal(0);

        } finally {
          setLoadingSubs(false);
        }
      };


    fetchSubscriptions();

  }, []);


  // =====================================================
  // DERIVED EVENTS
  // =====================================================

  const activeEvents =
    events.filter(
      (event) =>
        event.isActive === true
    );


  /*
   * Duplicate events.
   *
   * This allows the CSS animation
   * to continuously move.
   */

  const scrollEvents =
    events.length > 0
      ? [
          ...events,
          ...events,
        ]
      : [];


  // =====================================================
  // ANIMATION SPEED
  // =====================================================

  const animDuration =
    Math.max(
      events.length * 4,
      20
    );


  // =====================================================
  // CREATE WORKSHOP
  // =====================================================

  const handleCreateWorkshop =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      setCreating(true);

      try {

        await createEvent(
          formData
        );


        setShowModal(false);


        setFormData({
          title: "",
          description: "",
          date: "",
          price: "",
          category: "Technical",
        });


        /*
         * Refresh events
         */

        const response =
          await getAllEvents();


        setEvents(
          Array.isArray(response)
            ? response
            : Array.isArray(response?.data)
            ? response.data
            : []
        );

      } catch (error) {

        console.error(
          "Create Workshop Error:",
          error
        );

        alert(
          "Failed to create workshop."
        );

      } finally {

        setCreating(false);

      }
    };


  // =====================================================
  // ROLE BADGE
  // =====================================================

  function roleBadge(
    role: string
  ) {

    const r =
      (
        role || ""
      ).toLowerCase();


    if (r === "admin") {
      return "bg-purple-100 text-purple-700";
    }


    if (r === "business") {
      return "bg-orange-100 text-orange-700";
    }


    return "bg-blue-100 text-blue-700";
  }


  // =====================================================
  // STAT VALUE
  // =====================================================

  function statVal(
    value: number | null,
    loading: boolean
  ) {

    if (loading) {

      return (
        <Loader2
          className="w-4 h-4 animate-spin text-slate-400"
        />
      );

    }


    if (value === null) {
      return "—";
    }


    return value.toLocaleString(
      "en-IN"
    );
  }


  // =====================================================
  // RENDER
  // =====================================================

  return (
    <>

      {/* =================================================
          CSS SCROLL ANIMATION
      ================================================= */}

      <style>{`

        @keyframes scrollDown {

          0% {
            transform: translateY(0);
          }

          100% {
            transform: translateY(-50%);
          }

        }


        .scroll-track {

          animation:
            scrollDown ${animDuration}s
            linear infinite;

        }


        .scroll-track.paused {

          animation-play-state:
            paused;

        }

      `}</style>


      {/* =================================================
          MAIN PAGE
      ================================================= */}

      <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800 antialiased">


        {/* =================================================
            SIDEBAR
        ================================================= */}

        <Sidebar />


        <div className="flex-1 flex flex-col min-w-0 h-screen max-h-screen overflow-hidden">


          {/* =================================================
              HEADER
          ================================================= */}

          <header className="bg-white border-b border-slate-200/80 px-8 py-3.5 flex items-center justify-between shadow-2xs shrink-0 z-20">

            <div>

              <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">

                Welcome, {firstName}

              </h1>


              <p className="text-[11px] font-bold text-slate-400 mt-0.5">

                Admin Dashboard Overview

              </p>

            </div>


            <div className="flex items-center gap-3">

              {/* <button
                onClick={() =>
                  setShowModal(true)
                }
                className="hidden sm:flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-3.5 py-2 rounded-xl shadow-sm transition-all cursor-pointer"
              >

                <Plus className="w-3.5 h-3.5" />

                New Workshop

              </button> */}


              <DashboardProfileMenu />

            </div>

          </header>


          {/* =================================================
              CONTENT
          ================================================= */}

          <main className="flex-1 overflow-y-auto p-8 space-y-7">


            {/* =================================================
                STAT CARDS
            ================================================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">


              {/* =================================================
                  TOTAL USERS
              ================================================= */}

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between hover:border-blue-200 hover:shadow-sm transition-all">

                <div className="space-y-1">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">

                    Total Users

                  </p>


                  <h2 className="text-2xl font-black text-slate-900 tracking-tight min-h-[32px] flex items-center">

                    {statVal(
                      usersTotal,
                      loadingUsers
                    )}

                  </h2>


                  <p className="text-[11px] font-extrabold text-emerald-600 flex items-center gap-1">

                    <TrendingUp className="w-3 h-3" />

                    All registered members

                  </p>

                </div>


                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">

                  <Users className="w-6 h-6" />

                </div>

              </div>


              {/* =================================================
                  ACTIVE EVENTS
              ================================================= */}

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between hover:border-emerald-200 hover:shadow-sm transition-all">

                <div className="space-y-1">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">

                    Active Events

                  </p>


                  <h2 className="text-2xl font-black text-slate-900 tracking-tight min-h-[32px] flex items-center">

                    {loadingEvents ? (

                      <Loader2
                        className="w-4 h-4 animate-spin text-slate-400"
                      />

                    ) : (

                      activeEvents.length

                    )}

                  </h2>


                  <p className="text-[11px] font-extrabold text-emerald-600 flex items-center gap-1">

                    <TrendingUp className="w-3 h-3" />

                    of {events.length} total events

                  </p>

                </div>


                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">

                  <GraduationCap className="w-6 h-6" />

                </div>

              </div>


              {/* =================================================
                  TOTAL BOOKINGS
              ================================================= */}

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between hover:border-orange-200 hover:shadow-sm transition-all">

                <div className="space-y-1">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">

                    Total Bookings

                  </p>


                  <h2 className="text-2xl font-black text-slate-900 tracking-tight min-h-[32px] flex items-center">

                    {statVal(
                      bookingsTotal,
                      loadingBookings
                    )}

                  </h2>


                  <p className="text-[11px] font-extrabold text-emerald-600 flex items-center gap-1">

                    <TrendingUp className="w-3 h-3" />

                    Event bookings registered

                  </p>

                </div>


                <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">

                  <BookOpen className="w-6 h-6" />

                </div>

              </div>


              {/* =================================================
                  SUBSCRIPTIONS
              ================================================= */}

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between hover:border-purple-200 hover:shadow-sm transition-all">

                <div className="space-y-1">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">

                    Subscriptions

                  </p>


                  <h2 className="text-2xl font-black text-slate-900 tracking-tight min-h-[32px] flex items-center">

                    {statVal(
                      subsTotal,
                      loadingSubs
                    )}

                  </h2>


                  <p className="text-[11px] font-extrabold text-emerald-600 flex items-center gap-1">

                    <TrendingUp className="w-3 h-3" />

                    Active subscription plans

                  </p>

                </div>


                <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20 shrink-0">

                  <CreditCard className="w-6 h-6" />

                </div>

              </div>

            </div>


            {/* =================================================
                MAIN GRID
            ================================================= */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


              {/* =================================================
                  RECENT USERS
              ================================================= */}

              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">


                <div className="flex justify-between items-center">

                  <div>

                    <h2 className="text-base font-extrabold text-slate-900">

                      Recent Users

                    </h2>


                    <p className="text-xs text-slate-400">

                      Latest registered members on the platform

                    </p>

                  </div>


                  <button
                    onClick={() =>
                      navigate(
                        "/admin/users"
                      )
                    }
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                  >

                    View All

                    <ArrowRight className="w-3.5 h-3.5" />

                  </button>

                </div>


                {/* USERS */}

                {loadingUsers ? (

                  <div className="flex items-center justify-center py-10">

                    <Loader2
                      className="w-5 h-5 animate-spin text-blue-500"
                    />

                    <span className="ml-2 text-xs text-slate-400">

                      Loading users…

                    </span>

                  </div>

                ) : users.length === 0 ? (

                  <p className="text-xs text-slate-400 text-center py-8">

                    No users found.

                  </p>

                ) : (

                  <div className="overflow-x-auto">

                    <table className="w-full text-left text-xs border-collapse">

                      <thead>

                        <tr className="bg-slate-50/80 text-[10px] uppercase tracking-wider text-slate-400 font-bold border-y border-slate-100">

                          <th className="p-3">#</th>

                          <th className="p-3">Name</th>

                          <th className="p-3">Email</th>

                          <th className="p-3">Role</th>

                          <th className="p-3">Joined</th>

                        </tr>

                      </thead>


                      <tbody className="divide-y divide-slate-100 font-medium">

                        {users.map(
                          (
                            u: any,
                            idx: number
                          ) => (

                            <tr
                              key={
                                u._id ||
                                idx
                              }
                              onClick={() =>
                                navigate(
                                  "/admin/users"
                                )
                              }
                              className="hover:bg-slate-50/60 transition-all cursor-pointer"
                            >

                              <td className="p-3 font-mono text-slate-400 text-[10px]">

                                {idx + 1}

                              </td>


                              <td className="p-3">

                                <div className="flex items-center gap-2">

                                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-black shrink-0">

                                    {(
                                      u.firstName ||
                                      u.name ||
                                      u.email ||
                                      "U"
                                    )
                                      .charAt(0)
                                      .toUpperCase()}

                                  </div>


                                  <span className="font-semibold text-slate-800">

                                    {u.firstName &&
                                    u.lastName
                                      ? `${u.firstName} ${u.lastName}`
                                      : u.name ||
                                        u.fullName ||
                                        "—"}

                                  </span>

                                </div>

                              </td>


                              <td className="p-3 text-slate-500 truncate max-w-[160px]">

                                {u.email ||
                                  "—"}

                              </td>


                              <td className="p-3">

                                <span
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold capitalize ${roleBadge(
                                    u.role
                                  )}`}
                                >

                                  {u.role ||
                                    "student"}

                                </span>

                              </td>


                              <td className="p-3 text-slate-400">

                                {u.createdAt
                                  ? new Date(
                                      u.createdAt
                                    ).toLocaleDateString(
                                      "en-IN",
                                      {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                      }
                                    )
                                  : "—"}

                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                )}


                <div className="pt-2 border-t border-slate-100 flex justify-end">

                  <button
                    onClick={() =>
                      navigate(
                        "/admin/users"
                      )
                    }
                    className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                  >

                    See all{" "}

                    {usersTotal !== null
                      ? `${usersTotal.toLocaleString(
                          "en-IN"
                        )} users`
                      : "users"}

                    <ArrowRight className="w-3.5 h-3.5" />

                  </button>

                </div>

              </div>


              {/* =================================================
                  UPCOMING WORKSHOPS
              ================================================= */}

              <div
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col"
                style={{
                  height: 460,
                }}
              >


                {/* HEADER */}

                <div className="px-5 pt-5 pb-3 border-b border-slate-100 shrink-0">

                  <div className="flex items-center gap-2 mb-0.5">

                    <span className="relative flex h-2 w-2 shrink-0">

                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />

                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />

                    </span>


                    <h2 className="text-sm font-extrabold text-slate-900">

                      Upcoming Live Workshops

                    </h2>


                    {!loadingEvents && (

                      <span className="ml-auto text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full shrink-0">

                        {events.length} events

                      </span>

                    )}

                  </div>


                  <p className="text-[10px] text-slate-400 font-semibold">

                    Hover to pause · Auto-scrolling

                  </p>

                </div>


                {/* VIEWPORT */}

                <div className="relative flex-1 overflow-hidden">


                  {/* TOP FADE */}

                  <div
                    className="absolute top-0 left-0 right-0 h-6 z-10 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(to bottom, #fff 0%, transparent 100%)",
                    }}
                  />


                  {/* BOTTOM FADE */}

                  <div
                    className="absolute bottom-0 left-0 right-0 h-6 z-10 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(to top, #fff 0%, transparent 100%)",
                    }}
                  />


                  {loadingEvents ? (

                    <div className="flex items-center justify-center h-full">

                      <Loader2
                        className="w-5 h-5 animate-spin text-blue-400"
                      />

                    </div>

                  ) : events.length === 0 ? (

                    <p className="text-xs text-slate-400 text-center py-10">

                      No events found.

                    </p>

                  ) : (

                    <div
                      className={`scroll-track ${
                        paused
                          ? "paused"
                          : ""
                      }`}
                      onMouseEnter={() =>
                        setPaused(true)
                      }
                      onMouseLeave={() =>
                        setPaused(false)
                      }
                    >

                      {scrollEvents.map(
                        (
                          w: any,
                          idx: number
                        ) => (

                          <div
                            key={`${w._id || idx}-${idx}`}
                            className="mx-4 my-2 p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-slate-200 hover:shadow-xs transition-all cursor-pointer space-y-2.5"
                          >


                            {/* TOP */}

                            <div className="flex items-start gap-2.5">

                              <div
                                className={`p-1.5 rounded-xl shrink-0 ${
                                  w.type ===
                                  "BUSINESS"
                                    ? "bg-orange-50 text-orange-500"
                                    : "bg-blue-50 text-blue-600"
                                }`}
                              >

                                <Calendar className="w-3.5 h-3.5" />

                              </div>


                              <div className="min-w-0 flex-1">

                                <h3 className="font-extrabold text-slate-900 text-[11px] leading-tight line-clamp-2">

                                  {w.title ||
                                    "Untitled Workshop"}

                                </h3>


                                <div className="flex flex-wrap items-center gap-2 mt-1">

                                  <span className="flex items-center gap-0.5 text-[10px] text-slate-400 font-semibold">

                                    <Calendar className="w-2.5 h-2.5" />

                                    {formatEventDate(
                                      w.date
                                    )}

                                  </span>


                                  {w.location && (

                                    <span className="flex items-center gap-0.5 text-[10px] text-slate-400 font-semibold">

                                      <MapPin className="w-2.5 h-2.5" />

                                      {w.location}

                                    </span>

                                  )}

                                </div>

                              </div>

                            </div>


                            {/* BOTTOM */}

                            <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">

                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                  w.price &&
                                  Number(
                                    w.price
                                  ) > 0
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-emerald-100 text-emerald-700"
                                }`}
                              >

                                {w.price &&
                                Number(
                                  w.price
                                ) > 0
                                  ? `₹${Number(
                                      w.price
                                    ).toLocaleString(
                                      "en-IN"
                                    )}`
                                  : "Free"}

                              </span>


                              <div className="flex items-center gap-1.5">

                                {w.isActive ? (

                                  <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600">

                                    <CheckCircle2 className="w-3 h-3" />

                                    Active

                                  </span>

                                ) : (

                                  <span className="flex items-center gap-0.5 text-[10px] font-bold text-slate-400">

                                    <Clock3 className="w-3 h-3" />

                                    Upcoming

                                  </span>

                                )}


                                <button
                                  onClick={(
                                    e
                                  ) => {

                                    e.stopPropagation();

                                    navigate(
                                      "/admin/events"
                                    );

                                  }}
                                  className="text-blue-600 hover:text-blue-700 font-bold text-[10px] cursor-pointer ml-1"
                                >

                                  Manage →

                                </button>

                              </div>

                            </div>

                          </div>

                        )
                      )}

                    </div>

                  )}

                </div>

              </div>

            </div>

          </main>

        </div>

      </div>


      {/* =================================================
          CREATE WORKSHOP MODAL
      ================================================= */}

      {showModal && (

        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-slate-100">


            <div className="flex justify-between items-center border-b pb-3">

              <h3 className="font-extrabold text-slate-900 text-base">

                Add New Live Workshop

              </h3>


              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >

                <X className="w-5 h-5" />

              </button>

            </div>


            <form
              onSubmit={
                handleCreateWorkshop
              }
              className="space-y-3 text-xs"
            >


              {/* TITLE */}

              <div>

                <label className="font-bold text-slate-700 block mb-1">

                  Workshop Title

                </label>


                <input
                  type="text"
                  required
                  placeholder="e.g. AI-Powered Full Stack Bootcamp"
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-blue-600"
                  value={
                    formData.title
                  }
                  onChange={(
                    e
                  ) =>
                    setFormData({
                      ...formData,
                      title:
                        e.target.value,
                    })
                  }
                />

              </div>


              {/* DATE + PRICE */}

              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label className="font-bold text-slate-700 block mb-1">

                    Date

                  </label>


                  <input
                    type="date"
                    required
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-blue-600"
                    value={
                      formData.date
                    }
                    onChange={(
                      e
                    ) =>
                      setFormData({
                        ...formData,
                        date:
                          e.target.value,
                      })
                    }
                  />

                </div>


                <div>

                  <label className="font-bold text-slate-700 block mb-1">

                    Price (₹)

                  </label>


                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 1499"
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-blue-600"
                    value={
                      formData.price
                    }
                    onChange={(
                      e
                    ) =>
                      setFormData({
                        ...formData,
                        price:
                          e.target.value,
                      })
                    }
                  />

                </div>

              </div>


              {/* DESCRIPTION */}

              <div>

                <label className="font-bold text-slate-700 block mb-1">

                  Description

                </label>


                <textarea
                  rows={3}
                  placeholder="Enter short workshop details..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-blue-600 resize-none"
                  value={
                    formData.description
                  }
                  onChange={(
                    e
                  ) =>
                    setFormData({
                      ...formData,
                      description:
                        e.target.value,
                    })
                  }
                />

              </div>


              {/* BUTTONS */}

              <div className="pt-2 flex gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  disabled={creating}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer disabled:opacity-50"
                >

                  Cancel

                </button>


                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >

                  {creating ? (

                    <>

                      <Loader2 className="w-3.5 h-3.5 animate-spin" />

                      Publishing…

                    </>

                  ) : (

                    "Publish Workshop"

                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </>
  );
}