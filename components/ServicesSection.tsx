'use client';

import React from 'react';
import { 
  FileText, 
  Gift, 
  Users, 
  Split, 
  FileSignature, 
  Key, 
  Scroll, 
  MapPin, 
  Calculator, 
  Building2, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import { useLanguage } from '@/lib/languageContext';

export default function ServicesSection({ onSelectService }: { onSelectService?: (serviceName: string) => void }) {
  const { t } = useLanguage();

  const services = [
    {
      id: 'sale_deed',
      title: 'विक्रय पत्र (बैनामा / Sale Deed)',
      tag: 'सर्वाधिक प्रचलित',
      desc: 'प्लॉट, स्वतंत्र मकान, फ्लैट, दुकान अथवा कृषि भूमि की खरीद-बिक्री का पक्का वैधानिक विक्रय विलेख।',
      features: ['सटीक DLC दर व प्रतिफल मिलान', 'महिला खरीदार पर 1% स्टाम्प छूट', 'स्पष्ट चौहद्दी एवं स्वत्व विवरण'],
      icon: FileText,
      color: 'from-blue-600 to-indigo-700'
    },
    {
      id: 'gift_deed',
      title: 'दान पत्र (Gift Deed - पारिवारिक / अन्य)',
      tag: 'विशेष सरकारी छूट',
      desc: 'माता, पिता, पति, पत्नी, पुत्र, पुत्री या सगे संबंधियों के पक्ष में संपत्ति का प्रेमवश दान विलेख।',
      features: ['निकट रक्त संबंधियों हेतु मात्र 1% स्टाम्प दर', 'अदालती विवादों से सर्वथा सुरक्षित', 'तत्काल मालिकाना हक हस्तांतरण'],
      icon: Gift,
      color: 'from-amber-600 to-amber-700'
    },
    {
      id: 'release_deed',
      title: 'हकत्याग पत्र (Release / Relinquishment)',
      tag: 'पैतृक संपत्ति समाधान',
      desc: 'पैतृक अथवा संयुक्त पारिवारिक संपत्ति में सह-खातेदारों द्वारा अपने हिस्से का कानूनी त्याग करना।',
      features: ['मात्र ₹2,000 नियत स्टाम्प शुल्क (प्लस सरचार्ज)', 'वारिसान का कानूनी रिकॉर्ड शुद्धि', 'राजस्व नामांतरण में सुगमता'],
      icon: Users,
      color: 'from-emerald-600 to-teal-700'
    },
    {
      id: 'partition_deed',
      title: 'विभाजन पत्र (बंटवारा विलेख / Partition Deed)',
      tag: 'पारिवारिक बंटवारा',
      desc: 'भाइयों, साझेदारों अथवा सह-स्वामियों के बीच संपत्ति का विधिवत, विवाद-रहित रजिस्टर्ड बंटवारा।',
      features: ['प्रत्येक हिस्सेदार का पृथक नक्शा व सीमांकन', 'भविष्य के संपत्ति विवादों का स्थायी अंत', 'सक्षम सब-रजिस्ट्रार प्रमाणीकरण'],
      icon: Split,
      color: 'from-purple-600 to-indigo-800'
    },
    {
      id: 'lease_deed',
      title: 'पट्टा विलेख / लीज डीड (Lease Agreement)',
      tag: 'व्यावसायिक व दीर्घकालीन',
      desc: 'दुकान, व्यावसायिक कॉम्प्लेक्स, गोदाम अथवा आवासीय भवनों का पंजीकृत दीर्घकालीन पट्टा विलेख।',
      features: ['कानूनी वैधता एवं बेदखली सुरक्षा', 'बैंक लोन व व्यावसायिक लाइसेंस हेतु अनिवार्य', 'अवधि अनुसार पारदर्शी स्टाम्प गणना'],
      icon: Key,
      color: 'from-cyan-600 to-blue-700'
    },
    {
      id: 'agreement',
      title: 'इकरारनामा बैनामा (Agreement to Sell)',
      tag: 'बयाना अनुबंध',
      desc: 'प्रॉपर्टी खरीद-बिक्री हेतु अग्रिम बयाना राशि, शर्तें एवं रजिस्ट्री की समय-सीमा तय करने वाला अनुबंध पत्र।',
      features: ['कब्ज़ा सहित अथवा बिना कब्ज़ा के प्रारूप', 'विधिक शर्तों का मजबूत सुरक्षा कवच', 'न्यायालय में पूर्ण प्रवर्तनीय'],
      icon: FileSignature,
      color: 'from-rose-600 to-pink-700'
    },
    {
      id: 'poa_will',
      title: 'मुख्तारनामा (POA) व वसीयतनामा (Will)',
      tag: 'अधिकार व वसीयत',
      desc: 'प्रॉपर्टी देखरेख व बिक्री हेतु पावर ऑफ अटॉर्नी तथा भविष्य की कानूनी वसीयत का गोपनीय प्रारूपण।',
      features: ['वसीयत पर शून्य स्टाम्प ड्यूटी (फ्री)', 'अस्पष्टता रहित कानूनी भाषा', 'विश्वसनीय एवं गोपनीय प्रक्रिया'],
      icon: Scroll,
      color: 'from-amber-700 to-yellow-800'
    },
    {
      id: 'dlc_valuation',
      title: 'डीएलसी दर जानकारी व संपत्ति मूल्यांकन',
      tag: 'अजमेर स्पेशल',
      desc: 'अजमेर कलेक्ट्रेट एवं ई-पंजीयन पोर्टल पर आपकी कॉलोनी, मुख्य मार्ग अथवा आंतरिक रोड की सही DLC दर।',
      features: ['वैशाली नगर, पंचशील, शास्त्री नगर, कोटड़ा आदि', 'व्यावसायिक vs आवासीय सटीक दरें', 'अनावश्यक अधिक स्टाम्प से बचत'],
      icon: Calculator,
      color: 'from-emerald-700 to-green-800'
    },
    {
      id: 'sub_registrar_service',
      title: 'सब-रजिस्ट्रार अजमेर पेशी व पूर्ण रजिस्ट्री',
      tag: 'एंड-टू-एंड सेवा',
      desc: 'ई-ग्रास ऑनलाइन चालान, ई-स्टाम्प, फोटो-अंगूठा बायोमेट्रिक पेशी से लेकर अंतिम रजिस्ट्री प्राप्त करने तक।',
      features: ['उप-पंजीयक अजमेर प्रथम व द्वितीय', 'अनुभवी स्टाफ द्वारा व्यक्तिगत मार्गदर्शन', 'समय की पूरी बचत व झंझटमुक्त काम'],
      icon: Building2,
      color: 'from-slate-700 to-[#0B1B3D]'
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-3 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" /> {t('servicesTitle')}
          </div>
          <h2 className="text-3xl font-extrabold text-[#0B1B3D] sm:text-4xl">
            अजमेर में आपकी संपत्ति के सभी कानूनी विलेख व सेवाएँ
          </h2>
          <p className="mt-3 text-base text-slate-600">
            {t('servicesSubtitle')}। राजस्थान मुद्रांक अधिनियम के प्रावधानों के तहत तैयार हर दस्तावेज़ आपकी संपत्ति को आजीवन सुरक्षित रखता है।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                className="group relative bg-slate-50 hover:bg-white rounded-2xl p-7 border border-slate-200 hover:border-amber-400/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-100/80 px-2.5 py-1 rounded-full border border-amber-200">
                      {s.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0B1B3D] mb-2 group-hover:text-amber-700 transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {s.desc}
                  </p>

                  <div className="space-y-2 border-t border-slate-200/60 pt-4 mb-6">
                    {s.features.map((f, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectService ? onSelectService(s.title) : window.location.assign('#contact')}
                  className="w-full py-2.5 px-4 rounded-xl bg-white group-hover:bg-[#0B1B3D] text-[#0B1B3D] group-hover:text-white border border-slate-300 group-hover:border-[#0B1B3D] text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>इस सेवा हेतु परामर्श लें</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
