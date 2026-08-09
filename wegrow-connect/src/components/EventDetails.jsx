import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EventDetails() {
  const navigate = useNavigate();
  const { eventId } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // =====================================================
  // API BASE URL
  // =====================================================

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:4000/api/v1";

  // =====================================================
  // FETCH EVENT DETAILS
  // =====================================================

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("accessToken");

        const response = await fetch(
          `${API_BASE_URL}/events/${eventId}`,
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

        console.log("=================================");
        console.log("EVENT DETAILS");
        console.log("Event ID:", eventId);
        console.log("Response:", json);
        console.log("=================================");

        if (!response.ok) {
          throw new Error(
            json?.message || "Failed to fetch event"
          );
        }

        if (json?.success && json?.data) {
          setEvent(json.data);
        } else {
          setError("Event not found.");
        }
      } catch (error) {
        console.error("Event Details Error:", error);

        setError(
          error?.message ||
            "Unable to load event details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId, API_BASE_URL]);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "TBA";

    const formatted = new Date(date);

    return formatted.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // =====================================================
  // BOOK EVENT
  // =====================================================

  const handleBookNow = async () => {
    const token = localStorage.getItem("accessToken");

    // -------------------------------------------------
    // LOGIN CHECK
    // -------------------------------------------------

    if (!token) {
      alert("Please login to book this event.");
      navigate("/home/login");
      return;
    }

    // -------------------------------------------------
    // EVENT CHECK
    // -------------------------------------------------

    if (!event?._id) {
      alert("Event information is missing.");
      return;
    }

    // Prevent double click
    if (booking) return;

    try {
      setBooking(true);

      console.log("=================================");
      console.log("CREATE BOOKING");
      console.log("Event ID:", event._id);
      console.log("=================================");

      const response = await fetch(
        `${API_BASE_URL}/bookings/create-booking`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            event: event._id,
          }),
        }
      );

      const json = await response.json();

      console.log("BOOKING RESPONSE:", json);

      // -------------------------------------------------
      // SUCCESS
      // -------------------------------------------------

      if (response.ok && json?.success) {
        setShowSuccessPopup(true);
        return;
      }

      // -------------------------------------------------
      // ERROR
      // -------------------------------------------------

      alert(
        json?.message ||
          json?.error ||
          "Unable to create booking."
      );
    } catch (error) {
      console.error("Booking API Error:", error);

      alert(
        "Unable to connect to the booking server."
      );
    } finally {
      setBooking(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="fixed inset-0 z-40 bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-100 border-t-[#104288] rounded-full animate-spin mx-auto mb-4" />

          <p className="text-sm font-bold text-gray-700">
            Loading event details...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !event) {
    return (
      <div className="fixed inset-0 z-40 bg-white overflow-y-auto">
        <div className="min-h-screen flex items-center justify-center px-5">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 text-center">

            <div className="text-5xl mb-5">
              ⚠️
            </div>

            <h2 className="text-2xl font-black text-gray-900 mb-3">
              Event Not Found
            </h2>

            <p className="text-sm font-semibold text-red-500 mb-6">
              {error ||
                "This event could not be found."}
            </p>

            <button
              onClick={() => navigate("/home")}
              className="bg-[#104288] hover:bg-[#f97316] text-white font-bold px-6 py-3 rounded-full transition-all"
            >
              ← Back to Events
            </button>

          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // EVENT DETAILS
  // =====================================================

  return (
    <>
      {/* =================================================
          IMPORTANT:
          fixed + overflow-y-auto prevents parent layout
          from blocking scrolling.
      ================================================= */}

      <div className="fixed inset-0 z-40 bg-gray-50 overflow-y-auto overflow-x-hidden">

        {/* =================================================
            PAGE CONTAINER
        ================================================= */}

        <div className="w-full min-h-screen">

          {/* =================================================
              CONTENT
          ================================================= */}

          <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

            {/* =================================================
                BACK BUTTON
            ================================================= */}

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mb-6 text-sm font-bold text-[#104288] hover:text-[#f97316] transition-colors"
            >
              ← Back to Events
            </button>

            {/* =================================================
                MAIN CARD
            ================================================= */}

            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">

              {/* =================================================
                  IMAGE
              ================================================= */}

          <div className="w-full h-[220px] sm:h-[280px] md:h-[320px] bg-gray-100 overflow-hidden">
  <img
    src={
      event.image ||
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80"
    }
    alt={event.title || "Event"}
    className="w-full h-full object-cover object-center"
    onError={(e) => {
      e.currentTarget.src =
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80";
    }}
  />
</div>
              {/* =================================================
                  CONTENT
              ================================================= */}

              <div className="p-6 sm:p-10">

                {/* =================================================
                    TYPE + STATUS
                ================================================= */}

                <div className="flex flex-wrap items-center gap-3 mb-5">

                  <span
                    className={`text-xs font-black uppercase px-4 py-2 rounded-full ${
                      event.type === "BUSINESS"
                        ? "bg-orange-50 text-[#f97316]"
                        : "bg-blue-50 text-[#104288]"
                    }`}
                  >
                    {event.type || "SESSION"}
                  </span>

                  {event.isActive && (
                    <span className="text-xs font-black text-green-600 bg-green-50 px-4 py-2 rounded-full">
                      ACTIVE EVENT
                    </span>
                  )}

                </div>

                {/* =================================================
                    TITLE
                ================================================= */}

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-5">
                  {event.title}
                </h1>

                {/* =================================================
                    DESCRIPTION
                ================================================= */}

                <p className="text-sm sm:text-base font-semibold text-gray-600 leading-7 sm:leading-8 mb-8">
                  {event.description}
                </p>

                {/* =================================================
                    EVENT INFORMATION
                ================================================= */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">

                  {/* LOCATION */}

                  <div className="bg-gray-50 rounded-2xl p-5">
                    <span className="block text-xs font-black uppercase text-gray-400 mb-2">
                      Venu
                    </span>

                    <span className="text-base font-black text-gray-900">
                      📍 {event.location || "Online"}
                    </span>
                  </div>

                  {/* DATE */}

                  <div className="bg-gray-50 rounded-2xl p-5">
                    <span className="block text-xs font-black uppercase text-gray-400 mb-2">
                      Event Date
                    </span>

                    <span className="text-base font-black text-gray-900">
                      📅 {formatDate(event.date)}
                    </span>
                  </div>

                  {/* PRICE */}

                  <div className="bg-blue-50 rounded-2xl p-5">
                    <span className="block text-xs font-black uppercase text-gray-400 mb-2">
                      WorkShop Fee
                    </span>

                    <span className="text-2xl font-black text-[#104288]">
                      ₹{event.price ?? 0}
                    </span>
                  </div>

                  {/* EVENT TYPE */}

                  <div className="bg-orange-50 rounded-2xl p-5">
                    <span className="block text-xs font-black uppercase text-gray-400 mb-2">
                      Session Type
                    </span>

                    <span className="text-base font-black text-[#f97316]">
                      {event.type || "SESSION"}
                    </span>
                  </div>

                </div>

                {/* =================================================
                    BOOKING SECTION
                ================================================= */}

                <div className="border-t border-gray-200 pt-7 flex flex-col sm:flex-row items-center justify-between gap-5">

                  {/* PRICE */}

                  <div className="text-center sm:text-left">

                    <span className="block text-xs font-bold text-gray-400 uppercase mb-1">
                      Total WorkShop Fee
                    </span>

                    <span className="text-3xl font-black text-[#104288]">
                      ₹{event.price ?? 0}
                    </span>

                  </div>

                  {/* BOOK NOW */}

                  <button
                    type="button"
                    onClick={handleBookNow}
                    disabled={booking}
                    className="w-full sm:w-auto min-w-[220px] bg-[#104288] hover:bg-[#f97316] disabled:opacity-60 disabled:cursor-not-allowed text-white font-black text-base px-8 py-4 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl"
                  >
                    {booking
                      ? "BOOKING..."
                      : "BOOK NOW →"}
                  </button>

                </div>

              </div>
            </div>

            {/* Bottom spacing */}

            <div className="h-16" />

          </div>
        </div>
      </div>

      {/* =====================================================
          SUCCESS POPUP
      ===================================================== */}

      {showSuccessPopup && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center px-5">

          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center">

            {/* SUCCESS ICON */}

            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-4xl text-green-600">
                ✓
              </span>
            </div>

            {/* TITLE */}

            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">
              Booking Successful!
            </h2>

            {/* MESSAGE */}

            <p className="text-sm font-semibold text-gray-600 leading-relaxed mb-6">
              Your booking has been created successfully.
              <br />

              Your booking status is{" "}
              <span className="font-black text-orange-500">
                PENDING
              </span>
              .
            </p>

            {/* EVENT */}

            <div className="bg-blue-50 rounded-2xl p-4 mb-6">

              <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                Event
              </p>

              <p className="text-sm font-black text-[#104288]">
                {event.title}
              </p>

            </div>

            {/* DONE */}

            <button
              type="button"
              onClick={() => {
                setShowSuccessPopup(false);
              }}
              className="w-full bg-[#104288] hover:bg-[#f97316] text-white font-black py-3.5 rounded-full transition-all"
            >
              Done
            </button>

          </div>
        </div>
      )}
    </>
  );
}