'use client';

import React, { useState, useEffect } from 'react';
import { ClientRecord, CaseStatus, DocTypeKey, AreaType } from '@/lib/types';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  FileText, 
  Printer, 
  Phone, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Calendar,
  Building,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Receipt
} from 'lucide-react';

interface Props {
  onOpenDraft?: (client: ClientRecord) => void;
  prefillClient?: Partial<ClientRecord> | null;
  onClearPrefill?: () => void;
}

export default function AdminClientManager({ onOpenDraft, prefillClient, onClearPrefill }: Props) {
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientRecord | null>(null);
  const [receiptClient, setReceiptClient] = useState<ClientRecord | null>(null);

  // Form State
  const defaultClientForm: ClientRecord = {
    id: '',
    caseNumber: '',
    clientName: '',
    fatherOrHusbandName: '',
    phone: '',
    secondaryPhone: '',
    email: '',
    address: 'अजमेर, राजस्थान',
    docType: 'sale_deed',
    areaType: 'urban',
    propertyDetails: {
      plotOrKhasraNo: '',
      colonyOrLocality: '',
      city: 'अजमेर',
      registrySubRegistrar: 'उप-पंजीयक कार्यालय अजमेर प्रथम (कलेक्ट्री परिसर)',
      areaSqYard: 150,
      dlcRate: 12000,
      dlcTotal: 1800000,
      considerationValue: 2000000,
      boundaries: {
        north: '',
        south: '',
        east: '',
        west: ''
      }
    },
    sellerDetails: {
      name: '',
      fatherName: '',
      address: '',
      phone: '',
      aadhaarOrPan: ''
    },
    buyerDetails: {
      name: '',
      fatherName: '',
      address: '',
      phone: '',
      gender: 'male',
      aadhaarOrPan: ''
    },
    paymentChequeDetails: {
      chequeNo: '',
      bankName: '',
      date: new Date().toISOString().split('T')[0],
      amount: 0
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
    registryDate: '',
    notes: '',
    createdAt: '',
    updatedAt: ''
  };

  const [formData, setFormData] = useState<ClientRecord>(defaultClientForm);

  // Load clients
  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/clients');
      const data = await res.json();
      if (data.success && data.clients) {
        setClients(data.clients);
      }
    } catch (err) {
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Handle prefilled client from calculator or inquiry
  useEffect(() => {
    if (prefillClient) {
      setFormData({
        ...defaultClientForm,
        ...prefillClient,
        clientName: prefillClient.clientName || '',
        docType: prefillClient.docType || 'sale_deed',
        areaType: prefillClient.areaType || 'urban',
        propertyDetails: {
          ...defaultClientForm.propertyDetails,
          ...(prefillClient.propertyDetails || {})
        },
        fees: {
          ...defaultClientForm.fees,
          ...(prefillClient.fees || {})
        }
      });
      setEditingClient(null);
      setShowFormModal(true);
      if (onClearPrefill) onClearPrefill();
    }
  }, [prefillClient]);

  const handleOpenAdd = () => {
    setEditingClient(null);
    setFormData(defaultClientForm);
    setShowFormModal(true);
  };

  const handleOpenEdit = (client: ClientRecord) => {
    setEditingClient(client);
    setFormData(JSON.parse(JSON.stringify(client)));
    setShowFormModal(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`क्या आप वाकई ग्राहक रिकॉर्ड "${name}" हटाना चाहते हैं?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/clients?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchClients();
      } else {
        alert(data.error || 'त्रुटि हुई');
      }
    } catch (err) {
      alert('सर्वर त्रुटि');
    }
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.phone) {
      alert('कृपया ग्राहक का नाम और मोबाइल नंबर अवश्य भरें');
      return;
    }

    // Auto-calculate fee totals
    const totalGovt = 
      Number(formData.fees.govtStamp || 0) + 
      Number(formData.fees.govtSurcharge || 0) + 
      Number(formData.fees.govtReg || 0) + 
      Number(formData.fees.govtScanning || 0);

    const totalOffice = 
      Number(formData.fees.officeDrafting || 0) + 
      Number(formData.fees.officeService || 0);

    const grandTotal = totalGovt + totalOffice;
    const paidAmount = Number(formData.fees.paidAmount || 0);
    const balanceAmount = Math.max(0, grandTotal - paidAmount);
    
    let paymentStatus: 'unpaid' | 'partial' | 'paid' = 'unpaid';
    if (paidAmount >= grandTotal && grandTotal > 0) {
      paymentStatus = 'paid';
    } else if (paidAmount > 0) {
      paymentStatus = 'partial';
    }

    const updatedFormData: ClientRecord = {
      ...formData,
      fees: {
        ...formData.fees,
        totalGovt,
        totalOffice,
        grandTotal,
        paidAmount,
        balanceAmount,
        paymentStatus
      }
    };

    try {
      const method = editingClient ? 'PUT' : 'POST';
      const res = await fetch('/api/clients', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFormData)
      });
      const data = await res.json();
      if (data.success) {
        setShowFormModal(false);
        fetchClients();
      } else {
        alert(data.error || 'त्रुटि हुई');
      }
    } catch (err) {
      alert('सर्वर से संपर्क नहीं हो सका');
    }
  };

  // Filter clients
  const filteredClients = clients.filter(c => {
    const matchesSearch = 
      c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.propertyDetails.colonyOrLocality.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || c.fees.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getStatusBadge = (status: CaseStatus) => {
    switch (status) {
      case 'inquiry':
        return <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">आरंभिक पूछताछ</span>;
      case 'docs_collection':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded text-[11px] font-medium">कागजात संकलन</span>;
      case 'draft_ready':
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded text-[11px] font-medium">विलेख प्रारूप तैयार</span>;
      case 'challan_generated':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-medium">ई-चालान जनरेट</span>;
      case 'registry_scheduled':
        return <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded text-[11px] font-semibold">सब-रजिस्ट्रार पेशी तय</span>;
      case 'completed':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-bold">रजिस्ट्री पूर्ण</span>;
      case 'cancelled':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded text-[11px] font-medium">रद्द</span>;
      default:
        return <span>{status}</span>;
    }
  };

  const getPaymentBadge = (status: 'unpaid' | 'partial' | 'paid', balance: number) => {
    if (status === 'paid') {
      return <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">पूर्ण चुकता (Paid)</span>;
    }
    if (status === 'partial') {
      return (
        <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[10px] font-bold">
          आंशिक प्राप्त (बकाया: ₹{balance.toLocaleString('en-IN')})
        </span>
      );
    }
    return <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded text-[10px] font-bold">बकाया (Unpaid)</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-[#0B1B3D] flex items-center gap-2">
            <Users className="w-7 h-7 text-amber-500" />
            ग्राहक व रजिस्ट्री केस प्रबंधन (CRM)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            प्रत्येक रजिस्ट्री केस की स्थिति, फीस, भुगतान, बकाया रकम एवं विलेख ड्राफ्टिंग रिकॉर्ड
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-[#0B1B3D] hover:bg-[#162E66] text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-amber-400" /> नया केस दर्ज करें
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="नाम, मोबाइल, केस नं. या कॉलोनी खोजें..."
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2 pl-9 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-800"
            >
              <option value="all">सभी स्थितियाँ (All Status)</option>
              <option value="inquiry">आरंभिक पूछताछ</option>
              <option value="docs_collection">कागजात संकलन</option>
              <option value="draft_ready">विलेख प्रारूप तैयार</option>
              <option value="challan_generated">ई-चालान जनरेट</option>
              <option value="registry_scheduled">सब-रजिस्ट्रार पेशी तय</option>
              <option value="completed">रजिस्ट्री पूर्ण</option>
            </select>
          </div>

          {/* Payment Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-800"
          >
            <option value="all">सभी भुगतान (All Payments)</option>
            <option value="paid">पूर्ण चुकता (Paid)</option>
            <option value="partial">आंशिक बकाया (Partial)</option>
            <option value="unpaid">अदत्त (Unpaid)</option>
          </select>
        </div>
      </div>

      {/* Clients List Cards */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
          ग्राहक रिकॉर्ड लोड हो रहे हैं...
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
          कोई रिकॉर्ड नहीं मिला। नया केस जोड़ने के लिए ऊपर दिए बटन पर क्लिक करें।
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-amber-400 p-5 shadow-xs transition-all flex flex-col justify-between space-y-4"
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {client.caseNumber}
                  </span>
                  {getStatusBadge(client.status)}
                </div>

                <h3 className="text-base font-extrabold text-[#0B1B3D] leading-tight">
                  {client.clientName}
                </h3>
                {client.fatherOrHusbandName && (
                  <p className="text-xs text-slate-500">
                    आत्मज/पत्नी: {client.fatherOrHusbandName}
                  </p>
                )}

                <div className="mt-2.5 flex items-center gap-2 text-xs text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <a href={`tel:${client.phone}`} className="hover:underline font-semibold">
                    {client.phone}
                  </a>
                  {client.secondaryPhone && (
                    <span className="text-slate-400">/ {client.secondaryPhone}</span>
                  )}
                </div>
              </div>

              {/* Property & Sub-Registrar details */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">विलेख:</span>
                  <span className="font-bold text-slate-800">
                    {client.docType === 'sale_deed' ? 'विक्रय पत्र (बैनामा)' :
                     client.docType === 'gift_deed_family' ? 'दान पत्र (पारिवारिक)' :
                     client.docType === 'release_deed' ? 'हकत्याग पत्र' : client.docType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">संपत्ति:</span>
                  <span className="font-medium text-slate-800 truncate max-w-[170px]" title={client.propertyDetails.colonyOrLocality}>
                    {client.propertyDetails.plotOrKhasraNo || ''} {client.propertyDetails.colonyOrLocality || 'अजमेर'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">क्षेत्रफल:</span>
                  <span className="font-semibold text-slate-800">
                    {client.propertyDetails.areaSqYard} वर्ग गज
                  </span>
                </div>
                {client.registryDate && (
                  <div className="flex justify-between text-indigo-700 font-medium pt-1 border-t border-slate-200">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> पेशी तारीख:
                    </span>
                    <span>{client.registryDate}</span>
                  </div>
                )}
              </div>

              {/* Fee & Balance Summary */}
              <div className="pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-slate-500">कुल फीस (Govt + Office):</span>
                  <span className="font-bold text-slate-900">
                    ₹{client.fees.grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">भुगतान स्थिति:</span>
                  {getPaymentBadge(client.fees.paymentStatus, client.fees.balanceAmount)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                <button
                  onClick={() => onOpenDraft && onOpenDraft(client)}
                  className="py-1.5 px-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold flex items-center justify-center gap-1 transition"
                  title="दस्तावेज़ ड्राफ्ट तैयार करें"
                >
                  <FileText className="w-3.5 h-3.5" /> विलेख ड्राफ्ट
                </button>

                <button
                  onClick={() => setReceiptClient(client)}
                  className="py-1.5 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold flex items-center justify-center gap-1 transition"
                  title="भुगतान रसीद प्रिंट करें"
                >
                  <Receipt className="w-3.5 h-3.5" /> रसीद प्रिंट
                </button>

                <button
                  onClick={() => handleOpenEdit(client)}
                  className="py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center justify-center gap-1 transition"
                >
                  <Edit className="w-3.5 h-3.5" /> विवरण / एडिट
                </button>

                <button
                  onClick={() => handleDelete(client.id, client.clientName)}
                  className="py-1.5 px-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold flex items-center justify-center gap-1 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" /> हटाएं
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Client Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
              <h3 className="text-lg font-black text-[#0B1B3D]">
                {editingClient ? `केस विवरण संपादित करें (${formData.caseNumber})` : 'नया ग्राहक / रजिस्ट्री केस दर्ज करें'}
              </h3>
              <button
                onClick={() => setShowFormModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-6">
              
              {/* Section 1: Client & Basic Info */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 border-b border-slate-100 pb-1.5">
                  1. मुख्य ग्राहक विवरण
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ग्राहक का पूरा नाम *</label>
                    <input
                      type="text"
                      required
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      placeholder="श्री / श्रीमती..."
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">पिता / पति का नाम</label>
                    <input
                      type="text"
                      value={formData.fatherOrHusbandName}
                      onChange={(e) => setFormData({ ...formData, fatherOrHusbandName: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">मोबाइल नंबर *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-900"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">स्थाई पता (Address)</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">केस स्थिति (Status)</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as CaseStatus })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-900"
                    >
                      <option value="inquiry">आरंभिक पूछताछ (Inquiry)</option>
                      <option value="docs_collection">कागजात संकलन (Docs Collection)</option>
                      <option value="draft_ready">विलेख प्रारूप तैयार (Draft Ready)</option>
                      <option value="challan_generated">ई-चालान जनरेट (Challan Done)</option>
                      <option value="registry_scheduled">सब-रजिस्ट्रार पेशी तय (Scheduled)</option>
                      <option value="completed">रजिस्ट्री पूर्ण (Completed)</option>
                      <option value="cancelled">रद्द (Cancelled)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Property & Location */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 border-b border-slate-100 pb-1.5">
                  2. संपत्ति एवं उप-पंजीयक क्षेत्राधिकार
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">विलेख प्रकार (Deed Type)</label>
                    <select
                      value={formData.docType}
                      onChange={(e) => setFormData({ ...formData, docType: e.target.value as DocTypeKey })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-900"
                    >
                      <option value="sale_deed">विक्रय पत्र (Sale Deed)</option>
                      <option value="gift_deed_family">दान पत्र (पारिवारिक)</option>
                      <option value="gift_deed_other">दान पत्र (अन्य)</option>
                      <option value="release_deed">हकत्याग पत्र (Release Deed)</option>
                      <option value="agreement_to_sell_possession">इकरारनामा (कब्ज़ा सहित)</option>
                      <option value="lease_deed">पट्टा विलेख (Lease)</option>
                      <option value="will">वसीयतनामा (Will)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">उप-पंजीयक कार्यालय (Sub-Registrar)</label>
                    <select
                      value={formData.propertyDetails.registrySubRegistrar}
                      onChange={(e) => setFormData({
                        ...formData,
                        propertyDetails: { ...formData.propertyDetails, registrySubRegistrar: e.target.value }
                      })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-900"
                    >
                      <option value="उप-पंजीयक कार्यालय अजमेर प्रथम (कलेक्ट्री परिसर)">अजमेर प्रथम (कलेक्ट्री परिसर)</option>
                      <option value="उप-पंजीयक कार्यालय अजमेर द्वितीय (तोपदड़ा/बस स्टैंड)">अजमेर द्वितीय (तोपदड़ा)</option>
                      <option value="उप-पंजीयक कार्यालय किशनगढ़">किशनगढ़</option>
                      <option value="उप-पंजीयक कार्यालय पुष्कर">पुष्कर</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">पेशी / रजिस्ट्री संभावित तिथि</label>
                    <input
                      type="date"
                      value={formData.registryDate || ''}
                      onChange={(e) => setFormData({ ...formData, registryDate: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">प्लॉट / खसरा संख्या</label>
                    <input
                      type="text"
                      value={formData.propertyDetails.plotOrKhasraNo}
                      onChange={(e) => setFormData({
                        ...formData,
                        propertyDetails: { ...formData.propertyDetails, plotOrKhasraNo: e.target.value }
                      })}
                      placeholder="उदा. प्लॉट नं. 24, खसरा सं. 512"
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">कॉलोनी / क्षेत्र (अजमेर)</label>
                    <input
                      type="text"
                      value={formData.propertyDetails.colonyOrLocality}
                      onChange={(e) => setFormData({
                        ...formData,
                        propertyDetails: { ...formData.propertyDetails, colonyOrLocality: e.target.value }
                      })}
                      placeholder="उदा. वैशाली नगर, पंचशील..."
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">क्षेत्रफल (वर्ग गज)</label>
                    <input
                      type="number"
                      value={formData.propertyDetails.areaSqYard || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        propertyDetails: { ...formData.propertyDetails, areaSqYard: Number(e.target.value) }
                      })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-900"
                    />
                  </div>
                </div>

                {/* Boundaries */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">पूर्व (East)</label>
                    <input
                      type="text"
                      value={formData.propertyDetails.boundaries.east}
                      onChange={(e) => setFormData({
                        ...formData,
                        propertyDetails: {
                          ...formData.propertyDetails,
                          boundaries: { ...formData.propertyDetails.boundaries, east: e.target.value }
                        }
                      })}
                      placeholder="रास्ता / अन्य"
                      className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">पश्चिम (West)</label>
                    <input
                      type="text"
                      value={formData.propertyDetails.boundaries.west}
                      onChange={(e) => setFormData({
                        ...formData,
                        propertyDetails: {
                          ...formData.propertyDetails,
                          boundaries: { ...formData.propertyDetails.boundaries, west: e.target.value }
                        }
                      })}
                      placeholder="सड़क / अन्य"
                      className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">उत्तर (North)</label>
                    <input
                      type="text"
                      value={formData.propertyDetails.boundaries.north}
                      onChange={(e) => setFormData({
                        ...formData,
                        propertyDetails: {
                          ...formData.propertyDetails,
                          boundaries: { ...formData.propertyDetails.boundaries, north: e.target.value }
                        }
                      })}
                      placeholder="प्लॉट नं."
                      className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">दक्षिण (South)</label>
                    <input
                      type="text"
                      value={formData.propertyDetails.boundaries.south}
                      onChange={(e) => setFormData({
                        ...formData,
                        propertyDetails: {
                          ...formData.propertyDetails,
                          boundaries: { ...formData.propertyDetails.boundaries, south: e.target.value }
                        }
                      })}
                      placeholder="प्लॉट नं."
                      className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Seller & Buyer Details */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 border-b border-slate-100 pb-1.5">
                  3. क्रेता एवं विक्रेता विवरण (Drafting Purpose)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Seller */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-800 block">विक्रेता (Seller / Donor)</span>
                    <input
                      type="text"
                      value={formData.sellerDetails?.name || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        sellerDetails: { ...formData.sellerDetails!, name: e.target.value }
                      })}
                      placeholder="विक्रेता का नाम"
                      className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs"
                    />
                    <input
                      type="text"
                      value={formData.sellerDetails?.fatherName || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        sellerDetails: { ...formData.sellerDetails!, fatherName: e.target.value }
                      })}
                      placeholder="पिता का नाम"
                      className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs"
                    />
                    <input
                      type="text"
                      value={formData.sellerDetails?.aadhaarOrPan || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        sellerDetails: { ...formData.sellerDetails!, aadhaarOrPan: e.target.value }
                      })}
                      placeholder="आधार / पैन नंबर"
                      className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs"
                    />
                  </div>

                  {/* Buyer */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-800 block">क्रेता (Buyer / Donee)</span>
                    <input
                      type="text"
                      value={formData.buyerDetails?.name || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        buyerDetails: { ...formData.buyerDetails!, name: e.target.value }
                      })}
                      placeholder="क्रेता का नाम"
                      className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs"
                    />
                    <input
                      type="text"
                      value={formData.buyerDetails?.fatherName || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        buyerDetails: { ...formData.buyerDetails!, fatherName: e.target.value }
                      })}
                      placeholder="पिता / पति का नाम"
                      className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs"
                    />
                    <input
                      type="text"
                      value={formData.buyerDetails?.aadhaarOrPan || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        buyerDetails: { ...formData.buyerDetails!, aadhaarOrPan: e.target.value }
                      })}
                      placeholder="आधार / पैन नंबर"
                      className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Fees, Advance & Payment */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 border-b border-slate-100 pb-1.5">
                  4. फीस, अग्रिम भुगतान एवं बकाया हिसाब (Billing)
                </h4>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 mb-1">सरकारी स्टाम्प शुल्क (₹)</label>
                    <input
                      type="number"
                      value={formData.fees.govtStamp}
                      onChange={(e) => setFormData({
                        ...formData,
                        fees: { ...formData.fees, govtStamp: Number(e.target.value) }
                      })}
                      className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">सरकारी अधिभार (₹)</label>
                    <input
                      type="number"
                      value={formData.fees.govtSurcharge}
                      onChange={(e) => setFormData({
                        ...formData,
                        fees: { ...formData.fees, govtSurcharge: Number(e.target.value) }
                      })}
                      className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">रजिस्ट्रेशन फीस (₹)</label>
                    <input
                      type="number"
                      value={formData.fees.govtReg}
                      onChange={(e) => setFormData({
                        ...formData,
                        fees: { ...formData.fees, govtReg: Number(e.target.value) }
                      })}
                      className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">स्कैनिंग/CSI फीस (₹)</label>
                    <input
                      type="number"
                      value={formData.fees.govtScanning}
                      onChange={(e) => setFormData({
                        ...formData,
                        fees: { ...formData.fees, govtScanning: Number(e.target.value) }
                      })}
                      className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1">दुर्गा एसोसिएट्स ड्राफ्टिंग फीस (₹)</label>
                    <input
                      type="number"
                      value={formData.fees.officeDrafting}
                      onChange={(e) => setFormData({
                        ...formData,
                        fees: { ...formData.fees, officeDrafting: Number(e.target.value) }
                      })}
                      className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 font-semibold text-amber-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">दुर्गा एसोसिएट्स सर्विस फीस (₹)</label>
                    <input
                      type="number"
                      value={formData.fees.officeService}
                      onChange={(e) => setFormData({
                        ...formData,
                        fees: { ...formData.fees, officeService: Number(e.target.value) }
                      })}
                      className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 font-semibold text-amber-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">प्राप्त अग्रिम भुगतान (₹)</label>
                    <input
                      type="number"
                      value={formData.fees.paidAmount}
                      onChange={(e) => setFormData({
                        ...formData,
                        fees: { ...formData.fees, paidAmount: Number(e.target.value) }
                      })}
                      className="w-full rounded-lg border border-emerald-400 px-2.5 py-1.5 font-extrabold text-emerald-800 bg-emerald-50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">भुगतान माध्यम (Mode)</label>
                    <select
                      value={formData.fees.paymentMode}
                      onChange={(e) => setFormData({
                        ...formData,
                        fees: { ...formData.fees, paymentMode: e.target.value as any }
                      })}
                      className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 font-semibold"
                    >
                      <option value="cash">नकद (Cash)</option>
                      <option value="upi">UPI (PhonePe / GPay / Paytm)</option>
                      <option value="bank_transfer">बैंक ट्रांसफर (RTGS / NEFT)</option>
                      <option value="cheque">बैंक चेक (Cheque)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">आंतरिक टिप्पणी (Internal Notes)</label>
                <textarea
                  rows={2}
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="दस्तावेज़ की स्थिति या विशेष निर्देश..."
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
                />
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0B1B3D] hover:bg-[#162E66] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  {editingClient ? 'अपडेट सुरक्षित करें' : 'केस रिकॉर्ड सहेजें'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Printable Payment Receipt Modal */}
      {receiptClient && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl relative">
            <div className="no-print flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase">रसीद पूर्वावलोकन</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 rounded-xl bg-[#0B1B3D] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> रसीद प्रिंट करें
                </button>
                <button
                  onClick={() => setReceiptClient(null)}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer hover:bg-slate-300"
                >
                  बंद करें
                </button>
              </div>
            </div>

            {/* Actual Printable Receipt */}
            <div className="printable-card border border-slate-300 p-6 rounded-2xl bg-white text-slate-900 space-y-4">
              <div className="text-center pb-3 border-b-2 border-slate-900">
                <h1 className="text-xl font-black text-[#0B1B3D]">दुर्गा एसोसिएट्स एंड प्रॉपर्टी डीलर</h1>
                <p className="text-xs font-medium text-slate-700">अजमेर कलेक्ट्रेट एवं सब-रजिस्ट्रार कार्यालय सेवा केंद्र</p>
                <p className="text-[11px] text-slate-600">फोन: 9829261354, 8003987152 | कलेक्ट्री परिसर के पास, अजमेर</p>
                <div className="mt-2 inline-block px-3 py-0.5 rounded bg-amber-50 border border-amber-300 text-amber-900 text-[11px] font-extrabold uppercase tracking-wider">
                  आधिकारिक भुगतान पावती (Official Payment Receipt)
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs border-b border-slate-200 pb-2">
                <div>
                  <p><strong>रसीद क्र. :</strong> DA-REC-{receiptClient.caseNumber.split('-').pop()}</p>
                  <p className="mt-1"><strong>केस संदर्भ :</strong> {receiptClient.caseNumber}</p>
                  <p className="mt-1"><strong>ग्राहक का नाम :</strong> {receiptClient.clientName}</p>
                </div>
                <div className="text-right">
                  <p><strong>दिनांक :</strong> {new Date().toLocaleDateString('hi-IN')}</p>
                  <p className="mt-1"><strong>मोबाइल :</strong> {receiptClient.phone}</p>
                  <p className="mt-1"><strong>माध्यम :</strong> {receiptClient.fees.paymentMode.toUpperCase()}</p>
                </div>
              </div>

              <div className="text-xs space-y-2">
                <p><strong>संपत्ति विवरण :</strong> {receiptClient.propertyDetails.plotOrKhasraNo || ''} {receiptClient.propertyDetails.colonyOrLocality || 'अजमेर'}</p>
                
                <table className="w-full text-left border border-slate-200 my-2">
                  <thead className="bg-slate-100 text-[11px] uppercase">
                    <tr>
                      <th className="p-1.5 border-b">मद (Particulars)</th>
                      <th className="p-1.5 border-b text-right">राशि (Amount)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="p-1.5">सरकारी स्टाम्प ड्यूटी, अधिभार व पंजीयन शुल्क (e-Gras)</td>
                      <td className="p-1.5 text-right font-medium">₹{receiptClient.fees.totalGovt.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-1.5">दुर्गा एसोसिएट्स विलेख प्रारूपण व सर्विस चार्ज</td>
                      <td className="p-1.5 text-right font-medium">₹{receiptClient.fees.totalOffice.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr className="border-b border-slate-200 font-bold bg-slate-50">
                      <td className="p-1.5">कुल बिल राशि (Total Fee)</td>
                      <td className="p-1.5 text-right">₹{receiptClient.fees.grandTotal.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr className="border-b border-slate-200 font-bold text-emerald-800 bg-emerald-50/60">
                      <td className="p-1.5">प्राप्त राशि (Amount Received)</td>
                      <td className="p-1.5 text-right">₹{receiptClient.fees.paidAmount.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr className="font-bold text-rose-800 bg-rose-50/60">
                      <td className="p-1.5">बकाया शेष राशि (Balance Due)</td>
                      <td className="p-1.5 text-right">₹{receiptClient.fees.balanceAmount.toLocaleString('en-IN')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="pt-6 border-t border-slate-300 flex items-center justify-between text-xs">
                <div className="text-center">
                  <div className="h-8"></div>
                  <p className="border-t border-slate-400 pt-1">जमाकर्ता के हस्ताक्षर</p>
                </div>
                <div className="text-center">
                  <div className="h-8"></div>
                  <p className="border-t border-slate-400 pt-1 font-bold text-[#0B1B3D]">
                    अधिकृत हस्ताक्षरकर्ता<br />दुर्गा एसोसिएट्स, अजमेर
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
