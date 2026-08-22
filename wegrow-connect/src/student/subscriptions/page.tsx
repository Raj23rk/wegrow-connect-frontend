import React, { useState, useEffect } from "react";
import StudentSidebar from "../../components/StudentSidebar";
import DashboardProfileMenu, { useDashboardUser } from "../../components/DashboardProfileMenu";
import { getStudentSubscriptions, getInvoices } from "../../services/api";
import { openRazorpaySubscriptionCheckout } from "../../services/razorpay";
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
  Plus,
  Loader2,
  Award
} from "lucide-react";

export default function StudentSubscriptions() {
  const { user } = useDashboardUser();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [activePlanName, setActivePlanName] = useState<string>("Student Free");
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>("free");
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Default fallback plans
  const [plans, setPlans] = useState<any[]>([
    {
      id: "student-free",
      name: "Student Free Pass",
      type: "STUDENT",
      desc: "Basic access to community workshops, learning roadmaps, and free events.",
      monthlyPrice: "₹0",
      yearlyPrice: "₹0",
      price: 0,
      popular: false,
      features: [
        "Access to Public Workshops",
        "Community Chat & Forums",
        "Basic Skill Track Roadmaps",
        "1 Free Verified Certificate"
      ],
      buttonText: "Current Free Plan",
      current: true,
    },
    {
      id: "student-pro",
      name: "Student Pro Pass",
      type: "STUDENT",
      desc: "Unlimited access to all live masterclasses, mentor 1-on-1 sessions & unlimited certificates.",
      monthlyPrice: "₹499",
      yearlyPrice: "₹399",
      price: 499,
      period: "/ month",
      popular: true,
      features: [
        "All Free Features Included",
        "Unlimited Live Masterclasses & Recordings",
        "Unlimited Certificate Downloads",
        "1-on-1 Mentor Guidance & Doubt Solving",
        "Priority Internship & Job Matchmaking",
        "Direct Access to Incubator Network"
      ],
      buttonText: "Upgrade to Pro Pass",
      current: false,
    },
    {
      id: "student-master",
      name: "Campus Ambassador & Scale",
      type: "STUDENT",
      desc: "For student leaders running campus clubs & seeking exclusive incubator access.",
      monthlyPrice: "₹1,499",
      yearlyPrice: "₹1,199",
      price: 1199,
      period: "/ month",
      popular: false,
      features: [
        "All Student Pro Features",
        "Campus Ambassador Leadership Kit",
        "Direct Startup Pitch Deck Submission",
        "Dedicated Career Mentor Allocation",
        "Exclusive VIP Masterclasses with Founders"
      ],
      buttonText: "Join Campus Leader Pass",
      current: false,
    },
  ]);

  const [invoices, setInvoices] = useState<any[]>([]);

  // Logged in user details
  const currentUser = (() => {
    try {
      const raw = sessionStorage.getItem("user");
      return raw ? JSON.parse(raw) : (user || {});
    } catch {
      return user || {};
    }
  })();

  // Resolve active subscription status
  useEffect(() => {
    const status =
      currentUser?.subscriptionStatus ||
      currentUser?.subscription?.status ||
      currentUser?.plan ||
      "";
    if (status) {
      setSubscriptionStatus(typeof status === "string" ? status.toLowerCase() : "free");
      if (status.toLowerCase() === "active") {
        setActivePlanName(currentUser?.plan || "Student Pro Pass");
      }
    }
  }, [currentUser]);

  // Load plans & invoices from backend API
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const fetchedPlans = await getStudentSubscriptions();
        if (Array.isArray(fetchedPlans) && fetchedPlans.length > 0) {
          setPlans(fetchedPlans);
        }

        const invoicesData = await getInvoices();
        if (Array.isArray(invoicesData) && invoicesData.length > 0) {
          setInvoices(invoicesData);
        }
      } catch (error) {
        console.error("Failed to load student subscription plans", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Razorpay checkout handler for Student
  const handleSubscribePlan = (plan: any) => {
    if (plan.current || plan.price === 0) return;
    setCheckoutLoading(plan.id);

    openRazorpaySubscriptionCheckout({
      plan: { ...plan, type: "STUDENT" },
      user: currentUser,
      onSuccess: (result: any) => {
        console.log("Student subscription payment success:", result);
        setActivePlanName(plan.name);
        setSubscriptionStatus("active");

        setPlans((prev) =>
          prev.map((p) => ({
            ...p,
            current: p.id === plan.id || p.name === plan.name,
          }))
        );

        alert(`🎉 Payment successful! You are now subscribed to "${plan.name}".`);
        setCheckoutLoading(null);
      },
      onError: (err: any) => {
        console.error("Subscription payment failed:", err);
        setCheckoutLoading(null);
      },
    });
  };

  const handleDownloadPdf = (inv: any) => {
    if (inv?.filePath) {
      window.open(inv.filePath, "_blank", "noopener,noreferrer");
    } else {
      alert(`Downloading receipt for Invoice ID: ${inv.id || inv._id || inv.invoiceNumber}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50/60 font-sans text-slate-800 antialiased">
      {/* Student Sidebar */}
      <StudentSidebar />

      {/* Main Subscriptions Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen max-h-screen overflow-hidden">
        {/* Header Bar */}
        <header className="bg-white border-b border-slate-200/80 px-8 py-3.5 flex items-center justify-between shadow-2xs shrink-0 z-20">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <CreditCard className="w-6 h-6 text-teal-600" />
              Student Subscriptions & Plans
            </h1>
            <p className="text-[11px] font-bold text-slate-400 mt-0.5">
              Upgrade your learning pass, access masterclasses & verified certificates.
            </p>
          </div>
          <DashboardProfileMenu />
        </header>

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Active Subscription Overview Card */}
          <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-teal-800/40">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 bg-teal-500/20 text-teal-300 border border-teal-400/30 rounded-xl text-[10px] font-black uppercase tracking-wider">
                  {subscriptionStatus === "active" ? "Active Subscription" : "Free Learning Tier"}
                </span>
                {subscriptionStatus === "active" && (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Pro Unlocked
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-black tracking-tight">{activePlanName}</h2>
              <p className="text-xs text-slate-300 font-medium">
                {subscriptionStatus === "active"
                  ? "Enjoy unlimited access to masterclasses, certificates, and 1-on-1 mentor guidance."
                  : "You are currently on the Free Student Pass. Upgrade to unlock verified certificates & masterclasses."}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {subscriptionStatus !== "active" && (
                <button
                  onClick={() => {
                    const proPlan = plans.find((p) => p.popular) || plans[1] || plans[0];
                    if (proPlan) handleSubscribePlan(proPlan);
                  }}
                  className="bg-teal-500 hover:bg-teal-400 active:scale-95 transition-all text-white px-5 py-3 rounded-2xl text-xs font-black shadow-lg shadow-teal-500/20 cursor-pointer flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" /> Upgrade to Pro Pass
                </button>
              )}
            </div>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Choose Subscription Billing</h3>
              <p className="text-xs text-slate-400 mt-0.5">Save up to 20% on annual student plans</p>
            </div>
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                  billingCycle === "yearly"
                    ? "bg-teal-600 text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Yearly Billing <span className="bg-emerald-400 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase">Save 20%</span>
              </button>
            </div>
          </div>

          {/* Subscription Tier Cards Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
              <span className="ml-3 text-sm text-slate-500 font-bold">Loading student plans...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const isCurrent =
                  plan.current ||
                  (subscriptionStatus === "active" && plan.name === activePlanName) ||
                  (subscriptionStatus !== "active" && plan.price === 0);

                return (
                  <div
                    key={plan.id}
                    className={`bg-white rounded-3xl border p-7 shadow-xs flex flex-col justify-between space-y-6 relative transition-all ${
                      plan.popular
                        ? "border-teal-500 ring-2 ring-teal-500/10 shadow-xl"
                        : "border-slate-200/80"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Recommended for Students
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-black text-slate-900">{plan.name}</h3>
                        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-medium">
                          {plan.desc || plan.description}
                        </p>
                      </div>

                      <div className="flex items-baseline gap-1 pt-2">
                        <span className="text-3xl font-black text-slate-900">
                          {billingCycle === "yearly"
                            ? plan.yearlyPrice || plan.monthlyPrice
                            : plan.monthlyPrice}
                        </span>
                        {plan.price > 0 && (
                          <span className="text-xs text-slate-400 font-extrabold">{plan.period || "/ month"}</span>
                        )}
                      </div>

                      <div className="border-t border-slate-100 pt-4 space-y-2.5 text-xs">
                        <p className="font-extrabold text-slate-700 uppercase text-[10px] tracking-wider">
                          Includes Features:
                        </p>
                        {(plan.features || []).map((feat: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2.5 font-semibold text-slate-600">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleSubscribePlan(plan)}
                      disabled={isCurrent || plan.price === 0 || checkoutLoading === plan.id}
                      className={`w-full py-3 rounded-2xl text-xs font-black transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                        isCurrent
                          ? "bg-slate-100 text-slate-500 cursor-not-allowed border border-slate-200"
                          : plan.popular
                          ? "bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-500/20 active:scale-95"
                          : "bg-slate-900 hover:bg-slate-800 text-white active:scale-95"
                      }`}
                    >
                      {checkoutLoading === plan.id
                        ? "Opening Checkout..."
                        : isCurrent
                        ? "✅ Current Active Plan"
                        : plan.price === 0
                        ? "Free Student Tier"
                        : plan.buttonText || "Subscribe Now"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Payment Receipts & Invoices Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-black text-slate-900">Student Receipts & Invoices</h2>
                <p className="text-xs text-slate-400 mt-0.5">Download your subscription payment receipts and tax invoices.</p>
              </div>
            </div>

            {invoices.length === 0 ? (
              <div className="text-center py-8">
                <ShieldCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-400 font-medium">No past invoices available yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400 font-bold border-y border-slate-100">
                      <th className="p-3">Invoice #</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Plan</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {invoices.map((inv, idx) => (
                      <tr key={inv.id || idx} className="hover:bg-slate-50/60 transition-all">
                        <td className="p-3 font-mono font-bold text-slate-900">{inv.invoiceNumber || inv.id}</td>
                        <td className="p-3 text-slate-500">{inv.date || inv.issuedDate}</td>
                        <td className="p-3 font-semibold text-slate-800">{inv.plan}</td>
                        <td className="p-3 font-bold text-slate-900">{inv.amount}</td>
                        <td className="p-3">
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-extrabold">
                            {inv.status || "Paid"}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDownloadPdf(inv)}
                            className="text-teal-600 hover:text-teal-700 font-bold text-xs flex items-center gap-1 ml-auto cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" /> PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
