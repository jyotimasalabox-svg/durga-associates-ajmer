'use client';

import React, { useState, useEffect } from 'react';
import { RateRule } from '@/lib/types';
import { DEFAULT_RATE_RULES } from '@/lib/defaultRates';
import { 
  Scale, 
  Edit3, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  FileText, 
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

interface Props {
  onRatesUpdated?: (rates: Record<string, RateRule>) => void;
}

export default function AdminRatesManager({ onRatesUpdated }: Props) {
  const [rates, setRates] = useState<Record<string, RateRule>>(DEFAULT_RATE_RULES);
  const [loading, setLoading] = useState(true);
  const [editingRule, setEditingRule] = useState<RateRule | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchRates = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/rates');
      const data = await res.json();
      if (data.success && data.rates) {
        setRates(data.rates);
        if (onRatesUpdated) onRatesUpdated(data.rates);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handleOpenEdit = (rule: RateRule) => {
    setEditingRule(JSON.parse(JSON.stringify(rule)));
    setSaveSuccess(false);
  };

  const handleSaveRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRule) return;

    try {
      const res = await fetch('/api/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rateRule: editingRule })
      });
      const data = await res.json();
      if (data.success) {
        setEditingRule(null);
        setSaveSuccess(true);
        fetchRates();
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert(data.error || 'त्रुटि हुई');
      }
    } catch (err) {
      alert('सर्वर त्रुटि');
    }
  };

  const handleResetDefaults = async () => {
    if (!window.confirm('क्या आप सभी दरों को राजस्थान ई-पंजीयन आधिकारिक डिफ़ॉल्ट नियमों पर रीसेट करना चाहते हैं?')) {
      return;
    }

    try {
      for (const key of Object.keys(DEFAULT_RATE_RULES)) {
        await fetch('/api/rates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rateRule: DEFAULT_RATE_RULES[key] })
        });
      }
      fetchRates();
      alert('सभी दरें आधिकारिक राजस्थान ई-पंजीयन नियमों पर रीसेट हो गई हैं');
    } catch (err) {
      alert('त्रुटि हुई');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-[#0B1B3D] flex items-center gap-2">
            <Scale className="w-7 h-7 text-amber-500" />
            राजस्थान ई-पंजीयन नियम व दर प्रबंधन (Rules & Rates Engine)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            प्रत्येक विलेख की सरकारी स्टाम्प दरें, अधिभार, रजिस्ट्रेशन फीस, सरकारी स्रोत एवं प्रभावी तिथियों का नियंत्रण
          </p>
        </div>

        <button
          onClick={handleResetDefaults}
          className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-300 shadow-xs flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-600" /> आधिकारिक डिफ़ॉल्ट दरें रीसेट करें
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>नियम एवं दरें सफलतापूर्वक अपडेट हो गईं। अब कैलकुलेटर नए नियमों के अनुसार गणना करेगा।</span>
        </div>
      )}

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {Object.values(rates).map((rule) => (
          <div
            key={rule.id}
            className="bg-white rounded-2xl border border-slate-200 hover:border-amber-400 p-5 shadow-xs transition-all space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-bold">
                  {rule.id}
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                  लागू / सक्रिय
                </span>
              </div>

              <h3 className="text-base font-extrabold text-[#0B1B3D]">
                {rule.nameHindi}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">{rule.nameEnglish}</p>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{rule.descriptionHindi}</p>

              {/* Rate Summary Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 my-3 text-xs">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-500 block">शहरी पुरुष स्टाम्प</span>
                  <span className="font-extrabold text-slate-900">{rule.urbanMaleStampPercent}%</span>
                </div>
                <div className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
                  <span className="text-[10px] text-emerald-700 block">शहरी महिला स्टाम्प (-1%)</span>
                  <span className="font-extrabold text-emerald-800">{rule.urbanFemaleStampPercent}%</span>
                </div>
                <div className="p-2 rounded-lg bg-blue-50/60 border border-blue-100">
                  <span className="text-[10px] text-blue-700 block">शहरी संयुक्त (-0.5%)</span>
                  <span className="font-extrabold text-blue-800">{rule.urbanJointStampPercent}%</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-500 block">अधिभार (Surcharges)</span>
                  <span className="font-extrabold text-slate-900">{rule.surchargePercent}% (10%+10%)</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-500 block">पंजीयन शुल्क (Reg Fee)</span>
                  <span className="font-extrabold text-slate-900">
                    {rule.isFlatRegFee ? `₹${rule.fixedRegFeeAmount}` : `${rule.registrationFeePercent}%`}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-500 block">स्कैनिंग (CSI Fee)</span>
                  <span className="font-extrabold text-slate-900">₹{rule.flatScanningFee}</span>
                </div>
              </div>

              {/* Source & Date info */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 space-y-1">
                <div>
                  <strong className="text-slate-700">सरकारी स्रोत: </strong>
                  <span>{rule.officialSource}</span>
                </div>
                <div>
                  <strong className="text-slate-700">प्रभावी तारीख: </strong>
                  <span>{rule.effectiveDate}</span>
                </div>
                <div>
                  <strong className="text-slate-700">अंतिम अपडेट: </strong>
                  <span>{rule.lastUpdated}</span>
                </div>
                {rule.notesHindi && (
                  <div className="pt-1 text-amber-800 font-medium">
                    {rule.notesHindi}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => handleOpenEdit(rule)}
                className="py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-[#0B1B3D] text-slate-700 hover:text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-500" /> नियम व दरें बदलें
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Rule Modal */}
      {editingRule && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <h3 className="text-base font-bold text-[#0B1B3D]">
                दर नियम संपादित करें: {editingRule.nameHindi}
              </h3>
              <button
                onClick={() => setEditingRule(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRule} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">शहरी पुरुष स्टाम्प (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingRule.urbanMaleStampPercent}
                    onChange={(e) => setEditingRule({ ...editingRule, urbanMaleStampPercent: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-300 p-2 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">शहरी महिला स्टाम्प (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingRule.urbanFemaleStampPercent}
                    onChange={(e) => setEditingRule({ ...editingRule, urbanFemaleStampPercent: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-300 p-2 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">शहरी संयुक्त स्टाम्प (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingRule.urbanJointStampPercent}
                    onChange={(e) => setEditingRule({ ...editingRule, urbanJointStampPercent: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-300 p-2 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">ग्रामीण पुरुष स्टाम्प (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingRule.ruralMaleStampPercent}
                    onChange={(e) => setEditingRule({ ...editingRule, ruralMaleStampPercent: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-300 p-2 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">ग्रामीण महिला स्टाम्प (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingRule.ruralFemaleStampPercent}
                    onChange={(e) => setEditingRule({ ...editingRule, ruralFemaleStampPercent: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-300 p-2 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">ग्रामीण संयुक्त स्टाम्प (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingRule.ruralJointStampPercent}
                    onChange={(e) => setEditingRule({ ...editingRule, ruralJointStampPercent: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-300 p-2 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">पंजीयन शुल्क (Reg Fee %)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingRule.registrationFeePercent}
                    onChange={(e) => setEditingRule({ ...editingRule, registrationFeePercent: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-300 p-2 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">अधिकतम पंजीयन शुल्क सीमा (Cap ₹)</label>
                  <input
                    type="number"
                    value={editingRule.maxRegistrationFee || 0}
                    onChange={(e) => setEditingRule({ ...editingRule, maxRegistrationFee: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-300 p-2 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">आधारभूत अधिभार (% Infra)</label>
                  <input
                    type="number"
                    value={editingRule.infraSurchargePercent}
                    onChange={(e) => setEditingRule({ ...editingRule, infraSurchargePercent: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-300 p-2 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">गो संवर्धन अधिभार (% Cow)</label>
                  <input
                    type="number"
                    value={editingRule.cowSurchargePercent}
                    onChange={(e) => setEditingRule({ ...editingRule, cowSurchargePercent: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-300 p-2 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">स्कैनिंग शुल्क (₹ Flat)</label>
                  <input
                    type="number"
                    value={editingRule.flatScanningFee}
                    onChange={(e) => setEditingRule({ ...editingRule, flatScanningFee: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-300 p-2 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">प्रभावी अधिसूचना तिथि (Effective Date)</label>
                <input
                  type="text"
                  value={editingRule.effectiveDate}
                  onChange={(e) => setEditingRule({ ...editingRule, effectiveDate: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">सरकारी स्रोत व परिपत्र संदर्भ (Official Source)</label>
                <input
                  type="text"
                  value={editingRule.officialSource}
                  onChange={(e) => setEditingRule({ ...editingRule, officialSource: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">नियम व छूट विवरण (Notes)</label>
                <textarea
                  rows={2}
                  value={editingRule.notesHindi}
                  onChange={(e) => setEditingRule({ ...editingRule, notesHindi: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingRule(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#0B1B3D] hover:bg-[#162E66] text-white font-bold shadow-md"
                >
                  अपडेट सुरक्षित करें
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
