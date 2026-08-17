import React, { useState } from "react";
import BusinessSidebar from "../../components/BusinessSidebar";
import {
  Settings,
  Building2,
  User,
  ShieldCheck,
  Bell,
  Save,
  Lock,
  Upload,
  Globe,
  Mail,
  Phone,
  FileText,
  CheckCircle2
} from "lucide-react";

export default function BusinessSettings() {
  const [activeTab, setActiveTab] = useState<"profile" | "company" | "security" | "notifications">("profile");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    founderName: "Silambarasan G",
    email: "silambarasan@wegrow.com",
    phone: "+91 98765 43210",
    companyName: "WeGrow AgriTech Innovations",
    registrationNo: "DPIIT-ST-2026-8890",
    gstin: "33AAAAA0000A1Z5",
    website: "https://wegrow-connect.com",
    address: "Sundarapandiam, Tamil Nadu, India",
    bio: "Building smart agritech tools and digital ecosystem for farmers and business partners.",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="flex min-h-screen bg-slate-50/60 font-sans text-slate-800 antialiased">
      {/* Business Sidebar */}
      <BusinessSidebar />

      {/* Main Settings Area */}
      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <Settings className="w-7 h-7 text-blue-600" />
              Business Account Settings
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Manage your startup profile, business legal details, security, and portal preferences.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer self-start md:self-auto"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>

        {/* Save Notification Alert */}
        {savedSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 text-emerald-800 text-xs font-bold shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Settings updated successfully! Your changes have been saved.</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3 text-xs overflow-x-auto">
          {[
            { id: "profile", label: "Founder Profile", icon: User },
            { id: "company", label: "Company Details", icon: Building2 },
            { id: "security", label: "Security & Password", icon: Lock },
            { id: "notifications", label: "Notifications", icon: Bell },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-extrabold transition-all cursor-pointer shrink-0 ${
                  activeTab === tab.id
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-500 border border-slate-200 hover:text-slate-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Settings Form Container */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          {/* TAB 1: Founder Profile */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-extrabold text-slate-900">Founder & Personal Info</h2>
                <p className="text-xs text-slate-400">Update your primary contact details and profile bio.</p>
              </div>

              {/* Avatar Upload */}
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-md">
                  SG
                </div>
                <div className="space-y-1.5">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer text-slate-700">
                    <Upload className="w-3.5 h-3.5 text-blue-600" /> Change Profile Photo
                  </button>
                  <p className="text-[10px] text-slate-400">JPG, PNG or GIF. Max size 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold">Founder Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={formData.founderName}
                      onChange={(e) => setFormData({ ...formData, founderName: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:bg-white focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:bg-white focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:bg-white focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-slate-700 font-bold">Founder Bio</label>
                  <textarea
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:bg-white focus:border-blue-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Company Details */}
          {activeTab === "company" && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-extrabold text-slate-900">Startup & Tax Legal Information</h2>
                <p className="text-xs text-slate-400">Configure business registration number, GSTIN, and address.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold">Company Name</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:bg-white focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold">DPIIT / Startup Registration No.</label>
                  <div className="relative">
                    <FileText className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={formData.registrationNo}
                      onChange={(e) => setFormData({ ...formData, registrationNo: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:bg-white focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold">GSTIN (For Tax Credit Invoices)</label>
                  <input
                    type="text"
                    value={formData.gstin}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:bg-white focus:border-blue-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold">Website URL</label>
                  <div className="relative">
                    <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:bg-white focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-slate-700 font-bold">Registered Office Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:bg-white focus:border-blue-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Security */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-extrabold text-slate-900">Security & Authentication</h2>
                <p className="text-xs text-slate-400">Update account password and manage two-factor security.</p>
              </div>

              <div className="max-w-md space-y-4 text-xs font-medium">
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:bg-white focus:border-blue-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:bg-white focus:border-blue-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:bg-white focus:border-blue-600"
                  />
                </div>

                <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer">
                  Update Password
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: Notifications */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-extrabold text-slate-900">Email & Portal Alert Preferences</h2>
                <p className="text-xs text-slate-400">Choose which updates and legal reminders you receive.</p>
              </div>

              <div className="space-y-3 text-xs font-semibold text-slate-700">
                {[
                  "Investor Pitch Deck Download Notifications",
                  "Upcoming Masterclass & Workshop Reminders",
                  "Statutory Compliance & GST Filling Deadline Alerts",
                  "Monthly Analytics & Startup Growth Summary",
                ].map((item, idx) => (
                  <label key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600 rounded" />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}