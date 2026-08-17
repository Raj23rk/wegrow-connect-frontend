import React, { useEffect, useRef, useState } from "react";
import StudentSidebar from "../../components/StudentSidebar";
import DashboardProfileMenu, { useDashboardUser } from "../../components/DashboardProfileMenu";
import {
  BookOpen,
  CalendarDays,
  Award,
  ShieldCheck,
  PlayCircle,
  ArrowRight,
  MapPin,
  IndianRupee,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";

// ─── API ────────────────────────────────────────────────
const API_BASE = "http://13.239.234.181:4000/api/v1";

function getToken() {
  // return localStorage.getItem("accessToken") || localStorage.getItem("token") || "";
   return sessionStorage.getItem(
      "accessToken"
    );
}

function authHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

// ─── Types ──────────────────────────────────────────────
interface EventItem {
  _id: string;
  title: string;
  description?: string;
  type?: string;
  image?: string;
  location?: string;
  date?: string;
  price?: number;
  isActive?: boolean;
}

// ─── Auto-scroll hook ───────────────────────────────────
function useAutoScroll(speed = 0.5) {
  const ref = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function step() {
      if (!pausedRef.current && el) {
        el.scrollTop += speed;
        if (el.scrollTop >= el.scrollHeight / 2) {
          el.scrollTop = 0;
        }
      }
      animRef.current = requestAnimationFrame(step);
    }

    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, [speed]);

  const pause = () => { pausedRef.current = true; };
  const resume = () => { pausedRef.current = false; };

  return { ref, pause, resume };
}

// ─── Subscribe status badge ─────────────────────────────
function SubscribeBadge({ status }: { status: string }) {
  if (!status || status === "inactive" || status === "expired") {
    return (
      <span className="text-[10px] font-bold text-red-500 mt-1 inline-flex items-center gap-1">
        <XCircle className="w-3 h-3" /> Not Subscribed
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="text-[10px] font-bold text-amber-500 mt-1 inline-flex items-center gap-1">
        <Clock3 className="w-3 h-3" /> Pending
      </span>
    );
  }
  return (
    <span className="text-[10px] font-bold text-emerald-600 mt-1 inline-flex items-center gap-1">
      <CheckCircle2 className="w-3 h-3" /> Active
    </span>
  );
}

