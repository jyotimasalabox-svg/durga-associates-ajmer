export type DocTypeKey = 
  | 'sale_deed'
  | 'gift_deed_family'
  | 'gift_deed_other'
  | 'release_deed'
  | 'partition_deed'
  | 'lease_deed'
  | 'agreement_to_sell_possession'
  | 'agreement_to_sell_no_possession'
  | 'poa_sale'
  | 'poa_general'
  | 'will'
  | 'mortgage';

export type BuyerCategory = 'male' | 'female' | 'joint' | 'senior' | 'sc_st';
export type AreaType = 'urban' | 'rural';

export interface RateRule {
  id: DocTypeKey;
  nameHindi: string;
  nameEnglish: string;
  descriptionHindi: string;
  urbanMaleStampPercent: number;
  urbanFemaleStampPercent: number;
  urbanJointStampPercent: number;
  ruralMaleStampPercent: number;
  ruralFemaleStampPercent: number;
  ruralJointStampPercent: number;
  fixedStampAmount?: number; // e.g. for nominal flat cases
  isFlatStamp?: boolean;
  surchargePercent: number; // usually 20% (10% Infra + 10% Gau Samvardhan)
  infraSurchargePercent: number; // 10%
  cowSurchargePercent: number; // 10%
  registrationFeePercent: number; // usually 1%
  isFlatRegFee?: boolean;
  fixedRegFeeAmount?: number;
  maxRegistrationFee?: number; // Cap if applicable
  minRegistrationFee?: number;
  scanningFeePerPage: number;
  standardPageCount: number;
  flatScanningFee: number;
  effectiveDate: string;
  officialSource: string;
  lastUpdated: string;
  notesHindi: string;
}

export interface CalculationInput {
  docType: DocTypeKey;
  areaType: AreaType;
  buyerGender: BuyerCategory;
  considerationValue: number; // दस्तावेज़ में दर्शाया गया मूल्य
  dlcRatePerSqYard: number; // प्रति वर्ग गज/मीटर दर
  propertyAreaSqYard: number; // कुल क्षेत्रफल
  isBloodRelative: boolean;
  relationshipType?: string;
  leaseYears?: number;
  annualRent?: number;
  pageCount: number;
  draftingFee: number; // दुर्गा एसोसिएट्स दस्तावेज़ तैयार करने की फीस
  serviceFee: number; // दुर्गा एसोसिएट्स सर्विस व फाइल प्रोसेसिंग फीस
}

export interface CalculationResult {
  docTypeName: string;
  areaTypeName: string;
  buyerCategoryName: string;
  dlcValuation: number;
  considerationValuation: number;
  applicableValuation: number;
  valuationNote: string;
  stampDutyPercent: number;
  stampDutyAmount: number;
  stampDutyFormula: string;
  surchargeBreakdown: {
    infraPercent: number;
    infraAmount: number;
    cowPercent: number;
    cowAmount: number;
    totalPercent: number;
    totalAmount: number;
  };
  registrationFeePercent: number;
  registrationFeeAmount: number;
  registrationFeeNote: string;
  scanningFeeAmount: number;
  totalGovtFees: number;
  officeDraftingFee: number;
  officeServiceFee: number;
  totalOfficeFees: number;
  grandTotal: number;
  appliedRateInfo: {
    effectiveDate: string;
    officialSource: string;
    lastUpdated: string;
    notesHindi: string;
  };
}

export type CaseStatus = 
  | 'inquiry'
  | 'docs_collection'
  | 'draft_ready'
  | 'challan_generated'
  | 'registry_scheduled'
  | 'completed'
  | 'cancelled';

export interface ClientRecord {
  id: string;
  caseNumber: string;
  clientName: string;
  fatherOrHusbandName: string;
  phone: string;
  secondaryPhone?: string;
  email?: string;
  address: string;
  docType: DocTypeKey;
  areaType: AreaType;
  propertyDetails: {
    plotOrKhasraNo: string;
    colonyOrLocality: string;
    city: string; // e.g. "अजमेर"
    registrySubRegistrar: string; // "अजमेर प्रथम" / "अजमेर द्वितीय" / "किशनगढ़" / "पुष्कर"
    areaSqYard: number;
    dlcRate: number;
    dlcTotal: number;
    considerationValue: number;
    boundaries: {
      north: string;
      south: string;
      east: string;
      west: string;
    };
  };
  sellerDetails?: {
    name: string;
    fatherName: string;
    address: string;
    phone: string;
    aadhaarOrPan: string;
  };
  buyerDetails?: {
    name: string;
    fatherName: string;
    address: string;
    phone: string;
    gender: 'male' | 'female' | 'joint';
    aadhaarOrPan: string;
  };
  paymentChequeDetails?: {
    chequeNo: string;
    bankName: string;
    date: string;
    amount: number;
  };
  status: CaseStatus;
  fees: {
    govtStamp: number;
    govtSurcharge: number;
    govtReg: number;
    govtScanning: number;
    totalGovt: number;
    officeDrafting: number;
    officeService: number;
    totalOffice: number;
    grandTotal: number;
    paidAmount: number;
    balanceAmount: number;
    paymentMode: 'cash' | 'upi' | 'bank_transfer' | 'cheque';
    paymentStatus: 'unpaid' | 'partial' | 'paid';
  };
  registryDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LedgerEntry {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: 
    | 'client_fee'
    | 'drafting_fee'
    | 'stamp_vendor'
    | 'stationery_typing'
    | 'sub_registrar_misc'
    | 'fuel_travel'
    | 'office_tea_misc'
    | 'other';
  amount: number;
  clientName?: string;
  caseNumber?: string;
  paymentMode: 'cash' | 'upi' | 'bank_transfer' | 'cheque';
  description: string;
  receiptNumber?: string;
  createdAt: string;
}

export interface PublicInquiry {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  serviceType: string;
  propertyLocation: string;
  preferredDate?: string;
  message: string;
  status: 'new' | 'contacted' | 'converted' | 'closed';
  createdAt: string;
}
