import React, { useEffect, useMemo, useState } from "react";
import StudentSidebar from "../../components/StudentSidebar";
import DashboardProfileMenu from "../../components/DashboardProfileMenu";
import {
  BookOpen,
  PlayCircle,
  CheckCircle2,
  Search,
  ArrowRight,
  Sparkles,
  BarChart2,
  MapPin,
  CalendarDays,
  IndianRupee,
  RefreshCw,
  ImageOff,
  ChevronLeft,
  ChevronRight,
  X,
  Clock,
  Users,
} from "lucide-react";

// =====================================================
// TYPES
// =====================================================

interface Event {
  _id: string;
  title: string;
  description: string;
  type: string;
  image?: string;
  location?: string;
  date?: string;
  price?: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface EventsResponse {
  success: boolean;
  message: string;
  data: {
    events: Event[];
    pagination: Pagination;
  };
  timestamp: string;
}

interface EventDetailResponse {
  success: boolean;
  message: string;
  data: Event;
  timestamp: string;
}

interface BookingResponse {
  success: boolean;
  message: string;
  data?: any;
  timestamp?: string;
}

// =====================================================
// CONSTANTS
// =====================================================

const API_BASE_URL = "https://wegrow-connect-backend-1.onrender.com/api/v1";

const EVENTS_API = `${API_BASE_URL}/events/all-event`;
const EVENT_DETAIL_API = `${API_BASE_URL}/events`;
const BOOKING_API = `${API_BASE_URL}/bookings/create-booking`;

const DEFAULT_PAGINATION: Pagination = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

// =====================================================
// COMPONENT
// =====================================================

export default function StudentCourses() {
  // =====================================================
  // STATES
  // =====================================================

  const [activeTab, setActiveTab] = useState<
    "enrolled" | "completed" | "explore"
  >("explore");

  const [searchQuery, setSearchQuery] = useState("");

  const [events, setEvents] = useState<Event[]>([]);

  const [pagination, setPagination] =
    useState<Pagination>(DEFAULT_PAGINATION);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // =====================================================
  // COURSE DETAIL MODAL STATES
  // =====================================================

  const [selectedEvent, setSelectedEvent] =
    useState<Event | null>(null);

  const [detailLoading, setDetailLoading] =
    useState(false);

  const [detailError, setDetailError] =
    useState("");

  const [isDetailModalOpen, setIsDetailModalOpen] =
    useState(false);

  // =====================================================
  // BOOKING STATES
  // =====================================================

  const [bookingLoading, setBookingLoading] =
    useState(false);

  const [bookingSuccess, setBookingSuccess] =
    useState("");

  const [bookingError, setBookingError] =
    useState("");

  // =====================================================
  // GET TOKEN
  // =====================================================

 const getToken = () => {
    /*
     * IMPORTANT:
     *
     * AuthContext now stores token in sessionStorage.
     *
     * Therefore MyBookings must also read it
     * from sessionStorage.
     */

    return sessionStorage.getItem(
      "accessToken"
    );
  };

  // =====================================================
  // FETCH EVENTS
  // =====================================================

  const fetchEvents = async (
    page = 1,
    search = ""
  ) => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        setError(
          "Authentication token not found. Please login again."
        );
        return;
      }

      const params = new URLSearchParams();

      params.append("page", String(page));
      params.append("limit", "10");

      if (search.trim()) {
        params.append("search", search.trim());
      }