// ─── Compact Event Card ──────────────────────────────────
function EventCard({ event, index }: { event: EventItem; index: number }) {
  const isToday = event.date
    ? new Date(event.date).toDateString() === new Date().toDateString()
    : false;

  // Cards 0-2 get NEW badge (newest listings)
  const isNew = index < 3;

  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      })
    : "TBD";

  const formattedTime = event.date
    ? new Date(event.date).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div
      className={`relative p-3.5 rounded-xl border transition-all group ${
        isToday
          ? "bg-gradient-to-br from-blue-50 to-indigo-50/60 border-blue-200 shadow-sm shadow-blue-100"
          : "bg-white/70 border-slate-200 hover:border-indigo-200 hover:shadow-sm"
      }`}
    >
      {/* NEW blinking badge */}
      {isNew && (
        <span
          className="absolute -top-2 -right-1.5 text-[9px] font-black tracking-widest uppercase
            bg-gradient-to-r from-rose-500 to-orange-400 text-white
            px-1.5 py-0.5 rounded-full shadow-md animate-pulse z-10"
        >
          NEW
        </span>
      )}

      <div className="flex items-center justify-between mb-2">
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
            isToday
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-indigo-50 text-indigo-700 border border-indigo-100"
          }`}
        >
          {isToday ? "🔴 TODAY" : formattedDate}
        </span>
        {formattedTime && (
          <span className="text-[10px] font-semibold text-slate-400">{formattedTime}</span>
        )}
      </div>

      <h4 className="font-bold text-xs text-slate-800 leading-snug group-hover:text-indigo-700 transition-colors">
        {event.title}
      </h4>

      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
        {event.location && (
          <p className="text-[10px] text-slate-400 flex items-center gap-1">
            <MapPin className="w-2.5 h-2.5 shrink-0" />
            {event.location}
          </p>
        )}
        {event.price !== undefined && (
          <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
            <IndianRupee className="w-2.5 h-2.5 shrink-0" />
            {event.price === 0 ? "Free" : `₹${event.price}`}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────
export default function StudentDashboard() {
  const { firstName, user } = useDashboardUser();

  const [bookingCount, setBookingCount] = useState<number | null>(null);
  const [eventCount, setEventCount] = useState<number | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>("");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  const { ref: scrollRef, pause, resume } = useAutoScroll(0.5);

  // Fetch booking count
  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch(`${API_BASE}/bookings/my-bookings?page=1&limit=1`, {
          headers: authHeaders(),
        });
        const data = await res.json();
        const total =
          data?.data?.pagination?.total ??
          data?.data?.bookings?.length ??
          0;
        setBookingCount(total);
      } catch {
        setBookingCount(0);
      }
    }
    fetchBookings();
  }, []);

  // Fetch events count + list
  useEffect(() => {
    async function fetchEvents() {
      try {
        setEventsLoading(true);
        const res = await fetch(
          `${API_BASE}/events/all-event?page=1&limit=50`,
          { headers: authHeaders() }
        );
        const data = await res.json();
        // Response shape: { success, data: { events: [...] } }
        const list: EventItem[] = Array.isArray(data?.data?.events)
          ? data.data.events
          : Array.isArray(data?.data)
          ? data.data
          : [];
        setEvents(list);
        setEventCount(list.length);
      } catch {
        setEvents([]);
        setEventCount(0);
      } finally {
        setEventsLoading(false);
      }
    }
    fetchEvents();
  }, []);

  // Resolve subscription status from user object
  useEffect(() => {
    const anyUser = user as any;
    const status =
      anyUser?.subscriptionStatus ||
      anyUser?.subscription?.status ||
      anyUser?.plan ||
      "";
    setSubscriptionStatus(typeof status === "string" ? status.toLowerCase() : "");
  }, [user]);

  // Duplicate events for seamless infinite scroll (guard against non-array)
  const safeEvents: EventItem[] = Array.isArray(events) ? events : [];
  const doubledEvents = [...safeEvents, ...safeEvents];

  return (
    <div className="flex min-h-screen bg-slate-50/60 font-sans text-slate-800 antialiased">
      <StudentSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-screen max-h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200/80 px-8 py-3.5 flex items-center justify-between shadow-2xs shrink-0 w-full z-20">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Welcome, {firstName}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <DashboardProfileMenu />
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8 space-y-8">

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Card 1 – My Bookings */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  My Bookings
                </span>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  {bookingCount === null ? (
                    <Loader2 className="w-5 h-5 animate-spin text-slate-400 inline" />
                  ) : (
                    `${bookingCount} Booked`
                  )}
                </p>
                <span className="text-[10px] font-bold text-emerald-600 mt-1 inline-block">
                  Events Registered
                </span>
              </div>
              <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>

            {/* Card 2 – Available Events */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Available Events
                </span>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  {eventCount === null ? (
                    <Loader2 className="w-5 h-5 animate-spin text-slate-400 inline" />
                  ) : (
                    `${eventCount} Events`
                  )}
                </p>
                <span className="text-[10px] font-bold text-blue-600 mt-1 inline-block">
                  Open for Registration
                </span>
              </div>
              <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <CalendarDays className="w-5 h-5" />
              </div>
            </div>

            {/* Card 3 – Certificates Earned */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Certificates Earned
                </span>
                <p className="text-2xl font-black text-slate-900 mt-1">3 Verified</p>
                <span className="text-[10px] font-bold text-amber-600 mt-1 inline-block">
                  1 Pending Exam
                </span>
              </div>
              <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
            </div>

            {/* Card 4 – Subscribe Status */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Subscribe Status
                </span>
                <p className="text-2xl font-black text-slate-900 mt-1 capitalize">
                  {subscriptionStatus
                    ? subscriptionStatus.charAt(0).toUpperCase() + subscriptionStatus.slice(1)
                    : "Free"}
                </p>
                <SubscribeBadge status={subscriptionStatus} />
              </div>
              <div className="w-11 h-11 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>

          </div>

          {/* Content Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Continue Learning */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-extrabold text-slate-900 text-sm">Continue Learning</h2>
                  <button className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                    View All <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      title: "Full Stack Web Development (Next.js & React)",
                      progress: 75,
                      module: "Module 4: App Router & API Routes",
                    },
                    {
                      title: "Data Analytics & Python Essentials",
                      progress: 40,
                      module: "Module 2: Pandas Dataframes",
                    },
                    {
                      title: "Deep Learning & Facial Recognition Systems",
                      progress: 90,
                      module: "Final Project Submission",
                    },
                  ].map((course, i) => (
                    <div
                      key={i}
                      className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <h3 className="font-bold text-xs text-slate-900">{course.title}</h3>
                        <p className="text-[11px] text-slate-500">{course.module}</p>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                        <span className="text-[10px] font-bold text-slate-400">
                          {course.progress}% Completed
                        </span>
                        <button className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all">
                          <PlayCircle className="w-3.5 h-3.5 text-blue-400" /> Resume
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upcoming Events – Auto-scroll panel */}
            <div className="space-y-4">
              <div
                className="rounded-2xl overflow-hidden flex flex-col relative border border-indigo-100 shadow-sm"
                style={{ maxHeight: 440, background: "linear-gradient(160deg, #f8f9ff 0%, #eef0ff 50%, #f3f4ff 100%)" }}
              >
                {/* Soft decorative blurred blobs */}
                <div className="absolute top-[-20px] right-[-20px] w-32 h-32 rounded-full z-0"
                  style={{ background: "rgba(165,180,252,0.25)", filter: "blur(24px)" }} />
                <div className="absolute bottom-[-10px] left-[-10px] w-24 h-24 rounded-full z-0"
                  style={{ background: "rgba(196,181,253,0.2)", filter: "blur(20px)" }} />
                <div className="absolute top-[45%] right-[10%] w-16 h-16 rounded-full z-0"
                  style={{ background: "rgba(167,243,208,0.2)", filter: "blur(16px)" }} />

                {/* Panel header */}
                <div className="relative z-10 px-5 pt-5 pb-3 shrink-0 border-b border-indigo-100/70">
                  <div className="flex items-center gap-2">
                    {/* Live pulsing dot */}
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                    </span>
                    <h2 className="font-extrabold text-slate-800 text-sm tracking-tight">Upcoming Events</h2>
                    {eventCount !== null && (
                      <span className="ml-auto text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                        {eventCount} live
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-indigo-400 mt-1">Hover to pause scroll</p>
                </div>

                {/* Auto-scrolling list with fade edges */}
                <div className="relative z-10 flex-1">
                  {/* Top fade */}
                  <div className="absolute top-0 left-0 right-0 h-5 z-20 pointer-events-none"
                    style={{ background: "linear-gradient(to bottom, #eef0ff 0%, transparent 100%)" }} />
                  {/* Bottom fade */}
                  <div className="absolute bottom-0 left-0 right-0 h-5 z-20 pointer-events-none"
                    style={{ background: "linear-gradient(to top, #f3f4ff 0%, transparent 100%)" }} />

                  <div
                    ref={scrollRef}
                    onMouseEnter={pause}
                    onMouseLeave={resume}
                    className="px-4 py-3"
                    style={{ overflowY: "hidden", maxHeight: 360 }}
                  >
                    {eventsLoading ? (
                      <div className="flex items-center justify-center py-10">
                        <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
                      </div>
                    ) : safeEvents.length === 0 ? (
                      <p className="text-[11px] text-slate-400 text-center py-8">
                        No events available right now.
                      </p>
                    ) : (
                      <div className="space-y-3 pt-2 pb-2">
                        {doubledEvents.map((event, idx) => (
                          <EventCard
                            key={`${event._id}-${idx}`}
                            event={event}
                            index={idx % safeEvents.length}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}


