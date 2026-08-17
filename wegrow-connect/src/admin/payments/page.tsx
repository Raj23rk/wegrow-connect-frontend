import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import {
  Receipt,
  Plus,
  Search,
  Download,
  IndianRupee,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  X,
  CreditCard,
  FileText,
  Filter
} from "lucide-react";

export default function PaymentsInvoicesPage() {
  // Sample Payment Transactions Data
  const [payments, setPayments] = useState([
    {
      id: "TXN-9021",
      customerName: "Silambarasan G",
      customerEmail: "silambarasan@wegrow.com",
      item: "Full Stack Next.js Workshop",
      amount: "1,499",
      method: "UPI (Google Pay)",
      date: "Aug 11, 2026",
      time: "10:30 AM",
      status: "Success",
      invoiceUrl: "#",
    },
    {
      id: "TXN-9022",
      customerName: "Karthik Raja",
      customerEmail: "karthik@agritech.io",
      amount: "14,999",
      item: "Business Incubation Annual Pass",
      method: "Credit Card (HDFC)",
      date: "Aug 10, 2026",
      time: "04:15 PM",
      status: "Success",
      invoiceUrl: "#",
    },
    {
      id: "TXN-9023",
      customerName: "Priya Sharma",
      customerEmail: "priya@gmail.com",
      amount: "499",
      item: "Student Pro Subscription",
      method: "UPI (PhonePe)",
      date: "Aug 09, 2026",
      time: "01:20 PM",
      status: "Pending",
      invoiceUrl: "#",
    },
    {
      id: "TXN-9024",
      customerName: "Arun Kumar",
      customerEmail: "arun@ecopack.in",
      amount: "2,999",
      item: "Startup Mentorship Bootcamp",
      method: "Net Banking (SBI)",
      date: "Aug 08, 2026",
      time: "11:00 AM",
      status: "Failed",
      invoiceUrl: "#",
    },
    {
      id: "TXN-9025",
      customerName: "Suresh M",
      customerEmail: "suresh@dairyfresh.com",
      amount: "1,499",
      item: "Legal & GST Setup Workshop",
      method: "UPI (Paytm)",
      date: "Aug 05, 2026",
      time: "06:45 PM",
      status: "Refunded",
      invoiceUrl: "#",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // New Invoice Form State
  const [newInvoice, setNewInvoice] = useState({
    customerName: "",
    customerEmail: "",
    item: "",
    amount: "",
    method: "UPI (Google Pay)",
  });

  // Create Invoice Handler
  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: `TXN-${9020 + payments.length + 1}`,
      ...newInvoice,
      date: "Today",
      time: "Just Now",
      status: "Success",
      invoiceUrl: "#",
    };
    setPayments([created, ...payments]);
    setShowInvoiceModal(false);
    setNewInvoice({ customerName: "", customerEmail: "", item: "", amount: "", method: "UPI (Google Pay)" });
  };

  // Filter Logic
  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.item.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "All" || p.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex min-h-screen bg-slate-50/60 font-sans text-slate-800 antialiased">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Top Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Payments & Invoices</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Track gateway transactions, settlement statuses, and generate PDF invoices.
            </p>
          </div>

          <button
            onClick={() => setShowInvoiceModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Manual Invoice</span>
          </button>
        </div>

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Total Collected</p>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">₹2,45,000</h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Today's Revenue</p>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">₹16,498</h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Pending Settlements</p>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">
                {payments.filter((p) => p.status === "Pending").length} Txns
              </h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Failed Payments</p>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">
                {payments.filter((p) => p.status === "Failed").length} Txns
              </h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
              {["All", "Success", "Pending", "Failed", "Refunded"].map((st) => (
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
                placeholder="Search transaction ID, customer, item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:border-blue-600 transition-all"
              />
            </div>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-y border-slate-100">
                <tr>
                  <th className="p-3">Txn ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Item / Service</th>
                  <th className="p-3">Payment Method</th>
                  <th className="p-3">Date & Time</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition-all">
                      <td className="p-3 font-mono font-bold text-slate-900">{p.id}</td>
                      <td className="p-3">
                        <p className="font-bold text-slate-900">{p.customerName}</p>
                        <p className="text-[11px] text-slate-400">{p.customerEmail}</p>
                      </td>
                      <td className="p-3 font-semibold text-slate-700">{p.item}</td>
                      <td className="p-3 text-slate-600">{p.method}</td>
                      <td className="p-3 text-slate-500">
                        {p.date} <span className="text-[10px] text-slate-400">({p.time})</span>
                      </td>
                      <td className="p-3 font-black text-slate-900">₹{p.amount}</td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                            p.status === "Success"
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                              : p.status === "Pending"
                              ? "bg-amber-50 text-amber-600 border border-amber-200"
                              : p.status === "Failed"
                              ? "bg-rose-50 text-rose-600 border border-rose-200"
                              : "bg-purple-50 text-purple-600 border border-purple-200"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => alert(`Downloading Invoice PDF for ${p.id}`)}
                          className="p-1.5 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-lg transition-all cursor-pointer inline-flex items-center gap-1 font-bold text-[11px]"
                          title="Download Invoice PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      No payment records found matching search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Manual Invoice Creation Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4 border border-slate-100">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Generate Manual Invoice</h3>
              <button onClick={() => setShowInvoiceModal(false)} className="cursor-pointer text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Customer Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Silambarasan G"
                  className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none focus:border-blue-600"
                  value={newInvoice.customerName}
                  onChange={(e) => setNewInvoice({ ...newInvoice, customerName: e.target.value })}
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Customer Email</label>
                <input
                  type="email"
                  required
                  placeholder="customer@wegrow.com"
                  className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none focus:border-blue-600"
                  value={newInvoice.customerEmail}
                  onChange={(e) => setNewInvoice({ ...newInvoice, customerEmail: e.target.value })}
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Service / Workshop Item</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js 14 Masterclass"
                  className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none"
                  value={newInvoice.item}
                  onChange={(e) => setNewInvoice({ ...newInvoice, item: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Amount (₹)</label>
                  <input
                    type="text"
                    required
                    placeholder="1,499"
                    className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none"
                    value={newInvoice.amount}
                    onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Payment Method</label>
                  <select
                    className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none font-bold"
                    value={newInvoice.method}
                    onChange={(e) => setNewInvoice({ ...newInvoice, method: e.target.value })}
                  >
                    <option value="UPI (Google Pay)">UPI (Google Pay)</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="Cash / Bank Transfer">Cash / Bank Transfer</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}