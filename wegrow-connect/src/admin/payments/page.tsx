import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { getInvoices, createInvoice } from "../../services/api";

import {
  Receipt,
  Plus,
  Search,
  Download,
  IndianRupee,
  Clock,
  AlertCircle,
  X,
  FileText,
  RefreshCw,
} from "lucide-react";

// =====================================================
// TYPES
// =====================================================

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount?: number;
}

interface Invoice {
  id?: string;
  _id?: string;

  invoiceNumber?: string;

  userId?: string;

  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;

  items?: InvoiceItem[];

  subtotal?: number;
  tax?: number;
  total?: number;

  currency?: string;

  status?: string;

  issuedDate?: string;
  dueDate?: string;

  filePath?: string;
}

interface InvoiceForm {
  description: string;
  quantity: string;
  unitPrice: string;
  taxPercent: string;
  currency: string;
}

interface JwtPayload {
  email?: string;
  sub?: string;
  role?: string;
  iat?: number;
  exp?: number;
}

// =====================================================
// JWT HELPER
// =====================================================

function getCurrentUserIdFromToken(): string {
  try {
    const token = sessionStorage.getItem("accessToken");

    if (!token) {
      console.error("accessToken not found in sessionStorage");
      return "";
    }

    const parts = token.split(".");

    if (parts.length !== 3) {
      console.error("Invalid JWT token format");
      return "";
    }

    const base64Url = parts[1];

    const base64 = base64Url
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const paddedBase64 =
      base64 + "=".repeat((4 - (base64.length % 4)) % 4);

    const jsonPayload = decodeURIComponent(
      atob(paddedBase64)
        .split("")
        .map(
          (char) =>
            "%" +
            ("00" + char.charCodeAt(0).toString(16)).slice(-2)
        )
        .join("")
    );

    const payload: JwtPayload = JSON.parse(jsonPayload);

    console.log("JWT PAYLOAD:", payload);

    if (!payload.sub) {
      console.error("JWT sub/user ID not found");
      return "";
    }

    return payload.sub;
  } catch (error) {
    console.error("Failed to decode accessToken:", error);
    return "";
  }
}

// =====================================================
// COMPONENT
// =====================================================

