import { NextResponse } from 'next/server';
import { getDbItems, addDbItem } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const category = searchParams.get('category') || 'all';
    const location = searchParams.get('location') || 'all';
    const type = searchParams.get('type') || 'all';
    const status = searchParams.get('status') || 'all';

    let items = await getDbItems();

    if (search) {
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(search) ||
          item.englishTitle?.toLowerCase().includes(search) ||
          item.description.toLowerCase().includes(search) ||
          item.location.toLowerCase().includes(search)
      );
    }

    if (category && category !== 'all') {
      items = items.filter((item) => item.category === category);
    }

    if (location && location !== 'all') {
      items = items.filter((item) => item.location.includes(location));
    }

    if (type && type !== 'all') {
      items = items.filter((item) => item.type === type);
    }

    if (status && status !== 'all') {
      items = items.filter((item) => item.status === status);
    }

    return NextResponse.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการโหลดข้อมูล', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.title || !body.category || !body.location) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกข้อมูลสำคัญให้ครบถ้วน (ชื่อสิ่งของ, หมวดหมู่, สถานที่)' },
        { status: 400 }
      );
    }

    const newItem = await addDbItem(body);

    return NextResponse.json(
      {
        success: true,
        message: 'บันทึกรายการแจ้งสิ่งของลงฐานข้อมูล TiDB สำเร็จ',
        data: newItem,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล', error: error.message },
      { status: 500 }
    );
  }
}
