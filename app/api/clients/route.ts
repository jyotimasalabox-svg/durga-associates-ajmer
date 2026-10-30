import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { ClientRecord } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = getDb();
  return NextResponse.json({ success: true, clients: db.clients || [] });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newClient: ClientRecord = body;
    
    if (!newClient.clientName || !newClient.phone) {
      return NextResponse.json({ success: false, error: 'ग्राहक का नाम और मोबाइल नंबर आवश्यक है' }, { status: 400 });
    }

    const db = getDb();
    if (!newClient.id) {
      newClient.id = 'c_' + Date.now();
    }
    if (!newClient.caseNumber) {
      const count = (db.clients?.length || 0) + 1;
      newClient.caseNumber = `DA-AJM-${new Date().getFullYear()}-${String(count).padStart(3, '0')}`;
    }
    newClient.createdAt = new Date().toISOString();
    newClient.updatedAt = new Date().toISOString();

    db.clients = [newClient, ...(db.clients || [])];
    saveDb(db);

    return NextResponse.json({ success: true, client: newClient, message: 'ग्राहक रिकॉर्ड सफलतापूर्वक सहेजा गया' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'सर्वर त्रुटि' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const updatedClient: ClientRecord = body;

    const db = getDb();
    const index = db.clients.findIndex(c => c.id === updatedClient.id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'रिकॉर्ड नहीं मिला' }, { status: 404 });
    }

    updatedClient.updatedAt = new Date().toISOString();
    db.clients[index] = updatedClient;
    saveDb(db);

    return NextResponse.json({ success: true, client: updatedClient, message: 'रिकॉर्ड सफलतापूर्वक अपडेट हुआ' });
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
    db.clients = db.clients.filter(c => c.id !== id);
    saveDb(db);

    return NextResponse.json({ success: true, message: 'रिकॉर्ड हटा दिया गया' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'सर्वर त्रुटि' }, { status: 500 });
  }
}
