import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import BusinessSidebar from "../../components/BusinessSidebar";
import DashboardProfileMenu from "../../components/DashboardProfileMenu";

import {
  BookOpen,
  CalendarDays,
  MapPin,
  IndianRupee,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock3,
  XCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ImageOff,
  Ticket,
  X,
  GraduationCap,
  Building2,
} from "lucide-react";

// =====================================================
// TYPES
// =====================================================

type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | string;

interface UserData {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
}

interface EventData {
  _id: string;
  title: string;
  description?: string;
  type?: string;
  image?: string;
  location?: string;
  date?: string;
  price?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Booking {
  _id: string;
  user?: UserData;
  event?: EventData | null;
  status: BookingStatus;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

interface BookingsResponse {
  success: boolean;
  message: string;
  data: {
    success?: boolean;
    message?: string;
    bookings: Booking[];
    pagination: Pagination;
  };
  timestamp?: string;
}

interface EventDetailsResponse {
  success: boolean;
  message: string;
  data: EventData;
  timestamp?: string;
}

// =====================================================
// CONSTANTS & API ENDPOINTS
// =====================================================

const API_BASE_URL =
  "https://wegrow-connect-backend-1.onrender.com/api/v1";

const BOOKINGS_API =
  `${API_BASE_URL}/bookings/my-bookings`;

const DEFAULT_PAGINATION: Pagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

// =====================================================
// COMPONENT
// =====================================================

export default function BusinessWorkshops() {
  // =====================================================
  // BOOKINGS STATE
  // =====================================================

  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [pagination, setPagination] =
    useState<Pagination>(DEFAULT_PAGINATION);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const [activeFilter, setActiveFilter] =
    useState<"ALL" | "PENDING" | "CONFIRMED" | "CANCELLED">("ALL");

  // =====================================================
  // COURSE / EVENT DETAILS MODAL STATES
  // =====================================================

  const [selectedEvent, setSelectedEvent] =
    useState<EventData | null>(null);

  const [courseLoading, setCourseLoading] =
    useState(false);

  const [courseError, setCourseError] =
    useState("");

  const [showCourseModal, setShowCourseModal] =
    useState(false);

  // =====================================================
  // TOKEN
  // =====================================================

  const getToken = () => {
    return sessionStorage.getItem("accessToken");
  };

  // =====================================================
  // FETCH BOOKINGS
  // =====================================================

  const fetchBookings = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        setError("Authentication token not found. Please login again.");
        setBookings([]);
        return;
      }

      const requestUrl = `${BOOKINGS_API}?page=${page}&limit=10`;

      const response = await fetch(requestUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // UNAUTHORIZED
      if (response.status === 401) {
        sessionStorage.clear();
        throw new Error("Your session has expired. Please login again.");
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch bookings. Status: ${response.status}`);
      }

      const result: BookingsResponse = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch bookings");
      }

      const bookingList = result.data?.bookings || [];

      setBookings(bookingList);
      setPagination(result.data?.pagination || DEFAULT_PAGINATION);
    } catch (err: any) {
      console.error("Fetch bookings error:", err);
      setError(err?.message || "Something went wrong while loading your bookings.");
      setBookings([]);
      setPagination(DEFAULT_PAGINATION);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchBookings(1);
  }, []);

  // =====================================================
  // FETCH COURSE / EVENT DETAILS
  // =====================================================

  const handleViewCourseDetails = async (eventId?: string) => {
    if (!eventId) {
      setCourseError("Course information is not available.");
      setShowCourseModal(true);
      return;
    }

    try {
      setCourseLoading(true);
      setCourseError("");
      setSelectedEvent(null);
      setShowCourseModal(true);

      const token = getToken();

      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const requestUrl = `${API_BASE_URL}/events/${eventId}`;

      const response = await fetch(requestUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        sessionStorage.clear();
        throw new Error("Your session has expired. Please login again.");
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch course details. Status: ${response.status}`);
      }

      const result: EventDetailsResponse = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch course details.");
      }

