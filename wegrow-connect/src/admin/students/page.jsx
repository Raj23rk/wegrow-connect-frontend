import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../components/Sidebar';
import {
  Users, Search, Filter, Download, Eye, X, Loader2, RefreshCw, Send, CheckCircle2, Clock,
  ChevronLeft, ChevronRight, GraduationCap, BookOpen, Phone, Mail, Building2, Calendar,
  FileText, Check, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  getCampaignStudents, 
  getCampaignStudentById, 
  exportCampaignStudents, 
  getCampaigns, 
  getCampaignTasks,
  sendStudentTaskLink, 
  sendBulkStudentTaskLinks 
} from '../../services/api';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState({}); // { [studentId]: taskId }
  const [viewing, setViewing] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [sendingTaskId, setSendingTaskId] = useState(null);
  const [bulkSending, setBulkSending] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [filterCampaign, setFilterCampaign] = useState('');
  const [filterType, setFilterType] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Send single task link with selected taskId
  const handleSendTaskLink = async (studentId, specificTaskId) => {
    const taskIdToSend = specificTaskId !== undefined 
      ? specificTaskId 
      : (selectedTasks[studentId] || undefined);

    setSendingTaskId(studentId);
    try {
      const res = await sendStudentTaskLink(studentId, taskIdToSend);
      const chosenTask = tasks.find((t) => t._id === taskIdToSend);
      toast.success(
        chosenTask 
          ? `Task "${chosenTask.title}" sent to student email!`
          : (res?.message || 'Task link sent to student email!')
      );
      await load();
      if (viewing && viewing._id === studentId) {
        const updated = await getCampaignStudentById(studentId);
        setViewing(updated?.data?.student || updated?.data || updated);
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to send task link');
    } finally {
      setSendingTaskId(null);
    }
  };

  const handleBulkSendTaskLinks = async () => {
    if (!window.confirm('Assign & send 60-minute task test links to all registered students who have not received it yet?')) return;
    setBulkSending(true);
    try {
      const res = await sendBulkStudentTaskLinks();
      const sent = res?.data?.sentCount ?? res?.sentCount ?? 0;
      toast.success(`Task link sent to ${sent} students!`);
      load();
    } catch (err) {
      toast.error(err?.message || 'Bulk send failed');
    } finally {
      setBulkSending(false);
    }
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (search) params.search = search;
      if (filterCampaign) params.campaignId = filterCampaign;
      if (filterType) params.studentType = filterType;
      const res = await getCampaignStudents(params);
      const data = res?.data;
      const list = data?.students || data?.data || (Array.isArray(data) ? data : []) || [];
      setStudents(list);
      setTotalPages(data?.pagination?.totalPages || data?.totalPages || 1);
      setTotalCount(data?.pagination?.total || data?.total || 0);

      // Pre-populate selected tasks for each student if already assigned
      setSelectedTasks((prev) => {
        const next = { ...prev };
        list.forEach((s) => {
          if (s.assignedTaskId && !next[s._id]) {
            next[s._id] = typeof s.assignedTaskId === 'object' ? s.assignedTaskId._id : s.assignedTaskId;
          }
        });
        return next;
      });
    } catch {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  }, [page, search, filterCampaign, filterType]);

  useEffect(() => { load(); }, [load]);

  // Load campaigns and tasks for selection dropdowns
  useEffect(() => {
    getCampaigns()
      .then((r) => setCampaigns(r?.data?.campaigns || r?.data || []))
      .catch(() => {});

    getCampaignTasks()
      .then((r) => {
        const list = r?.data?.tasks || r?.data || [];
        setTasks(Array.isArray(list) ? list : []);
      })
      .catch(() => {});
  }, []);

  const handleView = async (id) => {
    try {
      const res = await getCampaignStudentById(id);
      setViewing(res?.data?.student || res?.data || res);
    } catch { 
      toast.error('Failed to fetch student details'); 
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await exportCampaignStudents();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `campaign-students-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Export downloaded!');
    } catch { 
      toast.error('Export failed'); 
    } finally { 
      setExporting(false); 
    }
  };

  const typeIcon = (t) => t === 'SCHOOL'
    ? <BookOpen style={{ width: 13, height: 13, color: '#60a5fa' }} />
    : <GraduationCap style={{ width: 13, height: 13, color: '#f59e0b' }} />;

  const typeBadgeStyle = (t) => t === 'SCHOOL' ? S.schoolBadge : S.collegeBadge;

  // Helper to get task name
  const getTaskTitle = (taskId) => {
    if (!taskId) return null;
    const id = typeof taskId === 'object' ? taskId._id : taskId;
    const found = tasks.find((t) => t._id === id);
    return found ? found.title : (typeof taskId === 'object' ? taskId.title : null);
  };

  return (
    <div style={S.layout}>
      <Sidebar />
      <main style={S.main}>
        {/* Header */}
        <div style={S.header}>
          <div>
            <h1 style={S.pageTitle}>
              <Users style={{ width: 22, height: 22, color: '#60a5fa', verticalAlign: 'middle', marginRight: 8 }} />
              Campaign Students
            </h1>
            <p style={S.pageSubtitle}>{totalCount} registered students from QR campaigns</p>
          </div>
          <div style={S.headerActions}>
            <button style={S.refreshBtn} onClick={load} title="Refresh list">
              <RefreshCw style={{ width: 14, height: 14 }} />
            </button>
            <button style={S.bulkSendBtn} onClick={handleBulkSendTaskLinks} disabled={bulkSending}>
              {bulkSending ? <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} /> : <Send style={{ width: 14, height: 14 }} />}
              Send All Task Links
            </button>
            <button id="btn-export-students" style={S.exportBtn} onClick={handleExport} disabled={exporting}>
              {exporting ? <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} /> : <Download style={{ width: 14, height: 14 }} />}
              Export CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div style={S.filtersRow}>
          <div style={S.searchWrap}>
            <Search style={S.searchIcon} />
            <input 
              style={S.searchInput} 
              placeholder="Search name, email, mobile…" 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }} 
            />
          </div>
          <select style={S.filterSelect} value={filterType} onChange={(e) => { setFilterType(e.target.value); setPage(1); }}>
            <option value="">All Types</option>
            <option value="SCHOOL">School Students</option>
            <option value="COLLEGE">College Students</option>
          </select>
          <select style={S.filterSelect} value={filterCampaign} onChange={(e) => { setFilterCampaign(e.target.value); setPage(1); }}>
            <option value="">All Campaigns</option>
            {campaigns.map((c) => <option key={c._id} value={c.campaignId}>{c.name} ({c.campaignId})</option>)}
          </select>
        </div>

        {/* Table */}
        <div style={S.tableWrap}>
          {loading ? (
            <div style={S.center}>
              <Loader2 style={{ width: 32, height: 32, color: '#60a5fa', animation: 'spin 1s linear infinite' }} />
            </div>
          ) : students.length === 0 ? (
            <div style={S.center}>
              <Users style={{ width: 40, height: 40, color: '#334155' }} />
              <p style={{ color: '#475569', marginTop: 10 }}>No students found</p>
            </div>
          ) : (
            <table style={S.table}>
              <thead>
                <tr>
                  {[
                    'Student', 
                    'Contact', 
                    'Type', 
                    'Education Info', 
                    'Campaign', 
                    'Select Task to Send', 
                    'Task Status', 
                    'Actions'
                  ].map((h) => (
                    <th key={h} style={S.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((s) => {
                  const assignedTitle = getTaskTitle(s.assignedTaskId);
                  const currentSelectedTask = selectedTasks[s._id] || (typeof s.assignedTaskId === 'object' ? s.assignedTaskId?._id : s.assignedTaskId) || '';

                  return (
                    <tr key={s._id} style={S.tr}>
                      {/* Name */}
                      <td style={S.td}>
                        <div style={S.stuName}>{s.name}</div>
                        <span style={{ color: '#64748b', fontSize: 11 }}>
                          {s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}
                        </span>
                      </td>

                      {/* Contact */}
                      <td style={S.td}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#94a3b8', fontSize: 12 }}>
                            <Mail style={{ width: 11, height: 11 }} />{s.email}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#94a3b8', fontSize: 12 }}>
                            <Phone style={{ width: 11, height: 11 }} />{s.mobile}
                          </span>
                        </div>
                      </td>

                      {/* Type */}
                      <td style={S.td}>
                        <span style={typeBadgeStyle(s.studentType)}>
                          {typeIcon(s.studentType)} {s.studentType === 'SCHOOL' ? 'School' : 'College'}
                        </span>
                      </td>

                      {/* Education Info */}
                      <td style={S.td}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <span style={{ color: '#f1f5f9', fontSize: 12, fontWeight: 500 }}>
                            {s.schoolName || s.collegeName || '—'}
                          </span>
                          <span style={{ color: '#64748b', fontSize: 11 }}>
                            {s.class ? `Class ${s.class}` : s.year ? `Year ${s.year}` : ''}
                            {s.department ? ` · ${s.department}` : ''}
                          </span>
                        </div>
                      </td>

                      {/* Campaign */}
                      <td style={S.td}>
                        <code style={S.code}>{s.campaignId || '—'}</code>
                      </td>

                      {/* Task List Dropdown (Connect API to select which task to send) */}
                      <td style={S.td}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 220 }}>
                          <select
                            style={S.taskSelect}
                            value={currentSelectedTask}
                            onChange={(e) => setSelectedTasks({ ...selectedTasks, [s._id]: e.target.value })}
                            title="Select a specific task to send to this student"
                          >
                            <option value="">⚡ Auto-Assign (By Class/Year)</option>
                            {tasks.map((t) => (
                              <option key={t._id} value={t._id}>
                                {t.title} ({t.category} · {t.duration || 60}m)
                              </option>
                            ))}
                          </select>
                          
                          {assignedTitle && (
                            <span style={{ color: '#38bdf8', fontSize: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
                              <CheckCircle2 style={{ width: 10, height: 10 }} />
                              Assigned: {assignedTitle}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td style={S.td}>
                        {s.taskEmailSent ? (
                          <span 
                            style={S.sentBadge} 
                            title={s.taskEmailSentAt ? `Sent on ${new Date(s.taskEmailSentAt).toLocaleString('en-IN')}` : 'Task link sent'}
                          >
                            <CheckCircle2 style={{ width: 11, height: 11 }} /> Sent
                          </span>
                        ) : (
                          <span style={S.pendingBadge}>
                            <Clock style={{ width: 11, height: 11 }} /> Not Sent
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td style={S.td}>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <button
                            style={s.taskEmailSent ? S.resendBtn : S.sendBtn}
                            onClick={() => handleSendTaskLink(s._id, selectedTasks[s._id])}
                            disabled={sendingTaskId === s._id}
                            title={s.taskEmailSent ? 'Resend selected task link email' : 'Assign selected task & send link to student email'}
                          >
                            {sendingTaskId === s._id ? (
                              <Loader2 style={{ width: 12, height: 12, animation: 'spin 1s linear infinite' }} />
                            ) : (
                              <Send style={{ width: 12, height: 12 }} />
                            )}
                            {s.taskEmailSent ? 'Resend' : 'Send Task'}
                          </button>

                          <button 
                            style={S.viewBtn} 
                            onClick={() => handleView(s._id)} 
                            title="View student & task details"
                          >
                            <Eye style={{ width: 13, height: 13 }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={S.pagination}>
            <button style={S.pageBtn} onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft style={{ width: 14, height: 14 }} />
            </button>
            <span style={{ color: '#64748b', fontSize: 13 }}>Page {page} / {totalPages}</span>
            <button style={S.pageBtn} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              <ChevronRight style={{ width: 14, height: 14 }} />
            </button>
          </div>
        )}

        {/* View & Assign Task Modal */}
        {viewing && (
          <div style={S.overlay} onClick={() => setViewing(null)}>
            <div style={S.modal} onClick={(e) => e.stopPropagation()}>
              <div style={S.modalHeader}>
                <h3 style={S.modalTitle}>
                  <Users style={{ width: 18, height: 18, color: '#60a5fa' }} /> 
                  Student Details & Task Dispatch
                </h3>
                <button style={S.closeBtn} onClick={() => setViewing(null)}>
                  <X style={{ width: 18, height: 18 }} />
                </button>
              </div>

              {/* Student Profile Grid */}
              <div style={S.detailGrid}>
                {[
                  { label: 'Full Name', value: viewing.name },
                  { label: 'Email', value: viewing.email },
                  { label: 'Mobile', value: viewing.mobile },
                  { label: 'WhatsApp', value: viewing.whatsapp || viewing.mobile },
                  { label: 'Student Type', value: viewing.studentType },
                  { label: 'Campaign ID', value: viewing.campaignId },
                  ...(viewing.studentType === 'SCHOOL'
                    ? [{ label: 'School Name', value: viewing.schoolName }, { label: 'Class', value: viewing.class }]
                    : [
                        { label: 'College Name', value: viewing.collegeName },
                        { label: 'Department', value: viewing.department },
                        { label: 'Year', value: viewing.year },
                      ]
                  ),
                  { label: 'Registered On', value: viewing.createdAt ? new Date(viewing.createdAt).toLocaleString('en-IN') : '—' },
                ].map(({ label, value }) => (
                  <div key={label} style={S.detailItem}>
                    <span style={S.detailLabel}>{label}</span>
                    <span style={S.detailValue}>{value || '—'}</span>
                  </div>
                ))}
              </div>

              {/* Task Dispatch Box inside Modal */}
              <div style={S.modalTaskBox}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ color: '#93c5fd', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FileText style={{ width: 15, height: 15 }} />
                    Assigned Task Assessment
                  </span>
                  {viewing.taskEmailSent ? (
                    <span style={S.sentBadge}>
                      <CheckCircle2 style={{ width: 11, height: 11 }} /> Email Sent
                    </span>
                  ) : (
                    <span style={S.pendingBadge}>
                      <Clock style={{ width: 11, height: 11 }} /> Pending Dispatch
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                  <label style={{ color: '#94a3b8', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>
                    Select Task to Assign & Send:
                  </label>
                  <select
                    style={{ ...S.taskSelect, width: '100%', maxWidth: 'none', padding: '10px 12px' }}
                    value={selectedTasks[viewing._id] || (typeof viewing.assignedTaskId === 'object' ? viewing.assignedTaskId?._id : viewing.assignedTaskId) || ''}
                    onChange={(e) => setSelectedTasks({ ...selectedTasks, [viewing._id]: e.target.value })}
                  >
                    <option value="">⚡ Auto-Assign (By Category, Class/Year)</option>
                    {tasks.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.title} — {t.category} ({t.duration || 60} mins · Max: {t.maxMarks || 100} marks)
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  style={{
                    ...S.bulkSendBtn,
                    width: '100%',
                    justifyContent: 'center',
                    padding: '12px',
                    fontSize: 14,
                  }}
                  onClick={() => handleSendTaskLink(viewing._id, selectedTasks[viewing._id])}
                  disabled={sendingTaskId === viewing._id}
                >
                  {sendingTaskId === viewing._id ? (
                    <>
                      <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
                      <span>Sending Task Link…</span>
                    </>
                  ) : (
                    <>
                      <Send style={{ width: 15, height: 15 }} />
                      <span>{viewing.taskEmailSent ? 'Resend Task Email to Student' : 'Send Task Email to Student'}</span>
                    </>
                  )}
                </button>
              </div>

              <button style={S.closeModalBtn} onClick={() => setViewing(null)}>Close Window</button>
            </div>
          </div>
        )}

        <style>{`@keyframes spin { to { transform: rotate(360deg); } } select option { background: #0f172a; color: #f1f5f9; }`}</style>
      </main>
    </div>
  );
}

const S = {
  layout: { display: 'flex', minHeight: '100vh', background: '#060f1e', fontFamily: "'Inter', sans-serif" },
  main: { flex: 1, padding: '28px 32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 },
  pageTitle: { color: '#f1f5f9', fontSize: 22, fontWeight: 800, margin: 0 },
  pageSubtitle: { color: '#475569', fontSize: 13, margin: '4px 0 0' },
  headerActions: { display: 'flex', gap: 10, alignItems: 'center' },
  refreshBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#94a3b8', cursor: 'pointer' },
  exportBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', background: 'rgba(243,168,18,0.12)', border: '1px solid rgba(243,168,18,0.25)', borderRadius: 10, color: '#f3a812', fontSize: 13, fontWeight: 700, cursor: 'pointer' },
  bulkSendBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', background: 'linear-gradient(135deg, #104288 0%, #1e3a8a 100%)', border: '1px solid #3b82f6', borderRadius: 10, color: '#ffffff', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,66,136,0.3)' },
  sendBtn: { display: 'inline-flex', alignItems: 'center', gap: 5, background: 'linear-gradient(135deg, #104288, #2563eb)', border: '1px solid #3b82f6', borderRadius: 8, padding: '6px 12px', color: '#ffffff', fontSize: 11, fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px rgba(16,66,136,0.3)' },
  resendBtn: { display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '6px 12px', color: '#94a3b8', fontSize: 11, fontWeight: 600, cursor: 'pointer' },
  sentBadge: { display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 20, padding: '3px 9px', color: '#22c55e', fontSize: 11, fontWeight: 600 },
  pendingBadge: { display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 20, padding: '3px 9px', color: '#94a3b8', fontSize: 11, fontWeight: 500 },
  filtersRow: { display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' },
  searchWrap: { position: 'relative', flex: 1, minWidth: 220 },
  searchIcon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: '#475569' },
  searchInput: { width: '100%', padding: '9px 12px 9px 36px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f1f5f9', fontSize: 13, outline: 'none', boxSizing: 'border-box' },
  filterSelect: { padding: '9px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f1f5f9', fontSize: 13, outline: 'none', cursor: 'pointer' },
  tableWrap: { background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, overflow: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: 950 },
  th: { padding: '12px 14px', color: '#475569', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', whiteSpace: 'nowrap' },
  tr: { borderBottom: '1px solid rgba(255,255,255,0.04)' },
  td: { padding: '12px 14px', verticalAlign: 'middle' },
  stuName: { color: '#f1f5f9', fontWeight: 600, fontSize: 14 },
  schoolBadge: { display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 20, padding: '3px 10px', color: '#60a5fa', fontSize: 11, fontWeight: 600 },
  collegeBadge: { display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 20, padding: '3px 10px', color: '#f59e0b', fontSize: 11, fontWeight: 600 },
  code: { background: 'rgba(59,130,246,0.1)', color: '#60a5fa', padding: '2px 7px', borderRadius: 5, fontSize: 11, fontFamily: 'monospace' },
  taskSelect: {
    padding: '7px 10px',
    background: '#0f172a',
    border: '1px solid rgba(59,130,246,0.35)',
    borderRadius: 8,
    color: '#f1f5f9',
    fontSize: 12,
    fontWeight: 600,
    outline: 'none',
    cursor: 'pointer',
    maxWidth: 240,
    width: '100%',
    textOverflow: 'ellipsis',
  },
  viewBtn: { display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 10px', color: '#94a3b8', fontSize: 12, cursor: 'pointer' },
  center: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 60 },
  pagination: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 },
  pageBtn: { display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 10px', color: '#94a3b8', cursor: 'pointer' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 },
  modal: { background: '#0f172a', border: '1.5px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: '28px', width: '100%', maxWidth: 540, boxShadow: '0 32px 80px rgba(0,0,0,0.6)' },
  modalHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  modalTitle: { color: '#f1f5f9', fontSize: 17, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 8 },
  closeBtn: { background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' },
  detailGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 },
  detailItem: { display: 'flex', flexDirection: 'column', gap: 3 },
  detailLabel: { color: '#475569', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 },
  detailValue: { color: '#f1f5f9', fontSize: 13, fontWeight: 500, wordBreak: 'break-all' },
  modalTaskBox: { background: 'rgba(30,58,138,0.2)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 16, padding: '16px', marginBottom: 18 },
  closeModalBtn: { width: '100%', padding: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#94a3b8', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
};
