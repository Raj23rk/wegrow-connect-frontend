import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import Sidebar from "../../components/Sidebar";

import {
  Calendar,
  Plus,
  Search,
  MapPin,
  Users,
  Trash2,
  X,
  Flame,
  Globe,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// =====================================================
// API
// =====================================================

const API_BASE =
  "http://13.239.234.181:4000/api/v1";

const ALL_EVENTS_API =
  `${API_BASE}/events/all-event`;

const CREATE_EVENT_API =
  `${API_BASE}/events/create-event`;

const DELETE_EVENT_API =
  `${API_BASE}/events`;

// =====================================================
// TYPES
// =====================================================

interface EventItem {
  id: string;
  title: string;
  description?: string;
  type: string;
  host: string;
  mode: string;
  date: string;
  duration: string;
  price: string;
  seats: number;
  registered: number;
  status: string;
  badgeColor: string;
  image?: string;
  location?: string;
  isActive?: boolean;
}

interface FormData {
  title: string;
  description: string;
  type: "BUSINESS" | "STUDENT";
  image: string;
  location: string;
  date: string;
  price: string;
  isActive: boolean;
}

// =====================================================
// COMPONENT
// =====================================================

export default function EventsBootcampsPage() {
  // =====================================================
  // EVENTS STATE
  // =====================================================

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // PAGINATION
  // =====================================================

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);

  const [hasNextPage, setHasNextPage] =
    useState(false);

  const [hasPreviousPage, setHasPreviousPage] =
    useState(false);

  // =====================================================
  // SUMMARY
  // =====================================================

  const [totalStudentEvents, setTotalStudentEvents] =
    useState(0);

  const [totalBusinessEvents, setTotalBusinessEvents] =
    useState(0);

  const [totalNonActiveEvents, setTotalNonActiveEvents] =
    useState(0);

  const [summaryLoading, setSummaryLoading] =
    useState(false);

  // =====================================================
  // UI
  // =====================================================

  const [searchTerm, setSearchTerm] =
    useState("");

  const [selectedType, setSelectedType] =
    useState("All");

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [isCreating, setIsCreating] =
    useState(false);

  // =====================================================
  // FORM
  // =====================================================

  const initialFormData: FormData = {
    title: "",
    description: "",
    type: "BUSINESS",
    image: "",
    location: "",
    date: "",
    price: "",
    isActive: true,
  };

  const [formData, setFormData] =
    useState<FormData>(initialFormData);

  // =====================================================
  // BADGE COLOR
  // =====================================================

  const getBadgeColor = (type: string) => {
    const normalizedType =
      String(type || "").toUpperCase();

    if (normalizedType === "STUDENT") {
      return "bg-purple-50 text-purple-600 border-purple-200";
    }

    return "bg-blue-50 text-blue-600 border-blue-200";
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date: string) => {
    if (!date) {
      return "Date not available";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date not available";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // GET PAGINATION
  // =====================================================

  const getPagination = (result: any) => {
    return (
      result?.data?.pagination ||
      result?.pagination ||
      {}
    );
  };

  // =====================================================
  // GET EVENTS
  // =====================================================

  const getEventsFromResponse = (
    result: any
  ): any[] => {
    if (
      Array.isArray(
        result?.data?.events
      )
    ) {
      return result.data.events;
    }

    if (
      Array.isArray(
        result?.data
      )
    ) {
      return result.data;
    }

    if (
      Array.isArray(
        result?.events
      )
    ) {
      return result.events;
    }

    if (
      Array.isArray(result)
    ) {
      return result;
    }

    return [];
  };

  // =====================================================
  // NORMALIZE EVENT TYPE
  // =====================================================

  const normalizeEventType = (
    type: any
  ): string => {
    return String(
      type || ""
    )
      .trim()
      .toUpperCase();
  };

  // =====================================================
  // MAP API EVENT
  // =====================================================

  const mapEvent = (
    evt: any,
    index: number
  ): EventItem => {
    const eventType =
      normalizeEventType(
        evt?.type
      );

    return {
      id:
        evt?._id ||
        evt?.id ||
        `EVT-${index}`,

      title:
        evt?.title ||
        "",

      description:
        evt?.description ||
        "",

      type:
        eventType ||
        "STUDENT",

      host:
        evt?.host ||
        "WeGrow Team",

      mode:
        evt?.mode ||
        "Online",

      date:
        formatDate(
          evt?.date
        ),

      duration:
        evt?.duration ||
        "Workshop",

      price:
        String(
          evt?.price ?? 0
        ),

      seats:
        Number(
          evt?.seats || 0
        ),

      registered:
        Number(
          evt?.registered || 0
        ),

      status:
        evt?.isActive
          ? "Active"
          : "Draft",

      badgeColor:
        getBadgeColor(
          eventType
        ),

      image:
        evt?.image ||
        "",

      location:
        evt?.location ||
        "",

      isActive:
        evt?.isActive,
    };
  };

  // =====================================================
  // FETCH SUMMARY
  // =====================================================

  const fetchSummaryCounts =
    useCallback(
      async () => {
        try {
          setSummaryLoading(true);

          const token =
            localStorage.getItem(
              "accessToken"
            );

          const headers: HeadersInit =
            token
              ? {
                  Authorization:
                    `Bearer ${token}`,
                }
              : {};

          // Fetch a large number of events.
          // We still defensively filter by type below.
          const params =
            new URLSearchParams();

          params.set(
            "page",
            "1"
          );

          params.set(
            "limit",
            "1000"
          );

          const response =
            await fetch(
              `${ALL_EVENTS_API}?${params.toString()}`,
              {
                method: "GET",
                headers,
              }
            );

          let result: any = {};

          try {
            result =
              await response.json();
          } catch {
            result = {};
          }

          if (!response.ok) {
            throw new Error(
              Array.isArray(
                result?.message
              )
                ? result.message.join(
                    ", "
                  )
                : result?.message ||
                    "Failed to fetch summary."
            );
          }

          const apiEvents =
            getEventsFromResponse(
              result
            );

          const studentCount =
            apiEvents.filter(
              (event: any) =>
                normalizeEventType(
                  event?.type
                ) === "STUDENT"
            ).length;

          const businessCount =
            apiEvents.filter(
              (event: any) =>
                normalizeEventType(
                  event?.type
                ) === "BUSINESS"
            ).length;

          const nonActiveCount =
            apiEvents.filter(
              (event: any) =>
                event?.isActive === false
            ).length;

          setTotalStudentEvents(
            studentCount
          );

          setTotalBusinessEvents(
            businessCount
          );

          setTotalNonActiveEvents(
            nonActiveCount
          );

          console.log(
            "SUMMARY EVENTS:",
            apiEvents
          );

          console.log(
            "STUDENT COUNT:",
            studentCount
          );

          console.log(
            "BUSINESS COUNT:",
            businessCount
          );

          console.log(
            "NON ACTIVE COUNT:",
            nonActiveCount
          );
        } catch (error) {
          console.error(
            "Failed to fetch summary:",
            error
          );

          setTotalStudentEvents(0);
          setTotalBusinessEvents(0);
          setTotalNonActiveEvents(0);
        } finally {
          setSummaryLoading(false);
        }
      },
      []
    );

  // =====================================================
  // FETCH EVENTS
  // =====================================================

  const fetchEvents =
    useCallback(
      async (
        currentPage: number = 1,
        search: string = "",
        type: string = "All"
      ) => {
        try {
          setLoading(true);

          const token =
            localStorage.getItem(
              "accessToken"
            );

          const headers: HeadersInit =
            token
              ? {
                  Authorization:
                    `Bearer ${token}`,
                }
              : {};

          // =================================================
          // IMPORTANT FIX
          //
          // We request a large set from backend and then
          // FILTER TYPE LOCALLY.
          //
          // This protects the frontend if backend currently
          // ignores ?type=BUSINESS or ?type=STUDENT.
          // =================================================

          const params =
            new URLSearchParams();

          params.set(
            "page",
            "1"
          );

          params.set(
            "limit",
            "1000"
          );

          // Search can still be sent to backend.
          if (
            search.trim()
          ) {
            params.set(
              "search",
              search.trim()
            );
          }

          const url =
            `${ALL_EVENTS_API}?${params.toString()}`;

          console.log(
            "GET EVENTS API:",
            url
          );

          const response =
            await fetch(
              url,
              {
                method: "GET",
                headers,
              }
            );

          let result: any = {};

          try {
            result =
              await response.json();
          } catch {
            result = {};
          }

          console.log(
            "EVENTS API RESPONSE:",
            result
          );

          if (!response.ok) {
            throw new Error(
              Array.isArray(
                result?.message
              )
                ? result.message.join(
                    ", "
                  )
                : result?.message ||
                    "Failed to fetch events."
            );
          }

          // =================================================
          // GET RAW EVENTS
          // =================================================

          const apiEvents =
            getEventsFromResponse(
              result
            );

          console.log(
            "RAW API EVENTS:",
            apiEvents
          );

          // =================================================
          // MAP EVENTS
          // =================================================

          const mappedEvents =
            apiEvents.map(
              (
                evt: any,
                index: number
              ) =>
                mapEvent(
                  evt,
                  index
                )
            );

          console.log(
            "MAPPED EVENTS:",
            mappedEvents
          );

          // =================================================
          // IMPORTANT TYPE FILTER
          // =================================================

          let filteredEvents =
            mappedEvents;

          if (
            type === "BUSINESS"
          ) {
            filteredEvents =
              mappedEvents.filter(
                (event) =>
                  normalizeEventType(
                    event.type
                  ) === "BUSINESS"
              );
          }

          if (
            type === "STUDENT"
          ) {
            filteredEvents =
              mappedEvents.filter(
                (event) =>
                  normalizeEventType(
                    event.type
                  ) === "STUDENT"
              );
          }

          // =================================================
          // SEARCH FILTER
          //
          // Do it locally too so search + type always work.
          // =================================================

          if (
            search.trim()
          ) {
            const searchValue =
              search
                .trim()
                .toLowerCase();

            filteredEvents =
              filteredEvents.filter(
                (event) =>
                  event.title
                    .toLowerCase()
                    .includes(
                      searchValue
                    ) ||

                  event.description
                    ?.toLowerCase()
                    .includes(
                      searchValue
                    ) ||

                  event.location
                    ?.toLowerCase()
                    .includes(
                      searchValue
                    ) ||

                  event.type
                    .toLowerCase()
                    .includes(
                      searchValue
                    )
              );
          }

          console.log(
            "SELECTED TYPE:",
            type
          );

          console.log(
            "FILTERED EVENTS:",
            filteredEvents
          );

          // =================================================
          // CLIENT-SIDE PAGINATION
          //
          // Since we filter locally, pagination must happen
          // AFTER filtering.
          // =================================================

          const calculatedTotal =
            filteredEvents.length;

          const calculatedTotalPages =
            Math.max(
              1,
              Math.ceil(
                calculatedTotal /
                  limit
              )
            );

          let safePage =
            currentPage;

          if (
            safePage >
            calculatedTotalPages
          ) {
            safePage =
              calculatedTotalPages;
          }

          if (
            safePage < 1
          ) {
            safePage = 1;
          }

          const startIndex =
            (safePage - 1) *
            limit;

          const endIndex =
            startIndex +
            limit;

          const paginatedEvents =
            filteredEvents.slice(
              startIndex,
              endIndex
            );

          // =================================================
          // SET EVENTS
          // =================================================

          setEvents(
            paginatedEvents
          );

          // =================================================
          // SET PAGINATION
          // =================================================

          setPage(
            safePage
          );

          setTotalPages(
            calculatedTotalPages
          );

          setTotalEvents(
            calculatedTotal
          );

          setHasPreviousPage(
            safePage > 1
          );

          setHasNextPage(
            safePage <
              calculatedTotalPages
          );

          console.log(
            "CURRENT PAGE:",
            safePage
          );

          console.log(
            "TOTAL FILTERED EVENTS:",
            calculatedTotal
          );

          console.log(
            "TOTAL PAGES:",
            calculatedTotalPages
          );
        } catch (error) {
          console.error(
            "Failed to fetch events:",
            error
          );

          setEvents([]);

          setTotalEvents(0);

          setTotalPages(1);

          setPage(1);

          setHasNextPage(
            false
          );

          setHasPreviousPage(
            false
          );
        } finally {
          setLoading(false);
        }
      },
      [limit]
    );

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchEvents(
      1,
      "",
      "All"
    );

    fetchSummaryCounts();
  }, [
    fetchEvents,
    fetchSummaryCounts,
  ]);

  // =====================================================
  // SEARCH + TYPE
  // =====================================================

  useEffect(() => {
    const timer =
      setTimeout(() => {
        fetchEvents(
          1,
          searchTerm,
          selectedType
        );
      }, 400);

    return () =>
      clearTimeout(timer);
  }, [
    searchTerm,
    selectedType,
    fetchEvents,
  ]);

  // =====================================================
  // TYPE CHANGE
  // =====================================================

  const handleTypeChange =
    (type: string) => {
      setSelectedType(type);
      setPage(1);
    };

  // =====================================================
  // PAGE CHANGE
  // =====================================================

  const handlePageChange =
    (newPage: number) => {
      if (
        loading ||
        newPage < 1 ||
        newPage > totalPages ||
        newPage === page
      ) {
        return;
      }

      fetchEvents(
        newPage,
        searchTerm,
        selectedType
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

  // =====================================================
  // PREVIOUS
  // =====================================================

  const handlePreviousPage =
    () => {
      if (
        !hasPreviousPage ||
        loading
      ) {
        return;
      }

      handlePageChange(
        page - 1
      );
    };

  // =====================================================
  // NEXT
  // =====================================================

  const handleNextPage =
    () => {
      if (
        !hasNextPage ||
        loading
      ) {
        return;
      }

      handlePageChange(
        page + 1
      );
    };

  // =====================================================
  // PAGE NUMBERS
  // =====================================================

  const getPageNumbers = () => {
    const pages: number[] = [];

    if (
      totalPages <= 5
    ) {
      for (
        let i = 1;
        i <= totalPages;
        i++
      ) {
        pages.push(i);
      }

      return pages;
    }

    if (
      page <= 3
    ) {
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
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "BUSINESS",
      image: "",
      location: "",
      date: "",
      price: "",
      isActive: true,
    });
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeModal = () => {
    if (isCreating) {
      return;
    }

    setShowAddModal(false);
    resetForm();
  };

  // =====================================================
  // CREATE EVENT
  // =====================================================

  const handleCreateEvent =
    async (
      e: React.FormEvent<HTMLFormElement>
    ) => {
      e.preventDefault();

      if (isCreating) {
        return;
      }

      try {
        const token =
          localStorage.getItem(
            "accessToken"
          );

        if (!token) {
          alert(
            "Authentication token not found. Please login again."
          );
          return;
        }

        // =================================================
        // VALIDATION
        // =================================================

        if (
          !formData.title.trim()
        ) {
          alert(
            "Please enter workshop title."
          );
          return;
        }

        if (
          !formData.description.trim()
        ) {
          alert(
            "Please enter workshop description."
          );
          return;
        }

        if (
          !formData.image.trim()
        ) {
          alert(
            "Please enter workshop image URL."
          );
          return;
        }

        if (
          !formData.location.trim()
        ) {
          alert(
            "Please enter workshop location."
          );
          return;
        }

        if (
          !formData.date
        ) {
          alert(
            "Please select workshop date and time."
          );
          return;
        }

        if (
          formData.price === ""
        ) {
          alert(
            "Please enter workshop fee."
          );
          return;
        }

        const priceNumber =
          Number(
            formData.price
          );

        if (
          Number.isNaN(
            priceNumber
          ) ||
          priceNumber < 0
        ) {
          alert(
            "Please enter a valid price."
          );
          return;
        }

        // =================================================
        // DATE
        // =================================================

        const selectedDate =
          new Date(
            formData.date
          );

        if (
          Number.isNaN(
            selectedDate.getTime()
          )
        ) {
          alert(
            "Invalid date selected."
          );
          return;
        }

        const isoDate =
          selectedDate.toISOString();

        // =================================================
        // PAYLOAD
        // =================================================

        const payload = {
          title:
            formData.title.trim(),

          description:
            formData.description.trim(),

          type:
            formData.type,

          image:
            formData.image.trim(),

          location:
            formData.location.trim(),

          date:
            isoDate,

          price:
            priceNumber,

          isActive:
            formData.isActive,
        };

        console.log(
          "CREATE EVENT PAYLOAD:",
          payload
        );

        setIsCreating(true);

        // =================================================
        // CREATE API
        // =================================================

        const response =
          await fetch(
            CREATE_EVENT_API,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body:
                JSON.stringify(
                  payload
                ),
            }
          );

        let result: any = {};

        try {
          result =
            await response.json();
        } catch {
          result = {};
        }

        console.log(
          "CREATE EVENT RESPONSE:",
          result
        );

        if (!response.ok) {
          const errorMessage =
            Array.isArray(
              result?.message
            )
              ? result.message.join(
                  ", "
                )
              : result?.message ||
                "Failed to create workshop.";

          alert(
            errorMessage
          );

          return;
        }

        // =================================================
        // CLOSE MODAL
        // =================================================

        setShowAddModal(false);
        resetForm();

        // =================================================
        // REFRESH EVENTS
        // =================================================

        setPage(1);

        await fetchEvents(
          1,
          searchTerm,
          selectedType
        );

        // =================================================
        // REFRESH SUMMARY
        // =================================================

        await fetchSummaryCounts();

        alert(
          "Workshop created successfully!"
        );
      } catch (error) {
        console.error(
          "Create event error:",
          error
        );

        alert(
          "Something went wrong while creating the workshop."
        );
      } finally {
        setIsCreating(false);
      }
    };

  // =====================================================
  // DELETE EVENT
  // =====================================================

  const handleDeleteEvent =
    async (
      id: string
    ) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to delete this Event/Bootcamp?"
        );

      if (!confirmed) {
        return;
      }

      try {
        const token =
          localStorage.getItem(
            "accessToken"
          );

        const response =
          await fetch(
            `${DELETE_EVENT_API}/${id}`,
            {
              method: "DELETE",

              headers: token
                ? {
                    Authorization:
                      `Bearer ${token}`,
                  }
                : {},
            }
          );

        if (!response.ok) {
          let result: any = {};

          try {
            result =
              await response.json();
          } catch {
            result = {};
          }

          const message =
            Array.isArray(
              result?.message
            )
              ? result.message.join(
                  ", "
                )
              : result?.message ||
                "Failed to delete event.";

          alert(message);

          return;
        }

        // =================================================
        // REFRESH
        // =================================================

        await fetchEvents(
          page,
          searchTerm,
          selectedType
        );

        await fetchSummaryCounts();
      } catch (error) {
        console.error(
          "Delete event error:",
          error
        );

        alert(
          "Failed to delete event."
        );
      }
    };

  // =====================================================
  // TOTAL REGISTRATIONS
  // =====================================================

  const totalRegistrations =
    useMemo(() => {
      return events.reduce(
        (
          total,
          event
        ) =>
          total +
          Number(
            event.registered ||
              0
          ),
        0
      );
    }, [events]);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50/60 font-sans text-slate-800 antialiased">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <Sidebar />

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="min-w-0 min-h-0 flex-1 overflow-y-auto">

        <div className="min-h-full p-4 md:p-8">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                Events & Bootcamps
              </h1>

              <p className="mt-1 text-xs font-medium text-slate-500">
                Organize hackathons, multi-week
                intensive bootcamps, and live
                founder meetups.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                setShowAddModal(true)
              }
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-95"
            >
              <Plus className="h-4 w-4" />

              <span>
                Create New Event
              </span>
            </button>

          </div>

          {/* =================================================
              SUMMARY
          ================================================= */}

          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

            {/* ACTIVE */}

            <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">

              <div>

                <p className="text-[10px] font-bold uppercase text-slate-400">
                  Total Events
                </p>

                <h2 className="mt-0.5 text-xl font-black text-slate-900">
                  {summaryLoading
                    ? "..."
                    : totalStudentEvents +
                      totalBusinessEvents}
                </h2>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                <Calendar className="h-5 w-5" />

              </div>

            </div>

            {/* STUDENT */}

            <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">

              <div>

                <p className="text-[10px] font-bold uppercase text-slate-400">
                  Total Student Events
                </p>

                <h2 className="mt-0.5 text-xl font-black text-slate-900">
                  {summaryLoading
                    ? "..."
                    : totalStudentEvents}
                </h2>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">

                <Flame className="h-5 w-5" />

              </div>

            </div>

            {/* BUSINESS */}

            <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">

              <div>

                <p className="text-[10px] font-bold uppercase text-slate-400">
                  Total Business Events
                </p>

                <h2 className="mt-0.5 text-xl font-black text-slate-900">
                  {summaryLoading
                    ? "..."
                    : totalBusinessEvents}
                </h2>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">

                <Users className="h-5 w-5" />

              </div>

            </div>

            {/* NON ACTIVE */}

            <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">

              <div>

                <p className="text-[10px] font-bold uppercase text-slate-400">
                  Non Active
                </p>

                <h2 className="mt-0.5 text-xl font-black text-slate-900">
                  {summaryLoading
                    ? "..."
                    : totalNonActiveEvents}
                </h2>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">

                <Calendar className="h-5 w-5" />

              </div>

            </div>

          </div>

          {/* =================================================
              EVENTS CONTAINER
          ================================================= */}

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm md:p-5">

            {/* =================================================
                FILTER
            ================================================= */}

            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              {/* TYPE */}

              <div className="flex w-full items-center gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 sm:w-auto">

                {[
                  "All",
                  "BUSINESS",
                  "STUDENT",
                ].map(
                  (type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        handleTypeChange(
                          type
                        )
                      }
                      className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                        selectedType ===
                        type
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      {type ===
                      "All"
                        ? "All"
                        : type}
                    </button>
                  )
                )}

              </div>

              {/* SEARCH */}

              <div className="relative w-full sm:w-72">

                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  placeholder="Search event name, location..."
                  value={
                    searchTerm
                  }
                  onChange={(e) => {
                    setPage(1);
                    setSearchTerm(
                      e.target.value
                    );
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs outline-none transition-all focus:border-blue-600"
                />

              </div>

            </div>

            {/* =================================================
                EVENTS
            ================================================= */}

            {loading ? (

              <div className="p-16 text-center">

                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

                <p className="mt-4 text-xs font-medium text-slate-400">
                  Loading events...
                </p>

              </div>

            ) : (

              <>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

                  {events.length > 0 ? (

                    events.map(
                      (event) => (

                        <div
                          key={
                            event.id
                          }
                          className="flex min-h-[320px] flex-col justify-between rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 transition-all hover:border-blue-400 hover:shadow-md"
                        >

                          <div className="space-y-3">

                            {/* BADGE */}

                            <div className="flex items-center justify-between">

                              <span
                                className={`rounded-md border px-2.5 py-0.5 text-[10px] font-extrabold ${event.badgeColor}`}
                              >
                                {
                                  event.type
                                }
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteEvent(
                                    event.id
                                  )
                                }
                                className="cursor-pointer rounded-lg p-1 text-slate-400 transition-all hover:bg-red-50 hover:text-red-600"
                                title="Delete Program"
                              >

                                <Trash2 className="h-3.5 w-3.5" />

                              </button>

                            </div>

                            {/* TITLE */}

                            <h3 className="line-clamp-2 text-sm font-extrabold leading-snug text-slate-900">
                              {
                                event.title
                              }
                            </h3>

                            {/* DESCRIPTION */}

                            {event.description && (

                              <p className="line-clamp-2 text-xs text-slate-500">
                                {
                                  event.description
                                }
                              </p>

                            )}

                            {/* DETAILS */}

                            <div className="space-y-2 pt-1 text-xs text-slate-500">

                              {/* HOST */}

                              <p className="flex items-center gap-1.5 font-medium text-slate-700">

                                <Users className="h-3.5 w-3.5 text-blue-600" />

                                Host:

                                <span className="font-bold">
                                  {
                                    event.host
                                  }
                                </span>

                              </p>

                              {/* MODE */}

                              <p className="flex items-center gap-1.5">

                                <Globe className="h-3.5 w-3.5 text-slate-400" />

                                {
                                  event.mode
                                }

                              </p>

                              {/* LOCATION */}

                              <p className="flex items-center gap-1.5">

                                <MapPin className="h-3.5 w-3.5 text-slate-400" />

                                {event.location ||
                                  "Location not available"}

                              </p>

                              {/* DATE */}

                              <p className="flex items-center gap-1.5">

                                <Calendar className="h-3.5 w-3.5 text-slate-400" />

                                {
                                  event.date
                                }

                              </p>

                            </div>

                          </div>

                          {/* BOTTOM */}

                          <div className="mt-4 flex items-center justify-between border-t border-slate-200/60 pt-3">

                            {/* PRICE */}

                            <div>

                              <span className="block text-[10px] font-bold uppercase text-slate-400">
                                Entry Fee
                              </span>

                              <span className="text-sm font-black text-slate-900">

                                {Number(
                                  event.price
                                ) ===
                                0
                                  ? "Free"
                                  : `₹${Number(
                                      event.price
                                    ).toLocaleString(
                                      "en-IN"
                                    )}`}

                              </span>

                            </div>

                            {/* STATUS */}

                            <div className="text-right">

                              <span className="block text-[10px] font-bold uppercase text-slate-400">
                                Status
                              </span>

                              <span
                                className={`text-xs font-bold ${
                                  event.isActive
                                    ? "text-emerald-600"
                                    : "text-slate-400"
                                }`}
                              >
                                {event.isActive
                                  ? "Active"
                                  : "Draft"}
                              </span>

                            </div>

                          </div>

                        </div>

                      )
                    )

                  ) : (

                    <div className="col-span-full p-10 text-center">

                      <p className="text-sm font-bold text-slate-500">
                        No events or bootcamps found.
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {selectedType !==
                        "All"
                          ? `No ${selectedType.toLowerCase()} events available.`
                          : "Try another search."}
                      </p>

                    </div>

                  )}

                </div>

                {/* =================================================
                    PAGINATION
                ================================================= */}

                {totalPages > 1 && (

                  <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-5 sm:flex-row">

                    {/* INFO */}

                    <div className="text-xs font-medium text-slate-500">

                      Showing page{" "}

                      <span className="font-bold text-slate-700">
                        {page}
                      </span>

                      {" "}of{" "}

                      <span className="font-bold text-slate-700">
                        {totalPages}
                      </span>

                      {totalEvents >
                        0 && (

                        <>
                          {" "}·{" "}

                          <span className="font-bold text-slate-700">
                            {totalEvents}
                          </span>

                          {" "}events
                        </>

                      )}

                    </div>

                    {/* CONTROLS */}

                    <div className="flex items-center gap-1.5">

                      {/* PREVIOUS */}

                      <button
                        type="button"
                        onClick={
                          handlePreviousPage
                        }
                        disabled={
                          !hasPreviousPage ||
                          loading
                        }
                        className="flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 shadow-sm transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >

                        <ChevronLeft className="h-4 w-4" />

                        <span className="hidden sm:inline">
                          Previous
                        </span>

                      </button>

                      {/* NUMBERS */}

                      <div className="flex items-center gap-1">

                        {getPageNumbers().map(
                          (
                            pageNumber
                          ) => (

                            <button
                              key={
                                pageNumber
                              }
                              type="button"
                              onClick={() =>
                                handlePageChange(
                                  pageNumber
                                )
                              }
                              disabled={
                                loading
                              }
                              className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-xs font-bold transition-all ${
                                page ===
                                pageNumber
                                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                              } disabled:cursor-not-allowed`}
                            >
                              {
                                pageNumber
                              }
                            </button>

                          )
                        )}

                      </div>

                      {/* NEXT */}

                      <button
                        type="button"
                        onClick={
                          handleNextPage
                        }
                        disabled={
                          !hasNextPage ||
                          loading
                        }
                        className="flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 shadow-sm transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >

                        <span className="hidden sm:inline">
                          Next
                        </span>

                        <ChevronRight className="h-4 w-4" />

                      </button>

                    </div>

                  </div>

                )}

              </>

            )}

          </div>

        </div>

      </main>

      {/* =====================================================
          CREATE WORKSHOP MODAL
      ===================================================== */}

      {showAddModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">

          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* HEADER */}

            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>

                <h3 className="text-lg font-bold text-slate-900">
                  Create New Workshop
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Add workshop details and
                  publish it for your members.
                </p>

              </div>

              <button
                type="button"
                onClick={
                  closeModal
                }
                disabled={
                  isCreating
                }
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >

                <X className="h-5 w-5" />

              </button>

            </div>

            {/* BODY */}

            <div className="min-h-0 flex-1 overflow-y-auto">

              <form
                onSubmit={
                  handleCreateEvent
                }
                className="space-y-5 p-6"
              >

                {/* TITLE */}

                <div>

                  <label
                    htmlFor="event-title"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Workshop Title
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    id="event-title"
                    type="text"
                    required
                    placeholder="e.g. Python Full Stack Bootcamp"
                    value={
                      formData.title
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        title:
                          e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />

                </div>

                {/* DESCRIPTION */}

                <div>

                  <label
                    htmlFor="event-description"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Description
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <textarea
                    id="event-description"
                    required
                    rows={4}
                    placeholder="Learn Python, Django, React, PostgreSQL, and build real-world projects."
                    value={
                      formData.description
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description:
                          e.target.value,
                      })
                    }
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />

                </div>

                {/* TYPE + PRICE */}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                  {/* TYPE */}

                  <div>

                    <label
                      htmlFor="event-type"
                      className="mb-2 block text-sm font-bold text-slate-700"
                    >
                      Workshop Type
                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </label>

                    <select
                      id="event-type"
                      required
                      value={
                        formData.type
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          type:
                            e.target
                              .value as
                              | "BUSINESS"
                              | "STUDENT",
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    >

                      <option value="BUSINESS">
                        BUSINESS
                      </option>

                      <option value="STUDENT">
                        STUDENT
                      </option>

                    </select>

                  </div>

                  {/* PRICE */}

                  <div>

                    <label
                      htmlFor="event-price"
                      className="mb-2 block text-sm font-bold text-slate-700"
                    >
                      Workshop Fee
                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </label>

                    <div className="relative">

                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
                        ₹
                      </span>

                      <input
                        id="event-price"
                        type="number"
                        min="0"
                        step="1"
                        required
                        placeholder="999"
                        value={
                          formData.price
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            price:
                              e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-4 text-sm outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
                      />

                    </div>

                  </div>

                </div>

                {/* LOCATION + DATE */}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                  {/* LOCATION */}

                  <div>

                    <label
                      htmlFor="event-location"
                      className="mb-2 block text-sm font-bold text-slate-700"
                    >
                      Location
                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </label>

                    <input
                      id="event-location"
                      type="text"
                      required
                      placeholder="e.g. Bangalore"
                      value={
                        formData.location
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          location:
                            e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />

                  </div>

                  {/* DATE */}

                  <div>

                    <label
                      htmlFor="event-date"
                      className="mb-2 block text-sm font-bold text-slate-700"
                    >
                      Date & Time
                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </label>

                    <input
                      id="event-date"
                      type="datetime-local"
                      required
                      value={
                        formData.date
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          date:
                            e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />

                  </div>

                </div>

                {/* IMAGE */}

                <div>

                  <label
                    htmlFor="event-image"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Workshop Image URL
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    id="event-image"
                    type="url"
                    required
                    placeholder="https://example.com/images/python-bootcamp.jpg"
                    value={
                      formData.image
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        image:
                          e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />

                  <p className="mt-1.5 text-xs text-slate-400">
                    Enter a publicly
                    accessible image URL.
                  </p>

                </div>

                {/* IMAGE PREVIEW */}

                {formData.image && (

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">

                    <p className="mb-2 text-xs font-bold text-slate-600">
                      Image Preview
                    </p>

                    <img
                      src={
                        formData.image
                      }
                      alt="Workshop preview"
                      className="h-40 w-full rounded-lg object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display =
                          "none";
                      }}
                    />

                  </div>

                )}

                {/* ACTIVE */}

                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">

                  <div>

                    <p className="text-sm font-bold text-slate-800">
                      Publish Workshop
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Make this workshop
                      visible to members.
                    </p>

                  </div>

                  <label className="relative inline-flex cursor-pointer items-center">

                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={Boolean(
                        formData.isActive
                      )}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isActive:
                            e.target
                              .checked,
                        })
                      }
                    />

                    <div className="h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-200">

                      <div className="absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white shadow-sm transition peer-checked:translate-x-5" />

                    </div>

                  </label>

                </div>

                {/* BUTTONS */}

                <div className="flex gap-3 border-t border-slate-200 pt-5">

                  <button
                    type="button"
                    disabled={
                      isCreating
                    }
                    onClick={
                      closeModal
                    }
                    className="flex-1 rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      isCreating
                    }
                    className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isCreating
                      ? "Creating..."
                      : "Publish Workshop"}
                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}