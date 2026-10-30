'use client';

import React from 'react';
import { Search, FileEdit, CreditCard, CalendarCheck, Award, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/languageContext';

export default function ProcessGuide() {
  const { t } = useLanguage();

  const steps = [
    {
      step: '01',
      title: 'डीएलसी दर व स्वत्व जाँच (Title & DLC Valuation)',
      desc: 'आपकी संपत्ति (प्लॉट/मकान) के मूल पट्टे, पूर्व बैनामे, जमाबंदी एवं कलेक्ट्रेट द्वारा निर्धारित नवीनतम DLC दर की विधिक जाँच व मूल्यांकन।',
      icon: Search,
      highlight: 'सटीक मूल्यांकन'
    },
    {
      step: '02',
      title: 'दस्तावेज़ प्रारूपण (Legal Drafting)',
      desc: 'राजस्थान मुद्रांक अधिनियम के विहित प्रपत्र में दोनों पक्षों (क्रेता-विक्रेता) के नाम, स्पष्ट सीमाएं (चौहद्दी) व भुगतान विवरण सहित बैनामा प्रारूपण।',
      icon: FileEdit,
      highlight: 'विधिक सुरक्षा'
    },
    {
      step: '03',
      title: 'ई-ग्रास स्टाम्प व रजिस्ट्रेशन फीस चालान',
      desc: 'राजस्थान सरकार के e-Gras पोर्टल पर अधिकृत ऑनलाइन सरकारी स्टाम्प ड्यूटी, सरचार्ज व पंजीयन शुल्क का ई-चालान जनरेट व भुगतान।',
      icon: CreditCard,
      highlight: '100% पारदर्शी चालान'
    },
    {
      step: '04',
      title: 'ई-पंजीयन अपॉइंटमेंट व सब-रजिस्ट्रार पेशी',
      desc: 'सब-रजिस्ट्रार कार्यालय अजमेर (प्रथम अथवा द्वितीय) में ऑनलाइन टाइम स्लॉट बुकिंग। दोनों पक्षों एवं दो गवाहों की उपस्थित में बायोमेट्रिक व फोटो।',
      icon: CalendarCheck,
      highlight: 'व्यक्तिगत मार्गदर्शन'
    },
    {
      step: '05',
      title: 'पंजीकृत बैनामा प्राप्ति व नामांतरण सहायता',
      desc: 'सब-रजिस्ट्रार द्वारा अंतिम मुहर व डिजिटल बारकोड युक्त मूल रजिस्ट्री प्राप्त करना तथा नगर निगम / ADA / राजस्व नामांतरण हेतु मार्गदर्शन।',
      icon: Award,
      highlight: 'सफल रजिस्ट्री'
    }
  ];

  return (
    <section id="process" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3 border border-slate-700">
            {t('processTitle')}
          </div>
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            अजमेर में रजिस्ट्री कैसे संपन्न होती है?
          </h2>
          <p className="mt-3 text-base text-slate-300">
            दुर्गा एसोसिएट्स आपके साथ हर कदम पर उपस्थित रहता है, ताकि आपकी मेहनत की कमाई से खरीदी गई संपत्ति का एक भी कानूनी पहलू अधूरा न रहे।
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {steps.map((st, i) => {
            const Icon = st.icon;
            return (
              <div
                key={i}
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/60 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1 shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-amber-400 font-mono">
                      {st.step}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
                      {st.highlight}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                    {st.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {st.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-700/60 text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                  <span>चरण {st.step} विवरण</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Note box */}
        <div className="mt-12 bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-300 text-center sm:text-left">
            <span className="font-bold text-white block text-sm mb-1">
              सब-रजिस्ट्रार कार्यालय अजमेर (प्रथम / द्वितीय) पेशी से पूर्व नि:शुल्क परामर्श
            </span>
            कागजात सही होने पर रजिस्ट्री प्रक्रिया मात्र 1 से 2 दिन में पूरी हो जाती है।
          </div>
          <a
            href="tel:9829261354"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#0B1B3D] font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <span>आज ही समय तय करें: 9829261354</span>
          </a>
        </div>
      </div>
    </section>
  );
}