      const response = await fetch(
        `${EVENTS_API}?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "Session expired. Please login again."
          );
        }

        throw new Error(
          `Failed to fetch events. Status: ${response.status}`
        );
      }

      const result: EventsResponse =
        await response.json();

      if (!result.success) {
        throw new Error(
          result.message || "Failed to fetch events"
        );
      }

      setEvents(result.data?.events || []);

      setPagination(
        result.data?.pagination ||
          DEFAULT_PAGINATION
      );
    } catch (err: any) {
      console.error(
        "Fetch events error:",
        err
      );

      setError(
        err?.message ||
          "Something went wrong while loading events."
      );

      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD + SEARCH
  // =====================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEvents(1, searchQuery);
    }, searchQuery ? 500 : 0);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // =====================================================
  // FILTER EVENTS
  // =====================================================

  const filteredEvents = useMemo(() => {
    if (activeTab === "completed") {
      return [];
    }

    return events.filter(
      (event) => event.isActive
    );
  }, [events, activeTab]);

  // =====================================================
  // STATS
  // =====================================================

  const totalEvents = pagination.total;

  const activeEvents = events.filter(
    (event) => event.isActive
  ).length;

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date?: string) => {
    if (!date) {
      return "Date not available";
    }

    try {
      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "Date not available";
    }
  };

  // =====================================================
  // TIME FORMAT
  // =====================================================

  const formatTime = (date?: string) => {
    if (!date) {
      return "Time not available";
    }

    try {
      return new Date(date).toLocaleTimeString(
        "en-IN",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    } catch {
      return "Time not available";
    }
  };

  // =====================================================
  // PRICE FORMAT
  // =====================================================

  const formatPrice = (price?: number) => {
    if (
      price === undefined ||
      price === null ||
      price === 0
    ) {
      return "Free";
    }

    return `₹${price.toLocaleString("en-IN")}`;
  };

  // =====================================================
  // IMAGE ERROR
  // =====================================================

  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement>
  ) => {
    const image = event.currentTarget;

    image.style.display = "none";

    const fallback =
      image.parentElement?.querySelector(
        ".image-fallback"
      ) as HTMLElement | null;

    if (fallback) {
      fallback.style.display = "flex";
    }
  };

  // =====================================================
  // RETRY
  // =====================================================

  const handleRetry = () => {
    fetchEvents(
      pagination.page,
      searchQuery
    );
  };

  // =====================================================
  // PAGE CHANGE
  // =====================================================

  const handlePageChange = (page: number) => {
    if (
      page < 1 ||
      page > pagination.totalPages ||
      page === pagination.page
    ) {
      return;
    }

    fetchEvents(page, searchQuery);

    const mainElement =
      document.getElementById(
        "student-courses-main"
      );

    if (mainElement) {
      mainElement.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // =====================================================
  // PAGINATION NUMBERS
  // =====================================================

  const getPaginationNumbers = () => {
    const totalPages = pagination.totalPages;
    const currentPage = pagination.page;

    if (totalPages <= 7) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );
    }

    if (currentPage <= 4) {
      return [
        1,
        2,
        3,
        4,
        5,
        "...",
        totalPages,
      ];
    }

    if (
      currentPage >= totalPages - 3
    ) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  // =====================================================
  // OPEN COURSE DETAIL
  // =====================================================

  const handleViewCourse = async (
    eventId: string
  ) => {
    try {
      setIsDetailModalOpen(true);

      setDetailLoading(true);
      setDetailError("");

      setBookingSuccess("");
      setBookingError("");

      setSelectedEvent(null);

      const token = getToken();

      if (!token) {
        setDetailError(
          "Authentication token not found. Please login again."
        );
        return;
      }

      const response = await fetch(
        `${EVENT_DETAIL_API}/${eventId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "Session expired. Please login again."
          );
        }

