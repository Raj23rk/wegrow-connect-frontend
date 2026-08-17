import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import {
  Bell,
  Send,
  Search,
  Eye,
  Users,
  Mail,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// =====================================================
// TYPES
// =====================================================

interface User {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
}

interface Event {
  _id?: string;
  title?: string;
  description?: string;
  type?: string;
  image?: string;
  location?: string;
  date?: string;
  price?: number;
}

interface Notification {
  _id?: string;
  id?: string;
  type?: string;
  title?: string;
  message?: string;

  // API returns userId
  userId?: User;

  // Kept for compatibility
  user?: User;

  email?: string;

  eventId?: Event;

  createdAt?: string;
  updatedAt?: string;

  isRead?: boolean;
  read?: boolean;
}

interface Analytics {
  totalNotifications: number;
  newEventCount: number;
  bookingCount: number;
  readNotificationCount: number;
  unreadNotificationCount: number;
  uniqueUsersReached: number;
  uniqueUsersViewed: number;
  viewRate: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// =====================================================
// API
// =====================================================

const NOTIFICATIONS_API =
  "http://13.239.234.181:4000/api/v1/notifications/admin/all";

// =====================================================
// COMPONENT
// =====================================================

export default function AdminNotifications() {
  // =====================================================
  // STATES
  // =====================================================

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [analytics, setAnalytics] = useState<Analytics>({
    totalNotifications: 0,
    newEventCount: 0,
    bookingCount: 0,
    readNotificationCount: 0,
    unreadNotificationCount: 0,
    uniqueUsersReached: 0,
    uniqueUsersViewed: 0,
    viewRate: "0%",
  });

  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [search, setSearch] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("ALL");

  const [showSendModal, setShowSendModal] = useState<boolean>(false);

  const [formLoading, setFormLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "Push Notification",
    audience: "All Active Users",
    priority: "Normal",
  });

  // =====================================================
  // GET TOKEN
  // =====================================================

  const getToken = () => {
 return sessionStorage.getItem(
      "accessToken"
    );
  };

  // =====================================================
  // FETCH NOTIFICATIONS
  // =====================================================

  const fetchNotifications = async (
    page: number = 1,
    searchValue: string = search,
    typeValue: string = filterType
  ) => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        setError("Authentication token not found. Please login again.");
        return;
      }

      // -------------------------------------------------
      // Build query params
      // -------------------------------------------------

      const params = new URLSearchParams();

      params.append("page", String(page));
      params.append("limit", "10");

      if (searchValue.trim()) {
        params.append("search", searchValue.trim());
      }

      // API filter type
      if (typeValue !== "ALL") {
        params.append("type", typeValue);
      }

      const url = `${NOTIFICATIONS_API}?${params.toString()}`;

      console.log("Notifications API:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      console.log("Notifications API Response:", result);

      if (!response.ok) {
        throw new Error(
          result?.message || "Failed to fetch notifications"
        );
      }

      if (!result?.success) {
        throw new Error(
          result?.message || "Failed to fetch notifications"
        );
      }

      const data = result?.data || {};

      // =================================================
      // NOTIFICATIONS
      // =================================================

      const notificationList = Array.isArray(data?.notifications)
        ? data.notifications
        : [];

      setNotifications(notificationList);

      // =================================================
      // ANALYTICS
      // =================================================

      const apiAnalytics = data?.analytics || {};

      setAnalytics({
        totalNotifications:
          Number(apiAnalytics?.totalNotifications) || 0,

        newEventCount:
          Number(apiAnalytics?.newEventCount) || 0,

        bookingCount:
          Number(apiAnalytics?.bookingCount) || 0,

        readNotificationCount:
          Number(apiAnalytics?.readNotificationCount) || 0,

        unreadNotificationCount:
          Number(apiAnalytics?.unreadNotificationCount) || 0,

        uniqueUsersReached:
          Number(apiAnalytics?.uniqueUsersReached) || 0,

        uniqueUsersViewed:
          Number(apiAnalytics?.uniqueUsersViewed) || 0,

        viewRate:
          apiAnalytics?.viewRate !== undefined
            ? String(apiAnalytics.viewRate)
            : "0%",
      });

      // =================================================
      // PAGINATION
      // =================================================

      const apiPagination = data?.pagination || {};

      setPagination({
        total: Number(apiPagination?.total) || 0,

        page:
          Number(apiPagination?.page) ||
          page,

        limit:
          Number(apiPagination?.limit) ||
          10,

        totalPages:
          Number(apiPagination?.totalPages) || 0,

        hasNextPage:
          Boolean(apiPagination?.hasNextPage),

        hasPreviousPage:
          Boolean(apiPagination?.hasPreviousPage),
      });
    } catch (err: any) {
      console.error("Notification API Error:", err);

      setError(
        err?.message ||
          "Something went wrong while loading notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL API CALL
  // =====================================================

  useEffect(() => {
    fetchNotifications(1);
  }, []);

  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearch = (value: string) => {
    setSearch(value);

    fetchNotifications(1, value, filterType);
  };

  // =====================================================
  // FILTER
  // =====================================================

  const handleFilterChange = (value: string) => {
    setFilterType(value);

    fetchNotifications(1, search, value);
  };

  // =====================================================
  // PAGINATION
  // =====================================================

  const goToPage = (page: number) => {
    if (page < 1 || page > pagination.totalPages) {
      return;
    }

    fetchNotifications(page, search, filterType);
  };

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date?: string) => {
    if (!date) return "-";

    try {
      return new Date(date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return date;
    }
  };

  // =====================================================
  // USER NAME
  // =====================================================

  const getUserName = (notification: Notification) => {
    const user = notification?.userId || notification?.user;

    if (!user) {
      return notification?.email || "User";
    }

    const fullName = [
      user?.firstName,
      user?.lastName,
    ]
      .filter(Boolean)
      .join(" ");

    return fullName || user?.email || "User";
  };

  // =====================================================
  // USER EMAIL
  // =====================================================

  const getUserEmail = (notification: Notification) => {
    const user = notification?.userId || notification?.user;

    return (
      user?.email ||
      notification?.email ||
      "-"
    );
  };

  // =====================================================
  // TYPE BADGE
  // =====================================================

  const getTypeBadge = (type?: string) => {
    const value = type?.toUpperCase() || "SYSTEM";

    if (value === "NEW_EVENT") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black">
          <Calendar className="w-3 h-3" />
          NEW EVENT
        </span>
      );
    }

    if (value === "BOOKING_CREATED") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-black">
          <CheckCircle2 className="w-3 h-3" />
          BOOKING CREATED
        </span>
      );
    }

    if (value === "BOOKING_CONFIRMED") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black">
          <CheckCircle2 className="w-3 h-3" />
          BOOKING CONFIRMED
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black">
        <Bell className="w-3 h-3" />
        {value}
      </span>
    );
  };

  // =====================================================
  // READ STATUS
  // =====================================================

  const getReadStatus = (notification: Notification) => {
    const isRead =
      notification?.isRead === true ||
      notification?.read === true;

    if (isRead) {
      return (
        <span className="inline-flex items-center gap-1 text-green-600 text-[10px] font-black">
          <CheckCircle2 className="w-3 h-3" />
          Read
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 text-orange-500 text-[10px] font-black">
        <Clock className="w-3 h-3" />
        Unread
      </span>
    );
  };

  // =====================================================
  // SEND BROADCAST
  // =====================================================

  const handleSendBroadcast = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setFormLoading(true);

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      /*
       * IMPORTANT:
       *
       * You have not provided the actual POST broadcast endpoint.
       *
       * So don't send a fake API request here.
       *
       * Replace BROADCAST_API with your real NestJS endpoint.
       */

      const BROADCAST_API =
        "http://13.239.234.181:4000/api/v1/notifications/admin/broadcast";

      const response = await fetch(BROADCAST_API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || "Failed to send notification"
        );
      }

      alert(
        result?.message ||
          "Notification sent successfully."
      );

      setShowSendModal(false);

      setFormData({
        title: "",
        message: "",
        type: "Push Notification",
        audience: "All Active Users",
        priority: "Normal",
      });

      // Refresh first page
      await fetchNotifications(1);
    } catch (err: any) {
      console.error("Broadcast Error:", err);

      alert(
        err?.message ||
          "Something went wrong while sending notification."
      );
    } finally {
      setFormLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50/60 font-sans text-slate-800 antialiased">
      <Sidebar />

      <main className="flex-1 h-screen overflow-y-auto p-8 space-y-6">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                <Bell className="w-5 h-5" />
              </div>

              <div>
                <h1 className="text-2xl font-black text-slate-900">
                  Notifications
                </h1>

                <p className="text-xs text-slate-400 font-semibold">
                  Manage and monitor notification activity
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                fetchNotifications(
                  pagination.page,
                  search,
                  filterType
                )
              }
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  loading ? "animate-spin" : ""
                }`}
              />

              Refresh
            </button>

            <button
              type="button"
              onClick={() => setShowSendModal(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />

              Send Notification
            </button>
          </div>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>

              <div>
                <p className="text-sm font-black text-red-700">
                  Unable to load notifications
                </p>

                <p className="text-xs text-red-500 mt-0.5">
                  {error}
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                fetchNotifications(
                  pagination.page,
                  search,
                  filterType
                )
              }
              className="px-3 py-2 rounded-lg bg-red-600 text-white text-xs font-bold cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* =================================================
            ANALYTICS CARDS
        ================================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total */}

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">
                Total Notifications
              </p>

              <h2 className="text-xl font-black text-slate-900 mt-0.5">
                {analytics.totalNotifications.toLocaleString()}
              </h2>

              <p className="text-[10px] text-slate-400 mt-1">
                Total notifications
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
          </div>

          {/* New Event */}

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">
                New Event Mail
              </p>

              <h2 className="text-xl font-black text-slate-900 mt-0.5">
                {analytics.newEventCount.toLocaleString()}
              </h2>

              <p className="text-[10px] text-slate-400 mt-1">
                NEW_EVENT notifications
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>

          {/* Booking */}

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">
                Booking Count
              </p>

              <h2 className="text-xl font-black text-slate-900 mt-0.5">
                {analytics.bookingCount.toLocaleString()}
              </h2>

              <p className="text-[10px] text-slate-400 mt-1">
                Booking notifications
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          {/* User View */}

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">
                User View Count
              </p>

              <h2 className="text-xl font-black text-slate-900 mt-0.5">
                {analytics.uniqueUsersViewed.toLocaleString()}
              </h2>

              <p className="text-[10px] text-slate-400 mt-1">
                View rate{" "}
                <span className="font-black text-slate-900">
                  {analytics.viewRate}
                </span>
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* =================================================
            SECOND ANALYTICS ROW
        ================================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Users Reached */}

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">
                Users Reached
              </p>

              <h2 className="text-xl font-black text-slate-900 mt-0.5">
                {analytics.uniqueUsersReached.toLocaleString()}
              </h2>

              <p className="text-[10px] text-slate-400 mt-1">
                Users who received notifications
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          {/* Read */}

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">
                Read Notifications
              </p>

              <h2 className="text-xl font-black text-slate-900 mt-0.5">
                {analytics.readNotificationCount.toLocaleString()}
              </h2>

              <p className="text-[10px] text-green-500 mt-1 font-semibold">
                Successfully viewed
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          {/* Unread */}

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">
                Unread Notifications
              </p>

              <h2 className="text-xl font-black text-slate-900 mt-0.5">
                {analytics.unreadNotificationCount.toLocaleString()}
              </h2>

              <p className="text-[10px] text-orange-500 mt-1 font-semibold">
                Waiting for user view
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* =================================================
            FILTER SECTION
        ================================================= */}

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search */}

            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

              <input
                type="text"
                placeholder="Search notifications..."
                value={search}
                onChange={(e) =>
                  handleSearch(e.target.value)
                }
                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              />
            </div>

            {/* Filter */}

            <select
              value={filterType}
              onChange={(e) =>
                handleFilterChange(e.target.value)
              }
              className="px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm font-bold outline-none cursor-pointer"
            >
              <option value="ALL">
                All Notifications
              </option>

              <option value="NEW_EVENT">
                New Event
              </option>

              <option value="BOOKING_CREATED">
                Booking Created
              </option>

              <option value="BOOKING_CONFIRMED">
                Booking Confirmed
              </option>
            </select>
          </div>
        </div>

        {/* =================================================
            NOTIFICATIONS TABLE
        ================================================= */}

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Table Header */}

          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-slate-900">
                Notification History
              </h2>

              <p className="text-[10px] text-slate-400 mt-1">
                {pagination.total.toLocaleString()} notifications found
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <Bell className="w-4 h-4" />

              Notification Activity
            </div>
          </div>

          {/* Loading */}

          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center">
              <RefreshCw className="w-7 h-7 text-blue-600 animate-spin" />

              <p className="text-sm font-bold text-slate-500 mt-3">
                Loading notifications...
              </p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                <Bell className="w-7 h-7 text-slate-400" />
              </div>

              <p className="text-sm font-black text-slate-600 mt-4">
                No notifications found
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Try changing your search or filter.
              </p>
            </div>
          ) : (
            <>
              {/* Table */}

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="text-left px-5 py-3 text-[10px] font-black uppercase text-slate-400">
                        Notification
                      </th>

                      <th className="text-left px-5 py-3 text-[10px] font-black uppercase text-slate-400">
                        Type
                      </th>

                      <th className="text-left px-5 py-3 text-[10px] font-black uppercase text-slate-400">
                        User
                      </th>

                      <th className="text-left px-5 py-3 text-[10px] font-black uppercase text-slate-400">
                        Event
                      </th>

                      <th className="text-left px-5 py-3 text-[10px] font-black uppercase text-slate-400">
                        Status
                      </th>

                      <th className="text-left px-5 py-3 text-[10px] font-black uppercase text-slate-400">
                        Date
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {notifications.map(
                      (notification, index) => {
                        const key =
                          notification?._id ||
                          notification?.id ||
                          `${index}`;

                        return (
                          <tr
                            key={key}
                            className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70 transition"
                          >
                            {/* Notification */}

                            <td className="px-5 py-4">
                              <div className="max-w-md">
                                <p className="text-sm font-black text-slate-800">
                                  {notification?.title ||
                                    "Notification"}
                                </p>

                                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                                  {notification?.message ||
                                    "No message available"}
                                </p>
                              </div>
                            </td>

                            {/* Type */}

                            <td className="px-5 py-4">
                              {getTypeBadge(
                                notification?.type
                              )}
                            </td>

                            {/* User */}

                            <td className="px-5 py-4">
                              <div>
                                <p className="text-xs font-black text-slate-700">
                                  {getUserName(
                                    notification
                                  )}
                                </p>

                                <p className="text-[10px] text-slate-400 mt-0.5">
                                  {getUserEmail(
                                    notification
                                  )}
                                </p>
                              </div>
                            </td>

                            {/* Event */}

                            <td className="px-5 py-4">
                              <div className="max-w-[180px]">
                                <p className="text-xs font-black text-slate-700 truncate">
                                  {notification?.eventId
                                    ?.title || "-"}
                                </p>

                                {notification?.eventId
                                  ?.location && (
                                  <p className="text-[10px] text-slate-400 mt-0.5">
                                    {
                                      notification
                                        .eventId
                                        .location
                                    }
                                  </p>
                                )}
                              </div>
                            </td>

                            {/* Status */}

                            <td className="px-5 py-4">
                              {getReadStatus(
                                notification
                              )}
                            </td>

                            {/* Date */}

                            <td className="px-5 py-4">
                              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <Clock className="w-3.5 h-3.5" />

                                {formatDate(
                                  notification?.createdAt
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>

              {/* =================================================
                  PAGINATION
              ================================================= */}

              <div className="px-5 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-400 font-semibold">
                  Page{" "}
                  <span className="font-black text-slate-700">
                    {pagination.page}
                  </span>{" "}
                  of{" "}
                  <span className="font-black text-slate-700">
                    {pagination.totalPages}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={
                      !pagination.hasPreviousPage ||
                      loading
                    }
                    onClick={() =>
                      goToPage(pagination.page - 1)
                    }
                    className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs font-bold flex items-center gap-1 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />

                    Previous
                  </button>

                  <div className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700 text-xs font-black">
                    {pagination.page}
                  </div>

                  <button
                    type="button"
                    disabled={
                      !pagination.hasNextPage ||
                      loading
                    }
                    onClick={() =>
                      goToPage(pagination.page + 1)
                    }
                    className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs font-bold flex items-center gap-1 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next

                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="h-8" />
      </main>

      {/* =================================================
          SEND NOTIFICATION MODAL
      ================================================= */}

      {showSendModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            {/* Modal Header */}

            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-slate-900">
                  Send Notification
                </h2>

                <p className="text-[10px] text-slate-400 mt-1">
                  Broadcast a notification to your users
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowSendModal(false)
                }
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            {/* Modal Form */}

            <form
              onSubmit={handleSendBroadcast}
              className="p-5 space-y-4"
            >
              {/* Title */}

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Notification Title
                </label>

                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value,
                    })
                  }
                  placeholder="Enter notification title"
                  className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none font-bold text-sm"
                />
              </div>

              {/* Message */}

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Message
                </label>

                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      message: e.target.value,
                    })
                  }
                  placeholder="Enter notification message"
                  className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none font-bold text-sm resize-none"
                />
              </div>

              {/* Type + Audience */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Notification Type
                  </label>

                  <select
                    className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none font-bold"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value,
                      })
                    }
                  >
                    <option value="Push Notification">
                      Push Notification
                    </option>

                    <option value="Email Broadcast">
                      Email Broadcast
                    </option>

                    <option value="System Audit">
                      System Alert
                    </option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Target Audience
                  </label>

                  <select
                    className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none font-bold"
                    value={formData.audience}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        audience: e.target.value,
                      })
                    }
                  >
                    <option value="All Active Users">
                      All Active Users
                    </option>

                    <option value="Enrolled Students">
                      Enrolled Students
                    </option>

                    <option value="Mentors & Speakers">
                      Mentors & Speakers
                    </option>

                    <option value="Businesses & Hiring">
                      Businesses
                    </option>
                  </select>
                </div>
              </div>

              {/* Priority */}

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Priority
                </label>

                <select
                  className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none font-bold"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: e.target.value,
                    })
                  }
                >
                  <option value="Normal">
                    Normal Priority
                  </option>

                  <option value="High">
                    High Priority
                  </option>

                  <option value="Urgent">
                    Urgent Alert
                  </option>
                </select>
              </div>

              {/* Buttons */}

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setShowSendModal(false)
                  }
                  disabled={formLoading}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {formLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Broadcast Now</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}