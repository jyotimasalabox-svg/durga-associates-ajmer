'use client';

import React, { useState, useEffect } from 'react';
import { SaleProperty, PropertyTypeKey } from '@/lib/types';
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Flame, 
  RotateCcw, 
  ExternalLink,
  SlidersHorizontal,
  LandPlot,
  Home,
  Check,
  X
} from 'lucide-react';

export default function AdminPropertiesManager() {
  const [properties, setProperties] = useState<SaleProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'sold' | 'new_update'>('all');

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState<SaleProperty | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ text: string; isError: boolean } | null>(null);

  // Form State
  const initialForm: {
    title: string;
    location: string;
    areaSqYard: string;
    propertyType: PropertyTypeKey;
    propertyTypeLabel: string;
    featuresText: string;
    isNewUpdate: boolean;
    status: 'available' | 'sold';
    priceEstimate: string;
    phone1: string;
    phone2: string;
    notes: string;
    serialNo: number | string;
  } = {
    title: '',
    location: 'अजमेर',
    areaSqYard: '',
    propertyType: 'plot',
    propertyTypeLabel: 'प्लाट',
    featuresText: '',
    isNewUpdate: false,
    status: 'available',
    priceEstimate: 'उचित मूल्य (सम्पर्क करें)',
    phone1: '8003987152',
    phone2: '9829261354',
    notes: '',
    serialNo: ''
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/properties');
      const data = await res.json();
      if (data.success && Array.isArray(data.properties)) {
        setProperties(data.properties);
      }
    } catch (err) {
      showNotice('डेटा लोड करने में त्रुटि', true);
    } finally {
      setLoading(false);
    }
  };

  const showNotice = (text: string, isError = false) => {
    setNotification({ text, isError });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleOpenAdd = () => {
    setEditingProperty(null);
    const nextSerial = properties.length > 0 
      ? Math.max(...properties.map(p => Number(p.serialNo) || 0)) + 1 
      : 1;

    setFormData({
      ...initialForm,
      serialNo: nextSerial
    });
    setShowModal(true);
  };

  const handleOpenEdit = (prop: SaleProperty) => {
    setEditingProperty(prop);
    setFormData({
      title: prop.title,
      location: prop.location,
      areaSqYard: String(prop.areaSqYard),
      propertyType: prop.propertyType,
      propertyTypeLabel: prop.propertyTypeLabel || (prop.propertyType === 'house' ? 'मकान' : 'प्लाट'),
      featuresText: prop.features ? prop.features.join(', ') : '',
      isNewUpdate: Boolean(prop.isNewUpdate),
      status: prop.status,
      priceEstimate: prop.priceEstimate || 'उचित मूल्य (सम्पर्क करें)',
      phone1: prop.contactPhones?.[0] || '8003987152',
      phone2: prop.contactPhones?.[1] || '9829261354',
      notes: prop.notes || '',
      serialNo: prop.serialNo
    });
    setShowModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.areaSqYard) {
      showNotice('कृपया संपत्ति का स्थान/विवरण एवं वर्गगज भरें', true);
      return;
    }

    setIsSubmitting(true);
    try {
      const featuresArray = formData.featuresText
        ? formData.featuresText.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      const phones = [formData.phone1, formData.phone2].filter(Boolean);

      const payload = {
        title: formData.title,
        location: formData.location,
        areaSqYard: formData.areaSqYard,
        propertyType: formData.propertyType,
        propertyTypeLabel: formData.propertyTypeLabel,
        features: featuresArray,
        isNewUpdate: formData.isNewUpdate,
        status: formData.status,
        priceEstimate: formData.priceEstimate,
        contactPhones: phones.length > 0 ? phones : ['8003987152', '9829261354'],
        notes: formData.notes,
        serialNo: Number(formData.serialNo) || 1
      };

      if (editingProperty) {
        // PUT request
        const res = await fetch('/api/properties', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingProperty.id, ...payload })
        });
        const data = await res.json();
        if (data.success) {
          showNotice('प्रॉपर्टी विवरण सफलतापूर्वक अपडेट कर दिया गया');
          setShowModal(false);
          fetchProperties();
        } else {
          showNotice(data.error || 'अपडेट विफल', true);
        }
      } else {
        // POST request
        const res = await fetch('/api/properties', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          showNotice('नई बिकाऊ संपत्ति सफलतापूर्वक वेबसाइट पर जोड़ी गई');
          setShowModal(false);
          fetchProperties();
        } else {
          showNotice(data.error || 'जोड़ने में त्रुटि', true);
        }
      }
    } catch (err) {
      showNotice('सर्वर त्रुटि हुई', true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/properties?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        showNotice('प्रॉपर्टी सफलतापूर्वक हटा दी गई');
        setDeletingId(null);
        fetchProperties();
      } else {
        showNotice(data.error || 'हटाने में त्रुटि', true);
      }
    } catch (err) {
      showNotice('सर्वर त्रुटि हुई', true);
    }
  };

  const handleToggleStatus = async (prop: SaleProperty) => {
    const nextStatus = prop.status === 'available' ? 'sold' : 'available';
    try {
      const res = await fetch('/api/properties', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: prop.id, status: nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        showNotice(
          nextStatus === 'sold'
            ? `प्रॉपर्टी #${prop.serialNo} को 'बिका हुआ (Sold)' चिह्नित किया गया`
            : `प्रॉपर्टी #${prop.serialNo} को 'बिकाऊ (Available)' चिह्नित किया गया`
        );
        fetchProperties();
      }
    } catch (err) {
      showNotice('स्टेटस बदलने में त्रुटि', true);
    }
  };

  const handleToggleNewUpdate = async (prop: SaleProperty) => {
    const nextVal = !prop.isNewUpdate;
    try {
      const res = await fetch('/api/properties', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: prop.id, isNewUpdate: nextVal })
      });
      const data = await res.json();
      if (data.success) {
        showNotice(
          nextVal
            ? `प्रॉपर्टी #${prop.serialNo} को 'NEW UPDATE' में जोड़ा गया`
            : `प्रॉपर्टी #${prop.serialNo} को 'सामान्य' किया गया`
        );
        fetchProperties();
      }
    } catch (err) {
      showNotice('अपडेट में त्रुटि', true);
    }
  };

  const handleResetDefaults = async () => {
    if (!window.confirm('क्या आप सचमुच मूल 10 संपत्तियों की फोटो सूची को रीसेट करना चाहते हैं? इससे सभी 10 रिकॉर्ड मूल रूप में आ जाएंगे।')) {
      return;
    }
    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_defaults' })
      });
      const data = await res.json();
      if (data.success) {
        showNotice(data.message);
        fetchProperties();
      }
    } catch (err) {
      showNotice('रीसेट में त्रुटि', true);
    }
  };

  // Filter properties
  const filteredProperties = properties.filter(prop => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !query ||
      prop.title.toLowerCase().includes(query) ||
      prop.location.toLowerCase().includes(query) ||
      prop.areaSqYard.toString().includes(query) ||
      (prop.propertyTypeLabel && prop.propertyTypeLabel.toLowerCase().includes(query));

    if (!matchesSearch) return false;
    if (statusFilter === 'all') return true;
    if (statusFilter === 'available') return prop.status === 'available';
    if (statusFilter === 'sold') return prop.status === 'sold';
    if (statusFilter === 'new_update') return Boolean(prop.isNewUpdate);
    return true;
  });

  const availableCount = properties.filter(p => p.status === 'available').length;
  const soldCount = properties.filter(p => p.status === 'sold').length;
  const newUpdateCount = properties.filter(p => p.isNewUpdate).length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner Notice */}
      {notification && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-bold shadow-md transition-all ${
          notification.isError
            ? 'bg-rose-100 text-rose-800 border border-rose-300'
            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
        }`}>
          {notification.isError ? (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Header & Quick Action Buttons */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#0B1B3D]">
                बिकाऊ प्रॉपर्टीज मैनेजर (Properties For Sale)
              </h2>
              <p className="text-xs text-slate-500">
                यहाँ से आप नई बिकाऊ संपत्ति जोड़ सकते हैं, विवरण व वर्गगज एडिट कर सकते हैं और वह तुरंत मुख्य वेबसाइट पर दिखने लगेगी।
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300 transition flex items-center gap-1.5 cursor-pointer"
            title="मूल 10 फोटो रिकॉर्ड्स रीसेट करें"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
            <span>मूल फोटो सूची रीसेट</span>
          </button>

          <a
            href="/#properties"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1.5"
            title="वेबसाइट पर कैसा दिख रहा है"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span>लाइव वेबसाइट देखें</span>
          </a>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>+ नई प्रॉपर्टी जोड़ें</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">कुल बिकाऊ लिस्ट</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{properties.length}</div>
          <span className="text-[11px] text-slate-400">वेबसाइट पर सक्रिय</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-emerald-200 bg-emerald-50/30 shadow-xs">
          <span className="text-xs text-emerald-800 font-medium">उपलब्ध (Available)</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{availableCount}</div>
          <span className="text-[11px] text-emerald-600">बिक्री हेतु तैयार</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-rose-200 bg-rose-50/30 shadow-xs">
          <span className="text-xs text-rose-800 font-medium">NEW UPDATE</span>
          <div className="text-2xl font-black text-rose-600 mt-1 flex items-center gap-1">
            <Flame className="w-5 h-5 text-rose-600" /> {newUpdateCount}
          </div>
          <span className="text-[11px] text-rose-600">ताजा अपडेट हाइलाइट</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">बिका हुआ (Sold)</span>
          <div className="text-2xl font-black text-slate-500 mt-1">{soldCount}</div>
          <span className="text-[11px] text-slate-400">सौदा पूर्ण</span>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="खोजें: स्थान, कॉलोनी या वर्गगज..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold w-full sm:w-auto justify-end">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-[#0B1B3D] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            सभी ({properties.length})
          </button>
          <button
            onClick={() => setStatusFilter('available')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              statusFilter === 'available'
                ? 'bg-emerald-700 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            उपलब्ध ({availableCount})
          </button>
          <button
            onClick={() => setStatusFilter('new_update')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              statusFilter === 'new_update'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            New Update ({newUpdateCount})
          </button>
          <button
            onClick={() => setStatusFilter('sold')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              statusFilter === 'sold'
                ? 'bg-slate-700 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            बिका हुआ ({soldCount})
          </button>
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0B1B3D] text-white font-bold border-b border-slate-800">
                <th className="py-3 px-3 text-center w-14">क्र. सं.</th>
                <th className="py-3 px-4">स्थान व विवरण</th>
                <th className="py-3 px-3 text-center w-28">वर्गगज</th>
                <th className="py-3 px-3 text-center w-28">प्रकार</th>
                <th className="py-3 px-3 text-center w-28">NEW UPDATE</th>
                <th className="py-3 px-3 text-center w-28">स्थिति</th>
                <th className="py-3 px-4 text-center w-36">कार्रवाई</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProperties.map((prop) => (
                <tr
                  key={prop.id}
                  className={`hover:bg-amber-50/50 transition-colors ${
                    prop.status === 'sold' ? 'opacity-60 bg-slate-50' : ''
                  }`}
                >
                  {/* Serial No */}
                  <td className="py-3.5 px-3 text-center font-black text-sm text-slate-900">
                    #{prop.serialNo}
                  </td>

                  {/* Title & Location & Features */}
                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-sm text-[#0B1B3D] leading-snug">
                      {prop.title}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                      <MapPin className="w-3 h-3 text-amber-600" />
                      <span>{prop.location}</span>
                    </div>

                    {prop.features && prop.features.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {prop.features.map((feat, fIdx) => (
                          <span
                            key={fIdx}
                            className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200"
                          >
                            {feat}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* Area Sq. Yards */}
                  <td className="py-3.5 px-3 text-center">
                    <span className="font-black text-base text-amber-950 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300 inline-block">
                      {prop.areaSqYard}
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">गज</span>
                  </td>

                  {/* Property Type */}
                  <td className="py-3.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px] border border-slate-200">
                      {prop.propertyTypeLabel || prop.propertyType}
                    </span>
                  </td>

                  {/* New Update Toggle */}
                  <td className="py-3.5 px-3 text-center">
                    <button
                      onClick={() => handleToggleNewUpdate(prop)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition cursor-pointer flex items-center justify-center gap-1 mx-auto ${
                        prop.isNewUpdate
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                      title="NEW UPDATE टॉगल करें"
                    >
                      <Flame className="w-3 h-3" />
                      <span>{prop.isNewUpdate ? 'हाइलाइट' : 'सामान्य'}</span>
                    </button>
                  </td>

                  {/* Status Toggle */}
                  <td className="py-3.5 px-3 text-center">
                    <button
                      onClick={() => handleToggleStatus(prop)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition cursor-pointer mx-auto ${
                        prop.status === 'available'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                      title="क्लिक करके स्टेटस बदलें"
                    >
                      {prop.status === 'available' ? '✓ उपलब्ध' : 'बिका हुआ'}
                    </button>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(prop)}
                        className="p-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 transition cursor-pointer"
                        title="संपादित करें"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setDeletingId(prop.id)}
                        className="p-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 transition cursor-pointer"
                        title="हटाएं"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-10 text-slate-400 text-xs">
            कोई संपत्ति नहीं मिली।
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* MODAL: ADD / EDIT PROPERTY                                      */}
      {/* ============================================================== */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  {editingProperty ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <h3 className="text-lg font-black text-[#0B1B3D]">
                  {editingProperty ? 'प्रॉपर्टी विवरण संपादित करें' : 'नई बिकाऊ प्रॉपर्टी जोड़ें'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-semibold">
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {/* Serial No */}
                <div className="sm:col-span-1">
                  <label className="block text-slate-700 mb-1">क्र. सं.</label>
                  <input
                    type="number"
                    value={formData.serialNo}
                    onChange={(e) => setFormData({ ...formData, serialNo: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500"
                    placeholder="1"
                  />
                </div>

                {/* Area Sq. Yard */}
                <div className="sm:col-span-3">
                  <label className="block text-slate-700 mb-1">
                    क्षेत्रफल (वर्गगज / Sq. Yards) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.areaSqYard}
                    onChange={(e) => setFormData({ ...formData, areaSqYard: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 font-bold"
                    placeholder="उदा: 150 या 100.93"
                  />
                </div>
              </div>

              {/* Title / Full Description */}
              <div>
                <label className="block text-slate-700 mb-1">
                  सम्पति/प्लाट का स्थान एवं विवरण (बोर्ड पर दिखेगा) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 font-bold text-sm"
                  placeholder="उदा: कपिल वस्तु कॉलोनी, धोला भाटा, अजमेर में मकान बिकाऊ है"
                />
              </div>

              {/* Colony / Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">कॉलोनी / क्षेत्र (Location)</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500"
                    placeholder="उदा: धोला भाटा, अजमेर"
                  />
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-slate-700 mb-1">संपत्ति का प्रकार</label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => {
                      const val = e.target.value as PropertyTypeKey;
                      const labelMap: Record<PropertyTypeKey, string> = {
                        plot: 'प्लाट',
                        house: 'मकान',
                        commercial: 'व्यावसायिक / दुकान',
                        flat: 'फ्लैट',
                        farm_house: 'फार्म हाउस',
                        other: 'अन्य'
                      };
                      setFormData({ 
                        ...formData, 
                        propertyType: val,
                        propertyTypeLabel: labelMap[val] || 'प्लाट'
                      });
                    }}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="plot">प्लाट (Plot)</option>
                    <option value="house">मकान (House)</option>
                    <option value="commercial">व्यावसायिक / दुकान (Commercial)</option>
                    <option value="flat">फ्लैट (Flat / Apartment)</option>
                    <option value="farm_house">फार्म हाउस (Farm House)</option>
                    <option value="other">अन्य</option>
                  </select>
                </div>
              </div>

              {/* Special Features / Tags */}
              <div>
                <label className="block text-slate-700 mb-1">
                  विशेष टैग्स (अल्पविराम से अलग करें)
                </label>
                <input
                  type="text"
                  value={formData.featuresText}
                  onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500"
                  placeholder="उदा: ADA APPROVED, Loanable, East Facing, 100फीट रोड, Corner Plot"
                />
              </div>

              {/* Phone Numbers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">सम्पर्क फोन 1</label>
                  <input
                    type="text"
                    value={formData.phone1}
                    onChange={(e) => setFormData({ ...formData, phone1: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500"
                    placeholder="8003987152"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">सम्पर्क फोन 2</label>
                  <input
                    type="text"
                    value={formData.phone2}
                    onChange={(e) => setFormData({ ...formData, phone2: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500"
                    placeholder="9829261354"
                  />
                </div>
              </div>

              {/* NEW UPDATE Checkbox & Status */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex flex-wrap items-center justify-between gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNewUpdate}
                    onChange={(e) => setFormData({ ...formData, isNewUpdate: e.target.checked })}
                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                  />
                  <span className="font-extrabold text-red-900 flex items-center gap-1">
                    <Flame className="w-4 h-4 text-red-600" />
                    <span>★ NEW UPDATE तालिका में ऊपर हाइलाइट करें</span>
                  </span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-slate-700">स्थिति:</span>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="p-1.5 rounded-lg border border-slate-300 bg-white font-bold"
                  >
                    <option value="available">✓ उपलब्ध (बिकाऊ)</option>
                    <option value="sold">बिका हुआ (Sold)</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-slate-700 mb-1">अतिरिक्त विवरण / टिप्पणी</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500"
                  placeholder="उदा: 30 फीट चौड़ा रास्ता, बोरवेल व बिजली कनेक्शन उपलब्ध..."
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'सहेज रहे हैं...' : editingProperty ? 'अपडेट सुरक्षित करें' : 'वेबसाइट पर जोड़ें'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              क्या आप इस प्रॉपर्टी को हटाना चाहते हैं?
            </h4>
            <p className="text-xs text-slate-500">
              यह संपत्ति वेबसाइट और एडमिन लिस्ट दोनों से हटा दी जाएगी।
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
              >
                रद्द करें
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                हटाएं
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
