import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import {
  CreditCard,
  Plus,
  Search,
  Check,
  Zap,
  TrendingUp,
  DollarSign,
  UserCheck,
  AlertTriangle,
  X,
  MoreVertical,
  Calendar,
  IndianRupee,
  ShieldCheck
} from "lucide-react";

export default function SubscriptionsPage() {
  // Sample Active Subscriptions List
  const [subscriptions, setSubscriptions] = useState([
    {
      id: "SUB-801",
      userName: "Silambarasan G",
      userEmail: "silambarasan@wegrow.com",
      plan: "Student Pro",
      cycle: "Monthly",
      amount: "₹499",
      startDate: "Aug 01, 2026",
      nextBilling: "Sep 01, 2026",
      status: "Active",
    },
    {
      id: "SUB-802",
      userName: "Karthik Raja",
      userEmail: "karthik@agritech.io",
      plan: "Business Growth",
      cycle: "Yearly",
      amount: "₹14,999",
      startDate: "Jan 15, 2026",
      nextBilling: "Jan 15, 2027",
      status: "Active",
    },
    {
      id: "SUB-803",
      userName: "Priya Sharma",
      userEmail: "priya@gmail.com",
      plan: "Student Pro",
      cycle: "Monthly",
      amount: "₹499",
      startDate: "Jul 10, 2026",
      nextBilling: "Aug 10, 2026",
      status: "Pending",
    },
    {
      id: "SUB-804",
      userName: "Dr. Anand Kumar",
      userEmail: "anand@wegrow.com",
      plan: "Mentor Tier",
      cycle: "Yearly",
      amount: "₹0 (Complimentary)",
      startDate: "Feb 01, 2026",
      nextBilling: "Feb 01, 2027",
      status: "Active",
    },
    {
      id: "SUB-805",
      userName: "Venkatesh S",
      userEmail: "venkat@tech.io",
      plan: "Business Growth",
      cycle: "Monthly",
      amount: "₹1,499",
      startDate: "Jun 01, 2026",
      nextBilling: "Jul 01, 2026",
      status: "Expired",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [editingSub, setEditingSub] = useState<any>(null);

  // Filter Logic
  const filteredSubscriptions = subscriptions.filter((s) => {
    const matchesSearch =
      s.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.plan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "All" || s.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Handle Cancel Subscription
  const handleCancelSub = (id: string) => {
    if (confirm("Are you sure you want to cancel this subscription?")) {
      setSubscriptions(
        subscriptions.map((s) => (s.id === id ? { ...s, status: "Expired" } : s))
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50/60 font-sans text-slate-800 antialiased">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Top Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Subscriptions & Billing</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Manage student plans, business growth tier subscriptions, and recurring revenue.
            </p>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Monthly Recurring (MRR)</p>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">₹1,84,500</h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Active Paid Subs</p>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">
                {subscriptions.filter((s) => s.status === "Active").length} Subscribers
              </h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Pending Payments</p>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">
                {subscriptions.filter((s) => s.status === "Pending").length} Requests
              </h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Active Tier Plans</p>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">3 Pricing Tiers</h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Pricing Tier Plans Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Free Tier */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-100 text-slate-700">
                Community
              </span>
              <span className="text-lg font-black text-slate-900">Free</span>
            </div>
            <h3 className="font-bold text-sm text-slate-900">Student Basic</h3>
            <p className="text-xs text-slate-500">Access to free workshops, basic discord community, and event updates.</p>
          </div>

          {/* Student Pro */}
          <div className="bg-white p-5 rounded-2xl border border-blue-200 bg-blue-50/20 shadow-xs space-y-3 relative overflow-hidden">
            <div className="flex justify-between items-center">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-100 text-blue-700">
                Popular
              </span>
              <span className="text-lg font-black text-blue-600">₹499 / mo</span>
            </div>
            <h3 className="font-bold text-sm text-slate-900">Student Pro Pass</h3>
            <p className="text-xs text-slate-500">Unlimited masterclasses, certificate downloads, and 1-on-1 mentor guidance.</p>
          </div>

          {/* Business Growth */}
          <div className="bg-white p-5 rounded-2xl border border-purple-200 bg-purple-50/20 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-purple-100 text-purple-700">
                Enterprise
              </span>
              <span className="text-lg font-black text-purple-600">₹1,499 / mo</span>
            </div>
            <h3 className="font-bold text-sm text-slate-900">Startup & Business Tier</h3>
            <p className="text-xs text-slate-500">Post unlimited tech hiring jobs, startup pitch reviews, and incubator matching.</p>
          </div>
        </div>

        {/* Subscriptions Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
              {["All", "Active", "Pending", "Expired"].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    selectedStatus === st
                      ? "bg-white text-blue-600 shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search user, plan, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:border-blue-600 transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-y border-slate-100">
                <tr>
                  <th className="p-3">Sub ID</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Plan Tier</th>
                  <th className="p-3">Billing Cycle</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Next Renewal</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredSubscriptions.length > 0 ? (
                  filteredSubscriptions.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/60 transition-all">
                      <td className="p-3 font-mono font-bold text-slate-900">{s.id}</td>
                      <td className="p-3">
                        <p className="font-bold text-slate-900">{s.userName}</p>
                        <p className="text-[11px] text-slate-400">{s.userEmail}</p>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                            s.plan === "Student Pro"
                              ? "bg-blue-50 text-blue-600"
                              : s.plan === "Business Growth"
                              ? "bg-purple-50 text-purple-600"
                              : "bg-emerald-50 text-emerald-600"
                          }`}
                        >
                          {s.plan}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600 font-semibold">{s.cycle}</td>
                      <td className="p-3 font-extrabold text-slate-900">{s.amount}</td>
                      <td className="p-3 text-slate-500">{s.nextBilling}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                            s.status === "Active"
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                              : s.status === "Pending"
                              ? "bg-amber-50 text-amber-600 border border-amber-200"
                              : "bg-rose-50 text-rose-600 border border-rose-200"
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleCancelSub(s.id)}
                          className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all cursor-pointer"
                        >
                          Cancel / Expire
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      No subscriptions found matching search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}