import { NextResponse } from 'next/server';
import { getDbItems } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const items = await getDbItems();
    const total = items.length;
    const lookingForOwner = items.filter((i) => i.status === 'LOOKING_FOR_OWNER').length;
    const foundItems = items.filter((i) => i.status === 'FOUND_ITEM').length;
    const returnedItems = items.filter((i) => i.status === 'RETURNED').length;

    const returnRate = total > 0 ? Math.round((returnedItems / total) * 100) : 0;

    return NextResponse.json({
      success: true,
      data: {
        total,
        lookingForOwner,
        foundItems,
        returnedItems,
        returnRate,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการคำนวณสถิติ', error: error.message },
      { status: 500 }
    );
  }
}
