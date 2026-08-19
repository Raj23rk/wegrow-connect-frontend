import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import {
  getSubscriptions,
  updateSubscriptionStatus,
  createSubscriptionPlan,
  admingetSubscriptions,
} from "../../services/api";

import {
  Plus,
  Search,
  Zap,
  TrendingUp,
  UserCheck,
  AlertTriangle,
  X,
  Calendar,
  IndianRupee,
} from "lucide-react";

export default function SubscriptionsPage() {
  // =====================================================
  // STATE
  // =====================================================

  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [showCreatePlanModal, setShowCreatePlanModal] =
    useState(false);

  const [isCreatingPlan, setIsCreatingPlan] = useState(false);

  // =====================================================
  // CREATE PLAN FORM
  // =====================================================

  const [newPlanData, setNewPlanData] = useState({
    name: "",
    description: "",
    price: "",
    currency: "INR",
    features: "",
    durationDays: "30",
  });

  // =====================================================
  // LOAD ALL SUBSCRIPTIONS
  // =====================================================

  const loadSubscriptions = async () => {
    try {
      const data = await admingetSubscriptions();

      console.log("Subscriptions from API:", data);

      if (Array.isArray(data)) {
        setSubscriptions(data);
      } else {
        setSubscriptions([]);
      }
    } catch (error) {
      console.error("Failed to load subscriptions:", error);
      setSubscriptions([]);
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  // =====================================================
  // FILTER SUBSCRIPTIONS
  // =====================================================

  const filteredSubscriptions = subscriptions.filter((s) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      String(s?.userName || "")
        .toLowerCase()
        .includes(search) ||
      String(s?.userEmail || "")
        .toLowerCase()
        .includes(search) ||
      String(s?.plan || s?.planName || "")
        .toLowerCase()
        .includes(search);

    const status = s?.status || "";

    const matchesStatus =
      selectedStatus === "All" ||
      status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // =====================================================
  // CANCEL / EXPIRE SUBSCRIPTION
  // =====================================================

  const handleCancelSub = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this subscription?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await updateSubscriptionStatus(id, "Expired");

      setSubscriptions((prev) =>
        prev.map((subscription) =>
          subscription.id === id ||
          subscription._id === id
            ? {
                ...subscription,
                status: "Expired",
              }
            : subscription
        )
      );

      alert("Subscription expired successfully.");
    } catch (error) {
      console.error(
        "Failed to cancel subscription:",
        error
      );

      alert("Failed to cancel subscription.");
    }
  };

  // =====================================================
  // CREATE PLAN
  // =====================================================

  const handleCreatePlan = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // -----------------------------------------------
    // VALIDATION
    // -----------------------------------------------

    if (!newPlanData.name.trim()) {
      alert("Please enter plan name.");
      return;
    }

    if (!newPlanData.description.trim()) {
      alert("Please enter plan description.");
      return;
    }

    if (
      !newPlanData.price ||
      Number(newPlanData.price) < 0
    ) {
      alert("Please enter a valid price.");
      return;
    }

    if (
      !newPlanData.durationDays ||
      Number(newPlanData.durationDays) <= 0
    ) {
      alert("Please enter a valid duration.");
      return;
    }

    if (!newPlanData.features.trim()) {
      alert("Please enter at least one feature.");
      return;
    }

    // -----------------------------------------------
    // CORRECT BACKEND PAYLOAD
    // -----------------------------------------------

    const payload = {
      name: newPlanData.name.trim(),

      description: newPlanData.description.trim(),

      price: Number(newPlanData.price),

      currency: newPlanData.currency,

      features: newPlanData.features
        .split(",")
        .map((feature) => feature.trim())
        .filter(Boolean),

      durationDays: Number(
        newPlanData.durationDays
      ),
    };

    console.log(
      "CREATE PLAN PAYLOAD:",
      payload
    );

    try {
      setIsCreatingPlan(true);

      const response =
        await createSubscriptionPlan(payload);

      console.log(
        "CREATE PLAN RESPONSE:",
        response
      );

      if (response?.success === false) {
        alert(
          response?.message ||
            "Failed to create subscription plan."
        );
        return;
      }

      alert(
        "New subscription plan created successfully!"
      );

      // ---------------------------------------------
      // CLOSE MODAL
      // ---------------------------------------------

      setShowCreatePlanModal(false);

      // ---------------------------------------------
      // RESET FORM
      // ---------------------------------------------

      setNewPlanData({
        name: "",
        description: "",
        price: "",
        currency: "INR",
        features: "",
        durationDays: "30",
      });

      // ---------------------------------------------
      // REFRESH SUBSCRIPTIONS
      // ---------------------------------------------

      await loadSubscriptions();
    } catch (error: any) {
      console.error(
        "Failed to create plan:",
        error
      );

      alert(
        error?.message ||
          "Failed to create subscription plan."
      );
    } finally {
      setIsCreatingPlan(false);
    }
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const handleCloseModal = () => {
    if (isCreatingPlan) {
      return;
    }

    setShowCreatePlanModal(false);

    setNewPlanData({
      name: "",
      description: "",
      price: "",
      currency: "INR",
      features: "",
      durationDays: "30",
    });
  };

  // =====================================================
  // SUBSCRIPTION COUNTS
  // =====================================================

  const activeCount = subscriptions.filter(
    (s) =>
      String(s?.status || "").toLowerCase() ===
      "active"
  ).length;

  const pendingCount = subscriptions.filter(
    (s) =>
      String(s?.status || "").toLowerCase() ===
      "pending"
  ).length;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="flex min-h-screen bg-slate-50/60 font-sans text-slate-800 antialiased">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <Sidebar />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex justify-between items-center">

          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Subscriptions & Billing
            </h1>

            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Manage student plans, business growth tier
              subscriptions, and recurring revenue.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowCreatePlanModal(true)
            }
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />

            <span>Create New Plan</span>
          </button>
        </div>

        {/* =================================================
            METRIC CARDS
        ================================================= */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* MRR */}

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">

            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">
                Monthly Recurring (MRR)
              </p>

              <h2 className="text-xl font-black text-slate-900 mt-0.5">
                ₹1,84,500
              </h2>
            </div>

            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>

          </div>

          {/* ACTIVE */}

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">

            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">
                Active Paid Subs
              </p>

              <h2 className="text-xl font-black text-slate-900 mt-0.5">
                {activeCount} Subscribers
              </h2>
            </div>

            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>

          </div>

          {/* PENDING */}

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">

            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">
                Pending Payments
              </p>

              <h2 className="text-xl font-black text-slate-900 mt-0.5">
                {pendingCount} Requests
              </h2>
            </div>

            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>

          </div>

          {/* PLANS */}

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">

            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">
                Active Tier Plans
              </p>

              <h2 className="text-xl font-black text-slate-900 mt-0.5">
                3 Pricing Tiers
              </h2>
            </div>

            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>

          </div>

        </div>

        {/* =================================================
            PRICING PLANS
        ================================================= */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* FREE */}

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">

            <div className="flex justify-between items-center">

              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-100 text-slate-700">
                Community
              </span>

              <span className="text-lg font-black text-slate-900">
                Free
              </span>

            </div>

            <h3 className="font-bold text-sm text-slate-900">
              Student Basic
            </h3>

            <p className="text-xs text-slate-500">
              Access to free workshops, basic discord
              community, and event updates.
            </p>

          </div>

          {/* STUDENT PRO */}

          <div className="bg-white p-5 rounded-2xl border border-blue-200 bg-blue-50/20 shadow-xs space-y-3 relative overflow-hidden">

            <div className="flex justify-between items-center">

              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-100 text-blue-700">
                Popular
              </span>

              <span className="text-lg font-black text-blue-600">
                ₹499 / mo
              </span>

            </div>

            <h3 className="font-bold text-sm text-slate-900">
              Student Pro Pass
            </h3>

            <p className="text-xs text-slate-500">
              Unlimited masterclasses, certificate downloads,
              and 1-on-1 mentor guidance.
            </p>

          </div>

          {/* BUSINESS */}

          <div className="bg-white p-5 rounded-2xl border border-purple-200 bg-purple-50/20 shadow-xs space-y-3">

            <div className="flex justify-between items-center">

              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-purple-100 text-purple-700">
                Enterprise
              </span>

              <span className="text-lg font-black text-purple-600">
                ₹1,499 / mo
              </span>

            </div>

            <h3 className="font-bold text-sm text-slate-900">
              Startup & Business Tier
            </h3>

            <p className="text-xs text-slate-500">
              Post unlimited tech hiring jobs, startup
              pitch reviews, and incubator matching.
            </p>

          </div>

        </div>

        {/* =================================================
            SUBSCRIPTIONS TABLE
        ================================================= */}

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">

          {/* FILTER + SEARCH */}

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">

            {/* STATUS FILTER */}

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">

              {[
                "All",
                "Active",
                "Pending",
                "Expired",
              ].map((status) => (

                <button
                  key={status}
                  type="button"
                  onClick={() =>
                    setSelectedStatus(status)
                  }
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    selectedStatus === status
                      ? "bg-white text-blue-600 shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {status}
                </button>

              ))}

            </div>

            {/* SEARCH */}

            <div className="relative w-full sm:w-72">

              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search user, plan, email..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:border-blue-600 transition-all"
              />

            </div>

          </div>

          {/* =================================================
              TABLE
          ================================================= */}

          <div className="overflow-x-auto">

            <table className="w-full text-left text-xs">

              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-y border-slate-100">

                <tr>

                  <th className="p-3">
                    Sub ID
                  </th>

                  <th className="p-3">
                    User
                  </th>

                  <th className="p-3">
                    Plan Tier
                  </th>

                  <th className="p-3">
                    Billing Cycle
                  </th>

                  <th className="p-3">
                    Amount
                  </th>

                  <th className="p-3">
                    Next Renewal
                  </th>

                  <th className="p-3">
                    Status
                  </th>

                  <th className="p-3 text-center">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100 font-medium">

                {filteredSubscriptions.length > 0 ? (

                  filteredSubscriptions.map(
                    (subscription, index) => {

                      const id =
                        subscription.id ||
                        subscription._id ||
                        `SUB-${index}`;

                      const userName =
                        subscription.userName ||
                        subscription.user?.name ||
                        subscription.user?.fullName ||
                        "Unknown User";

                      const userEmail =
                        subscription.userEmail ||
                        subscription.user?.email ||
                        "-";

                      const plan =
                        subscription.plan ||
                        subscription.planName ||
                        subscription.plan?.name ||
                        "Unknown Plan";

                      const cycle =
                        subscription.cycle ||
                        subscription.billingCycle ||
                        subscription.durationDays
                          ? `${subscription.durationDays} Days`
                          : "Monthly";

                      const amount =
                        subscription.amount ||
                        subscription.price
                          ? `₹${subscription.price}`
                          : "₹0";

                      const nextBilling =
                        subscription.nextBilling ||
                        subscription.endDate ||
                        subscription.expiryDate ||
                        "-";

                      const status =
                        subscription.status ||
                        "Pending";

                      return (

                        <tr
                          key={id}
                          className="hover:bg-slate-50/60 transition-all"
                        >

                          {/* ID */}

                          <td className="p-3 font-mono font-bold text-slate-900">
                            {id}
                          </td>

                          {/* USER */}

                          <td className="p-3">

                            <p className="font-bold text-slate-900">
                              {userName}
                            </p>

                            <p className="text-[11px] text-slate-400">
                              {userEmail}
                            </p>

                          </td>

                          {/* PLAN */}

                          <td className="p-3">

                            <span
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                                String(plan)
                                  .toLowerCase()
                                  .includes("student")
                                  ? "bg-blue-50 text-blue-600"
                                  : String(plan)
                                      .toLowerCase()
                                      .includes(
                                        "business"
                                      )
                                  ? "bg-purple-50 text-purple-600"
                                  : "bg-emerald-50 text-emerald-600"
                              }`}
                            >
                              {typeof plan === "object"
                                ? plan?.name ||
                                  "Unknown Plan"
                                : plan}
                            </span>

                          </td>

                          {/* CYCLE */}

                          <td className="p-3 text-slate-600 font-semibold">
                            {cycle}
                          </td>

                          {/* AMOUNT */}

                          <td className="p-3 font-extrabold text-slate-900">
                            {amount}
                          </td>

                          {/* NEXT BILLING */}

                          <td className="p-3 text-slate-500">
                            {nextBilling}
                          </td>

                          {/* STATUS */}

                          <td className="p-3">

                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                                String(status)
                                  .toLowerCase() ===
                                "active"
                                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                  : String(status)
                                      .toLowerCase() ===
                                    "pending"
                                  ? "bg-amber-50 text-amber-600 border border-amber-200"
                                  : "bg-rose-50 text-rose-600 border border-rose-200"
                              }`}
                            >
                              {status}
                            </span>

                          </td>

                          {/* ACTION */}

                          <td className="p-3 text-center">

                            <button
                              type="button"
                              onClick={() =>
                                handleCancelSub(
                                  id
                                )
                              }
                              disabled={
                                String(status)
                                  .toLowerCase() ===
                                "expired"
                              }
                              className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Cancel / Expire
                            </button>

                          </td>

                        </tr>

                      );
                    }
                  )

                ) : (

                  <tr>

                    <td
                      colSpan={8}
                      className="p-8 text-center text-slate-400"
                    >
                      No subscriptions found
                      matching search criteria.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </main>

      {/* =================================================
          CREATE PLAN MODAL
      ================================================= */}

      {showCreatePlanModal && (

        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4 border border-slate-100">

            {/* HEADER */}

            <div className="flex justify-between items-center border-b pb-3">

              <div>

                <h3 className="font-bold text-slate-900 text-sm">
                  Create New Subscription Plan
                </h3>

                <p className="text-[10px] text-slate-400 mt-1">
                  Create a new pricing plan
                </p>

              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isCreatingPlan}
                className="cursor-pointer text-slate-400 hover:text-slate-600 disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleCreatePlan}
              className="space-y-3 text-xs"
            >

              {/* PLAN NAME */}

              <div>

                <label className="font-bold text-slate-700 block mb-1">
                  Plan Name
                </label>

                <input
                  type="text"
                  required
                  placeholder="e.g. Student Pro"
                  value={newPlanData.name}
                  onChange={(e) =>
                    setNewPlanData({
                      ...newPlanData,
                      name: e.target.value,
                    })
                  }
                  className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none focus:border-blue-600"
                />

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="font-bold text-slate-700 block mb-1">
                  Description
                </label>

                <textarea
                  required
                  rows={2}
                  placeholder="Plan description..."
                  value={newPlanData.description}
                  onChange={(e) =>
                    setNewPlanData({
                      ...newPlanData,
                      description:
                        e.target.value,
                    })
                  }
                  className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none focus:border-blue-600 resize-none"
                />

              </div>

              {/* PRICE + CURRENCY */}

              <div className="grid grid-cols-2 gap-3">

                {/* PRICE */}

                <div>

                  <label className="font-bold text-slate-700 block mb-1">
                    Price
                  </label>

                  <div className="relative">

                    <IndianRupee className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      placeholder="2500"
                      value={newPlanData.price}
                      onChange={(e) =>
                        setNewPlanData({
                          ...newPlanData,
                          price: e.target.value,
                        })
                      }
                      className="w-full p-2.5 pl-8 border rounded-xl bg-slate-50 outline-none focus:border-blue-600"
                    />

                  </div>

                </div>

                {/* CURRENCY */}

                <div>

                  <label className="font-bold text-slate-700 block mb-1">
                    Currency
                  </label>

                  <select
                    required
                    value={newPlanData.currency}
                    onChange={(e) =>
                      setNewPlanData({
                        ...newPlanData,
                        currency:
                          e.target.value,
                      })
                    }
                    className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none focus:border-blue-600"
                  >
                    <option value="INR">
                      INR
                    </option>

                    <option value="USD">
                      USD
                    </option>

                    <option value="EUR">
                      EUR
                    </option>
                  </select>

                </div>

              </div>

              {/* DURATION */}

              <div>

                <label className="font-bold text-slate-700 block mb-1">
                  Duration (Days)
                </label>

                <div className="relative">

                  <Calendar className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="30"
                    value={
                      newPlanData.durationDays
                    }
                    onChange={(e) =>
                      setNewPlanData({
                        ...newPlanData,
                        durationDays:
                          e.target.value,
                      })
                    }
                    className="w-full p-2.5 pl-8 border rounded-xl bg-slate-50 outline-none focus:border-blue-600"
                  />

                </div>

                <p className="text-[10px] text-slate-400 mt-1">
                  30 = Monthly &nbsp; | &nbsp;
                  365 = Yearly
                </p>

              </div>

              {/* FEATURES */}

              <div>

                <label className="font-bold text-slate-700 block mb-1">
                  Features
                </label>

                <textarea
                  required
                  rows={3}
                  placeholder="Unlimited workshops, Certificates, Mentor guidance"
                  value={newPlanData.features}
                  onChange={(e) =>
                    setNewPlanData({
                      ...newPlanData,
                      features:
                        e.target.value,
                    })
                  }
                  className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none focus:border-blue-600 resize-none"
                />

                <p className="text-[10px] text-slate-400 mt-1">
                  Separate features with commas.
                </p>

              </div>

              {/* BUTTONS */}

              <div className="pt-2 flex gap-3">

                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isCreatingPlan}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isCreatingPlan}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >

                  <Zap className="w-3.5 h-3.5" />

                  <span>
                    {isCreatingPlan
                      ? "Creating..."
                      : "Create Plan"}
                  </span>

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}