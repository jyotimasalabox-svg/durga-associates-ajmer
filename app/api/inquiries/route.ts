import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { PublicInquiry } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = getDb();
  return NextResponse.json({ success: true, inquiries: db.inquiries || [] });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, phone, email, serviceType, propertyLocation, preferredDate, message } = body;

    if (!fullName || !phone) {
      return NextResponse.json({ success: false, error: 'कृपया नाम और मोबाइल नंबर दर्ज करें' }, { status: 400 });
    }

    const db = getDb();
    const newInquiry: PublicInquiry = {
      id: 'inq_' + Date.now(),
      fullName: String(fullName).trim(),
      phone: String(phone).trim(),
      email: email ? String(email).trim() : undefined,
      serviceType: serviceType || 'सामान्य रजिस्ट्री पूछताछ',
      propertyLocation: propertyLocation || 'अजमेर',
      preferredDate: preferredDate || undefined,
      message: message || '',
      status: 'new',
      createdAt: new Date().toISOString()
    };

    db.inquiries = [newInquiry, ...(db.inquiries || [])];
    saveDb(db);

    return NextResponse.json({
      success: true,
      message: 'आपकी पूछताछ एवं अपॉइंटमेंट अनुरोध सफलतापूर्वक प्राप्त हो गया है। दुर्गा एसोसिएट्स टीम शीघ्र आपसे संपर्क करेगी।'
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'सर्वर त्रुटि' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    const db = getDb();
    const inq = db.inquiries.find(i => i.id === id);
    if (!inq) {
      return NextResponse.json({ success: false, error: 'पूछताछ नहीं मिली' }, { status: 404 });
    }

    inq.status = status;
    saveDb(db);

    return NextResponse.json({ success: true, message: 'स्टेटस अपडेट हुआ' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'सर्वर त्रुटि' }, { status: 500 });
  }
}
