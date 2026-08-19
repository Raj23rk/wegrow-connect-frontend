import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";

import {
  Users,
  Building2,
  GraduationCap,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Mail,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ============================================================
// API CONFIG
// ============================================================

const BASE_URL = "https://wegrow-connect-backend-1.onrender.com/";
const API_PREFIX = "api/v1/users/admin";

const API = {
  LIST: `${BASE_URL}${API_PREFIX}/all`,
  CREATE: `${BASE_URL}${API_PREFIX}/create`,
  UPDATE: (id: string) => `${BASE_URL}${API_PREFIX}/${id}`,
  DELETE: (id: string) => `${BASE_URL}${API_PREFIX}/${id}`,
};

// ============================================================
// TYPES
// ============================================================

type UserRole = "STUDENT" | "BUSINESS" | "ADMIN";

interface ApiUser {
  _id: string;

  firstName?: string;
  lastName?: string;

  email: string;
  phone?: string;

  role: UserRole;

  isActive?: boolean;
  isEmailVerified?: boolean;

  city?: string;
  state?: string;

  // Student
  college?: string;
  course?: string;
  department?: string;
  year?: string;
  skills?: string[];

  // Business
  companyName?: string;
  businessType?: string;
  designation?: string;
  experience?: number;
  website?: string;

  subscriptionStatus?: string;
  workshopsAttended?: number;

  createdAt?: string;
  updatedAt?: string;
}

interface TableUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "Active" | "Inactive";
  organization: string;
  joinedDate: string;
  phone: string;
  isEmailVerified: boolean;
  raw: ApiUser;
}

