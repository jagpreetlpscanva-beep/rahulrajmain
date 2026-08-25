import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const db = await getDb();
    const gemstones = await db.collection('gemstones').find({}).toArray();
    return NextResponse.json(gemstones);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch gemstones' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, name, prices, active } = body;

    if (!name || !Array.isArray(prices)) {
      return NextResponse.json({ error: 'Name and prices array are required' }, { status: 400 });
    }

    const gemId = id || name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const db = await getDb();

    await db.collection('gemstones').updateOne(
      { id: gemId },
      {
        $set: {
          id: gemId,
          name,
          prices,
          active: active !== undefined ? active : true,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, id: gemId });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save gemstone' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Gemstone ID required' }, { status: 400 });
    }

    const db = await getDb();
    await db.collection('gemstones').deleteOne({ id });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete gemstone' }, { status: 500 });
  }
}
