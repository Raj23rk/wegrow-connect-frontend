import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// ─── Constants ──────────────────────────────────────────
const API_BASE_URL = "https://wegrow-connect-backend-1.onrender.com/api/v1";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80";

// ─── Helpers ─────────────────────────────────────────────
function getToken() {
  // Auth uses sessionStorage — NEVER localStorage
  return sessionStorage.getItem("accessToken");
}

function authHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function formatDate(date) {
  if (!date) return "TBA";
  return new Date(date).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatTime(date) {
  if (!date) return "";
  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

// ─── Type Badge Colors ───────────────────────────────────
function typeBadge(type) {
  if (!type) return "bg-blue-100 text-blue-700";
  const t = type.toUpperCase();
  if (t === "BUSINESS") return "bg-orange-100 text-orange-600";
  if (t === "WORKSHOP") return "bg-purple-100 text-purple-600";
  if (t === "STUDENT")  return "bg-teal-100 text-teal-600";
  return "bg-blue-100 text-blue-700";
}

// ─── Main Component ──────────────────────────────────────
export default function EventDetails() {
  const navigate  = useNavigate();
  const { eventId } = useParams();

  const [event,            setEvent]            = useState(null);
  const [loading,          setLoading]          = useState(true);
  const [error,            setError]            = useState("");
  const [booking,          setBooking]          = useState(false);
  const [showSuccess,      setShowSuccess]      = useState(false);
  const [bookingResult,    setBookingResult]    = useState(null);
  const [alreadyBooked,    setAlreadyBooked]    = useState(false);

  // =====================================================
  // FETCH EVENT
  // =====================================================
  useEffect(() => {
    if (!eventId) return;

    async function fetchEvent() {
      try {
        setLoading(true);
        setError("");

        const res  = await fetch(`${API_BASE_URL}/events/${eventId}`, {
          headers: authHeaders(),
        });
        const json = await res.json();

        console.log("[EventDetails] fetch:", res.status, json);

        if (!res.ok) throw new Error(json?.message || "Failed to load event");

        if (json?.success && json?.data) {
          setEvent(json.data);
        } else {
          setError("Event not found.");
        }
      } catch (err) {
        console.error("[EventDetails] error:", err);
        setError(err?.message || "Unable to load event details.");
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [eventId]);

  // =====================================================
  // BOOK NOW
  // =====================================================
  const handleBookNow = async () => {
    const token = getToken();

    if (!token) {
      alert("Please login to book this event.");
      navigate("/home/login");
      return;
    }

    if (!event?._id) {
      alert("Event information is missing.");
      return;
    }

    if (booking || alreadyBooked) return;

    try {
      setBooking(true);

      console.log("[BookNow] event:", event._id);

      const res = await fetch(`${API_BASE_URL}/bookings/create-booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ event: event._id }),
      });

      const json = await res.json();
      console.log("[BookNow] response:", res.status, json);

      // ── Already booked ───────────────────────────────
      if (
        res.status === 409 ||
        (json?.message || "").toLowerCase().includes("already")
      ) {
        setAlreadyBooked(true);
        alert("You have already booked this event!");
        return;
      }

      // ── Session expired ──────────────────────────────
      if (res.status === 401 || res.status === 403) {
        sessionStorage.removeItem("accessToken");
        alert("Your session expired. Please login again.");
        navigate("/home/login");
        return;
      }

      // ── Success ──────────────────────────────────────
      if (res.ok && json?.success) {
        setBookingResult(json?.data || {});
        setAlreadyBooked(true);
        setShowSuccess(true);
        return;
      }

      // ── Other API error ──────────────────────────────
      alert(json?.message || json?.error || "Unable to create booking.");

    } catch (err) {
      console.error("[BookNow] error:", err);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setBooking(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================
  if (loading) {
    return (
      <div className="fixed inset-0 z-40 bg-white flex flex-col items-center justify-center gap-4">
        <div className="w-14 h-14 rounded-full border-4 border-blue-100 border-t-[#104288] animate-spin" />
        <p className="text-sm font-bold text-slate-500 tracking-wide">Loading event details…</p>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================
  if (error || !event) {
    return (
      <div className="fixed inset-0 z-40 bg-slate-50 flex items-center justify-center px-5">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 p-10 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-black text-slate-900 mb-2">Event Not Found</h2>
          <p className="text-sm text-red-500 font-semibold mb-7">
            {error || "This event could not be found."}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-[#104288] hover:bg-[#f97316] text-white font-black py-3 rounded-2xl transition-all"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // HELPERS
  // =====================================================
  const isFree    = !event.price || Number(event.price) === 0;
  const eventType = (event.type || "SESSION").toUpperCase();

  // =====================================================
  // RENDER
  // =====================================================
  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-50 overflow-y-auto overflow-x-hidden">
        <div className="w-full min-h-screen">

          {/* ─── HERO BANNER ──────────────────────────────── */}
          <div className="relative w-full h-[280px] sm:h-[360px] md:h-[420px] bg-slate-900 overflow-hidden">

            {/* Background image */}
            <img
              src={event.image || FALLBACK_IMAGE}
              alt={event.title || "Event"}
              className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
              onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

            {/* Back button */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="absolute top-5 left-5 z-10 flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-black px-4 py-2 rounded-full transition-all"
            >
              ← Back
            </button>

            {/* Bottom text overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10">
              {/* Type + Active badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${typeBadge(event.type)}`}>
                  {eventType}
                </span>
                {event.isActive && (
                  <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/15 border border-emerald-400/30 px-3 py-1 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block animate-pulse" />
                    Live Now
                  </span>
                )}
                {isFree && (
                  <span className="text-[10px] font-black text-yellow-300 bg-yellow-300/15 border border-yellow-300/30 px-3 py-1 rounded-full">
                    FREE EVENT
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight max-w-3xl drop-shadow-lg">
                {event.title}
              </h1>
            </div>
          </div>

          {/* ─── MAIN CONTENT ─────────────────────────────── */}
          <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* ─── LEFT COLUMN ────────────────────────────── */}
              <div className="lg:col-span-2 space-y-6">

                {/* Description card */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-3">
                    About This Event
                  </h2>
                  <p className="text-sm text-slate-600 leading-7 font-medium">
                    {event.description || "No description provided for this event."}
                  </p>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">

                  {/* Venue */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                      📍 Venue
                    </p>
                    <p className="text-sm font-black text-slate-900">
                      {event.location || "Online / Virtual"}
                    </p>
                  </div>

                  {/* Date */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                      📅 Date
                    </p>
                    <p className="text-sm font-black text-slate-900">
                      {formatDate(event.date)}
                    </p>
                    {event.date && (
                      <p className="text-xs text-slate-400 mt-0.5 font-semibold">
                        {formatTime(event.date)}
                      </p>
                    )}
                  </div>

                  {/* Session type */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                      🏷️ Session Type
                    </p>
                    <span className={`text-xs font-black px-2.5 py-1 rounded-full ${typeBadge(event.type)}`}>
                      {eventType}
                    </span>
                  </div>

                  {/* Workshop fee */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-5">
                    <p className="text-[10px] font-black uppercase text-blue-400 tracking-wider mb-1.5">
                      💳 Workshop Fee
                    </p>
                    <p className="text-2xl font-black text-[#104288]">
                      {isFree ? "FREE" : `₹${Number(event.price).toLocaleString("en-IN")}`}
                    </p>
                    {isFree && (
                      <p className="text-[10px] text-blue-400 font-bold mt-0.5">No charge</p>
                    )}
                  </div>

                </div>
              </div>

              {/* ─── RIGHT COLUMN — BOOKING CARD ────────────── */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sticky top-6">

                  {/* Price display */}
                  <div className="mb-5">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">
                      Workshop Fee
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-[#104288]">
                        {isFree ? "FREE" : `₹${Number(event.price).toLocaleString("en-IN")}`}
                      </span>
                      {!isFree && (
                        <span className="text-xs text-slate-400 font-semibold">/ seat</span>
                      )}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-slate-100 my-4" />

                  {/* Quick info list */}
                  <ul className="space-y-2.5 mb-6 text-xs font-semibold text-slate-600">
                    <li className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-[10px]">📅</span>
                      {formatDate(event.date)}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-[10px]">📍</span>
                      {event.location || "Online"}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-[10px]">🏷️</span>
                      {eventType}
                    </li>
                    {event.isActive && (
                      <li className="flex items-center gap-2 text-emerald-600 font-black">
                        <span className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-[10px]">✅</span>
                        Registration Open
                      </li>
                    )}
                  </ul>

                  {/* BOOK NOW BUTTON */}
                  <button
                    type="button"
                    onClick={handleBookNow}
                    disabled={booking || alreadyBooked}
                    className={`
                      w-full py-4 rounded-2xl text-sm font-black tracking-wide transition-all duration-300 shadow-lg
                      flex items-center justify-center gap-2 cursor-pointer
                      ${alreadyBooked
                        ? "bg-emerald-500 text-white cursor-not-allowed shadow-emerald-200"
                        : booking
                        ? "bg-[#104288]/70 text-white cursor-not-allowed"
                        : "bg-[#104288] hover:bg-[#f97316] text-white hover:shadow-orange-200 active:scale-[0.98]"
                      }
                    `}
                  >
                    {booking ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Booking…
                      </>
                    ) : alreadyBooked ? (
                      <>✅ Booked!</>
                    ) : (
                      <>⚡ Book Now →</>
                    )}
                  </button>

                  {!getToken() && (
                    <p className="text-center text-[10px] text-slate-400 font-semibold mt-3">
                      You must be logged in to book
                    </p>
                  )}

                  <p className="text-center text-[10px] text-slate-300 font-semibold mt-3">
                    🔒 Secure · Instant Confirmation
                  </p>
                </div>
              </div>

            </div>

            {/* Bottom spacer */}
            <div className="h-16" />
          </div>
        </div>
      </div>

      {/* =====================================================
          SUCCESS MODAL
      ===================================================== */}
      {showSuccess && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">

            {/* Top color bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#104288] to-[#f97316]" />

            <div className="p-8 text-center">

              {/* Animated success icon */}
              <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 className="text-2xl font-black text-slate-900 mb-1">
                Booking Confirmed! 🎉
              </h2>
              <p className="text-xs text-slate-400 font-semibold mb-5">
                Your spot has been secured.
              </p>

              {/* Status chip */}
              <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-100 text-orange-600 text-xs font-black px-4 py-1.5 rounded-full mb-5">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                Status: PENDING CONFIRMATION
              </div>

              {/* Event info box */}
              <div className="bg-slate-50 rounded-2xl p-4 mb-6 text-left">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                  Event Details
                </p>
                <p className="text-sm font-black text-[#104288] mb-1">{event.title}</p>
                <p className="text-xs text-slate-500 font-semibold">
                  📅 {formatDate(event.date)}
                </p>
                <p className="text-xs text-slate-500 font-semibold">
                  📍 {event.location || "Online"}
                </p>
                {bookingResult?._id && (
                  <p className="text-[10px] text-slate-400 font-mono mt-2">
                    Booking ID: {bookingResult._id}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => setShowSuccess(false)}
                  className="w-full bg-[#104288] hover:bg-[#f97316] text-white font-black py-3.5 rounded-2xl transition-all cursor-pointer"
                >
                  Done
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-2xl transition-all text-sm cursor-pointer"
                >
                  ← Back to Events
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}