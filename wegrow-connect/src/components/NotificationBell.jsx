import React, { useState, useEffect, useRef, useCallback } from "react";
import { Bell, CheckCheck, Sparkles, X, Loader2 } from "lucide-react";
import { getAuthHeaders } from "../services/api";
import { API_BASE } from "../services/config";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const popoverRef = useRef(null);

  // Get current user & role
  const currentUser = (() => {
    try {
      const raw = sessionStorage.getItem("user") || localStorage.getItem("user");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  })();

  const role = (
    currentUser?.role ||
    sessionStorage.getItem("role") ||
    localStorage.getItem("role") ||
    ""
  ).toLowerCase();
  const isAdmin = role === "admin";

  // ── Direct fetch with proper auth ──────────────────────
  const fetchNotificationsList = useCallback(async () => {
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      console.warn("[NotificationBell] No accessToken in sessionStorage — skipping fetch");
      return;
    }

    try {
      setLoading(true);

      const endpoint = isAdmin
        ? `${API_BASE}/notifications/admin/all`
        : `${API_BASE}/notifications`;

      const res = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("[NotificationBell] API status:", res.status);

      if (!res.ok) {
        console.error("[NotificationBell] API error status:", res.status);
        return;
      }

      const json = await res.json();
      console.log("[NotificationBell] API response:", json);

      // Handle multiple response shapes from backend
      let list = [];
      if (Array.isArray(json)) {
        list = json;
      } else if (Array.isArray(json?.notifications)) {
        list = json.notifications;
      } else if (Array.isArray(json?.data?.notifications)) {
        list = json.data.notifications;
      } else if (Array.isArray(json?.data)) {
        list = json.data;
      }

      setNotifications(list);
    } catch (err) {
      console.error("[NotificationBell] Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  // ── Mark notification as read ──────────────────────────
  const handleMarkRead = async (id, e) => {
    if (e) e.stopPropagation();
    const token = sessionStorage.getItem("accessToken");
    if (!token || !id) return;

    // Optimistic UI update
    setNotifications((prev) =>
      prev.map((item) =>
        (item._id === id || item.id === id) ? { ...item, isRead: true, read: true } : item
      )
    );

    try {
      // Try PUT first, then PATCH
      let res = await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        res = await fetch(`${API_BASE}/notifications/${id}/read`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
      console.log("[NotificationBell] Mark read status:", res.status);
    } catch (err) {
      console.error("[NotificationBell] Mark read error:", err);
    }
  };

  const handleMarkAllRead = () => {
    notifications.forEach((n) => {
      const id = n._id || n.id;
      if (!n.isRead && !n.read) handleMarkRead(id);
    });
  };

  useEffect(() => {
    fetchNotificationsList();
    const interval = setInterval(fetchNotificationsList, 60000);
    return () => clearInterval(interval);
  }, [fetchNotificationsList]);

  // Outside click handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead && !n.read).length;

  const filteredList = notifications.filter((n) => {
    if (activeFilter === "unread") return !n.isRead && !n.read;
    return true;
  });

  const formatTime = (isoString) => {
    if (!isoString) return "";
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return new Date(isoString).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  return (
    <div className="relative z-50 select-none" ref={popoverRef}>
      {/* Bell Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotificationsList();
        }}
        className="relative p-2.5 rounded-full bg-white border border-slate-200 shadow-xs hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer focus:outline-none flex items-center justify-center text-slate-600"
        title="Notifications"
      >
        <Bell className="w-4 h-4 text-slate-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-white text-[9px] font-black shadow-sm animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown Card */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 text-left z-50 overflow-hidden space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-blue-600" /> Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-extrabold">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <CheckCheck className="w-3 h-3" /> Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveFilter("all")}
              className={`flex-1 py-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer ${
                activeFilter === "all"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setActiveFilter("unread")}
              className={`flex-1 py-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer ${
                activeFilter === "unread"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-72 overflow-y-auto space-y-2 pr-0.5">
            {loading ? (
              <div className="py-8 text-center text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                <span className="text-xs font-semibold">Loading notifications…</span>
              </div>
            ) : filteredList.length === 0 ? (
              <div className="py-8 text-center text-slate-400 space-y-1">
                <Sparkles className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-600">No notifications</p>
                <p className="text-[10px]">You are all caught up!</p>
              </div>
            ) : (
              filteredList.map((item) => {
                const id = item._id || item.id;
                const isUnread = !item.isRead && !item.read;
                return (
                  <div
                    key={id}
                    onClick={(e) => {
                      if (isUnread) handleMarkRead(id, e);
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                      isUnread
                        ? "bg-blue-50/50 border-blue-100 hover:bg-blue-50"
                        : "bg-slate-50/50 border-slate-100 hover:bg-slate-100/60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                        )}
                        <h4 className="font-extrabold text-xs text-slate-900 leading-snug">
                          {item.title || item.subject || "Notification"}
                        </h4>
                      </div>
                      <span className="text-[9px] font-semibold text-slate-400 shrink-0">
                        {formatTime(item.createdAt || item.date || item.timestamp)}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                      {item.message || item.description || item.body || item.content || ""}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
