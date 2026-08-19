import React, { useState, useEffect } from "react";
import BusinessSidebar from "../../components/BusinessSidebar";
import { getSubscriptions, getInvoices } from "../../services/api";
import {
  CreditCard,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Download,
  Sparkles,
  ArrowRight,
  Clock,
  AlertCircle,
  HelpCircle,
  Plus
} from "lucide-react";

export default function BusinessSubscriptions() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [plans, setPlans] = useState<any[]>([
    {
      id: "starter",
      name: "Starter Founder",
      desc: "For early-stage entrepreneurs exploring market validation.",
      monthlyPrice: "₹0",
      yearlyPrice: "₹0",
      popular: false,
      features: [
        "Business Model Canvas Tool",
        "Community Access",
        "Basic Roadmap Tracker",
        "1 Pitch Deck Review / month"
      ],
      buttonText: "Current Free Plan",
      current: false,
    },
    {
      id: "pro",
      name: "Pro Growth Pass",
      desc: "For growing startups seeking investor pitch deck access & mentors.",
      monthlyPrice: "₹1,499",
      yearlyPrice: "₹1,199",
      period: "/ month",
      popular: true,
      features: [
        "All Starter Features",
        "Unlimited Investor Pitch Downloads",
        "2 One-on-One Legal/Mentor Sessions",
        "Real-Time Business Analytics Dashboard",
        "Priority Statutory Compliance Alerts"
      ],
      buttonText: "Upgrade to Pro Pass",
      current: true,
    },
    {
      id: "incubator",
      name: "Incubator & Scale",
      desc: "Comprehensive suite for funded startups & enterprise scale.",
      monthlyPrice: "₹4,999",
      yearlyPrice: "₹3,999",
      period: "/ month",
      popular: false,
      features: [
        "All Pro Features",
        "Dedicated Legal & Chartered Accountant Support",
        "Direct Investor Matchmaking Pipeline",
        "Custom Startup Analytics & Export",
        "24/7 Dedicated Account Manager"
      ],
      buttonText: "Contact Enterprise Sales",
      current: false,
    },
  ]);
  const [invoices, setInvoices] = useState<any[]>([
    { id: "INV-2026-008", date: "Aug 01, 2026", amount: "₹1,199", plan: "Pro Growth Pass (Annual)", status: "Paid" },
    { id: "INV-2026-007", date: "Jul 01, 2026", amount: "₹1,199", plan: "Pro Growth Pass (Annual)", status: "Paid" },
    { id: "INV-2026-006", date: "Jun 01, 2026", amount: "₹1,199", plan: "Pro Growth Pass (Annual)", status: "Paid" },
  ]);

  useEffect(() => {
    async function loadData() {
      try {
        const subscriptionsData = await getSubscriptions();
        if (subscriptionsData && subscriptionsData.length > 0) {
          setPlans(subscriptionsData);
        }
        
        const invoicesData = await getInvoices();
        if (invoicesData && invoicesData.length > 0) {
          setInvoices(invoicesData);
        }
      } catch (error) {
        console.error("Failed to load subscription data", error);
      }
    }
    loadData();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50/60 font-sans text-slate-800 antialiased">
      {/* Business Sidebar */}
      <BusinessSidebar />

      {/* Main Subscriptions Dashboard */}
      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <CreditCard className="w-7 h-7 text-blue-600" />
              Subscriptions & Billing
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Manage your WeGrow membership plan, payment methods, and invoice billing history.
            </p>
          </div>

          {/* Monthly / Yearly Toggle */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-xs self-start md:self-auto">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-3.5 py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                billingCycle === "monthly" ? "bg-blue-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-3.5 py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                billingCycle === "yearly" ? "bg-blue-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <span>Yearly Billing</span>
              <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-1.5 py-0.5 rounded-full">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* Current Plan Overview Card */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-lg text-[10px] font-extrabold uppercase tracking-wider">
                Active Subscription
              </span>
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Auto-renewing
              </span>
            </div>
            <h2 className="text-xl font-black">Pro Growth Pass Plan</h2>
            <p className="text-xs text-slate-300">
              Your next billing date is <span className="font-bold text-white">September 01, 2026</span> (billed ₹1,199/month annually).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer">
              Cancel Plan
            </button>
            <button className="bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer">
              Change Plan
            </button>
          </div>
        </div>

        {/* Subscription Tier Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl border p-6 shadow-xs flex flex-col justify-between space-y-6 relative transition-all ${
                plan.popular
                  ? "border-blue-600 ring-2 ring-blue-600/10 shadow-md"
                  : "border-slate-200/80"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Most Popular Choice
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{plan.desc}</p>
                </div>

                <div className="flex items-baseline gap-1 pt-2">
                  <span className="text-3xl font-black text-slate-900">
                    {billingCycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  {plan.period && <span className="text-xs text-slate-400 font-bold">{plan.period}</span>}
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-2.5 text-xs">
                  <p className="font-bold text-slate-700 uppercase text-[10px] tracking-wider">What’s included:</p>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 font-medium text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  plan.current
                    ? "bg-slate-100 text-slate-500 cursor-not-allowed border border-slate-200"
                    : plan.popular
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 active:scale-95"
                    : "bg-slate-900 hover:bg-slate-800 text-white active:scale-95"
                }`}
              >
                {plan.current ? "Current Active Plan" : plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Payment Method & Invoices Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Billing Invoices Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Billing History & Invoices</h2>
                <p className="text-xs text-slate-400">Download past subscription receipts and tax invoices.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400 font-bold border-y border-slate-100">
                    <th className="p-3">Invoice ID</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Plan Details</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/60 transition-all cursor-pointer">
                      <td className="p-3 font-bold text-slate-900">{inv.id}</td>
                      <td className="p-3 text-slate-500">{inv.date}</td>
                      <td className="p-3 text-slate-700">{inv.plan}</td>
                      <td className="p-3 font-extrabold text-slate-900">{inv.amount}</td>
                      <td className="p-3 text-right">
                        <button className="p-1.5 hover:bg-slate-100 text-blue-600 rounded-lg transition-all cursor-pointer flex items-center gap-1 ml-auto font-bold text-[11px]">
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Card & Help */}
          <div className="space-y-6">
            {/* Payment Method */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-base font-extrabold text-slate-900">Payment Method</h2>
                <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer">
                  <Plus className="w-3.5 h-3.5" /> Edit
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center gap-3">
                <div className="w-10 h-7 rounded-md bg-slate-900 text-white font-black text-[10px] flex items-center justify-center tracking-wider">
                  VISA
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Visa ending in •••• 4288</h4>
                  <p className="text-[10px] text-slate-400">Expires 11/2028</p>
                </div>
              </div>
            </div>

            {/* Need Billing Help */}
            <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-5 space-y-2">
              <h3 className="font-extrabold text-blue-900 text-xs flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-blue-600" /> Need Tax Invoice or GST Credit?
              </h3>
              <p className="text-[11px] text-blue-800/80 leading-relaxed">
                Add your GSTIN under profile settings to receive automatic GST Input Tax Credit invoices for all payments.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}