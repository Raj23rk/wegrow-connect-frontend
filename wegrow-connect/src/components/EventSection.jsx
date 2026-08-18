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
          localStorage.getItem("accessToken");

        console.log(
          "================================="
        );
        console.log("EVENT API REQUEST");
        console.log("Token exists:", !!token);
        console.log(
          "================================="
        );

        const response = await fetch(
          "https://bff4-13-239-234-181.ngrok-free.app/api/v1/events/all-event?page=1&limit=10",
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

        console.log(
          "================================="
        );
        console.log("EVENT API RESPONSE");
        console.log("Status:", response.status);
        console.log("Response:", json);
        console.log(
          "================================="
        );

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
      className="w-full min-h-[80vh] py-10 px-6 sm:px-12 flex flex-col items-center justify-center transition-all duration-700 my-4 max-w-7xl mx-auto"
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="text-center mb-10">
        <p
          className="text-xs sm:text-sm font-black tracking-widest uppercase mb-2"
          style={{
            color: "#f97316",
          }}
        >
          UPCOMING EVENTS & SESSIONS
        </p>

        <h2
          className="text-3xl sm:text-5xl font-black tracking-tight mb-3 drop-shadow-md"
          style={{
            color: "#104288",
          }}
        >
          Expand Your Knowledge With Expert-Led Events
        </h2>

        <p className="text-sm sm:text-base font-semibold text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Discover interactive workshops,
          professional seminars, and
          hands-on industrial experiences
          designed to accelerate your
          career growth.
        </p>
      </div>

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (
        <div className="py-16 text-sm font-bold text-gray-700 animate-pulse">
          Loading amazing events...
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
          <div className="py-16 text-sm font-bold text-gray-700 text-center">
            No events available.
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
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-[slideLeft_0.6s_ease-in-out]"
              >
                {visibleEvents.map(
                  (event, index) => (
                    <div
                      key={`${event._id}-${index}`}
                      className="bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl p-5 shadow-xl flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                    >
                      {/* TYPE */}

                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span
                            className={`inline-block text-[10px] sm:text-xs font-black uppercase px-3 py-1 rounded-full shadow-sm ${
                              event.type ===
                              "BUSINESS"
                                ? "bg-orange-50 text-[#f97316]"
                                : "bg-blue-50 text-[#104288]"
                            }`}
                          >
                            {event.type ||
                              "SESSION"}
                          </span>

                          {event.isActive && (
                            <span className="text-[9px] font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                              ACTIVE
                            </span>
                          )}
                        </div>

                        {/* IMAGE */}

                        <div className="w-full h-44 rounded-2xl overflow-hidden mb-5 shadow-md bg-gray-100">
                          <img
                            src={
                              event.image ||
                              "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80"
                            }
                            alt={
                              event.title ||
                              "Event"
                            }
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80";
                            }}
                          />
                        </div>

                        {/* TITLE */}

                        <h3 className="text-xl font-black text-gray-900 mb-2">
                          {event.title}
                        </h3>

                        {/* DESCRIPTION */}

                        <p className="text-xs sm:text-sm font-semibold text-gray-700 leading-relaxed mb-5 line-clamp-3">
                          {
                            event.description
                          }
                        </p>
                      </div>

                      {/* FOOTER */}

                      <div className="pt-4 border-t border-gray-200/80">

                        <div className="flex flex-col gap-2 text-xs font-bold text-gray-600 mb-5">
                          <div className="flex items-center gap-2">
                            <span>
                              📍
                            </span>

                            <span>
                              {event.location ||
                                "Online"}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span>
                              📅
                            </span>

                            <span>
                              {formatDate(
                                event.date
                              )}
                            </span>
                          </div>
                        </div>

                        {/* PRICE + DETAILS */}

                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <span className="block text-[10px] font-bold text-gray-400 uppercase">
                              Seat Fee
                            </span>

                            <span className="text-lg font-black text-[#104288]">
                              ₹
                              {event.price ??
                                0}
                            </span>
                          </div>

                          <button
                            onClick={() =>
                              handleViewDetails(
                                event
                              )
                            }
                            className="bg-[#104288] hover:bg-[#f97316] text-white font-extrabold text-xs px-5 py-3 rounded-full transition-all duration-300 shadow-md cursor-pointer"
                          >
                            View Details →
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* =================================================
                CONTROLS
            ================================================= */}

            {events.length > 1 && (
              <div className="flex items-center justify-center gap-5 mt-7">

                <button
                  onClick={handlePrev}
                  className="w-11 h-11 rounded-full bg-white/90 border border-gray-300 text-[#104288] font-black flex items-center justify-center shadow-lg hover:bg-[#104288] hover:text-white transition-all cursor-pointer"
                >
                  ←
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
                        className={`h-2 rounded-full transition-all duration-300 ${
                          index ===
                          currentIndex
                            ? "w-7 bg-[#f97316]"
                            : "w-2 bg-gray-300"
                        }`}
                      />
                    )
                  )}
                </div>

                <button
                  onClick={handleNext}
                  className="w-11 h-11 rounded-full bg-white/90 border border-gray-300 text-[#104288] font-black flex items-center justify-center shadow-lg hover:bg-[#104288] hover:text-white transition-all cursor-pointer"
                >
                  →
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
              transform: translateX(80px);
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