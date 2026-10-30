'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { LedgerEntry, ClientRecord } from '@/lib/types';
import { 
  Wallet, 
  ArrowDownRight, 
  ArrowUpRight, 
  Plus, 
  Printer, 
  Trash2, 
  Calendar, 
  Search, 
  Filter, 
  DollarSign, 
  Building,
  CreditCard,
  TrendingUp,
  Receipt
} from 'lucide-react';

export default function AdminLedger() {
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<Partial<LedgerEntry>>({
    date: new Date().toISOString().split('T')[0],
    type: 'income',
    category: 'client_fee',
    amount: 0,
    clientName: '',
    caseNumber: '',
    paymentMode: 'cash',
    description: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ledRes, cliRes] = await Promise.all([
        fetch('/api/ledger'),
        fetch('/api/clients')
      ]);
      const ledData = await ledRes.json();
      const cliData = await cliRes.json();

      if (ledData.success && ledData.ledger) {
        setLedger(ledData.ledger);
      }
      if (cliData.success && cliData.clients) {
        setClients(cliData.clients);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalIncome = useMemo(() => {
    return ledger.filter(l => l.type === 'income').reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  }, [ledger]);

  const totalExpense = useMemo(() => {
    return ledger.filter(l => l.type === 'expense').reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  }, [ledger]);

  const netProfit = totalIncome - totalExpense;

  const totalPendingBalance = useMemo(() => {
    return clients.reduce((acc, curr) => acc + (Number(curr.fees?.balanceAmount) || 0), 0);
  }, [clients]);

  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) {
      alert('कृपया राशि और विवरण अवश्य भरें');
      return;
    }

    try {
      const res = await fetch('/api/ledger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setFormData({
          date: new Date().toISOString().split('T')[0],
          type: 'income',
          category: 'client_fee',
          amount: 0,
          clientName: '',
          caseNumber: '',
          paymentMode: 'cash',
          description: ''
        });
        fetchData();
      } else {
        alert(data.error || 'त्रुटि हुई');
      }
    } catch (err) {
      alert('सर्वर त्रुटि');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('क्या आप वाकई इस प्रविष्टि को हटाना चाहते हैं?')) return;
    try {
      const res = await fetch(`/api/ledger?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert(data.error || 'त्रुटि हुई');
      }
    } catch (err) {
      alert('सर्वर त्रुटि');
    }
  };

  const filteredEntries = ledger.filter(entry => {
    const matchesSearch = 
      entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entry.clientName && entry.clientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (entry.caseNumber && entry.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = typeFilter === 'all' || entry.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' || entry.category === categoryFilter;

    return matchesSearch && matchesType && matchesCategory;
  });

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'client_fee': return 'ग्राहक रजिस्ट्री फीस';
      case 'drafting_fee': return 'विलेख टाइपिंग फीस';
      case 'stamp_vendor': return 'स्टाम्प पेपर / ई-स्टाम्प';
      case 'stationery_typing': return 'ग्रीन शीट / स्टेशनरी';
      case 'sub_registrar_misc': return 'कलेक्ट्रेट / पेशी व्यय';
      case 'fuel_travel': return 'पेट्रोल / यात्रा';
      case 'office_tea_misc': return 'कार्यालय चाय / विविध';
      default: return 'अन्य';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-[#0B1B3D] flex items-center gap-2">
            <Wallet className="w-7 h-7 text-amber-500" />
            दैनिक आय-व्यय खाता व हिसाब (Accounts & Ledger)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            कार्यालय आय, रजिस्ट्री फीस, स्टाम्प व्यय, टाइपिंग एवं दैनिक खर्चों का सम्पूर्ण ब्योरा
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-300 shadow-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600" /> लेजर खाता प्रिंट करें
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-[#0B1B3D] hover:bg-[#162E66] text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" /> नई प्रविष्टि दर्ज करें
          </button>
        </div>
      </div>

      {/* KPI Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Income */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            <span>कुल प्राप्त आय (Receipts)</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700">
            ₹{totalIncome.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">क्लाइंट फीस व अग्रिम भुगतान</p>
        </div>

        {/* Total Expenses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            <span>कुल कार्यालय व्यय (Expenses)</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-700">
            ₹{totalExpense.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">स्टाम्प, ग्रीन शीट व पेशी खर्च</p>
        </div>

        {/* Net Profit */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            <span>शुद्ध बचत / लाभ (Net Balance)</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-black ${netProfit >= 0 ? 'text-[#0B1B3D]' : 'text-rose-600'}`}>
            ₹{netProfit.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">आय में से व्यय घटाकर</p>
        </div>

        {/* Client Receivables */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            <span>ग्राहकों से कुल बकाया (Receivables)</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600">
            ₹{totalPendingBalance.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">शेष देय राशि</p>
        </div>

      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="विवरण, ग्राहक या केस नंबर खोजें..."
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2 pl-9 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Type filter */}
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1 rounded-lg cursor-pointer ${typeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
            >
              सभी
            </button>
            <button
              onClick={() => setTypeFilter('income')}
              className={`px-3 py-1 rounded-lg cursor-pointer ${typeFilter === 'income' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'}`}
            >
              आवक (+)
            </button>
            <button
              onClick={() => setTypeFilter('expense')}
              className={`px-3 py-1 rounded-lg cursor-pointer ${typeFilter === 'expense' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600'}`}
            >
              व्यय (-)
            </button>
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800"
          >
            <option value="all">सभी श्रेणियाँ</option>
            <option value="client_fee">ग्राहक रजिस्ट्री फीस</option>
            <option value="drafting_fee">विलेख टाइपिंग फीस</option>
            <option value="stamp_vendor">स्टाम्प पेपर / ई-स्टाम्प</option>
            <option value="stationery_typing">ग्रीन शीट / स्टेशनरी</option>
            <option value="sub_registrar_misc">कलेक्ट्रेट / पेशी व्यय</option>
            <option value="fuel_travel">पेट्रोल / यात्रा</option>
            <option value="office_tea_misc">कार्यालय चाय / विविध</option>
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="printable-card bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#0B1B3D]">
            दैनिक लेन-देन विवरण (Ledger Transactions)
          </h3>
          <span className="text-xs text-slate-500">कुल प्रविष्टियाँ: {filteredEntries.length}</span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-xs text-slate-500">लोड हो रहा है...</div>
        ) : filteredEntries.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-500">कोई लेन-देन नहीं मिला।</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">दिनांक</th>
                  <th className="py-3 px-4">प्रकार</th>
                  <th className="py-3 px-4">श्रेणी</th>
                  <th className="py-3 px-4">ग्राहक / केस</th>
                  <th className="py-3 px-4">विवरण</th>
                  <th className="py-3 px-4">माध्यम</th>
                  <th className="py-3 px-4 text-right">राशि (₹)</th>
                  <th className="py-3 px-4 text-center no-print">क्रिया</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                      {entry.date}
                    </td>
                    <td className="py-3 px-4">
                      {entry.type === 'income' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold text-[10px] border border-emerald-200">
                          <ArrowDownRight className="w-3 h-3" /> आवक
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full font-bold text-[10px] border border-rose-200">
                          <ArrowUpRight className="w-3 h-3" /> व्यय
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {getCategoryLabel(entry.category)}
                    </td>
                    <td className="py-3 px-4">
                      {entry.clientName ? (
                        <div>
                          <div className="font-bold text-slate-800">{entry.clientName}</div>
                          {entry.caseNumber && (
                            <span className="text-[10px] text-slate-400 font-mono">{entry.caseNumber}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-700 max-w-xs">
                      {entry.description}
                    </td>
                    <td className="py-3 px-4 uppercase text-[11px] font-semibold text-slate-600">
                      {entry.paymentMode}
                    </td>
                    <td className={`py-3 px-4 text-right font-black text-sm ${entry.type === 'income' ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {entry.type === 'income' ? '+' : '-'}₹{Number(entry.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-center no-print">
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        title="हटाएं"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <h3 className="text-base font-bold text-[#0B1B3D]">
                नई आय / व्यय प्रविष्टि दर्ज करें
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEntry} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">दिनांक</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">प्रकार (Type)</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-800"
                  >
                    <option value="income">आवक (Income / Receipt)</option>
                    <option value="expense">व्यय (Expense / Payout)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">श्रेणी (Category)</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                  >
                    <option value="client_fee">ग्राहक रजिस्ट्री फीस</option>
                    <option value="drafting_fee">विलेख टाइपिंग फीस</option>
                    <option value="stamp_vendor">स्टाम्प पेपर / ई-स्टाम्प</option>
                    <option value="stationery_typing">ग्रीन शीट / स्टेशनरी</option>
                    <option value="sub_registrar_misc">कलेक्ट्रेट / पेशी व्यय</option>
                    <option value="fuel_travel">पेट्रोल / यात्रा</option>
                    <option value="office_tea_misc">कार्यालय चाय / विविध</option>
                    <option value="other">अन्य</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">रकम (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.amount || ''}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-extrabold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ग्राहक का नाम (वैकल्पिक)</label>
                  <input
                    type="text"
                    value={formData.clientName || ''}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="ग्राहक का नाम"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">भुगतान माध्यम</label>
                  <select
                    value={formData.paymentMode}
                    onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                  >
                    <option value="cash">नकद (Cash)</option>
                    <option value="upi">UPI</option>
                    <option value="bank_transfer">बैंक ट्रांसफर (RTGS/NEFT)</option>
                    <option value="cheque">चेक</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">विवरण (Description) *</label>
                <input
                  type="text"
                  required
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="उदा. अग्रिम ई-स्टाम्प चालान व टाइपिंग शुल्क..."
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#0B1B3D] hover:bg-[#162E66] text-white text-xs font-bold shadow-md"
                >
                  सहेजें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
