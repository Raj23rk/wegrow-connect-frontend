import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import Sidebar from "../../components/Sidebar";

import {
  Search,
  Calendar,
  IndianRupee,
  Users,
  Trash2,
  X,
  CheckCircle2,
  Clock3,
  XCircle,
  Pencil,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Mail,
  Phone,
  AlertCircle,
} from "lucide-react";

// =====================================================
// API
// =====================================================

const API_BASE =
  "https://113d-13-239-234-181.ngrok-free.app/api/v1";

const ALL_BOOKINGS_API =
  `${API_BASE}/bookings/all-bookings`;

const BOOKINGS_API =
  `${API_BASE}/bookings`;

// =====================================================
// TYPES
// =====================================================

type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED";

interface BookingUser {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
}

interface BookingEvent {
  _id?: string;
  title?: string;
  description?: string;
  type?: string;
  image?: string;
  location?: string;
  date?: string;
  price?: number;
}

interface Booking {
  _id: string;
  user?: BookingUser;
  event?: BookingEvent;
  status: BookingStatus | string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Pagination {
  page?: number;
  currentPage?: number;
  limit?: number;
  total?: number;
  totalBookings?: number;
  count?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasNext?: boolean;
  hasPreviousPage?: boolean;
  hasPrev?: boolean;
}

interface BookingCounts {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
}

type ToastType = "success" | "error";

interface ToastState {
  show: boolean;
  type: ToastType;
  message: string;
}

// =====================================================
// COMPONENT
// =====================================================

export default function WorkshopsPage() {
  // =====================================================
  // BOOKINGS
  // =====================================================

  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [loading, setLoading] =
    useState(true);

  // =====================================================
  // SEARCH
  // =====================================================

  const [searchTerm, setSearchTerm] =
    useState("");

  // =====================================================
  // STATUS FILTER
  // =====================================================

  const [selectedStatus, setSelectedStatus] =
    useState("All");

  // =====================================================
  // PAGINATION
  // =====================================================

  const [page, setPage] =
    useState(1);

  const [limit] =
    useState(10);

  const [totalPages, setTotalPages] =
    useState(1);

  const [totalBookings, setTotalBookings] =
    useState(0);

  const [hasNextPage, setHasNextPage] =
    useState(false);

  const [hasPreviousPage, setHasPreviousPage] =
    useState(false);

  // =====================================================
  // COUNTS
  // =====================================================

  const [counts, setCounts] =
    useState<BookingCounts>({
      total: 0,
      pending: 0,
      confirmed: 0,
      cancelled: 0,
    });

  // =====================================================
  // STATUS MODAL
  // =====================================================

  const [showStatusModal, setShowStatusModal] =
    useState(false);

  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);

  const [newStatus, setNewStatus] =
    useState<BookingStatus>("PENDING");

  const [updatingStatus, setUpdatingStatus] =
    useState(false);

  // =====================================================
  // DELETE
  // =====================================================

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  // =====================================================
  // TOAST
  // =====================================================

  const [toast, setToast] =
    useState<ToastState>({
      show: false,
      type: "success",
      message: "",
    });

  // =====================================================
  // SHOW TOAST
  // =====================================================

  const showToast = useCallback(
    (
      type: ToastType,
      message: string,
    ) => {
      setToast({
        show: true,
        type,
        message,
      });

      setTimeout(() => {
        setToast((current) => ({
          ...current,
          show: false,
        }));
      }, 3000);
    },
    [],
  );

  // =====================================================
  // CLOSE TOAST
  // =====================================================

  const closeToast = () => {
    setToast((current) => ({
      ...current,
      show: false,
    }));
  };

  // =====================================================
  // TOKEN
  // =====================================================

  const getToken = () => {
   return sessionStorage.getItem(
      "accessToken"
    );
  };

  // =====================================================
  // NORMALIZE STATUS
  // =====================================================

  const normalizeStatus = (
    status?: string,
  ) => {
    return String(status || "")
      .trim()
      .toUpperCase();
  };

  // =====================================================
  // GET PAGINATION
  // =====================================================

