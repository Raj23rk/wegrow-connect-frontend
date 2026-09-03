import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../components/Sidebar';
import {
  FileText, Eye, X, Loader2, RefreshCw, Star, CheckCircle2, Gift,
  AlertTriangle, Clock, User, ClipboardList, Award, Search, ChevronLeft, ChevronRight, Send
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getSubmissions, getSubmissionById, evaluateSubmission, sendSubmissionOffer } from '../../services/api';

const EVENT_LABELS = {
  TAB_SWITCH: { label: 'Tab Switch', color: '#f87171' },
  KEY_BLOCK: { label: 'Key Block', color: '#fbbf24' },
  WINDOW_BLUR: { label: 'Window Blur', color: '#fb923c' },
  COPY_ATTEMPT: { label: 'Copy Attempt', color: '#f87171' },
};

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');

  // Eval form
  const [score, setScore] = useState('');
  const [remarks, setRemarks] = useState('');
  const [selected, setSelected] = useState(false);
  const [sendingOfferId, setSendingOfferId] = useState(null);

  const handleSendGiftOffer = async (subId, customMsg) => {
    setSendingOfferId(subId);
    try {
      const res = await sendSubmissionOffer(subId, customMsg);
      toast.success(res?.message || 'Branch gift offer email sent to student!');
      load();
    } catch (err) {
      toast.error(err?.message || 'Failed to send offer email');
    } finally {
      setSendingOfferId(null);
    }
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (search) params.search = search;
      const res = await getSubmissions(params);
      const data = res?.data;
      setSubmissions(data?.submissions || data?.data || (Array.isArray(data) ? data : []));
      setTotalPages(data?.pagination?.totalPages || data?.totalPages || 1);
      setTotalCount(data?.pagination?.total || data?.total || 0);
    } catch { toast.error('Failed to load submissions'); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const handleView = async (id) => {
    setLoadingDetail(true);
    try {
      const res = await getSubmissionById(id);
      const sub = res?.data?.submission || res?.data || res;
      setViewing(sub);
      setScore(sub.score !== undefined && sub.score !== null ? String(sub.score) : '');
      setRemarks(sub.remarks || '');
      setSelected(sub.isSelected || false);
    } catch { toast.error('Failed to load submission details'); }
    finally { setLoadingDetail(false); }
  };

  const handleEvaluate = async () => {
    if (score === '' || isNaN(Number(score))) { toast.error('Enter a valid score'); return; }
    setEvaluating(true);
    try {
      await evaluateSubmission(viewing._id, {
        score: Number(score),
        remarks: remarks.trim(),
        isSelected: selected,
      });
      toast.success('Evaluation saved!');
      setViewing(null);
      load();
    } catch (err) { toast.error(err?.message || 'Evaluation failed'); }
    finally { setEvaluating(false); }
  };

  const statusColor = (s) => {
    if (s === 'EVALUATED') return '#22c55e';
    if (s === 'SUBMITTED') return '#60a5fa';
    if (s === 'AUTO_SUBMITTED') return '#f87171';
    return '#64748b';
  };

  const violationCount = (events) => {
    if (!Array.isArray(events)) return 0;
    return events.filter((e) => ['TAB_SWITCH', 'KEY_BLOCK', 'WINDOW_BLUR'].includes(e.eventType)).length;
  };

  return (
    <div style={S.layout}>
      <Sidebar />
      <main style={S.main}>
        {/* Header */}
        <div style={S.header}>
          <div>
            <h1 style={S.pageTitle}><FileText style={{ width: 22, height: 22, color: '#60a5fa', verticalAlign: 'middle', marginRight: 8 }} />Submissions & Evaluation</h1>
            <p style={S.pageSubtitle}>{totalCount} total submissions from campaign tasks</p>
          </div>
          <div style={S.headerActions}>
            <button style={S.refreshBtn} onClick={load}><RefreshCw style={{ width: 14, height: 14 }} /></button>
          </div>
        </div>

        {/* Search */}
        <div style={S.searchWrap}>
          <Search style={S.searchIcon} />
          <input style={S.searchInput} placeholder="Search submissions…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>

        {/* Table */}
        <div style={S.tableWrap}>
          {loading ? (
            <div style={S.center}><Loader2 style={{ width: 36, height: 36, color: '#60a5fa', animation: 'spin 1s linear infinite' }} /></div>
          ) : submissions.length === 0 ? (
            <div style={S.center}><FileText style={{ width: 40, height: 40, color: '#334155' }} /><p style={{ color: '#475569', marginTop: 10 }}>No submissions yet</p></div>
          ) : (
            <table style={S.table}>
              <thead>
                <tr>{['Student', 'Task', 'Status', 'Score', 'Violations', 'Submitted', 'Selected', 'Action'].map((h) => (
                  <th key={h} style={S.th}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {submissions.map((sub) => {
                  const violations = violationCount(sub.events || sub.session?.events);
                  return (
                    <tr key={sub._id} style={S.tr}>
                      <td style={S.td}>
                        <div style={S.stuName}>{sub.studentId?.name || sub.student?.name || sub.studentId?.studentId || '—'}</div>
                        <div style={{ color: '#64748b', fontSize: 11 }}>{sub.studentId?.email || sub.student?.email || ''}</div>
                      </td>
                      <td style={S.td}><span style={{ color: '#94a3b8', fontSize: 12 }}>{sub.taskId?.title || sub.task?.title || '—'}</span></td>
                      <td style={S.td}>
                        <span style={{ ...S.statusBadge, color: statusColor(sub.evaluationStatus || sub.status), borderColor: statusColor(sub.evaluationStatus || sub.status) + '44' }}>
                          {sub.evaluationStatus || sub.status || 'PENDING'}
                        </span>
                      </td>
                      <td style={S.td}>
                        {sub.score !== undefined && sub.score !== null
                          ? <span style={S.scoreBadge}>{sub.score} / {sub.taskId?.maxMarks || sub.task?.maxMarks || 100}</span>
                          : <span style={{ color: '#64748b', fontSize: 12 }}>Not graded</span>
                        }
                      </td>
                      <td style={S.td}>
                        <span style={{ ...S.violBadge, color: violations > 0 ? '#f87171' : '#475569' }}>
                          {violations > 0 ? <AlertTriangle style={{ width: 12, height: 12 }} /> : null}
                          {violations}
                        </span>
                      </td>
                      <td style={S.td}><span style={{ color: '#475569', fontSize: 11 }}>{sub.submittedAt ? new Date(sub.submittedAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}</span></td>
                      <td style={S.td}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                          {(sub.isWinner || sub.selectedForOffer || sub.isSelected) ? (
                            <span style={S.winnerBadge}>
                              <Award style={{ width: 11, height: 11 }} /> Selected
                            </span>
                          ) : (
                            <span style={{ color: '#475569', fontSize: 11 }}>—</span>
                          )}
                          {sub.offerEmailSent && (
                            <span style={{ color: '#22c55e', fontSize: 10, display: 'flex', alignItems: 'center', gap: 3 }}>
                              <CheckCircle2 style={{ width: 10, height: 10 }} /> Offer Sent
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={S.td}>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <button id={`btn-evaluate-${sub._id}`} style={S.evalBtn} onClick={() => handleView(sub._id)} disabled={loadingDetail}>
                            <Eye style={{ width: 13, height: 13 }} /> {sub.evaluationStatus === 'EVALUATED' ? 'Review' : 'Grade'}
                          </button>
                          <button
                            style={sub.offerEmailSent ? S.offerSentBtn : S.sendOfferBtn}
                            onClick={() => handleSendGiftOffer(sub._id)}
                            disabled={sendingOfferId === sub._id}
                            title={sub.offerEmailSent ? 'Offer email already sent. Click to resend branch gift invitation' : 'Send branch invitation and gift offer email to student'}
                          >
                            {sendingOfferId === sub._id ? (
                              <Loader2 style={{ width: 12, height: 12, animation: 'spin 1s linear infinite' }} />
                            ) : (
                              <Gift style={{ width: 12, height: 12 }} />
                            )}
                            {sub.offerEmailSent ? 'Resend' : 'Offer'}
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
            <button style={S.pageBtn} disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}><ChevronLeft style={{ width: 14, height: 14 }} /></button>
            <span style={{ color: '#64748b', fontSize: 13 }}>Page {page} / {totalPages}</span>
            <button style={S.pageBtn} disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}><ChevronRight style={{ width: 14, height: 14 }} /></button>
          </div>
        )}

        {/* Evaluation Drawer/Modal */}
        {viewing && (
          <div style={S.overlay}>
            <div style={S.evalModal}>
              <div style={S.modalHeader}>
                <h3 style={S.modalTitle}><FileText style={{ width: 16, height: 16, color: '#60a5fa' }} /> Evaluate Submission</h3>
                <button style={S.closeBtn} onClick={() => setViewing(null)}><X style={{ width: 18, height: 18 }} /></button>
              </div>

              {/* Student + Task info */}
              <div style={S.infoGrid}>
                <InfoItem icon={User} label="Student" value={viewing.studentId?.name || viewing.student?.name || viewing.studentId} />
                <InfoItem icon={ClipboardList} label="Task" value={viewing.taskId?.title || viewing.task?.title || viewing.taskId} />
                <InfoItem icon={Clock} label="Submitted" value={viewing.submittedAt ? new Date(viewing.submittedAt).toLocaleString('en-IN') : '—'} />
                <InfoItem icon={Award} label="Max Marks" value={viewing.taskId?.maxMarks || viewing.task?.maxMarks || 100} />
              </div>

              {/* Cheating events */}
              {Array.isArray(viewing.events) && viewing.events.length > 0 && (
                <div style={S.eventsBox}>
                  <div style={S.eventsTitle}><AlertTriangle style={{ width: 13, height: 13, color: '#fbbf24' }} /> Anti-Cheat Events ({viewing.events.length})</div>
                  <div style={S.eventsList}>
                    {viewing.events.map((ev, i) => {
                      const evInfo = EVENT_LABELS[ev.eventType] || { label: ev.eventType, color: '#64748b' };
                      return (
                        <div key={i} style={S.eventRow}>
                          <span style={{ ...S.evBadge, color: evInfo.color, borderColor: evInfo.color + '44' }}>{evInfo.label}</span>
                          <span style={{ color: '#64748b', fontSize: 11 }}>{ev.details}</span>
                          <span style={{ color: '#334155', fontSize: 11, marginLeft: 'auto' }}>{ev.timestamp ? new Date(ev.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : ''}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Answer */}
              <div style={S.answerBox}>
                <div style={S.answerTitle}><FileText style={{ width: 13, height: 13, color: '#60a5fa' }} /> Student's Answer</div>
                <div style={S.answerContent}>{viewing.answer || viewing.session?.answer || '(No answer submitted)'}</div>
              </div>

              {/* Scoring */}
              <div style={S.scoringBox}>
                <div style={S.scoringTitle}><Star style={{ width: 13, height: 13, color: '#f3a812' }} /> Score & Remarks</div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 120 }}>
                    <label style={S.scoreLabel}>Score (out of {viewing.task?.maxMarks || 100})</label>
                    <input id="eval-score-input" type="number" min="0" max={viewing.task?.maxMarks || 100}
                      style={S.scoreInput} value={score} onChange={(e) => setScore(e.target.value)} placeholder="0" />
                  </div>
                  <div style={{ flex: 2 }}>
                    <label style={S.scoreLabel}>Remarks (optional)</label>
                    <input id="eval-remarks-input" type="text" style={S.scoreInput}
                      value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Good effort, but…" />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  <input type="checkbox" id="eval-selected" checked={selected} onChange={(e) => setSelected(e.target.checked)}
                    style={{ accentColor: '#22c55e', width: 15, height: 15, cursor: 'pointer' }} />
                  <label htmlFor="eval-selected" style={{ color: '#94a3b8', fontSize: 13, cursor: 'pointer' }}>
                    Mark as <strong style={{ color: '#22c55e' }}>Selected</strong> — send invitation email
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button style={S.cancelBtn} onClick={() => setViewing(null)}>Cancel</button>
                <button id="btn-save-evaluation" style={S.saveEvalBtn} onClick={handleEvaluate} disabled={evaluating}>
                  {evaluating ? <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} /> : <Send style={{ width: 14, height: 14 }} />}
                  {evaluating ? 'Saving…' : 'Save Evaluation'}
                </button>
                <button
                  style={S.offerActionBtn}
                  onClick={async () => {
                    await handleEvaluate();
                    if (viewing?._id) handleSendGiftOffer(viewing._id);
                  }}
                  disabled={evaluating || sendingOfferId === viewing?._id}
                  title="Save grade and email branch gift offer to student"
                >
                  <Gift style={{ width: 14, height: 14 }} /> Save & Send Offer
                </button>
              </div>
            </div>
          </div>
        )}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </main>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
      <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon style={{ width: 14, height: 14, color: '#60a5fa' }} />
      </div>
      <div>
        <div style={{ color: '#475569', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
        <div style={{ color: '#f1f5f9', fontSize: 13 }}>{value || '—'}</div>
      </div>
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
  searchWrap: { position: 'relative', maxWidth: 360 },
  searchIcon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: '#475569' },
  searchInput: { width: '100%', padding: '9px 12px 9px 36px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f1f5f9', fontSize: 13, outline: 'none', boxSizing: 'border-box' },
  tableWrap: { background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, overflow: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: 800 },
  th: { padding: '12px 14px', color: '#475569', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', whiteSpace: 'nowrap' },
  tr: { borderBottom: '1px solid rgba(255,255,255,0.04)' },
  td: { padding: '12px 14px', verticalAlign: 'middle' },
  stuName: { color: '#f1f5f9', fontWeight: 600, fontSize: 14 },
  statusBadge: { fontSize: 11, fontWeight: 700, border: '1px solid', borderRadius: 20, padding: '2px 9px', letterSpacing: 0.5 },
  scoreBadge: { background: 'rgba(243,168,18,0.1)', color: '#f3a812', border: '1px solid rgba(243,168,18,0.2)', borderRadius: 20, padding: '2px 9px', fontSize: 12, fontWeight: 600 },
  violBadge: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600 },
  evalBtn: { display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8, padding: '5px 9px', color: '#60a5fa', fontSize: 11, cursor: 'pointer', fontWeight: 600 },
  sendOfferBtn: { display: 'flex', alignItems: 'center', gap: 4, background: 'linear-gradient(135deg, rgba(243,168,18,0.2) 0%, rgba(245,158,11,0.3) 100%)', border: '1px solid #f3a812', borderRadius: 8, padding: '5px 9px', color: '#f3a812', fontSize: 11, fontWeight: 700, cursor: 'pointer' },
  offerSentBtn: { display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, padding: '5px 9px', color: '#22c55e', fontSize: 11, fontWeight: 600, cursor: 'pointer' },
  winnerBadge: { display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 20, padding: '2px 8px', color: '#22c55e', fontSize: 10, fontWeight: 700 },
  offerActionBtn: { padding: '10px 16px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none', borderRadius: 10, color: '#0f172a', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 },
  center: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 60 },
  pagination: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 },
  pageBtn: { display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 10px', color: '#94a3b8', cursor: 'pointer' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20, overflowY: 'auto' },
  evalModal: { background: '#0f172a', border: '1.5px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: '28px', width: '100%', maxWidth: 660, boxShadow: '0 32px 80px rgba(0,0,0,0.6)', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 18 },
  modalHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  modalTitle: { color: '#f1f5f9', fontSize: 17, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 8 },
  closeBtn: { background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '16px' },
  eventsBox: { background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.15)', borderRadius: 14, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 },
  autoGradingBox: { background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 14, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 },
  autoGradingTitle: { display: 'flex', alignItems: 'center', gap: 6, color: '#22c55e', fontSize: 13, fontWeight: 700 },
  qrRow: { background: 'rgba(255,255,255,0.02)', border: '1px solid', borderRadius: 8, padding: '8px 12px', display: 'flex', flexDirection: 'column' },
  eventsTitle: { display: 'flex', alignItems: 'center', gap: 6, color: '#fbbf24', fontSize: 12, fontWeight: 700 },
  eventsList: { display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 180, overflowY: 'auto' },
  eventRow: { display: 'flex', alignItems: 'center', gap: 8 },
  evBadge: { fontSize: 10, fontWeight: 700, border: '1px solid', borderRadius: 20, padding: '1px 7px', flexShrink: 0 },
  answerBox: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 },
  answerTitle: { display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 12, fontWeight: 700 },
  answerContent: { color: '#94a3b8', fontSize: 13, lineHeight: 1.7, whiteSpace: 'pre-wrap', maxHeight: 220, overflowY: 'auto' },
  scoringBox: { background: 'rgba(243,168,18,0.05)', border: '1px solid rgba(243,168,18,0.15)', borderRadius: 14, padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 },
  scoringTitle: { display: 'flex', alignItems: 'center', gap: 6, color: '#f3a812', fontSize: 12, fontWeight: 700 },
  scoreLabel: { color: '#64748b', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 },
  scoreInput: { width: '100%', padding: '9px 12px', background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#f1f5f9', fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: "'Inter', sans-serif" },
  cancelBtn: { flex: 1, padding: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#94a3b8', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  saveEvalBtn: { flex: 2, padding: '10px', background: 'linear-gradient(135deg, #104288, #1d4ed8)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 },
};
