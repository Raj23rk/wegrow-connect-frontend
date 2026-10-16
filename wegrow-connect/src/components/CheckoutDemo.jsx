import React, { useState, useEffect } from 'react';
import { API_ROOT } from '../services/config';
import { fetchRazorpayConfig } from '../services/razorpay';
import RazorpayPaymentButton from './RazorpayPaymentButton';
import { 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ShieldCheck, 
  Zap, 
  ExternalLink, 
  Copy, 
  Check, 
  Terminal,
  ArrowRight
} from 'lucide-react';

export default function CheckoutDemo() {
  const [config, setConfig] = useState(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [configError, setConfigError] = useState(null);

  // Form State (Default ₹2 for real gateway testing)
  const [amount, setAmount] = useState(2);
  const [purpose, setPurpose] = useState('COURSE_PURCHASE');
  const [customer, setCustomer] = useState({
    name: 'Raj Kumar',
    email: 'raj@example.com',
    phone: '9876543210',
  });

  // Payment Status State
  const [lastResult, setLastResult] = useState(null);
  const [lastError, setLastError] = useState(null);
  const [copiedCurl, setCopiedCurl] = useState(null);

  const loadConfig = async () => {
    setConfigLoading(true);
    setConfigError(null);
    try {
      const cfg = await fetchRazorpayConfig();
      setConfig(cfg);
    } catch (err) {
      console.error('Config load error:', err);
      setConfigError(err.message || 'Failed to fetch Razorpay configuration');
    } finally {
      setConfigLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedCurl(label);
    setTimeout(() => setCopiedCurl(null), 2000);
  };

  const curlConfig = `curl -X GET "${API_ROOT}/api/razorpay-config" \\
  -H "Accept: application/json"`;

  const curlCreateOrder = `curl -X POST "${API_ROOT}/api/create-order" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": ${amount * 100},
    "currency": "INR",
    "receipt": "rcpt_${Date.now()}",
    "purpose": "${purpose}",
    "customer": {
      "name": "${customer.name}",
      "email": "${customer.email}",
      "phone": "${customer.phone}"
    }
  }'`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans selection:bg-teal-500 selection:text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20 mb-3">
              <Zap className="w-3.5 h-3.5" /> Razorpay Production Gateway
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              WeGrow Payment Checkout
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              End-to-end integration: Order Creation (Step 1) → Razorpay Checkout Modal (Step 2) → HMAC Signature Verification (Step 3).
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <a
              href={`${API_ROOT}/checkout.html`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            >
              <span>Backend HTML Demo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={loadConfig}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${configLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Gateway</span>
            </button>
          </div>
        </div>

        {/* Server & API Status Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Backend API Host</div>
              <div className="text-sm font-semibold text-slate-200 mt-0.5 break-all">
                {API_ROOT || 'http://localhost:4000'}
              </div>
              <div className="text-[11px] text-teal-400 mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                Active Service
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="text-xs text-slate-400 font-medium">Razorpay Public Key ID</div>
              <div className="text-sm font-semibold text-slate-200 mt-0.5 font-mono">
                {configLoading ? (
                  <span className="text-slate-500">Checking /api/razorpay-config...</span>
                ) : config?.keyId ? (
                  <span>{config.keyId}</span>
                ) : (
                  <span className="text-amber-400">Fallback test key</span>
                )}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {config?.keyId?.startsWith('rzp_live_') ? (
                  <span className="text-emerald-400 font-medium">🟢 Production Live Account</span>
                ) : (
                  <span className="text-amber-400 font-medium">🟡 Sandbox / Test Mode</span>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Payment Protocol</div>
              <div className="text-sm font-semibold text-slate-200 mt-0.5">
                Razorpay Checkout v1
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Server HMAC-SHA256 Signed
              </div>
            </div>
          </div>
        </div>

        {/* Live Key Notice Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-slate-900 border border-blue-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex items-start gap-2.5">
            <div className="p-1 rounded bg-blue-500/20 text-blue-400 mt-0.5">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-blue-300">Company Live Account Tip:</span> To switch from test to your live account, ensure your full 23-character <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300">rzp_live_...</code> key and secret are in your backend <code className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200">.env</code>. The frontend automatically receives it via <code className="text-teal-300">/api/razorpay-config</code>.
            </div>
          </div>
        </div>

        {/* Main Interactive Payment Card & Live Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Interactive Form */}
          <div className="lg:col-span-6 bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6 shadow-xl">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-teal-400" />
                <span>Configure Test Transaction</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Select an amount or input details to test the live Razorpay modal.
              </p>
            </div>

            {/* Quick Amount Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Select Amount (INR)</label>
                <span className="text-[10px] text-teal-400 font-bold bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full">
                  ⚡ ₹2 Real Test Mode Available
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[
                  { label: '⚡ ₹2 (Real Test)', val: 2 },
                  { label: '₹1 (Test)', val: 1 },
                  { label: '₹10 (Test)', val: 10 },
                  { label: '₹500 (Course)', val: 500 },
                  { label: '₹2,500 (Pro)', val: 2500 },
                  { label: '₹9,999 (Year)', val: 9999 },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setAmount(item.val)}
                    className={`py-2 px-1 text-center rounded-lg text-xs font-medium border transition cursor-pointer ${
                      amount === item.val
                        ? 'bg-teal-500/20 border-teal-500 text-teal-300 shadow-xs'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Custom Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">₹</span>
                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500 transition"
                />
              </div>
              <span className="text-[11px] text-slate-400">
                Will be transmitted to Razorpay as <strong>{amount * 100} paise</strong>.
              </span>
            </div>

            {/* Purpose */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Purpose / Plan</label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500 transition"
              />
            </div>

            {/* Customer Details */}
            <div className="space-y-3 pt-2 border-t border-slate-800/60">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Customer Details</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Full Name</label>
                  <input
                    type="text"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Phone</label>
                  <input
                    type="tel"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Email Address</label>
                <input
                  type="email"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            {/* Action Payment Button */}
            <div className="pt-4 border-t border-slate-800">
              <RazorpayPaymentButton
                amount={amount}
                inRupees={true}
                purpose={purpose}
                customer={customer}
                themeColor="#0f766e"
                className="w-full justify-center !py-3.5 !text-base !font-bold !bg-teal-600 hover:!bg-teal-500 !shadow-lg !shadow-teal-900/40 rounded-xl"
                onSuccess={(res) => {
                  setLastResult(res);
                  setLastError(null);
                }}
                onError={(err) => {
                  setLastError(err);
                  setLastResult(null);
                }}
              />
              <div className="text-center mt-2.5 text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>100% Encrypted & Authenticated Razorpay Transaction</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Console & Results */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Live Result State */}
            {lastResult && (
              <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 shadow-xl space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Payment Verified Successfully!</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Payment ID</span>
                    <span className="font-mono text-emerald-300 font-semibold break-all">{lastResult.paymentId}</span>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Order ID</span>
                    <span className="font-mono text-emerald-300 font-semibold break-all">{lastResult.orderId}</span>
                  </div>
                </div>
                <pre className="p-3 bg-slate-950 rounded-lg text-[11px] font-mono text-slate-300 overflow-x-auto max-h-40 border border-slate-800">
                  {JSON.stringify(lastResult, null, 2)}
                </pre>
              </div>
            )}

            {lastError && (
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 shadow-xl space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <AlertCircle className="w-5 h-5" />
                  <span>Transaction Alert</span>
                </div>
                <p className="text-xs text-rose-200">
                  {lastError.message || String(lastError)}
                </p>
              </div>
            )}

            {/* Quick cURL Verification Snippets */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-teal-400" />
                  <span>Backend cURL Reference</span>
                </h3>
                <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">Part 1 Specs</span>
              </div>

              {/* cURL 1 */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                  <span>1. Fetch Public Config</span>
                  <button
                    onClick={() => handleCopy(curlConfig, 'config')}
                    className="text-[11px] text-teal-400 hover:text-teal-300 flex items-center gap-1"
                  >
                    {copiedCurl === 'config' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedCurl === 'config' ? 'Copied' : 'Copy cURL'}
                  </button>
                </div>
                <pre className="p-2.5 bg-slate-950 rounded-lg text-[11px] font-mono text-slate-300 overflow-x-auto border border-slate-800">
                  {curlConfig}
                </pre>
              </div>

              {/* cURL 2 */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                  <span>2. Create Order (paise)</span>
                  <button
                    onClick={() => handleCopy(curlCreateOrder, 'order')}
                    className="text-[11px] text-teal-400 hover:text-teal-300 flex items-center gap-1"
                  >
                    {copiedCurl === 'order' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedCurl === 'order' ? 'Copied' : 'Copy cURL'}
                  </button>
                </div>
                <pre className="p-2.5 bg-slate-950 rounded-lg text-[11px] font-mono text-slate-300 overflow-x-auto border border-slate-800">
                  {curlCreateOrder}
                </pre>
              </div>
            </div>

            {/* Quick Integration Guide */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-3 shadow-xl">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>How to Use the Component in Any Page</span>
              </h3>
              <pre className="p-3 bg-slate-950 rounded-lg text-[11px] font-mono text-teal-300 overflow-x-auto border border-slate-800">
{`import RazorpayPaymentButton from '../components/RazorpayPaymentButton';

<RazorpayPaymentButton
  amount={500}
  purpose="WEGROW_COURSE"
  customer={{ name: "Raj", email: "raj@example.com", phone: "9876543210" }}
  onSuccess={(res) => alert('Payment Success!')}
/>`}
              </pre>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
