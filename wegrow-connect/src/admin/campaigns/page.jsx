import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from '../../components/Sidebar';
import QRCode from 'qrcode';
import {
  QrCode, Plus, RefreshCw, Loader2, X, ToggleLeft, ToggleRight,
  Copy, Download, Search, Check, Printer, Eye, Globe
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getCampaigns, createCampaign, updateCampaign } from '../../services/api';

const EMPTY_FORM = { name: '', source: 'Newspaper', campaignId: '', isActive: true };

// ── Base URL for QR (auto-detects current origin)
const BASE_URL = window.location.origin;

export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal states
  const [showCreate, setShowCreate] = useState(false);
  const [showQR, setShowQR] = useState(null); // holds full campaign object

  // Form
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // QR preview inside create modal
  const createQrRef = useRef(null);
  const [createQrReady, setCreateQrReady] = useState(false);

  // QR viewer modal
  const viewQrRef = useRef(null);
  const [copied, setCopied] = useState(false);

  /* ── Load Campaigns ──────────────────────────────── */
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCampaigns();
      const list = res?.data?.campaigns || res?.data || (Array.isArray(res) ? res : []);
      setCampaigns(list);
    } catch { toast.error('Failed to load campaigns'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  /* ── Draw QR into canvas ─────────────────────────── */
  const drawQR = useCallback(async (canvasRef, campaignId, opts = {}) => {
    if (!canvasRef?.current || !campaignId) return;
    const url = `${BASE_URL}/campaign/${campaignId.toUpperCase()}`;
    try {
      await QRCode.toCanvas(canvasRef.current, url, {
        width: opts.width || 280,
        margin: 2,
        color: { dark: '#0a1628', light: '#ffffff' },
        errorCorrectionLevel: 'H',
        ...opts,
      });
    } catch (err) {
      console.error('QR draw error', err);
    }
  }, []);

  /* ── Re-draw create modal QR when ID changes ─────── */
  useEffect(() => {
    if (!showCreate || !form.campaignId?.trim()) {
      setCreateQrReady(false);
      return;
    }
    const timer = setTimeout(async () => {
      await drawQR(createQrRef, form.campaignId);
      setCreateQrReady(true);
    }, 400);
    return () => clearTimeout(timer);
  }, [form.campaignId, showCreate, drawQR]);

  /* ── Draw view modal QR ───────────────────────────── */
  useEffect(() => {
    if (!showQR) return;
    setTimeout(() => drawQR(viewQrRef, showQR.campaignId, { width: 320 }), 100);
  }, [showQR, drawQR]);

  /* ── Download QR as PNG ─────────────────────────── */
  const downloadQR = async (campaign) => {
    const canvas = document.createElement('canvas');
    const SIZE = 500;
    const PADDING = 40;
    const QR_SIZE = SIZE - PADDING * 2;

    // Draw QR onto temp canvas
    await QRCode.toCanvas(canvas, `${BASE_URL}/campaign/${campaign.campaignId}`, {
      width: QR_SIZE,
      margin: 0,
      color: { dark: '#0a1628', light: '#ffffff' },
      errorCorrectionLevel: 'H',
    });

    // Compose final canvas with branding
    const final = document.createElement('canvas');
    final.width = SIZE;
    final.height = SIZE + 100;
    const ctx = final.getContext('2d');

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.roundRect(0, 0, final.width, final.height, 20);
    ctx.fill();

    // Dark header bar
    ctx.fillStyle = '#0a1628';
    ctx.roundRect(0, 0, SIZE, 56, [20, 20, 0, 0]);
    ctx.fill();

    // Header text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Inter, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('WeGrow Connect', SIZE / 2, 35);

    // QR image
    ctx.drawImage(canvas, PADDING, 64, QR_SIZE, QR_SIZE);

    // Campaign name
    ctx.fillStyle = '#0a1628';
    ctx.font = 'bold 15px Inter, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(campaign.name, SIZE / 2, QR_SIZE + 84);

    // URL below
    ctx.fillStyle = '#64748b';
    ctx.font = '11px Inter, Arial, sans-serif';
    ctx.fillText(`${BASE_URL}/campaign/${campaign.campaignId}`, SIZE / 2, QR_SIZE + 104);

    // Campaign ID tag
    ctx.fillStyle = '#f3a812';
    ctx.font = 'bold 11px Inter, Arial, sans-serif';
    ctx.fillText(`ID: ${campaign.campaignId}`, SIZE / 2, QR_SIZE + 122);

    // Trigger download
    const link = document.createElement('a');
    link.download = `wegrow-qr-${campaign.campaignId}.png`;
    link.href = final.toDataURL('image/png');
    link.click();
    toast.success('QR code downloaded!');
  };

  /* ── Copy campaign link ─────────────────────────── */
  const copyLink = (campaignId) => {
    const url = `${BASE_URL}/campaign/${campaignId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast.success('Link copied!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  /* ── Toggle active ──────────────────────────────── */
  const toggleActive = async (c) => {
    try {
      await updateCampaign(c._id, { isActive: !c.isActive });
      toast.success(`Campaign ${!c.isActive ? 'activated' : 'deactivated'}`);
      load();
    } catch { toast.error('Update failed'); }
  };

  /* ── Save new campaign ──────────────────────────── */
  const setF = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setFormErrors((e) => ({ ...e, [k]: '' })); };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Campaign name required';
    if (!form.campaignId.trim()) errs.campaignId = 'Campaign ID required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const cid = form.campaignId.toUpperCase().replace(/\s+/g, '');
      await createCampaign({ ...form, campaignId: cid });
      toast.success('Campaign created!');
      setShowCreate(false);
      setForm(EMPTY_FORM);
      load();
    } catch (err) { toast.error(err?.message || 'Failed to create campaign'); }
    finally { setSaving(false); }
  };

  /* ── Filter ──────────────────────────────────────── */
  const filtered = campaigns.filter((c) =>
    !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.campaignId?.toLowerCase().includes(search.toLowerCase())
  );

  /* ═══════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════ */
  return (
    <div style={S.layout}>
      <Sidebar />
      <main style={S.main}>

        {/* ── Header ── */}
        <div style={S.header}>
          <div>
            <h1 style={S.pageTitle}>
              <QrCode style={{ width: 22, height: 22, color: '#60a5fa', verticalAlign: 'middle', marginRight: 8 }} />
              Campaigns
            </h1>
            <p style={S.pageSubtitle}>Create QR campaigns and download ready-to-print QR codes.</p>
          </div>
          <div style={S.headerActions}>
            <button style={S.refreshBtn} onClick={load} title="Refresh">
              <RefreshCw style={{ width: 14, height: 14 }} />
            </button>
            <button id="btn-create-campaign" style={S.primaryBtn} onClick={() => { setForm(EMPTY_FORM); setCreateQrReady(false); setShowCreate(true); }}>
              <Plus style={{ width: 14, height: 14 }} /> New Campaign
            </button>
          </div>
        </div>

        {/* ── Search ── */}
        <div style={S.searchWrap}>
          <Search style={S.searchIcon} />
          <input
            style={S.searchInput}
            placeholder="Search by name or campaign ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ── Cards Grid ── */}
        {loading ? (
          <div style={S.center}>
            <Loader2 style={{ width: 36, height: 36, color: '#60a5fa', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={S.center}>
            <QrCode style={{ width: 48, height: 48, color: '#1e293b' }} />
            <p style={{ color: '#475569', marginTop: 12, fontSize: 14 }}>No campaigns yet. Create your first one!</p>
          </div>
        ) : (
          <div style={S.grid}>
            {filtered.map((c) => (
              <CampaignCard
                key={c._id}
                campaign={c}
                onViewQR={() => setShowQR(c)}
                onDownload={() => downloadQR(c)}
                onCopy={() => copyLink(c.campaignId)}
                onToggle={() => toggleActive(c)}
              />
            ))}
          </div>
        )}

        {/* ══════════════════════════════════════════════
            CREATE CAMPAIGN MODAL
        ══════════════════════════════════════════════ */}
        {showCreate && (
          <div style={S.overlay}>
            <div style={S.modal}>
              <div style={S.modalHeader}>
                <h3 style={S.modalTitle}>
                  <QrCode style={{ width: 16, height: 16, color: '#60a5fa' }} />
                  Create New Campaign
                </h3>
                <button style={S.closeBtn} onClick={() => setShowCreate(false)}>
                  <X style={{ width: 18, height: 18 }} />
                </button>
              </div>

              <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {/* Form */}
                <form onSubmit={handleSave} style={{ flex: 2, minWidth: 260, display: 'flex', flexDirection: 'column', gap: 14 }}>

                  <MField label="Campaign Name" error={formErrors.name} required>
                    <input
                      id="create-camp-name"
                      style={mi(formErrors.name)}
                      placeholder="e.g. Newspaper Ad Campaign"
                      value={form.name}
                      onChange={(e) => setF('name', e.target.value)}
                    />
                  </MField>

                  <div style={{ display: 'flex', gap: 12 }}>
                    <MField label="Campaign ID" error={formErrors.campaignId} required>
                      <input
                        id="create-camp-id"
                        style={{ ...mi(formErrors.campaignId), textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: 1 }}
                        placeholder="NEWSPAPER01"
                        value={form.campaignId}
                        onChange={(e) => setF('campaignId', e.target.value.toUpperCase().replace(/\s+/g, ''))}
                      />
                    </MField>
                    <MField label="Source">
                      <select
                        id="create-camp-source"
                        style={mi()}
                        value={form.source}
                        onChange={(e) => setF('source', e.target.value)}
                      >
                        {['Newspaper', 'Poster', 'Social Media', 'Email', 'Event', 'Other'].map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </MField>
                  </div>

                  {/* URL Preview */}
                  {form.campaignId && (
                    <div style={S.urlPreview}>
                      <Globe style={{ width: 13, height: 13, color: '#60a5fa', flexShrink: 0 }} />
                      <span style={{ color: '#60a5fa', fontSize: 12, wordBreak: 'break-all' }}>
                        {BASE_URL}/campaign/{form.campaignId.toUpperCase()}
                      </span>
                    </div>
                  )}

                  {/* Active */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="checkbox"
                      id="create-camp-active"
                      checked={form.isActive}
                      onChange={(e) => setF('isActive', e.target.checked)}
                      style={{ accentColor: '#3b82f6', width: 15, height: 15, cursor: 'pointer' }}
                    />
                    <label htmlFor="create-camp-active" style={{ color: '#94a3b8', fontSize: 13, cursor: 'pointer' }}>
                      Active (students can register immediately)
                    </label>
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button type="button" style={S.cancelBtn} onClick={() => setShowCreate(false)}>Cancel</button>
                    <button
                      id="btn-save-campaign"
                      type="submit"
                      style={S.saveBtn}
                      disabled={saving}
                    >
                      {saving
                        ? <><Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} /> Creating…</>
                        : <><QrCode style={{ width: 14, height: 14 }} /> Create & Generate QR</>
                      }
                    </button>
                  </div>
                </form>

                {/* Live QR Preview */}
                <div style={S.qrPreviewBox}>
                  <p style={S.qrPreviewLabel}>QR Preview</p>
                  <div style={S.qrCanvasWrap}>
                    {!form.campaignId?.trim() ? (
                      <div style={S.qrPlaceholder}>
                        <QrCode style={{ width: 48, height: 48, color: '#1e293b' }} />
                        <span style={{ color: '#334155', fontSize: 12, marginTop: 8 }}>Enter Campaign ID</span>
                      </div>
                    ) : (
                      <canvas ref={createQrRef} style={{ borderRadius: 8, display: 'block' }} />
                    )}
                  </div>
                  {form.campaignId && (
                    <span style={{ color: '#475569', fontSize: 11, textAlign: 'center', marginTop: 6 }}>
                      QR updates as you type
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            VIEW / DOWNLOAD QR MODAL
        ══════════════════════════════════════════════ */}
        {showQR && (
          <div style={S.overlay}>
            <div style={{ ...S.modal, maxWidth: 440 }}>
              <div style={S.modalHeader}>
                <h3 style={S.modalTitle}>
                  <QrCode style={{ width: 16, height: 16, color: '#60a5fa' }} />
                  QR Code — {showQR.name}
                </h3>
                <button style={S.closeBtn} onClick={() => setShowQR(null)}>
                  <X style={{ width: 18, height: 18 }} />
                </button>
              </div>

              {/* QR Card (matches download output) */}
              <div style={S.qrCard} id="qr-print-area">
                {/* Header */}
                <div style={S.qrCardHeader}>
                  <span style={S.qrCardHeaderText}>WeGrow Connect</span>
                </div>
                {/* Canvas */}
                <div style={S.qrCardBody}>
                  <canvas ref={viewQrRef} style={{ borderRadius: 10, display: 'block', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }} />
                </div>
                {/* Footer */}
                <div style={S.qrCardFooter}>
                  <p style={{ color: '#0a1628', fontSize: 14, fontWeight: 700, margin: 0 }}>{showQR.name}</p>
                  <p style={{ color: '#64748b', fontSize: 11, margin: '3px 0 0', wordBreak: 'break-all' }}>
                    {BASE_URL}/campaign/{showQR.campaignId}
                  </p>
                  <div style={S.qrIdBadge}>
                    <span>Campaign ID: {showQR.campaignId}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button
                  id={`btn-copy-${showQR.campaignId}`}
                  style={S.copyBtn}
                  onClick={() => copyLink(showQR.campaignId)}
                >
                  {copied ? <Check style={{ width: 14, height: 14 }} /> : <Copy style={{ width: 14, height: 14 }} />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>

                <button
                  id={`btn-download-qr-${showQR.campaignId}`}
                  style={S.downloadBtn}
                  onClick={() => downloadQR(showQR)}
                >
                  <Download style={{ width: 14, height: 14 }} />
                  Download PNG
                </button>
              </div>

              <p style={{ color: '#475569', fontSize: 11, marginTop: 10, textAlign: 'center' }}>
                Print or share the PNG — works for newspapers, posters and social media.
              </p>
            </div>
          </div>
        )}

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          select option { background: #1e293b; color: #f1f5f9; }
          canvas { image-rendering: pixelated; }
        `}</style>
      </main>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   CAMPAIGN CARD
══════════════════════════════════════════════════════ */
function CampaignCard({ campaign, onViewQR, onDownload, onCopy, onToggle }) {
  const miniQrRef = useRef(null);

  useEffect(() => {
    if (!miniQrRef.current || !campaign.campaignId) return;
    const url = `${window.location.origin}/campaign/${campaign.campaignId}`;
    QRCode.toCanvas(miniQrRef.current, url, {
      width: 80,
      margin: 1,
      color: { dark: '#0a1628', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    }).catch(() => {});
  }, [campaign.campaignId]);

  return (
    <div style={C.card}>
      {/* Mini QR thumbnail */}
      <div style={C.qrThumb} onClick={onViewQR} title="Click to view full QR">
        <canvas ref={miniQrRef} style={{ borderRadius: 6, display: 'block', cursor: 'pointer' }} />
      </div>

      {/* Info */}
      <div style={C.info}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <h3 style={C.name}>{campaign.name}</h3>
          <span style={campaign.isActive ? C.activeBadge : C.inactiveBadge}>
            {campaign.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        <div style={C.metaRow}>
          <code style={C.code}>{campaign.campaignId}</code>
          <span style={C.source}>{campaign.source || 'Newspaper'}</span>
        </div>

        <div style={C.urlRow}>
          <Globe style={{ width: 11, height: 11, color: '#475569', flexShrink: 0 }} />
          <span style={{ color: '#334155', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {window.location.origin}/campaign/{campaign.campaignId}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div style={C.actions}>
        <button id={`btn-view-qr-${campaign.campaignId}`} style={C.viewBtn} onClick={onViewQR} title="View QR">
          <Eye style={{ width: 13, height: 13 }} /> View QR
        </button>
        <button id={`btn-dl-qr-${campaign.campaignId}`} style={C.dlBtn} onClick={onDownload} title="Download QR PNG">
          <Download style={{ width: 13, height: 13 }} /> Download
        </button>
        <button style={C.copyBtn} onClick={onCopy} title="Copy link">
          <Copy style={{ width: 13, height: 13 }} />
        </button>
        <button style={C.toggleBtn} onClick={onToggle} title="Toggle active">
          {campaign.isActive
            ? <ToggleRight style={{ width: 20, height: 20, color: '#22c55e' }} />
            : <ToggleLeft style={{ width: 20, height: 20, color: '#475569' }} />
          }
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════ */
function MField({ label, error, required, children }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600 }}>
        {label} {required && <span style={{ color: '#f87171' }}>*</span>}
      </label>
      {children}
      {error && <span style={{ color: '#f87171', fontSize: 11 }}>{error}</span>}
    </div>
  );
}

const mi = (err) => ({
  width: '100%', padding: '9px 12px',
  background: 'rgba(255,255,255,0.05)',
  border: `1.5px solid ${err ? '#f87171' : 'rgba(255,255,255,0.12)'}`,
  borderRadius: 10, color: '#f1f5f9', fontSize: 13,
  outline: 'none', boxSizing: 'border-box',
  fontFamily: "'Inter', sans-serif",
});

/* ══════════════════════════════════════════════════════
   STYLES
══════════════════════════════════════════════════════ */
const S = {
  layout: { display: 'flex', minHeight: '100vh', background: '#060f1e', fontFamily: "'Inter', sans-serif" },
  main: { flex: 1, padding: '28px 32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 },
  pageTitle: { color: '#f1f5f9', fontSize: 22, fontWeight: 800, margin: 0 },
  pageSubtitle: { color: '#475569', fontSize: 13, margin: '4px 0 0' },
  headerActions: { display: 'flex', gap: 10, alignItems: 'center' },
  refreshBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#94a3b8', cursor: 'pointer' },
  primaryBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', background: 'linear-gradient(135deg, #104288, #1d4ed8)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(16,66,136,0.4)' },
  searchWrap: { position: 'relative', maxWidth: 380 },
  searchIcon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: '#475569' },
  searchInput: { width: '100%', padding: '9px 12px 9px 36px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f1f5f9', fontSize: 13, outline: 'none', boxSizing: 'border-box' },
  center: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 60 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 },

  // Modal
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20, overflowY: 'auto' },
  modal: { background: '#0f172a', border: '1.5px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: '28px', width: '100%', maxWidth: 680, boxShadow: '0 32px 80px rgba(0,0,0,0.7)' },
  modalHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 },
  modalTitle: { color: '#f1f5f9', fontSize: 17, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 8 },
  closeBtn: { background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 4 },
  urlPreview: { display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.18)', borderRadius: 10, padding: '9px 12px' },
  cancelBtn: { flex: 1, padding: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#94a3b8', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  saveBtn: { flex: 2, padding: '10px', background: 'linear-gradient(135deg, #104288, #1d4ed8)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: '0 4px 14px rgba(16,66,136,0.4)' },

  // QR Preview in modal
  qrPreviewBox: { flex: 1, minWidth: 150, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 },
  qrPreviewLabel: { color: '#475569', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, margin: 0 },
  qrCanvasWrap: { background: '#ffffff', borderRadius: 14, padding: 12, boxShadow: '0 0 0 1px rgba(255,255,255,0.08)', minWidth: 104, minHeight: 104, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  qrPlaceholder: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 80, height: 80 },

  // View QR card
  qrCard: { background: '#ffffff', borderRadius: 18, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' },
  qrCardHeader: { background: '#0a1628', padding: '13px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  qrCardHeaderText: { color: '#ffffff', fontSize: 15, fontWeight: 800, letterSpacing: 0.5 },
  qrCardBody: { display: 'flex', justifyContent: 'center', padding: '20px 20px 12px' },
  qrCardFooter: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '12px 20px 18px' },
  qrIdBadge: { background: '#fff7e6', border: '1px solid #f3a81244', borderRadius: 20, padding: '3px 12px', color: '#b45309', fontSize: 11, fontWeight: 700, marginTop: 4 },

  // Action buttons in view modal
  copyBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#94a3b8', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  downloadBtn: { flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px', background: 'linear-gradient(135deg, #104288, #1d4ed8)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(16,66,136,0.4)' },
};

const C = {
  card: { background: 'rgba(15,23,42,0.85)', border: '1.5px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '18px', display: 'flex', gap: 16, alignItems: 'flex-start', transition: 'border-color 0.2s, transform 0.2s' },
  qrThumb: { background: '#ffffff', borderRadius: 10, padding: 5, flexShrink: 0, boxShadow: '0 2px 12px rgba(0,0,0,0.3)', cursor: 'pointer' },
  info: { flex: 1, display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 },
  name: { color: '#f1f5f9', fontSize: 15, fontWeight: 700, margin: 0 },
  activeBadge: { background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', color: '#22c55e', borderRadius: 20, padding: '2px 9px', fontSize: 10, fontWeight: 700 },
  inactiveBadge: { background: 'rgba(100,116,139,0.12)', border: '1px solid rgba(100,116,139,0.2)', color: '#64748b', borderRadius: 20, padding: '2px 9px', fontSize: 10, fontWeight: 700 },
  metaRow: { display: 'flex', alignItems: 'center', gap: 8 },
  code: { background: 'rgba(59,130,246,0.12)', color: '#60a5fa', padding: '2px 8px', borderRadius: 6, fontSize: 12, fontFamily: 'monospace', letterSpacing: 0.5 },
  source: { background: 'rgba(243,168,18,0.1)', color: '#f3a812', border: '1px solid rgba(243,168,18,0.2)', borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 600 },
  urlRow: { display: 'flex', alignItems: 'center', gap: 5, overflow: 'hidden' },
  actions: { display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 },
  viewBtn: { display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8, padding: '6px 10px', color: '#60a5fa', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' },
  dlBtn: { display: 'flex', alignItems: 'center', gap: 5, background: 'linear-gradient(135deg, #104288, #1d4ed8)', border: 'none', borderRadius: 8, padding: '6px 10px', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' },
  copyBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 10px', color: '#94a3b8', fontSize: 12, cursor: 'pointer' },
  toggleBtn: { display: 'flex', alignItems: 'center', background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px 0' },
};
