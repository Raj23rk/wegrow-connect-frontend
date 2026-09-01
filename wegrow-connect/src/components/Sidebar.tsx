import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Users,
  ShieldCheck,
  BookOpen,
  Calendar,
  CreditCard,
  Receipt,
  Award,
  Medal,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Image,
  GraduationCap,
  Sparkles
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "My Profile", href: "/home/profile", icon: User },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Roles & Permissions", href: "/admin/roles", icon: ShieldCheck },
    { name: "Women Entrepreneurs", href: "/admin/women-entrepreneurs", icon: Sparkles },
    { name: "Student Founders", href: "/admin/student-founders", icon: GraduationCap },
    { name: "Booking", href: "/admin/workshops", icon: BookOpen },
    { name: "Events & Bootcamps", href: "/admin/events", icon: Calendar },
    { name: "Gallery Photos", href: "/admin/gallery", icon: Image },
    { name: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
    { name: "Payments & Invoices", href: "/admin/payments", icon: Receipt },
    { name: "Certificates", href: "/admin/certificates", icon: Award },
    { name: "Rewards & Badges", href: "/admin/rewards", icon: Medal },
    { name: "Reports & Analytics", href: "/admin/reports", icon: BarChart3 },
    { name: "Notifications", href: "/admin/notifications", icon: Bell },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/home/login");
  };

  return (
    <aside className="w-64 bg-[#147A87] text-white h-screen max-h-screen overflow-y-auto flex flex-col justify-between shrink-0 select-none border-r border-cyan-400/30 font-sans shadow-lg scrollbar-thin">
      <div>
        {/* Floating White Rounded Logo Card (Matching Image 1 Format) */}
        <div className="p-3 pt-4">
          <Link
            to="/home"
            className="bg-white rounded-2xl p-3.5 shadow-md border border-white/40 flex flex-col items-center justify-center gap-1 hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer block"
          >
            <div className="flex items-center justify-center gap-1.5 w-full">
              {/* <img
                src="/logo.jpg"
                alt="WeGrow Emblem"
                className="w-8 h-8 object-contain shrink-0"
              /> */}
              <div className="logo">
                <img
                  src="/wegrow-logo.png"
                  alt="WeGrow"
                />
              </div>
            </div>
          
          </Link>
        </div>

        {/* Navigation Links Area */}
        <nav className="px-3 py-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? "bg-white/25 text-white shadow-sm border border-white/30 backdrop-blur-xs font-black"
                    : "text-white/90 hover:bg-white/15 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 text-white" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Option */}
      <div className="p-3 mb-2">
        <div className="pt-3 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-rose-600 hover:text-white transition-all w-full cursor-pointer shadow-xs"
          >
            <LogOut className="w-4 h-4 text-white" />
            <span>Logout Portal</span>
          </button>
        </div>
      </div>
    </aside>
  );
}