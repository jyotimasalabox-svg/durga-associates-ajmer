'use client';

import React, { useState } from 'react';
import { CheckSquare, Printer, FileText, Gift, Users, ShieldAlert, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/languageContext';

export default function DocumentChecklist() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'sale' | 'gift' | 'release' | 'lease'>('sale');

  const checklists = {
    sale: {
      title: 'विक्रय पत्र (बैनामा / Sale Deed) आवश्यक कागजात',
      badge: 'प्लॉट, मकान व कृषि भूमि',
      items: [
        { name: 'क्रेता एवं विक्रेता के मूल आधार कार्ड व पैन कार्ड', note: 'प्रत्येक की 2-2 स्वप्रमाणित फोटोकॉपी' },
        { name: 'दोनों पक्षों के पासपोर्ट साइज फोटो', note: '2-2 नवीनतम रंगीन फोटो (सफेद पृष्ठभूमि)' },
        { name: 'दो स्वतंत्र स्थानीय गवाह (Witnesses)', note: 'गवाहों के मूल आधार कार्ड व 2-2 छायाप्रतियां' },
        { name: 'संपत्ति का मूल स्वामित्व दस्तावेज', note: 'मूल पट्टा / पूर्व बैनामा / आवंटन पत्र' },
        { name: 'साइट प्लान / नक्शा ट्रेस (Approved Map)', note: 'अजमेर विकास प्राधिकरण (ADA) / नगर निगम स्वीकृत' },
        { name: 'राजस्व जमाबंदी व नामांतरण प्रति (खेवट/खतौनी)', note: 'कृषि भूमि के मामले में अनिवार्य (नवीनतम 6 माह की नकल)' },
        { name: 'नगर निगम / निकाय का अदेय प्रमाण पत्र (No Dues)', note: 'हाउस टैक्स / यूडी टैक्स की नवीनतम चुकता रसीद' },
        { name: 'प्रतिफल राशि भुगतान का वैधानिक प्रमाण', note: 'चेक / डिमांड ड्राफ्ट / RTGS यूटीआर विवरण' },
        { name: 'राजस्थान e-Gras ई-स्टाम्प चालान व रसीद', note: 'हमारे कार्यालय द्वारा तैयार किया जाएगा' }
      ]
    },
    gift: {
      title: 'दान पत्र - परिवार / रक्त संबंधी (Gift Deed) आवश्यक कागजात',
      badge: 'माता-पिता, पति-पत्नी, पुत्र-पुत्री',
      items: [
        { name: 'दानकर्ता (Donor) एवं दानग्रहीता (Donee) के आधार व पैन कार्ड', note: 'मूल पहचान व 2-2 छायाप्रतियां' },
        { name: 'पारिवारिक रक्त संबंध का वैधानिक प्रमाण पत्र', note: 'जन आधार कार्ड / राशन कार्ड / जन्म प्रमाण पत्र' },
        { name: 'दोनों पक्षों के 2-2 नवीनतम पासपोर्ट साइज फोटो', note: 'रंगीन स्पष्ट फोटो' },
        { name: 'दो वयस्क गवाहों के आधार कार्ड', note: 'स्थानीय गवाह पहचान' },
        { name: 'दान की जाने वाली संपत्ति का मूल पट्टा/बैनामा', note: 'मूल स्वामित्व दस्तावेज' },
        { name: 'सक्षम प्राधिकारी का स्वीकृत मौका नक्शा', note: 'चौहद्दी स्पष्ट दर्शाने वाला' },
        { name: 'नगर निगम / पंचायत नो-ड्यूज रसीद', note: 'अपडेटेड टैक्स क्लीयरेंस' },
        { name: '1% रियायती ई-स्टाम्प चालान (e-Gras)', note: 'दुर्गा एसोसिएट्स द्वारा सत्यापित' }
      ]
    },
    release: {
      title: 'हकत्याग पत्र (Release / Relinquishment Deed) आवश्यक कागजात',
      badge: 'पैतृक संपत्ति सह-खातेदार',
      items: [
        { name: 'हकत्याग करने वाले व जिसके पक्ष में त्याग होना है, उनके आधार कार्ड', note: 'मूल व छायाप्रतियां' },
        { name: 'मूल खातेदार/पूर्वज का मृत्यु प्रमाण पत्र', note: 'सक्षम नगर पालिका/ग्राम पंचायत द्वारा जारी' },
        { name: 'कानूनी वारिसान प्रमाण पत्र (Legal Heir Certificate)', note: 'तहसीलदार/एसडीएम/सक्षम राजस्व प्राधिकारी द्वारा प्रमाणित' },
        { name: 'नवीनतम राजस्व जमाबंदी (नकल)', note: 'जिसमें सभी वारिसों के नाम दर्ज हों' },
        { name: 'दो स्वतंत्र गवाहों के आधार कार्ड', note: 'गवाहों की अनिवार्य उपस्थिति' },
        { name: 'मूल पट्टा अथवा पैतृक हक दस्तावेज', note: 'स्वामित्व संदर्भ' },
        { name: 'नियत ₹2,000 स्टाम्प + 20% अधिभार ई-चालान', note: 'कार्यालय द्वारा जनरेट किया जाता है' }
      ]
    },
    lease: {
      title: 'पट्टा विलेख / रजिस्टर्ड लीज (Lease Deed) आवश्यक कागजात',
      badge: 'दुकान, व्यावसायिक व संस्थागत',
      items: [
        { name: 'मकान/दुकान मालिक (Lessor) के आधार, पैन व पट्टा प्रति', note: 'स्वामित्व सत्यापन' },
        { name: 'किरायेदार/पट्टाधारी (Lessee) के आधार, पैन व फोटो', note: 'फर्म के मामले में GST व पैन' },
        { name: 'फर्म/कंपनी होने पर बोर्ड प्रस्ताव (Board Resolution)', note: 'अधिकृत हस्ताक्षरकर्ता पत्र' },
        { name: 'दो गवाहों के आधार कार्ड', note: 'सत्यापन हेतु' },
        { name: 'लीज की समयावधि, किराया व सिक्योरिटी डिपॉजिट विवरण', note: 'स्पष्ट विधिक शर्तें' },
        { name: 'अवधि अनुसार देय e-Gras स्टाम्प चालान', note: 'राजस्थान मुद्रांक नियम अनुसार' }
      ]
    }
  };

  const current = checklists[activeTab];

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="documents" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-3 border border-blue-200">
            <CheckSquare className="w-3.5 h-3.5" /> {t('docsTitle')}
          </div>
          <h2 className="text-3xl font-extrabold text-[#0B1B3D] sm:text-4xl">
            सब-रजिस्ट्रार पेशी से पूर्व अनिवार्य कागजात की सूची
          </h2>
          <p className="mt-3 text-base text-slate-600">
            {t('docsSubtitle')}। किसी भी एक दस्तावेज़ की कमी से रजिस्ट्री प्रक्रिया अटक सकती है, इसलिए पूर्व जाँच आवश्यक है।
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('sale')}
            className={`py-2.5 px-5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'sale'
                ? 'bg-[#0B1B3D] text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-400" /> विक्रय पत्र (Sale Deed)
          </button>
          <button
            onClick={() => setActiveTab('gift')}
            className={`py-2.5 px-5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'gift'
                ? 'bg-[#0B1B3D] text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
            }`}
          >
            <Gift className="w-4 h-4 text-emerald-400" /> दान पत्र (Gift Deed)
          </button>
          <button
            onClick={() => setActiveTab('release')}
            className={`py-2.5 px-5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'release'
                ? 'bg-[#0B1B3D] text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4 text-amber-400" /> हकत्याग (Release Deed)
          </button>
          <button
            onClick={() => setActiveTab('lease')}
            className={`py-2.5 px-5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'lease'
                ? 'bg-[#0B1B3D] text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-400" /> लीज डीड (Lease)
          </button>
        </div>

        {/* Active Checklist Card */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden printable-card">
          <div className="bg-slate-900 text-white p-6 sm:p-7 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
                {current.badge}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold">{current.title}</h3>
            </div>
            <button
              onClick={handlePrint}
              className="no-print px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow"
            >
              <Printer className="w-4 h-4" /> यह चेकलिस्ट प्रिंट करें
            </button>
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {current.items.map((it, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition flex items-start gap-3.5"
                >
                  <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{it.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{it.note}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 bg-amber-50/60 rounded-xl p-4 border border-amber-200 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <strong>दुर्गा एसोसिएट्स विशेष परामर्श:</strong> सभी मूल दस्तावेज (Originals) सब-रजिस्ट्रार के समक्ष पेशी के समय साथ रखना अनिवार्य है। ई-पंजीयन पोर्टल पर बायोमेट्रिक सत्यापन के तुरंत पश्चात मूल पहचान पत्र क्रेता-विक्रेता को लौटा दिए जाते हैं।
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
