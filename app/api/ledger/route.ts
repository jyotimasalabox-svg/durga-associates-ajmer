import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { LedgerEntry } from '@/lib/types';

export async function GET() {
  const db = getDb();
  return NextResponse.json({ success: true, ledger: db.ledger || [] });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const entry: LedgerEntry = body;

    if (!entry.amount || !entry.description) {
      return NextResponse.json({ success: false, error: 'रकम और विवरण आवश्यक हैं' }, { status: 400 });
    }

    const db = getDb();
    if (!entry.id) {
      entry.id = 'led_' + Date.now();
    }
    if (!entry.receiptNumber && entry.type === 'income') {
      entry.receiptNumber = `DA-REC-${Math.floor(1000 + Math.random() * 9000)}`;
    }
    entry.createdAt = new Date().toISOString();

    db.ledger = [entry, ...(db.ledger || [])];
    saveDb(db);

    return NextResponse.json({ success: true, entry, message: 'लेजर प्रविष्टि सहेजी गई' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'सर्वर त्रुटि' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID आवश्यक है' }, { status: 400 });
    }

    const db = getDb();
    db.ledger = db.ledger.filter(l => l.id !== id);
    saveDb(db);

    return NextResponse.json({ success: true, message: 'प्रविष्टि हटा दी गई' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'सर्वर त्रुटि' }, { status: 500 });
  }
}
