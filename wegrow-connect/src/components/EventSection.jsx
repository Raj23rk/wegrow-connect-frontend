import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { theme } from "../theme";

export default function EventSection({
  eventTargetRef,
  eventStyle,
}) {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentIndex, setCurrentIndex] = useState(0);

  const autoSlideRef = useRef(null);

  // =====================================================
  // FETCH EVENTS
  // =====================================================

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          sessionStorage.getItem("accessToken");

        const response = await fetch(
          "https://wegrow-connect-backend-1.onrender.com/api/v1/events/all-event?page=1&limit=10",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",

              ...(token
                ? {
                    Authorization: `Bearer ${token}`,
                  }
                : {}),
            },
          }
        );

        const json = await response.json();

        if (!response.ok) {
          throw new Error(
            json?.message ||
              "Failed to fetch events"
          );
        }

        if (
          json?.success &&
          Array.isArray(
            json?.data?.events
          )
        ) {
          setEvents(json.data.events);
          setCurrentIndex(0);
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error(
          "Event API Error:",
          error
        );

        setError(
          error?.message ||
            "Unable to load events."
        );

        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // =====================================================
  // AUTO RIGHT TO LEFT SLIDER
  // =====================================================

  useEffect(() => {
    if (events.length <= 1) {
      return;
    }

    autoSlideRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= events.length - 1) {
          return 0;
        }

        return prev + 1;
      });
    }, 4000);

    return () => {
      clearInterval(
        autoSlideRef.current
      );
    };
  }, [events.length]);

  // =====================================================
  // PREVIOUS
  // =====================================================

  const handlePrev = () => {
    if (events.length <= 1) return;

    setCurrentIndex((prev) => {
      if (prev === 0) {
        return events.length - 1;
      }

      return prev - 1;
    });
  };

  // =====================================================
  // NEXT
  // =====================================================

  const handleNext = () => {
    if (events.length <= 1) return;

    setCurrentIndex((prev) => {
      if (prev >= events.length - 1) {
        return 0;
      }

      return prev + 1;
    });
  };

  // =====================================================
  // DETAILS PAGE
  // =====================================================

  const handleViewDetails = (event) => {
    navigate(
      `/home/events/${event._id}`
    );
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "TBA";

    try {
      return new Date(
        date
      ).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "TBA";
    }
  };

  const getDateParts = (date) => {
    if (!date) return { day: "—", month: "TBA" };
    try {
      const d = new Date(date);
      return {
        day: d.getDate().toString().padStart(2, "0"),
        month: d.toLocaleString("en-US", { month: "short" }).toUpperCase(),
      };
    } catch {
      return { day: "—", month: "TBA" };
    }
  };

  // =====================================================
  // GET VISIBLE EVENTS
  // =====================================================

  const getVisibleEvents = () => {
    if (events.length === 0) {
      return [];
    }

    if (events.length === 1) {
      return [events[0]];
    }

    if (events.length === 2) {
      return [events[0], events[1]];
    }

    const first =
      events[currentIndex];

    const second =
      events[
        (currentIndex + 1) %
          events.length
      ];

    const third =
      events[
        (currentIndex + 2) %
          events.length
      ];

    return [first, second, third];
  };

  const visibleEvents =
    getVisibleEvents();

  // Helper: is business type?
  const isBusiness = (event) =>
    (event.type || "").toUpperCase() === "BUSINESS";

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <section
      ref={eventTargetRef}
      style={{
        ...eventStyle,
        backgroundColor:
          "transparent",
      }}
      className="w-full py-5 sm:py-8 md:py-12 px-3 sm:px-8 flex flex-col items-center justify-center transition-all duration-700 my-2 max-w-7xl mx-auto"
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="text-center mb-5 sm:mb-7 md:mb-9">
        <p
          className="text-xs font-black tracking-[0.2em] uppercase mb-2"
          style={{
            color: theme.orange,
          }}
        >
          UPCOMING EVENTS & SESSIONS
        </p>

        <h2
          className="text-2xl sm:text-4xl font-black tracking-tight mb-2 sm:mb-3"
          style={{
            color: theme.primary,
          }}
        >
          Expand Your Knowledge With Expert-Led Events
        </h2>

        <p className="text-xs sm:text-sm font-medium text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Discover interactive workshops, professional seminars, and hands-on industrial experiences designed to accelerate your career growth.
        </p>
      </div>

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (
        <div className="py-14 flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-[#104288] rounded-full animate-spin" />
          <span className="text-sm font-semibold text-gray-500">
            Loading events...
          </span>
        </div>
      )}

      {/* =====================================================
          ERROR
      ===================================================== */}

      {!loading && error && (
        <div className="w-full max-w-xl bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <p className="text-sm font-bold text-red-600">
            {error}
          </p>
        </div>
      )}

      {/* =====================================================
          NO EVENTS
      ===================================================== */}

      {!loading &&
        !error &&
        events.length === 0 && (
          <div className="py-14 text-sm font-semibold text-gray-500 text-center">
            No events available at the moment.
          </div>
        )}

      {/* =====================================================
          CAROUSEL
      ===================================================== */}

      {!loading &&
        !error &&
        events.length > 0 && (
          <div className="w-full max-w-6xl">

            {/* CARDS */}

            <div className="relative overflow-hidden">
              <div
                key={currentIndex}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-[slideLeft_0.5s_ease-out]"
              >
                {visibleEvents.map(
                  (event, index) => {
                    const dateParts = getDateParts(event.date);
                    const businessType = isBusiness(event);
                    const accentColor = businessType ? theme.orange : theme.primary;

                    return (
                      <div
                        key={`${event._id}-${index}`}
                        className="group bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-all duration-300 flex flex-col overflow-hidden border border-gray-100 hover:border-gray-200"
                        style={{
                          borderLeft: `4px solid ${accentColor}`,
                        }}
                      >
                        {/* IMAGE AREA */}
                        <div className="relative w-full h-36 sm:h-40 md:h-44 overflow-hidden bg-gray-100">
                          <img
                            src={
                              event.image ||
                              "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80"
                            }
                            alt={
                              event.title ||
                              "Event"
                            }
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80";
                            }}
                          />

                          {/* DATE BADGE */}
                          <div className="absolute top-2.5 left-2.5 bg-white rounded-xl shadow-lg px-2.5 py-1 text-center min-w-[46px]">
                            <span className="block text-base font-black leading-tight" style={{ color: theme.primary }}>
                              {dateParts.day}
                            </span>
                            <span className="block text-[9px] font-bold tracking-wider text-gray-500">
                              {dateParts.month}
                            </span>
                          </div>

                          {/* ACTIVE BADGE */}
                          {event.isActive && (
                            <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-emerald-500 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-full shadow-md">
                              <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                              </span>
                              Live
                            </div>
                          )}

                          {/* TYPE BADGE */}
                          <div className="absolute bottom-2.5 left-2.5">
                            <span
                              className="inline-block text-[9px] font-black uppercase px-2.5 py-1 rounded-md shadow-md backdrop-blur-sm"
                              style={{
                                backgroundColor: businessType ? "rgba(243,168,18,0.92)" : "rgba(16,66,136,0.92)",
                                color: "#ffffff",
                              }}
                            >
                              {event.type || "SESSION"}
                            </span>
                          </div>
                        </div>

                        {/* CONTENT AREA */}
                        <div className="flex flex-col flex-1 p-3 sm:p-4">

                          {/* TITLE */}
                          <h3 className="text-base font-extrabold text-gray-900 mb-1 leading-snug line-clamp-1 group-hover:text-[#104288] transition-colors duration-300">
                            {event.title}
                          </h3>

                          {/* DESCRIPTION */}
                          <p className="text-xs font-medium text-gray-500 leading-relaxed mb-3 line-clamp-2 flex-1">
                            {event.description}
                          </p>

                          {/* INFO ROW */}
                          <div className="flex flex-col gap-1.5 mb-3 text-xs">
                            <div className="flex items-center gap-2 text-gray-500">
                              <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="font-semibold truncate">
                                {event.location || "Online"}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-gray-500">
                              <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="font-semibold">
                                {formatDate(event.date)}
                              </span>
                            </div>
                          </div>

                          {/* DIVIDER */}
                          <div className="border-t border-gray-100 pt-3">
                            <div className="flex items-center justify-between">

                              {/* PRICE */}
                              <div>
                                <span className="block text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                                  Seat Fee
                                </span>
                                <span className="text-lg font-black" style={{ color: theme.primary }}>
                                  ₹{event.price ?? 0}
                                </span>
                              </div>

                              {/* VIEW DETAILS BUTTON */}
                              <button
                                onClick={() =>
                                  handleViewDetails(event)
                                }
                                className="text-white font-bold text-xs px-4 py-2 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 cursor-pointer flex items-center gap-1.5"
                                style={{ backgroundColor: theme.primary }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = theme.orange;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = theme.primary;
                                }}
                              >
                                View Details
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* =================================================
                CONTROLS
            ================================================= */}

            {events.length > 1 && (
              <div className="flex items-center justify-center gap-5 mt-10">

                <button
                  onClick={handlePrev}
                  className="w-11 h-11 rounded-full bg-white border border-gray-200 text-gray-600 font-black flex items-center justify-center shadow-sm hover:bg-[#104288] hover:text-white hover:border-[#104288] hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="flex items-center gap-2">
                  {events.map(
                    (event, index) => (
                      <button
                        key={event._id}
                        onClick={() =>
                          setCurrentIndex(
                            index
                          )
                        }
                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                          index ===
                          currentIndex
                            ? "w-8 bg-[#f3a812]"
                            : "w-2 bg-gray-300 hover:bg-gray-400"
                        }`}
                      />
                    )
                  )}
                </div>

                <button
                  onClick={handleNext}
                  className="w-11 h-11 rounded-full bg-white border border-gray-200 text-gray-600 font-black flex items-center justify-center shadow-sm hover:bg-[#104288] hover:text-white hover:border-[#104288] hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}

      {/* =====================================================
          ANIMATION
      ===================================================== */}

      <style>
        {`
          @keyframes slideLeft {
            from {
              opacity: 0;
              transform: translateX(60px);
            }

            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
      </style>
    </section>
  );
}