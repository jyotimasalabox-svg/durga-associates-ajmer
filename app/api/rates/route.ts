import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { RateRule } from '@/lib/types';

export async function GET() {
  const db = getDb();
  return NextResponse.json({ success: true, rates: db.rates });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rateRule }: { rateRule: RateRule } = body;
    if (!rateRule || !rateRule.id) {
      return NextResponse.json({ success: false, error: 'अमान्य दर डेटा' }, { status: 400 });
    }

    const db = getDb();
    db.rates[rateRule.id] = {
      ...rateRule,
      lastUpdated: new Date().toLocaleDateString('hi-IN') + ' (Admin द्वारा अपडेट किया गया)'
    };
    saveDb(db);

    return NextResponse.json({ success: true, message: 'दर सफलतापूर्वक अपडेट हो गई', rates: db.rates });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'सर्वर त्रुटि' }, { status: 500 });
  }
}
