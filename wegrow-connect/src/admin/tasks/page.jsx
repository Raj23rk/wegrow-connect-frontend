import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from '../../components/Sidebar';
import {
  ClipboardList, Plus, RefreshCw, Loader2, X, Edit2, Eye,
  ToggleLeft, ToggleRight, Clock, Award, Target, Search,
  FileQuestion, Upload, CheckCircle2, AlertCircle, Trash2,
  FileCode, Layers, HelpCircle, ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getCampaignTasks,
  createCampaignTask,
  updateCampaignTask,
  updateCampaignTaskStatus,
  getCampaigns,
  uploadTaskQuestions,
  uploadTaskAnswerKey
} from '../../services/api';

const EMPTY_FORM = {
  title: '',
  description: '',
  instructions: '',
  category: 'Business',
  duration: 60,
  maxMarks: 100,
  targetType: 'ALL',
  targetDepartment: '',
  targetYear: '',
  targetClass: '',
  targetCampaignId: '',
  isActive: true,
  questions: [],
  answerKey: [],
};

const CATEGORIES = ['Business', 'Technology', 'General', 'Analytical', 'Creative'];
const YEARS = ['I', 'II', 'III', 'IV', 'V'];
const CLASSES = ['8th', '9th', '10th', '11th', '12th'];
const TARGET_TYPES = ['ALL', 'BY_YEAR', 'BY_CLASS', 'BY_DEPARTMENT', 'BY_CAMPAIGN'];

const SAMPLE_QUESTIONS = [
  {
    id: 'q1',
    question: 'What is the primary benefit of market segmentation for an early-stage startup?',
    type: 'MCQ',
    options: [
      'Reduces manufacturing and hardware expenditure',
      'Allows precise focus on specific high-converting customer needs',
      'Eliminates all direct market competition',
      'Guarantees immediate investor funding'
    ],
    marks: 10,
    correctAnswer: 'Allows precise focus on specific high-converting customer needs'
  },
  {
    id: 'q2',
    question: 'Which financial indicator represents the time required to recover an investment outlay?',
    type: 'MCQ',
    options: [
      'Net Present Value (NPV)',
      'Payback Period',
      'Customer Acquisition Cost (CAC)',
      'Gross Profit Margin'
    ],
    marks: 10,
    correctAnswer: 'Payback Period'
  }
];

