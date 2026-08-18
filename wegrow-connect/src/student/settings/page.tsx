import React, { useEffect, useState } from "react";
import StudentSidebar from "../../components/StudentSidebar";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Lock,
  Bell,
  Save,
  CheckCircle2,
  Upload,
  Shield,
  Sliders,
  Eye,
  EyeOff,
  MapPin,
  Loader2,
  AlertCircle,
  RefreshCw,
  CalendarDays,
  Code2,
  BriefcaseBusiness,
  FileText,
  BookOpen,
} from "lucide-react";

// =====================================================
// API CONFIG
// =====================================================

const API_BASE_URL = "https://wegrow-connect-backend-1.onrender.com/api/v1";

// =====================================================
// TYPES
// =====================================================

interface ProfileData {
  _id?: string;

  firstName: string;
  lastName: string;

  email: string;
  phone: string;

  role?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;

  city: string;
  state: string;

  college: string;
  course: string;
  department: string;
  year: string;

  skills?: string[];

  subscriptionStatus?: string;
  workshopsAttended?: number;

  idCardUrl?: string;

  createdAt?: string;
  updatedAt?: string;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;

  city: string;
  state: string;

  college: string;
  course: string;
  department: string;
  year: string;

  bio: string;
  dateOfBirth: string;

  githubUrl: string;
  linkedinUrl: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface NotificationsData {
  workshopReminders: boolean;
  courseUpdates: boolean;
  rewardBadgesAlerts: boolean;
  emailBroadcasts: boolean;
}

type TabType =
  | "profile"
  | "academic"
  | "security"
  | "notifications";

// =====================================================
// COMPONENT
// =====================================================

export default function StudentSettings() {
  const [activeTab, setActiveTab] =
    useState<TabType>("profile");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [savedSuccess, setSavedSuccess] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  // =====================================================
  // PROFILE FORM
  // =====================================================

  const [formData, setFormData] =
    useState<FormData>({
      fullName: "",
      email: "",
      phone: "",

      city: "",
      state: "",

      college: "",
      course: "",
      department: "",
      year: "",

      bio: "",
      dateOfBirth: "",

      githubUrl: "",
      linkedinUrl: "",
    });

  // =====================================================
  // PASSWORD
  // =====================================================

  const [passwords, setPasswords] =
    useState<PasswordData>({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  const [notifications, setNotifications] =
    useState<NotificationsData>({
      workshopReminders: true,
      courseUpdates: true,
      rewardBadgesAlerts: true,
      emailBroadcasts: false,
    });

  // =====================================================
  // GET TOKEN
  // =====================================================

  const getToken = () => {
   
     return sessionStorage.getItem(
      "accessToken"
    );
  };

  // =====================================================
  // GET PROFILE
  // =====================================================

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const token = getToken();

      if (!token) {
        setErrorMessage(
          "Authentication token not found. Please login again."
        );
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/users/profile`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to load profile"
        );
      }

      const profile: ProfileData = result.data;

      const fullName =
        `${profile.firstName || ""} ${
          profile.lastName || ""
        }`.trim();

      setFormData((prev) => ({
        ...prev,

        fullName,

        email: profile.email || "",

        phone: profile.phone || "",

        city: profile.city || "",

        state: profile.state || "",

        college: profile.college || "",

        course: profile.course || "",

        department: profile.department || "",

        year: profile.year || "",

        // These fields are preserved locally
        // because current API does not return them.
        bio: prev.bio,
        dateOfBirth: prev.dateOfBirth,
        githubUrl: prev.githubUrl,
        linkedinUrl: prev.linkedinUrl,
      }));
    } catch (error: any) {
      console.error(
        "Profile fetch error:",
        error
      );

      setErrorMessage(
        error?.message ||
          "Unable to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD PROFILE
  // =====================================================

  useEffect(() => {
    fetchProfile();
  }, []);

  // =====================================================
  // UPDATE PROFILE
  // =====================================================

  const handleSave = async (
    e?: React.FormEvent
  ) => {
    e?.preventDefault();

    try {
      setSaving(true);
      setSavedSuccess(false);
      setErrorMessage("");

      const token = getToken();

      if (!token) {
        setErrorMessage(
          "Authentication token not found. Please login again."
        );
        return;
      }

      // =================================================
      // VALIDATION
      // =================================================

      if (!formData.fullName.trim()) {
        setErrorMessage(
          "Please enter your full name."
        );
        return;
      }

      if (!formData.phone.trim()) {
        setErrorMessage(
          "Please enter your phone number."
        );
        return;
      }

      // =================================================
      // SPLIT FULL NAME
      // =================================================

      const nameParts = formData.fullName
        .trim()
        .split(/\s+/);

      const firstName =
        nameParts.shift() || "";

      const lastName =
        nameParts.join(" ");

      // =================================================
      // BACKEND REQUEST
      // =================================================

      const requestBody = {
        firstName,
        lastName,

        phone: formData.phone,

        city: formData.city,

        state: formData.state,

        college: formData.college,

        course: formData.course,

        department: formData.department,

        year: formData.year,
      };

      console.log(
        "Updating profile:",
        requestBody
      );

      const response = await fetch(
        `${API_BASE_URL}/users/profile`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(requestBody),
        }
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to update profile"
        );
      }

      // =================================================
      // UPDATE UI WITH API RESPONSE
      // =================================================

      if (result.data) {
        const updatedProfile: ProfileData =
          result.data;

        setFormData((prev) => ({
          ...prev,

          fullName:
            `${updatedProfile.firstName || ""} ${
              updatedProfile.lastName || ""
            }`.trim(),

          email:
            updatedProfile.email ||
            prev.email,

          phone:
            updatedProfile.phone || "",

          city:
            updatedProfile.city || "",

          state:
            updatedProfile.state || "",

          college:
            updatedProfile.college || "",

          course:
            updatedProfile.course || "",

          department:
            updatedProfile.department || "",

          year:
            updatedProfile.year || "",

          bio: prev.bio,

          dateOfBirth:
            prev.dateOfBirth,

          githubUrl:
            prev.githubUrl,

          linkedinUrl:
            prev.linkedinUrl,
        }));
      }

      // =================================================
      // SUCCESS
      // =================================================

      setSavedSuccess(true);

      setTimeout(() => {
        setSavedSuccess(false);
      }, 4000);
    } catch (error: any) {
      console.error(
        "Profile update error:",
        error
      );

      setErrorMessage(
        error?.message ||
          "Unable to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // INPUT HANDLER
  // =====================================================

  const handleInputChange = (
    field: keyof FormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrorMessage("");
    setSavedSuccess(false);
  };

  // =====================================================
  // PASSWORD UPDATE
  // =====================================================

  const handlePasswordUpdate = () => {
    if (!passwords.currentPassword) {
      alert(
        "Please enter your current password."
      );
      return;
    }

    if (!passwords.newPassword) {
      alert(
        "Please enter your new password."
      );
      return;
    }

    if (
      passwords.newPassword !==
      passwords.confirmPassword
    ) {
      alert(
        "New password and confirm password do not match."
      );
      return;
    }

    alert(
      "Password API is not connected yet. Please provide the password API endpoint."
    );
  };

  // =====================================================
  // TABS
  // =====================================================

  const tabs: {
    id: TabType;
    label: string;
    icon: React.ElementType;
  }[] = [
    {
      id: "profile",
      label: "Personal Profile",
      icon: User,
    },
    {
      id: "academic",
      label: "Academic Info",
      icon: GraduationCap,
    },
    {
      id: "security",
      label: "Security",
      icon: Lock,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
    },
  ];

  // =====================================================
  // PROFILE INITIALS
  // =====================================================

  const profileInitials = formData.fullName
    ? formData.fullName
        .split(" ")
        .filter(Boolean)
        .map((name) => name[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "ST";

  // =====================================================
  // LOADING SCREEN
  // =====================================================

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-slate-50/60">
        <StudentSidebar />

        <main className="flex-1 min-w-0 h-screen overflow-y-auto">
          <div className="min-h-full flex items-center justify-center p-8">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />

              <p className="text-sm font-bold text-slate-600">
                Loading your profile...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div
      className="
        flex
        h-screen
        w-full
        overflow-hidden
        bg-slate-50/60
        font-sans
        text-slate-800
        antialiased
      "
    >
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <StudentSidebar />

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main
        className="
          flex-1
          min-w-0
          h-screen
          overflow-y-auto
          overflow-x-hidden
        "
      >
        <div
          className="
            min-h-full
            p-5
            md:p-8
            pb-24
            space-y-8
          "
        >
          {/* =====================================================
              HEADER
          ===================================================== */}

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <Sliders className="w-7 h-7 text-blue-600" />

                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Edit Student Profile
                </h1>
              </div>

              <p className="text-xs text-slate-500 font-medium mt-1">
                Manage your personal information,
                academic details, security and
                notification preferences.
              </p>
            </div>

            {/* SAVE BUTTON */}

            {(activeTab === "profile" ||
              activeTab === "academic") && (
              <button
                onClick={() => handleSave()}
                disabled={saving}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  bg-blue-600
                  hover:bg-blue-700
                  disabled:bg-blue-400
                  active:scale-95
                  transition-all
                  text-white
                  px-5
                  py-2.5
                  rounded-xl
                  text-xs
                  font-bold
                  shadow-md
                  shadow-blue-500/20
                  cursor-pointer
                  disabled:cursor-not-allowed
                  self-start
                  md:self-auto
                "
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            )}
          </div>

          {/* =====================================================
              SUCCESS
          ===================================================== */}

          {savedSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 text-xs font-bold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />

              <span>
                Your profile has been updated
                successfully.
              </span>
            </div>
          )}

          {/* =====================================================
              ERROR
          ===================================================== */}

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center justify-between gap-3 text-red-800 text-xs font-bold">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />

                <span>{errorMessage}</span>
              </div>

              <button
                onClick={fetchProfile}
                className="
                  flex
                  items-center
                  gap-1.5
                  px-3
                  py-1.5
                  bg-white
                  border
                  border-red-200
                  rounded-lg
                  hover:bg-red-50
                "
              >
                <RefreshCw className="w-3.5 h-3.5" />

                Retry
              </button>
            </div>
          )}

          {/* =====================================================
              TABS
          ===================================================== */}

          <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3 text-xs overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(tab.id)
                  }
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-extrabold transition-all cursor-pointer shrink-0 ${
                    activeTab === tab.id
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-white text-slate-500 border border-slate-200 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />

                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* =====================================================
              CONTENT
          ===================================================== */}

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            {/* =====================================================
                PROFILE TAB
            ===================================================== */}

            {activeTab === "profile" && (
              <div className="space-y-7">
                {/* HEADER */}

                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-base font-extrabold text-slate-900">
                    Personal Information
                  </h2>

                  <p className="text-xs text-slate-400 mt-1">
                    Keep your personal information
                    up to date.
                  </p>
                </div>

                {/* PROFILE HEADER */}

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                    {/* AVATAR */}

                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shrink-0">
                      {profileInitials}
                    </div>

                    {/* PROFILE INFO */}

                    <div className="flex-1">
                      <h3 className="text-lg font-black text-slate-900">
                        {formData.fullName ||
                          "Student Name"}
                      </h3>

                      <p className="text-xs text-slate-500 mt-1">
                        {formData.email ||
                          "student@example.com"}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="px-2.5 py-1 bg-white border border-blue-100 rounded-lg text-[10px] font-bold text-blue-700">
                          Student Account
                        </span>

                        {formData.course && (
                          <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600">
                            {formData.course}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* UPLOAD */}

                    <div>
                      <button
                        type="button"
                        className="
                          flex
                          items-center
                          gap-2
                          px-4
                          py-2.5
                          bg-white
                          border
                          border-slate-200
                          rounded-xl
                          text-xs
                          font-bold
                          text-slate-700
                          hover:bg-slate-50
                          transition-all
                          cursor-pointer
                        "
                      >
                        <Upload className="w-4 h-4 text-blue-600" />

                        Change Photo
                      </button>

                      <p className="text-[10px] text-slate-400 mt-1.5 text-center">
                        JPG, PNG or WEBP · Max 2MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* PERSONAL DETAILS */}

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-4 h-4 text-blue-600" />

                    <h3 className="text-sm font-extrabold text-slate-900">
                      Basic Details
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-medium">
                    {/* FULL NAME */}

                    <div className="space-y-1.5">
                      <label className="text-slate-700 font-bold">
                        Full Name
                      </label>

                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                        <input
                          type="text"
                          value={
                            formData.fullName
                          }
                          onChange={(e) =>
                            handleInputChange(
                              "fullName",
                              e.target.value
                            )
                          }
                          className="
                            w-full
                            pl-9
                            pr-3
                            py-2.5
                            border
                            border-slate-200
                            rounded-xl
                            bg-slate-50/50
                            outline-none
                            focus:bg-white
                            focus:border-blue-600
                          "
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    {/* EMAIL */}

                    <div className="space-y-1.5">
                      <label className="text-slate-700 font-bold">
                        Email Address
                      </label>

                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                        <input
                          type="email"
                          value={
                            formData.email
                          }
                          disabled
                          className="
                            w-full
                            pl-9
                            pr-3
                            py-2.5
                            border
                            border-slate-200
                            rounded-xl
                            bg-slate-100
                            text-slate-500
                            outline-none
                            cursor-not-allowed
                          "
                        />
                      </div>

                      <p className="text-[10px] text-slate-400">
                        Email address cannot be
                        changed here.
                      </p>
                    </div>

                    {/* PHONE */}

                    <div className="space-y-1.5">
                      <label className="text-slate-700 font-bold">
                        Phone Number
                      </label>

                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                        <input
                          type="text"
                          value={
                            formData.phone
                          }
                          onChange={(e) =>
                            handleInputChange(
                              "phone",
                              e.target.value
                            )
                          }
                          className="
                            w-full
                            pl-9
                            pr-3
                            py-2.5
                            border
                            border-slate-200
                            rounded-xl
                            bg-slate-50/50
                            outline-none
                            focus:bg-white
                            focus:border-blue-600
                          "
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>

                    {/* DATE OF BIRTH */}

                    <div className="space-y-1.5">
                      <label className="text-slate-700 font-bold">
                        Date of Birth
                      </label>

                      <div className="relative">
                        <CalendarDays className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                        <input
                          type="date"
                          value={
                            formData.dateOfBirth
                          }
                          onChange={(e) =>
                            handleInputChange(
                              "dateOfBirth",
                              e.target.value
                            )
                          }
                          className="
                            w-full
                            pl-9
                            pr-3
                            py-2.5
                            border
                            border-slate-200
                            rounded-xl
                            bg-slate-50/50
                            outline-none
                            focus:bg-white
                            focus:border-blue-600
                          "
                        />
                      </div>
                    </div>

                    {/* CITY */}

                    <div className="space-y-1.5">
                      <label className="text-slate-700 font-bold">
                        City
                      </label>

                      <div className="relative">
                        <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                        <input
                          type="text"
                          value={
                            formData.city
                          }
                          onChange={(e) =>
                            handleInputChange(
                              "city",
                              e.target.value
                            )
                          }
                          className="
                            w-full
                            pl-9
                            pr-3
                            py-2.5
                            border
                            border-slate-200
                            rounded-xl
                            bg-slate-50/50
                            outline-none
                            focus:bg-white
                            focus:border-blue-600
                          "
                          placeholder="Enter city"
                        />
                      </div>
                    </div>

                    {/* STATE */}

                    <div className="space-y-1.5">
                      <label className="text-slate-700 font-bold">
                        State
                      </label>

                      <input
                        type="text"
                        value={
                          formData.state
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "state",
                            e.target.value
                          )
                        }
                        className="
                          w-full
                          px-3
                          py-2.5
                          border
                          border-slate-200
                          rounded-xl
                          bg-slate-50/50
                          outline-none
                          focus:bg-white
                          focus:border-blue-600
                        "
                        placeholder="Enter state"
                      />
                    </div>
                  </div>
                </div>

                {/* BIO */}

                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-4 h-4 text-blue-600" />

                    <h3 className="text-sm font-extrabold text-slate-900">
                      About You
                    </h3>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-700 font-bold text-xs">
                      Bio / Career Objective
                    </label>

                    <textarea
                      rows={5}
                      maxLength={500}
                      value={formData.bio}
                      onChange={(e) =>
                        handleInputChange(
                          "bio",
                          e.target.value
                        )
                      }
                      className="
                        w-full
                        p-3
                        border
                        border-slate-200
                        rounded-xl
                        bg-slate-50/50
                        outline-none
                        focus:bg-white
                        focus:border-blue-600
                        resize-y
                        text-xs
                      "
                      placeholder="Tell us about yourself, your career goals, interests and what you are currently learning..."
                    />

                    <div className="flex justify-between">
                      <p className="text-[10px] text-slate-400">
                        Write a short professional
                        introduction.
                      </p>

                      <span className="text-[10px] text-slate-400">
                        {formData.bio.length}/500
                      </span>
                    </div>
                  </div>
                </div>

                {/* SOCIAL PROFILES */}

                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-4">
                    <Code2 className="w-4 h-4 text-slate-700" />
                    <h3 className="text-sm font-extrabold text-slate-900">
                      Professional Profiles
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                    {/* GITHUB */}

                    <div className="space-y-1.5">
                      <label className="text-slate-700 font-bold">
                        GitHub Profile
                      </label>

                      <div className="relative">
                        <Code2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="url"
                          value={
                            formData.githubUrl
                          }
                          onChange={(e) =>
                            handleInputChange(
                              "githubUrl",
                              e.target.value
                            )
                          }
                          className="
                            w-full
                            pl-9
                            pr-3
                            py-2.5
                            border
                            border-slate-200
                            rounded-xl
                            bg-slate-50/50
                            outline-none
                            focus:bg-white
                            focus:border-blue-600
                          "
                          placeholder="https://github.com/username"
                        />
                      </div>
                    </div>

                    {/* LINKEDIN */}

                    <div className="space-y-1.5">
                      <label className="text-slate-700 font-bold">
                        LinkedIn Profile
                      </label>

                      <div className="relative">
<BriefcaseBusiness className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-600" />
                        <input
                          type="url"
                          value={
                            formData.linkedinUrl
                          }
                          onChange={(e) =>
                            handleInputChange(
                              "linkedinUrl",
                              e.target.value
                            )
                          }
                          className="
                            w-full
                            pl-9
                            pr-3
                            py-2.5
                            border
                            border-slate-200
                            rounded-xl
                            bg-slate-50/50
                            outline-none
                            focus:bg-white
                            focus:border-blue-600
                          "
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* INFO */}

                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />

                    <div>
                      <p className="text-xs font-bold text-blue-900">
                        Profile information
                      </p>

                      <p className="text-[11px] text-blue-700 mt-1">
                        Name, phone, city and state
                        are connected to your student
                        profile API.
                      </p>
                    </div>
                  </div>
                </div>

                {/* LOCAL ONLY NOTICE */}

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-[10px] text-amber-700 font-semibold">
                    Bio, date of birth, GitHub and
                    LinkedIn are currently UI fields.
                    Your current backend PUT API does
                    not include these fields, so they
                    will not be persisted until the
                    backend is updated.
                  </p>
                </div>
              </div>
            )}

            {/* =====================================================
                ACADEMIC TAB
            ===================================================== */}

            {activeTab === "academic" && (
              <div className="space-y-7">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-base font-extrabold text-slate-900">
                    Academic Information
                  </h2>

                  <p className="text-xs text-slate-400 mt-1">
                    Update your college and current
                    education details.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-medium">
                  {/* COLLEGE */}

                  <div className="space-y-1.5">
                    <label className="text-slate-700 font-bold">
                      College / University
                    </label>

                    <div className="relative">
                      <GraduationCap className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                      <input
                        type="text"
                        value={
                          formData.college
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "college",
                            e.target.value
                          )
                        }
                        className="
                          w-full
                          pl-9
                          pr-3
                          py-2.5
                          border
                          border-slate-200
                          rounded-xl
                          bg-slate-50/50
                          outline-none
                          focus:bg-white
                          focus:border-blue-600
                        "
                        placeholder="College / University name"
                      />
                    </div>
                  </div>

                  {/* COURSE */}

                  <div className="space-y-1.5">
                    <label className="text-slate-700 font-bold">
                      Course / Degree
                    </label>

                    <div className="relative">
                      <BookOpen className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                      <input
                        type="text"
                        value={
                          formData.course
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "course",
                            e.target.value
                          )
                        }
                        className="
                          w-full
                          pl-9
                          pr-3
                          py-2.5
                          border
                          border-slate-200
                          rounded-xl
                          bg-slate-50/50
                          outline-none
                          focus:bg-white
                          focus:border-blue-600
                        "
                        placeholder="e.g. B.E CSE"
                      />
                    </div>
                  </div>

                  {/* DEPARTMENT */}

                  <div className="space-y-1.5">
                    <label className="text-slate-700 font-bold">
                      Department
                    </label>

                    <input
                      type="text"
                      value={
                        formData.department
                      }
                      onChange={(e) =>
                        handleInputChange(
                          "department",
                          e.target.value
                        )
                      }
                      className="
                        w-full
                        px-3
                        py-2.5
                        border
                        border-slate-200
                        rounded-xl
                        bg-slate-50/50
                        outline-none
                        focus:bg-white
                        focus:border-blue-600
                      "
                      placeholder="e.g. Computer Science"
                    />
                  </div>

                  {/* YEAR */}

                  <div className="space-y-1.5">
                    <label className="text-slate-700 font-bold">
                      Academic Year
                    </label>

                    <input
                      type="text"
                      value={
                        formData.year
                      }
                      onChange={(e) =>
                        handleInputChange(
                          "year",
                          e.target.value
                        )
                      }
                      className="
                        w-full
                        px-3
                        py-2.5
                        border
                        border-slate-200
                        rounded-xl
                        bg-slate-50/50
                        outline-none
                        focus:bg-white
                        focus:border-blue-600
                      "
                      placeholder="e.g. 3rd Year"
                    />
                  </div>
                </div>

                {/* ACADEMIC SUMMARY */}

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <GraduationCap className="w-5 h-5 text-blue-600" />
                    </div>

                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">
                        Your Academic Profile
                      </h3>

                      <p className="text-[11px] text-slate-500 mt-1">
                        {formData.course ||
                          "Course not specified"}
                        {" · "}
                        {formData.department ||
                          "Department not specified"}
                        {" · "}
                        {formData.year ||
                          "Year not specified"}
                      </p>

                      <p className="text-[11px] text-slate-500 mt-1">
                        {formData.college ||
                          "College not specified"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* API INFO */}

                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />

                    <div>
                      <p className="text-xs font-bold text-blue-900">
                        API Connected
                      </p>

                      <p className="text-[11px] text-blue-700 mt-1">
                        College, Course, Department,
                        Academic Year, Phone, City and
                        State are saved through your
                        student profile API.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* =====================================================
                SECURITY
            ===================================================== */}

            {activeTab === "security" && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-base font-extrabold text-slate-900">
                    Security & Password
                  </h2>

                  <p className="text-xs text-slate-400 mt-1">
                    Keep your account secure by
                    updating your password regularly.
                  </p>
                </div>

                <div className="max-w-md space-y-5 text-xs font-medium">
                  {/* CURRENT */}

                  <div className="space-y-1.5">
                    <label className="text-slate-700 font-bold">
                      Current Password
                    </label>

                    <div className="relative">
                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        placeholder="••••••••"
                        value={
                          passwords.currentPassword
                        }
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            currentPassword:
                              e.target.value,
                          })
                        }
                        className="
                          w-full
                          px-3
                          py-2.5
                          border
                          border-slate-200
                          rounded-xl
                          bg-slate-50/50
                          outline-none
                          focus:bg-white
                          focus:border-blue-600
                          pr-10
                        "
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            !showPassword
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* NEW */}

                  <div className="space-y-1.5">
                    <label className="text-slate-700 font-bold">
                      New Password
                    </label>

                    <input
                      type="password"
                      placeholder="••••••••"
                      value={
                        passwords.newPassword
                      }
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          newPassword:
                            e.target.value,
                        })
                      }
                      className="
                        w-full
                        px-3
                        py-2.5
                        border
                        border-slate-200
                        rounded-xl
                        bg-slate-50/50
                        outline-none
                        focus:bg-white
                        focus:border-blue-600
                      "
                    />
                  </div>

                  {/* CONFIRM */}

                  <div className="space-y-1.5">
                    <label className="text-slate-700 font-bold">
                      Confirm New Password
                    </label>

                    <input
                      type="password"
                      placeholder="••••••••"
                      value={
                        passwords.confirmPassword
                      }
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          confirmPassword:
                            e.target.value,
                        })
                      }
                      className="
                        w-full
                        px-3
                        py-2.5
                        border
                        border-slate-200
                        rounded-xl
                        bg-slate-50/50
                        outline-none
                        focus:bg-white
                        focus:border-blue-600
                      "
                    />
                  </div>

                  <button
                    type="button"
                    onClick={
                      handlePasswordUpdate
                    }
                    className="
                      bg-slate-900
                      hover:bg-slate-800
                      text-white
                      px-5
                      py-2.5
                      rounded-xl
                      text-xs
                      font-bold
                      transition-all
                      cursor-pointer
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <Shield className="w-4 h-4 text-blue-400" />

                    Update Password
                  </button>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-[10px] text-amber-700 font-semibold">
                      Password update API has not been
                      connected yet.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* =====================================================
                NOTIFICATIONS
            ===================================================== */}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-base font-extrabold text-slate-900">
                    Notification Preferences
                  </h2>

                  <p className="text-xs text-slate-400 mt-1">
                    Choose which notifications you
                    want to receive from WeGrow.
                  </p>
                </div>

                <div className="space-y-3 text-xs font-semibold text-slate-700">
                  {[
                    {
                      key: "workshopReminders",
                      label:
                        "Live Workshop & Zoom Meeting Link Email Reminders",
                    },
                    {
                      key: "courseUpdates",
                      label:
                        "Course Module Completion & Exam Certificate Alerts",
                    },
                    {
                      key: "rewardBadgesAlerts",
                      label:
                        "XP Points & Skill Badge Unlock Notifications",
                    },
                    {
                      key: "emailBroadcasts",
                      label:
                        "WeGrow Hackathon & Partner Community Updates",
                    },
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="
                        flex
                        items-center
                        gap-3
                        p-4
                        rounded-xl
                        border
                        border-slate-100
                        hover:bg-slate-50
                        cursor-pointer
                        transition-all
                      "
                    >
                      <input
                        type="checkbox"
                        checked={
                          notifications[
                            item.key as keyof NotificationsData
                          ]
                        }
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            [item.key]:
                              e.target.checked,
                          })
                        }
                        className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                      />

                      <span>
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-[10px] text-slate-500 font-semibold">
                    Notification preferences are
                    currently stored only in the page
                    state because the notification
                    preference API has not been
                    connected.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* =====================================================
              BOTTOM SPACE
          ===================================================== */}

          <div className="h-10" />
        </div>
      </main>
    </div>
  );
}