import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../components/Sidebar';
import {
  ClipboardList, Plus, RefreshCw, Loader2, X, Edit2, Eye,
  ToggleLeft, ToggleRight, Clock, Award, Target, Search
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getCampaignTasks, createCampaignTask, updateCampaignTask, updateCampaignTaskStatus, getCampaigns } from '../../services/api';

const EMPTY_FORM = {
  title: '', description: '', instructions: '', category: 'Business',
  duration: 60, maxMarks: 100,
  targetType: 'ALL', targetDepartment: '', targetYear: '', targetClass: '', targetCampaignId: '',
  isActive: true,
};

const CATEGORIES = ['Business', 'Technology', 'General', 'Analytical', 'Creative'];
const YEARS = ['I', 'II', 'III', 'IV', 'V'];
const CLASSES = ['8th', '9th', '10th', '11th', '12th'];
const TARGET_TYPES = ['ALL', 'BY_YEAR', 'BY_CLASS', 'BY_DEPARTMENT', 'BY_CAMPAIGN'];

export default function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCampaignTasks();
      setTasks(res?.data?.tasks || res?.data || (Array.isArray(res) ? res : []));
    } catch { toast.error('Failed to load tasks'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    getCampaigns().then((r) => setCampaigns(r?.data?.campaigns || r?.data || [])).catch(() => {});
  }, []);

  const setF = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const openCreate = () => { setEditTask(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (t) => {
    setEditTask(t);
    setForm({
      title: t.title || '', description: t.description || '', instructions: t.instructions || '',
      category: t.category || 'Business', duration: t.duration || 60, maxMarks: t.maxMarks || 100,
      targetType: t.targetType || 'ALL', targetDepartment: t.targetDepartment || '',
      targetYear: t.targetYear || '', targetClass: t.targetClass || '',
      targetCampaignId: t.targetCampaignId || '', isActive: t.isActive ?? true,
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Task title required'); return; }
    setSaving(true);
    try {
      const payload = { ...form, duration: Number(form.duration), maxMarks: Number(form.maxMarks) };
      if (editTask) {
        await updateCampaignTask(editTask._id, payload);
        toast.success('Task updated!');
      } else {
        await createCampaignTask(payload);
        toast.success('Task created!');
      }
      setShowModal(false);
      load();
    } catch (err) { toast.error(err?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const toggleStatus = async (t) => {
    try {
      await updateCampaignTaskStatus(t._id, { isActive: !t.isActive });
      toast.success(`Task ${!t.isActive ? 'activated' : 'deactivated'}`);
      load();
    } catch { toast.error('Failed to update status'); }
  };

  const filtered = tasks.filter((t) => !search || t.title?.toLowerCase().includes(search.toLowerCase()));

  const targetLabel = (t) => {
    if (t.targetType === 'ALL') return 'All Students';
    if (t.targetType === 'BY_CAMPAIGN') return `Campaign: ${t.targetCampaignId || '—'}`;
    if (t.targetType === 'BY_YEAR') return `Year: ${t.targetYear || '—'}`;
    if (t.targetType === 'BY_CLASS') return `Class: ${t.targetClass || '—'}`;
    if (t.targetType === 'BY_DEPARTMENT') return `Dept: ${t.targetDepartment || '—'}`;
    return t.targetType;
  };

  return (
    <div style={S.layout}>
      <Sidebar />
      <main style={S.main}>
        {/* Header */}
        <div style={S.header}>
          <div>
            <h1 style={S.pageTitle}><ClipboardList style={{ width: 22, height: 22, color: '#60a5fa', verticalAlign: 'middle', marginRight: 8 }} />Tasks</h1>
            <p style={S.pageSubtitle}>Create and manage assessment tasks for campaign students.</p>
          </div>
          <div style={S.headerActions}>
            <button style={S.refreshBtn} onClick={load}><RefreshCw style={{ width: 14, height: 14 }} /></button>
            <button id="btn-create-task" style={S.primaryBtn} onClick={openCreate}><Plus style={{ width: 14, height: 14 }} /> New Task</button>
          </div>
        </div>

        {/* Search */}
        <div style={S.searchWrap}>
          <Search style={S.searchIcon} />
          <input style={S.searchInput} placeholder="Search tasks…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {/* Task Cards Grid */}
        {loading ? (
          <div style={S.center}><Loader2 style={{ width: 36, height: 36, color: '#60a5fa', animation: 'spin 1s linear infinite' }} /></div>
        ) : filtered.length === 0 ? (
          <div style={S.center}><ClipboardList style={{ width: 40, height: 40, color: '#334155' }} /><p style={{ color: '#475569', marginTop: 10 }}>No tasks yet. Create your first task.</p></div>
        ) : (
          <div style={S.grid}>
            {filtered.map((t) => (
              <div key={t._id} style={S.taskCard}>
                <div style={S.cardTop}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={S.catBadge}>{t.category}</span>
                    <button style={{ ...S.toggleBtn, color: t.isActive ? '#22c55e' : '#64748b' }} onClick={() => toggleStatus(t)}>
                      {t.isActive ? <ToggleRight style={{ width: 20, height: 20, color: '#22c55e' }} /> : <ToggleLeft style={{ width: 20, height: 20 }} />}
                    </button>
                  </div>
                  <button style={S.editBtn} onClick={() => openEdit(t)}><Edit2 style={{ width: 14, height: 14 }} /></button>
                </div>
                <h3 style={S.cardTitle}>{t.title}</h3>
                <p style={S.cardDesc}>{t.description?.slice(0, 100)}{t.description?.length > 100 ? '…' : ''}</p>
                <div style={S.cardMeta}>
                  <div style={S.metaItem}><Clock style={{ width: 12, height: 12, color: '#60a5fa' }} />{t.duration} min</div>
                  <div style={S.metaItem}><Award style={{ width: 12, height: 12, color: '#f3a812' }} />{t.maxMarks} marks</div>
                  <div style={S.metaItem}><Target style={{ width: 12, height: 12, color: '#22c55e' }} />{targetLabel(t)}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Modal */}
        {showModal && (
          <div style={S.overlay}>
            <div style={S.modal}>
              <div style={S.modalHeader}>
                <h3 style={S.modalTitle}><ClipboardList style={{ width: 16, height: 16, color: '#60a5fa' }} /> {editTask ? 'Edit Task' : 'New Task'}</h3>
                <button style={S.closeBtn} onClick={() => setShowModal(false)}><X style={{ width: 18, height: 18 }} /></button>
              </div>
              <form onSubmit={handleSave} style={S.formWrap}>
                {/* Row 1 */}
                <div style={S.row}>
                  <MField label="Task Title" required flex={3}>
                    <input style={mi()} placeholder="Business Case Study Analysis" value={form.title} onChange={(e) => setF('title', e.target.value)} />
                  </MField>
                  <MField label="Category" flex={2}>
                    <select style={mi()} value={form.category} onChange={(e) => setF('category', e.target.value)}>
                      {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </MField>
                </div>
                {/* Description */}
                <MField label="Description">
                  <textarea style={{ ...mi(), minHeight: 72, resize: 'vertical' }} placeholder="Brief overview of the task…" value={form.description} onChange={(e) => setF('description', e.target.value)} />
                </MField>
                {/* Instructions */}
                <MField label="Instructions">
                  <textarea style={{ ...mi(), minHeight: 90, resize: 'vertical' }} placeholder={'1. Read the case study.\n2. Write clearly.\n3. Do not leave the browser.'} value={form.instructions} onChange={(e) => setF('instructions', e.target.value)} />
                </MField>
                {/* Duration + Marks */}
                <div style={S.row}>
                  <MField label="Duration (minutes)" flex={1}>
                    <input type="number" min="1" max="240" style={mi()} value={form.duration} onChange={(e) => setF('duration', e.target.value)} />
                  </MField>
                  <MField label="Max Marks" flex={1}>
                    <input type="number" min="1" style={mi()} value={form.maxMarks} onChange={(e) => setF('maxMarks', e.target.value)} />
                  </MField>
                </div>
                {/* Target */}
                <MField label="Target Audience">
                  <select style={mi()} value={form.targetType} onChange={(e) => setF('targetType', e.target.value)}>
                    {TARGET_TYPES.map((tt) => <option key={tt} value={tt}>{tt}</option>)}
                  </select>
                </MField>
                {form.targetType === 'BY_CAMPAIGN' && (
                  <MField label="Target Campaign">
                    <select style={mi()} value={form.targetCampaignId} onChange={(e) => setF('targetCampaignId', e.target.value)}>
                      <option value="">Select campaign</option>
                      {campaigns.map((c) => <option key={c._id} value={c.campaignId}>{c.name} ({c.campaignId})</option>)}
                    </select>
                  </MField>
                )}
                {form.targetType === 'BY_YEAR' && (
                  <MField label="Target Year">
                    <select style={mi()} value={form.targetYear} onChange={(e) => setF('targetYear', e.target.value)}>
                      <option value="">Select year</option>
                      {YEARS.map((y) => <option key={y}>{y}</option>)}
                    </select>
                  </MField>
                )}
                {form.targetType === 'BY_CLASS' && (
                  <MField label="Target Class">
                    <select style={mi()} value={form.targetClass} onChange={(e) => setF('targetClass', e.target.value)}>
                      <option value="">Select class</option>
                      {CLASSES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </MField>
                )}
                {form.targetType === 'BY_DEPARTMENT' && (
                  <MField label="Target Department">
                    <input style={mi()} placeholder="Computer Science" value={form.targetDepartment} onChange={(e) => setF('targetDepartment', e.target.value)} />
                  </MField>
                )}
                {/* Active */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" id="task-active" checked={form.isActive} onChange={(e) => setF('isActive', e.target.checked)} style={{ accentColor: '#3b82f6', width: 15, height: 15 }} />
                  <label htmlFor="task-active" style={{ color: '#94a3b8', fontSize: 13 }}>Active (students can attempt this task)</label>
                </div>
                {/* Buttons */}
                <div style={S.row}>
                  <button type="button" style={S.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" style={S.saveBtn} disabled={saving}>
                    {saving ? <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} /> : null}
                    {saving ? 'Saving…' : editTask ? 'Update Task' : 'Create Task'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } } select option { background: #1e293b; color: #f1f5f9; } textarea { font-family: 'Inter', sans-serif; }`}</style>
      </main>
    </div>
  );
}

function MField({ label, required, flex = 1, children }) {
  return (
    <div style={{ flex, display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600 }}>{label}{required && <span style={{ color: '#f87171' }}> *</span>}</label>
      {children}
    </div>
  );
}

const mi = () => ({
  width: '100%', padding: '9px 12px',
  background: 'rgba(255,255,255,0.05)',
  border: '1.5px solid rgba(255,255,255,0.12)',
  borderRadius: 10, color: '#f1f5f9', fontSize: 13,
  outline: 'none', boxSizing: 'border-box', fontFamily: "'Inter', sans-serif",
});

const S = {
  layout: { display: 'flex', minHeight: '100vh', background: '#060f1e', fontFamily: "'Inter', sans-serif" },
  main: { flex: 1, padding: '28px 32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 },
  pageTitle: { color: '#f1f5f9', fontSize: 22, fontWeight: 800, margin: 0 },
  pageSubtitle: { color: '#475569', fontSize: 13, margin: '4px 0 0' },
  headerActions: { display: 'flex', gap: 10, alignItems: 'center' },
  refreshBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#94a3b8', cursor: 'pointer' },
  primaryBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', background: 'linear-gradient(135deg, #104288, #1d4ed8)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' },
  searchWrap: { position: 'relative', maxWidth: 360 },
  searchIcon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: '#475569' },
  searchInput: { width: '100%', padding: '9px 12px 9px 36px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f1f5f9', fontSize: 13, outline: 'none', boxSizing: 'border-box' },
  center: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 60 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 },
  taskCard: { background: 'rgba(15,23,42,0.8)', border: '1.5px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '20px', display: 'flex', flexDirection: 'column', gap: 10, transition: 'border-color 0.2s' },
  cardTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  catBadge: { background: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 },
  toggleBtn: { background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  editBtn: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardTitle: { color: '#f1f5f9', fontSize: 15, fontWeight: 700, margin: 0, lineHeight: 1.3 },
  cardDesc: { color: '#64748b', fontSize: 12, lineHeight: 1.6, margin: 0, flex: 1 },
  cardMeta: { display: 'flex', gap: 14, flexWrap: 'wrap', paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.05)' },
  metaItem: { display: 'flex', alignItems: 'center', gap: 5, color: '#64748b', fontSize: 12 },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20, overflowY: 'auto' },
  modal: { background: '#0f172a', border: '1.5px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: '28px', width: '100%', maxWidth: 600, boxShadow: '0 32px 80px rgba(0,0,0,0.6)', maxHeight: '90vh', overflowY: 'auto' },
  modalHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  modalTitle: { color: '#f1f5f9', fontSize: 17, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 8 },
  closeBtn: { background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' },
  formWrap: { display: 'flex', flexDirection: 'column', gap: 14 },
  row: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  cancelBtn: { flex: 1, padding: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#94a3b8', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  saveBtn: { flex: 2, padding: '10px', background: 'linear-gradient(135deg, #104288, #1d4ed8)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 },
};