  const getPagination = (
    result: any,
  ): Pagination => {
    return (
      result?.data?.pagination ||
      result?.pagination ||
      result?.data?.meta ||
      result?.meta ||
      {}
    );
  };

  // =====================================================
  // GET COUNTS
  // =====================================================

  const getCounts = (
    result: any,
  ): BookingCounts => {
    const apiCounts =
      result?.data?.counts ||
      result?.counts ||
      {};

    return {
      total: Number(
        apiCounts?.total ?? 0,
      ),

      pending: Number(
        apiCounts?.pending ?? 0,
      ),

      confirmed: Number(
        apiCounts?.confirmed ?? 0,
      ),

      cancelled: Number(
        apiCounts?.cancelled ?? 0,
      ),
    };
  };

  // =====================================================
  // GET BOOKINGS
  // =====================================================

  const getBookingsFromResponse = (
    result: any,
  ): Booking[] => {
    if (
      Array.isArray(
        result?.data?.bookings,
      )
    ) {
      return result.data.bookings;
    }

    if (
      Array.isArray(
        result?.bookings,
      )
    ) {
      return result.bookings;
    }

    if (
      Array.isArray(
        result?.data,
      )
    ) {
      return result.data;
    }

    return [];
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (
    date?: string,
  ) => {
    if (!date) {
      return "N/A";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime(),
      )
    ) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      },
    );
  };

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (
    date?: string,
  ) => {
    if (!date) {
      return "";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime(),
      )
    ) {
      return "";
    }

    return parsedDate.toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      },
    );
  };

  // =====================================================
  // FORMAT PRICE
  // =====================================================

  const formatPrice = (
    price?: number,
  ) => {
    const amount =
      Number(price ?? 0);

    if (amount === 0) {
      return "Free";
    }

    return `₹${amount.toLocaleString(
      "en-IN",
    )}`;
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (
    status?: string,
  ) => {
    switch (
      normalizeStatus(status)
    ) {
      case "CONFIRMED":
        return {
          className:
            "border-emerald-200 bg-emerald-50 text-emerald-700",
          icon: (
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          ),
        };

      case "CANCELLED":
        return {
          className:
            "border-red-200 bg-red-50 text-red-700",
          icon: (
            <XCircle className="h-3.5 w-3.5 shrink-0" />
          ),
        };

      case "PENDING":
      default:
        return {
          className:
            "border-orange-200 bg-orange-50 text-orange-700",
          icon: (
            <Clock3 className="h-3.5 w-3.5 shrink-0" />
          ),
        };
    }
  };

  // =====================================================
  // FETCH BOOKINGS
  // =====================================================

  const fetchBookings =
    useCallback(
      async (
        currentPage = 1,
        search = "",
        status = "All",
      ) => {
        try {
          setLoading(true);

          const token =
            getToken();

          if (!token) {
            showToast(
              "error",
              "Authentication token not found. Please login again.",
            );

            return;
          }

          // =================================================
          // QUERY
          // =================================================

          const params =
            new URLSearchParams();

          params.set(
            "page",
            String(currentPage),
          );

          params.set(
            "limit",
            String(limit),
          );

          // SEARCH

          if (search.trim()) {
            params.set(
              "search",
              search.trim(),
            );
          }

          // STATUS

          if (
            status !== "All"
          ) {
            params.set(
              "status",
              normalizeStatus(status),
            );
          }

          const url =
            `${ALL_BOOKINGS_API}?${params.toString()}`;

          console.log(
            "GET BOOKINGS:",
            url,
          );

          const response =
            await fetch(url, {
              method: "GET",

              headers: {
                Authorization:
                  `Bearer ${token}`,

                "Content-Type":
                  "application/json",
              },
            });

          let result: any = {};

          try {
            result =
              await response.json();
          } catch {
            result = {};
          }

          console.log(
            "BOOKINGS RESPONSE:",
            result,
          );

          if (!response.ok) {
            const message =
              Array.isArray(
                result?.message,
              )
                ? result.message.join(
                    ", ",
                  )
                : result?.message ||
                  "Failed to fetch bookings.";

            throw new Error(
              message,
            );
          }

          // =================================================
          // GET BOOKINGS
          // =================================================

          let apiBookings =
            getBookingsFromResponse(
              result,
            );

          // =================================================
          // DEFENSIVE STATUS FILTER
          // =================================================

          if (
            status !== "All"
          ) {
            const wantedStatus =
              normalizeStatus(status);

            apiBookings =
              apiBookings.filter(
                (booking) =>
                  normalizeStatus(
                    booking.status,
                  ) ===
                  wantedStatus,
              );
          }

          setBookings(
            apiBookings,
          );

          // =================================================
          // COUNTS
          // =================================================

          const apiCounts =
            getCounts(result);

          setCounts(
            apiCounts,
          );

          // =================================================
          // PAGINATION
          // =================================================

          const pagination =
            getPagination(result);

          const apiCurrentPage =
            Number(
              pagination?.page ??
                pagination?.currentPage ??
                currentPage,
            );

          const apiTotalPages =
            Number(
              pagination?.totalPages ??
                1,
            );

          const apiTotal =
            Number(
              pagination?.total ??
                pagination?.totalBookings ??
                pagination?.count ??
                apiCounts.total,
            );

          const apiHasNext =
            Boolean(
              pagination?.hasNextPage ??
                pagination?.hasNext ??
                apiCurrentPage <
                  apiTotalPages,
            );

          const apiHasPrevious =
            Boolean(
              pagination?.hasPreviousPage ??
                pagination?.hasPrev ??
                apiCurrentPage > 1,
            );

          setPage(
            apiCurrentPage,
          );

          setTotalPages(
            apiTotalPages > 0
              ? apiTotalPages
              : 1,
          );

          setTotalBookings(
            apiTotal,
          );

          setHasNextPage(
            apiHasNext,
          );

          setHasPreviousPage(
            apiHasPrevious,
          );
        } catch (error: any) {
          console.error(
            "Failed to fetch bookings:",
            error,
          );

          setBookings([]);

          setCounts({
            total: 0,
            pending: 0,
            confirmed: 0,
            cancelled: 0,
          });

          setTotalBookings(0);
          setTotalPages(1);
          setHasNextPage(false);
          setHasPreviousPage(false);

          showToast(
            "error",
            error?.message ||
              "Failed to fetch bookings.",
          );
        } finally {
          setLoading(false);
        }
      },
      [limit, showToast],
    );

  // =====================================================
  // INITIAL + FILTER
  // =====================================================

  useEffect(() => {
    const timer =
      setTimeout(() => {
        fetchBookings(
          1,
          searchTerm,
          selectedStatus,
        );
      }, 300);

    return () =>
      clearTimeout(timer);
  }, [
    searchTerm,
    selectedStatus,
    fetchBookings,
  ]);

  // =====================================================
  // PAGE CHANGE
  // =====================================================

  const handlePageChange =
    (
      newPage: number,
    ) => {
      if (
        loading ||
        newPage < 1 ||
        newPage > totalPages ||
        newPage === page
      ) {
        return;
      }

      fetchBookings(
        newPage,
        searchTerm,
        selectedStatus,
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

  // =====================================================
  // PREVIOUS
  // =====================================================

  const handlePrevious =
    () => {
      if (
        !hasPreviousPage ||
        loading
      ) {
        return;
      }

      handlePageChange(
        page - 1,
      );
    };

  // =====================================================
  // NEXT
  // =====================================================

  const handleNext =
    () => {
      if (
        !hasNextPage ||
        loading
      ) {
        return;
      }

      handlePageChange(
        page + 1,
      );
    };

  // =====================================================
  // PAGE NUMBERS
  // =====================================================

  const getPageNumbers =
    () => {
      if (
        totalPages <= 5
      ) {
        return Array.from(
          {
            length: totalPages,
          },
          (_, i) =>
            i + 1,
        );
      }

      if (page <= 3) {
        return [
          1,
          2,
          3,
          4,
          5,
        ];
      }

      if (
        page >=
        totalPages - 2
      ) {
        return [
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        ];
      }

      return [
        page - 2,
        page - 1,
        page,
        page + 1,
        page + 2,
      ];
    };

  // =====================================================
  // EDIT STATUS
  // =====================================================

  const handleEditStatus =
    (
      booking: Booking,
    ) => {
      setSelectedBooking(
        booking,
      );

      const status =
        normalizeStatus(
          booking.status ||
            "PENDING",
        );

      if (
        status === "PENDING" ||
        status === "CONFIRMED" ||
        status === "CANCELLED"
      ) {
        setNewStatus(
          status as BookingStatus,
        );
      } else {
        setNewStatus(
          "PENDING",
        );
      }

      setShowStatusModal(
        true,
      );
    };

  // =====================================================
  // UPDATE STATUS
  // PUT /bookings/:id/status
  // =====================================================

  const handleUpdateStatus =
    async () => {
      if (
        !selectedBooking ||
        updatingStatus
      ) {
        return;
      }

      try {
        setUpdatingStatus(
          true,
        );

        const token =
          getToken();

        if (!token) {
          showToast(
            "error",
            "Authentication token not found. Please login again.",
          );

          return;
        }

        const url =
          `${BOOKINGS_API}/${selectedBooking._id}/status`;

        console.log(
          "UPDATE STATUS:",
          url,
        );

        const response =
          await fetch(url, {
            method: "PUT",

            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              status:
                newStatus,
            }),
          });

        let result: any = {};

        try {
          result =
            await response.json();
        } catch {
          result = {};
        }

        console.log(
          "UPDATE STATUS RESPONSE:",
          result,
        );

        if (!response.ok) {
          const message =
            Array.isArray(
              result?.message,
            )
              ? result.message.join(
                  ", ",
                )
              : result?.message ||
                "Failed to update booking status.";

          throw new Error(
            message,
          );
        }

        setShowStatusModal(
          false,
        );

        setSelectedBooking(
          null,
        );

        await fetchBookings(
          page,
          searchTerm,
          selectedStatus,
        );

        showToast(
          "success",
          result?.message ||
            "Booking status updated successfully.",
        );
      } catch (error: any) {
        console.error(
          "Update booking status error:",
          error,
        );

        showToast(
          "error",
          error?.message ||
            "Failed to update booking status.",
        );
      } finally {
        setUpdatingStatus(
          false,
        );
      }
    };

  // =====================================================
  // DELETE BOOKING
  // DELETE /bookings/:id
  // =====================================================

  const handleDelete =
    async (
      id: string,
    ) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to delete this booking?",
        );

      if (!confirmed) {
        return;
      }

      try {
        setDeletingId(id);

        const token =
          getToken();

        if (!token) {
          showToast(
            "error",
            "Authentication token not found. Please login again.",
          );

          return;
        }

        const url =
          `${BOOKINGS_API}/${id}`;

        console.log(
          "DELETE BOOKING:",
          url,
        );

        const response =
          await fetch(url, {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },
          });

        let result: any = {};

        try {
          result =
            await response.json();
        } catch {
          result = {};
        }

        console.log(
          "DELETE RESPONSE:",
          result,
        );

        if (!response.ok) {
          const message =
            Array.isArray(
              result?.message,
            )
              ? result.message.join(
                  ", ",
                )
              : result?.message ||
                "Failed to delete booking.";

          throw new Error(
            message,
          );
        }

        // =================================================
        // REFRESH CURRENT PAGE
        // =================================================

        await fetchBookings(
          page,
          searchTerm,
          selectedStatus,
        );

        // =================================================
        // IF CURRENT PAGE BECOMES EMPTY
        // GO TO PREVIOUS PAGE
        // =================================================

        if (
          bookings.length === 1 &&
          page > 1
        ) {
          await fetchBookings(
            page - 1,
            searchTerm,
            selectedStatus,
          );
        }

        showToast(
          "success",
          result?.message ||
            "Booking deleted successfully.",
        );
      } catch (error: any) {
        console.error(
          "Delete booking error:",
          error,
        );

        showToast(
          "error",
          error?.message ||
            "Failed to delete booking.",
        );
      } finally {
        setDeletingId(null);
      }
    };

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh =
    () => {
      fetchBookings(
        page,
        searchTerm,
        selectedStatus,
      );
    };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50/60 font-sans text-slate-800 antialiased">

      <Sidebar />

      <main className="min-w-0 min-h-0 flex-1 overflow-y-auto">

        <div className="min-h-full p-4 md:p-8">

          {/* =====================================================
              HEADER
          ===================================================== */}

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                Booking Management
              </h1>

              <p className="mt-1 text-xs font-medium text-slate-500">
                Manage workshop bookings, members,
                payment details, and booking status.
              </p>
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  loading
                    ? "animate-spin"
                    : ""
                }`}
              />

              Refresh
            </button>

          </div>

          {/* =====================================================
              SUMMARY
          ===================================================== */}

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {/* TOTAL */}

            <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Total Bookings
                </p>

                <h2 className="mt-0.5 text-xl font-black text-slate-900">
                  {counts.total}
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Users className="h-5 w-5" />
              </div>

            </div>

            {/* PENDING */}

            <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Pending
                </p>

                <h2 className="mt-0.5 text-xl font-black text-orange-600">
                  {counts.pending}
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <Clock3 className="h-5 w-5" />
              </div>

            </div>

            {/* CONFIRMED */}

            <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Confirmed
                </p>

                <h2 className="mt-0.5 text-xl font-black text-emerald-600">
                  {counts.confirmed}
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>

            </div>

            {/* CANCELLED */}

            <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Cancelled
                </p>

                <h2 className="mt-0.5 text-xl font-black text-red-600">
                  {counts.cancelled}
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <XCircle className="h-5 w-5" />
              </div>

            </div>

          </div>

          {/* =====================================================
              TABLE
          ===================================================== */}

          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">

            {/* FILTER */}

            <div className="flex flex-col gap-4 border-b border-slate-200 p-4 md:p-5 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex w-full items-center gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 lg:w-auto">

                {[
                  "All",
                  "PENDING",
                  "CONFIRMED",
                  "CANCELLED",
                ].map(
                  (status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => {
                        setPage(1);
                        setSelectedStatus(
                          status,
                        );
                      }}
                      className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                        selectedStatus ===
                        status
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      {status}
                    </button>
                  ),
                )}

              </div>

              <div className="relative w-full sm:w-80">

                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  placeholder="Search name, email, event..."
                  value={searchTerm}
                  onChange={(e) => {
                    setPage(1);
                    setSearchTerm(
                      e.target.value,
                    );
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-3 text-xs outline-none transition-all focus:border-blue-600 focus:bg-white"
                />

              </div>

            </div>

            {/* LOADING */}

            {loading ? (

              <div className="p-16 text-center">

                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

                <p className="mt-4 text-xs font-medium text-slate-400">
                  Loading bookings...
                </p>

              </div>

            ) : bookings.length === 0 ? (

              <div className="p-16 text-center">

                <Users className="mx-auto h-10 w-10 text-slate-300" />

                <p className="mt-4 text-sm font-bold text-slate-500">
                  No bookings found
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Try changing your search or
                  status filter.
                </p>

              </div>

            ) : (

              <div className="relative w-full overflow-x-auto">

                <table className="w-full min-w-[1500px] table-fixed border-collapse">

                  <colgroup>
                    <col className="w-[60px]" />
                    <col className="w-[170px]" />
                    <col className="w-[235px]" />
                    <col className="w-[150px]" />
                    <col className="w-[210px]" />
                    <col className="w-[110px]" />
                    <col className="w-[150px]" />
                    <col className="w-[110px]" />
                    <col className="w-[150px]" />
                    <col className="w-[135px]" />
                    <col className="w-[115px]" />
                  </colgroup>

                  <thead>

                    <tr className="border-b border-slate-200 bg-slate-50/90">

                      <th className="px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                        S.No
                      </th>

                      <th className="px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                        Name
                      </th>

                      <th className="px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                        Email
                      </th>

                      <th className="px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                        Phone
                      </th>

                      <th className="px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                        Event Title
                      </th>

                      <th className="px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                        Type
                      </th>

                      <th className="px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                        Date
                      </th>

                      <th className="px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                        Price
                      </th>

                      <th className="px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                        Location
                      </th>

                      <th className="px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                        Status
                      </th>

                      <th className="sticky right-0 z-20 bg-slate-50 px-3 py-3 text-center text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {bookings.map(
                      (
                        booking,
                        index,
                      ) => {

                        const statusStyle =
                          getStatusStyle(
                            booking.status,
                          );

                        const serialNumber =
                          (page - 1) *
                            limit +
                          index +
                          1;

                        return (

                          <tr
                            key={
                              booking._id
                            }
                            className="border-b border-slate-100 transition hover:bg-slate-50/70"
                          >

                            {/* S.NO */}

                            <td className="px-4 py-4 align-middle">

                              <span className="text-xs font-bold text-slate-500">
                                {serialNumber}
                              </span>

                            </td>

                            {/* NAME */}

                            <td className="px-4 py-4 align-middle">

                              <div className="flex min-w-0 items-center gap-2">

                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-black text-blue-600">

                                  {(
                                    booking
                                      .user
                                      ?.name ||
                                    "U"
                                  )
                                    .charAt(
                                      0,
                                    )
                                    .toUpperCase()}

                                </div>

                                <p className="truncate text-xs font-bold text-slate-800">
                                  {booking
                                    .user
                                    ?.name ||
                                    "N/A"}
                                </p>

                              </div>

                            </td>

                            {/* EMAIL */}

                            <td className="px-4 py-4 align-middle">

                              <div className="flex min-w-0 items-center gap-1.5">

                                <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />

                                <span className="truncate text-xs text-slate-600">
                                  {booking
                                    .user
                                    ?.email ||
                                    "N/A"}
                                </span>

                              </div>

                            </td>

                            {/* PHONE */}

                            <td className="px-4 py-4 align-middle">

                              <div className="flex items-center gap-1.5">

                                <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />

                                <span className="whitespace-nowrap text-xs text-slate-600">
                                  {booking
                                    .user
                                    ?.phone ||
                                    "N/A"}
                                </span>

                              </div>

                            </td>

                            {/* EVENT */}

                            <td className="px-4 py-4 align-middle">

                              <p
                                title={
                                  booking
                                    .event
                                    ?.title ||
                                  "N/A"
                                }
                                className="line-clamp-2 text-xs font-bold leading-5 text-slate-800"
                              >
                                {booking
                                  .event
                                  ?.title ||
                                  "N/A"}
                              </p>

                            </td>

                            {/* TYPE */}

                            <td className="px-4 py-4 align-middle">

                              <span
                                className={`inline-flex rounded-md border px-2.5 py-1 text-[10px] font-extrabold ${
                                  normalizeStatus(
                                    booking
                                      .event
                                      ?.type,
                                  ) ===
                                  "STUDENT"
                                    ? "border-purple-200 bg-purple-50 text-purple-600"
                                    : "border-blue-200 bg-blue-50 text-blue-600"
                                }`}
                              >
                                {normalizeStatus(
                                  booking
                                    .event
                                    ?.type ||
                                  "N/A",
                                )}
                              </span>

                            </td>

                            {/* DATE */}

                            <td className="px-4 py-4 align-middle">

                              <div>

                                <div className="flex items-center gap-1.5">

                                  <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-400" />

                                  <span className="whitespace-nowrap text-xs font-medium text-slate-700">
                                    {formatDate(
                                      booking
                                        .event
                                        ?.date,
                                    )}
                                  </span>

                                </div>

                                <p className="ml-5 mt-0.5 text-[10px] text-slate-400">
                                  {formatTime(
                                    booking
                                      .event
                                      ?.date,
                                  )}
                                </p>

                              </div>

                            </td>

                            {/* PRICE */}

                            <td className="px-4 py-4 align-middle">

                              <div className="flex items-center gap-1">

                                <IndianRupee className="h-3.5 w-3.5 shrink-0 text-slate-400" />

                                <span className="whitespace-nowrap text-xs font-black text-slate-800">
                                  {formatPrice(
                                    booking
                                      .event
                                      ?.price,
                                  )}
                                </span>

                              </div>

                            </td>

                            {/* LOCATION */}

                            <td className="px-4 py-4 align-middle">

                              <div className="flex min-w-0 items-center gap-1.5">

                                <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />

                                <span
                                  title={
                                    booking
                                      .event
                                      ?.location ||
                                    "N/A"
                                  }
                                  className="truncate text-xs text-slate-600"
                                >
                                  {booking
                                    .event
                                    ?.location ||
                                    "N/A"}
                                </span>

                              </div>

                            </td>

                            {/* STATUS */}

                            <td className="px-4 py-4 align-middle">

                              <span
                                className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2.5 py-1 text-[10px] font-extrabold ${statusStyle.className}`}
                              >

                                {
                                  statusStyle.icon
                                }

                                {normalizeStatus(
                                  booking.status ||
                                  "PENDING",
                                )}

                              </span>

                            </td>

                            {/* ACTIONS */}

                            <td className="sticky right-0 z-10 bg-white px-3 py-4 align-middle">

                              <div className="flex items-center justify-center gap-2">

                                {/* EDIT */}

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleEditStatus(
                                      booking,
                                    )
                                  }
                                  className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-blue-600 transition hover:border-blue-200 hover:bg-blue-50"
                                  title="Edit Booking Status"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>

                                {/* DELETE */}

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDelete(
                                      booking._id,
                                    )
                                  }
                                  disabled={
                                    deletingId ===
                                    booking._id
                                  }
                                  className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-red-500 transition hover:border-red-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                  title="Delete Booking"
                                >

                                  {deletingId ===
                                  booking._id ? (
                                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />
                                  ) : (
                                    <Trash2 className="h-3.5 w-3.5" />
                                  )}

                                </button>

                              </div>

                            </td>

                          </tr>
                        );
                      },
                    )}

                  </tbody>

                </table>

              </div>
            )}

            {/* =====================================================
                PAGINATION
            ===================================================== */}

            {!loading &&
              bookings.length > 0 &&
              totalPages > 1 && (

                <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 p-4 sm:flex-row">

                  <div className="text-xs font-medium text-slate-500">

                    Showing page{" "}

                    <span className="font-bold text-slate-700">
                      {page}
                    </span>

                    {" "}of{" "}

                    <span className="font-bold text-slate-700">
                      {totalPages}
                    </span>

                    {" "}·{" "}

                    <span className="font-bold text-slate-700">
                      {totalBookings}
                    </span>

                    {" "}bookings

                  </div>

                  <div className="flex items-center gap-1.5">

                    {/* PREVIOUS */}

                    <button
                      type="button"
                      onClick={
                        handlePrevious
                      }
                      disabled={
                        !hasPreviousPage ||
                        loading
                      }
                      className="flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >

                      <ChevronLeft className="h-4 w-4" />

                      <span className="hidden sm:inline">
                        Previous
                      </span>

                    </button>

                    {/* PAGE NUMBERS */}

                    <div className="flex items-center gap-1">

                      {getPageNumbers().map(
                        (
                          pageNumber,
                        ) => (

                          <button
                            key={
                              pageNumber
                            }
                            type="button"
                            onClick={() =>
                              handlePageChange(
                                pageNumber,
                              )
                            }
                            disabled={
                              loading
                            }
                            className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-xs font-bold transition ${
                              page ===
                              pageNumber
                                ? "bg-blue-600 text-white shadow-sm"
                                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {
                              pageNumber
                            }
                          </button>

                        ),
                      )}

                    </div>

                    {/* NEXT */}

                    <button
                      type="button"
                      onClick={
                        handleNext
                      }
                      disabled={
                        !hasNextPage ||
                        loading
                      }
                      className="flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >

                      <span className="hidden sm:inline">
                        Next
                      </span>

                      <ChevronRight className="h-4 w-4" />

                    </button>

                  </div>

                </div>
              )}

          </div>

        </div>

      </main>

      {/* =====================================================
          STATUS MODAL
      ===================================================== */}

      {showStatusModal &&
        selectedBooking && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">

            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">

              {/* HEADER */}

              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

                <div>

                  <h3 className="text-lg font-bold text-slate-900">
                    Update Booking Status
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Change the booking status for
                    this customer.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowStatusModal(
                      false,
                    );

                    setSelectedBooking(
                      null,
                    );
                  }}
                  disabled={
                    updatingStatus
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>

              </div>

              {/* BODY */}

              <div className="space-y-5 p-6">

                {/* CUSTOMER */}

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                  <p className="text-[10px] font-bold uppercase text-slate-400">
                    Customer
                  </p>

                  <p className="mt-1 text-sm font-black text-slate-900">
                    {selectedBooking
                      .user
                      ?.name ||
                      "N/A"}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {selectedBooking
                      .user
                      ?.email ||
                      "N/A"}
                  </p>

                </div>

                {/* EVENT */}

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                  <p className="text-[10px] font-bold uppercase text-slate-400">
                    Event
                  </p>

                  <p className="mt-1 text-sm font-black text-slate-900">
                    {selectedBooking
                      .event
                      ?.title ||
                      "N/A"}
                  </p>

                </div>

                {/* STATUS */}

                <div>

                  <label
                    htmlFor="booking-status"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Booking Status
                  </label>

                  <select
                    id="booking-status"
                    value={newStatus}
                    onChange={(e) =>
                      setNewStatus(
                        e.target
                          .value as BookingStatus,
                      )
                    }
                    disabled={
                      updatingStatus
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  >

                    <option value="PENDING">
                      PENDING
                    </option>

                    <option value="CONFIRMED">
                      CONFIRMED
                    </option>

                    <option value="CANCELLED">
                      CANCELLED
                    </option>

                  </select>

                </div>

                {/* BUTTONS */}

                <div className="flex gap-3 border-t border-slate-200 pt-5">

                  <button
                    type="button"
                    disabled={
                      updatingStatus
                    }
                    onClick={() => {
                      setShowStatusModal(
                        false,
                      );

                      setSelectedBooking(
                        null,
                      );
                    }}
                    className="flex-1 rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={
                      updatingStatus
                    }
                    onClick={
                      handleUpdateStatus
                    }
                    className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {updatingStatus
                      ? "Updating..."
                      : "Update Status"}
                  </button>

                </div>

              </div>

            </div>

          </div>
        )}

      {/* =====================================================
          TOAST NOTIFICATION
      ===================================================== */}

      {toast.show && (

        <div className="fixed right-5 top-5 z-[100] w-[calc(100%-40px)] max-w-sm animate-[slideIn_0.3s_ease-out]">

          <div
            className={`flex items-start gap-3 rounded-2xl border bg-white p-4 shadow-xl ${
              toast.type ===
              "success"
                ? "border-emerald-200"
                : "border-red-200"
            }`}
          >

            {/* ICON */}

            <div
              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                toast.type ===
                "success"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-red-50 text-red-600"
              }`}
            >

              {toast.type ===
              "success" ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}

            </div>

            {/* MESSAGE */}

            <div className="min-w-0 flex-1">

              <p
                className={`text-sm font-bold ${
                  toast.type ===
                  "success"
                    ? "text-emerald-700"
                    : "text-red-700"
                }`}
              >
                {toast.type ===
                "success"
                  ? "Success"
                  : "Error"}
              </p>

              <p className="mt-0.5 text-xs leading-5 text-slate-600">
                {toast.message}
              </p>

            </div>

            {/* CLOSE */}

            <button
              type="button"
              onClick={
                closeToast
              }
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close notification"
            >
              <X className="h-4 w-4" />
            </button>

          </div>

        </div>

      )}

      {/* =====================================================
          TOAST ANIMATION
      ===================================================== */}

      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(30px);
            }

            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
      </style>

    </div>
  );
}