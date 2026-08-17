import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User, Home, LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { logoutUser, clearAuthStorage } from "../services/api";

export function useDashboardUser() {
  const auth = useAuth();
  const [user, setUser] = useState(() => {
    if (auth?.user) return auth.user;
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (auth?.user) {
      setUser(auth.user);
    } else {
      try {
        const saved = localStorage.getItem("user");
        if (saved) setUser(JSON.parse(saved));
      } catch {
        setUser(null);
      }
    }
  }, [auth?.user]);

  const firstName =
    user?.firstName ||
    user?.name ||
    user?.username ||
    user?.email?.split("@")[0] ||
    "User";

  return { user, firstName };
}

export default function DashboardProfileMenu() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { user, firstName } = useDashboardUser();
  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error(err);
    } finally {
      clearAuthStorage();
      if (auth?.logout) auth.logout();
      navigate("/home/login");
    }
  };

  const getDashboardPath = () => {
    const role = (user?.role || localStorage.getItem("role") || "").toLowerCase();
    if (role === "admin") return "/admin/dashboard";
    if (role === "business") return "/business/dashboard";
    return "/student/dashboard";
  };

  const fullName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    user?.name ||
    user?.email ||
    "User";
  const roleLabel = (user?.role || localStorage.getItem("role") || "User").toUpperCase();
  const initial = (firstName?.[0] || "U").toUpperCase();

  return (
    <div className="relative z-50 select-none" ref={menuRef}>
      {/* Profile Badge Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer focus:outline-none"
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
            {initial}
          </div>
          {/* Active Signal Pulsing Green Dot */}
          <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
          </span>
        </div>

        <div className="text-left hidden sm:block leading-tight">
          <span className="block text-xs font-black text-slate-800 tracking-tight">
            {firstName}
          </span>
          <span className="block text-[10px] font-bold text-blue-600 uppercase tracking-wider">
            {roleLabel}
          </span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Card */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 text-left z-50">
          <div className="px-3 py-2.5 bg-slate-50 rounded-xl mb-1 border border-slate-100 flex items-center justify-between">
            <div className="min-w-0 flex-1 pr-2">
              <p className="text-xs font-black text-slate-900 truncate">{fullName}</p>
              <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                {user?.email}
              </p>
              <span className="inline-block mt-1.5 px-2 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-extrabold rounded-full uppercase tracking-wider">
                {roleLabel}
              </span>
            </div>
            {/* Active Signal Indicator Badge */}
            <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200/60 text-[10px] font-extrabold shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Active</span>
            </div>
          </div>

          <div className="space-y-0.5 pt-1">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/home/profile");
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <User className="w-4 h-4 text-blue-500" />
              <span>My Profile</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                navigate(getDashboardPath());
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-500" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/home");
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4 text-emerald-500" />
              <span>Home Page</span>
            </button>

            <div className="my-1 border-t border-slate-100" />

            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
