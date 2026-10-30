'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  SlidersHorizontal, 
  Grid3X3, 
  Table2, 
  ShieldCheck, 
  ArrowUpRight,
  Home,
  LandPlot,
  Flame,
  BadgeAlert
} from 'lucide-react';
import { SaleProperty } from '@/lib/types';
import { DEFAULT_SALE_PROPERTIES } from '@/lib/defaultProperties';

interface Props {
  className?: string;
  showAllInitially?: boolean;
}

export default function PropertyListingsSection({ className = '', showAllInitially = true }: Props) {
  const [properties, setProperties] = useState<SaleProperty[]>(DEFAULT_SALE_PROPERTIES);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/properties');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.properties) && data.properties.length > 0) {
          setProperties(data.properties);
        }
      }
    } catch (err) {
      console.warn('Using local default properties:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter properties
  const filteredProperties = properties.filter(prop => {
    // Search query matching
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !query ||
      prop.title.toLowerCase().includes(query) ||
      prop.location.toLowerCase().includes(query) ||
      prop.areaSqYard.toString().includes(query) ||
      (prop.propertyTypeLabel && prop.propertyTypeLabel.toLowerCase().includes(query)) ||
      (prop.features && prop.features.some(f => f.toLowerCase().includes(query)));

    // Type filter matching
    if (!matchesSearch) return false;
    if (selectedType === 'all') return true;
    if (selectedType === 'new_update') return Boolean(prop.isNewUpdate);
    if (selectedType === 'plot') return prop.propertyType === 'plot';
    if (selectedType === 'house') return prop.propertyType === 'house';
    if (selectedType === 'dholabhata') {
      return prop.location.includes('धोला भाटा') || prop.title.includes('धोला भाटा');
    }
    return true;
  });

  const getWhatsAppLink = (prop: SaleProperty) => {
    const text = encodeURIComponent(
      `नमस्ते दुर्गा एसोसिएट्स, मुझे आपकी वेबसाइट पर लिस्टेड प्रॉपर्टी के बारे में जानकारी चाहिए:\n\n📍 स्थान: ${prop.title}\n📏 क्षेत्रफल: ${prop.areaSqYard} वर्गगज\n${prop.features && prop.features.length ? '🏷️ विशेषताएं: ' + prop.features.join(', ') + '\n' : ''}\nकृपया इसका मूल्य व मौका देखने का समय बताएं।`
    );
    return `https://wa.me/919829261354?text=${text}`;
  };

  return (
    <section id="properties" className={`py-16 bg-[#F8FAFC] border-t border-slate-200 scroll-mt-20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Badge */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-amber-400/20 to-amber-500/15 border border-amber-500/30 text-amber-900 text-xs sm:text-sm font-bold shadow-xs">
            <Flame className="w-4 h-4 text-amber-600 animate-pulse shrink-0" />
            <span>अजमेर में ताजा बिकाऊ संपत्तियां • दुर्गा एसोसिएट्स प्रमाणित</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0B1B3D] mt-3 tracking-tight">
            कहाँ-कहाँ प्रॉपर्टी बिकाऊ है? <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900">स्थान व वर्गगज सूची</span>
          </h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            धोला भाटा, विराट नगर, सुभाष नगर, भगवानगंज एवं अजमेर के विभिन्न प्रमुख क्षेत्रों में उपलब्ध बिकाऊ प्लाट व मकानों का पूर्ण पता व माप विवरण:
          </p>
        </div>

        {/* Contact Banner matching the photo */}
        <div className="bg-gradient-to-r from-[#800000] via-[#A81010] to-[#800000] text-white rounded-2xl p-4 sm:p-6 shadow-xl border-2 border-amber-400/50 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-xl bg-amber-400 text-red-950 flex items-center justify-center font-black text-2xl shadow shrink-0">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-wide text-white drop-shadow-md">
                दुर्गा एसोसिएट्स एण्ड प्रोपर्टी डीलर
              </h3>
              <p className="text-xs sm:text-sm text-amber-200 font-medium">
                अजमेर में क्रय-विक्रय, रजिस्ट्री व बैनामा विशेषज्ञ • स्थल निरीक्षण व कानूनी जांच
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 shrink-0">
            <a
              href="tel:8003987152"
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm sm:text-base flex items-center gap-2 shadow-md transition-all hover:scale-105"
            >
              <Phone className="w-4 h-4 text-slate-950" />
              <span>8003987152</span>
            </a>
            <a
              href="tel:9829261354"
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm sm:text-base flex items-center gap-2 shadow-md transition-all hover:scale-105"
            >
              <Phone className="w-4 h-4 text-slate-950" />
              <span>9829261354</span>
            </a>
          </div>
        </div>

        {/* Controls Bar: Search, Filters & View Toggle */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 mb-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="स्थान या कॉलोनी खोजें (उदा: धोला भाटा, विराट नगर, 150 गज...)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded cursor-pointer"
              >
                हटाएं
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-2 rounded-xl transition cursor-pointer ${
                selectedType === 'all'
                  ? 'bg-[#0B1B3D] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              सभी ({properties.length})
            </button>
            <button
              onClick={() => setSelectedType('new_update')}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer ${
                selectedType === 'new_update'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span>NEW UPDATE</span>
            </button>
            <button
              onClick={() => setSelectedType('dholabhata')}
              className={`px-3 py-2 rounded-xl transition cursor-pointer ${
                selectedType === 'dholabhata'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              धोला भाटा
            </button>
            <button
              onClick={() => setSelectedType('plot')}
              className={`px-3 py-2 rounded-xl transition cursor-pointer ${
                selectedType === 'plot'
                  ? 'bg-[#0B1B3D] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              प्लाट
            </button>
            <button
              onClick={() => setSelectedType('house')}
              className={`px-3 py-2 rounded-xl transition cursor-pointer ${
                selectedType === 'house'
                  ? 'bg-[#0B1B3D] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              मकान
            </button>
          </div>

          {/* View Switcher: Table vs Cards */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-end lg:self-auto border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="मूल फोटो बोर्ड तालिका दृश्य"
            >
              <Table2 className="w-3.5 h-3.5 text-amber-600" />
              <span>बोर्ड तालिका</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="कार्ड ग्रिड दृश्य"
            >
              <Grid3X3 className="w-3.5 h-3.5 text-blue-600" />
              <span>कार्ड व्यू</span>
            </button>
          </div>

        </div>

        {/* RESULTS COUNT & VERIFIED NOTICE */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-4 px-1">
          <div className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>कुल <strong className="text-slate-900">{filteredProperties.length}</strong> बिकाऊ संपत्तियां उपलब्ध</span>
          </div>
          <div className="text-[11px] text-slate-400">
            * यह आधिकारिक सत्यापित सूची है (केवल पठन योग्य)
          </div>
        </div>

        {/* ============================================================== */}
        {/* VIEW 1: AUTHENTIC YELLOW PHOTO BOARD TABLE (As in User's Photo) */}
        {/* ============================================================== */}
        {viewMode === 'table' && (
          <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-yellow-500/80 bg-white">
            
            {/* Table Header like in photo */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-[#FFEB3B] text-black border-b-2 border-black/80 font-black text-sm sm:text-base">
                    <th className="py-3.5 px-3 sm:px-4 text-center border-r-2 border-black/80 w-16 sm:w-20">
                      क्र सं
                    </th>
                    <th className="py-3.5 px-4 sm:px-6 border-r-2 border-black/80">
                      सम्पति/प्लाट का स्थान एवं विवरण
                    </th>
                    <th className="py-3.5 px-3 sm:px-6 text-center border-r-2 border-black/80 w-24 sm:w-36">
                      वर्गगज
                    </th>
                    <th className="py-3.5 px-3 sm:px-6 text-center w-36 sm:w-48 bg-[#FDD835]">
                      सम्पर्क व मौका
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black/60 font-semibold text-slate-950">
                  {filteredProperties.map((prop, idx) => {
                    const isNewUpdateStart = prop.isNewUpdate && (idx === 0 || !filteredProperties[idx - 1]?.isNewUpdate);

                    return (
                      <React.Fragment key={prop.id}>
                        {/* New Update Divider Row (Styled just like in photo) */}
                        {isNewUpdateStart && (
                          <tr className="bg-white border-y-2 border-black/80">
                            <td colSpan={4} className="py-2 px-4 text-center">
                              <span className="inline-block px-4 py-1 text-xs sm:text-sm font-black text-red-700 bg-red-100 rounded-md border border-red-300 tracking-wider animate-pulse">
                                ★ NEW UPDATE ★
                              </span>
                            </td>
                          </tr>
                        )}

                        <tr className={`transition-colors ${
                          prop.isNewUpdate 
                            ? 'bg-[#FFF9C4] hover:bg-[#FFF59D]' 
                            : idx % 2 === 0 
                              ? 'bg-[#FFFDE7] hover:bg-[#FFF9C4]' 
                              : 'bg-[#FFF9C4] hover:bg-[#FFF59D]'
                        }`}>
                          
                          {/* S.No */}
                          <td className="py-3.5 px-3 sm:px-4 text-center font-black text-base sm:text-lg border-r-2 border-black/80 text-black">
                            {prop.serialNo}
                          </td>

                          {/* Property Location & Description */}
                          <td className="py-3.5 px-4 sm:px-6 border-r-2 border-black/80">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <span className="font-extrabold text-sm sm:text-base text-black leading-snug">
                                  {prop.title}
                                </span>
                                
                                {prop.notes && (
                                  <p className="text-xs text-slate-700 mt-0.5 font-normal">
                                    {prop.notes}
                                  </p>
                                )}
                              </div>

                              {/* Badges / Features */}
                              <div className="flex flex-wrap items-center gap-1.5 shrink-0 mt-1 sm:mt-0">
                                {prop.isNewUpdate && (
                                  <span className="text-[10px] font-black bg-red-600 text-white px-2 py-0.5 rounded shadow-xs">
                                    नया अपडेट
                                  </span>
                                )}
                                {prop.features?.map((feat, fIdx) => (
                                  <span
                                    key={fIdx}
                                    className="text-[10px] font-bold bg-amber-200/90 text-amber-950 px-2 py-0.5 rounded border border-amber-400"
                                  >
                                    {feat}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </td>

                          {/* Area in Sq. Yards (वर्गगज) */}
                          <td className="py-3.5 px-3 sm:px-6 text-center border-r-2 border-black/80">
                            <span className="font-black text-lg sm:text-2xl text-black">
                              {prop.areaSqYard}
                            </span>
                            <span className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                              वर्गगज
                            </span>
                          </td>

                          {/* Action Buttons: Call & WhatsApp */}
                          <td className="py-3.5 px-3 sm:px-6 text-center">
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5">
                              <a
                                href="tel:9829261354"
                                className="w-full sm:w-auto px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1 transition shadow-xs"
                                title="तुरंत कॉल करें: 9829261354"
                              >
                                <Phone className="w-3.5 h-3.5" />
                                <span>कॉल</span>
                              </a>
                              <a
                                href={getWhatsAppLink(prop)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-slate-950 text-xs font-bold flex items-center justify-center gap-1 transition shadow-xs"
                                title="WhatsApp पर पूछताछ भेजें"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>पूछताछ</span>
                              </a>
                            </div>
                          </td>

                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom Footer Note of Board */}
            <div className="bg-[#FDD835] p-3 text-center border-t-2 border-black/80 text-xs sm:text-sm font-bold text-black flex flex-wrap items-center justify-center gap-4">
              <span>📍 कार्यालय: अजमेर कलेक्ट्रेट एवं सब-रजिस्ट्रार कार्यालय के समीप</span>
              <span>•</span>
              <span>📞 संपर्क: 8003987152, 9829261354</span>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 2: MODERN RESPONSIVE CARDS GRID                           */}
        {/* ============================================================== */}
        {viewMode === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((prop) => (
              <div
                key={prop.id}
                className={`bg-white rounded-2xl p-5 border transition-all duration-200 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between ${
                  prop.isNewUpdate 
                    ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-md' 
                    : 'border-slate-200 shadow-sm'
                }`}
              >
                <div>
                  {/* Top Card Badge Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-[#0B1B3D] text-amber-300 font-extrabold text-sm flex items-center justify-center shadow-xs">
                        #{prop.serialNo}
                      </span>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {prop.propertyTypeLabel || (prop.propertyType === 'house' ? 'मकान' : 'प्लाट')}
                      </span>
                    </div>

                    {prop.isNewUpdate ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-extrabold text-[11px] shadow-xs animate-pulse">
                        <Flame className="w-3 h-3 text-amber-300" /> NEW UPDATE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">
                        बिकाऊ उपलब्ध
                      </span>
                    )}
                  </div>

                  {/* Title & Location */}
                  <h4 className="text-base font-extrabold text-[#0B1B3D] leading-snug mb-2">
                    {prop.title}
                  </h4>

                  <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{prop.location}</span>
                  </div>

                  {/* Area Gaj Box */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-amber-500/10 border border-amber-500/20 mb-3 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-amber-900 font-semibold block">कुल क्षेत्रफल</span>
                      <span className="text-xl font-black text-slate-900">{prop.areaSqYard} वर्गगज</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-slate-500 font-medium block">अनुमानित दर</span>
                      <span className="text-xs font-bold text-emerald-700">सम्पर्क पर बातचीत</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {prop.features && prop.features.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {prop.features.map((feat, fIdx) => (
                        <span
                          key={fIdx}
                          className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  )}

                  {prop.notes && (
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
                      {prop.notes}
                    </p>
                  )}
                </div>

                {/* Bottom Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <a
                    href="tel:9829261354"
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>9829261354</span>
                  </a>

                  <a
                    href={getWhatsAppLink(prop)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Empty Search Fallback */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
            <BadgeAlert className="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">
              आपकी खोज के अनुसार कोई संपत्ति नहीं मिली
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              कृपया दूसरा शब्द टाइप करें या सीधे हमारे नंबर पर कॉल करके अपनी पसंद की लोकेशन बताएं।
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedType('all'); }}
              className="mt-4 px-4 py-2 rounded-xl bg-[#0B1B3D] text-white text-xs font-bold cursor-pointer"
            >
              सभी संपत्तियां देखें
            </button>
          </div>
        )}

        {/* Direct Consultation / Site Visit Box */}
        <div className="mt-12 bg-gradient-to-br from-[#0B1B3D] to-[#162E66] text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-700/50">
              स्थल निरीक्षण एवं रजिस्ट्री सुविधा
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              इनमें से किसी भी प्रॉपर्टी का मौका देखना चाहते हैं?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              दुर्गा एसोसिएट्स टीम आपके साथ स्थल निरीक्षण (Site Visit), टाइटल वेरिफिकेशन, डीएलसी दर व बैनामा रजिस्ट्री की संपूर्ण कानूनी औपचारिकताएं पूर्ण कराती है।
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <a
              href="tel:9829261354"
              className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-slate-950" />
              <span>कॉल: 9829261354</span>
            </a>
            <a
              href="tel:8003987152"
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-600 transition-all flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>8003987152</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
