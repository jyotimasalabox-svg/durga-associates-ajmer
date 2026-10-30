import { CalculationInput, CalculationResult, RateRule } from './types';
import { DEFAULT_RATE_RULES } from './defaultRates';

export function calculateRegistrationCost(
  input: CalculationInput,
  customRules?: Record<string, RateRule>
): CalculationResult {
  const rules = customRules || DEFAULT_RATE_RULES;
  const rule = rules[input.docType] || DEFAULT_RATE_RULES.sale_deed;

  // 1. Calculate DLC valuation
  const dlcValuation = Math.round(input.dlcRatePerSqYard * input.propertyAreaSqYard);
  const considerationValuation = Math.round(input.considerationValue || 0);

  // 2. Determine Applicable Valuation base (Higher of DLC or Consideration)
  let applicableValuation = 0;
  let valuationNote = '';

  if (rule.isFlatStamp && rule.isFlatRegFee) {
    applicableValuation = Math.max(dlcValuation, considerationValuation) || 0;
    valuationNote = 'नियत वैधानिक शुल्क विलेख (फ्लैट दर लागू)';
  } else {
    if (dlcValuation >= considerationValuation) {
      applicableValuation = dlcValuation;
      valuationNote = dlcValuation > 0 && considerationValuation > 0
        ? `राजस्थान ई-पंजीयन नियमानुसार: डीएलसी मूल्यांकन (₹${dlcValuation.toLocaleString('en-IN')}) दर्ज विक्रय मूल्य (₹${considerationValuation.toLocaleString('en-IN')}) से अधिक होने के कारण गणना का आधार माना गया।`
        : `डीएलसी मूल्यांकन (₹${dlcValuation.toLocaleString('en-IN')}) के आधार पर।`;
    } else {
      applicableValuation = considerationValuation;
      valuationNote = `राजस्थान ई-पंजीयन नियमानुसार: दस्तावेज़ में दर्शाया गया मूल्य (₹${considerationValuation.toLocaleString('en-IN')}) डीएलसी दर से अधिक होने के कारण वास्तविक प्रतिफल को गणना का आधार माना गया।`;
    }
  }

  // 3. Stamp Duty calculation
  let stampDutyPercent = 0;
  let stampDutyAmount = 0;
  let stampDutyFormula = '';

  if (rule.isFlatStamp) {
    stampDutyAmount = rule.fixedStampAmount || 0;
    stampDutyPercent = 0;
    stampDutyFormula = `नियत स्टाम्प शुल्क: ₹${stampDutyAmount.toLocaleString('en-IN')}`;
  } else {
    // Select percentage based on area & buyer gender/category
    if (input.areaType === 'urban') {
      if (input.buyerGender === 'female') {
        stampDutyPercent = rule.urbanFemaleStampPercent;
      } else if (input.buyerGender === 'joint') {
        stampDutyPercent = rule.urbanJointStampPercent;
      } else {
        stampDutyPercent = rule.urbanMaleStampPercent;
      }
    } else {
      // Rural
      if (input.buyerGender === 'female') {
        stampDutyPercent = rule.ruralFemaleStampPercent;
      } else if (input.buyerGender === 'joint') {
        stampDutyPercent = rule.ruralJointStampPercent;
      } else {
        stampDutyPercent = rule.ruralMaleStampPercent;
      }
    }

    stampDutyAmount = Math.round((applicableValuation * stampDutyPercent) / 100);
    stampDutyFormula = `${stampDutyPercent}% of ₹${applicableValuation.toLocaleString('en-IN')}`;
  }

  // 4. Surcharges (Rajasthan: 10% Infra + 10% Gau Samvardhan = 20% on Stamp Duty)
  let infraPercent = 0;
  let infraAmount = 0;
  let cowPercent = 0;
  let cowAmount = 0;

  if (stampDutyAmount > 0 && rule.surchargePercent > 0) {
    infraPercent = rule.infraSurchargePercent || 10;
    cowPercent = rule.cowSurchargePercent || 10;

    infraAmount = Math.round((stampDutyAmount * infraPercent) / 100);
    cowAmount = Math.round((stampDutyAmount * cowPercent) / 100);
  }

  const totalSurchargeAmount = infraAmount + cowAmount;

  // 5. Registration Fee
  let registrationFeePercent = 0;
  let registrationFeeAmount = 0;
  let registrationFeeNote = '';

  if (rule.isFlatRegFee) {
    registrationFeeAmount = rule.fixedRegFeeAmount || 0;
    registrationFeeNote = `नियत पंजीकरण शुल्क: ₹${registrationFeeAmount.toLocaleString('en-IN')}`;
  } else {
    registrationFeePercent = rule.registrationFeePercent || 1.0;
    let rawReg = (applicableValuation * registrationFeePercent) / 100;

    if (rule.maxRegistrationFee && rawReg > rule.maxRegistrationFee) {
      registrationFeeAmount = rule.maxRegistrationFee;
      registrationFeeNote = `नियम सीमा (अधिकतम कैप) लागू: ₹${rule.maxRegistrationFee.toLocaleString('en-IN')}`;
    } else if (rule.minRegistrationFee && rawReg < rule.minRegistrationFee) {
      registrationFeeAmount = rule.minRegistrationFee;
      registrationFeeNote = `न्यूनतम पंजीयन शुल्क लागू: ₹${rule.minRegistrationFee.toLocaleString('en-IN')}`;
    } else {
      registrationFeeAmount = Math.round(rawReg);
      registrationFeeNote = `${registrationFeePercent}% of ₹${applicableValuation.toLocaleString('en-IN')}`;
    }
  }

  // 6. Scanning / CSI Fee
  let scanningFeeAmount = rule.flatScanningFee || 300;
  const extraPages = Math.max(0, (input.pageCount || rule.standardPageCount) - rule.standardPageCount);
  if (extraPages > 0) {
    scanningFeeAmount += extraPages * (rule.scanningFeePerPage || 50);
  }

  // 7. Total Govt Fees
  const totalGovtFees = stampDutyAmount + totalSurchargeAmount + registrationFeeAmount + scanningFeeAmount;

  // 8. Durga Associates Office Fees
  const officeDraftingFee = Math.max(0, Number(input.draftingFee) || 0);
  const officeServiceFee = Math.max(0, Number(input.serviceFee) || 0);
  const totalOfficeFees = officeDraftingFee + officeServiceFee;

  // 9. Grand Total
  const grandTotal = totalGovtFees + totalOfficeFees;

  // Formatting labels
  const areaTypeName = input.areaType === 'urban' ? 'शहरी क्षेत्र (Urban / ADA / नगर निगम)' : 'ग्रामीण क्षेत्र (Rural / पंचायती राज)';
  const buyerCategoryName = 
    input.buyerGender === 'female' ? 'महिला क्रेता (Female - 1% सरकारी छूट)' :
    input.buyerGender === 'joint' ? 'संयुक्त क्रेता (महिला + पुरुष - 0.5% सरकारी छूट)' :
    input.buyerGender === 'senior' ? 'वरिष्ठ नागरिक (Senior Citizen)' :
    input.buyerGender === 'sc_st' ? 'एससी/एसटी श्रेणी' :
    'सामान्य पुरुष (Male Buyer)';

  return {
    docTypeName: rule.nameHindi,
    areaTypeName,
    buyerCategoryName,
    dlcValuation,
    considerationValuation,
    applicableValuation,
    valuationNote,
    stampDutyPercent,
    stampDutyAmount,
    stampDutyFormula,
    surchargeBreakdown: {
      infraPercent,
      infraAmount,
      cowPercent,
      cowAmount,
      totalPercent: infraPercent + cowPercent,
      totalAmount: totalSurchargeAmount,
    },
    registrationFeePercent,
    registrationFeeAmount,
    registrationFeeNote,
    scanningFeeAmount,
    totalGovtFees,
    officeDraftingFee,
    officeServiceFee,
    totalOfficeFees,
    grandTotal,
    appliedRateInfo: {
      effectiveDate: rule.effectiveDate,
      officialSource: rule.officialSource,
      lastUpdated: rule.lastUpdated,
      notesHindi: rule.notesHindi,
    }
  };
}
