import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../components/Sidebar';
import {
  Palette,
  Search,
  Filter,
  Download,
  Trash2,
  Edit2,
  Eye,
  X,
  CheckCircle2,
  Clock,
  Building,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Users,
  Award,
  Check,
  UserCheck,
  UserX
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchArtParticipants,
  fetchArtParticipantsStats,
  exportArtParticipantsCsv,
  updateArtParticipant,
  deleteArtParticipant,
} from '../../services/api';

export default function AdminArtCompetition() {
  // ─── State ───────────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [search, setSearch] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [preferredArtMedium, setPreferredArtMedium] = useState('');
  const [status, setStatus] = useState('');
  const [attended, setAttended] = useState('');
  const [eventId, setEventId] = useState('');
  const [distinctEvents, setDistinctEvents] = useState<string[]>([]);

  // Modals
  const [viewingItem, setViewingItem] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    collegeName: '',
    degreeAndYear: '',
    preferredArtMedium: 'Color Pencils & Oil Pastels',
    status: 'confirmed',
    attended: false,
    notes: '',
  });

  // ─── Fetch Stats ─────────────────────────────────────────────────────────────
  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const res = await fetchArtParticipantsStats(eventId);
      const statsData =
        res?.data?.stats ||
        res?.data?.data ||
        (res?.data && typeof res.data === 'object' && !Array.isArray(res.data) ? res.data : null) ||
        res?.stats ||
        res?.summary ||
        res;
      if (statsData) {
        setStats(statsData);
      }
      const evList = res?.data?.distinctEvents || res?.distinctEvents || res?.data?.stats?.distinctEvents;
      if (Array.isArray(evList) && evList.length > 0) {
        setDistinctEvents((prev) => Array.from(new Set([...prev, ...evList])));
      }
    } catch (err) {
      console.error('Failed to load art competition stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, [eventId]);

  // ─── Fetch List ──────────────────────────────────────────────────────────────
  const loadList = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchArtParticipants({
        page,
        limit,
        search: search.trim(),
        collegeName: collegeName.trim(),
        preferredArtMedium,
        status,
        attended: attended !== '' ? attended : undefined,
        eventId,
      });

      if (res) {
        let items: any[] = [];
        if (Array.isArray(res?.data?.data)) {
          items = res.data.data;
        } else if (Array.isArray(res?.data)) {
          items = res.data;
        } else if (Array.isArray(res?.data?.participants)) {
          items = res.data.participants;
        } else if (Array.isArray(res?.data?.registrations)) {
          items = res.data.registrations;
        } else if (Array.isArray(res?.participants)) {
          items = res.participants;
        } else if (Array.isArray(res)) {
          items = res;
        } else if (res?.data && typeof res.data === 'object' && Array.isArray(res.data.items)) {
          items = res.data.items;
        }

        setData(items);

        const pagination = res?.data?.pagination || res?.pagination;
        if (pagination) {
          setTotalCount(pagination.total ?? pagination.totalCount ?? items.length);
          setTotalPages(pagination.totalPages ?? pagination.pages ?? 1);
        } else if (res?.data?.total !== undefined) {
          setTotalCount(res.data.total);
          setTotalPages(res.data.totalPages || 1);
        } else {
          setTotalCount(items.length);
          setTotalPages(1);
        }

        const summary = res?.data?.summary || res?.data?.stats || res?.summary || res?.stats;
        if (summary) {
          setStats((prev: any) => ({ ...prev, ...summary }));
        }
        const evList = res?.data?.distinctEvents || res?.distinctEvents;
        if (Array.isArray(evList) && evList.length > 0) {
          setDistinctEvents((prev) => Array.from(new Set([...prev, ...evList])));
        }
      }
    } catch (err) {
      console.error('Failed to load art participants list:', err);
      toast.error('Failed to load participant records');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, collegeName, preferredArtMedium, status, attended, eventId]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  // ─── Reset Page on Filter Change ─────────────────────────────────────────────
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setCollegeName('');
    setPreferredArtMedium('');
    setStatus('');
    setAttended('');
    setEventId('');
    setPage(1);
  };

  // ─── Quick Attendance Toggle ─────────────────────────────────────────────────
  const handleToggleAttendance = async (item: any) => {
    try {
      const newAttended = !item.attended;
      const res = await updateArtParticipant(item._id, {
        attended: newAttended,
        status: newAttended ? 'ATTENDED' : 'CONFIRMED',
      });

      if (res?.success || res?.data || res?.message) {
        toast.success(
          newAttended
            ? `Marked ${item.fullName} as Present! 🎉`
            : `Marked ${item.fullName} as Absent`
        );
        setData((prev) =>
          prev.map((p) =>
            p._id === item._id
              ? { ...p, attended: newAttended, status: newAttended ? 'ATTENDED' : 'CONFIRMED' }
              : p
          )
        );
        loadStats();
      }
    } catch (err: any) {
      toast.error('Failed to update attendance status');
    }
  };

  // ─── Export CSV ──────────────────────────────────────────────────────────────
  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportArtParticipantsCsv({
        search: search.trim(),
        collegeName: collegeName.trim(),
        preferredArtMedium,
        status,
        attended: attended !== '' ? attended : undefined,
        eventId,
      });
      toast.success('Participants CSV downloaded successfully!');
    } catch (err: any) {
      toast.error('Failed to export CSV file');
    } finally {
      setIsExporting(false);
    }
  };

  // ─── Open Edit Modal ─────────────────────────────────────────────────────────
  const openEditModal = (item: any) => {
    setEditingItem(item);
    setEditForm({
      fullName: item.fullName || '',
      phone: item.phone || '',
      email: item.email || '',
      collegeName: item.collegeName || '',
      degreeAndYear: item.degreeAndYear || '',
      preferredArtMedium: item.preferredArtMedium || 'Color Pencils & Oil Pastels',
      status: (item.status || 'CONFIRMED').toUpperCase(),
      attended: Boolean(item.attended),
      notes: item.notes || '',
    });
  };

  // ─── Save Edit ───────────────────────────────────────────────────────────────
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      setIsUpdating(true);
      const res = await updateArtParticipant(editingItem._id, editForm);
      if (res?.success || res?.data || res?.message) {
        toast.success('Participant details updated successfully!');
        setEditingItem(null);
        loadList();
        loadStats();
      } else {
        toast.error(res?.message || 'Failed to update participant');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update participant');
    } finally {
      setIsUpdating(false);
    }
  };

  // ─── Confirm Delete ──────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      setIsDeleting(true);
      const res = await deleteArtParticipant(deletingId);
      if (res?.success || res?.data || res?.message) {
        toast.success('Participant removed successfully');
        setDeletingId(null);
        loadList();
        loadStats();
      } else {
        toast.error(res?.message || 'Failed to delete record');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete record');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F8F9FC] font-sans antialiased overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 sticky top-0 z-10 shadow-sm">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl shadow-md">
                <Palette size={22} />
              </span>
              <div>
                <h1 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                  Vinayagar Chaturthi Art Competition
                  <span className="px-2.5 py-0.5 text-xs font-extrabold bg-orange-100 text-orange-800 rounded-full">
                    {totalCount || stats?.total || stats?.totalParticipants || data.length || 0} registered
                  </span>
                </h1>
                <p className="text-xs text-gray-500 font-medium">
                  Manage collegiate drawing competition registrations, attendance, and details
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                loadList();
                loadStats();
                toast.success('Data refreshed');
              }}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh list"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>

            <button
              onClick={handleExport}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              <Download size={15} />
              {isExporting ? 'Exporting...' : 'Export CSV'}
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                <Users size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Entries</p>
                <p className="text-2xl font-black text-gray-900">
                  {statsLoading ? '...' : stats?.total || stats?.totalParticipants || totalCount || 0}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Confirmed</p>
                <p className="text-2xl font-black text-gray-900">
                  {statsLoading ? '...' : stats?.confirmed || 0}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <UserCheck size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Attended / Present</p>
                <p className="text-2xl font-black text-gray-900">
                  {statsLoading ? '...' : stats?.attended || 0}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Sparkles size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Registered Today</p>
                <p className="text-2xl font-black text-gray-900">
                  {statsLoading ? '...' : stats?.todayCount || stats?.todayRegistrations || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Search Bar */}
              <div className="md:col-span-3 relative">
                <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search name, phone, reg ID, college..."
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
              </div>

              {/* Event Selector */}
              <div className="md:col-span-2">
                <select
                  value={eventId}
                  onChange={(e) => {
                    setEventId(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-700 font-semibold"
                >
                  <option value="">All Events</option>
                  {Array.from(new Set(['ART-2026', ...distinctEvents]))
                    .filter(Boolean)
                    .map((ev) => (
                      <option key={ev} value={ev}>
                        {ev}
                      </option>
                    ))}
                </select>
              </div>

              {/* Art Medium Filter */}
              <div className="md:col-span-3">
                <select
                  value={preferredArtMedium}
                  onChange={(e) => {
                    setPreferredArtMedium(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-700"
                >
                  <option value="">All Art Mediums</option>
                  <option value="Color Pencils & Oil Pastels">Color Pencils &amp; Oil Pastels</option>
                  <option value="Pencil Shading / Charcoal">Pencil Shading / Charcoal</option>
                  <option value="Watercolors / Poster Colors">Watercolors / Poster Colors</option>
                  <option value="Acrylic on Paper">Acrylic on Paper</option>
                  <option value="Mixed Media">Mixed Media</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="md:col-span-2">
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-700"
                >
                  <option value="">All Statuses</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="ATTENDED">Attended</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              {/* Attended Filter */}
              <div className="md:col-span-2">
                <select
                  value={attended}
                  onChange={(e) => {
                    setAttended(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-700"
                >
                  <option value="">Attendance: All</option>
                  <option value="true">Attended (Yes)</option>
                  <option value="false">Not Attended (No)</option>
                </select>
              </div>

              {/* Reset */}
              <div className="md:col-span-1 flex items-center justify-end">
                <button
                  onClick={handleResetFilters}
                  className="w-full py-2.5 text-xs font-bold text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer text-center"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="w-full overflow-hidden">
              <table className="w-full text-left text-xs table-fixed border-collapse">
                <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200 text-[11px]">
                  <tr>
                    <th className="w-[12%] px-3 py-3.5">Reg ID</th>
                    <th className="w-[22%] px-3 py-3.5">Participant</th>
                    <th className="w-[18%] px-3 py-3.5">College &amp; Degree</th>
                    <th className="w-[17%] px-3 py-3.5">Art Medium</th>
                    <th className="w-[12%] px-3 py-3.5 text-center">Attendance</th>
                    <th className="w-[9%] px-2 py-3.5 text-center">Status</th>
                    <th className="w-[10%] px-3 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                        <div className="inline-flex items-center gap-2">
                          <RefreshCw size={16} className="animate-spin text-orange-500" />
                          Loading art competition participants...
                        </div>
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                        <div className="max-w-xs mx-auto space-y-2">
                          <Palette size={32} className="mx-auto text-gray-300" />
                          <p className="font-semibold text-gray-600">No participants found</p>
                          <p className="text-[11px] text-gray-400">
                            No registration records match your active search and filter criteria.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    data.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50/70 transition-colors">
                        {/* Reg ID */}
                        <td className="px-3 py-3.5 whitespace-nowrap">
                          <span className="font-mono font-extrabold text-orange-700 bg-orange-50 px-2 py-1 rounded-md border border-orange-200 text-[10px] sm:text-[11px] inline-block tracking-tight">
                            {item.registrationNumber || 'N/A'}
                          </span>
                        </td>

                        {/* Participant info */}
                        <td className="px-3 py-3.5">
                          <div className="font-bold text-gray-900 text-xs truncate" title={item.fullName}>
                            {item.fullName}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-0.5 truncate">
                            <a
                              href={`tel:${item.phone}`}
                              className="hover:text-orange-600 hover:underline font-mono shrink-0"
                            >
                              {item.phone}
                            </a>
                            {item.email && (
                              <span className="truncate text-gray-400" title={item.email}>
                                &bull; {item.email}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* College & Degree */}
                        <td className="px-3 py-3.5">
                          <div className="font-semibold text-gray-900 text-xs truncate" title={item.collegeName}>
                            {item.collegeName || '—'}
                          </div>
                          <div className="text-[11px] text-gray-500 truncate mt-0.5" title={item.degreeAndYear}>
                            {item.degreeAndYear || '—'}
                          </div>
                        </td>

                        {/* Art Medium */}
                        <td className="px-3 py-3.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-800 rounded-full font-semibold text-[10px] sm:text-[11px] border border-amber-200/60 max-w-full truncate" title={item.preferredArtMedium}>
                            🎨 <span className="truncate">{item.preferredArtMedium || 'Any Medium'}</span>
                          </span>
                        </td>

                        {/* Attendance Toggle */}
                        <td className="px-3 py-3.5 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleToggleAttendance(item)}
                            className={`inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer ${
                              item.attended
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                            title="Click to toggle attendance"
                          >
                            {item.attended ? (
                              <>
                                <Check size={12} className="stroke-[3]" /> Present
                              </>
                            ) : (
                              <>
                                <Clock size={12} /> Mark Present
                              </>
                            )}
                          </button>
                        </td>

                        {/* Status */}
                        <td className="px-2 py-3.5 text-center whitespace-nowrap">
                          {(() => {
                            const st = (item.status || 'CONFIRMED').toUpperCase();
                            return (
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide inline-block ${
                                  st === 'ATTENDED'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : st === 'CANCELLED'
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                                }`}
                              >
                                {st}
                              </span>
                            );
                          })()}
                        </td>

                        {/* Actions */}
                        <td className="px-3 py-3.5 whitespace-nowrap text-right">
                          <div className="inline-flex items-center justify-end gap-1">
                            <button
                              onClick={() => setViewingItem(item)}
                              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              title="View details"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              onClick={() => openEditModal(item)}
                              className="p-1.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                              title="Edit participant"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => setDeletingId(item._id)}
                              className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete record"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="bg-gray-50 px-5 py-3.5 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500 font-medium">
              <div>
                Showing page <strong className="text-gray-900">{page}</strong> of{' '}
                <strong className="text-gray-900">{totalPages}</strong> ({totalCount} total records)
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page <= 1}
                  className="p-1.5 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-40 transition-colors cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="px-2 font-bold text-gray-800">{page}</span>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page >= totalPages}
                  className="p-1.5 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-40 transition-colors cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ─── View Modal ───────────────────────────────────────────────────────── */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-orange-100 text-orange-700 rounded-xl">
                  <Palette size={18} />
                </span>
                <h3 className="font-extrabold text-base text-gray-900">Participant Details</h3>
              </div>
              <button
                onClick={() => setViewingItem(null)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="bg-orange-50/70 border border-orange-200/80 rounded-2xl p-4 text-center">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Registration Number
                </p>
                <p className="font-mono text-xl font-black text-orange-900 mt-0.5">
                  {viewingItem.registrationNumber || 'N/A'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Full Name</p>
                  <p className="font-bold text-gray-900 text-sm mt-0.5">{viewingItem.fullName}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Mobile / WhatsApp</p>
                  <p className="font-mono font-bold text-gray-900 text-sm mt-0.5">
                    {viewingItem.phone}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Email Address</p>
                <p className="font-medium text-gray-900 mt-0.5">{viewingItem.email || '—'}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase">College / Institution</p>
                <p className="font-medium text-gray-900 mt-0.5">{viewingItem.collegeName}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Degree &amp; Year</p>
                  <p className="font-medium text-gray-900 mt-0.5">{viewingItem.degreeAndYear || '—'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Preferred Medium</p>
                  <p className="font-medium text-gray-900 mt-0.5">{viewingItem.preferredArtMedium}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Status</p>
                  <p className="font-bold text-gray-900 uppercase mt-0.5">{viewingItem.status}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Attended</p>
                  <p className="font-bold text-gray-900 mt-0.5">
                    {viewingItem.attended ? 'Yes (Present)' : 'No (Pending)'}
                  </p>
                </div>
              </div>

              {viewingItem.notes && (
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Notes</p>
                  <p className="text-gray-700 mt-0.5">{viewingItem.notes}</p>
                </div>
              )}

              <div className="text-[10px] text-gray-400 text-right pt-2">
                Registered On: {viewingItem.createdAt ? new Date(viewingItem.createdAt).toLocaleString('en-IN') : '—'}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewingItem(null)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Edit Modal ───────────────────────────────────────────────────────── */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-orange-100 text-orange-700 rounded-xl">
                  <Edit2 size={18} />
                </span>
                <h3 className="font-extrabold text-base text-gray-900">
                  Edit Participant &bull; {editingItem.registrationNumber}
                </h3>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editForm.fullName}
                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Mobile / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Art Medium</label>
                  <select
                    value={editForm.preferredArtMedium}
                    onChange={(e) => setEditForm({ ...editForm, preferredArtMedium: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white"
                  >
                    <option value="Color Pencils & Oil Pastels">Color Pencils &amp; Oil Pastels</option>
                    <option value="Pencil Shading / Charcoal">Pencil Shading / Charcoal</option>
                    <option value="Watercolors / Poster Colors">Watercolors / Poster Colors</option>
                    <option value="Acrylic on Paper">Acrylic on Paper</option>
                    <option value="Mixed Media">Mixed Media</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">College / Institution *</label>
                <input
                  type="text"
                  required
                  value={editForm.collegeName}
                  onChange={(e) => setEditForm({ ...editForm, collegeName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Degree &amp; Year of Study</label>
                <input
                  type="text"
                  value={editForm.degreeAndYear}
                  onChange={(e) => setEditForm({ ...editForm, degreeAndYear: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Status</label>
                  <select
                    value={(editForm.status || 'CONFIRMED').toUpperCase()}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white"
                  >
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="ATTENDED">Attended</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Attended?</label>
                  <select
                    value={editForm.attended ? 'true' : 'false'}
                    onChange={(e) => setEditForm({ ...editForm, attended: e.target.value === 'true' })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white"
                  >
                    <option value="false">No (Not Attended)</option>
                    <option value="true">Yes (Attended / Present)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Delete Confirmation Modal ────────────────────────────────────────── */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <AlertCircle size={26} />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-gray-900">Remove Participant?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Are you sure you want to deactivate this drawing competition registration? This action can be reversed by an administrator.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
