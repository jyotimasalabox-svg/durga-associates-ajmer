import fs from 'fs';
import path from 'path';
import { ClientRecord, LedgerEntry, PublicInquiry, RateRule } from './types';
import { DEFAULT_RATE_RULES } from './defaultRates';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

export interface DatabaseSchema {
  rates: Record<string, RateRule>;
  clients: ClientRecord[];
  ledger: LedgerEntry[];
  inquiries: PublicInquiry[];
  adminAuth: {
    pinHash: string; // Default PIN: 1234 or custom
    lastLogin?: string;
  };
}

// Initial realistic seed data for Durga Associates, Ajmer
const INITIAL_DB: DatabaseSchema = {
  rates: DEFAULT_RATE_RULES,
  clients: [
    {
      id: 'c1',
      caseNumber: 'DA-AJM-2026-001',
      clientName: 'कैलाश चंद्र शर्मा',
      fatherOrHusbandName: 'स्व. श्री रामगोपाल शर्मा',
      phone: '9829261354',
      secondaryPhone: '9414012345',
      email: 'kailash.ajmer@gmail.com',
      address: 'मकान नं. 42, शास्त्री नगर, अजमेर',
      docType: 'sale_deed',
      areaType: 'urban',
      propertyDetails: {
        plotOrKhasraNo: 'प्लॉट सं. 84, खसरा सं. 1120/45',
        colonyOrLocality: 'वैशाली नगर विस्तार (Vaishali Nagar), अजमेर',
        city: 'अजमेर (Ajmer)',
        registrySubRegistrar: 'उप-पंजीयक कार्यालय अजमेर प्रथम (कलेक्ट्री परिसर)',
        areaSqYard: 200,
        dlcRate: 15000,
        dlcTotal: 3000000,
        considerationValue: 3200000,
        boundaries: {
          north: 'प्लॉट नं. 85',
          south: 'प्लॉट नं. 83',
          east: '30 फीट चौड़ा आम रास्ता',
          west: 'अन्य खातेदार की भूमि'
        }
      },
      sellerDetails: {
        name: 'महेंद्र सिंह राठौड़',
        fatherName: 'श्री भंवर सिंह राठौड़',
        address: 'ग्राम कोटड़ा, निकट पुष्कर रोड, अजमेर',
        phone: '9828112233',
        aadhaarOrPan: 'XXXX-XXXX-8921'
      },
      buyerDetails: {
        name: 'कैलाश चंद्र शर्मा',
        fatherName: 'स्व. श्री रामगोपाल शर्मा',
        address: 'मकान नं. 42, शास्त्री नगर, अजमेर',
        phone: '9829261354',
        gender: 'male',
        aadhaarOrPan: 'XXXX-XXXX-4512'
      },
      paymentChequeDetails: {
        chequeNo: 'SBI-RTGS-59483201',
        bankName: 'भारतीय स्टेट बैंक, मुख्य शाखा अजमेर',
        date: '28-10-2026',
        amount: 3200000
      },
      status: 'challan_generated',
      fees: {
        govtStamp: 192000,
        govtSurcharge: 38400,
        govtReg: 32000,
        govtScanning: 300,
        totalGovt: 262700,
        officeDrafting: 3500,
        officeService: 2500,
        totalOffice: 6000,
        grandTotal: 268700,
        paidAmount: 150000,
        balanceAmount: 118700,
        paymentMode: 'bank_transfer',
        paymentStatus: 'partial'
      },
      registryDate: '02-11-2026',
      notes: 'ई-स्टाम्प चालान e-Gras पर जनरेट हो चुका है। सब-रजिस्ट्रार ऑफिस अजमेर प्रथम में 2 नवंबर सुबह 11:30 बजे की ऑनलाइन स्लॉट बुकिंग है।',
      createdAt: '2026-10-25T10:30:00Z',
      updatedAt: '2026-10-28T14:15:00Z'
    },
    {
      id: 'c2',
      caseNumber: 'DA-AJM-2026-002',
      clientName: 'श्रीमती सुनीता देवी अग्रवाल',
      fatherOrHusbandName: 'श्री दिनेश कुमार अग्रवाल',
      phone: '8003987152',
      address: 'मदार गेट, नया बाजार, अजमेर',
      docType: 'gift_deed_family',
      areaType: 'urban',
      propertyDetails: {
        plotOrKhasraNo: 'दुकान सं. 12, भूतल',
        colonyOrLocality: 'आगरा गेट रोड, अजमेर',
        city: 'अजमेर',
        registrySubRegistrar: 'उप-पंजीयक कार्यालय अजमेर द्वितीय',
        areaSqYard: 35,
        dlcRate: 40000,
        dlcTotal: 1400000,
        considerationValue: 1400000,
        boundaries: {
          north: 'दुकान सं. 11',
          south: 'दुकान सं. 13',
          east: 'मुख्य बाजार सड़क',
          west: 'गली'
        }
      },
      sellerDetails: {
        name: 'श्री दिनेश कुमार अग्रवाल (पति)',
        fatherName: 'स्व. श्री मदनलाल अग्रवाल',
        address: 'मदार गेट, नया बाजार, अजमेर',
        phone: '9414234567',
        aadhaarOrPan: 'XXXX-XXXX-1122'
      },
      buyerDetails: {
        name: 'श्रीमती सुनीता देवी अग्रवाल (पत्नी)',
        fatherName: 'श्री दिनेश कुमार अग्रवाल',
        address: 'मदार गेट, नया बाजार, अजमेर',
        phone: '8003987152',
        gender: 'female',
        aadhaarOrPan: 'XXXX-XXXX-9988'
      },
      status: 'draft_ready',
      fees: {
        govtStamp: 14000,
        govtSurcharge: 2800,
        govtReg: 14000,
        govtScanning: 300,
        totalGovt: 31100,
        officeDrafting: 3000,
        officeService: 2000,
        totalOffice: 5000,
        grandTotal: 36100,
        paidAmount: 36100,
        balanceAmount: 0,
        paymentMode: 'upi',
        paymentStatus: 'paid'
      },
      registryDate: '04-11-2026',
      notes: 'पति द्वारा पत्नी के पक्ष में प्रेमवश दान। पारिवारिक छूट 1% स्टाम्प दर लागू। पूर्ण भुगतान प्राप्त।',
      createdAt: '2026-10-27T11:00:00Z',
      updatedAt: '2026-10-29T16:00:00Z'
    },
    {
      id: 'c3',
      caseNumber: 'DA-AJM-2026-003',
      clientName: 'सुरेश कुमार जाट व रामप्रसाद जाट',
      fatherOrHusbandName: 'स्व. श्री हरदेव जाट',
      phone: '9829261354',
      address: 'ग्राम गेगल, जयपुर रोड, अजमेर',
      docType: 'release_deed',
      areaType: 'rural',
      propertyDetails: {
        plotOrKhasraNo: 'खसरा सं. 512/82',
        colonyOrLocality: 'ग्राम पंचायत गेगल, अजमेर',
        city: 'अजमेर (ग्रामीण)',
        registrySubRegistrar: 'उप-पंजीयक कार्यालय अजमेर द्वितीय',
        areaSqYard: 1200,
        dlcRate: 1800,
        dlcTotal: 2160000,
        considerationValue: 0,
        boundaries: {
          north: 'गोचर भूमि',
          south: 'सड़क 40 फीट',
          east: 'खसरा सं. 511',
          west: 'खसरा सं. 513'
        }
      },
      status: 'docs_collection',
      fees: {
        govtStamp: 2000,
        govtSurcharge: 400,
        govtReg: 500,
        govtScanning: 300,
        totalGovt: 3200,
        officeDrafting: 2500,
        officeService: 1500,
        totalOffice: 4000,
        grandTotal: 7200,
        paidAmount: 3000,
        balanceAmount: 4200,
        paymentMode: 'cash',
        paymentStatus: 'partial'
      },
      notes: 'सह-खातेदारों के मध्य पैतृक भूमि का आपसी हकत्याग विलेख। पटवारी रिपोर्ट व जमाबंदी संलग्न की जा रही है।',
      createdAt: '2026-10-28T09:30:00Z',
      updatedAt: '2026-10-28T09:30:00Z'
    }
  ],
  ledger: [
    {
      id: 'led-1',
      date: '2026-10-28',
      type: 'income',
      category: 'client_fee',
      amount: 150000,
      clientName: 'कैलाश चंद्र शर्मा',
      caseNumber: 'DA-AJM-2026-001',
      paymentMode: 'bank_transfer',
      description: 'रजिस्ट्री ई-स्टाम्प अग्रिम एवं कार्यालय फीस',
      receiptNumber: 'DA-REC-1082',
      createdAt: '2026-10-28T14:20:00Z'
    },
    {
      id: 'led-2',
      date: '2026-10-29',
      type: 'income',
      category: 'client_fee',
      amount: 36100,
      clientName: 'श्रीमती सुनीता देवी अग्रवाल',
      caseNumber: 'DA-AJM-2026-002',
      paymentMode: 'upi',
      description: 'गिफ्ट डीड सरकारी शुल्क एवं कार्यालय सेवा शुल्क पूर्ण',
      receiptNumber: 'DA-REC-1083',
      createdAt: '2026-10-29T16:05:00Z'
    },
    {
      id: 'led-3',
      date: '2026-10-29',
      type: 'expense',
      category: 'stamp_vendor',
      amount: 600,
      paymentMode: 'cash',
      description: 'स्टाम्प पेपर, फिजिकल एग्रीमेंट पेपर्स एवं कोर्ट फीस टिकट',
      receiptNumber: 'EXP-401',
      createdAt: '2026-10-29T17:00:00Z'
    },
    {
      id: 'led-4',
      date: '2026-10-29',
      type: 'expense',
      category: 'stationery_typing',
      amount: 450,
      paymentMode: 'cash',
      description: 'दस्तावेज ग्रीन शीट प्रिंटिंग, बाइंडिंग एवं कलेक्ट्रेट कूरियर',
      receiptNumber: 'EXP-402',
      createdAt: '2026-10-29T18:00:00Z'
    }
  ],
  inquiries: [
    {
      id: 'inq-1',
      fullName: 'राजेश जांगिड़',
      phone: '9828554433',
      email: 'rajesh.ajmer@gmail.com',
      serviceType: 'प्लॉट रजिस्ट्री (Sale Deed)',
      propertyLocation: 'पंचशील नगर, अजमेर',
      preferredDate: '2026-11-05',
      message: 'मैंने पंचशील बी-ब्लॉक में 150 गज का प्लॉट खरीदा है। डीएलसी दर और कुल रजिस्ट्री खर्चे का विवरण चाहिए।',
      status: 'new',
      createdAt: '2026-10-29T18:45:00Z'
    },
    {
      id: 'inq-2',
      fullName: 'गोविंद सिंह सोलंकी',
      phone: '9414667788',
      serviceType: 'हकत्याग पत्र (Release Deed)',
      propertyLocation: 'आदर्श नगर, अजमेर',
      preferredDate: '2026-11-06',
      message: 'पैतृक मकान में दो भाइयों का आपसी हकत्याग कराना है। क्या-क्या कागजात लगेंगे और कितना समय लगेगा?',
      status: 'contacted',
      createdAt: '2026-10-28T12:10:00Z'
    }
  ],
  adminAuth: {
    pinHash: '1234' // Default quick pin, can be changed in settings
  }
};

