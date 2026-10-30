import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { SaleProperty } from '@/lib/types';
import { DEFAULT_SALE_PROPERTIES } from '@/lib/defaultProperties';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = getDb();
  const properties = db.properties || DEFAULT_SALE_PROPERTIES;
  return NextResponse.json({
    success: true,
    properties,
    totalCount: properties.length
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Reset to photo default properties
    if (body.action === 'reset_defaults') {
      const db = getDb();
      db.properties = JSON.parse(JSON.stringify(DEFAULT_SALE_PROPERTIES));
      saveDb(db);
      return NextResponse.json({
        success: true,
        message: 'सभी 10 बिकाऊ संपत्तियों की मूल फोटो सूची सफलतापूर्वक पुनर्स्थापित कर दी गई है।',
        properties: db.properties
      });
    }

    const {
      title,
      location,
      areaSqYard,
      propertyType,
      propertyTypeLabel,
      features,
      isNewUpdate,
      priceEstimate,
      contactPhones,
      notes,
      serialNo
    } = body;

    if (!title || !areaSqYard) {
      return NextResponse.json(
        { success: false, error: 'कृपया संपत्ति का स्थान/विवरण एवं वर्गगज दर्ज करें' },
        { status: 400 }
      );
    }

    const db = getDb();
    const currentList = db.properties || [];

    // Calculate serial number
    const maxSerial = currentList.length > 0 
      ? Math.max(...currentList.map(p => Number(p.serialNo) || 0))
      : 0;
    const finalSerial = serialNo ? Number(serialNo) : maxSerial + 1;

    const newProperty: SaleProperty = {
      id: 'prop_' + Date.now(),
      serialNo: finalSerial,
      title: String(title).trim(),
      location: location ? String(location).trim() : 'अजमेर',
      areaSqYard: String(areaSqYard).trim(),
      propertyType: propertyType || 'plot',
      propertyTypeLabel: propertyTypeLabel || (propertyType === 'house' ? 'मकान' : 'प्लाट'),
      features: Array.isArray(features) ? features : [],
      isNewUpdate: Boolean(isNewUpdate),
      status: 'available',
      priceEstimate: priceEstimate ? String(priceEstimate).trim() : 'उचित मूल्य (सम्पर्क करें)',
      contactPhones: Array.isArray(contactPhones) && contactPhones.length > 0
        ? contactPhones
        : ['8003987152', '9829261354'],
      notes: notes ? String(notes).trim() : '',
      createdAt: new Date().toISOString()
    };

    db.properties = [...currentList, newProperty];
    saveDb(db);

    return NextResponse.json({
      success: true,
      message: 'नई बिकाऊ संपत्ति सफलतापूर्वक वेबसाइट पर जोड़ी गई',
      property: newProperty,
      properties: db.properties
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'सर्वर त्रुटि' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'प्रॉपर्टी आईडी आवश्यक है' }, { status: 400 });
    }

    const db = getDb();
    const propIndex = (db.properties || []).findIndex(p => p.id === id);

    if (propIndex === -1) {
      return NextResponse.json({ success: false, error: 'प्रॉपर्टी नहीं मिली' }, { status: 404 });
    }

    const currentProp = db.properties[propIndex];
    const updatedProp: SaleProperty = {
      ...currentProp,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    db.properties[propIndex] = updatedProp;
    saveDb(db);

    return NextResponse.json({
      success: true,
      message: 'प्रॉपर्टी विवरण सफलतापूर्वक अपडेट कर दिया गया',
      property: updatedProp,
      properties: db.properties
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'सर्वर त्रुटि' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'प्रॉपर्टी आईडी आवश्यक है' }, { status: 400 });
    }

    const db = getDb();
    const currentList = db.properties || [];
    const filtered = currentList.filter(p => p.id !== id);

    if (filtered.length === currentList.length) {
      return NextResponse.json({ success: false, error: 'प्रॉपर्टी नहीं मिली' }, { status: 404 });
    }

    db.properties = filtered;
    saveDb(db);

    return NextResponse.json({
      success: true,
      message: 'प्रॉपर्टी सफलतापूर्वक हटा दी गई',
      properties: db.properties
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'सर्वर त्रुटि' }, { status: 500 });
  }
}
