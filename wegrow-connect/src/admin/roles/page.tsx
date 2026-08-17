import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  Lock,
  Plus,
  Check,
  X,
  Edit2,
  Save,
  CheckSquare,
  Square
} from "lucide-react";

export default function RolesPermissionsPage() {
  // Pre-configured WeGrow Platform Roles
  const [roles, setRoles] = useState([
    {
      id: "role-1",
      name: "Super Admin",
      description: "Full system control with unrestricted access to all modules.",
      usersCount: 2,
      badgeColor: "bg-red-50 text-red-600 border-red-200",
      permissions: {
        dashboardView: true,
        usersManage: true,
        workshopsManage: true,
        startupsApprove: true,
        paymentsView: true,
        reportsAccess: true,
        settingsManage: true,
      },
    },
    {
      id: "role-2",
      name: "Mentor / Instructor",
      description: "Can manage workshops, host live sessions, and guide startups.",
      usersCount: 14,
      badgeColor: "bg-purple-50 text-purple-600 border-purple-200",
      permissions: {
        dashboardView: true,
        usersManage: false,
        workshopsManage: true,
        startupsApprove: false,
        paymentsView: false,
        reportsAccess: true,
        settingsManage: false,
      },
    },
    {
      id: "role-3",
      name: "Business / Startup",
      description: "Can submit startup applications, access mentorship, and post jobs.",
      usersCount: 86,
      badgeColor: "bg-orange-50 text-orange-600 border-orange-200",
      permissions: {
        dashboardView: true,
        usersManage: false,
        workshopsManage: false,
        startupsApprove: false,
        paymentsView: true,
        reportsAccess: false,
        settingsManage: false,
      },
    },
    {
      id: "role-4",
      name: "Student",
      description: "Can enroll in workshops, attend bootcamps, and earn certificates.",
      usersCount: 1146,
      badgeColor: "bg-blue-50 text-blue-600 border-blue-200",
      permissions: {
        dashboardView: true,
        usersManage: false,
        workshopsManage: false,
        startupsApprove: false,
        paymentsView: false,
        reportsAccess: false,
        settingsManage: false,
      },
    },
  ]);

  const [selectedRole, setSelectedRole] = useState(roles[0]);
  const [isSaved, setIsSaved] = useState(false);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);

  // New Role Form State
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
  });

  // Toggle Single Permission
  const togglePermission = (key: string) => {
    const updatedPermissions = {
      ...selectedRole.permissions,
      [key]: !selectedRole.permissions[key as keyof typeof selectedRole.permissions],
    };

    const updatedRole = { ...selectedRole, permissions: updatedPermissions };
    setSelectedRole(updatedRole);
    setRoles(roles.map((r) => (r.id === selectedRole.id ? updatedRole : r)));
  };

  // Save Changes Handler
  const handleSavePermissions = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  // Create Custom Role
  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: `role-${roles.length + 1}`,
      name: newRole.name,
      description: newRole.description,
      usersCount: 0,
      badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-200",
      permissions: {
        dashboardView: true,
        usersManage: false,
        workshopsManage: false,
        startupsApprove: false,
        paymentsView: false,
        reportsAccess: false,
        settingsManage: false,
      },
    };
    setRoles([...roles, created]);
    setSelectedRole(created);
    setShowAddRoleModal(false);
    setNewRole({ name: "", description: "" });
  };

  const permissionModules = [
    { id: "dashboardView", title: "View Dashboard & Analytics", desc: "Access to overall platform metrics and summary" },
    { id: "usersManage", title: "Manage Users & Accounts", desc: "Ability to create, edit, block, or delete platform users" },
    { id: "workshopsManage", title: "Create & Update Workshops", desc: "Publish new workshops, bootcamps, and manage schedules" },
    { id: "startupsApprove", title: "Approve Startup Submissions", desc: "Review startup pitches and assign mentors" },
    { id: "paymentsView", title: "Financials & Payment Invoices", desc: "View transaction histories and subscription details" },
    { id: "reportsAccess", title: "Download Reports & Analytics", desc: "Export platform growth data in CSV/PDF format" },
    { id: "settingsManage", title: "System & Global Settings", desc: "Modify portal configuration, API keys, and security rules" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50/60 font-sans text-slate-800 antialiased">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Top Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Roles & Permissions</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Configure access control levels and module permissions for WeGrow users.
            </p>
          </div>

          <button
            onClick={() => setShowAddRoleModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Role</span>
          </button>
        </div>

        {/* Roles Grid & Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Role Selector List */}
          <div className="space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 px-1">Select Role to Edit</h2>
            
            {roles.map((r) => {
              const isSelected = selectedRole.id === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedRole(r)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? "bg-white border-blue-600 shadow-md ring-2 ring-blue-500/10"
                      : "bg-white/80 border-slate-200/80 hover:bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold border ${r.badgeColor}`}>
                      {r.name}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">{r.usersCount} Users</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium line-clamp-2">{r.description}</p>
                </div>
              );
            })}
          </div>

          {/* Right Column: Permission Matrix for Selected Role */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-black text-slate-900">{selectedRole.name} Permissions</h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">{selectedRole.description}</p>
              </div>

              <button
                onClick={handleSavePermissions}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
                <span>{isSaved ? "Saved!" : "Save Changes"}</span>
              </button>
            </div>

            {/* Module Toggles List */}
            <div className="space-y-3">
              {permissionModules.map((m) => {
                const isEnabled = selectedRole.permissions[m.id as keyof typeof selectedRole.permissions];
                return (
                  <div
                    key={m.id}
                    onClick={() => togglePermission(m.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isEnabled
                        ? "bg-blue-50/30 border-blue-200/80"
                        : "bg-slate-50/50 border-slate-100 opacity-70"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <h3 className="font-extrabold text-slate-900 text-xs">{m.title}</h3>
                      <p className="text-[11px] text-slate-400">{m.desc}</p>
                    </div>

                    <div className="flex items-center">
                      {isEnabled ? (
                        <div className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-lg text-[10px] font-extrabold shadow-xs">
                          <Check className="w-3 h-3" /> Enabled
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 bg-slate-200 text-slate-600 px-3 py-1 rounded-lg text-[10px] font-extrabold">
                          <X className="w-3 h-3" /> Disabled
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Add Custom Role Modal */}
      {showAddRoleModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4 border border-slate-100">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Create New Role</h3>
              <button onClick={() => setShowAddRoleModal(false)} className="cursor-pointer text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Role Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Program Coordinator"
                  className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none focus:border-blue-600"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Role Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe what this role is responsible for..."
                  className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none focus:border-blue-600"
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddRoleModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}