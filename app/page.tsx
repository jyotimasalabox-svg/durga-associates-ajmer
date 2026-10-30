'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import ServicesSection from '@/components/ServicesSection';
import ProcessGuide from '@/components/ProcessGuide';
import PublicCalculator from '@/components/PublicCalculator';
import DocumentChecklist from '@/components/DocumentChecklist';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import { 
  ShieldCheck, 
  Phone, 
  MapPin, 
  Calculator, 
  CalendarCheck, 
  CheckCircle2, 
  ArrowRight, 
  Scale, 
  Clock, 
  Building,
  Award,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '@/lib/languageContext';

export default function HomePage() {
  const { t, lang } = useLanguage();
  const [selectedServiceForAppointment, setSelectedServiceForAppointment] = useState<string>('');

  const handleSelectService = (serviceTitle?: string) => {
    if (serviceTitle) {
      setSelectedServiceForAppointment(serviceTitle);
    }
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#071228] via-[#0B1B3D] to-[#162E66] text-white pt-12 pb-24 overflow-hidden border-b border-amber-500/20">
        {/* Subtle decorative royal background elements */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-20 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-semibold shadow-sm backdrop-blur-md">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>राजस्थान ई-पंजीयन अधिकृत • अजमेर कलेक्ट्रेट व सब-रजिस्ट्रार विशेषज्ञ</span>
              </div>

              {/* Main Heading */}
              <div className="space-y-2">
                <span className="text-sm uppercase tracking-wider text-amber-400 font-bold block">
                  दुर्गा एसोसिएट्स एंड प्रॉपर्टी डीलर, अजमेर
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
                  अजमेर में प्रॉपर्टी रजिस्ट्री, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">बैनामा व कानूनी विलेखों</span> का संपूर्ण व पारदर्शी समाधान
                </h1>
              </div>

              {/* Subtitle / Description */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                राजस्थान सरकार के नवीनतम ई-पंजीयन (e-Panjiyan) नियमों, प्राधिकृत DLC दरों और महिला क्रेता छूट (1%) के अनुसार बैनामा, दान पत्र (Gift Deed), हकत्याग, लीज एवं समस्त कानूनी दस्तावेजों का सटीक प्रारूपण व पंजीयन।
              </p>

              {/* Key Bullet Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% पारदर्शी e-Gras सरकारी चालान</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>सरकारी खर्च और सर्विस फीस का अलग स्पष्ट ब्योरा</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>अजमेर प्रथम व द्वितीय सब-रजिस्ट्रार पेशी सहायता</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>रक्त संबंधियों हेतु 1% रियायती गिफ्ट डीड</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-4">
                <a
                  href="#calculator"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 hover:-translate-y-0.5"
                >
                  <Calculator className="w-4 h-4 text-slate-950" />
                  <span>रजिस्ट्री शुल्क कैलकुलेटर</span>
                </a>

                <a
                  href="#contact"
                  className="px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-600 shadow-md transition-all flex items-center gap-2 hover:-translate-y-0.5"
                >
                  <CalendarCheck className="w-4 h-4 text-emerald-400" />
                  <span>अपॉइंटमेंट बुक करें</span>
                </a>

                <a
                  href="tel:9829261354"
                  className="px-5 py-3.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-semibold text-sm border border-emerald-500/40 transition-all flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>9829261354</span>
                </a>
              </div>
            </div>

            {/* Right Hero Highlights Card (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
                
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                      <Scale className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm">विधिक सेवा केंद्र • अजमेर</h3>
                      <p className="text-[11px] text-slate-400">उप-पंजीयक कार्यालय, कलेक्ट्री परिसर के निकट</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
                    अधिकृत
                  </span>
                </div>

                <div className="space-y-3.5">
                  <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/60">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-amber-400 mt-1 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-white">अजमेर प्रथम (कलेक्ट्री) व द्वितीय (तोपदड़ा)</div>
                        <p className="text-[11px] text-slate-300 mt-0.5">
                          संपूर्ण अजमेर शहर, वैशाली नगर, पंचशील, शास्त्री नगर, कोटड़ा, आदर्श नगर, ब्यावर रोड, पुष्कर रोड आदि।
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/60">
                    <div className="flex items-start gap-3">
                      <FileCheck2 className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-white">सभी प्रकार के रजिस्ट्री विलेख</div>
                        <p className="text-[11px] text-slate-300 mt-0.5">
                          विक्रय पत्र (बैनामा), दान पत्र (Gift Deed), पारिवारिक हकत्याग, विभाजन विलेख, लीज डीड एवं इकरारनामा।
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/60">
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-amber-300 mt-1 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-white">त्वरित ऑनलाइन स्लॉट बुकिंग</div>
                        <p className="text-[11px] text-slate-300 mt-0.5">
                          समय पर टोकन स्लॉट, बायोमेट्रिक व फोटोग्राफी में बिना कतार परेशानी-मुक्त पेशी सहायता।
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct Emergency / Contact Banner */}
                <div className="mt-5 p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-600/20 border border-amber-500/30 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-amber-200 font-medium">डीएलसी दर व स्टाम्प परामर्श हेतु</div>
                    <div className="text-xs font-bold text-white">कॉल करें: 9829261354 / 8003987152</div>
                  </div>
                  <a
                    href="tel:9829261354"
                    className="p-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow"
                    title="Call Now"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Ajmer Area Coverage Ticker */}
      <section className="bg-white border-b border-slate-200 py-4 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
            <span className="font-bold text-[#0B1B3D] flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> अजमेर कार्यक्षेत्र कवरेज:
            </span>
            <div className="flex flex-wrap items-center gap-2 font-medium">
              {[
                'वैशाली नगर',
                'पंचशील नगर',
                'शास्त्री नगर',
                'कोटड़ा',
                'आदर्श नगर',
                'मदार गेट व नया बाजार',
                'सिविल लाइन्स',
                'पुष्कर रोड',
                'जयपुर रोड',
                'गेगल व ग्रामीण',
                'किशनगढ़'
              ].map((loc, i) => (
                <span key={i} className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200/80">
                  {loc}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <ServicesSection onSelectService={handleSelectService} />

      {/* Step by Step Process Guide */}
      <ProcessGuide />

      {/* Public Calculator */}
      <PublicCalculator onOpenAppointment={handleSelectService} />

      {/* Documents Checklist Section */}
      <DocumentChecklist />

      {/* Ajmer Sub-Registrar Offices Guide Section */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              अजमेर पंजीयन कार्यालय
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3D] mt-2">
              उप-पंजीयक कार्यालय (Sub-Registrar Offices) अजमेर
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              आपकी प्रॉपर्टी किस उप-पंजीयक कार्यालय के क्षेत्राधिकार में आती है, यह जानना रजिस्ट्री प्रक्रिया का प्रथम चरण है:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Ajmer-I */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition-all shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#0B1B3D] text-white flex items-center justify-center font-bold">
                  I
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0B1B3D]">उप-पंजीयक कार्यालय अजमेर प्रथम</h3>
                  <p className="text-xs text-slate-500">कलेक्ट्रेट परिसर (Collectorate), अजमेर</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                मुख्य शहर, सिविल लाइन्स, कलेक्ट्रेट, वैशाली नगर, फॉयसागर रोड, शास्त्री नगर, कोटड़ा एवं संबंधित वार्डों के अंतर्गत आने वाली संपत्तियों का पंजीयन।
              </p>
              <div className="text-xs font-medium text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>दुर्गा एसोसिएट्स टीम कलेक्ट्रेट परिसर में मौके पर उपस्थित रहती है।</span>
              </div>
            </div>

            {/* Ajmer-II */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition-all shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                  II
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0B1B3D]">उप-पंजीयक कार्यालय अजमेर द्वितीय</h3>
                  <p className="text-xs text-slate-500">तोपदड़ा / नया बस स्टैंड रोड, अजमेर</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                आदर्श नगर, पंचशील, माखुपुरा, नसीराबाद रोड, मदार, पालरा इंडस्ट्रियल एरिया, गेगल एवं संबंधित उपनगरीय/ग्रामीण क्षेत्रों की संपत्तियों का पंजीयन।
              </p>
              <div className="text-xs font-medium text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>समय पर टोकन स्लॉट व समस्त ई-ग्रास चालान वेरिफिकेशन में पूर्ण सहयोग।</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Contact & Appointment Section */}
      <ContactSection selectedService={selectedServiceForAppointment} />

      <Footer />
    </div>
  );
}
