import React, { useState } from "react";
import BusinessSidebar from "../../components/BusinessSidebar";
import {
  Palette,
  Plus,
  Trash2,
  Save,
  Download,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Users,
  Target,
  Zap,
  TrendingUp,
  DollarSign,
  Layers,
  HeartHandshake
} from "lucide-react";

export default function BusinessCanvas() {
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Business Model Canvas Initial State
  const [canvasData, setCanvasData] = useState({
    keyPartners: ["Local Farmers & Collectives", "Tech Advisory Mentors", "Agri Tool Manufacturers"],
    keyActivities: ["App Development", "Farmer Onboarding", "Market Trend Analysis"],
    keyResources: ["Proprietary Agri AI Models", "Mentorship Network", "Cloud Infrastructure"],
    valuePropositions: ["Real-time Crop Advisory", "Direct Market Access", "Affordable Tech Pass"],
    customerRelationships: ["1-on-1 Mentorship", "Community Webinars", "Automated WhatsApp Alerts"],
    channels: ["Mobile App Portal", "Agri Institutes", "Social Media Campaigns"],
    customerSegments: ["AgriTech Startups", "Progressive Farmers", "Agri-Students"],
    costStructure: ["Server & Cloud Hosting", "Mentor Commission Fees", "Marketing & Growth"],
    revenueStreams: ["Incubator Annual Pass", "Pro Subscription Plans", "Workshop & Event Fees"],
  });

  const [inputs, setInputs] = useState<Record<string, string>>({});

  // Add Item to Category
  const handleAddItem = (category: keyof typeof canvasData) => {
    const val = inputs[category]?.trim();
    if (!val) return;
    setCanvasData({
      ...canvasData,
      [category]: [...canvasData[category], val],
    });
    setInputs({ ...inputs, [category]: "" });
  };

  // Delete Item
  const handleDeleteItem = (category: keyof typeof canvasData, index: number) => {
    const updated = canvasData[category].filter((_, i) => i !== index);
    setCanvasData({ ...canvasData, [category]: updated });
  };

  // Save Canvas
  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="flex min-h-screen bg-slate-50/60 font-sans text-slate-800 antialiased">
      {/* Business Sidebar */}
      <BusinessSidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <Palette className="w-7 h-7 text-blue-600" />
              Startup Business Model Canvas
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Design, iterate, and structure your business strategy across the 9 core building blocks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {savedSuccess && (
              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-2 rounded-xl text-xs font-bold animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Canvas Saved!</span>
              </div>
            )}

            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export Strategy</span>
            </button>

            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Canvas</span>
            </button>
          </div>
        </div>

        {/* 9 Blocks Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
          {/* Col 1: Key Partners */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col justify-between space-y-3">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-600" />
                  Key Partners
                </h3>
              </div>
              <ul className="space-y-2">
                {canvasData.keyPartners.map((item, idx) => (
                  <li key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 font-medium text-slate-700 group">
                    <span>{item}</span>
                    <button onClick={() => handleDeleteItem("keyPartners", idx)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-1.5 pt-2 border-t border-slate-100">
              <input
                type="text"
                placeholder="Add partner..."
                value={inputs.keyPartners || ""}
                onChange={(e) => setInputs({ ...inputs, keyPartners: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 outline-none text-xs"
              />
              <button onClick={() => handleAddItem("keyPartners")} className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 cursor-pointer">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Col 2: Key Activities & Key Resources */}
          <div className="space-y-4 flex flex-col justify-between">
            {/* Activities */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="font-extrabold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <Zap className="w-4 h-4 text-amber-500" /> Key Activities
                </h3>
                <ul className="space-y-1.5">
                  {canvasData.keyActivities.map((item, idx) => (
                    <li key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 font-medium text-slate-700 group">
                      <span>{item}</span>
                      <button onClick={() => handleDeleteItem("keyActivities", idx)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-1.5 pt-2 border-t border-slate-100">
                <input
                  type="text"
                  placeholder="Add activity..."
                  value={inputs.keyActivities || ""}
                  onChange={(e) => setInputs({ ...inputs, keyActivities: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 outline-none text-xs"
                />
                <button onClick={() => handleAddItem("keyActivities")} className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 cursor-pointer">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Resources */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="font-extrabold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <Layers className="w-4 h-4 text-purple-600" /> Key Resources
                </h3>
                <ul className="space-y-1.5">
                  {canvasData.keyResources.map((item, idx) => (
                    <li key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 font-medium text-slate-700 group">
                      <span>{item}</span>
                      <button onClick={() => handleDeleteItem("keyResources", idx)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-1.5 pt-2 border-t border-slate-100">
                <input
                  type="text"
                  placeholder="Add resource..."
                  value={inputs.keyResources || ""}
                  onChange={(e) => setInputs({ ...inputs, keyResources: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 outline-none text-xs"
                />
                <button onClick={() => handleAddItem("keyResources")} className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 cursor-pointer">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Col 3: Value Propositions */}
          <div className="bg-gradient-to-b from-blue-50/50 to-white rounded-2xl border border-blue-200/80 p-4 shadow-xs flex flex-col justify-between space-y-3">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-blue-100 pb-2">
                <h3 className="font-extrabold text-blue-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Value Propositions
                </h3>
              </div>
              <ul className="space-y-2">
                {canvasData.valuePropositions.map((item, idx) => (
                  <li key={idx} className="flex items-center justify-between p-2 rounded-xl bg-white border border-blue-100 font-bold text-blue-950 group shadow-xs">
                    <span>{item}</span>
                    <button onClick={() => handleDeleteItem("valuePropositions", idx)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-1.5 pt-2 border-t border-blue-100">
              <input
                type="text"
                placeholder="Add value prop..."
                value={inputs.valuePropositions || ""}
                onChange={(e) => setInputs({ ...inputs, valuePropositions: e.target.value })}
                className="w-full p-2 border border-blue-200 rounded-xl bg-white outline-none text-xs"
              />
              <button onClick={() => handleAddItem("valuePropositions")} className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 cursor-pointer">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Col 4: Relationships & Channels */}
          <div className="space-y-4 flex flex-col justify-between">
            {/* Customer Relationships */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="font-extrabold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <HeartHandshake className="w-4 h-4 text-rose-500" /> Customer Relationships
                </h3>
                <ul className="space-y-1.5">
                  {canvasData.customerRelationships.map((item, idx) => (
                    <li key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 font-medium text-slate-700 group">
                      <span>{item}</span>
                      <button onClick={() => handleDeleteItem("customerRelationships", idx)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-1.5 pt-2 border-t border-slate-100">
                <input
                  type="text"
                  placeholder="Add relationship..."
                  value={inputs.customerRelationships || ""}
                  onChange={(e) => setInputs({ ...inputs, customerRelationships: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 outline-none text-xs"
                />
                <button onClick={() => handleAddItem("customerRelationships")} className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 cursor-pointer">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Channels */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="font-extrabold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" /> Channels
                </h3>
                <ul className="space-y-1.5">
                  {canvasData.channels.map((item, idx) => (
                    <li key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 font-medium text-slate-700 group">
                      <span>{item}</span>
                      <button onClick={() => handleDeleteItem("channels", idx)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-1.5 pt-2 border-t border-slate-100">
                <input
                  type="text"
                  placeholder="Add channel..."
                  value={inputs.channels || ""}
                  onChange={(e) => setInputs({ ...inputs, channels: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 outline-none text-xs"
                />
                <button onClick={() => handleAddItem("channels")} className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 cursor-pointer">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Col 5: Customer Segments */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col justify-between space-y-3">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-purple-600" />
                  Customer Segments
                </h3>
              </div>
              <ul className="space-y-2">
                {canvasData.customerSegments.map((item, idx) => (
                  <li key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 font-medium text-slate-700 group">
                    <span>{item}</span>
                    <button onClick={() => handleDeleteItem("customerSegments", idx)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-1.5 pt-2 border-t border-slate-100">
              <input
                type="text"
                placeholder="Add segment..."
                value={inputs.customerSegments || ""}
                onChange={(e) => setInputs({ ...inputs, customerSegments: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 outline-none text-xs"
              />
              <button onClick={() => handleAddItem("customerSegments")} className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 cursor-pointer">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Row: Cost Structure & Revenue Streams */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Cost Structure */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <h3 className="font-extrabold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <DollarSign className="w-4 h-4 text-red-500" /> Cost Structure
              </h3>
              <ul className="grid grid-cols-2 gap-2">
                {canvasData.costStructure.map((item, idx) => (
                  <li key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 font-medium text-slate-700 group">
                    <span>{item}</span>
                    <button onClick={() => handleDeleteItem("costStructure", idx)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-1.5 pt-2 border-t border-slate-100">
              <input
                type="text"
                placeholder="Add cost item..."
                value={inputs.costStructure || ""}
                onChange={(e) => setInputs({ ...inputs, costStructure: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 outline-none text-xs"
              />
              <button onClick={() => handleAddItem("costStructure")} className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 cursor-pointer">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Revenue Streams */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <h3 className="font-extrabold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <DollarSign className="w-4 h-4 text-emerald-600" /> Revenue Streams
              </h3>
              <ul className="grid grid-cols-2 gap-2">
                {canvasData.revenueStreams.map((item, idx) => (
                  <li key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 font-medium text-slate-700 group">
                    <span>{item}</span>
                    <button onClick={() => handleDeleteItem("revenueStreams", idx)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-1.5 pt-2 border-t border-slate-100">
              <input
                type="text"
                placeholder="Add revenue stream..."
                value={inputs.revenueStreams || ""}
                onChange={(e) => setInputs({ ...inputs, revenueStreams: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 outline-none text-xs"
              />
              <button onClick={() => handleAddItem("revenueStreams")} className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 cursor-pointer">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}