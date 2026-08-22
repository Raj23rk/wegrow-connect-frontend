import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import Sidebar from "../../components/Sidebar";

import {
  getSubscriptions,
  updateSubscriptionStatus,
  createSubscriptionPlan,
  adminGetSubscriptions,
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
  RefreshCw,
  Loader2,
} from "lucide-react";


// =====================================================
// TYPES
// =====================================================

interface Subscription {
  id: string;

  userId?: string;

  userName?: string;

  userEmail?: string;

  planId?: string;

  planName?: string;

  plan?: any;

  type?: string;

  amount?: number;

  currency?: string;

  durationDays?: number;

  cycle?: string;

  billingCycle?: string;

  startDate?: string;

  endDate?: string;

  nextBilling?: string;

  status?: string;
}


interface Plan {
  id: string;

  name: string;

  type: string;

  description?: string;

  price: number;

  currency: string;

  durationDays: number;

  period?: string;

  features: string[];

  status?: string;

  isActive?: boolean;
}


// =====================================================
// INITIAL FORM
// =====================================================

const initialPlanData = {
  name: "",
  type: "STUDENT",

  description: "",

  price: "",

  currency: "INR",

  features: "",

  durationDays: "30",
};


// =====================================================
// COMPONENT
// =====================================================

export default function SubscriptionsPage() {

  // ===================================================
  // STATE
  // ===================================================

  const [
    subscriptions,
    setSubscriptions,
  ] = useState<Subscription[]>([]);


  const [
    plans,
    setPlans,
  ] = useState<Plan[]>([]);


  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");


  const [
    selectedStatus,
    setSelectedStatus,
  ] = useState("All");


  const [
    selectedPlanType,
    setSelectedPlanType,
  ] = useState("All");


  const [
    showCreatePlanModal,
    setShowCreatePlanModal,
  ] = useState(false);


  const [
    isCreatingPlan,
    setIsCreatingPlan,
  ] = useState(false);


  const [
    isLoading,
    setIsLoading,
  ] = useState(true);


  const [
    isRefreshing,
    setIsRefreshing,
  ] = useState(false);


  const [
    actionLoadingId,
    setActionLoadingId,
  ] = useState<string | null>(null);


  const [
    newPlanData,
    setNewPlanData,
  ] = useState(initialPlanData);


  // ===================================================
  // LOAD SUBSCRIPTIONS
  // ===================================================

  const loadSubscriptions = async () => {

    try {

      const response =
        await adminGetSubscriptions(
          1,
          100
        );

      console.log(
        "ADMIN SUBSCRIPTIONS:",
        response
      );

      setSubscriptions(
        Array.isArray(
          response?.subscriptions
        )
          ? response.subscriptions
          : []
      );

    } catch (error) {

      console.error(
        "Failed to load subscriptions:",
        error
      );

      setSubscriptions([]);

    }
  };


  // ===================================================
  // LOAD PLANS
  // ===================================================

  const loadPlans = async () => {

    try {

      const data =
        await getSubscriptions();

      console.log(
        "SUBSCRIPTION PLANS:",
        data
      );

      setPlans(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Failed to load plans:",
        error
      );

      setPlans([]);

    }
  };


  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {

    const loadData = async () => {

      setIsLoading(true);

      try {

        await Promise.all([
          loadSubscriptions(),
          loadPlans(),
        ]);

      } finally {

        setIsLoading(false);

      }
    };


    loadData();

  }, []);


  // ===================================================
  // REFRESH
  // ===================================================

  const handleRefresh = async () => {

    setIsRefreshing(true);

    try {

      await Promise.all([
        loadSubscriptions(),
        loadPlans(),
      ]);

    } finally {

      setIsRefreshing(false);

    }
  };


  // ===================================================
  // FILTER SUBSCRIPTIONS
  // ===================================================

  const filteredSubscriptions =
    useMemo(() => {

      const search =
        searchTerm
          .trim()
          .toLowerCase();


      return subscriptions.filter(
        (subscription) => {

          const userName =
            String(
              subscription.userName ||
              ""
            ).toLowerCase();


          const userEmail =
            String(
              subscription.userEmail ||
              ""
            ).toLowerCase();


          const planName =
            String(
              subscription.planName ||
              (
                typeof subscription.plan ===
                "string"
                  ? subscription.plan
                  : ""
              ) ||
              ""
            ).toLowerCase();


          const matchesSearch =
            !search ||
            userName.includes(search) ||
            userEmail.includes(search) ||
            planName.includes(search);


          const status =
            String(
              subscription.status ||
              ""
            ).toLowerCase();


          const matchesStatus =
            selectedStatus === "All" ||
            status ===
              selectedStatus.toLowerCase();


          const type =
            String(
              subscription.type ||
              ""
            ).toUpperCase();


          const matchesType =
            selectedPlanType === "All" ||
            type === selectedPlanType;


          return (
            matchesSearch &&
            matchesStatus &&
            matchesType
          );

        }
      );

    }, [
      subscriptions,
      searchTerm,
      selectedStatus,
      selectedPlanType,
    ]);


  // ===================================================
  // ACTIVE SUBSCRIPTIONS
  // ===================================================

  const activeSubscriptions =
    useMemo(
      () =>
        subscriptions.filter(
          (s) =>
            String(
              s.status || ""
            ).toLowerCase() ===
            "active"
        ),
      [subscriptions]
    );


  // ===================================================
  // PENDING SUBSCRIPTIONS
  // ===================================================

  const pendingSubscriptions =
    useMemo(
      () =>
        subscriptions.filter(
          (s) =>
            String(
              s.status || ""
            ).toLowerCase() ===
            "pending"
        ),
      [subscriptions]
    );


  // ===================================================
  // MRR
  // ===================================================

  const monthlyRecurringRevenue =
    useMemo(() => {

      return activeSubscriptions.reduce(
        (total, subscription) => {

          const amount =
            Number(
              subscription.amount || 0
            );

          const duration =
            Number(
              subscription.durationDays ||
              30
            );


          if (
            duration === 365
          ) {

            return (
              total +
              amount / 12
            );

          }


          if (
            duration > 30
          ) {

            return (
              total +
              (
                amount /
                duration
              ) *
              30
            );

          }


          return (
            total +
            amount
          );

        },
        0
      );

    }, [
      activeSubscriptions,
    ]);


  // ===================================================
  // ACTIVE PLANS
  // ===================================================

  const activePlans =
    useMemo(
      () =>
        plans.filter(
          (plan) =>
            plan.isActive !== false &&
            String(
              plan.status || "ACTIVE"
            ).toUpperCase() !==
            "INACTIVE"
        ),
      [plans]
    );


  // ===================================================
  // CANCEL / EXPIRE
  // ===================================================

  const handleCancelSub =
    async (
      subscription: Subscription
    ) => {

      const id =
        subscription.id;


      if (!id) {

        alert(
          "Subscription ID is missing."
        );

        return;

      }


      const confirmed =
        window.confirm(
          "Are you sure you want to expire this subscription?"
        );


      if (!confirmed) {
        return;
      }


      try {

        setActionLoadingId(id);


        const response =
          await updateSubscriptionStatus(
            id,
            "Expired"
          );


        if (
          response?.success === false
        ) {

          alert(
            response?.message ||
            "Failed to expire subscription."
          );

          return;

        }


        setSubscriptions(
          (previous) =>
            previous.map(
              (item) =>
                item.id === id
                  ? {
                      ...item,
                      status:
                        "Expired",
                    }
                  : item
            )
        );


        alert(
          "Subscription expired successfully."
        );

      } catch (error: any) {

        console.error(
          "Expire subscription error:",
          error
        );


        alert(
          error?.message ||
          "Failed to expire subscription."
        );

      } finally {

        setActionLoadingId(null);

      }

    };


  // ===================================================
  // CREATE PLAN
  // ===================================================

  const handleCreatePlan =
    async (
      event: React.FormEvent<HTMLFormElement>
    ) => {

      event.preventDefault();


      // -----------------------------------------------
      // VALIDATION
      // -----------------------------------------------

      if (
        !newPlanData.name.trim()
      ) {

        alert(
          "Please enter plan name."
        );

        return;

      }


      if (
        !newPlanData.description.trim()
      ) {

        alert(
          "Please enter plan description."
        );

        return;

      }


      const price =
        Number(
          newPlanData.price
        );


      if (
        !newPlanData.price ||
        Number.isNaN(price) ||
        price < 0
      ) {

        alert(
          "Please enter a valid price."
        );

        return;

      }


      const durationDays =
        Number(
          newPlanData.durationDays
        );


      if (
        !durationDays ||
        Number.isNaN(
          durationDays
        ) ||
        durationDays <= 0
      ) {

        alert(
          "Please enter valid duration."
        );

        return;

      }


      if (
        !newPlanData.features.trim()
      ) {

        alert(
          "Please enter at least one feature."
        );

        return;

      }


      // -----------------------------------------------
      // PAYLOAD
      // -----------------------------------------------

      const payload = {

        name:
          newPlanData.name.trim(),

        type:
          newPlanData.type,

        description:
          newPlanData.description.trim(),

        price,

        currency:
          newPlanData.currency,

        features:
          newPlanData.features
            .split(",")
            .map(
              (feature) =>
                feature.trim()
            )
            .filter(Boolean),

        durationDays,

      };


      console.log(
        "CREATE PLAN PAYLOAD:",
        payload
      );


      try {

        setIsCreatingPlan(true);


        const response =
          await createSubscriptionPlan(
            payload
          );


        console.log(
          "CREATE PLAN RESPONSE:",
          response
        );


        if (
          response?.success === false
        ) {

          alert(
            response?.message ||
            "Failed to create plan."
          );

          return;

        }


        alert(
          "Subscription plan created successfully."
        );


        // ---------------------------------------------
        // CLOSE MODAL
        // ---------------------------------------------

        setShowCreatePlanModal(
          false
        );


        // ---------------------------------------------
        // RESET
        // ---------------------------------------------

        setNewPlanData(
          initialPlanData
        );


        // ---------------------------------------------
        // REFRESH
        // ---------------------------------------------

        await loadPlans();


      } catch (error: any) {

        console.error(
          "Create plan error:",
          error
        );


        alert(
          error?.message ||
          "Failed to create subscription plan."
        );

      } finally {

        setIsCreatingPlan(
          false
        );

      }

    };


  // ===================================================
  // CLOSE MODAL
  // ===================================================

  const handleCloseModal = () => {

    if (isCreatingPlan) {
      return;
    }


    setShowCreatePlanModal(
      false
    );


    setNewPlanData(
      initialPlanData
    );

  };


  // ===================================================
  // FORMAT MONEY
  // ===================================================

  const formatMoney = (
    amount: number,
    currency = "INR"
  ) => {

    if (
      currency === "INR"
    ) {

      return `₹${Number(
        amount || 0
      ).toLocaleString("en-IN")}`;

    }


    return `${currency} ${Number(
      amount || 0
    ).toLocaleString(
      "en-IN"
    )}`;

  };


  // ===================================================
  // FORMAT DATE
  // ===================================================

  const formatDate = (
    value?: string
  ) => {

    if (!value) {
      return "-";
    }


    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return value;

    }


    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };


  // ===================================================
  // PLAN COLOR
  // ===================================================

  const getPlanColor = (
    type?: string
  ) => {

    if (
      String(type)
        .toUpperCase() ===
      "BUSINESS"
    ) {

      return {
        badge:
          "bg-purple-50 text-purple-600",
        border:
          "border-purple-200",
      };

    }


    return {
      badge:
        "bg-blue-50 text-blue-600",
      border:
        "border-blue-200",
    };

  };


  // ===================================================
  // STATUS COLOR
  // ===================================================

  const getStatusClass = (
    status?: string
  ) => {

    const value =
      String(
        status || ""
      ).toLowerCase();


    if (
      value === "active"
    ) {

      return "bg-emerald-50 text-emerald-600 border border-emerald-200";

    }


    if (
      value === "pending"
    ) {

      return "bg-amber-50 text-amber-600 border border-amber-200";

    }


    if (
      value === "expired" ||
      value === "cancelled"
    ) {

      return "bg-rose-50 text-rose-600 border border-rose-200";

    }


    return "bg-slate-50 text-slate-600 border border-slate-200";

  };


  // ===================================================
  // RENDER
  // ===================================================

  return (

    <div className="flex min-h-screen bg-slate-50/60 font-sans text-slate-800 antialiased">

      {/* ==============================================
          SIDEBAR
      ============================================== */}

      <Sidebar />


      {/* ==============================================
          MAIN
      ============================================== */}

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">

        {/* ============================================
            HEADER
        ============================================ */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <h1 className="text-2xl font-black text-slate-900 tracking-tight">

              Subscriptions & Billing

            </h1>


            <p className="text-xs text-slate-500 font-medium mt-1">

              Manage plans, subscribers,
              billing and recurring revenue.

            </p>

          </div>


          <div className="flex gap-2">

            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 disabled:opacity-50"
            >

              <RefreshCw
                className={`w-4 h-4 ${
                  isRefreshing
                    ? "animate-spin"
                    : ""
                }`}
              />

              Refresh

            </button>


            <button
              type="button"
              onClick={() =>
                setShowCreatePlanModal(true)
              }
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20"
            >

              <Plus className="w-4 h-4" />

              Create New Plan

            </button>

          </div>

        </div>


        {/* ============================================
            LOADING
        ============================================ */}

        {isLoading ? (

          <div className="bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center justify-center">

            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />

            <p className="text-sm font-semibold text-slate-500 mt-3">

              Loading subscription data...

            </p>

          </div>

        ) : (

          <>

            {/* ========================================
                METRICS
            ======================================== */}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

              {/* MRR */}

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">

                <div>

                  <p className="text-[10px] font-bold uppercase text-slate-400">

                    Monthly Recurring Revenue

                  </p>


                  <h2 className="text-xl font-black text-slate-900 mt-1">

                    {formatMoney(
                      monthlyRecurringRevenue
                    )}

                  </h2>

                </div>


                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">

                  <TrendingUp className="w-5 h-5" />

                </div>

              </div>


              {/* ACTIVE */}

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">

                <div>

                  <p className="text-[10px] font-bold uppercase text-slate-400">

                    Active Paid Subs

                  </p>


                  <h2 className="text-xl font-black text-slate-900 mt-1">

                    {activeSubscriptions.length}

                  </h2>

                </div>


                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">

                  <UserCheck className="w-5 h-5" />

                </div>

              </div>


              {/* PENDING */}

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">

                <div>

                  <p className="text-[10px] font-bold uppercase text-slate-400">

                    Pending Payments

                  </p>


                  <h2 className="text-xl font-black text-slate-900 mt-1">

                    {pendingSubscriptions.length}

                  </h2>

                </div>


                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">

                  <AlertTriangle className="w-5 h-5" />

                </div>

              </div>


              {/* PLANS */}

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">

                <div>

                  <p className="text-[10px] font-bold uppercase text-slate-400">

                    Active Tier Plans

                  </p>


                  <h2 className="text-xl font-black text-slate-900 mt-1">

                    {activePlans.length}

                  </h2>

                </div>


                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">

                  <Zap className="w-5 h-5" />

                </div>

              </div>

            </div>


            {/* ========================================
                DYNAMIC PLANS
            ======================================== */}

            <div>

              <div className="flex items-center justify-between mb-3">

                <div>

                  <h2 className="text-sm font-black text-slate-900">

                    Subscription Plans

                  </h2>


                  <p className="text-[11px] text-slate-400">

                    Plans loaded directly from backend.

                  </p>

                </div>

              </div>


              {activePlans.length === 0 ? (

                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">

                  <p className="text-sm text-slate-400">

                    No subscription plans found.

                  </p>

                </div>

              ) : (

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                  {activePlans.map(
                    (plan) => {

                      const colors =
                        getPlanColor(
                          plan.type
                        );


                      return (

                        <div
                          key={plan.id}
                          className={`bg-white p-5 rounded-2xl border ${colors.border} shadow-xs space-y-4`}
                        >

                          <div className="flex justify-between items-center">

                            <span
                              className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold ${colors.badge}`}
                            >

                              {plan.type}

                            </span>


                            <span className="text-lg font-black text-slate-900">

                              {formatMoney(
                                plan.price,
                                plan.currency
                              )}

                            </span>

                          </div>


                          <div>

                            <h3 className="font-bold text-sm text-slate-900">

                              {plan.name}

                            </h3>


                            <p className="text-xs text-slate-500 mt-1">

                              {plan.description ||
                                "No description available."}

                            </p>

                          </div>


                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">

                            <Calendar className="w-3.5 h-3.5" />

                            {plan.durationDays ===
                            365
                              ? "Yearly"
                              : plan.durationDays ===
                                30
                              ? "Monthly"
                              : `${plan.durationDays} Days`}

                          </div>


                          {plan.features.length >
                            0 && (

                            <div className="space-y-1">

                              {plan.features
                                .slice(0, 4)
                                .map(
                                  (
                                    feature,
                                    index
                                  ) => (

                                    <div
                                      key={index}
                                      className="text-[11px] text-slate-600 flex gap-2"
                                    >

                                      <span className="text-emerald-500">

                                        ✓

                                      </span>

                                      {feature}

                                    </div>

                                  )
                                )}

                            </div>

                          )}

                        </div>

                      );

                    }
                  )}

                </div>

              )}

            </div>


            {/* ========================================
                SUBSCRIPTIONS TABLE
            ======================================== */}

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">

              {/* FILTER */}

              <div className="flex flex-col lg:flex-row justify-between gap-4">

                <div className="flex flex-wrap items-center gap-2">

                  {[
                    "All",
                    "Active",
                    "Pending",
                    "Expired",
                  ].map(
                    (status) => (

                      <button
                        key={status}
                        type="button"
                        onClick={() =>
                          setSelectedStatus(
                            status
                          )
                        }
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                          selectedStatus ===
                          status
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >

                        {status}

                      </button>

                    )
                  )}

                </div>


                <div className="flex flex-col sm:flex-row gap-2">

                  <select
                    value={
                      selectedPlanType
                    }
                    onChange={(e) =>
                      setSelectedPlanType(
                        e.target.value
                      )
                    }
                    className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 outline-none"
                  >

                    <option value="All">

                      All Types

                    </option>

                    <option value="STUDENT">

                      Student

                    </option>

                    <option value="BUSINESS">

                      Business

                    </option>

                  </select>


                  <div className="relative w-full sm:w-72">

                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />


                    <input
                      type="text"
                      placeholder="Search user, plan, email..."
                      value={
                        searchTerm
                      }
                      onChange={(e) =>
                        setSearchTerm(
                          e.target.value
                        )
                      }
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-blue-600"
                    />

                  </div>

                </div>

              </div>


              {/* TABLE */}

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
                        Plan
                      </th>

                      <th className="p-3">
                        Type
                      </th>

                      <th className="p-3">
                        Billing
                      </th>

                      <th className="p-3">
                        Amount
                      </th>

                      <th className="p-3">
                        Renewal
                      </th>

                      <th className="p-3">
                        Status
                      </th>

                      <th className="p-3 text-center">
                        Action
                      </th>

                    </tr>

                  </thead>


                  <tbody className="divide-y divide-slate-100">

                    {filteredSubscriptions.length >
                    0 ? (

                      filteredSubscriptions.map(
                        (
                          subscription,
                          index
                        ) => {

                          const id =
                            subscription.id ||
                            `SUB-${index}`;


                          const status =
                            subscription.status ||
                            "Pending";


                          const isExpired =
                            [
                              "expired",
                              "cancelled",
                            ].includes(
                              String(
                                status
                              ).toLowerCase()
                            );


                          const planName =
                            subscription.planName ||
                            (
                              typeof subscription.plan ===
                              "string"
                                ? subscription.plan
                                : subscription.plan?.name
                            ) ||
                            "Unknown Plan";


                          return (

                            <tr
                              key={id}
                              className="hover:bg-slate-50/60"
                            >

                              <td className="p-3">

                                <span className="font-mono font-bold text-slate-900">

                                  {id}

                                </span>

                              </td>


                              <td className="p-3">

                                <p className="font-bold text-slate-900">

                                  {subscription.userName ||
                                    "Unknown User"}

                                </p>


                                <p className="text-[11px] text-slate-400">

                                  {subscription.userEmail ||
                                    "-"}

                                </p>

                              </td>


                              <td className="p-3">

                                <span
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                                    getPlanColor(
                                      subscription.type
                                    ).badge
                                  }`}
                                >

                                  {planName}

                                </span>

                              </td>


                              <td className="p-3">

                                <span className="text-[10px] font-bold text-slate-500">

                                  {subscription.type ||
                                    "STUDENT"}

                                </span>

                              </td>


                              <td className="p-3 text-slate-600 font-semibold">

                                {subscription.cycle ||
                                  "Monthly"}

                              </td>


                              <td className="p-3 font-extrabold text-slate-900">

                                {formatMoney(
                                  Number(
                                    subscription.amount ||
                                    0
                                  ),
                                  subscription.currency
                                )}

                              </td>


                              <td className="p-3 text-slate-500">

                                {formatDate(
                                  subscription.nextBilling
                                )}

                              </td>


                              <td className="p-3">

                                <span
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${getStatusClass(
                                    status
                                  )}`}
                                >

                                  {status}

                                </span>

                              </td>


                              <td className="p-3 text-center">

                                <button
                                  type="button"
                                  disabled={
                                    isExpired ||
                                    actionLoadingId ===
                                      id
                                  }
                                  onClick={() =>
                                    handleCancelSub(
                                      subscription
                                    )
                                  }
                                  className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >

                                  {actionLoadingId ===
                                  id ? (

                                    <span className="flex items-center gap-1">

                                      <Loader2 className="w-3 h-3 animate-spin" />

                                      Updating

                                    </span>

                                  ) : (

                                    isExpired
                                      ? "Expired"
                                      : "Cancel / Expire"

                                  )}

                                </button>

                              </td>

                            </tr>

                          );

                        }
                      )

                    ) : (

                      <tr>

                        <td
                          colSpan={9}
                          className="p-10 text-center text-slate-400"
                        >

                          No subscriptions found.

                        </td>

                      </tr>

                    )}

                  </tbody>

                </table>

              </div>

            </div>

          </>

        )}

      </main>


      {/* ==============================================
          CREATE PLAN MODAL
      ============================================== */}

      {showCreatePlanModal && (

        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-100">

            {/* HEADER */}

            <div className="flex justify-between items-center border-b pb-3 mb-4">

              <div>

                <h3 className="font-bold text-slate-900 text-sm">

                  Create New Subscription Plan

                </h3>


                <p className="text-[10px] text-slate-400 mt-1">

                  Create a new student or business plan.

                </p>

              </div>


              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isCreatingPlan}
                className="text-slate-400 hover:text-slate-700"
              >

                <X className="w-4 h-4" />

              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={
                handleCreatePlan
              }
              className="space-y-3 text-xs"
            >

              {/* NAME */}

              <div>

                <label className="font-bold text-slate-700 block mb-1">

                  Plan Name

                </label>


                <input
                  type="text"
                  required
                  value={
                    newPlanData.name
                  }
                  onChange={(e) =>
                    setNewPlanData(
                      {
                        ...newPlanData,
                        name:
                          e.target.value,
                      }
                    )
                  }
                  placeholder="Student Pro"
                  className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none focus:border-blue-600"
                />

              </div>


              {/* TYPE */}

              <div>

                <label className="font-bold text-slate-700 block mb-1">

                  Plan Type

                </label>


                <div className="flex gap-2">

                  {[
                    "STUDENT",
                    "BUSINESS",
                  ].map(
                    (type) => (

                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          setNewPlanData(
                            {
                              ...newPlanData,
                              type,
                            }
                          )
                        }
                        className={`flex-1 py-2 rounded-xl border-2 font-bold ${
                          newPlanData.type ===
                          type
                            ? type ===
                              "STUDENT"
                              ? "bg-blue-600 border-blue-600 text-white"
                              : "bg-purple-600 border-purple-600 text-white"
                            : "bg-white border-slate-200 text-slate-600"
                        }`}
                      >

                        {type ===
                        "STUDENT"
                          ? "🎓 Student"
                          : "🏢 Business"}

                      </button>

                    )
                  )}

                </div>

              </div>


              {/* DESCRIPTION */}

              <div>

                <label className="font-bold text-slate-700 block mb-1">

                  Description

                </label>


                <textarea
                  required
                  rows={2}
                  value={
                    newPlanData.description
                  }
                  onChange={(e) =>
                    setNewPlanData(
                      {
                        ...newPlanData,
                        description:
                          e.target.value,
                      }
                    )
                  }
                  placeholder="Plan description..."
                  className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none focus:border-blue-600 resize-none"
                />

              </div>


              {/* PRICE */}

              <div className="grid grid-cols-2 gap-3">

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
                      value={
                        newPlanData.price
                      }
                      onChange={(e) =>
                        setNewPlanData(
                          {
                            ...newPlanData,
                            price:
                              e.target.value,
                          }
                        )
                      }
                      className="w-full p-2.5 pl-8 border rounded-xl bg-slate-50 outline-none focus:border-blue-600"
                    />

                  </div>

                </div>


                <div>

                  <label className="font-bold text-slate-700 block mb-1">

                    Currency

                  </label>


                  <select
                    value={
                      newPlanData.currency
                    }
                    onChange={(e) =>
                      setNewPlanData(
                        {
                          ...newPlanData,
                          currency:
                            e.target.value,
                        }
                      )
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
                    value={
                      newPlanData.durationDays
                    }
                    onChange={(e) =>
                      setNewPlanData(
                        {
                          ...newPlanData,
                          durationDays:
                            e.target.value,
                        }
                      )
                    }
                    className="w-full p-2.5 pl-8 border rounded-xl bg-slate-50 outline-none focus:border-blue-600"
                  />

                </div>


                <p className="text-[10px] text-slate-400 mt-1">

                  30 = Monthly | 365 = Yearly

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
                  value={
                    newPlanData.features
                  }
                  onChange={(e) =>
                    setNewPlanData(
                      {
                        ...newPlanData,
                        features:
                          e.target.value,
                      }
                    )
                  }
                  placeholder="Unlimited workshops, Certificates, Mentor guidance"
                  className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none focus:border-blue-600 resize-none"
                />


                <p className="text-[10px] text-slate-400 mt-1">

                  Separate features using commas.

                </p>

              </div>


              {/* BUTTONS */}

              <div className="pt-2 flex gap-3">

                <button
                  type="button"
                  onClick={
                    handleCloseModal
                  }
                  disabled={
                    isCreatingPlan
                  }
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >

                  Cancel

                </button>


                <button
                  type="submit"
                  disabled={
                    isCreatingPlan
                  }
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                >

                  {isCreatingPlan ? (

                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />

                      Creating...

                    </>

                  ) : (

                    <>
                      <Zap className="w-4 h-4" />

                      Create Plan

                    </>

                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );
}