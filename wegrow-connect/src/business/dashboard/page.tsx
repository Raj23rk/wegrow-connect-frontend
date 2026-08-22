import React, { useEffect, useRef, useState } from "react";
import BusinessSidebar from "../../components/BusinessSidebar";
import DashboardProfileMenu, { useDashboardUser } from "../../components/DashboardProfileMenu";
import { getBusinessSubscriptions } from "../../services/api";
import { openRazorpaySubscriptionCheckout } from "../../services/razorpay";
import {
  BookOpen,
  CalendarDays,
  ShieldCheck,
  ArrowRight,
  MapPin,
  IndianRupee,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock3,
  X,
  Zap,
  TrendingUp,
  Briefcase,
  Building2,
} from "lucide-react";

// ─── API CONFIG ──────────────────────────────────────────
const API_BASE = "https://wegrow-connect-backend-1.onrender.com/api/v1";

function getToken() {
  return sessionStorage.getItem("accessToken") || "";
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
      <CheckCircle2 className="w-3 h-3" /> Active Pro
    </span>
  );
}

// ─── Compact Event Card ──────────────────────────────────
function EventCard({ event, index }: { event: EventItem; index: number }) {
  const isToday = event.date
    ? new Date(event.date).toDateString() === new Date().toDateString()
    : false;

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
          ? "bg-gradient-to-br from-teal-50 to-emerald-50/60 border-teal-200 shadow-sm shadow-teal-100"
          : "bg-white/70 border-slate-200 hover:border-teal-200 hover:shadow-sm"
      }`}
    >
      {isNew && (
        <span
          className="absolute -top-2 -right-1.5 text-[9px] font-black tracking-widest uppercase
            bg-gradient-to-r from-orange-500 to-amber-400 text-white
            px-1.5 py-0.5 rounded-full shadow-md animate-pulse z-10"
        >
          NEW
        </span>
      )}

      <div className="flex items-center justify-between mb-2">
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
            isToday
              ? "bg-teal-600 text-white shadow-sm"
              : "bg-teal-50 text-teal-700 border border-teal-100"
          }`}
        >
          {isToday ? "🔴 TODAY" : formattedDate}
        </span>
        {formattedTime && (
          <span className="text-[10px] font-semibold text-slate-400">{formattedTime}</span>
        )}
      </div>

      <h4 className="font-bold text-xs text-slate-800 leading-snug group-hover:text-teal-700 transition-colors">
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
export default function BusinessDashboard() {
  const { firstName, user } = useDashboardUser();

  const [bookingCount, setBookingCount] = useState<number | null>(null);
  const [eventCount, setEventCount] = useState<number | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>("");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  // ─── Subscription / Upgrade Modal ───────────────────────
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [businessPlans, setBusinessPlans] = useState<any[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const { ref: scrollRef, pause, resume } = useAutoScroll(0.5);

  const currentUser = (() => {
    try {
      const raw = sessionStorage.getItem("user");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  })();

  // Fetch bookings count
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

  // Load business plans when modal opens
  useEffect(() => {
    if (!showSubscribeModal) return;
    setPlansLoading(true);
    getBusinessSubscriptions()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBusinessPlans(data);
        } else {
          setBusinessPlans([
            {
              id: "starter",
              name: "Starter Founder",
              type: "BUSINESS",
              desc: "For early-stage entrepreneurs exploring market validation.",
              monthlyPrice: "₹0",
              yearlyPrice: "₹0",
              price: 0,
              popular: false,
              features: [
                "Business Model Canvas Tool",
                "Community Access",
                "Basic Roadmap Tracker",
                "1 Pitch Deck Review / month"
              ],
              buttonText: "Current Free Plan",
            },
            {
              id: "pro",
              name: "Pro Growth Pass",
              type: "BUSINESS",
              desc: "For growing startups seeking investor pitch deck access & mentors.",
              monthlyPrice: "₹1,499",
              yearlyPrice: "₹1,199",
              price: 1199,
              period: "/ month",
              popular: true,
              features: [
                "All Starter Features",
                "Unlimited Investor Pitch Downloads",
                "2 One-on-One Legal/Mentor Sessions",
                "Real-Time Business Analytics Dashboard",
                "Priority Statutory Compliance Alerts"
              ],
              buttonText: "Upgrade to Pro Pass",
            },
          ]);
        }
      })
      .finally(() => setPlansLoading(false));
  }, [showSubscribeModal]);

  // Razorpay checkout handler for business
  const handleBusinessSubscribe = (plan: any) => {
    if (plan.price === 0) return;
    setCheckoutLoading(plan.id);
    openRazorpaySubscriptionCheckout({
      plan: { ...plan, type: "BUSINESS" },
      user: currentUser,
      onSuccess: (result: any) => {
        console.log("Business subscription payment success:", result);
        setSubscriptionStatus("active");
        setShowSubscribeModal(false);
        alert(`🎉 You are now subscribed to "${plan.name}"! Enjoy your WeGrow Business Pro access.`);
        setCheckoutLoading(null);
      },
      onError: (err: any) => {
        console.error("Business subscription payment failed:", err);
        setCheckoutLoading(null);
      },
    });
  };

  const safeEvents: EventItem[] = Array.isArray(events) ? events : [];
  const doubledEvents = [...safeEvents, ...safeEvents];

  return (
    <div className="flex min-h-screen bg-slate-50/60 font-sans text-slate-800 antialiased">
      {/* Business Sidebar */}
      <BusinessSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-screen max-h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200/80 px-8 py-3.5 flex items-center justify-between shadow-2xs shrink-0 w-full z-20">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Welcome, {firstName} <Building2 className="w-5 h-5 text-teal-600" />
            </h1>
            <p className="text-[11px] font-bold text-slate-400 mt-0.5">
              Business Portal · Incubator & Growth Dashboard
            </p>
          </div>
          <DashboardProfileMenu />
        </header>

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: My Business Bookings */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between hover:border-[#147A87]/40 transition-all">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Business Bookings
                </p>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {bookingCount === null ? (
                    <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                  ) : (
                    bookingCount
                  )}
                </h2>
                <p className="text-[11px] font-extrabold text-[#147A87]">Masterclasses registered</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#147A87]/10 text-[#147A87] flex items-center justify-center font-bold">
                <CalendarDays className="w-6 h-6" />
              </div>
            </div>

            {/* Card 2: Active Events & Masterclasses */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between hover:border-emerald-200 transition-all">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Active Masterclasses
                </p>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {eventCount === null ? (
                    <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                  ) : (
                    eventCount
                  )}
                </h2>
                <p className="text-[11px] font-extrabold text-emerald-600">Available live sessions</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>

            {/* Card 3: Pitch & Roadmap Status */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between hover:border-purple-200 transition-all">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Growth & Roadmap
                </p>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active</h2>
                <p className="text-[11px] font-extrabold text-purple-600">Incubator track</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Briefcase className="w-6 h-6" />
              </div>
            </div>

            {/* Card 4: Subscription Status */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between hover:border-amber-200 transition-all relative">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Subscription Status
                </p>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight capitalize">
                  {subscriptionStatus || "Free Tier"}
                </h2>
                <SubscribeBadge status={subscriptionStatus} />
              </div>
              <div
                onClick={() => setShowSubscribeModal(true)}
                className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold cursor-pointer hover:scale-105 transition-all shadow-xs"
                title="Upgrade Business Plan"
              >
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Banner trigger to upgrade */}
          {subscriptionStatus !== "active" && (
            <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 rounded-2xl p-4 px-6 text-white flex items-center justify-between shadow-lg border border-teal-800/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm">Upgrade to Business Pro Pass</h3>
                  <p className="text-xs text-slate-300">Unlock investor pitch decks, 1-on-1 legal advice & priority support.</p>
                </div>
              </div>
              <button
                onClick={() => setShowSubscribeModal(true)}
                className="bg-teal-500 hover:bg-teal-400 active:scale-95 transition-all text-white px-4 py-2 rounded-xl text-xs font-black shadow-md cursor-pointer shrink-0"
              >
                Upgrade Now →
              </button>
            </div>
          )}

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Live Workshops & Masterclasses */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">Upcoming Masterclasses</h2>
                  <p className="text-xs text-slate-400">Live investor pitch sessions & startup bootcamps</p>
                </div>
                <a
                  href="/business/workshops"
                  className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
                >
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {eventsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
                  <span className="ml-2 text-xs text-slate-400">Loading masterclasses…</span>
                </div>
              ) : safeEvents.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-10">No upcoming masterclasses found.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {safeEvents.slice(0, 4).map((event, idx) => (
                    <EventCard key={event._id || idx} event={event} index={idx} />
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Auto-Scrolling Events Feed */}
            <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col h-[420px]">
              <div className="flex items-center justify-between mb-3 shrink-0">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">Live Events Feed</h2>
                  <p className="text-xs text-slate-400">Auto-scrolling platform updates</p>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>

              <div
                ref={scrollRef}
                onMouseEnter={pause}
                onMouseLeave={resume}
                className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-none"
              >
                {doubledEvents.map((ev, idx) => (
                  <div
                    key={`${ev._id}-${idx}`}
                    className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-teal-200 transition-all text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-700">
                        {ev.type || "MASTERCLASS"}
                      </span>
                      {ev.date && (
                        <span className="text-[10px] text-slate-400">
                          {new Date(ev.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-slate-800 truncate">{ev.title}</p>
                    {ev.location && (
                      <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5" /> {ev.location}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Subscription Modal */}
      {showSubscribeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl shadow-2xl space-y-6 border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-teal-600" />
                  Upgrade Business Subscription
                </h3>
                <p className="text-xs text-slate-400">Select a business plan to power your startup growth.</p>
              </div>
              <button
                onClick={() => setShowSubscribeModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {plansLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {businessPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-black text-slate-900 text-base">{plan.name}</h4>
                        <span className="text-xs font-black text-teal-600">
                          {plan.price === 0 ? "Free" : `₹${plan.price}/mo`}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-3">{plan.desc || plan.description}</p>
                      <div className="space-y-1.5 text-xs text-slate-600">
                        {(plan.features || []).map((feat: string, i: number) => (
                          <p key={i} className="flex items-center gap-2 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            {feat}
                          </p>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleBusinessSubscribe(plan)}
                      disabled={plan.price === 0 || checkoutLoading === plan.id}
                      className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                    >
                      {checkoutLoading === plan.id
                        ? "Opening Checkout..."
                        : plan.price === 0
                        ? "Current Free Plan"
                        : `Subscribe for ₹${plan.price}`}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}