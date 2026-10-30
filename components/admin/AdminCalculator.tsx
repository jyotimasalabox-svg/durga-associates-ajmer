'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { DocTypeKey, AreaType, BuyerCategory, CalculationInput, CalculationResult, RateRule } from '@/lib/types';
import { calculateRegistrationCost } from '@/lib/calculatorEngine';
import { DEFAULT_RATE_RULES } from '@/lib/defaultRates';
import { 
  Calculator, 
  Printer, 
  UserPlus, 
  Info, 
  CheckCircle2, 
  HelpCircle, 
  FileText, 
  Building2, 
  Sparkles,
  ExternalLink,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface Props {
  onSaveAsClient?: (prefillData: any) => void;
  rates?: Record<string, RateRule>;
}

export default function AdminCalculator({ onSaveAsClient, rates }: Props) {
  const [docType, setDocType] = useState<DocTypeKey>('sale_deed');
  const [areaType, setAreaType] = useState<AreaType>('urban');
  const [buyerGender, setBuyerGender] = useState<BuyerCategory>('male');
  const [considerationValue, setConsiderationValue] = useState<number>(3000000);
  const [propertyAreaSqYard, setPropertyAreaSqYard] = useState<number>(180);
  const [dlcRatePerSqYard, setDlcRatePerSqYard] = useState<number>(15000);
  const [pageCount, setPageCount] = useState<number>(6);
  const [isBloodRelative, setIsBloodRelative] = useState<boolean>(true);
  const [relationshipType, setRelationshipType] = useState<string>('माता/पिता या पुत्र/पुत्री');
  const [draftingFee, setDraftingFee] = useState<number>(3500);
  const [serviceFee, setServiceFee] = useState<number>(2500);

  // Client Details for Quote / Printing
  const [clientName, setClientName] = useState<string>('श्री / श्रीमती ');
  const [propertyLocation, setPropertyLocation] = useState<string>('अजमेर (राज.)');
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  // Calculation memo
  const calculation: CalculationResult = useMemo(() => {
    const input: CalculationInput = {
      docType,
      areaType,
      buyerGender,
      considerationValue,
      dlcRatePerSqYard,
      propertyAreaSqYard,
      isBloodRelative,
      relationshipType,
      pageCount,
      draftingFee,
      serviceFee
    };
    return calculateRegistrationCost(input, rates);
  }, [
    docType, 
    areaType, 
    buyerGender, 
    considerationValue, 
    dlcRatePerSqYard, 
    propertyAreaSqYard, 
    isBloodRelative, 
    relationshipType, 
    pageCount, 
    draftingFee, 
    serviceFee, 
    rates
  ]);

  const handlePrint = () => {
    window.print();
  };

  const handleCreateClient = () => {
    if (onSaveAsClient) {
      onSaveAsClient({
        clientName: clientName.trim() === 'श्री / श्रीमती' ? '' : clientName,
        docType,
        areaType,
        propertyDetails: {
          areaSqYard: propertyAreaSqYard,
          dlcRate: dlcRatePerSqYard,
          dlcTotal: calculation.dlcValuation,
          considerationValue,
          colonyOrLocality: propertyLocation
        },
        fees: {
          govtStamp: calculation.stampDutyAmount,
          govtSurcharge: calculation.surchargeBreakdown.totalAmount,
          govtReg: calculation.registrationFeeAmount,
          govtScanning: calculation.scanningFeeAmount,
          totalGovt: calculation.totalGovtFees,
          officeDrafting: calculation.officeDraftingFee,
          officeService: calculation.officeServiceFee,
          totalOffice: calculation.totalOfficeFees,
          grandTotal: calculation.grandTotal
        }
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-[#0B1B3D] flex items-center gap-2">
              <Calculator className="w-7 h-7 text-amber-500" />
              राजस्थान ई-पंजीयन स्मार्ट कैलकुलेटर (Admin Pro)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            सरकारी स्टाम्प ड्यूटी, सरचार्ज, रजिस्ट्रेशन व स्कैनिंग शुल्क तथा दुर्गा एसोसिएट्स फीस का सटीक पृथक्करण
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowPrintModal(true)}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-300 shadow-xs flex items-center gap-1.5 transition"
          >
            <Printer className="w-4 h-4 text-slate-600" /> कोटेशन प्रिंट करें
          </button>
          
          <button
            onClick={handleCreateClient}
            className="px-4 py-2 rounded-xl bg-[#0B1B3D] hover:bg-[#162E66] text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition"
          >
            <UserPlus className="w-4 h-4 text-amber-400" /> नया ग्राहक केस बनाएं
          </button>
        </div>
      </div>

      {/* Main Grid: Inputs vs Calculation Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Inputs (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 pb-3 border-b border-slate-100 flex items-center justify-between">
            <span>1. विलेख व संपत्ति विवरण</span>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              ई-पंजीयन 2024-25 राजस्थान नियम
            </span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Document Type */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                दस्तावेज़ का प्रकार (Deed Type)
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as DocTypeKey)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="sale_deed">विक्रय पत्र (बैनामा / Sale Deed - 6% पुरुष, 5% महिला)</option>
                <option value="gift_deed_family">दान पत्र - परिवार / सगे संबंधी (Gift Deed Family - मात्र 1%)</option>
                <option value="gift_deed_other">दान पत्र - अन्य / गैर रिश्तेदार (Gift Deed - 6% / 5%)</option>
                <option value="release_deed">हकत्याग पत्र - सह-खातेदार / पैतृक (Release Deed - फ्लैट ₹2,000)</option>
                <option value="partition_deed">विभाजन पत्र (बंटवारा / Partition Deed)</option>
                <option value="agreement_to_sell_possession">इकरारनामा बैनामा - कब्ज़ा सहित (Agreement With Possession)</option>
                <option value="agreement_to_sell_no_possession">इकरारनामा बैनामा - बिना कब्ज़ा (Agreement No Possession)</option>
                <option value="lease_deed">पट्टा विलेख / रजिस्टर्ड लीज (Lease Deed)</option>
                <option value="poa_sale">मुख्तारनामा - संपत्ति बिक्री अधिकार (POA Sale)</option>
                <option value="poa_general">सामान्य मुख्तारनामा (General POA)</option>
                <option value="will">वसीयतनामा (Will Deed - शून्य स्टाम्प)</option>
                <option value="mortgage">बंधक विलेख (Mortgage Deed)</option>
              </select>
            </div>

            {/* Area Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                क्षेत्र का प्रकार (Area Type)
              </label>
              <select
                value={areaType}
                onChange={(e) => setAreaType(e.target.value as AreaType)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="urban">शहरी क्षेत्र (Urban - अजमेर नगर निगम / ADA)</option>
                <option value="rural">ग्रामीण क्षेत्र (Rural - पंचायती राज क्षेत्र)</option>
              </select>
            </div>

            {/* Buyer Gender / Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                क्रेता श्रेणी / लिंग (Buyer Category)
              </label>
              <select
                value={buyerGender}
                onChange={(e) => setBuyerGender(e.target.value as BuyerCategory)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="male">सामान्य पुरुष (Male - पूरी स्टाम्प दर)</option>
                <option value="female">महिला क्रेता (Female - 1% सरकारी छूट)</option>
                <option value="joint">संयुक्त (महिला + पुरुष - 0.5% सरकारी छूट)</option>
                <option value="senior">वरिष्ठ नागरिक (Senior Citizen)</option>
                <option value="sc_st">एससी / एसटी (SC / ST)</option>
              </select>
            </div>

            {/* Blood Relative toggle for Gift/Release deeds */}
            {(docType === 'gift_deed_family' || docType === 'release_deed') && (
              <div className="sm:col-span-2 p-3.5 rounded-xl bg-amber-50/80 border border-amber-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-900">
                    रक्त संबंध सत्यापन (Blood Relation Proof):
                  </span>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isBloodRelative}
                      onChange={(e) => setIsBloodRelative(e.target.checked)}
                      className="w-4 h-4 text-amber-600 rounded border-amber-300"
                    />
                    <span className="text-xs font-semibold text-amber-900">सगा पारिवारिक संबंध प्रमाणित</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={relationshipType}
                  onChange={(e) => setRelationshipType(e.target.value)}
                  placeholder="रिश्ता लिखें (जैसे: पिता-पुत्र, पति-पत्नी, सगे भाई-बहन)"
                  className="w-full rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs text-slate-900"
                />
              </div>
            )}

            {/* Property Area in Sq Yard */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                कुल क्षेत्रफल (वर्ग गज में / Sq. Yards)
              </label>
              <input
                type="number"
                min="1"
                value={propertyAreaSqYard || ''}
                onChange={(e) => setPropertyAreaSqYard(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* DLC Rate */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                डीएलसी दर (₹ प्रति वर्ग गज)
              </label>
              <input
                type="number"
                min="0"
                value={dlcRatePerSqYard || ''}
                onChange={(e) => setDlcRatePerSqYard(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Consideration Value */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                दस्तावेज़ में दर्ज विक्रय मूल्य / प्रतिफल राशि (Agreement Consideration ₹)
              </label>
              <input
                type="number"
                min="0"
                value={considerationValue || ''}
                onChange={(e) => setConsiderationValue(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                यदि दान पत्र अथवा हकत्याग में प्रतिफल शून्य है, तो 0 भरें (डीएलसी दर आधार बनेगा)।
              </p>
            </div>

            {/* Page Count for CSI / Scanning Fee */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                दस्तावेज़ पृष्ठ संख्या (Scanning Pages)
              </label>
              <input
                type="number"
                min="1"
                value={pageCount || ''}
                onChange={(e) => setPageCount(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Valuation Base Preview Callout */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-500 block">लागू गणना मूल्यांकन:</span>
              <span className="font-extrabold text-base text-[#0B1B3D]">
                ₹{calculation.applicableValuation.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                (डीएलसी: ₹{calculation.dlcValuation.toLocaleString('en-IN')} | विक्रय: ₹{calculation.considerationValuation.toLocaleString('en-IN')})
              </span>
            </div>
          </div>

          {/* Office Fee Inputs */}
          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-3 flex items-center gap-1.5">
              <span>2. दुर्गा एसोसिएट्स सेवा शुल्क विवरण</span>
              <span className="text-[10px] font-normal text-slate-500">(सरकारी खर्च से पूर्णतः अलग)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  दस्तावेज़ प्रारूपण व टाइपिंग फीस (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={draftingFee}
                  onChange={(e) => setDraftingFee(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  सब-रजिस्ट्रार पेशी व कंसल्टेंसी फीस (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={serviceFee}
                  onChange={(e) => setServiceFee(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm font-semibold text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Quick Client Details for Quote / Printing */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                कोटेशन हेतु ग्राहक का नाम
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="ग्राहक का नाम"
                className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                संपत्ति का स्थान / कॉलोनी (अजमेर)
              </label>
              <input
                type="text"
                value={propertyLocation}
                onChange={(e) => setPropertyLocation(e.target.value)}
                placeholder="जैसे: वैशाली नगर / पंचशील"
                className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Full Calculation Breakdown (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-gradient-to-br from-[#071228] via-[#0B1B3D] to-[#162E66] text-white p-6 sm:p-7 rounded-2xl shadow-xl border border-amber-500/30">
            <div className="flex items-center justify-between pb-4 border-b border-slate-700">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                  लागत विश्लेषण ब्योरा
                </span>
                <h3 className="text-lg font-black text-white">{calculation.docTypeName}</h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                {calculation.areaTypeName.split(' ')[0]}
              </span>
            </div>

            {/* Valuation Base Callout */}
            <div className="my-4 p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>डीएलसी मूल्यांकन:</span>
                <span className="font-semibold text-white">₹{calculation.dlcValuation.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>दस्तावेज़ में विक्रय मूल्य:</span>
                <span className="font-semibold text-white">₹{calculation.considerationValuation.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-1.5 border-t border-slate-700 flex justify-between font-bold text-amber-300">
                <span>गणना का वैधानिक आधार:</span>
                <span>₹{calculation.applicableValuation.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Section A: Government Fees */}
            <div className="space-y-2.5 pt-2">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                <span>(अ) सरकारी शुल्क (e-Gras चालान)</span>
                <span>राशि</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-200">
                <div>
                  <span>स्टाम्प ड्यूटी ({calculation.stampDutyPercent}%):</span>
                  <span className="block text-[10px] text-slate-400">{calculation.stampDutyFormula}</span>
                </div>
                <span className="font-bold text-white">₹{calculation.stampDutyAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-200">
                <div>
                  <span>अधिभार / सरचार्ज (20%):</span>
                  <span className="block text-[10px] text-slate-400">
                    10% आधारभूत संरचना (₹{calculation.surchargeBreakdown.infraAmount.toLocaleString('en-IN')}) + 10% गो संवर्धन (₹{calculation.surchargeBreakdown.cowAmount.toLocaleString('en-IN')})
                  </span>
                </div>
                <span className="font-bold text-white">₹{calculation.surchargeBreakdown.totalAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-200">
                <div>
                  <span>रजिस्ट्रेशन फीस ({calculation.registrationFeePercent}%):</span>
                  <span className="block text-[10px] text-slate-400">{calculation.registrationFeeNote}</span>
                </div>
                <span className="font-bold text-white">₹{calculation.registrationFeeAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-200">
                <div>
                  <span>स्कैनिंग व कम्प्यूटरीकरण (CSI):</span>
                  <span className="block text-[10px] text-slate-400">कुल {pageCount} पृष्ठों हेतु</span>
                </div>
                <span className="font-bold text-white">₹{calculation.scanningFeeAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-between text-xs font-bold text-emerald-300">
                <span>कुल सरकारी खर्च (Govt Total):</span>
                <span className="text-sm">₹{calculation.totalGovtFees.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Section B: Durga Associates Fees */}
            <div className="space-y-2.5 pt-4 mt-3 border-t border-slate-700">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                <span>(ब) दुर्गा एसोसिएट्स सेवा व विलेख फीस</span>
                <span>राशि</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-200">
                <span>दस्तावेज़ प्रारूपण व वैधानिक टाइपिंग:</span>
                <span className="font-bold text-white">₹{calculation.officeDraftingFee.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-200">
                <span>सब-रजिस्ट्रार पेशी व कंसल्टेंसी:</span>
                <span className="font-bold text-white">₹{calculation.officeServiceFee.toLocaleString('en-IN')}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-amber-950/50 border border-amber-800/60 flex items-center justify-between text-xs font-bold text-amber-300">
                <span>कुल कार्यालय सेवा फीस:</span>
                <span className="text-sm">₹{calculation.totalOfficeFees.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Grand Total */}
            <div className="pt-4 mt-4 border-t-2 border-amber-500/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  कुल खर्च (Grand Total)
                </span>
                <span className="text-[11px] text-amber-400 font-medium">सरकारी चालान + सर्विस फीस</span>
              </div>
              <div className="text-2xl font-black text-amber-400">
                ₹{calculation.grandTotal.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Official Source Reference Tag */}
            <div className="mt-5 pt-3 border-t border-slate-800 text-[10px] text-slate-400 space-y-1">
              <div>
                <strong className="text-slate-300">सरकारी स्रोत: </strong>
                <span>{calculation.appliedRateInfo.officialSource}</span>
              </div>
              <div>
                <strong className="text-slate-300">प्रभावी तारीख: </strong>
                <span>{calculation.appliedRateInfo.effectiveDate}</span>
              </div>
              <div>
                <strong className="text-slate-300">अंतिम अपडेट: </strong>
                <span>{calculation.appliedRateInfo.lastUpdated}</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Printable Quotation Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl relative">
            
            {/* Modal Controls */}
            <div className="no-print flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase">प्रिंट पूर्वावलोकन (Quotation Preview)</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-1.5 rounded-xl bg-[#0B1B3D] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> अभी प्रिंट करें
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer hover:bg-slate-300"
                >
                  बंद करें
                </button>
              </div>
            </div>

            {/* Actual Printable Letterhead Quote */}
            <div className="printable-card border border-slate-300 p-6 rounded-2xl bg-white text-slate-900">
              {/* Header */}
              <div className="text-center pb-4 border-b-2 border-slate-900">
                <h1 className="text-2xl font-black text-[#0B1B3D]">दुर्गा एसोसिएट्स एंड प्रॉपर्टी डीलर</h1>
                <p className="text-xs font-semibold text-slate-700">
                  अजमेर कलेक्ट्रेट एवं सब-रजिस्ट्रार कार्यालय प्रथम व द्वितीय अधिकृत सेवा केंद्र
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  संपर्क: 9829261354, 8003987152 | कलेक्ट्री परिसर के निकट, अजमेर (राजस्थान)
                </p>
                <div className="mt-2 inline-block px-3 py-0.5 rounded bg-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-800 border border-slate-300">
                  रजिस्ट्री व स्टाम्प शुल्क आधिकारिक अनुमान (Official Fee Quotation)
                </div>
              </div>

              {/* Meta */}
              <div className="grid grid-cols-2 gap-4 py-3 border-b border-slate-200 text-xs">
                <div>
                  <p><strong>ग्राहक का नाम:</strong> {clientName || '____________________'}</p>
                  <p className="mt-1"><strong>संपत्ति स्थान:</strong> {propertyLocation || 'अजमेर'}</p>
                  <p className="mt-1"><strong>विलेख प्रकार:</strong> {calculation.docTypeName}</p>
                </div>
                <div className="text-right">
                  <p><strong>दिनांक:</strong> {new Date().toLocaleDateString('hi-IN')}</p>
                  <p className="mt-1"><strong>क्षेत्रफल:</strong> {propertyAreaSqYard} वर्ग गज</p>
                  <p className="mt-1"><strong>डीएलसी दर:</strong> ₹{dlcRatePerSqYard.toLocaleString('en-IN')}/गज</p>
                </div>
              </div>

              {/* Valuation Base */}
              <div className="py-2.5 border-b border-slate-200 text-xs flex justify-between bg-slate-50 px-2 rounded my-2">
                <span>लागू वैधानिक मूल्यांकन आधार (Valuation Base):</span>
                <strong className="text-slate-900">₹{calculation.applicableValuation.toLocaleString('en-IN')}</strong>
              </div>

              {/* Breakdown Table */}
              <div className="space-y-4 my-3 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2">
                    (1) सरकारी शुल्क (Government e-Gras Challan):
                  </h4>
                  <table className="w-full text-left">
                    <tbody>
                      <tr className="border-b border-slate-100">
                        <td className="py-1">स्टाम्प ड्यूटी ({calculation.stampDutyPercent}%)</td>
                        <td className="py-1 text-right font-medium">₹{calculation.stampDutyAmount.toLocaleString('en-IN')}</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-1">अधिभार (10% Infra + 10% Gau Samvardhan)</td>
                        <td className="py-1 text-right font-medium">₹{calculation.surchargeBreakdown.totalAmount.toLocaleString('en-IN')}</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-1">पंजीयन शुल्क (Registration Fee {calculation.registrationFeePercent}%)</td>
                        <td className="py-1 text-right font-medium">₹{calculation.registrationFeeAmount.toLocaleString('en-IN')}</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-1">स्कैनिंग व कम्प्यूटरीकरण शुल्क (CSI Fee)</td>
                        <td className="py-1 text-right font-medium">₹{calculation.scanningFeeAmount.toLocaleString('en-IN')}</td>
                      </tr>
                      <tr className="font-bold bg-slate-100">
                        <td className="py-1 px-1">कुल सरकारी खर्च (A):</td>
                        <td className="py-1 px-1 text-right">₹{calculation.totalGovtFees.toLocaleString('en-IN')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2">
                    (2) दुर्गा एसोसिएट्स सेवा शुल्क (Office Drafting & Filing):
                  </h4>
                  <table className="w-full text-left">
                    <tbody>
                      <tr className="border-b border-slate-100">
                        <td className="py-1">विलेख प्रारूपण, ग्रीन शीट टाइपिंग एवं विधिक प्रमाणीकरण</td>
                        <td className="py-1 text-right font-medium">₹{calculation.officeDraftingFee.toLocaleString('en-IN')}</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-1">सब-रजिस्ट्रार पेशी, अपॉइंटमेंट स्लॉट व दस्तावेज़ प्रक्रिया सेवा</td>
                        <td className="py-1 text-right font-medium">₹{calculation.officeServiceFee.toLocaleString('en-IN')}</td>
                      </tr>
                      <tr className="font-bold bg-slate-100">
                        <td className="py-1 px-1">कुल कार्यालय सेवा फीस (B):</td>
                        <td className="py-1 px-1 text-right">₹{calculation.totalOfficeFees.toLocaleString('en-IN')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between text-sm font-black">
                  <span>कुल अनुमानित खर्च योग (A + B):</span>
                  <span className="text-lg">₹{calculation.grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Signatures */}
              <div className="pt-8 mt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-xs text-center">
                <div>
                  <div className="h-10"></div>
                  <p className="border-t border-slate-400 pt-1 font-semibold">ग्राहक के हस्ताक्षर</p>
                </div>
                <div>
                  <div className="h-10"></div>
                  <p className="border-t border-slate-400 pt-1 font-bold text-[#0B1B3D]">
                    अधिकृत हस्ताक्षरकर्ता<br />
                    दुर्गा एसोसिएट्स, अजमेर
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
