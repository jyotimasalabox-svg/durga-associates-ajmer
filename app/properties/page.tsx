'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import PropertyListingsSection from '@/components/PropertyListingsSection';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Home, ChevronRight, Phone, ShieldCheck, Flame, Building2 } from 'lucide-react';

export default function PropertiesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-gradient-to-br from-[#071228] via-[#0B1B3D] to-[#162E66] text-white pt-8 pb-12 border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-4">
            <Link href="/" className="hover:text-amber-300 transition flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span>मुख्य पृष्ठ</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-amber-300 font-semibold">बिकाऊ संपत्तियां (अजमेर)</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 mb-2">
                <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>दुर्गा एसोसिएट्स अधिकृत रेट व संपत्ति सूची</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                अजमेर में उपलब्ध बिकाऊ प्लॉट व मकान
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl">
                धोला भाटा, विराट नगर, सुभाष नगर, भगवानगंज एवं समस्त अजमेर क्षेत्र में बिकाऊ भूखंडों व मकानों का प्रमाणित ब्योरा।
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="tel:9829261354"
                className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg transition"
              >
                <Phone className="w-4 h-4 text-slate-950" />
                <span>9829261354</span>
              </a>
              <a
                href="tel:8003987152"
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-600 transition flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>8003987152</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Main Listings */}
      <main className="flex-1">
        <PropertyListingsSection />
      </main>

      <Footer />
    </div>
  );
}
