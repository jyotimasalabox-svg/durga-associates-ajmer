'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/languageContext';
import { Phone, ShieldCheck, Menu, X, Globe, Lock, FileText, Calculator } from 'lucide-react';

export default function Navbar() {
  const { lang, toggleLang, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0B1B3D] text-white shadow-xl border-b border-amber-500/30">
      {/* Top Bar with Contacts & Quick Notice */}
      <div className="bg-[#071228] text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-amber-300 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>राजस्थान ई-पंजीयन अधिकृत प्रारूपण एवं संपत्ति परामर्शदाता • अजमेर</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:9829261354" className="hover:text-amber-300 transition-colors flex items-center gap-1 font-semibold">
              <Phone className="w-3 h-3 text-emerald-400" /> 9829261354
            </a>
            <span className="text-slate-600">|</span>
            <a href="tel:8003987152" className="hover:text-amber-300 transition-colors flex items-center gap-1 font-semibold">
              <Phone className="w-3 h-3 text-emerald-400" /> 8003987152
            </a>
            <button
              onClick={toggleLang}
              className="ml-2 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs flex items-center gap-1 border border-slate-700 cursor-pointer transition-all"
              title="Change Language"
            >
              <Globe className="w-3 h-3 text-amber-400" />
              {lang === 'hi' ? 'English' : 'हिन्दी'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold text-2xl shadow-md border border-amber-300/40 group-hover:scale-105 transition-transform">
            द
          </div>
          <div>
            <div className="font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-amber-300 transition-colors">
              दुर्गा एसोसिएट्स <span className="text-amber-400 font-normal">& प्रॉपर्टी डीलर</span>
            </div>
            <div className="text-xs text-slate-300 flex items-center gap-1">
              <span className="text-emerald-400 font-medium">अजमेर</span> • बैनामा, रजिस्ट्री, स्टाम्प व संपत्ति विशेषज्ञ
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/#services" className="text-slate-200 hover:text-amber-300 transition-colors">
            {t('navServices')}
          </Link>
          <Link href="/#process" className="text-slate-200 hover:text-amber-300 transition-colors">
            {t('navProcess')}
          </Link>
          <Link href="/#documents" className="text-slate-200 hover:text-amber-300 transition-colors">
            {t('navDocuments')}
          </Link>
          <Link href="/#calculator" className="text-slate-200 hover:text-amber-300 transition-colors flex items-center gap-1">
            <Calculator className="w-4 h-4 text-emerald-400" />
            {t('navCalculator')}
          </Link>
          <Link href="/#contact" className="text-slate-200 hover:text-amber-300 transition-colors">
            {t('navContact')}
          </Link>
        </nav>

        {/* Action Buttons: Phone & Admin Login */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="https://wa.me/919829261354?text=नमस्ते%20दुर्गा%20एसोसिएट्स,%20मुझे%20प्रॉपर्टी%20रजिस्ट्री%20हेतु%20जानकारी%20चाहिए।"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
          >
            WhatsApp
          </a>

          <Link
            href="/admin"
            className="px-3.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>एडमिन लॉगिन</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-200 hover:text-white focus:outline-none"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#071228] border-t border-slate-800 px-4 pt-3 pb-5 space-y-3">
          <Link
            href="/#services"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-200 hover:text-amber-300 border-b border-slate-850"
          >
            {t('navServices')}
          </Link>
          <Link
            href="/#process"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-200 hover:text-amber-300 border-b border-slate-850"
          >
            {t('navProcess')}
          </Link>
          <Link
            href="/#documents"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-200 hover:text-amber-300 border-b border-slate-850"
          >
            {t('navDocuments')}
          </Link>
          <Link
            href="/#calculator"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-emerald-400 font-semibold border-b border-slate-850 flex items-center gap-2"
          >
            <Calculator className="w-4 h-4" />
            {t('navCalculator')}
          </Link>
          <Link
            href="/#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-200 hover:text-amber-300 border-b border-slate-850"
          >
            {t('navContact')}
          </Link>

          <div className="pt-2 flex flex-col gap-2">
            <a
              href="tel:9829261354"
              className="w-full py-2 px-3 text-center rounded-lg bg-slate-800 text-white font-medium flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-emerald-400" /> 9829261354 पर कॉल करें
            </a>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2 px-3 text-center rounded-lg bg-amber-600 text-white font-semibold flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" /> निजी एडमिन डैशबोर्ड लॉगिन
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