      setSelectedEvent(result.data);
    } catch (err: any) {
      console.error("Fetch course details error:", err);
      setCourseError(err?.message || "Unable to load course details.");
    } finally {
      setCourseLoading(false);
    }
  };

  // =====================================================
  // CLOSE COURSE MODAL
  // =====================================================

  const closeCourseModal = () => {
    setShowCourseModal(false);
    setSelectedEvent(null);
    setCourseError("");
  };

  // =====================================================
  // FILTER BOOKINGS
  // =====================================================

  const filteredBookings = useMemo(() => {
    let result = [...bookings];

    if (activeFilter !== "ALL") {
      result = result.filter((booking) => booking.status === activeFilter);
    }

    if (searchQuery.trim()) {
      const search = searchQuery.trim().toLowerCase();
      result = result.filter((booking) => {
        const title = booking.event?.title?.toLowerCase() || "";
        const location = booking.event?.location?.toLowerCase() || "";
        const description = booking.event?.description?.toLowerCase() || "";
        return (
          title.includes(search) ||
          location.includes(search) ||
          description.includes(search)
        );
      });
    }

    return result;
  }, [bookings, activeFilter, searchQuery]);

  // =====================================================
  // STATS
  // =====================================================

  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;
  const confirmedCount = bookings.filter((b) => b.status === "CONFIRMED").length;
  const cancelledCount = bookings.filter((b) => b.status === "CANCELLED").length;

  // =====================================================
  // DATE & TIME FORMATTERS
  // =====================================================

  const formatDate = (date?: string) => {
    if (!date) return "Date not available";
    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Date not available";
    }
  };

  const formatTime = (date?: string) => {
    if (!date) return "--";
    try {
      return new Date(date).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "--";
    }
  };

  const formatPrice = (price?: number) => {
    if (price === undefined || price === null || price === 0) {
      return "Free";
    }
    return `₹${price.toLocaleString("en-IN")}`;
  };

  // =====================================================
  // STATUS CONFIG
  // =====================================================

  const getStatusConfig = (status: BookingStatus) => {
    switch (status) {
      case "CONFIRMED":
        return {
          label: "Confirmed",
          icon: CheckCircle2,
          badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
          iconColor: "text-emerald-600",
        };
      case "CANCELLED":
        return {
          label: "Cancelled",
          icon: XCircle,
          badge: "bg-rose-50 text-rose-700 border-rose-200",
          iconColor: "text-rose-600",
        };
      case "PENDING":
      default:
        return {
          label: "Pending",
          icon: Clock3,
          badge: "bg-amber-50 text-amber-700 border-amber-200",
          iconColor: "text-amber-600",
        };
    }
  };

  // =====================================================
  // IMAGE ERROR HANDLER
  // =====================================================

  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement>
  ) => {
    const image = event.currentTarget;
    image.style.display = "none";
    const fallback = image.parentElement?.querySelector(
      ".image-fallback"
    ) as HTMLElement | null;
    if (fallback) {
      fallback.style.display = "flex";
    }
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

    fetchBookings(page);

    const mainElement = document.getElementById("my-business-bookings-main");
    if (mainElement) {
      mainElement.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // =====================================================
  // PAGINATION NUMBERS
  // =====================================================

  const getPaginationNumbers = () => {
    const totalPages = pagination.totalPages;
    const currentPage = pagination.page;

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    if (currentPage >= totalPages - 3) {
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
  // RENDER
  // =====================================================

  return (
    <div className="flex min-h-screen h-screen bg-slate-50 font-sans text-slate-800 antialiased overflow-hidden">
      {/* SIDEBAR */}
      <BusinessSidebar />

      {/* MAIN CONTAINER */}
      <main
        id="my-business-bookings-main"
        className="flex-1 min-w-0 h-screen overflow-y-auto overflow-x-hidden p-5 md:p-8 pb-12"
      >
        {/* HEADER BAR */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-600/20">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                My Bookings & Masterclasses
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Manage your registered startup workshops, masterclasses, and incubator sessions.
              </p>
            </div>
          </div>

          {/* SEARCH & REFRESH & PROFILE */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
              />
            </div>

            <button
              onClick={() => fetchBookings(pagination.page)}
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-teal-600" : ""}`} />
              Refresh
            </button>

            <DashboardProfileMenu />
          </div>
        </div>

        {/* STAT CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {/* TOTAL */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider font-black text-slate-400">
                  Total Bookings
                </p>
                <p className="text-2xl font-black text-slate-900 mt-1">{pagination.total}</p>
                <p className="text-[10px] text-teal-600 font-bold mt-1">All your bookings</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Ticket className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* PENDING */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider font-black text-slate-400">
                  Pending
                </p>
                <p className="text-2xl font-black text-slate-900 mt-1">{pendingCount}</p>
                <p className="text-[10px] text-amber-600 font-bold mt-1">Awaiting confirmation</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock3 className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* CONFIRMED */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider font-black text-slate-400">
                  Confirmed
                </p>
                <p className="text-2xl font-black text-slate-900 mt-1">{confirmedCount}</p>
                <p className="text-[10px] text-emerald-600 font-bold mt-1">Ready to attend</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* CANCELLED */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider font-black text-slate-400">
                  Cancelled
                </p>
                <p className="text-2xl font-black text-slate-900 mt-1">{cancelledCount}</p>
                <p className="text-[10px] text-rose-600 font-bold mt-1">Cancelled bookings</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <XCircle className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-5">
          {[
            { id: "ALL", label: "All Bookings" },
            { id: "PENDING", label: "Pending" },
            { id: "CONFIRMED", label: "Confirmed" },
            { id: "CANCELLED", label: "Cancelled" },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() =>
                setActiveFilter(filter.id as "ALL" | "PENDING" | "CONFIRMED" | "CANCELLED")
              }
              className={`px-4 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition cursor-pointer ${
                activeFilter === filter.id
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-500 hover:text-slate-900"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* ERROR STATE */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-black text-rose-700">Unable to load bookings</h3>
                <p className="text-xs text-rose-600 mt-1">{error}</p>
              </div>
              <button
                onClick={() => fetchBookings(pagination.page)}
                className="flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retry
              </button>
            </div>
          </div>
        )}

        {/* LOADING STATE */}
        {loading && (
          <div className="bg-white border border-slate-200 rounded-2xl py-20 flex items-center justify-center">
            <div className="flex items-center gap-3 text-slate-500">
              <RefreshCw className="w-5 h-5 animate-spin text-teal-600" />
              <span className="text-sm font-bold">Loading your masterclass bookings...</span>
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && filteredBookings.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl py-20 px-6 text-center">
            <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl mx-auto flex items-center justify-center">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mt-5">No bookings found</h3>
            <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
              {searchQuery
                ? `No bookings match "${searchQuery}".`
                : activeFilter !== "ALL"
                ? `You don't have any ${activeFilter.toLowerCase()} bookings.`
                : "You haven't booked any masterclasses or events yet."}
            </p>
          </div>
        )}

        {/* BOOKINGS LIST */}
        {!loading && filteredBookings.length > 0 && (
          <div className="space-y-5">
            {filteredBookings.map((booking) => {
              const event = booking.event;
              const statusConfig = getStatusConfig(booking.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={booking._id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* IMAGE */}
                    <div className="relative lg:w-72 xl:w-80 h-52 lg:h-auto bg-slate-100 shrink-0">
                      {event?.image ? (
                        <>
                          <img
                            src={event.image}
                            alt={event.title || "Event"}
                            onError={handleImageError}
                            className="w-full h-full object-cover"
                          />
                          <div className="image-fallback hidden absolute inset-0 items-center justify-center bg-slate-100">
                            <div className="text-center">
                              <ImageOff className="w-10 h-10 mx-auto text-slate-300" />
                              <p className="text-xs text-slate-400 mt-2 font-bold">Image unavailable</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full min-h-52 flex items-center justify-center">
                          <div className="text-center">
                            <ImageOff className="w-10 h-10 mx-auto text-slate-300" />
                            <p className="text-xs text-slate-400 mt-2 font-bold">No image available</p>
                          </div>
                        </div>
                      )}

                      {/* STATUS BADGE */}
                      <div className="absolute top-4 left-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase backdrop-blur-md ${statusConfig.badge}`}
                        >
                          <StatusIcon className={`w-3.5 h-3.5 ${statusConfig.iconColor}`} />
                          {statusConfig.label}
                        </span>
                      </div>

                      {/* EVENT TYPE */}
                      {event?.type && (
                        <div className="absolute bottom-4 left-4">
                          <span className="px-3 py-1.5 rounded-lg bg-slate-900/85 text-white text-[10px] font-black uppercase backdrop-blur-md">
                            {event.type}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1 p-5 md:p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-[10px] font-black text-teal-600 uppercase tracking-wider flex items-center gap-1">
                            <Building2 className="w-3 h-3" /> Startup Booking
                          </p>
                          <h2 className="text-lg md:text-xl font-black text-slate-900 mt-1">
                            {event?.title || "Event no longer available"}
                          </h2>

                          {event?.description && (
                            <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2">
                              {event.description}
                            </p>
                          )}
                        </div>

                        {/* PRICE */}
                        <div className="shrink-0 bg-slate-50 rounded-xl px-4 py-3">
                          <p className="text-[9px] text-slate-400 uppercase font-black">Workshop Fee</p>
                          <div className="flex items-center gap-1 mt-1">
                            <IndianRupee className="w-4 h-4 text-emerald-600" />
                            <span className="text-lg font-black text-slate-900">
                              {formatPrice(event?.price)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* EVENT DETAILS GRID */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
                        {/* DATE */}
                        <div className="flex items-center gap-2.5 bg-slate-50 rounded-xl p-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                            <CalendarDays className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[9px] uppercase font-black text-slate-400">Event Date</p>
                            <p className="text-[11px] font-black text-slate-700 mt-0.5 truncate">
                              {formatDate(event?.date)}
                            </p>
                          </div>
                        </div>

                        {/* TIME */}
                        <div className="flex items-center gap-2.5 bg-slate-50 rounded-xl p-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                            <Clock3 className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[9px] uppercase font-black text-slate-400">Start Time</p>
                            <p className="text-[11px] font-black text-slate-700 mt-0.5 truncate">
                              {formatTime(event?.date)}
                            </p>
                          </div>
                        </div>

                        {/* LOCATION */}
                        <div className="flex items-center gap-2.5 bg-slate-50 rounded-xl p-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[9px] uppercase font-black text-slate-400">Location</p>
                            <p className="text-[11px] font-black text-slate-700 mt-0.5 truncate">
                              {event?.location || "Online"}
                            </p>
                          </div>
                        </div>

                        {/* BOOKED ON */}
                        <div className="flex items-center gap-2.5 bg-slate-50 rounded-xl p-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                            <Ticket className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[9px] uppercase font-black text-slate-400">Booked On</p>
                            <p className="text-[11px] font-black text-slate-700 mt-0.5 truncate">
                              {formatDate(booking.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* ACTION FOOTER */}
                      <div className="mt-5 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          {booking.status === "CONFIRMED" && (
                            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600">
                              <CheckCircle2 className="w-4 h-4" /> Your booking is confirmed
                            </div>
                          )}
                          {booking.status === "PENDING" && (
                            <div className="flex items-center gap-2 text-[10px] font-bold text-amber-600">
                              <Clock3 className="w-4 h-4" /> Waiting for confirmation
                            </div>
                          )}
                          {booking.status === "CANCELLED" && (
                            <div className="flex items-center gap-2 text-[10px] font-bold text-rose-600">
                              <XCircle className="w-4 h-4" /> Booking cancelled
                            </div>
                          )}
                        </div>

                        {event?._id && (
                          <button
                            onClick={() => handleViewCourseDetails(event._id)}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-teal-600 text-white text-xs font-black transition-all duration-200 shadow-sm cursor-pointer"
                          >
                            <GraduationCap className="w-4 h-4" />
                            View Course Details
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PAGINATION */}
        {!loading && !error && pagination.totalPages > 1 && (
          <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-[11px] text-slate-500 font-semibold">
                Showing{" "}
                <span className="font-black text-slate-900">
                  {(pagination.page - 1) * pagination.limit + 1}
                </span>{" "}
                -{" "}
                <span className="font-black text-slate-900">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{" "}
                of <span className="font-black text-slate-900">{pagination.total}</span> bookings
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <div className="flex items-center gap-1">
                  {getPaginationNumbers().map((p, index) => {
                    if (p === "...") {
                      return (
                        <span key={`dots-${index}`} className="w-9 h-9 flex items-center justify-center text-xs font-bold text-slate-400">
                          ...
                        </span>
                      );
                    }
                    return (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p as number)}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition cursor-pointer ${
                          pagination.page === p
                            ? "bg-slate-900 text-white"
                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>

                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="h-6" />
      </main>

      {/* COURSE DETAILS MODAL */}
      {showCourseModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={closeCourseModal}
        >
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden bg-white rounded-3xl shadow-2xl"
          >
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider font-black text-teal-600">
                    Course Information
                  </p>
                  <h2 className="text-lg font-black text-slate-900">Course Details</h2>
                </div>
              </div>

              <button
                onClick={closeCourseModal}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="max-h-[calc(90vh-90px)] overflow-y-auto">
              {courseLoading && (
                <div className="py-24 flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                    <RefreshCw className="w-6 h-6 animate-spin" />
                  </div>
                  <p className="text-sm font-black text-slate-800">Loading course details...</p>
                  <p className="text-xs text-slate-400 mt-1">Please wait a moment</p>
                </div>
              )}

              {!courseLoading && courseError && (
                <div className="py-24 px-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                    <XCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-black text-slate-900 mt-4">Unable to load course</h3>
                  <p className="text-xs text-rose-600 mt-2">{courseError}</p>
                  <button
                    onClick={closeCourseModal}
                    className="mt-5 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-black cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              )}

              {!courseLoading && !courseError && selectedEvent && (
                <div>
                  {/* COURSE IMAGE */}
                  <div className="relative h-64 bg-slate-100">
                    {selectedEvent.image ? (
                      <img
                        src={selectedEvent.image}
                        alt={selectedEvent.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageOff className="w-12 h-12 text-slate-300" />
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/80 to-transparent" />

                    {selectedEvent.type && (
                      <div className="absolute bottom-5 left-6">
                        <span className="px-3 py-1.5 rounded-lg bg-teal-600 text-white text-[10px] font-black uppercase">
                          {selectedEvent.type}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* COURSE CONTENT */}
                  <div className="p-6">
                    <h3 className="text-2xl font-black text-slate-900">{selectedEvent.title}</h3>

                    {selectedEvent.description && (
                      <div className="mt-4">
                        <p className="text-[10px] uppercase tracking-wider font-black text-slate-400">
                          About This Course
                        </p>
                        <p className="text-sm leading-7 text-slate-600 mt-2">
                          {selectedEvent.description}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                      <div className="flex items-center gap-3 p-4 rounded-2xl bg-purple-50 border border-purple-100">
                        <div className="w-10 h-10 rounded-xl bg-white text-purple-600 flex items-center justify-center">
                          <CalendarDays className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[9px] uppercase font-black text-purple-400">Event Date</p>
                          <p className="text-sm font-black text-slate-800 mt-1">
                            {formatDate(selectedEvent.date)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 rounded-2xl bg-teal-50 border border-teal-100">
                        <div className="w-10 h-10 rounded-xl bg-white text-teal-600 flex items-center justify-center">
                          <Clock3 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[9px] uppercase font-black text-teal-400">Start Time</p>
                          <p className="text-sm font-black text-slate-800 mt-1">
                            {formatTime(selectedEvent.date)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                        <div className="w-10 h-10 rounded-xl bg-white text-emerald-600 flex items-center justify-center">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] uppercase font-black text-emerald-400">Location</p>
                          <p className="text-sm font-black text-slate-800 mt-1 truncate">
                            {selectedEvent.location || "Online"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 rounded-2xl bg-orange-50 border border-orange-100">
                        <div className="w-10 h-10 rounded-xl bg-white text-orange-600 flex items-center justify-center">
                          <IndianRupee className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[9px] uppercase font-black text-orange-400">Course Fee</p>
                          <p className="text-sm font-black text-slate-800 mt-1">
                            {formatPrice(selectedEvent.price)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-end">
                      <button
                        onClick={closeCourseModal}
                        className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-teal-600 text-white text-xs font-black transition cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}