export default function PaymentsInvoicesPage() {
  // =====================================================
  // STATE
  // =====================================================

  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedStatus, setSelectedStatus] = useState("All");

  const [showInvoiceModal, setShowInvoiceModal] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [creating, setCreating] = useState(false);

  const [error, setError] = useState("");

  const [currentUserId, setCurrentUserId] =
    useState<string>("");

  // =====================================================
  // CREATE INVOICE FORM
  // =====================================================

  const [newInvoice, setNewInvoice] =
    useState<InvoiceForm>({
      description: "",
      quantity: "1",
      unitPrice: "",
      taxPercent: "0",
      currency: "INR",
    });

  // =====================================================
  // GET CURRENT USER ID FROM SESSION STORAGE
  // =====================================================

  useEffect(() => {
    const userId = getCurrentUserIdFromToken();

    console.log(
      "CURRENT LOGIN USER ID FROM JWT SUB:",
      userId
    );

    setCurrentUserId(userId);

    if (!userId) {
      setError(
        "Unable to identify the logged-in user. Please login again."
      );
    }
  }, []);

  // =====================================================
  // LOAD INVOICES
  // =====================================================

  const loadInvoices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getInvoices();

      console.log(
        "GET INVOICES RESPONSE:",
        response
      );

      let invoiceData: Invoice[] = [];

      if (Array.isArray(response)) {
        invoiceData = response;
      } else if (
        response?.data &&
        Array.isArray(response.data)
      ) {
        invoiceData = response.data;
      }

      setInvoices(invoiceData);
    } catch (err: any) {
      console.error(
        "Failed to load invoices:",
        err
      );

      setError(
        err?.message ||
          "Failed to load invoices. Please try again."
      );

      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadInvoices();
  }, []);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date?: string) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
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
  // FORMAT CURRENCY
  // =====================================================

  const formatAmount = (
    amount?: number,
    currency = "INR"
  ) => {
    const numericAmount = Number(amount) || 0;

    if (currency === "INR") {
      return `₹${numericAmount.toLocaleString(
        "en-IN",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      )}`;
    }

    return `${currency} ${numericAmount.toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  // =====================================================
  // GET CUSTOMER NAME
  // =====================================================

  const getCustomerName = (invoice: Invoice) => {
    return (
      invoice.customerName ||
      invoice.userId ||
      "Unknown Customer"
    );
  };

  // =====================================================
  // GET CUSTOMER EMAIL
  // =====================================================

  const getCustomerEmail = (invoice: Invoice) => {
    return invoice.customerEmail || "-";
  };

  // =====================================================
  // GET ITEM DESCRIPTION
  // =====================================================

  const getItemDescription = (
    invoice: Invoice
  ) => {
    if (
      invoice.items &&
      invoice.items.length > 0
    ) {
      return invoice.items
        .map(
          (item) =>
            `${item.description} ${
              item.quantity > 1
                ? `(x${item.quantity})`
                : ""
            }`
        )
        .join(", ");
    }

    return "-";
  };

  // =====================================================
  // GET TOTAL
  // =====================================================

  const getInvoiceTotal = (
    invoice: Invoice
  ) => {
    if (
      typeof invoice.total === "number"
    ) {
      return invoice.total;
    }

    if (
      invoice.items &&
      invoice.items.length > 0
    ) {
      return invoice.items.reduce(
        (sum, item) =>
          sum +
          Number(
            item.amount ??
              item.quantity *
                item.unitPrice
          ),
        0
      );
    }

    return 0;
  };

  // =====================================================
  // FILTER INVOICES
  // =====================================================

  const filteredInvoices = useMemo(() => {
    const search =
      searchTerm.toLowerCase().trim();

    return invoices.filter((invoice) => {
      const invoiceNumber = String(
        invoice.invoiceNumber || ""
      ).toLowerCase();

      const id = String(
        invoice.id ||
          invoice._id ||
          ""
      ).toLowerCase();

      const customerName =
        getCustomerName(invoice).toLowerCase();

      const customerEmail =
        getCustomerEmail(invoice).toLowerCase();

      const item =
        getItemDescription(invoice).toLowerCase();

      const status = String(
        invoice.status || ""
      ).toLowerCase();

      const matchesSearch =
        !search ||
        invoiceNumber.includes(search) ||
        id.includes(search) ||
        customerName.includes(search) ||
        customerEmail.includes(search) ||
        item.includes(search);

      const matchesStatus =
        selectedStatus === "All" ||
        status ===
          selectedStatus.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    invoices,
    searchTerm,
    selectedStatus,
  ]);

  // =====================================================
  // TOTAL COLLECTED
  // =====================================================

  const totalCollected = useMemo(() => {
    return invoices
      .filter((invoice) => {
        const status =
          String(
            invoice.status || ""
          ).toLowerCase();

        return (
          status === "issued" ||
          status === "paid"
        );
      })
      .reduce(
        (sum, invoice) =>
          sum + getInvoiceTotal(invoice),
        0
      );
  }, [invoices]);

  // =====================================================
  // TODAY REVENUE
  // =====================================================

  const todayRevenue = useMemo(() => {
    const today =
      new Date().toDateString();

    return invoices
      .filter((invoice) => {
        if (!invoice.issuedDate) {
          return false;
        }

        const invoiceDate =
          new Date(
            invoice.issuedDate
          );

        return (
          !Number.isNaN(
            invoiceDate.getTime()
          ) &&
          invoiceDate.toDateString() === today
        );
      })
      .reduce(
        (sum, invoice) =>
          sum + getInvoiceTotal(invoice),
        0
      );
  }, [invoices]);

  // =====================================================
  // PENDING COUNT
  // =====================================================

  const pendingCount =
    invoices.filter(
      (invoice) =>
        String(
          invoice.status || ""
        ).toLowerCase() === "pending"
    ).length;

  // =====================================================
  // FAILED COUNT
  // =====================================================

  const failedCount =
    invoices.filter(
      (invoice) =>
        String(
          invoice.status || ""
        ).toLowerCase() === "failed"
    ).length;

  // =====================================================
  // HANDLE FORM CHANGE
  // =====================================================

  const handleFormChange = (
    field: keyof InvoiceForm,
    value: string
  ) => {
    setNewInvoice((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setNewInvoice({
      description: "",
      quantity: "1",
      unitPrice: "",
      taxPercent: "0",
      currency: "INR",
    });
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeModal = () => {
    if (creating) {
      return;
    }

    setShowInvoiceModal(false);
    resetForm();
  };

  // =====================================================
  // CREATE INVOICE
  // =====================================================

  const handleCreateInvoice = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    // ---------------------------------------------------
    // GET CURRENT USER ID AGAIN
    // ---------------------------------------------------

    const userId =
      getCurrentUserIdFromToken();

    console.log(
      "USER ID USED FOR INVOICE:",
      userId
    );

    if (!userId) {
      setError(
        "Logged-in user ID was not found. Please login again."
      );
      alert(
        "Unable to identify logged-in user. Please login again."
      );
      return;
    }

    // ---------------------------------------------------
    // FORM VALUES
    // ---------------------------------------------------

    const description =
      newInvoice.description.trim();

    const quantity =
      Number(newInvoice.quantity);

    const unitPrice =
      Number(newInvoice.unitPrice);

    const taxPercent =
      Number(newInvoice.taxPercent);

    // ---------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------

    if (!description) {
      alert(
        "Please enter item / service description."
      );
      return;
    }

    if (
      !Number.isFinite(quantity) ||
      quantity <= 0
    ) {
      alert(
        "Please enter a valid quantity."
      );
      return;
    }

    if (
      !Number.isFinite(unitPrice) ||
      unitPrice < 0
    ) {
      alert(
        "Please enter a valid unit price."
      );
      return;
    }

    if (
      !Number.isFinite(taxPercent) ||
      taxPercent < 0
    ) {
      alert(
        "Please enter a valid tax percentage."
      );
      return;
    }

    // ---------------------------------------------------
    // BACKEND DTO PAYLOAD
    // ---------------------------------------------------
    //
    // This exactly matches:
    //
    // GenerateInvoiceDto
    //
    // userId
    // items
    // taxPercent
    // currency
    //
    // ---------------------------------------------------

    const payload = {
      userId: userId,

      items: [
        {
          description: description,
          quantity: quantity,
          unitPrice: unitPrice,
        },
      ],

      taxPercent: taxPercent,

      currency:
        newInvoice.currency || "INR",
    };

    console.log(
      "GENERATE INVOICE PAYLOAD:",
      payload
    );

    // ---------------------------------------------------
    // API CALL
    // ---------------------------------------------------

    try {
      setCreating(true);
      setError("");

      const response =
        await createInvoice(payload);

      console.log(
        "GENERATE INVOICE RESPONSE:",
        response
      );

      if (
        response?.success === false
      ) {
        throw new Error(
          response?.message ||
            "Failed to generate invoice."
        );
      }

      // -------------------------------------------------
      // CLOSE MODAL
      // -------------------------------------------------

      setShowInvoiceModal(false);

      resetForm();

      // -------------------------------------------------
      // REFRESH DATA
      // -------------------------------------------------

      await loadInvoices();

      alert(
        "Invoice generated successfully."
      );
    } catch (err: any) {
      console.error(
        "Failed to generate invoice:",
        err
      );

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to generate invoice.";

      setError(message);

      alert(message);
    } finally {
      setCreating(false);
    }
  };

  // =====================================================
  // DOWNLOAD PDF
  // =====================================================

  const handleDownloadInvoice = (
    invoice: Invoice
  ) => {
    if (!invoice.filePath) {
      alert(
        "Invoice PDF URL is not available from the API."
      );
      return;
    }

    window.open(
      invoice.filePath,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (
    status?: string
  ) => {
    const normalized =
      String(status || "").toLowerCase();

    switch (normalized) {
      case "issued":
        return "bg-emerald-50 text-emerald-600 border border-emerald-200";

      case "pending":
        return "bg-amber-50 text-amber-600 border border-amber-200";

      case "paid":
        return "bg-blue-50 text-blue-600 border border-blue-200";

      case "failed":
        return "bg-rose-50 text-rose-600 border border-rose-200";

      case "cancelled":
        return "bg-slate-100 text-slate-600 border border-slate-200";

      default:
        return "bg-slate-100 text-slate-600 border border-slate-200";
    }
  };

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
              Payments & Invoices
            </h1>

            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Manage generated invoices and billing records.
            </p>
          </div>

          <div className="flex items-center gap-2">

            {/* REFRESH */}

            <button
              type="button"
              onClick={loadInvoices}
              disabled={loading}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  loading
                    ? "animate-spin"
                    : ""
                }`}
              />

              Refresh
            </button>

            {/* CREATE */}

            <button
              type="button"
              onClick={() =>
                setShowInvoiceModal(true)
              }
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />

              Generate Invoice
            </button>

          </div>
        </div>

        {/* =================================================
            CURRENT USER INFO
        ================================================= */}

        {currentUserId && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">

            <div className="flex items-center gap-2">

              <div className="w-7 h-7 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase text-blue-400">
                  Logged-in User
                </p>

                <p className="text-xs font-mono font-bold text-blue-700">
                  {currentUserId}
                </p>
              </div>

            </div>

          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 rounded-xl px-4 py-3 text-xs font-semibold flex items-center gap-2">

            <AlertCircle className="w-4 h-4" />

            <span>{error}</span>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
              className="ml-auto"
            >
              <X className="w-4 h-4" />
            </button>

          </div>
        )}

        {/* =================================================
            METRIC CARDS
        ================================================= */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* TOTAL */}

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">

            <div>

              <p className="text-[10px] font-bold uppercase text-slate-400">
                Total Collected
              </p>

              <h2 className="text-xl font-black text-slate-900 mt-0.5">
                {formatAmount(
                  totalCollected
                )}
              </h2>

            </div>

            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>

          </div>

          {/* TODAY */}

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">

            <div>

              <p className="text-[10px] font-bold uppercase text-slate-400">
                Today's Revenue
              </p>

              <h2 className="text-xl font-black text-slate-900 mt-0.5">
                {formatAmount(
                  todayRevenue
                )}
              </h2>

            </div>

            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>

          </div>

          {/* PENDING */}

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">

            <div>

              <p className="text-[10px] font-bold uppercase text-slate-400">
                Pending Invoices
              </p>

              <h2 className="text-xl font-black text-slate-900 mt-0.5">
                {pendingCount} Invoices
              </h2>

            </div>

            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>

          </div>

          {/* FAILED */}

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">

            <div>

              <p className="text-[10px] font-bold uppercase text-slate-400">
                Failed Invoices
              </p>

              <h2 className="text-xl font-black text-slate-900 mt-0.5">
                {failedCount} Invoices
              </h2>

            </div>

            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>

          </div>

        </div>

        {/* =================================================
            TABLE
        ================================================= */}

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">

          {/* FILTER */}

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">

              {[
                "All",
                "Issued",
                "Pending",
                "Failed",
                "Paid",
              ].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() =>
                    setSelectedStatus(
                      status
                    )
                  }
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    selectedStatus ===
                    status
                      ? "bg-white text-blue-600 shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {status}
                </button>
              ))}

            </div>

            {/* SEARCH */}

            <div className="relative w-full sm:w-80">

              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search invoice, customer, item..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:border-blue-600 transition-all"
              />

            </div>

          </div>

          {/* TABLE */}

          <div className="overflow-x-auto">

            <table className="w-full text-left text-xs">

              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-y border-slate-100">

                <tr>

                  <th className="p-3">
                    Invoice No.
                  </th>

                  <th className="p-3">
                    Customer
                  </th>

                  <th className="p-3">
                    Item / Service
                  </th>

                  <th className="p-3">
                    Issued Date
                  </th>

                  <th className="p-3">
                    Due Date
                  </th>

                  <th className="p-3">
                    Amount
                  </th>

                  <th className="p-3">
                    Status
                  </th>

                  <th className="p-3 text-center">
                    Invoice
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100 font-medium">

                {loading ? (

                  <tr>

                    <td
                      colSpan={8}
                      className="p-10 text-center text-slate-400"
                    >

                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" />

                      Loading invoices...

                    </td>

                  </tr>

                ) : filteredInvoices.length >
                  0 ? (

                  filteredInvoices.map(
                    (invoice) => {

                      const invoiceId =
                        invoice.id ||
                        invoice._id ||
                        invoice.invoiceNumber ||
                        Math.random()
                          .toString();

                      const status =
                        invoice.status ||
                        "Unknown";

                      const currency =
                        invoice.currency ||
                        "INR";

                      return (
                        <tr
                          key={invoiceId}
                          className="hover:bg-slate-50/60 transition-all"
                        >

                          {/* INVOICE NUMBER */}

                          <td className="p-3">

                            <div className="flex items-center gap-2">

                              <FileText className="w-4 h-4 text-blue-500" />

                              <div>

                                <p className="font-mono font-bold text-slate-900">
                                  {invoice.invoiceNumber ||
                                    invoiceId}
                                </p>

                                {invoice.invoiceNumber &&
                                  invoice.id && (
                                    <p className="text-[9px] text-slate-400 font-mono">
                                      ID:{" "}
                                      {invoice.id}
                                    </p>
                                  )}

                              </div>

                            </div>

                          </td>

                          {/* CUSTOMER */}

                          <td className="p-3">

                            <p className="font-bold text-slate-900">
                              {getCustomerName(
                                invoice
                              )}
                            </p>

                            <p className="text-[11px] text-slate-400">
                              {getCustomerEmail(
                                invoice
                              )}
                            </p>

                          </td>

                          {/* ITEM */}

                          <td className="p-3 font-semibold text-slate-700">
                            {getItemDescription(
                              invoice
                            )}
                          </td>

                          {/* ISSUED */}

                          <td className="p-3 text-slate-500">
                            {formatDate(
                              invoice.issuedDate
                            )}
                          </td>

                          {/* DUE */}

                          <td className="p-3 text-slate-500">
                            {formatDate(
                              invoice.dueDate
                            )}
                          </td>

                          {/* AMOUNT */}

                          <td className="p-3 font-black text-slate-900">
                            {formatAmount(
                              getInvoiceTotal(
                                invoice
                              ),
                              currency
                            )}
                          </td>

                          {/* STATUS */}

                          <td className="p-3">

                            <span
                              className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold ${getStatusClass(
                                status
                              )}`}
                            >
                              {status}
                            </span>

                          </td>

                          {/* DOWNLOAD */}

                          <td className="p-3 text-center">

                            <button
                              type="button"
                              onClick={() =>
                                handleDownloadInvoice(
                                  invoice
                                )
                              }
                              disabled={
                                !invoice.filePath
                              }
                              className="p-1.5 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-lg transition-all cursor-pointer inline-flex items-center gap-1 font-bold text-[11px] disabled:opacity-40 disabled:cursor-not-allowed"
                              title="Download Invoice PDF"
                            >

                              <Download className="w-3.5 h-3.5" />

                              PDF

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
                      className="p-10 text-center"
                    >

                      <Receipt className="w-8 h-8 mx-auto text-slate-300 mb-2" />

                      <p className="text-slate-400 font-semibold">
                        No invoices found.
                      </p>

                      <p className="text-[10px] text-slate-400 mt-1">
                        Generate your first invoice using the button above.
                      </p>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </main>

      {/* =================================================
          CREATE INVOICE MODAL
      ================================================= */}

      {showInvoiceModal && (

        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4 border border-slate-100">

            {/* HEADER */}

            <div className="flex justify-between items-center border-b pb-3">

              <div>

                <h3 className="font-bold text-slate-900 text-sm">
                  Generate Invoice
                </h3>

                <p className="text-[10px] text-slate-400 mt-1">
                  Customer details are automatically taken from your logged-in account.
                </p>

              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={creating}
                className="cursor-pointer text-slate-400 hover:text-slate-600 disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>

            </div>

            {/* CURRENT USER */}

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">

              <p className="text-[10px] uppercase font-bold text-slate-400">
                Invoice Customer
              </p>

              <p className="text-xs font-mono font-bold text-slate-700 mt-1">
                Current logged-in user
              </p>

            </div>

            {/* FORM */}

            <form
              onSubmit={
                handleCreateInvoice
              }
              className="space-y-3 text-xs"
            >

              {/* DESCRIPTION */}

              <div>

                <label className="font-bold text-slate-700 block mb-1">
                  Service / Workshop
                </label>

                <input
                  type="text"
                  required
                  placeholder="e.g. Full Stack Workshop"
                  value={
                    newInvoice.description
                  }
                  onChange={(e) =>
                    handleFormChange(
                      "description",
                      e.target.value
                    )
                  }
                  className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none focus:border-blue-600"
                />

              </div>

              {/* QUANTITY + PRICE */}

              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label className="font-bold text-slate-700 block mb-1">
                    Quantity
                  </label>

                  <input
                    type="number"
                    required
                    min="1"
                    step="1"
                    value={
                      newInvoice.quantity
                    }
                    onChange={(e) =>
                      handleFormChange(
                        "quantity",
                        e.target.value
                      )
                    }
                    className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none focus:border-blue-600"
                  />

                </div>

                <div>

                  <label className="font-bold text-slate-700 block mb-1">
                    Unit Price
                  </label>

                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    placeholder="2999.97"
                    value={
                      newInvoice.unitPrice
                    }
                    onChange={(e) =>
                      handleFormChange(
                        "unitPrice",
                        e.target.value
                      )
                    }
                    className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none focus:border-blue-600"
                  />

                </div>

              </div>

              {/* TAX + CURRENCY */}

              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label className="font-bold text-slate-700 block mb-1">
                    Tax (%)
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      newInvoice.taxPercent
                    }
                    onChange={(e) =>
                      handleFormChange(
                        "taxPercent",
                        e.target.value
                      )
                    }
                    className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none focus:border-blue-600"
                  />

                </div>

                <div>

                  <label className="font-bold text-slate-700 block mb-1">
                    Currency
                  </label>

                  <select
                    value={
                      newInvoice.currency
                    }
                    onChange={(e) =>
                      handleFormChange(
                        "currency",
                        e.target.value
                      )
                    }
                    className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none focus:border-blue-600 font-bold"
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

              {/* PREVIEW */}

              {newInvoice.unitPrice && (

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">

                  <div className="flex justify-between text-xs">

                    <span className="text-slate-500">
                      Subtotal
                    </span>

                    <span className="font-bold text-slate-900">

                      {formatAmount(
                        Number(
                          newInvoice.quantity
                        ) *
                          Number(
                            newInvoice.unitPrice
                          ),
                        newInvoice.currency
                      )}

                    </span>

                  </div>

                  <div className="flex justify-between text-xs mt-1">

                    <span className="text-slate-500">
                      Tax
                    </span>

                    <span className="font-bold text-slate-900">
                      {newInvoice.taxPercent ||
                        0}
                      %
                    </span>

                  </div>

                  <div className="border-t border-blue-100 mt-2 pt-2 flex justify-between">

                    <span className="font-bold text-slate-700">
                      Estimated Total
                    </span>

                    <span className="font-black text-blue-600">

                      {formatAmount(
                        Number(
                          newInvoice.quantity
                        ) *
                          Number(
                            newInvoice.unitPrice
                          ) *
                          (1 +
                            Number(
                              newInvoice.taxPercent ||
                                0
                            ) /
                              100),
                        newInvoice.currency
                      )}

                    </span>

                  </div>

                </div>

              )}

              {/* BUTTONS */}

              <div className="pt-2 flex gap-3">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={creating}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    creating ||
                    !currentUserId
                  }
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
                >

                  {creating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />

                      Generating...
                    </>
                  ) : (
                    <>
                      <Receipt className="w-3.5 h-3.5" />

                      Generate Invoice
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