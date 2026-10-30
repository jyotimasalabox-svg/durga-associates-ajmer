'use client';

import React, { useState, useMemo } from 'react';
import { DocTypeKey, AreaType, BuyerCategory, CalculationInput } from '@/lib/types';
import { calculateRegistrationCost } from '@/lib/calculatorEngine';
import { Calculator, CheckCircle2, Info, ArrowRight, Phone, FileCheck } from 'lucide-react';
import { useLanguage } from '@/lib/languageContext';

export default function PublicCalculator({ onOpenAppointment }: { onOpenAppointment?: (initialService?: string) => void }) {
  const { t, lang } = useLanguage();

  const [docType, setDocType] = useState<DocTypeKey>('sale_deed');
  const [areaType, setAreaType] = useState<AreaType>('urban');
  const [buyerGender, setBuyerGender] = useState<BuyerCategory>('male');
  const [considerationValue, setConsiderationValue] = useState<number>(2500000);
  const [propertyAreaSqYard, setPropertyAreaSqYard] = useState<number>(150);
  const [dlcRatePerSqYard, setDlcRatePerSqYard] = useState<number>(12000);

  const calculation = useMemo(() => {
    const input: CalculationInput = {
      docType,
      areaType,
      buyerGender,
      considerationValue,
      propertyAreaSqYard,
      dlcRatePerSqYard,
      isBloodRelative: docType === 'gift_deed_family' || docType === 'release_deed',
      pageCount: 5,
      draftingFee: 0,
      serviceFee: 0
    };
    return calculateRegistrationCost(input);
  }, [docType, areaType, buyerGender, considerationValue, propertyAreaSqYard, dlcRatePerSqYard]);

  return (
    <section id="calculator" className="py-16 bg-gradient-to-b from-slate-50 to-slate-100 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <Calculator className="w-3.5 h-3.5" /> राजस्थान ई-पंजीयन कैलकुलेटर
          </div>
          <h2 className="text-3xl font-extrabold text-[#0B1B3D] sm:text-4xl">
            प्रॉपर्टी रजिस्ट्री एवं स्टाम्प ड्यूटी कैलकुलेटर
          </h2>
          <p className="mt-3 text-base text-slate-600">
            अजमेर एवं राजस्थान की आधिकारिक DLC दरों, महिला क्रेता छूट (1%), सरचार्ज तथा सरकारी पंजीयन नियमों के आधार पर तुरंत सटीक खर्च जानें।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Input Form Column */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200">
            <h3 className="text-lg font-bold text-[#0B1B3D] mb-5 pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>दस्तावेज़ एवं संपत्ति विवरण</span>
              <span className="text-xs font-normal text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                नवीनतम वित्त वर्ष दरें लागू
              </span>
            </h3>

            <div className="space-y-5">
              {/* Document Type Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  दस्तावेज़ का प्रकार (Document Type)
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as DocTypeKey)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                >
                  <option value="sale_deed">विक्रय पत्र / बैनामा (Sale Deed)</option>
                  <option value="gift_deed_family">दान पत्र - परिवार / रक्त संबंधी (Gift Deed - Family - 1% रियायती)</option>
                  <option value="gift_deed_other">दान पत्र - गैर रिश्तेदार (Gift Deed - Non-relatives)</option>
                  <option value="release_deed">हकत्याग पत्र - सह-खातेदार / पैतृक (Release Deed)</option>
                  <option value="agreement_to_sell_possession">इकरारनामा बैनामा - कब्ज़ा सहित (Agreement to Sell)</option>
                  <option value="agreement_to_sell_no_possession">इकरारनामा - बिना कब्ज़ा (Agreement without possession)</option>
                  <option value="lease_deed">पट्टा विलेख / रजिस्टर्ड लीज (Lease Deed)</option>
                  <option value="will">वसीयतनामा (Will Deed - शून्य स्टाम्प)</option>
                </select>
              </div>

              {/* Area Type & Buyer Gender (2 cols) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    क्षेत्र का प्रकार (Area Type)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAreaType('urban')}
                      className={`py-2 px-3 text-xs font-semibold rounded-lg border transition ${
                        areaType === 'urban'
                          ? 'bg-[#0B1B3D] text-white border-[#0B1B3D] shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      शहरी (ADA / निगम)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAreaType('rural')}
                      className={`py-2 px-3 text-xs font-semibold rounded-lg border transition ${
                        areaType === 'rural'
                          ? 'bg-[#0B1B3D] text-white border-[#0B1B3D] shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      ग्रामीण (पंचायत)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    क्रेता की श्रेणी / लिंग (Buyer Category)
                  </label>
                  <select
                    value={buyerGender}
                    onChange={(e) => setBuyerGender(e.target.value as BuyerCategory)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="male">पुरुष क्रेता (Standard Male Rate)</option>
                    <option value="female">महिला क्रेता (Female - 1% सरकारी छूट)</option>
                    <option value="joint">संयुक्त क्रेता (महिला + पुरुष - 0.5% छूट)</option>
                  </select>
                </div>
              </div>

              {/* Consideration Value vs DLC Parameters */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  मूल्यांकन आधार (Consideration vs DLC Rate)
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs text-slate-600 font-medium">दस्तावेज़ में तय विक्रय मूल्य (रुपये)</label>
                    <span className="text-xs font-bold text-[#0B1B3D]">₹{considerationValue.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="50000"
                    value={considerationValue}
                    onChange={(e) => setConsiderationValue(Number(e.target.value) || 0)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-600 font-medium mb-1">क्षेत्रफल (वर्ग गज में)</label>
                    <input
                      type="number"
                      min="1"
                      value={propertyAreaSqYard}
                      onChange={(e) => setPropertyAreaSqYard(Number(e.target.value) || 0)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 font-medium mb-1">डीएलसी दर (₹ प्रति वर्ग गज)</label>
                    <input
                      type="number"
                      min="100"
                      step="500"
                      value={dlcRatePerSqYard}
                      onChange={(e) => setDlcRatePerSqYard(Number(e.target.value) || 0)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs text-slate-600 border-t border-slate-200">
                  <span>डीएलसी कुल मूल्यांकन: <strong>₹{(propertyAreaSqYard * dlcRatePerSqYard).toLocaleString('en-IN')}</strong></span>
                  <span>दर्ज विक्रय मूल्य: <strong>₹{considerationValue.toLocaleString('en-IN')}</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Result Calculation Column */}
          <div className="lg:col-span-5 bg-[#0B1B3D] text-white p-6 sm:p-8 rounded-2xl shadow-xl border border-amber-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-5">
                <div>
                  <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block">सरकारी खर्च आकलन</span>
                  <h3 className="text-lg font-bold text-white">ई-पंजीयन गणना पत्रक</h3>
                </div>
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  ✓
                </div>
              </div>

              {/* Valuation Base Highlight */}
              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 mb-5 text-xs text-slate-300">
                <div className="text-slate-400 mb-1">गणना हेतु मान्य मूल्यांकन (Base Valuation):</div>
                <div className="text-xl font-black text-amber-400">
                  ₹{calculation.applicableValuation.toLocaleString('en-IN')}
                </div>
                <div className="mt-1 text-[11px] text-slate-400 leading-tight">
                  {calculation.valuationNote}
                </div>
              </div>

              {/* Breakdown List */}
              <div className="space-y-3 text-xs mb-6">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-300">
                    मूल स्टाम्प ड्यूटी ({calculation.stampDutyPercent > 0 ? `${calculation.stampDutyPercent}%` : 'नियत'})
                  </span>
                  <span className="font-bold text-white text-sm">
                    {calculation.stampDutyAmount > 0 ? `₹${calculation.stampDutyAmount.toLocaleString('en-IN')}` : 'लागू नहीं / ₹0'}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <span className="text-slate-300 block">कुल सरचार्ज (20%)</span>
                    <span className="text-[10px] text-slate-400">
                      (10% आधारभूत संरचना + 10% गो संवर्धन)
                    </span>
                  </div>
                  <span className="font-bold text-white text-sm">
                    {calculation.surchargeBreakdown.totalAmount > 0 
                      ? `₹${calculation.surchargeBreakdown.totalAmount.toLocaleString('en-IN')}` 
                      : 'लागू नहीं / ₹0'}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <span className="text-slate-300 block">पंजीयन शुल्क (Registration Fee)</span>
                    <span className="text-[10px] text-slate-400">{calculation.registrationFeeNote}</span>
                  </div>
                  <span className="font-bold text-white text-sm">
                    {calculation.registrationFeeAmount > 0 
                      ? `₹${calculation.registrationFeeAmount.toLocaleString('en-IN')}` 
                      : 'लागू नहीं / ₹0'}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-300">स्कैनिंग एवं CSI सरकारी कंप्यूटर शुल्क</span>
                  <span className="font-bold text-white text-sm">
                    ₹{calculation.scanningFeeAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Total Govt Fee */}
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-amber-300 font-semibold block uppercase">अनुमानित कुल सरकारी शुल्क</span>
                    <span className="text-[11px] text-slate-300">(ई-ग्रास ई-स्टाम्प + रजिस्ट्रेशन)</span>
                  </div>
                  <div className="text-2xl font-extrabold text-amber-400">
                    ₹{calculation.totalGovtFees.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 leading-normal flex items-start gap-1.5 mb-5">
                <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  यह सरकारी शुल्क ई-ग्रास चालान हेतु अनुमानित है। विलेख प्रारूपण, ग्रीन पेपर एवं हमारी सेवा फीस का स्पष्ट विवरण कार्यालय में दिया जाता है।
                </span>
              </div>
            </div>

            {/* CTA action */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => onOpenAppointment ? onOpenAppointment(calculation.docTypeName) : window.location.assign('#contact')}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm shadow-lg shadow-amber-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>इस रजिस्ट्री हेतु अपॉइंटमेंट लें</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="tel:9829261354"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" /> सीधे कॉल करें: 9829261354
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