export default function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  // Questions & Answer Key Dedicated Modal
  const [qTask, setQTask] = useState(null);
  const [qTab, setQTab] = useState('visual'); // 'visual' | 'upload_file' | 'raw_json' | 'answer_key'
  const [questionsList, setQuestionsList] = useState([]);
  const [answerKeyList, setAnswerKeyList] = useState([]);
  const [rawQuestionsJson, setRawQuestionsJson] = useState('');
  const [rawAnswersJson, setRawAnswersJson] = useState('');
  const [savingQA, setSavingQA] = useState(false);

  // File input ref for quick JSON file upload
  const fileInputRef = useRef(null);
  const modalFileInputRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCampaignTasks();
      setTasks(res?.data?.tasks || res?.data || (Array.isArray(res) ? res : []));
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    getCampaigns().then((r) => setCampaigns(r?.data?.campaigns || r?.data || [])).catch(() => {});
  }, []);

  const setF = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const openCreate = () => {
    setEditTask(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (t) => {
    setEditTask(t);
    setForm({
      title: t.title || '',
      description: t.description || '',
      instructions: t.instructions || '',
      category: t.category || 'Business',
      duration: t.duration || 60,
      maxMarks: t.maxMarks || 100,
      targetType: t.targetType || 'ALL',
      targetDepartment: t.targetDepartment || '',
      targetYear: t.targetYear || '',
      targetClass: t.targetClass || '',
      targetCampaignId: t.targetCampaignId || '',
      isActive: t.isActive ?? true,
      questions: Array.isArray(t.questions) ? t.questions : [],
      answerKey: Array.isArray(t.answerKey) ? t.answerKey : [],
    });
    setShowModal(true);
  };

  // ── Open Dedicated Questions Management Modal ────────────────
  const openQAModal = (t) => {
    setQTask(t);
    const qs = Array.isArray(t.questions) && t.questions.length > 0 ? t.questions : [
      { id: 'q1', question: '', type: 'MCQ', options: ['', '', '', ''], marks: 10 }
    ];
    setQuestionsList(qs);
    setAnswerKeyList(Array.isArray(t.answerKey) ? t.answerKey : []);
    setRawQuestionsJson(JSON.stringify(qs, null, 2));
    setRawAnswersJson(JSON.stringify(Array.isArray(t.answerKey) ? t.answerKey : [], null, 2));
    setQTab('visual');
  };

  const addQuestionRow = () => {
    const nextId = 'q' + (questionsList.length + 1);
    setQuestionsList([
      ...questionsList,
      { id: nextId, question: '', type: 'MCQ', options: ['', '', '', ''], marks: 10 }
    ]);
  };

  const removeQuestionRow = (idx) => {
    const updated = questionsList.filter((_, i) => i !== idx);
    setQuestionsList(updated);
  };

  const updateQuestionText = (idx, val) => {
    const updated = [...questionsList];
    updated[idx].question = val;
    setQuestionsList(updated);
  };

  const updateOptionText = (qIdx, optIdx, val) => {
    const updated = [...questionsList];
    const opts = [...(updated[qIdx].options || ['', '', '', ''])];
    opts[optIdx] = val;
    updated[qIdx].options = opts;
    setQuestionsList(updated);
  };

  const updateQuestionMarks = (idx, val) => {
    const updated = [...questionsList];
    updated[idx].marks = Number(val) || 1;
    setQuestionsList(updated);
  };

  const getCorrectAnswerForQ = (qId) => {
    const found = answerKeyList.find(a => String(a.questionId) === String(qId));
    return found ? found.correctAnswer : '';
  };

  const setCorrectAnswerForQ = (qId, answerVal, marksVal = 10) => {
    const existingIdx = answerKeyList.findIndex(a => String(a.questionId) === String(qId));
    if (existingIdx >= 0) {
      const updated = [...answerKeyList];
      updated[existingIdx] = { ...updated[existingIdx], correctAnswer: answerVal };
      setAnswerKeyList(updated);
    } else {
      setAnswerKeyList([...answerKeyList, { questionId: qId, correctAnswer: answerVal, marks: marksVal }]);
    }
  };

  // ── Save Visual Q&A ─────────────────────────────────────────
  const handleSaveVisualQA = async () => {
    if (!qTask?._id) return;
    setSavingQA(true);
    try {
      await uploadTaskQuestions(qTask._id, questionsList);
      if (answerKeyList.length > 0) {
        await uploadTaskAnswerKey(qTask._id, answerKeyList);
      }
      toast.success('Questions and Answer Key saved successfully!');
      setQTask(null);
      load();
    } catch (err) {
      toast.error(err?.message || 'Failed to save questions');
    } finally {
      setSavingQA(false);
    }
  };

  // ── Upload Questions via JSON String ─────────────────────────
  const handleUploadQuestionsJson = async (customJson) => {
    if (!qTask?._id) return;
    const jsonToParse = customJson || rawQuestionsJson;
    try {
      const parsed = JSON.parse(jsonToParse);
      if (!Array.isArray(parsed)) throw new Error('Questions must be a JSON array of question objects');
      setSavingQA(true);
      await uploadTaskQuestions(qTask._id, parsed);
      
      // If questions have embedded correctAnswer, extract answer key automatically
      const autoKeys = [];
      parsed.forEach((q) => {
        if (q.id && q.correctAnswer) {
          autoKeys.push({ questionId: q.id, correctAnswer: q.correctAnswer, marks: q.marks || 10 });
        }
      });
      if (autoKeys.length > 0) {
        await uploadTaskAnswerKey(qTask._id, autoKeys);
      }

      toast.success(`Successfully uploaded ${parsed.length} questions!`);
      setQTask(null);
      load();
    } catch (err) {
      toast.error(err?.message || 'Invalid JSON format. Check syntax.');
    } finally {
      setSavingQA(false);
    }
  };

  // ── Handle JSON File Upload From Disk (Dedicated Modal) ──────
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) throw new Error('File content must be a JSON array of questions');
        setQuestionsList(parsed);
        setRawQuestionsJson(JSON.stringify(parsed, null, 2));

        // Auto extract answer key if present
        const autoKeys = [];
        parsed.forEach((q) => {
          if (q.id && q.correctAnswer) {
            autoKeys.push({ questionId: q.id, correctAnswer: q.correctAnswer, marks: q.marks || 10 });
          }
        });
        if (autoKeys.length > 0) {
          setAnswerKeyList(autoKeys);
          setRawAnswersJson(JSON.stringify(autoKeys, null, 2));
        }

        toast.success(`Parsed ${parsed.length} questions from ${file.name}! Review or click Save.`);
      } catch (err) {
        toast.error(err?.message || 'Could not parse JSON file');
      }
    };
    reader.readAsText(file);
  };

  // ── Handle JSON File Upload inside New Task / Edit Modal ──────
  const handleModalFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) throw new Error('File content must be a JSON array of questions');
        
        const autoKeys = [];
        parsed.forEach((q) => {
          if (q.id && q.correctAnswer) {
            autoKeys.push({ questionId: q.id, correctAnswer: q.correctAnswer, marks: q.marks || 10 });
          }
        });

        setForm((prev) => ({
          ...prev,
          questions: parsed,
          answerKey: autoKeys.length > 0 ? autoKeys : prev.answerKey,
        }));

        toast.success(`Loaded ${parsed.length} questions from ${file.name}!`);
      } catch (err) {
        toast.error(err?.message || 'Could not parse JSON file');
      }
    };
    reader.readAsText(file);
  };

  // ── Upload Answers JSON ─────────────────────────────────────
  const handleUploadAnswersJson = async () => {
    if (!qTask?._id) return;
    try {
      const parsed = JSON.parse(rawAnswersJson);
      if (!Array.isArray(parsed)) throw new Error('Answer Key must be a JSON array');
      setSavingQA(true);
      await uploadTaskAnswerKey(qTask._id, parsed);
      toast.success(`Uploaded ${parsed.length} answer keys!`);
      setQTask(null);
      load();
    } catch (err) {
      toast.error(err?.message || 'Invalid JSON format');
    } finally {
      setSavingQA(false);
    }
  };

  // ── Save Task (Create or Update) ────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Task title is required'); return; }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        instructions: form.instructions.trim(),
        category: form.category,
        duration: Number(form.duration) || 60,
        maxMarks: Number(form.maxMarks) || 100,
        targetType: form.targetType,
        targetDepartment: form.targetType === 'BY_DEPARTMENT' ? form.targetDepartment : undefined,
        targetYear: form.targetType === 'BY_YEAR' ? form.targetYear : undefined,
        targetClass: form.targetType === 'BY_CLASS' ? form.targetClass : undefined,
        targetCampaignId: form.targetType === 'BY_CAMPAIGN' ? form.targetCampaignId : undefined,
        isActive: form.isActive,
        questions: form.questions || [],
        answerKey: form.answerKey || [],
      };

      if (editTask) {
        await updateCampaignTask(editTask._id, payload);
        toast.success('Task updated successfully!');
      } else {
        await createCampaignTask(payload);
        toast.success('Task created successfully with questions!');
      }
      setShowModal(false);
      load();
    } catch (err) {
      toast.error(err?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (t) => {
    try {
      await updateCampaignTaskStatus(t._id, { isActive: !t.isActive });
      toast.success(`Task ${!t.isActive ? 'activated' : 'deactivated'}`);
      load();
    } catch {
      toast.error('Failed to update status');
    }
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
            <h1 style={S.pageTitle}>
              <ClipboardList style={{ width: 22, height: 22, color: '#60a5fa', verticalAlign: 'middle', marginRight: 8 }} />
              Assessment Tasks & Questions
            </h1>
            <p style={S.pageSubtitle}>Create tasks, upload MCQ / subjective question papers, and manage answer keys.</p>
          </div>
          <div style={S.headerActions}>
            <button style={S.refreshBtn} onClick={load} title="Refresh tasks">
              <RefreshCw style={{ width: 14, height: 14 }} />
            </button>
            <button id="btn-create-task" style={S.primaryBtn} onClick={openCreate}>
              <Plus style={{ width: 15, height: 15 }} /> New Task
            </button>
          </div>
        </div>

        {/* Search */}
        <div style={S.searchWrap}>
          <Search style={S.searchIcon} />
          <input
            style={S.searchInput}
            placeholder="Search tasks by title, category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Task Cards Grid */}
        {loading ? (
          <div style={S.center}>
            <Loader2 style={{ width: 36, height: 36, color: '#60a5fa', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={S.center}>
            <ClipboardList style={{ width: 44, height: 44, color: '#334155' }} />
            <p style={{ color: '#64748b', marginTop: 12, fontWeight: 600 }}>No tasks found. Click "+ New Task" to create your first task with questions.</p>
          </div>
        ) : (
          <div style={S.grid}>
            {filtered.map((t) => {
              const qCount = Array.isArray(t.questions) ? t.questions.length : 0;
              const hasAnswerKey = Array.isArray(t.answerKey) && t.answerKey.length > 0;

              return (
                <div key={t._id} style={S.taskCard}>
                  <div style={S.cardTop}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={S.catBadge}>{t.category}</span>
                      <button
                        style={{ ...S.toggleBtn, color: t.isActive ? '#22c55e' : '#64748b' }}
                        onClick={() => toggleStatus(t)}
                        title={t.isActive ? 'Active (Click to deactivate)' : 'Inactive (Click to activate)'}
                      >
                        {t.isActive ? <ToggleRight style={{ width: 22, height: 22, color: '#22c55e' }} /> : <ToggleLeft style={{ width: 22, height: 22 }} />}
                      </button>
                    </div>
                    <button style={S.editBtn} onClick={() => openEdit(t)} title="Edit task details">
                      <Edit2 style={{ width: 14, height: 14 }} />
                    </button>
                  </div>

                  <h3 style={S.cardTitle}>{t.title}</h3>
                  <p style={S.cardDesc}>{t.description?.slice(0, 110)}{t.description?.length > 110 ? '…' : ''}</p>

                  <div style={S.cardMeta}>
                    <div style={S.metaItem}><Clock style={{ width: 12, height: 12, color: '#60a5fa' }} />{t.duration} min</div>
                    <div style={S.metaItem}><Award style={{ width: 12, height: 12, color: '#f3a812' }} />{t.maxMarks} marks</div>
                    <div style={S.metaItem}><Target style={{ width: 12, height: 12, color: '#22c55e' }} />{targetLabel(t)}</div>
                  </div>

                  {/* Questions Management CTA Row on Card */}
                  <div style={S.cardQuestionsBar}>
                    <button
                      style={qCount > 0 ? S.manageQBtn : S.emptyQBtn}
                      onClick={() => openQAModal(t)}
                      title="Upload or edit questions for this task"
                    >
                      <FileQuestion style={{ width: 13, height: 13 }} />
                      <span>{qCount > 0 ? `${qCount} Questions Uploaded` : '+ Upload Questions'}</span>
                    </button>

                    {hasAnswerKey && (
                      <span style={S.autoGradedBadge} title="Answer key configured for automated grading">
                        <CheckCircle2 style={{ width: 10, height: 10 }} /> Auto-Graded
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* =============================================================
            1. CREATE / EDIT TASK MODAL (With Integrated Question Upload)
        ============================================================= */}
        {showModal && (
          <div style={S.overlay} onClick={() => setShowModal(false)}>
            <div style={S.modal} onClick={(e) => e.stopPropagation()}>
              <div style={S.modalHeader}>
                <h3 style={S.modalTitle}>
                  <ClipboardList style={{ width: 18, height: 18, color: '#60a5fa' }} /> 
                  {editTask ? 'Edit Assessment Task' : 'Create New Assessment Task'}
                </h3>
                <button style={S.closeBtn} onClick={() => setShowModal(false)}>
                  <X style={{ width: 18, height: 18 }} />
                </button>
              </div>

              <form onSubmit={handleSave} style={S.formWrap}>
                {/* Row 1: Title & Category */}
                <div style={S.row}>
                  <MField label="Task Title" required flex={3}>
                    <input
                      style={mi()}
                      placeholder="e.g. Business Case Study Analysis"
                      value={form.title}
                      onChange={(e) => setF('title', e.target.value)}
                    />
                  </MField>
                  <MField label="Category" flex={2}>
                    <select style={mi()} value={form.category} onChange={(e) => setF('category', e.target.value)}>
                      {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </MField>
                </div>

                {/* Description */}
                <MField label="Description">
                  <textarea
                    style={{ ...mi(), minHeight: 65, resize: 'vertical' }}
                    placeholder="Brief overview of the assessment topic and learning objectives…"
                    value={form.description}
                    onChange={(e) => setF('description', e.target.value)}
                  />
                </MField>

                {/* Instructions */}
                <MField label="Instructions">
                  <textarea
                    style={{ ...mi(), minHeight: 75, resize: 'vertical' }}
                    placeholder={'1. Read the case study.\n2. Write clearly.\n3. Do not leave the browser.'}
                    value={form.instructions}
                    onChange={(e) => setF('instructions', e.target.value)}
                  />
                </MField>

                {/* Duration + Marks */}
                <div style={S.row}>
                  <MField label="Duration (minutes)" flex={1}>
                    <input
                      type="number"
                      min="1"
                      max="240"
                      style={mi()}
                      value={form.duration}
                      onChange={(e) => setF('duration', e.target.value)}
                    />
                  </MField>
                  <MField label="Max Marks" flex={1}>
                    <input
                      type="number"
                      min="1"
                      style={mi()}
                      value={form.maxMarks}
                      onChange={(e) => setF('maxMarks', e.target.value)}
                    />
                  </MField>
                </div>

                {/* Target Audience */}
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
                    <input
                      style={mi()}
                      placeholder="e.g. Computer Science"
                      value={form.targetDepartment}
                      onChange={(e) => setF('targetDepartment', e.target.value)}
                    />
                  </MField>
                )}

                {/* ── QUESTION UPLOAD SECTION INSIDE MODAL ── */}
                <div style={S.questionUploadBox}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ color: '#93c5fd', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FileQuestion style={{ width: 16, height: 16 }} />
                      Task Questions & Assessment Material
                    </span>
                    <span style={{ fontSize: 11, color: form.questions?.length > 0 ? '#22c55e' : '#94a3b8', fontWeight: 600 }}>
                      {form.questions?.length > 0 ? `✓ ${form.questions.length} questions attached` : 'Optional / Can upload later'}
                    </span>
                  </div>

                  <p style={{ color: '#94a3b8', fontSize: 12, margin: '0 0 10px', lineHeight: 1.5 }}>
                    You can upload a questions <code style={{ color: '#60a5fa' }}>.json</code> file right now, or manage questions anytime via the task card button.
                  </p>

                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                    <input
                      type="file"
                      ref={modalFileInputRef}
                      accept=".json"
                      style={{ display: 'none' }}
                      onChange={handleModalFileUpload}
                    />
                    <button
                      type="button"
                      style={S.uploadJsonBtn}
                      onClick={() => modalFileInputRef.current?.click()}
                    >
                      <Upload style={{ width: 13, height: 13 }} />
                      Upload Questions File (.json)
                    </button>

                    <button
                      type="button"
                      style={S.sampleBtn}
                      onClick={() => {
                        const autoKeys = SAMPLE_QUESTIONS.map(q => ({ questionId: q.id, correctAnswer: q.correctAnswer, marks: q.marks }));
                        setForm(f => ({ ...f, questions: SAMPLE_QUESTIONS, answerKey: autoKeys }));
                        toast.success('Loaded sample questions and answer key!');
                      }}
                    >
                      Load Sample MCQ Template
                    </button>

                    {form.questions?.length > 0 && (
                      <button
                        type="button"
                        style={{ ...S.sampleBtn, color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' }}
                        onClick={() => setForm(f => ({ ...f, questions: [], answerKey: [] }))}
                      >
                        Clear Questions
                      </button>
                    )}
                  </div>
                </div>

                {/* Active Checkbox */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="checkbox"
                    id="task-active"
                    checked={form.isActive}
                    onChange={(e) => setF('isActive', e.target.checked)}
                    style={{ accentColor: '#3b82f6', width: 15, height: 15, cursor: 'pointer' }}
                  />
                  <label htmlFor="task-active" style={{ color: '#94a3b8', fontSize: 13, cursor: 'pointer' }}>
                    Active (students can attempt this task)
                  </label>
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

        {/* =============================================================
            2. DEDICATED QUESTIONS & ANSWER KEY MODAL (Visual + Upload)
        ============================================================= */}
        {qTask && (
          <div style={S.overlay} onClick={() => setQTask(null)}>
            <div style={S.qaModal} onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div style={S.modalHeader}>
                <div>
                  <h3 style={S.modalTitle}>
                    <FileQuestion style={{ width: 18, height: 18, color: '#60a5fa' }} />
                    Questions & Auto-Grading: <span style={{ color: '#f3a812' }}>{qTask.title}</span>
                  </h3>
                  <p style={{ color: '#64748b', fontSize: 12, margin: '4px 0 0' }}>
                    Manage test questions, multiple choice options, marks, and correct answer keys.
                  </p>
                </div>
                <button style={S.closeBtn} onClick={() => setQTask(null)}>
                  <X style={{ width: 20, height: 20 }} />
                </button>
              </div>

              {/* Tab Navigation */}
              <div style={S.tabBar}>
                <button
                  style={qTab === 'visual' ? S.tabActive : S.tabInactive}
                  onClick={() => setQTab('visual')}
                >
                  <Layers style={{ width: 13, height: 13 }} />
                  Visual Question Editor ({questionsList.length})
                </button>

                <button
                  style={qTab === 'upload_file' ? S.tabActive : S.tabInactive}
                  onClick={() => setQTab('upload_file')}
                >
                  <Upload style={{ width: 13, height: 13 }} />
                  Upload .JSON File
                </button>

                <button
                  style={qTab === 'raw_json' ? S.tabActive : S.tabInactive}
                  onClick={() => setQTab('raw_json')}
                >
                  <FileCode style={{ width: 13, height: 13 }} />
                  Paste Questions JSON
                </button>

                <button
                  style={qTab === 'answer_key' ? S.tabActive : S.tabInactive}
                  onClick={() => setQTab('answer_key')}
                >
                  <CheckCircle2 style={{ width: 13, height: 13 }} />
                  Answer Key JSON ({answerKeyList.length})
                </button>
              </div>

              {/* ── TAB 1: VISUAL QUESTION EDITOR ── */}
              {qTab === 'visual' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                    <span style={{ color: '#94a3b8', fontSize: 12 }}>
                      Configure questions and select the correct radio option for auto-evaluation.
                    </span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        type="button"
                        style={S.sampleBtn}
                        onClick={() => {
                          setQuestionsList(SAMPLE_QUESTIONS);
                          const autoKeys = SAMPLE_QUESTIONS.map(q => ({ questionId: q.id, correctAnswer: q.correctAnswer, marks: q.marks }));
                          setAnswerKeyList(autoKeys);
                          toast.success('Loaded sample questions!');
                        }}
                      >
                        Load Sample Questions
                      </button>
                      <button type="button" style={S.addQBtn} onClick={addQuestionRow}>
                        <Plus style={{ width: 13, height: 13 }} /> Add Question
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: '55vh', overflowY: 'auto', paddingRight: 4 }}>
                    {questionsList.map((q, qIdx) => {
                      const qId = q.id || `q${qIdx + 1}`;
                      const selectedAnswer = getCorrectAnswerForQ(qId);

                      return (
                        <div key={qId} style={S.questionCard}>
                          {/* Top Row: Q Number, Marks, Delete */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={S.qNumberBadge}>Q{qIdx + 1} ({q.type || 'MCQ'})</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span style={{ color: '#64748b', fontSize: 11 }}>Marks:</span>
                                <input
                                  type="number"
                                  min="1"
                                  value={q.marks || 10}
                                  style={{ ...mi(), width: 60, padding: '3px 6px', textAlign: 'center', fontSize: 12 }}
                                  onChange={(e) => {
                                    updateQuestionMarks(qIdx, e.target.value);
                                    if (selectedAnswer) setCorrectAnswerForQ(qId, selectedAnswer, Number(e.target.value));
                                  }}
                                />
                              </div>
                            </div>
                            <button style={S.delBtn} onClick={() => removeQuestionRow(qIdx)} title="Delete Question">
                              <Trash2 style={{ width: 13, height: 13 }} />
                            </button>
                          </div>

                          {/* Question Text */}
                          <input
                            style={{ ...mi(), marginBottom: 10, fontWeight: 600 }}
                            placeholder="Enter question prompt..."
                            value={q.question || ''}
                            onChange={(e) => updateQuestionText(qIdx, e.target.value)}
                          />

                          {/* MCQ Options */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <span style={{ color: '#64748b', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
                              Options (Click radio to mark Correct Answer for Auto-Grading):
                            </span>
                            {(q.options || ['', '', '', '']).map((opt, optIdx) => {
                              const isCorrect = selectedAnswer && selectedAnswer === opt;

                              return (
                                <div key={optIdx} style={{ ...S.optionRow, borderColor: isCorrect ? '#22c55e' : 'rgba(255,255,255,0.08)' }}>
                                  <input
                                    type="radio"
                                    name={`correct-${qId}`}
                                    checked={Boolean(isCorrect)}
                                    onChange={() => setCorrectAnswerForQ(qId, opt, q.marks || 10)}
                                    title="Mark as correct answer"
                                    style={{ accentColor: '#22c55e', cursor: 'pointer' }}
                                  />
                                  <span style={{ color: isCorrect ? '#22c55e' : '#64748b', fontSize: 11, fontWeight: 700, width: 18 }}>
                                    {String.fromCharCode(65 + optIdx)}
                                  </span>
                                  <input
                                    style={{ ...mi(), background: 'transparent', border: 'none', padding: '6px 4px', fontSize: 12 }}
                                    placeholder={`Option ${String.fromCharCode(65 + optIdx)} text...`}
                                    value={opt}
                                    onChange={(e) => updateOptionText(qIdx, optIdx, e.target.value)}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Save Button */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <button style={S.cancelBtn} onClick={() => setQTask(null)}>Cancel</button>
                    <button style={S.saveBtn} onClick={handleSaveVisualQA} disabled={savingQA}>
                      {savingQA ? <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} /> : <CheckCircle2 style={{ width: 14, height: 14 }} />}
                      {savingQA ? 'Saving Questions…' : 'Save Questions & Answer Key'}
                    </button>
                  </div>
                </div>
              )}

              {/* ── TAB 2: UPLOAD JSON FILE FROM DISK ── */}
              {qTab === 'upload_file' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={S.dropzoneBox}>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".json"
                      style={{ display: 'none' }}
                      onChange={handleFileUpload}
                    />
                    <Upload style={{ width: 36, height: 36, color: '#60a5fa', marginBottom: 10 }} />
                    <h4 style={{ color: '#f1f5f9', margin: 0, fontSize: 15, fontWeight: 700 }}>Choose a Questions JSON File</h4>
                    <p style={{ color: '#64748b', fontSize: 12, margin: '6px 0 16px', maxWidth: 360, textAlign: 'center' }}>
                      Select any <code style={{ color: '#60a5fa' }}>.json</code> file containing an array of questions. Correct answers will be automatically mapped.
                    </p>
                    <button
                      type="button"
                      style={S.primaryBtn}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Browse File (.json)
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#94a3b8', fontSize: 12 }}>
                      Loaded: <strong style={{ color: '#22c55e' }}>{questionsList.length} questions</strong>
                    </span>
                    <button
                      style={S.saveBtn}
                      onClick={handleSaveVisualQA}
                      disabled={savingQA || questionsList.length === 0}
                    >
                      {savingQA ? 'Saving…' : 'Save Uploaded Questions'}
                    </button>
                  </div>
                </div>
              )}

              {/* ── TAB 3: PASTE QUESTIONS JSON ── */}
              {qTab === 'raw_json' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#94a3b8', fontSize: 12 }}>Paste valid JSON array with question objects:</span>
                    <button
                      type="button"
                      style={S.sampleBtn}
                      onClick={() => setRawQuestionsJson(JSON.stringify(SAMPLE_QUESTIONS, null, 2))}
                    >
                      Insert Sample JSON
                    </button>
                  </div>

                  <textarea
                    style={{ ...mi(), height: 260, fontFamily: 'monospace', fontSize: 12, resize: 'vertical' }}
                    value={rawQuestionsJson}
                    onChange={(e) => setRawQuestionsJson(e.target.value)}
                    placeholder={'[\n  {\n    "id": "q1",\n    "question": "Sample question?",\n    "type": "MCQ",\n    "options": ["A", "B", "C", "D"],\n    "marks": 10,\n    "correctAnswer": "A"\n  }\n]'}
                  />

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    <button style={S.cancelBtn} onClick={() => setQTask(null)}>Cancel</button>
                    <button style={S.saveBtn} onClick={() => handleUploadQuestionsJson()} disabled={savingQA}>
                      {savingQA ? 'Uploading…' : 'Upload Questions JSON'}
                    </button>
                  </div>
                </div>
              )}

              {/* ── TAB 4: ANSWER KEY JSON ── */}
              {qTab === 'answer_key' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#94a3b8', fontSize: 12 }}>Answer key array for automatic grading:</span>
                    <button
                      type="button"
                      style={S.sampleBtn}
                      onClick={() => {
                        const sampleKeys = SAMPLE_QUESTIONS.map(q => ({ questionId: q.id, correctAnswer: q.correctAnswer, marks: q.marks }));
                        setRawAnswersJson(JSON.stringify(sampleKeys, null, 2));
                      }}
                    >
                      Insert Sample Answer Key
                    </button>
                  </div>

                  <textarea
                    style={{ ...mi(), height: 240, fontFamily: 'monospace', fontSize: 12, resize: 'vertical' }}
                    value={rawAnswersJson}
                    onChange={(e) => setRawAnswersJson(e.target.value)}
                    placeholder={'[\n  {\n    "questionId": "q1",\n    "correctAnswer": "Exact matching answer string",\n    "marks": 10\n  }\n]'}
                  />

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    <button style={S.cancelBtn} onClick={() => setQTask(null)}>Cancel</button>
                    <button style={S.saveBtn} onClick={handleUploadAnswersJson} disabled={savingQA}>
                      {savingQA ? 'Uploading…' : 'Upload Answer Key JSON'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          select option { background: #1e293b; color: #f1f5f9; }
          textarea { font-family: 'Inter', sans-serif; }
        `}</style>
      </main>
    </div>
  );
}

function MField({ label, required, flex = 1, children }) {
  return (
    <div style={{ flex, display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600 }}>
        {label}{required && <span style={{ color: '#f87171' }}> *</span>}
      </label>
      {children}
    </div>
  );
}

const mi = () => ({
  width: '100%',
  padding: '9px 12px',
  background: 'rgba(255,255,255,0.05)',
  border: '1.5px solid rgba(255,255,255,0.12)',
  borderRadius: 10,
  color: '#f1f5f9',
  fontSize: 13,
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: "'Inter', sans-serif",
});

const S = {
  layout: { display: 'flex', minHeight: '100vh', background: '#060f1e', fontFamily: "'Inter', sans-serif" },
  main: { flex: 1, padding: '28px 32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 },
  pageTitle: { color: '#f1f5f9', fontSize: 22, fontWeight: 800, margin: 0 },
  pageSubtitle: { color: '#475569', fontSize: 13, margin: '4px 0 0' },
  headerActions: { display: 'flex', gap: 10, alignItems: 'center' },
  refreshBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#94a3b8', cursor: 'pointer' },
  primaryBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: 'linear-gradient(135deg, #104288, #1d4ed8)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,66,136,0.3)' },
  searchWrap: { position: 'relative', maxWidth: 360 },
  searchIcon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: '#475569' },
  searchInput: { width: '100%', padding: '9px 12px 9px 36px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f1f5f9', fontSize: 13, outline: 'none', boxSizing: 'border-box' },
  center: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 60 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 16 },
  taskCard: { background: 'rgba(15,23,42,0.8)', border: '1.5px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '20px', display: 'flex', flexDirection: 'column', gap: 10, transition: 'border-color 0.2s' },
  cardTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  catBadge: { background: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 },
  toggleBtn: { background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  editBtn: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardTitle: { color: '#f1f5f9', fontSize: 15, fontWeight: 700, margin: 0, lineHeight: 1.3 },
  cardDesc: { color: '#64748b', fontSize: 12, lineHeight: 1.6, margin: 0, flex: 1 },
  cardMeta: { display: 'flex', gap: 14, flexWrap: 'wrap', paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.05)' },
  metaItem: { display: 'flex', alignItems: 'center', gap: 5, color: '#64748b', fontSize: 12 },
  cardQuestionsBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' },
  manageQBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 8, padding: '6px 12px', color: '#60a5fa', fontSize: 11, fontWeight: 700, cursor: 'pointer' },
  emptyQBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(243,168,18,0.12)', border: '1px solid rgba(243,168,18,0.3)', borderRadius: 8, padding: '6px 12px', color: '#f3a812', fontSize: 11, fontWeight: 700, cursor: 'pointer' },
  autoGradedBadge: { display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 20, padding: '3px 8px', color: '#22c55e', fontSize: 10, fontWeight: 600 },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20, overflowY: 'auto' },
  modal: { background: '#0f172a', border: '1.5px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: '28px', width: '100%', maxWidth: 640, boxShadow: '0 32px 80px rgba(0,0,0,0.6)', maxHeight: '90vh', overflowY: 'auto' },
  qaModal: { background: '#0f172a', border: '1.5px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: '28px', width: '100%', maxWidth: 780, boxShadow: '0 32px 80px rgba(0,0,0,0.6)', maxHeight: '92vh', overflowY: 'auto' },
  modalHeader: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 },
  modalTitle: { color: '#f1f5f9', fontSize: 17, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 8 },
  closeBtn: { background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 4 },
  formWrap: { display: 'flex', flexDirection: 'column', gap: 14 },
  row: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  cancelBtn: { flex: 1, padding: '10px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#94a3b8', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  saveBtn: { flex: 2, padding: '10px 18px', background: 'linear-gradient(135deg, #104288, #1d4ed8)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: '0 4px 14px rgba(16,66,136,0.3)' },
  questionUploadBox: { background: 'rgba(30,58,138,0.15)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 14, padding: '16px', margin: '4px 0' },
  uploadJsonBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'rgba(59,130,246,0.2)', border: '1px solid #3b82f6', borderRadius: 8, color: '#93c5fd', fontSize: 12, fontWeight: 700, cursor: 'pointer' },
  tabBar: { display: 'flex', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 12, marginBottom: 16, flexWrap: 'wrap' },
  tabActive: { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'rgba(59,130,246,0.15)', border: '1px solid #3b82f6', borderRadius: 8, color: '#60a5fa', fontSize: 12, fontWeight: 700, cursor: 'pointer' },
  tabInactive: { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#94a3b8', fontSize: 12, fontWeight: 500, cursor: 'pointer' },
  addQBtn: { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 12px', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, color: '#22c55e', fontSize: 12, fontWeight: 700, cursor: 'pointer' },
  questionCard: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '14px', display: 'flex', flexDirection: 'column' },
  qNumberBadge: { background: 'rgba(59,130,246,0.15)', color: '#60a5fa', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 },
  delBtn: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, padding: '4px 6px', color: '#f87171', cursor: 'pointer' },
  optionRow: { display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '3px 10px' },
  sampleBtn: { padding: '6px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: '#94a3b8', fontSize: 11, fontWeight: 600, cursor: 'pointer' },
  dropzoneBox: { border: '2px dashed rgba(59,130,246,0.35)', borderRadius: 16, padding: '32px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,23,42,0.4)' },
};
