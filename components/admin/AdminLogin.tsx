'use client';

import React, { useState } from 'react';
import { Lock, ShieldCheck, KeyRound, AlertCircle, ArrowRight } from 'lucide-react';

export default function AdminLogin({ onLoginSuccess }: { onLoginSuccess: (token: string) => void }) {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!pin.trim()) {
      setError('कृपया सुरक्षा पिन अथवा पासवर्ड दर्ज करें।');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', pin: pin.trim() })
      });

      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem('durga_admin_token', data.token);
        localStorage.setItem('durga_admin_login_time', new Date().toISOString());
        onLoginSuccess(data.token);
      } else {
        setError(data.error || 'अमान्य सुरक्षा पिन');
      }
    } catch (err) {
      setError('सर्वर से संपर्क नहीं हो सका। कृपया पुनः प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-br from-[#071228] via-[#0B1B3D] to-[#162E66] text-white p-8 text-center relative overflow-hidden">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg border border-amber-300/40 mb-3">
            द
          </div>
          <h2 className="text-xl font-black tracking-tight text-white">
            दुर्गा एसोसिएट्स एंड प्रॉपर्टी डीलर
          </h2>
          <p className="text-xs text-amber-300 mt-1 font-medium">
            निजी एडमिन पोर्टल • अजमेर
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 text-[11px] text-slate-300 border border-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> केवल अधिकृत संचालक व स्टाफ के उपयोग हेतु
          </div>
        </div>

        {/* Login Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              सुरक्षा पिन / पासवर्ड (Admin Security PIN)
            </label>
            <div className="relative">
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="पिन दर्ज करें (डिफ़ॉल्ट: 1234)"
                autoFocus
                className="w-full rounded-xl border border-slate-300 px-4 py-3 pl-11 text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
              <KeyRound className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
            <p className="mt-2 text-[11px] text-slate-500">
              डिफ़ॉल्ट सुरक्षा पिन: <strong className="text-slate-700">1234</strong> अथवा <strong className="text-slate-700">durga@ajmer</strong> (सेटिंग्स में बदला जा सकता है)
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-[#0B1B3D] hover:bg-[#162E66] text-white font-bold text-sm shadow-lg shadow-blue-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <span>प्रमाणीकरण जारी है...</span>
            ) : (
              <>
                <Lock className="w-4 h-4 text-amber-400" />
                <span>सुरक्षित डैशबोर्ड में प्रवेश करें</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="pt-2 text-center">
            <span className="text-[11px] text-slate-400">
              संपर्क: 9829261354 • 8003987152 | अजमेर (राज.)
            </span>
          </div>
        </form>

      </div>
    </div>
  );
}