// Smart Cloud/Vercel support: On Vercel serverless, root fs is read-only.
// We use /tmp or memory fallback so API operations never fail.
const IS_SERVERLESS = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const TARGET_DIR = IS_SERVERLESS ? path.join('/tmp', 'property_data') : DATA_DIR;
const TARGET_FILE = path.join(TARGET_DIR, 'db.json');

let memoryDb: DatabaseSchema | null = null;

function ensureDbFile() {
  try {
    if (!fs.existsSync(TARGET_DIR)) {
      fs.mkdirSync(TARGET_DIR, { recursive: true });
    }
    if (!fs.existsSync(TARGET_FILE)) {
      // If original data/db.json exists in bundle, copy from it
      if (fs.existsSync(DB_FILE)) {
        const seedData = fs.readFileSync(DB_FILE, 'utf-8');
        fs.writeFileSync(TARGET_FILE, seedData, 'utf-8');
      } else {
        fs.writeFileSync(TARGET_FILE, JSON.stringify(INITIAL_DB, null, 2), 'utf-8');
      }
    }
  } catch (err) {
    console.warn('Filesystem access limited, using in-memory store:', err);
  }
}

export function getDb(): DatabaseSchema {
  if (memoryDb) {
    return memoryDb;
  }
  try {
    ensureDbFile();
    if (fs.existsSync(TARGET_FILE)) {
      const data = fs.readFileSync(TARGET_FILE, 'utf-8');
      memoryDb = JSON.parse(data) as DatabaseSchema;
      return memoryDb;
    }
  } catch (err) {
    console.error('Error reading db:', err);
  }

  // Fallback to initial DB
  memoryDb = JSON.parse(JSON.stringify(INITIAL_DB));
  return memoryDb!;
}

export function saveDb(data: DatabaseSchema): boolean {
  memoryDb = data;
  try {
    ensureDbFile();
    fs.writeFileSync(TARGET_FILE, JSON.stringify(data, null, 2), 'utf-8');
    // Also update local data/db.json if not in serverless
    if (!IS_SERVERLESS && TARGET_FILE !== DB_FILE && fs.existsSync(DATA_DIR)) {
      try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
      } catch {}
    }
    return true;
  } catch (err) {
    console.warn('Error persisting db to disk (in-memory preserved):', err);
    return true;
  }
}
