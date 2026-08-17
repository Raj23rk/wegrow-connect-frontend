import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import {
  Settings,
  User,
  Shield,
  CreditCard,
  Mail,
  Key,
  Globe,
  Bell,
  Save,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  Server,
  SlidersHorizontal
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // Form States
  const [generalConfig, setGeneralConfig] = useState({
    siteName: "WeGrow Skill Campus",
    supportEmail: "support@wegrow.com",
    contactPhone: "+91 98765 43210",
    timezone: "IST (UTC +5:30)",
    maintenanceMode: false,
  });

  const [paymentConfig, setPaymentConfig] = useState({
    razorpayKeyId: "rzp_live_98321489210",
    razorpaySecret: "sec_live_abcdef1234567890",
    gstPercentage: "18",
    currency: "INR (₹)",
  });

  const [smtpConfig, setSmtpConfig] = useState({
    host: "smtp.sendgrid.net",
    port: "587",
    senderEmail: "notifications@wegrow.com",
    senderName: "WeGrow Team",
  });

  // Handle Save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
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
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin & Platform Settings</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Manage platform credentials, payment gateways, SMTP mailers, and system preferences.
            </p>
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Settings Saved Successfully!</span>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
          {[
            { id: "general", label: "General & Platform", icon: Globe },
            { id: "payment", label: "Payment Gateway", icon: CreditCard },
            { id: "smtp", label: "Email (SMTP)", icon: Mail },
            { id: "security", label: "Security & Roles", icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content 1: General Settings */}
        {activeTab === "general" && (
          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6 max-w-3xl">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" /> Platform Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Platform Name</label>
                <input
                  type="text"
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:border-blue-600"
                  value={generalConfig.siteName}
                  onChange={(e) => setGeneralConfig({ ...generalConfig, siteName: e.target.value })}
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Support Email</label>
                <input
                  type="email"
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:border-blue-600"
                  value={generalConfig.supportEmail}
                  onChange={(e) => setGeneralConfig({ ...generalConfig, supportEmail: e.target.value })}
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Contact Phone Number</label>
                <input
                  type="text"
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:border-blue-600"
                  value={generalConfig.contactPhone}
                  onChange={(e) => setGeneralConfig({ ...generalConfig, contactPhone: e.target.value })}
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Default Timezone</label>
                <input
                  type="text"
                  disabled
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-100 text-slate-500 cursor-not-allowed font-medium"
                  value={generalConfig.timezone}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 text-xs">Platform Maintenance Mode</p>
                <p className="text-[11px] text-slate-400">Temporarily disable student access for upgrades.</p>
              </div>

              <button
                type="button"
                onClick={() => setGeneralConfig({ ...generalConfig, maintenanceMode: !generalConfig.maintenanceMode })}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-all cursor-pointer ${
                  generalConfig.maintenanceMode ? "bg-rose-600 justify-end" : "bg-slate-300 justify-start"
                }`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
              </button>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save General Settings
              </button>
            </div>
          </form>
        )}

        {/* Tab Content 2: Payment Gateway */}
        {activeTab === "payment" && (
          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6 max-w-3xl">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-purple-600" /> Razorpay Integration
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Razorpay Key ID</label>
                <input
                  type="text"
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50/50 outline-none font-mono focus:border-blue-600"
                  value={paymentConfig.razorpayKeyId}
                  onChange={(e) => setPaymentConfig({ ...paymentConfig, razorpayKeyId: e.target.value })}
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Razorpay Secret Key</label>
                <div className="relative">
                  <input
                    type={showApiKey ? "text" : "password"}
                    className="w-full p-2.5 pr-10 border border-slate-200 rounded-xl bg-slate-50/50 outline-none font-mono focus:border-blue-600"
                    value={paymentConfig.razorpaySecret}
                    onChange={(e) => setPaymentConfig({ ...paymentConfig, razorpaySecret: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">GST Percentage (%)</label>
                  <input
                    type="number"
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50/50 outline-none"
                    value={paymentConfig.gstPercentage}
                    onChange={(e) => setPaymentConfig({ ...paymentConfig, gstPercentage: e.target.value })}
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Billing Currency</label>
                  <input
                    type="text"
                    disabled
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-100 text-slate-500 cursor-not-allowed font-bold"
                    value={paymentConfig.currency}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save Gateway Credentials
              </button>
            </div>
          </form>
        )}

        {/* Tab Content 3: Email SMTP */}
        {activeTab === "smtp" && (
          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6 max-w-3xl">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-600" /> SMTP Mailer Configuration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">SMTP Host</label>
                <input
                  type="text"
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:border-blue-600"
                  value={smtpConfig.host}
                  onChange={(e) => setSmtpConfig({ ...smtpConfig, host: e.target.value })}
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">SMTP Port</label>
                <input
                  type="text"
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:border-blue-600"
                  value={smtpConfig.port}
                  onChange={(e) => setSmtpConfig({ ...smtpConfig, port: e.target.value })}
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Sender Email</label>
                <input
                  type="email"
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:border-blue-600"
                  value={smtpConfig.senderEmail}
                  onChange={(e) => setSmtpConfig({ ...smtpConfig, senderEmail: e.target.value })}
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Sender Name</label>
                <input
                  type="text"
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:border-blue-600"
                  value={smtpConfig.senderName}
                  onChange={(e) => setSmtpConfig({ ...smtpConfig, senderName: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save SMTP Settings
              </button>

              <button
                type="button"
                onClick={() => alert("Test Email Sent to support@wegrow.com!")}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Send Test Email
              </button>
            </div>
          </form>
        )}

        {/* Tab Content 4: Security & Roles */}
        {activeTab === "security" && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6 max-w-3xl">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Shield className="w-4 h-4 text-rose-600" /> Admin Passwords & 2FA
            </h3>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">Two-Factor Authentication (2FA)</p>
                  <p className="text-[11px] text-slate-400">Enforce OTP verification for all admin logins.</p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-lg font-bold text-[10px]">
                  Enabled
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50/50 outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => alert("Admin password updated successfully!")}
                className="bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" /> Update Password
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}