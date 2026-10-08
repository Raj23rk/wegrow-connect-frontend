import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../../components/Sidebar';
import {
  MessageSquare,
  Search,
  Download,
  Trash2,
  RefreshCw,
  Phone,
  Calendar,
  Sparkles,
  CheckCircle,
  Clock,
  ThumbsUp,
  Share2,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getMeetupFeedbacks,
  deleteMeetupFeedback,
  updateMeetupFeedback,
  exportMeetupFeedbackCsv
} from '../../services/businessDependencyApi';

export interface MeetupFeedbackItem {
  id: string;
  name: string;
  experience: 'Excellent' | 'Good' | 'Average' | 'Needs Improvement' | string;
  willingToGrow: 'Yes' | 'No' | 'Maybe' | string;
  canRefer: 'Yes' | 'No' | string;
  referralName?: string;
  referralBusiness?: string;
  referralMobile?: string;
  likedMost?: string;
  suggestions?: string;
  keyTakeaways?: string;
  eventName?: string;
  eventDate?: string;
  submittedAt?: string;
  status?: 'new' | 'reviewed' | 'contacted' | 'archived' | string;
  notes?: string;
}

export default function AdminMeetupFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<MeetupFeedbackItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [filterExperience, setFilterExperience] = useState<string>('ALL');
  const [filterWilling, setFilterWilling] = useState<string>('ALL');
  const [filterReferral, setFilterReferral] = useState<string>('ALL');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<MeetupFeedbackItem | null>(null);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (filterExperience !== 'ALL') params.experience = filterExperience;
      if (filterWilling !== 'ALL') params.willingToGrow = filterWilling;
      if (filterReferral !== 'ALL') params.canRefer = filterReferral;
      if (search.trim()) params.search = search.trim();

      const res = await getMeetupFeedbacks(params);
      const list = res?.data?.feedbacks || res?.data || (Array.isArray(res) ? res : []);
      setFeedbacks(list);
    } catch (err) {
      console.warn('Could not fetch from backend:', err);
      toast.error('Failed to load feedback from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [filterExperience, filterWilling, filterReferral, startDate, endDate]);

  const handleOct9Preset = () => {
    setStartDate('2026-10-09');
    setEndDate('2026-10-09');
  };

  const handleClearFilters = () => {
    setSearch('');
    setFilterExperience('ALL');
    setFilterWilling('ALL');
    setFilterReferral('ALL');
    setStartDate('');
    setEndDate('');
  };

  const filteredList = useMemo(() => {
    return feedbacks.filter((item) => {
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesName = item.name?.toLowerCase().includes(query);
        const matchesRef = item.referralName?.toLowerCase().includes(query) || item.referralBusiness?.toLowerCase().includes(query);
        const matchesText = item.likedMost?.toLowerCase().includes(query) || item.keyTakeaways?.toLowerCase().includes(query);
        if (!matchesName && !matchesRef && !matchesText) return false;
      }
      return true;
    });
  }, [feedbacks, search]);

  const stats = useMemo(() => {
    const total = filteredList.length;
    const excellent = filteredList.filter((f) => f.experience === 'Excellent').length;
    const readyToGrow = filteredList.filter((f) => f.willingToGrow === 'Yes').length;
    const withReferrals = filteredList.filter((f) => f.canRefer === 'Yes' && f.referralName).length;
    const ratingPct = total > 0 ? Math.round(((excellent + filteredList.filter(f => f.experience === 'Good').length) / total) * 100) : 0;
    return { total, excellent, readyToGrow, withReferrals, ratingPct };
  }, [filteredList]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this feedback record?')) return;
    try {
      await deleteMeetupFeedback(id);
      toast.success('Feedback deleted');
      setFeedbacks((prev) => prev.filter((item) => item.id !== id));
      if (selectedItem?.id === id) setSelectedItem(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  const handleExportCsv = async () => {
    try {
      await exportMeetupFeedbackCsv({
        startDate,
        endDate,
        experience: filterExperience !== 'ALL' ? filterExperience : undefined
      });
      toast.success('CSV export downloaded');
    } catch (err) {
      toast.error('Failed to export CSV');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0B0F19] text-slate-100">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto overflow-y-auto">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 mb-8 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Event Feedback & Lead Engine
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Business Transformation Meetup Feedbacks
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Attendee responses, experience ratings, growth interest, and founder referrals.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/feedback"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition"
            >
              <ExternalLink className="w-4 h-4 text-orange-400" />
              Live Form
            </a>
            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              Export CSV
            </button>
            <button
              onClick={fetchFeedbacks}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition border border-slate-700"
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Responses</span>
              <MessageSquare className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl font-black text-white mt-2">{stats.total}</div>
            <div className="text-xs text-slate-500 mt-1">From all registered meetups</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Satisfaction</span>
              <ThumbsUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-emerald-400 mt-2">{stats.ratingPct}%</div>
            <div className="text-xs text-slate-500 mt-1">{stats.excellent} Excellent reviews</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Willing to Grow</span>
              <CheckCircle className="w-5 h-5 text-orange-400" />
            </div>
            <div className="text-3xl font-black text-[#F26A1B] mt-2">{stats.readyToGrow}</div>
            <div className="text-xs text-slate-500 mt-1">High conversion interest</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Founder Referrals</span>
              <Share2 className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-black text-purple-400 mt-2">{stats.withReferrals}</div>
            <div className="text-xs text-slate-500 mt-1">New warm leads introduced</div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 mb-6 space-y-4 shadow-lg">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search attendee, referral name, phone, suggestions..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#F26A1B]"
              />
            </div>

            <button
              onClick={handleOct9Preset}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                startDate === '2026-10-09' && endDate === '2026-10-09'
                  ? 'bg-[#F26A1B] text-white border-[#F26A1B] shadow-lg shadow-orange-500/20'
                  : 'bg-slate-800 text-orange-400 border-orange-500/30 hover:bg-slate-700'
              }`}
            >
              ★ Oct 9 Meetup Event
            </button>

            <button
              onClick={handleClearFilters}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-400 hover:text-slate-200 border border-slate-700 transition"
            >
              Clear Filters
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Experience
              </label>
              <select
                value={filterExperience}
                onChange={(e) => setFilterExperience(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#F26A1B]"
              >
                <option value="ALL">All Ratings</option>
                <option value="Excellent">🌟 Excellent</option>
                <option value="Good">👍 Good</option>
                <option value="Average">👌 Average</option>
                <option value="Needs Improvement">💡 Needs Improvement</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Willing to Grow
              </label>
              <select
                value={filterWilling}
                onChange={(e) => setFilterWilling(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#F26A1B]"
              >
                <option value="ALL">All Responses</option>
                <option value="Yes">Yes</option>
                <option value="Maybe">Maybe</option>
                <option value="No">No</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Referral Given
              </label>
              <select
                value={filterReferral}
                onChange={(e) => setFilterReferral(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#F26A1B]"
              >
                <option value="ALL">All</option>
                <option value="Yes">Yes (With Referral)</option>
                <option value="No">No</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Event Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setEndDate(e.target.value);
                }}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#F26A1B]"
              />
            </div>
          </div>
        </div>

        {/* Table & Content */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/60 text-[11px] uppercase font-bold tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Attendee</th>
                  <th className="py-3.5 px-4">Experience</th>
                  <th className="py-3.5 px-4">Willing to Grow</th>
                  <th className="py-3.5 px-4">Referral Info</th>
                  <th className="py-3.5 px-4">Takeaways / Notes</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      {loading ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-6 h-6 border-2 border-[#F26A1B] border-t-transparent rounded-full animate-spin" />
                          <span>Loading feedback submissions…</span>
                        </div>
                      ) : (
                        <div>
                          <MessageSquare className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                          <p>No feedback submissions found matching your filters.</p>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-4 px-4">
                        <div className="font-bold text-white">{item.name}</div>
                        <div className="text-xs text-slate-400">{item.eventName || 'Meetup'}</div>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                            item.experience === 'Excellent'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : item.experience === 'Good'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : item.experience === 'Average'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {item.experience}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`text-xs font-bold ${
                            item.willingToGrow === 'Yes'
                              ? 'text-emerald-400'
                              : item.willingToGrow === 'Maybe'
                              ? 'text-amber-400'
                              : 'text-slate-400'
                          }`}
                        >
                          {item.willingToGrow}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        {item.canRefer === 'Yes' && item.referralName ? (
                          <div className="space-y-0.5">
                            <div className="font-semibold text-purple-300 text-xs">
                              {item.referralName}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {item.referralBusiness}
                            </div>
                            {item.referralMobile && (
                              <a
                                href={`tel:${item.referralMobile}`}
                                className="inline-flex items-center gap-1 text-[11px] text-orange-400 hover:underline"
                              >
                                <Phone className="w-3 h-3" />
                                {item.referralMobile}
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500">None</span>
                        )}
                      </td>

                      <td className="py-4 px-4 max-w-xs">
                        <p className="text-xs text-slate-300 line-clamp-2">
                          {item.likedMost || item.keyTakeaways || item.suggestions || '—'}
                        </p>
                      </td>

                      <td className="py-4 px-4 text-xs text-slate-400">
                        {item.eventDate || (item.submittedAt ? item.submittedAt.slice(0, 10) : '—')}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                          title="Delete submission"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