interface Counts {
  total: number;
  students: number;
  businesses: number;
  admins: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ============================================================
// HELPERS
// ============================================================

const getToken = (): string | null => {
 return sessionStorage.getItem(
      "accessToken"
    );
};

const getAuthHeaders = (): HeadersInit => {
  const token = getToken();

  return {
    "Content-Type": "application/json",

    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
};

// ============================================================
// FORMAT DATE
// ============================================================

const formatDate = (date?: string): string => {
  if (!date) {
    return "N/A";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

// ============================================================
// FULL NAME
// ============================================================

const getFullName = (user: ApiUser): string => {
  return `${user.firstName || ""} ${user.lastName || ""}`.trim() || "N/A";
};

// ============================================================
// ORGANIZATION
// ============================================================

const getOrganization = (user: ApiUser): string => {
  if (user.role === "STUDENT") {
    return user.college || "N/A";
  }

  if (user.role === "BUSINESS") {
    return user.companyName || "N/A";
  }

  if (user.role === "ADMIN") {
    return "WeGrow HQ";
  }

  return "N/A";
};

// ============================================================
// MAP API USER
// ============================================================

const mapUser = (user: ApiUser): TableUser => {
  return {
    id: user._id,

    name: getFullName(user),

    email: user.email,

    role: user.role,

    status: user.isActive === false ? "Inactive" : "Active",

    organization: getOrganization(user),

    joinedDate: formatDate(user.createdAt),

    phone: user.phone || "N/A",

    isEmailVerified: Boolean(user.isEmailVerified),

    raw: user,
  };
};

// ============================================================
// ROLE API
// ============================================================

const roleToApiRole = (role: string): string => {
  if (role === "Student") {
    return "STUDENT";
  }

  if (role === "Business") {
    return "BUSINESS";
  }

  if (role === "Admin") {
    return "ADMIN";
  }

  return "ALL";
};

// ============================================================
// ROLE DISPLAY
// ============================================================

const roleToDisplayRole = (role: UserRole): string => {
  if (role === "STUDENT") {
    return "Student";
  }

  if (role === "BUSINESS") {
    return "Business";
  }

  return "Admin";
};

// ============================================================
// COMPONENT
// ============================================================

export default function UsersPage() {
  // ============================================================
  // STATE
  // ============================================================

  const [users, setUsers] = useState<TableUser[]>([]);

  const [counts, setCounts] = useState<Counts>({
    total: 0,
    students: 0,
    businesses: 0,
    admins: 0,
  });

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedRole, setSelectedRole] = useState("All");

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  // ============================================================
  // MODALS
  // ============================================================

  const [showAddModal, setShowAddModal] = useState(false);

  const [editingUser, setEditingUser] = useState<TableUser | null>(null);

  // ============================================================
  // CREATE FORM
  // ============================================================

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    role: "STUDENT" as UserRole,
    organization: "",
    status: "Active",
  });

  // ============================================================
  // EDIT FORM
  // ============================================================

  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "STUDENT" as UserRole,
    organization: "",
    status: "Active",
    password: "",
  });

  // ============================================================
  // LOAD USERS
  // ============================================================

  const fetchUsers = useCallback(
    async (page = pagination.page) => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        params.append("page", String(page));

        params.append("limit", String(pagination.limit));

        if (searchTerm.trim()) {
          params.append("search", searchTerm.trim());
        }

        const apiRole = roleToApiRole(selectedRole);

        if (apiRole !== "ALL") {
          params.append("role", apiRole);
        }

        const response = await fetch(
          `${API.LIST}?${params.toString()}`,
          {
            method: "GET",
            headers: getAuthHeaders(),
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message ||
              result?.data?.message ||
              "Failed to fetch users"
          );
        }

        const apiData = result?.data || result;

        // =====================================================
        // USERS
        // =====================================================

        const apiUsers: ApiUser[] = apiData?.users || [];

        setUsers(apiUsers.map(mapUser));

        // =====================================================
        // COUNTS
        // =====================================================

        if (apiData?.counts) {
          setCounts({
            total: Number(apiData.counts.total || 0),
            students: Number(apiData.counts.students || 0),
            businesses: Number(apiData.counts.businesses || 0),
            admins: Number(apiData.counts.admins || 0),
          });
        } else {
          setCounts({
            total: 0,
            students: 0,
            businesses: 0,
            admins: 0,
          });
        }

        // =====================================================
        // PAGINATION
        // =====================================================

        if (apiData?.pagination) {
          setPagination((previous) => ({
            ...previous,

            page: Number(
              apiData.pagination.page || page
            ),

            limit: Number(
              apiData.pagination.limit || previous.limit
            ),

            total: Number(
              apiData.pagination.total || 0
            ),

            totalPages: Number(
              apiData.pagination.totalPages || 0
            ),
          }));
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to fetch users";

        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [
      pagination.limit,
      pagination.page,
      searchTerm,
      selectedRole,
    ]
  );

  // ============================================================
  // INITIAL LOAD + SEARCH + FILTER
  // ============================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(1);
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm, selectedRole]);

  // ============================================================
  // AUTO CLOSE SUCCESS MESSAGE AFTER 10 MINUTES
  // ============================================================

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 10 * 60 * 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [successMessage]);

  // ============================================================
  // AUTO CLOSE ERROR MESSAGE AFTER 10 MINUTES
  // ============================================================

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      setError("");
    }, 10 * 60 * 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [error]);

  // ============================================================
  // REFRESH
  // ============================================================

  const handleRefresh = () => {
    fetchUsers(pagination.page);
  };

  // ============================================================
  // ADD USER
  // ============================================================

  const handleAddUser = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const payload: Record<string, unknown> = {
        firstName: formData.firstName.trim(),

        lastName: formData.lastName.trim(),

        email: formData.email.trim().toLowerCase(),

        password: formData.password,

        phone: formData.phone.trim() || undefined,

        role: formData.role,

        isActive: formData.status === "Active",
      };

      // =====================================================
      // ORGANIZATION
      // =====================================================

      if (formData.organization.trim()) {
        if (formData.role === "STUDENT") {
          payload.college = formData.organization.trim();
        }

        if (formData.role === "BUSINESS") {
          payload.companyName =
            formData.organization.trim();
        }
      }

      // =====================================================
      // CREATE API
      // =====================================================

      const response = await fetch(API.CREATE, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            result?.data?.message ||
            "Failed to create user"
        );
      }

      // =====================================================
      // SUCCESS
      // =====================================================

      setSuccessMessage(
        result?.message ||
          result?.data?.message ||
          "User created successfully"
      );

      setShowAddModal(false);

      // =====================================================
      // RESET FORM
      // =====================================================

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        role: "STUDENT",
        organization: "",
        status: "Active",
      });

      // =====================================================
      // RELOAD
      // =====================================================

      await fetchUsers(1);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to create user";

      setError(message);
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // OPEN EDIT MODAL
  // ============================================================

  const openEditModal = (user: TableUser) => {
    setEditingUser(user);

    setEditFormData({
      firstName: user.raw.firstName || "",

      lastName: user.raw.lastName || "",

      email: user.raw.email || "",

      phone: user.raw.phone || "",

      role: user.raw.role || "STUDENT",

      organization:
        user.raw.role === "STUDENT"
          ? user.raw.college || ""
          : user.raw.role === "BUSINESS"
          ? user.raw.companyName || ""
          : "",

      status:
        user.raw.isActive === false
          ? "Inactive"
          : "Active",

      password: "",
    });
  };

  // ============================================================
  // UPDATE USER
  // ============================================================

  const handleUpdateUser = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!editingUser) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const payload: Record<string, unknown> = {
        firstName: editFormData.firstName.trim(),

        lastName: editFormData.lastName.trim(),

        email: editFormData.email.trim().toLowerCase(),

        phone: editFormData.phone.trim() || undefined,

        role: editFormData.role,

        isActive:
          editFormData.status === "Active",
      };

      // =====================================================
      // STUDENT
      // =====================================================

      if (editFormData.role === "STUDENT") {
        payload.college =
          editFormData.organization.trim() ||
          undefined;

        payload.companyName = undefined;
      }

      // =====================================================
      // BUSINESS
      // =====================================================

      if (editFormData.role === "BUSINESS") {
        payload.companyName =
          editFormData.organization.trim() ||
          undefined;

        payload.college = undefined;
      }

      // =====================================================
      // PASSWORD
      // =====================================================

      if (editFormData.password.trim()) {
        payload.password =
          editFormData.password;
      }

      // =====================================================
      // UPDATE API
      // =====================================================

      const response = await fetch(
        API.UPDATE(editingUser.id),
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            result?.data?.message ||
            "Failed to update user"
        );
      }

      // =====================================================
      // SUCCESS
      // =====================================================

      setSuccessMessage(
        result?.message ||
          result?.data?.message ||
          "User updated successfully"
      );

      setEditingUser(null);

      // =====================================================
      // RELOAD
      // =====================================================

      await fetchUsers(pagination.page);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to update user";

      setError(message);
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // DELETE USER
  // ============================================================

  const handleDeleteUser = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const response = await fetch(
        API.DELETE(id),
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            result?.data?.message ||
            "Failed to delete user"
        );
      }

      setSuccessMessage(
        result?.message ||
          result?.data?.message ||
          "User deleted successfully"
      );

      // =====================================================
      // IF LAST USER ON PAGE
      // MOVE TO PREVIOUS PAGE
      // =====================================================

      const nextPage =
        users.length === 1 &&
        pagination.page > 1
          ? pagination.page - 1
          : pagination.page;

      await fetchUsers(nextPage);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to delete user";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // PAGINATION
  // ============================================================

  const handlePreviousPage = () => {
    if (pagination.page > 1 && !loading) {
      fetchUsers(pagination.page - 1);
    }
  };

  const handleNextPage = () => {
    if (
      pagination.page < pagination.totalPages &&
      !loading
    ) {
      fetchUsers(pagination.page + 1);
    }
  };

  // ============================================================
  // CREATE ROLE CHANGE
  // ============================================================

  const handleCreateRoleChange = (
    role: UserRole
  ) => {
    setFormData((previous) => ({
      ...previous,
      role,
      organization: "",
    }));
  };

  // ============================================================
  // EDIT ROLE CHANGE
  // ============================================================

  const handleEditRoleChange = (
    role: UserRole
  ) => {
    setEditFormData((previous) => ({
      ...previous,
      role,
      organization: "",
    }));
  };

  // ============================================================
  // JSX
  // ============================================================

  return (
    <div className="flex min-h-screen bg-slate-50/60 font-sans text-slate-800 antialiased">
      <Sidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              User Management
            </h1>

            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Manage all registered Students,
              Businesses, and Platform Admins.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* REFRESH */}

            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  loading ? "animate-spin" : ""
                }`}
              />

              Refresh
            </button>

            {/* ADD USER */}

            <button
              type="button"
              onClick={() =>
                setShowAddModal(true)
              }
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />

              <span>Add New User</span>
            </button>
          </div>
        </div>

        {/* =====================================================
            ALERTS
        ===================================================== */}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-xs font-semibold flex items-center justify-between">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-xs font-semibold flex items-center justify-between">
            <span>{successMessage}</span>

            <button
              type="button"
              onClick={() =>
                setSuccessMessage("")
              }
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* =====================================================
            METRIC CARDS
        ===================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* TOTAL */}

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">
                Total Registered
              </p>

              <h2 className="text-xl font-black text-slate-900 mt-0.5">
                {counts.total} Users
              </h2>
            </div>

            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          {/* STUDENTS */}

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">
                Registered Students
              </p>

              <h2 className="text-xl font-black text-slate-900 mt-0.5">
                {counts.students} Students
              </h2>
            </div>

            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>

          {/* BUSINESSES */}

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">
                Onboarded Businesses
              </p>

              <h2 className="text-xl font-black text-slate-900 mt-0.5">
                {counts.businesses} Businesses
              </h2>
            </div>

            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* =====================================================
            FILTER + SEARCH
        ===================================================== */}

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            {/* ROLES */}

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-full lg:w-auto">
              {[
                "All",
                "Student",
                "Business",
                "Admin",
              ].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() =>
                    setSelectedRole(role)
                  }
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    selectedRole === role
                      ? "bg-white text-blue-600 shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>

            {/* SEARCH */}

            <div className="relative w-full lg:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search name, email, college..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:border-blue-600 transition-all"
              />
            </div>
          </div>

          {/* ===================================================
              TABLE
          =================================================== */}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-y border-slate-100">
                <tr>
                  <th className="p-3">
                    User ID
                  </th>

                  <th className="p-3">
                    User Details
                  </th>

                  <th className="p-3">
                    Role
                  </th>

                  <th className="p-3">
                    Organization / Institution
                  </th>

                  <th className="p-3">
                    Joined Date
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
                {/* LOADING */}

                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-12 text-center text-slate-400"
                    >
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" />

                      Loading users...
                    </td>
                  </tr>
                ) : users.length > 0 ? (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/60 transition-all"
                    >
                      {/* ID */}

                      <td className="p-3 font-mono font-bold text-slate-900">
                        {user.id.slice(-8)}
                      </td>

                      {/* DETAILS */}

                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center text-xs uppercase">
                            {user.name.charAt(0)}
                          </div>

                          <div>
                            <p className="font-bold text-slate-900">
                              {user.name}
                            </p>

                            <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3" />

                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* ROLE */}

                      <td className="p-3">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                            user.role ===
                            "STUDENT"
                              ? "bg-blue-50 text-blue-600"
                              : user.role ===
                                "BUSINESS"
                              ? "bg-orange-50 text-orange-600"
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {roleToDisplayRole(
                            user.role
                          )}
                        </span>
                      </td>

                      {/* ORGANIZATION */}

                      <td className="p-3 text-slate-600 font-semibold">
                        {user.organization}
                      </td>

                      {/* DATE */}

                      <td className="p-3 text-slate-500">
                        {user.joinedDate}
                      </td>

                      {/* STATUS */}

                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                            user.status ===
                            "Active"
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                              : "bg-red-50 text-red-600 border border-red-200"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>

                      {/* ACTIONS */}

                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* EDIT */}

                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(user)
                            }
                            className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-blue-600 rounded-lg cursor-pointer transition-all"
                            title="Edit User"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteUser(
                                user.id
                              )
                            }
                            className="p-1.5 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-lg cursor-pointer transition-all"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-12 text-center text-slate-400"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ===================================================
              PAGINATION
          =================================================== */}

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Page{" "}
              <span className="font-bold text-slate-900">
                {pagination.page}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-900">
                {pagination.totalPages || 1}
              </span>{" "}
              • {pagination.total} users
            </p>

            <div className="flex items-center gap-2">
              {/* PREVIOUS */}

              <button
                type="button"
                onClick={handlePreviousPage}
                disabled={
                  pagination.page <= 1 ||
                  loading
                }
                className="flex items-center gap-1 px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />

                Previous
              </button>

              {/* NEXT */}

              <button
                type="button"
                onClick={handleNextPage}
                disabled={
                  pagination.page >=
                    pagination.totalPages ||
                  loading
                }
                className="flex items-center gap-1 px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next

                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================
          ADD USER MODAL
      ======================================================== */}

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            {/* HEADER */}

            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-sm">
                Add New User
              </h3>

              <button
                type="button"
                onClick={() =>
                  setShowAddModal(false)
                }
                className="cursor-pointer text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleAddUser}
              className="space-y-3 text-xs"
            >
              {/* FIRST + LAST */}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    First Name
                  </label>

                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        firstName:
                          e.target.value,
                      })
                    }
                    className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Last Name
                  </label>

                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        lastName:
                          e.target.value,
                      })
                    }
                    className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* EMAIL */}

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Email Address
                </label>

                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none focus:border-blue-500"
                />
              </div>

              {/* PASSWORD */}

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Password
                </label>

                <input
                  type="password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password:
                        e.target.value,
                    })
                  }
                  placeholder="Minimum 8 characters"
                  className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none focus:border-blue-500"
                />
              </div>

              {/* PHONE */}

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Phone
                </label>

                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone: e.target.value,
                    })
                  }
                  className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none focus:border-blue-500"
                />
              </div>

              {/* ROLE + STATUS */}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    User Role
                  </label>

                  <select
                    value={formData.role}
                    onChange={(e) =>
                      handleCreateRoleChange(
                        e.target.value as UserRole
                      )
                    }
                    className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none font-bold"
                  >
                    <option value="STUDENT">
                      Student
                    </option>

                    <option value="BUSINESS">
                      Business
                    </option>

                    <option value="ADMIN">
                      Admin
                    </option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Status
                  </label>

                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status:
                          e.target.value,
                      })
                    }
                    className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none font-bold"
                  >
                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>
                  </select>
                </div>
              </div>

              {/* ORGANIZATION */}

              {formData.role !== "ADMIN" && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {formData.role === "STUDENT"
                      ? "College"
                      : "Company Name"}
                  </label>

                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        organization:
                          e.target.value,
                      })
                    }
                    placeholder={
                      formData.role === "STUDENT"
                        ? "e.g. Anna University"
                        : "e.g. AgriTech Innovations"
                    }
                    className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {/* BUTTONS */}

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setShowAddModal(false)
                  }
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : "Save User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          EDIT USER MODAL
      ======================================================== */}

      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            {/* HEADER */}

            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-sm">
                Edit User
              </h3>

              <button
                type="button"
                onClick={() =>
                  setEditingUser(null)
                }
                className="cursor-pointer text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleUpdateUser}
              className="space-y-3 text-xs"
            >
              {/* FIRST + LAST */}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    First Name
                  </label>

                  <input
                    type="text"
                    required
                    value={
                      editFormData.firstName
                    }
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        firstName:
                          e.target.value,
                      })
                    }
                    className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Last Name
                  </label>

                  <input
                    type="text"
                    required
                    value={
                      editFormData.lastName
                    }
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        lastName:
                          e.target.value,
                      })
                    }
                    className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* EMAIL */}

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Email
                </label>

                <input
                  type="email"
                  required
                  value={editFormData.email}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      email: e.target.value,
                    })
                  }
                  className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none focus:border-blue-500"
                />
              </div>

              {/* PHONE */}

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Phone
                </label>

                <input
                  type="text"
                  value={editFormData.phone}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      phone: e.target.value,
                    })
                  }
                  className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none focus:border-blue-500"
                />
              </div>

              {/* ROLE + STATUS */}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Role
                  </label>

                  <select
                    value={editFormData.role}
                    onChange={(e) =>
                      handleEditRoleChange(
                        e.target.value as UserRole
                      )
                    }
                    className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none font-bold"
                  >
                    <option value="STUDENT">
                      Student
                    </option>

                    <option value="BUSINESS">
                      Business
                    </option>

                    <option value="ADMIN">
                      Admin
                    </option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Status
                  </label>

                  <select
                    value={
                      editFormData.status
                    }
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        status:
                          e.target.value,
                      })
                    }
                    className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none font-bold"
                  >
                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>
                  </select>
                </div>
              </div>

              {/* ORGANIZATION */}

              {editFormData.role !== "ADMIN" && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {editFormData.role === "STUDENT"
                      ? "College"
                      : "Company Name"}
                  </label>

                  <input
                    type="text"
                    value={
                      editFormData.organization
                    }
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        organization:
                          e.target.value,
                      })
                    }
                    className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {/* PASSWORD */}

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  New Password{" "}
                  <span className="text-slate-400 font-normal">
                    (optional)
                  </span>
                </label>

                <input
                  type="password"
                  minLength={8}
                  value={
                    editFormData.password
                  }
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      password:
                        e.target.value,
                    })
                  }
                  placeholder="Leave empty to keep current password"
                  className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none focus:border-blue-500"
                />
              </div>

              {/* BUTTONS */}

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setEditingUser(null)
                  }
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer disabled:opacity-50"
                >
                  {saving
                    ? "Updating..."
                    : "Update User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}