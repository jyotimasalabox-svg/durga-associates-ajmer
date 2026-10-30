'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminCalculator from '@/components/admin/AdminCalculator';
import AdminClientManager from '@/components/admin/AdminClientManager';
import AdminDocumentDrafter from '@/components/admin/AdminDocumentDrafter';
import AdminLedger from '@/components/admin/AdminLedger';
import AdminRatesManager from '@/components/admin/AdminRatesManager';
import AdminInquiries from '@/components/admin/AdminInquiries';
import { ClientRecord, PublicInquiry, RateRule } from '@/lib/types';
import { 
  Calculator, 
  Users, 
  FileSignature, 
  Wallet, 
  Scale, 
  Inbox, 
  Lock, 
  LogOut, 
  ExternalLink, 
  ShieldCheck, 
  KeyRound, 
  AlertCircle,
  CheckCircle2,
  Phone,
  Home
} from 'lucide-react';

type AdminTab = 'calculator' | 'clients' | 'drafter' | 'ledger' | 'rates' | 'inquiries';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<AdminTab>('calculator');

  // Cross-tab transfer states
  const [prefillClientData, setPrefillClientData] = useState<Partial<ClientRecord> | null>(null);
  const [drafterClient, setDrafterClient] = useState<ClientRecord | null>(null);
  const [customRates, setCustomRates] = useState<Record<string, RateRule> | undefined>(undefined);

  // Security PIN change modal
  const [showPinModal, setShowPinModal] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [pinMsg, setPinMsg] = useState({ text: '', isError: false });

  useEffect(() => {
    const token = localStorage.getItem('durga_admin_token');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsCheckingAuth(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('durga_admin_token');
    localStorage.removeItem('durga_admin_login_time');
    setIsAuthenticated(false);
  };

  const handleSaveCalculatorAsClient = (prefill: any) => {
    setPrefillClientData(prefill);
    setActiveTab('clients');
  };

  const handleOpenDraftForClient = (client: ClientRecord) => {
    setDrafterClient(client);
    setActiveTab('drafter');
  };

  const handleConvertInquiryToClient = (inq: PublicInquiry) => {
    setPrefillClientData({
      clientName: inq.fullName,
      phone: inq.phone,
      email: inq.email || '',
      propertyDetails: {
        colonyOrLocality: inq.propertyLocation || 'अजमेर',
        plotOrKhasraNo: '',
        city: 'अजमेर',
        registrySubRegistrar: 'उप-पंजीयक कार्यालय अजमेर प्रथम (कलेक्ट्री परिसर)',
        areaSqYard: 150,
        dlcRate: 12000,
        dlcTotal: 1800000,
        considerationValue: 2000000,
        boundaries: { north: '', south: '', east: '', west: '' }
      },
      notes: inq.message ? `पूछताछ विवरण: ${inq.message}` : ''
    });
    setActiveTab('clients');
  };

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinMsg({ text: '', isError: false });

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'change_pin', pin: currentPin, newPin })
      });
      const data = await res.json();
      if (data.success) {
        setPinMsg({ text: 'सुरक्षा पिन सफलतापूर्वक बदल दिया गया', isError: false });
        setTimeout(() => {
          setShowPinModal(false);
          setCurrentPin('');
          setNewPin('');
          setPinMsg({ text: '', isError: false });
        }, 1500);
      } else {
        setPinMsg({ text: data.error || 'त्रुटि हुई', isError: true });
      }
    } catch (err) {
      setPinMsg({ text: 'सर्वर त्रुटि', isError: true });
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white text-xs">
        सत्यापन किया जा रहा है...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex flex-col justify-between">
        <header className="bg-[#0B1B3D] text-white p-4 shadow-md flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-base hover:text-amber-300 transition">
            <Home className="w-4 h-4 text-amber-400" />
            <span>दुर्गा एसोसिएट्स एंड प्रॉपर्टी डीलर, अजमेर</span>
          </Link>
          <Link
            href="/"
            className="text-xs text-slate-300 hover:text-white flex items-center gap-1"
          >
            ← मुख्य वेबसाइट पर जाएँ
          </Link>
        </header>

        <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />

        <footer className="text-center py-4 text-xs text-slate-500">
          दुर्गा एसोसिएट्स • अजमेर (राज.) | संपर्क: 9829261354, 8003987152
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Top Admin Navigation Header */}
      <header className="no-print sticky top-0 z-40 bg-[#0B1B3D] text-white shadow-xl border-b border-amber-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand Title */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-extrabold text-xl shadow">
                द
              </div>
              <div>
                <div className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
                  <span>दुर्गा एसोसिएट्स</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700/50">
                    एडमिन पोर्टल
                  </span>
                </div>
                <div className="text-[11px] text-slate-300">
                  अजमेर कलेक्ट्रेट एवं सब-रजिस्ट्रार सहायता • 9829261354 / 8003987152
                </div>
              </div>
            </div>

            {/* Right Tools: Security, View Site, Logout */}
            <div className="flex items-center gap-2.5">
              <Link
                href="/"
                target="_blank"
                className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700"
                title="मुख्य वेबसाइट देखें"
              >
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                <span>वेबसाइट देखें</span>
              </Link>

              <button
                onClick={() => setShowPinModal(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700 cursor-pointer"
                title="पिन बदलें"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">पिन बदलें</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-xs font-semibold transition border border-rose-500/40 cursor-pointer"
                title="लॉगआउट"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">लॉगआउट</span>
              </button>
            </div>

          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 border-t border-slate-800 text-xs font-bold scrollbar-none">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
                activeTab === 'calculator'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>स्मार्ट कैलकुलेटर</span>
            </button>

            <button
              onClick={() => setActiveTab('clients')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
                activeTab === 'clients'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>ग्राहक व केस (CRM)</span>
            </button>

            <button
              onClick={() => setActiveTab('drafter')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
                activeTab === 'drafter'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileSignature className="w-4 h-4" />
              <span>दस्तावेज़ ड्राफ्टर</span>
            </button>

            <button
              onClick={() => setActiveTab('ledger')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
                activeTab === 'ledger'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>आय-व्यय व लेजर</span>
            </button>

            <button
              onClick={() => setActiveTab('rates')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
                activeTab === 'rates'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>राजस्थान दर व नियम</span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
                activeTab === 'inquiries'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Inbox className="w-4 h-4" />
              <span>वेबसाइट पूछताछ</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'calculator' && (
          <AdminCalculator
            rates={customRates}
            onSaveAsClient={handleSaveCalculatorAsClient}
          />
        )}

        {activeTab === 'clients' && (
          <AdminClientManager
            onOpenDraft={handleOpenDraftForClient}
            prefillClient={prefillClientData}
            onClearPrefill={() => setPrefillClientData(null)}
          />
        )}

        {activeTab === 'drafter' && (
          <AdminDocumentDrafter initialClient={drafterClient} />
        )}

        {activeTab === 'ledger' && (
          <AdminLedger />
        )}

        {activeTab === 'rates' && (
          <AdminRatesManager onRatesUpdated={(r) => setCustomRates(r)} />
        )}

        {activeTab === 'inquiries' && (
          <AdminInquiries onConvertToClient={handleConvertInquiryToClient} />
        )}
      </main>

      {/* Change Security PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <h3 className="text-base font-bold text-[#0B1B3D] flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-amber-500" />
                एडमिन सुरक्षा पिन बदलें
              </h3>
              <button
                onClick={() => setShowPinModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleChangePin} className="space-y-4">
              {pinMsg.text && (
                <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${pinMsg.isError ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                  {pinMsg.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                  <span>{pinMsg.text}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  वर्तमान पिन (Current PIN)
                </label>
                <input
                  type="password"
                  required
                  value={currentPin}
                  onChange={(e) => setCurrentPin(e.target.value)}
                  placeholder="वर्तमान पिन"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  नया पिन (New PIN - न्यूनतम 4 अंक)
                </label>
                <input
                  type="password"
                  required
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="नया पिन दर्ज करें"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0B1B3D] text-white text-xs font-bold shadow-md"
                >
                  पिन अपडेट करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="no-print bg-slate-900 text-slate-400 text-xs py-4 text-center border-t border-slate-800">
        दुर्गा एसोसिएट्स एंड प्रॉपर्टी डीलर, अजमेर • कलेक्ट्री परिसर एवं सब-रजिस्ट्रार कार्यालय • फोन: 9829261354, 8003987152
      </footer>
    </div>
  );
}
