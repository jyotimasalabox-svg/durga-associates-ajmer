'use client';

import React, { useState, useEffect } from 'react';
import { ClientRecord, DocTypeKey } from '@/lib/types';
import { generateLegalDraft } from '@/lib/legalTemplates';
import { 
  FileSignature, 
  Printer, 
  Copy, 
  Check, 
  CheckSquare, 
  RefreshCw, 
  Download, 
  ShieldAlert, 
  Scale,
  Sparkles,
  FileText
} from 'lucide-react';

interface Props {
  initialClient?: ClientRecord | null;
}

export default function AdminDocumentDrafter({ initialClient }: Props) {
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>(initialClient?.id || '');
  const [activeClient, setActiveClient] = useState<ClientRecord | null>(initialClient || null);

  const [docType, setDocType] = useState<DocTypeKey>(initialClient?.docType || 'sale_deed');
  const [draftTitle, setDraftTitle] = useState<string>('');
  const [draftText, setDraftText] = useState<string>('');
  const [checklist, setChecklist] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'draft' | 'checklist'>('draft');
  const [copied, setCopied] = useState(false);

  // Fetch client list
  useEffect(() => {
    fetch('/api/clients')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.clients) {
          setClients(data.clients);
          if (!activeClient && data.clients.length > 0) {
            setActiveClient(data.clients[0]);
            setSelectedClientId(data.clients[0].id);
          }
        }
      })
      .catch(err => console.error(err));
  }, []);

  // When initialClient changes
  useEffect(() => {
    if (initialClient) {
      setActiveClient(initialClient);
      setSelectedClientId(initialClient.id);
      setDocType(initialClient.docType);
    }
  }, [initialClient]);

  // When active client or docType changes, re-generate draft
  useEffect(() => {
    if (activeClient) {
      const clientWithDeed: ClientRecord = {
        ...activeClient,
        docType
      };
      const res = generateLegalDraft(clientWithDeed);
      setDraftTitle(res.title);
      setDraftText(res.content);
      setChecklist(res.checklist);
    } else {
      // Dummy empty record
      const dummyClient: ClientRecord = {
        id: 'temp',
        caseNumber: 'DA-AJM-TEMP',
        clientName: 'श्री [क्रेता का नाम]',
        fatherOrHusbandName: 'श्री [पिता/पति का नाम]',
        phone: '9829261354',
        address: 'अजमेर, राजस्थान',
        docType,
        areaType: 'urban',
        propertyDetails: {
          plotOrKhasraNo: 'प्लॉट सं. [संख्या]',
          colonyOrLocality: '[कॉलोनी / क्षेत्र], अजमेर',
          city: 'अजमेर',
          registrySubRegistrar: 'उप-पंजीयक कार्यालय अजमेर प्रथम (कलेक्ट्री परिसर)',
          areaSqYard: 150,
          dlcRate: 12000,
          dlcTotal: 1800000,
          considerationValue: 2000000,
          boundaries: {
            north: 'अन्य संपत्ति',
            south: 'अन्य भूखंड',
            east: '30 फीट चौड़ा रास्ता',
            west: 'पड़ोसी'
          }
        },
        status: 'inquiry',
        fees: {
          govtStamp: 0,
          govtSurcharge: 0,
          govtReg: 0,
          govtScanning: 300,
          totalGovt: 0,
          officeDrafting: 3000,
          officeService: 2000,
          totalOffice: 5000,
          grandTotal: 5000,
          paidAmount: 0,
          balanceAmount: 5000,
          paymentMode: 'cash',
          paymentStatus: 'unpaid'
        },
        createdAt: '',
        updatedAt: ''
      };
      const res = generateLegalDraft(dummyClient);
      setDraftTitle(res.title);
      setDraftText(res.content);
      setChecklist(res.checklist);
    }
  }, [activeClient, docType]);

  const handleSelectClient = (id: string) => {
    setSelectedClientId(id);
    const found = clients.find(c => c.id === id);
    if (found) {
      setActiveClient(found);
      setDocType(found.docType);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(draftText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-[#0B1B3D] flex items-center gap-2">
            <FileSignature className="w-7 h-7 text-amber-500" />
            दस्तावेज़ प्रारूप जनरेटर (Legal Deed Drafter)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            ग्राहक और प्रॉपर्टी विवरण के आधार पर राजस्थान रजिस्ट्री हेतु पूर्ण वैधानिक विलेख प्रारूप तैयार करें
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-300 shadow-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" /> कॉपी हो गया!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-600" /> प्रारूप कॉपी करें
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-[#0B1B3D] hover:bg-[#162E66] text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-400" /> विलेख / चेकलिस्ट प्रिंट करें
          </button>
        </div>
      </div>

      {/* Control Strip */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        {/* Client Selection */}
        <div className="sm:col-span-5">
          <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
            ग्राहक केस चुनें (Select Client Record)
          </label>
          <select
            value={selectedClientId}
            onChange={(e) => handleSelectClient(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {clients.map(c => (
              <option key={c.id} value={c.id}>
                {c.caseNumber} - {c.clientName} ({c.propertyDetails.colonyOrLocality || 'अजमेर'})
              </option>
            ))}
          </select>
        </div>

        {/* Deed Type */}
        <div className="sm:col-span-4">
          <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
            विलेख प्रारूप प्रकार (Deed Template)
          </label>
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value as DocTypeKey)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="sale_deed">विक्रय पत्र (बैनामा / Sale Deed)</option>
            <option value="gift_deed_family">दान पत्र (Gift Deed - पारिवारिक)</option>
            <option value="gift_deed_other">दान पत्र (Gift Deed - अन्य)</option>
            <option value="release_deed">हकत्याग पत्र (Release Deed)</option>
            <option value="agreement_to_sell_possession">इकरारनामा बैनामा (कब्ज़ा सहित)</option>
            <option value="will">वसीयतनामा (Will Deed)</option>
            <option value="lease_deed">पट्टा विलेख / लीज डीड (Lease)</option>
          </select>
        </div>

        {/* View Switcher */}
        <div className="sm:col-span-3 flex justify-end gap-1.5 self-end">
          <button
            onClick={() => setActiveTab('draft')}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'draft'
                ? 'bg-[#0B1B3D] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" /> विलेख प्रारूप
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'checklist'
                ? 'bg-[#0B1B3D] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5 text-emerald-400" /> चेकलिस्ट ({checklist.length})
          </button>
        </div>
      </div>

      {/* Advisory Notice */}
      <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">वैधानिक सूचना: </strong>
          यह प्रारूप राजस्थान ई-पंजीयन एवं मुद्रांक अधिनियम के मानक विधिक प्रावधानों पर आधारित है। इसे सब-रजिस्ट्रार पेशी से पूर्व आवश्यक कानूनी जाँच, ग्रीन शीट टाइपिंग एवं दोनों पक्षों के अंतिम अनुमोदन हेतु प्रयोग करें।
        </div>
      </div>

      {/* Editor & Content Area */}
      {activeTab === 'draft' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="text-base font-extrabold text-[#0B1B3D] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              {draftTitle}
            </h3>
            <span className="text-xs text-slate-500">
              संपादकीय मोड (लाइव संपादन योग्य - Live Editable Text)
            </span>
          </div>

          <textarea
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            rows={24}
            className="printable-card w-full font-mono text-xs sm:text-sm text-slate-900 bg-slate-50/50 p-5 rounded-xl border border-slate-300 leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      ) : (
        <div className="printable-card bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="text-center pb-4 border-b-2 border-slate-900">
            <h3 className="text-xl font-black text-[#0B1B3D]">दुर्गा एसोसिएट्स एंड प्रॉपर्टी डीलर, अजमेर</h3>
            <p className="text-xs font-semibold text-slate-600">
              सब-रजिस्ट्रार कार्यालय पेशी पूर्व अनिवार्य दस्तावेज़ चेकलिस्ट
            </p>
            {activeClient && (
              <p className="text-xs font-bold text-amber-800 mt-1">
                केस: {activeClient.caseNumber} • ग्राहक: {activeClient.clientName} ({activeClient.propertyDetails.colonyOrLocality})
              </p>
            )}
          </div>

          <div className="space-y-3">
            {checklist.map((item, index) => (
              <label
                key={index}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 flex items-start gap-3 text-xs sm:text-sm text-slate-800 cursor-pointer"
              >
                <input
                  type="checkbox"
                  defaultChecked={false}
                  className="w-4 h-4 mt-0.5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <span className="leading-snug">{item}</span>
              </label>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>सत्यापन दिनांक: {new Date().toLocaleDateString('hi-IN')}</span>
            <span>दुर्गा एसोसिएट्स अजमेर (फोन: 9829261354, 8003987152)</span>
          </div>
        </div>
      )}

    </div>
  );
}