        throw new Error(
          `Failed to fetch course details. Status: ${response.status}`
        );
      }

      const result: EventDetailResponse =
        await response.json();

      if (!result.success) {
        throw new Error(
          result.message ||
            "Failed to fetch course details"
        );
      }

      setSelectedEvent(result.data);
    } catch (err: any) {
      console.error(
        "Course detail error:",
        err
      );

      setDetailError(
        err?.message ||
          "Unable to load course details."
      );
    } finally {
      setDetailLoading(false);
    }
  };

  // =====================================================
  // CLOSE COURSE DETAIL MODAL
  // =====================================================

  const closeDetailModal = () => {
    if (bookingLoading) {
      return;
    }

    setIsDetailModalOpen(false);

    setSelectedEvent(null);

    setDetailError("");

    setBookingError("");

    setBookingSuccess("");
  };

  // =====================================================
  // BOOK NOW
  // =====================================================

  const handleBookNow = async () => {
    if (!selectedEvent) {
      return;
    }

    if (bookingLoading) {
      return;
    }

    try {
      setBookingLoading(true);

      setBookingError("");

      setBookingSuccess("");

      const token = getToken();

      if (!token) {
        setBookingError(
          "Authentication token not found. Please login again."
        );
        return;
      }

      const response = await fetch(
        BOOKING_API,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            event: selectedEvent._id,
          }),
        }
      );

      const result: BookingResponse =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            `Booking failed. Status: ${response.status}`
        );
      }

      if (!result.success) {
        throw new Error(
          result.message ||
            "Booking failed."
        );
      }

      // =================================================
      // BOOKING SUCCESS
      // =================================================

      setBookingSuccess(
        result.message ||
          "Booking successful!"
      );

      // Refresh event list
      await fetchEvents(
        pagination.page,
        searchQuery
      );

      // =================================================
      // AUTOMATICALLY CLOSE MODAL
      // =================================================

      setTimeout(() => {
        setIsDetailModalOpen(false);

        setSelectedEvent(null);

        setBookingSuccess("");

        setBookingError("");
      }, 1200);
    } catch (err: any) {
      console.error(
        "Booking error:",
        err
      );

      setBookingError(
        err?.message ||
          "Something went wrong while booking the course."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="flex min-h-screen h-screen bg-slate-50/60 font-sans text-slate-800 antialiased overflow-hidden">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <StudentSidebar />

      {/* =====================================================
          MAIN SCROLL CONTAINER
      ===================================================== */}

      <main
        id="student-courses-main"
        className="flex-1 min-w-0 h-screen overflow-y-auto overflow-x-hidden p-8 pb-12 space-y-8"
      >

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <BookOpen className="w-7 h-7 text-blue-600" />

              My Events
            </h1>

            <p className="text-xs text-slate-500 font-medium mt-1">
              Explore available programs, track your
              learning, and join new courses.
            </p>
          </div>

          <div className="flex items-center gap-3">

            {/* SEARCH */}

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                className="pl-9 pr-4 py-2 border border-slate-200/80 rounded-xl text-xs bg-white focus:outline-none focus:border-blue-600 w-64 shadow-2xs"
              />
            </div>

            <button
              onClick={() =>
                setActiveTab("explore")
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Explore New
              </span>
            </button>

            <DashboardProfileMenu />
          </div>
        </div>

        {/* =====================================================
            STATS
        ===================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* AVAILABLE */}

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Available Courses
              </span>

              <p className="text-2xl font-black text-slate-900 mt-1">
                {totalEvents}
              </p>

              <span className="text-[10px] font-bold text-blue-600 mt-1 inline-block">
                Live courses
              </span>
            </div>

            <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>

          {/* ACTIVE */}

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Active Events
              </span>

              <p className="text-2xl font-black text-slate-900 mt-1">
                {activeEvents}
              </p>

              <span className="text-[10px] font-bold text-emerald-600 mt-1 inline-block">
                Currently available
              </span>
            </div>

            <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          {/* PAGE */}

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Course Catalog
              </span>

              <p className="text-2xl font-black text-slate-900 mt-1">
                {pagination.page} /{" "}
                {pagination.totalPages}
              </p>

              <span className="text-[10px] font-bold text-purple-600 mt-1 inline-block">
                Current page
              </span>
            </div>

            <div className="w-11 h-11 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <BarChart2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* =====================================================
            TABS
        ===================================================== */}

        <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3 text-xs overflow-x-auto">

          {[
            {
              id: "enrolled",
              label: "Active Learning",
            },
            {
              id: "completed",
              label: "Completed",
            },
            {
              id: "explore",
              label: `Explore All Catalog (${pagination.total})`,
            },
          ].map((tab) => (

            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(
                  tab.id as
                    | "enrolled"
                    | "completed"
                    | "explore"
                )
              }
              className={`px-4 py-2 rounded-xl font-extrabold transition-all cursor-pointer shrink-0 ${
                activeTab === tab.id
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-white text-slate-500 border border-slate-200 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (

          <div className="bg-red-50 border border-red-200 rounded-2xl p-5">

            <div className="flex items-center justify-between gap-4">

              <div>
                <h3 className="text-sm font-black text-red-700">
                  Unable to load courses
                </h3>

                <p className="text-xs text-red-600 mt-1">
                  {error}
                </p>
              </div>

              <button
                onClick={handleRetry}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry
              </button>

            </div>
          </div>
        )}

        {/* =====================================================
            LOADING
        ===================================================== */}

        {loading && (

          <div className="flex justify-center items-center py-16">

            <div className="flex items-center gap-3 text-slate-500">

              <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />

              <span className="text-sm font-semibold">
                Loading courses...
              </span>

            </div>
          </div>
        )}

        {/* =====================================================
            EMPTY
        ===================================================== */}

        {!loading &&
          !error &&
          filteredEvents.length === 0 && (

            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">

              <BookOpen className="w-12 h-12 mx-auto text-slate-300" />

              <h3 className="text-base font-black text-slate-800 mt-4">
                No courses found
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                {activeTab === "completed"
                  ? "You haven't completed any courses yet."
                  : searchQuery
                  ? `No courses found for "${searchQuery}".`
                  : "No active courses are available right now."}
              </p>

            </div>
          )}

        {/* =====================================================
            COURSE GRID
        ===================================================== */}

        {!loading &&
          filteredEvents.length > 0 && (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {filteredEvents.map((course) => (

                <div
                  key={course._id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all overflow-hidden group"
                >

                  {/* IMAGE */}

                  <div className="relative w-full h-52 bg-slate-100 overflow-hidden">

                    {course.image ? (

                      <>

                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={handleImageError}
                        />

                        <div className="image-fallback hidden absolute inset-0 items-center justify-center bg-slate-100">

                          <div className="text-center">

                            <ImageOff className="w-10 h-10 mx-auto text-slate-300" />

                            <p className="text-xs text-slate-400 mt-2 font-semibold">
                              Image unavailable
                            </p>

                          </div>

                        </div>

                      </>

                    ) : (

                      <div className="w-full h-full flex items-center justify-center">

                        <div className="text-center">

                          <ImageOff className="w-10 h-10 mx-auto text-slate-300" />

                          <p className="text-xs text-slate-400 mt-2 font-semibold">
                            No image available
                          </p>

                        </div>

                      </div>
                    )}

                    {/* STATUS */}

                    <div className="absolute top-4 right-4">

                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border backdrop-blur-sm ${
                          course.isActive
                            ? "bg-emerald-50/95 text-emerald-700 border-emerald-200"
                            : "bg-slate-50/95 text-slate-600 border-slate-200"
                        }`}
                      >
                        {course.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>

                    </div>

                    {/* TYPE */}

                    <div className="absolute bottom-4 left-4">

                      <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 text-white text-[10px] font-black uppercase backdrop-blur-sm">
                        {course.type}
                      </span>

                    </div>

                  </div>

                  {/* CONTENT */}

                  <div className="p-6 space-y-5">

                    <div>

                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                        Student Program
                      </span>

                      <h3 className="font-black text-base text-slate-900 group-hover:text-blue-600 transition-colors mt-1 leading-snug">
                        {course.title}
                      </h3>

                    </div>

                    <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                      {course.description}
                    </p>

                    {/* DETAILS */}

                    <div className="grid grid-cols-2 gap-3">

                      {/* LOCATION */}

                      <div className="flex items-center gap-2">

                        <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                          <MapPin className="w-4 h-4" />
                        </div>

                        <div className="min-w-0">

                          <p className="text-[9px] text-slate-400 font-bold uppercase">
                            Location
                          </p>

                          <p className="text-[11px] text-slate-700 font-bold truncate">
                            {course.location ||
                              "Online"}
                          </p>

                        </div>

                      </div>

                      {/* DATE */}

                      <div className="flex items-center gap-2">

                        <div className="w-8 h-8 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center shrink-0">
                          <CalendarDays className="w-4 h-4" />
                        </div>

                        <div className="min-w-0">

                          <p className="text-[9px] text-slate-400 font-bold uppercase">
                            Date
                          </p>

                          <p className="text-[11px] text-slate-700 font-bold truncate">
                            {formatDate(course.date)}
                          </p>

                        </div>

                      </div>
                    </div>

                    {/* PRICE */}

                    <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3">

                      <div>

                        <p className="text-[9px] text-slate-400 uppercase font-bold">
                          Workshop Fee
                        </p>

                        <div className="flex items-center gap-1 mt-0.5">

                          <IndianRupee className="w-4 h-4 text-emerald-600" />

                          <span className="text-lg font-black text-slate-900">
                            {formatPrice(
                              course.price
                            )}
                          </span>

                        </div>

                      </div>

                      <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shadow-sm">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                      </div>

                    </div>

                    {/* FOOTER */}

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">

                      <span className="text-[10px] font-semibold text-slate-400">
                        {course.isActive
                          ? "Available for booking"
                          : "Currently unavailable"}
                      </span>

                      {course.isActive ? (

                        <button
                          className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                          onClick={() =>
                            handleViewCourse(
                              course._id
                            )
                          }
                        >

                          <PlayCircle className="w-3.5 h-3.5 text-blue-400" />

                          View Course

                          <ArrowRight className="w-3.5 h-3.5" />

                        </button>

                      ) : (

                        <button
                          disabled
                          className="flex items-center gap-1.5 bg-slate-200 text-slate-400 px-4 py-2.5 rounded-xl text-xs font-bold cursor-not-allowed"
                        >
                          Unavailable
                        </button>
                      )}

                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

        {/* =====================================================
            PAGINATION
        ===================================================== */}

        {!loading &&
          !error &&
          pagination.totalPages > 1 && (

            <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

                <div className="text-[11px] text-slate-500 font-semibold">

                  Showing{" "}

                  <span className="text-slate-900 font-black">
                    {(pagination.page - 1) *
                      pagination.limit +
                      1}
                  </span>

                  {" "}-{" "}

                  <span className="text-slate-900 font-black">
                    {Math.min(
                      pagination.page *
                        pagination.limit,
                      pagination.total
                    )}
                  </span>

                  {" "}of{" "}

                  <span className="text-slate-900 font-black">
                    {pagination.total}
                  </span>

                  {" "}courses

                </div>

                <div className="flex items-center gap-1.5">

                  {/* PREVIOUS */}

                  <button
                    disabled={
                      !pagination.hasPreviousPage
                    }
                    onClick={() =>
                      handlePageChange(
                        pagination.page - 1
                      )
                    }
                    className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >

                    <ChevronLeft className="w-4 h-4" />

                    <span className="hidden sm:inline">
                      Previous
                    </span>

                  </button>

                  {/* NUMBERS */}

                  <div className="flex items-center gap-1">

                    {getPaginationNumbers().map(
                      (page, index) => {

                        if (page === "...") {
                          return (
                            <span
                              key={`dots-${index}`}
                              className="w-9 h-9 flex items-center justify-center text-xs font-bold text-slate-400"
                            >
                              ...
                            </span>
                          );
                        }

                        return (
                          <button
                            key={page}
                            onClick={() =>
                              handlePageChange(
                                page as number
                              )
                            }
                            className={`w-9 h-9 rounded-xl text-xs font-bold transition ${
                              pagination.page ===
                              page
                                ? "bg-slate-900 text-white shadow-sm"
                                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      }
                    )}

                  </div>

                  {/* NEXT */}

                  <button
                    disabled={
                      !pagination.hasNextPage
                    }
                    onClick={() =>
                      handlePageChange(
                        pagination.page + 1
                      )
                    }
                    className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >

                    <span className="hidden sm:inline">
                      Next
                    </span>

                    <ChevronRight className="w-4 h-4" />

                  </button>

                </div>
              </div>
            </div>
          )}

        <div className="h-4" />
      </main>

      {/* =====================================================
          COURSE DETAIL MODAL
      ===================================================== */}

      {isDetailModalOpen && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          {/* BACKDROP */}

          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => {
              if (!bookingLoading) {
                closeDetailModal();
              }
            }}
          />

          {/* MODAL */}

          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl">

            {/* CLOSE BUTTON */}

            <button
              onClick={closeDetailModal}
              disabled={bookingLoading}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 disabled:opacity-40"
            >
              <X className="w-5 h-5" />
            </button>

            {/* DETAIL LOADING */}

            {detailLoading && (

              <div className="flex flex-col items-center justify-center py-24">

                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />

                <p className="text-sm font-semibold text-slate-500 mt-4">
                  Loading course details...
                </p>

              </div>
            )}

            {/* DETAIL ERROR */}

            {!detailLoading && detailError && (

              <div className="p-10 text-center">

                <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">

                  <X className="w-7 h-7" />

                </div>

                <h3 className="text-lg font-black text-slate-900 mt-4">
                  Unable to load course
                </h3>

                <p className="text-sm text-red-600 mt-2">
                  {detailError}
                </p>

                <button
                  onClick={closeDetailModal}
                  className="mt-6 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold"
                >
                  Close
                </button>

              </div>
            )}

            {/* COURSE DETAIL */}

            {!detailLoading &&
              !detailError &&
              selectedEvent && (

                <div>

                  {/* IMAGE */}

                  <div className="relative h-64 bg-slate-100">

                    {selectedEvent.image ? (

                      <img
                        src={selectedEvent.image}
                        alt={selectedEvent.title}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                      />

                    ) : (

                      <div className="w-full h-full flex items-center justify-center">

                        <div className="text-center">

                          <ImageOff className="w-12 h-12 mx-auto text-slate-300" />

                          <p className="text-sm text-slate-400 mt-2">
                            No image available
                          </p>

                        </div>

                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/70 to-transparent">

                      <span className="inline-flex px-3 py-1 rounded-lg bg-blue-600 text-white text-[10px] font-black uppercase">
                        {selectedEvent.type}
                      </span>

                      <h2 className="text-2xl font-black text-white mt-2 pr-8">
                        {selectedEvent.title}
                      </h2>

                    </div>
                  </div>

                  {/* CONTENT */}

                  <div className="p-6 space-y-6">

                    {/* SUCCESS MESSAGE */}

                    {bookingSuccess && (

                      <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4">

                        <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">

                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />

                        </div>

                        <div>

                          <p className="text-sm font-black text-emerald-700">
                            Booking Successful
                          </p>

                          <p className="text-xs text-emerald-600 mt-0.5">
                            {bookingSuccess}
                          </p>

                        </div>

                      </div>
                    )}

                    {/* BOOKING ERROR */}

                    {bookingError && (

                      <div className="bg-red-50 border border-red-200 rounded-xl p-4">

                        <p className="text-sm font-black text-red-700">
                          Booking Failed
                        </p>

                        <p className="text-xs text-red-600 mt-1">
                          {bookingError}
                        </p>

                      </div>
                    )}

                    {/* DESCRIPTION */}

                    <div>

                      <p className="text-[10px] uppercase tracking-wider font-black text-blue-600">
                        About This Program
                      </p>

                      <p className="text-sm text-slate-600 leading-relaxed mt-2">
                        {selectedEvent.description}
                      </p>

                    </div>

                    {/* DETAILS GRID */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      {/* LOCATION */}

                      <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-4">

                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">

                          <MapPin className="w-5 h-5" />

                        </div>

                        <div>

                          <p className="text-[9px] uppercase font-bold text-slate-400">
                            Location
                          </p>

                          <p className="text-sm font-black text-slate-800">
                            {selectedEvent.location ||
                              "Online"}
                          </p>

                        </div>

                      </div>

                      {/* DATE */}

                      <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-4">

                        <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">

                          <CalendarDays className="w-5 h-5" />

                        </div>

                        <div>

                          <p className="text-[9px] uppercase font-bold text-slate-400">
                            Date
                          </p>

                          <p className="text-sm font-black text-slate-800">
                            {formatDate(
                              selectedEvent.date
                            )}
                          </p>

                        </div>

                      </div>

                      {/* TIME */}

                      <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-4">

                        <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">

                          <Clock className="w-5 h-5" />

                        </div>

                        <div>

                          <p className="text-[9px] uppercase font-bold text-slate-400">
                            Time
                          </p>

                          <p className="text-sm font-black text-slate-800">
                            {formatTime(
                              selectedEvent.date
                            )}
                          </p>

                        </div>

                      </div>

                      {/* TYPE */}

                      <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-4">

                        <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">

                          <Users className="w-5 h-5" />

                        </div>

                        <div>

                          <p className="text-[9px] uppercase font-bold text-slate-400">
                            Program Type
                          </p>

                          <p className="text-sm font-black text-slate-800">
                            {selectedEvent.type}
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* PRICE */}

                    <div className="flex items-center justify-between bg-slate-900 rounded-2xl p-5">

                      <div>

                        <p className="text-[10px] uppercase font-bold text-slate-400">
                          Workshop Fee
                        </p>

                        <div className="flex items-center gap-1 mt-1">

                          <IndianRupee className="w-5 h-5 text-emerald-400" />

                          <span className="text-2xl font-black text-white">
                            {formatPrice(
                              selectedEvent.price
                            )}
                          </span>

                        </div>

                      </div>

                      <Sparkles className="w-7 h-7 text-blue-400" />

                    </div>

                    {/* ACTIONS */}

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">

                      <button
                        onClick={closeDetailModal}
                        disabled={bookingLoading}
                        className="flex-1 px-5 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-bold hover:bg-slate-50 disabled:opacity-50"
                      >
                        Close
                      </button>

                      <button
                        onClick={handleBookNow}
                        disabled={
                          bookingLoading ||
                          !selectedEvent.isActive
                        }
                        className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-black shadow-lg shadow-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
                      >

                        {bookingLoading ? (

                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />

                            Booking...
                          </>

                        ) : (

                          <>
                            <CheckCircle2 className="w-4 h-4" />

                            Book Now

                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}

                      </button>

                    </div>

                  </div>
                </div>
              )}

          </div>
        </div>
      )}
    </div>
  );
}