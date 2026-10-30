'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, MapPin, Clock, ShieldCheck, Lock, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/lib/languageContext';

export default function Footer() {
  const { t } = useLanguage();
  const [year, setYear] = useState('2026');

  useEffect(() => {
    setYear(String(new Date().getFullYear()));
  }, []);

  return (
    <footer className="bg-[#071228] text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Summary */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-amber-500/80 shadow shrink-0 bg-slate-800">
                <Image
                  src="/logo.jpg"
                  alt="दुर्गा एसोसिएट्स लोगो"
                  width={44}
                  height={44}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="font-bold text-white text-base">
                दुर्गा एसोसिएट्स <span className="text-amber-400">& प्रॉपर्टी डीलर</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              अजमेर में अचल संपत्ति रजिस्ट्री, बैनामा, गिफ्ट डीड, हकत्याग, लीज एग्रीमेंट, डीएलसी दर मूल्यांकन एवं ई-ग्रास चालान हेतु विश्वसनीय व अनुभवी समाधान।
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 text-xs font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> राजस्थान ई-पंजीयन दिशा-निर्देशानुसार
              </span>
            </div>
          </div>

          {/* Quick Services */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              प्रमुख सेवाएँ
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/#properties" className="text-amber-400 font-bold hover:text-amber-300 flex items-center gap-1">
                  <span>🔥 बिकाऊ संपत्तियां (Properties For Sale)</span>
                </Link>
              </li>
              <li><Link href="/#services" className="hover:text-amber-300">विक्रय पत्र / बैनामा (Sale Deed)</Link></li>
              <li><Link href="/#services" className="hover:text-amber-300">दान पत्र - परिवार/अन्य (Gift Deed)</Link></li>
              <li><Link href="/#services" className="hover:text-amber-300">हकत्याग पत्र (Release Deed)</Link></li>
              <li><Link href="/#services" className="hover:text-amber-300">पट्टा विलेख / लीज डीड (Lease)</Link></li>
              <li><Link href="/#services" className="hover:text-amber-300">इकरारनामा बैनामा (Agreement)</Link></li>
              <li><Link href="/#services" className="hover:text-amber-300">मुख्तारनामा व वसीयतनामा (POA & Will)</Link></li>
            </ul>
          </div>

          {/* Ajmer Registration Offices Info */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              कार्यक्षेत्र व कार्यालय
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                <span>उप-पंजीयक कार्यालय अजमेर प्रथम (कलेक्ट्री परिसर)</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                <span>उप-पंजीयक कार्यालय अजमेर द्वितीय (नया बस स्टैंड/तोपदड़ा)</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                <span>अजमेर विकास प्राधिकरण (ADA) एवं नगर निगम क्षेत्र</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                <span>पुष्कर, गेगल, किशनगढ़ एवं ग्रामीण पंचायती राज</span>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              सीधा संपर्क
            </h4>
            <div className="space-y-2.5 text-xs">
              <p className="flex items-center gap-2 text-slate-200">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:9829261354" className="hover:text-amber-300 font-bold">9829261354</a>, 
                <a href="tel:8003987152" className="hover:text-amber-300 font-bold">8003987152</a>
              </p>
              <p className="flex items-start gap-2 text-slate-300">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>प्रातः 09:30 से सायं 07:00 (सोमवार - शनिवार)</span>
              </p>
              <div className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 bg-amber-950/40 px-3 py-1.5 rounded border border-amber-800/40"
                >
                  <Lock className="w-3 h-3" /> अधिकृत स्टाफ / एडमिन लॉगिन
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer & Bottom note */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs gap-3">
          <p className="text-slate-400 text-center sm:text-left">
            © {year} दुर्गा एसोसिएट्स एंड प्रॉपर्टी डीलर, अजमेर। सर्वाधिकार सुरक्षित।
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>DLC दर व स्टाम्प नियम: राजस्थान सरकार ई-पंजीयन अनुसार</span>
            <span className="text-slate-700">•</span>
            <Link href="/admin" className="text-slate-300 hover:text-amber-400 flex items-center gap-1">
              Admin Portal <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
